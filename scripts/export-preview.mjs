import { readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'

const output = process.argv[2]
if (!output) throw new Error('Usage: node scripts/export-preview.mjs /path/to/invitation.html')

const dist = new URL('../dist/', import.meta.url)
const mime = { '.webp': 'image/webp', '.m4a': 'audio/mp4', '.woff2': 'font/woff2' }

async function collectAssets(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true })
  const items = await Promise.all(entries.map(async (entry) => {
    if (entry.isDirectory()) {
      return collectAssets(new URL(entry.name + '/', dir), prefix + entry.name + '/')
    }

    const type = mime[extname(entry.name)]
    if (!type) return []

    const data = await readFile(new URL(entry.name, dir))
    return [[prefix + entry.name, 'data:' + type + ';base64,' + data.toString('base64')]]
  }))
  return items.flat()
}

const source = await readFile(new URL('index.html', dist), 'utf8')
const moduleTag = source.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
const styleTag = source.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)
if (!moduleTag || !styleTag) throw new Error('Vite build output is missing assets.')

const resources = Object.fromEntries(await collectAssets(new URL('reference/', dist)))
const code = await readFile(new URL(moduleTag[1], dist), 'utf8')
const css = await readFile(new URL(styleTag[1], dist), 'utf8')
const font = resources['song.woff2']
delete resources['song.woff2']

const html = source
  .replace(moduleTag[0], '')
  .replace(styleTag[0], () => '<style>' + css.replace('../reference/song.woff2', font) + '</style>')
  .replace('</body>', () =>
    '<script>window.__weddingPreviewAssets=' + JSON.stringify(resources) + '</script>' +
    '<script type="module">' + code.replaceAll('</script', '<\\/script') + '</script></body>',
  )

const path = resolve(output)
const pending = resolve(dirname(path), '.wedding-preview-' + process.pid + '.html')
await writeFile(pending, html)
await rename(pending, path)
console.log(path)
