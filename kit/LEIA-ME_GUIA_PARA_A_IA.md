# Kit de mapas do Valdória — guia para a IA que cria mapas

Você vai criar **mapas novos** para o Valdória, um RPG 2D em pixel art (Godot 4.7, vista de cima em 3/4, tile de 16×16 px).
Você **só cria o mapa**: não mexe em mecânica nenhuma do jogo. O Ricardo (o dono) leva o seu mapa para outra IA (o Claude),
que confere se está no padrão e encaixa no jogo. Por isso, siga este guia **exatamente**: é o mesmo processo usado em todos os
mapas novos do jogo (Geleira, Utgard, Ninho do Dragão...).

Responda ao Ricardo sempre em **português**, curto e direto. Quando houver uma escolha de verdade, pergunte antes.

---

## 1. O processo (sempre nesta ordem)

1. **Ideia.** O Ricardo diz onde o mapa fica (ex.: "ao norte de Frostheim") e o tema. Proponha 2-3 ideias curtas (áreas,
   marco principal, clima) e deixe ele escolher.
2. **Prompt de assets.** Escreva o prompt para o Ricardo gerar as imagens (ele gera numa IA de imagem). Sempre duas folhas
   de **1536 × 1024**: a **folha de objetos** e o **atlas do terreno** (só referência de cor e textura). Modelo:
   `exemplo_geleira/PROMPT_ASSETS_GELEIRA.md`. Regras do prompt na seção 4.
3. **Conferir as folhas** que ele mandar: todas as peças pedidas vieram? estão na vista certa? alguma tem chão ou plataforma
   desenhado embaixo (aí precisa dividir)? Se faltar algo, peça só o que falta, com a folha atual como referência.
4. **Recortar a arte** com `ferramentas/recorta_folha.py` (seção 5). Sai com **no máximo 128 cores**, transparência binária
   e sem os vãos de fundo.
5. **Escrever o gerador** do mapa em JavaScript (seção 6), **o shader do chão** (seção 7) e **os efeitos** (seção 8).
6. **Conferir** com `ferramentas/preview.py` (seção 9): tudo OK no relatório, e olhar a prévia de verdade.
7. **Entregar** a pasta do mapa (seção 10).

---

## 2. Tamanho e encaixe dos mapas (o padrão)

- **Toda área aberta nova tem 150 × 120 tiles** (2400 × 1920 px). É o que faz o mundo virar uma grade: cada mapa encaixa ao
  lado dos outros no Mapa do Mundo. Na grade do Gelo, cada célula anda **150 tiles no X e 120 no Y**.
- **Passagens:** ficam nas **bordas**, numa faixa de **7 a 11 tiles** (normalmente 11, ou 7), e o mapa vizinho abre **a mesma
  faixa, na mesma posição, na borda oposta** (ex.: este mapa abre a borda oeste nas linhas 56-66; o vizinho abre a borda leste
  nas linhas 56-66). Deslocamento entre os dois = 0.
- **Lugares de dentro** (masmorras, casas, cavernas): podem ter **qualquer tamanho** (ex.: 120 × 90, 200 × 160). A entrada é
  uma **porta** no mapa de fora; eles aparecem só como ícone no Mapa do Mundo.
- Bordas sem passagem ficam **fechadas** (paredão, rocha, mata densa, água).

### Mapas que existem hoje (tamanho em tiles, posição no mundo em tiles, e passagens)

A posição é o canto de cima à esquerda do mapa no Mapa do Mundo (x cresce para a direita, y cresce para baixo).
Veja também `referencia_jogo/mapa_do_mundo.png` e `referencia_jogo/world.json`.

**Reino do Gelo (região N) — a grade 150 × 120:**

| id | Mapa | Tamanho | Posição (x, y) | Passagens |
|---|---|---|---|---|
| nh | Passo de Hrimfjell | 150×120 | 110, -540 | sul (colunas 69-75) → Vale dos Lobos |
| nr | Fiorde dos Corvos | 150×120 | -40, -420 | sul (colunas 69-75) → Charneca |
| nv | Vale dos Lobos | 150×120 | 110, -420 | norte (69-75) → Passo; sul (135-142) → Frostheim |
| gj | Geleira do Gigante Adormecido | 150×120 | 260, -420 | sul (84-94) → Floresta; leste (linhas 56-66) → Utgard |
| ug | Ruínas de Utgard | 150×120 | 410, -420 | oeste (56-66) → Geleira; leste (56-66) → Ninho do Dragão |
| dg | Ninho do Dragão de Gelo | 150×120 | 560, -420 | oeste (56-66) → Utgard |
| ny | Charneca de Ymir | 150×120 | -40, -300 | norte (69-75) → Fiorde dos Corvos; leste (98-104) → Frostheim |
| nc | Frostheim (a cidade do Gelo) | 150×120 | 110, -300 | oeste (98-104); norte (135-142); leste (96-104) |
| nn | Floresta dos Pinheiros | 150×120 | 260, -300 | oeste (96-104); norte (84-94) → Geleira; leste (45-55) → Fiorde |
| nf | Fiorde Congelado | 150×120 | 410, -300 | oeste (linhas 45-55) → Floresta |

**Fundo do Mar (região W) — a grade 150 × 120:** cn (-750, 300), at (-600, 300), rc (-450, 300), rs (-300, 300),
rp (-450, 420), fa (-450, 540) — todos 150×120.

**Outras regiões (mapas antigos, tamanhos livres):** Umbrafell `c` 168×124 (0, 0); Deserto dq/dm/dn/dp; Cidade dos Piratas
`sv` 150×120; Ilha de Brasa `ib` 210×176; mapas de Umbrafell de 96×72 a 300×218.

**Lugares de dentro feitos no padrão novo:** Salões dos Gigantes `us` 120×90 (porta no portão de Utgard), Ninho da Serpente
`sn` 200×160 (porta na toca da serpente, na Fossa).

**Exemplo de encaixe:** um mapa "ao norte de Frostheim" já existe (é o Vale dos Lobos). Um mapa novo **a leste do Fiorde
Congelado** ficaria em (560, -300), com a borda oeste aberta numa faixa que o Fiorde também abriria na borda leste.
O Claude ajusta o vizinho; você só precisa dizer **em que borda e em que linhas/colunas** fica cada passagem do seu mapa.

**Ids já usados (não repita):** a ab at b bk bn bq c cn cp cs ct1 ct2 ct3 dg dm dn dp dq e f fa gd gj gm gn gq ib j k l m mv
nc nf ng nh nm nn np nr nv ny p q rc rp rs s sk sn sv t u ug us w wl x y1 y2. Proponha um id novo de 2 letras.

---

## 3. Estilo visual

- **Pixel art escura e detalhada**, vista de cima em 3/4, **luz vinda do alto à esquerda**, sombras curtas embaixo e à direita.
- Paletas em rampas dessaturadas; cor saturada só em brilhos pequenos (fogo, cristais, olhos, lanternas).
- **O jogo é PLANO.** Não existe altura. **Nada com relevo por onde o jogador anda**: nada de pontes em arco, escadas,
  degraus, plataformas elevadas, muros que se sobem. O jogador "anda por cima da imagem", e fica parecendo que ele está
  dentro da peça. Passagens sobre abismo/água são **planas, vistas de cima**, no nível do chão (pode desenhar no código).
  Peças com relevo só como **enfeite**, com colisão no pé, onde o jogador não sobe.
- **Uma peça com chão desenhado junto** (tapete, piso, plataforma, neve embaixo) não pode ser uma peça só: o chão vai para a
  camada de chão (`ov`) e o resto vira objeto com colisão no pé. Por isso o prompt pede objetos **sem piso embaixo**.
- **Fidelidade:** os objetos do mapa são **a própria arte da folha, recortada** (não redesenhe). O chão é **pintado no código**
  imitando o atlas.
- Nada solto sem sentido: pedras soltas no meio do caminho, ovos flutuando sobre um abismo, pegadas gigantes isoladas etc. O
  Ricardo reprova. Enfeites ficam **perto das paredes e das bordas**, longe das trilhas e dos abismos.

---

## 4. Regras do prompt de assets

Copie a estrutura de `exemplo_geleira/PROMPT_ASSETS_GELEIRA.md`. Sempre incluir:

- "Folha de sprites em pixel art para um RPG 2D visto de cima em 3/4 (top-down levemente inclinado), tile de 16×16 pixels."
- A paleta em códigos hex (rampas), a luz do alto à esquerda, "contorno escuro de 1 px, sombreamento detalhado, sem
  anti-aliasing borrado".
- **"Cada objeto desenhado sozinho, SEM piso, tapete ou plataforma embaixo, e nada de escadas ou degraus."**
- **"Pontes e passagens planas, vistas de cima"** (se o mapa tiver).
- "Cada objeto separado, sem sobrepor, sobre fundo cinza-escuro liso, alinhado a uma grade de 16 px."
- A lista dos objetos com tamanho aproximado em tiles para os grandes (marco do mapa: ~12-14 tiles de largura).
- O atlas: "só referência de cor e textura", com os terrenos em blocos grandes.
- No fim: "Guarde as duas imagens numa pasta `Assets_<Nome>\`".

---

## 5. Recortar a arte (128 cores)

```
python ferramentas/recorta_folha.py achar <folha de objetos.png> caixas.png
```
Abre `caixas.png`, veja o número e o centro de cada peça e escreva o `pecas.json` (modelo: `exemplo_geleira/pecas_geleira.json`):
```
{"giant": [[210, 200], 0.68], "pine1": [[80, 880], 0.45], ...}
```
- o ponto é **qualquer pixel dentro da peça** na folha; o fator reduz a peça (a folha tem "pixel" de ~2 px, então **0,45 a 0,5**
  devolve quase o pixel original). Use o **mesmo fator** para peças que precisam ficar na mesma escala.
- Escala de referência: o jogador tem **~32 px de altura**. Uma porta tem que ser mais alta que ele; um pinheiro ~70-100 px;
  um marco gigante ~200-270 px.
```
python ferramentas/recorta_folha.py recortar <folha.png> pecas.json <pasta do mapa>/arte
```
Sai cada peça em `arte/<nome>.png`: **no máximo 128 cores** (obrigatório — corta ~70% do peso), transparência 0/255, vãos de
fundo removidos. Confira as peças numa imagem antes de usar. Peça com o escuro de propósito (um arco escuro, um buraco) pode
sair furada: nesse caso a IA ajusta à mão (como o buraco do ninho no Ninho do Dragão).

---

## 6. O gerador do mapa (JavaScript)

Um arquivo `<nome>.js` com **uma função** (ex.: `function iceDragon(){...}`) que devolve o mapa pronto. Modelo completo e
comentado: `exemplo_geleira/glacier_giant.js` (estude ele inteiro antes de começar).

**Pode usar** (vêm de `ferramentas/kit_base.js`): `hq(a,b)` (sorteio), `mk`, `cmCv(w,h)` → `[canvas, f(cor,x,y,w,h), ctx]`,
`ufP(f)` → `{ell, poly, line}`, e `ART[nome]` (as imagens recortadas). **Não pode usar** `Math.random`, `Date`, nem nada
aleatório: o mapa tem que sair **idêntico** toda vez (o preview confere).

**O que a função devolve** (exatamente estes campos):
```
return {gen:{data:<gen_data em dataURL>, ov:<camada de cima do chão em dataURL>}, W, H,
  floor:<chão inteiro em dataURL, W*16 × H*16>, S:<array W*H, 1 = bloqueado>,
  ents:[{x,y,z,sw,sh,lb,url}...], fx:{...}, dark:[[x,y,raio,força]...],
  zones:{names:[...], z:<array W*H com o índice da zona>},
  portals:{trig:[...], cells:[x,y,i, x,y,i, ...]}}
```
- **Tile = 16 px.** Coordenadas de objetos em pixels; colisão, zonas e passagens em tiles.
- **`ents`**: cada objeto (a arte recortada) com `x` (esquerda, px), `y` (a **base**, px — é por ela que o jogo ordena quem
  fica na frente), `z = y - altura + 2`, `sw/sh` (tamanho), `url` (a imagem). No exemplo, `place(nome, cx, base, larguraDaColisão,
  linhas)` faz tudo isso e já bloqueia só **o pé** do objeto (nunca a imagem inteira).
- **`S`** (colisão): 1 onde não se anda. Paredões, abismos, água funda e o pé dos objetos.
- **`zones`**: nomes das áreas (aparecem na tela ao entrar) e o índice de cada tile.
- **`portals`** (passagens na borda): `trig` = `{k:'edge', m:'<id do vizinho>', x:..., dy:0}` (borda oeste/leste: `x` = onde
  chega no vizinho, em px) ou `{k:'edge', m:'<id>', y:..., dx:0}` (norte/sul). `cells` = as células da borda que levam a cada
  `trig`. Para mapa **novo** cujo vizinho ainda não conhece a passagem, use o id do vizinho que o Ricardo indicar; o Claude
  confere e acerta os números.
- **`gen.data`** (o `gen_data`, 1 texel por tile): **R** = 255 andável / 0 não; **G** = distância até a trilha × 10;
  **B** = tipo do chão × 40 (até 6 tipos). É o que o shader lê.
- **`gen.ov`**: o que é pintado **por cima do chão e onde se anda** (passagens planas, tapetes, pegadas no chão, mosaicos).
- **`floor`**: o chão pintado pixel a pixel pelo **pintor** (uma função `paint(x,y)` que devolve `[r,g,b]`, usando só `hq`,
  `vn`, `vorC`... e o `gen_data`). O shader é a cópia linha a linha desse pintor.
- **`fx`**: listas de pontos para os efeitos (fogo, névoa, brilhos, bolhas). **`dark`**: luzes (x, y, raio, força) para a noite.
- Enfeites espalhados: sorteie posições com `hq` (nunca aleatório), só onde é livre, longe das trilhas (`RDD`), de abismos e das
  passagens; deixe as cabeceiras das passagens e o meio dos corredores **livres** (os jogadores circulam ali).

---

## 7. O shader do chão (`<id>_floor.gdshader`)

O chão do jogo é desenhado na placa de vídeo. O shader é o **porte linha a linha do pintor JS**: mesmas funções (`hq`, `vn`,
`vor` já estão em `referencia_jogo/gen_common.gdshaderinc`, idênticas às do JS), mesma ordem, mesmos números.
- `Math.round(v)` → `floor(v + 0.5)`; `v | 0` → `int(v)`; a cor final sai como `floor(cor) / 255`.
- Lê o tipo do tile no canal B do `data` (`texelFetch`), a trilha no G (`bilG`), andável no R (`bilF`).
- Modelo: `exemplo_geleira/gj_floor.gdshader` (porte do pintor de `glacier_giant.js`).
- O Claude confere no jogo: **≥ 99,9 %** dos pixels iguais à `floor_ref.png`. Se não bater, o porte está errado — corrija o
  porte, não mude o visual. Dica: comece copiando o pintor de um mapa que já existe e mude só o necessário (o Ninho do Dragão
  é o pintor da Geleira com um tipo trocado).

## 8. Os efeitos (`fx_<id>.gd`)

GDScript, `extends "res://scripts/fx_base.gd"` (ou `fx_frost.gd` nos mapas de gelo: já traz neve, nevasca e respiração).
Três funções: `under()` (embaixo dos objetos: névoa no chão, brilhos), `front()` (por cima: fogo, faíscas, fumaça, pássaros,
neve caindo), `glow(a)` (luzes somadas à noite). Lêem as listas de `fx` do gerador em `D.<nome>`. Use `tt` (tempo), `cx/cy`
(câmera), `inview(x,y,margem)`, `fr(cor,x,y,w,h)`, `ell(...)`, `gl(...)`. Modelo: `exemplo_geleira/fx_gj.gd`;
referência: `referencia_jogo/fx_base.gd` e `fx_frost.gd`. **Efeitos nunca são pintados no chão.**

---

## 9. Conferir

```
python ferramentas/preview.py <gerador.js> <função> <pasta da arte> <pasta de saída>
```
Tudo no `relatorio.txt` tem que dar **OK**: sem erros de JS, determinístico, tamanho 150×120 (área aberta), passagens na borda
e livres, toda a área andável alcançável, arte com ≤ 128 cores. Depois **olhe** `previa.png` e `previa_colisao.png`
(vermelho = bloqueado): nada flutuando, nada solto sem sentido, passagens largas, colisão só no pé dos objetos.
Teste: `python ferramentas/preview.py exemplo_geleira/glacier_giant.js glacierGiant exemplo_geleira/arte saida` dá tudo OK.

---

## 10. O que entregar ao Ricardo

Uma pasta `Mapa_<Nome>/` com:
- `PROMPT_ASSETS_<NOME>.md` (o prompt usado) e as duas folhas originais;
- `pecas.json` e a pasta `arte/` (as peças recortadas, 128 cores);
- `<nome>.js` (o gerador), `<id>_floor.gdshader`, `fx_<id>.gd`;
- a saída do `preview.py` (`previa.png`, `previa_colisao.png`, `relatorio.txt`, `floor_ref.png`, `gen_data.png`);
- um `MAPA.md` curto: id proposto, nome, tamanho, **onde encaixa** (ex.: "a leste do Fiorde Congelado"), **cada passagem**
  (borda + linhas/colunas + para onde leva), as áreas (nomes das zonas), as luzes e efeitos, e os destinos sugeridos para o
  teleporte (2 pontos livres com nome, em tiles).

O Claude, no projeto do jogo, confere tudo isso, abre a passagem no vizinho, liga o mapa ao jogo, compara o shader, faz a
foto do Mapa do Mundo e testa andando.

---

## 11. Erros que o Ricardo já reprovou (não repita)

- Escada/ponte em arco/plataforma onde o jogador anda (relevo no jogo plano).
- Peça com chão embaixo como objeto único (o jogador "some" atrás dela).
- Pedras soltas no meio do mapa; ovos ou enfeites sobre/na beira de abismo; pegadas gigantes soltas.
- Enfeite travando corredor ou cabeceira de passagem.
- Esqueleto de algo que no mapa está vivo (coerência da história).
- Halo/brilho desenhado em volta de chamas na folha (o jogo faz o brilho): tirar no recorte.
- Paredes de dentro baixas demais perto de móveis gigantes (interior de gigantes: face da parede com ~6 tiles).
