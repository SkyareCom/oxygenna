import {renderPhysicsActivities} from './fundamentos-interativos.mjs?rev=depth-ruler-20261019';
// FUNDAMENTOS BÁSICOS — conteúdo novo e autônomo, sem reutilizar a aula antiga do botão da Home.
// Unidades e relações seguem o SI, com modelos ideais usados somente para fins educativos.
export const PRESSURE_TO_KPA=Object.freeze({
  ATA:101.325,atm:101.325,kPa:1,hPa:0.1,bar:100,mmHg:101.325/760,psi:6.894757293168
});
export function convertPressure(value,from,to){
 const v=Number(value);
 if(!Number.isFinite(v)||v<0||!Object.hasOwn(PRESSURE_TO_KPA,from)||!Object.hasOwn(PRESSURE_TO_KPA,to))return null;
 return v*PRESSURE_TO_KPA[from]/PRESSURE_TO_KPA[to];
}
const copy={
 pt:{
  tag:'CONTEÚDO EXTRA',title:'FUNDAMENTOS BÁSICOS',intro:'A física por trás da pressão, dos gases e das unidades utilizadas na medicina hiperbárica.',
  items:[
   {title:'01 · Grandezas e medidas',body:'Uma grandeza é uma propriedade mensurável. Valor numérico e unidade devem aparecer juntos: 200 kPa é uma pressão; 200, isoladamente, não identifica uma medida.',rows:[['Comprimento','metro (m)'],['Massa','quilograma (kg)'],['Tempo','segundo (s)'],['Temperatura termodinâmica','kelvin (K)'],['Quantidade de matéria','mol (mol)'],['Volume','metro cúbico (m³); também L e mL'],['Pressão','pascal (Pa), equivalente a N/m²']],note:'Prefixos usuais: kilo (k) = 10³; hecto (h) = 10²; centi (c) = 10⁻²; mili (m) = 10⁻³; micro (µ) = 10⁻⁶.'},
   {title:'02 · Pressão e referências',body:'Pressão é força por unidade de área. Em uma câmara, distinguir pressão absoluta de pressão manométrica é essencial para interpretar medições.',formula:'P = F / A',example:'P absoluta = P atmosférica local + P manométrica. Sob uma atmosfera padrão, 2 ATA correspondem a 202,65 kPa absolutos e cerca de 101,325 kPa manométricos.',note:'ATA significa atmosfera absoluta na linguagem hiperbárica. Aqui, 1 ATA é usado como 1 atmosfera padrão (101,325 kPa). A pressão atmosférica real varia com altitude e meteorologia.'},
   {title:'03 · Conversões de pressão',body:'Valores equivalentes para uma mesma pressão absoluta padrão.',rows:[['1 atm = 1 ATA','101,325 kPa'],['1 atm','1.013,25 hPa'],['1 atm','1,01325 bar'],['1 atm','760 mmHg'],['1 atm','aprox. 14,696 psi']],note:'Para converter entre unidades, primeiro represente a pressão em kPa e depois divida pelo fator da unidade de destino. mmHg e psi apresentados com arredondamento.'},
   {title:'04 · Comprimento, volume e temperatura',body:'Conversões frequentemente encontradas em instrumentos, documentação técnica e cálculos.',rows:[['1 m','100 cm = 1.000 mm'],['1 km','1.000 m'],['1 L','1.000 mL = 0,001 m³'],['1 m³','1.000 L'],['Kelvin','K = °C + 273,15'],['Celsius','°C = K − 273,15'],['Fahrenheit','°F = 1,8 × °C + 32']],note:'Nas leis dos gases, a temperatura deve ser absoluta (kelvin), nunca inserida diretamente em graus Celsius.'},
   {title:'05 · Leis físicas dos gases',body:'As relações abaixo descrevem modelos de gás ideal. Cada fórmula exige condições específicas; não substituem avaliação clínica ou cálculos de equipamento.',formulas:[
     ['Boyle–Mariotte','P₁V₁ = P₂V₂','Temperatura e quantidade de gás constantes. Pressões absolutas.'],
     ['Charles','V₁/T₁ = V₂/T₂','Pressão e quantidade de gás constantes; T em K.'],
     ['Gay-Lussac','P₁/T₁ = P₂/T₂','Volume e quantidade de gás constantes; T em K.'],
     ['Dalton','pᵢ = Fᵢ × P total','Mistura ideal seca: pressão parcial = fração molar × pressão absoluta.'],
     ['Henry','C = kH × p','Solubilidade proporcional à pressão parcial, para gás, solvente e temperatura definidos.'],
     ['Gás ideal','PV = nRT','P absoluta, V em m³, T em K e R ≈ 8,314 J/(mol·K).']
   ],note:'Para gases umidificados, a pressão de vapor da água deve ser considerada antes de calcular pressões parciais. Pressão inspirada, alveolar e arterial não são equivalentes.'},
   {title:'06 · Aplicações resolvidas',body:'Exemplos matemáticos com valores arredondados, exclusivamente para compreender as relações físicas.',rows:[['2 ATA em kPa','2 × 101,325 = 202,65 kPa absolutos'],['Compressão isotérmica','1 L a 1 ATA → 0,5 L a 2 ATA (Boyle)'],['Ar seco a 2 ATA','pO₂ ≈ 0,21 × 202,65 = 42,56 kPa (Dalton)'],['37 °C em K','37 + 273,15 = 310,15 K'],['2 bar em kPa','2 × 100 = 200 kPa']],note:'Exemplos didáticos: não definem parâmetros de oxigenoterapia, perfis de descompressão ou limites operacionais.'},
   {title:'07 · Checagem dimensional',body:'Antes de aplicar uma fórmula, identifique a grandeza procurada, converta as unidades para um sistema coerente e confirme a dimensão da resposta.',rows:[['P = F/A','N/m² = Pa'],['PV = nRT','Pa·m³ = J'],['Densidade ρ = m/V','kg/m³'],['Pressão hidrostática','ΔP = ρ g h (Pa)']],note:'Na expressão ΔP = ρgh, ρ é a densidade do fluido, g é a gravidade e h é a profundidade vertical. Não use a regra aproximada de 10 m de água do mar = 1 atm para obter precisão clínica.'}
  ],
  converter:'CONVERSOR DE PRESSÃO',converterHelp:'Informe uma pressão absoluta não negativa e selecione a unidade de origem.',value:'Valor',unit:'Unidade',results:'Equivalências',invalid:'Informe um número válido, igual ou superior a zero.',reference:'Referências fundamentais: SI (BIPM), unidades e constantes (NIST).'
 },
 en:{
  tag:'ADDITIONAL CONTENT',title:'BASIC FUNDAMENTALS',intro:'The physics behind pressure, gases and measurement units used in hyperbaric medicine.',
  items:[
   {title:'01 · Quantities and measurement',body:'A measured quantity needs a numeric value and a unit. 200 kPa is a pressure; 200 alone does not specify a measurement.',rows:[['Length','metre (m)'],['Mass','kilogram (kg)'],['Time','second (s)'],['Thermodynamic temperature','kelvin (K)'],['Amount of substance','mole (mol)'],['Volume','cubic metre (m³); also L and mL'],['Pressure','pascal (Pa), equivalent to N/m²']],note:'Prefixes: kilo (k) = 10³; hecto (h) = 10²; centi (c) = 10⁻²; milli (m) = 10⁻³; micro (µ) = 10⁻⁶.'},
   {title:'02 · Pressure and reference levels',body:'Pressure is force per unit area. Distinguishing absolute from gauge pressure is essential for interpreting chamber measurements.',formula:'P = F / A',example:'Absolute pressure = local atmospheric pressure + gauge pressure. At standard atmospheric pressure, 2 ATA equal 202.65 kPa absolute and approximately 101.325 kPa gauge.',note:'ATA denotes absolute atmospheres in hyperbaric practice. Here 1 ATA is one standard atmosphere (101.325 kPa). Actual local atmospheric pressure varies.'},
   {title:'03 · Pressure conversions',body:'Equivalent measures of the same standard absolute pressure.',rows:[['1 atm = 1 ATA','101.325 kPa'],['1 atm','1,013.25 hPa'],['1 atm','1.01325 bar'],['1 atm','760 mmHg'],['1 atm','approximately 14.696 psi']],note:'Convert through kPa: multiply by the source unit factor, then divide by the target unit factor. mmHg and psi values are rounded.'},
   {title:'04 · Length, volume and temperature',body:'Common conversions for instruments and physical calculations.',rows:[['1 m','100 cm = 1,000 mm'],['1 km','1,000 m'],['1 L','1,000 mL = 0.001 m³'],['1 m³','1,000 L'],['Kelvin','K = °C + 273.15'],['Celsius','°C = K − 273.15'],['Fahrenheit','°F = 1.8 × °C + 32']],note:'Gas laws require absolute temperature (kelvin), not unconverted Celsius values.'},
   {title:'05 · Gas laws',body:'These equations assume ideal-gas behavior and their stated constraints; they are not medical treatment or equipment instructions.',formulas:[
    ['Boyle–Mariotte','P₁V₁ = P₂V₂','Constant temperature and amount of gas; absolute pressure.'],
    ['Charles','V₁/T₁ = V₂/T₂','Constant pressure and amount; T in kelvin.'],
    ['Gay-Lussac','P₁/T₁ = P₂/T₂','Constant volume and amount; T in kelvin.'],
    ['Dalton','pᵢ = Fᵢ × P total','Ideal dry mixture: partial pressure = mole fraction × absolute pressure.'],
    ['Henry','C = kH × p','Solubility proportional to partial pressure for a specified gas, liquid and temperature.'],
    ['Ideal gas','PV = nRT','Absolute P, V in m³, T in K; R ≈ 8.314 J/(mol·K).']
   ],note:'Humidified mixtures require accounting for water-vapor pressure. Inspired, alveolar and arterial pressures are different quantities.'},
   {title:'06 · Worked examples',body:'Rounded numerical examples for understanding physical laws only.',rows:[['2 ATA in kPa','2 × 101.325 = 202.65 kPa absolute'],['Isothermal compression','1 L at 1 ATA → 0.5 L at 2 ATA (Boyle)'],['Dry air at 2 ATA','pO₂ ≈ 0.21 × 202.65 = 42.56 kPa'],['37 °C in K','37 + 273.15 = 310.15 K'],['2 bar in kPa','2 × 100 = 200 kPa']],note:'Examples do not define oxygen therapy pressures, decompression schedules or operational limits.'},
   {title:'07 · Dimensional checks',body:'Before calculating, identify the target quantity, convert units consistently and check the result’s dimension.',rows:[['P = F/A','N/m² = Pa'],['PV = nRT','Pa·m³ = J'],['Density ρ = m/V','kg/m³'],['Hydrostatic pressure','ΔP = ρ g h (Pa)']],note:'In ΔP = ρgh, ρ is fluid density, g gravity and h vertical depth. The 10 m seawater ≈ 1 atm rule is approximate only.'}
  ],
  converter:'PRESSURE CONVERTER',converterHelp:'Enter a non-negative absolute pressure and select the starting unit.',value:'Value',unit:'Unit',results:'Equivalent values',invalid:'Enter a valid number greater than or equal to zero.',reference:'Fundamental references: SI (BIPM), units and constants (NIST).'
 },
 es:{
  tag:'CONTENIDO EXTRA',title:'FUNDAMENTOS BÁSICOS',intro:'La física de la presión, los gases y las unidades de medida utilizadas en medicina hiperbárica.',
  items:[
   {title:'01 · Magnitudes y medidas',body:'Toda magnitud medida necesita un valor numérico y una unidad. 200 kPa es una presión; 200 aislado no identifica una medida.',rows:[['Longitud','metro (m)'],['Masa','kilogramo (kg)'],['Tiempo','segundo (s)'],['Temperatura termodinámica','kelvin (K)'],['Cantidad de sustancia','mol (mol)'],['Volumen','metro cúbico (m³); también L y mL'],['Presión','pascal (Pa), equivalente a N/m²']],note:'Prefijos: kilo (k) = 10³; hecto (h) = 10²; centi (c) = 10⁻²; mili (m) = 10⁻³; micro (µ) = 10⁻⁶.'},
   {title:'02 · Presión y referencias',body:'La presión es fuerza por unidad de área. Es esencial distinguir la presión absoluta de la manométrica al interpretar mediciones.',formula:'P = F / A',example:'Presión absoluta = presión atmosférica local + presión manométrica. A presión atmosférica estándar, 2 ATA equivalen a 202,65 kPa absolutos y aproximadamente 101,325 kPa manométricos.',note:'ATA designa atmósferas absolutas en medicina hiperbárica. Aquí 1 ATA equivale a una atmósfera estándar (101,325 kPa). La presión local varía.'},
   {title:'03 · Conversiones de presión',body:'Valores equivalentes para la misma presión absoluta estándar.',rows:[['1 atm = 1 ATA','101,325 kPa'],['1 atm','1.013,25 hPa'],['1 atm','1,01325 bar'],['1 atm','760 mmHg'],['1 atm','aprox. 14,696 psi']],note:'Convierta primero a kPa multiplicando por el factor de origen y después divida por el factor de destino. mmHg y psi están redondeados.'},
   {title:'04 · Longitud, volumen y temperatura',body:'Conversiones habituales en instrumentos y cálculos.',rows:[['1 m','100 cm = 1.000 mm'],['1 km','1.000 m'],['1 L','1.000 mL = 0,001 m³'],['1 m³','1.000 L'],['Kelvin','K = °C + 273,15'],['Celsius','°C = K − 273,15'],['Fahrenheit','°F = 1,8 × °C + 32']],note:'Las leyes de los gases utilizan temperatura absoluta (kelvin), no Celsius sin convertir.'},
   {title:'05 · Leyes de los gases',body:'Estas fórmulas describen gases ideales bajo las condiciones indicadas; no son instrucciones clínicas ni de equipamiento.',formulas:[
    ['Boyle–Mariotte','P₁V₁ = P₂V₂','Temperatura y cantidad constantes; presión absoluta.'],
    ['Charles','V₁/T₁ = V₂/T₂','Presión y cantidad constantes; T en K.'],
    ['Gay-Lussac','P₁/T₁ = P₂/T₂','Volumen y cantidad constantes; T en K.'],
    ['Dalton','pᵢ = Fᵢ × P total','Mezcla ideal seca: presión parcial = fracción molar × presión absoluta.'],
    ['Henry','C = kH × p','Solubilidad proporcional a presión parcial para gas, líquido y temperatura definidos.'],
    ['Gas ideal','PV = nRT','P absoluta, V en m³, T en K; R ≈ 8,314 J/(mol·K).']
   ],note:'En mezclas humidificadas se considera la presión de vapor de agua. Presión inspirada, alveolar y arterial no son iguales.'},
   {title:'06 · Ejemplos resueltos',body:'Ejemplos matemáticos redondeados únicamente para comprender las relaciones físicas.',rows:[['2 ATA en kPa','2 × 101,325 = 202,65 kPa absolutos'],['Compresión isotérmica','1 L a 1 ATA → 0,5 L a 2 ATA (Boyle)'],['Aire seco a 2 ATA','pO₂ ≈ 0,21 × 202,65 = 42,56 kPa'],['37 °C en K','37 + 273,15 = 310,15 K'],['2 bar en kPa','2 × 100 = 200 kPa']],note:'Estos ejemplos no determinan presiones terapéuticas, descompresión ni límites operativos.'},
   {title:'07 · Análisis dimensional',body:'Antes de calcular, identifique la magnitud, convierta las unidades coherentemente y compruebe las dimensiones.',rows:[['P = F/A','N/m² = Pa'],['PV = nRT','Pa·m³ = J'],['Densidad ρ = m/V','kg/m³'],['Presión hidrostática','ΔP = ρ g h (Pa)']],note:'En ΔP = ρgh, ρ es densidad del fluido, g gravedad y h profundidad. La regla 10 m de agua de mar ≈ 1 atm es aproximada.'}
  ],
  converter:'CONVERSOR DE PRESIÓN',converterHelp:'Introduzca una presión absoluta no negativa y seleccione la unidad de origen.',value:'Valor',unit:'Unidad',results:'Equivalencias',invalid:'Escriba un número válido igual o mayor que cero.',reference:'Referencias fundamentales: SI (BIPM), unidades y constantes (NIST).'
 }
};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fundamentalsContent=copy;
const convertUnits=['ATA','atm','kPa','bar','hPa','mmHg','psi'];
const showTable=(rows)=>'<div class="fb-table-scroll"><table class="fb-table"><tbody>'+rows.map(([a,b])=>'<tr><th scope="row">'+escapeHTML(a)+'</th><td>'+escapeHTML(b)+'</td></tr>').join('')+'</tbody></table></div>';
export function renderFundamentosBasicos(lang='pt',icon=()=>'',back=()=>'',escape=escapeHTML){
 const v=copy[lang]||copy.pt,format=n=>new Intl.NumberFormat(lang,{maximumFractionDigits:4}).format(n);
 const cards=v.items.map(item=>'<article class="panel fb-card"><h2>'+escape(item.title)+'</h2><p>'+escape(item.body)+'</p>'+
  (item.formula?'<p class="fb-formula">'+escape(item.formula)+'</p>':'')+(item.example?'<p class="fb-example">'+escape(item.example)+'</p>':'')+
  (item.rows?showTable(item.rows):'')+
  (item.formulas?'<div class="fb-formula-list">'+item.formulas.map(([name,formula,condition])=>'<div class="fb-equation"><strong>'+escape(name)+'</strong><span class="fb-formula">'+escape(formula)+'</span><p>'+escape(condition)+'</p></div>').join('')+'</div>':'')+
  (item.note?'<p class="fb-note">'+escape(item.note)+'</p>':'')+'</article>');
 const initial=convertUnits.map(unit=>[unit,format(convertPressure(1,'ATA',unit))]);
 const converter='<section class="panel fb-card fb-converter" aria-labelledby="fb-converter-title"><h2 id="fb-converter-title">'+escape(v.converter)+'</h2><p>'+escape(v.converterHelp)+'</p><div class="fb-controls"><label>'+escape(v.value)+'<input data-fb-value type="number" min="0" step="any" value="1" inputmode="decimal"></label><label>'+escape(v.unit)+'<select data-fb-from>'+convertUnits.map(u=>'<option value="'+u+'">'+u+'</option>').join('')+'</select></label></div><p class="tag">'+escape(v.results)+'</p><output data-fb-results aria-live="polite">'+showTable(initial)+'</output></section>';
 return back('#home')+'<section class="fb-intro"><p class="tag">'+escape(v.tag)+'</p><h1 class="display page-title">'+escape(v.title)+'</h1><p class="subtle">'+escape(v.intro)+'</p></section><div class="fb-topics">'+cards.slice(0,3).join('')+converter+renderPhysicsActivities(lang)+cards.slice(3).join('')+'</div>';
}
export function handleFundamentosConversion(target,lang='pt'){
 if(!target?.matches?.('[data-fb-value],[data-fb-from]'))return false;
 const root=target.closest('.fb-converter');
 if(!root)return false;
 const output=root.querySelector('[data-fb-results]'),num=root.querySelector('[data-fb-value]'),unit=root.querySelector('[data-fb-from]');
 if(!output||!num||!unit)return true;
 const raw=String(num.value).trim(),amount=raw===''?NaN:Number(raw.replace(',','.'));
 const dictionary=copy[lang]||copy.pt;
 if(!Number.isFinite(amount)||amount<0){output.textContent=dictionary.invalid;return true;}
 const nf=new Intl.NumberFormat(lang,{maximumFractionDigits:4});
 const entries=convertUnits.map(u=>[u,nf.format(convertPressure(amount,unit.value,u))]);
 output.innerHTML=showTable(entries);
 return true;
}
