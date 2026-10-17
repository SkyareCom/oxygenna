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
test('fotografias independentes em alta definição substituem atlas pixelado',()=>{
 const css=readFileSync(new URL('../dist/module01-media.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const source=readFileSync(new URL('../dist/module01-media.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(css,/m01-atlas|m01-sprite/);
 assert.doesNotMatch(source,/m01-atlas|m01-sprite/);
 for(const photo of ['timeline','oxygen','chambers','explore','journey']){
  const path='../dist/assets/m01-'+photo+'.webp';
  const binary=readFileSync(new URL(path,import.meta.url));
  assert.ok(binary.length>80000,photo+' não pode voltar a miniatura de baixa resolução');
  assert.equal(binary.subarray(0,4).toString('ascii'),'RIFF',photo);
  assert.equal(binary.subarray(8,12).toString('ascii'),'WEBP',photo);
  assert.ok(source.includes('./assets/m01-'+photo+'.webp'),photo);
 }
 const topic=renderModuleTopic('01',2,ctx);
 assert.ok(topic.includes('<img src="./assets/m01-oxygen.webp"'));
 assert.ok(topic.includes('class="m01-zoom"'));
 assert.ok(!topic.includes('m01-atlas.avif'));
 assert.ok(html.includes('./module01-media.css?rev=m01-hd-20261017'));
 assert.ok(html.includes('./app.mjs?rev=m01-hd-20261017'));
 assert.ok(app.includes('handleModule01Click(event.target)'));
 assert.ok(app.includes('handleModule01Input(event.target)'));
 assert.ok(!source.includes('https://')&&!source.includes('http://'));
});
