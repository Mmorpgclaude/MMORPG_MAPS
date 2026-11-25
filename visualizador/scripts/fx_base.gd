extends Node2D
## Base dos efeitos animados por mapa (porte das funções xxL / xxF / xxG do HTML).
##   layer 0 = sob os objetos (xxL)   · layer 1 = sobre os objetos (xxF)   · layer 2 = brilho aditivo acima da noite (xxG)
## Os dados vêm de assets/maps/<id>/fx/fx.json, exportados do jogo HTML; {"$i": k} vira textura e {"$b": ...} vira array.

var main: Node
var layer := 0
var D: Dictionary
var base := ""
var tt := 0.0
var cx := 0.0
var cy := 0.0
var VW := 0.0
var VH := 0.0
var _cc := {}

func setup(b: String, d: Dictionary) -> void:
	base = b
	D = _dec(d)
	texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
	_init_fx()

func _init_fx() -> void:
	pass

func _dec(v):
	if v is Dictionary:
		if v.has("$i"):
			return load(base + "fx/" + v["$i"] + ".png")
		if v.has("$b"):
			var raw := Marshalls.base64_to_raw(v["$b"])
			match v.t:
				"Float32Array": return raw.to_float32_array()
				"Int32Array": return raw.to_int32_array()
				"Uint16Array", "Int16Array":
					var a := PackedInt32Array(); a.resize(raw.size() / 2)
					for i in a.size():
						a[i] = raw.decode_s16(i * 2) if v.t == "Int16Array" else raw.decode_u16(i * 2)
					return a
				_: return raw
		var o := {}
		for k in v:
			o[k] = _dec(v[k])
		return o
	if v is Array:
		var a := []
		a.resize(v.size())
		for i in v.size():
			a[i] = _dec(v[i])
		return a
	return v

func _process(_d: float) -> void:
	queue_redraw()

static var prof_us := 0
func _draw() -> void:
	if main == null:
		return
	var _t0 := Time.get_ticks_usec()
	_draw_layer()
	prof_us += Time.get_ticks_usec() - _t0

func _draw_layer() -> void:
	tt = main.tt
	cx = main.cam.position.x
	cy = main.cam.position.y
	VW = main.VW
	VH = main.VH
	match layer:
		0:
			if D.get("LG") is Array and D.LG.size():
				lgd()
			under()
		1: front()
		2:
			glow(main.dark_a)
			# lampiões (LP) — mesmo brilho do laço principal do HTML
			if main.md.has("lp"):
				for p in main.md.lp:
					if inview(p[0], p[1], 40): im(main.lamp_glow, p[0] - 40, p[1] - 40, 80, 80, main.lit)

func under() -> void:
	pass

func front() -> void:
	pass

func glow(_a: float) -> void:
	pass

# ---------------------------------------------------------------- utilidades no estilo do canvas do HTML
func c(s: String) -> Color:
	if not _cc.has(s):
		_cc[s] = Data.col(s)
	return _cc[s]

func rgba(r: float, g: float, b: float, a: float) -> Color:
	return Color(r / 255.0, g / 255.0, b / 255.0, clampf(a, 0, 1))

## "R,G,B" (como nos templates `rgba(${c},a)` do HTML)
func rgbs(s: String, a: float) -> Color:
	var p := s.split(",")
	return rgba(float(p[0]), float(p[1]), float(p[2]), a)

func fr(col: Color, x: float, y: float, w: float, h: float) -> void:
	if w > 0 and h > 0 and col.a > 0.0:
		draw_rect(Rect2(x, y, w, h), col)

func im(t: Texture2D, x: float, y: float, w := -1.0, h := -1.0, al := 1.0) -> void:
	if t == null or al <= 0.0:
		return
	if w < 0:
		w = t.get_width(); h = t.get_height()
	draw_texture_rect(t, Rect2(x, y, w, h), false, Color(1, 1, 1, clampf(al, 0, 1)))

func ell(x: float, y: float, rx: float, ry: float, col: Color, stroke := false, n := 24) -> void:
	var pts := PackedVector2Array()
	for i in n + 1:
		var a := TAU * i / n
		pts.append(Vector2(x + cos(a) * rx, y + sin(a) * ry))
	if stroke:
		draw_polyline(pts, col, 1.0)
	else:
		draw_colored_polygon(pts, col)

func ti(v: float) -> int:
	## x|0 do JavaScript (trunca em direção ao zero)
	return int(v)

func jm(a: float, b: float) -> float:
	## a % b do JavaScript (resto com o sinal de a)
	return fmod(a, b)

func pm(a: float, b: float) -> float:
	## ((a % b) + b) % b
	return fmod(fmod(a, b) + b, b)

static func hq(a: int, b: int) -> float:
	var h: int = (a * 374761393 + b * 668265263) & 0xFFFFFFFF
	h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
	return float(h ^ (h >> 16)) / 4294967296.0

func inview(x: float, y: float, m: float) -> bool:
	return x >= cx - m and x <= cx + VW + m and y >= cy - m and y <= cy + VH + m

## G() das funções de brilho: textura centrada em (x,y) com raio r (coordenadas do mundo)
func gl(t: Texture2D, x: float, y: float, r: float, al: float, k: float, clamp1 := true) -> void:
	if x + r < cx or y + r < cy or x - r > cx + VW or y - r > cy + VH:
		return
	var a: float = al * k
	a = clampf(a, 0, 1) if clamp1 else max(0.0, a)
	im(t, ti(x - r), ti(y - r), r * 2, r * 2, a)

# ---------------------------------------------------------------- LGD (lampiões/água/grama/flores/cogumelos/vaga-lumes da lista LG)
const MCG := [["#2ad0b0", "#6ff0d4", "#d8fff4"], ["#9a5ae0", "#c88aff", "#f0d8ff"], ["#5ad060", "#9af09a", "#e8ffe8"]]
func lgd() -> void:
	for q in D.LG:
		var x: float = q[0]; var y: float = q[1]
		if x < cx - 10 or x > cx + VW + 10 or y < cy - 14 or y > cy + VH + 10:
			continue
		var t: int = q[2]; var p: float = q[3]
		if t == 0:
			var v := sin(tt * 2.1 + p)
			if v > 0.5: fr(c("#f2fbff") if v > 0.88 else c("#a8dcf6"), x, y, 3 if v > 0.88 else 2, 1)
		elif t == 1:
			var u := fmod(tt * 0.4 + p, 1.0); var w: int = 2 + int(u * 9); var a := 0.6 * (1 - u)
			var col := rgbs("170,230,190" if q[4] else "214,242,255", a)
			fr(col, x - (w >> 1), y - 1, w, 1); fr(col, x - (w >> 1), y + 1, w, 1); fr(col, x - (w >> 1) - 1, y, 1, 1); fr(col, x + (w >> 1) + (w & 1), y, 1, 1)
		elif t == 2:
			var h: int = q[4]; var o := roundi(sin(tt * 1.7 + p + x * 0.1) * 1.4); var a: int = h / 3
			fr(c("#3f8f45"), x, y - a, 1, a); fr(c("#3f8f45"), x + roundi(o / 2.0), y - 2 * a, 1, a); fr(c("#5cb256"), x + o, y - h, 1, h - 2 * a)
			if q.size() > 5 and q[5]:
				fr(c("#6b4524"), x + o, y - h - 2, 2, 4); fr(c("#8a5c30"), x + o, y - h - 2, 1, 1)
			else:
				fr(c("#7cc25a"), x + o + 1, y - h + 1, 1, 2)
		elif t == 3:
			var b := roundi(sin(tt * 1.2 + p) * 0.6)
			fr(c("#3a9a48"), x - 2, y - 1 + b, 5, 1); fr(c("#3a9a48"), x - 3, y + b, 7, 1); fr(c("#3a9a48"), x - 2, y + 1 + b, 5, 1)
			fr(c("#69c85a"), x - 1, y - 1 + b, 2, 1); fr(c("#2a6e38"), x + 1, y + b, 3, 1)
			if q[4]:
				fr(c("#ff8fc2"), x - 1, y - 2 + b, 3, 1); fr(c("#ff8fc2"), x, y - 3 + b, 1, 3); fr(c("#f5d442"), x, y - 2 + b, 1, 1)
		elif t == 5:
			var u := tt * 0.14 + p
			var mx := x + roundi(sin(u * 3) * 6); var my := y + roundi(cos(u * 2.3) * 3)
			var a: float = 0.25 + 0.45 * max(0.0, sin(tt * 1.8 + p))
			if a > 0.3:
				fr(rgba(168, 240, 190, a), mx, my, 1, 1)
				if a > 0.55:
					fr(rgba(168, 240, 190, a * 0.3), mx - 1, my, 3, 1); fr(rgba(168, 240, 190, a * 0.3), mx, my - 1, 1, 3)
		elif t == 6:
			var cc: Array = MCG[int(q[4])]; var g1 := 0.55 + 0.45 * sin(tt * 2 + p)
			fr(c("#cfd8c0"), x, y - 3, 1, 3); fr(c(cc[0]), x - 2, y - 5, 5, 2); fr(c(cc[2] if g1 > 0.8 else cc[1]), x - 1, y - 6, 3, 1); fr(c("#fff8"), x - 1, y - 5, 1, 1)
		elif t == 9:
			var v := sin(tt * 1.7 + p)
			if v > 0.6: fr(c("#7fd0a0"), x, y, 2 if v > 0.9 else 1, 1)
		elif t == 7:
			pass
		else:
			fr(rgba(236, 248, 255, 0.12 + 0.33 * (sin(tt * 1.5 + p) * 0.5 + 0.5)), x, y, q[4], 1)
