# OXYGENNA — Fundamentos (somente dados; FRONT ORIGINAL INTACTO)

Pacote autoral recuperado da Biblioteca do projeto, criado em 15/10/2026. Contém **seis temas em três idiomas** (`pt-BR`, `en-US`, `es-ES`) sobre pressão, Boyle, Dalton, Henry, dose e segurança, com referências científicas e três decisões clínicas educativas por idioma.

## Status comprovado

- Dados: `fundamentos.pt-en-es.json` (**18 versões localizadas de seis temas**, não 18 temas diferentes).
- Adaptador: `index.mjs` (dados e funções puras; não usa DOM ou estilos).
- Testes automatizados: `tests/fundamentos.test.mjs`.
- **Não integrado ao site**, não publicado e não altera os 30 registros de INDICAÇÕES/PROTOCOLOS relatados no histórico.
- O currículo de **24 módulos / 144 temas é a meta do aplicativo**, não a quantidade de aulas implementadas neste pacote.
- Este pacote não fornece MP3s, vídeos, telas, CSS, JSX, animações executáveis ou substituição da navegação.

## Integração não destrutiva — somente quando o código original estiver disponível

1. Identificar os IDs oficiais dos seis temas de FUNDAMENTOS **no código original**, sem adivinhar rotas/IDs.
2. Usar `getFundamentalsLocale(locale)` / `getFundamentalsTopic(locale, id)` para entregar textos **aos componentes já existentes**.
3. Se houver registrador oficial de lições, chamar `registerWithExistingFundamentals({ language, idMap, registerLesson, existingLessons })`. A operação exige mapeamento completo e **não registra conteúdos duplicados**.
4. Fazer conferência de conteúdo clínico e testes de regressão/idioma/responsividade no projeto original **antes de publicar**.
5. Preservar a HOME, CÂMARA, CAPÍTULOS, INDICAÇÕES, PROTOCOLOS, botões, cards, 55 px, tipografia Saira Semi Condensed, cores, cabeçalho, rodapé e estado da navegação. **Não transformar a prévia autônoma em novo front**.
6. Não substituir fichas das 30 indicações, protocolos ou aulas já presentes no site.

## Limites científicos

O material é educação médica, não uma prescrição terapêutica. Conversões pressão/volume e modelos de pressão parcial não representam automaticamente dose efetiva nem desfechos clínicos; os casos de mergulho exigem avaliação médica. Conferir as referências identificadas no JSON e submeter à revisão editorial/clínica responsável antes da publicação.

## Estado do site e rastreabilidade

Projeto hospedado: `appgprj_6ad0a98fe37c8191afd25ea835ca6013`; site original `https://medicina-hiperbarica-campus.celsomurakami.chatgpt.site`. O GitHub existente contém conteúdo independente da seção CÂMARA, não o front inteiro do site. Este branch **não altera arquivos existentes, a branch main nem o site publicado**.
