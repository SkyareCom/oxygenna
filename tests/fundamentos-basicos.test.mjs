import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PRESSURE_TO_KPA,convertPressure,fundamentalsContent,renderFundamentosBasicos,handleFundamentosConversion} from '../dist/fundamentos-basicos.mjs';

const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const css=readFileSync(new URL('../dist/fundamentos-basicos.css',import.meta.url),'utf8');

test('Botão da Home abandona aula antiga e abre fundamentos físicos exclusivos',()=>{
 assert.ok(app.includes("primary(e(copy.action),'#fundamentos-basicos')"));
 assert.ok(!app.includes("primary(e(copy.action),next?lessonHref"));
 assert.ok(app.includes("section==='fundamentos-basicos'"));
 assert.ok(app.includes("renderFundamentosBasicos(state.lang,icon,back,e)"));
 assert.ok(html.includes('fundamentos-basicos.css?rev=depth-ruler-20261019'));
 assert.ok(html.includes('app.mjs?rev=photo-atm-central-refs-20261019'));
 assert.ok(css.includes('border: 1px solid #857557'));
 assert.ok(!css.includes('box-shadow:0'));
});

test('Conteúdo novo traz sete blocos completos com unidades, tabelas, fórmulas, exemplos e retorno',()=>{
 const content=renderFundamentosBasicos('pt',()=>'',href=>'<a class="back" href="'+href+'">Voltar</a>');
 assert.equal((content.match(/class="panel fb-card"/g)||[]).length,7);
 for(const word of ['FUNDAMENTOS BÁSICOS','Grandezas e medidas','Pressão e referências','Conversões de pressão','temperatura','Leis físicas dos gases','Aplicações resolvidas','Checagem dimensional','Boyle–Mariotte','Gay-Lussac','Dalton','Henry','PV = nRT','kPa','mmHg','psi','°C' ,'Fahrenheit'])assert.ok(content.includes(word),word);
 assert.match(content,/href="#home"/);
 assert.match(content,/class="panel fb-card fb-converter"/);
 assert.match(content,/data-fb-value/);
 assert.match(content,/data-fb-from/);
 assert.doesNotMatch(content,/Uma pressão, várias unidades|Próxima aula disponível|<fieldset class="quiz">/);
});

test('Textos completos de todas as seções nos três idiomas',()=>{
 for(const lang of ['pt','en','es']){
  const page=renderFundamentosBasicos(lang,()=>'',()=>'<a class="back"></a>');
  assert.equal(fundamentalsContent[lang].items.length,7,lang);
  assert.equal((page.match(/class="panel fb-card"/g)||[]).length,7,lang);
  assert.equal((page.match(/class="fb-equation"/g)||[]).length,6,lang);
  assert.ok(page.includes(fundamentalsContent[lang].title),lang);
 }
});

test('Conversão dimensional e fatores oficiais, incluindo 2 ATA, psi e mmHg',()=>{
 assert.equal(PRESSURE_TO_KPA.ATA,101.325);
 assert.equal(convertPressure(2,'ATA','kPa'),202.65);
 assert.equal(convertPressure(2,'bar','kPa'),200);
 assert.ok(Math.abs(convertPressure(1,'atm','mmHg')-760)<1e-10);
 assert.ok(Math.abs(convertPressure(101.325,'kPa','psi')-14.69595)<0.001);
 assert.equal(convertPressure(-1,'ATA','bar'),null);
 assert.equal(convertPressure(Infinity,'ATA','bar'),null);
 assert.equal(convertPressure(1,'wrong','bar'),null);
});

test('Conversor interativo atualiza texto acessível e recusa valores inválidos',()=>{
 const output={innerHTML:'',textContent:''};
 const num={value:'2'},unit={value:'bar'};
 const root={querySelector:q=>({'[data-fb-results]':output,'[data-fb-value]':num,'[data-fb-from]':unit})[q]??null};
 const target={matches:q=>q==='[data-fb-value],[data-fb-from]',closest:q=>q==='.fb-converter'?root:null};
 assert.equal(handleFundamentosConversion(target,'pt'),true);
 assert.ok(output.innerHTML.includes('200'),output.innerHTML);
 num.value='-2';
 handleFundamentosConversion(target,'pt');
 assert.match(output.textContent,/igual ou superior a zero/);
 num.value='';
 handleFundamentosConversion(target,'en');
 assert.match(output.textContent,/greater than or equal to zero/);
 assert.equal(handleFundamentosConversion({matches:()=>false},'pt'),false);
});
