/* ---------- Templo Soterrado (mapa 'ts') — caverna (lugar de dentro) do Acampamento dos Nômades (nd) ----------
   Um templo antigo engolido pelas dunas. O eixo do templo (lajes): Salão da Entrada, Galeria das Colunas, Salão do Ídolo e a
   Câmara Selada (o tesouro). Dos dois lados, SEIS salões desmoronados e criptas cheias de areia, largos para caçar, ligados em anel.
   Entrada e saída: a porta da entrada de caverna com o portal esculpido (cave_temple), no morro de areia da Planície Escaldante, no Acampamento leva para cá (chega em (60, 115)); a saída é a borda sul (colunas 56-63),
   que volta para a frente da porta. Lugar de dentro: tamanho livre (160 × 120).
   Chão: pintor por pixel de caverna (o mesmo nas duas cavernas do Acampamento), espelhado em ts_floor.gdshader.
   gen_data: R = andável, G = distância até o caminho principal × 10, B = tipo do chão × 40
   (0 chão de arenito com cascalho, 1 areia acumulada, 2 lajes do templo, 3 rocha: parede e teto). 1 tile = 16 px.
   Objetos: peças prontas do kit (exemplo_deserto/arte), colocadas pelo ajudante do Deserto. Sem animais nem ossadas. */
function buriedTemple(){
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
 const zn=['Templo Soterrado','Salão da Entrada','Galeria das Colunas','Salão do Ídolo','Câmara Selada','Salão Desmoronado Oeste','Cripta Oeste','Salão Desmoronado Leste','Cripta Leste','Salão das Areias','Galeria Norte'];
 /* ===== grade: rocha em tudo, os salões e os túneis são escavados ===== */
 const TY=new Uint8Array(W*H).fill(3),SL=new Uint8Array(W*H);
 const HALLS=[[60,110,11,6,1,1],[60,86,16,9,2,1],[60,42,20,12,3,1],[60,14,9,4,4,1],[22,88,17,13,5,0],[22,46,17,14,6,0],[104,92,21,13,7,0],[104,52,20,14,8,0],[143,72,14,20,9,0],[106,15,22,9,10,0]];   /* [x, y, rx, ry, zona, lajes] */
 const TUN=[[60,116,60,86,4],[60,86,60,42,4],[60,42,60,14,3],[60,86,22,88,3.6],[22,88,22,46,3.6],[22,46,60,42,3.4],[60,86,104,92,3.6],[104,92,104,52,3.6],[104,52,60,42,3.4],[104,92,143,72,3.6],[104,52,143,72,3.4],[104,52,106,15,3.4],[106,15,60,14,3]];       /* túneis entre os salões: [x0, y0, x1, y1, largura] */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=x*16,Y=y*16;
  for(const [hx,hy,rx,ry,zz,sl] of HALLS){const e=Math.hypot((x-hx)/rx,(y-hy)/ry)+(vn(X,Y,46,90)-.5)*.42;if(e<1){TY[y*W+x]=0;Z[y*W+x]=zz;if(sl&&e<.86)SL[y*W+x]=1}}}
 for(const [ax,ay,bx,by,w] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n,r=w+(vn(x*16,y*16,60,90+1)-.5)*1.4;
  for(let j=Math.floor(y-r);j<=Math.ceil(y+r);j++)for(let i=Math.floor(x-r);i<=Math.ceil(x+r);i++)if(i>2&&j>2&&i<W-3&&j<H-1&&Math.hypot(i-x,j-y)<=r&&TY[j*W+i]==3)TY[j*W+i]=0}}
 /* saída sul: colunas 56-63 abertas até a borda */
 for(let y=H-8;y<H;y++)for(let x=55;x<=64;x++){if(y==H-1&&(x<56||x>63))continue;TY[y*W+x]=0}
 for(let x=0;x<W;x++){if(x<56||x>63)TY[(H-1)*W+x]=3}
 /* areia que entrou pelas frestas, e as lajes do templo */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(TY[i]==3)continue;if(vn(x*16,y*16,70,90+2)>.6)TY[i]=1;if(SL[i])TY[i]=2}
 /* tira bolsões sem ligação com a saída */
 {const seen=new Uint8Array(W*H),q=[(H-2)*W+60];seen[q[0]]=1;while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(!seen[n]&&TY[n]!=3){seen[n]=1;q.push(n)}}}
  for(let i=0;i<W*H;i++)if(TY[i]!=3&&!seen[i])TY[i]=3}
 /* a parede norte da Galeria Norte avança dos dois lados da boca da passagem, para a peça encaixar na parede */
 {let ty=15;while(ty>2&&TY[(ty-1)*W+106]!=3)ty--;for(let y=ty;y<=ty+1;y++)for(let x=97;x<=115;x++){if(x>=103&&x<=109)continue;if(Math.abs(x-106)<=8||y==ty)TY[y*W+x]=3}}
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=TY[i]!=3?1:0;
 for(let i=0;i<W*H;i++){S[i]=F[i]?0:1;if(!F[i])Z[i]=0}
 /* caminho principal (a distância RDD afasta os enfeites do meio dos túneis) */
 const RDD=new Float32Array(W*H).fill(99);
 for(const [ax,ay,bx,by] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n;
  for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;const d=Math.hypot(tx+.5-x,ty+.5-y);if(d<RDD[ty*W+tx])RDD[ty*W+tx]=d}}}

 /* ===== pintura por pixel (espelhada em ts_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10+(vn(X,Y,3,60)-.5)*5)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10+(vn(X,Y,3,61)-.5)*5)/16));
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.94+.1*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  if(tp==3){/* rocha: a face da parede (camadas de arenito) até 14 px acima do chão, e o teto escuro acima dela */
   let dn=0;for(let k=1;k<=14;k++){if(PT(X,Y+k)!=3){dn=k;break}}
   if(dn>0){const lay=Math.floor((Y+vn(X,Y,30,76)*8)/5)%4;let cr,cg,cb;
    if(lay==0){cr=[150,104,70]}else if(lay==1){cr=[170,124,84]}else if(lay==2){cr=[128,88,60]}else{cr=[184,140,96]}
    let k=.62+.38*dn/14;if(dn<3)k*=.62;if(hq(x>>1,y)<.05)k*=.8;r=cr[0]*k*grain;g=cr[1]*k*grain;b=cr[2]*k*grain}
   else{const n=vn(X,Y,40,77)*.7+vn(X,Y,9,78)*.3;r=(30+22*n)*grain;g=(22+16*n)*grain;b=(20+12*n)*grain}}
  else if(tp==1){/* areia acumulada com ondulações */
   const n=vn(X,Y,30,79),rip=Math.sin((X*.35+Y*.9+vn(X,Y,40,74)*14)*.55),k=(.92+.08*rip)*grain;r=(170+26*n)*k;g=(134+22*n)*k;b=(88+16*n)*k}
  else if(tp==2){/* lajes do templo com rejunte e areia por cima */
   const row=Math.floor(Y/16),off=(row&1)*12,u=(x+off)%24,v=y%16,id=hq(Math.floor((x+off)/24),row);
   r=id<.33?178:id<.66?166:190;g=id<.33?150:id<.66?138:162;b=id<.33?112:id<.66?100:122;let k=grain*(.94+.1*hq((id*99)|0,3));
   if(u==0||v==0){r=92;g=74;b=56;k=grain}else if(u==1||v==1)k*=1.1;else if(u==23||v==15)k*=.86;
   r*=k;g*=k;b*=k;const s=vn(X,Y,26,75);if(s>.62){const t=clamp((s-.62)*6,0,1);r+=(176-r)*t;g+=(140-g)*t;b+=(92-b)*t}}
  else{/* chão de arenito escuro com cascalho */
   const n=vn(X,Y,10,70)*.6+vn(X,Y,34,71)*.4;r=(92+40*n)*grain;g=(70+30*n)*grain;b=(50+22*n)*grain;
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
 const og=oc.getContext('2d');
 /* Salao da Entrada: acampamento dos exploradores encostado na parede (os postes de lanterna são deles) */
 fire(52,109);aNear('goods',50,106,{});aNear('jar',53,105,{bw:0});torch(69,107,{flip:true});
 /* Galeria: colunas encostadas nas paredes, meio largo e livre; braseiros de pedra nos cantos */
 for(const x of[46,74])for(const y of[81,91])aNear('column',x,y,{bw:0,fit:0,road:0,res:0});
 fire(47,95);fire(73,95);
 /* guardiões (provisório: obeliscos) dos dois lados da passagem para o Salão do Ídolo */
 aNear('obelisk',53,53,{bw:1,road:0});aNear('obelisk',67,53,{bw:1,road:0});
 /* Salao do Idolo: estatua no fundo com um raio de luz caindo do teto sobre ela; obeliscos na parede de tras; braseiros */
 aNear('statue_head',60,32,{fit:2,br:2,road:0});aNear('obelisk',44,36,{bw:1,road:0});aNear('obelisk',76,36,{bw:1,road:0});
 fire(46,46);fire(74,46);fx.beam=[[60*T+8,35*T]];dark.push([60*T+8,33*T,110,.7]);
 /* Camara Selada: o tesouro no fim do eixo — porta selada (provisório: muro com relevo) na parede do fundo, jarros e
    mercadorias dos lados, moedas de ouro espalhadas no chão (no ov, sem colisão) */
 {let y=14;while(y>2&&F[(y-1)*W+60])y--;aPut('ruin_wall',60,y+1,{bw:3,res:1});}aNear('jar',54,15,{bw:0,road:0});aNear('jar',66,15,{bw:0,road:0});aNear('goods',56,16,{road:0});
 for(let k=0;k<26;k++){const x=(52+hq(k,191)*16)*T,y=(14+hq(k,192)*4)*T;og.fillStyle=hq(k,193)<.5?'#e8c040':'#b08820';og.fillRect(x|0,y|0,3,2);og.fillStyle='#fff0a0';og.fillRect(x|0,y|0,1,1)}
 dark.push([60*T+8,14*T,80,.6]);
 /* Galeria Norte: a boca natural da caverna na parede norte — a peça recortada da imagem de referência do Ricardo
    (arte/passagem_boca.png, metade do tamanho, 128 cores, simétrica: o lado direito espelhado no esquerdo), pintada no ov com a boca centrada na porta. Desce para a Tumba do
    Rei da Areia (tr), chegando em (60, 115). Colisão: as colunas de pedra nas fileiras do chão, menos a boca. */
 {let ty=15;while(ty>2&&F[(ty-1)*W+106])ty--;
  const G={"w": 172, "h": 113, "mx": 86, "mb": 86},A=ART.passagem_boca,CX=106*T+8,BY=ty*T+4,x0=CX-G.mx,y0=BY-G.mb;
  og.drawImage(A,x0,y0);
  const [c,,q]=cmCv(G.w,G.h);q.drawImage(A,0,0);const d=q.getImageData(0,0,G.w,G.h).data;
  for(let tyy=ty;tyy*T<y0+G.h;tyy++)for(let tx=Math.floor(x0/T);tx<=Math.floor((x0+G.w-1)/T);tx++){if(tx>=104&&tx<=108)continue;let n=0;
   for(let py=tyy*T;py<tyy*T+16;py++)for(let px=tx*T;px<tx*T+16;px++){const lx=px-x0,ly=py-y0;if(lx>=0&&ly>=0&&lx<G.w&&ly<G.h&&d[(ly*G.w+lx)*4+3])n++}
   if(n>60)S[tyy*W+tx]=1}
  dark.push([CX,BY-14,90,.8]);
  DOORS.push({m:'tr',cells:[104,ty,105,ty,106,ty,107,ty,108,ty],x:60*16+8,y:115*16})}
 /* 6 saloes de caca (5 a 10): vazios no meio; braseiros de pedra no alto; areia escorrendo de fendas do teto com montinho */
 for(let k=4;k<=9;k++){const h=HALLS[k];
  fire(Math.round(h[0]-h[2]*.55),Math.round(h[1]-h[3]*.6));fire(Math.round(h[0]+h[2]*.55),Math.round(h[1]-h[3]*.6));
  for(let q=0;q<3;q++){const sx=Math.round(h[0]+(q-1)*h[2]*.45);let y=Math.round(h[1]);while(y>0&&F[(y-1)*W+sx])y--;
   if(y<=0)continue;fx.sand.push([sx*T+8,y*T-4,hq(k,q)*6.28]);
   const px=sx*T+8,py=y*T+34;for(let j=-3;j<=3;j++)for(let i=-9;i<=9;i++){if((i*i)/81+(j*j)/9>1)continue;og.fillStyle=j<0?'#dcbc84':'#c8a46a';og.fillRect(px+i,py+j,1,1)}}}
 /* poeira no ar e areia escorrendo do teto */
 for(let k=0;k<90;k++){const x=4+hq(k,61)*(W-8)|0,y=4+hq(k,62)*(H-8)|0;if(F[y*W+x])fx.dust.push([x*T+8,y*T+8,hq(k,63)*6.28])}
 for(let k=0;k<200&&fx.sand.length<16;k++){const x=4+hq(k,64)*(W-8)|0,y=4+hq(k,65)*(H-8)|0;if(F[y*W+x]&&!F[(y-1)*W+x])fx.sand.push([x*T+8,y*T-4,hq(k,66)*6.28])}
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 fcx.drawImage(oc,0,0);
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
  zones:{names:zn,z:Z},doors:DOORS,
  /* saída: a borda sul (colunas 56-63) volta para o mapa de cima, na frente da porta (px) */
  portals:{trig:[{k:'edge',m:'nd',x:122*16+8,y:89*16}],cells:[56,57,58,59,60,61,62,63].flatMap(x=>[x,H-1,0])}}}
