import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {cameraLessons, checkCameraAnswer} from "../content/camara/index.mjs";
import {
  getUnregisteredCameraLessons, getCameraSourceLinks,
  cameraGraphValue, getCameraNextIndex
} from "../content/camara/ui/camara-native.mjs";

test("CÂMARA: oito capítulos reais, únicos e com conteúdo científico",()=>{
  assert.equal(getUnregisteredCameraLessons().length,8);
  assert.equal(new Set(cameraLessons.map(x=>x.id)).size,8);
  assert.ok(cameraLessons.every(x=>x.paragraphs.length>0 && x.activity && x.audio?.script));
});
test("conteúdos já existentes são ignorados por ID ou tag",()=>{
  const existing=["camara-01",{id:"old",deduplicationTag:cameraLessons[1].deduplicationTag}];
  const filtered=getUnregisteredCameraLessons(existing);
  assert.equal(filtered.length,6);
  assert.equal(filtered.some(x=>x.id==="camara-01" || x.id==="camara-02"),false);
  assert.equal(cameraLessons.length,8);
});
test("um array é obrigatório para evitar duplicidade não detectada",()=>{
  assert.throws(()=>getUnregisteredCameraLessons({}),TypeError);
});
test("gráfico de Boyle: V/V0 = 0,4 com 2,5 ATA",()=>{
  assert.equal(cameraGraphValue("boyleNormalized",2.5),0.4);
  assert.throws(()=>cameraGraphValue("boyleNormalized",0),RangeError);
});
test("oxigênio inspirado não se confunde com PaO2",()=>{
  assert.ok(Math.abs(cameraGraphValue("inspiredOxygenHumidified",2.4,1)-1777)<0.01);
  assert.throws(()=>cameraGraphValue("inspiredOxygenHumidified",2.4,2),RangeError);
  assert.throws(()=>cameraGraphValue("inexistente",2),RangeError);
});
test("índices de navegação não ultrapassam 1..8",()=>{
  assert.equal(getCameraNextIndex(0,8,-1),0);
  assert.equal(getCameraNextIndex(0,8,1),1);
  assert.equal(getCameraNextIndex(7,8,1),7);
  assert.throws(()=>getCameraNextIndex(0,0,1),RangeError);
});
test("todas as atividades do banco têm resposta válida e justificativa",()=>{
  for(const lesson of cameraLessons){
    const a=lesson.activity;
    const answer=a.type==="calculation" ? a.expected : a.data.correctIndex;
    const result=checkCameraAnswer(lesson.id,answer);
    assert.equal(result.correct,true,lesson.id);
    assert.ok(result.explanation.length>12,lesson.id);
  }
});
test("diagramas continuam referenciando os quatro arquivos existentes",()=>{
  const assets=new Set(["assets/camara-tipos.svg","assets/pressao-volume.svg",
    "assets/oxigenio-plasma.svg","assets/ouvido-equalizacao.svg"]);
  for(const lesson of cameraLessons)for(const media of lesson.media){
    if(media.type==="diagram")assert.ok(assets.has(media.asset),media.asset);
  }
});
test("fontes têm HTTPS e pertencem ao catálogo único de referências",()=>{
  const src=getCameraSourceLinks();
  assert.ok(src.length>=5);
  assert.equal(new Set(src.map(x=>x.id)).size,src.length);
  assert.ok(src.every(x=>/^https:\/\//.test(x.url)));
});
test("CSS isolado: nenhum seletor global de header, footer, body, navegação",()=>{
  const css=readFileSync(new URL("../content/camara/ui/camara-native.css",import.meta.url),"utf8");
  assert.match(css,/\.oxc \.oxc-topic/);
  assert.match(css,/Saira Semi Condensed/);
  assert.match(css,/#f7c75b/i);
  assert.doesNotMatch(css,/(^|\n)\s*(?:html|body|header|footer|nav|h1|h2|button|input|:root)\s*[{,]/m);
});
test("componente jamais declara container de header/footer próprio ou rotas",()=>{
  const src=readFileSync(new URL("../content/camara/ui/camara-native.mjs",import.meta.url),"utf8");
  assert.doesNotMatch(src,/history\.pushState|location\.href\s*=|document\.body\.replaceChildren/);
  assert.doesNotMatch(src,/document\.createElement\(["'](?:header|footer)["']\)/);
  assert.match(src,/root\.replaceChildren/);
});
