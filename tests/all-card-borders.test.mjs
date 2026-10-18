import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../dist/' + path, import.meta.url), 'utf8');
const css = read('card-borders.css');
const html = read('index.html');

test('OXYGENNA: todos os cards têm a mesma cor externa #857557', () => {
  assert.match(css, /--card-border-gold:\s*#857557\s*;/);
  assert.match(css, /border-color:\s*#857557\s*!important\s*;/);
  for (const selector of [
    '.home-card', '.panel', '.track', '.study-resume', '.study-stage',
    '.focus-card', '.focus-topic', '.focus-banner', '.lesson-link',
    '.module-topic-card', '.clinical-chapter-record',
    '.camara .panel', '.camara .camara-figure',
    '.module .camara-inline-chapter',
    '.topic .topic-reading', '.module .knowledge-check',
    '.m01-media .m01-panel', '.m01-context-figure',
    '.answer', '.primary', '.secondary', '.bottom-nav'
  ]) {
    assert.ok(css.includes(selector), 'Faltou: ' + selector);
  }
});

test('OXYGENNA: última folha de estilo sobrepõe hover e seleção sem criar contorno extra', () => {
  assert.match(html, /card-borders\.css\?rev=gold-footer-home-credits-20261018/);
  assert.ok(
    html.indexOf('card-borders.css?rev=gold-footer-home-credits-20261018') >
    html.indexOf('module01-media.css?rev=knowledge-final-20261018')
  );
  assert.ok(!css.includes('.consulta-global-search'));
  assert.ok(!css.includes('.m01-context-figure img'));
  assert.doesNotMatch(css, /box-shadow:\s*inset\s+0\s+0\s+0\s+1px\s+#/);
});

test('Rodapé destaca texto e ícone só em dourado, sem fundo ou contorno duplo', () => {
  const footerRule=css.slice(css.indexOf('.bottom-nav a {'),css.indexOf('.bottom-nav a .icon {'));
  const activeRule=css.slice(css.indexOf('.bottom-nav a:is('),css.indexOf('.bottom-nav a:focus-visible {'));
  assert.ok(footerRule.includes('background: transparent !important;'));
  assert.ok(footerRule.includes('box-shadow: none !important;'));
  assert.ok(css.includes('.bottom-nav a .icon { color: inherit !important; stroke: currentColor; }'));
  assert.ok(activeRule.includes('color: #857557 !important;'));
  assert.ok(activeRule.includes('background: transparent !important;'));
  assert.ok(activeRule.includes(':active'));
  assert.ok(css.includes('.bottom-nav a:focus-visible {'));
  assert.ok(css.includes('main.home > .oxygenna-section-base {'));
  assert.ok(css.includes('.oxygenna-section-base-logo {'));
});
