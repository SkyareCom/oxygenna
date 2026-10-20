import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';

const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const css=readFileSync(new URL('../dist/card-borders.css',import.meta.url),'utf8');
const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const names=['fisiologia','clinica','camara','operacao'];

test('Quatro cartões únicos são carregados nas quatro seções do rodapé',()=>{
 const hashes=new Set();
 for(const section of names){
  const asset='oxygenna-'+section+'-premium-20261019.webp';
  const file=new URL('../dist/assets/'+asset,import.meta.url);
  const bin=readFileSync(file);
  assert.ok(bin.length>=20000&&bin.length<160000,section+' should be optimized for phone');
  assert.equal(bin.toString('ascii',0,4),'RIFF',section);
  assert.equal(bin.toString('ascii',8,12),'WEBP',section);
  assert.ok(app.includes("'/"+section+"'")&&app.includes(asset),section);
  const digest=createHash('sha256').update(bin).digest('hex');
  assert.ok(!hashes.has(digest),'Imagem repetida: '+section);
  hashes.add(digest);
 }
 assert.equal(hashes.size,4);
 assert.match(app,/renderFooterSectionPresentation\(route\)\+renderEmptySectionBase\(\)/);
 assert.match(app,/width="800" height="600"/);
 assert.ok(app.includes("section==='fisiologia'?'oxygenna-fisiologia-presentation':'oxygenna-section-presentation'"));
});
test('A Home não tem o layout alterado e cada seção preserva borda única',()=>{
 assert.ok(app.includes("if(section==='home')page=renderHome()+renderEmptySectionBase()"));
 assert.match(css,/\.oxygenna-blank-page \.oxygenna-section-presentation/);
 assert.match(css,/border: 1px solid #857557/);
 assert.match(css,/box-shadow: none !important/);
 assert.match(css,/object-fit: contain/);
 assert.match(index,/card-borders\.css\?rev=footer-premium-photos-20261019/);
 assert.match(index,/app\.mjs\?rev=footer-premium-photos-20261019/);
 assert.doesNotMatch(app,/renderFisiologiaPresentation/);
});
