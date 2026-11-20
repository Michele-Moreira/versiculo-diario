// As caixas da página que o JS vai preencher
const data = document.querySelector("time");
const texto = document.querySelector("blockquote p");
const referencia = document.querySelector("cite");
const botaoWhatsapp = document.querySelector("#whatsapp");
const botaoOutro = document.querySelector("#outro");
const linkCapitulo = document.querySelector("#capitulo");
const botoesPaleta = document.querySelectorAll(".paleta");
// As duas cores da barra do celular (uma pro tema claro, outra pro escuro)
const [barraClara, barraEscura] = document.querySelectorAll('meta[name="theme-color"]');

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
  desenharCartao(canvas.getContext("2d"), versiculo, data.textContent, PALETAS[paletaAtual()]);

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

// Qual paleta está na página agora (o script do <head> já pôs a salva)
function paletaAtual() {
  const nome = document.documentElement.dataset.paleta;
  return PALETAS[nome] ? nome : "verde";
}

// Troca a paleta: o CSS muda as cores sozinho quando o data-paleta muda.
// Aqui só falta marcar a bolinha certa, pintar a barra do celular e lembrar a escolha.
function aplicarPaleta(nome) {
  document.documentElement.dataset.paleta = nome;

  botoesPaleta.forEach((botao) => {
    botao.setAttribute("aria-pressed", botao.dataset.paleta === nome);
  });

  barraClara.content = PALETAS[nome].forte;
  barraEscura.content = PALETAS[nome].fundoEscuro;

  // try/catch: no modo anônimo de alguns celulares o localStorage dá erro
  try {
    localStorage.setItem("paleta", nome);
  } catch (erro) {}
}

// Avisa o Google Analytics de um clique. Se o gtag não existir (bloqueador de anúncio,
// por exemplo), não faz nada: o site continua funcionando igual.
function registrar(evento, detalhes) {
  if (typeof gtag === "function") gtag("event", evento, detalhes);
}

// Quando a página abre: paleta salva + data de hoje + versículo do dia
aplicarPaleta(paletaAtual());
const hoje = new Date();
mostrarData(hoje);
mostrarVersiculo(diaDoAno(hoje) % versiculos.length);

botaoOutro.addEventListener("click", () => {
  sortearOutro();
  registrar("outro_versiculo");
});

botaoWhatsapp.addEventListener("click", (evento) => {
  // Registra antes de compartilhar, porque no computador o link troca de página na hora
  registrar("enviar_whatsapp", { versiculo: versiculos[indiceAtual].referencia });
  compartilhar(evento);
});

botoesPaleta.forEach((botao) => {
  botao.addEventListener("click", () => {
    aplicarPaleta(botao.dataset.paleta);
    registrar("trocar_paleta", { paleta: botao.dataset.paleta });
    // Redesenha a imagem do WhatsApp na cor nova
    prepararImagem(versiculos[indiceAtual]);
  });
});

// Liga o service worker (o que faz o app abrir sem internet), se o navegador tiver
if ("serviceWorker" in navigator) {
  // Aberto com dois cliques no arquivo (file://) não funciona, e tudo bem: o site segue normal
  navigator.serviceWorker.register("/service-worker.js").catch(() => {});
}
