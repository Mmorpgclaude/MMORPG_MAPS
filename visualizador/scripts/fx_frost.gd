extends "res://scripts/fx_base.gd"
## Clima compartilhado dos mapas de gelo (Fiorde nf, Floresta nn, Frostheim nc):
##   nevasca — a cada 4 minutos uma cortina branca aparece no horizonte (oeste) e varre a tela (8 s), o vento cresce (5 s),
##   sopra forte (30 s) e acalma (7 s). Tela branca-azulada com as bordas fechadas, nuvens de neve rolando, neve
##   escorrendo dos telhados e levantando do chão, flocos grandes rodopiando, neve correndo e luzes brilhando através
##   da nevasca. Segue o relógio do jogo, então é a mesma nevasca em todos os mapas de gelo.
##   Também: respiração visível do jogador no frio.
const STORM_EVERY := 240.0    # segundos entre o começo de uma nevasca e a próxima
const STORM_WALL := 8.0       # a cortina de neve chegando e varrendo a tela
const STORM_RISE := 5.0       # vento crescendo
const STORM_HOLD := 30.0      # nevasca forte
const STORM_FALL := 7.0       # acalmando
const VEIL := Color(0.86, 0.91, 1.0)

## [g, frente] ou [g, frente, p] durante a chegada: g = força (0..1); frente = fração da tela (da esquerda) já coberta
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
	return [g * (0.85 + 0.15 * sin(tt * 1.7) * sin(tt * 0.63)), 1.0]

func _gust() -> float:
	return _storm()[0]

## o que está à esquerda da frente da cortina já está dentro da nevasca
func _inside(x: float, fr_: float) -> bool:
	return fr_ >= 1.0 or x < cx + VW * fr_

var _wx := 0.0
var _lt := -1.0
func _wind() -> float:
	# distância acumulada do vento (a neve acelera e freia sem dar saltos)
	if _lt >= 0.0 and tt > _lt: _wx += (tt - _lt) * _gust()
	_lt = tt
	return _wx

## neve correndo rente ao chão e levantando em fios (chamar em under)
func frost_ground() -> void:
	var S := _storm()
	var g: float = S[0]
	var wd := _wind()
	if g <= 0.02: return
	for k in 90:
		var x: float = cx + fmod(k * 131.7 + tt * 40.0 + wd * 460.0, VW + 300) - 150
		if not _inside(x, S[1]): continue
		var y: float = cy + fmod(k * 67.3, VH) + sin(tt * 2.0 + k) * 6
		fr(Color(1, 1, 1, 0.5 * g), roundi(x), roundi(y), 14 + k % 22, 1 + k % 2)
	# pontos fixos no chão soltando fios de neve para o leste
	var gx0 := int(floor(cx / 128.0)); var gy0 := int(floor(cy / 128.0))
	for j in int(VH / 128.0) + 2:
		for i in int(VW / 128.0) + 2:
			var hx := gx0 + i; var hy := gy0 + j
			var h := fmod(absf(sin(hx * 12.9898 + hy * 78.233) * 43758.5453), 1.0)
			if h > 0.2: continue
			var ox: float = hx * 128.0 + h * 400.0; var oy: float = hy * 128.0 + fmod(h * 977.0, 1.0) * 128.0
			if not _inside(ox, S[1]): continue
			for k in 14:
				var u := fmod(tt * 0.9 + k / 14.0 + h * 5.0, 1.0)
				fr(Color(1, 1, 1, 0.6 * g * (1.0 - u)), roundi(ox + u * 70.0), roundi(oy - sin(u * PI) * 10.0 - u * 6.0), 2, 1)

## nevasca (cortina chegando, véu, nuvens, neve dos telhados, flocos rodopiando) e neve caindo (chamar no fim de front)
func frost_air() -> void:
	var S := _storm()
	var g: float = S[0]
	var fr_: float = S[1]
	var wd := _wind()
	if S.size() >= 3:
		# a cortina de neve no horizonte (oeste) e varrendo a tela
		var p: float = S[2]
		var fx1: float = cx + VW * fr_
		if p <= 0.25:
			var w := p / 0.25 * 46.0
			for k in 8: fr(Color(VEIL, 0.07 * (8 - k) * p * 4.0), roundi(cx + k * w / 8.0) - 2, roundi(cy) - 2, int(w / 8.0) + 2, int(VH) + 4)
		else:
			fr(Color(VEIL, 0.42), roundi(cx) - 2, roundi(cy) - 2, int(fx1 - cx) + 2, int(VH) + 4)
			fr(Color(1, 1, 1, 0.15), roundi(cx) - 2, roundi(cy) - 2, int(fx1 - cx - 40.0) + 2, int(VH) + 4)
			for k in 26:
				var hk := fmod(absf(sin(k * 91.7) * 4375.85), 1.0)
				var yy: float = cy - 30.0 + fmod(k * 0.381966, 1.0) * (VH + 60.0)
				var r := 18.0 + hk * 46.0 + 8.0 * sin(tt * 1.3 + k * 2.1)
				var ox: float = fx1 - (hk - 0.3) * 40.0 - sin(tt * 1.7 + k * 1.3) * 10.0
				ell(ox, yy, r, r * (0.7 + 0.25 * hk), Color(VEIL.lerp(Color.WHITE, hk), 0.25 + 0.2 * hk), false, 18)
				if k % 2 == 0: ell(ox + r * 0.35, yy - r * 0.2, r * 0.45, r * 0.35, Color(1, 1, 1, 0.3), false, 12)
			for k in 50:
				var u := fmod(tt * 0.8 + k * 0.137, 1.0)
				fr(Color(1, 1, 1, 0.8 * (1.0 - u)), roundi(fx1 + u * 120.0), roundi(cy + fmod(k * 71.3, VH)), 3 + k % 6, 1)
	elif g > 0.02:
		# nevasca cobrindo tudo: tela branca-azulada e visão fechada nas bordas
		fr(Color(VEIL, 0.3 * g), roundi(cx) - 2, roundi(cy) - 2, int(VW) + 4, int(VH) + 4)
		for k in 6:
			var t := (6 - k) * 12.0
			var a := 0.08 * g
			fr(Color(1, 1, 1, a), roundi(cx) - 2, roundi(cy) - 2, int(t), int(VH) + 4)
			fr(Color(1, 1, 1, a), roundi(cx + VW - t), roundi(cy) - 2, int(t) + 2, int(VH) + 4)
			fr(Color(1, 1, 1, a), roundi(cx) - 2, roundi(cy) - 2, int(VW) + 4, int(t * 0.7))
			fr(Color(1, 1, 1, a), roundi(cx) - 2, roundi(cy + VH - t * 0.7), int(VW) + 4, int(t * 0.7) + 2)
	if g > 0.02:
		# tochas, braseiros, lanternas e janelas brilhando através da nevasca
		for key in ["lamp", "fire", "win"]:
			if not D.has(key): continue
			for L in D[key]:
				if not inview(L[0], L[1], 40) or not _inside(L[0], fr_): continue
				ell(L[0], L[1], 18, 14, Color(1, 0.75, 0.4, 0.22 * g), false, 14)
				ell(L[0], L[1], 8, 6, Color(1, 0.85, 0.55, 0.3 * g), false, 10)
		# neve escorrendo dos telhados (nas chaminés) para o leste
		if D.has("smoke"):
			for Sm in D.smoke:
				if not inview(Sm[0], Sm[1], 120) or not _inside(Sm[0], fr_): continue
				for k in 12:
					var u := fmod(tt * 1.1 + k / 12.0 + Sm[0] * 0.003, 1.0)
					fr(Color(1, 1, 1, 0.7 * g * (1.0 - u)), roundi(Sm[0] - 20.0 + fmod(k * 13.7, 40.0) + u * 90.0), roundi(Sm[1] + 14.0 + u * 30.0 + sin(u * 6.0 + k) * 3.0), 2, 1)
		# nuvens de neve rolando
		for k in 7:
			var x: float = cx - 140 + fmod(k * 311.0 + tt * 30.0 + wd * 700.0, VW + 280)
			if not _inside(x, fr_): continue
			var y: float = cy + fmod(k * 173.0, VH) + sin(tt * 0.4 + k) * 20
			var r := 60.0 + 40.0 * sin(k * 2.1)
			ell(x, y, r, r * 0.6, Color(1, 1, 1, 0.16 * g), false, 24)
			ell(x - r * 0.3, y - r * 0.15, r * 0.6, r * 0.4, Color(VEIL, 0.16 * g), false, 20)
		# flocos grandes rodopiando
		for k in 18:
			var x0: float = cx - 60 + fmod(k * 197.3 + tt * 20.0 + wd * 380.0, VW + 120)
			if not _inside(x0, fr_): continue
			var y0: float = cy + fmod(k * 113.7 + tt * 18.0, VH)
			var a: float = tt * (2.0 + k % 3) + k
			fr(Color(1, 1, 1, 0.9 * g), roundi(x0 + cos(a) * 9.0), roundi(y0 + sin(a) * 6.0), 2, 2)
	# neve soprando e neve caindo
	for k in 22 + int(g * 80):
		var u := fmod(tt * 0.35 + k * 0.071, 1.0)
		var x: float = cx + fmod(k * 151.7 + tt * 80.0 + wd * 520.0, VW + 200) - 100
		if k >= 22 and not _inside(x, fr_): continue
		var yy: float = cy + fmod(k * 83.3, VH) + sin(tt * 3.0 + k * 0.7) * 8 * g
		fr(Color(1, 1, 1, (0.3 + g * 0.5) * sin(u * PI)), roundi(x), roundi(yy), 8 + k % 8 + int(g * 26), 1 + (1 if g > 0.5 and k % 3 == 0 else 0))
	for k in 120:
		var big := k % 4 == 0
		var x: float = cx + fmod(k * 73.13 + tt * (14.0 if big else 8.0) + wd * 300.0 + sin(tt * 0.7 + k) * 6.0, VW + 20) - 10
		var y: float = cy + fmod(k * 41.7 + tt * (34.0 if big else 20.0), VH + 20) - 10
		fr(Color(1, 1, 1, 0.85 if big else 0.55), roundi(x), roundi(y), 2 if big else 1, 2 if big else 1)

## respiração visível do jogador (chamar em front)
func frost_breath() -> void:
	if main.dir == 1: return
	var bx: float = main.rpx + (-7.0 if main.dir == 2 else (7.0 if main.dir == 3 else 2.0))
	var by: float = main.rpy - 22.0 + (4.0 if main.dir == 0 else 0.0)
	var ph := fmod(tt, 2.6) / 2.6
	if ph >= 0.55: return
	var u := ph / 0.55
	var side := -1.0 if main.dir == 2 else 1.0
	for k in 3:
		var uu := clampf(u - k * 0.12, 0.0, 1.0)
		ell(bx + side * uu * 10, by - uu * 6 + k, 1.5 + uu * 3.5, 1.2 + uu * 2.5, Color(0.95, 0.97, 1, 0.42 * sin(uu * PI)), false, 10)
