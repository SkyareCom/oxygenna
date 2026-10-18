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
 const n=navigationUI[lang];
 const intro={
  pt:'Escolha uma área para explorar os conteúdos.',
  en:'Choose an area to explore the content.',
  es:'Elige un área para explorar los contenidos.'
 }[lang]||'Escolha uma área para explorar os conteúdos.';
 const base=typeof location==='undefined'||!String(location.pathname??'').startsWith('/oxygenna')?'/':'/oxygenna/';
 return `<section class="study-map" aria-labelledby="study-map-title"><p class="tag">${n.browse}</p><h2 id="study-map-title" class="display">${n.map}</h2><p class="subtle">${intro}</p><ol class="study-stages">${FOOTER_ITEMS.filter(([,route])=>route!=='home').map(([title,route,symbol])=>`<li><a class="study-stage" data-consulta-link href="${base+route}" aria-label="${e(title)}"><span class="stage-marker" aria-hidden="true">${icon(symbol)}</span><span class="stage-copy"><strong>${e(title)}</strong></span>${icon('right')}</a></li>`).join('')}</ol><a class="primary chapter-cta" href="#chapters">${n.viewAll}${icon('right')}</a></section>`;
}
export function renderNotices({lang,readNotices,e,back,noticePersisted}){
 const n=navigationUI[lang],allRead=NOTICE_IDS.every(id=>readNotices.includes(id));
 return `${back('#home')}<p class="tag">${n.noticeLocal}</p><h1 class="display page-title">${n.notifications}</h1><p class="subtle">${n.noticeIntro}</p>${NOTICE_IDS.map((id,i)=>`<article class="panel notice ${readNotices.includes(id)?'notice-read':''}"><h2>${e(n.noticeTitles[i])}</h2><p class="subtle">${e(n.noticeBodies[i])}</p><a class="${i===0?'primary chapter-cta':'secondary'}" href="${i===0?'#chapters':'#home'}">${i===0?n.viewAll:n.map}</a></article>`).join('')}<p role="status" class="subtle">${allRead?n.allRead:''}${noticePersisted?'':` ${n.noticeSaveFail}`}</p>${allRead?'':`<button class="secondary" type="button" data-read-notices>${n.markRead}</button>`}`;
}
