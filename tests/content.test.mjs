import test from 'node:test';
import assert from 'node:assert/strict';
const data=await import('../dist/content.mjs').catch(e=>{if(e.code==='ERR_MODULE_NOT_FOUND')return {};throw e;});
test('every delivered lesson has three complete languages and traceable sources',()=>{
  assert.ok(Array.isArray(data.lessons),'a lesson catalog is required');
  assert.ok(data.lessons.length>=8);
  for(const lesson of data.lessons){
    assert.ok(lesson.sources.length);
    for(const id of lesson.sources) assert.ok(data.sources[id]?.url.startsWith('https://'),`${lesson.id}: source ${id}`);
    for(const lang of ['pt','en','es']){
      const t=lesson[lang];assert.ok(t?.title&&t.body&&t.question,`${lesson.id}: ${lang}`);
      assert.ok(t.answers.length>=2&&t.answers[lesson.correct]);
    }
  }
});
test('clinical studies retain access status and no lesson claims independent medical review',()=>{
  assert.ok(data.sources,'sources required');
  for(const source of Object.values(data.sources)){assert.ok(source.access);assert.equal(source.consulted,'2026-10-15');}
  for(const lesson of data.lessons) assert.equal(lesson.review,'editorial');
});
