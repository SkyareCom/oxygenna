import {navigationUI,getStudySteps,NOTICE_IDS} from './navigation.mjs';

export function renderHeader({lang,icon,e,unread}){
 const n=navigationUI[lang];
 return `<header class="app-header"><a class="brand" href="#home" aria-label="${e(n.brand.join(' '))}"><img class="brand-logo" src="./assets/oxygenna-logo.png" width="44" height="44" alt=""><span class="brand-name">${n.brand.map(word=>`<span>${e(word)}</span>`).join('')}</span></a><div class="header-actions"><a class="icon-button" href="#notifications" aria-label="${e(n.notifications+(unread?' — '+n.unread:''))}">${icon('bell')}${unread?'<span class="notification-dot" aria-hidden="true"></span>':''}</a><a class="icon-button" href="#profile" aria-label="${e(n.profile)}">${icon('user')}</a></div></header>`;
}
export function renderFooter({lang,active,icon,e,consultation=false,chapter=null,favorite=false,previous='/home',next=null}){
 const n=navigationUI[lang];
 if(consultation){
  const base=typeof location!=='undefined'&&location.pathname.startsWith('/oxygenna')?'/oxygenna/':'/';
  const href=route=>base+route.replace(/^\/+/,'');
  if(chapter){
   const items=[
    {title:'VOLTAR',path:previous,icon:'left'},
    {title:favorite?'FAVORITADO':'FAVORITAR',path:null,icon:'check'},
    {title:'PRÓXIMO',path:next||'/home',icon:'right'}
   ];
   return '<nav class="bottom-nav footer-card consulta-footer chapter-footer" aria-label="Navegação do capítulo">'+
     items.map((item,i)=>i===1?
      '<button type="button" class="consulta-fav-footer" data-consult-fav="'+e(chapter)+'" aria-pressed="'+favorite+'">'+icon(item.icon)+'<span>'+item.title+'</span></button>':
      '<a data-consult-link href="'+href(item.path)+'">'+icon(item.icon)+'<span>'+item.title+'</span></a>').join('')+'</nav>';
  }
  const items=[['home','HOME','home'],['fisiologia','FISIOLOGIA','activity'],['clinica','CLÍNICA','indications'],['camara','CÂMARA','chamber'],['operacao','OPERAÇÃO','protocols']];
  return '<nav class="bottom-nav footer-card consulta-footer" aria-label="Filtros principais">'+
    items.map(([id,title,symbol])=>'<a data-consult-link href="'+href('/'+id)+'" class="'+(active===id?'active':'')+'" '+(active===id?'aria-current="page"':'')+'>'+icon(symbol)+'<span>'+title+'</span></a>').join('')+'</nav>';
 }
 return '<nav class="bottom-nav footer-card" aria-label="'+e(n.navigation)+'">'+
 ['home','chamber','chapters','indications','protocols'].map((id,i)=>'<a href="#'+id+'" class="'+(active===id?'active':'')+'" '+(active===id?'aria-current="page"':'')+'>'+icon(['home','chamber','book','indications','protocols'][i])+'<span>'+e(n.nav[i])+'</span></a>').join('')+'</nav>';
}

export function renderStudyMap({lang,completed,e,icon}){
 const n=navigationUI[lang],steps=getStudySteps(lang,completed);
 return `<section class="study-map" aria-labelledby="study-map-title"><p class="tag">${n.browse}</p><h2 id="study-map-title" class="display">${n.map}</h2><p class="subtle">${n.mapIntro}</p><ol class="study-stages">${steps.map((step,i)=>`<li><a class="study-stage" href="${step.href}"><span class="stage-marker" aria-hidden="true">${i+1}</span><span class="stage-copy"><span class="tag">${n.step} ${String(i+1).padStart(2,'0')}</span><strong>${e(step.title)}</strong><span class="stage-description">${e(step.description)}</span><span class="stage-meta">${step.modules} ${n.modules} · ${step.topics} ${n.topics}</span><span class="stage-status">${step.completed} / ${step.available} ${n.available} ${n.completed}</span></span>${icon('right')}</a></li>`).join('')}</ol><a class="primary chapter-cta" href="#chapters">${n.viewAll}${icon('right')}</a></section>`;
}
export function renderNotices({lang,readNotices,e,back,noticePersisted}){
 const n=navigationUI[lang],allRead=NOTICE_IDS.every(id=>readNotices.includes(id));
 return `${back('#home')}<p class="tag">${n.noticeLocal}</p><h1 class="display page-title">${n.notifications}</h1><p class="subtle">${n.noticeIntro}</p>${NOTICE_IDS.map((id,i)=>`<article class="panel notice ${readNotices.includes(id)?'notice-read':''}"><h2>${e(n.noticeTitles[i])}</h2><p class="subtle">${e(n.noticeBodies[i])}</p><a class="${i===0?'primary chapter-cta':'secondary'}" href="${i===0?'#chapters':'#home'}">${i===0?n.viewAll:n.map}</a></article>`).join('')}<p role="status" class="subtle">${allRead?n.allRead:''}${noticePersisted?'':` ${n.noticeSaveFail}`}</p>${allRead?'':`<button class="secondary" type="button" data-read-notices>${n.markRead}</button>`}`;
}
