import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const OAUTH_TOKEN = process.env.YOUTUBE_OAUTH_TOKEN || ''
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCKPAQJxnUTX-pzvLQ3M0aEQ'

const CHANNEL_TITLE = 'Peace2074'
const CHANNEL_DESCRIPTION = 'PEACE2074 is a multilingual Quran and reflection space designed to feel calm, beautiful, and deeply usable—whether you open it for one ayah, one breath, or a longer journey.'

const KEYWORDS = [
  'Quran',
  'Peace2074',
  'Holy Quran',
  'Quran Recitation',
  'Full Quran 1080p',
  'Surah',
  'Islam',
  'Peace',
  'Dhikr',
  'Tasbeeh',
  'Asma Allah Al Husna',
  'Mishary Alafasy',
  'Islamic Reflections',
  'Quran English Translation',
  'Quran Persian Translation',
].join(', ')

async function getOrRefreshOAuthToken(): Promise<string> {
  let token = (process.env.YOUTUBE_OAUTH_TOKEN || '').trim()
  if (token.startsWith('your-') || token.includes('bearer-token')) {
    token = ''
  }

  const refreshToken = (process.env.YOUTUBE_REFRESH_TOKEN || '').trim()
  const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.NITRO_GOOGLE_CLIENT_ID || '').trim()
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || process.env.NITRO_GOOGLE_CLIENT_SECRET || '').trim()

  if (refreshToken && clientId && clientSecret) {
    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.access_token) {
          return data.access_token
        }
      }
    } catch (err: any) {
      console.warn('[YouTube Token Auto-Refresh Warning]', err?.message || err)
    }
  }

  return token
}

async function updateChannelBranding() {
  console.log('================================================================')
  console.log('🎨 UPDATING PEACE2074 YOUTUBE CHANNEL BRANDING & PROFILE')
  console.log('================================================================')

  const token = await getOrRefreshOAuthToken()
  if (!token) {
    console.error('❌ YOUTUBE_OAUTH_TOKEN is missing or expired in .env file. Run `pnpm login:youtube` first.')
    process.exit(1)
  }

  const targetChannels = Array.from(new Set([CHANNEL_ID, 'UCiuUJUpeWXxWwDSpPKoEVbQ']))

  for (const chId of targetChannels) {
    try {
      console.log(`\nUpdating channel: ${chId}...`)
      const response = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=brandingSettings',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id: chId,
            brandingSettings: {
              channel: {
                description: CHANNEL_DESCRIPTION,
                keywords: KEYWORDS,
                country: 'IL',
              },
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Channel ${chId} Branding Successfully Updated!`)
        console.log(`📌 Description: ${CHANNEL_DESCRIPTION}`)
        console.log(`📌 Keywords: ${KEYWORDS}`)
        console.log(`📌 Channel ID: ${data.id || chId}`)
      } else {
        const errText = await response.text()
        console.warn(`⚠️ YouTube API update note for (${chId}):`, errText)
      }
    } catch (err: any) {
      console.error(`❌ Error updating YouTube channel ${chId}:`, err?.message || err)
    }
  }
}

updateChannelBranding()
