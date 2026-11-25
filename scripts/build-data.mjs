import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "portfolio.config.json"), "utf8"));


const ID = CONFIG.identity;
const OWNER = ID.github;
const now = new Date();
const iso = now.toISOString();
const YEAR = now.getUTCFullYear();
const TODAY = iso.slice(0, 10);

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const readJson = (file) => JSON.parse(read(file));
const write = (file, value) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, file), typeof value === "string" ? value : JSON.stringify(value, null, 1));
  console.log("wrote", file);
};
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
const wrap = (text, width = 76) => {
  const out = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > width) {
      out.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) out.push(line);
  return out;
};

// ---------- 1. Sync HTML / JS / SVG identity ----------
function syncIdentity() {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const domain = esc(ID.domain);
  const name = esc(ID.name);
  const tagline = esc(ID.tagline);
  const ghUrl = `https://github.com/${encodeURIComponent(OWNER)}`;
  const barTitle = esc(ID.barTitle || ID.name.toUpperCase());

  // favicon.svg
  let fav = read("favicon.svg");
  fav = fav.replace(/<title>[^<]*<\/title>/, `<title>${name} | Full-stack developer</title>`);
  write("favicon.svg", fav);

  // index.html
  let idx = read("index.html");
  idx = idx
    .replace(/<title>[^<]*<\/title>/, `<title>${name} | Full-stack developer</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${name} — ${tagline}">`)
    .replace(/(<a class="brand"[^>]*>.*?<span>)[^<]*(<\/span><\/a>)/s, `$1${domain}$2`)
    .replace(/<a href="https:\/\/github\.com\/[^"]*" rel="me">github<\/a>/, `<a href="${ghUrl}" rel="me">github</a>`)
    .replace(/<h1 class="sr-only">[^<]*<\/h1>/, `<h1 class="sr-only">${domain} — ${tagline}</h1>`)
    .replace(/<p class="note" aria-hidden="true">\/\/ [^<]*<\/p>/, `<p class="note" aria-hidden="true">// ${tagline}</p>`);
  write("index.html", idx);

  // site/index.html
  let sIdx = read("site/index.html");
  sIdx = sIdx
    .replace(/<title>[^<]*<\/title>/, `<title>${name} | Full-stack developer</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="Explore ${name}’s projects, experience, and skills in an interactive editor.">`)
    .replace(/(<a class="brand"[^>]*>.*?<span>)[^<]*(<\/span><\/a>)/s, `$1${domain}$2`)
    .replace(/<a href="https:\/\/github\.com\/[^"]*" rel="me">github<\/a>/, `<a href="${ghUrl}" rel="me">github</a>`)
    .replace(/<h1 class="sr-only">[^<]*<\/h1>/, `<h1 class="sr-only">${name} — projects, experience, and skills.</h1>`)
    .replace(/<span class="bar-title">[^<]*<\/span>/, `<span class="bar-title">${barTitle}</span>`);
  write("site/index.html", sIdx);

  // glimpse.js
  let glimpse = read("glimpse.js");
  glimpse = glimpse.replace(/const NOTE_TEXT = "[^"]*";/, `const NOTE_TEXT = "// ${ID.tagline.replace(/"/g, '\\"')}";`);
  write("glimpse.js", glimpse);

  // site/terminal.js
  let term = read("site/terminal.js");
  term = term
    .replace(/return \[\["[^"]*", "t-user"\], \["@dev", "t-host"\]/, `return [[${JSON.stringify(ID.terminalUser || "dev")}, "t-user"], ["@dev", "t-host"]`)
    .replace(/item\.owner !== "[^"]*"/, `item.owner !== ${JSON.stringify(OWNER)}`);
  write("site/terminal.js", term);

  // site/editor.js
  const prefix = ID.storagePrefix || "portfolio";
  let ed = read("site/editor.js");
  ed = ed
    .replace(/const THEME_KEY = "[^"]*";/, `const THEME_KEY = "${prefix}.scheme";`)
    .replace(/const WORM_KEY = "[^"]*";/, `const WORM_KEY = "${prefix}.worm";`);
  write("site/editor.js", ed);
}

syncIdentity();

// ---------- 2. Themes ----------
const mixHex = (a, b, t) =>
  "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
const T = (name, description, light, bg, fg, accent, kw, str, num, fn, type, comment) => ({
  name,
  description,
  light,
  bg,
  fg,
  accent,
  kinds: { keyword: kw, string: str, number: num, function: fn, type, comment, text: fg, ident: mixHex(fg, kw, 0.3), member: fn, punct: mixHex(fg, bg, 0.45) },
});
const THEME_DEFS = [
  T("Blackmoney", "Warm paper on near-black", false, "#0b0b0a", "#ebe6db", "#e7c58a", "#7fd1a0", "#e6c37a", "#f0885b", "#8fd0ee", "#c9a0e8", "#7a766a"),
  T("Paper", "Light, ink on cream", true, "#f6f2e9", "#1d1c1a", "#b4532a", "#2f6f4f", "#8a5a1a", "#b4532a", "#2c5d8a", "#5a4a8a", "#8c887c"),
  T("Sora", "Cool steel and teal", false, "#0b1015", "#d9e4ee", "#4cc9f0", "#4cc9f0", "#a9d6e5", "#ffa94d", "#9fb4ff", "#6ee7b7", "#56687a"),
  T("Circuit", "Board green, phosphor on black", false, "#07110c", "#d3f0dd", "#3ddc84", "#3ddc84", "#ffd166", "#ff8f70", "#59c3f0", "#c792ea", "#4d6b5a"),
  T("Amber", "Warm amber on ink", false, "#0e0c08", "#f1e6cc", "#f7931a", "#f7931a", "#e8d9a0", "#ff7a59", "#ffcf6b", "#9ad1d4", "#7a6a4a"),
  T("Indigo", "Violet on deep indigo", false, "#0d0b14", "#e2dcf2", "#a97bff", "#a97bff", "#c7b8f0", "#ff9ecb", "#8fb2ff", "#7ad9d0", "#665f80"),
  T("Crimson", "Warm terracotta and charcoal", false, "#140a0a", "#f4e3d0", "#ff8f1f", "#ff8f1f", "#e8c39e", "#ffd27a", "#7fd1c8", "#e08a96", "#7a5a52"),
  T("Slate", "Neutral graphite", false, "#111214", "#d6d8dc", "#9aa5b1", "#9ab0c4", "#b9c4b0", "#d3a37a", "#c4b8d6", "#a3c4c0", "#666b73"),
];
const shade = (hex, f) =>
  "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f))).toString(16).padStart(2, "0")).join("");
const palettes = THEME_DEFS.map((t) => ({
  ...t,
  cursorline: shade(t.bg, t.light ? 0.96 : 1.5),
  ansi: [t.bg, t.kinds.keyword, t.kinds.string, t.kinds.number, t.kinds.function, t.kinds.type, t.accent, t.fg, t.kinds.comment, t.kinds.keyword, t.kinds.string, t.kinds.number, t.kinds.function, t.kinds.type, t.accent, t.fg],
  color1: t.kinds.keyword,
}));
const themes = palettes.map((t) => ({
  slug: slug(t.name),
  name: t.name,
  description: t.description,
  image: `/site/assets/themes/${slug(t.name)}.svg`,
  palette: t.ansi.slice(0, 8),
  repo: `https://github.com/${OWNER}`,
  included: true,
  source: "built-in palette",
}));
for (const t of palettes) {
  const k = t.kinds;
  const row = (y, w, c) => `<rect x="14" y="${y}" width="${w}" height="5" rx="2" fill="${c}" opacity=".9"/>`;
  write(
    `site/assets/themes/${slug(t.name)}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="${t.bg}"/><rect y="0" width="160" height="9" fill="${t.cursorline}"/>${row(18, 50, k.keyword)}${row(30, 90, k.string)}${row(42, 36, k.function)}${row(54, 70, t.fg)}${row(66, 28, k.number)}${row(78, 100, k.comment)}<rect x="130" y="30" width="16" height="16" rx="3" fill="${t.accent}"/></svg>`
  );
}

// ---------- 4. Projects ----------
const MORE = [];
const projects = CONFIG.projects.map((p) => {
  const id = slug(p.name);
  if (p.more) MORE.push(id);
  const full = p.githubRepo || (p.url?.startsWith("https://github.com/") ? p.url.replace("https://github.com/", "").replace(/\/$/, "") : null);
  const facts = p.facts || {};
  const images = (p.shots || []).map((s, i) => ({
    file: s.startsWith("shots/") ? s : `shots/${path.basename(s)}`,
    source: s,
    alt: `Source preview from ${p.name}`,
    xray: false,
  }));
  const lines = [
    `# ${p.name}`,
    "",
    ...images.slice(0, 1).map((_, i) => `\u0001IMG${i}\u0001`),
    "",
    `### ${p.desc}`,
    "",
    ...wrap(p.long || p.desc),
    "",
    ...(p.stack?.length ? ["Built with " + p.stack.join(" · "), ""] : []),
    ...images.slice(1).flatMap((_, i) => [`\u0001IMG${i + 1}\u0001`, ""]),
    ...(p.url ? [`[Visit](${p.url})`] : []),
    ...(p.links || []).map((l) => `[${l.label}](${l.url})`),
  ];
  return {
    repo: id,
    title: p.name,
    detail: p.long,
    links: p.links || [],
    url: p.url || null,
    description: p.desc,
    tag: p.tag || null,
    stars: facts.stars ?? p.stars ?? null,
    language: facts.language ?? p.stack?.[0] ?? null,
    pushed: facts.pushed ?? null,
    forks: facts.forks ?? null,
    watchers: facts.watchers ?? null,
    issues: facts.issues ?? null,
    license: facts.license ?? null,
    created: facts.created ?? null,
    branch: facts.branch ?? "main",
    commits: facts.commits ?? null,
    files: facts.files ?? null,
    counts: {},
    github: full ? `https://github.com/${full}` : null,
    stack: p.stack || [],
    images,
    lines,
  };
});

// Keep the captured repository sources while regenerating the theme palette.
const wall = readJson("wall.json");
const profile = [
  "export const developer = {",
  `  name: ${JSON.stringify(ID.name)},`,
  '  role: "Full-stack developer",',
  '  location: "Kozhikode, Kerala, India",',
  '  stack: ["React", "Next.js", "TypeScript", "PostgreSQL"],',
  '  education: "B.Tech · Information Technology",',
  `  github: ${JSON.stringify(OWNER)},`,
  "};", "",
  "export const selectedProjects = [",
  ...CONFIG.projects.map((p) => `  ${JSON.stringify(p.name)},`),
  "];", "",
  "export const contact = {",
  ...CONFIG.links.map((link) => `  ${JSON.stringify(link.label.toLowerCase())}: ${JSON.stringify(link.url)},`),
  "};",
];
write("profile.js", profile.join("\n") + "\n");
wall.files = [
  { repo: OWNER, path: "profile.js", lang: "js", url: "/profile.js", firstLine: 1, lines: profile },
  ...wall.files.filter((file) => file.path !== "profile.js"),
];
wall.themes = palettes.map((t) => ({ name: slug(t.name), light: t.light, source: "built-in palette", accent: t.accent, bg: t.bg, fg: t.fg, selection: t.accent, selectionText: t.bg, kinds: t.kinds, cursorline: t.cursorline }));
write("wall.json", wall);
write("wall.txt", wall.files.flatMap((f) => f.lines).filter(Boolean).join("\n"));

// ---------- 6. content.json & themes.json ----------
const aboutLines = [
  `# ${ID.name}`,
  "",
  CONFIG.about.bio,
  ...(CONFIG.about.extra ? ["", CONFIG.about.extra] : []),
  "",
  ...CONFIG.links.map((l) => `[${l.label}](${l.url})`),
];
const about = { repo: OWNER, lines: aboutLines };
const themeThumbs = Object.fromEntries(themes.map((t) => [t.slug, `assets/themes/${t.slug}.svg`]));
write("site/content.json", {
  owner: OWNER,
  fetchedAt: iso,
  about,
  projects,
  palettes,
  themeStats: {},
  themeThumbs,
  work: CONFIG.work || [],
  talks: CONFIG.talks || [],
  links: CONFIG.links || [],
  more: MORE,
});
write("themes.json", { source: "built-in palettes", snapshot: TODAY, themes });
console.log(`done (offline): ${projects.length} projects, ${themes.length} themes`);

