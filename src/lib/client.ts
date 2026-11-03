import variants from '../data/variants.json';
import tools from '../data/tools.json';
import screenshots from '../data/screenshots.json';
const q=new URLSearchParams(location.search);
let consent='';
try {consent=localStorage.getItem('jd_consent')||'';} catch {}
const read=(key:string,fallback:any=null)=>{try{return consent==='granted'?JSON.parse(localStorage.getItem(key)||'null')??fallback:fallback}catch{return fallback}};
const save=(key:string,value:any)=>{if(consent==='granted')try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
let role: keyof typeof variants = (q.get('role')&&q.get('role')!=='none'&&Object.hasOwn(variants,q.get('role')!)) ? q.get('role') as keyof typeof variants:read('jd_role','none');
if(!Object.hasOwn(variants,role))role='none';
let seen:string[]=read('jd_stan_clicked',[]);
const visits=Number(read('jd_visits',0))+1;
const source=q.get('utm_source')||(/substack\.com/.test(document.referrer)?'substack':/(twitter|x)\.com|t\.co/.test(document.referrer)?'x':'direct');
const track=(name:string,props:Record<string,string>)=>(window as any).plausible?.(name,{props});
const safeText=(value:string)=>value.replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function applyRole(){
 const variant=variants[role];
 const sub=document.getElementById('hero-sub');if(sub)sub.textContent=variant.sub;
 const cta=document.getElementById('hero-primary') as HTMLAnchorElement|null;
 if(cta){cta.firstChild!.textContent=variant.cta+' ';cta.href='/tools/'+(variant.category==='all'?'':`?cat=${variant.category}`);}
 document.querySelectorAll<HTMLButtonElement>('[data-role-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roleChoice===role)));
 const grid=document.getElementById('featured-tools');
 if(grid){let slugs=[...variant.tools];const pin=q.get('tool');if(pin&&tools.some(t=>t.slug===pin))slugs=[pin,...slugs.filter(s=>s!==pin)].slice(0,3);
 grid.innerHTML=slugs.map((slug,i)=>{const t=tools.find(t=>t.slug===slug)!;const shot=(screenshots as Record<string,any>)[slug];const cat=({'game-day':'Game day','scouting-lineups':'Scouting & lineups',recruiting:'Recruiting'})[t.category]!;return `<article class="tool-card" data-cat="${t.category}" data-slug="${slug}"><a class="tool-art art-${i}" href="/tools/${slug}/" aria-label="Explore ${safeText(t.name)}">${shot?`<img class="tool-screenshot" src="${shot.src}" srcset="${shot.srcset}" sizes="(max-width:600px) calc(100vw - 40px), 400px" width="${shot.width}" height="${shot.height}" alt="${safeText(t.name)} product screenshot" loading="lazy"/>`:`<span class="art-label eyebrow">${cat}</span><span class="court-drawing"><i></i><i></i></span><span class="art-number">0${i+1}</span><span class="art-symbol"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 3h18v18H3zM3 12h18M8 3v5h8V3M8 21v-5h8v5"/><circle cx="12" cy="12" r="3"/></svg></span><span class="art-caption eyebrow">The coach’s toolkit</span><span class="art-go">↗</span>`}</a><div class="tool-info"><div class="card-meta"><span class="eyebrow">${cat}</span><span class="tool-price">$${t.priceUsd}<small> USD</small></span></div><h3><a href="/tools/${slug}/">${safeText(t.name)}</a></h3><p>${safeText(t.summary)}</p><div class="card-bottom"><a class="text-link" href="/tools/${slug}/">Explore tool →</a><a class="stan-small" data-stan="${slug}" href="${t.stanUrl}?utm_source=site&utm_medium=tool_card&utm_campaign=${slug}">Buy on Stan ↗</a></div></div></article>`}).join('');}
 document.querySelectorAll<HTMLElement>('[data-bundle]').forEach(b=>{b.style.outline=role!=='none'&&b.dataset.bundle===(role==='rc'?'recruiting-bundle':'coachs-bundle-1')?'2px solid #9d4b25':'';});
 save('jd_role',role);
}
if(role!=='none'||q.get('tool'))applyRole();
document.querySelectorAll<HTMLButtonElement>('[data-role-choice]').forEach(b=>b.addEventListener('click',()=>{role=b.dataset.roleChoice as keyof typeof variants;applyRole();if(filters.length)filter(variants[role].category);track('role_select',{role});}));
if(source==='substack'){
 const eyebrow=document.getElementById('hero-eyebrow');if(eyebrow)eyebrow.textContent='Welcome from the newsletter';
 const reading=document.getElementById('reading'),custom=document.querySelector('.custom-band');if(reading&&custom)custom.before(reading);
}
if(visits>=2){const p=document.getElementById('pillar-intro');if(p)p.textContent='Welcome back. Pick up where you left off. Explore the tools, read a new perspective, or build something for your system.';}
save('jd_visits',visits);save('jd_src_first',read('jd_src_first',source));
const preferences=document.getElementById('preferences');if(preferences&&consent)preferences.hidden=true;
document.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach(b=>b.addEventListener('click',()=>{consent=b.dataset.consent!;try{localStorage.setItem('jd_consent',consent)}catch{}if(consent==='granted'){save('jd_role',role);save('jd_visits',visits);save('jd_stan_clicked',seen);save('jd_src_first',source);}if(preferences)preferences.hidden=true;}));
document.querySelectorAll('.reset-preferences').forEach(b=>b.addEventListener('click',()=>{try{Object.keys(localStorage).filter(k=>k.startsWith('jd_')).forEach(k=>localStorage.removeItem(k));}catch{}consent='';seen=[];role='none';const url=new URL(location.href);url.searchParams.delete('role');url.searchParams.delete('tool');history.replaceState(null,'',url);applyRole();if(preferences)preferences.hidden=false;const status=document.getElementById('preference-status');if(status)status.textContent='Preferences reset.';}));
document.addEventListener('click',e=>{const a=(e.target as Element).closest<HTMLAnchorElement>('a[data-stan]');if(a){seen=[...new Set([...seen,a.dataset.stan!])];save('jd_stan_clicked',seen);track('stan_click',{tool:a.dataset.stan!,role,src:source});}});
const menu=document.getElementById('mobile-menu') as HTMLDialogElement;
const toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
document.querySelector('.menu-close')?.addEventListener('click',()=>menu.close());
menu?.addEventListener('close',()=>{toggle?.setAttribute('aria-expanded','false');document.body.style.overflow='';(toggle as HTMLButtonElement)?.focus();});
const filters=[...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const categories=['all','game-day','scouting-lineups','recruiting'];
function filter(category:string,update=true){if(!categories.includes(category))category='all';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));document.querySelectorAll<HTMLElement>('#catalog-grid [data-cat]').forEach(c=>c.hidden=category!=='all'&&c.dataset.cat!==category);if(update){const u=new URL(location.href);category==='all'?u.searchParams.delete('cat'):u.searchParams.set('cat',category);history.replaceState(null,'',u);}const count=document.getElementById('result-count');if(count)count.textContent=`${category==='all'?9:3} tools`;}
if(filters.length){filter(q.get('cat')||variants[role].category,false);filters.forEach((b,i)=>{b.addEventListener('click',()=>filter(b.dataset.filter!));b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=filters[(i+(e.key==='ArrowRight'?1:-1)+filters.length)%filters.length];next.focus();filter(next.dataset.filter!);}})});const pin=q.get('tool');if(pin){const pinned=document.querySelector<HTMLElement>(`#catalog-grid [data-slug="${CSS.escape(pin)}"]`);if(pinned)pinned.parentElement?.prepend(pinned);}}
const form=document.getElementById('request-form') as HTMLFormElement|null;
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);if(data.get('company_website'))return;const text=`Custom basketball tool request\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nRole: ${data.get('role')}\nProgram & level: ${data.get('program')||'Not specified'}\nTimeline: ${data.get('timeline')||'Not specified'}\nBudget: ${data.get('budget')||'Not specified'}\n\nWhat I want to track:\n${data.get('whatYouTrack')}`;const output=document.getElementById('request-output')!;output.textContent=text;output.hidden=false;const status=document.getElementById('request-status')!;status.textContent='Your brief is ready. Copy it below, then open the Stan request page to share it with Jackson. Nothing has been sent yet.';document.getElementById('request-handoff')!.hidden=false;output.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
document.getElementById('copy-request')?.addEventListener('click',async()=>{const output=document.getElementById('request-output')!;const status=document.getElementById('request-status')!;try{await navigator.clipboard.writeText(output.textContent||'');status.textContent='Brief copied. Open the Stan request page to send it to Jackson.';}catch{status.textContent='Select and copy your brief above, then share it through Stan.';}});
