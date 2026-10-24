import { defineEventHandler, getQuery } from "h3";
import chaptersEn from '../../../../src/shared/data/chapters/en.json';
import chaptersRu from '../../../../src/shared/data/chapters/ru.json';
import chaptersDe from '../../../../src/shared/data/chapters/de.json';
import chaptersHe from '../../../../src/shared/data/chapters/he.json';
import chaptersEs from '../../../../src/shared/data/chapters/es.json';
import chaptersTr from '../../../../src/shared/data/chapters/tr.json';
import { getDb } from '../utils/realdb';
import { loadQuranData } from '../utils/quran-data';

const chaptersMap: Record<string, any[]> = {
    en: chaptersEn as any[], ru: chaptersRu as any[], de: chaptersDe as any[],
    he: chaptersHe as any[], es: chaptersEs as any[], tr: chaptersTr as any[],
    ar: chaptersEn as any[], it: chaptersEn as any[],
};

function normalizeText(str: string) {
    return str
        .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
        .replace(/[\u0622\u0623\u0624\u0625\u0626]/g, "ا")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .toLowerCase().trim();
}

function normalizeLang(lang?: string) {
    if (!lang) return "en";
    const short = String(lang).toLowerCase().split("-")[0];
    return chaptersMap[short] ? short : "en";
}

export default defineEventHandler(async (event) => {
    const { q = "", limit = "20", lang = "en" } = getQuery(event);
    const rawQuery = String(q || "");
    const query = rawQuery.trim().toLowerCase();
    const normQuery = normalizeText(rawQuery);
    const max = Math.min(50, Math.max(1, Number(limit) || 20));

    if (!query) return { results: [] };

    const loc = normalizeLang(String(lang));
    const chapters = chaptersMap[loc] || chaptersMap.en;
    const results: any[] = [];

    // Feature pages matching (Shazam, Holy Names, Recitations, Tasbeeh)
    const featurePages = [
        {
            type: "page",
            id: "feature-shazam-lyrics",
            title: "Shazam Video & Synchronized Karaoke Lyrics",
            subtitle: "Full-screen Apple Music / Shazam-style video recitation with glowing live verse lyrics",
            path: "/quran/1?shazam=lyrics",
            keywords: ["shazam", "lyrics", "karaoke", "video recitation", "theater", "music", "audio sync", "visualizer"],
        },
        {
            type: "page",
            id: "feature-shazam-sync",
            title: "Shazam Quran Audio Recitation Matcher",
            subtitle: "Listen with your microphone to automatically identify and sync the recited Quran verse",
            path: "/quran/1?shazam=mic",
            keywords: ["shazam", "audio sync", "mic", "microphone", "listen", "recognize", "identify", "reciter", "audio match"],
        },
        {
            type: "page",
            id: "feature-holynames",
            title: "The 99 Holy Names of Allah (Asma' Allah Al-Husna)",
            subtitle: "Random reflection mode, Dhikr Tasbeeh counter, audio pronunciation & search",
            path: "/holynames",
            keywords: ["holynames", "holy names", "asma", "asmaa", "husna", "99 names", "names of god", "random", "أسماء الله الحسنى"],
        },
        {
            type: "page",
            id: "feature-recitations",
            title: "Sunnah Recitations & YouTube Video Feed",
            subtitle: "Watch 114 Surah recitations with official channel video player and security disclaimers",
            path: "/recitations",
            keywords: ["recitations", "youtube", "videos", "social", "sunnah recitations", "surah video"],
        },
        {
            type: "page",
            id: "feature-tasbeeh",
            title: "Digital Tasbeeh & Dhikr Counter",
            subtitle: "Track daily dhikr sessions with haptic vibration, beads, and custom targets",
            path: "/tasbeeh",
            keywords: ["tasbeeh", "dhikr", "counter", "beads", "subhanallah"],
        },
    ];

    for (const feat of featurePages) {
        const hay = `${feat.title} ${feat.subtitle} ${feat.keywords.join(" ")}`.toLowerCase();
        if (hay.includes(query)) {
            results.push({
                type: feat.type,
                id: feat.id,
                title: feat.title,
                subtitle: feat.subtitle,
                path: feat.path,
            });
        }
    }

    // Match surah names
    for (const c of chapters) {
        const name = String(c.name || "");
        const transliteration = String(c.transliteration || "");
        const translation = String(c.translation || "");
        const hay = `${name} ${transliteration} ${translation}`.toLowerCase();
        const hayNorm = normalizeText(`${name} ${transliteration} ${translation}`);
        if (hay.includes(query) || (normQuery && hayNorm.includes(normQuery))) {
            results.push({
                type: "sura", id: c.id,
                title: `${c.id}. ${transliteration || translation || name}`.trim(),
                subtitle: translation || name,
                path: `/quran/${c.id}`,
            });
        }
        if (results.length >= max) break;
    }

    // Match verses
    try {
        const quran = await loadQuranData(event);
        outer: for (const [suraId, verses] of Object.entries(quran)) {
            for (const verse of (verses as any[]) || []) {
                const text = String(verse.text || "");
                const hay = text.toLowerCase();
                const hayNorm = normalizeText(text);
                if (hay.includes(query) || (normQuery && hayNorm.includes(normQuery))) {
                    const id = `${suraId}:${verse.verse || ""}`;
                    results.push({
                        type: "verse", id,
                        title: `Ayah ${id}`,
                        subtitle: text.slice(0, 140),
                        path: `/quran/${suraId}#${suraId}_${verse.verse || ""}`,
                    });
                    if (results.length >= max) break outer;
                }
            }
        }
    } catch { /* verse search is best-effort */ }

    // Search blog posts
    try {
        const db = await getDb();
        const blogPosts = db.collection('blogPosts');
        const all = await blogPosts.findAll() as any[];
        const lq = rawQuery.toLowerCase();
        const matched = all.filter((p) =>
            String(p.title || '').toLowerCase().includes(lq) ||
            String(p.excerpt || '').toLowerCase().includes(lq)
        ).slice(0, 5);

        for (const post of matched) {
            results.push({
                type: 'page',
                id: `blog-${post.slug}`,
                title: post.title,
                subtitle: post.excerpt || (post.tags || []).join(', '),
                path: `/blog/${post.slug}`,
            });
            if (results.length >= max) break;
        }
    } catch { /* blog search is best-effort */ }

    return { results: results.slice(0, max) };
});
