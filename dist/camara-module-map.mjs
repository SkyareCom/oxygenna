/** OXYGENNA — reuso dos capítulos curriculares já existentes. Sem duplicar cards.
 * 01 Campo hiperbárico: definição e tipos de câmara.
 * 02 Pressão e unidades: compressão e Boyle.
 * 04 Transporte: O₂ dissolvido / fisiologia.
 * 05 Hiperóxia, mecanismos e reparo: indicações e limites de evidência.
 * 06 Segurança do ambiente: preparação, experiência do paciente e equalização.
 * Os módulos 07 e 08 pertencem a INDICAÇÕES/PROTOCOLOS, não repetir em CÂMARA.
 */
export const CAMARA_MODULE_LESSONS = Object.freeze({
 '01':['camara-01','camara-04'],
 '02':['camara-02'],
 '04':['camara-03'],
 '05':['camara-08'],
 '06':['camara-05','camara-06','camara-07']
});
export const camaraModuleForLesson = lessonId => Object.entries(CAMARA_MODULE_LESSONS).find(([,ids])=>ids.includes(lessonId))?.[0]??null;
export const camaraLessonsForModule = moduleId => CAMARA_MODULE_LESSONS[moduleId]??[];
