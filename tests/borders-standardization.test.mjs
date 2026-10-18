import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load = name => readFileSync(new URL('../dist/' + name, import.meta.url), 'utf8');
const styles = load('styles.css');
const chamber = load('camara.css');
const media = load('module01-media.css');
const index = load('index.html');
const mutedBorder = 'border:1px solid var(--card-border-gold)';

function rule(css, selector) {
  const parts = [];
  let offset = 0;
  while (true) {
    const start = css.indexOf(selector + '{', offset);
    if (start < 0) break;
    const end = css.indexOf('}', start);
    assert.ok(end > start, 'Regra incompleta: ' + selector);
    parts.push(css.slice(start, end + 1));
    offset = end + 1;
  }
  assert.ok(parts.length > 0, 'Seletor ausente: ' + selector);
  return parts.join('\n');
}

test('Home, menus, cards, botoes e rodape compartilham contorno dourado de 1px', () => {
  assert.match(styles, /--card-border-gold:#857557/);
  for (const selector of [
    '.home-card', '.panel', '.primary', '.bottom-nav', '.icon-button',
    '.study-stage', '.lesson-link', '.secondary', '.focus-card', '.focus-banner',
    '.track', '.back', '.answer'
  ]) {
    assert.ok(rule(styles, selector).includes(mutedBorder), selector);
  }
  assert.ok(rule(styles, '.app-header').includes('border-bottom:1px solid var(--card-border-gold)'));
  assert.ok(rule(styles, '.bottom-nav a.active').includes('box-shadow:none'));
});

test('Camara, calculos e atividades usam o mesmo contorno sem interferir na tipografia', () => {
  for (const selector of [
    '.camara .panel', '.camara .camara-flow li', '.camara .camara-evidence-item',
    '.camara .camara-figure', '.module .camara-inline-body .camara-flow li',
    '.module .camara-inline-body .camara-evidence-item'
  ]) {
    assert.ok(rule(chamber, selector).includes(mutedBorder), selector);
  }
  assert.ok(rule(media, ':is(.topic,.module) .m01-media button').includes(mutedBorder));
  assert.ok(rule(styles, '.module .knowledge-question button').includes(mutedBorder));
});

test('Busca sem borda, imagens sem contorno duplo e cores de estado preservadas', () => {
  assert.ok(rule(styles, '.consulta-global-search').includes('border:0'));
  assert.ok(rule(styles, '.consulta-search-line input[type=search]').includes('border:0!important'));
  assert.ok(rule(styles, '.module .chamber-lesson .m01-context-figure img').includes('border:0'));
  assert.ok(rule(styles, '.answer.correct').includes('border-color:var(--teal)'));
  assert.ok(rule(styles, '.answer[aria-pressed=true]').includes('border-color:var(--gold)'));
  for (const file of ['styles', 'camara', 'module01-media']) {
    assert.ok(index.includes(file + '.css?rev=gold-borders-20261018'));
  }
});

test('Folha final fixa #857557 em todos os cards, inclusive estados de interação', () => {
  const uniform = load('card-borders.css');
  const cardSelectors = [
    '.home-card', '.panel', '.study-stage', '.focus-card',
    '.track', '.lesson-link', '.module-topic-card',
    '.clinical-chapter-record', '.camara .panel',
    '.module .camara-inline-chapter', '.topic .topic-reading',
    '.module .knowledge-check', '.m01-media .m01-panel',
    '.answer', '.bottom-nav'
  ];
  for (const selector of cardSelectors) {
    assert.ok(uniform.includes(selector), 'Card sem regra uniforme: ' + selector);
  }
  assert.match(uniform, /border-color:\s*#857557\s*!important/);
  assert.ok(!uniform.includes('.consulta-global-search'));
  assert.ok(!uniform.includes('.m01-context-figure img'));
  const stylesheetPosition = index.indexOf('card-borders.css?rev=uniform-857557-20261018');
  const modulesPosition = index.indexOf('module01-media.css?rev=gold-borders-20261018');
  assert.ok(stylesheetPosition > modulesPosition, 'Folha uniforme deve ser a última CSS');
});
