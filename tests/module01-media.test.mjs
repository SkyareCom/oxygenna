import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderModuleTopic} from '../dist/curriculum-view.mjs';
import {renderModule01Media,renderModule01Visual} from '../dist/module01-media.mjs';
const e=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',lessons:[],e,icon:()=>'<i></i>',back:h=>'<a href="'+h+'">Voltar</a>',sourceLinks:()=>'',notFound:()=>'<p>404</p>',context:'chamber'};
const expected=[
 ['experimentacao','camara-clinica','pratica-atual'],
 ['subaquatica'],
 ['oxigenio'],
 ['monoplace','multiplace','componentes'],
 ['preparacao','exposicao'],
 []
];
test('10 imagens independentes estão posicionadas entre explicações em seus temas pertinentes',()=>{
 const all=[];
 for(let i=0;i<6;i++){
  const html=renderModuleTopic('01',i,ctx);
  const media=[...html.matchAll(/data-m01-picture="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(media,expected[i],String(i));
  assert.ok(html.includes('class="m01-media"'),String(i));
  assert.equal((html.match(/m01-quiz" data-m01-quiz=/g)||[]).length,1,String(i));
  assert.ok(!html.includes('camara-topic-extras'),'aulas antigas duplicadas');
  assert.ok(!html.includes('m01-zoom'),'sem botões ampliar');
  if(media.length){
   const before=html.indexOf('class="panel topic-reading"');
   const img=html.indexOf('data-m01-picture=');
   assert.ok(before>=0&&img>before,'imagem deve vir depois da explicação do tema');
  }
  all.push(...media);
 }
 assert.equal(all.length,10);
 assert.equal(new Set(all).size,10);
});
test('módulo 01 reparte explicações e figuras; material visual não duplica outros módulos',()=>{
 const html=renderModuleTopic('01',3,ctx);
 const idx1=html.indexOf('data-m01-picture="monoplace"');
 const idx2=html.indexOf('data-m01-picture="multiplace"');
 const idx3=html.indexOf('data-m01-picture="componentes"');
 assert.ok(idx1>0&&idx2>idx1&&idx3>idx2);
 assert.ok(html.indexOf('class="panel topic-reading"',idx1)>idx1,'texto entre as imagens');
 assert.ok(html.indexOf('data-m01-hotspots')>idx3,'atividade interativa após as figuras');
 assert.equal(renderModule01Media('03',0,ctx),'');
 assert.equal(renderModule01Visual('03',0,'first',ctx),'');
 assert.ok(!renderModuleTopic('02',0,ctx).includes('data-m01-picture'));
});
test('as 10 mídias WebP existem com resolução preservada, sem atlas ou miniaturas',()=>{
 const source=readFileSync(new URL('../dist/module01-media.mjs',import.meta.url),'utf8');
 const css=readFileSync(new URL('../dist/module01-media.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/m01-atlas|m01-sprite|m01-zoom/);
 assert.doesNotMatch(css,/m01-zoom|m01-sprite/);
 for(const n of expected.flat()){
  const bin=readFileSync(new URL('../dist/assets/m01-'+n+'.webp',import.meta.url));
  assert.ok(bin.length>(n==='oxigenio'?30000:100000),n);
  assert.equal(bin.subarray(0,4).toString('ascii'),'RIFF',n);
  assert.equal(bin.subarray(8,12).toString('ascii'),'WEBP',n);
  assert.ok(source.includes('./assets/m01-'+n+'.webp'),n);
 }
 const old=['timeline','oxygen','chambers','explore','journey'];
 for(const n of old)assert.ok(!source.includes('./assets/m01-'+n+'.webp'),n);
 assert.ok(html.includes('module01-media.css?rev=m01-context-20261017'));
 assert.ok(html.includes('app.mjs?rev=m01-context-20261017'));
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
