// Chão do Bosque dos Corvos Brancos (lc) gerado na placa de vídeo — porte direto do pintor de bosque_corvos.js.
// A grade "data": R = andável, G = distância até a trilha × 10, B = tipo × 40 (0 neve, 1 chão do bosque,
// 2 trilha de terra congelada, 3 gelo escuro, 4 rocha, 5 neve pisada). As penas no chão ficam no ov.
shader_type canvas_item;
render_mode unshaded, blend_disabled;
#include "res://shaders/gen_common.gdshaderinc"

int TYc(int tx, int ty) {
	int x = clamp(tx, 0, map_size.x - 1), y = clamp(ty, 0, map_size.y - 1);
	return int(floor(texelFetch(data, ivec2(x, y), 0).b * 255.0 / 40.0 + 0.5));
}
int PT(float X, float Y) {
	return TYc(int(floor((X + (vn(X, Y, 7.0, 50) - 0.5) * 10.0 + (vn(X, Y, 26.0, 58) - 0.5) * 20.0 + (vn(X, Y, 3.0, 60) - 0.5) * 6.0) / 16.0)),
	           int(floor((Y + (vn(X, Y, 7.0, 51) - 0.5) * 10.0 + (vn(X, Y, 26.0, 59) - 0.5) * 20.0 + (vn(X, Y, 3.0, 61) - 0.5) * 6.0) / 16.0)));
}
float hS(float a, float b) { return vn(a, b, 14.0, 43) * 0.55 + vn(a, b, 42.0, 44) * 0.45; }
// vorC do JS: (id, (d2-d1)/2, d1) e o centro da célula mais perto
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
	float grain = 0.95 + 0.08 * hq(x, y) * hq(x + 1, y >> 1);
	float rd = bilG(X, Y) + (vn(X, Y, 10.0, 12) - 0.5) * 0.9;
	vec3 c;
	if (tp == 0 || tp == 5) {
		// neve cinza-azulada em tufos; 5 = pisada, com pegadas e terra
		vec2 cc; vec4 v = vorC(X, Y, 12.0, 45, cc);
		float ddx = (X - cc.x) / 12.0, ddy = (Y - cc.y) / 12.0, gx = hS(X + 3.0, Y) - hS(X - 3.0, Y), gy = hS(X, Y + 3.0) - hS(X, Y - 3.0);
		float L = clamp(0.62 - (ddx + ddy) * 0.5 + (1.0 - v.z / 12.0) * 0.12 - (gx + gy) * 3.0, 0.0, 1.0);
		c = vec3(146.0 + 68.0 * L, 160.0 + 58.0 * L, 198.0 + 40.0 * L);
		if (v.y < 1.1 && ddx + ddy > -0.1) c *= vec3(0.88, 0.9, 0.95);
		if (tp == 5) {
			float h = hq((x >> 3) * 3 + 1, (y >> 3) * 5 + 2);
			if (h < 0.35) { float px = float(x & 7) - 3.5 + (h * 8.0 - 1.4), py = float(y & 7) - 3.5; if (px * px / 4.0 + py * py / 9.0 < 1.0) c *= vec3(0.84, 0.86, 0.9); }
			if (hq(x * 5, y) < 0.006) c = vec3(96.0, 86.0, 88.0);
		}
		c *= grain;
		if (rd < 1.9) { float m = min(1.0, (1.9 - rd) / 1.9 * 1.6); c *= vec3(1.0 - m * 0.2, 1.0 - m * 0.2, 1.0 - m * 0.16); }
		if (hq(x, y * 3) < 0.004) c = vec3(236.0, 240.0, 252.0);
	} else if (tp == 1) {
		// chão do bosque: terra escura com folhas mortas, gravetos e manchas de neve
		float n = vn(X, Y, 9.0, 70) * 0.6 + vn(X, Y, 30.0, 71) * 0.4;
		c = vec3(48.0 + 40.0 * n, 42.0 + 38.0 * n, 47.0 + 36.0 * n);
		if (hq(x >> 2, (y >> 2) + 7) < 0.2) {
			float lx = float(x & 3) - 1.5, ly = float(y & 3) - 1.5;
			if (lx * lx + ly * ly < 2.6) {
				float k = hq(x >> 2, (y >> 2) + 9);
				if (k < 0.4) c = vec3(118.0, 66.0, 46.0); else if (k < 0.75) c = vec3(96.0, 58.0, 44.0); else c = vec3(140.0, 96.0, 58.0);
			}
		}
		float tw = hq(x >> 3, (y >> 3) + 11);
		if (tw < 0.1) { bool dg = tw < 0.05 ? ((x & 7) == (y & 7)) : ((x & 7) == 7 - (y & 7)); if (dg) c = vec3(104.0, 90.0, 80.0); }
		float s = vn(X, Y, 20.0, 72) + (hq(x, y) - 0.5) * 0.08;
		if (s > 0.62) { float k = clamp((s - 0.62) * 8.0, 0.0, 1.0); c = c + (vec3(196.0, 202.0, 222.0) - c) * k; }
		c *= grain;
	} else if (tp == 2) {
		// trilha de terra congelada com pedrinhas e neve nas beiras
		float n = vn(X, Y, 8.0, 73) * 0.6 + vn(X, Y, 26.0, 74) * 0.4;
		c = vec3(60.0 + 34.0 * n, 53.0 + 31.0 * n, 56.0 + 28.0 * n);
		vec2 cc; vec4 v = vorC(X, Y, 6.0, 75, cc);
		if (hq(int(v.x), 3) < 0.3 && v.z < 2.4) { float L = clamp(0.6 - ((X - cc.x) + (Y - cc.y)) * 0.25, 0.0, 1.0); c = vec3(96.0 + 50.0 * L, 92.0 + 48.0 * L, 98.0 + 52.0 * L); }
		if (rd > 0.9) { float s = vn(X, Y, 7.0, 76); if (s > 0.55 + (1.6 - rd) * 0.3) c = vec3(192.0, 198.0, 220.0); }
		c *= grain;
	} else if (tp == 3) {
		// gelo escuro da lagoa: placas com rachaduras claras e brilhos
		vec4 vr = vor(X, Y, 22.0, 77); float t = vn(X, Y, 36.0, 78);
		c = vec3(46.0 + 40.0 * t, 62.0 + 42.0 * t, 92.0 + 48.0 * t);
		if (vr.y < 0.7) c = vec3(176.0, 192.0, 224.0); else if (vr.y < 1.5) c += vec3(10.0, 12.0, 14.0);
		if (sin(X * 0.4 + Y * 0.25 + vn(X, Y, 30.0, 79) * 5.0) > 0.97) c += vec3(36.0, 38.0, 40.0);
		c *= grain;
	} else {
		// rocha cinza com neve no alto e musgo seco
		vec2 cc; vec4 v = vorC(X, Y, 18.0, 53, cc);
		float ddx = (X - cc.x) / 18.0, ddy = (Y - cc.y) / 18.0, m = 0.88 + 0.24 * hq(int(v.x), 5), L = clamp(0.55 - (ddx + ddy) * 0.6, 0.0, 1.0);
		c = vec3((36.0 + 92.0 * L) * m, (37.0 + 90.0 * L) * m, (42.0 + 96.0 * L) * m);
		if (v.y < 1.2) c = vec3(18.0, 18.0, 24.0);
		else if (ddy < -0.16 + (vn(X, Y, 6.0, 54) - 0.5) * 0.24) { float k2 = 0.86 + 0.14 * L; c = vec3(214.0, 220.0, 238.0) * k2; }
		else if (vn(X, Y, 7.0, 80) > 0.64) c = vec3(c.r * 0.6 + 38.0, c.g * 0.6 + 48.0, c.b * 0.6 + 22.0);
		c *= grain;
	}
	if (tp != 4) {
		int dd = 99;
		for (int k = 1; k <= 8; k++) { if (PT(X, Y - float(k)) == 4) { dd = k; break; } }
		if (dd < 8) { float kk = 0.7 + 0.3 * float(dd) / 8.0; c *= vec3(kk, kk, kk * 1.03); }
	}
	COLOR = vec4(floor(clamp(c, 0.0, 255.0)) / 255.0, 1.0);
}
