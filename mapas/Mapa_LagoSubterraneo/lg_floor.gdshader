// Chão do Lago Subterrâneo (lg) gerado na placa de vídeo — porte direto do pintor de caverna (o mesmo das duas cavernas do
// Acampamento dos Nômades; só mudam as cores). A grade "data": R = andável, G = distância até o caminho × 10,
// B = tipo × 40 (0 chão de arenito com cascalho, 1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto, 4 água funda).
shader_type canvas_item;
render_mode unshaded, blend_disabled;
#include "res://shaders/gen_common.gdshaderinc"

int TYc(int tx, int ty) {
	int x = clamp(tx, 0, map_size.x - 1), y = clamp(ty, 0, map_size.y - 1);
	return int(floor(texelFetch(data, ivec2(x, y), 0).b * 255.0 / 40.0 + 0.5));
}
int PT(float X, float Y) {
	return TYc(int(floor((X + (vn(X, Y, 7.0, 50) - 0.5) * 10.0 + (vn(X, Y, 3.0, 60) - 0.5) * 5.0) / 16.0)),
	           int(floor((Y + (vn(X, Y, 7.0, 51) - 0.5) * 10.0 + (vn(X, Y, 3.0, 61) - 0.5) * 5.0) / 16.0)));
}
vec4 vorC(float x, float y, float s, int sd, out vec2 cc) {
	int gx = int(floor(x / s)), gy = int(floor(y / s));
	float d1 = 1e9, d2 = 1e9; int id = 0; cc = vec2(0.0);
	for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
		int cx2 = gx + i, cy2 = gy + j;
		float px = (float(cx2) + 0.15 + 0.7 * hq(cx2 + sd, cy2 * 7)) * s, py = (float(cy2) + 0.15 + 0.7 * hq(cx2 * 5, cy2 + sd)) * s;
		float d = length(vec2(x - px, y - py));
		if (d < d1) { d2 = d1; d1 = d; id = cx2 * 7919 + cy2; cc = vec2(px, py); } else if (d < d2) d2 = d;
	}
	return vec4(float(id), (d2 - d1) / 2.0, d1, 0.0);
}

void fragment() {
	int x = int(origin.x) + int(floor(UV.x * chunk));
	int y = int(origin.y) + int(floor(UV.y * chunk));
	float X = float(x), Y = float(y);
	int tp = PT(X, Y);
	float grain = 0.94 + 0.1 * hq(x, y) * hq(x + 1, y >> 1);
	vec3 c;
	if (tp == 4) {
		// água funda: escura no meio, rasa e clara perto da margem, com ondinhas e reflexos
		int sh = 0;
		for (int k = 1; k <= 8; k++) { if (PT(X - float(k), Y) != 4 || PT(X + float(k), Y) != 4 || PT(X, Y - float(k)) != 4 || PT(X, Y + float(k)) != 4) { sh = k; break; } }
		float n = vn(X, Y, 40.0, 141), w = sin(X * 0.18 + Y * 0.5 + vn(X, Y, 30.0, 142) * 6.0 + n * 3.0);
		c = vec3(14.0 + 10.0 * n, 34.0 + 14.0 * n, 50.0 + 18.0 * n);
		if (sh > 0) { float t = 1.0 - float(sh) / 9.0; c += vec3(50.0 * t, 70.0 * t, 76.0 * t); if (sh < 2) c = vec3(120.0, 150.0, 150.0); }
		if (w > 0.92) c += vec3(40.0, 60.0, 66.0);
		if (hq(x, y * 5) < 0.002) c = vec3(170.0, 216.0, 228.0);
	} else if (tp == 3) {
		// rocha: a face da parede (camadas) até 14 px acima do chão, e o teto escuro acima dela
		int dn = 0;
		for (int k = 1; k <= 14; k++) { if (PT(X, Y + float(k)) != 3) { dn = k; break; } }
		if (dn > 0) {
			int lay = int(floor((Y + vn(X, Y, 30.0, 76) * 8.0) / 5.0)) % 4;
			vec3 cr;
			if (lay == 0) cr = vec3(140.0, 62.0, 40.0); else if (lay == 1) cr = vec3(162.0, 78.0, 48.0); else if (lay == 2) cr = vec3(118.0, 50.0, 34.0); else cr = vec3(178.0, 96.0, 60.0);
			float k = 0.62 + 0.38 * float(dn) / 14.0;
			if (dn < 3) k *= 0.62;
			if (hq(x >> 1, y) < 0.05) k *= 0.8;
			c = cr * k * grain;
		} else {
			float n = vn(X, Y, 40.0, 77) * 0.7 + vn(X, Y, 9.0, 78) * 0.3;
			c = vec3(30.0 + 22.0 * n, 22.0 + 16.0 * n, 20.0 + 12.0 * n) * grain;
		}
	} else if (tp == 1) {
		// areia acumulada com ondulações
		float n = vn(X, Y, 30.0, 79), rip = sin((X * 0.35 + Y * 0.9 + vn(X, Y, 40.0, 74) * 14.0) * 0.55), k = (0.92 + 0.08 * rip) * grain;
		c = vec3((170.0 + 26.0 * n) * k, (134.0 + 22.0 * n) * k, (88.0 + 16.0 * n) * k);
	} else if (tp == 2) {
		// lajes do templo com rejunte e areia por cima
		int row = int(floor(Y / 16.0)), off = (row & 1) * 12, u = (x + off) % 24, v = y % 16;
		float id = hq(int(floor(float(x + off) / 24.0)), row);
		c = vec3(0.0, 0.0, 0.0);
		float k = grain * (0.94 + 0.1 * hq(int(id * 99.0), 3));
		if (u == 0 || v == 0) { c = vec3(92.0, 74.0, 56.0); k = grain; } else if (u == 1 || v == 1) k *= 1.1; else if (u == 23 || v == 15) k *= 0.86;
		c *= k;
		float s = vn(X, Y, 26.0, 75);
		if (s > 0.62) { float t = clamp((s - 0.62) * 6.0, 0.0, 1.0); c += (vec3(176.0, 140.0, 92.0) - c) * t; }
	} else {
		// chão de arenito escuro com cascalho
		float n = vn(X, Y, 10.0, 70) * 0.6 + vn(X, Y, 34.0, 71) * 0.4;
		c = vec3((96.0 + 40.0 * n) * grain, (62.0 + 30.0 * n) * grain, (46.0 + 22.0 * n) * grain);
		vec2 cc; vec4 v = vorC(X, Y, 7.0, 72, cc);
		if (hq(int(v.x), 3) < 0.25 && v.z < 2.2) { float L = clamp(0.6 - ((X - cc.x) + (Y - cc.y)) * 0.3, 0.0, 1.0); c = vec3((110.0 + 60.0 * L) * grain, (88.0 + 48.0 * L) * grain, (66.0 + 36.0 * L) * grain); }
		float s = vn(X, Y, 22.0, 73);
		if (s > 0.6) { float t = clamp((s - 0.6) * 5.0, 0.0, 1.0); c += (vec3(170.0, 134.0, 88.0) - c) * t; }
	}
	if (tp != 3) {
		int dd = 99;
		for (int k = 1; k <= 10; k++) { if (PT(X, Y - float(k)) == 3) { dd = k; break; } }
		if (dd < 10) { float kk = 0.55 + 0.45 * float(dd) / 10.0; c *= kk; }
	}
	COLOR = vec4(floor(clamp(c, 0.0, 255.0)) / 255.0, 1.0);
}
