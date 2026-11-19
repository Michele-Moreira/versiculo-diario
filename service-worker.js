// Service worker: guarda os arquivos do site no celular pra ele abrir sem internet.
// Roda separado da página, como um "porteiro" entre o app e a internet.

// Trocar o número quando mudar a lista de arquivos abaixo
const NOME_CACHE = "versiculo-v2";

const ARQUIVOS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/imagem.js",
  "/versiculos.js",
  "/favicon.svg",
  "/manifest.json",
  "/icones/icone-192.png",
  "/icones/icone-512.png",
  "/icones/apple-touch-icon.png",
];

// Instalação: baixa tudo de uma vez e guarda
self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(NOME_CACHE).then((cache) => cache.addAll(ARQUIVOS)));
  self.skipWaiting();
});

// Ativação: apaga caches de versões antigas
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((nome) => nome !== NOME_CACHE).map((nome) => caches.delete(nome)))
    )
  );
  self.clients.claim();
});

// Cada pedido de arquivo: entrega o que está guardado na hora (rápido e funciona offline)
// e, em paralelo, busca a versão nova na internet pra próxima vez que abrir.
self.addEventListener("fetch", (evento) => {
  const pedido = evento.request;
  // Só arquivos do próprio site; link do WhatsApp e da Bíblia passam direto
  if (pedido.method !== "GET" || new URL(pedido.url).origin !== self.location.origin) return;

  evento.respondWith(
    caches.open(NOME_CACHE).then(async (cache) => {
      const guardado = await cache.match(pedido, { ignoreSearch: true });
      const daInternet = fetch(pedido)
        .then((resposta) => {
          if (resposta.ok) cache.put(pedido, resposta.clone());
          return resposta;
        })
        .catch(() => guardado);

      if (guardado) {
        evento.waitUntil(daInternet);
        return guardado;
      }
      return daInternet;
    })
  );
});
