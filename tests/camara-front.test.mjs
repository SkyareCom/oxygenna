import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {camaraData,camaraLessons,camaraLesson,camaraBoyle,camaraPIO2,camaraAnswer} from '../dist/camara-data.mjs';
import {camaraRoutes,renderCamaraDetail,renderCamaraModuleContent,camaraGraphText} from '../dist/camara-view.mjs';
import {CAMARA_MODULE_LESSONS,camaraModuleForLesson} from '../dist/camara-module-map.mjs';
import {activeSection} from '../dist/navigation.mjs';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',e,icon:name=>'<i data-icon="'+name+'"></i>',back:href=>'<a class="back" href="'+href+'">Voltar</a>',notFound:()=>'<p>404</p>'};
test('pacote completo com 8 capítulos reais na mesma ordem do pacote autoral',()=>{
 const data=JSON.parse(readFileSync(new URL('../content/camara/chapters.pt-BR.json',import.meta.url),'utf8'));
 assert.deepEqual(camaraLessons,data.lessons);
 assert.deepEqual(camaraData.sources,data.sources);
 assert.equal(camaraLessons.length,8);
 assert.equal(camaraRoutes.length,8);
 assert.equal(new Set(camaraRoutes).size,8);
});
test('os oito conteúdos aparecem dentro de capítulos pré-existentes, sem grade paralela',()=>{
 const ids=Object.values(CAMARA_MODULE_LESSONS).flat();
 assert.equal(ids.length,8);
 assert.equal(new Set(ids).size,8);
 assert.deepEqual(ids.slice().sort(),camaraLessons.map(x=>x.id).sort());
 assert.deepEqual(Object.keys(CAMARA_MODULE_LESSONS),['01','02','04','05','06']);
 for(const lesson of camaraLessons){
  const moduleId=camaraModuleForLesson(lesson.id);
  const html=renderCamaraModuleContent(moduleId,ctx);
  assert.ok(html.includes('id="conteudo-'+lesson.id+'"'),lesson.id);
  assert.ok(html.includes(lesson.title),lesson.id);
  assert.ok(html.includes(lesson.objective),lesson.id);
 }
 assert.ok(!renderCamaraModuleContent('03',ctx),'sem conteúdo artificial em outro capítulo');
});
test('cada página mantém back contextual, conteúdo, atividade e a navegação',()=>{
 for(const l of camaraLessons){
  const html=renderCamaraDetail(l.id,ctx);
  assert.ok(html.includes('class="back" href="#module/'+camaraModuleForLesson(l.id)+'/chamber"'),l.id);
  assert.ok(html.includes(e(l.title)),l.id);
  assert.ok(html.includes(e(l.objective)),l.id);
  assert.ok(html.includes('camara-quiz'),l.id);
  assert.ok(html.includes('camara-step-nav'),l.id);
  assert.ok(!html.includes('<footer'),l.id);
 }
 assert.equal(renderCamaraDetail('unknown',ctx),'<p>404</p>');
 assert.equal(activeSection('camara/camara-01'),'chamber');
});
test('não há gerador de catálogo duplicado e módulos 07/08 ficam fora de CÂMARA',()=>{
 const view=readFileSync(new URL('../dist/camara-view.mjs',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const css=readFileSync(new URL('../dist/camara.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(!view.includes('renderCamaraCatalog'),'grade antiga não deve mais existir');
 assert.ok(!view.includes('camara-chapter-grid'),'nenhum card paralelo');
 assert.ok(!app.includes('renderCamaraCatalog'),'não inserir catálogo na aba');
 assert.ok(!css.includes('.camara-chapter-grid'),'CSS antigo eliminado');
 assert.ok(html.includes('app.mjs?rev=photo-atm-central-refs-20261019'),'novo JS deve carregar com versão');
 assert.equal(Object.values(CAMARA_MODULE_LESSONS).flat().length,8);
 assert.ok(!('07' in CAMARA_MODULE_LESSONS));
 assert.ok(!('08' in CAMARA_MODULE_LESSONS));
});
test('atividades científicas validam resultado, unidades e resposta',()=>{
 assert.equal(camaraBoyle(2.5),0.4);
 assert.equal(camaraPIO2(2.4,1),1777);
 assert.equal(camaraAnswer('camara-02',0.4).correct,true);
 assert.equal(camaraAnswer('camara-02',0.0).correct,false);
 for(const lesson of camaraLessons){
  const a=lesson.activity,correct=a.type==='calculation'?a.expected:a.data.correctIndex;
  assert.equal(camaraAnswer(lesson.id,correct).correct,true,lesson.id);
 }
 assert.match(camaraGraphText('inspiredOxygenHumidified',2.4),/não é PaO₂/);
});
test('todas as mídias de diagrama têm arquivo estático real do front',()=>{
 for(const lesson of camaraLessons){
  const html=renderCamaraDetail(lesson.id,ctx);
  for(const media of lesson.media.filter(x=>x.type==='diagram')){
   const name=media.asset.split('/').at(-1);
   assert.ok(html.includes('./assets/'+name),lesson.id);
   const s=readFileSync(new URL('../dist/assets/'+name,import.meta.url),'utf8');
   assert.ok(s.includes('<svg'),name);
  }
 }
});
test('troca de idioma não altera o idioma clínico silenciosamente',()=>{
 for(const lang of ['en','es']){
  const x=renderCamaraDetail('camara-01',{...ctx,lang});
  assert.match(x,/(translation is pending|traducción está pendiente)/);
  assert.match(x,/lang="pt-BR"/);
 }
});
test('o CSS adicional só atinge as seções originais CÂMARA e suas páginas',()=>{
 const css=readFileSync(new URL('../dist/camara.css',import.meta.url),'utf8');
 assert.ok(css.includes('.module .camara-inline-chapter'));
 assert.ok(css.includes('.camara .panel'));
 assert.doesNotMatch(css,/(^|\n)\s*(body|header|footer|html|:root|\.bottom-nav|\.app-header)\s*[{,]/);
});
test('navegação integrada: CÂMARA mantém conteúdo antigo, novo, rodapé e progresso',async()=>{
 const saved=Object.fromEntries(['window','document','location','history'].map(k=>[k,globalThis[k]]));
 let html='',answerEvents=[],inputEvents=[],routeEvents={},store=new Map();
 const app={set innerHTML(v){html=v;}};
 const main=()=>html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
 globalThis.location={hash:'#chamber'};
 globalThis.history={replaceState(_a,_b,hash){location.hash=hash;}};
 globalThis.window={localStorage:{getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)},addEventListener:(key,cb)=>routeEvents[key]=cb,scrollTo(){},scrollY:0};
 globalThis.document={documentElement:{lang:''},title:'',querySelector:key=>key==='#app'?app:key==='.skip'?{textContent:''}:key==='#main'?{focus(){}}:null,addEventListener:(key,cb)=>{if(key==='click')answerEvents.push(cb);if(key==='input')inputEvents.push(cb);}};
 try{
  await import('../dist/app.mjs?camara-front-integration');
  const go=route=>{location.hash=route;routeEvents.hashchange();};
  assert.ok(main().includes('href="#module/01/chamber"'),'original chapter links remain');
  assert.ok(main().includes('href="#lab"'),'original laboratory link remains');
  assert.ok(!main().includes('camara-chapter-grid'),'grade duplicada não aparece na aba');
  assert.ok(!main().includes('href="#module/07/chamber"'));
  assert.ok(!main().includes('href="#module/08/chamber"'));
  assert.ok(main().includes('href="#module/05/chamber"'));
  assert.equal((main().match(/href="#module\/0[1-6]\/chamber"/g)||[]).length,6);
  const footer=()=>html.match(/<nav class="bottom-nav[\s\S]*?<\/nav>/)?.[0]??'';
  assert.equal((footer().match(/<a /g)||[]).length,5);
  go('#module/01/chamber');
  assert.ok(!main().includes('Temas do módulo'));
  assert.ok(main().includes('História e desenvolvimento'));
  assert.ok(main().includes('Câmaras monoplace e multiplace'));
  assert.ok(!main().includes('href="#topic/01/1/chamber"'));
  assert.ok(!main().includes('Objetivo de aprendizagem'));
  assert.ok(!main().includes('camara-inline-chapter'));
  assert.ok(!main().includes('camara-chapter-grid'));
  go('#topic/01/1/chamber');
  assert.ok(main().includes('A medicina subaquática estuda o organismo'));
  assert.ok(main().includes('data-m01-picture="subaquatica"'));
  assert.ok(footer().includes('href="/camara" class="active"'));
  go('#camara/camara-01'); // Rota legada mantém seus exercícios e registro de progresso.
  const target={dataset:{camaraAnswer:'1',camaraId:'camara-01'},hasAttribute:()=>false};
  for(const cb of answerEvents)cb({target:{closest:sel=>sel==='button'?target:null},preventDefault(){}});
  const progress=JSON.parse(store.get('hyperbaric-campus-v1'));
  assert.equal(progress.completed.filter(x=>x==='camara-01').length,1);
  assert.ok(main().includes('CORRETO.'));
  // Repetição não duplica conclusão.
  for(const cb of answerEvents)cb({target:{closest:sel=>sel==='button'?target:null},preventDefault(){}});
  assert.equal(JSON.parse(store.get('hyperbaric-campus-v1')).completed.filter(x=>x==='camara-01').length,1);
  go('#topic/02/0/chamber');
  assert.ok(main().includes('id="camara-pressure"'));
  assert.ok(main().includes('id="camara-calc-answer"'));
  go('#home');
  assert.ok(main().includes('Ciência sob pressão.'));
  assert.ok(footer().includes('href="/home" class="active"'));
 }finally{for(const [key,value] of Object.entries(saved)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
