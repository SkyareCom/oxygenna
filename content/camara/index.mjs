// OXYGENNA — registro de conteúdo para a seção CÂMARA.
// Não modifica DOM, CSS, rotas, cabeçalhos ou componentes.
import content from "./chapters.pt-BR.json" with { type: "json" };

export const cameraContent = Object.freeze(content);
export const cameraLessons = Object.freeze([...content.lessons]);

export function getCameraLesson(id) {
  return cameraLessons.find(lesson => lesson.id === id) ?? null;
}

/** Relação de Boyle, quantidade fixa e temperatura constante. */
export function boyleNormalized(ata, initialATA = 1) {
  if (![ata, initialATA].every(v => Number.isFinite(v) && v > 0)) {
    throw new RangeError("Pressões absolutas devem ser positivas");
  }
  return initialATA / ata;
}

/** Pressão parcial INSPIRADA de O₂ humidificado a 37°C em mmHg.
 * Não representa pressão alveolar, PaO₂ ou dose clínica.
 * Aproximação didática ao nível do mar: 760 mmHg por ATA; PH₂O=47 mmHg.
 */
export function inspiredOxygenHumidified(ata, fio2) {
  if (!Number.isFinite(ata) || ata <= 0 || !Number.isFinite(fio2) || fio2 < 0 || fio2 > 1) {
    throw new RangeError("ATA e FiO₂ inválidas");
  }
  return Math.max(0, ata * 760 - 47) * fio2;
}

export function checkCameraAnswer(lessonId, answer) {
  const lesson = getCameraLesson(lessonId);
  if (!lesson) throw new Error("Lição não encontrada: " + lessonId);
  const activity = lesson.activity;
  if (activity.type === "single-choice") {
    const correct = Number(answer) === activity.data.correctIndex;
    return { correct, expected: activity.data.correctIndex, explanation: activity.data.explanation };
  }
  if (activity.type === "calculation") {
    const value = Number(answer);
    const correct = Number.isFinite(value) && Math.abs(value - activity.expected) <= activity.tolerance;
    return { correct, expected: activity.expected, explanation: activity.explanation };
  }
  throw new Error("Tipo de atividade não reconhecido: " + activity.type);
}

/** Integrar SOMENTE por API preexistente; sem montar uma UI paralela.
 * registerLesson(id, payload) deve vir do código original da CÂMARA.
 * existingLessons pode receber IDs ou registros com id/deduplicationTag.
 */
export function registerWithExistingCamera(registerLesson, existingLessons = []) {
  if (typeof registerLesson !== "function") {
    throw new TypeError("É obrigatório informar a função de registro já existente na aba CÂMARA");
  }
  const ids = new Set();
  const tags = new Set();
  for (const entry of existingLessons) {
    if (typeof entry === "string") ids.add(entry);
    else if (entry && typeof entry === "object") {
      if (entry.id) ids.add(entry.id);
      if (entry.deduplicationTag) tags.add(entry.deduplicationTag);
    }
  }
  let registered = 0;
  for (const lesson of cameraLessons) {
    if (ids.has(lesson.id) || tags.has(lesson.deduplicationTag)) continue;
    registerLesson(lesson.id, lesson);
    ids.add(lesson.id);
    tags.add(lesson.deduplicationTag);
    registered++;
  }
  return { registered, skipped: cameraLessons.length - registered };
}

export function validateCameraContent() {
  if (cameraContent.locale !== "pt-BR" || cameraLessons.length !== 8) throw new Error("Inventário da CÂMARA inválido");
  const ids = new Set(), tags = new Set();
  for (const lesson of cameraLessons) {
    if (lesson.section !== "CAMARA" || ids.has(lesson.id) || tags.has(lesson.deduplicationTag)) {
      throw new Error("Seção ou duplicação: " + lesson.id);
    }
    ids.add(lesson.id); tags.add(lesson.deduplicationTag);
    if (!lesson.paragraphs?.length || !lesson.audio?.script || !lesson.media?.length || !lesson.activity) {
      throw new Error("Dados essenciais ausentes: " + lesson.id);
    }
    if (lesson.sourceIds?.some(id => !cameraContent.sources[id])) throw new Error("Fonte inexistente: " + lesson.id);
    if (lesson.activity.type === "single-choice") {
      const data = lesson.activity.data;
      if (!Array.isArray(data.options) || data.correctIndex < 0 || data.correctIndex >= data.options.length) {
        throw new Error("Questão inválida: " + lesson.id);
      }
    }
  }
  return true;
}
