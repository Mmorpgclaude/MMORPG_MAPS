"""Gera os dois geradores das cavernas do Acampamento dos Nômades a partir de um molde comum (mesmo pintor, mesmo shader):
   mapas/Mapa_TemploSoterrado/templo_soterrado.js (função buriedTemple, id 'ts') e
   mapas/Mapa_GrutaArcoVermelho/gruta_arco.js (função redArchCave, id 'ga').
   O ajudante da arte (ds_helper.js do kit) entra no texto de cada gerador, como nos mapas do Deserto."""
import os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HELPER = open(os.path.join(RAIZ, 'kit/ferramentas/ds_helper.js'), encoding='utf-8').read()

MOLDE = r'''/* ---------- %(NOME)s (mapa '%(ID)s') — caverna (lugar de dentro) do Acampamento dos Nômades (nd) ----------
%(DESC)s
   Entrada e saída: a porta %(PORTA)s no Acampamento leva para cá (chega em (60, %(CH)s)); a saída é a borda sul (colunas 56-63),
   que volta para a frente da porta. Lugar de dentro: tamanho livre (%(W)s × %(H)s).
   Chão: pintor por pixel de caverna (o mesmo nas duas cavernas do Acampamento), espelhado em %(ID)s_floor.gdshader.
   gen_data: R = andável, G = distância até o caminho principal × 10, B = tipo do chão × 40
   (0 chão de arenito com cascalho, 1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto). 1 tile = 16 px.
   Objetos: peças prontas do kit (exemplo_deserto/arte), colocadas pelo ajudante do Deserto. Sem animais nem ossadas. */
function %(FN)s(){
 const T=16,W=%(W)s,H=%(H)s,FW=W*T,FH=H*T;
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vorC=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0,ccx=0,ccy=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2;ccx=px;ccy=py}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1,ccx,ccy]};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const S=new Array(W*H).fill(0),Z=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={dust:[],sand:[],fire:[],lamp:[],glint:[]};
 const put=(cv,x,ybase,lb)=>{const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e)};
 const zn=%(ZN)s;
 /* ===== grade: rocha em tudo, os salões e os túneis são escavados ===== */
 const TY=new Uint8Array(W*H).fill(3),SL=new Uint8Array(W*H);
 const HALLS=%(HALLS)s;   /* [x, y, rx, ry, zona, lajes] */
 const TUN=%(TUN)s;       /* túneis entre os salões: [x0, y0, x1, y1, largura] */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=x*16,Y=y*16;
  for(const [hx,hy,rx,ry,zz,sl] of HALLS){const e=Math.hypot((x-hx)/rx,(y-hy)/ry)+(vn(X,Y,46,%(SD)s)-.5)*.42;if(e<1){TY[y*W+x]=0;Z[y*W+x]=zz;if(sl&&e<.86)SL[y*W+x]=1}}}
 for(const [ax,ay,bx,by,w] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n,r=w+(vn(x*16,y*16,60,%(SD)s+1)-.5)*1.4;
  for(let j=Math.floor(y-r);j<=Math.ceil(y+r);j++)for(let i=Math.floor(x-r);i<=Math.ceil(x+r);i++)if(i>2&&j>2&&i<W-3&&j<H-1&&Math.hypot(i-x,j-y)<=r&&TY[j*W+i]==3)TY[j*W+i]=0}}
 /* saída sul: colunas 56-63 abertas até a borda */
 for(let y=H-8;y<H;y++)for(let x=55;x<=64;x++){if(y==H-1&&(x<56||x>63))continue;TY[y*W+x]=0}
 for(let x=0;x<W;x++){if(x<56||x>63)TY[(H-1)*W+x]=3}
 /* areia que entrou pelas frestas, e as lajes do templo */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(TY[i]==3)continue;if(vn(x*16,y*16,70,%(SD)s+2)>.6)TY[i]=1;if(SL[i])TY[i]=2}
 /* tira bolsões sem ligação com a saída */
 {const seen=new Uint8Array(W*H),q=[(H-2)*W+60];seen[q[0]]=1;while(q.length){const i=q.pop(),x=i%%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(!seen[n]&&TY[n]!=3){seen[n]=1;q.push(n)}}}
  for(let i=0;i<W*H;i++)if(TY[i]!=3&&!seen[i])TY[i]=3}
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=TY[i]!=3?1:0;
 for(let i=0;i<W*H;i++){S[i]=F[i]?0:1;if(!F[i])Z[i]=0}
 /* caminho principal (a distância RDD afasta os enfeites do meio dos túneis) */
 const RDD=new Float32Array(W*H).fill(99);
 for(const [ax,ay,bx,by] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n;
  for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;const d=Math.hypot(tx+.5-x,ty+.5-y);if(d<RDD[ty*W+tx])RDD[ty*W+tx]=d}}}

 /* ===== pintura por pixel (espelhada em %(ID)s_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10+(vn(X,Y,3,60)-.5)*5)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10+(vn(X,Y,3,61)-.5)*5)/16));
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.94+.1*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  if(tp==3){/* rocha: a face da parede (camadas de arenito) até 14 px acima do chão, e o teto escuro acima dela */
   let dn=0;for(let k=1;k<=14;k++){if(PT(X,Y+k)!=3){dn=k;break}}
   if(dn>0){const lay=Math.floor((Y+vn(X,Y,30,76)*8)/5)%%4;let cr,cg,cb;
    if(lay==0){cr=%(R0)s}else if(lay==1){cr=%(R1)s}else if(lay==2){cr=%(R2)s}else{cr=%(R3)s}
    let k=.62+.38*dn/14;if(dn<3)k*=.62;if(hq(x>>1,y)<.05)k*=.8;r=cr[0]*k*grain;g=cr[1]*k*grain;b=cr[2]*k*grain}
   else{const n=vn(X,Y,40,77)*.7+vn(X,Y,9,78)*.3;r=(30+22*n)*grain;g=(22+16*n)*grain;b=(20+12*n)*grain}}
  else if(tp==1){/* areia acumulada com ondulações */
   const n=vn(X,Y,30,79),rip=Math.sin((X*.35+Y*.9+vn(X,Y,40,74)*14)*.55),k=(.92+.08*rip)*grain;r=(170+26*n)*k;g=(134+22*n)*k;b=(88+16*n)*k}
  else if(tp==2){/* lajes do templo com rejunte e areia por cima */
   const row=Math.floor(Y/16),off=(row&1)*12,u=(x+off)%%24,v=y%%16,id=hq(Math.floor((x+off)/24),row);
   r=%(SLR)s;g=%(SLG)s;b=%(SLB)s;let k=grain*(.94+.1*hq((id*99)|0,3));
   if(u==0||v==0){r=92;g=74;b=56;k=grain}else if(u==1||v==1)k*=1.1;else if(u==23||v==15)k*=.86;
   r*=k;g*=k;b*=k;const s=vn(X,Y,26,75);if(s>.62){const t=clamp((s-.62)*6,0,1);r+=(176-r)*t;g+=(140-g)*t;b+=(92-b)*t}}
  else{/* chão de arenito escuro com cascalho */
   const n=vn(X,Y,10,70)*.6+vn(X,Y,34,71)*.4;r=(%(FR)s+40*n)*grain;g=(%(FG)s+30*n)*grain;b=(%(FB)s+22*n)*grain;
   const v=vorC(X,Y,7,72);if(hq(v[0],3)<.25&&v[2]<2.2){const L=clamp(.6-((X-v[3])+(Y-v[4]))*.3,0,1);r=(110+60*L)*grain;g=(88+48*L)*grain;b=(66+36*L)*grain}
   const s=vn(X,Y,22,73);if(s>.6){const t=clamp((s-.6)*5,0,1);r+=(170-r)*t;g+=(134-g)*t;b+=(88-b)*t}}
  if(tp!=3){let dd=99;for(let k=1;k<=10;k++){if(PT(X,Y-k)==3){dd=k;break}}if(dd<10){const kk=.55+.45*dd/10;r*=kk;g*=kk;b*=kk}}
  return [clamp(r,0,255)|0,clamp(g,0,255)|0,clamp(b,0,255)|0]};
 const [fc]=cmCv(FW,FH),fcx=fc.getContext('2d'),im=fcx.createImageData(FW,FH),Dd=im.data;
 for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){const c=paint(x,y),o=(y*FW+x)*4;Dd[o]=c[0];Dd[o+1]=c[1];Dd[o+2]=c[2];Dd[o+3]=255}
 fcx.putImageData(im,0,0);
 const [oc]=cmCv(FW,FH);
 /* ===== objetos: peças prontas do kit, pelo ajudante do Deserto ===== */
 const WA=W,WALKA=i=>F[i]===1,ROADA=i=>RDD[i];
%(HELPER)s
 aRes(54,H-10,65,H-1);   /* a saída fica livre */
 const last=()=>ents[ents.length-1];
 const torch=(tx,ty,o={})=>{if(aNear('lamppost',tx,ty,Object.assign({m:0,bw:0,road:1},o))){const e=last(),x=e.x+(o.flip?18:e.sw-18),y=e.z+30;fx.lamp.push([x,y]);dark.push([x,y,120,1])}};
 const fire=(tx,ty)=>{if(aNear('firepit',tx,ty,{road:1})){const e=last(),x=e.x+(e.sw>>1),y=e.y-10;fx.fire.push([x,y]);dark.push([x,y,140,1])}};
 const HALL=k=>HALLS[k];
 const inHall=(k,f=1)=>(x,y)=>{const h=HALLS[k];return Math.hypot((x-h[0])/h[2],(y-h[1])/h[3])<f};
 const rim=k=>(x,y)=>{const h=HALLS[k],e=Math.hypot((x-h[0])/h[2],(y-h[1])/h[3]);return e>.62&&e<1.1};
%(OBJ)s
 /* poeira no ar e areia escorrendo do teto */
 for(let k=0;k<90;k++){const x=4+hq(k,61)*(W-8)|0,y=4+hq(k,62)*(H-8)|0;if(F[y*W+x])fx.dust.push([x*T+8,y*T+8,hq(k,63)*6.28])}
 for(let k=0;k<200&&fx.sand.length<16;k++){const x=4+hq(k,64)*(W-8)|0,y=4+hq(k,65)*(H-8)|0;if(F[y*W+x]&&!F[(y-1)*W+x])fx.sand.push([x*T+8,y*T-4,hq(k,66)*6.28])}
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 fcx.drawImage(oc,0,0);
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
  zones:{names:zn,z:Z},
  /* saída: a borda sul (colunas 56-63) volta para o Acampamento dos Nômades, na frente da porta (px) */
  portals:{trig:[{k:'edge',m:'nd',x:%(VX)s,y:%(VY)s}],cells:[56,57,58,59,60,61,62,63].flatMap(x=>[x,H-1,0])}}}
'''

TEMPLO = dict(
 ID='ts', W=120, H=90, CH=85, FN='buriedTemple', NOME='Templo Soterrado', PORTA='do portal antigo (ruin_gate), no monte de areia da Planície Escaldante,',
 DESC='''   Um templo antigo engolido pelas dunas: salões de lajes, a galeria das colunas, o salão do ídolo com a cabeça da estátua e
   os obeliscos, uma câmara de jarros e dois salões desmoronados, cheios de areia, largos para caçar.''',
 ZN="['Templo Soterrado','Salão da Entrada','Galeria das Colunas','Salão do Ídolo','Câmara Selada','Salão Desmoronado Oeste','Salão Desmoronado Leste']",
 HALLS="[[60,80,11,6,1,1],[60,58,17,9,2,1],[60,26,22,13,3,1],[22,44,15,13,5,0],[98,44,15,13,6,0],[60,8,8,3,4,1]]",
 TUN="[[60,86,60,58,4],[60,58,60,26,4],[60,58,22,44,3.6],[60,58,98,44,3.6],[60,26,60,8,3]]",
 SD=90, R0='[150,104,70]', R1='[170,124,84]', R2='[128,88,60]', R3='[184,140,96]',
 SLR='[184,160,120][(id*3)|0]'.replace('[(id*3)|0]',''), SLG='', SLB='',
 FR=92, FG=70, FB=50, VX='122*16+8', VY='89*16',
 OBJ=''' /* Salao da Entrada: acampamento encostado na parede esquerda */
 fire(52,79);aNear('goods',50,76,{});aNear('jar',53,75,{bw:0});torch(68,77,{flip:true});
 /* Galeria: colunas encostadas nas paredes, meio largo e livre */
 for(const x of[46,74])for(const y of[53,63])aNear('column',x,y,{bw:0,fit:0,road:0,res:0});
 torch(44,58);torch(76,58,{flip:true});
 /* Salao do Idolo: estatua no fundo, obeliscos so na parede de tras */
 aNear('statue_head',60,16,{fit:2,br:2,road:0});aNear('obelisk',44,20,{bw:1,road:0});aNear('obelisk',76,20,{bw:1,road:0});
 torch(48,24);torch(72,24,{flip:true});
 /* saloes de caca laterais: vazios no meio */
 aNear('column_broken',12,36,{bw:0,road:0});torch(22,33);aNear('column_broken',108,36,{bw:0,road:0});torch(98,33,{flip:true});
 torch(14,52);torch(106,52,{flip:true});''')
TEMPLO['SLR'] = 'id<.33?178:id<.66?166:190'
TEMPLO['SLG'] = 'id<.33?150:id<.66?138:162'
TEMPLO['SLB'] = 'id<.33?112:id<.66?100:122'

GRUTA = dict(
 ID='ga', W=160, H=120, CH=115, FN='redArchCave', NOME='Gruta do Arco Vermelho', PORTA='do arco de pedra (rock_arch), no Vale das Areias Vermelhas,',
 DESC='''   Uma caverna de rocha vermelha atrás do arco de pedra: a galeria vermelha da entrada e quatro salões largos para caçar
   (o Salão das Pedras, o Salão do Eco, a Fenda Funda e o Covil Arenoso), ligados por túneis.''',
 ZN="['Gruta do Arco Vermelho','Entrada da Gruta','Galeria','Salão Oeste','Salão Leste','Câmara do Fundo']",
 HALLS="[[60,110,10,6,1,0],[64,88,16,8,2,0],[32,52,26,20,3,0],[114,54,32,24,4,0],[72,16,10,7,5,0]]",
 TUN="[[60,116,60,110,4],[60,110,64,88,4],[64,88,32,52,4.5],[64,88,114,54,4.5],[32,52,72,16,3.6],[114,54,72,16,3.6]]",
 SD=110, R0='[140,62,40]', R1='[162,78,48]', R2='[118,50,34]', R3='[178,96,60]',
 SLR='0', SLG='0', SLB='0',
 FR=96, FG=62, FB=46, VX='112*16+16', VY='14*16',
 OBJ=''' /* Entrada: acampamento encostado na parede */
 fire(55,109);aNear('goods',53,106,{});torch(67,107,{flip:true});
 /* rochedos só colados na parede, meio livre */
 for(const [k,sd,n] of[[1,515,1],[2,520,5],[3,530,6],[4,540,1]])aScat(['rock_m','rock_tall'],n,sd,(x,y)=>{const h=HALLS[k],e=Math.hypot((x-h[0])/h[2],(y-h[1])/h[3]);return e>.85&&e<1.05},{fit:1,br:2,road:0});
 torch(52,85);torch(76,85,{flip:true});
 torch(14,40);torch(32,34);torch(50,40,{flip:true});torch(12,62);torch(52,64,{flip:true});
 torch(88,38);torch(114,32);torch(140,38,{flip:true});torch(86,66);torch(142,68,{flip:true});
 torch(66,12);torch(78,12,{flip:true});''')

for d, pasta, arq in [(TEMPLO, 'Mapa_TemploSoterrado', 'templo_soterrado.js'), (GRUTA, 'Mapa_GrutaArcoVermelho', 'gruta_arco.js')]:
    d = dict(d); d['HELPER'] = HELPER
    os.makedirs(os.path.join(RAIZ, 'mapas', pasta), exist_ok=True)
    open(os.path.join(RAIZ, 'mapas', pasta, arq), 'w', encoding='utf-8').write(MOLDE % d)
    print('gerado', pasta, arq)

# ---------------------------------------------------------------- o shader (porte linha a linha do pintor acima)
SHADER = r'''// Chão de %(NOME)s (%(ID)s) gerado na placa de vídeo — porte direto do pintor de caverna (o mesmo das duas cavernas do
// Acampamento dos Nômades; só mudam as cores). A grade "data": R = andável, G = distância até o caminho × 10,
// B = tipo × 40 (0 chão de arenito com cascalho, 1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto).
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
	if (tp == 3) {
		// rocha: a face da parede (camadas) até 14 px acima do chão, e o teto escuro acima dela
		int dn = 0;
		for (int k = 1; k <= 14; k++) { if (PT(X, Y + float(k)) != 3) { dn = k; break; } }
		if (dn > 0) {
			int lay = int(floor((Y + vn(X, Y, 30.0, 76) * 8.0) / 5.0)) %% 4;
			vec3 cr;
			if (lay == 0) cr = vec3%(R0)s; else if (lay == 1) cr = vec3%(R1)s; else if (lay == 2) cr = vec3%(R2)s; else cr = vec3%(R3)s;
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
		int row = int(floor(Y / 16.0)), off = (row & 1) * 12, u = (x + off) %% 24, v = y %% 16;
		float id = hq(int(floor(float(x + off) / 24.0)), row);
		c = vec3(%(SLR)s, %(SLG)s, %(SLB)s);
		float k = grain * (0.94 + 0.1 * hq(int(id * 99.0), 3));
		if (u == 0 || v == 0) { c = vec3(92.0, 74.0, 56.0); k = grain; } else if (u == 1 || v == 1) k *= 1.1; else if (u == 23 || v == 15) k *= 0.86;
		c *= k;
		float s = vn(X, Y, 26.0, 75);
		if (s > 0.62) { float t = clamp((s - 0.62) * 6.0, 0.0, 1.0); c += (vec3(176.0, 140.0, 92.0) - c) * t; }
	} else {
		// chão de arenito escuro com cascalho
		float n = vn(X, Y, 10.0, 70) * 0.6 + vn(X, Y, 34.0, 71) * 0.4;
		c = vec3((%(FR)s.0 + 40.0 * n) * grain, (%(FG)s.0 + 30.0 * n) * grain, (%(FB)s.0 + 22.0 * n) * grain);
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
'''
def gl(s):  # '[a,b,c]' -> '(a.0, b.0, c.0)'
    return '(' + ', '.join(v.strip() + '.0' for v in s.strip('[]').split(',')) + ')'
def glx(e):  # expressão ternária do JS com id -> GLSL
    p = e.replace('id<.33?', 'id < 0.33 ? ').replace(':id<.66?', ' : id < 0.66 ? ').replace(':', ' : ')
    import re
    return re.sub(r'(?<![\w.])(\d+)(?![\w.])', r'\1.0', p)
for d, pasta in [(TEMPLO, 'Mapa_TemploSoterrado'), (GRUTA, 'Mapa_GrutaArcoVermelho')]:
    e = dict(d)
    for k in ('R0', 'R1', 'R2', 'R3'): e[k] = gl(d[k])
    for k in ('SLR', 'SLG', 'SLB'): e[k] = glx(d[k])
    open(os.path.join(RAIZ, 'mapas', pasta, '%s_floor.gdshader' % d['ID']), 'w', encoding='utf-8').write(SHADER % e)
    print('shader', pasta)
