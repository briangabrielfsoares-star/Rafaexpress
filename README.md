1111111111111111# RafaExpress - Site de Entregas de Moto

Site completo, responsivo e com visual rústico/premium para delivery de moto.

## Arquivos

- `index.html` — estrutura do site.
- `styles.css` — visual rústico, responsivo e animado.
- `app.js` — calculadora de frete, WhatsApp, animações fluidas e sons.
- `README.md` — instruções.

## Configuração principal

Abra o arquivo `app.js` e edite esta parte:

```js
const CONFIG = {
  nomeNegocio: "RafaExpress",
  nomeEntregador: "Rafa",
  cidade: "Sua cidade",
  telefoneWhatsApp: "5500000000000",
  gasolinaLitro: 6,11,
  taxaBase: 10,
  precoPorKm: 2,
  valorMinimo: 15
};
```

## WhatsApp

Troque:

```js
telefoneWhatsApp: "5500000000000"
```

Pelo número real com código do país e DDD, sem espaços, sem traços e sem o sinal de +.

Exemplo:

```js
telefoneWhatsApp: "5511999999999"
```

## Frete configurado

A versão atual está com:

- Gasolina visual: R$ 7,00/L
- Taxa base: R$ 10,00
- Preço por km: R$ 2,00
- Valor mínimo: R$ 15,00
- Entrega expressa: +35%
- Entrega urgente: +55%
- Noite: +20%
- Chuva: +25%
- Noite + chuva: +40%

## Sobre os sons

O site tem sons de clique, rolagem e animação. O navegador não deixa tocar som automático sem permissão, então existe o botão **Som** no topo do site. Depois que o cliente clicar, os sons funcionam.

## Como abrir

1. Extraia o ZIP.
2. Abra `index.html` no navegador.
3. Edite `app.js` com telefone, cidade e preços reais.
4. Publique em Netlify, Vercel, GitHub Pages, Hostinger ou outro serviço.
