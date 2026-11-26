# Acampamento dos Nômades (`nd`) — prompt de assets (folha nova, opcional)

A primeira versão do mapa foi montada só com as 62 peças prontas do Deserto (kit). Esta folha dá ao acampamento uma arte
própria: a tribo viva que mora fora dos muros de Al-Sahrah (as peças do kit são de um acampamento **abandonado**, com
tendas rasgadas). **Sem animais** (pedido do Ricardo): nada de bichos, cercados, selas, ossadas ou couro de animal à vista.

O chão do Deserto já está pronto (cor 5b, seção 12.2 do guia): **não há atlas de terreno**, só a folha de objetos.

## Prompt: folha de objetos (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **acampamento de uma tribo nômade do deserto das Mil e Uma Noites**, vivo e acolhedor, cores de tecidos tingidos
> contra a areia, sol forte.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta quente e dessaturada: areia (#c8a46a, #dcbc84,
> #ecd6a4), sombra (#8a6a42, #a8834e), madeira seca (#5a3e26 a #9a7448), lona e linho cru (#cbb894, #e6d8b8), barro
> (#9a5a36, #c07a4a); tecidos tingidos em tons fortes porém gastos: índigo (#2e3e6e, #4a5e96), vermelho-garança
> (#8a2a22, #b84432), açafrão (#c88a1a, #e8b03a), turquesa (#1e7a74, #3aa49a); cor saturada só em pequenos brilhos
> (fogo, latão, contas). Contorno escuro de 1 px, sombreamento detalhado, sem anti-aliasing borrado.
> **Cada objeto desenhado sozinho, SEM piso, tapete ou plataforma embaixo, e nada de escadas ou degraus.**
> **Nenhuma chama com brilho ou halo desenhado em volta** (o jogo faz o brilho).
> **Nenhum animal**: sem bichos, sem selas, sem ossos, sem couro com pelo.
> Cada objeto separado, sem sobrepor, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **A tenda do chefe:** tenda beduína grande e inteira (cerca de 12 tiles de largura e 8 de altura), lona listrada em
>   índigo e açafrão, franjas e borlas na beirada, a entrada aberta com cortinas presas, estacas e cordas;
> - **Tendas da tribo:** 3 tendas menores inteiras (cerca de 7 tiles de largura), cada uma de uma cor (vermelho-garança,
>   turquesa, linho cru com faixas), entrada aberta;
> - **A fogueira grande:** anel de pedras com lenha e chamas pequenas, um tripé de ferro com caldeirão pendurado;
>   **fogueira pequena** com bule de latão;
> - **Vida da tribo:** varal com tecidos tingidos pendurados secando (cerca de 5 tiles), tear de madeira com um tapete
>   pela metade, pilha de tapetes enrolados, almofadas e banquinhos baixos (soltos, sem tapete embaixo), mesa baixa com
>   bule e copos de latão;
> - **Mercado da tribo:** barraca de especiarias com toldo listrado (sem balcão no chão), sacos de grãos e especiarias
>   abertos (açafrão, pimenta, tâmaras), cestos de vime, ânforas e potes de barro, odres de água pendurados num cavalete;
> - **Luz:** poste de madeira com lanterna de latão perfurada pendurada (2 alturas), lanternas soltas no chão;
> - **Estandarte da tribo:** mastro alto com flâmula índigo e o símbolo da tribo (sol e lua) em açafrão;
> - **Poço da tribo:** poço de pedra com cobertura de lona em 4 varas e balde de madeira na corda;
> - **Tapete do chefe estendido** plano, visto de cima (cerca de 6 × 4 tiles), sozinho: **vai para a camada de chão**
>   (o jogador anda por cima).

## Como o Claude usa

- O chão continua o do Deserto (cor 5b, pronto no kit): esta folha traz só objetos.
- As peças novas substituem as do acampamento abandonado (tendas rasgadas) no Círculo das Tendas e no Poço; o resto
  do mapa (rochedos, cactos, estrada) continua com as peças do kit.
- O tapete estendido entra no `ov` (camada de chão), como o guia manda para peças planas.
- Guarde a imagem numa pasta `Assets_Nomades\`.
