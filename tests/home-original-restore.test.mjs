import test from 'node:test';
import assert from 'node:assert/strict';

test('A Home antiga volta na entrada do OXYGENNA sem alterar rotas internas', async () => {
  const saved = Object.fromEntries(['location','window','history','document'].map(key => [key, globalThis[key]]));
  let markup = '';
  const listeners = {};
  const app = {set innerHTML(html){markup=html},get innerHTML(){return markup}};
  const skip = {textContent:''};
  const main = {focus(){},scrollTo(){}};
  const location = {pathname:'/oxygenna/',search:'',hash:''};
  globalThis.location = location;
  globalThis.window = {localStorage:{getItem(){return null},setItem(){}},addEventListener(k,fn){listeners[k]=fn},scrollTo(){},scrollY:0};
  globalThis.history = {pushState(_a,_b,url){location.pathname=url},replaceState(_a,_b,url){location.pathname=url}};
  globalThis.document = {
    documentElement:{lang:''},title:'',
    querySelector(sel){return {'#app':app,'.skip':skip,'#main':main}[sel]??null;},
    addEventListener(){}
  };
  try {
    await import('../dist/app.mjs?restore-original-home-20261018');
    const oldHome = () => {
      assert.match(markup,/Seu campus de aprendizagem/);
      assert.match(markup,/Ciência sob pressão\./);
      assert.match(markup,/class="home-hero"/);
      assert.match(markup,/assets\/reference-approved\.png/);
      assert.match(markup,/class="study-resume"/);
      assert.match(markup,/Próxima aula disponível/);
      assert.match(markup,/class="study-map"/);
      assert.match(markup,/Seu mapa de estudos/);
      assert.match(markup,/#chapters\/common/);
      assert.match(markup,/#chapters\/diving/);
      const footer=markup.match(/<nav class="bottom-nav[\s\S]*?<\/nav>/)?.[0]??'';
      for(const name of ['HOME','FISIOLOGIA','CLÍNICA','CÂMARA','OPERAÇÃO'])assert.ok(footer.includes(name),name);
      assert.doesNotMatch(markup,/SEU APP DE DECISÕES CLÍNICAS/);
    };
    oldHome();

    location.pathname='/oxygenna/clinica';
    listeners.popstate();
    assert.match(markup,/Filtros de consulta/);
    assert.match(markup,/>CLÍNICA</);
    assert.match(markup,/data-consulta-link/);
    assert.doesNotMatch(markup,/Seu mapa de estudos/);

    location.pathname='/oxygenna/home';
    listeners.popstate();
    oldHome();

    location.pathname='/oxygenna/';
    location.hash='#chapters';
    listeners.hashchange();
    assert.match(markup,/class="chapters"/);
    assert.match(markup,/Capítulos de aprendizagem/);
    assert.doesNotMatch(markup,/Seu mapa de estudos/);
  } finally {
    for(const [key,value] of Object.entries(saved)){
      if(value===undefined)delete globalThis[key];else globalThis[key]=value;
    }
  }
});
