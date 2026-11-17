// Validates the dataset with no dependencies: node scripts/validate.mjs
// Checks that every CSV row parses to the header's width, that the CSV and JSON
// copies agree, that every molecular formula is well-formed, that every CAS
// number passes its check digit, and that every URL is absolute HTTPS.
import { readFileSync } from "node:fs";

const ELEMENTS = new Set(
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi".split(" "),
);

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  if (quoted) throw new Error("unterminated quoted field");
  return rows;
}

/** A formula is a run of element symbols with optional counts, and an optional charge. */
export function formulaProblem(formula) {
  if (!formula) return null;
  const m = /^((?:[A-Z][a-z]?\d*)+)([+-]\d*)?$/.exec(formula);
  if (!m) return "not a formula";
  for (const [, sym] of m[1].matchAll(/([A-Z][a-z]?)\d*/g)) if (!ELEMENTS.has(sym)) return `unknown element ${sym}`;
  return null;
}

/** CAS check digit: weighted sum of the other digits, right to left, mod 10. */
export function casValid(cas) {
  const m = /^(\d{2,7})-(\d{2})-(\d)$/.exec(cas);
  if (!m) return false;
  const digits = (m[1] + m[2]).split("").reverse();
  const sum = digits.reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 10 === Number(m[3]);
}

let failures = 0;
const fail = (msg) => { failures += 1; console.error(`FAIL ${msg}`); };

for (const name of ["compounds", "skus"]) {
  const rows = parseCsv(readFileSync(new URL(`../data/${name}.csv`, import.meta.url), "utf8"));
  const [header, ...body] = rows;
  const json = JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
  if (body.length !== json.length) fail(`${name}: ${body.length} CSV rows against ${json.length} JSON records`);
  body.forEach((row, i) => {
    const where = `${name}.csv row ${i + 2}`;
    if (row.length !== header.length) return fail(`${where}: ${row.length} fields, expected ${header.length}`);
    const rec = Object.fromEntries(header.map((h, j) => [h, row[j]]));
    for (const h of header) if (String(json[i][h] ?? "") !== rec[h]) fail(`${where}: column ${h} differs from the JSON`);
    const problem = formulaProblem(rec.formula);
    if (problem && !/:/.test(rec.formula)) fail(`${where}: formula ${rec.formula}: ${problem}`);
    // Blend cells list one formula per component, "Name: formula; Name: formula".
    if (/:/.test(rec.formula ?? "")) {
      for (const part of rec.formula.split(";")) {
        const value = part.split(":").slice(1).join(":").trim();
        if (value && value !== "not on file" && formulaProblem(value)) fail(`${where}: component formula ${value}`);
      }
    }
    const casText = rec.cas ?? rec.cas_registry ?? "";
    for (const cas of casText.match(/\b\d{2,7}-\d{2}-\d\b/g) ?? []) if (!casValid(cas)) fail(`${where}: CAS ${cas} fails its check digit`);
    for (const h of ["product_url", "product_urls", "hub_url", "library_url"]) {
      for (const url of (rec[h] ?? "").split(" ").filter(Boolean)) if (!/^https:\/\/\S+$/.test(url)) fail(`${where}: ${h} ${url}`);
    }
  });
  console.log(`${name}: ${body.length} rows checked`);
}

if (failures) { console.error(`${failures} problem(s)`); process.exit(1); }
console.log("All rows parse, every formula is well-formed and every CAS number passes its check digit.");
