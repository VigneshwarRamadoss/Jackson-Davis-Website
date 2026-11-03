import sharp from 'sharp';
import {mkdir,copyFile,access,writeFile} from 'node:fs/promises';
await mkdir('public/fonts',{recursive:true});
for(const font of ['familjen-grotesk','geist','geist-mono'])await copyFile(`node_modules/@fontsource-variable/${font}/files/${font}-latin-wght-normal.woff2`,`public/fonts/${font}.woff2`);
const tools=JSON.parse(await (await import('node:fs/promises')).readFile('src/data/tools.json','utf8'));
const screenshots={};
for(const tool of tools){
  const candidates=tool.slug==='live-play-call-tracker'?['lpct-hero',tool.slug]:[tool.slug];
  for(const name of candidates){
    const input=`public/images/${name}.png`;
    try{await access(input);}catch{continue;}
    const metadata=await sharp(input).metadata();
    const widths=[...new Set([480,960,1600].map(w=>Math.min(w,metadata.width)))].sort((a,b)=>a-b);
    for(const width of widths)await sharp(input).resize({width}).webp({quality:88}).toFile(`public/images/${name}-${width}.webp`);
    screenshots[tool.slug]={src:`/images/${name}-${widths.at(-1)}.webp`,srcset:widths.map(w=>`/images/${name}-${w}.webp ${w}w`).join(', '),width:metadata.width,height:metadata.height};
    break;
  }
}
await writeFile('src/data/screenshots.json',JSON.stringify(screenshots,null,2)+'\n');
console.log(`Prepared fonts and ${Object.keys(screenshots).length} product screenshots.`);
