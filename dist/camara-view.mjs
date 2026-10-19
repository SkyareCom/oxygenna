import {camaraLessons,camaraLesson,camaraBoyle,camaraPIO2} from './camara-data.mjs';
import {camaraDepth} from './camara-depth.mjs';
import {camaraModuleForLesson,camaraLessonsForModule} from './camara-module-map.mjs?rev=camara-6mod-20261017';

/**
 * OXYGENNA — CÂMARA, dentro do frontend ORIGINAL.
 * Somente HTML de conteúdo. Não cria header, footer, CSS global ou segundo app.
 * A navegação continua pela mesma hash-router, sob #chamber e #camara/<id>.
 */
const UI={
 pt:{title:'EXPLORAR A CÂMARA',subtitle:'Oito capítulos sobre a câmara hiperbárica, a fisiologia e a segurança.',read:'Iniciar capítulo',step:'CAPÍTULO',objective:'OBJETIVO',essentials:'ENTENDA O ESSENCIAL',key:'PONTOS-CHAVE',nuance:'NUANCE CLÍNICA',summary:'EM POUCAS PALAVRAS',activity:'TESTE SEU CONHECIMENTO',check:'CONFERIR',answer:'Sua resposta',valid:'Digite um número válido.',correct:'CORRETO',wrong:'REVEJA SUA RESPOSTA',next:'PRÓXIMA ETAPA',previous:'ETAPA ANTERIOR',end:'VOLTAR À CÂMARA',sources:'FONTES DE REFERÊNCIA',sourceDesc:'Bibliografia única da seção. Informações educacionais, não prescrição.',lab:'LABORATÓRIO INTERATIVO',ata:'PRESSÃO ABSOLUTA',ready:'atividades concluídas',checklist:'PREPARAÇÃO SEGURA',evidence:'EVIDÊNCIA E INDICAÇÕES',disclaimer:'Os modelos são didáticos; PIO₂ não é PaO₂ e resultados não definem conduta clínica.',sourceContent:'',completed:'CONCLUÍDO'},
 en:{title:'EXPLORE THE CHAMBER',subtitle:'Eight chapters on chamber basics, physiology and safety.',read:'Open chapter',step:'CHAPTER',objective:'OBJECTIVE',essentials:'THE ESSENTIALS',key:'KEY POINTS',nuance:'CLINICAL NUANCE',summary:'IN BRIEF',activity:'CHECK YOUR KNOWLEDGE',check:'CHECK',answer:'Your answer',valid:'Enter a valid number.',correct:'CORRECT',wrong:'REVIEW YOUR ANSWER',next:'NEXT STEP',previous:'PREVIOUS STEP',end:'BACK TO CHAMBER',sources:'REFERENCES',sourceDesc:'Section-wide bibliography. Educational, not a prescription.',lab:'INTERACTIVE LAB',ata:'ABSOLUTE PRESSURE',ready:'activities completed',checklist:'SAFETY PREPARATION',evidence:'EVIDENCE AND INDICATIONS',disclaimer:'These are teaching models; inspired PO₂ is not arterial PaO₂.',sourceContent:'Scientific chapter text is currently available in Brazilian Portuguese; translation is pending.',completed:'COMPLETED'},
 es:{title:'EXPLORAR LA CÁMARA',subtitle:'Ocho capítulos sobre la cámara, fisiología y seguridad.',read:'Abrir capítulo',step:'CAPÍTULO',objective:'OBJETIVO',essentials:'LO ESENCIAL',key:'PUNTOS CLAVE',nuance:'MATIZ CLÍNICO',summary:'EN POCAS PALABRAS',activity:'COMPRUEBA TUS CONOCIMIENTOS',check:'COMPROBAR',answer:'Tu respuesta',valid:'Introduce un número válido.',correct:'CORRECTO',wrong:'REVISA TU RESPUESTA',next:'SIGUIENTE ETAPA',previous:'ETAPA ANTERIOR',end:'VOLVER A CÁMARA',sources:'FUENTES DE REFERENCIA',sourceDesc:'Bibliografía de la sección. Material educativo, no prescripción.',lab:'LABORATORIO INTERACTIVO',ata:'PRESIÓN ABSOLUTA',ready:'actividades completadas',checklist:'PREPARACIÓN SEGURA',evidence:'EVIDENCIA E INDICACIONES',disclaimer:'Modelos didácticos; PIO₂ inspirada no equivale a PaO₂ arterial.',sourceContent:'El contenido científico está disponible en portugués de Brasil; la traducción está pendiente.',completed:'COMPLETADO'}
};
const mediaSources={'assets/camara-tipos.svg':'camara-tipos.svg','assets/ouvido-equalizacao.svg':'ouvido-equalizacao.svg','assets/oxigenio-plasma.svg':'oxigenio-plasma.svg','assets/pressao-volume.svg':'pressao-volume.svg'};
const ui=lang=>UI[lang]||UI.pt;
const lead=(tag,title)=>'<p class="tag">'+tag+'</p><h2 class="display camara-section-title">'+title+'</h2>';
const mediaText=(p,e)=>'<p>'+e(p)+'</p>';
function renderCamaraDepth(lesson,{e}){
 const data=camaraDepth[lesson.id];if(!data)return '';
 const img={ 'camara-07':'seguranca-camara.svg','camara-08':'evidencia-indicacoes.svg' }[lesson.id];
 return '<div class="camara-extended-content" aria-label="Aprofundamento científico">'+
   data.sections.map(item=>'<section class="panel camara-explainer"><h2>'+e(item.heading)+'</h2><p lang="pt-BR">'+e(item.body)+'</p></section>').join('')+
   (img?'<figure class="camara-figure camara-figure-extra"><img src="./assets/'+img+'" alt="'+e(data.visualTitle)+'" loading="lazy"><figcaption>'+e(data.visualTitle)+'</figcaption></figure>':'')+
   '<section class="panel camara-visual-sequence" aria-label="'+e(data.visualTitle)+'"><h2>'+e(data.visualTitle)+'</h2>'+
   '<ol class="camara-flow">'+data.visualSteps.map((step,i)=>'<li><span class="camara-step-count">'+String(i+1).padStart(2,'0')+'</span><span lang="pt-BR">'+e(step)+'</span></li>').join('')+'</ol></section></div>';
}
export const camaraRoutes=Object.freeze(camaraLessons.map(x=>'#camara/'+x.id));
export function camaraGraphText(engine,ata,lang='pt'){
 if(engine==='boyleNormalized')return 'V / V₀ = '+(100*camaraBoyle(ata)).toLocaleString(lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',{maximumFractionDigits:1})+'%';
 if(engine==='inspiredOxygenHumidified')return 'PIO₂ estimada: '+camaraPIO2(ata,1).toLocaleString(lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',{maximumFractionDigits:0})+' mmHg — não é PaO₂';
 throw new RangeError('Gráfico não suportado');
}
function renderMedia(m,{lang,e}){
 const n=ui(lang);
 if(m.type==='diagram'){
  const filename=mediaSources[m.asset]; if(!filename)return '';
  return '<figure class="camara-figure"><img src="./assets/'+filename+'" loading="lazy" alt="'+e(m.caption||'Diagrama educativo')+'"><figcaption>'+e(m.caption||'')+'</figcaption></figure>';
 }
 if(m.type==='interactive-graph'){
   return '<section class="panel camara-lab">'+lead(e(n.lab),e(m.caption||''))+
    '<label for="camara-pressure">'+e(n.ata)+' — <output id="camara-pressure-output">2,4 ATA (= atm) · 243,18 kPa</output></label>'+
    '<input type="range" id="camara-pressure" data-camara-engine="'+e(m.engine)+'" min="'+Number(m.rangeATA?.[0]||1)+'" max="'+Number(m.rangeATA?.[1]||3)+'" step="0.1" value="2.4">'+
    '<p id="camara-graph-result" role="status">'+e(camaraGraphText(m.engine,2.4,lang))+'</p><p class="micro">'+e(n.disclaimer)+'</p></section>';
 }
 if(m.type==='checklist')return '<section class="panel camara-checklist">'+lead(e(n.checklist),'')+
  (m.items||[]).map((t,i)=>'<label><input type="checkbox" value="'+i+'"> <span lang="pt-BR">'+e(t)+'</span></label>').join('')+'</section>';
 if(m.type==='evidence-map')return '<section class="panel camara-evidence">'+lead(e(n.evidence),'')+
  (m.categories||[]).map(t=>'<div class="camara-evidence-item" lang="pt-BR">'+e(t)+'</div>').join('')+'</section>';
 // animation-plan: editorial script only; do not pretend a video exists.
 return '';
}
function renderActivity(lesson,{lang,e,answers}){
 const n=ui(lang),activity=lesson.activity,answer=answers?.get(lesson.id);
 const done=answer?.correct===true;
 const feedback=answer===undefined?'':('<p class="feedback '+(done?'':'wrong')+'" role="status">'+e((done?n.correct:n.wrong)+'. '+answer.explanation)+'</p>');
 if(activity.type==='single-choice')return '<section class="panel camara-quiz"><p class="tag">'+e(n.activity)+'</p><fieldset class="quiz"><legend lang="pt-BR">'+e(activity.data.question)+'</legend>'+
   activity.data.options.map((option,i)=>'<button type="button" class="answer '+(done&&i===answer.value?'correct':'')+'" data-camara-answer="'+i+'" data-camara-id="'+e(lesson.id)+'" aria-pressed="'+(answer?.value===i)+'" '+(done?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><span lang="pt-BR">'+e(option)+'</span></button>').join('')+
   '</fieldset>'+feedback+'</section>';
 if(activity.type==='calculation')return '<section class="panel camara-quiz"><p class="tag">'+e(n.activity)+'</p><p lang="pt-BR">'+e(activity.prompt)+'</p>'+
  '<div class="camara-calc-row"><input type="text" inputmode="decimal" id="camara-calc-answer" aria-label="'+e(n.answer)+'" placeholder="0,40" '+(done?'disabled':'')+'>'+
  '<button type="button" class="secondary" data-camara-calc="'+e(lesson.id)+'" '+(done?'disabled':'')+'>'+e(n.check)+'</button></div>'+feedback+'</section>';
 return '';
}
function renderCamaraBody(lesson,{lang,e,answers}){
 const n=ui(lang);
 return (n.sourceContent?'<p class="micro" lang="pt-BR">'+e(n.sourceContent)+'</p>':'')+
'<section class="panel camara-objective"><h2>'+e(n.objective)+'</h2><p lang="pt-BR">'+e(lesson.objective)+'</p></section>'+
  '<article class="panel camara-prose"><h2>'+e(n.essentials)+'</h2>'+lesson.paragraphs.map(p=>mediaText(p,e)).join('')+'</article>'+
  (lesson.media||[]).map(m=>renderMedia(m,{lang,e})).join('')+renderCamaraDepth(lesson,{e})+
  '<section class="panel camara-points"><h2>'+e(n.key)+'</h2><ul>'+lesson.keyPoints.map(p=>'<li lang="pt-BR">'+e(p)+'</li>').join('')+'</ul></section>'+
  '<section class="panel camara-nuance"><h2>'+e(n.nuance)+'</h2><p lang="pt-BR">'+e(lesson.clinicalNuance)+'</p></section>'+
  '<section class="panel camara-summary"><h2>'+e(n.summary)+'</h2><p lang="pt-BR">'+e(lesson.audio.script)+'</p></section>'+
  renderActivity(lesson,{lang,e,answers});
}
/** Reaproveita uma única vez as mídias e a atividade da aula associada ao tema.
 * Não repete os parágrafos introdutórios nem a seção OBJETIVO.
 */
export function renderCamaraTopicExtras(lessonId,{lang='pt',e,answers=new Map(),includeActivity=true}){
 const lesson=camaraLesson(lessonId);if(!lesson)return '';
 const n=ui(lang),data=camaraDepth[lessonId];
 const img={'camara-07':'seguranca-camara.svg','camara-08':'evidencia-indicacoes.svg'}[lessonId];
 return '<div class="camara-topic-extras">'+
  (lesson.media||[]).filter(m=>lessonId==='camara-02'?m.type==='interactive-graph':lessonId==='camara-03'?m.type==='diagram':lessonId==='camara-07'?m.type==='checklist':m.type==='diagram').map(m=>renderMedia(m,{lang,e})).join('')+
  (img?'<figure class="camara-figure"><img src="./assets/'+img+'" alt="'+e(data?.visualTitle||lesson.title)+'" loading="lazy"><figcaption>'+e(data?.visualTitle||lesson.title)+'</figcaption></figure>':'')+
  (data&&!['camara-02','camara-03','camara-05','camara-07'].includes(lessonId)?'<section class="panel camara-visual-sequence"><h2>'+e(data.visualTitle)+'</h2><ol class="camara-flow">'+data.visualSteps.map((step,i)=>'<li><span class="camara-step-count">'+(i+1)+'</span><span lang="pt-BR">'+e(step)+'</span></li>').join('')+'</ol></section>':'')+
  (includeActivity?renderActivity(lesson,{lang,e,answers}):'')+'</div>';
}
export function renderCamaraModuleContent(moduleId,{lang='pt',e,icon,answers=new Map(),completed=[]}){
 const ids=camaraLessonsForModule(moduleId);
 if(!ids.length)return '';
 const n=ui(lang),done=new Set(completed);
 const heading={pt:'CONTEÚDOS DO CAPÍTULO',en:'CHAPTER CONTENT',es:'CONTENIDOS DEL CAPÍTULO'}[lang]||'CONTEÚDOS DO CAPÍTULO';
 const hint={pt:'Abra cada tema para estudar as explicações, ilustrações e atividades.',en:'Open each topic for explanations, illustrations and activities.',es:'Abre cada tema para ver explicaciones, ilustraciones y actividades.'}[lang];
 return '<section class="camara-in-module" aria-label="'+e(heading)+'"><p class="tag">'+e(heading)+'</p>'+
  '<p class="subtle camara-module-hint">'+e(hint)+'</p>'+
  ids.map(id=>{
   const lesson=camaraLesson(id);
   if(!lesson)return '';
   const complete=done.has(id);
   return '<details class="camara-inline-chapter" data-camara-id="'+e(id)+'" id="conteudo-'+e(id)+'">'+
    '<summary><span class="camara-inline-title" lang="pt-BR">'+e(lesson.title)+'</span>'+
    (complete?'<span class="camara-inline-done">'+e(n.completed)+'</span>':'')+
    icon('right')+'</summary>'+
    '<div class="camara-inline-body">'+renderCamaraBody(lesson,{lang,e,answers})+'</div></details>';
  }).join('')+'</section>';
}
/** Mantido para links antigos; o conteúdo principal agora vive dentro dos módulos. */
export function renderCamaraDetail(id,{lang='pt',e,icon,back,completed=[],answers=new Map(),notFound}){
 const lesson=camaraLesson(id);if(!lesson)return notFound();
 const n=ui(lang),index=camaraLessons.indexOf(lesson),before=camaraLessons[index-1],after=camaraLessons[index+1];
 const moduleId=camaraModuleForLesson(id);
 const contextReturn=moduleId?'#module/'+moduleId+'/chamber':'#chamber';
 const title='<p class="tag">'+e(n.step)+' '+String(index+1).padStart(2,'0')+' / 08</p><h1 class="display page-title" lang="pt-BR">'+e(lesson.title)+'</h1>';
 return back(contextReturn)+title+renderCamaraBody(lesson,{lang,e,answers})+
  '<nav class="module-navigation camara-step-nav" aria-label="'+e(n.step)+'">'+
  (before?'<a class="secondary" href="#camara/'+before.id+'">'+icon('left')+e(n.previous)+'</a>':'<a class="secondary" href="'+contextReturn+'">'+icon('left')+e(n.end)+'</a>')+
  (after?'<a class="secondary" href="#camara/'+after.id+'">'+e(n.next)+icon('right')+'</a>':'<a class="secondary" href="'+contextReturn+'">'+e(n.end)+icon('right')+'</a>')+
  '</nav>';
}
