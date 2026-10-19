import {clinicalConditions,clinicalUI} from './clinical-content.mjs';

export function renderClinicalCatalog(mode,{lang,e,icon}){
 const u=clinicalUI[lang],protocol=mode==='protocol';
 return `<section class="clinical-catalog" aria-labelledby="clinical-catalog-title"><h2 id="clinical-catalog-title" class="display page-title">${e(protocol?u.protocolCatalog:u.catalog)}</h2><p class="subtle">${clinicalConditions.length} ${e(u.count)} · PT / EN / ES</p><p class="subtle">${e(u.intro)}</p>${protocol?`<p class="clinical-note">${e(u.limits)}</p>`:''}${Object.entries(u.groups).map(([group,title],i)=>{const items=clinicalConditions.filter(c=>c.group===group);return `<details class="clinical-group" ${i===0?'open':''}><summary>${e(title)} <span>(${items.length})</span></summary><div class="lesson-list">${items.map(c=>`<a class="lesson-link" href="#${mode}/${c.id}"><strong>${e(c[lang].title)}</strong>${icon('right')}</a>`).join('')}</div></details>`;}).join('')}<p class="micro">${e(u.restricted)}</p><p class="micro">${e(u.date)}</p></section>`;
}

export function renderClinicalDetail(mode,id,{lang,e,icon,back,sourceLinks,notFound}){
 const c=clinicalConditions.find(c=>c.id===id);if(!c)return notFound();
 const u=clinicalUI[lang],t=c[lang],protocol=mode==='protocol',parent=protocol?'protocols':'indications';
 const panel=(label,text)=>`<section class="panel clinical-panel"><h2>${e(label)}</h2><p>${e(text)}</p></section>`;
 return `${back('#'+parent)}<p class="tag">${e(protocol?u.protocolCatalog:u.catalog)}</p><h1 class="display page-title">${e(t.title)}</h1><p class="clinical-status">${e(t.scope)}${c.cfm.length?`<br>CFM 1.457/1995 · ${e(c.cfm.join(', '))}`:''}</p>${panel(u.selection,t.selection)}${panel(u.priority,t.priority)}${protocol?`${panel(u.care,t.care)}${panel(u.regimen,t.regimen)}${panel(u.review,t.review)}<details class="clinical-safety" open><summary>${e(u.safety)}</summary><p class="subtle">${e(u.safetyText)}</p><p class="micro">${e(u.units)}</p></details><p class="clinical-note">${e(u.limits)}</p>`:''}<a class="primary clinical-pair" href="#${protocol?'indication':'protocol'}/${c.id}">${e(protocol?u.openIndication:u.openProtocol)}${icon('right')}</a><p class="micro">${e(u.date)}</p>`;
}

export function renderChapterClinical(moduleId,{lang,e,icon,sourceLinks,context='all'}){
 const related=clinicalConditions.filter(c=>c.modules.includes(moduleId));
 if(!related.length)return '';
 const primary=related.filter(c=>c.primaryModule===moduleId),references=related.filter(c=>c.primaryModule!==moduleId),u=clinicalUI[lang];
 const field=(label,text)=>`<h3 class="clinical-field-title">${e(label)}</h3><p>${e(text)}</p>`;
 return `<section class="chapter-clinical" aria-labelledby="chapter-clinical-title"><h2 id="chapter-clinical-title" class="display page-title">${e(u.chapterTitle)}</h2><p class="subtle">${e(u.chapterIntro)}</p>${primary.map(c=>{const t=c[lang];return `<details class="clinical-chapter-record" data-condition="${c.id}"><summary><strong>${e(t.title)}</strong>${icon('right')}</summary><div class="clinical-chapter-body"><p class="clinical-status">${e(t.scope)}${c.cfm.length?`<br>CFM 1.457/1995 · ${e(c.cfm.join(', '))}`:''}</p>${field(u.selection,t.selection)}${field(u.priority,t.priority)}${field(u.care,t.care)}${field(u.regimen,t.regimen)}${field(u.review,t.review)}<a class="primary clinical-pair" href="#protocol/${c.id}">${e(u.openProtocol)}${icon('right')}</a></div></details>`;}).join('')}${references.length?`<h3 class="clinical-field-title">${e(u.relatedChapterRecords)}</h3><div class="lesson-list">${references.map(c=>`<a class="lesson-link clinical-chapter-reference" data-condition="${c.id}" href="#module/${c.primaryModule}/${context}"><span class="lesson-number">${c.primaryModule}</span><strong>${e(c[lang].title)}</strong>${icon('right')}</a>`).join('')}</div>`:''}${primary.length?`<details class="clinical-safety"><summary>${e(u.safety)}</summary><p class="subtle">${e(u.safetyText)}</p><p class="micro">${e(u.units)}</p></details><p class="clinical-note">${e(u.limits)}</p><p class="micro">${e(u.date)}</p>`:''}</section>`;
}
