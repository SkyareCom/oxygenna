import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const pages=readFileSync(new URL('../.github/workflows/github-pages.yml',import.meta.url),'utf8');
const mobile=readFileSync(new URL('../.github/workflows/consulta-32-mobile.yml',import.meta.url),'utf8');
const photoURL=new URL('../dist/assets/fisiologia-camara-futurista-aprovada.webp',import.meta.url);

test('Imagem de apresentação de FISIOLOGIA é a fotografia escura aprovada',()=>{
 assert.match(app,/fisiologia-camara-futurista-aprovada\.webp\?rev=foto-escura-saira-20261019/);
 assert.match(app,/width="800" height="600"/);
 assert.match(index,/app\.mjs\?rev=fisiologia-foto-escura-saira-20261019/);
 assert.match(app,/oxygenna-fisiologia-presentation/);
 assert.doesNotMatch(app,/fisiologia-camara-apresentacao\.webp/);
});
test('Fotografia WebP real incluída nos assets estáticos (não uma ilustração ou placeholder)',()=>{
 const bytes=readFileSync(photoURL);
 assert.ok(bytes.length>20000);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(statSync(photoURL).size<150000,'Imagem otimizada para celular');
});
test('Pipeline publica a fotografia original aprovada, sem efeitos de piso artificiais',()=>{
 for(const workflow of [pages,mobile]){
   assert.doesNotMatch(workflow,/escurecer-piso-fisiologia|Aplicar piso escuro|Pillow==11/);
   assert.match(workflow,/npm test/);
 }
 assert.ok(pages.includes('upload-pages-artifact@v4'));
});
