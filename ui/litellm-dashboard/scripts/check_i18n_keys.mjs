import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const localesDir = join(root, "src/i18n/locales");
const srcDir = join(root, "src");

const walk = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
};

const definitionRe = /"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"\s*:/g;

// A key counts as referenced when it appears as a string literal anywhere outside the locale
// dictionaries. Scanning every literal rather than only t(...) arguments is deliberate: keys
// reached through a lookup table, e.g. t(ROW_LABEL_KEYS[value]), appear only in that table.
const literalRe = /"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"/g;
const prefixTemplateRe = /`[^`]*?\b([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]*)\$\{/g;
const usageRes = [
  /\bt\(\s*"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"/g,
  /\btr\(\s*"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"/g,
  /\btranslate\(\s*[^,]+,\s*"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"/g,
];

const dictionaryFiles = walk(localesDir);
const sourceFiles = walk(srcDir).filter((file) => !file.startsWith(localesDir));

// en.ts and zh.ts are two mirrors of one namespace, and each extra/*.ts holds both languages in
// one file, so a key legitimately appears twice. Collapsing each mirror to one owner makes
// "defined in more than one place" mean two dictionaries genuinely competing for the same key.
const namespaceOf = (owner) => (/^(en|zh)\.ts$/.test(owner) ? "core" : owner);

// Each dictionary file may declare several languages: en.ts and zh.ts hold one each, while every
// extra/*.ts exports an `en` and a `zh` object side by side. Split on the export boundary so each
// key is attributed to the language it actually belongs to.
const blockRe = /export\s+const\s+(en|zh)\b[^=]*=\s*\{/g;

// Each entry is one line: the key, then the value up to the line end. A trailing comment is not
// part of the value, so strip it before inspecting the value's characters.
const entryRe = /^[ \t]*"([A-Za-z][A-Za-z0-9_]*\.[A-Za-z0-9_.]+)"[ \t]*:[ \t]*(.*)$/gm;

const entriesByLanguage = (file) => {
  const src = readFileSync(file, "utf8");
  const bounds = [...src.matchAll(blockRe)];
  if (bounds.length === 0) return [[undefined, [...src.matchAll(definitionRe)].map((m) => [m[1], ""])]];
  return bounds.map((bound, index) => {
    const start = bound.index + bound[0].length;
    const end = index + 1 < bounds.length ? bounds[index + 1].index : src.length;
    const entries = [...src.slice(start, end).matchAll(entryRe)].map((m) => [m[1], m[2].replace(/\/\/.*$/, "")]);
    return [bound[1], entries];
  });
};

const definedIn = new Map();
const languageSets = new Map();
const shadowedInBlock = [];
const cjkInEnglish = [];
for (const file of dictionaryFiles) {
  const owner = namespaceOf(relative(localesDir, file));
  for (const [lang, entries] of entriesByLanguage(file)) {
    const counts = new Map();
    for (const [key, value] of entries) {
      const owners = definedIn.get(key) ?? [];
      owners.push(owner);
      definedIn.set(key, owners);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (lang === "en" && /[\u4e00-\u9fff]/.test(value)) cjkInEnglish.push(`${owner} ${key} = ${value}`);
    }
    for (const [key, count] of counts) {
      if (count > 1) shadowedInBlock.push(`${owner} ${lang} ${key} defined ${count} times`);
    }
    if (lang === undefined) continue;
    const set = languageSets.get(lang) ?? new Set();
    for (const [key] of entries) set.add(key);
    languageSets.set(lang, set);
  }
}
const english = languageSets.get("en") ?? new Set();
const chinese = languageSets.get("zh") ?? new Set();

// Only source files count as references. Locale files are excluded on purpose: a definition is a
// string literal too, so scanning them would mark every key as referenced and hide all orphans.
const referenced = new Set();
const templatedPrefixes = new Set();
const dangling = [];
for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(literalRe)) referenced.add(m[1]);
  for (const m of src.matchAll(prefixTemplateRe)) templatedPrefixes.add(m[1]);
  for (const re of usageRes) {
    re.lastIndex = 0;
    for (const m of src.matchAll(re)) {
      if (!definedIn.has(m[1])) dangling.push([relative(root, file), m[1]]);
    }
  }
}

// A key built at runtime, e.g. t(`agents.identity.executionMode.${mode}`), never appears as a
// whole literal, so every key under the literal prefix counts as referenced.
for (const key of definedIn.keys()) {
  if ([...templatedPrefixes].some((prefix) => key.startsWith(prefix))) referenced.add(key);
}

const orphans = [...definedIn].filter(([key]) => !referenced.has(key));
const duplicated = [...definedIn].filter(([, owners]) => new Set(owners).size > 1);
const missingInZh = [...english].filter((key) => !chinese.has(key));
const extraInZh = [...chinese].filter((key) => !english.has(key));

const report = (title, rows, render) => {
  if (rows.length === 0) return;
  console.log(`\n${title} (${rows.length}):`);
  for (const row of rows) console.log(`  ${render(row)}`);
};

console.log(`scanned ${sourceFiles.length} source files, ${definedIn.size} keys defined`);

if (dangling.length === 0) {
  console.log(`no dangling keys`);
} else {
  for (const [file, key] of dangling) console.log(`${file}: ${key}`);
  console.log(`\n${dangling.length} dangling key reference(s)`);
}

report(
  "orphan key(s): defined but never referenced outside the dictionaries",
  orphans,
  ([key, owners]) => `${key} (${[...new Set(owners)].join(", ")})`,
);
report(
  "duplicate key(s): defined in more than one dictionary file",
  duplicated,
  ([key, owners]) => `${key} (${[...new Set(owners)].join(", ")})`,
);
report("key(s) in en.ts but not zh.ts", missingInZh, (key) => key);
report("key(s) in zh.ts but not en.ts", extraInZh, (key) => key);
// A second definition of the same key inside one block silently replaces the first, so the loser is
// invisible in review. An English entry holding Chinese text means the English mirror was pasted over
// with the translation, which ships Chinese copy to English users.
report("key(s) redefined inside one dictionary block: the last definition wins", shadowedInBlock, (row) => row);
report("English value(s) containing Chinese characters", cjkInEnglish, (row) => row);

if (
  dangling.length +
    orphans.length +
    duplicated.length +
    missingInZh.length +
    extraInZh.length +
    shadowedInBlock.length +
    cjkInEnglish.length >
  0
) {
  process.exitCode = 1;
}
