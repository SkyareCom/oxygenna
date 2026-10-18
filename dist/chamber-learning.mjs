import {getModule,curriculumUI} from './curriculum.mjs';
import {getCurriculumItems,moduleHref} from './navigation.mjs';
export function renderChamberLearning(id,opts,renderTopic){
 const {lang,e,icon,back,sourceLinks,notFound,camaraAnswers=new Map()}=opts;
 const m=getModule(id),items=getCurriculumItems('chamber');
 if(!m||!items.some(x=>x.id===id))return notFound();
 const ix=items.findIndex(x=>x.id===id),prev=items[ix-1],next=items[ix+1];
 const themes=m[lang].topics.map((_,i)=>renderTopic(id,i,{...opts,context:'chamber',embedded:true,camaraAnswers})).join('');
 const title=m[lang].title;
 return back('#chamber')+'<article class="chamber-lesson">'+
 '<p class="tag">'+m.id+' / '+String(items.length).padStart(2,'0')+'</p>'+
 '<h1 class="display page-title">'+e(title)+'</h1>'+
 themes+
 '<details class="chamber-references"><summary>'+e(curriculumUI[lang].sources)+'</summary>'+sourceLinks(m.sources)+'</details>'+
 '<nav class="module-navigation chamber-chapter-navigation">'+
 (prev?'<a class="secondary" href="'+moduleHref(prev.id,'chamber')+'">'+icon('left')+e('CAPÍTULO ANTERIOR')+'</a>':'')+
 (next?'<a class="secondary" href="'+moduleHref(next.id,'chamber')+'">'+e('PRÓXIMO CAPÍTULO')+icon('right')+'</a>':'')+
 '</nav></article>';
}