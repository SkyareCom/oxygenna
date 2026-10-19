// Ilustrações SVG e experimentos matemáticos independentes para a área Fundamentos Básicos.
// Pressões absolutas e hipóteses explícitas: materiais de ensino, não protocolos de mergulho.
export const DEPTH_CONSTANTS=Object.freeze({
 surfacePa:101325, gravity:9.80665,seaDensity:1025,freshDensity:1000,maxDepth:60
});
export function depthPressure(depth,water='sea'){
 const d=Number(depth),c=DEPTH_CONSTANTS;
 if(!Number.isFinite(d)||d<0||d>c.maxDepth||!['sea','fresh'].includes(water))return null;
 const density=water==='sea'?c.seaDensity:c.freshDensity;
 const addedPa=density*c.gravity*d,absolutePa=c.surfacePa+addedPa;
 return {depth:d,water,density,gaugeKPa:addedPa/1000,gaugeAtm:addedPa/c.surfacePa,
  absoluteKPa:absolutePa/1000,absoluteAtm:absolutePa/c.surfacePa,
  metresPerAtm:c.surfacePa/(density*c.gravity)};
}
export function boyleVolume(pressureATA,referenceML=1000){
 const p=Number(pressureATA),v=Number(referenceML);
 return Number.isFinite(p)&&p>0&&Number.isFinite(v)&&v>0?v/p:null;
}
export function dryGasPartialPressure(pressureATA,fractionPercent){
 const p=Number(pressureATA),f=Number(fractionPercent);
 return Number.isFinite(p)&&p>0&&Number.isFinite(f)&&f>=0&&f<=100?p*101.325*f/100:null;
}
const text={
 pt:{depthTitle:'MERGULHADOR INTERATIVO',depthIntro:'Toque ou arraste o mergulhador na coluna de água. Veja como a profundidade aumenta a pressão absoluta.',depthLabel:'Profundidade',depthHint:'Arraste o mergulhador, toque na água ou use as setas do teclado.',water:'Tipo de água',sea:'Água salgada',fresh:'Água doce',abs:'PRESSÃO ABSOLUTA',gauge:'ACRÉSCIMO HIDROSTÁTICO',kpa:'PRESSÃO EM kPa',depth:'PROFUNDIDADE',rule:'P absoluta = 1 atm + ρ × g × h. Modelo: superfície a 101,325 kPa, g = 9,80665 m/s²; água salgada 1.025 kg/m³ e doce 1.000 kg/m³. Na água salgada, +1 atm ocorre aproximadamente a 10,1 m, não exatamente a 10 m.',visual:'Ilustração interativa de mergulhador na água',
 boyleTitle:'EXPERIMENTO DE BOYLE',boyleIntro:'Aumente a pressão e observe a bolha de gás diminuir de volume, mantendo temperatura e quantidade de gás constantes.',pressure:'Pressão absoluta',bubble:'BOLHA DE GÁS',volume:'VOLUME RELATIVO',boyleNote:'Modelo ideal: P₁V₁ = P₂V₂, com V₁ = 1.000 mL a 1 ATA. A figura representa o volume relativo, não um tamanho anatômico.',
 oxygenTitle:'EXPERIMENTO DE DALTON',oxygenIntro:'Ajuste a pressão e a fração de oxigênio para visualizar a pressão parcial de O₂ em mistura gasosa seca ideal.',oxygen:'Fração de oxigênio',partial:'PRESSÃO PARCIAL DE O₂',other:'Outros gases',oxygenNote:'pO₂ = FO₂ × pressão absoluta. Este é um cálculo físico de mistura seca; não equivale a oxigênio inspirado umidificado, alveolar ou arterial.',visuals:'ATIVIDADES VISUAIS'},
 en:{depthTitle:'INTERACTIVE DIVER',depthIntro:'Tap the water or drag the diver down to explore how depth increases absolute pressure.',depthLabel:'Depth',depthHint:'Drag the diver, tap the water or use the arrow keys.',water:'Water type',sea:'Seawater',fresh:'Freshwater',abs:'ABSOLUTE PRESSURE',gauge:'HYDROSTATIC INCREASE',kpa:'PRESSURE IN kPa',depth:'DEPTH',rule:'Absolute P = 1 atm + ρ × g × h. Model: surface at 101.325 kPa, g = 9.80665 m/s²; seawater 1,025 kg/m³, freshwater 1,000 kg/m³. In seawater, +1 atm occurs at about 10.1 m, not exactly 10 m.',visual:'Interactive diver illustration in water',
 boyleTitle:'BOYLE EXPERIMENT',boyleIntro:'Increase pressure to see a gas bubble shrink while temperature and gas quantity stay constant.',pressure:'Absolute pressure',bubble:'GAS BUBBLE',volume:'RELATIVE VOLUME',boyleNote:'Ideal model: P₁V₁ = P₂V₂, with V₁ = 1,000 mL at 1 ATA. The drawing represents relative volume, not anatomical dimensions.',
 oxygenTitle:'DALTON EXPERIMENT',oxygenIntro:'Adjust pressure and oxygen fraction to explore the oxygen partial pressure in an ideal dry gas mixture.',oxygen:'Oxygen fraction',partial:'PARTIAL PRESSURE OF O₂',other:'Other gases',oxygenNote:'pO₂ = FO₂ × absolute pressure. Physical dry-gas example, not humidified inspired, alveolar or arterial oxygen.',visuals:'VISUAL ACTIVITIES'},
 es:{depthTitle:'BUZO INTERACTIVO',depthIntro:'Toque el agua o arrastre al buzo para descubrir cómo la profundidad aumenta la presión absoluta.',depthLabel:'Profundidad',depthHint:'Arrastre al buzo, toque el agua o utilice las flechas del teclado.',water:'Tipo de agua',sea:'Agua salada',fresh:'Agua dulce',abs:'PRESIÓN ABSOLUTA',gauge:'AUMENTO HIDROSTÁTICO',kpa:'PRESIÓN EN kPa',depth:'PROFUNDIDAD',rule:'P absoluta = 1 atm + ρ × g × h. Modelo: superficie a 101,325 kPa, g = 9,80665 m/s²; agua salada 1.025 kg/m³ y dulce 1.000 kg/m³. En agua salada, +1 atm ocurre cerca de 10,1 m, no exactamente a 10 m.',visual:'Ilustración interactiva de un buzo en el agua',
 boyleTitle:'EXPERIMENTO DE BOYLE',boyleIntro:'Aumente la presión y observe cómo una burbuja de gas disminuye su volumen, con temperatura y cantidad constantes.',pressure:'Presión absoluta',bubble:'BURBUJA DE GAS',volume:'VOLUMEN RELATIVO',boyleNote:'Modelo ideal: P₁V₁ = P₂V₂, con V₁ = 1.000 mL a 1 ATA. El dibujo representa el volumen relativo, no tamaños anatómicos.',
 oxygenTitle:'EXPERIMENTO DE DALTON',oxygenIntro:'Ajuste la presión y la fracción de oxígeno para explorar la presión parcial de O₂ en una mezcla gaseosa seca ideal.',oxygen:'Fracción de oxígeno',partial:'PRESIÓN PARCIAL DE O₂',other:'Otros gases',oxygenNote:'pO₂ = FO₂ × presión absoluta. Ejemplo físico de mezcla seca; no representa oxígeno inspirado humidificado, alveolar o arterial.',visuals:'ACTIVIDADES VISUALES'}
};
const fmt=(n,lang,dec=2)=>new Intl.NumberFormat(lang,{minimumFractionDigits:dec,maximumFractionDigits:dec}).format(n);
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const diverPhotoSVG='<svg class="fb-real-diver-photo" viewBox="55 465 950 435" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
 '<defs><clipPath id="fb-real-diver-mask"><path d="M88 710 L110 692 L307 650 L360 640 L402 638 L427 655 L467 672 L515 672 L558 630 L585 572 L608 546 L669 520 L726 510 L750 532 L806 530 L828 514 L849 487 L876 487 L902 498 L928 521 L947 545 L959 563 L967 591 L980 602 L988 613 L970 629 L952 631 L937 653 L904 660 L892 691 L871 731 L843 740 L823 764 L800 786 L780 798 L758 784 L751 767 L763 747 L780 730 L748 710 L715 727 L679 758 L634 800 L607 816 L572 846 L546 845 L536 829 L546 807 L577 782 L608 748 L636 711 L596 752 L557 769 L512 781 L456 797 L401 813 L354 838 L318 855 L253 877 L191 885 L150 880 L119 863 L110 846 L148 831 L282 794 L332 775 L365 750 L333 733 L300 747 L253 758 L177 774 L143 772 L102 746 Z"/></clipPath></defs>'+
 '<image href="./assets/mergulhador-realista-aprovado.webp" x="0" y="0" width="1122" height="1402" preserveAspectRatio="none" clip-path="url(#fb-real-diver-mask)"/>'+
 '</svg>';
const bubbleSVG='<svg class="fb-bubble-art" viewBox="0 0 270 155" role="img" aria-label="Gas bubble volume illustration"><rect width="270" height="155" rx="12" fill="#092a38"/><path d="M12 132H258" stroke="#477a8b" stroke-width="2"/><circle data-boyle-bubble cx="135" cy="77" r="48" fill="#58bdd0" fill-opacity=".28" stroke="#a2e2ea" stroke-width="3"/><circle data-boyle-glint cx="118" cy="60" r="9" fill="#e6fbff" fill-opacity=".5"/><g fill="#b5e1e9" opacity=".55"><circle cx="28" cy="36" r="3"/><circle cx="225" cy="62" r="5"/><circle cx="248" cy="24" r="3"/></g></svg>';
const gasesSVG='<svg viewBox="0 0 270 126" class="fb-gas-art" role="img" aria-label="Gas mixture visual representation"><rect width="270" height="126" rx="12" fill="#092a38"/><rect x="18" y="26" width="234" height="64" rx="8" fill="#214957"/><rect data-gas-oxygen x="18" y="26" width="49.14" height="64" rx="3" fill="#d2ae70"/><path d="M18 96H252" stroke="#97b4bd"/><text x="22" y="17" fill="#d9c595" font-size="11">O₂</text><text x="220" y="17" fill="#bacbd1" font-size="11">N₂ + …</text></svg>';
export function renderPhysicsActivities(lang='pt'){
 const v=text[lang]||text.pt,p=depthPressure(0),label=s=>e(s);
 const depth='<section class="panel fb-card fb-depth-activity" aria-label="'+label(v.depthTitle)+'">'+
 '<h2>'+label(v.depthTitle)+'</h2><p>'+label(v.depthIntro)+'</p>'+
 '<div class="fb-controls"><label>'+label(v.water)+'<select data-depth-water><option value="sea">'+label(v.sea)+'</option><option value="fresh">'+label(v.fresh)+'</option></select></label>'+
 '<label>'+label(v.depthLabel)+'<input type="range" min="0" max="60" step="1" value="0" data-depth-range aria-label="'+label(v.depthLabel)+'"></label></div>'+
 '<div class="fb-ocean-stage" data-depth-stage role="group" aria-label="'+label(v.visual)+'">'+
 '<img class="fb-ocean-photo" data-depth-photo src="./assets/mergulhador-realista-aprovado.webp" width="760" height="950" alt="" aria-hidden="true" draggable="false">'+
 '<button type="button" class="fb-diver-handle" data-depth-diver role="slider" aria-label="'+label(v.depthLabel)+'" aria-valuemin="0" aria-valuemax="60" aria-valuenow="0" aria-valuetext="0 m" tabindex="0" style="top:11%">'+diverPhotoSVG+'</button>'+
 '<span class="fb-depth-ruler" aria-hidden="true"></span>'+
 Array.from({length:7},(_,i)=>'<span class="fb-depth-guide" aria-hidden="true" style="top:'+(11+i*13)+'%"></span><span class="fb-depth-tick" aria-hidden="true" style="top:'+(11+i*13)+'%">'+(i*10)+' m</span>').join('')+
 '<span class="fb-depth-active-line" data-depth-active aria-hidden="true" style="top:11%"></span></div>'+
 '<p class="fb-note">'+label(v.depthHint)+'</p>'+
 '<div class="fb-live-metrics" aria-live="off"><div><small>'+label(v.depth)+'</small><strong data-depth-metres>0 m</strong></div><div><small>'+label(v.abs)+'</small><strong data-depth-absolute>'+fmt(p.absoluteAtm,lang)+' atm · '+fmt(p.absoluteKPa,lang)+' kPa</strong></div>'+
 '<div><small>'+label(v.gauge)+'</small><strong data-depth-gauge>+'+fmt(0,lang)+' atm · +'+fmt(0,lang)+' kPa</strong></div><div><small>'+label(v.kpa)+'</small><strong data-depth-kpa>'+fmt(p.absoluteKPa,lang)+' kPa · '+fmt(p.absoluteAtm,lang)+' atm</strong></div></div>'+
 '<p class="fb-note">'+label(v.rule)+'</p></section>';
 const boyle='<section class="panel fb-card fb-boyle-activity"><h2>'+label(v.boyleTitle)+'</h2><p>'+label(v.boyleIntro)+'</p>'+
 bubbleSVG+'<label class="fb-activity-slider">'+label(v.pressure)+'<input type="range" data-boyle-pressure min="1" max="6" value="1" step=".5"></label>'+
 '<div class="fb-live-metrics"><div><small>'+label(v.pressure)+'</small><strong data-boyle-atm>'+fmt(1,lang,1)+' ATA (= atm) · '+fmt(101.325,lang)+' kPa</strong></div><div><small>'+label(v.volume)+'</small><strong data-boyle-volume>'+fmt(1000,lang,0)+' mL</strong></div></div><p class="fb-note">'+label(v.boyleNote)+'</p></section>';
 const oxygen='<section class="panel fb-card fb-oxygen-activity"><h2>'+label(v.oxygenTitle)+'</h2><p>'+label(v.oxygenIntro)+'</p>'+gasesSVG+
 '<div class="fb-controls"><label>'+label(v.pressure)+'<input data-gas-pressure type="range" min="1" max="3" step=".5" value="1"></label><label>'+label(v.oxygen)+'<input data-gas-fraction type="range" min="0" max="100" step="1" value="21"></label></div>'+
 '<div class="fb-live-metrics"><div><small>'+label(v.pressure)+'</small><strong data-gas-atm>'+fmt(1,lang,1)+' ATA (= atm) · '+fmt(101.325,lang)+' kPa</strong></div><div><small>'+label(v.oxygen)+'</small><strong data-gas-percent>21%</strong></div><div class="fb-wide-metric"><small>'+label(v.partial)+'</small><strong data-gas-partial>'+fmt(21.27825,lang)+' kPa · '+fmt(.21,lang)+' atm</strong></div></div><p class="fb-note">'+label(v.oxygenNote)+'</p></section>';
 return '<div class="fb-interactive-group"><p class="tag">'+label(v.visuals)+'</p>'+depth+boyle+oxygen+'</div>';
}
export function updatePhysicsActivity(target,lang='pt'){
 const v=text[lang]||text.pt;
 const root=target?.closest?.('.fb-depth-activity,.fb-boyle-activity,.fb-oxygen-activity');
 if(!root)return false;
 const nf=(n,d=2)=>fmt(n,lang,d);
 const attr=(sel,text)=>{const el=root.querySelector(sel);if(el)el.textContent=text;};
 if(root.matches('.fb-depth-activity')){
  if(!target.matches('[data-depth-range],[data-depth-water],[data-depth-diver],[data-depth-stage]'))return false;
  const range=root.querySelector('[data-depth-range]'),water=root.querySelector('[data-depth-water]');
  const result=depthPressure(Number(range.value),water.value);
  if(!result)return false;
  attr('[data-depth-metres]',nf(result.depth,0)+' m');
  attr('[data-depth-absolute]',nf(result.absoluteAtm)+' atm · '+nf(result.absoluteKPa)+' kPa');
  attr('[data-depth-gauge]','+'+nf(result.gaugeAtm)+' atm · +'+nf(result.gaugeKPa)+' kPa');
  attr('[data-depth-kpa]',nf(result.absoluteKPa)+' kPa · '+nf(result.absoluteAtm)+' atm');
  const diver=root.querySelector('[data-depth-diver]');
  if(diver){diver.style.top=(11+result.depth/60*78)+'%';diver.setAttribute('aria-valuenow',String(result.depth));diver.setAttribute('aria-valuetext',nf(result.depth,0)+' m');}
  // A fotografia é apenas cenário estático: sem zoom ou deslocamento com a profundidade.
  // O marcador e a linha de leitura se movem juntos na régua de 0 a 60 metros.
  const reading=root.querySelector('[data-depth-active]');
  if(reading?.style)reading.style.top=(11+result.depth/60*78)+'%';
  return true;
 }
 if(root.matches('.fb-boyle-activity')){
  if(!target.matches('[data-boyle-pressure]'))return false;
  const ata=Number(target.value),ml=boyleVolume(ata);
  if(ml===null)return false;
  attr('[data-boyle-atm]',nf(ata,1)+' ATA (= atm) · '+nf(ata*101.325)+' kPa');attr('[data-boyle-volume]',nf(ml,0)+' mL');
  const bubble=root.querySelector('[data-boyle-bubble]'),glint=root.querySelector('[data-boyle-glint]');
  if(bubble){const radius=48*Math.cbrt(ml/1000);bubble.setAttribute('r',String(radius));if(glint)glint.setAttribute('cx',String(135-radius*.35));}
  return true;
 }
 if(root.matches('.fb-oxygen-activity')){
  if(!target.matches('[data-gas-pressure],[data-gas-fraction]'))return false;
  const ata=Number(root.querySelector('[data-gas-pressure]').value),pct=Number(root.querySelector('[data-gas-fraction]').value);
  const kpa=dryGasPartialPressure(ata,pct);
  if(kpa===null)return false;
  attr('[data-gas-atm]',nf(ata,1)+' ATA (= atm) · '+nf(ata*101.325)+' kPa');attr('[data-gas-percent]',nf(pct,0)+'%');attr('[data-gas-partial]',nf(kpa)+' kPa · '+nf(kpa/101.325)+' atm');
  const bar=root.querySelector('[data-gas-oxygen]');if(bar)bar.setAttribute('width',String(234*pct/100));
  return true;
 }
 return false;
}
// Use o mesmo cálculo para clique, arraste por toque/mouse e teclado.
export function setDiverDepthFromPointer(stage,clientY,lang='pt'){
 if(!stage||!Number.isFinite(clientY))return false;
 const rect=stage.getBoundingClientRect();
 if(!rect.height)return false;
 const position=Math.max(0,Math.min(1,(clientY-rect.top-rect.height*.11)/(rect.height*.78)));
 const range=stage.closest('.fb-depth-activity')?.querySelector('[data-depth-range]');
 if(!range)return false;
 range.value=String(Math.round(position*60));
 return updatePhysicsActivity(range,lang);
}
