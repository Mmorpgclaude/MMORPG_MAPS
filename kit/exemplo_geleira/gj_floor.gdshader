// Chão da Geleira do Gigante Adormecido (gj) gerado na placa de vídeo — porte direto do pintor de tools/glacier_giant.js.
// A grade "data": R = andável, G = distância até a trilha × 10, B = tipo × 40 (0 neve, 1 gelo da geleira, 2 rio congelado,
// 3 fenda, 4 rocha, 5 topo da geleira). As pontes ficam em ov_*.png.
shader_type canvas_item;
render_mode unshaded, blend_disabled;
#include "res://shaders/gen_common.gdshaderinc"

int TYc(int tx, int ty) {
	int x = clamp(tx, 0, map_size.x - 1), y = clamp(ty, 0, map_size.y - 1);
	return int(floor(texelFetch(data, ivec2(x, y), 0).b * 255.0 / 40.0 + 0.5));
}
int PT(float X, float Y) { return TYc(int(floor((X + (vn(X, Y, 7.0, 50) - 0.5) * 10.0) / 16.0)), int(floor((Y + (vn(X, Y, 7.0, 51) - 0.5) * 10.0) / 16.0))); }
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
	vec3 c;
	if (tp == 0) {
		vec2 cc; vec4 v = vorC(X, Y, 13.0, 45, cc);
		float ddx = (X - cc.x) / 13.0, ddy = (Y - cc.y) / 13.0, gx = hS(X + 3.0, Y) - hS(X - 3.0, Y), gy = hS(X, Y + 3.0) - hS(X, Y - 3.0);
		float L = clamp(0.66 - (ddx + ddy) * 0.5 + (1.0 - v.z / 13.0) * 0.12 - (gx + gy) * 3.0, 0.0, 1.0);
		c = vec3(168.0 + 76.0 * L, 188.0 + 60.0 * L, 222.0 + 33.0 * L);
		if (v.y < 1.1 && ddx + ddy > -0.1) c *= vec3(0.88, 0.91, 0.97);
		c *= grain;
		float rd = bilG(X, Y) + (vn(X, Y, 10.0, 12) - 0.5) * 0.9;
		if (rd < 1.9) {
			float m = min(1.0, (1.9 - rd) / 1.9 * 1.6); c *= vec3(1.0 - m * 0.14, 1.0 - m * 0.12, 1.0 - m * 0.07);
			if (m > 0.35) { int fp = ((x >> 2) + (y >> 3)) & 3; if (fp == 0 && (y & 7) < 3 && (x & 3) == 1 && hq(x >> 2, y >> 3) < 0.35) c *= vec3(0.86, 0.88, 0.93); }
		}
		if (hq(x, y * 3) < 0.005) c = vec3(255.0);
	} else if (tp == 1) {
		vec4 vr = vor(X, Y, 52.0, 46); float t = vn(X, Y, 70.0, 47) * 0.7 + vn(X, Y, 18.0, 60) * 0.3, k = clamp(1.0 - vr.z / 52.0, 0.0, 1.0);
		c = vec3(128.0 + 34.0 * t + 10.0 * k, 182.0 + 26.0 * t + 8.0 * k, 230.0 + 16.0 * t + 5.0 * k);
		if (vr.y < 0.7) c = vec3(228.0, 244.0, 255.0); else if (vr.y < 1.6) c += vec3(12.0, 10.0, 6.0); else if (vr.y < 2.6) c -= vec3(8.0, 6.0, 2.0);
		if (sin(X * 0.5 - Y * 0.3 + vn(X, Y, 40.0, 17) * 6.0) > 0.95) c += vec3(20.0, 16.0, 10.0);
		c *= grain; if (hq(x, y * 7) < 0.004) c = vec3(255.0);
	} else if (tp == 2) {
		vec4 vr = vor(X, Y, 26.0, 48); float t = vn(X, Y, 40.0, 49);
		c = vec3(40.0 + 20.0 * t, 82.0 + 24.0 * t, 138.0 + 22.0 * t); if (vr.y < 0.8) c = vec3(150.0, 196.0, 236.0);
		if (sin(X * 0.4 + Y * 0.2 + vn(X, Y, 30.0, 55) * 5.0) > 0.97) c += vec3(40.0, 40.0, 30.0);
		c *= grain;
	} else if (tp == 3) {
		int up = 0;
		for (int k = 1; k <= 24; k++) { if (PT(X, Y - float(k)) != 3) { up = k; break; } }
		if (up > 0 && up <= 14) {
			float v = float(up) / 14.0; c = vec3(140.0 - 100.0 * v, 196.0 - 126.0 * v, 236.0 - 116.0 * v);
			if (((x + int(floor(vn(X, 0.0, 5.0, 52) * 6.0))) % 6) < 1) c *= vec3(0.85, 0.85, 0.9);
			if (up < 5 && hq(x >> 1, 3) < 0.5) c = vec3(220.0, 240.0, 255.0);
		} else { float n = vn(X, Y, 30.0, 56); c = vec3(14.0 + n * 12.0, 26.0 + n * 16.0, 54.0 + n * 22.0); }
		int dn = 0;
		for (int k = 1; k <= 3; k++) { if (PT(X, Y + float(k)) != 3) { dn = k; break; } }
		if (dn > 0) c = vec3(226.0, 238.0, 252.0);
	} else if (tp == 4) {
		vec2 cc; vec4 v = vorC(X, Y, 20.0, 53, cc);
		float ddx = (X - cc.x) / 20.0, ddy = (Y - cc.y) / 20.0, m = 0.88 + 0.24 * hq(int(v.x), 5), L = clamp(0.55 - (ddx + ddy) * 0.6, 0.0, 1.0);
		c = vec3((52.0 + 88.0 * L) * m, (56.0 + 90.0 * L) * m, (68.0 + 94.0 * L) * m);
		if (v.y < 1.2) c = vec3(30.0, 32.0, 40.0); else if (ddy < -0.16 + (vn(X, Y, 6.0, 54) - 0.5) * 0.24) { float k2 = 0.86 + 0.14 * L; c = vec3(232.0, 240.0, 252.0) * k2; }
		c *= grain;
	} else {
		float gx = hS(X + 3.0, Y) - hS(X - 3.0, Y), gy = hS(X, Y + 3.0) - hS(X, Y - 3.0), L = clamp(0.7 - (gx + gy) * 7.0, 0.0, 1.0);
		c = vec3(186.0 + 64.0 * L, 204.0 + 46.0 * L, 232.0 + 23.0 * L);
		vec4 vr = vor(X, Y, 64.0, 57); if (vr.y < 0.8 && vn(X, Y, 40.0, 58) > 0.45) c = vec3(150.0, 196.0, 236.0);
		c *= grain;
	}
	if (tp <= 2) {
		int dd = 99;
		for (int k = 1; k <= 10; k++) { int t2 = PT(X, Y - float(k)); if (t2 == 4 || t2 == 5) { dd = k; break; } }
		if (dd < 10) { float kk = 0.72 + 0.28 * float(dd) / 10.0; c *= vec3(kk, kk, kk * 1.02); }
	}
	COLOR = vec4(floor(clamp(c, 0.0, 255.0)) / 255.0, 1.0);
}
