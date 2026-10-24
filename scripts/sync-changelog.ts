import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

interface Deploy {
  version: string
  date: string
  message: string
  icon?: string
  color?: string
  features?: string[]
  fixes?: string[]
  documentation?: string[]
  chores?: string[]
}

export function generateChangelogData(): Deploy[] {
  const changelogPath = resolve(rootDir, 'CHANGELOG.md')
  const content = readFileSync(changelogPath, 'utf8')

  const deploys: Deploy[] = []
  const sections = content.split(/(?=## \d+\.\d+\.\d+)/)

  for (const section of sections) {
    if (!section.trim()) continue

    const versionMatch = section.match(/## (\d+\.\d+\.\d+) \((\d{4}-\d{2}-\d{2})\)/)
    if (!versionMatch) continue

    const version = versionMatch[1]
    const dateStr = versionMatch[2]
    const date = new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const featuresMatch = section.match(/### Features\n\n([\s\S]*?)(?=\n### |\n## |$)/)
    const features = featuresMatch
      ? featuresMatch[1]
          .split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace(/^-\s*/, '').trim())
      : []

    const fixesMatch = section.match(/### Bug Fixes\n\n([\s\S]*?)(?=\n### |\n## |$)/)
    const fixes = fixesMatch
      ? fixesMatch[1]
          .split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace(/^-\s*/, '').trim())
      : []

    const documentationMatch = section.match(/### Documentation\n\n([\s\S]*?)(?=\n### |\n## |$)/)
    const documentation = documentationMatch
      ? documentationMatch[1]
          .split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace(/^-\s*/, '').trim())
      : []

    const choresMatch = section.match(/### Chores\n\n([\s\S]*?)(?=\n### |\n## |$)/)
    const chores = choresMatch
      ? choresMatch[1]
          .split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace(/^-\s*/, '').trim())
      : []

    let icon = 'rocket_launch'
    let color = 'secondary'
    let message = 'Release update'

    if (features.length > 0) {
      const firstFeature = features[0].toLowerCase()
      if (firstFeature.includes('auto-continue') || firstFeature.includes('quran')) {
        icon = 'auto_awesome'
        color = 'positive'
        message = features[0].split(/\s[-–—]\s/)[0].trim()
      } else if (firstFeature.includes('shazam') || firstFeature.includes('lyrics')) {
        icon = 'lyrics'
        color = 'deep-purple'
        message = 'Shazam Karaoke Lyrics Theater'
      } else if (firstFeature.includes('sign up') || firstFeature.includes('registration')) {
        icon = 'person_add'
        color = 'secondary'
        message = 'Improved user registration'
      } else if (firstFeature.includes('ramadan') || firstFeature.includes('campaign')) {
        icon = 'campaign'
        color = 'amber'
        message = 'Ramadan campaign features'
      } else if (
        firstFeature.includes('locale') ||
        firstFeature.includes('turkish') ||
        firstFeature.includes('translation')
      ) {
        icon = 'translate'
        color = 'info'
        message = 'Turkish locale and Quran improvements'
      } else {
        message = features[0].split(/\s[-–—]\s/)[0].trim()
      }
    } else if (fixes.length > 0) {
      icon = 'bug_report'
      color = 'info'
      message = fixes[0].split(/\s[-–—]\s/)[0].trim()
    } else if (documentation.length > 0) {
      icon = 'article'
      color = 'primary'
      message = documentation[0].split(/\s[-–—]\s/)[0].trim()
    } else if (chores.length > 0) {
      icon = 'build'
      color = 'grey-7'
      message = chores[0].split(/\s[-–—]\s/)[0].trim()
    }

    deploys.push({
      version,
      date,
      message,
      icon,
      color,
      features: features.length > 0 ? features : undefined,
      fixes: fixes.length > 0 ? fixes : undefined,
      documentation: documentation.length > 0 ? documentation : undefined,
      chores: chores.length > 0 ? chores : undefined,
    })
  }

  return deploys
}

const deploys = generateChangelogData()

// Target 1: apps/nitro-api/server/data/changelog.json
const nitroDataDir = resolve(rootDir, 'apps/nitro-api/server/data')
mkdirSync(nitroDataDir, { recursive: true })
writeFileSync(resolve(nitroDataDir, 'changelog.json'), JSON.stringify(deploys, null, 2))

// Target 2: src/shared/data/changelog.json
const srcDataDir = resolve(rootDir, 'src/shared/data')
mkdirSync(srcDataDir, { recursive: true })
writeFileSync(resolve(srcDataDir, 'changelog.json'), JSON.stringify(deploys, null, 2))

console.log(`✅ Synced ${deploys.length} deploys from CHANGELOG.md to changelog.json`)
