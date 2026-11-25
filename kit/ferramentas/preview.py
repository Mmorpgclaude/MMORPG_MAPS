"""Kit de mapas do Valdória — roda o gerador do mapa, monta a prévia e confere as regras do padrão.
   python preview.py <gerador.js> <função> <pasta da arte recortada> <pasta de saída>
   Ex.: python preview.py ../exemplo_geleira/glacier_giant.js glacierGiant ../exemplo_geleira/arte saida_geleira

   Grava na saída: previa.png (o mapa inteiro, chão + objetos), previa_colisao.png (vermelho = bloqueado),
   gen_data.png, floor_ref.png (a referência do chão, para comparar com o shader) e relatorio.txt com as conferências.
   Precisa: Python 3 com pillow, numpy e playwright (+ "playwright install chromium")."""
import asyncio, sys, os, io, json, base64, glob
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

AQUI = os.path.dirname(os.path.abspath(__file__))
JS, FN, ART, OUT = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
os.makedirs(OUT, exist_ok=True)
img = lambda u: Image.open(io.BytesIO(base64.b64decode(u.split(',', 1)[1]))).convert('RGBA')

async def roda():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--disable-gpu', '--js-flags=--max-old-space-size=8192'])
        pg = await b.new_page(); erros = []
        pg.on('pageerror', lambda e: erros.append(str(e)[:400]))
        await pg.set_content('<html><body></body></html>')
        await pg.add_script_tag(path=os.path.join(AQUI, 'kit_base.js'))
        A = {os.path.basename(f)[:-4]: 'data:image/png;base64,' + base64.b64encode(open(f, 'rb').read()).decode() for f in glob.glob(ART + '/*.png')}
        await pg.evaluate('async A=>{window.ART={};for(const [k,u] of Object.entries(A)){const i=new Image();i.src=u;await i.decode();ART[k]=i}}', A)
        await pg.add_script_tag(path=JS)
        r1 = await pg.evaluate(FN + '()')
        r2 = await pg.evaluate(FN + '()')            # segunda vez: tem que sair igual (determinismo)
        await b.close()
    return r1, r2, erros

r, r2, erros = asyncio.run(roda())
W, H = r['W'], r['H']; L = []
ok = lambda c, m: L.append(('OK   ' if c else 'FALHA') + ' ' + m)
ok(not erros, 'sem erros de JavaScript' + ('' if not erros else ': ' + erros[0]))
ok(r['floor'] == r2['floor'] and r['gen']['data'] == r2['gen']['data'] and r['S'] == r2['S'], 'determinístico (rodou duas vezes e saiu igual)')
ok(len(r['S']) == W * H and len(r['zones']['z']) == W * H, 'S e zonas com W×H valores')
padrao = (W, H) == (150, 120)
L.append(('OK   ' if padrao else 'AVISO') + ' tamanho %d×%d %s' % (W, H, '(padrão de área aberta)' if padrao else '(só lugar de dentro pode ter outro tamanho)'))
fl = img(r['floor']); ok(fl.size == (W * 16, H * 16), 'chão com %d×%d px (16 px por tile)' % (W * 16, H * 16))
gd = img(r['gen']['data']); ok(gd.size == (W, H), 'gen_data com 1 texel por tile')
S = np.array(r['S'], dtype=np.uint8).reshape(H, W)
# passagens: cada célula de portal tem que ser andável, e ficar na borda
P = r['portals']; C = P['cells']
for ti, t in enumerate(P['trig']):
    cs = [(C[i], C[i + 1]) for i in range(0, len(C), 3) if C[i + 2] == ti]
    borda = all(x in (0, W - 1) or y in (0, H - 1) for x, y in cs)
    livre = all(S[y, x] == 0 for x, y in cs)
    ok(borda and livre and len(cs) >= 7, 'passagem %s: %d células na borda, livres' % (json.dumps(t, ensure_ascii=False), len(cs)))
# alcance: dá para chegar a toda área andável a partir da primeira passagem
if C:
    from collections import deque
    seen = np.zeros_like(S, bool); q = deque([(C[0], C[1])]); seen[C[1], C[0]] = True
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not seen[ny, nx] and S[ny, nx] == 0: seen[ny, nx] = True; q.append((nx, ny))
    livres = int((S == 0).sum()); alc = int(seen.sum())
    L.append(('OK   ' if alc > livres * .95 else 'AVISO') + ' %d de %d tiles livres alcançáveis a partir da passagem' % (alc, livres))
# arte: 128 cores no máximo
cores_max = 0
for f in glob.glob(ART + '/*.png'):
    a = np.asarray(Image.open(f).convert('RGBA')).reshape(-1, 4); a = a[a[:, 3] > 0]
    cores_max = max(cores_max, len(np.unique(a, axis=0)))
ok(cores_max <= 128, 'arte recortada com no máximo 128 cores (maior peça: %d)' % cores_max)
# prévia: chão + objetos pela base
pv = fl.copy()
for e in sorted(r['ents'], key=lambda e: e['y']):
    pv.alpha_composite(img(e['url']), (e['x'], e['z'] - 2))
pv.save(OUT + '/previa.png'); fl.save(OUT + '/floor_ref.png'); gd.save(OUT + '/gen_data.png')
col = pv.copy(); m = np.zeros((H * 16, W * 16, 4), np.uint8); m[np.repeat(np.repeat(S, 16, 0), 16, 1) > 0] = (255, 0, 0, 90)
col.alpha_composite(Image.fromarray(m)); col.save(OUT + '/previa_colisao.png')
pv.resize((W * 8, H * 8)).save(OUT + '/previa_pequena.png')
L.append('objetos: %d · zonas: %s' % (len(r['ents']), ', '.join(r['zones']['names'])))
open(OUT + '/relatorio.txt', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('\n'.join(L))
