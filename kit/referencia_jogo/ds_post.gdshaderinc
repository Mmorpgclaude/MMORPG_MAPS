// v10.23: passo final do chão do Deserto (Mar de Areia, Travessia, Porto): a cor "5b" aprovada pelo Ricardo.
// O relevo continua o do pintor antigo; aqui a luz dele vira 6 degraus da paleta (como no atlas da folha), com as
// ondulações finas e as manchinhas por cima da areia andável. Cópia exata em JS: ds5b() nos geradores do Deserto.
// modo 0 = não muda (mar), 1 = só a paleta (pedra, areia molhada, dunas), 2 = paleta + ondulações e manchinhas.
const vec3 P5B[7] = vec3[7](vec3(150.0, 104.0, 62.0), vec3(198.0, 146.0, 90.0), vec3(218.0, 168.0, 108.0), vec3(232.0, 186.0, 122.0),
	vec3(240.0, 198.0, 132.0), vec3(246.0, 210.0, 144.0), vec3(250.0, 226.0, 170.0));
const float L5B[6] = float[6](107.2, 144.5, 155.6, 166.7, 179.6, 196.1);
vec3 ds5b(vec3 c, int x, int y, int modo) {
	vec3 i = floor(clamp(c, 0.0, 255.0));
	if (modo == 0 || i.g > i.r + 6.0 || i.b > i.r) return i;     // mar e o mosaico turquesa ficam como estão
	float L = i.r * 0.3 + i.g * 0.55 + i.b * 0.15, v;
	if (L <= L5B[0]) v = 0.0;
	else if (L >= L5B[5]) v = 5.0;
	else { int k = 0; while (L > L5B[k + 1]) k++; v = float(k) + (L - L5B[k]) / (L5B[k + 1] - L5B[k]); }
	int q = int(floor(v + 0.5));
	if (modo == 2) {
		float X = float(x), Y = float(y), warp = vn(X, Y, 80.0, 71) * 16.0 + vn(X, Y, 26.0, 72) * 5.0;
		float ph = (X * 0.38 + Y * 0.92 + warp) / 22.0, f = ph - floor(ph), amp = vn(X, Y, 64.0, 73);
		if (amp > 0.4) { if (f < 0.08) q = min(q + 1, 6); else if (f < 0.2) q = max(q - 1, 0); }
		float s = hq(x * 3 + 11, y * 5 + 7);
		if (s < 0.004) return vec3(172.0, 124.0, 80.0);
		if (s > 0.996) return vec3(252.0, 236.0, 190.0);
	}
	return P5B[q];
}
