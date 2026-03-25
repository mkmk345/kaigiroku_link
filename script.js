const XML_URL = "cities_all.xml";

function parsePrefectures(xml) {
  const prefNodes = xml.querySelectorAll("prefecture");
  const list = [];
  for (const pref of prefNodes) {
    const prefJa = pref.querySelector(":scope > ja")?.textContent?.trim() ?? "";
    const prefEn = pref.querySelector(":scope > en")?.textContent?.trim() ?? "";
    const municipalities = [];
    for (const mun of pref.querySelectorAll(":scope > municipality")) {
      const ja = mun.querySelector("ja")?.textContent?.trim() ?? "";
      const en = mun.querySelector("en")?.textContent?.trim() ?? "";
      const url = mun.querySelector("url")?.textContent?.trim() ?? "";
      const result = mun.querySelector("result")?.textContent?.trim() ?? "";
      if (ja || en) municipalities.push({ ja: ja || en, en: en || ja, result, url });
    }
    if (prefJa || prefEn) list.push({ ja: prefJa, en: prefEn, municipalities });
  }
  return list;
}

/** XML の <result> が ok の自治体数（総数に対する割合） */
function countResultOk(prefectures) {
  let total = 0;
  let ok = 0;
  for (const p of prefectures) {
    for (const c of p.municipalities) {
      total += 1;
      if ((c.result ?? "").toLowerCase() === "ok") ok += 1;
    }
  }
  return { total, ok };
}

function renderStatsNote(el, ok, total) {
  if (!el) return;
  if (total === 0) {
    el.textContent = "";
    return;
  }
  const pct = ((100 * ok) / total).toFixed(1);
  el.textContent = `対応自治体数…${ok}/${total}（${pct}%）`;
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

function renderMunicipalityList(ul, municipalities) {
  ul.replaceChildren();
  const frag = document.createDocumentFragment();
  for (const { ja, url } of municipalities) {
    const li = document.createElement("li");
    if (url) {
      const a = document.createElement("a");
      a.textContent = ja;
      a.href = url;
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
  const listArea = document.getElementById("municipalities");
  if (!prefSelect || !listArea) return;

  try {
    const res = await fetch(XML_URL);
    if (!res.ok) throw new Error(String(res.status));
    const str = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "text/xml");
    const err = xml.querySelector("parsererror");
    if (err) throw new Error("XML parse error");

    const prefectures = parsePrefectures(xml);
    const { ok: okCount, total: totalCount } = countResultOk(prefectures);
    renderStatsNote(document.getElementById("stats-note"), okCount, totalCount);

    fillPrefSelect(prefSelect, prefectures);
    const byEn = new Map(prefectures.map((p) => [p.en, p]));

    prefSelect.addEventListener("change", () => {
      const key = prefSelect.value;
      const pref = key ? byEn.get(key) : null;
      if (pref) renderMunicipalityList(listArea, pref.municipalities);
      else listArea.replaceChildren();
    });
  } catch (e) {
    console.error("取得できませんでした", e);
    listArea.replaceChildren();
    const li = document.createElement("li");
    li.textContent = "データを読み込めませんでした。";
    listArea.appendChild(li);
  }
}

getData();
