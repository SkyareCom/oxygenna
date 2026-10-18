/* Navegador real: prova navegação da versão readaptada sem tocar no CSS original. */
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.svg':'image/svg+xml'};
const app=createServer(async(req,res)=>{
 const address=new URL(req.url||'/', 'http://localhost:4173');
 if(!address.pathname.startsWith('/oxygenna/')){res.writeHead(404);res.end();return;}
 const resource=address.pathname.slice('/oxygenna/'.length)||'index.html';
 if(resource.includes('..')){res.writeHead(400);res.end();return;}
 const path=resolve(root,resource);
 try{const data=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(data);}
 catch{res.writeHead(404);res.end('Not Found');}
});
await new Promise(done=>app.listen(4173,'127.0.0.1',done));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173/oxygenna/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('.bottom-nav a').first().waitFor({timeout:15000});
 if(await page.locator('.bottom-nav a').count()!==5)throw Error('Rodapé não contém cinco filtros');
 const expectedFooter=['HOME','FISIOLOGIA','CLÍNICA','CÂMARA','OPERAÇÃO'];
 const getFooter=()=>page.locator('.bottom-nav a span').allTextContents().then(items=>items.map(x=>x.trim()));
 if(JSON.stringify(await getFooter())!==JSON.stringify(expectedFooter))throw Error('Ordem do rodapé HOME incorreta: '+JSON.stringify(await getFooter()));
 if(await page.locator('.home-title').innerText()!=='Ciência sob pressão.')throw Error('Home antiga: título não restaurado');
 if(await page.locator('.home-hero img').count()!==1)throw Error('Home antiga: imagem ausente');
 if(await page.locator('.study-resume').count()!==1)throw Error('Home antiga: card da próxima aula ausente');
 if(await page.locator('.study-stage').count()!==6)throw Error('Home precisa de seis cards');
 const homeCards=await page.locator('.study-stage .stage-copy strong').allTextContents();
 if(JSON.stringify(homeCards.map(x=>x.trim()))!==JSON.stringify(['FISIOLOGIA','CLÍNICA','CÂMARA','OPERAÇÃO','INDICAÇÕES E PROTOCOLOS','EM FOCO']))throw Error('Ordem dos seis cards da Home incorreta: '+JSON.stringify(homeCards));
 if(await page.locator('.brand-logo').count()!==1)throw Error('Logotipo não preservado');
 const styles=await page.evaluate(()=>({header:getComputedStyle(document.querySelector('.app-header')).position,footer:getComputedStyle(document.querySelector('.bottom-nav')).position,font:getComputedStyle(document.body).fontFamily}));
 if(styles.header!=='fixed'||styles.footer!=='fixed')throw Error('Header/footer originais deixaram de ser fixos: '+JSON.stringify(styles));
 await page.locator('.bottom-nav a[href$="/fisiologia"]').click();
 if(!page.url().endsWith('/fisiologia'))throw Error('FISIOLOGIA não navega corretamente');
 if(JSON.stringify(await getFooter())!==JSON.stringify(expectedFooter))throw Error('Ordem do rodapé FISIOLOGIA incorreta');
 await page.locator('main .lesson-link').first().waitFor();
 if(await page.locator('main .lesson-link').count()!==8)throw Error('Fisiologia não possui 8');
 await page.locator('[data-consulta-link][href$="/clinica"]').first().click();
 if(await page.locator('main .lesson-link').count()!==12)throw Error('Clínica não possui 12');
 if(JSON.stringify(await getFooter())!==JSON.stringify(expectedFooter))throw Error('Ordem do rodapé CLÍNICA incorreta');
 await page.locator('[data-consulta-link][href$="/camara"]').first().click();
 if(await page.locator('main .lesson-link').count()!==8)throw Error('Câmara não possui 8');
 await page.locator('[data-consulta-link][href$="/operacao"]').first().click();
 if(await page.locator('main .lesson-link').count()!==4)throw Error('Operação não possui 4');
 await page.locator('[data-consulta-link][href$="/home"]').first().click();
 await page.locator('.study-map').waitFor();
 if(await page.locator('.home-title').innerText()!=='Ciência sob pressão.')throw Error('Link HOME não restaura tela original');
 await page.evaluate(()=>{
  history.pushState(null,'','/oxygenna/clinica');
  window.dispatchEvent(new PopStateEvent('popstate'));
 });
 await page.locator('main a[href$="/capitulo/dcs-tipo2"]').first().click();
 if(!page.url().endsWith('/capitulo/dcs-tipo2'))throw Error('URL capítulo incorreta: '+page.url());
 if(await page.locator('main section.panel').count()!==7)throw Error('DCS2 sem sete painéis');
 if(await page.locator('.bottom-nav a').count()!==3)throw Error('Rodapé do capítulo não tem três ações');
 if(await page.locator('[data-consulta-quiz]').count()!==3)throw Error('Quiz de revisão não contém três perguntas');
 await page.locator('[data-consulta-answer="0"][data-consulta-question="0"]').click();
 if(await page.locator('.feedback').count()<1)throw Error('Sem feedback da questão');
 await page.locator('[data-consulta-favorite]').click();
 if(!await page.locator('.bottom-nav').innerText().then(t=>t.includes('FAVORITADO')))throw Error('Favorito não funciona');
 const result={url:page.url(),styles,filters:[8,12,8,4],chapters:32,blocks:7,questions:3,errors};
 console.log('BROWSER_MOBILE_OK',JSON.stringify(result));
 if(errors.length)throw Error('Erros de execução: '+errors.join('; '));
}finally{await browser.close();await new Promise(done=>app.close(done));}
