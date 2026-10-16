import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicalConditions,clinicalUI} from '../dist/clinical-content.mjs';
import {renderClinicalCatalog,renderClinicalDetail} from '../dist/clinical-view.mjs';
import {sources,lessons} from '../dist/content.mjs';
import {modules} from '../dist/curriculum.mjs';
import {renderCurriculum,renderModule} from '../dist/curriculum-view.mjs';
import {activeSection} from '../dist/navigation.mjs';
const e=String,icon=name=>`<i data-icon="${name}"></i>`,back=href=>`<a class="back" href="${href}">Back</a>`,sourceLinks=ids=>ids.map(id=>`<a href="${sources[id].url}">${id}</a>`).join('');

test('clinical atlas covers every CFM item and additional international conditions without changing lesson progress',()=>{
 assert.equal(clinicalConditions.length,30);
 assert.equal(new Set(clinicalConditions.map(c=>c.id)).size,30);
 const covered=new Set(clinicalConditions.flatMap(c=>c.cfm));
 for(let i=1;i<=16;i++)assert.ok(covered.has(`4.${i}`),`CFM 4.${i} is mapped`);
 for(const id of ['intracranial-abscess','hearing-loss','retinal-occlusion','osteonecrosis','pneumatosis','calciphylaxis'])assert.ok(clinicalConditions.some(c=>c.id===id));
 const flaps=clinicalConditions.find(c=>c.id==='compromised-flaps');
 for(const [lang,term] of [['pt','risco'],['en','at-risk'],['es','riesgo']])assert.ok(flaps[lang].title.includes(term),'CFM 4.14 includes at-risk tissue');
 assert.equal(lessons.length,13);
 for(const c of clinicalConditions){
  assert.ok(c.sources.length&&c.modules.length);
  assert.ok(c.modules.includes(c.primaryModule));
  for(const id of c.sources)assert.ok(sources[id]?.url.startsWith('https://'),`${c.id}: ${id}`);
  for(const id of c.modules)assert.ok(modules.some(m=>m.id===id));
  if(c.regimenSource)assert.ok(c.sources.includes(c.regimenSource));
  for(const lang of ['pt','en','es'])for(const field of ['title','selection','priority','care','regimen','review','scope'])assert.ok(c[lang]?.[field],`${c.id}: ${lang}.${field}`);
 }
});

test('clinical indication and protocol routes are paired, localized and retain footer context',()=>{
 for(const lang of ['pt','en','es']){
  const options={lang,e,icon,back,sourceLinks,notFound:()=>'<p>404</p>'};
  assert.ok(clinicalUI[lang].safety&&clinicalUI[lang].limits);
  for(const mode of ['indication','protocol']){
   const index=renderClinicalCatalog(mode,options);
   for(const c of clinicalConditions){
    assert.ok(index.includes(`href="#${mode}/${c.id}"`));
    const detail=renderClinicalDetail(mode,c.id,options);
    assert.ok(detail.includes(c[lang].title));
    assert.ok(!detail.includes(clinicalUI[lang].chapters));
    assert.ok(!detail.includes('href="#module/'));
    assert.ok(detail.includes(`class="back" href="#${mode==='indication'?'indications':'protocols'}"`));
    assert.ok(detail.includes(`href="#${mode==='indication'?'protocol':'indication'}/${c.id}"`));
    assert.equal(activeSection(`${mode}/${c.id}`),mode==='indication'?'indications':'protocols');
   }
   assert.equal(renderClinicalDetail(mode,'unknown',options),'<p>404</p>');
  }
 }
});


test('clinical records have one complete chapter and retain links from every related chapter',()=>{
 for(const lang of ['pt','en','es']){
  const options={lang,lessons,e,icon,back,sourceLinks,notFound:()=>'<p>404</p>',context:'protocols'};
  let fullCount=0,referenceCount=0;
  for(const m of modules){
   const html=renderModule(m.id,options),related=clinicalConditions.filter(c=>c.modules.includes(m.id));
   const primary=related.filter(c=>c.primaryModule===m.id),references=related.filter(c=>c.primaryModule!==m.id);
   assert.equal((html.match(/class="clinical-chapter-record"/g)||[]).length,primary.length,`${lang}: complete records belong to chapter ${m.id}`);
   assert.equal((html.match(/class="lesson-link clinical-chapter-reference"/g)||[]).length,references.length);
   fullCount+=primary.length;referenceCount+=references.length;
   for(const c of primary){
    assert.ok(html.includes(`data-condition="${c.id}"`));
    for(const field of ['title','selection','priority','care','regimen','review','scope'])assert.ok(html.includes(c[lang][field]),`${c.id}: chapter contains ${lang}.${field}`);
    assert.ok(html.includes(`href="#protocol/${c.id}"`));
    for(const id of c.sources)assert.ok(html.includes(sources[id].url));
   }
   for(const c of references){
    assert.ok(html.includes(`data-condition="${c.id}" href="#module/${c.primaryModule}/protocols"`));
    assert.ok(html.includes(c[lang].title));
   }
  }
  assert.equal(fullCount,30,'each condition is taught in full once across chapters');
  assert.equal(referenceCount,11,'related chapters retain access without repeated full text');
 }
});

test('protocol references cite each source once and identify the regimen source',()=>{
 for(const lang of ['pt','en','es'])for(const c of clinicalConditions){
  const html=renderClinicalDetail('protocol',c.id,{lang,e,icon,back,sourceLinks,notFound:()=>''});
  for(const id of new Set([...c.sources,'code','fda']))assert.equal(html.split(`href="${sources[id].url}"`).length-1,1,`${c.id}: ${id} is cited once`);
  if(c.regimenSource)assert.ok(html.includes(clinicalUI[lang].regimenReference));
 }
});


test('indications and protocols indexes omit the redundant chapter block',()=>{
 for(const lang of ['pt','en','es'])for(const [section,mode] of [['indications','indication'],['protocols','protocol']]){
  const options={lang,lessons,e,icon,back,sourceLinks};
  const catalog=renderClinicalCatalog(mode,options);
  const html=renderCurriculum(section,{...options,catalog});
  assert.ok(html.includes('clinical-catalog'));
  assert.ok(!html.includes(clinicalUI[lang].chapters));
  assert.ok(!html.includes('href="#module/'));
  assert.equal(html.split('href="#chapters"').length-1,1,'the existing View all chapters shortcut is preserved');
  for(const c of clinicalConditions)assert.ok(html.includes(`href="#${mode}/${c.id}"`));
 }
});
