import { defineEventHandler, getQuery } from 'h3'
import curatedVideos from '../../data/youtube-videos'

interface VideoItem {
  id: string
  surahId?: number | null
  title: string
  url: string
  embedUrl: string
  published: string
  thumbnail: string
  description: string
}

interface CacheEntry {
  data: any
  expiresAt: number
}

const OFFICIAL_CHANNEL_ID = 'UCKPAQJxnUTX-pzvLQ3M0aEQ'
const UPLOADS_CHANNEL_ID = 'UCiuUJUpeWXxWwDSpPKoEVbQ'
const UPLOADS_PLAYLIST_ID = 'UUiuUJUpeWXxWwDSpPKoEVbQ'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes
const memoryCache: Record<string, CacheEntry> = {}

function extractSurahId(title: string): number | null {
  const match = title.match(/Surah\s+(\d+)\./i)
  return match ? parseInt(match[1], 10) : null
}

function parseRssFeed(xmlText: string): VideoItem[] {
  const videos: VideoItem[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match: RegExpExecArray | null

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1]

    const idMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/)
    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/)
    const thumbnailMatch = entryXml.match(/<media:thumbnail\s+url="([^"]+)"/)
    const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/)

    if (idMatch && idMatch[1]) {
      const videoId = idMatch[1].trim()
      const rawTitle = titleMatch ? titleMatch[1] : ''
      const title = rawTitle.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()

      if (title.toLowerCase().includes('deleted') || title.toLowerCase().includes('private')) {
        continue
      }

      const published = publishedMatch ? publishedMatch[1].trim() : ''
      const thumbnail = thumbnailMatch ? thumbnailMatch[1].trim() : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      const rawDesc = descMatch ? descMatch[1] : ''
      const description = rawDesc.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
      const surahId = extractSurahId(title)

      videos.push({
        id: videoId,
        surahId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        published,
        thumbnail,
        description,
      })
    }
  }

  return videos
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const channelId = String(query.channelId || process.env.YOUTUBE_CHANNEL_ID || OFFICIAL_CHANNEL_ID).trim()
  const surahFilter = query.surah ? parseInt(String(query.surah), 10) : null
  const bypassCache = query.refresh === 'true' || query.refresh === '1'
  const apiKey = process.env.YOUTUBE_API_KEY
  const oauthToken = process.env.YOUTUBE_OAUTH_TOKEN

  const cacheKey = `yt_videos_${channelId}_${surahFilter || 'all'}`
  const now = Date.now()

  if (!bypassCache && memoryCache[cacheKey] && memoryCache[cacheKey].expiresAt > now) {
    return memoryCache[cacheKey].data
  }

  let resultVideos: VideoItem[] = []
  let source = 'curated-catalog'

  // 1. Try YouTube Data API v3 playlistItems if API key or OAuth token is available
  if (apiKey || oauthToken) {
    try {
      const playlistId = channelId === OFFICIAL_CHANNEL_ID ? UPLOADS_PLAYLIST_ID : `UU${channelId.slice(2)}`
      const url = apiKey
        ? `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50`
        : `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet,contentDetails&maxResults=50`

      const headers: Record<string, string> = {}
      if (oauthToken && !apiKey) {
        headers['Authorization'] = `Bearer ${oauthToken}`
      }

      const apiRes = await fetch(url, { headers })
      if (apiRes.ok) {
        const json = await apiRes.json()
        const apiVideos: VideoItem[] = (json.items || [])
          .map((item: any) => {
            const vidId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId
            const title = item.snippet?.title || ''
            return {
              id: vidId,
              surahId: extractSurahId(title),
              title,
              url: `https://www.youtube.com/watch?v=${vidId}`,
              embedUrl: `https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0`,
              published: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || '',
              thumbnail:
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
              description: item.snippet?.description || '',
            }
          })
          .filter((v: VideoItem) => v.id && !v.title.toLowerCase().includes('deleted') && !v.title.toLowerCase().includes('private'))

        if (apiVideos.length > 0) {
          resultVideos = apiVideos
          source = 'youtube-api-v3'
        }
      }
    } catch (err) {
      console.warn('[YouTube API Videos] Fetch error, falling back:', err)
    }
  }

  // 2. If API was empty, try Public YouTube RSS feed for Peace2074 uploads
  if (resultVideos.length === 0) {
    try {
      const targetChannel = channelId === OFFICIAL_CHANNEL_ID ? UPLOADS_CHANNEL_ID : channelId
      const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${targetChannel}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Peace2074Bot/1.0)' },
      })
      if (rssRes.ok) {
        const xml = await rssRes.text()
        const rssVideos = parseRssFeed(xml)
        if (rssVideos.length > 0) {
          resultVideos = rssVideos
          source = 'youtube-rss'
        }
      }
    } catch (err) {
      console.warn('[YouTube RSS Videos] Fetch error:', err)
    }
  }

  // 3. Fallback: Merge with curated complete verified catalog (42+ verified surah videos)
  const curatedList = (curatedVideos as VideoItem[]).map((v) => ({
    ...v,
    surahId: v.surahId ?? extractSurahId(v.title),
  }))

  if (resultVideos.length === 0) {
    resultVideos = curatedList
    source = 'curated-catalog'
  } else {
    // Merge: ensure any surah video in curated catalog is present
    const existingIds = new Set(resultVideos.map((v) => v.id))
    for (const cv of curatedList) {
      if (!existingIds.has(cv.id)) {
        resultVideos.push(cv)
        existingIds.add(cv.id)
      }
    }
  }

  // Sort: prioritize Surahs in numerical order
  resultVideos.sort((a, b) => (a.surahId || 999) - (b.surahId || 999))

  // Apply Surah filter if requested
  if (surahFilter && !isNaN(surahFilter)) {
    resultVideos = resultVideos.filter((v) => v.surahId === surahFilter)
  }

  const result = {
    ok: true,
    source,
    channelId,
    channelTitle: 'Peace2074',
    channelUrl: 'https://www.youtube.com/@peace2074',
    uploadsPlaylistId: UPLOADS_PLAYLIST_ID,
    total: resultVideos.length,
    videos: resultVideos,
  }

  memoryCache[cacheKey] = { data: result, expiresAt: now + CACHE_TTL_MS }
  return result
})
