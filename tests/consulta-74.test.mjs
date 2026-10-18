import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {consultaData} from '../dist/consulta/catalog.mjs';
import {consultationChapters,consultationMenu,consultaById,consultationHref,isConsultationRoute,renderConsultaHome,renderConsultaFilter,renderConsultaChapter} from '../dist/consulta/consultation.mjs';
import {renderFooter,renderHeader} from '../dist/navigation-view.mjs';
const doc=JSON.parse(readFileSync(new URL('../dist/consulta/data.json',import.meta.url),'utf8'));
const icon=name=>'<i data-icon="'+name+'"></i>';
const e=x=>String(x);
test('base íntegra com 74 capítulos, 9 fases e exatamente 5 filtros',()=>{
 assert.equal(doc.schema,'oxygenna.consulta.v1');
 assert.equal(doc.capitulos.length,74);
 assert.equal(consultaData.capitulos.length,74);
 assert.equal(doc.fases.length,9);
 assert.deepEqual(doc.filters,['home','fisiologia','clinica','camara','operacao']);
 assert.deepEqual(consultationMenu.map(x=>x.id),doc.filters);
 assert.equal(new Set(doc.capitulos.map(x=>x.id)).size,74);
 assert.equal(doc.fases.reduce((n,f)=>n+f.capitulo_ids.length,0),74);
});
test('todos os capítulos seguem modelo com sete blocos e ligações reais',()=>{
 const ids=new Set(doc.capitulos.map(x=>x.id)),refs=new Set(doc.referencias.map(x=>x.id));
 for(const c of doc.capitulos){
  assert.equal(consultaById.get(c.id)?.titulo_curto,c.titulo_curto);
  assert.ok(['fisiologia','clinica','camara','operacao'].includes(c.filtro),c.id);
  assert.ok(c.fase,c.id);
  assert.ok(c.resposta_curta.length>25,c.id);
  assert.ok(c.caso.texto,c.id);
  assert.ok(c.porque.fato&&c.porque.mecanismo_gas&&c.porque.risco_operacional,c.id);
  assert.ok(c.conduta.fluxograma.nos.length>=3,c.id);
  assert.ok(c.conduta.tabela_comparativa.linhas.length>=1,c.id);
  assert.ok(Array.isArray(c.pericia.checklist),c.id);
  assert.equal(c.fechamento.take_home.length,3,c.id);
  assert.equal(c.fechamento.quiz.length,3,c.id);
  for(const r of c.referencias)assert.ok(refs.has(r),c.id+' '+r);
  assert.ok(c.proximo_logico_id===null||ids.has(c.proximo_logico_id),c.id);
  const html=renderConsultaChapter(c.id);
  assert.equal((html.match(/class="consulta-card"/g)||[]).length,7,c.id);
 }
});
test('HOME busca por título, tags e nome de procedimento e permite retomar',()=>{
 const a=renderConsultaHome({search:'DCS tipo 2'});
 assert.ok(a.includes('DCS tipo 2'));
 const b=renderConsultaHome({search:'US Navy'});
 assert.ok(b.includes('Tabela'));
 const c=renderConsultaHome({lastId:'dcs-tipo2'});
 assert.ok(c.includes('CONTINUAR ESTUDANDO'));
 assert.ok(c.includes('DCS tipo 2'));
});
test('CÂMARA abre protocolo em tabela com links para capítulo referenciado',()=>{
 const h=renderConsultaFilter('camara',{tab:'protocolos'});
 assert.ok(h.includes('class="consulta-protocol-table"'));
 assert.equal((h.match(/class="consulta-table-link"/g)||[]).length,doc.procedimentos.length);
 assert.ok(h.includes('/capitulo/navy-table6'));
 assert.ok(h.includes('/capitulo/dcs-tipo2'));
 for(const p of doc.procedimentos)assert.ok(consultaById.has(p.capitulo_id_ref),p.id);
});
test('DCS tipo 2 usa caso realista, fluxograma, tabela, referência US Navy e 3 questões',()=>{
 const html=renderConsultaChapter('dcs-tipo2');
 assert.ok(html.includes('SUSPEITA'));
 assert.ok(html.includes('neurológico'));
 assert.ok(html.includes('US NAVY'));
 assert.equal((html.match(/class="consulta-question"/g)||[]).length,3);
 assert.ok(html.includes('bloco-0')&&html.includes('bloco-6'));
 assert.ok(html.includes('retorno_bloco_id')===false);
});
test('rotas internas e footer preservam os componentes nativos',()=>{
 assert.equal(isConsultationRoute('/home'),true);
 assert.equal(isConsultationRoute('/capitulo/dcs-tipo2'),true);
 assert.equal(isConsultationRoute('/capitulo/xyz.html'),false);
 assert.ok(consultationHref('/camara').endsWith('/camara'));
 const f=renderFooter({lang:'pt',active:'camara',icon,e,consultation:true});
 assert.equal((f.match(/data-consult-link/g)||[]).length,5);
 assert.ok(f.includes('footer-card'));
 const ch=renderFooter({lang:'pt',active:'clinica',icon,e,consultation:true,chapter:'dcs-tipo2',favorite:true,previous:'/fisiologia',next:'/capitulo/embolia-arterial-gasosa'});
 assert.equal((ch.match(/class="consulta-fav-footer"/g)||[]).length,1);
 assert.equal((ch.match(/data-consult-link/g)||[]).length,2);
 assert.ok(ch.includes('FAVORITADO')&&ch.includes('PRÓXIMO'));
 assert.ok(renderHeader({lang:'pt',icon,e,unread:false}).includes('oxygenna-logo.png'));
});
test('tipografia e navegação seguem o contrato de 9/10/12/14/18px e 400/500',()=>{
 const css=readFileSync(new URL('../dist/consulta/consulta.css',import.meta.url),'utf8');
 const fonts=[...css.matchAll(/font-size:\s*(\d+)px/g)].map(x=>Number(x[1]));
 assert.ok(fonts.length>20);
 assert.ok(fonts.every(n=>[9,10,12,14,18].includes(n)),fonts.filter(n=>![9,10,12,14,18].includes(n)).join(','));
 const weights=[...css.matchAll(/font-weight:\s*(\d+)/g)].map(x=>Number(x[1]));
 assert.ok(weights.every(n=>[400,500].includes(n)));
 assert.ok(css.includes('Saira+Semi+Condensed:wght@400;500'));
 assert.ok(css.includes('main.consulta-main'));
 assert.ok(css.includes('overflow-y:auto'));
 assert.ok(css.includes('border:1px solid var(--consulta-border)'));
 assert.ok(!css.includes('border:2px'));
 const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(index.includes('consulta/consulta.css'));
 assert.ok(readFileSync(new URL('../dist/404.html',import.meta.url),'utf8').includes("location.replace(destination)"));
});
