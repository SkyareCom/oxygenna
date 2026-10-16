import test from 'node:test';
import assert from 'node:assert/strict';
import {modules} from '../dist/curriculum.mjs';
import {lessons} from '../dist/content.mjs';

test('footer filters select coherent, ordered modules without hiding the full curriculum',async()=>{
 const {getCurriculumItems}=await import('../dist/navigation.mjs');
 const ids=filter=>getCurriculumItems(filter).map(m=>m.id);
 assert.deepEqual(ids('chamber'),['01','02','03','04','05','06']);
 assert.deepEqual(ids('indications'),['07','09','10','11','12','13','14','15','19']);
 assert.deepEqual(ids('protocols'),['06','08','18','21','22','23','24']);
 assert.deepEqual(ids(''),modules.map(m=>m.id));
 assert.deepEqual(ids('unknown'),ids(''));
 for(const filter of ['chamber','indications','protocols']){
  const positions=getCurriculumItems(filter).map(m=>modules.indexOf(m));
  assert.equal(new Set(positions).size,positions.length);
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
 }
});

test('lesson and module navigation retain the footer category and old deep links remain usable',async()=>{
 const {activeSection,mapHref,moduleHref,lessonHref}=await import('../dist/navigation.mjs');
 assert.equal(activeSection('module/13/indications'),'indications');
 assert.equal(activeSection('lesson/honey/indications'),'indications');
 assert.equal(activeSection('module/08/protocols'),'protocols');
 assert.equal(activeSection('lab/boyle'),'chamber');
 assert.equal(activeSection('lesson/honey'),'chapters');
 assert.equal(activeSection('profile'),'');
 assert.equal(mapHref('protocols'),'#protocols');
 assert.equal(mapHref('path-diving'),'#curriculum/path-diving');
  assert.equal(mapHref('all'),'#chapters');
 assert.equal(moduleHref('13','indications'),'#module/13/indications');
 assert.equal(lessonHref('honey','indications'),'#lesson/honey/indications');
 assert.equal(moduleHref('13','<script>'),'#module/13');
});

test('Home study map covers every module and resumes only published unfinished lessons',async()=>{
 const {getStudySteps,getNextLesson}=await import('../dist/navigation.mjs');
 for(const lang of ['pt','en','es']){
  const steps=getStudySteps(lang,['units','units','missing']);
  assert.equal(steps.reduce((n,s)=>n+s.modules,0),24);
  assert.equal(steps.reduce((n,s)=>n+s.topics,0),144);
  assert.equal(steps.reduce((n,s)=>n+s.available,0),13);
  assert.equal(steps.reduce((n,s)=>n+s.completed,0),1);
  assert.ok(steps.every(s=>s.title&&s.description&&s.href));
 }
 assert.equal(getNextLesson([]).id,'units');
 assert.equal(getNextLesson(['units']).id,'boyle');
 assert.equal(getNextLesson(lessons.map(l=>l.id)),null);
});

test('reading update notices persists independently from learning progress and tolerates blocked storage',async()=>{
 const {NOTICE_IDS,loadReadNotices,markNoticesRead}=await import('../dist/navigation.mjs');
 const values=new Map([['hyperbaric-campus-v1','{"lang":"es","completed":["honey"]}']]);
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 assert.deepEqual(loadReadNotices(storage),[]);
 assert.equal(markNoticesRead(storage),true);
 assert.deepEqual(loadReadNotices(storage),NOTICE_IDS);
 assert.equal(values.get('hyperbaric-campus-v1'),'{"lang":"es","completed":["honey"]}');
 assert.deepEqual(loadReadNotices({getItem(){throw Error('blocked');}}),[]);
 assert.equal(markNoticesRead({setItem(){throw Error('blocked');}}),false);
});
