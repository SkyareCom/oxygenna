# Hyperbaric Campus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar o front navegável fiel à proposta aprovada e incorporar as primeiras sínteses científicas pesquisadas.

**Architecture:** HTML, CSS e módulos JavaScript sem build. O renderizador separa interface, catálogo científico e modelos matemáticos. A mesma arte aprovada é recortada por CSS, preservando seus pixels.

**Tech Stack:** HTML/CSS/JavaScript, Node test runner, Sites estático.

**Spec:** ../specs/2026-10-15-hyperbaric-design.md

## Global Constraints

- Reproduzir a referência aprovada; não regenerar ilustrações.
- PT, EN e ES em todas as interfaces e aulas entregues.
- Não inventar fontes, certificação, progresso ou revisão clínica.
- Pressões absolutas e hipóteses dos modelos explícitas.
- Publicação privada no Site criado para este projeto.

## Review Focus

- Armazenamento indisponível ou corrompido: continuar utilizável em memória.
- Responder repetidamente: não duplicar aulas dominadas.
- Idioma inválido: retornar ao português.
- Entradas físicas inválidas: rejeitar NaN, infinito, pressão ou temperatura não positiva.
- Tela estreita e traduções longas: permitir quebra de texto sem cortar controles.

### Task 1: Núcleo de estado e física

**Files:** `dist/core.mjs`, `tests/core.test.mjs`.

**Interfaces:** Produz `loadState(storage)`, `saveState(storage,state)`, `completeLesson(state,id)`, `boyle(p1,v1,p2)`, `partialPressure(p,f)`, `henryRelative(p,p0)`, `thermalRatio(t1,t2)`, `pressureUnits(kpa)`.

- [x] Criar testes de resultados conhecidos, entradas inválidas e persistência corrompida.
- [x] Rodar `node --test tests/core.test.mjs`; confirmar falha por funções ausentes.
- [x] Implementar o núcleo e rodar a suíte até passar.

### Task 2: Interface e conteúdo

**Files:** `dist/index.html`, `dist/styles.css`, `dist/content.mjs`, `dist/app.mjs`.

**Interfaces:** Consome núcleo; produz navegação por hash, catálogo de aulas, referências e interface localizada.

- [x] Pesquisar e ler fontes; registrar o nível de acesso real.
- [x] Recriar as duas telas com arte original, hierarquia e proporções da referência.
- [x] Implementar aulas, progresso sem duplicação, laboratório e perfil.
- [x] Verificar cobertura de idiomas e referências no catálogo.

### Task 3: Verificação e publicação

**Files:** `.openai/hosting.json`, relatório de verificação.

- [x] Rodar testes e verificação de sintaxe de todos os módulos.
- [x] Conferir assets, catálogo e manifesto.
- [x] Sincronizar fonte e empacotar pelo helper oficial do Sites.
- [ ] Publicar no Site privado e confirmar estado terminal de sucesso.
- [ ] Informar link e limites de verificação visual.
