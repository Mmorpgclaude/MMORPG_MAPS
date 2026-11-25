"""Funções comuns para a arte recortada das folhas do Ricardo (v10.8).
   reduz_cores: deixa a peça com no máximo CORES cores (padrão do projeto: 128), sem pontilhado, mantendo a transparência
   binária. Quase não muda o visual (a arte já é pixel art) e corta ~70% do peso. Use em todo recorte novo (ex. gj_art.py)."""
import os, json
import numpy as np
from PIL import Image
from scipy import ndimage
CORES = 128
def reduz_cores(rgba, n=CORES):
    """rgba: array uint8 (h, w, 4) com alfa 0 ou 255 -> array uint8 (h, w, 4) com no máximo n cores."""
    a = rgba[..., 3] > 0
    if not a.any(): return rgba
    rgb = rgba[..., :3].copy(); rgb[~a] = rgb[a].mean(axis=0).astype(np.uint8)   # o fundo não gasta cor da paleta
    q = Image.fromarray(rgb, 'RGB').quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    out = np.asarray(q.convert('RGB'))
    return np.dstack([out, np.where(a, 255, 0)]).astype(np.uint8)

def salva_png(im, path):
    """Grava um PNG sem perda. Se a imagem tem até 256 cores (como a arte reduzida), grava com paleta (bem menor)."""
    im = im.convert('RGBA'); a = np.asarray(im)
    flat = a.reshape(-1, 4); cores, inv = np.unique(flat, axis=0, return_inverse=True)
    if len(cores) <= 256:
        p = Image.fromarray(inv.reshape(a.shape[:2]).astype(np.uint8), 'P')
        p.putpalette(cores.astype(np.uint8).tobytes(), rawmode='RGBA'); p.save(path, optimize=True)
        if not (np.asarray(Image.open(path).convert('RGBA')) == a).all(): im.save(path, optimize=True)   # segurança: tem que sair idêntico
    else:
        im.save(path)

def recorta(SHEET, PECAS, OUT, furos=False, halo=(), sem_furos=()):
    """Recorta as peças de uma folha (fundo liso) pelo contorno, reduz pela média e para 128 cores, grava OUT/<nome>.png.
    v10.12: furos=True tira também os vãos fechados por dentro da peça que têm a cor do fundo (>= 24 px da folha);
    halo = nomes de peças cujo brilho alaranjado em volta (desenhado na folha) sai — o jogo desenha o brilho sozinho."""
    im = Image.open(SHEET).convert('RGB'); a = np.asarray(im).astype(int)
    bg = np.median(np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)]), axis=0)
    isbg = np.abs(a - bg).max(axis=2) < 14
    lab, _ = ndimage.label(isbg)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    obj = ~np.isin(lab, list(border))
    lab2, _ = ndimage.label(ndimage.binary_closing(obj, iterations=2))
    os.makedirs(OUT, exist_ok=True); info = {}
    rgba = np.dstack([a, np.full(a.shape[:2], 255)]).astype(np.uint8)
    for nome, ((px, py), k) in PECAS.items():
        L = lab2[py, px]
        if not L:   # o ponto caiu num vão: usa a peça mais perto (até 25 px)
            win = lab2[max(0, py - 25):py + 26, max(0, px - 25):px + 26]; yy, xx = np.nonzero(win)
            if not len(yy): raise SystemExit('ponto fora de peça: %s' % nome)
            j = np.argmin((yy - min(25, py)) ** 2 + (xx - min(25, px)) ** 2); L = win[yy[j], xx[j]]
        m = (lab2 == L) & obj
        if furos and nome not in sem_furos:   # vãos fechados com a cor do fundo (sem_furos: peças cujo escuro é de propósito)
            hl, nh = ndimage.label(m & (np.abs(a - bg).max(axis=2) < 12))
            if nh:
                sz = ndimage.sum(np.ones_like(hl), hl, range(1, nh + 1)); big = np.isin(hl, [i + 1 for i in range(nh) if sz[i] >= 24])
                m = m & ~big
        if nome in halo:   # brilho laranja escuro ligado ao fundo
            mx = a.max(axis=2); hal = (mx < 115) & (a[..., 0] > a[..., 2] + 6) & (a[..., 0] - a[..., 1] > 4)
            lb, _ = ndimage.label(hal | ~m); tb = set(np.unique(lb[~m])) - {0}
            m = m & ~np.isin(lb, list(tb))
        ys, xs = np.where(lab2 == L); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        sub = rgba[y0:y1, x0:x1].copy(); sub[..., 3] = np.where(m[y0:y1, x0:x1], 255, 0)
        w, h = max(1, round((x1 - x0) * k)), max(1, round((y1 - y0) * k))
        # redução pela média com alfa pré-multiplicado, depois alfa binário
        p = sub.astype(float); p[..., :3] *= p[..., 3:4] / 255
        r = np.asarray(Image.fromarray(p.astype(np.uint8)).resize((w, h), Image.BOX)).astype(float)
        al = r[..., 3:4]; col = np.where(al > 0, r[..., :3] * 255 / np.maximum(al, 1), 0)
        outp = np.dstack([np.clip(col, 0, 255), np.where(al[..., 0] >= 110, 255, 0)]).astype(np.uint8)
        outp = reduz_cores(outp)   # v10.8: 128 cores (padrão do projeto para arte recortada)
        salva_png(Image.fromarray(outp), OUT + '/%s.png' % nome); info[nome] = [w, h]
    json.dump(info, open(OUT + '/info.json', 'w'), indent=0)
    print(len(info), 'peças em', OUT)
