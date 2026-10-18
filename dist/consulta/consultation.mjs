import {consultaData} from './catalog.mjs';
export const CONSULT_FILTERS=['home','fisiologia','clinica','camara','operacao'];
export const consultationChapters=consultaData.capitulos;
export const consultaById=new Map(consultationChapters.map(c=>[c.id,c]));
export const consultaRoutes=Object.freeze([...CONSULT_FILTERS.map(s=>'/'+s),'/capitulo/:id']);
export const consultationMenu=[
 {id:'home',title:'HOME',icon:'home'},
 {id:'fisiologia',title:'FISIOLOGIA',icon:'activity'},
 {id:'clinica',title:'CLÍNICA',icon:'indications'},
 {id:'camara',title:'CÂMARA',icon:'chamber'},
 {id:'operacao',title:'OPERAÇÃO',icon:'protocols'}
];
const uiFilters={
 fisiologia:[['fisica','FÍSICA','01'],['fisiologia','FISIOLOGIA','02']],
 clinica:[['todos','TODAS','*'],['ferida','FERIDA','ferida'],['infeccao','INFECÇÃO','infeccao'],['urologia','UROLOGIA','urologia'],['orl','ORL','orl']],
 camara:[['avaliacao','AVALIAÇÃO','04'],['protocolos','PROTOCOLOS','proc'],['consulta','CONSULTA','05']],
 operacao:[['mergulho','MERGULHO','06'],['emergencia','EMERGÊNCIA','07'],['fator_humano','FATOR HUMANO','08+09']]
};
const clinicalCategory=id=>['pe-diabetico','retalho-enxerto','queimaduras','lesao-radiacao','osteorradionecrose'].includes(id)?'ferida':['gangrena-gasosa','fournier','osteomielite-refrataria','infeccao-necrosante','abscesso-intracraniano'].includes(id)?'infeccao':['cistite-actinica'].includes(id)?'urologia':['surdez-subita'].includes(id)?'orl':'todos';
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
export function consultationBase(){
 const path=typeof location==='undefined'?'/oxygenna/':location.pathname;
 return path.startsWith('/oxygenna')?'/oxygenna/':'/';
}
export function consultationHref(route){
 const p='/'+String(route||'home').replace(/^\/+/,'');
 return consultationBase()+p.slice(1);
}
export function consultationPath(){
 if(typeof location==='undefined')return '/home';
 const wanted=new URLSearchParams(location.search).get('route');
 if(wanted&&/^\/(home|fisiologia|clinica|camara|operacao|capitulo\/[a-z0-9-]+)$/.test(wanted))return wanted;
 const base=consultationBase();
 const raw=location.pathname.startsWith(base)?location.pathname.slice(base.length):'';
 const p='/'+raw.replace(/^\/+/,'');
 return p==='/'?'/home':p;
}
export function isConsultationRoute(route){
 return /^\/(home|fisiologia|clinica|camara|operacao)$/.test(route)||/^\/capitulo\/[a-z0-9-]+$/.test(route);
}
export function toChapter(id){return consultationHref('/capitulo/'+id);}
const link=(route,label,cls='consulta-link',extra='')=>'<a class="'+cls+'" data-consult-link href="'+consultationHref(route)+'" '+extra+'>'+esc(label)+'</a>';
const lightArrow='<span class="consulta-chevron" aria-hidden="true">›</span>';
const rowCard=(c,searchMode=false)=>'<a class="lesson-link consulta-row" data-consult-link href="'+toChapter(c.id)+'">'+
 '<span class="lesson-number">'+(searchMode?'•':c.fase_id.padStart(2,'0'))+'</span>'+
 '<span class="consulta-row-body"><strong>'+esc(c.titulo_curto)+'</strong><small>'+esc(c.fase)+'</small></span>'+
 lightArrow+'</a>';
const heading=(title,subtitle='')=>'<header class="consulta-section-heading"><h1 class="page-title">'+esc(title)+'</h1>'+(subtitle?'<p>'+esc(subtitle)+'</p>':'')+'</header>';
const tabs=(filter,selected)=>'<div class="consulta-tabs" role="group" aria-label="Filtros de '+esc(filter)+'">'+
 (uiFilters[filter]||[]).map(([id,label])=>'<button type="button" data-consult-tab="'+id+'" data-consult-filter="'+filter+'" aria-pressed="'+(selected===id)+'">'+esc(label)+'</button>').join('')+'</div>';
const phaseList=arr=>{
 const byPhase=consultaData.fases.filter(f=>arr.some(c=>c.fase_id===f.id));
 return byPhase.map(f=>'<section class="consulta-phase">'+
 '<h2>'+esc('FASE '+Number(f.id)+' · '+f.nome)+'</h2>'+
 '<div class="consulta-list">'+arr.filter(c=>c.fase_id===f.id).map(c=>rowCard(c)).join('')+'</div></section>').join('');
};
const homeQuick=[
 ['INDICAÇÕES','/clinica'],
 ['TOXICIDADE','/capitulo/toxicidade-o2-cns'],
 ['US NAVY','/camara'],
 ['CONTRAINDICAÇÕES','/capitulo/contraindicacoes']
];
export function renderConsultaHome({search='',lastId='',favorites=[]}={}){
 const needle=search.trim().toLocaleLowerCase('pt-BR'), found=needle?consultationChapters.filter(c=>(c.titulo_curto+' '+c.tags_busca.join(' ')+' '+consultaData.procedimentos.filter(p=>p.capitulo_id_ref===c.id).map(p=>p.nome).join(' ')).toLocaleLowerCase('pt-BR').includes(needle)):[],
 last=consultaById.get(lastId),popular=['dcs-tipo2','contraindicacoes','pe-diabetico','toxicidade-o2-cns'].map(id=>consultaById.get(id));
 return heading('MEDICINA HIPERBÁRICA','Consulta técnica · 74 assuntos organizados em 9 fases')+
 '<section class="consulta-search"><label for="consulta-busca">BUSCA GLOBAL</label><input id="consulta-busca" data-consult-search type="search" placeholder="Indicação, protocolo ou assunto" autocomplete="off" value="'+esc(search)+'"></section>'+
 (needle?'<section class="consulta-results"><h2>RESULTADOS · '+found.length+'</h2><div class="consulta-list">'+(found.length?found.map(c=>rowCard(c,true)).join(''):'<p class="consulta-micro">Nenhum resultado encontrado.</p>')+'</div></section>':
 '<section class="consulta-phase"><h2>ACESSO RÁPIDO</h2><div class="consulta-quick">'+homeQuick.map(([t,route])=>link(route,t,'consulta-quick-card')).join('')+'</div></section>'+
 '<section class="consulta-phase"><h2>CONTINUAR ESTUDANDO</h2>'+(last?rowCard(last):'<p class="consulta-micro">Abra um capítulo para retomar por aqui.</p>')+'</section>'+
 '<section class="consulta-phase"><h2>MAIS BUSCADOS</h2><div class="consulta-list">'+popular.map(c=>rowCard(c)).join('')+'</div></section>'+
 '<p class="consulta-disclaimer">'+esc(consultaData.risk_notice)+'</p>');
}
export function renderConsultaFilter(filter,{tab}={}){
 const tabsFor=uiFilters[filter];const defaultTab={fisiologia:'fisica',clinica:'todos',camara:'avaliacao',operacao:'mergulho'}[filter];const selected=tabsFor?.some(t=>t[0]===tab)?tab:defaultTab;
 const title={fisiologia:'FISIOLOGIA',clinica:'CLÍNICA',camara:'CÂMARA',operacao:'OPERAÇÃO'}[filter];
 const intro={fisiologia:'Física dos gases e respostas fisiológicas à pressão.',clinica:'Indicações, evidências, seleção e cuidados associados.',camara:'Avaliação, protocolos e consulta técnica estruturada.',operacao:'Mergulho, emergências, fatores humanos e segurança.'}[filter];
 const top=heading(title,intro)+tabs(filter,selected);
 if(filter==='camara'&&selected==='protocolos'){
  return top+'<section class="consulta-phase"><h2>PROCEDIMENTOS · '+consultaData.procedimentos.length+'</h2>'+
   '<div class="consulta-table-wrap"><table class="consulta-protocol-table"><thead><tr><th>Procedimento</th><th>Referência</th><th>Abrir</th></tr></thead><tbody>'+
   consultaData.procedimentos.map(p=>'<tr><td><strong>'+esc(p.nome)+'</strong><small>'+esc(p.especialidade)+'</small></td><td>'+esc(p.protocolo_indicado)+'</td><td>'+link('/capitulo/'+p.capitulo_id_ref,'VER','consulta-table-link')+'</td></tr>').join('')+
  '</tbody></table></div><p class="consulta-micro">Tabelas oficiais e critérios de seleção exigem validação antes de aplicação clínica.</p></section>';
 }
 let records=consultationChapters.filter(c=>c.filtro===filter);
 if(filter==='fisiologia')records=records.filter(c=>c.fase_id===(selected==='fisica'?'01':'02'));
 if(filter==='clinica'&&selected!=='todos')records=records.filter(c=>clinicalCategory(c.id)===selected);
 if(filter==='camara')records=records.filter(c=>c.fase_id===(selected==='consulta'?'05':'04'));
 if(filter==='operacao')records=records.filter(c=>selected==='fator_humano'?['08','09'].includes(c.fase_id):c.fase_id===(selected==='mergulho'?'06':'07'));
 return top+phaseList(records)+(records.length?'':'<p class="consulta-micro">Não há registros nessa seleção.</p>');
}
function renderFlow(flow){
 return '<ol class="consulta-flow">'+flow.nos.map((node,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span><p>'+esc(node.texto)+'</p></li>').join('')+'</ol>';
}
function renderTable(table){
 return '<div class="consulta-table-wrap"><table><thead><tr>'+table.colunas.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+
 table.linhas.map(r=>'<tr>'+r.map((txt,j)=>'<'+(j===0?'th':'td')+'>'+esc(txt)+'</'+(j===0?'th':'td')+'>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
const block=(id,title,body)=>'<section class="consulta-card" id="bloco-'+id+'"><h2>'+esc(title)+'</h2>'+body+'</section>';
const notes=(title,text)=>'<div class="consulta-plain-item"><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p></div>';
const referenceLinks=refs=>refs.map(id=>{const r=consultaData.referencias.find(r=>r.id===id);if(!r)return '';return '<li>'+(r.url?'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.label)+'</a>':esc(r.label))+'<small>'+esc(r.review)+'</small></li>';}).join('');
function quiz(c,answers={}){
 return '<div class="consulta-quiz">'+c.fechamento.quiz.map((q,i)=>{
  const selected=answers[i];
  return '<fieldset class="consulta-question" data-question="'+i+'"><legend>'+esc(q.pergunta)+'</legend>'+
   q.opcoes.map((opt,j)=>'<button type="button" data-consult-answer="'+j+'" data-consult-question="'+i+'" data-consult-chapter="'+c.id+'" aria-pressed="'+(selected===j)+'">'+String.fromCharCode(65+j)+'. '+esc(opt)+'</button>').join('')+
   (Number.isInteger(selected)?'<p class="consulta-feedback">'+(selected===q.correta?'Resposta correta.':'Revise o bloco indicado: '+q.retorno_bloco_id.replace('bloco-','')+'.')+'</p>':'')+
   '</fieldset>';
 }).join('')+'</div>';
}
export function renderConsultaChapter(chapterId,{favorites=[],answers={}}={}){
 const c=consultaById.get(chapterId);
 if(!c)return heading('CAPÍTULO NÃO ENCONTRADO')+link('/home','VOLTAR À HOME');
 const specific=c.id==='dcs-tipo2';
 const refs=c.referencias;
 return '<article class="consulta-chapter" data-consult-chapter-page="'+esc(c.id)+'">'+
 block(0,c.titulo_curto,'<p class="consulta-pill">'+esc(c.filtro.toUpperCase()+' · '+c.fase)+'</p><p class="consulta-answer">'+esc(c.resposta_curta)+'</p><button type="button" data-consult-audio="'+esc(c.id)+'" class="consulta-audio">▶ OUVIR RESUMO · 30 s</button>')+
 block(1,'CASO CLÍNICO', '<p>'+esc(c.caso.texto)+'</p>'+(specific?'<figure class="consulta-figure"><svg viewBox="0 0 330 110" role="img" aria-label="Sequência de atendimento: suspeita, estabilização, centro hiperbárico"><path d="M18 55H315" stroke="#b99e65" stroke-width="2" stroke-dasharray="6 7"/>'+[["SUSPEITA",55],["ESTABILIZAR",165],["ENCAMINHAR",275]].map(([t,x])=>'<circle cx="'+x+'" cy="55" r="17" fill="#123c47" stroke="#b99e65"/><text x="'+x+'" y="23" text-anchor="middle" font-size="11" fill="#e5d6ac">'+t+'</text>').join('')+'</svg><figcaption>Sequência didática, não substitui protocolo de emergência.</figcaption></figure>':'')+
 '<p class="consulta-media-slot">IMAGEM / GRÁFICO · '+(c.caso.midia_ref?esc(c.caso.midia_ref):'Curadoria por tema')+'</p>')+
 block(2,'POR QUE IMPORTA',notes('FATO',c.porque.fato)+notes('MECANISMO GASOSO',c.porque.mecanismo_gas)+notes('CONCEITO CHAVE',c.porque.risco_operacional)+
 '<p class="consulta-media-slot">VÍDEO / ÁUDIO · Disponível após revisão técnica.</p><p class="consulta-citation">Referências: '+esc(refs.slice(0,2).join(' · '))+'</p>')+
 block(3,'CONDUTA E DIFERENCIAÇÃO','<h3>FLUXO DE DECISÃO</h3>'+renderFlow(c.conduta.fluxograma)+'<h3>TABELA COMPARATIVA</h3>'+renderTable(c.conduta.tabela_comparativa)+(specific?'<p class="consulta-note"><strong>US NAVY:</strong> escolha da tabela apenas pela equipe hiperbárica, após conferir edição oficial e condição clínica.</p>':''))+
 block(4,'PERÍCIA E SEGURANÇA','<h3>ÓRGÃOS E REFERÊNCIAS</h3>'+renderTable({colunas:['UHMS','AMIB','CFM'],linhas:[[c.pericia.tabela_orgaos.uhms,c.pericia.tabela_orgaos.amib,c.pericia.tabela_orgaos.cfm]]})+
 '<p class="consulta-note">'+esc(c.pericia.dica_ouro)+'</p><h3>CHECKLIST</h3><div class="consulta-checks">'+c.pericia.checklist.map((line,i)=>'<label><input type="checkbox" data-consult-check="'+esc(c.id)+'-'+i+'"><span>'+esc(line)+'</span></label>').join('')+'</div>')+
 block(5,'MÍDIAS E DOCUMENTOS','<p>Galeria, vídeos e arquivos serão vinculados a cada tema após curadoria.</p><div class="consulta-media-stubs"><span>IMAGENS</span><span>GRÁFICOS</span><span>VÍDEOS</span><span>ÁUDIOS</span><span>PDFS</span></div>')+
 block(6,'SÍNTESE E REVISÃO','<h3>LEVE PARA A PRÁTICA</h3><ul>'+c.fechamento.take_home.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul><h3>TESTE O CONHECIMENTO</h3>'+quiz(c,answers)+
 '<h3>FONTES DE REFERÊNCIA</h3><ul class="consulta-refs">'+referenceLinks(refs)+'</ul>'+
 '<p class="consulta-disclaimer">'+esc(consultaData.risk_notice)+'</p>')+'</article>';
}
export function renderConsultation(route,options={}){
 if(route==='/home')return renderConsultaHome(options);
 if(/^\/capitulo\/[a-z0-9-]+$/.test(route))return renderConsultaChapter(route.split('/')[2],options);
 const f=route.slice(1);
 return CONSULT_FILTERS.includes(f)?renderConsultaFilter(f,options):renderConsultaHome(options);
}
