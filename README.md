# Versículo Diário

Um versículo bíblico por dia, feito pra minha mãe.

**🌿 Acesse: [versiculo-diario-three.vercel.app](https://versiculo-diario-three.vercel.app/)**

A página mostra a data de hoje e um versículo que muda sozinho à meia-noite. Dá pra sortear outro versículo,
mandar o versículo pelo WhatsApp e abrir o capítulo inteiro pra ler o contexto. Foi pensada primeiro pro
celular, com letra grande e contraste forte pra facilitar a leitura.

## Funcionalidades

- **Versículo do dia:** escolhido pela data do aparelho, igual pra todo mundo no mesmo dia. São 365 versículos,
  então a lista só se repete depois de um ano.
- **Outro versículo:** sorteia um versículo diferente do que está na tela.
- **Enviar no WhatsApp:** no celular, abre o menu de compartilhar com uma imagem do cartão do dia, o texto e o
  link do site. No computador, abre o WhatsApp só com o texto e o link.
- **Prévia do link:** quem recebe o endereço do site vê um cartão com o ícone e o nome do projeto (Open Graph).
- **Ler o capítulo:** abre o capítulo do versículo no site da Bíblia Livre.
- **Layout responsivo:** cartão centralizado no celular, com os botões empilhados, que ficam lado a lado em
  telas a partir de 600px.

## Tecnologias

Projeto feito sem framework e sem biblioteca, pra praticar a base.

| Tecnologia | Onde aparece |
|---|---|
| **HTML** | Tags com significado: `main`, `time`, `blockquote`, `cite`, `footer` |
| **CSS** | Variáveis de cor (`:root`), flex-box, `media query` pensada primeiro pro celular, pseudo-elemento `::before` nas aspas de enfeite, estados `:hover` e `:focus-visible` |
| **JavaScript** | DOM (`querySelector`, `textContent`), eventos (`addEventListener`), datas (`Date` e `toLocaleDateString`), `encodeURIComponent` no link do WhatsApp |
| **Git e GitHub** | Histórico do projeto, um commit por etapa, no padrão Conventional Commits |

## Como rodar o projeto

Não precisa instalar nada: o projeto é só HTML, CSS e JS.

1. Clone o repositório:

   ```bash
   git clone https://github.com/Michele-Moreira/versiculo-diario.git
   cd versiculo-diario
   ```

2. Abra o `index.html` no navegador, com dois cliques no arquivo ou arrastando ele pra uma aba.

Pra ver como fica no celular: aperte `F12` no navegador, depois `Ctrl+Shift+M`, e escolha uma largura de 360px.

## Estrutura

```
versiculo-diario/
├── index.html      # estrutura da página
├── style.css       # cores, layout e responsividade
├── script.js       # data, versículo do dia e botões
├── imagem.js       # desenha o cartão do versículo numa imagem (canvas) pro WhatsApp
├── versiculos.js   # lista com os 365 versículos
├── favicon.svg     # ícone da aba
└── previa.png      # imagem da prévia do link (1200×630)
```

## Como funciona o versículo do dia

O `script.js` calcula o número do dia no ano (1º de janeiro é o dia 1) e usa o resto da divisão pelo tamanho
da lista pra escolher o versículo:

```js
versiculos[diaDoAno(hoje) % versiculos.length]
```

A conta usa o dia, o mês e o ano do próprio aparelho, e não o horário mundial (UTC). Por isso o versículo troca
à meia-noite de Brasília, e não às 21h.

## Como adicionar um versículo

Acrescente um item no `versiculos.js`, no mesmo formato dos outros:

```js
{ texto: "O SENHOR é meu pastor, nada me faltará.", referencia: "Salmos 23:1", capitulo: "PSA023" },
```

O `capitulo` é o nome da página do capítulo no site da Bíblia Livre: `https://ebible.org/porbr2018/<capitulo>.htm`.
O código não precisa mudar, porque ele usa o tamanho da lista.

## Tradução

Os versículos são da [Bíblia Livre (BLIVRE)](https://ebible.org/porbr2018/copyright.htm), de Diego Santos, Mario
Sérgio e Marco Teles, com licença [Creative Commons Atribuição 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br).

Ajustes feitos pra citação: primeira letra maiúscula, ponto final quando o versículo continua no seguinte, e sem
as notas de referência cruzada e o "(Selá)" dos Salmos.

## Autora

Feito por [Michele Moreira](https://github.com/Michele-Moreira).
