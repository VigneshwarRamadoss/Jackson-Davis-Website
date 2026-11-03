import sharp from 'sharp';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/fonts',{recursive:true});
for(const font of ['familjen-grotesk','geist','geist-mono'])await copyFile(`node_modules/@fontsource-variable/${font}/files/${font}-latin-wght-normal.woff2`,`public/fonts/${font}.woff2`);
await sharp('public/images/courtside.png').webp({quality:88}).toFile('public/images/courtside.webp');
console.log('Optimized supplied hero image.');
