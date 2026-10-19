import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 DEPTH_CONSTANTS,depthPressure,boyleVolume,dryGasPartialPressure,
 renderPhysicsActivities,updatePhysicsActivity,setDiverDepthFromPointer
} from '../dist/fundamentos-interativos.mjs';

test('Profundidade em água salgada e doce segue P absoluta = P0 + rho g h',()=>{
 const surface=depthPressure(0);
 assert.equal(surface.absoluteAtm,1);
 assert.equal(surface.gaugeAtm,0);
 assert.equal(surface.absoluteKPa,101.325);
 const sea=depthPressure(10,'sea'),fresh=depthPressure(10,'fresh');
 assert.ok(sea.absoluteAtm>1.99 && sea.absoluteAtm<2.01,sea.absoluteAtm);
 assert.ok(fresh.absoluteAtm>1.96 && fresh.absoluteAtm<1.98,fresh.absoluteAtm);
 assert.ok(sea.absoluteAtm>fresh.absoluteAtm);
 assert.ok(Math.abs(sea.gaugeKPa-100.5181625)<1e-8);
 assert.ok(sea.metresPerAtm>10&&sea.metresPerAtm<10.2);
 assert.equal(depthPressure(60,'sea')?.depth,60);
 for(const invalid of [-1,61,Infinity,NaN])assert.equal(depthPressure(invalid),null);
 assert.equal(depthPressure(10,'lava'),null);
 assert.equal(DEPTH_CONSTANTS.surfacePa,101325);
});

test('Boyle calcula volume relativo e Dalton a pressão parcial em kPa',()=>{
 assert.equal(boyleVolume(1),1000);
 assert.equal(boyleVolume(2),500);
 assert.equal(boyleVolume(4),250);
 assert.equal(boyleVolume(0),null);
 assert.equal(dryGasPartialPressure(2,100),202.65);
 assert.ok(Math.abs(dryGasPartialPressure(2,21)-42.5565)<1e-10);
 assert.equal(dryGasPartialPressure(1,-1),null);
 assert.equal(dryGasPartialPressure(1,101),null);
});

test('SVGs ilustrados, controles acessíveis e três atividades nos três idiomas',()=>{
 for(const [lang,title] of [['pt','MERGULHADOR INTERATIVO'],['en','INTERACTIVE DIVER'],['es','BUZO INTERACTIVO']]){
  const markup=renderPhysicsActivities(lang);
  assert.ok(markup.includes(title),lang);
  assert.equal((markup.match(/class="panel fb-card fb-/g)||[]).length,3);
  for(const sel of ['data-depth-diver','data-depth-stage','data-depth-range','data-depth-water','data-depth-absolute','data-boyle-pressure','data-boyle-bubble','data-gas-pressure','data-gas-fraction','data-gas-partial']){
   assert.ok(markup.includes(sel),sel);
  }
  assert.ok(markup.includes('role="slider"')&&markup.includes('aria-valuemin="0"'));
  assert.ok(markup.includes('<svg')&&markup.includes('fb-ocean-photo'));
  assert.ok(markup.includes('fb-bubble-art')&&markup.includes('fb-gas-art'));
  assert.ok(markup.includes('mergulhador-realista-aprovado.webp')&&markup.includes('data-depth-photo'),lang);
  assert.ok(markup.includes(' kPa · ')&&markup.includes(' atm'),lang);
 }
});

test('Atualização visual muda pressão, posição do mergulhador e estados de Boyle e Dalton',()=>{
 const elements=new Map();
 const metrics=(name)=>({textContent:'',setAttribute(key,value){this[key]=value}});
 for(const name of ['[data-depth-metres]','[data-depth-absolute]','[data-depth-gauge]','[data-depth-kpa]','[data-boyle-atm]','[data-boyle-volume]','[data-gas-atm]','[data-gas-percent]','[data-gas-partial]'])elements.set(name,metrics(name));
 const range={value:'10',matches:s=>s.includes('data-depth-range')};
 const water={value:'sea'};
 const diver={style:{},setAttribute(key,v){this[key]=v}};
 const root={matches:s=>s==='.fb-depth-activity',querySelector:q=>({'[data-depth-range]':range,'[data-depth-water]':water,'[data-depth-diver]':diver})[q]??elements.get(q)??null};
 range.closest=()=>root;
 assert.equal(updatePhysicsActivity(range,'pt'),true);
 assert.ok(elements.get('[data-depth-absolute]').textContent.includes('1,99'));
 assert.equal(diver['aria-valuenow'],'10');
 assert.ok(parseFloat(diver.style.top)>5.5);
 water.value='fresh';water.matches=s=>s.includes('data-depth-water');water.closest=()=>root;
 assert.equal(updatePhysicsActivity(water,'pt'),true);
 assert.ok(elements.get('[data-depth-absolute]').textContent.includes('1,97'));
 const bubble={attributes:{},setAttribute(k,v){this.attributes[k]=v}};
 const glint={setAttribute(){}};
 const boyleRoot={matches:s=>s==='.fb-boyle-activity',querySelector:q=>({'[data-boyle-bubble]':bubble,'[data-boyle-glint]':glint})[q]??elements.get(q)??null};
 const boyle={value:'4',matches:s=>s.includes('data-boyle-pressure'),closest:()=>boyleRoot};
 assert.equal(updatePhysicsActivity(boyle,'en'),true);
 assert.ok(elements.get('[data-boyle-volume]').textContent.includes('250'));
 assert.ok(Number(bubble.attributes.r)<48);
 const gasbar={attributes:{},setAttribute(k,v){this.attributes[k]=v}};
 const pressure={value:'2'},fraction={value:'21'};
 const gasRoot={matches:s=>s==='.fb-oxygen-activity',querySelector:q=>({'[data-gas-pressure]':pressure,'[data-gas-fraction]':fraction,'[data-gas-oxygen]':gasbar})[q]??elements.get(q)??null};
 pressure.matches=s=>s.includes('data-gas-pressure');pressure.closest=()=>gasRoot;
 assert.equal(updatePhysicsActivity(pressure,'en'),true);
 assert.ok(elements.get('[data-gas-partial]').textContent.includes('42.56'));
 assert.ok(Math.abs(Number(gasbar.attributes.width)-49.14)<.01);
});

test('Mergulhador recebe profundidade de toque vertical da imagem',()=>{
 const range={value:'0',matches:s=>s.includes('data-depth-range')};
 const water={value:'sea'};
 const diver={style:{},setAttribute(){}};
 const root={matches:s=>s==='.fb-depth-activity',querySelector:q=>({'[data-depth-range]':range,'[data-depth-water]':water,'[data-depth-diver]':diver})[q]??({textContent:''})};
 range.closest=()=>root;
 const stage={getBoundingClientRect:()=>({top:100,height:400}),closest:()=>root};
 assert.ok(setDiverDepthFromPointer(stage,122,'pt'));
 assert.equal(Number(range.value),0);
 assert.ok(setDiverDepthFromPointer(stage,293.6,'pt'));
 assert.equal(Number(range.value),30);
 assert.ok(setDiverDepthFromPointer(stage,465.2,'pt'));
 assert.equal(Number(range.value),60);
 assert.equal(setDiverDepthFromPointer(stage,NaN,'pt'),false);
});

test('App conecta clique, arraste, teclado, faixa e inputs; CSS sem molduras duplicadas',()=>{
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 const css=readFileSync(new URL('../dist/fundamentos-basicos.css',import.meta.url),'utf8');
 for(const name of ['updatePhysicsActivity','setDiverDepthFromPointer','pointerdown','pointermove','pointerup','pointercancel','keydown'])assert.ok(app.includes(name),name);
 assert.ok(css.includes('.fb-ocean-stage')&&css.includes('.fb-diver-handle'));
 assert.ok(css.includes('touch-action:none'));
 assert.ok(css.includes('border: 1px solid #857557'));
});
