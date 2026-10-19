import {sources} from './content.mjs';
import {consultaData} from './consulta/data.mjs';

const labels={
 pt:{title:'FONTES DE REFERÊNCIA',description:'Bibliografia e documentos técnicos utilizados em todo o aplicativo, reunidos em um único local.',catalog:'REFERÊNCIAS CIENTÍFICAS E NORMATIVAS',legacy:'OBRAS CITADAS NOS CAPÍTULOS DE CONSULTA',media:'CRÉDITOS DE IMAGENS E RECURSOS',unverified:'Registros de obras mencionadas no material original; edição, acesso ao texto integral e dados bibliográficos dependem de conferência.',available:'Disponível em',consulted:'Acesso consultado em',notice:'A referência bibliográfica identifica a fonte, mas não constitui endosso clínico. As referências indicadas sem verificação integral estão sinalizadas.',date:'15 out 2026'},
 en:{title:'REFERENCES',description:'The scientific literature and technical documents used throughout the application, gathered in one place.',catalog:'SCIENTIFIC AND REGULATORY REFERENCES',legacy:'WORKS CITED IN CONSULTATION CHAPTERS',media:'IMAGE AND RESOURCE CREDITS',unverified:'Works mentioned in the original educational material; exact edition, complete-text access and bibliographic metadata still need confirmation.',available:'Available from',consulted:'Accessed',notice:'A bibliographic reference identifies a source, not clinical endorsement. Sources that have not been fully verified are identified.',date:'15 Oct 2026'},
 es:{title:'FUENTES DE REFERENCIA',description:'Bibliografía y documentos técnicos utilizados en toda la aplicación, reunidos en un solo lugar.',catalog:'REFERENCIAS CIENTÍFICAS Y NORMATIVAS',legacy:'OBRAS CITADAS EN LOS CAPÍTULOS DE CONSULTA',media:'CRÉDITOS DE IMÁGENES Y RECURSOS',unverified:'Obras citadas en el material original; edición, acceso al texto íntegro y datos bibliográficos pendientes de comprobación.',available:'Disponible en',consulted:'Consultado el',notice:'Una referencia bibliográfica identifica una fuente, no implica respaldo clínico. Se señalan las fuentes sin verificación íntegra.',date:'15 oct 2026'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isSafeUrl=url=>/^https:\/\/[^\s"'<>]+$/i.test(String(url||''));
export function getConsolidatedReferences(){
 const known=Object.entries(sources).sort((a,b)=>String(a[1].author).localeCompare(String(b[1].author),'pt',{sensitivity:'base'})||String(a[1].title).localeCompare(String(b[1].title),'pt'));
 const seen=new Set();
 const scientific=known.filter(([,s])=>{
  const key=(s.url||s.title).toLowerCase().replace(/\/$/,'');if(seen.has(key))return false;seen.add(key);return true;
 }).map(([id,s])=>({id,...s}));
 const legacy=[...new Set((consultaData.capitulos||[]).flatMap(c=>c.referencias||[]).map(s=>String(s).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt'));
 const supplementary=[
  {author:'National Institute of Standards and Technology (NIST)',title:'The NIST Reference on Constants, Units, and Uncertainty: SI Units',url:'https://physics.nist.gov/cuu/Units/'},
  {author:'Amqw23',title:'Jacobi Hyperbaric Chamber. Wikimedia Commons; licensed under CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:Jacobi_Hyperbaric_Chamber.jpg'},
  {author:'Creative Commons',title:'Creative Commons Attribution-ShareAlike 4.0 International',url:'https://creativecommons.org/licenses/by-sa/4.0/'}
 ];
 return {scientific,legacy,supplementary};
}
export function renderReferencesDrawer(lang='pt',open=false){
 const t=labels[lang]||labels.pt,{scientific,legacy,supplementary}=getConsolidatedReferences();
 const entry=(s,i)=>'<li class="ref-vancouver-entry"><span>'+esc([s.author||'Autor não identificado',s.title||'Obra sem título',s.year||null].filter(Boolean).join('. ').replace(/\.\./g,'.'))+'.</span>'+
  (s.doi?'<span> doi: '+esc(s.doi)+'.</span>':'')+
  (isSafeUrl(s.url)?' <a class="ref-link" href="'+esc(s.url)+'" rel="noopener noreferrer">'+esc(t.available)+'</a>.':'')+
  (s.consulted?'<small> ['+esc(t.consulted)+' '+esc(t.date)+']</small>':'')+'</li>';
 const lists='<h3>'+esc(t.catalog)+'</h3><ol class="ref-vancouver-list">'+scientific.map(entry).join('')+'</ol>'+
  '<h3>'+esc(t.legacy)+'</h3><p class="ref-caveat">'+esc(t.unverified)+'</p><ol class="ref-vancouver-list">'+legacy.map(v=>'<li class="ref-vancouver-entry">'+esc(v)+' [dados completos não verificados].</li>').join('')+'</ol>'+
  '<h3>'+esc(t.media)+'</h3><ol class="ref-vancouver-list">'+supplementary.map(entry).join('')+'</ol>';
 const number=scientific.length+legacy.length+supplementary.length;
 return '<details class="profile-references-card" data-profile-references '+(open?'open ':'')+'>'+
  '<summary><span><strong>'+esc(t.title)+'</strong><small>'+number+' '+(lang==='pt'?'registros':lang==='en'?'entries':'registros')+'</small></span><span class="profile-reference-chevron" aria-hidden="true">⌄</span></summary>'+
  '<div class="profile-references-body"><p>'+esc(t.description)+'</p>'+lists+'<p class="ref-caveat">'+esc(t.notice)+'</p></div></details>';
}
