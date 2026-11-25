# Mapa novo do Gelo: Bosque dos Corvos Brancos (id proposto `lc`)

Fica ao norte do Fiorde dos Corvos (`nr`), na posição (-40, -540) do Mapa do Mundo. Tamanho padrão 150×120.
É de onde vêm os corvos que dão nome ao fiorde.

- **Entrada:** só pelo Fiorde dos Corvos, pela **borda sul (colunas 70-80)**, no meio da borda: longe da costa e da cachoeira congelada do Fiorde (lado oeste) e alinhada com a saída sul do Fiorde (colunas 69-75). O Fiorde ganha a mesma faixa (colunas 70-80) na borda norte.
- **Oeste e norte fechados** (paredão de rocha e mata morta densa).
- **Leste fechado** (lá fica o Passo de Hrimfjell `nh`); pode virar passagem no futuro, se o Ricardo quiser.

## O que tem no mapa

| Área | Onde | O que tem |
|---|---|---|
| **Trilha do Fiorde** | sul, na entrada | trilha de terra congelada subindo do fiorde entre pedras com neve e pinheiros mortos |
| **Bosque Branco** | meio | árvores mortas de madeira branca, retorcidas, névoa baixa entre os troncos |
| **Ninhal** | leste | árvores com ninhos enormes de gravetos, corvos pousados, penas pretas no chão |
| **Poço Sagrado** | oeste | poço de pedra antigo com a água congelada, pedras rúnicas e oferendas em volta |
| **Árvore dos Corvos** | norte (o marco) | a árvore morta gigante, coberta de corvos e de oferendas penduradas, com o altar dos corvos no pé |
| **Cabana do Guardião** | noroeste | a cabana abandonada de quem cuidava da árvore, com totens de madeira |

Clima e efeitos (feitos no código, sem asset): névoa baixa rolando, corvos voando em bando em volta da Árvore,
penas caindo, velas tremulando no altar e, à noite, **olhos amarelos piscando no escuro** entre as árvores.
Sem combate, como os outros mapas.

## Prompt 1: folha de objetos (1536 × 1024)

> Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels.
> Tema: **bosque nórdico morto e sagrado dos corvos**, inverno cinzento e silencioso, misterioso e um pouco sombrio,
> mas não de terror.
> Luz vinda do alto à esquerda, sombras curtas embaixo e à direita. Paleta fria e dessaturada: madeira morta
> branco-acinzentada (#6e6a64, #9a958c, #c4beb2, #e6e1d6), casca escura (#2a2626, #46403c), neve cinza-azulada
> (#b4bccb, #d2d9e4, #eaeef4), pedra cinza-esverdeada com musgo seco (#3c4240 a #858c86), corvos preto-azulados
> (#12141c, #252a38, #3c4458), cordas e tecidos vermelhos desbotados (#6e2e2a, #93443a); cor saturada só em pequenos
> brilhos (olhos e velas amarelas #f2c94c, runas azul-claras #8ad4ff). Contorno escuro de 1 px, sombreamento
> detalhado, sem anti-aliasing borrado.
> **Cada objeto desenhado sozinho, SEM piso, tapete ou plataforma embaixo, e nada de escadas ou degraus.**
> Nenhuma chama com brilho ou halo desenhado em volta (o jogo faz o brilho).
> Cada objeto separado, sem sobrepor, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px. Objetos:
> - **A Árvore dos Corvos:** uma árvore morta gigantesca (cerca de 13 tiles de largura e 14 de altura), tronco grosso
>   e retorcido de madeira branca-acinzentada, galhos nus e longos, raízes grossas abertas no pé (sem chão embaixo);
>   uns 12 corvos pousados nos galhos; oferendas penduradas por cordas nos galhos (amuletos de osso, pequenas plaquinhas
>   de madeira com runas, fitas vermelhas desbotadas, penas amarradas); neve no alto dos galhos;
> - **Altar dos corvos:** pedra plana baixa com penas pretas, três velas acesas pequenas e um crânio de cervo com
>   chifres em cima;
> - **Poço sagrado:** anel de pedras antigas com runas, visto de cima em 3/4, com a água congelada dentro (cerca de 4
>   tiles de largura); **duas pedras rúnicas altas** com runas azul-claras apagadas; **estaca de oferendas** (estaca de
>   madeira com amuletos e penas pendurados);
> - **Cabana do Guardião:** cabana pequena de troncos escuros, telhado de madeira com neve, porta fechada, abandonada
>   (cerca de 7 tiles de largura); **dois totens de madeira** entalhados com cabeça de corvo; **pilha de lenha**;
>   **banco de tronco**;
> - **Árvores mortas brancas:** 4 variações (alta e fina; retorcida; quebrada no meio; com um ninho enorme de
>   gravetos no alto), cerca de 3 a 5 tiles de largura e 5 a 7 de altura; **tronco caído** branco; **toco** com cogumelos
>   cinzentos;
> - **Pinheiros mortos escuros:** 2 variações, secos, com pouca agulha e neve;
> - **Ninhal:** **ninho grande de gravetos no chão** com penas (cerca de 2 tiles); **corvos pousados** sozinhos em 3
>   poses (parado, bicando, de asas abertas);
> - **Natureza:** pedras cinzentas com neve (3 tamanhos), arbustos secos e espinhosos (2), raízes retorcidas saindo
>   da neve (2, só as raízes, sem chão), **crânio de cervo** com chifres meio enterrado, tufos de capim seco (2).

## Prompt 2: atlas do terreno (1536 × 1024), só referência de cor e textura

> Atlas de tiles em pixel art, mesma visão top-down 3/4 e tile de 16×16 pixels, para um **bosque nórdico morto no
> inverno**, com a mesma paleta fria e a luz do alto à esquerda. Mostrar em blocos grandes de vários tiles: neve
> cinza-azulada fofa com relevo; neve pisada e suja; trilha de terra congelada escura com pedrinhas; chão do bosque
> com folhas mortas, gravetos e penas pretas sob uma camada fina de neve; gelo escuro de água parada congelada;
> rocha cinza-esverdeada com neve e musgo seco; transição entre neve e terra do bosque.

## Como o Claude usa

- O chão é gerado na placa de vídeo: o atlas serve de referência de cor e textura para o pintor JS e o shader.
- Os objetos entram no gerador novo, fiéis à folha (recortados, sem redesenhar).
- Guarde as duas imagens numa pasta `Assets_BosqueDosCorvos\`.
