"""Kit de mapas do Valdória — recorta as peças de uma folha de sprites (fundo liso) para a pasta da arte do mapa.
   Usa art_lib.recorta: cada peça sai pelo próprio contorno, reduzida pela média (a folha tem "pixel" de ~2 px) e com
   NO MÁXIMO 128 CORES, transparência binária e sem os vãos fechados com a cor do fundo.

   1) Ache as peças:   python recorta_folha.py achar <folha.png> <saida.png>
      grava uma imagem com cada peça numerada numa caixa e imprime as caixas.
   2) Recorte:         python recorta_folha.py recortar <folha.png> <pecas.json> <pasta da arte>
      pecas.json = {"nome": [[x, y], fator], ...}  — (x, y) é um ponto DENTRO da peça na folha; fator ~0.45-0.5
      (use o mesmo fator para peças que precisam ficar na mesma escala)."""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from art_lib import recorta

def achar(src, out):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
    bg = np.median(np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)]), axis=0)
    lab, _ = ndimage.label(np.abs(a - bg).max(axis=2) < 14)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    lab2, _ = ndimage.label(ndimage.binary_closing(~np.isin(lab, list(border)), iterations=2))
    boxes = []
    for i, sl in enumerate(ndimage.find_objects(lab2)):
        if sl is None or (lab2[sl] == i + 1).sum() < 250: continue
        boxes.append([sl[1].start, sl[0].start, sl[1].stop, sl[0].stop])
    boxes.sort(key=lambda b: (b[1] // 120, b[0]))
    dr = ImageDraw.Draw(im)
    for k, b in enumerate(boxes):
        dr.rectangle(b, outline=(255, 60, 60)); dr.text((b[0] + 2, b[1] + 1), str(k), fill=(255, 255, 0))
        print(k, 'caixa', b, 'centro', [(b[0] + b[2]) // 2, (b[1] + b[3]) // 2])
    im.save(out)

if __name__ == '__main__':
    if sys.argv[1] == 'achar': achar(sys.argv[2], sys.argv[3])
    else:
        P = {k: (tuple(v[0]), v[1]) for k, v in json.load(open(sys.argv[3], encoding='utf-8')).items()}
        recorta(sys.argv[2], P, sys.argv[4], furos=True)
