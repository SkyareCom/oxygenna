# OXYGENNA — Medicina Hiperbárica

## Conteúdos da CÂMARA já versionados

Este repositório contém os **oito capítulos básicos da seção CÂMARA**, organizados em `content/camara/`, com textos, pontos-chave, nuances clínicas, atividades, roteiros de narração e quatro diagramas SVG independentes.

- **Dados:** [chapters.pt-BR.json](content/camara/chapters.pt-BR.json)
- **Adaptador não intrusivo:** [index.mjs](content/camara/index.mjs)
- **Ilustrações:** [assets/](content/camara/assets/)
- **Instruções:** [README da CÂMARA](content/camara/README.md)
- **Validação:** `npm test` e [GitHub Actions](../../actions/workflows/camara-content.yml)

## Limites do repositório

O repositório estava vazio quando foi indicado. **O código-fonte do front aprovado e sua configuração de publicação não estão presentes.** Assim, a camada de conteúdo está implementada e testada no GitHub, mas **ainda não está conectada nem publicada** no aplicativo hospedado em:

https://medicina-hiperbarica-campus.celsomurakami.chatgpt.site

**Front congelado:** não foram criados nem substituídos arquivos HTML, CSS, páginas, navegação, cabeçalho ou rodapé. O adaptador só registra conteúdos no renderizador preexistente quando ele for disponibilizado.

Para integração real na interface aprovada, é necessário versionar o código-fonte original no repositório e conectar o adaptador à aba CÂMARA existente. Não recriar a interface.
