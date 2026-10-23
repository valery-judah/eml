import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projectRoot } from './render.mjs';

const point = (x, y, z) => [325 + (x - y) * 1.12, 320 + (x + y) * .49 - z];
const xy = p => p.map(n => n.toFixed(2)).join(',');
const projected = (x, y, z) => xy(point(x, y, z));
const polygon = (points, attrs = '') => `<polygon points="${points.map(p => projected(...p)).join(' ')}" ${attrs}/>`;
const line = (a, b, attrs = '') => `<line x1="${point(...a)[0]}" y1="${point(...a)[1]}" x2="${point(...b)[0]}" y2="${point(...b)[1]}" ${attrs}/>`;
const pathFrom = points => `M${points.map(xy).join('L')}`;
let art = `<svg xmlns="http://www.w3.org/2000/svg" width="650" height="640" viewBox="0 0 650 640" fill="none"><defs><pattern id="dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="var(--art-dot, #b5c5d8)" opacity=".55"/></pattern><filter id="shadow" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="14"/></filter></defs><rect x="20" y="22" width="610" height="587" fill="url(#dots)"/><ellipse cx="327" cy="551" rx="191" ry="22" fill="var(--art-shadow, #9bafc7)" opacity=".13" filter="url(#shadow)"/>`;

for (const [x,y] of [[-112,-112],[112,-112],[112,112],[-112,112]]) {
  art += line([x,y,-150],[x,y,153],'stroke="var(--art-guide, #b7c6d8)" stroke-width=".8" stroke-dasharray="3 5"');
}

function plane(z, name, index) {
  const size = 112;
  art += polygon([[-size,size,z],[size,size,z],[size,size,z-12],[-size,size,z-12]], 'fill="var(--art-surface-side, #e0e7ef)" stroke="var(--art-line, #7e95ae)" stroke-width=".9"');
  art += polygon([[size,-size,z],[size,size,z],[size,size,z-12],[size,-size,z-12]], 'fill="var(--art-surface-edge, #d1dbe7)" stroke="var(--art-line, #7e95ae)" stroke-width=".9"');
  art += polygon([[-size,-size,z],[size,-size,z],[size,size,z],[-size,size,z]], 'fill="var(--art-surface, #edf1f6)" stroke="var(--art-line, #7e95ae)" stroke-width="1"');
  for (let n = -96; n <= 96; n += 16) {
    art += line([n,-size,z],[n,size,z],'stroke="var(--art-grid, #afc0d3)" stroke-width=".55"');
    art += line([-size,n,z],[size,n,z],'stroke="var(--art-grid, #afc0d3)" stroke-width=".55"');
  }
  for (const [x,y] of [[-112,-112],[112,-112],[112,112],[-112,112]]) {
    const [px,py] = point(x,y,z);
    art += `<circle cx="${px}" cy="${py}" r="2.5" fill="var(--art-node, #f3f5f7)" stroke="var(--art-detail, #5f7b9c)" stroke-width="1"/>`;
  }
  const [lx,ly] = point(106,-110,z);
  art += `<path d="M${lx+8},${ly-1}h31l12,-12" stroke="var(--art-line, #7e95ae)" stroke-width=".7"/><text x="625" y="${ly-22}" text-anchor="end" fill="var(--art-ink, #617892)" font-family="monospace" font-size="7" letter-spacing="1">${index} / ${name}</text>`;
}

plane(-145,'EVIDENCE','03');
const bottomRoute = [[-80,45,-144],[-30,45,-144],[-30,0,-144],[30,0,-144],[30,-48,-144],[75,-48,-144]];
art += `<path d="${pathFrom(bottomRoute.map(p => point(...p)))}" stroke="var(--art-accent, #477aa6)" stroke-width="2.2"/>`;
for (const p of [bottomRoute[0],bottomRoute.at(-1)]) {const [x,y]=point(...p);art+=`<circle cx="${x}" cy="${y}" r="3.5" fill="var(--art-accent, #477aa6)"/>`;}
for (let i=0;i<3;i++) {
  const x=70+i*12,y=64;
  art += polygon([[x,y,-144],[x+7,y,-144],[x+7,y+7,-144],[x,y+7,-144]],'fill="var(--art-line, #7e95ae)"');
}

art += line([-64,30,-140],[-64,30,-4],'stroke="var(--art-accent, #477aa6)" stroke-width="1.5" stroke-dasharray="4 5"');
plane(0,'ENGINEERING','02');

const torusPoint = (u,v) => point((65+21*Math.cos(v))*Math.cos(u), (65+21*Math.cos(v))*Math.sin(u), 38+21*Math.sin(v));
art += `<ellipse cx="325" cy="311" rx="122" ry="45" fill="var(--art-accent, #477aa6)" opacity=".12"/>`;
for (let j=0;j<46;j++) {
  const u=j*Math.PI*2/46;
  const points=[];
  for (let k=0;k<=50;k++) points.push(torusPoint(u,k*Math.PI*2/50));
  art += `<path d="${pathFrom(points)}" stroke="${j<23?'var(--art-accent, #477aa6)':'var(--art-accent, #477aa6)'}" stroke-width="1.1"/>`;
}
for (let j=0;j<13;j++) {
  const v=j*Math.PI*2/13;
  const points=[];
  for (let k=0;k<=100;k++) points.push(torusPoint(k*Math.PI*2/100,v));
  art += `<path d="${pathFrom(points)}" stroke="var(--art-accent, #477aa6)" stroke-width=".75"/>`;
}
art += `<text x="325" y="318" text-anchor="middle" fill="var(--art-accent-text, #355f86)" font-family="monospace" font-size="8" letter-spacing="1">AI</text>`;

plane(145,'PRODUCT INTENT','01');
art += polygon([[-56,-40,146],[40,-40,146],[40,40,146],[-56,40,146]],'fill="var(--art-panel, #d0ddea)" stroke="var(--art-line, #7e95ae)" stroke-width="1"');
art += polygon([[-40,-24,147],[24,-24,147],[24,24,147],[-40,24,147]],'fill="var(--art-panel-inset, #e8eff7)" stroke="var(--art-line, #7e95ae)" stroke-width=".8"');
for (const [x,y] of [[-80,-64],[-80,64],[72,-64],[72,64]]) {
  art += polygon([[x-5,y-5,147],[x+5,y-5,147],[x+5,y+5,147],[x-5,y+5,147]],'fill="var(--art-detail, #5f7b9c)"');
}
art += `<path d="${pathFrom([[-80,-64,148],[-80,-80,148],[72,-80,148],[72,-64,148]].map(p=>point(...p)))}" stroke="var(--art-detail, #5f7b9c)" stroke-width="1.3"/>`;

const route=[point(-112,-112,145),[72,122],[37,144],[37,396],point(-112,112,-145)];
art += `<path d="${pathFrom(route)}" stroke="var(--art-accent, #477aa6)" stroke-width="1.4" stroke-dasharray="3 4"/>`;
for(const [x,y] of [route[0],route.at(-1)]) art+=`<circle cx="${x}" cy="${y}" r="4" fill="var(--art-accent, #477aa6)"/><circle cx="${x}" cy="${y}" r="8" stroke="var(--art-accent, #477aa6)" opacity=".4"/>`;
art += `<text x="25" y="281" transform="rotate(-90 25 281)" fill="var(--art-accent-text, #355f86)" font-family="monospace" font-size="6.5" letter-spacing="1.2">CONTINUOUS LEARNING</text>`;
art += `<path d="M22 39h8m-4-4v8M616 579h8m-4-4v8" stroke="var(--art-ink, #617892)" stroke-width=".8"/><text x="325" y="594" text-anchor="middle" fill="var(--art-ink, #617892)" font-family="monospace" font-size="7" letter-spacing="1.3">CONNECTED BY DESIGN.</text></svg>`;

await writeFile(path.join(projectRoot,'assets/system.svg'),art);
console.log('Generated the original EML Systems illustration.');
