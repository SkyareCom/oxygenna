import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {modules} from '../dist/curriculum.mjs';
import {topicReadings,cameraLessonAtTopic,camaraAtTopic,topicReading} from '../dist/topic-readings.mjs';
import {renderModule,renderModuleTopic,moduleTopicHref} from '../dist/curriculum-view.mjs';
import {activeSection} from '../dist/navigation.mjs';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',lessons:[],e,icon:name=>'<i data-icon="'+name+'"></i>',back:url=>'<a class="back" href="'+url+'">Voltar</a>',sourceLinks:()=>'',notFound:()=>'<p>404</p>',context:'chamber'};
test('todos os 24 capítulos exibem seis cards e não exibem OBJETIVO DE APRENDIZAGEM',()=>{
 for(const m of modules){
  const html=renderModule(m.id,{...ctx,context:'all'});
  assert.equal((html.match(/class="lesson-link module-topic-card"/g)||[]).length,6,m.id);
  assert.ok(html.includes('Temas do módulo'),m.id);
  assert.ok(!html.includes('Objetivo de aprendizagem'),m.id);
  assert.ok(!html.includes('camara-inline-chapter'),m.id);
  for(let i=0;i<6;i++)assert.ok(html.includes('href="'+moduleTopicHref(m.id,i,'all')+'"'),m.id+':'+i);
 }
});
test('144 temas têm conteúdo específico sem texto genérico duplicado',()=>{
 assert.equal(Object.keys(topicReadings).length,24);
 const unique=new Set();
 for(const m of modules){
  assert.equal(topicReadings[m.id].length,6,m.id);
  for(let i=0;i<6;i++){
   const notes=topicReading(m.id,i);
   assert.ok(notes.length>0,m.id+':'+i);
   for(const p of notes){
    assert.ok(p.length>=115,m.id+':'+i);
    assert.ok(!unique.has(p),'repetição '+m.id+':'+i);
    unique.add(p);
   }
   const html=renderModuleTopic(m.id,i,{...ctx,context:'all'});
   assert.ok(html.includes('class="panel topic-reading"'),m.id+':'+i);
   assert.ok(html.includes(e(m.pt.topics[i])),m.id+':'+i);
   assert.ok(html.includes('href="#module/'+m.id+'/all"'),m.id+':'+i);
   assert.ok(!html.includes('Objetivo de aprendizagem'),m.id+':'+i);
  }
 }
});
test('oito materiais CÂMARA são mapeados uma única vez ao tema certo',()=>{
 assert.equal(Object.keys(cameraLessonAtTopic).length,8);
 assert.equal(new Set(Object.values(cameraLessonAtTopic)).size,8);
 assert.equal(camaraAtTopic('01',3),'camara-04');
 assert.equal(camaraAtTopic('04',2),'camara-03');
 assert.equal(camaraAtTopic('08',1),'camara-06');
 const m1=renderModule('01',ctx);
 assert.ok(m1.includes('História e desenvolvimento'));
 assert.ok(m1.includes('Papel da equipe de saúde'));
 assert.ok(!m1.includes('CONTEÚDOS DO CAPÍTULO'));
 assert.ok(m1.includes('class="chamber-lesson"'));
 assert.equal((m1.match(/class="chamber-topic"/g)||[]).length,6);
 assert.ok(!m1.includes('module-topic-card'));
 assert.ok(!m1.includes('href="#topic/01/0/chamber"'));
 const pt=renderModuleTopic('01',3,ctx);
 assert.ok(pt.includes('m01-hotspots'));
 assert.ok(pt.includes('src="./assets/m01-foto-monoplace.webp?rev=knowledge-final-20261018"'));
 assert.ok(!renderModuleTopic('01',4,ctx).includes('data-m01-quiz="3"'),'não repetir questionário de outros temas');
 assert.equal(activeSection('topic/01/3/chamber'),'chamber');
 assert.equal(activeSection('topic/13/0/all'),'chapters');
});
test('rotas inválidas não abrem texto e o CSS da HOME permanece isolado',()=>{
 for(const route of [['99','0'],['01','6'],['01','-1'],['01','foo']])assert.equal(renderModuleTopic(...route,ctx),'<p>404</p>');
 const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.ok(css.includes('.module .module-topic-title'));
 assert.ok(css.includes('.topic .topic-reading'));
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes('app.mjs?rev=gold-footer-home-credits-20261018'));
});
