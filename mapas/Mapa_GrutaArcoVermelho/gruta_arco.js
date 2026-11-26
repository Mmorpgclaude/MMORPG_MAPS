/* ---------- Gruta do Arco Vermelho (mapa 'ga') — caverna (lugar de dentro) do Acampamento dos Nômades (nd) ----------
   Uma caverna de arenito atrás da entrada de areia: a entrada, a galeria e CINCO salões largos para caçar (Oeste, das
   Pedras, Central, Leste e Sudeste), ligados entre si por túneis largos, e a Câmara do Fundo.
   Entrada e saída: a porta do arco de pedra (rock_arch), no Vale das Areias Vermelhas, no Acampamento leva para cá (chega em (60, 115)); a saída é a borda sul (colunas 56-63),
   que volta para a frente da porta. Lugar de dentro: tamanho livre (160 × 120).
   Chão: pintor por pixel de caverna (o mesmo nas duas cavernas do Acampamento), espelhado em ga_floor.gdshader.
   gen_data: R = andável, G = distância até o caminho principal × 10, B = tipo do chão × 40
   (0 chão de arenito com cascalho, 1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto). 1 tile = 16 px.
   Objetos: peças prontas do kit (exemplo_deserto/arte), colocadas pelo ajudante do Deserto. Sem animais nem ossadas. */
function redArchCave(){
 const T=16,W=160,H=120,FW=W*T,FH=H*T;
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vorC=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0,ccx=0,ccy=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2;ccx=px;ccy=py}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1,ccx,ccy]};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const S=new Array(W*H).fill(0),Z=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={dust:[],sand:[],fire:[],lamp:[],glint:[]};
 const DOORS=[];   /* portas para outros lugares de dentro (escadas) */
 const put=(cv,x,ybase,lb)=>{const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e)};
 const zn=['Gruta do Arco Vermelho','Entrada da Gruta','Galeria','Salão Oeste','Salão das Pedras','Salão Central','Salão Leste','Salão Sudeste','Câmara do Fundo'];
 /* ===== grade: rocha em tudo, os salões e os túneis são escavados ===== */
 const TY=new Uint8Array(W*H).fill(3),SL=new Uint8Array(W*H);
 const HALLS=[[60,110,10,6,1,0],[64,88,14,7,2,0],[24,80,18,14,3,0],[28,40,20,15,4,0],[78,46,18,13,5,0],[130,44,22,16,6,0],[124,92,22,14,7,0],[78,12,10,6,8,0]];   /* [x, y, rx, ry, zona, lajes] */
 const TUN=[[60,116,60,110,4],[60,110,64,88,4],[64,88,24,80,4],[24,80,28,40,4],[28,40,78,46,4],[64,88,78,46,4],[78,46,130,44,4],[130,44,124,92,4],[64,88,124,92,4],[78,46,78,12,3.4]];       /* túneis entre os salões: [x0, y0, x1, y1, largura] */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=x*16,Y=y*16;
  for(const [hx,hy,rx,ry,zz,sl] of HALLS){const e=Math.hypot((x-hx)/rx,(y-hy)/ry)+(vn(X,Y,46,110)-.5)*.42;if(e<1){TY[y*W+x]=0;Z[y*W+x]=zz;if(sl&&e<.86)SL[y*W+x]=1}}}
 for(const [ax,ay,bx,by,w] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n,r=w+(vn(x*16,y*16,60,110+1)-.5)*1.4;
  for(let j=Math.floor(y-r);j<=Math.ceil(y+r);j++)for(let i=Math.floor(x-r);i<=Math.ceil(x+r);i++)if(i>2&&j>2&&i<W-3&&j<H-1&&Math.hypot(i-x,j-y)<=r&&TY[j*W+i]==3)TY[j*W+i]=0}}
 /* saída sul: colunas 56-63 abertas até a borda */
 for(let y=H-8;y<H;y++)for(let x=55;x<=64;x++){if(y==H-1&&(x<56||x>63))continue;TY[y*W+x]=0}
 for(let x=0;x<W;x++){if(x<56||x>63)TY[(H-1)*W+x]=3}
 /* areia que entrou pelas frestas, e as lajes do templo */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(TY[i]==3)continue;if(vn(x*16,y*16,70,110+2)>.6)TY[i]=1;if(SL[i])TY[i]=2}
 /* tira bolsões sem ligação com a saída */
 {const seen=new Uint8Array(W*H),q=[(H-2)*W+60];seen[q[0]]=1;while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(!seen[n]&&TY[n]!=3){seen[n]=1;q.push(n)}}}
  for(let i=0;i<W*H;i++)if(TY[i]!=3&&!seen[i])TY[i]=3}
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=TY[i]!=3?1:0;
 for(let i=0;i<W*H;i++){S[i]=F[i]?0:1;if(!F[i])Z[i]=0}
 /* caminho principal (a distância RDD afasta os enfeites do meio dos túneis) */
 const RDD=new Float32Array(W*H).fill(99);
 for(const [ax,ay,bx,by] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n;
  for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;const d=Math.hypot(tx+.5-x,ty+.5-y);if(d<RDD[ty*W+tx])RDD[ty*W+tx]=d}}}

 /* ===== pintura por pixel (espelhada em ga_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10+(vn(X,Y,3,60)-.5)*5)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10+(vn(X,Y,3,61)-.5)*5)/16));
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.94+.1*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  if(tp==3){/* rocha: a face da parede (camadas de arenito) até 14 px acima do chão, e o teto escuro acima dela */
   let dn=0;for(let k=1;k<=14;k++){if(PT(X,Y+k)!=3){dn=k;break}}
   if(dn>0){const lay=Math.floor((Y+vn(X,Y,30,76)*8)/5)%4;let cr,cg,cb;
    if(lay==0){cr=[140,62,40]}else if(lay==1){cr=[162,78,48]}else if(lay==2){cr=[118,50,34]}else{cr=[178,96,60]}
    let k=.62+.38*dn/14;if(dn<3)k*=.62;if(hq(x>>1,y)<.05)k*=.8;r=cr[0]*k*grain;g=cr[1]*k*grain;b=cr[2]*k*grain}
   else{const n=vn(X,Y,40,77)*.7+vn(X,Y,9,78)*.3;r=(30+22*n)*grain;g=(22+16*n)*grain;b=(20+12*n)*grain}}
  else if(tp==1){/* areia acumulada com ondulações */
   const n=vn(X,Y,30,79),rip=Math.sin((X*.35+Y*.9+vn(X,Y,40,74)*14)*.55),k=(.92+.08*rip)*grain;r=(170+26*n)*k;g=(134+22*n)*k;b=(88+16*n)*k}
  else if(tp==2){/* lajes do templo com rejunte e areia por cima */
   const row=Math.floor(Y/16),off=(row&1)*12,u=(x+off)%24,v=y%16,id=hq(Math.floor((x+off)/24),row);
   r=0;g=0;b=0;let k=grain*(.94+.1*hq((id*99)|0,3));
   if(u==0||v==0){r=92;g=74;b=56;k=grain}else if(u==1||v==1)k*=1.1;else if(u==23||v==15)k*=.86;
   r*=k;g*=k;b*=k;const s=vn(X,Y,26,75);if(s>.62){const t=clamp((s-.62)*6,0,1);r+=(176-r)*t;g+=(140-g)*t;b+=(92-b)*t}}
  else{/* chão de arenito escuro com cascalho */
   const n=vn(X,Y,10,70)*.6+vn(X,Y,34,71)*.4;r=(96+40*n)*grain;g=(62+30*n)*grain;b=(46+22*n)*grain;
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
 /* ===== v10.22: ajudante da arte do Deserto (tools/art_ds, folhas do Ricardo). O mesmo texto vai nos três geradores do
    Deserto (tools/ds_src/apply_ds.py). Precisa de: WALKA(i) = tile andável no chão, ROADA(i) = distância até a estrada.
    Peça pela base (centro do tile tx, linha ty), colisão só no pé (bw = meia largura em tiles, br = linhas), e uma reserva em
    volta para nada encostar. Sorteio sempre por hq. ===== */
 const AUSE=new Uint8Array(W*H);
 const mkA=(n,flip)=>{const im=ART[n],c=mk(im.width,im.height),q=c.getContext('2d');if(flip){q.translate(im.width,0);q.scale(-1,1)}q.drawImage(im,0,0);return c};
 const AOK=(tx,ty)=>tx>=2&&ty>=2&&tx<WA-2&&ty<H-2&&WALKA(ty*W+tx)&&!S[ty*W+tx]&&!AUSE[ty*W+tx];
 const aFit=(tx,ty,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(!AOK(tx+i,ty+j))return false;return true};
 /* v10.22b: o desenho todo da peça (com 1 tile de folga) tem que ficar sobre chão livre: nada em cima do paredão das dunas */
 const aBox=(n,tx,ty,m=1)=>{const w=ART[n].width,h=ART[n].height,x0=Math.floor((tx*T+8-w/2)/T)-m,x1=Math.floor((tx*T+8+w/2)/T)+m,y0=Math.floor(((ty+1)*T-h)/T)-m;
  for(let y=y0;y<=ty+1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=WA||y>=H||!WALKA(y*W+x))return false}return true};
 const aRes=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)AUSE[y*W+x]=1};
 const aPut=(n,tx,ty,o={})=>{const c=mkA(n,o.flip),x=tx*T+8-(c.width>>1),yb=(ty+1)*T+(o.dy||0);put(c,x,yb,o.lb);
  const bw=o.bw!=null?o.bw:Math.max(0,Math.round(c.width*.5/32)),br=o.br||1;
  /* o.cols: colunas (relativas ao centro) que bloqueiam, para peças com vão (o arco de pedra); espelha junto com a peça */
  const cols=o.cols?o.cols.map(c=>o.flip?-c:c):null;
  if(!o.walk)for(let j=0;j<br;j++)for(let i=-bw;i<=bw;i++){if(cols&&cols.indexOf(i)<0)continue;const xx=tx+i,yy=ty-j;if(xx>=0&&yy>=0&&xx<W&&yy<H)S[yy*W+xx]=1}
  const rr=o.res!=null?o.res:1;aRes(tx-bw-rr,ty-br-rr+1,tx+bw+rr,ty+rr);return c};
 /* perto de (tx,ty): o tile livre mais perto (espiral) onde cabe a peça */
 const aNear=(n,tx,ty,o={})=>{const r=o.fit!=null?o.fit:(o.bw!=null?o.bw:1);for(let d=0;d<=12;d++)for(let j=-d;j<=d;j++)for(let i=-d;i<=d;i++){if(Math.max(Math.abs(i),Math.abs(j))!=d)continue;
   const x=Math.round(tx)+i,y=Math.round(ty)+j;if(aFit(x,y,r)&&aBox(n,x,y,o.m!=null?o.m:1)&&ROADA(y*W+x)>=(o.road!=null?o.road:2.2)){return aPut(n,x,y,o)}}return null};
 /* espalha n peças (nomes sorteados) onde test(tx,ty) vale, longe da estrada */
 const aScat=(names,n,sd,test,o={})=>{let k=0;const r=o.fit!=null?o.fit:1;for(let t=0;t<n*80&&k<n;t++){const tx=3+hq(t,sd)*(WA-6)|0,ty=3+hq(sd,t)*(H-6)|0;
   if(!test(tx,ty)||!aFit(tx,ty,r)||ROADA(ty*W+tx)<(o.road!=null?o.road:3))continue;const nm=names[(hq(tx*7+sd,ty)*names.length)|0];if(!aBox(nm,tx,ty))continue;
   aPut(nm,tx,ty,Object.assign({},o,{flip:hq(ty,tx+sd)<.5}));k++}return k};
 const ROCKS_S=['rock_s','rock_red','rock_red2','pebbles1','pebbles2'],DRY=['dry_bush','tumble']   /* v10.22b: capim alto, arbusto verde e agave saíram (não combinavam com a areia) */,
  ARCH={bw:6,br:2,cols:[-6,-5,-4,-3,-2,-1,2,3,4,5,6]},   /* v10.22b: o arco de pedra deixa passar pelo vão (colunas 0 e 1) */
  BONEZ=['skull_horns','skull_horns2','bones_small','skull_small','vertebrae'],CACTI=['cactus_s','cactus_m','cactus_big','cactus_barrel','cactus_flower'];

 aRes(54,H-10,65,H-1);   /* a saída fica livre */
 const last=()=>ents[ents.length-1];
 const torch=(tx,ty,o={})=>{if(aNear('lamppost',tx,ty,Object.assign({m:0,bw:0,road:1},o))){const e=last(),x=e.x+(o.flip?18:e.sw-18),y=e.z+30;fx.lamp.push([x,y]);dark.push([x,y,120,1])}};
 const fire=(tx,ty)=>{if(aNear('firepit',tx,ty,{road:1})){const e=last(),x=e.x+(e.sw>>1),y=e.y-10;fx.fire.push([x,y]);dark.push([x,y,140,1])}};
 const HALL=k=>HALLS[k];
 const inHall=(k,f=1)=>(x,y)=>{const h=HALLS[k];return Math.hypot((x-h[0])/h[2],(y-h[1])/h[3])<f};
 const rim=k=>(x,y)=>{const h=HALLS[k],e=Math.hypot((x-h[0])/h[2],(y-h[1])/h[3]);return e>.62&&e<1.1};
 aRes(66,2,90,20);   /* a Câmara do Fundo fica livre (o buraco e uma tocha só) */
 /* Entrada: acampamento encostado na parede */
 fire(55,109);aNear('goods',53,106,{});torch(67,107,{flip:true});
 /* 5 salões de caça (3 a 7): meio vazio; rochedos só colados na parede e duas tochas no alto de cada um */
 for(let k=3;k<=7;k++){const h=HALLS[k];
  aScat(['rock_m','rock_tall'],3,500+k*10,(x,y)=>{const e=Math.hypot((x-h[0])/h[2],(y-h[1])/h[3]);return e>.85&&e<1.05},{fit:1,br:2,road:0});
  torch(Math.round(h[0]-h[2]*.6),Math.round(h[1]-h[3]*.6));torch(Math.round(h[0]+h[2]*.6),Math.round(h[1]-h[3]*.6),{flip:true})}
 torch(55,85);torch(73,85,{flip:true});
 /* ossos de exploradores (provisório, desenhados no ov: planos, sem colisão, encostados nas paredes). Cada peça é feita
    numa grade (1 = osso, 2 = buraco escuro); o contorno escuro e a sombra embaixo/à direita saem sozinhos. */
 const OSS=(()=>{const g=oc.getContext('2d');
  const spr=(w,h,draw)=>{const m=new Uint8Array(w*h),pl=(x,y,v)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h&&m[y*w+x]!=2)m[y*w+x]=v||1};
   const ln=(x0,y0,x1,y1,t)=>{const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*2));for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;pl(x,y);if(t>1){pl(x+.5,y);pl(x,y+.5)}}};
   const el=(cx,cy,rx,ry,v)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if((x*x)/(rx*rx+.3)+(y*y)/(ry*ry+.3)<=1)pl(cx+x,cy+y,v)};
   const knob=(x,y)=>{pl(x,y);pl(x+1,y);pl(x,y+1);pl(x+1,y+1)};
   draw({pl,ln,el,knob});
   const [c,,q]=cmCv(w+2,h+2),C=(col,x,y)=>{q.fillStyle=col;q.fillRect(x+1,y+1,1,1)},in_=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&m[y*w+x];
   for(let y=-1;y<=h;y++)for(let x=-1;x<=w;x++){if(in_(x,y))continue;if(in_(x+1,y)||in_(x-1,y)||in_(x,y+1)||in_(x,y-1))C('#3a2c20',x,y)}
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=m[y*w+x];if(!v)continue;
    if(v==2){C('#1a120c',x,y);continue}C(!in_(x,y+1)||!in_(x+1,y)?'#a89878':(!in_(x,y-1)||!in_(x-1,y)?'#f2e8d0':'#ddd0b2'),x,y)}
   return c};
  const SK=spr(38,15,({pl,ln,el,knob})=>{el(4,7,3,3);pl(3,6,2);pl(5,6,2);pl(4,8,2);ln(2,10,6,10);   /* crânio e queixo */
   ln(8,7,21,7,2);for(let i=0;i<4;i++){const x=10+i*2.5,r=3.4-i*.4;ln(x,7,x-1,7-r);ln(x-1,7-r,x+.5,7-r-1);ln(x,8,x-1,8+r);ln(x-1,8+r,x+.5,8+r+1)}
   ln(9,3,15,1);ln(15,1,20,2);knob(20,1);ln(9,11,15,13);ln(15,13,20,12);knob(20,12);   /* braços */
   el(23,7,2,3);pl(23,7,2);   /* bacia */
   ln(25,5,30,4,2);knob(30,3);ln(31,4,36,5);knob(36,5);ln(25,9,30,10,2);knob(30,10);ln(31,10,36,9);knob(36,8)});   /* pernas */
  const CR=spr(9,9,({pl,el,ln})=>{el(4,4,3,3);pl(3,3,2);pl(5,3,2);pl(4,5,2);ln(2,7,6,7)});
  const OS=spr(18,12,({ln,knob})=>{ln(2,2,11,4,2);knob(1,1);knob(11,4);ln(5,9,15,7);knob(4,9);knob(15,6);ln(13,1,16,10);knob(12,0)});
  const MO=(()=>{const [c,,q]=cmCv(14,12),P=(col,x,y,w,h)=>{q.fillStyle=col;q.fillRect(x,y,w,h)};
   P('#2a1a10',1,1,11,10);P('#6a4426',2,2,9,8);P('#8a5c34',3,3,7,3);P('#3a2414',3,7,7,1);P('#c09a58',6,4,2,2);P('#4a2e18',11,3,3,1);P('#4a2e18',13,4,1,5);return c})();
  const put_=(c,x,y,f)=>{if(f){g.save();g.translate(x+c.width,y);g.scale(-1,1);g.drawImage(c,0,0);g.restore()}else g.drawImage(c,x,y)};
  const perto=(tx,ty,bw)=>{for(let d=0;d<=12;d++)for(let j=-d;j<=d;j++)for(let i=-d;i<=d;i++){if(Math.max(Math.abs(i),Math.abs(j))!=d)continue;const x=tx+i,y=ty+j;
    let ok=true;for(let b=0;b<=1&&ok;b++)for(let a=0;a<bw&&ok;a++){const k=(y+b)*W+x+a;if(x+a<0||y+b<0||x+a>=W||y+b>=H||!F[k]||S[k])ok=false}
    if(!ok)continue;let wall=false;for(let b=-2;b<=3;b++)for(let a=-2;a<=bw+1;a++){const xx=x+a,yy=y+b;if(xx<0||yy<0||xx>=W||yy>=H||!F[yy*W+xx])wall=true}
    if(wall)return [x*T,y*T+2]}return null};
  const em=(c,bw)=>(tx,ty,f)=>{const p=perto(tx,ty,bw);if(p)put_(c,p[0],p[1],f);return p};
  return {esqueleto:em(SK,3),cranio:em(CR,1),soltos:em(OS,2),mochila:em(MO,1),CR}})();
 /* a história: o primeiro explorador que achou o túnel morreu encostado na parede da Câmara do Fundo; outros ossos num
    canto do Salão das Pedras e perto da entrada */
 OSS.esqueleto(66,9,false);OSS.mochila(64,12);
 OSS.soltos(12,30);OSS.cranio(16,28);OSS.esqueleto(140,34,true);
 /* Câmara do Fundo (como o Ricardo desenhou): na parede do fundo, uma face de rocha alta (blocos de arenito) com uma
    abertura escura em arco — o túnel que desce para o Lago Subterrâneo (lg); na frente, o arco das duas lanternas com a
    corda. Parede e abertura pintadas no ov, sobre a rocha (onde não se anda). A porta são os tiles da boca; chega no Lago
    em (60, 126). */
 {const og=oc.getContext('2d'),P=(c,x,y)=>{og.fillStyle=c;og.fillRect(x,y,1,1)},MX=78*T+8;
  const edge=[];for(let tx=60;tx<=96;tx++){let r=-1;for(let y=2;y<=16;y++){if(F[y*W+tx]){r=y;break}}edge[tx]=r}
  const top=edge[78];
  /* a face de rocha: ~3 tiles de altura acima da borda norte, pedras arredondadas de arenito, luz do alto à esquerda */
  for(let tx=60;tx<=96;tx++){const r=edge[tx];if(r<0||r>top+3)continue;const ey=r*T;
   for(let x=tx*T;x<tx*T+T;x++){const hgt=62+Math.round(vn(x,0,14,151)*14);
    for(let y=ey-hgt;y<ey+2;y++){const v=vorC(x,y,10,152),L=Math.max(0,Math.min(1,.62-((x-v[3])+(y-v[4]))*.05)),m=.85+.25*hq(v[0],7),d=(ey-y)/hgt;
     let k=(.45+.6*L)*m*(.7+.3*(1-d));let c=[150*k,106*k,70*k];if(v[1]<.6)c=[c[0]*.55,c[1]*.55,c[2]*.55];else if(v[1]<1.2)c=[c[0]*.8,c[1]*.8,c[2]*.8];
     if(y<ey-hgt+2)c=[40,26,18];P('rgb('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+')',x,y)}}}
  /* a abertura: arco irregular, escuro no fundo, com a borda de pedra mais escura */
  const ey=top*T,aw=28,ah=60;
  for(let y=ey-ah-4;y<ey+2;y++)for(let x=MX-aw-4;x<=MX+aw+4;x++){const yy=ey-y,n=(vn(x,y,6,153)-.5)*6;const w=(yy>ah-aw?aw*Math.sqrt(Math.max(0,1-((yy-(ah-aw))/aw)**2)):aw)+n;
   const ad=Math.abs(x-MX);if(ad<w){const e=Math.min(1,(w-ad)/14)*Math.min(1,(ey+2-y)/18);const k=1-e;P('rgb('+((8+70*k*k)|0)+','+((5+46*k*k)|0)+','+((4+30*k*k)|0)+')',x,y)}
   else if(ad<w+2&&yy<ah+2)P('rgb(36,24,16)',x,y)}
  dark.push([MX,ey-14,70,.55]);
  /* o arco das lanternas na frente da abertura: postes nos lados, lanternas penduradas para dentro; a corda num canto */
  const lp=mkA('lamppost'),lf=mkA('lamppost',true),rp=mkA('ropes'),G=96,by=(top+2)*T+10;
  put(lp,MX-G,by);put(lf,MX+G-lf.width,by);put(rp,MX+G-4,(top+4)*T);
  for(const x of[MX-G+lp.width-18,MX+G-lf.width+18]){const y=by-lp.height+32;fx.lamp.push([x,y]);dark.push([x,y,120,1])}
  for(const x of[(MX-G+12)>>4,(MX+G-12)>>4])S[(top+2)*W+x]=1;
  const c=[];for(let x=77;x<=79;x++)if(F[top*W+x])c.push(x,top);
  DOORS.push({m:'lg',cells:c,x:60*16+8,y:126*16})}
 /* poeira no ar e areia escorrendo do teto */
 for(let k=0;k<90;k++){const x=4+hq(k,61)*(W-8)|0,y=4+hq(k,62)*(H-8)|0;if(F[y*W+x])fx.dust.push([x*T+8,y*T+8,hq(k,63)*6.28])}
 for(let k=0;k<200&&fx.sand.length<16;k++){const x=4+hq(k,64)*(W-8)|0,y=4+hq(k,65)*(H-8)|0;if(F[y*W+x]&&!F[(y-1)*W+x])fx.sand.push([x*T+8,y*T-4,hq(k,66)*6.28])}
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 fcx.drawImage(oc,0,0);
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
  zones:{names:zn,z:Z},doors:DOORS,
  /* saída: a borda sul (colunas 56-63) volta para o Acampamento dos Nômades, na frente da porta (px) */
  portals:{trig:[{k:'edge',m:'nd',x:112*16+16,y:14*16}],cells:[56,57,58,59,60,61,62,63].flatMap(x=>[x,H-1,0])}}}
