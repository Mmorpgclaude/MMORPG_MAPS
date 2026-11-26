# Lago Subterrâneo — id proposto `lg` (lugar de dentro)

- **Nome:** Lago Subterrâneo
- **Id:** `lg` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro**, embaixo da Gruta do Arco Vermelho (`ga`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** 180 × 140 tiles (2880 × 2240 px). O `preview.py` dá "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `lago_subterraneo.js`, função `lakeCave()` — o molde das cavernas do Acampamento (mesmo pintor, cores da
  Gruta) com um tipo de chão a mais: **4 = água funda** (não se anda).
- **Chão:** `lg_floor.gdshader` = o shader da Gruta + a água (porte linha a linha). Conferido no Godot 4.7.2:
  **99,9995 %** dos pixels com diferença ≤ 2, PSNR **71,0 dB**.
- **`gen_data`:** R = andável, G = distância × 10, B = tipo × 40 (0 arenito, 1 areia, 2 lajes, 3 rocha, 4 água).
- **Efeitos:** `fx_lg.gd` (igual ao `fx_ga.gd`: poeira, areia do teto, fogueira, lanternas).
- **Sem animais.** Pouca poluição: enfeites só nas paredes; o meio dos salões e da margem fica livre para caçar.

## Entrada e saída (a escada de corda)

- **Entra:** pela escada de corda na **Câmara do Fundo da Gruta** (`ga`): porta nos tiles (76-80, 7), campo `doors` do
  gerador da Gruta. Chega aqui na **Chegada (60, 126)** (px: 968, 2016).
- **Sai:** pelo pé da escada, a **borda sul, colunas 56-63**: `{k:'edge', m:'ga', x, y}` — volta para a Câmara do Fundo
  da Gruta, no tile (78, 14).
- A escada é uma **porta**: o jogo é plano, ninguém sobe ou desce de verdade.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Lago Subterrâneo | túneis e rocha |
| 1 | Chegada (60, 128) | o pé da escada e o acampamento dos exploradores |
| 2 | Margem Sul (90, 112) | o barco amarrado e a passarela para a ilhota |
| 3 | Gruta Oeste (36, 100), **caça** | salão grande, vazio no meio |
| 4 | Gruta Leste (146, 100), **caça** | idem |
| 5 | Salão dos Cristais (30, 40), **caça** | idem (vai receber os cristais âmbar) |
| 6 | Praia Escura (152, 36), **caça** | idem |
| 7 | Margem Norte (92, 14), **caça** | idem |
| 8 | Margens do Lago, **caça** | a margem larga em volta do lago, as duas ilhas e a ilhota |

O lago (água funda) fica no meio, com duas ilhas ligadas às margens leste e oeste por uma **passarela reta de tábuas**
(plana, no `ov`, por onde se anda) e uma ilhota ligada à Margem Sul.

## Destinos sugeridos para o teleporte

- **Chegada:** (60, 126)
- **Margens do Lago (ilha oeste):** (76, 56)

## Arte (provisória)

Peças do kit em `arte/` (`lamppost`, `firepit`, `goods`, `rock_m`, `rock_tall`, `rowboat`, `mooring`, `ropes`) até chegar
a folha do Lago (`../Mapa_GrutaArcoVermelho/PROMPT_ASSETS_LAGO.md`): as duas peças da escada de corda, cristais âmbar,
estalagmites, pedras da margem, barco, píer e tochas. A planta não muda quando a arte chegar.
