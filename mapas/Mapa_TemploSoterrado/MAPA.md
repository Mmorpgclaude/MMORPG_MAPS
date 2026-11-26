# Templo Soterrado — id proposto `ts` (lugar de dentro)

- **Nome:** Templo Soterrado
- **Id:** `ts` (não está na lista dos ids usados)
- **Tipo:** **lugar de dentro** (caverna) do Acampamento dos Nômades (`nd`); aparece só como ícone no Mapa do Mundo.
- **Tamanho:** 120 × 90 tiles (1920 × 1440 px). O `preview.py` dá "AVISO tamanho" (esperado: lugar de dentro).
- **Gerador:** `templo_soterrado.js`, função `buriedTemple()`. As duas cavernas do Acampamento saem do mesmo molde
  (`visualizador_ferramentas/gera_cavernas.py` no repositório): mesmo pintor, mesmo shader, cores próprias.
- **Chão:** `ts_floor.gdshader`, porte linha a linha do pintor de caverna (o kit não tem chão de caverna do Deserto; o
  pintor do Deserto é de área aberta). Usa só `gen_common.gdshaderinc`. Conferido no Godot 4.7.2 contra a `floor_ref.png`:
  **100 %** dos pixels com diferença ≤ 2, PSNR **93,2 dB**.
- **`gen_data`:** R = andável, G = distância até o caminho principal × 10, B = tipo × 40 (0 chão de arenito com cascalho,
  1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto).
- **Efeitos:** `fx_ts.gd` (`extends "res://scripts/fx_base.gd"`): poeira flutuando, areia escorrendo do teto, fogo da
  fogueira (`fx.fire`, igual ao `fx_dx.gd`) e brilho das lanternas (`fx.lamp`).
- **Sem animais:** nada de bichos nem ossadas (pedido do Ricardo).

## Entrada e saída

- **Entra:** pela porta do portal antigo (ruin_gate) no monte de areia ao norte da Planície Escaldante, tiles (121-123, 87) do Acampamento dos Nômades. Chega aqui em **Salão da Entrada (60, 84)** (px: 968, 1360).
- **Sai:** pela **borda sul, colunas 56-63** (8 tiles): `{k:'edge', m:'nd', x, y}` — volta para o Acampamento na frente da
  porta, no tile (122, 89). O gatilho leva `x` **e** `y` (é a volta de uma porta, não uma passagem entre mapas abertos).
- O formato da porta no jogo não está no kit: no Acampamento ela vem no campo extra `doors` do gerador (tiles, destino e
  ponto de chegada). O Claude do jogo liga no formato do jogo.

## Áreas (zonas)

| # | Zona | O que tem |
|---|---|---|
| 0 | Templo Soterrado (túneis) | |
| 1 | Salão da Entrada (60, 80) | acampamento dos exploradores (fogueira, mercadorias, jarro) |
| 2 | Galeria das Colunas (60, 57) | duas filas de colunas |
| 3 | Salão do Ídolo (60, 24) | a cabeça da estátua, quatro obeliscos e dois muros com relevos |
| 4 | Câmara dos Jarros (22, 38) | jarros e mercadorias |
| 5 | Salões Desmoronados (94, 46), **caça** | salão largo e vazio no meio, pedras e colunas caídas só na beirada |
| 6 | Cripta Arenosa (24, 70), **caça** | idem |

## Luzes (`dark`)

A caverna é escura: 1 fogueira (raio 140) e 12 lanternas (raio 120) iluminam os salões e os túneis.

## Destinos sugeridos para o teleporte

- **Salão da Entrada (60, 84)**
- **Salão do Ídolo (60, 32)**

## Arte

Só peças prontas do kit (`exemplo_deserto/arte/`), em `arte/`: column, column_broken, statue_head, obelisk, ruin_wall, jar, jar_broken, shard, goods, firepit, lamppost, rochedos e pedrinhas. Registro: `pecas_folha_ruinas.json` e
`pecas_folha_caravanas.json` (copiados do kit).
