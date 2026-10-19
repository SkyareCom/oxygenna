import {focusUI,focusTopics} from './focus-content.mjs';

// Vector illustration recovered from the approved OX preview.
export function focusIllustration(){return `<svg class="focus-illustration" aria-hidden="true" viewBox="0 0 240 156" xmlns="http://www.w3.org/2000/svg" fill="none">
 <defs><linearGradient id="oxglow" x1="28" y1="20" x2="185" y2="145" gradientUnits="userSpaceOnUse"><stop stop-color="#a4f4f3"/><stop offset="1" stop-color="#267da0"/></linearGradient><linearGradient id="oxbody" x1="40" y1="45" x2="203" y2="115" gradientUnits="userSpaceOnUse"><stop stop-color="#e9fcff"/><stop offset="1" stop-color="#8ac9d8"/></linearGradient></defs>
 <circle cx="183" cy="45" r="34" stroke="#a4f4f3" stroke-opacity=".35"/><circle cx="183" cy="45" r="24" stroke="#a4f4f3" stroke-opacity=".24"/><path d="M35 112h172" stroke="#c1f6f7" stroke-opacity=".35" stroke-width="2"/>
 <path d="M63 105h114v12H63z" fill="#113e59" stroke="#b3eef3" stroke-width="1.5"/><path d="M79 116l-5 12m92-12 5 12" stroke="#79d8e4" stroke-width="6" stroke-linecap="round"/>
 <rect x="26" y="49" width="182" height="60" rx="30" fill="url(#oxbody)" stroke="#c8f8fb" stroke-width="3"/><rect x="59" y="55" width="93" height="48" rx="21" fill="#195d7c" stroke="#c8f8fb" stroke-width="2.5"/><rect x="65" y="60" width="81" height="38" rx="18" fill="url(#oxglow)" opacity=".9"/>
 <path d="M78 83h14l7-13 10 23 7-11h15" stroke="#f2feff" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="181" cy="79" rx="18" ry="23" stroke="#488ca6" stroke-width="3"/><circle cx="181" cy="79" r="7" stroke="#488ca6" stroke-width="2"/>
 <path d="M43 53v51M49 52v53" stroke="#81c3d1" stroke-width="2"/><circle cx="23" cy="36" r="7" stroke="#a4f4f3" stroke-width="1.5"/><circle cx="15" cy="25" r="3" fill="#a4f4f3"/><circle cx="206" cy="18" r="4" fill="#a4f4f3"/>
 <text x="19" y="16" fill="#e9fcff" font-size="12">O₂</text><text x="205" y="38" fill="#e9fcff" font-size="12">O₂</text>
</svg>`;}

export function renderFocusCard({lang,e}){
 const f=focusUI[lang];
 return `<a id="oxygenna-em-foco-card" class="focus-card" href="#focus"><span class="focus-copy"><span class="focus-kicker">${e(f.kicker)}</span><strong>${e(f.title)}</strong><span class="focus-description">${e(f.description)}</span><span class="focus-action">${e(f.explore)} <span class="card-arrow" aria-hidden="true">→</span></span></span><span class="focus-graphic" aria-hidden="true"><img class="focus-photo" src="./assets/hyperbaric-chamber-photo.jpg" width="3987" height="2912" alt="" loading="lazy" decoding="async"></span></a>`;
}

export function renderFocus(id,{lang,e,icon,back,sourceLinks,notFound}){
 const f=focusUI[lang];
 if(!id)return `${back('#home')}<section class="focus-banner"><div><p class="tag">${e(f.kicker)}</p><h1 class="display page-title">${e(f.title)}</h1><p class="subtle">${e(f.intro)}</p></div>${focusIllustration()}</section><p class="micro">${e(f.curation)}</p><div class="focus-topics">${focusTopics.map(topic=>`<a class="focus-topic" href="#focus/${topic.id}">${icon(topic.icon)}<span><strong>${e(topic[lang].title)}</strong><small>${e(topic[lang].subtitle)}</small></span>${icon('right')}</a>`).join('')}</div><p class="micro">${e(f.note)}</p>`;
 const topic=focusTopics.find(t=>t.id===id);if(!topic)return notFound();const t=topic[lang];
 return `${back('#focus')}<p class="tag">${e(f.title)}</p><h1 class="display page-title">${e(t.title)}</h1><p class="subtle">${e(t.intro)}</p><article class="panel focus-reading"><p class="tag">${e(f.reading)} · ${topic.year}</p><h2>${e(t.reading)}</h2><p class="focus-study-type">${e(t.type)}</p><p>${e(t.body)}</p></article><p class="micro">${e(f.note)}</p><p class="micro">${e(f.curation)}</p>`;
}
