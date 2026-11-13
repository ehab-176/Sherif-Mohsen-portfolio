import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
let html = await readFile(path.join(dist, 'index.html'), 'utf8');

const jsTag = html.match(/<script\b[^>]*\bsrc="(\/assets\/[^\"]+\.js)"[^>]*><\/script>/);
const cssTag = html.match(/<link\b[^>]*\bhref="(\/assets\/[^\"]+\.css)"[^>]*>/);

if (!jsTag || !cssTag) {
  throw new Error('Expected one compiled JavaScript bundle and one CSS bundle.');
}

let javascript = await readFile(path.join(dist, jsTag[1].slice(1)), 'utf8');
let css = await readFile(path.join(dist, cssTag[1].slice(1)), 'utf8');

// Replace public asset paths with embedded data URIs, so the preview opens
// by double-clicking the HTML even without localhost, a network, or a server.
const imageTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
async function inlinePublicAssets(dir, relative = '') {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      await inlinePublicAssets(abs, rel);
      continue;
    }
    const mime = imageTypes[path.extname(entry.name).toLowerCase()];
    if (!mime) continue;
    const dataUri = `data:${mime};base64,${(await readFile(abs)).toString('base64')}`;
    const publicUrl = `/${rel}`;
    html = html.replaceAll(publicUrl, dataUri);
    javascript = javascript.replaceAll(publicUrl, dataUri);
    css = css.replaceAll(publicUrl, dataUri);
  }
}

await inlinePublicAssets(path.join(root, 'public'));

// Avoid closing the script element if an unexpected literal appears in JS.
javascript = javascript.replace(/<\/script/gi, '<\\/script');
html = html.replace(cssTag[0], `<style>\n${css}\n</style>`);
html = html.replace(jsTag[0], `<script type="module">\n${javascript}\n</script>`);

const previewPath = path.join(root, 'Sherif_Mohsen_Preview.html');
await writeFile(previewPath, html, 'utf8');
console.log(`Offline interactive preview: ${previewPath}`);
