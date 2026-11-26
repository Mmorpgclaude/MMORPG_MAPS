extends "res://scripts/fx_sand.gd"
## Travessia das Dunas (dn): vento levando areia em faixas, redemoinhos de poeira andando pelas dunas, abutres
## circulando no céu, estandartes tremulando, fogo dos braseiros nos Portões, reflexos do Oásis Esquecido,
## ar quente tremendo e brilho no topo do portão de Al-Qamar.

func _flick(i: float) -> float:
	return 0.82 + 0.18 * sin(tt * 9.0 + i * 1.7) * sin(tt * 3.3 + i * 2.9)

func under() -> void:
	# oásis: reflexos e ondinhas
	var O = D.get("oasis")
	if O != null and inview(O[0], O[1], O[2] + 20):
		for k in 14:
			var a := k * 2.39996; var rr: float = sqrt(fmod(k * 0.618, 1.0)) * 0.8
			fr(Color(0.85, 1, 0.95, 0.2 + 0.2 * sin(tt * 1.6 + k)), roundi(O[0] + cos(a) * O[2] * rr + sin(tt * 0.4 + k) * 3), roundi(O[1] + sin(a) * O[3] * rr), 3, 1)
		for k in 2:
			var u := fmod(tt * 0.18 + k * 0.5, 1.0)
			ell(O[0], O[1], 6 + u * O[2] * 0.7, (6 + u * O[2] * 0.7) * 0.58, Color(0.85, 1, 0.95, 0.2 * (1.0 - u)), true, 26)
	# sombra dos redemoinhos no chão
	for d in D.devil:
		var X: float = d[0] + sin(tt * 0.05 + d[3]) * d[2] * 3; var Y: float = d[1] + cos(tt * 0.037 + d[3] * 1.3) * d[2] * 1.5
		if inview(X, Y, 60): ell(X, Y, 12, 4, Color(0, 0, 0, 0.16))

func front() -> void:
	# vento: faixas de areia correndo para oeste, mais fortes em rajadas
	var gust := 0.6 + 0.4 * sin(tt * 0.35)
	for k in 70:
		var u := fmod(tt * 0.3 + k * 0.071, 1.0)
		var x: float = cx + VW + 40 - fmod(k * 131.7 + tt * (70.0 + 50.0 * gust), VW + 120); var y: float = cy + fmod(k * 77.3 + sin(tt * 0.5 + k) * 8, VH)
		fr(Color(0.96, 0.86, 0.62, 0.35 * sin(u * PI) * gust), roundi(x), roundi(y), 6 + k % 10, 1)
	# redemoinhos de poeira
	var n := 0
	for d in D.devil:
		n += 1
		var X: float = d[0] + sin(tt * 0.05 + d[3]) * d[2] * 3; var Y: float = d[1] + cos(tt * 0.037 + d[3] * 1.3) * d[2] * 1.5
		if not inview(X, Y - 40, 80): continue
		for j in 60:
			var h := fmod(tt * 0.5 + j / 60.0, 1.0); var r := 3 + h * 15; var a: float = tt * 7.0 + j * 2.4
			var x := X + cos(a) * r + sin(tt * 2.3 + h * 4 + n) * h * 5; var y := Y - h * 58 + sin(a) * r * 0.32
			fr(Color(0.86, 0.72, 0.5, 0.7 * (1 - h) * min(1.0, h * 6)), roundi(x), roundi(y), 2 if j % 3 == 0 else 1, 1)
	# estandartes
	for F in D.flag:
		n += 1
		if not inview(F[0], F[1], 40): continue
		var col := Color("#b03a22") if F[2] == "r" else (Color("#2aa098") if F[2] == "t" else Color("#e8b83a"))
		for i in 14:
			var w := sin(tt * 6.0 + i * 0.5 + n) * (i / 14.0) * 3.0
			fr(col.darkened(0.25 if i % 4 == 0 else 0.0), roundi(F[0] - i), roundi(F[1] + w), 1, 8)
	# fogo dos braseiros
	for B in D.fire:
		n += 1
		if not inview(B[0], B[1], 30): continue
		for k in 5:
			var u := k / 4.0; var x: float = B[0] - 5 + u * 10
			var h: float = (4 + 5 * sin(u * PI)) * (0.7 + 0.3 * sin(tt * 7.0 + k * 1.9 + n))
			fr(Color("#c8341a"), roundi(x) - 1, roundi(B[1] - h), 3, roundi(h)); fr(Color("#ff8a2a"), roundi(x), roundi(B[1] - h * 0.7), 2, roundi(h * 0.7)); fr(Color("#ffd86a"), roundi(x), roundi(B[1] - h * 0.3), 1, roundi(h * 0.3))
		var u2 := fmod(tt * 0.6 + n * 0.3, 1.0)
		fr(Color(1, 0.6, 0.2, 1.0 - u2), roundi(B[0] + sin(n + tt * 2) * 3), roundi(B[1] - 10 - u2 * 18), 1, 1)
	# abutres circulando (sombra no chão + ave no alto)
	for b in D.bird:
		n += 1
		var a: float = tt * 0.35 + b[3]
		var x: float = b[0] + cos(a) * b[2]; var y: float = b[1] + sin(a) * b[2] * 0.55
		if not inview(x, y, 60): continue
		fr(Color(0, 0, 0, 0.13), roundi(x + 30) - 6, roundi(y + 70), 12, 2)
		var fl := sin(tt * 3.0 + n) * 1.5
		fr(Color("#2a2220"), roundi(x) - 7, roundi(y + fl), 6, 1); fr(Color("#2a2220"), roundi(x) + 2, roundi(y + fl), 6, 1); fr(Color("#2a2220"), roundi(x) - 1, roundi(y), 3, 2); fr(Color("#c8b0a0"), roundi(x), roundi(y) - 1, 1, 1)
	# ar quente tremendo (só de dia)
	var da: float = main.dark_a
	if da < 0.2:
		for k in 6:
			var y: float = cy + fmod(k * 97.0 - tt * 12.0, VH)
			draw_rect(Rect2(cx, y, VW, 2), Color(1, 0.95, 0.8, 0.03 * (1.0 - da * 5.0)))

func glow(_a: float) -> void:
	var G: Texture2D = main.lamp_glow
	var n := 0
	for B in D.fire:
		n += 1
		if not inview(B[0], B[1], 90): continue
		gl(G, B[0], B[1] - 4, 50, 0.5 * _flick(n), 1.0, false); gl(G, B[0], B[1] - 4, 14, 0.6 * _flick(n), 1.0, false)
	var Gt = D.get("gate")
	if Gt != null and inview(Gt[0], Gt[1] - 80, 120):
		gl(G, Gt[0], Gt[1] - 82, 26, 0.25 + 0.1 * sin(tt * 1.5), 1.0, false)
