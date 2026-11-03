import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL(`../src/data/${p}.json`,import.meta.url),'utf8'));
const tools=read('tools'),bundles=read('bundles');
test('complete verified catalog, unique slugs and exact price distribution',()=>{assert.equal(tools.length,9);assert.equal(new Set(tools.map(t=>t.slug)).size,9);assert.equal(tools.filter(t=>t.priceUsd===20).length,8);assert.equal(tools.find(t=>t.priceUsd===5).slug,'practice-plan-template');assert.deepEqual(['game-day','scouting-lineups','recruiting'].map(c=>tools.filter(t=>t.category===c).length),[3,3,3]);});
test('checkout URLs preserve the unusual original Stan slugs',()=>{assert.equal(tools.find(t=>t.slug==='practice-plan-template').stanUrl,'https://stan.store/JacksonDavis/p/practice-plan-template-');assert.equal(tools.find(t=>t.slug==='player-role-finder').stanUrl,'https://stan.store/JacksonDavis/p/player-finder-');assert.equal(tools.find(t=>t.slug==='five-player-lineup-simulator').stanUrl,'https://stan.store/JacksonDavis/p/fiveplayer-lineup-simulator');for(const t of [...tools,...bundles])assert.ok(t.stanUrl.startsWith('https://stan.store/JacksonDavis/p/'));});
test('bundle contents reference existing tools and unknown contents stay empty',()=>{assert.equal(bundles.length,3);assert.deepEqual(bundles.map(b=>b.priceUsd),[55,35,35]);for(const b of bundles)for(const s of b.includes)assert.ok(tools.some(t=>t.slug===s));assert.deepEqual(bundles.find(b=>!b.contentsVerified).includes,[]);});
test('every personalized recommendation is a real tool',()=>{for(const v of Object.values(read('variants'))){assert.equal(v.tools.length,3);for(const s of v.tools)assert.ok(tools.some(t=>t.slug===s));}});
