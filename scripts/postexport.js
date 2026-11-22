/**
 * Post-processes the exported web build so it can be uploaded to Freebuff Sites.
 *
 * `expo export -p web` places bundled fonts and navigation images under
 * `dist/assets/node_modules/...`, and the deployer rejects any public asset whose
 * path contains "node_modules". This moves that folder to `assets/vendor` and
 * rewrites the asset URLs inside the emitted JS/CSS so the files still resolve.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const fromDir = path.join(distDir, 'assets', 'node_modules');
const toDir = path.join(distDir, 'assets', 'vendor');
const TEXT_EXTENSIONS = new Set(['.js', '.css', '.html', '.json', '.map']);
const OLD_PATH = 'assets/node_modules';
const NEW_PATH = 'assets/vendor';

if (!fs.existsSync(distDir)) {
  console.error('postexport: dist/ not found — run the web export first.');
  process.exit(1);
}

if (fs.existsSync(fromDir)) {
  fs.rmSync(toDir, { recursive: true, force: true });
  fs.renameSync(fromDir, toDir);
}

let rewritten = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!TEXT_EXTENSIONS.has(path.extname(entry.name))) continue;

    const contents = fs.readFileSync(full, 'utf8');
    if (!contents.includes(OLD_PATH)) continue;

    fs.writeFileSync(full, contents.split(OLD_PATH).join(NEW_PATH));
    rewritten += 1;
  }
}

walk(distDir);

const leftovers = [];
(function check(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === 'node_modules') leftovers.push(full);
    if (entry.isDirectory()) check(full);
  }
})(distDir);

if (leftovers.length) {
  console.error(`postexport: node_modules paths still present:\n${leftovers.join('\n')}`);
  process.exit(1);
}

console.log(`postexport: assets/vendor ready, ${rewritten} file(s) rewritten.`);
