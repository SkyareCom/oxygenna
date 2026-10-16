/**
 * OXYGENNA — adaptador de dados de Fundamentos.
 * Deliberadamente SEM DOM, CSS, rotas, componentes ou registro automático.
 * Não substitui nem altera os componentes existentes do site publicado.
 */
import raw from "./fundamentos.pt-en-es.json" with { type: "json" };

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

export const fundamentalsContent = deepFreeze(raw);
export const FUNDAMENTALS_TOPIC_IDS = Object.freeze([
  "pressao", "boyle", "dalton", "henry", "dose", "seguranca"
]);
const LANGUAGE_KEYS = Object.freeze({
  pt: "pt", "pt-BR": "pt", en: "en", "en-US": "en", es: "es", "es-ES": "es"
});

export function getFundamentalsLocale(language) {
  const key = LANGUAGE_KEYS[language];
  return key ? fundamentalsContent.locales[key] : null;
}

export function getFundamentalsTopic(language, topicId) {
  return getFundamentalsLocale(language)?.topics.find(t => t.id === topicId) ?? null;
}

/**
 * Recebe IDs OFICIAIS do currículo existente; nunca gera ou adivinha rotas.
 * Não executa sozinho. A função registerLesson vem do app original.
 *
 * registerLesson(existingLessonId, payload) é fornecida pelo app original;
 * existingLessons contém os IDs ou registros já cadastrados na tela original.
 * Todas as verificações são concluídas ANTES do primeiro registro.
 */
export function registerWithExistingFundamentals({
  language, idMap, registerLesson, existingLessons = []
} = {}) {
  const locale = getFundamentalsLocale(language);
  if (!locale) throw new RangeError("Idioma não suportado");
  if (typeof registerLesson !== "function") {
    throw new TypeError("Forneça o registrador do app original");
  }
  if (!idMap || typeof idMap !== "object" || Array.isArray(idMap)) {
    throw new TypeError("Forneça o mapeamento oficial completo dos seis temas");
  }
  if (!Array.isArray(existingLessons)) throw new TypeError("existingLessons deve ser uma lista");

  const mapped = FUNDAMENTALS_TOPIC_IDS.map(topicId => {
    const id = idMap[topicId];
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("ID oficial ausente para: " + topicId);
    }
    return { topicId, id };
  });
  if (new Set(mapped.map(item => item.id)).size !== mapped.length) {
    throw new Error("IDs oficiais duplicados no mapeamento");
  }

  const usedIds = new Set();
  const usedTags = new Set();
  for (const item of existingLessons) {
    if (typeof item === "string") usedIds.add(item);
    else if (item && typeof item === "object") {
      if (item.id) usedIds.add(item.id);
      if (item.deduplicationTag) usedTags.add(item.deduplicationTag);
    }
  }

  let registered = 0;
  for (const { topicId, id } of mapped) {
    const tag = "fundamentos/" + topicId;
    if (usedIds.has(id) || usedTags.has(tag)) continue;
    const topic = getFundamentalsTopic(language, topicId);
    // Dados e IDs somente; a representação visual continua exclusivamente
    // sob responsabilidade dos componentes existentes no app original.
    registerLesson(id, {
      ...topic,
      id, originalTopicId: topicId, deduplicationTag: tag,
      section: "FUNDAMENTOS", module: locale.module, locale: locale.code
    });
    usedIds.add(id);
    usedTags.add(tag);
    registered++;
  }
  return { registered, skipped: mapped.length - registered };
}

export function validateFundamentalsContent() {
  const langs = ["pt", "en", "es"];
  const codes = { pt: "pt-BR", en: "en-US", es: "es-ES" };
  const sourceOrgs = new Set(fundamentalsContent.sources.map(s => s.org));
  if (fundamentalsContent.target_curriculum.modules !== 24 ||
      fundamentalsContent.target_curriculum.topics !== 144) {
    throw new Error("Metas de currículo divergentes");
  }
  if (sourceOrgs.size !== fundamentalsContent.sources.length) throw new Error("Fontes duplicadas");
  for (const source of fundamentalsContent.sources) {
    if (!source.title || !/^https:\/\//.test(source.url)) throw new Error("Fonte inválida");
  }
  for (const key of langs) {
    const data = fundamentalsContent.locales[key];
    if (!data || data.code !== codes[key] || data.topics.length !== 6) {
      throw new Error("Idioma incompleto: " + key);
    }
    if (data.topics.some((t, i) => t.id !== FUNDAMENTALS_TOPIC_IDS[i])) {
      throw new Error("Ordem temática divergente: " + key);
    }
    const titles = new Set();
    for (const topic of data.topics) {
      if (!topic.title || !topic.subtitle || !topic.lead ||
          !topic.pearl || !topic.caution || !topic.points?.length ||
          !topic.refs?.length) throw new Error("Tema incompleto: " + key + "/" + topic.id);
      if (titles.has(topic.title)) throw new Error("Título duplicado: " + key);
      titles.add(topic.title);
      if (topic.refs.some(ref => !sourceOrgs.has(ref))) {
        throw new Error("Referência ausente: " + key + "/" + topic.id);
      }
    }
    if (data.caseAnswers?.length !== 3) throw new Error("Casos incompletos: " + key);
    for (const q of data.caseAnswers) {
      if (!q.q || !q.explain || q.a?.length !== 3 ||
          !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.a.length ||
          q.a.some(a => typeof a !== "string" || !a.trim())) {
        throw new Error("Questão inválida em: " + key);
      }
    }
  }
  return true;
}
