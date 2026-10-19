import {consultaData} from './consulta/data.mjs';
import {consultaById,consultaRoute,isConsultaRoute,consultaHref,renderConsultaPage,renderConsultaSearch} from './consulta/consulta-view.mjs?rev=busca-global-20261018';
import {curriculumUI,modules} from './curriculum.mjs';
import {renderCurriculum,renderModule,renderModuleTopic} from './curriculum-view.mjs?rev=knowledge-final-20261018';
import {handleModule01Click,handleModule01Input} from './module01-media.mjs?rev=knowledge-final-20261018';
import {handleKnowledgeClick} from './knowledge-check.mjs?rev=knowledge-final-20261018';
import {navigationUI,sectionModules,activeSection,normalizeContext,getCurriculumItems,moduleHref,lessonHref,NOTICE_IDS,loadReadNotices,markNoticesRead} from './navigation.mjs?rev=camara-6mod-20261017';
import {renderHeader,renderFooter,renderStudyMap,renderNotices} from './navigation-view.mjs?rev=home-original-large-cards-20261018';
import {renderFocus} from './focus-view.mjs';
import {renderClinicalCatalog,renderClinicalDetail} from './clinical-view.mjs';
import {loadState,saveState,completeLesson,boyle,partialPressure,henryRelative,thermalRatio,pressureUnits} from './core.mjs';
import {tracks,lessons,sources} from './content.mjs';
import {renderReferencesDrawer} from './reference-library.mjs?rev=central-refs-20261019';
import {renderCamaraDetail,camaraGraphText} from './camara-view.mjs?rev=knowledge-final-20261018';
import {camaraAnswer} from './camara-data.mjs';
import {renderFundamentosBasicos,handleFundamentosConversion} from './fundamentos-basicos.mjs?rev=photo-atm-20261019';
import {withInlineDrawers} from './inline-drawers.mjs?rev=global-inline-drawers-20261019';
import {updatePhysicsActivity,setDiverDepthFromPointer} from './fundamentos-interativos.mjs?rev=movable-diver-20261019';

const UI={
 pt:{brand:'OXYGENNA',campus:'Seu campus de aprendizagem',hero:'Ciência sob pressão.',start:'Iniciar jornada',trails:'Trilhas de conhecimento',trailsSub:'Dos fundamentos à prática',lab:'Laboratório interativo',labSub:'Explore pressão, gases e tecidos',motto:'Entender. Visualizar. Aplicar.',explore:'Explorar trilhas',nav:['Início','Aprender','Laboratório','Perfil'],back:'Voltar',lesson:'Aula',sources:'Referências consultadas',library:'Biblioteca científica',editorial:'Síntese educacional • Revisão editorial',clinical:'Revisão clínica independente ainda não realizada.',check:'Consolidar o conhecimento',correct:'Correto. Aula registrada no seu progresso.',repeat:'Correto. Esta aula já estava registrada; o progresso não será duplicado.',wrong:'Releia a explicação e tente novamente.',next:'Próxima aula',trackEnd:'Voltar à trilha',experiment:'Experimentar no laboratório',profile:'Seu percurso',mastered:'aulas consolidadas',progress:'Conhecimento em construção',language:'Idioma',local:'Seu progresso fica salvo neste navegador. Sem ranking entre pessoas.',storageFail:'O navegador não permitiu salvar os dados. O progresso permanece nesta sessão.',read:'Leitura crítica e fontes',catalogNote:'Conteúdo inicial em expansão. As fontes têm escopo e datas próprios; citações não representam credenciamento ou certificação do campus.',access:{full:'Texto público consultado',indexed:'Resumo ou trecho indexado consultado',notice:'Comunicado consultado',scope:'Escopo público; norma integral não consultada',catalog:'Catálogo; vigência por verificar'},consulted:'Consultado em',update:'O relatório completo do consenso ECHM de 2026 ainda aguardava publicação na consulta. O consenso de 2017 permanece identificado por seu ano.',norms:'Normas e unidades',normNote:'A aplicação de normas depende de seu escopo, edição e jurisdição. O catálogo ABNT integra a pesquisa; não há declaração de conformidade ABNT/ISO nesta versão.',lessons:'aulas',absolute:'Pressão absoluta',partial:'Pressão parcial do gás',fraction:'Fração de oxigênio',temperature:'Temperatura final',volume:'Volume final',pressure:'Pressão final',index:'Concentração relativa',base:'Condição inicial',model:'Modelo didático ideal. Não determina doses, tratamento ou perfis de descompressão.',hypotheses:{units:'Conversões da mesma pressão absoluta. A pressão atmosférica local pode diferir de uma atmosfera padrão.',boyle:'Quantidade de gás e temperatura constantes. P₁ = 101,325 kPa; V₁ = 1 000 mL. Pressões absolutas.',dalton:'Mistura gasosa seca ideal: pO₂ = F O₂ × P absoluta. O resultado não é a pressão alveolar ou arterial.',henry:'Equilíbrio; mesmo gás, solvente e temperatura. C/C₀ = p/p₀, com p₀ = 101,325 kPa. Índice relativo, sem coeficiente de solubilidade sanguínea.',charles:'Pressão e quantidade de gás constantes. T₁ = 300 K; V₁ = 1 000 mL. Use temperaturas absolutas.',gay:'Volume e quantidade de gás constantes. T₁ = 300 K; P₁ = 101,325 kPa. Use temperaturas absolutas.'},unavailable:'Página não encontrada',return:'Voltar ao início',summary:'As aulas iniciais são sínteses curtas. Abra as fontes para aprofundar a leitura.',chartX:'Pressão absoluta (kPa)',chartY:'Volume (mL)',skip:'Ir ao conteúdo'},
 en:{brand:'OXYGENNA',campus:'Your learning campus',hero:'Science under pressure.',start:'Start your journey',trails:'Knowledge pathways',trailsSub:'From foundations to practice',lab:'Interactive laboratory',labSub:'Explore pressure, gases and tissues',motto:'Understand. Visualize. Apply.',explore:'Explore pathways',nav:['Home','Learn','Laboratory','Profile'],back:'Back',lesson:'Lesson',sources:'Consulted references',library:'Scientific library',editorial:'Educational synthesis • Editorial review',clinical:'Independent clinical review has not yet been performed.',check:'Consolidate your knowledge',correct:'Correct. Lesson saved to your progress.',repeat:'Correct. This lesson was already recorded; progress will not be duplicated.',wrong:'Review the explanation and try again.',next:'Next lesson',trackEnd:'Back to pathway',experiment:'Explore in the laboratory',profile:'Your learning journey',mastered:'lessons consolidated',progress:'Building your knowledge',language:'Language',local:'Your progress is saved in this browser. There is no ranking between people.',storageFail:'This browser could not save data. Progress remains available for this session.',read:'Critical reading and sources',catalogNote:'An initial, growing curriculum. Sources have their own scope and dates; citations do not imply campus accreditation or certification.',access:{full:'Public text consulted',indexed:'Indexed abstract or excerpt consulted',notice:'Announcement consulted',scope:'Public scope; full standard not consulted',catalog:'Catalog; current status requires verification'},consulted:'Consulted on',update:'The full 2026 ECHM consensus report was still awaiting publication when consulted. The 2017 consensus remains identified by its year.',norms:'Standards and units',normNote:'A standard’s applicability depends on scope, edition and jurisdiction. The ABNT catalog is part of the research; this version makes no ABNT/ISO conformity declaration.',lessons:'lessons',absolute:'Absolute pressure',partial:'Gas partial pressure',fraction:'Oxygen fraction',temperature:'Final temperature',volume:'Final volume',pressure:'Final pressure',index:'Relative concentration',base:'Initial condition',model:'Ideal educational model. It does not determine doses, treatment or decompression profiles.',hypotheses:{units:'Conversions of the same absolute pressure. Local atmospheric pressure can differ from one standard atmosphere.',boyle:'Constant gas amount and temperature. P₁ = 101.325 kPa; V₁ = 1,000 mL. Absolute pressures.',dalton:'Ideal dry gas mixture: pO₂ = F O₂ × absolute P. The result is not alveolar or arterial pressure.',henry:'Equilibrium; same gas, solvent and temperature. C/C₀ = p/p₀, with p₀ = 101.325 kPa. A relative index, without a blood solubility coefficient.',charles:'Constant pressure and gas amount. T₁ = 300 K; V₁ = 1,000 mL. Use absolute temperatures.',gay:'Constant volume and gas amount. T₁ = 300 K; P₁ = 101.325 kPa. Use absolute temperatures.'},unavailable:'Page not found',return:'Back to home',summary:'The initial lessons are brief syntheses. Open the sources for deeper reading.',chartX:'Absolute pressure (kPa)',chartY:'Volume (mL)',skip:'Skip to content'},
 es:{brand:'OXYGENNA',campus:'Tu campus de aprendizaje',hero:'Ciencia bajo presión.',start:'Iniciar recorrido',trails:'Rutas de conocimiento',trailsSub:'De los fundamentos a la práctica',lab:'Laboratorio interactivo',labSub:'Explora presión, gases y tejidos',motto:'Entender. Visualizar. Aplicar.',explore:'Explorar rutas',nav:['Inicio','Aprender','Laboratorio','Perfil'],back:'Volver',lesson:'Lección',sources:'Referencias consultadas',library:'Biblioteca científica',editorial:'Síntesis educativa • Revisión editorial',clinical:'La revisión clínica independiente aún no se ha realizado.',check:'Consolidar el conocimiento',correct:'Correcto. Lección registrada en tu progreso.',repeat:'Correcto. Esta lección ya estaba registrada; el progreso no se duplicará.',wrong:'Revisa la explicación e inténtalo de nuevo.',next:'Siguiente lección',trackEnd:'Volver a la ruta',experiment:'Explorar en el laboratorio',profile:'Tu recorrido',mastered:'lecciones consolidadas',progress:'Conocimiento en construcción',language:'Idioma',local:'Tu progreso se guarda en este navegador. No hay clasificación entre personas.',storageFail:'El navegador no permitió guardar los datos. El progreso se conserva durante esta sesión.',read:'Lectura crítica y fuentes',catalogNote:'Contenido inicial en expansión. Las fuentes tienen alcances y fechas propios; las citas no implican acreditación o certificación del campus.',access:{full:'Texto público consultado',indexed:'Resumen o fragmento indexado consultado',notice:'Comunicado consultado',scope:'Alcance público; norma completa no consultada',catalog:'Catálogo; vigencia pendiente de verificar'},consulted:'Consultado el',update:'El informe completo del consenso ECHM de 2026 aún esperaba publicación al consultarlo. El consenso de 2017 sigue identificado por su año.',norms:'Normas y unidades',normNote:'La aplicación de normas depende de su alcance, edición y jurisdicción. El catálogo ABNT forma parte de la investigación; esta versión no declara conformidad ABNT/ISO.',lessons:'lecciones',absolute:'Presión absoluta',partial:'Presión parcial del gas',fraction:'Fracción de oxígeno',temperature:'Temperatura final',volume:'Volumen final',pressure:'Presión final',index:'Concentración relativa',base:'Condición inicial',model:'Modelo didáctico ideal. No determina dosis, tratamientos ni perfiles de descompresión.',hypotheses:{units:'Conversiones de la misma presión absoluta. La presión atmosférica local puede diferir de una atmósfera estándar.',boyle:'Cantidad de gas y temperatura constantes. P₁ = 101,325 kPa; V₁ = 1 000 mL. Presiones absolutas.',dalton:'Mezcla gaseosa seca ideal: pO₂ = F O₂ × P absoluta. El resultado no es la presión alveolar ni arterial.',henry:'Equilibrio; mismo gas, solvente y temperatura. C/C₀ = p/p₀, con p₀ = 101,325 kPa. Índice relativo, sin coeficiente de solubilidad sanguínea.',charles:'Presión y cantidad de gas constantes. T₁ = 300 K; V₁ = 1 000 mL. Utiliza temperaturas absolutas.',gay:'Volumen y cantidad de gas constantes. T₁ = 300 K; P₁ = 101,325 kPa. Utiliza temperaturas absolutas.'},unavailable:'Página no encontrada',return:'Volver al inicio',summary:'Las lecciones iniciales son síntesis breves. Abre las fuentes para profundizar la lectura.',chartX:'Presión absoluta (kPa)',chartY:'Volumen (mL)',skip:'Ir al contenido'}
};
for(const lang of ['pt','en','es'])UI[lang].access.book=curriculumUI[lang].book;
let storage;try{storage=window.localStorage;}catch{storage=null;}
let readNotices=loadReadNotices(storage);let noticePersisted=true;
let state=loadState(storage);let persisted=true;let labMode='boyle';let labP=202.65;let labF=21;let labT=330;
const selectedAnswers=new Map();const selectedCamaraAnswers=new Map();
let consultaBusca='';
let consultaUltimo='';let consultaOrigem='/home';
const consultaFavoritos=new Set();const consultaRespostas=new Map();
try{consultaUltimo=storage?.getItem('oxygenna-consulta-ultimo')||'';const raw=JSON.parse(storage?.getItem('oxygenna-consulta-favoritos')||'[]');for(const x of raw)consultaFavoritos.add(x);}catch{}
function saveConsulta(){try{storage?.setItem('oxygenna-consulta-ultimo',consultaUltimo);storage?.setItem('oxygenna-consulta-favoritos',JSON.stringify([...consultaFavoritos]));}catch{}}
function showConsulta(){
 if(typeof location==='undefined'||typeof location.pathname!=='string'||Boolean(location.hash))return false;
 // A Home original é a única tela recuperada; demais rotas clínicas seguem intactas.
 const route=consultaRoute();
 return route!=='/home' && isConsultaRoute(route);
}
function irConsulta(id){
 history.pushState(null,'',consultaHref(id));
 render();
 document.querySelector('#main')?.scrollTo?.(0,0);
}
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=()=>UI[state.lang];const fmt=(n,d=2)=>new Intl.NumberFormat(state.lang,{maximumFractionDigits:d}).format(n);
const paths={activity:'<path d="M2 12h5l3-8 4 16 3-8h5"/>',repair:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6zM19 2v4m-2-2h4"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',chamber:'<rect x="2" y="6" width="20" height="12" rx="6"/><circle cx="16" cy="12" r="3"/><path d="M7 6v12M6 20h2m8 0h2"/>',indications:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',protocols:'<rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 2h6v4H9zM8 12l2 2 5-5M8 18h8"/>',home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>',book:'<path d="M12 5c-3-3-7-3-10-1v16c3-2 7-2 10 1m0-16c3-3 7-3 10-1v16c-3-2-7-2-10 1V5Z"/>',flask:'<path d="M8 2h8m-6 0v7L3 20q-1 2 2 2h14q3 0 2-2L14 9V2M7 15h10"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',right:'<path d="m9 4 7 8-7 8"/>',left:'<path d="m15 4-7 8 7 8"/>',check:'<path d="m4 12 5 5L20 6"/>',external:'<path d="M14 3h7v7M21 3 10 14M10 3H3v18h18v-7"/>'};
const icon=(name)=>`<svg class="icon" data-icon="${name}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.book}</svg>`;
const art=(crop,alt='')=>`<div class="art ${crop}"><img src="./assets/reference-approved.png" width="1536" height="1024" alt="${e(alt)}" ${alt?'':'aria-hidden="true"'}></div>`;
const langButtons=()=>`<div class="languages" role="group" aria-label="${e(t().language)}">${['pt','en','es'].map(lang=>`<button type="button" data-lang="${lang}" lang="${lang}" aria-label="${{pt:'Português',en:'English',es:'Español'}[lang]}" aria-pressed="${state.lang===lang}">${lang.toUpperCase()}</button>`).join('')}</div>`;
const back=(href='#learn')=>`<a class="back" href="${href}">${icon('left')}${t().back}</a>`;
const primary=(label,href,cls='')=>`<a class="primary ${cls}" href="${href}">${e(label)}${icon('right')}</a>`;
function sourceLinks(ids){return ids.map(id=>{const s=sources[id];return `<a class="source" href="${e(s.url)}" target="_blank" rel="noopener noreferrer"><strong>${e(s.title)} <span class="card-arrow" aria-hidden="true">↗</span></strong><small>${e(s.author)}${s.year?' · '+s.year:''}${s.doi?' · DOI: '+e(s.doi):''}</small><small class="source-type">${e(t().access[s.access])}</small><small>${t().consulted}: 15/10/2026</small></a>`}).join('');}
const homeExtraCopy={
 pt:{subtitle:'CONTEÚDO EXTRA DISPONÍVEL',title:'FUNDAMENTOS BÁSICOS',action:'COMEÇAR ESTUDOS'},
 en:{subtitle:'ADDITIONAL CONTENT AVAILABLE',title:'BASIC FUNDAMENTALS',action:'START STUDYING'},
 es:{subtitle:'CONTENIDO EXTRA DISPONIBLE',title:'FUNDAMENTOS BÁSICOS',action:'COMENZAR ESTUDIOS'}
};
function renderHome(){
 const copy=homeExtraCopy[state.lang]||homeExtraCopy.pt;
 return `<p class="eyebrow">${t().campus}</p><h1 class="display home-title">${t().hero}</h1><div class="home-hero">${art('home-art')}</div><section class="study-resume"><p class="tag">${e(copy.subtitle)}</p><h2>${e(copy.title)}</h2>${primary(e(copy.action),'#fundamentos-basicos')}</section>${renderStudyMap({lang:state.lang,completed:state.completed,e,icon})}`;
}
function renderLearn(){return `${back('#home')}<h1 class="display learn-heading">${t().motto}</h1>${art('chamber-art')}<div class="tracks" id="tracks">${tracks.map(track=>`<a class="track" href="#track/${track.id}">${art('crop-'+track.crop)}<div class="copy"><strong>${e(track[state.lang][0])}</strong><small>${e(track[state.lang][1])}</small></div>${icon('right')}</a>`).join('')}</div><button class="primary explore" type="button" data-explore>${t().explore}${icon('right')}</button>`;}
function renderTrack(id){const track=tracks.find(a=>a.id===id);if(!track)return notFound();const items=lessons.filter(a=>a.track===id);return `${back()}<p class="tag">${t().trails}</p><h1 class="display page-title">${e(track[state.lang][0])}</h1><p class="subtle">${e(track[state.lang][1])} · ${items.length} ${t().lessons}</p><a class="secondary" href="#curriculum/${track.id}">${curriculumUI[state.lang].map}${icon('right')}</a><div class="lesson-list">${items.map((lesson,i)=>`<a class="lesson-link" href="#lesson/${lesson.id}"><span class="lesson-number">${String(i+1).padStart(2,'0')}</span><strong>${e(lesson[state.lang].title)}</strong>${icon(state.completed.includes(lesson.id)?'check':'right')}</a>`).join('')}</div><p class="micro">${t().summary}</p>`;}
function renderLesson(id,context){context=normalizeContext(context);const lesson=lessons.find(a=>a.id===id);if(!lesson)return notFound();const a=lesson[state.lang],answer=selectedAnswers.get(id),correct=answer===lesson.correct;const group=context?getCurriculumItems(context).flatMap(m=>m.lessons).map(id=>lessons.find(l=>l.id===id)).filter(Boolean):lessons.filter(a=>a.track===lesson.track),index=group.indexOf(lesson),next=index>=0?group[index+1]:null,parent=modules.find(m=>m.lessons.includes(id)),returnHref=context&&parent?moduleHref(parent.id,context):'#track/'+lesson.track;return `${back(returnHref)}<p class="tag">${t().lesson} ${String(lessons.indexOf(lesson)+1).padStart(2,'0')}</p><h1 class="display page-title">${e(a.title)}</h1><article class="panel lesson-body"><p>${e(a.body)}</p></article>${lesson.lab?`<a class="secondary" href="#lab/${lesson.lab}">${icon('flask')}${t().experiment}</a>`:''}<section class="panel"><p class="tag">${t().check}</p><fieldset class="quiz"><legend>${e(a.question)}</legend>${a.answers.map((text,i)=>`<button type="button" class="answer ${correct&&i===answer?'correct':''}" data-answer="${i}" data-lesson="${lesson.id}" aria-pressed="${answer===i}"><span>${String.fromCharCode(65+i)}</span><span>${e(text)}</span></button>`).join('')}</fieldset><p class="feedback ${answer!==undefined&&!correct?'wrong':''}" role="status">${answer===undefined?'':correct?t().correct:t().wrong}</p></section>${correct?primary(next?t().next:t().trackEnd,next?lessonHref(next.id,context):returnHref):''}<p class="micro">${t().editorial}${lesson.track==='clinical'||lesson.track==='safety'?'<br>'+t().clinical:''}</p>`;}
function renderProfile(openSources=false){const count=lessons.filter(a=>state.completed.includes(a.id)).length;return `${back(openSources?'#profile':'#home')}<p class="eyebrow">${t().profile}</p><h1 class="display page-title">${t().progress}</h1><section class="panel"><p class="progress-number">${count}<small> / ${lessons.length}</small></p><p class="subtle">${t().mastered}</p><div class="progress-shell" role="progressbar" aria-label="${e(t().mastered)}" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${lessons.length}"><span style="width:${count/lessons.length*100}%"></span></div><p class="profile-note">${t().local}</p>${!persisted?`<p class="error profile-note">${t().storageFail}</p>`:''}</section><section class="panel"><div class="setting-row"><span>${t().language}</span>${langButtons()}</div><a class="setting-row" href="#curriculum"><span>${curriculumUI[state.lang].label}</span>${icon('right')}</a></section>${renderReferencesDrawer(state.lang,openSources)}${primary(t().explore,'#learn')}<p class="micro">${t().catalogNote}</p>`;}
function renderSources(){return renderProfile(true);}
function notFound(){return `${back('#home')}<h1 class="display page-title">${t().unavailable}</h1>${primary(t().return,'#home')}`;}
function labChart(){const points=Array.from({length:121},(_,i)=>{let x=1+i/40;return `${44+(x-1)/3*292},${176-1000/x/1000*132}`}).join(' ');const x=44+(labP/101.325-1)/3*292;const y=176-boyle(101.325,1000,labP)/1000*132;return `<svg class="lab-chart" viewBox="0 0 370 228" role="img" aria-label="${e(t().chartY+' / '+t().chartX)}"><path class="axis" d="M44 35V176H346"/><polyline class="curve" points="${points}"/><circle class="point" cx="${x}" cy="${y}" r="6"/><text x="1" y="47">1 000</text><text x="20" y="180">0</text><text x="44" y="199" text-anchor="middle">${fmt(101.325,3)}</text><text x="336" y="199" text-anchor="middle">${fmt(405.3,1)}</text><text x="44" y="20">${t().chartY}</text><text x="190" y="222" text-anchor="middle">${t().chartX}</text></svg>`;}
const labNames={units:{pt:'Unidades',en:'Units',es:'Unidades'},boyle:{pt:'Boyle',en:'Boyle',es:'Boyle'},dalton:{pt:'Dalton',en:'Dalton',es:'Dalton'},henry:{pt:'Henry',en:'Henry',es:'Henry'},charles:{pt:'Charles',en:'Charles',es:'Charles'},gay:{pt:'Gay-Lussac',en:'Gay-Lussac',es:'Gay-Lussac'}};
function labOutput(){if(labMode==='units'){const u=pressureUnits(labP);return `<div class="unit-line"><span>kPa</span><strong>${fmt(u.kpa,3)}</strong></div><div class="unit-line"><span>ATA</span><strong>${fmt(u.ata,4)}</strong></div><div class="unit-line"><span>atm</span><strong>${fmt(u.ata,4)}</strong></div><div class="unit-line"><span>bar</span><strong>${fmt(u.bar,4)}</strong></div>`;}if(labMode==='boyle')return `<p class="equation">P₁V₁ = P₂V₂</p><p class="lab-result">${fmt(boyle(101.325,1000,labP),1)} <small>mL · ${t().volume}</small></p>${labChart()}`;if(labMode==='dalton')return `<p class="equation">pO₂ = F O₂ × P</p><p class="lab-result">${fmt(partialPressure(labP,labF/100),3)} <small>kPa · pO₂ · ${fmt(partialPressure(labP,labF/100)/101.325,3)} atm</small></p>`;if(labMode==='henry')return `<p class="equation">C / C₀ = p / p₀</p><p class="lab-result">${fmt(henryRelative(labP,101.325),3)} <small>× · ${t().index}</small></p>`;let ratio=thermalRatio(300,labT);return `<p class="equation">${labMode==='charles'?'V₁ / T₁ = V₂ / T₂':'P₁ / T₁ = P₂ / T₂'}</p><p class="lab-result">${fmt((labMode==='charles'?1000:101.325)*ratio,2)} <small>${labMode==='charles'?'mL · '+t().volume:'kPa · '+fmt(101.325*ratio/101.325,3)+' atm · '+t().pressure}</small></p>`;}
function renderLab(){let thermal=['charles','gay'].includes(labMode);return `${back('#chamber')}<p class="tag">${t().lab}</p><h1 class="display page-title">${t().labSub}</h1><div class="lab-tabs" role="group" aria-label="${e(t().lab)}">${Object.entries(labNames).map(([id,v])=>`<button type="button" data-lab="${id}" aria-pressed="${labMode===id}">${v[state.lang]}</button>`).join('')}</div><section class="panel"><label class="lab-label" for="lab-p"><span>${thermal?t().temperature:labMode==='henry'?t().partial:t().absolute}</span><output id="pressure-output" for="lab-p">${thermal?fmt(labT,2)+' K':fmt(labP,3)+' kPa · '+fmt(labP/101.325,3)+' atm'}</output></label><input id="lab-p" type="range" min="${thermal?273.15:101.325}" max="${thermal?373.15:405.3}" step="${thermal?0.05:0.025}" value="${thermal?labT:labP}">${labMode==='dalton'?`<label class="lab-label" for="lab-f"><span>${t().fraction}</span><output id="fraction-output" for="lab-f">${fmt(labF)} %</output></label><input id="lab-f" type="range" min="0" max="100" step="1" value="${labF}">`:''}<div id="lab-result" aria-live="polite">${labOutput()}</div><p class="subtle">${t().hypotheses[labMode]}</p></section><p class="micro">${t().model}</p>`;}
function currentRoute(){const route=location.hash.replace(/^#\/?/,'')||'home';return route==='main'?'home':route;}
function persist(){persisted=saveState(storage,state);}
/** Mantém expandida a lição interna durante o feedback do exercício. */
function renderCamaraPreservingExpansion(){
 const open=typeof document.querySelectorAll==='function'?[...document.querySelectorAll('details.camara-inline-chapter[open]')].map(item=>item.dataset.camaraId):[];
 render();
 if(typeof document.querySelectorAll==='function')for(const item of document.querySelectorAll('details.camara-inline-chapter'))if(open.includes(item.dataset.camaraId))item.open=true;
}
// As quatro telas principais ficam visualmente vazias até a próxima etapa editorial.
// O banco de capítulos e as rotas internas continuam preservados.
const EMPTY_SECTION_ROUTES=new Set(['/fisiologia','/clinica','/camara','/operacao']);
function renderEmptySectionBase(){
 return '<div class="oxygenna-section-base" role="group" aria-label="Créditos da página">'+
  '<span class="oxygenna-section-base-left">PAPOS DE ALTITUDE</span>'+
  '<img class="oxygenna-section-base-logo" src="./assets/oxygenna-logo.png" width="38" height="38" alt="OXYGENNA">'+
  '<span class="oxygenna-section-base-right">PH4 DEV &amp; HEALTH</span></div>';
}
function renderFisiologiaPresentation(){
 return '<figure class="oxygenna-fisiologia-presentation" aria-label="Apresentação da seção Fisiologia">'+
  '<img src="./assets/fisiologia-camara-apresentacao.webp" width="800" height="522" loading="eager" decoding="async" alt="Câmara hiperbárica hospitalar com título FISIOLOGIA na base da imagem">'+
  '<figcaption class="sr-only">Fisiologia</figcaption></figure>';
}
function render(){
 if(showConsulta()){
  const route=consultaRoute(),chapter=route.startsWith('/capitulo/')?route.split('/')[2]:null;
  const item=chapter?consultaById.get(chapter):null;
  if(item){consultaUltimo=chapter;saveConsulta();}
  const filter=item?.filtro||route.slice(1);
  const blank=EMPTY_SECTION_ROUTES.has(route);
  const main=withInlineDrawers(blank?(route==='/fisiologia'?renderFisiologiaPresentation():'')+renderEmptySectionBase():renderConsultaPage(route,{query:consultaBusca,lastId:consultaUltimo,illustration:art('home-art'),icon,answers:consultaRespostas.get(chapter)||{}}));
  document.documentElement.lang='pt-BR';
  document.title='OXYGENNA — Medicina Hiperbárica';
  document.querySelector('.skip').textContent='Ir ao conteúdo';
  document.querySelector('#app').innerHTML=renderHeader({lang:'pt',icon,e,unread:false})+
   '<main id="main" tabindex="-1" class="module'+(blank?' oxygenna-blank-page':'')+'">'+main+'</main>'+
   renderFooter({lang:'pt',active:filter,icon,e,consulta:true,chapter,favorite:consultaFavoritos.has(chapter),backRoute:consultaOrigem,nextRoute:item?.proximo_logico_id?'/capitulo/'+item.proximo_logico_id:'/home'});
  const brand=document.querySelector('.brand');
  if(brand){brand.href=consultaHref('home');brand.setAttribute('data-consulta-link','');}
  return;
 }
 const route=currentRoute();let [section,id,context]=route.split('/');
 if(section==='lab'&&labNames[id])labMode=id;
 const u=t(),n=navigationUI[state.lang];
 document.documentElement.lang={pt:'pt-BR',en:'en',es:'es'}[state.lang];document.title=u.brand+' — '+u.hero;document.querySelector('.skip').textContent=u.skip;
 const curriculumOptions={lang:state.lang,lessons,e,icon,back,sourceLinks};
 let page;
 if(section==='home')page=renderHome()+renderEmptySectionBase();
 else if(section==='fundamentos-basicos')page=renderFundamentosBasicos(state.lang,icon,back,e);
 else if(section==='learn')page=renderLearn();
 else if(section==='track')page=renderTrack(id);
 else if(section==='lesson')page=renderLesson(id,context);
 else if(section==='lab')page=renderLab();
 else if(section==='camara')page=renderCamaraDetail(id,{...curriculumOptions,completed:state.completed,answers:selectedCamaraAnswers,notFound});
 else if(section==='profile')page=renderProfile();
 else if(section==='sources')page=renderSources();
 else if(section==='focus')page=renderFocus(id,{...curriculumOptions,notFound});
 else if(section==='indication'||section==='protocol')page=renderClinicalDetail(section,id,{...curriculumOptions,notFound});
 else if(section==='notifications')page=renderNotices({lang:state.lang,readNotices,e,back,noticePersisted});
 else if(section==='chapters')page=renderCurriculum(id,{...curriculumOptions,title:n.chapters,intro:n.chaptersIntro});
 else if(sectionModules[section])page=renderCurriculum(section,{...curriculumOptions,catalog:['indications','protocols'].includes(section)?renderClinicalCatalog(section==='indications'?'indication':'protocol',curriculumOptions):'',illustration:section==='chamber'?art('chamber-art'):'',tools:section==='chamber'?`<a class="secondary" href="#lab">${icon('flask')}${n.tools}${icon('right')}</a>`:''});
 else if(section==='curriculum')page=renderCurriculum(id,curriculumOptions);
 else if(section==='module')page=renderModule(id,{...curriculumOptions,notFound,context,camaraAnswers:selectedCamaraAnswers,camaraCompleted:state.completed});
 else if(section==='topic')page=renderModuleTopic(id,context,{...curriculumOptions,context:route.split('/')[3],notFound,camaraAnswers:selectedCamaraAnswers});
 else page=notFound();
 page=withInlineDrawers(page);
 const unread=NOTICE_IDS.some(id=>!readNotices.includes(id));
 document.querySelector('#app').innerHTML=`${renderHeader({lang:state.lang,icon,e,unread})}<main id="main" tabindex="-1" class="${e(section==='track'?'track-page':section)}">${page}</main>${renderFooter({lang:state.lang,active:section==='fundamentos-basicos'?'home':activeSection(route),icon,e})}`;
}
document.addEventListener('click',event=>{
 const el=event.target;
 const routeLink=el.closest('[data-consulta-link]');
 if(routeLink){
  const url=new URL(routeLink.href,location.href);
  if(url.origin!==location.origin)return;
  const next=url.pathname.startsWith('/oxygenna/')?'/'+url.pathname.slice('/oxygenna/'.length):url.pathname;
  if(!isConsultaRoute(next))return;
  event.preventDefault();
  if(!next.startsWith('/capitulo/'))consultaOrigem=next;
  irConsulta(next);
  window.scrollTo?.(0,0);
  return;
 }
 if(showConsulta()){
  const favorite=el.closest('[data-consulta-favorite]');
  if(favorite){
   event.preventDefault();
   const id=consultaRoute().split('/')[2];
   if(consultaFavoritos.has(id))consultaFavoritos.delete(id);else consultaFavoritos.add(id);
   saveConsulta();
   const y=window.scrollY;render();window.scrollTo(0,y);return;
  }
  const answer=el.closest('[data-consulta-answer]');
  if(answer){
   const id=consultaRoute().split('/')[2],index=Number(answer.dataset.consultaQuestion);
   const map=consultaRespostas.get(id)||{};
   consultaRespostas.set(id,{...map,[index]:Number(answer.dataset.consultaAnswer)});
   const y=window.scrollY;render();window.scrollTo(0,y);
   return;
  }
 }
 if(handleKnowledgeClick(event.target))return;if(handleModule01Click(event.target))return;if(event.target.closest('.skip')){event.preventDefault();document.querySelector('#main')?.focus({preventScroll:true});return;}const target=event.target.closest('button');if(!target)return;if(target.dataset.lang){state={...state,lang:target.dataset.lang};persist();render();return;}if(target.hasAttribute('data-read-notices')){noticePersisted=markNoticesRead(storage);readNotices=[...NOTICE_IDS];render();return;}if(target.hasAttribute('data-explore')){location.hash='#curriculum';return;}if(target.dataset.lab){labMode=target.dataset.lab;history.replaceState(null,'','#lab/'+labMode);render();document.querySelector('[data-lab="'+labMode+'"]')?.focus({preventScroll:true});return;}if(target.dataset.camaraAnswer!==undefined){const id=target.dataset.camaraId,index=Number(target.dataset.camaraAnswer);const result=camaraAnswer(id,index);if(!selectedCamaraAnswers.get(id)?.correct){selectedCamaraAnswers.set(id,{value:index,...result});if(result.correct){state=completeLesson(state,id);persist();}}const scrollY=window.scrollY;renderCamaraPreservingExpansion();window.scrollTo(0,scrollY);return;}
 if(target.dataset.camaraCalc!==undefined){const id=target.dataset.camaraCalc;const raw=document.querySelector('#camara-calc-answer')?.value?.trim()??'';const v=/^\d+(?:[,.]\d+)?$/.test(raw)?Number(raw.replace(',','.')):NaN;if(!Number.isFinite(v)){const box=document.querySelector('.camara-quiz .feedback');if(box)box.textContent={pt:'Digite um número válido.',en:'Enter a valid number.',es:'Introduce un número válido.'}[state.lang];return;}const result=camaraAnswer(id,v);if(!selectedCamaraAnswers.get(id)?.correct){selectedCamaraAnswers.set(id,{value:v,...result});if(result.correct){state=completeLesson(state,id);persist();}}const scrollY=window.scrollY;renderCamaraPreservingExpansion();window.scrollTo(0,scrollY);return;}
 if(target.dataset.answer!==undefined){const lesson=lessons.find(a=>a.id===target.dataset.lesson);if(!lesson)return;const answer=Number(target.dataset.answer),already=state.completed.includes(lesson.id);selectedAnswers.set(lesson.id,answer);if(answer===lesson.correct){state=completeLesson(state,lesson.id);persist();}const scrollY=window.scrollY;render();if(answer===lesson.correct&&already){const feedback=document.querySelector('.feedback');if(feedback)feedback.textContent=t().repeat;}window.scrollTo(0,scrollY);document.querySelector(`[data-answer="${answer}"]`)?.focus({preventScroll:true});}});
document.addEventListener('input',event=>{
 if(showConsulta()&&event.target.matches('[data-consulta-busca]')){
  consultaBusca=event.target.value;
  const target=document.querySelector('#resultado-oxygenna');
  if(target)target.innerHTML=renderConsultaSearch(consultaBusca);
  return;
 }
 if(updatePhysicsActivity(event.target,state.lang))return;
 if(handleFundamentosConversion(event.target,state.lang))return;
  if(handleModule01Input(event.target))return;if(event.target.id==='camara-pressure'){const ata=Number(event.target.value);if(!Number.isFinite(ata)||ata<=0)return;const p=document.querySelector('#camara-pressure-output'),r=document.querySelector('#camara-graph-result');if(p)p.textContent=fmt(ata,1)+' ATA (= atm) · '+fmt(ata*101.325,2)+' kPa';if(r)r.textContent=camaraGraphText(event.target.dataset.camaraEngine,ata,state.lang);return;}if(!['lab-p','lab-f'].includes(event.target.id))return;const value=Number(event.target.value);if(!Number.isFinite(value))return;if(event.target.id==='lab-f')labF=value;else if(['charles','gay'].includes(labMode))labT=value;else labP=value;document.querySelector('#pressure-output').textContent=['charles','gay'].includes(labMode)?fmt(labT,2)+' K':fmt(labP,3)+' kPa · '+fmt(labP/101.325,3)+' atm';const f=document.querySelector('#fraction-output');if(f)f.textContent=fmt(labF)+' %';document.querySelector('#lab-result').innerHTML=labOutput();});
document.addEventListener('change',event=>{if(updatePhysicsActivity(event.target,state.lang))return;handleFundamentosConversion(event.target,state.lang);});

// Eventos delegados: continuam válidos após mudanças de rota e idioma.
let activeDiverPointer=null;
document.addEventListener('pointerdown',event=>{
 const handle=event.target.closest?.('[data-depth-diver],[data-depth-stage]');
 if(!handle)return;
 const stage=handle.closest('[data-depth-stage]');if(!stage)return;
 if(event.pointerType==='mouse'&&event.button!==0)return;
 event.preventDefault();
 activeDiverPointer={id:event.pointerId,stage};
 if(handle.matches('[data-depth-diver]'))handle.focus?.({preventScroll:true});
 stage.setPointerCapture?.(event.pointerId);
 setDiverDepthFromPointer(stage,event.clientY,state.lang);
});
document.addEventListener('pointermove',event=>{
 if(!activeDiverPointer||activeDiverPointer.id!==event.pointerId)return;
 setDiverDepthFromPointer(activeDiverPointer.stage,event.clientY,state.lang);
});
function endDiverDrag(event){
 if(activeDiverPointer?.id!==event.pointerId)return;
 const stage=activeDiverPointer.stage;activeDiverPointer=null;
 try{if(stage.hasPointerCapture?.(event.pointerId))stage.releasePointerCapture(event.pointerId);}catch{}
}
document.addEventListener('pointerup',endDiverDrag);
document.addEventListener('pointercancel',endDiverDrag);
document.addEventListener('keydown',event=>{
 const handle=event.target.closest?.('[data-depth-diver]');
 if(!handle)return;
 const step=({'ArrowDown':1,'ArrowUp':-1,'PageDown':10,'PageUp':-10,'Home':-60,'End':60})[event.key];
 if(step===undefined)return;
 event.preventDefault();
 const range=handle.closest('.fb-depth-activity')?.querySelector('[data-depth-range]');
 if(!range)return;
 range.value=String(Math.max(0,Math.min(60,Number(range.value)+step)));
 updatePhysicsActivity(range,state.lang);
});
window.addEventListener('popstate',()=>{render();window.scrollTo?.(0,0);});
window.addEventListener('hashchange',()=>{if(currentRoute()==='main'){document.querySelector('#main')?.focus();return;}render();window.scrollTo(0,0);document.querySelector('#main')?.focus({preventScroll:true});});
render();
