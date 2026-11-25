# MMORPG_MAPS

Criação de mapas para o Valdória (jogo em Godot 4.7 desenvolvido em outro projeto), seguindo o kit oficial.
Cada mapa é entregue como uma pasta/zip `Mapa_<Nome>/` para o Ricardo levar à IA do jogo.

- `kit/` — o kit oficial (guia `LEIA-ME_GUIA_PARA_A_IA.md`, ferramentas, exemplo da Geleira, referências do jogo).
- `mapas/` — os mapas que criamos (um por pasta).
- `visualizador/` — projeto Godot para ver e andar pelos mapas no celular (chão desenhado pelo próprio shader do mapa).
- `visualizador_ferramentas/exporta_mapa.py` — leva um mapa para o visualizador; `publica.sh` — publica o link.

Ver os mapas no celular: https://mmorpgclaude.github.io/MMORPG_MAPS/

Comandos:
```bash
# conferência do kit
python3 kit/ferramentas/preview.py <gerador.js> <função> <arte> <saída>
# levar o mapa para o visualizador
python3 visualizador_ferramentas/exporta_mapa.py <gerador.js> <função> <arte> <id> <shader> <fx.gd> "<nome>"
# conferir o shader contra a floor_ref.png (>= 99,9 %) e tirar foto
xvfb-run -a godot --path visualizador --rendering-driver opengl3 --resolution 1280x720 -- --mapa=<id> --compara=<floor_ref.png> --foto=foto.png
# publicar o link
visualizador_ferramentas/publica.sh
```
