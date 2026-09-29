# Clínica Odontológica Alexsandra & Antônio Prado — Landing page

Página única da clínica, feita em HTML, CSS e JavaScript puros. Não há etapa de build: basta publicar os arquivos em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

Para visualizar localmente: `python3 -m http.server` e abra http://localhost:8000.

## Estrutura

```
index.html              Página única com todas as seções
assets/css/styles.css   Estilos (mobile-first)
assets/js/config.js     ⚙️ Dados de contato (WhatsApp, e-mail, endereço, Instagram)
assets/js/main.js       Menu, animações, WhatsApp e mapa
assets/img/             Foto da equipe (WebP + JPG), favicon, ícones e imagem de compartilhamento
site.webmanifest, robots.txt
```

Seções: Início · Serviços · Profissionais · Diferenciais · Como funciona · Cidades atendidas · Contato (WhatsApp, telefone e mapa) · Rodapé.

## Dados opcionais

O site já está completo com textos genéricos. Estes dados podem ser acrescentados quando existirem, em `assets/js/config.js`:

| Campo | O que acontece ao preencher |
|---|---|
| `email` | Aparece na seção Contato e no rodapé |
| `address` | Substitui "Informado no agendamento pelo WhatsApp" e exibe o mapa do Google |
| `instagram` | Aparece o link do Instagram no rodapé |

Enquanto um campo estiver entre colchetes (ex.: `"[EMAIL]"`), o item fica oculto no site.

Textos genéricos que podem ser trocados em `index.html`: biografias dos profissionais (seção Profissionais) e horário de atendimento (seção Contato).

A antiga seção de depoimentos virou **"Como funciona"** (3 passos para agendar). Se no futuro quiser mostrar avaliações, use somente avaliações reais de pacientes, com autorização.

Os títulos seguem o texto do briefing ("Dr. Alexsandra Prado", "Dr. Antônio Prado"). Se preferir "Dra.", faça uma busca e troque em `index.html`.

## WhatsApp

O número já está configurado: **(79) 99809-6738** (`5579998096738`). Todos os botões de agendamento, o botão flutuante e os links dos cards de serviço (que já abrem a conversa com uma mensagem sobre o serviço) usam o valor de `assets/js/config.js`.

## Google Maps

Com o endereço preenchido em `config.js`, o mapa aparece sozinho na seção Contato (sem endereço, ele fica oculto). Ele só carrega quando o visitante rola até perto dele, para não pesar no carregamento. Para usar exatamente o pino da clínica no Google, cole em `mapsEmbedUrl` a URL de Google Maps → Compartilhar → Incorporar um mapa (apenas o valor de `src="..."`).

## SEO

- Título e descrição otimizados para "dentista em Itabaiana", "clínica odontológica em Itabaiana", Aracaju, Nossa Senhora da Glória, Nossa Senhora Aparecida, implante dentário em Sergipe, endodontia, prótese dentária, odontopediatria, cirurgia oral menor e urgência odontológica.
- Dados estruturados `schema.org/Dentist` com serviços e cidades atendidas. Quando o endereço estiver definido, vale acrescentar `"address"` no bloco JSON-LD do `index.html`.
- Quando tiver domínio: em `index.html`, descomente `canonical` e `og:url` e troque `og:image` / `twitter:image` por URLs absolutas (ex.: `https://www.seudominio.com.br/assets/img/og-image.jpg`).
- Recomendado: criar e verificar o Perfil da Empresa no Google (Google Meu Negócio) com o mesmo nome, telefone e endereço.

## Animações

As animações são suaves e ficam em `assets/css/styles.css` ("Animações de entrada") e `assets/js/main.js`:

- **Entrada ao rolar:** as seções surgem em sequência, com variações por classe: `reveal` (sobe), `reveal--left` / `reveal--right` (laterais), `reveal--zoom`, `reveal--rise` e `reveal--clip` (painel de contato se abre).
- **Ícones "desenhados":** os ícones dos serviços, diferenciais, cidades e contato se desenham ao aparecer, com um leve "pop".
- **Detalhes:** barra de progresso de leitura no topo, contadores no hero (8 · 4 · 2), brilho sutil sobre a foto, pinos das cidades que "caem" no lugar e linha dos subtítulos que cresce.
- **Parallax suave** na foto do hero e nas formas decorativas das seções azuis (apenas em telas a partir de 768 px).
- **Menu inteligente:** destaca a seção que está na tela.

Tudo usa apenas `transform`/`opacity` (leve para o celular) e é desativado automaticamente para quem ativou "reduzir movimento" no sistema.

## Imagens

A foto da equipe foi otimizada em WebP (26–57 KB) com JPG de reserva, em dois tamanhos (560 e 896 px). 
