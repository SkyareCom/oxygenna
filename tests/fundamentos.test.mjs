import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  fundamentalsContent, FUNDAMENTALS_TOPIC_IDS, getFundamentalsLocale,
  getFundamentalsTopic, registerWithExistingFundamentals, validateFundamentalsContent
} from "../content/fundamentos/index.mjs";

test("conteúdo autoral íntegro: 3 idiomas, 6 temas em cada idioma e fontes válidas", () => {
  assert.equal(validateFundamentalsContent(), true);
  assert.deepEqual(Object.keys(fundamentalsContent.locales).sort(), ["en", "es", "pt"]);
  assert.equal(FUNDAMENTALS_TOPIC_IDS.length, 6);
});
test("objetivo curricular 24/144 não é confundido com 144 aulas concluídas", () => {
  assert.equal(fundamentalsContent.target_curriculum.modules, 24);
  assert.equal(fundamentalsContent.target_curriculum.topics, 144);
  assert.match(fundamentalsContent.status, /not_integrated/);
});
test("idiomas reconhecidos e sem substituição silenciosa por português", () => {
  for (const lang of ["pt-BR", "en-US", "es-ES"]) {
    assert.equal(getFundamentalsLocale(lang)?.topics.length, 6);
  }
  assert.equal(getFundamentalsLocale("fr-FR"), null);
  assert.equal(getFundamentalsTopic("fr-FR", "pressao"), null);
  assert.equal(getFundamentalsTopic("pt-BR", "inexistente"), null);
});
test("os seis identificadores e a ordem são iguais nos três idiomas", () => {
  for (const lang of ["pt-BR", "en-US", "es-ES"]) {
    assert.deepEqual(getFundamentalsLocale(lang).topics.map(x => x.id), FUNDAMENTALS_TOPIC_IDS);
  }
});
test("há 3 decisões com alternativas, resposta e explicação em cada idioma", () => {
  for (const lang of ["pt", "en", "es"]) {
    assert.equal(fundamentalsContent.locales[lang].caseAnswers.length, 3);
    for (const item of fundamentalsContent.locales[lang].caseAnswers) {
      assert.equal(item.a.length, 3);
      assert.ok(item.explain.length > 20);
      assert.ok(item.correct >= 0 && item.correct < 3);
    }
  }
});
test("não registra nenhuma aula sem função fornecida pelo app original", () => {
  const idMap = Object.fromEntries(FUNDAMENTALS_TOPIC_IDS.map(t => [t, "original-" + t]));
  assert.throws(() => registerWithExistingFundamentals({language:"pt-BR",idMap}), TypeError);
});
test("um idioma desconhecido bloqueia o registro sem efeitos colaterais", () => {
  let called = false;
  assert.throws(() => registerWithExistingFundamentals({
    language:"fr-FR",idMap:{},registerLesson:()=>{called=true}
  }), RangeError);
  assert.equal(called, false);
});
test("mapeamento oficial é obrigatório e validado antes de qualquer registro", () => {
  const calls = [];
  assert.throws(() => registerWithExistingFundamentals({
    language:"pt-BR",idMap:{pressao:"x"},registerLesson:(...args)=>calls.push(args)
  }), /ID oficial ausente/);
  assert.equal(calls.length, 0);
});
test("IDs oficiais duplicados são rejeitados", () => {
  const idMap = Object.fromEntries(FUNDAMENTALS_TOPIC_IDS.map(t => [t, "x"]));
  assert.throws(() => registerWithExistingFundamentals({
    language:"pt-BR",idMap,registerLesson:()=>{}
  }), /duplicados/);
});
test("registro é exclusivamente por callback e preserva dados e IDs fornecidos", () => {
  const idMap = Object.fromEntries(FUNDAMENTALS_TOPIC_IDS.map(t => [t, "original-" + t]));
  const calls = [];
  const out = registerWithExistingFundamentals({
    language:"en-US",idMap,registerLesson:(id,data)=>calls.push({id,data})
  });
  assert.deepEqual(out, {registered:6,skipped:0});
  assert.equal(calls[0].id, "original-pressao");
  assert.equal(calls[0].data.id, "original-pressao");
  assert.equal(calls[0].data.locale, "en-US");
  assert.equal(calls[0].data.section, "FUNDAMENTOS");
});
test("lições já existentes por ID ou tag não são substituídas", () => {
  const idMap = Object.fromEntries(FUNDAMENTALS_TOPIC_IDS.map(t => [t, "original-" + t]));
  const calls = [];
  const out = registerWithExistingFundamentals({
    language:"pt-BR",idMap,
    existingLessons:["original-pressao",{id:"antigo-boyle",deduplicationTag:"fundamentos/boyle"}],
    registerLesson:(id,data)=>calls.push({id,data})
  });
  assert.deepEqual(out, {registered:4,skipped:2});
  assert.equal(calls.some(x=>x.data.originalTopicId==="pressao"), false);
  assert.equal(calls.some(x=>x.data.originalTopicId==="boyle"), false);
});
test("pacote de integração não contém comandos de interface, CSS, rotas ou DOM", () => {
  const code=readFileSync(new URL("../content/fundamentos/index.mjs",import.meta.url),"utf8");
  assert.doesNotMatch(code,/document\.|window\.|innerHTML|querySelector|createElement|\.css["']/);
  assert.doesNotMatch(code,/fetch\(|history\.pushState|location\.href/);
});
