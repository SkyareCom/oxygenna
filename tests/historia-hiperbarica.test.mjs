import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderHyperbaricHistoryCard,renderHyperbaricHistory,hyperbaricHistoryContent,hyperbaricHistoryIllustration} from '../dist/historia-hiperbarica.mjs';
import {renderStudyMap} from '../dist/navigation-view.mjs';
import {getConsolidatedReferences,renderReferencesDrawer} from '../dist/reference-library.mjs';

test('Home preserva seis áreas e troca apenas CTA para Iniciar os Estudos, card histórico após o botão',()=>{
 const map=renderStudyMap({lang:'pt',e:s=>s,icon:()=>''});
 assert.equal((map.match(/class="study-stage"/g)||[]).length,6);
 assert.match(map,/>INICIAR OS ESTUDOS<\/a>/);
 assert.doesNotMatch(map,/VER TODOS OS CAPÍTULOS|Ver todos os capítulos/);
 assert.match(map,/href="#chapters">INICIAR OS ESTUDOS/);
 assert.equal((map.match(/class="history-home-card"/g)||[]).length,1);
 assert.ok(map.indexOf('history-home-card')>map.indexOf('href="#chapters">INICIAR OS ESTUDOS'));
 assert.match(map,/HISTÓRIA DA MEDICINA HIPERBÁRICA/);
 assert.match(map,/href="#historia-medicina-hiperbarica"/);
 assert.match(map,/class="history-hyperbaric-art"/);
 assert.match(map,/role="img"/);
});
test('Card e página histórica completos em três idiomas, sem pop-ups nem referências fora do perfil',()=>{
 const titles=['HISTÓRIA DA MEDICINA HIPERBÁRICA','HISTORY OF HYPERBARIC MEDICINE','HISTORIA DE LA MEDICINA HIPERBÁRICA'];
 for(const [i,lang] of ['pt','en','es'].entries()){
  const home=renderStudyMap({lang,e:s=>s,icon:()=>''});
  const card=renderHyperbaricHistoryCard(lang);
  const page=renderHyperbaricHistory(lang,href=>'<a class="back" href="'+href+'">Voltar</a>');
  assert.ok(home.includes(titles[i]),lang);
  assert.ok(card.includes(titles[i]),lang);
  assert.ok(page.includes(titles[i]),lang);
  assert.equal((page.match(/class="history-timeline-item"/g)||[]).length,7);
  assert.equal(hyperbaricHistoryContent[lang].sections.length,7);
  assert.match(page,/href="#home"/);
  assert.match(page,/class="history-page-figure"/);
  assert.ok(page.includes(hyperbaricHistoryIllustration(lang)));
  assert.doesNotMatch(page,/<dialog|aria-modal="true"|target="_blank"|class="ref-vancouver-list"/);
 }
});
test('Imagem temática é uma ilustração SVG original completa e offline, não emoji nem ícone genérico',()=>{
 const art=hyperbaricHistoryIllustration('pt');
 for(const token of ['viewBox="0 0 640 320"','linearGradient','history-copper','history-steel','1660s','HOJE','role="img"','Câmara'])assert.ok(art.includes(token),token);
 assert.ok((art.match(/<path /g)||[]).length>9);
 assert.ok((art.match(/<rect /g)||[]).length>10);
 assert.doesNotMatch(art,/<image |https?:\/\/|data:image|onclick/);
});
test('Fontes verificadas UHMS 15th edition e revisão 2020 ficam apenas no Perfil',()=>{
 const refs=getConsolidatedReferences().scientific;
 assert.ok(refs.some(v=>v.id==='historia-uhms-15'&&v.url.includes('uhms.org')));
 assert.ok(refs.some(v=>v.id==='historia-hajhosseini-2020'&&v.url.includes('pubmed.ncbi.nlm.nih.gov')));
 const profile=renderReferencesDrawer('pt');
 assert.match(profile,/data-profile-references/);
 assert.match(profile,/Hyperbaric Medicine Indications Manual/);
 assert.match(profile,/Hajhosseini B/);
 assert.match(profile,/10\.1097\/GOX/);
});
test('Novos estilos preservam o desenho original e evitam sombra e modais',()=>{
 const css=readFileSync(new URL('../dist/historia-hiperbarica.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 assert.ok(css.includes('border:1px solid #857557'));
 assert.ok(css.includes('box-shadow:none'));
 assert.ok(css.includes('.history-home-card')&&css.includes('.history-timeline-item'));
 assert.ok(html.includes('historia-hiperbarica.css?rev=historia-medica-20261019'));
 assert.ok(html.includes('app.mjs?rev=history-home-20261019'));
 assert.ok(app.includes("section==='historia-medicina-hiperbarica'"));
 assert.ok(app.includes('renderHyperbaricHistory(state.lang,back,e)'));
 assert.ok(app.includes("renderHyperbaricHistoryCard")===false); // card is owned by navigation view
});
