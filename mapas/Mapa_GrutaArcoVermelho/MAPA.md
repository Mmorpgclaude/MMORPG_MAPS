# Gruta do Arco Vermelho — id proposto `ga` (lugar de dentro)

- **Nome:** Gruta do Arco Vermelho
- **Id:** `ga` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro** (caverna) do Acampamento dos Nômades (`nd`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** **160 × 120 tiles** (2560 × 1920 px; aumentada a pedido do Ricardo para salões de caça maiores). O `preview.py` dá "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `gruta_arco.js`, função `redArchCave()`. As duas cavernas do Acampamento saem do mesmo molde
  (`visualizador_ferramentas/gera_cavernas.py` no repositório): mesmo pintor, mesmo shader, cores próprias.
- **Chão:** `ga_floor.gdshader`, porte linha a linha do pintor de caverna (o kit não tem chão de caverna do Deserto; o
  pintor do Deserto é de área aberta). Usa só `gen_common.gdshaderinc`. Conferido no Godot 4.7.2 contra a `floor_ref.png`:
  **99,999 %** dos pixels com diferença ≤ 2, PSNR **74-76 dB**.
- **`gen_data`:** R = andável, G = distância até o caminho principal × 10, B = tipo × 40 (0 chão de arenito com cascalho,
  1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto).
- **Efeitos:** `fx_ga.gd` (`extends "res://scripts/fx_base.gd"`): poeira flutuando, areia escorrendo do teto, fogo da
  fogueira (`fx.fire`, igual ao `fx_dx.gd`) e brilho das lanternas (`fx.lamp`).
- **Sem animais:** nada de bichos nem ossadas (pedido do Ricardo).

## Entrada e saída

- **Entra:** pela porta do arco de pedra (rock_arch) no paredão norte do Vale das Areias Vermelhas, tiles (112-113, 12) do Acampamento dos Nômades. Chega aqui em **Entrada da Gruta (60, 115)** (px: 968, 1840).
- **Sai:** pela **borda sul, colunas 56-63** (8 tiles): `{k:'edge', m:'nd', x, y}` — volta para o Acampamento na frente da
  porta, no tile (112, 14). O gatilho leva `x` **e** `y` (é a volta de uma porta, não uma passagem entre mapas abertos).
- O formato da porta no jogo não está no kit: no Acampamento ela vem no campo extra `doors` do gerador (tiles, destino e
  ponto de chegada). O Claude do jogo liga no formato do jogo.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Gruta do Arco Vermelho (túneis) | |
| 1 | Entrada da Gruta (60, 110) | acampamento dos exploradores encostado na parede |
| 2 | Galeria (64, 88) | encontro dos túneis |
| 3 | Salão Oeste (24, 80), **caça** | ~36 × 28 tiles, vazio no meio |
| 4 | Salão das Pedras (28, 40), **caça** | ~40 × 30 tiles |
| 5 | Salão Central (78, 46), **caça** | ~36 × 26 tiles |
| 6 | Salão Leste (130, 44), **caça** | ~44 × 32 tiles |
| 7 | Salão Sudeste (124, 92), **caça** | ~44 × 28 tiles |
| 8 | Câmara do Fundo (78, 12) | a câmara do marco da gruta (vai receber o poço de areia da folha nova) |

## Planta (pedido do Ricardo: pouca poluição)

Salões largos; o meio de cada salão fica livre para caçar e os enfeites ficam só encostados nas paredes.
A arte do interior vai ser trocada pela folha nova (`PROMPT_ASSETS_INTERIOR_CAVERNAS.md`) quando ela chegar.

## Luzes (`dark`)

A caverna é escura: 1 fogueira (raio 140) e as lanternas (raio 120) iluminam os salões e os túneis.

## Destinos sugeridos para o teleporte

- **Entrada da Gruta (60, 112)**
- **Salão Leste (130, 44)**

## Arte

Só peças prontas do kit (`exemplo_deserto/arte/`), em `arte/`: rock_red, rock_red2, rock_s, rock_m, rock_tall, rock_big, pebbles, goods, jar, firepit, lamppost. Registro: `pecas_folha_ruinas.json` e
`pecas_folha_caravanas.json` (copiados do kit).

Os 5 salões de caça são ligados entre si por túneis largos (dá para circular sem voltar à entrada). Em cada um: só 2 tochas
e até 3 rochedos colados na parede.
