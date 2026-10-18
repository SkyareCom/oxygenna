import test from 'node:test';
import assert from 'node:assert/strict';
import {consultaCapitulos,renderConsultaHome,searchOxygennaGlobal,renderConsultaSearch} from '../dist/consulta/consulta-view.mjs';

test('Home mantém busca global acima do slogan e imagem, sem card de busca',()=>{
 const html=renderConsultaHome({illustration:'<div class="imagem-preservada"></div>'});
 const search=html.indexOf('class="consulta-global-search"');
 const title=html.indexOf('SEU APP DE DECISÕES CLÍNICAS');
 const subtitle=html.indexOf('EM MEDICINA HIPERBÁRICA');
 const image=html.indexOf('imagem-preservada');
 assert.ok(search>=0&&title>search&&subtitle>title&&image>subtitle);
 assert.match(html,/data-consulta-busca/);
 assert.doesNotMatch(html,/<section class="panel"><label class="lab-label" for="busca-oxygenna"/);
 assert.doesNotMatch(html,/CONTINUAR ESTUDANDO|study-resume|ABRIR CAPÍTULO/);
});

test('Busca global cobre decisões clínicas, módulos e temas, sem distinção de acento',()=>{
 const first=consultaCapitulos[0];
 assert.ok(searchOxygennaGlobal(first.titulo_curto).some(x=>x.kind==='decisao'&&x.href.includes(first.id)));
 assert.ok(searchOxygennaGlobal('o campo hiperbarico').some(x=>x.kind==='modulo'&&x.href==='#module/01'));
 assert.ok(searchOxygennaGlobal('historia e desenvolvimento').some(x=>x.kind==='tema'&&x.href==='#topic/01/0'));
 assert.deepEqual(searchOxygennaGlobal(''),[]);
 assert.match(renderConsultaSearch('historia e desenvolvimento'),/#topic\/01\/0/);
});
