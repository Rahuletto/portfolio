import type { Plugin } from 'vite'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export function autoWebpPlugin(): Plugin {
  return {
    name: 'vite-plugin-auto-webp',
    async buildStart() {
      console.log('🖼️  [Auto-WebP Plugin] Running asset WebP optimization...')
      try {
        await execAsync('python3 scripts/convert-assets.py')
      } catch (err) {
        console.warn('⚠️  [Auto-WebP Plugin] Error running WebP converter script:', err)
      }
    },
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        if (code.includes('.png') || code.includes('.jpg') || code.includes('.jpeg')) {
          const updated = code
            .replace(/\.png(?=['"])/g, '.webp')
            .replace(/\.jpg(?=['"])/g, '.webp')
            .replace(/\.jpeg(?=['"])/g, '.webp')
          return { code: updated, map: null }
        }
      }
      return null
    },
  }
}
