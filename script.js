// As caixas da página que o JS vai preencher
const data = document.querySelector("time");
const texto = document.querySelector("blockquote p");
const referencia = document.querySelector("cite");
const botaoWhatsapp = document.querySelector("#whatsapp");
const botaoOutro = document.querySelector("#outro");
const linkCapitulo = document.querySelector("#capitulo");

// Guarda qual versículo está na tela, pro sorteio não repetir o mesmo
let indiceAtual = 0;

// O que vai pro WhatsApp: o texto e a imagem do cartão do versículo que está na tela
const ENDERECO_SITE = "https://versiculo-diario-three.vercel.app";
let mensagemAtual = "";
let imagemAtual = null;

// Número do dia no ano (1 de janeiro = 1). Usa o dia, mês e ano do celular,
// e não o horário mundial (UTC), senão o versículo trocaria às 21h em Brasília.
function diaDoAno(hoje) {
  const inicio = Date.UTC(hoje.getFullYear(), 0, 0);
  const agora = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.floor((agora - inicio) / 86400000);
}

// Preenche o time com a data por extenso ("19 de novembro de 2026")
// e o atributo datetime no formato que a tag pede ("2026-11-19")
function mostrarData(hoje) {
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  data.dateTime = `${ano}-${mes}-${dia}`;
  data.textContent = hoje.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Coloca um versículo da lista na tela e atualiza os dois links
function mostrarVersiculo(indice) {
  const versiculo = versiculos[indice];
  indiceAtual = indice;

  texto.textContent = versiculo.texto;
  referencia.textContent = versiculo.referencia;
  linkCapitulo.href = `https://ebible.org/porbr2018/${versiculo.capitulo}.htm`;

  // encodeURIComponent transforma espaço, acento e aspas em algo que cabe num link
  mensagemAtual = `"${versiculo.texto}" (${versiculo.referencia})\n\nVersículo do dia: ${ENDERECO_SITE}`;
  botaoWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(mensagemAtual)}`;

  prepararImagem(versiculo);
}

// Desenha a imagem do cartão já agora, e não na hora do toque: o celular só abre
// o menu de compartilhar se o share() for chamado logo depois do toque, sem espera.
function prepararImagem(versiculo) {
  imagemAtual = null;
  const canvas = document.createElement("canvas");
  canvas.width = LARGURA_IMAGEM;
  canvas.height = ALTURA_IMAGEM;
  desenharCartao(canvas.getContext("2d"), versiculo, data.textContent);

  canvas.toBlob((blob) => {
    // Se a pessoa sorteou outro enquanto desenhava, essa imagem já não vale
    if (versiculos[indiceAtual] !== versiculo || !blob) return;
    imagemAtual = new File([blob], "versiculo-do-dia.png", { type: "image/png" });
  }, "image/png");
}

// No celular: abre o menu de compartilhar com a imagem + o texto.
// No computador (ou se a imagem não ficou pronta): segue o link do wa.me, só com o texto.
function compartilhar(evento) {
  const dados = { files: [imagemAtual], text: mensagemAtual };
  if (!imagemAtual || !navigator.canShare || !navigator.canShare(dados)) return;

  evento.preventDefault();
  navigator.share(dados).catch((erro) => {
    // AbortError = a pessoa fechou o menu sem escolher, não é problema
    if (erro.name !== "AbortError") window.location.href = botaoWhatsapp.href;
  });
}

// Sorteia outro versículo, diferente do que está na tela
function sortearOutro() {
  let novo = indiceAtual;
  while (novo === indiceAtual) {
    novo = Math.floor(Math.random() * versiculos.length);
  }
  mostrarVersiculo(novo);
}

// Quando a página abre: data de hoje + versículo do dia
const hoje = new Date();
mostrarData(hoje);
mostrarVersiculo(diaDoAno(hoje) % versiculos.length);

botaoOutro.addEventListener("click", sortearOutro);
botaoWhatsapp.addEventListener("click", compartilhar);
