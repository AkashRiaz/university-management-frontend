// Bundle before/after report.
//
//   node scripts/bundle-report.mjs snapshot <name>   -> saves docs/reports/bundle/<name>/
//   node scripts/bundle-report.mjs compare <a> <b>   -> prints + writes docs/reports/bundle/compare-<a>-vs-<b>.md
//
// Run "snapshot" right after `npm run build` (and optionally `npx next experimental-analyze --output`),
// because the next build overwrites .next/diagnostics.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "docs", "reports", "bundle");
const STATS = path.join(ROOT, ".next", "diagnostics", "route-bundle-stats.json");
const ANALYZE = path.join(ROOT, ".next", "diagnostics", "analyze");

const kb = (b) => (b / 1024).toFixed(1);

function fileSizes(p) {
  const buf = fs.readFileSync(path.join(ROOT, p.replace(/\\/g, "/")));
  return { raw: buf.length, gzip: zlib.gzipSync(buf, { level: 9 }).length };
}

function sum(chunks, cache) {
  let raw = 0, gzip = 0;
  for (const c of chunks) {
    cache[c] ??= fileSizes(c);
    raw += cache[c].raw;
    gzip += cache[c].gzip;
  }
  return { raw, gzip };
}

// Top client packages per route from the Turbopack analyzer output (optional).
function analyzerPackages(dir) {
  const result = {};
  if (!fs.existsSync(path.join(dir, "data"))) return result;
  const walk = (d, route) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(d, e.name), `${route}/${e.name}`);
      else if (e.name === "analyze.data") {
        const b = fs.readFileSync(path.join(d, e.name));
        const n = b.readUInt32BE(0);
        const j = JSON.parse(b.subarray(4, 4 + n).toString());
        const memo = {};
        const full = (i) => memo[i] ??= ((j.sources[i].parent_source_index != null ? full(j.sources[i].parent_source_index) + "/" : "") + j.sources[i].path);
        const pk = {};
        for (const cp of j.chunk_parts) {
          const fn = j.output_files[cp.output_file_index].filename;
          if (!/^\[client-fs\].*\.js$/.test(fn)) continue;
          const p = full(cp.source_index).replace(/\/+/g, "/");
          const m = [...p.matchAll(/node_modules\/((@[^/]+\/)?[^/]+)/g)];
          const key = m.length ? m[m.length - 1][1] : "(app code)";
          pk[key] = (pk[key] || 0) + cp.size;
        }
        result[route || "/"] = Object.fromEntries(Object.entries(pk).sort((a, b) => b[1] - a[1]).slice(0, 15));
      }
    }
  };
  walk(path.join(dir, "data"), "");
  return result;
}

function snapshot(name) {
  if (!fs.existsSync(STATS)) throw new Error("No .next/diagnostics/route-bundle-stats.json — run `npm run build` first.");
  const stats = JSON.parse(fs.readFileSync(STATS, "utf8"));
  const cache = {};
  const sets = stats.map((r) => new Set(r.firstLoadChunkPaths));
  const sharedChunks = [...sets[0]].filter((c) => sets.every((s) => s.has(c)));
  const shared = sum(sharedChunks, cache);
  const routes = {};
  for (const r of stats) {
    const t = sum(r.firstLoadChunkPaths, cache);
    routes[r.route] = { raw: t.raw, gzip: t.gzip, chunks: r.firstLoadChunkPaths.length };
  }

  const dest = path.join(OUT_DIR, name);
  fs.mkdirSync(dest, { recursive: true });
  fs.copyFileSync(STATS, path.join(dest, "route-bundle-stats.json"));
  const packages = analyzerPackages(ANALYZE);
  if (fs.existsSync(ANALYZE)) fs.cpSync(ANALYZE, path.join(dest, "analyze"), { recursive: true });

  const report = { name, createdAt: new Date().toISOString(), shared: { ...shared, chunks: sharedChunks.length }, routes, packages };
  fs.writeFileSync(path.join(dest, "summary.json"), JSON.stringify(report, null, 2));
  console.log(`Saved snapshot "${name}" -> ${path.relative(ROOT, dest)}`);
  console.log(`  routes: ${Object.keys(routes).length}, shared: ${kb(shared.raw)} KB (${kb(shared.gzip)} KB gzip)`);
  console.log(`  analyzer output: ${fs.existsSync(ANALYZE) ? "copied" : "not found (run `npx next experimental-analyze --output`)"}`);
}

function pct(a, b) {
  if (!a) return "n/a";
  const p = ((b - a) / a) * 100;
  return `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
}

function compare(a, b) {
  const load = (n) => JSON.parse(fs.readFileSync(path.join(OUT_DIR, n, "summary.json"), "utf8"));
  const A = load(a), B = load(b);
  const lines = [];
  lines.push(`# Bundle comparison: ${a} vs ${b}`, "");
  lines.push(`First Load JS per route (gzip measured from real build chunks).`, "");
  lines.push(`| Route | ${a} raw | ${b} raw | ${a} gzip | ${b} gzip | Δ gzip |`);
  lines.push(`| --- | ---: | ---: | ---: | ---: | ---: |`);
  lines.push(`| **Shared by all** | ${kb(A.shared.raw)} KB | ${kb(B.shared.raw)} KB | ${kb(A.shared.gzip)} KB | ${kb(B.shared.gzip)} KB | ${pct(A.shared.gzip, B.shared.gzip)} |`);
  const routes = [...new Set([...Object.keys(A.routes), ...Object.keys(B.routes)])].sort();
  for (const r of routes) {
    const x = A.routes[r], y = B.routes[r];
    lines.push(`| \`${r}\` | ${x ? kb(x.raw) + " KB" : "–"} | ${y ? kb(y.raw) + " KB" : "–"} | ${x ? kb(x.gzip) + " KB" : "–"} | ${y ? kb(y.gzip) + " KB" : "–"} | ${x && y ? pct(x.gzip, y.gzip) : "–"} |`);
  }

  const focus = ["/admin-dashboard", "/admin-dashboard/students", "/admin-dashboard/invoices", "/admin-dashboard/sections", "/student-dashboard/course-registration"];
  for (const r of focus) {
    const pa = A.packages?.[r], pb = B.packages?.[r];
    if (!pa && !pb) continue;
    lines.push("", `## Client packages on \`${r}\` (analyzer, all client JS incl. lazy chunks)`, "");
    lines.push(`| Package | ${a} | ${b} |`, `| --- | ---: | ---: |`);
    const keys = [...new Set([...Object.keys(pa || {}), ...Object.keys(pb || {})])];
    keys.sort((k1, k2) => ((pa?.[k2] || 0) - (pa?.[k1] || 0)));
    for (const k of keys) lines.push(`| ${k} | ${pa?.[k] ? kb(pa[k]) + " KB" : "–"} | ${pb?.[k] ? kb(pb[k]) + " KB" : "–"} |`);
  }

  const md = lines.join("\n") + "\n";
  const file = path.join(OUT_DIR, `compare-${a}-vs-${b}.md`);
  fs.writeFileSync(file, md);
  console.log(md);
  console.log(`Written to ${path.relative(ROOT, file)}`);
}

const [cmd, x, y] = process.argv.slice(2);
if (cmd === "snapshot" && x) snapshot(x);
else if (cmd === "compare" && x && y) compare(x, y);
else console.log("Usage:\n  node scripts/bundle-report.mjs snapshot <name>\n  node scripts/bundle-report.mjs compare <before> <after>");
