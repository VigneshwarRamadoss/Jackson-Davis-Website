import { XMLParser } from 'fast-xml-parser';
import cached from '../data/posts.cache.json';
export async function getPosts() {
  try {
    const res = await fetch('https://jacksondavisttu.substack.com/feed', { signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error(`RSS ${res.status}`);
    const feed = new XMLParser({ ignoreAttributes:false }).parse(await res.text());
    const items = [feed.rss.channel.item].flat();
    const posts = items.filter((p:any) => typeof p.title === 'string' && typeof p.link === 'string' && p.link.startsWith('https://jacksondavisttu.substack.com/')).map((p:any) => ({title:p.title,url:p.link,date:new Date(p.pubDate).toISOString(),excerpt: String(p.description || '').replace(/<[^>]+>/g,'').slice(0,150)}));
    if (!posts.length) throw new Error('Empty RSS');
    return {posts: posts.slice(0,12), cached:false};
  } catch { console.warn('Substack unavailable; using supplied article cache.'); return {posts:cached,cached:true}; }
}
