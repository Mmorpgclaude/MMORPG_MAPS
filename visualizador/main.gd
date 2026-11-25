extends Node2D
## Visualizador de mapas no padrão do kit do Valdória.
## Carrega visualizador/mapas/<id>/ (gerado por visualizador_ferramentas/exporta_mapa.py) e mostra o mapa como o jogo:
## chão desenhado pelo shader do mapa (floor.gdshader + gen_common), ov por cima, objetos ordenados pela base,
## efeitos do mapa (fx.gd: under / front / glow), luzes à noite, zonas e passagens.
## Linha de comando (teste): -- --mapa=<id>  --compara=<floor_ref.png>  --foto=<arquivo.png> --px=<x> --py=<y> --noite

const T := 16
const SPEED := 110.0
const JOY_R := 60.0

# --- o que os efeitos (fx_base.gd / fx_frost.gd) leem do "main" do jogo
var tt := 0.0
var cam := Node2D.new()     # posição = canto de cima à esquerda da tela, no mundo
var VW := 640.0
var VH := 360.0
var dark_a := 0.0
var md := {}
var lamp_glow: Texture2D
var lit := 1.0
var dir := 0                # 0 baixo, 1 cima, 2 esquerda, 3 direita
var rpx := 0.0
var rpy := 0.0

var M: Dictionary
var base := ""
var W := 0
var H := 0
var S := PackedByteArray()
var Z := []
var floor_tex: ImageTexture
var world: Node2D
var sorter: Node2D
var player: Node2D
var camera: Camera2D
var night: Sprite2D
var debug_layer: Node2D
var show_col := false
var zone_last := -1
var zone_timer := 0.0
var joy_id := -1
var joy_c := Vector2.ZERO
var joy_v := Vector2.ZERO
var walk_t := 0.0
var args := {}

# UI
var ui: CanvasLayer
var hud: Control
var lbl_info: Label
var lbl_zone: Label
var lbl_load: Label
var btns: HBoxContainer
var overview: Control
var menu: Control

func _ready() -> void:
	for a in OS.get_cmdline_user_args():
		var p := a.trim_prefix("--").split("=", true, 1)
		args[p[0]] = p[1] if p.size() > 1 else "1"
	_build_ui()
	var lista: Array = JSON.parse_string(FileAccess.get_file_as_string("res://mapas/lista.json"))
	if args.has("mapa"):
		load_map(args.mapa)
	elif lista.size() == 1:
		load_map(lista[0].id)
	else:
		_show_menu(lista)

# ------------------------------------------------------------------ carregar
func load_map(id: String) -> void:
	if menu: menu.visible = false
	if world: world.queue_free()
	base = "res://mapas/%s/" % id
	M = JSON.parse_string(FileAccess.get_file_as_string(base + "map.json"))
	W = int(M.W); H = int(M.H)
	S = M.S.to_ascii_buffer()
	Z = M.z
	lbl_load.text = "Carregando %s..." % M.nome
	lbl_load.visible = true
	await get_tree().process_frame
	await _bake_floor()
	world = Node2D.new(); add_child(world); move_child(world, 0)
	var fl := Sprite2D.new(); fl.texture = floor_tex; fl.centered = false; world.add_child(fl)
	var ov := Sprite2D.new(); ov.texture = load(base + "ov.png"); ov.centered = false; world.add_child(ov)
	var fxs := load(base + "fx.gd")
	world.add_child(_fx(fxs, 0))
	sorter = Node2D.new(); sorter.y_sort_enabled = true; world.add_child(sorter)
	for e in M.ents:
		var n := Node2D.new(); n.position = Vector2(e[0], e[1])
		var s := Sprite2D.new(); s.texture = load(base + "ents/%s.png" % e[3]); s.centered = false
		s.position = Vector2(0, float(e[2]) - 2.0 - float(e[1]))
		n.add_child(s); sorter.add_child(n)
	player = Node2D.new(); player.draw.connect(_draw_player); sorter.add_child(player)
	world.add_child(_fx(fxs, 1))
	night = Sprite2D.new(); night.centered = false; night.scale = Vector2(2, 2); world.add_child(night)
	world.add_child(_fx(fxs, 2))
	debug_layer = Node2D.new(); debug_layer.draw.connect(_draw_debug); world.add_child(debug_layer)
	camera = Camera2D.new(); camera.limit_left = 0; camera.limit_top = 0; camera.limit_right = W * T; camera.limit_bottom = H * T
	player.add_child(camera)
	player.position = _spawn()
	if args.has("px"): player.position = Vector2(float(args.px) * T + 8, float(args.py) * T + 8)
	dark_a = 0.0
	if args.has("noite"): _set_dark(0.75)
	zone_last = -1
	lbl_load.visible = false
	hud.visible = true
	camera.reset_smoothing()
	if args.has("compara"): _compara(args.compara)
	if args.has("foto"):
		for i in 20: await get_tree().process_frame
		get_viewport().get_texture().get_image().save_png(args.foto)
		get_tree().quit()

func _fx(scr: Script, layer: int) -> Node2D:
	var n: Node2D = scr.new()
	n.main = self
	n.layer = layer
	n.setup(base, M.fx)
	if layer == 2: n.material = CanvasItemMaterial.new(); n.material.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	return n

## O chão: o shader do mapa desenhado pedaço por pedaço numa SubViewport e guardado numa textura (como o jogo vê).
func _bake_floor() -> void:
	const CH := 512
	var vp := SubViewport.new(); vp.size = Vector2i(CH, CH); vp.transparent_bg = false
	vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS; vp.disable_3d = true
	var r := ColorRect.new(); r.size = Vector2(CH, CH)
	var mat := ShaderMaterial.new(); mat.shader = load(base + "floor.gdshader")
	mat.set_shader_parameter("data", load(base + "data.png"))
	mat.set_shader_parameter("map_size", Vector2i(W, H))
	mat.set_shader_parameter("chunk", float(CH))
	r.material = mat; vp.add_child(r); add_child(vp)
	var img := Image.create(W * T, H * T, false, Image.FORMAT_RGBA8)
	var nx := ceili(W * T / float(CH)); var ny := ceili(H * T / float(CH))
	for j in ny:
		for i in nx:
			mat.set_shader_parameter("origin", Vector2(i * CH, j * CH))
			await RenderingServer.frame_post_draw
			await RenderingServer.frame_post_draw
			var part := vp.get_texture().get_image(); part.convert(Image.FORMAT_RGBA8)
			img.blit_rect(part, Rect2i(0, 0, CH, CH), Vector2i(i * CH, j * CH))
			lbl_load.text = "Desenhando o chão... %d%%" % int(100.0 * (j * nx + i + 1) / (nx * ny))
	vp.queue_free()
	floor_tex = ImageTexture.create_from_image(img)

## Noite: escuro em meia resolução com as luzes da lista "dark" ([x, y, raio, força]) abrindo buracos.
func _night_tex() -> ImageTexture:
	var w := W * 8; var h := H * 8
	var a := PackedFloat32Array(); a.resize(w * h); a.fill(1.0)
	for L in M.dark:
		var lx: float = L[0] / 2.0; var ly: float = L[1] / 2.0; var rr: float = L[2] / 2.0; var f: float = L[3] if L.size() > 3 else 1.0
		for y in range(maxi(0, int(ly - rr)), mini(h, int(ly + rr) + 1)):
			for x in range(maxi(0, int(lx - rr)), mini(w, int(lx + rr) + 1)):
				var d := Vector2(x - lx, y - ly).length() / rr
				if d < 1.0: a[y * w + x] = maxf(0.0, a[y * w + x] - f * (1.0 - d * d))
	var bytes := PackedByteArray(); bytes.resize(w * h * 4)
	for i in w * h:
		bytes[i * 4] = 8; bytes[i * 4 + 1] = 10; bytes[i * 4 + 2] = 26; bytes[i * 4 + 3] = int(a[i] * 255.0)
	var img := Image.create_from_data(w, h, false, Image.FORMAT_RGBA8, bytes)
	return ImageTexture.create_from_image(img)

func _set_dark(a: float) -> void:
	if a > 0.0 and night.texture == null: night.texture = _night_tex()
	dark_a = a; night.modulate.a = a

func _spawn() -> Vector2:
	var C: Array = M.portals.cells
	if C.size() >= 3:
		var k := int(C.size() / 3 / 2) * 3
		var x: int = C[k]; var y: int = C[k + 1]
		var dx := 1 if x == 0 else (-1 if x == W - 1 else 0)
		var dy := 1 if y == 0 else (-1 if y == H - 1 else 0)
		for s in range(3, 12):
			var tx := x + dx * s; var ty := y + dy * s
			if not blocked_tile(tx, ty): return Vector2(tx * T + 8, ty * T + 8)
	for i in W * H:
		if S[i] == 48: return Vector2((i % W) * T + 8, (i / W) * T + 8)
	return Vector2(W * T / 2.0, H * T / 2.0)

# ------------------------------------------------------------------ jogo
func blocked_tile(tx: int, ty: int) -> bool:
	if tx < 0 or ty < 0 or tx >= W or ty >= H: return true
	return S[ty * W + tx] != 48   # "0"

func blocked_at(p: Vector2) -> bool:
	for o in [Vector2(-5, -3), Vector2(5, -3), Vector2(-5, 2), Vector2(5, 2)]:
		var q: Vector2 = p + o
		if blocked_tile(int(floor(q.x / T)), int(floor(q.y / T))): return true
	return false

func _process(dt: float) -> void:
	tt += dt
	if player == null: return
	var v := joy_v
	var k := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	if k != Vector2.ZERO: v = k
	if v.length() > 0.15 and not overview.visible:
		var step := v * SPEED * dt
		var np := player.position + Vector2(step.x, 0)
		if not blocked_at(np): player.position = np
		np = player.position + Vector2(0, step.y)
		if not blocked_at(np): player.position = np
		dir = (3 if v.x > 0 else 2) if absf(v.x) > absf(v.y) else (0 if v.y > 0 else 1)
		walk_t += dt
	else:
		walk_t = 0.0
	player.queue_redraw()
	rpx = player.position.x; rpy = player.position.y
	var vr := get_viewport_rect().size
	VW = vr.x; VH = vr.y
	cam.position = (camera.get_screen_center_position() - vr / 2.0).floor()
	var tx := int(player.position.x / T); var ty := int(player.position.y / T)
	var zi: int = int(Z[clampi(ty, 0, H - 1) * W + clampi(tx, 0, W - 1)])
	if zi != zone_last:
		zone_last = zi
		lbl_zone.text = M.zonas[zi] if zi < M.zonas.size() else ""
		zone_timer = 3.0
	zone_timer = maxf(0.0, zone_timer - dt)
	lbl_zone.modulate.a = clampf(zone_timer, 0.0, 1.0)
	lbl_info.text = "%s   ·   tile %d, %d" % [M.nome, tx, ty]
	if show_col: debug_layer.queue_redraw()

func _draw_player() -> void:
	var b := int(sin(walk_t * 14.0) * 1.5) if walk_t > 0 else 0
	player.draw_rect(Rect2(-6, 0, 12, 3), Color(0, 0, 0, 0.3))
	player.draw_rect(Rect2(-5, -12 + b, 4, 12 - b), Color("#3a2c22"))
	player.draw_rect(Rect2(1, -12 - b, 4, 12 + b), Color("#3a2c22"))
	player.draw_rect(Rect2(-7, -24, 14, 13), Color("#7a2a2a"))
	player.draw_rect(Rect2(-7, -24, 14, 2), Color("#a34040"))
	player.draw_rect(Rect2(-5, -32, 10, 9), Color("#e0b088"))
	player.draw_rect(Rect2(-5, -33, 10, 3), Color("#4a3020"))
	if dir != 1:
		var ex := -3 if dir == 2 else (1 if dir == 3 else -3)
		player.draw_rect(Rect2(ex, -28, 1, 2), Color.BLACK)
		if dir == 0: player.draw_rect(Rect2(2, -28, 1, 2), Color.BLACK)

func _draw_debug() -> void:
	# passagens sempre (azul), colisão (vermelho) quando ligada
	var C: Array = M.portals.cells
	for i in range(0, C.size(), 3):
		debug_layer.draw_rect(Rect2(C[i] * T, C[i + 1] * T, T, T), Color(0.2, 0.6, 1.0, 0.35))
	if not show_col: return
	var x0 := maxi(0, int(cam.position.x / T)); var y0 := maxi(0, int(cam.position.y / T))
	for y in range(y0, mini(H, y0 + int(VH / T) + 2)):
		for x in range(x0, mini(W, x0 + int(VW / T) + 2)):
			if S[y * W + x] != 48: debug_layer.draw_rect(Rect2(x * T, y * T, T, T), Color(1, 0, 0, 0.35))

# ------------------------------------------------------------------ toque / joystick
func _unhandled_input(e: InputEvent) -> void:
	if overview.visible or player == null: return
	if e is InputEventScreenTouch:
		if e.pressed and joy_id < 0:
			joy_id = e.index; joy_c = e.position; joy_v = Vector2.ZERO
		elif not e.pressed and e.index == joy_id:
			joy_id = -1; joy_v = Vector2.ZERO
		hud.queue_redraw()
	elif e is InputEventScreenDrag and e.index == joy_id:
		joy_v = ((e.position - joy_c) / JOY_R).limit_length(1.0)
		hud.queue_redraw()

# ------------------------------------------------------------------ interface
func _build_ui() -> void:
	ui = CanvasLayer.new(); ui.layer = 10; add_child(ui)
	hud = Control.new(); hud.set_anchors_preset(Control.PRESET_FULL_RECT); hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.visible = false; ui.add_child(hud)
	hud.draw.connect(func():
		if joy_id >= 0:
			hud.draw_circle(joy_c, JOY_R, Color(1, 1, 1, 0.12))
			hud.draw_circle(joy_c + joy_v * JOY_R, 22, Color(1, 1, 1, 0.35)))
	lbl_info = _label(Vector2(8, 6), 11); hud.add_child(lbl_info)
	lbl_zone = _label(Vector2(0, 40), 20); lbl_zone.set_anchors_preset(Control.PRESET_CENTER_TOP)
	lbl_zone.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER; lbl_zone.grow_horizontal = Control.GROW_DIRECTION_BOTH
	hud.add_child(lbl_zone)
	btns = HBoxContainer.new(); btns.set_anchors_preset(Control.PRESET_TOP_RIGHT); btns.grow_horizontal = Control.GROW_DIRECTION_BEGIN
	btns.position = Vector2(-8, 4); btns.add_theme_constant_override("separation", 4); hud.add_child(btns)
	_btn("Dia/Noite", func():
		_set_dark(0.0 if dark_a > 0.5 else (0.4 if dark_a < 0.2 else 0.75)))
	_btn("Colisão", func(): show_col = not show_col; debug_layer.queue_redraw())
	_btn("Mapa", func(): _open_overview())
	_btn("Trocar", func(): _show_menu(JSON.parse_string(FileAccess.get_file_as_string("res://mapas/lista.json"))))
	lbl_load = _label(Vector2(0, 0), 16); lbl_load.set_anchors_preset(Control.PRESET_CENTER)
	lbl_load.grow_horizontal = Control.GROW_DIRECTION_BOTH; lbl_load.grow_vertical = Control.GROW_DIRECTION_BOTH
	lbl_load.visible = false; ui.add_child(lbl_load)
	overview = Control.new(); overview.set_anchors_preset(Control.PRESET_FULL_RECT); overview.visible = false; ui.add_child(overview)

func _label(p: Vector2, sz: int) -> Label:
	var l := Label.new(); l.position = p; l.add_theme_font_size_override("font_size", sz)
	l.add_theme_color_override("font_outline_color", Color.BLACK); l.add_theme_constant_override("outline_size", 4)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l

func _btn(t: String, f: Callable) -> void:
	var b := Button.new(); b.text = t; b.add_theme_font_size_override("font_size", 15); b.custom_minimum_size = Vector2(60, 34); b.focus_mode = Control.FOCUS_NONE
	b.pressed.connect(f); btns.add_child(b)

## Mapa inteiro na tela: toque num lugar livre para ir até lá.
func _open_overview() -> void:
	for c in overview.get_children(): c.queue_free()
	var bg := ColorRect.new(); bg.color = Color(0, 0, 0, 0.85); bg.set_anchors_preset(Control.PRESET_FULL_RECT); overview.add_child(bg)
	var vr := get_viewport_rect().size
	var k := minf((vr.x - 20) / (W * T), (vr.y - 50) / (H * T))
	var tr := TextureRect.new(); tr.texture = floor_tex; tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.size = Vector2(W * T, H * T) * k; tr.position = Vector2((vr.x - tr.size.x) / 2, 40); overview.add_child(tr)
	var dot := Control.new(); dot.mouse_filter = Control.MOUSE_FILTER_IGNORE; tr.add_child(dot)
	dot.draw.connect(func():
		var C: Array = M.portals.cells
		for i in range(0, C.size(), 3): dot.draw_rect(Rect2(Vector2(C[i], C[i + 1]) * T * k, Vector2(T, T) * k), Color(0.3, 0.7, 1.0))
		dot.draw_circle(player.position * k, 4, Color.RED))
	var l := _label(Vector2(10, 8), 13); l.text = "Toque num lugar do mapa para ir até lá  ·  toque fora para fechar"; overview.add_child(l)
	bg.gui_input.connect(func(e):
		if e is InputEventMouseButton and e.pressed: overview.visible = false)
	tr.gui_input.connect(func(e):
		if e is InputEventMouseButton and e.pressed:
			var p: Vector2 = e.position / k
			if not blocked_at(p):
				player.position = p; camera.reset_smoothing(); overview.visible = false)
	overview.visible = true

func _show_menu(lista: Array) -> void:
	if menu: menu.queue_free()
	menu = PanelContainer.new(); menu.set_anchors_preset(Control.PRESET_CENTER)
	menu.grow_horizontal = Control.GROW_DIRECTION_BOTH; menu.grow_vertical = Control.GROW_DIRECTION_BOTH
	var vb := VBoxContainer.new(); menu.add_child(vb)
	var t := Label.new(); t.text = "Escolha o mapa"; t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER; vb.add_child(t)
	for m in lista:
		var b := Button.new(); b.text = m.nome; b.custom_minimum_size = Vector2(300, 36)
		b.pressed.connect(load_map.bind(m.id)); vb.add_child(b)
	ui.add_child(menu)

# ------------------------------------------------------------------ conferência do shader (linha de comando)
func _compara(ref_path: String) -> void:
	var ref := Image.load_from_file(ref_path); ref.convert(Image.FORMAT_RGBA8)
	var ov := Image.load_from_file(ProjectSettings.globalize_path(base + "ov.png")); ov.convert(Image.FORMAT_RGBA8)
	var img := floor_tex.get_image()
	img.blend_rect(ov, Rect2i(0, 0, ov.get_width(), ov.get_height()), Vector2i.ZERO)   # floor_ref já tem o ov por cima
	var n := 0; var ok := 0; var se := 0.0
	for y in img.get_height():
		for x in img.get_width():
			var a := img.get_pixel(x, y); var b := ref.get_pixel(x, y)
			var d := maxi(maxi(absi(a.r8 - b.r8), absi(a.g8 - b.g8)), absi(a.b8 - b.b8))
			n += 1
			if d <= 2: ok += 1
			se += (pow(a.r8 - b.r8, 2) + pow(a.g8 - b.g8, 2) + pow(a.b8 - b.b8, 2)) / 3.0
	var mse := se / n
	var psnr := 99.0 if mse == 0 else 10.0 * log(255.0 * 255.0 / mse) / log(10.0)
	print("COMPARA: %.4f%% dos pixels com diferença <= 2 · PSNR %.1f dB" % [100.0 * ok / n, psnr])
