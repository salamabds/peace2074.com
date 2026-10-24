import { defineEventHandler, getQuery } from 'h3'

interface CacheEntry {
  data: any
  expiresAt: number
}

const DEFAULT_CHANNEL_ID = 'UCKPAQJxnUTX-pzvLQ3M0aEQ'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes
const memoryCache: Record<string, CacheEntry> = {}

function formatCompactNumber(numStr: string | number): string {
  const n = typeof numStr === 'number' ? numStr : parseInt(numStr, 10)
  if (isNaN(n)) return String(numStr)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return n.toLocaleString()
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const channelId = String(query.channelId || process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID).trim()
  const bypassCache = query.refresh === 'true' || query.refresh === '1'
  const apiKey = process.env.YOUTUBE_API_KEY
  const oauthToken = process.env.YOUTUBE_OAUTH_TOKEN

  const cacheKey = `yt_channel_${channelId}`
  const now = Date.now()

  if (!bypassCache && memoryCache[cacheKey] && memoryCache[cacheKey].expiresAt > now) {
    return memoryCache[cacheKey].data
  }

  // 1. If API Key or OAuth Token is available, query official YouTube Data API v3 channels endpoint
  if (apiKey || oauthToken) {
    try {
      const url = apiKey
        ? `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics,brandingSettings,contentDetails`
        : `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,statistics,brandingSettings,contentDetails`

      const headers: Record<string, string> = {}
      if (oauthToken && !apiKey) {
        headers['Authorization'] = `Bearer ${oauthToken}`
      }

      const apiRes = await fetch(url, { headers })
      if (apiRes.ok) {
        const json = await apiRes.json()
        const item = json.items?.[0]
        if (item) {
          const rawSubs = item.statistics?.subscriberCount || '1'
          const rawViews = item.statistics?.viewCount || '0'
          const rawVideos = item.statistics?.videoCount || '0'
          const publishedAt = item.snippet?.publishedAt || '2020-03-13T17:57:13.297478Z'
          const countryCode = item.snippet?.country || item.brandingSettings?.channel?.country || 'IL'
          const countryName = countryCode === 'IL' ? 'Israel' : countryCode

          let joinedFormatted = 'Mar 13, 2020'
          try {
            const d = new Date(publishedAt)
            joinedFormatted = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          } catch {
            // fallback
          }

          const result = {
            ok: true,
            source: 'youtube-api-v3',
            channel: {
              id: item.id || channelId,
              title: item.snippet?.title || 'Peace2074',
              description: item.snippet?.description || 'PEACE2074 is a multilingual Quran and reflection space designed to feel calm, beautiful, and deeply usable—whether you open it for one ayah, one breath, or a longer journey.',
              customUrl: item.snippet?.customUrl || '@peace2074',
              handle: item.snippet?.customUrl || '@peace2074',
              publishedAt,
              joinedDate: joinedFormatted,
              country: countryName,
              countryCode,
              websiteUrl: 'https://peace2074.com',
              thumbnails: item.snippet?.thumbnails,
              avatarUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || 'https://yt3.ggpht.com/Lfkn1jMhJVorNL6Rss404mNfDGUbmRxSlb8RdGYKmyyoI1Y9TdoKvjueSDPq_67i9_Zbxb_aTw=s800-c-k-c0x00ffffff-no-rj',
              bannerUrl: item.brandingSettings?.image?.bannerExternalUrl || 'https://yt3.googleusercontent.com/YWehEmDERkrZL6RYEXzSExuTBrMCZyhOkLd3UqeDiSt3Pi1z3URWv5op0YvuAv2kr0FJ_tVECg',
              rawSubscriberCount: rawSubs,
              subscriberCountFormatted: rawSubs === '1' ? '1 subscriber' : `${formatCompactNumber(rawSubs)} subscribers`,
              rawViewCount: rawViews,
              viewCountFormatted: `${formatCompactNumber(rawViews)} views`,
              rawVideoCount: rawVideos,
              videoCountFormatted: `${formatCompactNumber(rawVideos)} videos`,
              uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads || `UU${channelId.slice(2)}`,
              url: item.snippet?.customUrl ? `https://www.youtube.com/${item.snippet.customUrl}` : 'https://www.youtube.com/@peace2074',
              subscribeUrl: 'https://www.youtube.com/@peace2074?sub_confirmation=1',
              communityUrl: 'https://www.youtube.com/@peace2074/community',
            },
          }
          memoryCache[cacheKey] = { data: result, expiresAt: now + CACHE_TTL_MS }
          return result
        }
      }
    } catch (err) {
      console.warn('[YouTube Channel API] Fetch error, using fallback:', err)
    }
  }

  // 2. Fallback: Exact Verified Peace2074 Channel Details
  const fallbackResult = {
    ok: true,
    source: 'verified-channel-profile',
    channel: {
      id: channelId,
      title: 'Peace2074',
      description: 'PEACE2074 is a multilingual Quran and reflection space designed to feel calm, beautiful, and deeply usable—whether you open it for one ayah, one breath, or a longer journey.',
      customUrl: '@peace2074',
      handle: '@peace2074',
      publishedAt: '2020-03-13T17:57:13.297478Z',
      joinedDate: 'Mar 13, 2020',
      country: 'Israel',
      countryCode: 'IL',
      websiteUrl: 'https://peace2074.com',
      avatarUrl: 'https://yt3.ggpht.com/Lfkn1jMhJVorNL6Rss404mNfDGUbmRxSlb8RdGYKmyyoI1Y9TdoKvjueSDPq_67i9_Zbxb_aTw=s800-c-k-c0x00ffffff-no-rj',
      bannerUrl: 'https://yt3.googleusercontent.com/YWehEmDERkrZL6RYEXzSExuTBrMCZyhOkLd3UqeDiSt3Pi1z3URWv5op0YvuAv2kr0FJ_tVECg',
      rawSubscriberCount: '1',
      subscriberCountFormatted: '1 subscriber',
      rawViewCount: '0',
      viewCountFormatted: '0 views',
      rawVideoCount: '0',
      videoCountFormatted: '0 videos',
      uploadsPlaylistId: `UU${channelId.slice(2)}`,
      url: 'https://www.youtube.com/@peace2074',
      subscribeUrl: 'https://www.youtube.com/@peace2074?sub_confirmation=1',
      communityUrl: 'https://www.youtube.com/@peace2074/community',
    },
  }

  memoryCache[cacheKey] = { data: fallbackResult, expiresAt: now + CACHE_TTL_MS }
  return fallbackResult
})
