import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,sources} from '../dist/content.mjs';
const c=await import('../dist/curriculum.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
test('curriculum spans common foundations, clinical medicine, diving and integration in valid sequence',()=>{
 assert.ok(Array.isArray(c.modules),'curriculum module catalog required');
 assert.equal(c.modules.length,24);
 assert.deepEqual([...new Set(c.modules.map(m=>m.phase))],['common','medicine','diving','integration']);
 const seen=new Set();
 for(const m of c.modules){assert.ok(!seen.has(m.id));for(const p of m.prerequisites)assert.ok(seen.has(p),`${m.id}: earlier prerequisite ${p}`);seen.add(m.id);}
 assert.equal(c.modules.reduce((n,m)=>n+m.pt.topics.length,0),144);
});
test('every module has localized objectives, six topics and valid source/lesson links',()=>{
 assert.ok(c.modules);
 const mapped=[];
 for(const m of c.modules){
  for(const lang of ['pt','en','es']){assert.ok(m[lang]?.title&&m[lang]?.objective);assert.equal(m[lang].topics.length,6);assert.ok(m[lang].topics.every(x=>typeof x==='string'&&x.length>2));}
  for(const id of m.sources)assert.ok(sources[id],`${m.id}: source ${id}`);
  for(const id of m.lessons){assert.ok(lessons.some(x=>x.id===id),`${m.id}: lesson ${id}`);mapped.push(id);}
 }
 assert.deepEqual([...mapped].sort(),lessons.map(l=>l.id).sort(),'published lessons are mapped once, without invented lessons');
});
test('focused paths include prerequisites and preserve the recommended sequence',()=>{
 assert.equal(typeof c.getLearningPath,'function');
 for(const focus of ['medicine','diving']){
  const path=c.getLearningPath(focus),seen=new Set();
  assert.ok(path.some(m=>m.phase===focus));
  for(const m of path){for(const id of m.prerequisites)assert.ok(seen.has(id));seen.add(m.id);}
 }
 assert.equal(c.getModule('unknown'),undefined);
 assert.equal(c.getModules('unknown').length,24);
});


test('European consensus references use the full report and correction once',()=>{
 assert.equal(sources.consensus,undefined,'the superseded announcement is not a duplicate library entry');
 for(const m of c.modules){
  assert.equal(new Set(m.sources).size,m.sources.length);
  if(m.sources.includes('echm2017'))assert.ok(m.sources.includes('echmErratum'));
 }
});
