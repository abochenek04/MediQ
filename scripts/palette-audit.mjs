import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const css=readFileSync('src/styles.css','utf8');
const color=name=>{const matches=[...css.matchAll(new RegExp(`--${name}:\\s*(#[a-fA-F0-9]{6}|var\\(--[a-z-]+\\))`,'g'))];assert(matches.length,`Missing ${name}`);const value=matches.at(-1)[1];return value.startsWith('var(')?color(value.slice(6,-1)):value;};
const luminance=c=>c.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
for(const [foreground,background] of [['brand-on-color','brand-primary'],['brand-on-color','brand-secondary'],['ink','white'],['muted','white'],['teal','white'],['ink','background'],['muted','background'],['primary-text','primary-tint'],['link','surface'],['brand-on-color','stage-check-in'],['ink-deep','stage-wait'],['ink-deep','stage-care'],['brand-on-color','stage-check-out']]){
 const a=luminance(color(foreground)),b=luminance(color(background)),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 assert(ratio>=4.5,`${foreground}/${background}: ${ratio.toFixed(2)} < 4.5`);console.log(`${foreground}/${background}: ${ratio.toFixed(2)}:1`);
}
console.log('Core text palette meets WCAG AA 4.5:1; this is not a full accessibility audit.');
