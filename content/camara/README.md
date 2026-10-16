# OXYGENNA — Conteúdos básicos da aba CÂMARA

Esta pasta contém **somente dados educacionais e ilustrações**, preservando a interface já aprovada no site original.

## 8 capítulos
1. O que é uma câmara hiperbárica
2. Pressão: o conceito que muda tudo
3. Como o oxigênio atua na câmara
4. Tipos de câmara: monoplace e multiplace
5. O que o paciente sente na pressurização
6. Equalização: proteção das cavidades aéreas
7. Segurança: preparação e monitorização
8. Indicações, limites e expectativas

## Integração no app original

Ao disponibilizar o código-fonte do app:
1. Importar `content/camara/index.mjs` no **módulo de dados existente** da aba CÂMARA.
2. Chamar `registerWithExistingCamera(registerLesson, existingLessons)`, fornecendo a função do renderizador atual.
3. Mapear `paragraphs`, `keyPoints`, `clinicalNuance` e `activity` nos **componentes que o app já usa**. O adaptador não cria páginas.
4. Renderizar `media[].asset` no componente existente de imagem; conectar `engine` aos controles/gráficos já existentes.
5. Enviar `audio.script` ao player/narrador preexistente. Não há MP3 gerado; scripts não são áudio pronto.
6. Deduplicar IDs/tags antes de registrar. Evitar repetir explicações já existentes nas seções CAPÍTULOS, INDICAÇÕES e PROTOCOLOS.
7. Validar responsividade, conteúdo clínico, questões, acessibilidade e publicação somente após revisar o código original.

**PROIBIDO:** recriar HOME, mudar menu, header, footer, estilo, fontes, cores, cards, dimensões, responsividade ou rotas. Nenhum HTML/CSS global acompanha este conteúdo.

**Estado:** arquivos incluídos no GitHub. **Não ligados à aplicação publicada**, porque o repositório foi criado vazio e ainda não contém o front original. `medicina-hiperbarica-campus.celsomurakami.chatgpt.site` não publica automaticamente commits deste repositório.

## Segurança científica

Os cálculos são exercícios físicos didáticos; valores de PIO₂ não são PaO₂, pressão alveolar, prescrição ou garantia de benefício. Indicações e intervenções dependem de avaliação médica. As referências estão identificadas no JSON.
