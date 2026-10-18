import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {consultaData} from '../dist/consulta/data.mjs';
import {consultaCapitulos,consultaById,consultaFilters,consultaRoute,isConsultaRoute,consultaHref,renderConsultaHome,renderConsultaList,renderConsultaChapter,searchConsulta} from '../dist/consulta/consulta-view.mjs';
import {renderFooter,renderHeader} from '../dist/navigation-view.mjs';
const json=JSON.parse(readFileSync(new URL('../dist/consulta/data.json',import.meta.url),'utf8'));
const icon=name=>'<svg data-icon="'+name+'"></svg>';
const e=s=>String(s);
test('catálogo possui exatamente 32 temas sem duplicações, em 8/12/8/4',()=>{
 assert.equal(json.capitulos.length,32);
 assert.equal(consultaCapitulos.length,32);
 assert.deepEqual(consultaFilters,['home','fisiologia','clinica','camara','operacao']);
 assert.equal(new Set(json.capitulos.map(x=>x.id)).size,32);
 for(const [f,qtd] of Object.entries({fisiologia:8,clinica:12,camara:8,operacao:4})){
  assert.equal(consultaCapitulos.filter(x=>x.filtro===f).length,qtd,f);
  const markup=renderConsultaList(f);
  assert.equal((markup.match(/class="lesson-link"/g)||[]).length,qtd,f);
 }
 assert.ok(json.capitulos.every(x=>x.fechamento.quiz.length===3));
 assert.ok(json.capitulos.every(x=>x.fechamento.take_home.length===3));
});
test('HOME reutiliza exatamente três home-card e permite busca por id/título/tag',()=>{
 const home=renderConsultaHome({illustration:'<span>ORIGINAL</span>',icon});
 assert.equal((home.match(/class="home-card"/g)||[]).length,3);
 assert.ok(home.includes('ORIGINAL'));
 assert.ok(home.includes('BUSCA GLOBAL'));
 assert.ok(!home.includes('CONTINUAR ESTUDANDO'));
 assert.ok(home.includes('/capitulo/contraindicacoes'));
 assert.ok(searchConsulta('dcs').some(c=>c.id==='dcs-tipo2'));
 assert.ok(searchConsulta('TOXICIDADE').some(c=>c.id==='toxicidade-oxigenio'));
 assert.ok(searchConsulta('fogo').some(c=>c.id==='checklist-fogo'));
});
test('DCS2 abre capítulo direto com 7 painéis nativos e quiz',()=>{
 const c=consultaById.get('dcs-tipo2');
 assert.ok(c);
 const html=renderConsultaChapter('dcs-tipo2');
 assert.equal((html.match(/class="panel"/g)||[]).length,7);
 assert.equal((html.match(/data-consulta-quiz=/g)||[]).length,3);
 for(let i=0;i<7;i++)assert.ok(html.includes('id="bloco-'+i+'"'),i);
 assert.ok(html.includes('fraqueza')||html.includes('Fraqueza'));
 assert.ok(html.includes('US Navy'));
 assert.ok(!html.includes('module-topic-card'));
 assert.equal(c.proximo_logico_id,'embolia-gasosa');
});
test('footer mantém CSS e ícones originais, troca somente destinos e textos',()=>{
 const foot=renderFooter({lang:'pt',active:'camara',icon,e,consulta:true});
 assert.ok(foot.startsWith('<nav class="bottom-nav footer-card"'));
 for(const path of ['home','fisiologia','clinica','camara','operacao'])assert.ok(foot.includes('/'+path+'"'),path);
 assert.equal((foot.match(/data-consulta-link/g)||[]).length,5);
 const chapter=renderFooter({lang:'pt',active:'clinica',icon,e,consulta:true,chapter:'dcs-tipo2',favorite:true,backRoute:'/clinica',nextRoute:'/capitulo/embolia-gasosa'});
 assert.equal((chapter.match(/<a /g)||[]).length,3);
 assert.ok(chapter.includes('VOLTAR'));
 assert.ok(chapter.includes('FAVORITADO'));
 assert.ok(chapter.includes('PRÓXIMO'));
 assert.ok(renderHeader({lang:'pt',icon,e,unread:false}).includes('oxygenna-logo.png'));
 const css=readFileSync(new URL('../dist/styles.css',import.meta.url),'utf8');
 assert.ok(css.includes('.bottom-nav{position:fixed'));
 assert.ok(css.includes('.app-header{position:fixed'));
 const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(index.includes('styles.css?rev=busca-global-20261018'));
 assert.ok(!index.includes('consulta.css'));
});
test('URLs diretas e rotas legadas seguem caminhos distintos',()=>{
 assert.ok(isConsultaRoute('/capitulo/dcs-tipo2'));
 assert.ok(isConsultaRoute('/camara'));
 assert.ok(!isConsultaRoute('/capitulo/'));
 assert.equal(consultaRoute(),'/home');
 const redirect=readFileSync(new URL('../dist/404.html',import.meta.url),'utf8');
 assert.ok(redirect.includes('location.replace'));
 assert.ok(redirect.includes("capitulo/"));
});
