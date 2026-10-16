# OXYGENNA — CÂMARA: integração visual nativa (8 capítulos)

## O que foi implementado

Uma camada de páginas **para montar somente dentro da aba CÂMARA do frontend original**, preservando o shell do site (HOME, cabeçalho, menu inferior, perfil, cores, fonte e navegação). São oito capítulos completos recuperados do conjunto já versionado em \`content/camara/chapters.pt-BR.json\`.

- Índice com oito cards clicáveis, numeração, mínimo 55 px e bordas douradas;
- Detalhe de cada tema: objetivo, textos, pontos-chave, nuance clínica e síntese;
- Uso das quatro ilustrações SVG originais já armazenadas no repositório;
- Exercícios de escolha única com feedback e cálculo com tolerância;
- Laboratório com slider de Boyle e PIO₂ *inspirada* (não PaO₂);
- Checklist de segurança, categorias de evidência, navegação anterior/próximo;
- Um único quadro **FONTES DE REFERÊNCIA** no índice;
- Texto para narração; áudio somente se o app entregar seu narrador via callback \`onNarrate\`. Nenhum arquivo de áudio é alegado como pronto.

**Não** foram recriadas HOME, os cards externos de navegação, cabeçalho, perfil, rodapé ou configuração de rotas. O CSS usa somente seletores \`.oxc\`, com fonte *Saira Semi Condensed* já aprovada, paleta azul-marinho/dourado e tamanhos 10/12/14/20 px.

## Como montar no código-fonte original

O site original NÃO está versionado neste GitHub. Quando o módulo original da aba CÂMARA estiver disponível, crie **apenas um container vazio dentro da área de conteúdo da aba CÂMARA já existente** e utilize o componente sem duplicar navbar:

\`\`\`js
import {mountOxygennaCamera} from "./content/camara/ui/camara-native.mjs";

// cameraContentHost = container vazio REAL do app existente, sem substituir
// a tela, a área principal, o cabeçalho ou o rodapé.
const camera = mountOxygennaCamera(cameraContentHost, {
  existingLessons: existingCameraLessons,  // IDs/tags já cadastrados, se houver
  onNarrate: originalAudioPlayer?.playScript, // opcional; se não existir, omita
  onViewChange: ({view, lessonId}) => {
    // callback opcional para o estado de navegação já existente do app
  }
});

// camera.goToLesson("camara-01"); camera.showCatalog(); camera.dispose();
\`\`\`

Requisitos: Node 22+ para os testes, runtime web com módulos ESM/JSON compatíveis, e fontes/estilos do app original carregados. Os SVGs são resolvidos relativamente ao módulo e devem permanecer nos paths originais.

**O componente não monta automaticamente.** Não é possível integrar/publicar no domínio \`medicina-hiperbarica-campus.celsomurakami.chatgpt.site\` somente alterando este GitHub; é necessária a origem editável do projeto/site hospedado e sua integração explícita. **Não publicar uma interface paralela no lugar do front aprovado.**

## Validar sem alterar o frontend

\`npm test\` executa os testes de conteúdo existentes + os da interface. Testes automatizados validam dados, cálculos, referências, unicidade e ausência de seletor global. **Teste visual e testes de integração com shell original ainda exigem o código-fonte/site editável** e verificação em dispositivo.

## Critérios editoriais

- Não confundir PIO₂ inspirada com PaO₂ nem benefícios clínicos garantidos.
- Remover redundâncias **por IDs oficiais**, nunca descartar conteúdos do app indiscriminadamente.
- Não mudar INDICAÇÕES/PROTOCOLOS nem inventar protocolos médicos.
- Não apresentar roteiro de animação como animação executada.
