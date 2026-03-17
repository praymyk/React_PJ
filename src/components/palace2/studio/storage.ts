export type WorkMode = 'Normal' | 'Interactive' | 'Mystery' | 'Visual';
export type AnchorSource = 'AUTHOR' | 'AI';

export type Work = {
    id: string;
    title: string;
    author: string;
    description: string;
    tags: string[];
    mode: WorkMode;
    aiImageEnabled: boolean;
    createdAt: string;
    updatedAt: string;
};

export type Anchor = {
    id: string;
    afterParagraphIndex: number;
    source: AnchorSource;
    caption?: string;
    spoilerLevel?: 0 | 1 | 2;
};

export type EpisodeMeta = {
    id: string;
    workId: string;
    episodeNo: number;
    title: string;
    status: 'DRAFT' | 'PUBLISHED';
    updatedAt: string;
};

export type Episode = {
    id: string;
    workId: string;
    episodeNo: number;
    title: string;
    body: string;          // raw
    paragraphs: string[];  // derived
    anchors: Anchor[];
    status: 'DRAFT' | 'PUBLISHED';
    createdAt: string;
    updatedAt: string;
};

function nowISO() {
    return new Date().toISOString();
}
function safeJsonParse<T>(s: string | null, fallback: T): T {
    if (!s) return fallback;
    try { return JSON.parse(s) as T; } catch { return fallback; }
}
function setJson(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function splitParagraphs(raw: string) {
    return raw
        .split(/\n{2,}/g)
        .map(s => s.trim())
        .filter(Boolean);
}

/* ===== Works ===== */
const KEY_WORKS = 'studio:works';
const keyWork = (workId: string) => `studio:work:${workId}`;

/* ===== Episodes ===== */
const keyEpisodes = (workId: string) => `studio:episodes:${workId}`;
const keyEpisode = (episodeId: string) => `studio:episode:${episodeId}`;

export function listWorks(): Work[] {
    return safeJsonParse<Work[]>(localStorage.getItem(KEY_WORKS), []);
}

export function getWork(workId: string): Work | null {
    return safeJsonParse<Work | null>(localStorage.getItem(keyWork(workId)), null);
}

export function saveWork(work: Work) {
    setJson(keyWork(work.id), work);
    const all = listWorks();
    const idx = all.findIndex(w => w.id === work.id);
    const next = [...all];
    if (idx >= 0) next[idx] = work;
    else next.unshift(work);
    setJson(KEY_WORKS, next);
}

export function createWork(input: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>): Work {
    const id = `work_${Date.now()}`;
    const t = nowISO();
    const work: Work = { ...input, id, createdAt: t, updatedAt: t };
    saveWork(work);
    setJson(keyEpisodes(id), [] as EpisodeMeta[]);
    return work;
}

/* ===== Episodes ===== */
export function listEpisodeMetas(workId: string): EpisodeMeta[] {
    return safeJsonParse<EpisodeMeta[]>(localStorage.getItem(keyEpisodes(workId)), []);
}

export function getEpisode(episodeId: string): Episode | null {
    return safeJsonParse<Episode | null>(localStorage.getItem(keyEpisode(episodeId)), null);
}

export function saveEpisode(ep: Episode) {
    setJson(keyEpisode(ep.id), ep);

    // meta 목록 갱신
    const metas = listEpisodeMetas(ep.workId);
    const idx = metas.findIndex(m => m.id === ep.id);
    const meta: EpisodeMeta = {
        id: ep.id,
        workId: ep.workId,
        episodeNo: ep.episodeNo,
        title: ep.title,
        status: ep.status,
        updatedAt: ep.updatedAt,
    };
    const next = [...metas];
    if (idx >= 0) next[idx] = meta;
    else next.push(meta);

    // episodeNo 오름차순 정렬
    next.sort((a, b) => a.episodeNo - b.episodeNo);
    setJson(keyEpisodes(ep.workId), next);

    // work updatedAt도 갱신
    const w = getWork(ep.workId);
    if (w) {
        saveWork({ ...w, updatedAt: nowISO() });
    }
}

export function createEpisode(workId: string, episodeNo: number): Episode {
    const id = `ep_${Date.now()}`;
    const t = nowISO();
    const ep: Episode = {
        id,
        workId,
        episodeNo,
        title: `Episode ${episodeNo}`,
        body: '',
        paragraphs: [],
        anchors: [],
        status: 'DRAFT',
        createdAt: t,
        updatedAt: t,
    };
    saveEpisode(ep);
    return ep;
}

export function nextEpisodeNo(workId: string): number {
    const metas = listEpisodeMetas(workId);
    const maxNo = metas.reduce((acc, m) => Math.max(acc, m.episodeNo), 0);
    return maxNo + 1;
}