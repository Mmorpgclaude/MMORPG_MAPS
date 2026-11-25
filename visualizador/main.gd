extends Node2D
# Teste: chão quadriculado, personagem e joystick virtual.
const TILE := 32
const W := 60
const H := 40
var player: Node2D
var cam: Camera2D
var joy_center := Vector2.ZERO
var joy_vec := Vector2.ZERO
var joy_id := -1
var ui: Control

func _ready() -> void:
	queue_redraw()
	player = Node2D.new()
	player.position = Vector2(W, H) * TILE / 2
	player.draw.connect(func(): player.draw_circle(Vector2.ZERO, 12, Color(0.9, 0.3, 0.2)))
	add_child(player)
	cam = Camera2D.new()
	cam.zoom = Vector2(2, 2)
	player.add_child(cam)
	var layer := CanvasLayer.new()
	add_child(layer)
	ui = Control.new()
	ui.set_anchors_preset(Control.PRESET_FULL_RECT)
	ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.draw.connect(_draw_ui)
	layer.add_child(ui)
	var lbl := Label.new()
	lbl.text = "Visualizador de Mapas — teste"
	lbl.position = Vector2(12, 8)
	layer.add_child(lbl)

func _draw() -> void:
	for y in H:
		for x in W:
			var c := Color(0.25, 0.55, 0.3) if (x + y) % 2 == 0 else Color(0.22, 0.5, 0.27)
			draw_rect(Rect2(x * TILE, y * TILE, TILE, TILE), c)
	draw_rect(Rect2(0, 0, W * TILE, H * TILE), Color.BLACK, false, 4)

func _draw_ui() -> void:
	if joy_id >= 0:
		ui.draw_circle(joy_center, 70, Color(1, 1, 1, 0.15))
		ui.draw_circle(joy_center + joy_vec * 70, 30, Color(1, 1, 1, 0.4))

func _input(e: InputEvent) -> void:
	if e is InputEventScreenTouch:
		if e.pressed and joy_id < 0:
			joy_id = e.index; joy_center = e.position; joy_vec = Vector2.ZERO
		elif not e.pressed and e.index == joy_id:
			joy_id = -1; joy_vec = Vector2.ZERO
		ui.queue_redraw()
	elif e is InputEventScreenDrag and e.index == joy_id:
		joy_vec = ((e.position - joy_center) / 70.0).limit_length(1.0)
		ui.queue_redraw()

func _process(dt: float) -> void:
	var v := joy_vec
	var k := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	if k != Vector2.ZERO: v = k
	player.position += v * 180 * dt
	player.position = player.position.clamp(Vector2.ZERO, Vector2(W, H) * TILE)
