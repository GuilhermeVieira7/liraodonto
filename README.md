# Lira Odonto Santa Cruz

Site institucional da **Lira Odonto Santa Cruz**, referência em facetas e estética dental em Santa Cruz do Capibaribe (PE).

Site estático (HTML, CSS e JavaScript puros), sem etapa de build. Funciona direto no GitHub Pages, Vercel, Netlify ou qualquer hospedagem.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html            página única com todas as seções
favicon.svg           marca (arco cobre + dente prata) em SVG
assets/css/style.css  estilos e responsivo
assets/js/main.js     animações, antes/depois, rolagem horizontal, vídeo
assets/img/           fotos da clínica, casos antes/depois, mármore, og.jpg
assets/video/         loop do hero (sem áudio) e depoimento completo (com áudio)
```

## Onde editar

- **WhatsApp:** todos os botões apontam para `https://wa.me/message/SAZJGCS6SU23H1`. Para trocar, busque esse link no `index.html`.
- **Endereço:** o bloco de contato usa um link de busca do Google Maps. Quando houver endereço completo, troque o link e adicione `streetAddress` no JSON-LD do `<head>`.
- **Casos antes/depois:** cada caso é um `<figure class="ba">` com duas imagens (`ba__before` e `ba__after`) do mesmo tamanho.
