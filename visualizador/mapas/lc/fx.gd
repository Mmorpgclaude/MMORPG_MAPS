extends "res://scripts/fx_frost.gd"
## Bosque dos Corvos Brancos (lc): neve caindo, nevasca e respiração do jogador (fx_frost.gd), mais:
##   névoa baixa rolando entre as árvores; corvos voando em círculos em volta da Árvore dos Corvos; penas pretas caindo
##   da Árvore e do Ninhal; velas tremulando no altar; runas do Poço pulsando em azul; à noite, olhos amarelos piscando
##   no escuro entre as árvores. Listas do gerador: D.mist, D.raven, D.feather, D.candle, D.rune, D.eyes.

func under() -> void:
	# névoa baixa: faixas largas e claras que rolam devagar rente ao chão
	var n := 0
	for M in D.mist:
		n += 1
		if not inview(M[0], M[1], 90): continue
		var u := fmod(tt * 0.05 + n * 0.37, 1.0)
		var a := 0.13 * sin(u * PI)
		ell(M[0] + (u - 0.5) * 120.0, M[1] + sin(tt * 0.3 + n) * 3.0, 46.0, 9.0, Color(0.86, 0.9, 0.96, a), false, 20)
		ell(M[0] + (u - 0.5) * 120.0 + 22.0, M[1] - 4.0, 28.0, 6.0, Color(0.92, 0.95, 1.0, a * 0.8), false, 16)
	frost_ground()

func front() -> void:
	# velas do altar
	var n := 0
	for C in D.candle:
		n += 1
		if not inview(C[0], C[1], 20): continue
		var f := sin(tt * 11.0 + n * 2.3) + sin(tt * 17.0 + n)
		var h := 3 + (1 if f > 0.6 else 0)
		var x := roundi(C[0]) + (1 if f > 1.2 else 0)
		fr(Color("#ff9a2e"), x, roundi(C[1]) - h, 2, h)
		fr(Color("#ffe27a"), x, roundi(C[1]) - h + 1, 1, h - 1)
		if fmod(tt * 0.9 + n * 0.33, 1.0) < 0.5:
			var u := fmod(tt * 1.8 + n * 0.5, 1.0)
			fr(Color(0.7, 0.7, 0.75, 0.35 * (1.0 - u)), x + roundi(sin(u * 6.0 + n) * 2.0), roundi(C[1]) - h - 2 - roundi(u * 12.0), 1, 1)
	# runas do poço pulsando
	n = 0
	for R in D.rune:
		n += 1
		if not inview(R[0], R[1], 20): continue
		var a := 0.25 + 0.25 * sin(tt * 1.6 + n * 1.7)
		fr(Color(0.55, 0.85, 1.0, a), roundi(R[0]) - 3, roundi(R[1]) - 6, 6, 12)
	# penas caindo, balançando de um lado para o outro
	n = 0
	for P in D.feather:
		n += 1
		var u := fmod(tt * 0.12 + P[2] * 0.159, 1.0)
		var x: float = P[0] + sin(tt * 1.6 + P[2]) * 10.0
		var y: float = P[1] + u * 110.0
		if not inview(x, y, 10): continue
		var a := sin(u * PI)
		var tilt := 1 if sin(tt * 1.6 + P[2]) > 0 else -1
		fr(Color(0.08, 0.09, 0.12, a), roundi(x), roundi(y), 1, 3)
		fr(Color(0.16, 0.18, 0.24, a), roundi(x) + tilt, roundi(y) + 1, 1, 2)
	# corvos voando em círculos em volta da Árvore dos Corvos
	n = 0
	for B in D.raven:
		n += 1
		var ang: float = tt * B[5] + B[4]
		var x: float = B[0] + cos(ang) * B[2]
		var y: float = B[1] + sin(ang) * B[3] + sin(tt * 0.7 + n) * 6.0
		if not inview(x, y, 20): continue
		var fl := sin(tt * 9.0 + n * 1.3)
		var wy := roundi(fl * 2.0)
		var col := Color("#14161e")
		fr(col, roundi(x) - 1, roundi(y), 3, 2)                       # corpo
		fr(col, roundi(x) - 5, roundi(y) - wy, 4, 1)                  # asa esquerda
		fr(col, roundi(x) + 2, roundi(y) - wy, 4, 1)                  # asa direita
		fr(col, roundi(x) - 6, roundi(y) - wy - (1 if fl > 0 else -1), 1, 1)
		fr(col, roundi(x) + 6, roundi(y) - wy - (1 if fl > 0 else -1), 1, 1)
		fr(Color("#2a3040"), roundi(x) + (2 if cos(ang) < 0 else -2), roundi(y), 1, 1)
	frost_breath()
	frost_air()

func glow(a: float) -> void:
	# brilho das velas (sempre um pouco; mais à noite) e das runas
	var k := 0.35 + 0.65 * clampf(a / 0.6, 0.0, 1.0)
	var n := 0
	for C in D.candle:
		n += 1
		if not inview(C[0], C[1], 40): continue
		var f := 0.85 + 0.15 * sin(tt * 13.0 + n * 2.0)
		ell(C[0], C[1] - 3, 18, 13, Color(1.0, 0.6, 0.25, 0.14 * k * f), false, 16)
		ell(C[0], C[1] - 3, 7, 5, Color(1.0, 0.8, 0.45, 0.25 * k * f), false, 12)
	n = 0
	for R in D.rune:
		n += 1
		if not inview(R[0], R[1], 40): continue
		var p := 0.6 + 0.4 * sin(tt * 1.6 + n * 1.7)
		ell(R[0], R[1], 16, 20, Color(0.4, 0.75, 1.0, 0.12 * k * p), false, 16)
	# olhos no escuro (só à noite): pares de pontos amarelos que aparecem, piscam e somem
	var kn := clampf((a - 0.25) / 0.35, 0.0, 1.0)
	if kn <= 0.0: return
	for E in D.eyes:
		if not inview(E[0], E[1], 10): continue
		var v := sin(tt * 0.35 + E[2] * 3.0)
		if v < 0.3: continue
		if fmod(tt + E[2] * 2.0, 5.0) < 0.18: continue        # piscada
		var al := kn * clampf((v - 0.3) * 3.0, 0.0, 1.0)
		var ox := roundi(sin(tt * 0.2 + E[2]) * 2.0)
		fr(Color(1.0, 0.82, 0.3, al), roundi(E[0]) - 3 + ox, roundi(E[1]), 2, 1)
		fr(Color(1.0, 0.82, 0.3, al), roundi(E[0]) + 2 + ox, roundi(E[1]), 2, 1)
