const XML_URL = "cities_all.xml";

function parsePrefectures(xml) {
  const prefNodes = xml.querySelectorAll("prefecture");
  const list = [];
  for (const pref of prefNodes) {
    const prefJa = pref.querySelector(":scope > ja")?.textContent?.trim() ?? "";
    const prefEn = pref.querySelector(":scope > en")?.textContent?.trim() ?? "";
    const cities = [];
    for (const city of pref.querySelectorAll(":scope > city")) {
      const ja = city.querySelector("ja")?.textContent?.trim() ?? "";
      const en = city.querySelector("en")?.textContent?.trim() ?? "";
      const result = city.querySelector("result")?.textContent?.trim() ?? "";
      if (ja || en) cities.push({ ja: ja || en, en: en || ja, result });
    }
    if (prefJa || prefEn) list.push({ ja: prefJa, en: prefEn, cities });
  }
  return list;
}

function fillPrefSelect(select, prefectures) {
  const frag = document.createDocumentFragment();
  for (const p of prefectures) {
    const opt = document.createElement("option");
    opt.value = p.en;
    opt.textContent = p.ja;
    frag.appendChild(opt);
  }
  select.appendChild(frag);
}

function renderCityList(ul, cities) {
  ul.replaceChildren();
  const frag = document.createDocumentFragment();
  for (const { ja, en, result } of cities) {
    const li = document.createElement("li");
    const ok = (result ?? "").toLowerCase() === "ok";
    if (ok) {
      const a = document.createElement("a");
      a.textContent = ja;
      a.href = `https://ssp.kaigiroku.net/tenant/${encodeURIComponent(en)}/SpTop.html`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
    } else {
      li.textContent = ja;
    }
    frag.appendChild(li);
  }
  ul.appendChild(frag);
}

async function getData() {
  const prefSelect = document.getElementById("prefSelect");
  const citiesArea = document.getElementById("cities");
  if (!prefSelect || !citiesArea) return;

  try {
    const res = await fetch(XML_URL);
    if (!res.ok) throw new Error(String(res.status));
    const str = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "text/xml");
    const err = xml.querySelector("parsererror");
    if (err) throw new Error("XML parse error");

    const prefectures = parsePrefectures(xml);
    fillPrefSelect(prefSelect, prefectures);
    const byEn = new Map(prefectures.map((p) => [p.en, p]));

    prefSelect.addEventListener("change", () => {
      const key = prefSelect.value;
      const pref = key ? byEn.get(key) : null;
      if (pref) renderCityList(citiesArea, pref.cities);
      else citiesArea.replaceChildren();
    });
  } catch (e) {
    console.error("取得できませんでした", e);
    citiesArea.replaceChildren();
    const li = document.createElement("li");
    li.textContent = "データを読み込めませんでした。";
    citiesArea.appendChild(li);
  }
}

getData();
