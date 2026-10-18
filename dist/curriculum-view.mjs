import {renderChapterClinical} from './clinical-view.mjs';
import {renderCamaraTopicExtras} from './camara-view.mjs?rev=topic-cards-20261017';
import {renderModule01Media,renderModule01Visual} from './module01-media.mjs?rev=camera-direta-20261018';
import {camaraAtTopic,topicReading} from './topic-readings.mjs';
import {phases,curriculumUI,getModule} from './curriculum.mjs';
import {navigationUI,sectionModules,normalizeContext,getCurriculumItems,moduleHref,lessonHref,mapHref} from './navigation.mjs';

export function renderCurriculum(filter,{lang,lessons,e,icon,back,sourceLinks,title,intro,illustration='',tools='',catalog=''}){
 filter=normalizeContext(filter);
 const c=curriculumUI[lang],n=navigationUI[lang],section=sectionModules[filter]?n.sections[filter]:null;
 if(catalog&&['indications','protocols'].includes(filter))return `${back('#home')}<h1 class="display page-title">${e(section.title)}</h1><p class="subtle">${e(section.intro)}</p><a class="primary chapter-cta" href="#chapters">${n.viewAll}${icon('book')}</a>${catalog}`;
 const focused=filter?.startsWith('path-')?filter.slice(5):null;
 const items=getCurriculumItems(filter);
 const count=items.reduce((n,m)=>n+m[lang].topics.length,0);
 const available=new Set(items.flatMap(m=>m.lessons).filter(id=>lessons.some(l=>l.id===id))).size;
 return `${back('#home')}<p class="tag">${c.label}</p><h1 class="display page-title">${e(section?.title??title??c.title)}</h1><p class="subtle">${e(section?.intro??intro??c.intro)}</p>${illustration}${tools}${section?`<a class="primary chapter-cta" href="#chapters">${n.viewAll}${icon('book')}</a>`:`<div class="lab-tabs curriculum-filters"><a class="secondary" href="#curriculum" ${!filter?'aria-current="page"':''}>${c.all}</a><a class="secondary" href="#curriculum/path-medicine" ${focused==='medicine'?'aria-current="page"':''}>${c.medicine}</a><a class="secondary" href="#curriculum/path-diving" ${focused==='diving'?'aria-current="page"':''}>${c.diving}</a></div>`}<p class="subtle">${items.length} ${c.modules} · ${count} ${c.themes}<br>${available} ${c.available}</p>${focused?`<p class="micro">${c.focusNote}</p>`:''}${catalog}${phases.map(phase=>{const group=items.filter(m=>m.phase===phase.id);return group.length?`<section><p class="tag">${e(phase[lang])}</p><div class="lesson-list">${group.map(m=>`<a class="lesson-link" href="${moduleHref(m.id,filter)}"><span class="lesson-number">${m.id}</span><strong>${e(m[lang].title)}</strong>${icon('right')}</a>`).join('')}</div></section>`:''}).join('')}<p class="micro">${c.note}</p><details><summary>${c.reading}</summary><p class="subtle">${c.bookNote}</p>${sourceLinks(['book_hmp','book_practices','book_diving','book_pressure'])}</details>`;
}
export const moduleTopicHref=(moduleId,topicIndex,context='all')=>`#topic/${moduleId}/${topicIndex}/${normalizeContext(context)||'all'}`;
export function renderModule(id,{lang,lessons,e,icon,back,sourceLinks,notFound,context,camaraAnswers=new Map(),camaraCompleted=[]}){
 context=normalizeContext(context)||'all';
 const m=getModule(id);if(!m)return notFound();
 const c=curriculumUI[lang],text=m[lang],phase=phases.find(p=>p.id===m.phase);
 const items=getCurriculumItems(context),index=items.indexOf(m),before=index>0?items[index-1]:null,after=index>=0?items[index+1]:null;
 const ready=m.lessons.map(id=>lessons.find(l=>l.id===id)).filter(Boolean);
 const topics='<section class="module-topic-section" aria-labelledby="module-topic-title">'+
  '<h2 class="module-topic-title" id="module-topic-title">'+e(c.topics)+'</h2>'+
  '<div class="lesson-list module-topic-list">'+text.topics.map((topic,i)=>'<a class="lesson-link module-topic-card" href="'+moduleTopicHref(m.id,i,context)+'" aria-label="'+e(topic)+'">'+
    '<span class="lesson-number">'+String(i+1).padStart(2,'0')+'</span><strong>'+e(topic)+'</strong>'+icon('right')+'</a>').join('')+'</div></section>';
 return back(mapHref(context))+
  '<p class="tag">'+m.id+' · '+e(phase[lang])+'</p><h1 class="display page-title">'+e(text.title)+'</h1>'+
  topics+
  renderChapterClinical(id,{lang,e,icon,sourceLinks,context})+
  (ready.length?'<details class="module-related-lessons"><summary>'+e(c.partial)+'</summary><div class="lesson-list">'+ready.map(l=>'<a class="lesson-link" href="'+lessonHref(l.id,context)+'"><strong>'+e(l[lang].title)+'</strong>'+icon('right')+'</a>').join('')+'</div></details>':'')+
  (m.prerequisites.length?'<details class="module-prerequisites"><summary>'+e(c.prerequisites)+'</summary>'+m.prerequisites.map(id=>{const p=getModule(id);return '<a class="source" href="'+moduleHref(id,context)+'"><strong>'+id+' · '+e(p[lang].title)+'</strong></a>';}).join('')+'</details>':'')+
  '<details class="module-sources"><summary>'+e(c.sources)+'</summary>'+sourceLinks(m.sources)+'</details>'+
  '<div class="module-navigation">'+(before?'<a class="secondary" href="'+moduleHref(before.id,context)+'">'+icon('left')+c.previous+'</a>':'')+
  (after?'<a class="secondary" href="'+moduleHref(after.id,context)+'">'+c.next+icon('right')+'</a>':'')+'</div>';
}
export function renderModuleTopic(moduleId,topicIndex,{lang,lessons,e,icon,back,sourceLinks,notFound,context,camaraAnswers=new Map(),embedded=false}){
 const m=getModule(moduleId),n=Number(topicIndex);if(!m||!Number.isInteger(n)||n<0||n>=m[lang].topics.length)return notFound();
 context=normalizeContext(context)||'all';
 const topic=m[lang].topics[n],notes=topicReading(m.id,n),camaraId=camaraAtTopic(m.id,n);
 const number=String(n+1).padStart(2,'0');
 const heading={pt:'TEMA',en:'TOPIC',es:'TEMA'}[lang],note={pt:'Texto científico disponibilizado em português brasileiro; traduções em preparação.',en:'This scientific reading is currently in Brazilian Portuguese; translation is pending.',es:'Esta lectura científica está disponible en portugués brasileño; traducción pendiente.'}[lang];
 const more={pt:'FONTES DE REFERÊNCIA',en:'REFERENCES',es:'FUENTES DE REFERENCIA'}[lang];
 const next=n+1<m[lang].topics.length?'<a class="secondary" href="'+moduleTopicHref(m.id,n+1,context)+'">'+e({pt:'PRÓXIMO TEMA',en:'NEXT TOPIC',es:'TEMA SIGUIENTE'}[lang])+icon('right')+'</a>':'';
 const previous=n>0?'<a class="secondary" href="'+moduleTopicHref(m.id,n-1,context)+'">'+icon('left')+e({pt:'TEMA ANTERIOR',en:'PREVIOUS TOPIC',es:'TEMA ANTERIOR'}[lang])+'</a>':'';
 // Imagens distribuídas ENTRE os parágrafos, sem galerias e sem duplicar conteúdo.
 const chapterReading=(m.id==='01'&&notes?.length
   ? notes.map((p,i)=>'<article class="panel topic-reading" lang="pt-BR"><p>'+e(p)+'</p></article>'+
      renderModule01Visual(m.id,n,i===0?'first':'middle',{lang,e})).join('')+
      renderModule01Visual(m.id,n,'after',{lang,e})
   : '<article class="panel topic-reading" lang="pt-BR">'+(notes?.length?notes.map(p=>'<p>'+e(p)+'</p>').join(''):'<p>'+e(m.pt.objective)+'</p>')+'</article>');

 if(embedded)return chapterReading;
 return back(moduleHref(m.id,context))+
  '<p class="tag">'+heading+' '+number+' / 06 · '+m.id+'</p>'+
  '<h1 class="display page-title">'+e(topic)+'</h1>'+
  (lang==='pt'?'':'<p class="micro">'+e(note)+'</p>')+
  chapterReading+
  (m.id==='01'?renderModule01Media(m.id,n,{lang,e}):(camaraId?renderCamaraTopicExtras(camaraId,{lang,e,answers:camaraAnswers}):''))+
  '<details class="topic-references"><summary>'+e(more)+'</summary>'+sourceLinks(m.sources)+'</details>'+
  '<nav class="module-navigation topic-navigation" aria-label="'+e(heading)+'">'+previous+next+'</nav>';
}
