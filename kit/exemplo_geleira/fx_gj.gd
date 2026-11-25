extends "res://scripts/fx_frost.gd"
## Geleira do Gigante Adormecido (gj): neve caindo, nevasca e respiração do jogador (fx_frost.gd), mais:
##   névoa fria subindo das fendas; brilho nos cristais de gelo e na cachoeira congelada; corvos;
##   à noite, aurora boreal — cortinas verdes e violeta ondulando no alto da tela (mais forte quanto mais escuro).

func under() -> void:
	# névoa saindo das fendas
	var n := 0
	for M in D.mist:
		n += 1
		if not inview(M[0], M[1], 40): continue
		for k in 3:
			var u := fmod(tt * 0.18 + k / 3.0 + n * 0.29, 1.0)
			ell(M[0] + sin(tt * 0.5 + n + k) * 6, M[1] - u * 26, 6 + u * 10, 3 + u * 4, Color(0.85, 0.93, 1.0, 0.22 * (1.0 - u)), false, 12)
	# brilhos na neve e no gelo
	for k in 30:
		var x: float = cx + fmod(k * 97.1, VW); var y: float = cy + fmod(k * 53.9 + floor(tt * 0.5 + k) * 37.0, VH)
		var a := sin(tt * 3.0 + k * 1.7)
		if a > 0.7: fr(Color(1, 1, 1, (a - 0.7) * 3.0), roundi(x), roundi(y), 1, 1)
	frost_ground()

func front() -> void:
	# cristais piscando
	var n := 0
	for G in D.glint:
		n += 1
		if not inview(G[0], G[1], 20): continue
		var a := sin(tt * 2.3 + n * 1.9)
		if a > 0.6:
			var al := (a - 0.6) * 2.5
			fr(Color(1, 1, 1, al), roundi(G[0]), roundi(G[1]) - 2, 1, 5); fr(Color(1, 1, 1, al), roundi(G[0]) - 2, roundi(G[1]), 5, 1)
	# cachoeira congelada: brilhos descendo e pó de gelo no pé
	var Fa = D.get("fall")
	if Fa != null and inview(Fa[0], (Fa[1] + Fa[2]) * 0.5, 120):
		for k in 14:
			var u := fmod(tt * 0.35 + k * 0.137, 1.0)
			fr(Color(0.95, 1, 1, 0.7 * (1.0 - u)), roundi(Fa[0] + sin(k * 2.3) * Fa[3] * 0.4), roundi(lerpf(Fa[1], Fa[2], u)), 1, 3)
		for k in 6:
			var u := fmod(tt * 0.25 + k / 6.0, 1.0)
			ell(Fa[0] + sin(k * 1.7) * 18, Fa[2] - u * 14, 6 + u * 12, 3 + u * 4, Color(1, 1, 1, 0.25 * (1.0 - u)), false, 12)
	# corvos voando em círculos
	n = 0
	for b in D.bird:
		n += 1
		var a2: float = tt * 0.25 + b[3]
		var x: float = b[0] + cos(a2) * 140; var y: float = b[1] + sin(a2) * 60
		if not inview(x, y, 20): continue
		var fl := sin(tt * 9.0 + n) * 2
		fr(Color("#1a1a22"), roundi(x) - 4, roundi(y + fl), 4, 1); fr(Color("#1a1a22"), roundi(x) + 1, roundi(y + fl), 4, 1); fr(Color("#1a1a22"), roundi(x), roundi(y), 1, 2)
	frost_breath()
	frost_air()

func glow(a: float) -> void:
	# aurora boreal: só à noite, em faixas que ondulam devagar no alto da tela
	var k0 := clampf((a - 0.2) / 0.35, 0.0, 1.0)
	if k0 <= 0.0: return
	var cols := [Color(0.35, 1.0, 0.6), Color(0.3, 0.85, 0.95), Color(0.75, 0.45, 1.0)]
	for band in 3:
		var base_y: float = cy + VH * 0.3 + band * 24.0
		var col: Color = cols[band]
		var i := 0.0
		while i < VW:
			var x: float = cx + i
			var w := sin(x * 0.006 + tt * 0.25 + band * 1.7) * 18.0 + sin(x * 0.017 - tt * 0.4 + band) * 7.0
			var y: float = base_y + w
			var pulse := 0.55 + 0.45 * sin(x * 0.011 + tt * 0.6 + band * 2.1)
			var al := 0.3 * k0 * pulse
			fr(Color(col.r, col.g, col.b, al * 0.35), roundi(x), roundi(y - 40), 4, 28)
			fr(Color(col.r, col.g, col.b, al), roundi(x), roundi(y - 12), 4, 14)
			fr(Color(col.r, col.g, col.b, al * 0.45), roundi(x), roundi(y + 2), 4, 10)
			i += 4.0
