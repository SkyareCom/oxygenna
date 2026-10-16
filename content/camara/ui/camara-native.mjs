/**
 * OXYGENNA / CÂMARA — interface embutível nos componentes originais.
 * Não cria shell, não altera cabeçalho/rodapé, estilos globais ou rotas.
 * Uso: mountOxygennaCamera(containerVazioDaAbaCamara, {onNarrate?});
 */
import {cameraLessons, cameraContent, boyleNormalized, inspiredOxygenHumidified, checkCameraAnswer} from "../index.mjs";

const CSS_URL = new URL("./camara-native.css", import.meta.url);
const ASSETS = Object.freeze({
  "assets/camara-tipos.svg": new URL("../assets/camara-tipos.svg", import.meta.url).href,
  "assets/pressao-volume.svg": new URL("../assets/pressao-volume.svg", import.meta.url).href,
  "assets/oxigenio-plasma.svg": new URL("../assets/oxigenio-plasma.svg", import.meta.url).href,
  "assets/ouvido-equalizacao.svg": new URL("../assets/ouvido-equalizacao.svg", import.meta.url).href
});
const HEADER = "CÂMARA";
const mainLessons = Object.freeze([...cameraLessons]);

function elem(tag, klass, value) {
  const x = document.createElement(tag);
  if (klass) x.className = klass;
  if (value !== undefined && value !== null) x.textContent = String(value);
  return x;
}
function put(parent, ...nodes) {
  for (const node of nodes) if (node) parent.appendChild(node);
  return parent;
}
function makeButton(label, klass, callback) {
  const b = elem("button", klass, label);
  b.type = "button";
  b.addEventListener("click", callback);
  return b;
}
function section(title, klass = "") {
  const node = elem("section", "oxc-card " + klass);
  if (title) put(node, elem("h3", "oxc-h3", title));
  return node;
}
function ensureScopedStyles() {
  if (document.querySelector("link[data-oxygenna-camara-ui]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS_URL.href;
  link.dataset.oxygennaCamaraUi = "";
  document.head.appendChild(link);
}
function matchesExisting(lesson, existingLessons) {
  for (const item of existingLessons) {
    if (typeof item === "string" && item === lesson.id) return true;
    if (item && typeof item === "object" && (
       item.id === lesson.id || item.deduplicationTag === lesson.deduplicationTag
    )) return true;
  }
  return false;
}
export function getUnregisteredCameraLessons(existingLessons = []) {
  if (!Array.isArray(existingLessons)) throw new TypeError("existingLessons deve ser uma lista");
  return mainLessons.filter(lesson => !matchesExisting(lesson, existingLessons));
}
export function getCameraSourceLinks() {
  return Object.entries(cameraContent.sources).map(([id, url]) => ({id, url}));
}
export function cameraGraphValue(engine, ata, fio2 = 1) {
  if (engine === "boyleNormalized") return boyleNormalized(ata);
  if (engine === "inspiredOxygenHumidified") return inspiredOxygenHumidified(ata, fio2);
  throw new RangeError("Mecanismo de gráfico não disponível: " + engine);
}
export function getCameraNextIndex(index, count, delta) {
  if (!Number.isInteger(index) || !Number.isInteger(count) || count < 1 ||
      !Number.isInteger(delta)) throw new RangeError("Índice inválido");
  return Math.max(0, Math.min(count - 1, index + delta));
}

/**
 * Instala somente as páginas de conteúdo dentro de um host vazio já fornecido
 * pelo front original. O app é responsável por ativar sua aba CÂMARA e rotear
 * para o container certo. O renderer não adiciona uma segunda navbar.
 */
export function mountOxygennaCamera(root, {existingLessons = [], onNarrate, onViewChange} = {}) {
  if (!(root instanceof HTMLElement)) throw new TypeError("Informe um HTMLElement");
  if (root.childNodes.length) throw new Error("A montagem exige um container vazio na aba CÂMARA");
  if (onNarrate !== undefined && typeof onNarrate !== "function")
    throw new TypeError("onNarrate deve ser função");
  if (onViewChange !== undefined && typeof onViewChange !== "function")
    throw new TypeError("onViewChange deve ser função");
  const lessons = getUnregisteredCameraLessons(existingLessons);
  if (!lessons.length) return {registered:0, skipped:mainLessons.length, dispose(){}};
  ensureScopedStyles();
  root.classList.add("oxc");
  root.setAttribute("data-oxygenna-content","camara");
  const status = {index:null, progress:new Set(), terminated:false};
  function show(viewIndex) {
    if (status.terminated) return;
    status.index = viewIndex;
    const fragment = document.createDocumentFragment();
    if (viewIndex === null) buildCatalog(fragment);
    else buildLesson(fragment, lessons[viewIndex], viewIndex);
    root.replaceChildren(fragment);
    if (onViewChange) onViewChange({view: viewIndex === null ? "catalog" : "lesson", lessonId: viewIndex === null ? null : lessons[viewIndex].id});
  }
  function buildCatalog(target) {
    const intro = elem("div","oxc-intro");
    put(intro,elem("div","oxc-kicker","MEDICINA HIPERBÁRICA"),
      elem("h2","oxc-h2",HEADER),
      elem("p","oxc-caption","Oito etapas essenciais para compreender a câmara, o tratamento, as sensações e a segurança."));
    put(target,intro);
    const grid = elem("div","oxc-grid");
    lessons.forEach((lesson,index) => {
      const button = makeButton("", "oxc-topic", () => show(index));
      const number = elem("span","oxc-num",String(index+1).padStart(2,"0"));
      const title = elem("span","oxc-topic-title",lesson.title);
      const arrow = elem("span","oxc-topic-arrow","›"); arrow.setAttribute("aria-hidden","true");
      button.setAttribute("aria-label","Abrir capítulo "+String(index+1)+": "+lesson.title);
      put(button,number,title,arrow);put(grid,button);
    });
    put(target,grid);
    const synthesis=section("SUA JORNADA NA CÂMARA","oxc-progress-card");
    put(synthesis,elem("p","oxc-p",status.progress.size+" de "+lessons.length+" atividades concluídas nesta visita."));
    const meter=elem("progress","oxc-progress");meter.max=lessons.length;meter.value=status.progress.size;put(synthesis,meter);
    put(target,synthesis);
    const refs=section("FONTES DE REFERÊNCIA","oxc-references");
    put(refs,elem("p","oxc-muted","Referências utilizadas na elaboração dos capítulos. Informações educacionais; protocolos clínicos exigem avaliação profissional."));
    for(const source of getCameraSourceLinks()){
      const a=elem("a","oxc-ref-link",source.id.toUpperCase()+" ↗");
      a.href=source.url;a.target="_blank";a.rel="noopener noreferrer";
      put(refs,a);
    }
    put(target,refs);
  }
  function buildLesson(target,lesson,index) {
    const titleWrap=elem("div","oxc-lesson-header");
    put(titleWrap,makeButton("‹  TODOS OS CAPÍTULOS","oxc-back",()=>show(null)),
      elem("div","oxc-kicker","CÂMARA · ETAPA "+String(index+1).padStart(2,"0")+" / "+String(lessons.length).padStart(2,"0")),
      elem("h2","oxc-h2",lesson.title),elem("p","oxc-subtitle",lesson.kicker));
    put(target,titleWrap);
    const objective=section("OBJETIVO DA ETAPA","oxc-objective");
    put(objective,elem("p","oxc-p",lesson.objective));put(target,objective);
    const primary=section("ENTENDA O ESSENCIAL","oxc-prose");
    lesson.paragraphs.forEach(p=>put(primary,elem("p","oxc-p",p)));
    put(target,primary);
    for(const media of lesson.media||[]) {
      if(media.type==="diagram" && media.asset){
        const figure=elem("figure","oxc-media");
        const img=elem("img","oxc-diagram");
        // Recursos existentes são reutilizados, sem gerar substitutos.
        img.src=ASSETS[media.asset] || "";
        if(!ASSETS[media.asset]) throw new Error("Diagrama não reconhecido: "+media.asset);
        img.alt=media.caption||"Ilustração educativa da câmara hiperbárica";
        img.loading="lazy";
        put(figure,img,elem("figcaption","oxc-figure-caption",media.caption||""));
        put(target,figure);
      }
      if(media.type==="interactive-graph") buildGraph(target, media);
      if(media.type==="checklist") buildChecklist(target,media);
      if(media.type==="evidence-map") buildEvidence(target,media);
      // animation-plan: roteiro editorial, não simulamos uma animação inexistente.
    }
    const points=section("PONTOS-CHAVE","oxc-keypoints");
    const ul=elem("ul","oxc-list");
    (lesson.keyPoints||[]).forEach(p=>put(ul,elem("li","",p)));
    put(points,ul);put(target,points);
    const nuance=section("NUANCE CLÍNICA","oxc-nuance");
    put(nuance,elem("p","oxc-p",lesson.clinicalNuance));put(target,nuance);
    if(lesson.audio && lesson.audio.script){
      const summary=section("EM POUCAS PALAVRAS","oxc-summary");
      put(summary,elem("p","oxc-p",lesson.audio.script));
      // Só aciona áudio quando o app já fornece um narrador. Nenhuma voz robótica é criada.
      if(onNarrate)put(summary,makeButton("OUVIR RESUMO","oxc-action",()=>onNarrate(lesson.audio.script,lesson.audio.language)));
      put(target,summary);
    }
    buildActivity(target,lesson,index);
    const actions=elem("nav","oxc-nav");
    actions.setAttribute("aria-label","Navegação entre capítulos");
    put(actions,
      makeButton("‹  ANTERIOR","oxc-navbtn",()=>show(getCameraNextIndex(index,lessons.length,-1))),
      makeButton(index===lessons.length-1?"TODOS OS CAPÍTULOS":"PRÓXIMA ETAPA  ›","oxc-navbtn oxc-nav-next",()=>show(index===lessons.length-1?null:getCameraNextIndex(index,lessons.length,1))));
    if(index===0) actions.firstChild.disabled=true;
    put(target,actions);
  }
  function buildGraph(target,media) {
    const graph=section("LABORATÓRIO INTERATIVO","oxc-graph-card");
    put(graph,elem("p","oxc-muted",media.caption || "Observe o efeito da pressão."));
    const label=elem("label","oxc-label","PRESSÃO ABSOLUTA (ATA)");
    const output=elem("output","oxc-number","");
    const slide=elem("input","oxc-range");
    slide.type="range"; slide.min=String(media.rangeATA?.[0]??1);
    slide.max=String(media.rangeATA?.[1]??3);slide.step="0.1";slide.value="2.4";
    slide.setAttribute("aria-label","Pressão absoluta em ATA");
    const formula=elem("p","oxc-calculation");
    function update(){
      const ata=Number(slide.value),v=cameraGraphValue(media.engine,ata,1);
      output.textContent=ata.toLocaleString("pt-BR",{maximumFractionDigits:1})+" ATA";
      formula.textContent=media.engine==="boyleNormalized"?
        "V / V₀ = "+(v*100).toLocaleString("pt-BR",{maximumFractionDigits:1})+"% (modelo ideal, temperatura constante)" :
        "PIO₂ estimada = "+v.toLocaleString("pt-BR",{maximumFractionDigits:0})+" mmHg (O₂ 100%; não é PaO₂)";
    }
    slide.addEventListener("input",update);update();
    put(graph,put(label,output),slide,formula);
    put(target,graph);
  }
  function buildChecklist(target,media){
    const block=section("PREPARAÇÃO SEGURA","oxc-check-card");
    put(block,elem("p","oxc-muted","Confira os itens operacionais com a equipe responsável."));
    (media.items||[]).forEach(item=>{
      const line=elem("label","oxc-check");
      const check=elem("input");check.type="checkbox";
      put(line,check,elem("span","",item));put(block,line);
    });
    put(target,block);
  }
  function buildEvidence(target,media){
    const block=section("LEITURA DAS INDICAÇÕES","oxc-evidence");
    put(block,elem("p","oxc-muted","Categorias de evidência para discussão, sem substituir a avaliação de indicações ou protocolos."));
    (media.categories||[]).forEach(name=>put(block,elem("div","oxc-evidence-item",name)));
    put(target,block);
  }
  function buildActivity(target,lesson,index) {
    const a=lesson.activity; if(!a) return;
    const card=section("TESTE SEU CONHECIMENTO","oxc-activity");
    const output=elem("p","oxc-feedback");
    output.setAttribute("aria-live","polite");
    if(a.type==="single-choice"){
      put(card,elem("p","oxc-question",a.data.question));
      const options=elem("div","oxc-answer-list");
      a.data.options.forEach((label,i)=>{
        const b=makeButton(String.fromCharCode(65+i)+"  "+label,"oxc-answer",()=>{
          if(card.dataset.answered==="true")return;
          const result=checkCameraAnswer(lesson.id,i);
          card.dataset.answered="true";
          options.querySelectorAll("button").forEach(v=>v.disabled=true);
          b.classList.add(result.correct?"oxc-correct":"oxc-wrong");
          output.textContent=(result.correct?"CORRETO. ":"RESPOSTA INDICADA: "+
            String.fromCharCode(65+result.expected)+". ")+result.explanation;
          if(result.correct)status.progress.add(lesson.id);
        });
        put(options,b);
      });put(card,options);
    }else if(a.type==="calculation"){
      put(card,elem("p","oxc-question",a.prompt));
      const line=elem("div","oxc-input-line");
      const input=elem("input","oxc-input");
      input.type="text";input.inputMode="decimal";input.placeholder="Ex.: 0,40";
      input.setAttribute("aria-label","Resultado calculado");
      const submit=makeButton("CONFERIR","oxc-action",()=>{
        const trimmed=input.value.trim();
        if(!/^\d+(?:[,.]\d+)?$/.test(trimmed)){
          output.textContent="Digite um número válido.";return;
        }
        const result=checkCameraAnswer(lesson.id,Number(trimmed.replace(",",".")));
        output.textContent=(result.correct?"CORRETO. ":"REVEJA O CÁLCULO. ")+result.explanation;
        if(result.correct){status.progress.add(lesson.id);input.disabled=true;submit.disabled=true}
      });
      put(line,input,submit);put(card,line);
    }
    put(card,output);put(target,card);
  }
  show(null);
  return {
    registered:lessons.length, skipped:mainLessons.length-lessons.length,
    goToLesson(id){const i=lessons.findIndex(x=>x.id===id); if(i<0)return false;show(i);return true},
    showCatalog(){show(null)},
    dispose(){if(status.terminated)return;status.terminated=true;root.replaceChildren();root.classList.remove("oxc");root.removeAttribute("data-oxygenna-content")}
  };
}
