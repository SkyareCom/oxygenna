import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sources} from '../dist/content.mjs';
import {consultaData} from '../dist/consulta/data.mjs';
import {getConsolidatedReferences,renderReferencesDrawer} from '../dist/reference-library.mjs';

test('Todos os registros de fontes do app aparecem no Perfil, sem perder metadados',()=>{
 const data=getConsolidatedReferences(),urls=new Set(data.scientific.map(x=>x.url));
 assert.ok(data.scientific.length>=25);
 for(const source of Object.values(sources))assert.ok(urls.has(source.url),'Source missing: '+source.title);
 const appendix=new Set(data.legacy);
 for(const c of consultaData.capitulos)for(const value of c.referencias??[])assert.ok(appendix.has(value),'Consulta ref missing: '+value);
 assert.ok(data.supplementary.some(x=>x.url.includes('physics.nist.gov')));
 assert.ok(data.supplementary.some(x=>x.url.includes('commons.wikimedia.org')));
});
test('Card único é gaveta integrada, citações legíveis e três idiomas',()=>{
 for(const [lang,heading] of [['pt','FONTES DE REFERÊNCIA'],['en','REFERENCES'],['es','FUENTES DE REFERENCIA']]){
  const str=renderReferencesDrawer(lang);
  assert.match(str,new RegExp(heading));
  assert.equal((str.match(/<details\b/g)||[]).length,1);
  assert.match(str,/class="profile-references-card"/);
  assert.match(str,/class="ref-vancouver-list"/);
  assert.match(str,/CFM/);
  assert.ok(str.includes('BIPM')&&str.includes('NIST'));
  assert.ok(!str.includes('target="_blank"')&&!str.includes('aria-modal="true"'));
  assert.ok(!str.includes('<dialog'));
  assert.match(renderReferencesDrawer(lang,true),/data-profile-references open/);
 }
});
test('Perfil contém apenas uma gaveta de fontes; conteúdos não exibem bibliografias ao final',()=>{
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const files=['curriculum-view.mjs','clinical-view.mjs','consulta/consulta-view.mjs','chamber-learning.mjs','focus-view.mjs','fundamentos-basicos.mjs'];
 assert.ok(app.includes('renderReferencesDrawer(state.lang,openSources)'));
 assert.ok(app.includes('function renderSources(){return renderProfile(true);}'));
 for(const path of files){
  const content=readFileSync(new URL('../dist/'+path,import.meta.url),'utf8');
  assert.doesNotMatch(content,/sourceLinks\s*\(/);
  assert.doesNotMatch(content,/FONTES DE REFERÊNCIA<\/summary>/);
 }
 const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(index.includes('reference-library.css?rev=central-refs-20261019'));
 assert.ok(index.includes('app.mjs?rev=fisiologia-foto-escura-saira-20261019'));
});
