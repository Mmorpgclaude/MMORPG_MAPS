# Tumba do Rei da Areia — id proposto `tr` (lugar de dentro)

- **Nome:** Tumba do Rei da Areia
- **Id:** `tr` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro**, embaixo do Templo Soterrado (`ts`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** 160 × 120 tiles (2560 × 1920 px). O `preview.py` dá "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `tumba_rei_areia.js`, função `sandKingTomb()` — o molde das cavernas do Acampamento
  (`visualizador_ferramentas/gera_cavernas.py`), com cores de pedra mais escuras.
- **Chão:** `tr_floor.gdshader` (o mesmo shader de caverna, cores da Tumba). Conferido no Godot 4.7.2: **99,9996 %** dos
  pixels com diferença ≤ 2, PSNR **73,9 dB**.
- **Efeitos:** `fx_tr.gd` (igual ao `fx_ts.gd`: poeira, areia caindo do teto, fogo dos braseiros, raio de luz).
- **Sem animais.** Pouca poluição: enfeites só nas paredes; o meio dos salões de caça fica livre.

## Entrada e saída

- **Entra:** pela **boca natural de caverna** (recortada da imagem de referência do Ricardo: `Assets_Tumba/referencia_passagem.png` → `arte/passagem_boca.png`, metade do tamanho, 128 cores, simétrica: o lado direito espelhado no esquerdo; cantos rebaixados e tingidos com a cor da parede, e a parede norte avançada dos dois lados da boca para a peça encaixar) na parede norte da **Galeria Norte do Templo
  Soterrado**: porta nos tiles (104-108, 6) do Templo (campo `doors`). Chega aqui na **Antecâmara (60, 115)** (px: 968, 1840).
- **Sai:** pela **borda sul, colunas 56-63**: `{k:'edge', m:'ts', x, y}` — volta para a Galeria Norte do Templo, no tile
  (106, 9), na frente da porta.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Tumba do Rei da Areia | túneis |
| 1 | Antecâmara (60, 108) | os blocos da porta selada caídos e dois braseiros |
| 2 | Corredor dos Nichos (60, 82) | colunas coladas nas paredes e jarros funerários |
| 3 | Câmara Funerária Oeste (24, 88), **caça** | vazia no meio; braseiros e areia caindo nas paredes |
| 4 | Câmara Funerária Leste (102, 92), **caça** | idem |
| 5 | Salão das Oferendas (24, 46), **caça** | idem |
| 6 | Salão dos Servos (100, 50), **caça** | idem |
| 7 | Cripta Profunda (141, 72), **caça** | idem, a mais a leste |
| 8 | Salão do Sarcófago (60, 24) | o **sarcófago dourado** do rei sobre um pedestal, com a tampa meio aberta e brilho saindo de dentro, um raio de luz caindo do teto, quatro vasos, dois obeliscos, braseiros, moedas e poeira dourada no ar |

Os 5 salões de caça são ligados em anel pelos dois lados do corredor central.

## O que tem na tumba (sem atrapalhar a caça)

Desenhados no código, provisórios até a arte do interior (`PROMPT_ASSETS_INTERIOR_CAVERNAS.md`, seção da Tumba):
- **Nichos funerários com múmias** encostados nas paredes do norte das Câmaras Funerárias e da Cripta Profunda (colisão no pé).
- **O sarcófago dourado** no Salão do Sarcófago (colisão no pedestal), com os vasos dos lados.
- **Estátuas de servos ajoelhados** nas paredes e na beirada do Salão dos Servos (colisão no pé).
- **Hieróglifos dourados** que acendem e apagam devagar na face das paredes (`fx.glyph`, camada de luz).
- **Poeira dourada** subindo em volta do sarcófago (`fx.gold`) e **névoa baixa e fria** nas criptas (`fx.fog`).

## Destinos sugeridos para o teleporte

- **Antecâmara:** (60, 112)
- **Salão do Sarcófago:** (60, 30)

## Arte (provisória)

Peças do kit em `arte/` (`firepit`, `column`, `jar`, `jar_broken`, `statue_head`, `obelisk`, `ruin_wall`...). O sarcófago do
rei, os nichos funerários e as estátuas de guardião vêm do `PROMPT_ASSETS_INTERIOR_CAVERNAS.md`.
