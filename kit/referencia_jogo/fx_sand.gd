extends "res://scripts/fx_base.gd"
## Clima compartilhado dos mapas do deserto (Porto das Areias dp, Travessia das Dunas dn, Mar de Areia dm, Al-Sahrah dq):
##   tempestade de areia — a cada 3 minutos uma parede de areia aparece no horizonte (leste) e varre a tela (8 s),
##   o vento cresce (4 s), sopra forte (30 s) e acalma (6 s). Céu alaranjado, visão fechada nas bordas, grãos voando,
##   nuvens de poeira rolando, arbustos secos rolando, redemoinhos, areia levantando das dunas e lampiões brilhando
##   mais forte através da poeira. Segue o relógio do jogo, então é a mesma tempestade em todos os mapas do deserto.
##   Também: poeira levantando dos pés do jogador ao andar (bem mais forte na tempestade).
## Os efeitos de cada mapa continuam nos seus arquivos; a tempestade é desenhada por cima, pelo _draw_layer daqui.
const STORM_EVERY := 180.0    # segundos entre o começo de uma tempestade e a próxima
const STORM_WALL := 8.0       # a parede de areia chegando e varrendo a tela
const STORM_RISE := 4.0       # vento crescendo
const STORM_HOLD := 30.0      # tempestade forte
const STORM_FALL := 6.0       # acalmando
const SAND := [Color(0.93, 0.80, 0.56), Color(0.84, 0.66, 0.40), Color(0.74, 0.54, 0.30), Color(0.98, 0.90, 0.70)]
const VEIL := Color(0.70, 0.47, 0.24)

## [g, frente]: g = força da tempestade (0..1); frente = fração da tela (da direita) já coberta pela parede (1 = tela toda)
func _storm() -> Array:
	var u := fmod(tt, STORM_EVERY) - (STORM_EVERY - STORM_WALL - STORM_RISE - STORM_HOLD - STORM_FALL)
	if u < 0.0: return [0.0, 0.0]
	if u < STORM_WALL:
		var p := u / STORM_WALL
		return [0.7 * smoothstep(0.2, 1.0, p), smoothstep(0.25, 1.0, p) if p > 0.25 else 0.0, p]
	u -= STORM_WALL
	var g := 0.0
	if u < STORM_RISE: g = 0.7 + 0.3 * u / STORM_RISE
	elif u < STORM_RISE + STORM_HOLD: g = 1.0
	else: g = 1.0 - smoothstep(0.0, 1.0, (u - STORM_RISE - STORM_HOLD) / STORM_FALL)
	return [g * (0.88 + 0.12 * sin(tt * 1.3) * sin(tt * 0.51)), 1.0]

var _wx := 0.0
var _lt := -1.0
func _wind(g: float) -> float:
	# distância acumulada do vento (a areia acelera e freia sem dar saltos)
	if _lt >= 0.0 and tt > _lt: _wx += (tt - _lt) * g
	_lt = tt
	return _wx

func _draw_layer() -> void:
	super._draw_layer()
	if layer == 0: sand_ground()
	elif layer == 1: sand_air()

## o que está à direita da frente da parede já está dentro da tempestade
func _inside(x: float, fr_: float) -> bool:
	return fr_ >= 1.0 or x > cx + VW * (1.0 - fr_)

func sand_ground() -> void:
	var S := _storm()
	var g: float = S[0]
	var wd := _wind(g)
	if g <= 0.02: return
	# areia correndo rente ao chão, em fios ondulados
	for k in 80:
		var x: float = cx + VW + 150 - fmod(k * 131.7 + tt * 40.0 + wd * 520.0, VW + 300)
		if not _inside(x, S[1]): continue
		var y: float = cy + fmod(k * 67.3, VH) + sin(tt * 2.0 + k + x * 0.02) * 5
		fr(Color(SAND[k % 4], 0.45 * g), roundi(x), roundi(y), 14 + k % 24, 1)
	# areia levantando das dunas: pontos fixos no chão soltando um fio de areia para o oeste
	var gx0 := int(floor(cx / 128.0)); var gy0 := int(floor(cy / 128.0))
	for j in int(VH / 128.0) + 2:
		for i in int(VW / 128.0) + 2:
			var hx := gx0 + i; var hy := gy0 + j
			var h := fmod(absf(sin(hx * 12.9898 + hy * 78.233) * 43758.5453), 1.0)
			if h > 0.22: continue
			var ox: float = hx * 128.0 + h * 400.0; var oy: float = hy * 128.0 + fmod(h * 977.0, 1.0) * 128.0
			if not _inside(ox, S[1]): continue
			for k in 14:
				var u := fmod(tt * 0.9 + k / 14.0 + h * 5.0, 1.0)
				fr(Color(SAND[3], 0.55 * g * (1.0 - u)), roundi(ox - u * 70.0), roundi(oy - sin(u * PI) * 10.0 - u * 6.0), 2, 1)

func sand_air() -> void:
	var S := _storm()
	var g: float = S[0]
	var fr_: float = S[1]
	var wd := _wind(g)
	# poeira dos pés do jogador ao andar
	var sp := Vector2(main.pvx, main.pvy).length()
	if sp > 10.0:
		var amt := 0.55 + 0.45 * g
		for k in 6 + int(g * 6):
			var u := fmod(tt * 1.8 + k / (6.0 + g * 6.0), 1.0)
			var bx: float = main.rpx - main.pvx * 0.28 * u - u * g * 26.0 + sin(k * 2.3) * 3.0
			var by: float = main.rpy - 1.0 - main.pvy * 0.28 * u - u * (3.0 + g * 5.0)
			var r := 2.0 + u * (5.0 + g * 3.0)
			ell(bx, by, r, r * 0.65, Color(0.86, 0.72, 0.5, 0.6 * amt * (1.0 - u)), false, 10)
			ell(bx - 1.0, by - 1.5, r * 0.6, r * 0.4, Color(1.0, 0.94, 0.8, 0.55 * amt * (1.0 - u)), false, 8)
	if g <= 0.02 and (S.size() < 3 or S[2] <= 0.0): return
	# a parede de areia no horizonte (leste) e varrendo a tela
	if S.size() >= 3:
		var p: float = S[2]
		var fx0: float = cx + VW * (1.0 - fr_)
		if p <= 0.25:
			var w := p / 0.25 * 46.0
			for k in 8: fr(Color(VEIL.darkened(0.25), 0.07 * (k + 1) * p * 4.0), roundi(cx + VW - w + k * w / 8.0), roundi(cy) - 2, int(w / 8.0) + 2, int(VH) + 4)
		else:
			fr(Color(VEIL, 0.5), roundi(fx0), roundi(cy) - 2, int(cx + VW - fx0) + 2, int(VH) + 4)
			fr(Color(VEIL.darkened(0.3), 0.18), roundi(fx0 + 40), roundi(cy) - 2, int(cx + VW - fx0) + 2, int(VH) + 4)
			# borda da parede: rolos de poeira de tamanhos diferentes, se revirando
			for k in 26:
				var hk := fmod(absf(sin(k * 91.7) * 4375.85), 1.0)
				var yy: float = cy - 30.0 + fmod(k * 0.381966, 1.0) * (VH + 60.0)
				var r := 18.0 + hk * 46.0 + 8.0 * sin(tt * 1.3 + k * 2.1)
				var ox: float = fx0 + (hk - 0.3) * 40.0 + sin(tt * 1.7 + k * 1.3) * 10.0
				ell(ox, yy, r, r * (0.7 + 0.25 * hk), Color(VEIL.darkened(0.15 + 0.2 * hk), 0.22 + 0.18 * hk), false, 18)
				if k % 2 == 0: ell(ox - r * 0.35, yy - r * 0.2, r * 0.45, r * 0.35, Color(SAND[1], 0.25), false, 12)
			# grãos saindo na frente da parede
			for k in 50:
				var u := fmod(tt * 0.8 + k * 0.137, 1.0)
				fr(Color(SAND[k % 4], 0.7 * (1.0 - u)), roundi(fx0 - u * 120.0), roundi(cy + fmod(k * 71.3, VH)), 3 + k % 6, 1)
	else:
		# tempestade cobrindo tudo: céu alaranjado e visão fechada nas bordas
		fr(Color(VEIL, 0.5 * g), roundi(cx) - 2, roundi(cy) - 2, int(VW) + 4, int(VH) + 4)
		for k in 6:
			var t := (6 - k) * 12.0
			var a := 0.07 * g
			fr(Color(VEIL.darkened(0.35), a), roundi(cx) - 2, roundi(cy) - 2, int(t), int(VH) + 4)
			fr(Color(VEIL.darkened(0.35), a), roundi(cx + VW - t), roundi(cy) - 2, int(t) + 2, int(VH) + 4)
			fr(Color(VEIL.darkened(0.35), a), roundi(cx) - 2, roundi(cy) - 2, int(VW) + 4, int(t * 0.7))
			fr(Color(VEIL.darkened(0.35), a), roundi(cx) - 2, roundi(cy + VH - t * 0.7), int(VW) + 4, int(t * 0.7) + 2)
	# lampiões e fogo brilhando através da poeira
	for key in ["lamp", "fire"]:
		if not D.has(key): continue
		for L in D[key]:
			if not inview(L[0], L[1], 40) or not _inside(L[0], fr_): continue
			ell(L[0], L[1], 18, 14, Color(1, 0.7, 0.3, 0.22 * g), false, 14)
			ell(L[0], L[1], 8, 6, Color(1, 0.82, 0.45, 0.3 * g), false, 10)
	# nuvens de poeira rolando
	for k in 7:
		var x: float = cx + VW + 140 - fmod(k * 311.0 + tt * 30.0 + wd * 700.0, VW + 280)
		if not _inside(x, fr_): continue
		var y: float = cy + fmod(k * 173.0, VH) + sin(tt * 0.4 + k) * 20
		var r := 60.0 + 40.0 * sin(k * 2.1)
		ell(x, y, r, r * 0.6, Color(SAND[2], 0.2 * g), false, 24)
		ell(x + r * 0.3, y - r * 0.15, r * 0.6, r * 0.4, Color(SAND[1], 0.18 * g), false, 20)
	# redemoinhos levados pelo vento
	for k in 2:
		var X: float = cx + VW + 100 - fmod(k * 523.0 + tt * 20.0 + wd * 160.0, VW + 200)
		var Y: float = cy + VH * (0.45 + 0.3 * k) + sin(tt * 0.3 + k) * 30
		if not _inside(X, fr_): continue
		for j in 50:
			var h := fmod(tt * 0.6 + j / 50.0, 1.0); var r := 3 + h * 20; var a: float = tt * 8.0 + j * 2.4
			fr(Color(SAND[1], 0.75 * g * (1 - h) * min(1.0, h * 6)), roundi(X + cos(a) * r + sin(tt * 2.3 + h * 4) * h * 6), roundi(Y - h * 70 + sin(a) * r * 0.32), 2 if j % 3 == 0 else 1, 1)
	# arbustos secos rolando
	for k in 3:
		var x: float = cx + VW + 60 - fmod(k * 457.0 + wd * 560.0, VW + 160)
		if not _inside(x, fr_): continue
		var yb: float = cy + VH * (0.3 + 0.25 * k) + sin(k * 3.3) * 30
		var bh := absf(sin(wd * 9.0 + k * 1.7)) * 10.0
		var rot := -wd * 14.0 + k
		ell(x, yb + 2, 7, 2, Color(0, 0, 0, 0.18 * g), false, 10)
		for j in 12:
			var a: float = rot + j * TAU / 12.0
			fr(Color("#8a6a38", 0.9 * g), roundi(x + cos(a) * 6.0), roundi(yb - 7 - bh + sin(a) * 6.0), 1, 1)
			fr(Color("#6a4e28", 0.9 * g), roundi(x + cos(a + 0.5) * 3.0), roundi(yb - 7 - bh + sin(a + 0.5) * 3.0), 1, 1)
	# grãos de areia voando
	for k in 40 + int(g * 140):
		var u := fmod(tt * 0.4 + k * 0.071, 1.0)
		var x: float = cx + VW + 100 - fmod(k * 151.7 + tt * 90.0 + wd * 900.0, VW + 200)
		if not _inside(x, fr_): continue
		var y: float = cy + fmod(k * 83.3, VH) + sin(tt * 3.0 + k * 0.7) * 6
		fr(Color(SAND[k % 4], (0.4 + 0.6 * g) * sin(u * PI)), roundi(x), roundi(y), 3 + k % 10 + int(g * 10), 1 + (1 if k % 5 == 0 else 0))
