# Visual novo do Deserto: Mar de Areia (`dm`), Travessia das Dunas (`dn`) e Porto das Areias (`dp`)

Os três mapas abertos do Deserto, embaixo de Al-Sahrah (`dq`), passam a 150×120 (Etapa 1) e ganham a arte das folhas
do Ricardo (Etapa 2), recortada fiel, como na Geleira e em Utgard. Al-Sahrah continua como está.

## O que tem em cada mapa

| Mapa | Áreas | O que tem |
|---|---|---|
| **Mar de Areia** (`dm`) | Cidade Soterrada, Leito do Leviatã, Bosque de Cactos, Cemitério de Caravanas, Poço Seco | ruínas de arenito meio enterradas, a ossada gigante do leviatã, cactos, carroças e camelos mortos, poço de pedra seco |
| **Travessia das Dunas** (`dn`) | Dunas Antigas, Acampamento Abandonado, Vale dos Ossos, Círculo dos Obeliscos | rochedos de arenito, tendas rasgadas, ossadas, obeliscos com hieróglifos |
| **Porto das Areias** (`dp`) | O Cais, Praia Deserta, Estrada das Dunas | cais de madeira, barcos, redes, palmeiras, barracas do mercado do porto |

Tudo plano: **nada de escadas, rampas, plataformas ou pontes em arco** por onde o jogador anda (o jogo não tem altura).
Objetos **sem chão desenhado embaixo** (sem areia, tapete ou piso junto da peça): o chão é feito no código.

## Prompt 1: folha de objetos, natureza e ruínas (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **deserto antigo das Mil e Uma Noites**, sol forte, calor, mistério de civilizações enterradas.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada: areia (#c8a46a, #dcbc84,
> #ecd6a4), areia escura e sombra (#8a6a42, #a8834e), arenito ocre e rosado (#9a6a48 a #d09a6a), pedra calcária clara
> (#b8aa90 a #e6dcc4), madeira seca (#5a3e26 a #9a7448), osso (#d8ccb0, #f0e8d4), verde-oliva seco nos cactos e palmeiras
> (#5a6a34 a #8e9a50); cor saturada só em pequenos brilhos (turquesa, ouro). Contorno escuro de 1 px, sombreamento
> detalhado, sem anti-aliasing borrado. Cada objeto separado, sem sobrepor, **sem chão desenhado embaixo**, sobre fundo
> cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **Rochedos de arenito** em camadas erodidas pelo vento (4 tamanhos, do pequeno a um de 6 tiles), pedras soltas,
>   um arco natural de pedra (só enfeite, o jogador passa ao lado);
> - **Ruínas da Cidade Soterrada:** colunas de arenito inteiras e quebradas, pedaços de muro com relevos, uma cabeça de
>   estátua gigante tombada, um portal antigo meio enterrado, um obelisco alto com hieróglifos, jarros quebrados;
> - **A ossada do leviatã:** crânio enorme de uma criatura marinha (cerca de 8 tiles), costelas soltas em arco (3 peças),
>   vértebras soltas; ossadas pequenas de camelo e de boi;
> - **Natureza:** cactos (saguaro em 3 tamanhos, cacto redondo, cacto em flor), arbustos secos, tufos de capim seco,
>   palmeiras (2 tamanhos), árvore seca retorcida, caveira de animal com chifres;
> - **Poço seco** de pedra com roldana quebrada e balde.

## Prompt 2: folha de objetos, caravanas e porto (1536 × 1024)

> Mesma visão, tile, luz, paleta e regras do Prompt 1 (objetos separados, sem chão embaixo, fundo cinza-escuro liso).
> Objetos:
> - **Cemitério de Caravanas:** carroça de madeira tombada e quebrada, roda solta, baús e sacos rasgados, camelo morto
>   (ossada com sela), estandarte rasgado num mastro;
> - **Acampamento abandonado:** tenda beduína rasgada (de lado, sem tapete embaixo), fogueira apagada com pedras,
>   jarros de barro, tapete enrolado, caixotes;
> - **Estrada:** marcos de pedra com placa de madeira, lanterna de ferro num poste, pilha de pedras de caminho;
> - **Porto:** barco a vela pequeno ancorado (visto de cima), bote de remo, redes de pesca penduradas num varal,
>   barris, cordas enroladas, postes de amarração, barraca de mercado do porto com toldo listrado (sem balcão no chão),
>   cestos de peixe, âncora velha.

## Prompt 3: atlas do terreno (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para um **deserto antigo**, com a mesma
> paleta quente e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: areia lisa com ondulações do
> vento; dunas com crista e lado na sombra (vistas de cima, planas); areia batida da estrada com pegadas de camelo;
> chão rachado de barro seco; laje de pedra antiga meio coberta de areia; cascalho; areia molhada da praia e espuma;
> água rasa turquesa do porto.

## Como o Claude usa

- O chão é gerado na placa de vídeo: o atlas serve de referência de cor e textura para o pintor JS e o shader.
- Os objetos entram nos geradores, fiéis à folha (recorte pelo contorno, 128 cores).
- Guarde as três imagens numa pasta `Assets_Deserto\` em `D:\Downloads\MMORPG\VIKING\VALDORIA\`.
