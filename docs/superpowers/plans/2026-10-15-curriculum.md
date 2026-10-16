# Curriculum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrar uma sequência abrangente e trilíngue de medicina hiperbárica e medicina do mergulho sem alterar as duas telas aprovadas.

**Architecture:** Catálogo curricular independente com 24 módulos e 144 temas; referências e quatro aulas de mergulho em módulo de conteúdo separado. O renderizador usa as rotas de currículo e módulo e reutiliza os componentes existentes.

**Tech Stack:** HTML/CSS/JavaScript estático, Node test runner, Sites.

**Spec:** ../specs/2026-10-15-curriculum.md

## Global Constraints

- Apenas fundamentos, medicina, mergulho e integração.
- Preservar as duas telas e a arte aprovada.
- PT/EN/ES para objetivos, temas, sequência e interface.
- Temas estruturados não contam como aulas publicadas ou progresso.
- Critérios de cobertura não equivalem a indicação clínica.

## Review Focus

- IDs/pré-requisitos inválidos ou ciclos quebrariam a sequência.
- Aula existente sem vínculo desapareceria do percurso.
- Tema sem tradução produziria interface incompleta.
- Consulta do programa não pode aumentar progresso.
- Rotas e filtros desconhecidos devem produzir retorno utilizável.

### Task 1 — Catálogo e fontes

**Files:** `dist/curriculum.mjs`, `dist/diving-content.mjs`, `dist/content.mjs`, `tests/curriculum.test.mjs`.

**Interfaces:** `modules`, `phases`, `curriculumUI`, `getModules(filter)`, `getModule(id)`, `getLearningPath(focus)`; IDs de aulas e fontes existentes preservados.

- [x] Escrever e executar testes de sequência, pré-requisitos, traduções e vínculo das aulas antes do catálogo.
- [x] Implementar catálogo e conteúdo e confirmar os testes.

### Task 2 — Integração da navegação

**Files:** `dist/app.mjs`, `tests/routing.test.mjs`.

- [x] Verificar que o botão Explorar trilhas abre o currículo.
- [x] Implementar mapa, módulos, pré-requisitos e vínculos a aulas.
- [x] Confirmar rotas, filtros, tradução e preservação de progresso.

### Task 3 — Revisão e publicação

- [x] Rodar todos os testes, verificações de sintaxe e geometria existente.
- [x] Revisar o diff, fontes e distinção programa/aulas disponíveis.
- [x] Sincronizar e publicar no mesmo Site privado.

Independent review: one Important pathway-navigation issue and one Minor filtered-count issue. Both corrected in one pass; routing regression failed before the fix, then passed. Module routes now retain pathway context; Previous/Next use its selected sequence; available lesson counts use unique lesson IDs within that view.
