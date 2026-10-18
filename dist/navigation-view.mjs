import {navigationUI,NOTICE_IDS} from './navigation.mjs';

export function renderHeader({lang,icon,e,unread}){
 const n=navigationUI[lang];
 return `<header class="app-header"><a class="brand" href="#home" aria-label="${e(n.brand.join(' '))}"><img class="brand-logo" src="./assets/oxygenna-logo.png" width="44" height="44" alt=""><span class="brand-name">${n.brand.map(word=>`<span>${e(word)}</span>`).join('')}</span></a><div class="header-actions"><a class="icon-button" href="#notifications" aria-label="${e(n.notifications+(unread?' — '+n.unread:''))}">${icon('bell')}${unread?'<span class="notification-dot" aria-hidden="true"></span>':''}</a><a class="icon-button" href="#profile" aria-label="${e(n.profile)}">${icon('user')}</a></div></header>`;
}
const FOOTER_ITEMS=[
 ['HOME','home','home'],
 ['FISIOLOGIA','fisiologia','chamber'],
 ['CLÍNICA','clinica','book'],
 ['CÂMARA','camara','indications'],
 ['OPERAÇÃO','operacao','protocols']
];
// Mesmo template original do mapa de estudos: marcador numerado,
 // etapa, título, descrição, metadados e linha informativa.
 // Somente conteúdos e destinos dos seis cards foram atualizados.
const HOME_STUDY_AREAS=[
 {route:'fisiologia',title:{pt:'Fisiologia',en:'Physiology',es:'Fisiología'},description:{
  pt:'Pressão, gases, oxigênio e respostas fisiológicas do organismo em ambientes hiperbáricos.',
  en:'Pressure, gases, oxygen and the body’s physiological responses in hyperbaric environments.',
  es:'Presión, gases, oxígeno y respuestas fisiológicas del organismo en ambientes hiperbáricos.'
 },meta:{pt:'8 temas',en:'8 topics',es:'8 temas'}},
 {route:'clinica',title:{pt:'Clínica',en:'Clinical Care',es:'Clínica'},description:{
  pt:'Avaliação do paciente, raciocínio clínico, riscos e decisões em medicina hiperbárica.',
  en:'Patient assessment, clinical reasoning, risks and decisions in hyperbaric medicine.',
  es:'Evaluación del paciente, razonamiento clínico, riesgos y decisiones en medicina hiperbárica.'
 },meta:{pt:'12 temas',en:'12 topics',es:'12 temas'}},
 {route:'camara',title:{pt:'Câmara',en:'Chamber',es:'Cámara'},description:{
  pt:'Tipos de câmara, funcionamento, equipamentos e segurança durante a terapia.',
  en:'Chamber types, operation, equipment and safety during therapy.',
  es:'Tipos de cámara, funcionamiento, equipos y seguridad durante la terapia.'
 },meta:{pt:'8 temas',en:'8 topics',es:'8 temas'}},
 {route:'operacao',title:{pt:'Operação',en:'Operations',es:'Operación'},description:{
  pt:'Preparação, monitoramento, checklists e rotinas operacionais do atendimento.',
  en:'Preparation, monitoring, checklists and operating routines for patient care.',
  es:'Preparación, monitorización, listas de verificación y rutinas operativas de atención.'
 },meta:{pt:'4 temas',en:'4 topics',es:'4 temas'}},
 {route:'#indications',title:{pt:'Indicações e Protocolos',en:'Indications and Protocols',es:'Indicaciones y Protocolos'},description:{
  pt:'Condições clínicas, critérios de indicação e protocolos terapêuticos relacionados.',
  en:'Clinical conditions, selection criteria and related treatment protocols.',
  es:'Condiciones clínicas, criterios de indicación y protocolos terapéuticos relacionados.'
 },meta:{pt:'Indicações · Protocolos',en:'Indications · Protocols',es:'Indicaciones · Protocolos'}},
 {route:'#focus',title:{pt:'Em Foco',en:'In Focus',es:'En Foco'},description:{
  pt:'Esporte, medicina regenerativa, cirurgia plástica e pesquisa científica.',
  en:'Sports, regenerative medicine, plastic surgery and scientific research.',
  es:'Deporte, medicina regenerativa, cirugía plástica e investigación científica.'
 },meta:{pt:'4 assuntos especiais',en:'4 featured subjects',es:'4 temas especiales'}}
];
export function renderFooter({lang,active,icon,e,consulta=false,chapter=null,favorite=false,backRoute='/home',nextRoute='/home'}){
 const n=navigationUI[lang];
 const base=typeof location==='undefined'||!String(location.pathname??'').startsWith('/oxygenna')?'/':'/oxygenna/';
 const to=route=>base+String(route).replace(/^\/+/, '');
 if(consulta){
   const choices=chapter?[
     ['VOLTAR',backRoute,'left'],
     [favorite?'FAVORITADO':'FAVORITAR','#favorite','check'],
     ['PRÓXIMO',nextRoute,'right']
   ]:FOOTER_ITEMS;
   return '<nav class="bottom-nav footer-card" aria-label="Filtros de consulta"'+(chapter?' style="grid-template-columns:repeat(3,minmax(0,1fr))"':'')+'>'+
      choices.map(([title,route,symbol],i)=>'<a '+(chapter&&i===1?'data-consulta-favorite': 'data-consulta-link')+
      ' href="'+(chapter&&i===1?'#favorite':to(route))+'" class="'+(active===route?'active':'')+'"'+(active===route?' aria-current="page"':'')+'>'+
      icon(symbol)+'<span>'+e(title)+'</span></a>').join('')+'</nav>';
 }

 const activePage=({chamber:'camara',indications:'clinica',protocols:'operacao'})[active]||active;
 return `<nav class="bottom-nav footer-card" aria-label="${e(n.navigation)}">${FOOTER_ITEMS.map(([title,route,symbol])=>`<a data-consulta-link href="${to(route)}" class="${activePage===route?'active':''}" ${activePage===route?'aria-current="page"':''}>${icon(symbol)}<span>${e(title)}</span></a>`).join('')}</nav>`;
}
export function renderStudyMap({lang,e,icon}){
 const n=navigationUI[lang],base=typeof location==='undefined'||!String(location.pathname??'').startsWith('/oxygenna')?'/':'/oxygenna/';
 const action={pt:'Explorar conteúdos',en:'Explore the content',es:'Explorar contenidos'}[lang]||'Explorar conteúdos';
 return `<section class="study-map" aria-labelledby="study-map-title"><p class="tag">${n.browse}</p><h2 id="study-map-title" class="display">${n.map}</h2><p class="subtle">${e(n.mapIntro)}</p><ol class="study-stages">${HOME_STUDY_AREAS.map((item,i)=>{
  const clinical=!item.route.startsWith('#'),href=clinical?base+item.route:item.route;
  return `<li><a class="study-stage" ${clinical?'data-consulta-link ':''}href="${href}"><span class="stage-marker" aria-hidden="true">${i+1}</span><span class="stage-copy"><span class="tag">${e(n.step)} ${String(i+1).padStart(2,'0')}</span><strong>${e(item.title[lang]||item.title.pt)}</strong><span class="stage-description">${e(item.description[lang]||item.description.pt)}</span><span class="stage-meta">${e(item.meta[lang]||item.meta.pt)}</span><span class="stage-status">${e(action)}</span></span>${icon('right')}</a></li>`;
 }).join('')}</ol><a class="primary chapter-cta" href="#chapters">${n.viewAll}${icon('right')}</a></section>`;
}
export function renderNotices({lang,readNotices,e,back,noticePersisted}){
 const n=navigationUI[lang],allRead=NOTICE_IDS.every(id=>readNotices.includes(id));
 return `${back('#home')}<p class="tag">${n.noticeLocal}</p><h1 class="display page-title">${n.notifications}</h1><p class="subtle">${n.noticeIntro}</p>${NOTICE_IDS.map((id,i)=>`<article class="panel notice ${readNotices.includes(id)?'notice-read':''}"><h2>${e(n.noticeTitles[i])}</h2><p class="subtle">${e(n.noticeBodies[i])}</p><a class="${i===0?'primary chapter-cta':'secondary'}" href="${i===0?'#chapters':'#home'}">${i===0?n.viewAll:n.map}</a></article>`).join('')}<p role="status" class="subtle">${allRead?n.allRead:''}${noticePersisted?'':` ${n.noticeSaveFail}`}</p>${allRead?'':`<button class="secondary" type="button" data-read-notices>${n.markRead}</button>`}`;
}
