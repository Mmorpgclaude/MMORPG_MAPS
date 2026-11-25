#!/bin/bash
# Exporta o visualizador para web e publica no ramo gh-pages (link: https://mmorpgclaude.github.io/MMORPG_MAPS/).
set -e
cd "$(dirname "$0")/.."
rm -rf build/web && mkdir -p build/web
godot --headless --path visualizador --import >/dev/null 2>&1 || true
godot --headless --path visualizador --export-release "Web" ../build/web/index.html 2>&1 | grep -iE 'error' || true
test -s build/web/index.wasm
# nome novo do pacote a cada publicação: o celular nunca usa uma cópia velha guardada (cache)
V=$(date +%s); cp build/web/index.pck build/web/index_$V.pck
sed -i "s/\"executable\":\"index\"/\"executable\":\"index\",\"mainPack\":\"index_$V.pck\"/; s/\"index.pck\":/\"index_$V.pck\":/" build/web/index.html
grep -q "index_$V.pck" build/web/index.html
touch build/web/.nojekyll
W=$(mktemp -d); cp -r build/web/. "$W"/
cd "$W" && git init -q -b gh-pages && git config user.name Mmorpgclaude && git config user.email mmorpg142.142@gmail.com
git add -A && git commit -qm "Visualizador web" && git push -qf https://github.com/Mmorpgclaude/mmorpg_maps gh-pages
echo "publicado"
