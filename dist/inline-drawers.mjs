// Política de interface OXYGENNA: conteúdo expansível é sempre gaveta no fluxo da tela.
// details/summary: comportamento nativo, teclado e leitores de tela, sem diálogo ou overlay.
export function withInlineDrawers(markup){
 return String(markup).replace(/<details(?=[\s>])([^>]*)>/g,(match,attrs)=>{
  if(/\bdata-inline-drawer\s*=/.test(attrs))return match;
  const type=/\bclass\s*=/.test(attrs)?'styled':'plain';
  return '<details'+attrs+' data-inline-drawer="'+type+'">';
 });
}
