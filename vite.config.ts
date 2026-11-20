import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'salarypush-offline',
      apply: 'build',
      generateBundle: {
        order: 'post',
        handler(_options, bundle) {
          const index = bundle['index.html']
          if (index?.type !== 'asset') this.error('Missing index.html for offline use')

          const worker = readFileSync(new URL('./src/service-worker.js', import.meta.url), 'utf8')
          const assets = Object.keys(bundle).filter(file => file.startsWith('assets/')).sort()
          const publicFiles = [
            'apple-touch-icon.png',
            'favicon.ico',
            'favicon.png',
            'icon-192.png',
            'icon-512.png',
            'icon.svg',
            'manifest.json',
          ]
          const shell = ['/', ...[...assets, ...publicFiles].map(file => '/' + file)]
          const revision = createHash('sha256').update(worker).update(index.source).update(JSON.stringify(shell))
          for (const file of publicFiles) {
            revision.update(readFileSync(new URL('./public/' + file, import.meta.url)))
          }

          this.emitFile({
            type: 'asset',
            fileName: 'sw.js',
            source: `const CACHE_NAME = 'salarypush-shell-${revision.digest('hex').slice(0, 16)}';\n`
              + `const APP_SHELL = ${JSON.stringify(shell)};\n\n`
              + worker,
          })
        },
      },
    },
  ],
})
