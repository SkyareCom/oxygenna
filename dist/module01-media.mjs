// OXYGENNA — Módulo 01: mídias nativas às páginas #topic/01/*, sem segundo aplicativo.
// Imagens de contexto independentes; não utilizar atlas, ampliar ou galeria duplicada.
const photo=Object.freeze({"experimentacao":"./assets/m01-foto-experimentacao.webp?rev=knowledge-final-20261018","subaquatica":"./assets/m01-foto-subaquatica.webp?rev=knowledge-final-20261018","camara-clinica":"./assets/m01-camara-clinica.webp?rev=foto-sem-titulos-20261018","pratica-atual":"./assets/m01-foto-pratica-atual.webp?rev=knowledge-final-20261018","oxigenio":"./assets/m01-foto-oxigenio.webp?rev=knowledge-final-20261018","monoplace":"./assets/m01-foto-monoplace.webp?rev=knowledge-final-20261018","multiplace":"./assets/m01-foto-multiplace.webp?rev=knowledge-final-20261018","componentes":"./assets/m01-componentes.webp?rev=foto-sem-titulos-20261018","preparacao":"./assets/m01-foto-preparacao.webp?rev=knowledge-final-20261018","exposicao":"./assets/m01-exposicao.webp?rev=foto-sem-titulos-20261018"});
const placement=Object.freeze({0:{first:['experimentacao'],after:['pratica-atual']},1:{first:['subaquatica']},2:{first:['oxigenio']},3:{first:['monoplace'],middle:['multiplace']},4:{first:['preparacao']}});
const altText=Object.freeze({"experimentacao":"Experimentos históricos com gases e pressão","subaquatica":"Fisiologia da imersão e medicina subaquática","camara-clinica":"Câmara clínica e assistência monitorizada","pratica-atual":"Prática hiperbárica baseada em evidências","oxigenio":"Paciente em câmara hiperbárica: ilustração da oferta de oxigênio","monoplace":"Câmara monoplace com leito individual","multiplace":"Câmara multiplace com vários assentos","componentes":"Janela, máscara, comunicação, painel e segurança de uma câmara","preparacao":"Preparo e compressão gradual","exposicao":"Exposição monitorizada e descompressão controlada"});
const steps=[
 ['Preparação','Orientação, triagem e conferência do equipamento antes do início.'],
 ['Compressão','A pressão aumenta gradualmente; a equipe acompanha o conforto e a equalização.'],
 ['Exposição','Oxigênio prescrito, comunicação e monitorização conforme a situação clínica.'],
 ['Descompressão','A pressão retorna gradualmente ao ambiente e ocorre reavaliação.']
];
const components=[
 ['Janela','Favorece a observação; sua função e configuração variam com o equipamento.'],
 ['Painel','Apresenta pressão e comandos operacionais, acionados apenas pela equipe habilitada.'],
 ['Máscara de O₂','Pode administrar oxigênio por circuito individual em câmaras apropriadas.'],
 ['Comunicação','Mantém o contato entre paciente e profissionais, inclusive em intercorrências.'],
 ['Segurança','Inclui dispositivos, manutenção e procedimentos específicos do fabricante.']
];
const copy={pt:{media:'ATIVIDADES INTERATIVAS',caption:'Ilustração cinematográfica didática; não representa protocolo clínico nem dispositivo específico.',watch:'ANIMAÇÃO GUIADA',hotspot:'EXPLORAR COMPONENTES',timeline:'ETAPAS DA EVOLUÇÃO',pressure:'VARIAÇÃO DE PRESSÃO',quiz:'ATIVIDADE RÁPIDA',check:'CONFERIR',again:'TENTAR NOVAMENTE',next:'PRÓXIMA CENA',play:'REPRODUZIR',pause:'PAUSAR',feedbackGood:'Resposta correta.',feedbackBad:'Reveja a explicação.'},en:{media:'INTERACTIVE ACTIVITIES',caption:'Illustrative cinematic teaching image; not a clinical protocol or specific device.',watch:'GUIDED ANIMATION',hotspot:'EXPLORE COMPONENTS',timeline:'HISTORICAL STAGES',pressure:'PRESSURE SIMULATOR',quiz:'QUICK ACTIVITY',check:'CHECK',again:'TRY AGAIN',next:'NEXT SCENE',play:'PLAY',pause:'PAUSE',feedbackGood:'Correct.',feedbackBad:'Review the explanation.'},es:{media:'ACTIVIDADES INTERACTIVAS',caption:'Imagen cinematográfica educativa; no representa un protocolo clínico ni equipo específico.',watch:'ANIMACIÓN GUIADA',hotspot:'EXPLORAR COMPONENTES',timeline:'ETAPAS HISTÓRICAS',pressure:'SIMULADOR DE PRESIÓN',quiz:'ACTIVIDAD RÁPIDA',check:'COMPROBAR',again:'INTENTAR DE NUEVO',next:'SIGUIENTE ESCENA',play:'REPRODUCIR',pause:'PAUSAR',feedbackGood:'Correcto.',feedbackBad:'Revisa la explicación.'}};
const msg=lang=>copy[lang]??copy.pt;
const figure=(key,e)=>'<figure class="m01-figure m01-context-figure" data-m01-picture="'+key+'"><img src="'+photo[key]+'" alt="'+e(altText[key])+'" width="960" height="600" loading="lazy" decoding="async"></figure>';
/** Cada mídia ocupa apenas o ponto próprio da explicação, sem ampliar. */
export function renderModule01Visual(moduleId,index,position,{e}={}){
 if(moduleId!=='01'||!['first','middle','after'].includes(position))return '';
 return (placement[Number(index)]?.[position]??[]).map(key=>figure(key,e??(s=>String(s)))).join('');
}
export function renderModule01Media(moduleId,index,{lang='pt',e}={}){
 if(moduleId!=='01')return '';
 const i=Number(index);if(!Number.isInteger(i)||i<0||i>5)return '';
 if(i<2)return '';
 e=e??(s=>String(s));
 const c=msg(lang),section=[];

 if(i===2){
  section.push('<section class="m01-panel m01-oxygen" data-m01-oxygen><h2>Gráfico interativo • PIO₂ umidificada</h2><p class="m01-hint" lang="pt-BR">FiO₂ = 100%, pressão de vapor de água estimada em 47 mmHg. PIO₂ não equivale à PaO₂.</p><svg aria-label="Gráfico de PIO₂ em relação à pressão absoluta" role="img" viewBox="0 0 340 170" class="m01-plot"><path d="M35 12V140H330" fill="none" stroke="#9aabb1" stroke-width="1"/><path d="M35 104L330 30" fill="none" stroke="#d5b16c" stroke-width="3"/><path d="M35 139H330" fill="none" stroke="#526977" stroke-dasharray="3 6"/><circle data-m01-point cx="184" cy="67" r="6" stroke="#d5b16c" fill="#082b3b" stroke-width="3"/><text x="32" y="158" font-size="11" fill="#b5cbd0">1 ATA</text><text x="293" y="158" font-size="11" fill="#b5cbd0">3 ATA</text><text x="35" y="9" font-size="11" fill="#b5cbd0">PIO₂ (mmHg)</text></svg><label for="m01-ata">Pressão absoluta <output id="m01-ata-out">2,0 ATA</output></label><input id="m01-ata" data-m01-ata type="range" min="1" max="3" step="0.1" value="2.0"><div class="m01-number"><strong data-m01-pio2>1.473 mmHg</strong><span>Pressão parcial inspirada estimada</span></div></section>');
 }
 if(i===3){
  section.push('<section class="m01-panel m01-hotspots" data-m01-hotspots><h2>'+e(c.hotspot)+'</h2><div class="m01-hotspot-list">'+components.map((item,j)=>'<button type="button" data-m01-component="'+j+'" aria-pressed="'+(j===0)+'">'+e(item[0])+'</button>').join('')+'</div><div class="m01-component-output" role="status" aria-live="polite" lang="pt-BR"><strong>'+e(components[0][0])+'</strong><p>'+e(components[0][1])+'</p></div></section>');
 }
 if(i===4){
  section.push('<section class="m01-panel m01-journey" data-m01-stepper="journey"><h2>'+e(c.watch)+'</h2><div class="m01-progress"><i data-m01-progress style="width:25%"></i></div><div class="m01-scene" aria-live="polite"><strong data-m01-scene-title lang="pt-BR">'+e(steps[0][0])+'</strong><p data-m01-scene-body lang="pt-BR">'+e(steps[0][1])+'</p></div><div class="m01-controls"><button type="button" data-m01-next>'+e(c.next)+'</button><button type="button" data-m01-play>'+e(c.play)+'</button></div><p class="m01-hint">Animação educativa por etapas. Não é filmagem de um procedimento real.</p></section>');
 }
 if(i===5){
  const terms=[['ATA','Atmosferas absolutas'],['FiO₂','Fração inspirada de oxigênio'],['PIO₂','Pressão parcial inspirada de oxigênio'],['PaO₂','Pressão parcial arterial de oxigênio'],['OHB','Oxigenoterapia hiperbárica']];
  section.push('<section class="m01-panel m01-glossary"><h2>VOCABULÁRIO INTERATIVO</h2><p class="m01-hint">Toque em cada termo para revelar sua definição.</p>'+terms.map(([term,def])=>'<details><summary>'+e(term)+'</summary><p lang="pt-BR">'+e(def)+'</p></details>').join('')+'</section>');
 }
 return '<section class="m01-media" data-m01-topic="'+i+'" aria-label="'+e(c.media)+'">'+section.join('')+'</section>';
}
function fmtNumber(n,dec=0){return n.toLocaleString('pt-BR',{maximumFractionDigits:dec,minimumFractionDigits:dec});}
function findRoot(t){return t?.closest?.('.m01-media')??null;}
const state=new WeakMap();
export function handleModule01Click(t){
 if(!t?.closest)return false;
 const root=findRoot(t),button=t.closest('button');if(!root||!button)return false;
 if(button.dataset.m01Component!==undefined){
  const n=Number(button.dataset.m01Component),panel=button.closest('[data-m01-hotspots]');
  panel.querySelectorAll('[data-m01-component]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
  const dest=panel.querySelector('.m01-component-output');
  dest.querySelector('strong').textContent=components[n][0];dest.querySelector('p').textContent=components[n][1];return true;
 }
 if(button.dataset.m01Next!==undefined||button.dataset.m01Play!==undefined){
  const panel=button.closest('[data-m01-stepper="journey"]'),s=state.get(panel)??{index:0,playing:false};
  if(button.dataset.m01Next!==undefined){s.index=(s.index+1)%4;state.set(panel,s);paintJourney(panel,s);return true;}
  if(s.playing){s.playing=false;clearInterval(s.timer);s.timer=null;button.textContent='REPRODUZIR';state.set(panel,s);return true;}
  s.playing=true;button.textContent='PAUSAR';s.timer=setInterval(()=>{if(!panel.isConnected){clearInterval(s.timer);return;}s.index=(s.index+1)%4;paintJourney(panel,s);},1800);
  state.set(panel,s);return true;
 }
 return false;
}
function paintJourney(panel,s){
 panel.querySelector('[data-m01-scene-title]').textContent=steps[s.index][0];
 panel.querySelector('[data-m01-scene-body]').textContent=steps[s.index][1];
 panel.querySelector('[data-m01-progress]').style.width=((s.index+1)*25)+'%';
}
export function handleModule01Input(t){
 if(t?.dataset?.m01Depth!==undefined){
  const panel=t.closest('[data-m01-dive]'),d=Number(t.value),ata=1+d/10;
  panel.querySelector('#m01-depth-out').textContent=d+' m';
  panel.querySelector('[data-m01-depth-ata]').textContent=fmtNumber(ata,1)+' ATA';
  panel.querySelector('[data-m01-depth-kpa]').textContent=fmtNumber(ata*101.325,0)+' kPa';return true;
 }
 if(t?.dataset?.m01Ata!==undefined){
  const panel=t.closest('[data-m01-oxygen]'),ata=Number(t.value),pio2=760*ata-47;
  panel.querySelector('#m01-ata-out').textContent=fmtNumber(ata,1)+' ATA';
  panel.querySelector('[data-m01-pio2]').textContent=fmtNumber(pio2,0)+' mmHg';
  const p=panel.querySelector('[data-m01-point]');p.setAttribute('cx',String(35+(ata-1)/2*295));p.setAttribute('cy',String(139-(760*ata-47)/2450*120));
  return true;
 }
 return false;
}
