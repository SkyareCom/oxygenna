import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderModuleTopic} from '../dist/curriculum-view.mjs';
import {renderModule01Media,renderModule01Visual} from '../dist/module01-media.mjs';
const e=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',lessons:[],e,icon:()=>'<i></i>',back:h=>'<a href="'+h+'">Voltar</a>',sourceLinks:()=>'',notFound:()=>'<p>404</p>',context:'chamber'};
const expected=[['experimentacao','pratica-atual'],['subaquatica'],['oxigenio'],['monoplace','multiplace'],['preparacao'],[]];
test('sete imagens científicas selecionadas e intercaladas nos seis temas',()=>{
 const selected=[];
 for(let i=0;i<6;i++){
  const html=renderModuleTopic('01',i,ctx);
  const pics=[...html.matchAll(/data-m01-picture="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(pics,expected[i],String(i));
  assert.ok(!html.includes('m01-zoom'));
  selected.push(...pics);
 }
 assert.equal(selected.length,7);
 assert.equal(new Set(selected).size,7);
 const types=renderModuleTopic('01',3,ctx);
 assert.ok(types.includes('data-m01-hotspots'),'exploração orientada das câmaras');
 assert.ok(!types.includes('data-m01-quiz="3"'),'quiz redundante não reaparece');
 assert.ok(renderModuleTopic('01',2,ctx).includes('data-m01-oxygen'),'gráfico médico preservado');
 assert.ok(renderModuleTopic('01',4,ctx).includes('data-m01-stepper="journey"'),'animação preservada');
 assert.ok(renderModuleTopic('01',5,ctx).includes('m01-glossary'),'glossário preservado');
 for(let i=0;i<6;i++)assert.ok(!renderModuleTopic('01',i,ctx).includes('data-m01-quiz='),'quiz não deve interromper os temas');
});
test('fotos individuais e um único contorno continuam íntegras',()=>{
 const css=readFileSync(new URL('../dist/module01-media.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 assert.ok(css.includes('border:1px solid var(--card-border-gold'));
 assert.ok(css.includes('border:0;outline:0;box-shadow:none;border-radius:0'));
 for(const n of expected.flat()){
  const file=readFileSync(new URL('../dist/assets/m01-foto-'+n+'.webp',import.meta.url));
  assert.ok(file.length>30000,n);
  assert.equal(file.subarray(0,4).toString(),'RIFF');
  assert.equal(file.subarray(8,12).toString(),'WEBP');
 }
 assert.ok(html.match(/app\.mjs\?rev=[a-z0-9-]+/));
 assert.ok(app.includes('handleModule01Click(event.target)'));
 assert.ok(app.includes('handleModule01Input(event.target)'));
});

test('a ilustração estática com valores enganosos de PIO₂ não substitui o gráfico dinâmico',()=>{
 const topic=renderModuleTopic('01',2,ctx);
 assert.ok(topic.includes('data-m01-picture="oxigenio"'));
 assert.ok(topic.includes('data-m01-oxygen'));
 assert.ok(topic.includes('data-m01-point'));
 assert.ok(topic.includes('FiO₂ = 100%'));
});
