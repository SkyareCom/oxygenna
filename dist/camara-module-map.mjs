/** OXYGENNA — reuso dos capítulos curriculares já existentes. Sem duplicar cards.
 * 01 Campo hiperbárico: definição e tipos de câmara.
 * 02 Pressão e unidades: compressão e Boyle.
 * 04 Transporte: O₂ dissolvido / fisiologia.
 * 06 Segurança do ambiente: preparação e monitorização.
 * 07 Avaliação clínica: indicações e evidências.
 * 08 Cuidado antes/durante/após: vivência do paciente e equalização.
 * Os módulos 07 e 08 já existiam no currículo; são exibidos também em CÂMARA.
 */
export const CAMARA_MODULE_LESSONS = Object.freeze({
 '01':['camara-01','camara-04'],
 '02':['camara-02'],
 '04':['camara-03'],
 '06':['camara-07'],
 '07':['camara-08'],
 '08':['camara-05','camara-06']
});
export const camaraModuleForLesson = lessonId => Object.entries(CAMARA_MODULE_LESSONS).find(([,ids])=>ids.includes(lessonId))?.[0]??null;
export const camaraLessonsForModule = moduleId => CAMARA_MODULE_LESSONS[moduleId]??[];
