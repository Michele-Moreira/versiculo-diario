// As caixas da página que o JS vai preencher
const data = document.querySelector("time");
const texto = document.querySelector("blockquote p");
const referencia = document.querySelector("cite");
const botaoWhatsapp = document.querySelector("#whatsapp");
const botaoOutro = document.querySelector("#outro");
const linkCapitulo = document.querySelector("#capitulo");

// Guarda qual versículo está na tela, pro sorteio não repetir o mesmo
let indiceAtual = 0;

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
  const mensagem = `"${versiculo.texto}" (${versiculo.referencia})`;
  botaoWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
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
