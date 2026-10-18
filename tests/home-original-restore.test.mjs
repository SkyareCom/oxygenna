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
      assert.doesNotMatch(markup,/Fundamentos comuns/);
      assert.match(markup,/Etapa 01/);
      assert.match(markup,/Etapa 06/);
      for(const route of ['fisiologia','clinica','camara','operacao'])assert.ok(markup.includes('/'+route+'"'),route);
      assert.equal((markup.match(/class="study-stage"/g)||[]).length,6);
      assert.equal((markup.match(/class="stage-description"/g)||[]).length,6);
      assert.equal((markup.match(/class="stage-meta"/g)||[]).length,6);
      assert.equal((markup.match(/class="stage-status"/g)||[]).length,6);
      assert.ok(markup.includes('8 temas')&&markup.includes('12 temas')&&markup.includes('4 temas'));
      for(let i=1;i<=6;i++)assert.ok(markup.includes('aria-hidden="true">'+i+'</span>'),'Marcador numerado ausente: '+i);
      assert.match(markup,/Indicações e Protocolos/);
      assert.match(markup,/href="#indications"/);
      assert.match(markup,/href="#focus"/);
      assert.match(markup,/>Em Foco</);
      assert.doesNotMatch(markup,/id="oxygenna-em-foco-card"/);
      const footer=markup.match(/<nav class="bottom-nav[\s\S]*?<\/nav>/)?.[0]??'';
      for(const name of ['HOME','FISIOLOGIA','CLÍNICA','CÂMARA','OPERAÇÃO'])assert.ok(footer.includes(name),name);
      assert.doesNotMatch(markup,/SEU APP DE DECISÕES CLÍNICAS/);
    };
    oldHome();

    for (const section of ['fisiologia','clinica','camara','operacao']) {
      location.pathname='/oxygenna/'+section;
      listeners.popstate();
      assert.match(markup,/class="module oxygenna-blank-page"/);
      const mainHtml=markup.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
      assert.match(mainHtml,/class="oxygenna-section-base"/);
      assert.match(mainHtml,/PAPOS DE ALTITUDE/);
      assert.match(mainHtml,/oxygenna-logo\.png/);
      assert.match(mainHtml,/PH4 DEV &amp; HEALTH/);
      assert.doesNotMatch(mainHtml,/<h[1-6]|class="panel"|class="lesson-link"|data-consulta-busca/);
      assert.equal((markup.match(/<nav class="bottom-nav[^>]*>/g)||[]).length,1);
      assert.match(markup,/data-consulta-link/);
    }
    location.pathname='/oxygenna/capitulo/dcs-tipo2';
    listeners.popstate();
    assert.match(markup,/TESTE O CONHECIMENTO/,'Rotas internas continuam armazenadas e acessíveis');

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
