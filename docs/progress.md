# Execução — 2026-10-15-hyperbaric-front

A referência visual e sua reprodução fiel foram aprovadas na conversa. O usuário autorizou busca e aplicação de conteúdo científico na internet. Execução direta nesta sessão; sem mudanças em repositórios existentes do usuário.

Referências e plano: `docs/superpowers/specs/2026-10-15-hyperbaric-design.md` e `docs/superpowers/plans/2026-10-15-hyperbaric-front.md`.

Pre-flight: o renderizador usa o núcleo de física e estado; o catálogo de conteúdo usa identificadores estáveis para não duplicar progresso. Interfaces compatíveis.

Limite de QA: control-browser indisponível. Não iniciar servidor nem instalar navegador. Fazer verificações de conteúdo, unidade e sintaxe; não afirmar comparação visual pixel a pixel.

Task 1: complete — eight physical/state tests failed before implementation, then passed.
Task 2: complete — nine lessons in PT/EN/ES, 16 source records, native navigation and original illustrations. Content tests failed before the catalog existed, then passed.
Final review: independent read-only review found two Important issues, no Critical issues.
Final: fixed blank initial #main route — routing regression RED→GREEN, suite 11/11. Skip focus now preserves lesson routes and language rerenders.
Final: fixed narrow-screen thumbnail crop drift — CSS crop geometry RED→GREEN at five viewport widths. Original team crop remains at source rows 693–789.
Final verification: node --test tests/*.test.mjs → 11/11; node --check on app/content → success; Python crop geometry → success; approved PNG SHA256 matches original exactly.
Browser visual QA, assistive-technology behavior and actual rendered control clipping remain unverified because control-browser is unavailable. The English title's measured font bounds were checked at 320–480px; this is not a browser test.
Publication: awaiting source packaging and native private deployment result.


# Execução — 2026-10-15-curriculum

Escopo confirmado pelo usuário: medicina hiperbárica e medicina do mergulho, com ensino multiprofissional. As quatro capas são referências bibliográficas; não se afirmou leitura dos livros integrais. A pesquisa pública e os artigos sustentam os objetivos, temas e quatro novas sínteses.

Implementação: 24 módulos / 144 temas em PT/EN/ES, 13 aulas introdutórias disponíveis e 26 registros de fontes. Eixos: 6 fundamentos, 9 medicina, 7 mergulho, 2 integração. Cada módulo inclui objetivo, seis temas, pré-requisitos e referências. As rotas focadas incluem o fechamento dos pré-requisitos e preservam sua ordem. A consulta do currículo não altera o progresso.

As funções renderHome e renderLearn continuam idênticas ao commit anterior; a arte aprovada não foi alterada. O botão Explorar abre o mapa, com acessos complementares no perfil e nas trilhas. Corrigida a colisão CSS da página de trilha com o cartão horizontal.

Revisão independente: sem achados Critical; um Important (Próximo/Anterior perdia a trilha) e um Minor (contagem de aulas filtradas). Corrigidos em uma única passagem. Regressão de navegação RED→GREEN: mergulho 07→16 e medicina 19→23, retorno ao mapa escolhido e contagens locais de 3/11 aulas.

Verificação final: 14/14 testes Node; cinco módulos JS passam verificação de sintaxe; git diff --check sem problemas; geometria das imagens aprovada em cinco larguras. O código das duas telas originais foi comparado diretamente com HEAD e permanece igual. Não houve navegador controlável disponível: renderização visual real e comportamento de tecnologia assistiva não foram verificados.

Publicação: preparar pacote do mesmo projeto privado e registrar o resultado nativo da implantação. O programa de 144 temas não equivale a 144 aulas completas nem a revisão médica independente.


# Execução — 2026-10-15-navegacao-comic-neue

Pedido delimitado sobre os fluxos existentes: rodapé HOME / CÂMARA / CAPÍTULOS / INDICAÇÕES / PROTOCOLOS em um único card; classificação dos temas por esses destinos; Home com índice guiado; cabeçalho com logotipo, nome, notificações e perfil. Durante a execução o usuário solicitou Comic Neue do Google no app inteiro. A alteração foi aplicada à tipografia global, com fontes Regular/Bold e licença OFL incorporadas a partir do repositório oficial google/fonts. Acentos PT/EN/ES conferidos nos arquivos das fontes.

Design implementado: Home com quatro etapas que cobrem os 24 módulos e 144 temas, contagem de aulas introdutórias consolidadas e recomendação da primeira aula publicada ainda não consolidada. Câmara: módulos 01–06 e acesso ao laboratório. Capítulos: índice completo e filtros anteriores. Indicações: 07, 09–15, 19. Protocolos: 06, 08, 18, 21–24, identificados como sequências educacionais. Não houve criação de doses ou novos protocolos clínicos. Conteúdo e 13 aulas preservados.

O cabeçalho usa um símbolo vetorial de escotilha/oxigênio e nome localizado, com acessos ao perfil e a avisos locais do campus. O status de leitura dos avisos é persistido em chave independente e não altera progresso. O seletor de idioma permanece no perfil. O card do rodapé tem cinco destinos, borda integral, margens e compensação da área segura. Links de módulos e aulas retêm o filtro, incluindo contexto explícito do índice completo. Rotas antigas continuam utilizáveis.

Verificação RED→GREEN das novas funções e rotas. Verificação final: 18/18 testes Node, sintaxe de todos os módulos JS, existência dos assets referenciados e identidade SHA256 da arte aprovada em relação ao commit anterior. Geometria do recorte das ilustrações passou nas cinco larguras anteriores. Limites de largura dos rótulos medidos com as métricas da Comic Neue em 320/360/390/430/480 px; ajustado o espaçamento no menor tamanho. Essas medidas não constituem QA visual em navegador.

Revisão independente somente leitura: nenhum achado material Critical, Important ou Minor. A renderização visual real, o carregamento de fonte no navegador e o comportamento real de toque/teclado permanecem sem verificação: control-browser indisponível, sem iniciar servidor ou instalar navegador, conforme o fluxo Sites. Não foi julgada expansão clínica fora deste escopo.

A atualização curricular anterior foi publicada com sucesso no mesmo Site privado (commit b7dc5eb5b32967052cc3d79eb83f623945b457ef). A etapa atual segue para empacotamento e publicação pelo fluxo nativo, preservando projeto e público.


# Execução — 2026-10-15-barlow-semi-condensed

Solicitação explícita: reduzir a tipografia e usar Barlow Semi Condensed em todo o app, exclusivamente nos tamanhos 10/12/16/20px. Mudança delimitada a styles.css, preload de fonte em index.html e assets da família oficial Google Fonts (Regular 400, SemiBold 600 e Bold 700, com licença OFL). As declarações font-size e os tamanhos dentro dos atalhos font foram normalizados; escalas fluidas acima de 20px removidas. Nenhuma alteração de conteúdo, ilustrações, navegação ou progresso.

Verificação: inventário completo das declarações de tamanho resulta exatamente em [10, 12, 16, 20] px; família global e arquivos locais conferidos; acentos de PT/EN/ES presentes nos arquivos. Limites métricos dos rótulos do rodapé passam em 320/360/390/430/480px. Suite Node 18/18, sintaxe JS e git diff --check sem erros; geometria dos recortes preservada. QA visual em navegador continua indisponível sob as limitações já registradas. Publicação pelo fluxo nativo no mesmo projeto privado.


# Execução — 2026-10-15-oxygenna-logo

O usuário forneceu o logotipo OXYGENNA. Aplicado o PNG original ao cabeçalho e favicon, com cópia byte a byte (SHA256 idêntico) e canal alfa preservado, sem redesenho ou geração de imagem. Nome do app atualizado para OXYGENNA; subtítulo localizado em PT/EN/ES descreve medicina hiperbárica e mergulho. Mantidos Barlow Semi Condensed e os tamanhos exclusivos 10/12/16/20px, navegação, conteúdo e progresso.

Verificação: 18/18 testes Node, sintaxe de todos os módulos JS, nome/marca e links do cabeçalho nos três idiomas, referências do PNG e transparência (RGBA, alfa 0–255). git diff --check sem problemas. Mantida a limitação de QA em navegador previamente documentada. Publicação no mesmo projeto e endereço privado.


# Execução — 2026-10-15-cabecalho-fixo

Pedido: manter cabeçalho fixo na tela e usar apenas MEDICINA HIPERBÁRICA abaixo de OXYGENNA. Cabeçalho agora usa posição fixa no topo, largura alinhada ao app, fundo opaco e camada acima do conteúdo. A altura é compartilhada com o espaço reservado no app e inclui a área segura superior. Subtítulo PT/ES: MEDICINA HIPERBÁRICA; EN: HYPERBARIC MEDICINE. Mantidos logo original, ações, Barlow Semi Condensed e escala 10/12/16/20px.

Verificação: 18/18 testes; renderização textual do cabeçalho nos três idiomas; configuração de deslocamento e escala tipográfica conferidas; git diff --check sem erros. Comportamento visual real de rolagem em navegador permanece sem verificação devido à indisponibilidade documentada de control-browser. Publicação no mesmo Site privado.


# Execução — 2026-10-15-laboratorio-tres-colunas

Solicitação: cards Unidades/Boyle/Dalton/Henry/Charles/Gay-Lussac em três colunas, preenchendo a linha. Aplicada grade de três colunas iguais, restrita aos seletores do laboratório, com botões de largura integral e altura mínima de 44px. Filtros curriculares e demais componentes preservados.

Verificação: 18/18 testes Node; git diff --check sem erros. Largura métrica do maior rótulo Barlow Semi Condensed 12px (54px) cabe nas três colunas em 320/360/390/430/480px. Mantida a limitação documentada de QA visual em navegador. Publicação no mesmo Site privado.


# Execução — 2026-10-15-saira-semi-condensed

Pedido explícito: usar Saira Semi Condensed em todo o app. Substituída a família global, atalhos de fonte e preload; arquivos oficiais Google Fonts Regular 400, SemiBold 600 e Bold 700 incorporados com licença OFL. Mantida a escala exclusiva 10/12/16/20px. Ajustado apenas o espaçamento dos rótulos do rodapé na menor largura para acomodar a nova métrica. Cabeçalho fixo, conteúdo, logo, progresso e laboratório de três colunas preservados.

Verificação: metadados das três fontes e cobertura de acentos PT/EN/ES; todas as referências de arquivos; escala tipográfica exata; 18/18 testes Node; git diff --check sem problemas. Métricas dos rótulos do rodapé passam em 320/360/390/430/480px. QA visual real em navegador permanece indisponível conforme registrado anteriormente. Publicação no mesmo Site privado.


# Execução — 2026-10-15-cards-capitulos-55px

Pedido: padronizar os cards dos capítulos em todo o app com altura 55px e títulos 16px. Atualizada a definição compartilhada lesson-link, usada nos índices completos/filtrados e listas de aulas: height/min-height/max-height 55px, padding vertical 7px e título Saira Semi Condensed 16px, entrelinha 1.2, até duas linhas. O texto integral permanece no link e no detalhe ao abrir o item.

Verificação: 18/18 testes Node; git diff --check sem erros; 38.4px de duas linhas dentro dos 39px internos do card; escala exclusiva 10/12/16/20px preservada. Mantida a limitação documentada de QA visual em navegador. Publicação no mesmo Site privado.


# Execução — 2026-10-15-titulo-medicina-hiperbarica

Pedido: remover clínica do nome da etapa Medicina hiperbárica clínica. Atualizado o rótulo compartilhado da fase medicine para Medicina Hiperbárica em PT/ES e Hyperbaric Medicine em EN. A Home e os demais índices que usam esse rótulo recebem a alteração. Identificadores, temas, aulas, layout e progresso preservados. Verificação: 18/18 testes Node e git diff --check sem erros. Publicação no mesmo Site privado.


# Execução — 2026-10-15-tarefas-ox

Retomadas as tarefas da conversa OX a partir do contexto recuperado e dos arquivos de prévia/patch enviados naquela conversa. Integração nativa no projeto original, sem observador de mutações ou modal sobreposto. Adicionado retorno contextual a todas as rotas internas; Home permanece sem retorno redundante. Card independente MEDICINA HIPERBÁRICA EM FOCO abaixo de Ver todos os capítulos, com a ilustração vetorial de câmara da prévia aprovada. Seção com Medicina do esporte, Medicina regenerativa, Cirurgia plástica e Pesquisas e inovações; detalhes voltam à seção, que volta à Home. Rodapé mantém Home ativa durante a navegação em Foco.

Quatro leituras iniciais nos três idiomas, com desenho do estudo, ano, limites e link à publicação original. Conferidos os registros primários de Qu et al. (2026, estudo exploratório com atletas), Kedar et al. (2025, modelo animal de regeneração nervosa), Daniel et al. (2025, análise retrospectiva de retalhos) e o ensaio HONEY (2024, fonte já existente). Os três novos registros permanecem identificados como resumo/trecho indexado consultado. Aplicações investigacionais distinguidas de indicações clínicas estabelecidas; sem doses, prescrição ou perfis de descompressão.

Preservados: Saira Semi Condensed e escala exclusiva 10/12/16/20px, logo e ilustrações originais, cabeçalho fixo, rodapé único, cards dos capítulos 55px com títulos 16px, laboratório em três colunas, 24 módulos/144 temas e 13 aulas iniciais. Leituras em Foco não alteram o progresso das aulas.

Verificação: 20/20 testes Node, incluindo rotas de retorno, posição e unicidade do card, navegação PT/EN/ES, 404, persistência do progresso e rastreabilidade das leituras. Sintaxe de todos os módulos JS válida; git diff --check sem problemas; fontes, escala, restrições de layout e identidade dos assets conferidas. QA visual real em navegador permanece indisponível no ambiente, conforme limitação já registrada.

Revisão independente de código concluída: nenhum defeito concreto crítico, importante ou menor identificado; apto à publicação. Revisor confirmou 20/20 testes, sintaxe, preservação dos totais, rotas e restrições. Aceitas as exclusões de julgamento: aparência e interação em navegador dependem de superfície indisponível; verificação científica substantiva realizada previamente na pesquisa, com revisão de implementação e limites de evidência nesta etapa.


# Execução — 2026-10-15-fotografia-card-especial

Solicitação: imagem fotográfica no card especial e ajuste da cor. Substituída a ilustração vetorial apenas do card da Home por fotografia real da câmara multiplace do Jacobi Medical Center, de Amqw23 (Wikimedia Commons, CC BY-SA 4.0). Arquivo original preservado, incorporado localmente, com carregamento adiado e enquadramento responsivo por CSS. Créditos com fonte/licença na seção aberta pelo card. Card agora em azul-marinho sóbrio #0a2431, borda dourada discreta #857557 e detalhes no dourado já usado no app. Fotografia ocupa a lateral inteira; texto mantém superfície opaca para leitura. Interior da seção, fontes, tamanhos, navegação e demais componentes preservados.

Verificação: fotografia inspecionada, dimensões 3987×2912 e identidade binária com original; 20/20 testes Node; sintaxe do módulo alterado e git diff --check válidos; escala tipográfica 10/12/16/20px e restrições existentes conferidas. Sem QA visual real em navegador, conforme limitação já documentada.


# Execução — 2026-10-15-bordas-douradas-cards

Solicitação: aplicar a borda dourada e o mesmo efeito de clique a todos os cards da tela principal e dos capítulos. Criada regra visual compartilhada com borda #857557 (a do card especial) e realce #d5b77b nas interações. Abrange cards das etapas/Home, retomada dos estudos, card especial, acesso a todos os capítulos, cards de capítulos/aulas e painéis do detalhe do capítulo. Links dos filtros de capítulos seguem o mesmo tratamento. Cards clicáveis compartilham realce de borda e brilho discreto ao toque, hover e foco por teclado; transição de 160ms desativada quando o usuário prefere movimento reduzido. A retomada realça a borda durante foco ou toque em seu botão.

Alteração restrita ao CSS. Preservadas cores de fundo, fotografia, textos, posições, dimensões, títulos, cabeçalho e rodapé. Verificação: 20/20 testes Node; git diff --check sem erros; escala 10/12/16/20px, cards dos capítulos 55px, laboratório de três colunas e ausência de alterações em assets/navegação conferidas. QA visual real em navegador permanece indisponível conforme registro anterior.


# Correção — 2026-10-15-botoes-dourados-em-todas-as-rotas

Relato com capturas: Voltar, Ver todos os capítulos e Laboratório de pressão e gases ainda exibiam bordas azuis em Câmara, Indicações e Protocolos. Causa confirmada no CSS: a regra anterior só selecionava os botões secondary dentro de Home/Capítulos/Currículo e não incluía a classe back.

Substituído o escopo por tela por regras compartilhadas pelos componentes. A borda #857557 e o realce #d5b77b agora abrangem Voltar, ações principais e secundárias, botões de ícones do cabeçalho, filtros do laboratório, idiomas e cards clicáveis das trilhas e da seção Em Foco. Mantidas as cores semânticas das respostas corretas e as cores/fundos dos estados selecionados. Rodapé, dimensões, posições, fotografia, conteúdo e persistência preservados. Movimento reduzido segue respeitado.

Verificação: cobertura dos componentes independente da rota conferida no CSS; 20/20 testes Node; git diff --check sem erros; escala tipográfica 10/12/16/20px, capítulo 55px, laboratório em três colunas e assets/navegação sem alterações. O ambiente permanece sem superfície suportada de QA visual em navegador, conforme documentado.


# Execução — 2026-10-15-setas-douradas

Solicitação: todas as setinhas internas dos cards no mesmo dourado das bordas. Identificados os ícones direcionais no helper compartilhado e aplicada a variável de cor da borda #857557; durante interação seguem o mesmo realce #d5b77b. Abrange etapas da Home, capítulos, trilhas, cards Em Foco, botões principais/secundários e Voltar. Setas tipográficas de exploração, pré-requisitos e links de fonte também foram isoladas para receber o mesmo tratamento, mantendo textos e ícones não direcionais.

Verificação: 20/20 testes Node, sintaxe dos três módulos alterados e git diff --check sem erros; escala tipográfica e altura 55px dos capítulos preservadas. Sem alteração em layout, navegação, conteúdo científico ou assets. QA visual real em navegador segue indisponível conforme limitação registrada.


# Execução — 2026-10-15-ver-capitulos-amarelo

Solicitação: Ver todos os capítulos no mesmo amarelo do botão Começar a estudar. O acesso passou a reutilizar o componente primary existente, com o mesmo preenchimento amarelo/dourado, texto escuro e peso. Aplicado à Home e às demais ocorrências do mesmo botão em Câmara/Indicações/Protocolos e no aviso de capítulos. Preservados rótulos e destinos nos três idiomas. Ajuste local de margem e raio conforme o botão de estudo; demais botões e cards não alterados.

Verificação: 20/20 testes Node, sintaxe dos dois módulos alterados e git diff --check sem erros. Mantida a limitação de QA visual real em navegador já registrada.


# Execução — 2026-10-15-indicacoes-protocolos

Solicitação: verificar a lista de indicações de OHB apresentada pelo usuário, acrescentar lacunas e inserir os respectivos protocolos no aplicativo original.

Auditoria: as condições apareciam principalmente como tópicos curriculares; não existia uma ficha por condição na aba Protocolos. Criado catálogo de 30 fichas, em português, inglês e espanhol, com páginas pareadas de indicação e roteiro educacional. Cada roteiro reúne seleção/limites, prioridade, cuidados associados, regime ou ausência de esquema universal, reavaliação, segurança, referências rastreáveis e capítulos relacionados. Os catálogos foram integrados às abas existentes, mantendo o índice curricular abaixo e o contexto do rodapé e do botão Voltar.

Cobertura: todos os itens 4.1–4.16 da Resolução CFM 1.457/1995 foram mapeados, incluindo as subdivisões da lista enviada (Fournier, infecções necrotizantes, isquemias traumáticas, enxertos comprometidos ou em risco, lesões tardias por radiação e anemia sem possibilidade transfusional). Acrescentados abscesso intracraniano, perda auditiva neurossensorial súbita, oclusão da artéria central da retina, necrose avascular da cabeça femoral, pneumatose cística intestinal e referências internacionais restritas, como calcifilaxia e condições neurológicas altamente selecionadas. Usos históricos/restritos não são apresentados como indicações rotineiras.

Fontes públicas oficiais e estudos primários conferidos: CFM, escopo público do manual UHMS 2023, consenso ECHM 2017 e sua correção (relatório integral de 2026 ainda pendente na consulta), CDC/ATSDR, IWGDF/IDSA 2023, NICE, ISOO-MASCC-ASCO 2024, AAO-HNS 2019 e trabalhos RICH-ART, HOT2, HOPON e Camporesi. O status de acesso público/indexado é indicado; manuais integrais não acessados não são apresentados como lidos. Incluídas diferenças de recomendação para cianeto isolado, escaras, osteorradionecrose e feridas diabéticas selecionadas.

Parâmetros numéricos são exemplos ligados à sua fonte e população, não prescrição universal. Não foram inventadas tabelas de recompressão nem doses para condições sem esquema padronizado. Cirurgia, antídotos, revascularização e tratamento convencional têm prioridade explícita. As fichas não são protocolos institucionais aprovados e não receberam validação clínica independente. Não há alegação de cobertura automática por convênio ou conformidade normativa integral.

Revisão independente do código e consistência científica: corrigida a omissão de enxertos/retalhos em risco (CFM4.14) e ajustado o status de acesso do resumo do ensaio de osteonecrose. Conteúdo de encefalopatia pós-anóxica mantido como referência limitada. A revisão não substitui validação de médico especialista.

Validação: 22/22 testes Node aprovados, incluindo cobertura de todos os itens CFM, referências e módulos válidos, campos nos três idiomas, rotas pareadas, retorno contextual e renderização integrada do app. Consultar as novas fichas não altera as 13 aulas ou o progresso existente. Sintaxe de 20 módulos conferida; git diff --check sem erros; escala tipográfica 10/12/16/20px, cards de capítulos em 55px e laboratório em três colunas preservados; assets originais sem alteração. QA visual real em navegador permanece indisponível no ambiente suportado.


# Correção — 2026-10-15-fichas-clinicas-nos-capitulos

Pergunta do usuário: todas as indicações estão integradas nos capítulos? A conferência revelou uma integração parcial: cada ficha tinha links para os módulos relacionados, mas a página do módulo não exibia as fichas correspondentes. Completada a integração no renderizador compartilhado dos capítulos.

Cada capítulo relacionado agora apresenta a seção Indicações e protocolos neste capítulo. As condições abrem na própria página, com enquadramento, seleção, prioridade, cuidados associados, regime/referência, reavaliação, fontes e acesso ao protocolo completo. A seção também reúne segurança, unidades e limites educacionais. O conteúdo usa a mesma coleção das abas Indicações e Protocolos, evitando cópias divergentes. Disponível nos três idiomas. As 30 fichas estão representadas nos módulos de seu mapeamento. Os seis temas originais por módulo, as 13 aulas, os registros de progresso e os critérios de conclusão permanecem preservados.

Interação e visual: títulos16px, cards fechados55px (53px internos + bordas), bordas e setas douradas, conteúdo expansível na própria tela. Sem alterações ao cabeçalho, rodapé ou imagens. Não foram criadas novas prescrições ou alegações clínicas; o conteúdo mantém suas fontes, datas e limitações.

Verificação: novo teste primeiro falhou pela ausência das fichas dentro do capítulo07; após integração, 23/23 testes Node passaram. Cobertura percorre todos os capítulos e idiomas, verifica as 30 fichas nos módulos mapeados, campos e referências. Teste de renderização do app verifica ainda os capítulos clínicos, idioma, contexto do rodapé e persistência do progresso. Sintaxe dos módulos, git diff --check e restrições tipográficas/layout conferidos. QA visual real em navegador permanece indisponível no ambiente suportado.


# Revisão — 2026-10-15-varredura-redundancias

Pedidos: varrer itens repetidos/redundantes; durante a execução, remover Aprofundar nos capítulos de Indicações e Protocolos. Auditoria percorreu os 24 módulos,144 tópicos,13 aulas,30 fichas e50 referências iniciais nos três idiomas. Não foram encontrados títulos ou tópicos exatamente duplicados após normalização. Identificadas11 repetições integrais de fichas entre capítulos e8 protocolos que exibiam duas vezes a referência do regime.

Consolidação: cada condição possui um capítulo principal e sua ficha completa aparece uma vez na sequência de capítulos. Os11 vínculos adicionais permanecem como cartões para o capítulo principal, preservando o contexto de navegação. As abas Indicações e Protocolos continuam usando a mesma coleção de30 condições. Parágrafos clínicos, critérios, regimes e limites das30 fichas foram comparados com a versão anterior e preservados integralmente.

Fontes: a referência de regime agora aparece uma vez por protocolo, como primeira entrada na bibliografia e identificada por legenda. O anúncio do consenso ECHM2017 foi consolidado no relatório completo já consultado, acompanhado da correção; sete módulos passaram a apontar para essas fontes em vez do anúncio, deixando49 entradas bibliográficas únicas. O aviso de atualização EUBS2026 tem escopo diferente e foi preservado. Simplificada a denominação redundante Apneia e mergulho em livre para Mergulho em apneia, com equivalentes em inglês e espanhol.

Aprofundar nos capítulos: removidos o título e as listas associadas tanto dos catálogos Indicações/Protocolos quanto das60 páginas de fichas individuais nos três idiomas. Esses catálogos também deixam de repetir contagens curriculares e bibliografia genérica de livros; mostram o catálogo clínico correspondente. Preservado o botão amarelo Ver todos os capítulos e as rotas antigas para não quebrar acessos existentes. A integração clínica dentro dos capítulos permanece disponível.

Navegação: retornos no topo e no fim dos capítulos longos, pré-requisitos, módulos anterior/próximo e acessos por diferentes áreas foram considerados úteis e preservados. Não foram removidas condições distintas por compartilharem termos, como cistite rádica e intersticial ou embolia gasosa e doença descompressiva.

Verificação: testes de regressão reproduziram inicialmente as repetições e a presença dos blocos solicitados para remoção. Após a correção,26/26 testes Node passaram, com cobertura dos três idiomas, capítulos principais, vínculos relacionados, fontes únicas, ausência dos blocos e navegação/progresso. Sintaxe de todos os módulos e git diff --check aprovados. Preservados fontes10/12/16/20px, títulos16px dos cards, cards de capítulos55px, laboratório3colunas e assets. Conteúdo total mantido:24 módulos,144 temas,13 aulas e30 condições. QA visual real em navegador permanece indisponível no ambiente suportado.
