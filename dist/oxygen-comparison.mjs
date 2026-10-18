/* Duas tabelas objetivas. Não usar os gráficos estáticos impressos nas imagens. */
export function renderOxygenComparison({e}){
 const rows=[
  {title:'CONDIÇÕES DE ADMINISTRAÇÃO',items:[
   ['Pressão ambiente','Atmosférica local (aprox. 1 ATA ao nível do mar)','Acima da atmosférica, com pressão controlada'],
   ['Oxigênio inspirado','Ar ambiente (~21%) ou oxigenoterapia, conforme prescrição','Habitualmente O₂ a 100% no circuito respiratório prescrito'],
   ['Ambiente de cuidado','Sem necessidade de câmara pressurizada','Câmara e protocolos de segurança específicos']
  ]},
  {title:'RESPOSTA FISIOLÓGICA',items:[
   ['Pressão parcial inspirada','Depende de FiO₂ e pressão atmosférica','Aumenta com FiO₂ e pressão absoluta'],
   ['O₂ dissolvido no plasma','Fração relativamente pequena','Aumenta de forma significativa sob condições adequadas'],
   ['Eficácia clínica','Depende de ventilação, perfusão e causa do problema','Também exige indicação, perfusão e evidências de benefício']
  ]}
 ];
 return '<div class="oxygen-comparison">'+rows.map(t=>'<section class="oxygen-table-block"><h3>'+e(t.title)+'</h3><div class="oxygen-table-scroll"><table><thead><tr><th scope="col">Aspecto</th><th scope="col">Normobárico</th><th scope="col">Hiperbárico</th></tr></thead><tbody>'+t.items.map(r=>'<tr><th scope="row">'+e(r[0])+'</th><td>'+e(r[1])+'</td><td>'+e(r[2])+'</td></tr>').join('')+'</tbody></table></div></section>').join('')+'<p class="oxygen-note">Comparação didática: PIO₂ não equivale à PaO₂; as condições dependem do equipamento e da prescrição.</p></div>';
}
