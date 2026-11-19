// Desenha o cartão do versículo numa imagem (canvas), com as mesmas cores do site.
// É essa imagem que vai pro WhatsApp quando a pessoa toca em "Enviar no WhatsApp".

const LARGURA_IMAGEM = 1080;
const ALTURA_IMAGEM = 1350; // formato em pé, que ocupa bem a tela do celular

const CORES = {
  verdeEscuro: "#1F4D3A",
  verdePastel: "#DCEFE3",
  branco: "#FFFFFF",
  texto: "#1E2A24",
};

const FONTE_SERIFADA = "Georgia, 'Times New Roman', serif";
const FONTE_SISTEMA = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// O canvas não quebra linha sozinho: vou juntando palavra por palavra
// e, quando a linha passa da largura, começo outra.
function quebrarEmLinhas(ctx, texto, larguraMaxima) {
  const palavras = texto.split(" ");
  const linhas = [];
  let linha = "";

  for (const palavra of palavras) {
    const tentativa = linha ? `${linha} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > larguraMaxima && linha) {
      linhas.push(linha);
      linha = palavra;
    } else {
      linha = tentativa;
    }
  }
  linhas.push(linha);
  return linhas;
}

function desenharCartao(ctx, versiculo, dataTexto) {
  const margem = 70;
  const cartao = {
    x: margem,
    y: margem,
    largura: LARGURA_IMAGEM - margem * 2,
    altura: ALTURA_IMAGEM - margem * 2 - 80, // sobra espaço embaixo pro endereço do site
  };
  const respiro = 80; // espaço interno do cartão (o "padding")
  const larguraTexto = cartao.largura - respiro * 2;

  // Fundo verde pastel, igual ao body
  ctx.fillStyle = CORES.verdePastel;
  ctx.fillRect(0, 0, LARGURA_IMAGEM, ALTURA_IMAGEM);

  // Cartão branco com sombra
  ctx.save();
  ctx.shadowColor = "rgba(31, 77, 58, 0.15)";
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  ctx.roundRect(cartao.x, cartao.y, cartao.largura, cartao.altura, 56);
  ctx.fillStyle = CORES.branco;
  ctx.fill();
  ctx.restore();

  // Faixa verde no topo (o border-top do CSS): recorto no formato do cartão e pinto só a ponta
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cartao.x, cartao.y, cartao.largura, cartao.altura, 56);
  ctx.clip();
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.fillRect(cartao.x, cartao.y, cartao.largura, 16);
  ctx.restore();

  // Etiqueta da data
  const xTexto = cartao.x + respiro;
  const yEtiqueta = cartao.y + respiro;
  ctx.font = `600 36px ${FONTE_SISTEMA}`;
  const larguraEtiqueta = ctx.measureText(dataTexto).width + 64;
  ctx.beginPath();
  ctx.roundRect(xTexto, yEtiqueta, larguraEtiqueta, 68, 34);
  ctx.fillStyle = CORES.verdePastel;
  ctx.fill();
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.textBaseline = "middle";
  ctx.fillText(dataTexto, xTexto + 32, yEtiqueta + 35);

  // Espaço que sobra pro versículo + referência
  const topoArea = yEtiqueta + 68 + 140;
  const fimArea = cartao.y + cartao.altura - respiro - 40;
  const alturaArea = fimArea - topoArea;

  // Versículo longo não cabe em letra grande: vou diminuindo até caber
  let tamanho = 64;
  let linhas;
  let alturaLinha;
  const alturaReferencia = 44 * 1.2 + 40;
  do {
    ctx.font = `${tamanho}px ${FONTE_SERIFADA}`;
    linhas = quebrarEmLinhas(ctx, versiculo.texto, larguraTexto);
    alturaLinha = tamanho * 1.45;
    tamanho -= 2;
  } while (linhas.length * alturaLinha + alturaReferencia > alturaArea && tamanho > 30);

  // Centraliza o bloco de texto na altura que sobrou
  const alturaBloco = linhas.length * alturaLinha + alturaReferencia;
  let y = topoArea + (alturaArea - alturaBloco) / 2;

  // Aspas gigantes de enfeite, logo acima do texto
  ctx.save();
  ctx.font = `240px ${FONTE_SERIFADA}`;
  ctx.fillStyle = CORES.verdePastel;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("“", xTexto - 12, y + 110);
  ctx.restore();

  ctx.fillStyle = CORES.texto;
  ctx.textBaseline = "top";
  for (const linha of linhas) {
    ctx.fillText(linha, xTexto, y);
    y += alturaLinha;
  }

  // Referência (ex.: Jeremias 29:11)
  ctx.font = `700 44px ${FONTE_SISTEMA}`;
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.fillText(versiculo.referencia, xTexto, y + 40);

  // Crédito da tradução (a licença CC BY pede que o nome apareça)
  ctx.font = `28px ${FONTE_SISTEMA}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(31, 77, 58, 0.6)";
  ctx.fillText("Bíblia Livre · CC BY 4.0", cartao.x + cartao.largura - respiro, cartao.y + cartao.altura - 56);

  // Endereço do site embaixo do cartão
  ctx.font = `600 34px ${FONTE_SISTEMA}`;
  ctx.textAlign = "center";
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.fillText("versiculo-diario-three.vercel.app", LARGURA_IMAGEM / 2, ALTURA_IMAGEM - 58);
  ctx.textAlign = "left";
}
