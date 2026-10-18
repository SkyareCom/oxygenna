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
 if(await page.locator('.study-resume').count()!==1)throw Error('Card de conteúdo extra da Home ausente');
 if((await page.locator('.study-resume .tag').innerText()).trim()!=='CONTEÚDO EXTRA DISPONÍVEL')throw Error('Subtítulo da Home incorreto');
 if((await page.locator('.study-resume h2').innerText()).trim()!=='FUNDAMENTOS BÁSICOS')throw Error('Título do card da Home incorreto');
 const startStudies=page.locator('.study-resume a.primary');
 if((await startStudies.innerText()).trim()!=='COMEÇAR ESTUDOS')throw Error('Botão de estudos com nome incorreto');
 if(await startStudies.getAttribute('href')!=='#fundamentos-basicos')throw Error('Botão não abre fundamentos básicos');
 await startStudies.click();
 await page.locator('main.fundamentos-basicos .fb-topics .fb-card').first().waitFor();
 if(await page.locator('main.fundamentos-basicos article.fb-card').count()!==7)throw Error('Fundamentos básicos precisa de sete blocos inéditos');
 if(await page.locator('main.fundamentos-basicos .fb-formula').count()<7)throw Error('Fórmulas físicas não renderizadas');
 await page.locator('[data-fb-value]').fill('2');
 await page.locator('[data-fb-from]').selectOption('bar');
 const pressureConversionText=await page.locator('[data-fb-results]').innerText();
 if(!pressureConversionText.includes('200'))throw Error('Conversor de 2 bar para 200 kPa falhou');
 if(await page.locator('main.fundamentos-basicos .lesson-body,main.fundamentos-basicos .quiz').count())throw Error('Conteúdo da aula anterior ainda está visível no botão');
 await page.locator('main.fundamentos-basicos a.back[href="#home"]').click();
 await page.locator('.study-resume').waitFor();
 if(await page.locator('.study-stage').count()!==6)throw Error('Home precisa de seis cards');
 const homeCards=await page.locator('.study-stage .stage-copy strong').allTextContents();
 if(JSON.stringify(homeCards.map(x=>x.trim()))!==JSON.stringify(['Fisiologia','Clínica','Câmara','Operação','Indicações e Protocolos','Em Foco']))throw Error('Ordem dos seis cards da Home incorreta: '+JSON.stringify(homeCards));
 if(await page.locator('.study-stage .stage-description').count()!==6)throw Error('Descrições dos cards grandes não restauradas');
 const stageMetrics=await page.locator('.study-stage').evaluateAll(els=>els.map(el=>({height:el.getBoundingClientRect().height,border:getComputedStyle(el).borderColor})));
 if(stageMetrics.some(el=>el.height<125||el.border!=='rgb(133, 117, 87)'))throw Error('Template dos cards grandes ou cor de borda incorretos: '+JSON.stringify(stageMetrics));
 if(await page.locator('#oxygenna-em-foco-card').count()!==0)throw Error('O card grande Em Foco ainda aparece abaixo de Ver todos os capítulos');
 await page.locator('.study-stage[href="#indications"]').click();
 await page.locator('main .clinical-catalog').waitFor();
 if(!page.url().endsWith('#indications'))throw Error('Card de Indicações e Protocolos não abre a área clínica');
 await page.locator('a[href="#home"].brand').click();
 await page.locator('.study-stage[href="#focus"]').click();
 await page.locator('a[href="#focus/esporte"]').first().waitFor();
 if(!page.url().endsWith('#focus'))throw Error('Card Em Foco não abre os temas de foco');
 await page.locator('a[href="#home"].brand').click();
 await page.locator('.study-stage').first().waitFor();
 // Os créditos da Home ficam depois dos cards, não flutuando sobre eles.
 const homeBase=page.locator('main.home > .oxygenna-section-base');
 if(await homeBase.count()!==1)throw Error('Home sem faixa inferior de três colunas');
 if((await homeBase.locator('.oxygenna-section-base-left').innerText()).trim()!=='PAPOS DE ALTITUDE')throw Error('Crédito PAPOS DE ALTITUDE ausente na Home');
 if((await homeBase.locator('.oxygenna-section-base-right').innerText()).trim()!=='PH4 DEV & HEALTH')throw Error('Crédito PH4 DEV & HEALTH ausente na Home');
 if(await homeBase.locator('img.oxygenna-section-base-logo').count()!==1)throw Error('Logotipo central ausente na Home');
 const homeBaseLayout=await page.evaluate(()=>{
  const base=document.querySelector('main.home > .oxygenna-section-base');
  const button=document.querySelector('main.home .chapter-cta');
  return {position:getComputedStyle(base).position,afterCards:base.getBoundingClientRect().top>button.getBoundingClientRect().bottom};
 });
 if(homeBaseLayout.position!=='relative'||!homeBaseLayout.afterCards)throw Error('Faixa da Home fora da base: '+JSON.stringify(homeBaseLayout));
 // Aguarda a conclusão da renderização após retornar da página de fundamentos.
 await page.waitForFunction(()=>{
  const el=document.querySelector('.bottom-nav a.active');
  if(!el?.isConnected||!el.querySelector('svg'))return false;
  const c=getComputedStyle(el),svg=getComputedStyle(el.querySelector('svg'));
  return c.color==='rgb(133, 117, 87)'&&svg.color==='rgb(133, 117, 87)'&&c.backgroundColor==='rgba(0, 0, 0, 0)'&&c.boxShadow==='none';
 },{timeout:10000});
 if(await page.locator('.brand-logo').count()!==1)throw Error('Logotipo não preservado');
 const styles=await page.evaluate(()=>({header:getComputedStyle(document.querySelector('.app-header')).position,footer:getComputedStyle(document.querySelector('.bottom-nav')).position,font:getComputedStyle(document.body).fontFamily}));
 if(styles.header!=='fixed'||styles.footer!=='fixed')throw Error('Header/footer originais deixaram de ser fixos: '+JSON.stringify(styles));
 for (const route of ['fisiologia','clinica','camara','operacao']) {
  await page.locator('.bottom-nav a[href$="/'+route+'"]').click();
  await page.locator('main.oxygenna-blank-page .oxygenna-section-base').waitFor();
  if(!page.url().endsWith('/'+route))throw Error('Rota '+route+' não abriu');
  if(JSON.stringify(await getFooter())!==JSON.stringify(expectedFooter))throw Error('Rodapé alterado em '+route);
  const selected=await page.locator('.bottom-nav a.active').evaluate(el=>{
   const a=getComputedStyle(el),svg=getComputedStyle(el.querySelector('svg'));
   return {color:a.color,icon:svg.color,bg:a.backgroundColor,shadow:a.boxShadow};
  });
  if(selected.color!=='rgb(133, 117, 87)'||selected.icon!=='rgb(133, 117, 87)'||selected.bg!=='rgba(0, 0, 0, 0)'||selected.shadow!=='none')throw Error('Destaque dourado sem fundo falhou em '+route+': '+JSON.stringify(selected));
  const expectedChildren=route==='fisiologia'?2:1;
  if(await page.locator('main.oxygenna-blank-page > *').count()!==expectedChildren)throw Error('Estrutura inesperada em '+route);
  if(route==='fisiologia'){
   const figure=page.locator('main.oxygenna-blank-page > .oxygenna-fisiologia-presentation');
   await figure.waitFor();
   const props=await figure.evaluate(el=>{
     const im=el.querySelector('img'),cs=getComputedStyle(el),imageStyle=getComputedStyle(im),r=el.getBoundingClientRect();
     return {src:im.getAttribute('src'),loaded:im.complete&&im.naturalWidth>0,width:im.naturalWidth,border:cs.borderColor,borderWidth:cs.borderTopWidth,shadow:cs.boxShadow,overflow:cs.overflow,imageBorder:imageStyle.borderTopWidth,imageShadow:imageStyle.boxShadow,figureWidth:r.width,viewport:window.innerWidth};
   });
   if(!props.loaded||!props.src.includes('fisiologia-camara-apresentacao.webp'))throw Error('Imagem aprovada não carregou: '+JSON.stringify(props));
   if(props.border!=='rgb(133, 117, 87)'||props.borderWidth!=='1px'||props.imageBorder!=='0px'||props.shadow!=='none'||props.imageShadow!=='none'||props.overflow!=='hidden'||props.figureWidth>props.viewport)throw Error('Sombra, transbordamento ou borda dupla: '+JSON.stringify(props));
  }else if(await page.locator('main.oxygenna-blank-page .oxygenna-fisiologia-presentation').count()){
   throw Error('Imagem de Fisiologia apareceu em '+route);
  }
  if(await page.locator('main.oxygenna-blank-page h1,main.oxygenna-blank-page h2,main.oxygenna-blank-page .lesson-link,main.oxygenna-blank-page .panel,main.oxygenna-blank-page .home-card').count())throw Error('Página '+route+' não está em branco');
  const signature=page.locator('.oxygenna-section-base');
  if((await signature.locator('.oxygenna-section-base-left').innerText()).trim()!=='PAPOS DE ALTITUDE')throw Error('Coluna esquerda incorreta');
  if((await signature.locator('.oxygenna-section-base-right').innerText()).trim()!=='PH4 DEV & HEALTH')throw Error('Coluna direita incorreta');
  if(await signature.locator('img.oxygenna-section-base-logo[alt="OXYGENNA"]').count()!==1)throw Error('Logotipo central ausente');
  const metrics=await page.evaluate(()=>{
   const strip=document.querySelector('.oxygenna-section-base').getBoundingClientRect();
   const foot=document.querySelector('.bottom-nav').getBoundingClientRect();
   const children=[...document.querySelector('.oxygenna-section-base').children].map(el=>el.getBoundingClientRect());
   return {stripBottom:strip.bottom,footerTop:foot.top,centers:children.map(r=>r.left+r.width/2),header:getComputedStyle(document.querySelector('.app-header')).position};
  });
  if(metrics.stripBottom>=metrics.footerTop-5)throw Error('Créditos encobertos pelo rodapé: '+JSON.stringify(metrics));
  if(!(metrics.centers[0]<metrics.centers[1]&&metrics.centers[1]<metrics.centers[2]))throw Error('Colunas fora de ordem');
  if(metrics.header!=='fixed')throw Error('Cabeçalho perdeu posição fixa');
 }
 await page.locator('.bottom-nav a[href$="/home"]').click();
 await page.locator('.study-map').waitFor();
 if(await page.locator('.home-title').innerText()!=='Ciência sob pressão.')throw Error('HOME original não foi preservada');
 // As rotas internas continuam tecnicamente disponíveis, embora não listadas nas quatro telas vazias.
 await page.evaluate(()=>{
  history.pushState(null,'','/oxygenna/capitulo/dcs-tipo2');
  window.dispatchEvent(new PopStateEvent('popstate'));
 });
 if(!page.url().endsWith('/capitulo/dcs-tipo2'))throw Error('URL capítulo incorreta: '+page.url());
 if(await page.locator('main section.panel').count()!==7)throw Error('DCS2 sem sete painéis');
 if(await page.locator('.bottom-nav a').count()!==3)throw Error('Rodapé do capítulo não tem três ações');
 if(await page.locator('[data-consulta-quiz]').count()!==3)throw Error('Quiz de revisão não contém três perguntas');
 await page.locator('[data-consulta-answer="0"][data-consulta-question="0"]').click();
 if(await page.locator('.feedback').count()<1)throw Error('Sem feedback da questão');
 await page.locator('[data-consulta-favorite]').click();
 if(!await page.locator('.bottom-nav').innerText().then(t=>t.includes('FAVORITADO')))throw Error('Favorito não funciona');
 const result={url:page.url(),styles,blankPages:['fisiologia','clinica','camara','operacao'],chapters:32,blocks:7,questions:3,errors};
 console.log('BROWSER_MOBILE_OK',JSON.stringify(result));
 if(errors.length)throw Error('Erros de execução: '+errors.join('; '));
}finally{await browser.close();await new Promise(done=>app.close(done));}
