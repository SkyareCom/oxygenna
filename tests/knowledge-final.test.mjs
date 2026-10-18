import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderModule} from '../dist/curriculum-view.mjs';
import {knowledgeQuestions,renderKnowledgeCheck} from '../dist/knowledge-check.mjs';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const opts={lang:'pt',lessons:[],e,icon:()=>'',back:()=>'',sourceLinks:()=>'',notFound:()=>'',context:'chamber'};
test('seis capítulos abrem o TESTE O CONHECIMENTO exclusivamente após a aula',()=>{
 for(const id of ['01','02','03','04','05','06']){
  const h=renderModule(id,opts);
  assert.equal((h.match(/class="knowledge-check"/g)||[]).length,1,id);
  assert.equal((h.match(/class="chamber-topic"/g)||[]).length,6,id);
  assert.ok(h.includes('TESTE O CONHECIMENTO'),id);
  assert.ok(h.lastIndexOf('class="knowledge-check"')>h.lastIndexOf('class="chamber-topic"'),id);
  assert.ok(!h.includes('class="panel camara-quiz"'),'questão não pode interromper a leitura de '+id);
  assert.ok(!h.includes('data-m01-quiz='),'quiz legado não pode interromper '+id);
  assert.ok(!h.includes('Objetivo de aprendizagem'),id);
  const items=knowledgeQuestions[id];assert.ok(items.length>=3,id);
  for(const item of items){assert.ok(item.question.length>=20);assert.equal(item.options.length,3);assert.ok(item.correct>=0&&item.correct<3);}
 }
});
test('comparação entre O₂ normobárico e hiperbárico usa duas tabelas e um gráfico separado',()=>{
 const h=renderModule('01',opts);
 assert.equal((h.match(/class="oxygen-table-block"/g)||[]).length,2);
 assert.ok(h.includes('CONDIÇÕES DE ADMINISTRAÇÃO'));
 assert.ok(h.includes('RESPOSTA FISIOLÓGICA'));
 assert.ok(h.includes('Normobárico')&&h.includes('Hiperbárico'));
 assert.equal((h.match(/class="m01-plot"/g)||[]).length,1);
 const tableEnd=h.lastIndexOf('class="oxygen-comparison"');
 const chartStart=h.indexOf('data-m01-oxygen');
 assert.ok(tableEnd>=0&&chartStart>tableEnd,'gráfico deve vir depois das tabelas');
 assert.ok(!h.includes('data-m01-quiz='));
});
test('sete fotos limpas substituem pôsteres com títulos e mantêm borda única',()=>{
 const h=renderModule('01',opts);
 const photos=[...h.matchAll(/src="([^"]*m01-foto-[^"]+\.webp[^"]*)"/g)].map(x=>x[1]);
 assert.equal(photos.length,7);
 for(const file of photos){
  const name=file.split('/').at(-1).split('?')[0];
  const bin=readFileSync(new URL('../dist/assets/'+name,import.meta.url));
  assert.ok(bin.length>30000,name);
  assert.equal(bin.subarray(0,4).toString(),'RIFF');
  assert.equal(bin.subarray(8,12).toString(),'WEBP');
 }
 const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.ok(css.includes('.module .chamber-lesson .m01-context-figure{border:1px'));
 assert.ok(css.includes('.module .chamber-lesson .m01-context-figure img{display:block;width:100%;height:auto;border:0'));
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes('app.mjs?rev=fundamentos-fisica-v1-20261018'));
});
