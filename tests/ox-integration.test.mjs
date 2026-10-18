import test from 'node:test';
import assert from 'node:assert/strict';
import {focusTopics,focusUI} from '../dist/focus-content.mjs';
import {sources} from '../dist/content.mjs';

test('focus readings identify their evidence and resolve original sources in three languages',()=>{
 assert.deepEqual(focusTopics.map(t=>t.id),['esporte','regenerativa','plastica','ciencia']);
 for(const lang of ['pt','en','es']){
  assert.ok(focusUI[lang].note&&focusUI[lang].curation);
  for(const topic of focusTopics){
   for(const field of ['title','subtitle','intro','reading','type','body'])assert.ok(topic[lang][field],`${topic.id}: ${lang} ${field}`);
   assert.ok(topic.sources.length);
   for(const id of topic.sources){assert.ok(sources[id]?.url.startsWith('https://'));assert.equal(sources[id].year,topic.year);assert.ok(sources[id].doi);}
  }
 }
});

test('OX tasks are integrated in Home and every internal route has a contextual return',async()=>{
 const saved=Object.fromEntries(['window','document','location','history'].map(k=>[k,globalThis[k]]));
 let html='';const clicks=[],events={},store=new Map([['hyperbaric-campus-v1',JSON.stringify({lang:'pt',completed:['units']})]]);
 const app={set innerHTML(value){html=value;}};
 globalThis.location={hash:'#home'};
 globalThis.history={replaceState(_a,_b,hash){location.hash=hash;}};
 globalThis.window={localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},addEventListener:(k,fn)=>events[k]=fn,scrollTo(){},scrollY:0};
 globalThis.document={documentElement:{lang:''},title:'',querySelector:s=>s==='#app'?app:s==='.skip'?{textContent:''}:s==='#main'?{focus(){}}:null,addEventListener(k,fn){if(k==='click')clicks.push(fn);}};
 const go=hash=>{location.hash=hash;events.hashchange();};
 const main=()=>html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
 const language=lang=>{const target={dataset:{lang},hasAttribute:()=>false};for(const click of clicks)click({target:{closest:s=>s==='button'?target:null},preventDefault(){}});};
 try{
  await import('../dist/app.mjs?ox-integration');
  assert.ok(main().includes('id="oxygenna-em-foco-card"'),'Home contains the special focus card');
  assert.ok(main().indexOf('id="oxygenna-em-foco-card"')>main().lastIndexOf('href="#chapters"'),'focus card follows View all chapters');
  assert.equal((main().match(/id="oxygenna-em-foco-card"/g)||[]).length,1);
  assert.ok(!main().includes('class="back"'),'Home does not acquire a redundant Back button');
  const parents={'#learn':'#home','#lab':'#chamber','#lab/units':'#chamber','#profile':'#home','#sources':'#profile','#notifications':'#home','#chapters':'#home','#curriculum/path-diving':'#home','#chamber':'#home','#indications':'#home','#protocols':'#home','#indication/compromised-flaps':'#indications','#protocol/compromised-flaps':'#protocols','#module/02/chamber':'#chamber','#lesson/units/chamber':'#module/02/chamber','#track/pressure':'#learn','#focus':'#home','#focus/esporte':'#focus','#focus/regenerativa':'#focus','#focus/plastica':'#focus','#focus/ciencia':'#focus'};
  for(const [route,parent] of Object.entries(parents)){
   go(route);
   assert.ok(main().includes(`class="back" href="${parent}"`),`${route} returns to ${parent}`);
   assert.ok(!main().includes('id="oxygenna-em-foco-card"'),`${route} does not duplicate the Home card`);
  }
  for(const lang of ['pt','en','es']){
   language(lang);
   for(const [index,mode] of [['indications','indication'],['protocols','protocol']]){
    go('#'+index);
    assert.ok(main().includes('clinical-catalog'));
    assert.ok(main().includes('href="#'+mode+'/calciphylaxis"'));
    go('#'+mode+'/compromised-flaps');
    assert.ok(main().includes('clinical-panel'));
    assert.ok(main().includes('href="#'+(mode==='indication'?'protocol':'indication')+'/compromised-flaps"'));
    assert.ok(html.includes('href="/'+(index==='indications'?'clinica':'operacao')+'" class="active"'));
   }
  }
  for(const lang of ['pt','en','es']){
   language(lang);
   go('#module/07/indications');
   assert.ok(main().includes('class="clinical-chapter-record"'));
   assert.ok(main().includes('data-condition="severe-anemia"'));
   assert.ok(main().includes('href="#protocol/severe-anemia"'));
   assert.ok(html.includes('href="/clinica" class="active"'));
  }
  language('pt');
  go('#focus');
  for(const id of ['esporte','regenerativa','plastica','ciencia'])assert.ok(main().includes(`href="#focus/${id}"`));
  assert.ok(/href="\/home" class="active"/.test(html),'focus remains under Home in the existing footer');
  go('#focus/plastica');assert.ok(main().includes('CIRURGIA PLÁSTICA'));
  language('en');assert.ok(main().includes('PLASTIC SURGERY'));
  language('es');assert.ok(main().includes('CIRUGÍA PLÁSTICA'));
  go('#focus/unknown');assert.ok(main().includes('Página no encontrada')&&main().includes('class="back"'));
  go('#home');assert.ok(main().includes('MEDICINA HIPERBÁRICA EN FOCO'));
  assert.deepEqual(JSON.parse(store.get('hyperbaric-campus-v1')).completed,['units'],'browsing focus and clinical records never increments or clears lesson progress');
 }finally{for(const [k,v] of Object.entries(saved)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}
});
