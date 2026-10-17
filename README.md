# OXYGENNA — Medicina Hiperbárica

Aplicativo educacional em português, inglês e espanhol sobre medicina hiperbárica e medicina do mergulho.

## Versão funcional importada

Esta importação conserva o código da versão publicada do OXYGENNA, incluindo seu front aprovado, logotipo, imagens, tipografia Saira Semi Condensed, navegação e persistência de progresso.

- Programa estruturado em 24 módulos e 144 temas.
- 13 sínteses iniciais com atividades de consolidação.
- 30 fichas de condições clínicas, com indicação, limites de evidência, roteiro educacional e referências.
- Integração das fichas aos capítulos principais, com atalhos nos capítulos relacionados.
- Laboratório interativo de unidades e leis dos gases.
- Seção Medicina Hiperbárica em Foco.

O programa de 144 temas não significa que 144 aulas completas já estejam publicadas. Os roteiros clínicos são educacionais e ainda não receberam validação clínica independente. Não substituem avaliação individual ou protocolos institucionais.

## Hospedagem e aplicativo com conteúdo integrado

A pasta **`dist/` contém o OXYGENNA completo**, com a HOME original, rodapé, estilos Saira Semi Condensed, e conteúdo aprofundado dos oito capítulos de **CÂMARA**, diagramas e exercícios.

O projeto agora prepara **GitHub Pages** por meio do workflow `.github/workflows/github-pages.yml`. O workflow testa tudo, exporta um pacote estático e tenta publicar o site. O GitHub Pages exige habilitação em **Settings → Pages → Source: GitHub Actions** e, em repositório privado, um plano compatível com Pages privado. A URL pública só deve ser divulgada quando o workflow indicar deploy bem-sucedido.

A versão estática pode ser executada sem ChatGPT Sites:

```sh
python3 -m http.server 8080 --directory dist
```

Abra `http://localhost:8080/#chamber` para visualizar os oito capítulos no aplicativo completo, ou `http://localhost:8080/#camara/camara-01` para o primeiro.

**Não confundir**: a inclusão do código no Git não exclui a antiga hospedagem, não muda a visibilidade do repositório e não garante publicação automática sem configurar GitHub Pages.

## Executar localmente

O app é estático e não depende de instalação de pacotes:

```sh
python3 -m http.server 8080 --directory dist
```

Abra `http://localhost:8080`. Os módulos JavaScript precisam ser servidos por HTTP; abrir o HTML diretamente como arquivo pode bloquear imports.

## Verificar

Com Node.js 20 ou superior:

```sh
npm test
```

A pasta `tests/` verifica conteúdo, idiomas, vínculos, modelos físicos, navegação e progresso. A versão importada, junto aos pacotes preservados, passou em 43 testes; a revisão visual real em navegador não foi executada nesta etapa.

## Estrutura

- `dist/`: aplicativo executável, conteúdo e recursos visuais.
- `tests/`: verificações automatizadas.
- `docs/`: decisões e histórico de alterações.
- `.github/workflows/github-pages.yml`: testes e publicação de `dist/` no GitHub Pages, com artefato estático para download.

A hospedagem ChatGPT Sites é legada e não é mais o destino de publicação desta base. A publicação deve ser feita pelo GitHub Pages a partir da pasta `dist/`. O arquivo de configuração `.openai/hosting.json` foi removido do repositório. Remover esse vínculo do Git não exclui automaticamente um site antigo do ChatGPT Sites.

## Referências e recursos

As referências científicas e seus tipos de acesso estão no catálogo do app. Capas fornecidas orientam o escopo bibliográfico; os livros integrais não foram copiados. As licenças das fontes estão em `dist/assets/`. A fotografia da câmara de Jacobi é de Amqw23/Wikimedia Commons, sob CC BY-SA 4.0; a atribuição também aparece no app.

## Pacotes de conteúdo preservados

Os pacotes que já estavam no repositório permanecem disponíveis:

- [Câmara](content/camara/README.md): oito capítulos, atividades, roteiros de narração e diagramas.
- [Fundamentos](content/fundamentos/README.md): conteúdo em português, inglês e espanhol.
- `tests/camara.test.mjs`, `tests/fundamentos.test.mjs` e seus fluxos do GitHub Actions.

Esses pacotes mantêm seus adaptadores próprios. A importação do código-fonte original em `dist/` não realiza automaticamente a integração deles na interface nem produz áudio.
