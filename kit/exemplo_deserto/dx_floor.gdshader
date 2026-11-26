// Chão do exemplo do Deserto (kit): é o MESMO shader da Travessia das Dunas (dn_floor.gdshader do jogo), porte do pintor do deserto_exemplo.js.
// Para um mapa novo do Deserto: copie com o nome <id>_floor.gdshader e não mude nada (a não ser que mude o pintor).
// A grade "data": R = chão (F), G = distância até a estrada × 10 (RDD), B = material do sólido (M: 1 rocha, 2 duna, 3 muro) + zona × 16.
shader_type canvas_item;
render_mode unshaded, blend_disabled;
#include "res://shaders/gen_common.gdshaderinc"
#include "res://shaders/ds_post.gdshaderinc"

const vec2 CITY = vec2(60.0, 34.0);
int Mt(int tx, int ty) { return int(floor(tileAt(tx, ty).b * 255.0 + 0.5)) & 15; }
int Zt(int tx, int ty) { return int(floor(tileAt(tx, ty).b * 255.0 + 0.5)) >> 4; }
bool Ft(int tx, int ty) { return tileAt(tx, ty).r > 0.5; }
float hgt(float x, float y) { return vn(x, y, 170.0, 7) * 0.65 + vn(x, y, 55.0, 8) * 0.35; }
// 0 = chão; 1..3 = material do sólido
int matAt(int x, int y) {
	if (x < 0 || y < 0 || x >= map_size.x * 16 || y >= map_size.y * 16) return 2;
	int tx = min(map_size.x - 1, x >> 4), ty = min(map_size.y - 1, y >> 4);
	if (!Ft(tx, ty) && Mt(tx, ty) == 3) return 3;
	float X = float(x), Y = float(y);
	if (bilF(X, Y) + (vn(X, Y, 10.0, 36) - 0.5) * 0.5 < 0.5) {
		float XX = (X - 8.0) / 16.0, YY = (Y - 8.0) / 16.0;
		int rx = clamp(int(floor(XX + (vn(X, Y, 14.0, 40) - 0.5) * 1.8 + 0.5)), 0, map_size.x - 1), ry = clamp(int(floor(YY + (vn(X, Y, 14.0, 41) - 0.5) * 1.8 + 0.5)), 0, map_size.y - 1);
		int m = Mt(rx, ry); if (m == 0) m = Mt(tx, ty); if (m == 0) m = 2; if (m == 3) m = 2; return m;
	}
	return 0;
}
bool sol(int x, int y) { return matAt(x, y) > 0; }
const vec3 RK1 = vec3(106.0, 42.0, 26.0); const vec3 RK2 = vec3(138.0, 58.0, 34.0); const vec3 RK3 = vec3(168.0, 80.0, 46.0); const vec3 RK4 = vec3(192.0, 106.0, 62.0);
const vec3 SS1 = vec3(122.0, 86.0, 50.0); const vec3 SS2 = vec3(154.0, 114.0, 68.0); const vec3 SS3 = vec3(184.0, 142.0, 88.0); const vec3 SS4 = vec3(212.0, 172.0, 116.0); const vec3 SS5 = vec3(234.0, 208.0, 160.0);
vec3 RKl(int lay) { int i = lay == 0 ? 2 : (lay == 1 ? 3 : (lay == 2 ? 1 : (lay == 3 ? 4 : (lay == 4 ? 2 : 3)))); return i == 1 ? RK1 : (i == 2 ? RK2 : (i == 3 ? RK3 : RK4)); }

void fragment() {
	int x = int(origin.x) + int(floor(UV.x * chunk));
	int y = int(origin.y) + int(floor(UV.y * chunk));
	float X = float(x), Y = float(y);
	int tx = x >> 4, ty = y >> 4;
	vec3 c; int md = 1;
	float grain = 0.93 + 0.14 * hq(x, y) * hq(x + 1, y >> 1);
	int m = matAt(x, y);
	if (m > 0) {
		int fd = 255;
		for (int k = 1; k <= 40; k++) { if (y + k >= map_size.y * 16) break; if (!sol(x, y + k)) { fd = k; break; } }
		if (m == 1) {
			int fh = int(26.0 + vn(X, 3.0, 13.0, 30) * 16.0);
			if (fd > 0 && fd <= fh) {
				float v = float(fd) / float(fh); int lay = int((Y + vn(X, Y, 30.0, 31) * 8.0) / 5.0) % 6; vec3 cc = RKl(lay);
				float k = 0.62 + 0.5 * v + 0.1 * hq(x, y);
				if (fh - fd < 2) k *= 1.3; if (fd < 3) k *= 0.55; if (hq(x >> 1, y) < 0.04) k *= 0.75; if (((x + (y >> 2)) % 11) == 0 && hq(x >> 3, y >> 2) < 0.5) k *= 0.82;
				c = cc * k;
			} else {
				float hh = vn(X, Y, 90.0, 42); int ter = int(floor(hh * 5.0)); float fr2 = hh * 5.0 - float(ter), n = vn(X, Y, 26.0, 32) * 0.6 + vn(X, Y, 7.0, 33) * 0.4;
				vec3 cc = ter == 0 ? RK2 : (ter <= 2 ? RK3 : RK4); float k = grain * (0.88 + 0.12 * n);
				if (fr2 < 0.08) k *= 0.72; else if (fr2 > 0.92) k *= 1.12;
				vec4 vr = vor(X, Y, 56.0, 43); if (hq(int(vr.x), 9) < 0.3) { if (vr.y < 0.9) k *= 0.7; else if (vr.y < 1.8) k *= 0.9; }
				float sd2 = vn(X, Y, 34.0, 44) * 0.8 + vn(X, Y, 9.0, 46) * 0.2;
				if (sd2 > 0.74) { float t = min(1.0, (sd2 - 0.74) * 8.0), tt2 = vn(X, Y, 8.0, 45); cc = cc + (vec3(200.0 + 20.0 * tt2, 150.0 + 20.0 * tt2, 100.0 + 14.0 * tt2) - cc) * t; }
				if (hq(int(vr.x), 5) < 0.12 && vr.y > 4.0 && hq(x >> 2, y >> 2) < 0.03) cc = vec3(90.0, 110.0, 50.0);
				int e = 0;
				for (int k2 = 1; k2 <= 4; k2++) { if (!sol(x - k2, y) || !sol(x + k2, y) || !sol(x, y - k2)) { e = k2; break; } }
				if (e > 0) k *= 1.0 + 0.5 / float(e);
				c = cc * k; if (hq(x, y * 3) < 0.006) c = vec3(150.0, 110.0, 80.0);
			}
		} else if (m == 3) {
			if (fd > 0 && fd <= 36) {
				int row = y / 6, bx = (x + (row & 1) * 8) % 16; vec3 cc = (bx == 0 || y % 6 == 0) ? SS1 : (hq(x >> 2, y >> 1) < 0.5 ? SS3 : SS2);
				float k = 0.75 + 0.35 * (float(fd) / 36.0); if (fd < 3) k *= 0.6; c = cc * k;
			} else {
				int u = x % 16, v = y % 12; vec3 cc = hq(x >> 4, y / 12) < 0.5 ? SS4 : SS3; float k = grain;
				if (u == 0 || v == 0) cc = SS1; else if (u == 1 || v == 1) k *= 1.12;
				if ((x % 48) < 2 || (x % 48) > 45) cc = SS2; if (x % 80 < 6) { cc = SS5; if (x % 80 == 5) cc = SS1; }
				c = cc * k;
			}
		} else {
			int fh = int(16.0 + vn(X, 5.0, 17.0, 37) * 10.0);
			if (fd > 0 && fd <= fh) {
				float v = float(fd) / float(fh), rip = sin((X * 0.45 + Y * 1.1 + vn(X, Y, 30.0, 38) * 10.0) * 0.6);
				float k = (0.72 + 0.36 * v) * (0.97 + 0.03 * rip) * grain; c = vec3(214.0, 176.0, 118.0) * k; if (fd < 3) c *= vec3(0.75, 0.75, 0.78);
			} else {
				float h = hgt(X, Y), gx = hgt(X + 5.0, Y) - hgt(X - 5.0, Y), gy = hgt(X, Y + 5.0) - hgt(X, Y - 5.0), sh = -(gx + gy) * 9.0;
				float rip = sin((X * 0.35 + Y * 0.9 + vn(X, Y, 40.0, 2) * 14.0) * 0.55), k = (1.02 + sh * 0.25) * (0.96 + 0.04 * rip) * grain;
				c = vec3(226.0, 190.0, 132.0) * k;
				int e = 0;
				for (int k2 = 1; k2 <= 3; k2++) { if (!sol(x - k2, y) || !sol(x + k2, y) || !sol(x, y - k2)) { e = k2; break; } }
				if (e > 0) { float EE = float(e); c *= vec3(1.0 + 0.12 / EE, 1.0 + 0.12 / EE, 1.0 + 0.1 / EE); }
			}
		}
	} else {
		int z = Zt(tx, ty); md = 2;
		float h = hgt(X, Y), gx = hgt(X + 5.0, Y) - hgt(X - 5.0, Y), gy = hgt(X, Y + 5.0) - hgt(X, Y - 5.0), sh = -(gx + gy) * 9.0;
		float rip = sin((X * 0.35 + Y * 0.9 + vn(X, Y, 40.0, 2) * 14.0) * 0.55);
		float t = vn(X, Y, 60.0, 4) * 0.6 + h * 0.4, k = grain * (0.95 + 0.05 * rip) * (1.0 + sh * 0.18);
		c = vec3(192.0 + 34.0 * t, 156.0 + 36.0 * t, 100.0 + 34.0 * t) * k;
		if (hq(x, y * 3) < 0.008) c += vec3(30.0, 26.0, 20.0);
		float rd = bilG(X, Y) + (vn(X, Y, 10.0, 12) - 0.5) * 0.9;
		bool plaza = false;
		if ((rd < 2.1 || plaza) && vn(X, Y, 26.0, 9) < (plaza ? 0.78 : 0.6)) { md = 1;
			int sw = plaza ? 28 : 16, shh = plaza ? 22 : 16, row = y / shh, off = (row & 1) * (sw >> 1), u = (x + off) % sw, v = y % shh;
			float id = hq((x + off) / sw, row); int pick = int(id * 3.0);
			vec3 cc = pick == 0 ? vec3(200.0, 166.0, 114.0) : (pick == 1 ? vec3(214.0, 180.0, 126.0) : vec3(188.0, 154.0, 102.0));
			float kk = grain * (0.95 + 0.1 * hq(int(id * 99.0), 3));
			if (u == 0 || v == 0) cc = vec3(136.0, 104.0, 68.0); else if (u == 1 || v == 1) kk *= 1.1; else if (u == sw - 1 || v == shh - 1) kk *= 0.85;
			if (plaza && length(vec2(X / 16.0 - CITY.x, (Y / 16.0 - CITY.y) * 1.3)) < 3.2 && u > 4 && v > 4 && u < sw - 4 && v < shh - 4) cc = hq((x + off) / sw, row * 3) < 0.5 ? vec3(42.0, 150.0, 140.0) : vec3(200.0, 150.0, 60.0);
			c = cc * kk;
		}
		int dd = 99;
		for (int k2 = 1; k2 <= 14; k2++) { if (sol(x, y - k2)) { dd = min(dd, k2 - 3); break; } }
		for (int k2 = 1; k2 <= 6; k2++) { if (sol(x - k2, y) || sol(x + k2, y) || sol(x, y + k2)) { dd = min(dd, k2 + 2); break; } }
		if (dd < 14) c *= 0.6 + 0.4 * float(max(0, dd)) / 14.0;
	}
	COLOR = vec4(ds5b(c, x, y, md) / 255.0, 1.0);   // v10.23: cor 5b
}
