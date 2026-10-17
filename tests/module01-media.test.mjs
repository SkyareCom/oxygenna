import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderModuleTopic} from '../dist/curriculum-view.mjs';
import {renderModule01Media} from '../dist/module01-media.mjs';
const e=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',lessons:[],e,icon:()=>'<i></i>',back:h=>'<a href="'+h+'">Voltar</a>',sourceLinks:()=>'',notFound:()=>'<p>404</p>',context:'chamber'};
test('mídias estão distribuídas nas posições certas dos 6 temas do módulo 01',()=>{
 const expected=[
  ['timeline','m01-timeline'],
  ['m01-pressure','m01-dive'],
  ['oxygen','m01-oxygen'],
  ['chambers','explore'],
  ['journey','m01-journey'],
  ['m01-glossary']
 ];
 for(let i=0;i<6;i++){
  const html=renderModuleTopic('01',i,ctx);
  assert.match(html,/class="m01-media"/,String(i));
  for(const key of expected[i])assert.ok(html.includes(key),i+' '+key);
  assert.equal((html.match(/class="m01-quiz"/g)||[]).length,0,'renderização HTML deve conter 1 quiz em cada tema');
  assert.equal((html.match(/m01-quiz" data-m01-quiz=/g)||[]).length,1,String(i));
  assert.ok(!html.includes('camara-topic-extras'),'conteúdo antigo duplicado no módulo 01');
 }
});
test('módulos além do 01 preservam fluxo prévio e mídias originais',()=>{
 assert.equal(renderModule01Media('03',0,ctx),'');
 assert.ok(!renderModuleTopic('02',0,ctx).includes('data-m01-topic='));
});
test('fotografias estão no atlas estático do próprio app e nunca em URLs externas',()=>{
 const css=readFileSync(new URL('../dist/module01-media.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const source=readFileSync(new URL('../dist/module01-media.mjs',import.meta.url),'utf8');
 assert.match(css,/m01-atlas.avif/);
 for(const photo of ['timeline','oxygen','chambers','explore','journey'])
  assert.ok(css.includes('[data-m01-photo="'+photo+'"]'),photo);
 assert.ok(html.includes('./module01-media.css?rev=m01-media-20261017'));
 assert.ok(html.includes('./app.mjs?rev=m01-media-20261017'));
 assert.ok(app.includes('handleModule01Click(event.target)'));
 assert.ok(app.includes('handleModule01Input(event.target)'));
 const atlas=readFileSync(new URL('../dist/assets/m01-atlas.avif',import.meta.url));
 assert.equal(atlas.subarray(4,12).toString('ascii'),'ftypavif');
 assert.ok(atlas.length>1000);
 assert.doesNotMatch(source,/https?:\/\//);
});
