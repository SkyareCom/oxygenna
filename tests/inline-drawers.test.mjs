import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {withInlineDrawers} from '../dist/inline-drawers.mjs';

test('Expande todos os detalhes diretamente na página, preservando classes, open e hierarquia',()=>{
 const html='<main><details><summary>Referências</summary><p>Fonte</p></details>'+
  '<section><details class="knowledge-check" open id="quiz"><summary>Teste</summary><p>Conteúdo</p></details></section>'+
  '<details class="camara-inline-chapter" data-camara-id="01"><summary>Tema</summary><p>Estudo</p></details></main>';
 const out=withInlineDrawers(html);
 assert.match(out,/<details data-inline-drawer="plain">/);
 assert.match(out,/<details class="knowledge-check" open id="quiz" data-inline-drawer="styled">/);
 assert.match(out,/<details class="camara-inline-chapter" data-camara-id="01" data-inline-drawer="styled">/);
 assert.equal((out.match(/data-inline-drawer="/g)||[]).length,3);
 assert.equal(withInlineDrawers(out),out);
 assert.ok(!out.includes('<dialog')&&!out.includes('aria-modal="true"'));
});
test('Gavetas globais mantêm uma borda, não flutuam e preservam classes específicas',()=>{
 const css=readFileSync(new URL('../dist/inline-drawers.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
 assert.ok(html.includes('inline-drawers.css?rev=global-inline-drawers-20261019'));
 assert.ok(html.includes('app.mjs?rev=fisiologia-foto-escura-saira-20261019'));
 assert.ok(app.includes("withInlineDrawers(page)"));
 assert.ok(app.includes('const main=withInlineDrawers('));
 assert.ok(css.includes('position: relative !important'));
 assert.ok(css.includes('border: 1px solid #857557'));
 assert.ok(css.includes('main .m01-glossary details'));
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.doesNotMatch(css,/\bposition\s*:\s*fixed\b/);
});
test('Política de qualidade impede alertas, popups e modais bloqueantes no código entregue',()=>{
 const dir=new URL('../dist/',import.meta.url);
 const files=['app.mjs','navigation-view.mjs','curriculum-view.mjs','consulta/consulta-view.mjs','focus-view.mjs','clinical-view.mjs','camara-view.mjs','knowledge-check.mjs','module01-media.mjs','fundamentos-basicos.mjs','fundamentos-interativos.mjs'];
 for(const filename of files){
  const s=readFileSync(new URL(filename,dir),'utf8');
  assert.doesNotMatch(s,/<dialog(?:\s|>)/i,filename);
  assert.doesNotMatch(s,/\b(?:window\.)?(?:alert|confirm|prompt|open)\s*\(/i,filename);
  assert.doesNotMatch(s,/\.showModal\s*\(/i,filename);
  assert.doesNotMatch(s,/aria-modal\s*=\s*["']true/i,filename);
 }
});
