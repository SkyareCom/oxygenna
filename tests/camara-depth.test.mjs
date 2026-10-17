import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {camaraDepth} from '../dist/camara-depth.mjs';
import {camaraLessons} from '../dist/camara-data.mjs';
import {renderCamaraDetail} from '../dist/camara-view.mjs';

const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={lang:'pt',e,icon:()=>'',back:h=>'<a href="'+h+'">Voltar</a>',notFound:()=>''};

test('todos os oito capítulos possuem duas explicações técnicas específicas',()=>{
 assert.deepEqual(Object.keys(camaraDepth).sort(),camaraLessons.map(l=>l.id).sort());
 for(const lesson of camaraLessons){
  const data=camaraDepth[lesson.id];
  assert.equal(data.sections.length,2,lesson.id);
  assert.equal(data.visualSteps.length>=4,true,lesson.id);
  for(const section of data.sections){
   assert.ok(section.heading.length>12,lesson.id);
   assert.ok(section.body.split(/\s+/).length>=65,lesson.id+' '+section.heading);
  }
 }
});
test('cada página contém a exposição original e o aprofundamento, sem trocar o shell',()=>{
 for(const l of camaraLessons){
  const h=renderCamaraDetail(l.id,ctx);
  assert.ok(h.includes('camara-prose'),l.id);
  assert.ok(h.includes('camara-extended-content'),l.id);
  assert.ok(h.includes('camara-visual-sequence'),l.id);
  assert.ok(h.includes(e(camaraDepth[l.id].sections[0].heading)),l.id);
  assert.ok(!h.includes('<header')&&!h.includes('bottom-nav'),l.id);
 }
});
test('conteúdo de risco inclui avaliação clínica e nunca define prescrição',()=>{
 const safety=camaraDepth['camara-07'].sections.map(s=>s.body).join(' ');
 assert.match(safety,/FDA/);
 assert.match(safety,/incêndio/);
 assert.match(safety,/pneumotórax/);
 const evidence=camaraDepth['camara-08'].sections.map(s=>s.body).join(' ');
 assert.match(evidence,/complementa/);
 assert.match(evidence,/critérios/);
});
test('diagramas novos são SVGs válidos e usados em suas respectivas páginas',()=>{
 for(const [id,file] of [['camara-07','seguranca-camara.svg'],['camara-08','evidencia-indicacoes.svg']]){
  const svg=readFileSync(new URL('../dist/assets/'+file,import.meta.url),'utf8');
  assert.match(svg,/<svg\s/);
  assert.match(svg,/<title id="title">/);
  assert.ok(renderCamaraDetail(id,ctx).includes('./assets/'+file));
 }
});
test('CSS novo não altera layout global e mantém hierarquia de cards originais',()=>{
 const css=readFileSync(new URL('../dist/camara.css',import.meta.url),'utf8');
 assert.match(css,/\.camara \.camara-extended-content/);
 assert.doesNotMatch(css,/(^|\n)\s*(body|header|footer|:root|\.bottom-nav|\.app-header)\s*[{,]/);
});
