# Gruta do Arco Vermelho — id proposto `ga` (lugar de dentro)

- **Nome:** Gruta do Arco Vermelho
- **Id:** `ga` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro** (caverna) do Acampamento dos Nômades (`nd`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** 120 × 90 tiles (1920 × 1440 px). O `preview.py` dá "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `gruta_arco.js`, função `redArchCave()`. As duas cavernas do Acampamento saem do mesmo molde
  (`visualizador_ferramentas/gera_cavernas.py` no repositório): mesmo pintor, mesmo shader, cores próprias.
- **Chão:** `ga_floor.gdshader`, porte linha a linha do pintor de caverna (o kit não tem chão de caverna do Deserto; o
  pintor do Deserto é de área aberta). Usa só `gen_common.gdshaderinc`. Conferido no Godot 4.7.2 contra a `floor_ref.png`:
  **99,9999 %** dos pixels com diferença ≤ 2, PSNR **79,7 dB**.
- **`gen_data`:** R = andável, G = distância até o caminho principal × 10, B = tipo × 40 (0 chão de arenito com cascalho,
  1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto).
- **Efeitos:** `fx_ga.gd` (`extends "res://scripts/fx_base.gd"`): poeira flutuando, areia escorrendo do teto, fogo da
  fogueira (`fx.fire`, igual ao `fx_dx.gd`) e brilho das lanternas (`fx.lamp`).
- **Sem animais:** nada de bichos nem ossadas (pedido do Ricardo).

## Entrada e saída

- **Entra:** pela porta do arco de pedra (rock_arch) no paredão norte do Vale das Areias Vermelhas, tiles (112-113, 12) do Acampamento dos Nômades. Chega aqui em **Entrada da Gruta (60, 84)** (px: 968, 1360).
- **Sai:** pela **borda sul, colunas 56-63** (8 tiles): `{k:'edge', m:'nd', x, y}` — volta para o Acampamento na frente da
  porta, no tile (112, 14). O gatilho leva `x` **e** `y` (é a volta de uma porta, não uma passagem entre mapas abertos).
- O formato da porta no jogo não está no kit: no Acampamento ela vem no campo extra `doors` do gerador (tiles, destino e
  ponto de chegada). O Claude do jogo liga no formato do jogo.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Gruta do Arco Vermelho (túneis) | |
| 1 | Entrada da Gruta (60, 80) | acampamento dos exploradores |
| 2 | Galeria Vermelha (58, 57) | rochedos vermelhos nos lados |
| 3 | Salão das Pedras (28, 30), **caça** | |
| 4 | Salão do Eco (90, 28), **caça** | |
| 5 | Fenda Funda (96, 66), **caça** | |
| 6 | Covil Arenoso (22, 70), **caça** (os salões de caça | largos e vazios no meio, rochedos só na beirada) |

## Luzes (`dark`)

A caverna é escura: 1 fogueira (raio 140) e 12 lanternas (raio 120) iluminam os salões e os túneis.

## Destinos sugeridos para o teleporte

- **Entrada da Gruta (60, 84)**
- **Salão do Eco (90, 30)**

## Arte

Só peças prontas do kit (`exemplo_deserto/arte/`), em `arte/`: rock_red, rock_red2, rock_s, rock_m, rock_tall, rock_big, pebbles, goods, jar, firepit, lamppost. Registro: `pecas_folha_ruinas.json` e
`pecas_folha_caravanas.json` (copiados do kit).
