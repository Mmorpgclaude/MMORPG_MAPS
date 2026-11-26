extends "res://scripts/fx_base.gd"
## Gruta do Arco Vermelho (ga), caverna do Acampamento dos Nômades: poeira flutuando no ar parado, areia escorrendo das frestas do teto,
## o fogo das fogueiras dos exploradores (D.fire, como no fx_dx.gd do kit) e o brilho das lanternas (D.lamp).
## Listas do gerador: D.dust [x, y, fase], D.sand [x, y, fase], D.fire [x, y], D.lamp [x, y].

func _flick(i: float) -> float:
	return 0.82 + 0.18 * sin(tt * 9.0 + i * 1.7) * sin(tt * 3.3 + i * 2.9)

func under() -> void:
	pass

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
