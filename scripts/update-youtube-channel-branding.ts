import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const OAUTH_TOKEN = process.env.YOUTUBE_OAUTH_TOKEN || ''
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCKPAQJxnUTX-pzvLQ3M0aEQ'

const CHANNEL_TITLE = 'Peace2074 — Official Quran Recitations & Reflections'
const CHANNEL_DESCRIPTION = `Peace2074 (https://peace2074.com) is a global digital sanctuary for the Holy Quran, Dhikr, and Islamic reflection.

✨ Key Features on Peace2074:
• Complete 114 Surahs with HD 1080p synchronized Arabic text & multilingual translations.
• Asma' Allah Al-Husna (99 Names of Allah) & Digital Tasbeeh counter.
• Multi-language support across 10 languages (English, Arabic, Persian, German, Spanish, Turkish, Russian, Hebrew, Italian, Uzbek).
• Fully responsive web app & iOS native application.

🔗 Official Links:
🌐 Website: https://peace2074.com
📖 Read Quran: https://peace2074.com/quran
✨ 99 Names of Allah: https://peace2074.com/holynames
📿 Digital Tasbeeh: https://peace2074.com/tasbeeh
💻 Open Source: https://github.com/oilaeaw/peace2074.com

"Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)`

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

  try {
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          id: CHANNEL_ID,
          snippet: {
            title: CHANNEL_TITLE,
            description: CHANNEL_DESCRIPTION,
          },
          brandingSettings: {
            channel: {
              title: CHANNEL_TITLE,
              description: CHANNEL_DESCRIPTION,
              keywords: KEYWORDS,
              country: 'US',
              defaultTab: 'Featured',
            },
          },
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ YouTube Channel Branding Successfully Updated!')
      console.log(`📌 Title: ${CHANNEL_TITLE}`)
      console.log(`📌 Keywords: ${KEYWORDS}`)
      console.log(`📌 Channel ID: ${data.id || CHANNEL_ID}`)
    } else {
      const errText = await response.text()
      console.error(`❌ YouTube API update failed (${response.status}):`, errText)
    }
  } catch (err: any) {
    console.error('❌ Error updating YouTube channel branding:', err?.message || err)
  }
}

updateChannelBranding()
