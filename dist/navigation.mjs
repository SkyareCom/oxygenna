import {modules,phases,getModules,getLearningPath} from './curriculum.mjs';
import {lessons} from './content.mjs';

export const sectionModules={
 chamber:['01','02','03','04','05','06'],
 indications:['07','09','10','11','12','13','14','15','19'],
 protocols:['06','08','18','21','22','23','24']
};
const contexts=new Set([...Object.keys(sectionModules),'all','path-medicine','path-diving','common','medicine','diving','integration','pressure','oxygen','clinical','safety']);
export const normalizeContext=value=>contexts.has(value)?value:'';
export function getCurriculumItems(filter){
 filter=normalizeContext(filter);
 if(sectionModules[filter])return modules.filter(m=>sectionModules[filter].includes(m.id));
 return filter.startsWith('path-')?getLearningPath(filter.slice(5)):getModules(filter);
}
export const moduleHref=(id,context)=>`#module/${id}${normalizeContext(context)?`/${context}`:''}`;
export const lessonHref=(id,context)=>`#lesson/${id}${normalizeContext(context)?`/${context}`:''}`;
export const mapHref=context=>context==='all'?'#chapters':sectionModules[normalizeContext(context)]?`#${context}`:`#curriculum${normalizeContext(context)?`/${context}`:''}`;
export function activeSection(route){
 const [page,id,context]=route.split('/');
 if(page==='home'||page==='focus')return 'home';
 if(sectionModules[page])return page;
 if(page==='lab')return 'chamber';
 if(page==='camara')return 'chamber';
 if(page==='topic'&&sectionModules[normalizeContext(route.split('/')[3])])return route.split('/')[3];
 if(page==='topic')return 'chapters';
 if(page==='indication')return 'indications';
 if(page==='protocol')return 'protocols';
 if(['module','lesson'].includes(page)&&sectionModules[normalizeContext(context)])return context;
 if(['chapters','learn','track','module','lesson','curriculum'].includes(page))return sectionModules[normalizeContext(id)]?id:'chapters';
 return '';
}
export function getStudySteps(lang,completed=[]){
 const done=new Set(completed),ui=navigationUI[lang];
 return phases.map((p,i)=>{
  const items=modules.filter(m=>m.phase===p.id);
  const published=new Set(items.flatMap(m=>m.lessons).filter(id=>lessons.some(l=>l.id===id)));
  return {id:p.id,title:p[lang],description:ui.stepDescriptions[i],href:`#chapters/${p.id}`,modules:items.length,topics:items.reduce((n,m)=>n+m[lang].topics.length,0),available:published.size,completed:[...published].filter(id=>done.has(id)).length};
 });
}
export function getNextLesson(completed=[]){
 const done=new Set(completed);
 const next=modules.flatMap(m=>m.lessons).find(id=>!done.has(id)&&lessons.some(l=>l.id===id));
 return lessons.find(l=>l.id===next)??null;
}
export const NOTICE_IDS=['curriculum-24','navigation-5'];
const NOTICE_KEY='hyperbaric-campus-notices-v1';
export function loadReadNotices(storage){try{const value=JSON.parse(storage?.getItem(NOTICE_KEY)??'null');return Array.isArray(value)?NOTICE_IDS.filter(id=>value.includes(id)):[];}catch{return [];}}
export function markNoticesRead(storage){try{storage.setItem(NOTICE_KEY,JSON.stringify(NOTICE_IDS));return true;}catch{return false;}}

export const navigationUI={
 pt:{brand:['OXYGENNA','MEDICINA HIPERBÁRICA'],nav:['HOME','CÂMARA','CAPÍTULOS','INDICAÇÕES','PROTOCOLOS'],navigation:'Navegação principal',notifications:'Notificações',profile:'Perfil e idioma',unread:'Há atualizações não lidas',map:'Seu mapa de estudos',mapIntro:'Siga a sequência para construir uma base sólida. Retome as aulas disponíveis e explore os próximos temas.',step:'Etapa',modules:'módulos',topics:'temas',available:'aulas iniciais',completed:'consolidadas',start:'Começar a estudar',resume:'Continuar estudos',review:'Revisar capítulos',next:'Próxima aula disponível',viewAll:'Ver todos os capítulos',tools:'Laboratório de pressão e gases',browse:'Explore por assunto',chapters:'Capítulos de aprendizagem',chaptersIntro:'O índice completo, dos fundamentos aos casos integrados. Escolha uma etapa ou siga as trilhas de medicina e mergulho.',stepDescriptions:['Pressão, gases, oxigênio e segurança. A base para avançar.','Avaliação, indicações, evidências e cuidado hiperbárico.','Imersão, barotraumas, descompressão e assistência.','Fatores humanos, decisões em equipe e leitura crítica.'],sections:{chamber:{title:'Câmara hiperbárica',intro:'Conheça o ambiente, a física, a fisiologia do oxigênio e os fundamentos de segurança. Explore também os modelos do laboratório.'},indications:{title:'Indicações clínicas',intro:'Estude a seleção de pacientes, as condições clínicas e a evidência disponível em medicina hiperbárica e do mergulho. Cada tema apresenta suas fontes e limites.'},protocols:{title:'Protocolos e segurança',intro:'Consulte os roteiros por condição, seleção, condutas associadas, referências de regime e reavaliação. Aprofunde também a segurança e a organização do cuidado.'}},noticeIntro:'Atualizações do conteúdo e da experiência de aprendizagem.',noticeLocal:'Avisos do campus disponíveis neste app.',noticeTitles:['Seu programa de estudos','Uma nova forma de explorar'],noticeBodies:['O mapa reúne 24 módulos e 144 temas, com 13 aulas introdutórias disponíveis em português, inglês e espanhol.','Câmara, capítulos, indicações e protocolos agora têm acesso próprio. A Home apresenta a sequência recomendada.'],markRead:'Marcar atualizações como lidas',allRead:'Todas as atualizações foram lidas.',noticeSaveFail:'A leitura foi registrada nesta sessão; o navegador não permitiu salvá-la.'},
 en:{brand:['OXYGENNA','HYPERBARIC MEDICINE'],nav:['HOME','CHAMBER','CHAPTERS','INDICATIONS','PROTOCOLS'],navigation:'Main navigation',notifications:'Notifications',profile:'Profile and language',unread:'Unread updates available',map:'Your study map',mapIntro:'Follow the sequence to build a solid foundation. Resume available lessons and explore the next topics.',step:'Step',modules:'modules',topics:'topics',available:'initial lessons',completed:'consolidated',start:'Start learning',resume:'Continue learning',review:'Review chapters',next:'Next available lesson',viewAll:'View all chapters',tools:'Pressure and gas laboratory',browse:'Explore by subject',chapters:'Learning chapters',chaptersIntro:'The complete index, from foundations to integrated cases. Choose a stage or follow the medicine and diving pathways.',stepDescriptions:['Pressure, gases, oxygen and safety. Your foundation for learning.','Assessment, indications, evidence and hyperbaric care.','Immersion, barotrauma, decompression and accident care.','Human factors, team decisions and critical reading.'],sections:{chamber:{title:'Hyperbaric chamber',intro:'Explore the environment, physics, oxygen physiology and safety foundations. Try the educational models in the laboratory.'},indications:{title:'Clinical indications',intro:'Study patient selection, clinical conditions and available evidence in hyperbaric and diving medicine. Each topic identifies its sources and limits.'},protocols:{title:'Protocols and safety',intro:'Consult condition-specific pathways, selection, concurrent care, regimen references and reassessment. Also study safety and care organization.'}},noticeIntro:'Updates to content and your learning experience.',noticeLocal:'Campus notices available in this app.',noticeTitles:['Your study programme','A new way to explore'],noticeBodies:['The map contains 24 modules and 144 topics, with 13 introductory lessons available in Portuguese, English and Spanish.','Chamber, chapters, indications and protocols now have their own destinations. Home presents the recommended sequence.'],markRead:'Mark updates as read',allRead:'All updates have been read.',noticeSaveFail:'Read status was recorded for this session; the browser could not save it.'},
 es:{brand:['OXYGENNA','MEDICINA HIPERBÁRICA'],nav:['INICIO','CÁMARA','CAPÍTULOS','INDICACIONES','PROTOCOLOS'],navigation:'Navegación principal',notifications:'Notificaciones',profile:'Perfil e idioma',unread:'Hay actualizaciones sin leer',map:'Tu mapa de estudio',mapIntro:'Sigue la secuencia para construir una base sólida. Retoma las lecciones disponibles y explora los próximos temas.',step:'Etapa',modules:'módulos',topics:'temas',available:'lecciones iniciales',completed:'consolidadas',start:'Empezar a estudiar',resume:'Continuar estudios',review:'Repasar capítulos',next:'Próxima lección disponible',viewAll:'Ver todos los capítulos',tools:'Laboratorio de presión y gases',browse:'Explora por tema',chapters:'Capítulos de aprendizaje',chaptersIntro:'El índice completo, de los fundamentos a los casos integrados. Elige una etapa o sigue las rutas de medicina y buceo.',stepDescriptions:['Presión, gases, oxígeno y seguridad. La base para avanzar.','Evaluación, indicaciones, evidencia y cuidado hiperbárico.','Inmersión, barotraumas, descompresión y asistencia.','Factores humanos, decisiones en equipo y lectura crítica.'],sections:{chamber:{title:'Cámara hiperbárica',intro:'Conoce el entorno, la física, la fisiología del oxígeno y los fundamentos de seguridad. Explora también los modelos del laboratorio.'},indications:{title:'Indicaciones clínicas',intro:'Estudia la selección de pacientes, las condiciones clínicas y la evidencia disponible en medicina hiperbárica y del buceo. Cada tema identifica sus fuentes y límites.'},protocols:{title:'Protocolos y seguridad',intro:'Consulta secuencias por condición, selección, tratamiento asociado, referencias de esquemas y reevaluación. Profundiza también en seguridad y organización del cuidado.'}},noticeIntro:'Actualizaciones del contenido y de la experiencia de aprendizaje.',noticeLocal:'Avisos del campus disponibles en esta app.',noticeTitles:['Tu programa de estudio','Una nueva forma de explorar'],noticeBodies:['El mapa reúne 24 módulos y 144 temas, con 13 lecciones introductorias disponibles en portugués, inglés y español.','Cámara, capítulos, indicaciones y protocolos ahora tienen acceso propio. Inicio presenta la secuencia recomendada.'],markRead:'Marcar actualizaciones como leídas',allRead:'Todas las actualizaciones se han leído.',noticeSaveFail:'La lectura se registró en esta sesión; el navegador no permitió guardarla.'}
};
