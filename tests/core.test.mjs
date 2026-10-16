import test from 'node:test';
import assert from 'node:assert/strict';
const core = await import('../dist/core.mjs').catch(e => { if(e.code === 'ERR_MODULE_NOT_FOUND') return {}; throw e; });

test('Boyle preserves pressure-volume product with absolute pressures', () => {
  assert.equal(typeof core.boyle, 'function');
  assert.equal(core.boyle(101.325, 1000, 202.65), 500);
});
test('dry gas partial pressure and normalized Henry equilibrium are distinct', () => {
  assert.equal(typeof core.partialPressure, 'function');
  assert.equal(core.partialPressure(200, 0.21), 42);
  assert.equal(core.henryRelative(200, 100), 2);
});
test('thermal laws use absolute temperature ratios', () => {
  assert.equal(typeof core.thermalRatio, 'function');
  assert.equal(core.thermalRatio(300, 330), 1.1);
});
test('unit conversions preserve absolute pressure', () => {
  assert.equal(typeof core.pressureUnits, 'function');
  assert.deepEqual(core.pressureUnits(202.65), {kpa:202.65, ata:2, bar:2.0265});
});
test('invalid physical inputs are rejected rather than yielding plausible results', () => {
  assert.equal(typeof core.boyle, 'function');
  for(const bad of [0, -1, NaN, Infinity, '100']) assert.throws(() => core.boyle(bad, 1000, 200), RangeError);
  assert.throws(() => core.partialPressure(200, 1.01), RangeError);
  assert.throws(() => core.partialPressure(200, -0.01), RangeError);
  assert.equal(core.partialPressure(200, 0), 0);
  assert.throws(() => core.thermalRatio(0, 300), RangeError);
});
test('repeating a mastered lesson never duplicates progress', () => {
  assert.equal(typeof core.completeLesson, 'function');
  const initial={lang:'pt', completed:[]};
  const once=core.completeLesson(initial,'boyle');
  const twice=core.completeLesson(once,'boyle');
  assert.deepEqual(twice.completed,['boyle']);
  assert.deepEqual(initial.completed,[]);
});
test('corrupt or inaccessible storage keeps a usable Portuguese state', () => {
  assert.equal(typeof core.loadState, 'function');
  assert.deepEqual(core.loadState({getItem:()=>'{bad'}),{lang:'pt',completed:[]});
  assert.deepEqual(core.loadState({getItem:()=>{throw Error('blocked')}}),{lang:'pt',completed:[]});
  assert.equal(core.saveState({setItem:()=>{throw Error('full')}},{lang:'en',completed:[]}),false);
});
test('saved languages and completed lessons are sanitized', () => {
  assert.equal(typeof core.loadState, 'function');
  const storage={getItem:()=>JSON.stringify({lang:'xx',completed:['boyle','boyle',null,42]})};
  assert.deepEqual(core.loadState(storage),{lang:'pt',completed:['boyle']});
});
