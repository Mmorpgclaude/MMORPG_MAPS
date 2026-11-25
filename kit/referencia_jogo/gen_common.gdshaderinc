// Funções comuns dos chãos gerados na placa de vídeo (portes dos pintores em JS de tools/): mesmo sorteio (hq, inteiro,
// idêntico ao do JS), mesmo ruído (vn) e mesmas células (vor). A grade "data" tem 1 texel por tile.
uniform sampler2D data : filter_nearest;
uniform ivec2 map_size = ivec2(100, 100);
uniform vec2 origin = vec2(0.0);     // canto do pedaço, em pixels do jogo
uniform float chunk = 256.0;         // lado do pedaço, em pixels do jogo

float hq(int a, int b) {
	uint h = uint(a) * 374761393u + uint(b) * 668265263u;
	h = (h ^ (h >> 13u)) * 1274126177u;
	return float(h ^ (h >> 16u)) / 4294967296.0;
}
// vn(x,y,s,sd) do JS: a=hq(x0+sd*131,y0) ...
float vn(float x, float y, float s, int sd) {
	float X = x / s, Y = y / s, fx0 = floor(X), fy0 = floor(Y);
	int x0 = int(fx0), y0 = int(fy0);
	float fx = X - fx0, fy = Y - fy0, u = fx * fx * (3.0 - 2.0 * fx), v = fy * fy * (3.0 - 2.0 * fy);
	float a = hq(x0 + sd * 131, y0), b = hq(x0 + 1 + sd * 131, y0), c = hq(x0 + sd * 131, y0 + 1), d = hq(x0 + 1 + sd * 131, y0 + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
// vor(x,y,s,sd) do JS: devolve (id, (d2-d1)/2, d1, 0)
vec4 vor(float x, float y, float s, int sd) {
	int gx = int(floor(x / s)), gy = int(floor(y / s));
	float d1 = 1e9, d2 = 1e9; int id = 0;
	for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
		int cx2 = gx + i, cy2 = gy + j;
		float px = (float(cx2) + 0.15 + 0.7 * hq(cx2 + sd, cy2 * 7)) * s, py = (float(cy2) + 0.15 + 0.7 * hq(cx2 * 5, cy2 + sd)) * s;
		float d = length(vec2(x - px, y - py));
		if (d < d1) { d2 = d1; d1 = d; id = cx2 * 7919 + cy2; } else if (d < d2) d2 = d;
	}
	return vec4(float(id), (d2 - d1) / 2.0, d1, 0.0);
}
vec4 tileAt(int tx, int ty) {
	if (tx < 0 || ty < 0 || tx >= map_size.x || ty >= map_size.y) return vec4(0.0);
	return texelFetch(data, ivec2(tx, ty), 0);
}
// at(x0,y0) bilinear do JS (fora do mapa = 0), canal R
float bilF(float x, float y) {
	float X = (x - 8.0) / 16.0, Y = (y - 8.0) / 16.0, fx0 = floor(X), fy0 = floor(Y);
	int x0 = int(fx0), y0 = int(fy0); float u = X - fx0, v = Y - fy0;
	float a = tileAt(x0, y0).r, b = tileAt(x0 + 1, y0).r, c = tileAt(x0, y0 + 1).r, d = tileAt(x0 + 1, y0 + 1).r;
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
// bil(A,x,y) do JS (índices presos dentro do mapa), canal G × 25.5 (distância em tiles, gravada × 10)
float bilG(float x, float y) {
	float X = (x - 8.0) / 16.0, Y = (y - 8.0) / 16.0;
	int x0 = clamp(int(floor(X)), 0, map_size.x - 2), y0 = clamp(int(floor(Y)), 0, map_size.y - 2);
	float u = clamp(X - float(x0), 0.0, 1.0), v = clamp(Y - float(y0), 0.0, 1.0);
	float a = tileAt(x0, y0).g, b = tileAt(x0 + 1, y0).g, c = tileAt(x0, y0 + 1).g, d = tileAt(x0 + 1, y0 + 1).g;
	return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 25.5;
}
