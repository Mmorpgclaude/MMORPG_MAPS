extends "res://scripts/fx_base.gd"
## Lago Subterrâneo (lg), embaixo da Gruta do Arco Vermelho: poeira flutuando no ar parado, areia escorrendo das frestas do teto,
## o fogo das fogueiras dos exploradores (D.fire, como no fx_dx.gd do kit) e o brilho das lanternas (D.lamp).
## Vida no lago: ondinhas e reflexos (D.ripple), gotas pingando do teto e abrindo círculos na água (D.drop), névoa fina sobre
## a água, mais forte à noite (D.mist), feixes de luz de fendas do teto (D.beam) e a água batendo na estátua afundada (D.statue).
## Listas do gerador: D.dust [x, y, fase], D.sand [x, y, fase], D.fire [x, y], D.lamp [x, y].

func _flick(i: float) -> float:
	return 0.82 + 0.18 * sin(tt * 9.0 + i * 1.7) * sin(tt * 3.3 + i * 2.9)

func under() -> void:
	pass

func _lago() -> void:
	# reflexos e ondinhas na água
	for P in D.ripple:
		if not inview(P[0], P[1], 20): continue
		var a := 0.5 + 0.5 * sin(tt * 1.3 + P[2] * 2.0)
		fr(Color(0.62, 0.86, 0.92, 0.6 * a), roundi(P[0] + sin(tt * 0.4 + P[2]) * 4.0), roundi(P[1]), 5 + int(a * 4.0), 1)
		if a > 0.85: fr(Color(1, 0.86, 0.55, 0.5), roundi(P[0] + 2), roundi(P[1]) - 1, 1, 1)
	# gotas: a gota cai e abre dois círculos na água
	for P in D.drop:
		if not inview(P[0], P[1], 40): continue
		var u := fmod(tt * 0.35 + P[2] * 0.137, 1.0)
		if u < 0.15:
			fr(Color(0.75, 0.9, 1.0, 0.8), roundi(P[0]), roundi(P[1] - 40.0 * (1.0 - u / 0.15)), 1, 2)
		else:
			var v := (u - 0.15) / 0.85
			ell(P[0], P[1], 2.0 + v * 14.0, 1.0 + v * 6.0, Color(0.75, 0.92, 1.0, 0.7 * (1.0 - v)), true, 18)
			if v > 0.2: ell(P[0], P[1], 1.0 + (v - 0.2) * 9.0, 0.5 + (v - 0.2) * 4.0, Color(0.7, 0.9, 1.0, 0.35 * (1.0 - v)), true, 14)
	# luz vinda do fundo: manchas âmbar e azuladas pulsando embaixo da água
	for P in D.get("deep", []):
		if not inview(P[0], P[1], 90): continue
		var p := 0.55 + 0.45 * sin(tt * 0.6 + P[3])
		var col := Color(1.0, 0.62, 0.2) if P[2] == 0 else Color(0.3, 0.75, 1.0)
		for k in 4:
			var r := 70.0 - k * 15.0
			ell(P[0] + sin(tt * 0.2 + P[3]) * 4.0, P[1], r, r * 0.55, Color(col.r, col.g, col.b, 0.09 * p), false, 28)
		for j in 5:
			var u := fmod(tt * 0.25 + j * 0.2 + P[3], 1.0)
			fr(Color(col.r, col.g, col.b, 0.6 * sin(u * PI) * p), roundi(P[0] + sin(j * 2.3) * 30.0), roundi(P[1] + cos(j * 1.7) * 14.0), 1, 1)
	# a água batendo nas ruínas afundadas
	for R in D.get("sunk", []):
		if not inview(R[0], R[1], 60): continue
		for k in 2:
			var v := fmod(tt * 0.3 + k * 0.5 + R[0] * 0.001, 1.0)
			ell(R[0], R[1], R[2] * 0.4 + v * 10.0, 3.0 + v * 3.0, Color(0.7, 0.9, 1.0, 0.3 * (1.0 - v)), true, 20)
	# a água batendo na estátua
	var S = D.get("statue")
	if S != null and inview(S[0], S[1], 80):
		for k in 3:
			var v := fmod(tt * 0.25 + k / 3.0, 1.0)
			ell(S[0], S[1], S[2] * 0.45 + v * 14.0, 5.0 + v * 4.0, Color(0.7, 0.9, 1.0, 0.3 * (1.0 - v)), true, 24)


func front() -> void:
	# poeira flutuando devagar
	for P in D.dust:
		var x: float = P[0] + sin(tt * 0.3 + P[2]) * 14.0; var y: float = P[1] + cos(tt * 0.23 + P[2] * 1.3) * 10.0
		if not inview(x, y, 10): continue
		var a := 0.25 + 0.25 * sin(tt * 1.1 + P[2] * 3.0)
		fr(Color(0.95, 0.85, 0.65, a), roundi(x), roundi(y), 1, 1)
	# areia escorrendo do teto em fios finos
	for P in D.sand:
		if not inview(P[0], P[1] + 20, 30): continue
		for k in 8:
			var u := fmod(tt * 0.9 + k / 8.0 + P[2], 1.0)
			fr(Color(0.85, 0.7, 0.46, 0.75 * (1.0 - u)), roundi(P[0] + sin(k * 1.7) * 1.5), roundi(P[1] + u * 34.0), 1, 2)
		var p := fmod(tt * 0.5 + P[2], 1.0)
		ell(P[0], P[1] + 36.0, 3.0 + p * 4.0, 1.5 + p * 1.5, Color(0.85, 0.7, 0.46, 0.25 * (1.0 - p)), false, 10)
	# fogo das fogueiras
	var n := 0
	for B in D.fire:
		n += 1
		if not inview(B[0], B[1], 30): continue
		for k in 5:
			var u := k / 4.0; var x: float = B[0] - 5 + u * 10
			var h: float = (4 + 5 * sin(u * PI)) * (0.7 + 0.3 * sin(tt * 7.0 + k * 1.9 + n))
			fr(Color("#c8341a"), roundi(x) - 1, roundi(B[1] - h), 3, roundi(h)); fr(Color("#ff8a2a"), roundi(x), roundi(B[1] - h * 0.7), 2, roundi(h * 0.7)); fr(Color("#ffd86a"), roundi(x), roundi(B[1] - h * 0.3), 1, roundi(h * 0.3))
		var u2 := fmod(tt * 0.6 + n * 0.3, 1.0)
		fr(Color(1, 0.6, 0.2, 1.0 - u2), roundi(B[0] + sin(n + tt * 2) * 3), roundi(B[1] - 10 - u2 * 18), 1, 1)

func glow(_a: float) -> void:
	# vida no lago, na camada de luz (por cima do escuro da caverna)
	_lago()
	# névoa fina sobre o lago (mais forte à noite)
	var k0: float = 0.6 + 0.6 * clampf(main.dark_a, 0.0, 1.0)
	for M in D.mist:
		if not inview(M[0], M[1], 80): continue
		var u := fmod(tt * 0.03 + M[2] * 0.159, 1.0)
		ell(M[0] + (u - 0.5) * 90.0, M[1] + sin(tt * 0.2 + M[2]) * 4.0, 40.0, 8.0, Color(0.8, 0.9, 0.95, 0.12 * k0 * sin(u * PI)), false, 18)
	# feixes de luz fraca descendo de fendas do teto, com poeira brilhando
	for B in D.beam:
		if not inview(B[0], B[1], 120): continue
		var p := 0.75 + 0.25 * sin(tt * 0.5 + B[0] * 0.01)
		for i in 10:
			var w := 10.0 + i * 3.0
			fr(Color(1, 0.92, 0.7, 0.045 * p), roundi(B[0] - w * 0.5 + i * 4.0), roundi(B[1] - 120 + i * 12), int(w), 12)
		for j in 6:
			var u := fmod(tt * 0.12 + j / 6.0, 1.0)
			fr(Color(1, 0.95, 0.75, 0.6 * sin(u * PI)), roundi(B[0] + sin(j * 2.1 + tt * 0.3) * 8.0 + u * 20.0), roundi(B[1] - 110 + u * 110), 1, 1)
	var G: Texture2D = main.lamp_glow
	var n := 0
	for B in D.fire:
		n += 1
		if not inview(B[0], B[1], 90): continue
		gl(G, B[0], B[1] - 4, 54, 0.5 * _flick(n), 1.0, false); gl(G, B[0], B[1] - 4, 14, 0.6 * _flick(n), 1.0, false)
	for L in D.lamp:
		n += 1
		if not inview(L[0], L[1], 60): continue
		gl(G, L[0], L[1], 30, 0.4 * _flick(n), 1.0, false); gl(G, L[0], L[1], 8, 0.6, 1.0, false)
