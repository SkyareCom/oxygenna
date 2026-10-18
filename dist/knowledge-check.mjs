/* Avaliações da seção CÂMARA: um único card ao fim de cada capítulo, sem exercícios dispersos. */
const questions={
 '01':[
  ['Qual é a diferença fundamental entre estar em câmara e realizar OHB?',['São sinônimos','OHB associa pressão e inalação de O₂ sob indicação médica','Apenas o tamanho da câmara'],'1','Pressão ambiente e gás inspirado são variáveis diferentes.'],
  ['PIO₂ e PaO₂ expressam a mesma medida?',['Sim, em 100% de FiO₂','Não, a primeira é inspirada e a segunda é arterial','Sim, em qualquer pressão'],'1','A troca gasosa e a perfusão modificam a PaO₂.'],
  ['Uma câmara multiplace geralmente permite:',['Somente um ocupante','Vários ocupantes, dependendo do equipamento','Ausência de acompanhamento'],'1','A configuração multiplace admite vários ocupantes; os sistemas de administração do oxigênio variam.'],
  ['O que fazer diante de dor auricular progressiva durante compressão?',['Ignorar e aguardar','Informar imediatamente a equipe','Aumentar a pressão rapidamente'],'1','O sintoma deve ser comunicado e avaliado pela equipe.']
 ],
 '02':[
  ['Qual pressão é usada na lei de Boyle?',['Apenas a manométrica','A absoluta','A pressão arterial'],'1','Boyle relaciona pressão absoluta e volume em condições definidas.'],
  ['Em um gás ideal isotérmico, passar de 1 para 2 ATA resulta em:',['Dobro do volume','Metade do volume','Volume inalterado'],'1','P₁V₁ = P₂V₂, mantendo temperatura e quantidade constantes.'],
  ['Qual conversão aproximada é correta?',['1 ATA ≈ 101,325 kPa','1 ATA ≈ 10 kPa','1 ATA ≈ 1.000 kPa'],'0','Uma atmosfera padrão corresponde a 101,325 kPa.']
 ],
 '03':[
  ['Qual lei relaciona pressão parcial e fração gasosa?',['Boyle','Dalton','Charles'],'1','Dalton explica a contribuição dos gases em uma mistura.'],
  ['Por que o cálculo deve usar kelvin?',['Porque temperatura absoluta é exigida','Porque evita medir pressão','Porque kelvin mede volume'],'0','As proporcionalidades entre gases usam temperatura absoluta.'],
  ['As leis ideais substituem a avaliação fisiológica?',['Sim','Não','Somente em 100% de O₂'],'1','São modelos físicos que precisam de interpretação clínica.']
 ],
 '04':[
  ['Qual é o principal transportador de O₂ no sangue em condições habituais?',['Hemoglobina','Plasma isoladamente','Plaquetas'],'0','A hemoglobina transporta a maior parte do oxigênio.'],
  ['O aumento de PIO₂ garante oxigenação tecidual?',['Sim','Não, perfusão e troca gasosa também importam','Somente por 24 horas'],'1','A oferta tecidual depende também do fluxo sanguíneo e do metabolismo.'],
  ['A OHB aumenta especialmente qual fração de O₂ no sangue?',['Fração dissolvida no plasma','Quantidade de glóbulos brancos','Volume total de sangue'],'0','A pressão parcial elevada aumenta o oxigênio fisicamente dissolvido.']
 ],
 '05':[
  ['Um mecanismo celular observado demonstra sozinho benefício clínico?',['Sim','Não, são necessários desfechos clínicos relevantes','Sempre que houver mais O₂'],'1','Mudanças moleculares não substituem a evidência clínica.'],
  ['O excesso de exposição ao oxigênio pode causar:',['Somente benefícios','Toxicidade, conforme exposição e condições','Aumento automático de perfusão'],'1','A segurança depende de dose, tempo e condição clínica.'],
  ['A OHB substitui a revascularização quando há obstrução?',['Sim','Não','Se a pressão for maior'],'1','A oferta de oxigênio não corrige, por si só, a obstrução vascular.']
 ],
 '06':[
  ['Por que controlar rigorosamente materiais dentro da câmara?',['Pela maior preocupação com incêndio','Apenas por estética','Porque gases não são inflamáveis'],'0','O oxigênio pode intensificar combustão, exigindo protocolos rigorosos.'],
  ['Uma dor progressiva durante a sessão deve ser:',['Desconsiderada','Comunicada e avaliada','Resolvida aumentando a pressão'],'1','A equipe deve avaliar sintomas durante qualquer fase.'],
  ['O checklist substitui treinamento e manutenção?',['Sim','Não','Somente em câmaras individuais'],'1','Segurança exige barreiras complementares e verificáveis.']
 ]
};
export const knowledgeQuestions=Object.freeze(Object.fromEntries(Object.entries(questions).map(([id,a])=>[id,a.map(([question,options,index,detail])=>({question,options,correct:Number(index),detail}))])));
const headings={pt:['TESTE O CONHECIMENTO','Questões de revisão · selecione uma resposta','Acertos'],en:['CHECK YOUR KNOWLEDGE','Review questions · choose an answer','Correct'],es:['PON A PRUEBA TUS CONOCIMIENTOS','Preguntas de repaso · selecciona una respuesta','Aciertos']};
export function renderKnowledgeCheck(chapterId,{lang='pt',e}={}){
 const data=knowledgeQuestions[chapterId];if(!data?.length)return '';
 e=e??(s=>String(s));const label=headings[lang]??headings.pt;
 return '<details class="knowledge-check" data-knowledge-chapter="'+chapterId+'">'+
 '<summary><span class="knowledge-check-head"><strong>'+e(label[0])+'</strong><small>'+data.length+' '+e(label[1])+'</small></span><span class="knowledge-arrow" aria-hidden="true">›</span></summary>'+
 '<div class="knowledge-check-body"><p class="knowledge-score" aria-live="polite">'+e(label[2])+': <output data-knowledge-score>0 / '+data.length+'</output></p>'+
 data.map((q,i)=>'<fieldset class="knowledge-question" data-knowledge-index="'+i+'"><legend lang="pt-BR"><span class="knowledge-question-number">'+String(i+1).padStart(2,'0')+'</span> '+e(q.question)+'</legend>'+
 q.options.map((option,k)=>'<button type="button" data-knowledge-choice="'+k+'" aria-pressed="false" lang="pt-BR"><b>'+String.fromCharCode(65+k)+'</b><span>'+e(option)+'</span></button>').join('')+
 '<p class="knowledge-feedback" role="status" aria-live="polite"></p></fieldset>').join('')+
 '</div></details>';
}
export function handleKnowledgeClick(target){
 const btn=target?.closest?.('button[data-knowledge-choice]');if(!btn)return false;
 const root=btn.closest('[data-knowledge-chapter]'),field=btn.closest('[data-knowledge-index]');
 if(!root||!field)return false;
 const chapter=root.dataset.knowledgeChapter,i=Number(field.dataset.knowledgeIndex),n=Number(btn.dataset.knowledgeChoice);
 const data=knowledgeQuestions[chapter]?.[i];if(!data||!Number.isInteger(n)||n<0||n>=data.options.length)return false;
 field.querySelectorAll('button[data-knowledge-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
 const correct=n===data.correct;
 const feedback=field.querySelector('.knowledge-feedback');feedback.textContent=(correct?'Correto. ':'Revise. ')+data.detail;
 feedback.dataset.correct=String(correct);field.dataset.knowledgeCorrect=String(correct);
 const scores=Array.from(root.querySelectorAll('[data-knowledge-index]')).filter(f=>f.dataset.knowledgeCorrect==='true').length;
 root.querySelector('[data-knowledge-score]').textContent=scores+' / '+knowledgeQuestions[chapter].length;
 return true;
}
