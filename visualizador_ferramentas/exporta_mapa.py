"""Leva um mapa feito no padrão do kit para o visualizador (projeto Godot em visualizador/).
   python visualizador_ferramentas/exporta_mapa.py <gerador.js> <função> <pasta da arte> <id> <shader> <fx.gd> "<nome>"

   Roda o gerador do mesmo jeito que o kit/ferramentas/preview.py (mesmo kit_base.js, mesma arte em window.ART) e grava em
   visualizador/mapas/<id>/: data.png (gen_data), ov.png, ents/*.png (cada imagem uma vez só), map.json (W, H, S, zonas,
   passagens, luzes, fx, objetos), floor.gdshader e fx.gd. Depois atualiza visualizador/mapas/lista.json."""
import asyncio, sys, os, io, json, base64, glob, hashlib, shutil
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(RAIZ, 'kit', 'ferramentas')
JS, FN, ART, ID, SHADER, FX, NOME = sys.argv[1:8]
OUT = os.path.join(RAIZ, 'visualizador', 'mapas', ID)

async def roda():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--disable-gpu', '--js-flags=--max-old-space-size=8192'])
        pg = await b.new_page(); erros = []
        pg.on('pageerror', lambda e: erros.append(str(e)[:400]))
        await pg.set_content('<html><body></body></html>')
        await pg.add_script_tag(path=os.path.join(KIT, 'kit_base.js'))
        A = {os.path.basename(f)[:-4]: 'data:image/png;base64,' + base64.b64encode(open(f, 'rb').read()).decode() for f in glob.glob(ART + '/*.png')}
        await pg.evaluate('async A=>{window.ART={};for(const [k,u] of Object.entries(A)){const i=new Image();i.src=u;await i.decode();ART[k]=i}}', A)
        await pg.add_script_tag(path=JS)
        r = await pg.evaluate(FN + '()')
        await b.close()
    if erros: raise SystemExit('erro no gerador: ' + erros[0])
    return r

r = asyncio.run(roda())
dec = lambda u: base64.b64decode(u.split(',', 1)[1])
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT + '/ents')
open(OUT + '/data.png', 'wb').write(dec(r['gen']['data']))
open(OUT + '/ov.png', 'wb').write(dec(r['gen']['ov']))
imgs, ents = {}, []
for e in r['ents']:
    raw = dec(e['url']); h = hashlib.sha1(raw).hexdigest()[:12]
    if h not in imgs:
        imgs[h] = 1; open(OUT + '/ents/%s.png' % h, 'wb').write(raw)
    ents.append([e['x'], e['y'], e['z'], h])
shutil.copy(SHADER, OUT + '/floor.gdshader')
shutil.copy(FX, OUT + '/fx.gd')
m = {'id': ID, 'nome': NOME, 'W': r['W'], 'H': r['H'], 'S': ''.join('1' if v else '0' for v in r['S']),
     'zonas': r['zones']['names'], 'z': r['zones']['z'], 'portals': r['portals'], 'dark': r['dark'], 'fx': r['fx'], 'ents': ents}
json.dump(m, open(OUT + '/map.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
LISTA = os.path.join(RAIZ, 'visualizador', 'mapas', 'lista.json')
L = json.load(open(LISTA, encoding='utf-8')) if os.path.exists(LISTA) else []
L = [x for x in L if x['id'] != ID] + [{'id': ID, 'nome': NOME}]
json.dump(L, open(LISTA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('mapa %s (%s): %d×%d, %d objetos, %d imagens -> %s' % (ID, NOME, r['W'], r['H'], len(ents), len(imgs), OUT))
