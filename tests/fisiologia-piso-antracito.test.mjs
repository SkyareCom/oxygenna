import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const index=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('../scripts/escurecer-piso-fisiologia.py',import.meta.url),'utf8');
const pages=readFileSync(new URL('../.github/workflows/github-pages.yml',import.meta.url),'utf8');
const mobile=readFileSync(new URL('../.github/workflows/consulta-32-mobile.yml',import.meta.url),'utf8');

test('Apenas a imagem de apresentação FISIOLOGIA usa versão com piso antracito',()=>{
 assert.match(app,/fisiologia-camara-apresentacao\.webp\?rev=piso-antracito-20261019/);
 assert.match(index,/app\.mjs\?rev=fisiologia-piso-antracito-20261019/);
 assert.match(app,/oxygenna-fisiologia-presentation/);
 assert.doesNotMatch(app,/fisiologia-piso-escuro\.webp/);
});
test('Processamento preserva câmara e título, trabalha a partir da imagem aprovada e limita a máscara ao piso',()=>{
 assert.match(script,/ASSET = ROOT \/ "dist\/assets\/fisiologia-camara-apresentacao\.webp"/);
 assert.match(script,/darken_floor\(source/);
 assert.match(script,/ImageFilter\.GaussianBlur/);
 assert.match(script,/Image\.composite\(recolored, image, mask\)/);
 assert.match(script,/result\.getpixel\(\(400, 470\)\) == original\.getpixel/);
 assert.match(script,/result\.getpixel\(\(550, 180\)\) == original\.getpixel/);
 assert.match(script,/result\.save\(temporary, "WEBP"/);
});
test('Publicação e Android aplicam a edição reprodutível antes de testar ou publicar',()=>{
 for(const workflow of [pages,mobile]){
  const generate=workflow.indexOf('python scripts/escurecer-piso-fisiologia.py');
  const tests=workflow.indexOf('npm test');
  assert.ok(generate>0&&tests>generate,'Gerador deve executar antes de npm test');
  assert.match(workflow,/Pillow==11\.3\.0/);
 }
 assert.ok(pages.indexOf('python scripts/escurecer-piso-fisiologia.py')<pages.indexOf('upload-pages-artifact@v4'));
 assert.match(pages,/scripts\/escurecer-piso-fisiologia\.py/);
});
