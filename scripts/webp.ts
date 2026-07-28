import { execSync } from 'child_process'

console.log('⚡ [bun run webp] Scanning public/assets for PNG/JPG images...')

// Run python converter script for optimal WebP & RGBA transparency
try {
  execSync('python3 scripts/convert-assets.py', { stdio: 'inherit' })
  console.log('✅ [bun run webp] WebP asset conversion complete!')
} catch (err) {
  console.error('❌ [bun run webp] Image conversion failed:', err)
}
