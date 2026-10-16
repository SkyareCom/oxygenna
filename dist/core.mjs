const KEY = 'hyperbaric-campus-v1';
function positive(...values) {
  if(values.some(v => typeof v !== 'number' || !Number.isFinite(v) || v <= 0)) throw new RangeError('Positive finite numbers required');
}
export function boyle(p1, v1, p2) { positive(p1,v1,p2); return p1*v1/p2; }
export function partialPressure(p, fraction) {
  positive(p);
  if(typeof fraction !== 'number' || !Number.isFinite(fraction) || fraction < 0 || fraction > 1) throw new RangeError('Fraction must be within [0,1]');
  return p*fraction;
}
export function henryRelative(p, p0) { positive(p,p0); return p/p0; }
export function thermalRatio(t1, t2) { positive(t1,t2); return t2/t1; }
export function pressureUnits(kpa) { positive(kpa); return {kpa,ata:kpa/101.325,bar:kpa/100}; }
function cleanState(value) {
  return {lang:['pt','en','es'].includes(value?.lang)?value.lang:'pt', completed:[...new Set(Array.isArray(value?.completed)?value.completed.filter(v=>typeof v==='string'&&v.length>0):[])]};
}
export function loadState(storage) { try {return cleanState(JSON.parse(storage?.getItem(KEY)??'null'));}catch{return cleanState(null);} }
export function saveState(storage, state) {try {storage.setItem(KEY,JSON.stringify(cleanState(state)));return true;}catch{return false;} }
export function completeLesson(state, id) {
  if(typeof id!=='string'||!id) throw new TypeError('Lesson id required');
  return cleanState({...state,completed:[...state.completed,id]});
}
