/* OXYGENNA: somente conteúdo e dados. Componentes/classes e CSS são do front original. */
import {consultaData} from './data.mjs';
export const consultaCapitulos=consultaData.capitulos;
export const consultaById=new Map(consultaCapitulos.map(c=>[c.id,c]));
export const consultaFilters=['home','fisiologia','clinica','camara','operacao'];
export const consultaFooterLabels=['HOME','FISIOLOGIA','CLÍNICA','CÂMARA','OPERAÇÃO'];
export const consultaFiltersIcon=['home','chamber','book','indications','protocols'];
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function consultaHref(route){
 const base=typeof location!=='undefined'&&String(location.pathname??'').startsWith('/oxygenna')?'/oxygenna/':'/';
 return base+String(route).replace(/^\/+/,'');
}
export function consultaRoute(){
 const route=typeof location==='undefined'?'':String(location.pathname??'');
 const params=typeof location!=='undefined'?new URLSearchParams(String(location.search??'')):new URLSearchParams();
 const wanted=params.get('route');
 if(wanted&&/^\/(?:home|fisiologia|clinica|camara|operacao|capitulo\/[a-z0-9-]+)$/.test(wanted))return wanted;
 const part=route.replace(/^\/oxygenna\/?/,'').replace(/^\/+/,'');
 return '/'+(part==='index.html'?'home':part||'home');
}
export function isConsultaRoute(route){return /^\/(?:home|fisiologia|clinica|camara|operacao|capitulo\/[a-z0-9-]+)$/.test(route);}
const href=id=>consultaHref('capitulo/'+id);
const textCard=c=>'<a class="lesson-link" data-consulta-link href="'+href(c.id)+'"><span class="lesson-number">'+esc(c.fase)+'</span><strong>'+esc(c.titulo_curto)+'</strong><span aria-hidden="true">›</span></a>';
const topicLinks=items=>'<div class="lesson-list">'+items.map(textCard).join('')+'</div>';
const pageTitle=(label,n)=>'<p class="tag">'+esc(n)+'</p><h1 class="display page-title">'+esc(label)+'</h1>';
export function searchConsulta(query){
 const q=String(query??'').trim().toLocaleLowerCase('pt-BR');
 if(!q)return [];
 return consultaCapitulos.filter(c=>[c.titulo_curto,c.resposta_curta,...c.tags_busca].join(' ').toLocaleLowerCase('pt-BR').includes(q));
}
export function renderConsultaSearch(query){
 const q=String(query??'').trim();
 if(!q)return '';
 const found=searchConsulta(q);
 return '<p class="tag">RESULTADOS · '+found.length+'</p>'+(found.length?topicLinks(found):'<p class="subtle">Nenhum tema encontrado.</p>');
}
export function renderConsultaHome({query='',lastId='',illustration='',icon=()=>''}={}){
 const links=[['É INDICAÇÃO?','clinica','indications'],['PODE ENTRAR?','capitulo/contraindicacoes','chamber'],['QUAL PROTOCOLO?','camara','protocols']];
 const quick=links.map(([label,route,symbol])=>'<a class="home-card" data-consulta-link href="'+consultaHref(route)+'">'+icon(symbol)+'<span class="copy"><strong>'+label+'</strong></span></a>').join('');
 const last=consultaById.get(lastId);
 return '<p class="eyebrow">OXYGENNA · MEDICINA HIPERBÁRICA</p><h1 class="display home-title">CONSULTA TÉCNICA</h1>'+
 (illustration?'<div class="home-hero">'+illustration+'</div>':'')+
 '<section class="panel"><label class="lab-label" for="busca-oxygenna">BUSCA GLOBAL</label><input type="search" id="busca-oxygenna" data-consulta-busca placeholder="Pesquise tema, condição ou protocolo" autocomplete="off" value="'+esc(query)+'"></section>'+
 '<div id="resultado-oxygenna" aria-live="polite">'+renderConsultaSearch(query)+'</div>'+
 '<section><p class="tag">ACESSO RÁPIDO</p><div class="home-links">'+quick+'</div></section>'+
 '<section class="study-resume"><p class="tag">CONTINUAR ESTUDANDO</p>'+
 (last?'<h2>'+esc(last.titulo_curto)+'</h2><a class="secondary" data-consulta-link href="'+href(last.id)+'">ABRIR CAPÍTULO</a>':'<p class="subtle">Abra um tema para começar seu histórico.</p>')+'</section>'+
 '<p class="micro">'+esc(consultaData.aviso)+'</p>';
}
export function renderConsultaList(filter){
 const records=consultaCapitulos.filter(c=>c.filtro===filter), titles={fisiologia:'FISIOLOGIA',clinica:'CLÍNICA',camara:'CÂMARA',operacao:'OPERAÇÃO'};
 return pageTitle(titles[filter],records.length+' TEMAS')+
 (filter==='camara'?'<p class="subtle">TABELA MESTRA · avaliação, segurança e protocolos</p>':'')+
 topicLinks(records)+'<p class="micro">'+esc(consultaData.aviso)+'</p>';
}
const para=(x)=>'<p>'+esc(x)+'</p>';
const plainTable=table=>'<div class="oxygen-table-block"><table><thead><tr>'+table.colunas.map(t=>'<th scope="col">'+esc(t)+'</th>').join('')+'</tr></thead><tbody>'+table.linhas.map(r=>'<tr>'+r.map((t,i)=>'<'+(i===0?'th scope="row"':'td')+'>'+esc(t)+'</'+(i===0?'th':'td')+'>').join('')+'</tr>').join('')+'</tbody></table></div>';
const checkList=lines=>lines.map((text,i)=>'<label class="setting-row"><input type="checkbox" data-consulta-check="'+i+'"><span>'+esc(text)+'</span></label>').join('');
const flow=nodes=>'<ol class="curriculum-topics">'+nodes.map(n=>'<li>'+esc(n.texto)+'</li>').join('')+'</ol>';
const question=(q,i,chosen)=>'<fieldset class="quiz" data-consulta-quiz="'+i+'"><legend>'+esc(q.pergunta)+'</legend>'+
 q.opcoes.map((o,j)=>'<button type="button" class="answer" data-consulta-answer="'+j+'" data-consulta-question="'+i+'" aria-pressed="'+(chosen===j)+'"><span>'+String.fromCharCode(65+j)+'</span><span>'+esc(o)+'</span></button>').join('')+
 (chosen!==undefined?'<p class="feedback '+(chosen===q.correta?'':'wrong')+'" role="status">'+(chosen===q.correta?'Resposta correta.':'Reveja o conteúdo do bloco '+esc(q.retorno_bloco_id.replace('bloco-',''))+'.')+'</p>':'')+'</fieldset>';
const block=(number,title,body)=>'<section class="panel" id="bloco-'+number+'"><p class="tag">'+esc(title)+'</p>'+body+'</section>';
const referenceBlock=refs=>'<details><summary>FONTES DE REFERÊNCIA</summary>'+
 '<p class="micro">'+esc(consultaData.fontes_contexto)+'</p>'+
 refs.map(r=>'<p class="source"><strong>'+esc(r)+'</strong></p>').join('')+'</details>';
export function renderConsultaChapter(id,{answers={}}={}){
 const c=consultaById.get(id);
 if(!c)return pageTitle('NÃO ENCONTRADO','CAPÍTULO')+'<a class="secondary" data-consulta-link href="'+consultaHref('home')+'">VOLTAR</a>';
 return '<article data-consulta-chapter="'+esc(c.id)+'">'+
 block(0,'RESPOSTA CURTA','<h1 class="display page-title">'+esc(c.titulo_curto)+'</h1><p class="subtle">'+esc(c.fase)+'</p><p>'+esc(c.resposta_curta)+'</p>')+
 block(1,'CASO CLÍNICO',para(c.caso.texto))+
 block(2,'POR QUE IMPORTA','<h2>MECANISMO GASOSO</h2>'+para(c.porque.mecanismo_gas)+'<p class="tag">CONCEITO CHAVE</p>'+para(c.porque.conceito_chave)+'<p class="micro">Referências bibliográficas: '+esc(c.referencias.join(' · '))+'</p>')+
 block(3,'CONDUTA E DIFERENCIAÇÃO','<h2>FLUXO</h2>'+flow(c.conduta.fluxograma.nos)+'<h2>TABELA COMPARATIVA</h2>'+plainTable(c.conduta.tabela_comparativa)+(['us-navy-tabela-5','us-navy-tabela-6','us-navy-tabela-9-hart','dcs-tipo2'].includes(id)?'<p class="micro">US Navy: consulte edição oficial. Este resumo não fornece regime executável.</p>':''))+
 block(4,'CHECKLIST DE CÂMARA',checkList(c.pericia.checklist)+'<p class="subtle">'+esc(c.pericia.dica_ouro)+'</p>')+
 block(5,'GALERIA E MÍDIAS','<p class="subtle">Recursos multimídia integráveis ao conteúdo, após curadoria científica.</p>')+
 block(6,'LEVE PARA A PRÁTICA','<ul class="curriculum-topics">'+c.fechamento.take_home.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><h2>TESTE O CONHECIMENTO</h2>'+
 c.fechamento.quiz.map((q,i)=>question(q,i,answers[i])).join('')+referenceBlock(c.referencias))+
 '<p class="micro">'+esc(consultaData.aviso)+'</p></article>';
}
export function renderConsultaPage(route,options={}){
 if(route==='/home')return renderConsultaHome(options);
 if(/^\/capitulo\/[a-z0-9-]+$/.test(route))return renderConsultaChapter(route.split('/')[2],options);
 const key=route.slice(1);
 return ['fisiologia','clinica','camara','operacao'].includes(key)?renderConsultaList(key):renderConsultaHome(options);
}
