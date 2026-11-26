/* ---------- Lago Subterrâneo (mapa 'lg') — lugar de dentro, embaixo da Gruta do Arco Vermelho (ga) ----------
   Uma caverna enorme com um lago escuro no meio (água funda: não se anda), duas ilhas e uma ilhota ligadas por passarelas
   planas de tábuas (no ov), a margem larga em volta e cinco salões de caça ao redor. Sem animais.
   Entrada: a escada de corda na Câmara do Fundo da Gruta (porta lá); chega aqui na Chegada (60, 126). Saída: a borda sul
   (colunas 56-63, o pé da escada), que volta para a Câmara do Fundo.
   Chão: o pintor de caverna das cavernas do Acampamento (mesmo molde, cores da Gruta) + o tipo 4, água, espelhado em
   lg_floor.gdshader. gen_data: R = andável, G = distância × 10, B = tipo × 40 (0 arenito, 1 areia, 2 lajes, 3 rocha,
   4 água). Arte provisória (peças do kit) até chegar a folha do Lago (PROMPT_ASSETS_LAGO.md). 1 tile = 16 px. */
function lakeCave(){
 const T=16,W=180,H=140,FW=W*T,FH=H*T;
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vorC=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0,ccx=0,ccy=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2;ccx=px;ccy=py}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1,ccx,ccy]};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const S=new Array(W*H).fill(0),Z=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={dust:[],sand:[],fire:[],lamp:[],glint:[],ripple:[],drop:[],mist:[],beam:[],statue:null,sunk:[],deep:[]};
 const put=(cv,x,ybase,lb)=>{const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e)};
 const zn=['Lago Subterrâneo','Chegada','Margem Sul','Gruta Oeste','Gruta Leste','Salão dos Cristais','Praia Escura','Margem Norte','Margens do Lago'];
 /* ===== grade: rocha em tudo, os salões e os túneis são escavados ===== */
 const TY=new Uint8Array(W*H).fill(3),SL=new Uint8Array(W*H);
 const HALLS=[[92,62,64,46,8,0],[60,128,9,6,1,0],[90,112,30,9,2,0],[36,100,20,15,3,0],[146,100,22,15,4,0],[30,40,20,16,5,0],[152,36,20,14,6,0],[92,14,24,8,7,0]];   /* [x, y, rx, ry, zona, lajes] */
 const TUN=[[60,136,60,128,4],[60,128,90,112,4],[36,100,30,40,4],[146,100,152,36,4]];       /* túneis entre os salões: [x0, y0, x1, y1, largura] */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=x*16,Y=y*16;
  for(const [hx,hy,rx,ry,zz,sl] of HALLS){const e=Math.hypot((x-hx)/rx,(y-hy)/ry)+(vn(X,Y,46,110)-.5)*.42;if(e<1){TY[y*W+x]=0;Z[y*W+x]=zz;if(sl&&e<.86)SL[y*W+x]=1}}}
 for(const [ax,ay,bx,by,w] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n,r=w+(vn(x*16,y*16,60,110+1)-.5)*1.4;
  for(let j=Math.floor(y-r);j<=Math.ceil(y+r);j++)for(let i=Math.floor(x-r);i<=Math.ceil(x+r);i++)if(i>2&&j>2&&i<W-3&&j<H-1&&Math.hypot(i-x,j-y)<=r&&TY[j*W+i]==3)TY[j*W+i]=0}}
 /* saída sul: colunas 56-63 abertas até a borda */
 for(let y=H-8;y<H;y++)for(let x=55;x<=64;x++){if(y==H-1&&(x<56||x>63))continue;TY[y*W+x]=0}
 for(let x=0;x<W;x++){if(x<56||x>63)TY[(H-1)*W+x]=3}
 /* areia que entrou pelas frestas, e as lajes do templo */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(TY[i]==3)continue;if(vn(x*16,y*16,70,110+2)>.6)TY[i]=1;if(SL[i])TY[i]=2}
 /* o lago: água funda no meio (TY 4, não se anda), duas ilhas e passarelas planas de tábuas (BR) */
 const BR=new Uint8Array(W*H),ISL=[[76,56,7,5],[108,57,8,5],[92,78,5,3]];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(TY[i]==3)continue;const e=Math.hypot((x-92)/46,(y-62)/30)+(vn(x*16,y*16,40,140)-.5)*.18;
  if(e<1&&!ISL.some(([a,b,rx,ry])=>Math.hypot((x-a)/rx,(y-b)/ry)<1))TY[i]=4}
 for(const [ax,ay,bx,by] of[[40,56,144,56],[92,80,92,96]]){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);
  for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n;for(let j=-1;j<=0;j++)for(let k=-1;k<=0;k++){const tx=Math.round(x+k),ty=Math.round(y+j),i=ty*W+tx;if(TY[i]==4){TY[i]=0;BR[i]=1}}}}
 /* areia escura (TY 5): só numa faixa em volta do lago, de 3 a 5 tiles a partir da água (borda irregular) */
 {const D=new Float32Array(W*H).fill(99),q=[];for(let i=0;i<W*H;i++)if(TY[i]==4){D[i]=0;q.push(i)}
  for(let h=0;h<q.length;h++){const i=q[h],x=i%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;
   if(D[n]>D[i]+1&&TY[n]!=3){D[n]=D[i]+1;if(D[n]<7)q.push(n)}}}
  for(let i=0;i<W*H;i++){if(TY[i]==3||TY[i]==4||BR[i])continue;const x=i%W,y=(i/W)|0;if(D[i]<=3+vn(x*16,y*16,40,162)*2.5)TY[i]=5}}
 /* Margem Norte: um píer velho de tábuas (plano) saindo da margem para dentro do lago */
 for(let y=28;y<=40;y++)for(const x of[91,92]){const i=y*W+x;if(TY[i]==4){TY[i]=0;BR[i]=1}}
 /* tira bolsões sem ligação com a saída */
 {const seen=new Uint8Array(W*H),q=[(H-2)*W+60];seen[q[0]]=1;while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(!seen[n]&&TY[n]!=3&&TY[n]!=4){seen[n]=1;q.push(n)}}}
  for(let i=0;i<W*H;i++)if(TY[i]!=3&&TY[i]!=4&&!seen[i])TY[i]=3}
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=TY[i]!=3&&TY[i]!=4?1:0;
 for(let i=0;i<W*H;i++){S[i]=F[i]?0:1;if(!F[i])Z[i]=0}
 /* caminho principal (a distância RDD afasta os enfeites do meio dos túneis) */
 const RDD=new Float32Array(W*H).fill(99);
 for(const [ax,ay,bx,by] of TUN){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n;
  for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;const d=Math.hypot(tx+.5-x,ty+.5-y);if(d<RDD[ty*W+tx])RDD[ty*W+tx]=d}}}

 /* ===== pintura por pixel (espelhada em ga_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10+(vn(X,Y,3,60)-.5)*5)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10+(vn(X,Y,3,61)-.5)*5)/16));
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.94+.1*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  if(tp==4){/* água funda: escura no meio, rasa e clara perto da margem, com ondinhas e reflexos */
   let sh=0;for(let k=1;k<=8;k++){if(PT(X-k,Y)!=4||PT(X+k,Y)!=4||PT(X,Y-k)!=4||PT(X,Y+k)!=4){sh=k;break}}
   const n=vn(X,Y,40,141),w=Math.sin(X*.18+Y*.5+vn(X,Y,30,142)*6+n*3);r=14+10*n;g=34+14*n;b=50+18*n;
   if(sh>0){const t=1-sh/9;r+=50*t;g+=70*t;b+=76*t;if(sh<2){r=120;g=150;b=150}}
   if(w>.92){r+=40;g+=60;b+=66}if(hq(x,y*5)<.002){r=170;g=216;b=228}}
  else if(tp==3){/* rocha: a face da parede (camadas de arenito) até 14 px acima do chão, e o teto escuro acima dela */
   let dn=0;for(let k=1;k<=14;k++){if(PT(X,Y+k)!=3){dn=k;break}}
   if(dn>0){const lay=Math.floor((Y+vn(X,Y,30,76)*8)/5)%4;let cr,cg,cb;
    if(lay==0){cr=[140,62,40]}else if(lay==1){cr=[162,78,48]}else if(lay==2){cr=[118,50,34]}else{cr=[178,96,60]}
    let k=.62+.38*dn/14;if(dn<3)k*=.62;if(hq(x>>1,y)<.05)k*=.8;r=cr[0]*k*grain;g=cr[1]*k*grain;b=cr[2]*k*grain}
   else{const n=vn(X,Y,40,77)*.7+vn(X,Y,9,78)*.3;r=(30+22*n)*grain;g=(22+16*n)*grain;b=(20+12*n)*grain}}
  else if(tp==5){/* areia escura da praia: preta, ondulada, com grãos brilhando */
   const n=vn(X,Y,30,79),rip=Math.sin((X*.35+Y*.9+vn(X,Y,40,74)*14)*.55),k=(.9+.1*rip)*grain;r=(52+22*n)*k;g=(46+18*n)*k;b=(50+20*n)*k;
   if(hq(x,y*3)<.012){r=150;g=140;b=160}}
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
 const [oc,ofc]=cmCv(FW,FH);
 /* passarelas de tábuas (planas, no ov) */
 for(let i=0;i<W*H;i++)if(BR[i]){const x=(i%W)*T,y=((i/W)|0)*T;for(let k=0;k<4;k++){ofc(k%2?'#6a4628':'#8a6038',x,y+k*4,16,4);ofc('#3a2414',x,y+k*4+3,16,1)}}
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
 /* Chegada: escada de corda (provisória: as cordas) e o acampamento dos exploradores */
 aNear('ropes',60,123,{bw:1});fire(55,128);aNear('goods',65,127,{});torch(66,124,{flip:true});
 /* barco a remo amarrado na Margem Sul e um poste de amarração */
 /* Margem Norte: o barco amarrado ao lado do píer velho, com o poste de amarração na ponta da margem */
 {const c=mkA('rowboat',true);put(c,94*T,39*T);}{let sy=28;while(sy<50&&TY[sy*W+94]!=4)sy++;const m=mkA('mooring');put(m,94*T,(sy-1)*T+4);S[(sy-2)*W+94]=1}
 /* Praia Escura: pedras lisas só na beira da água (bloqueiam) */
 {let n=0;for(let k=0;k<600&&n<14;k++){const x=110+hq(k,181)*50|0,y=24+hq(k,182)*40|0,i=y*W+x;if(TY[i]!=5||S[i]||AUSE[i])continue;
   let w=false;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1],[2,0],[0,2]])if(TY[(y+dy)*W+x+dx]==4)w=true;if(!w)continue;
   aPut(['pebbles1','pebbles2'][(hq(x,y)*2)|0],x,y,{flip:hq(y,x)<.5,res:1});n++}}
 /* tochas em volta do lago e nos salões; rochedos só colados na parede */
 for(const [x,y,f] of[[52,82,0],[132,82,1],[48,40,0],[136,40,1],[70,24,0],[114,24,1],[90,104,0]])torch(x,y,{flip:!!f});
 for(let k=3;k<=7;k++){const h=HALLS[k];
  aScat(['rock_m','rock_tall'],3,500+k*10,(x,y)=>{const e=Math.hypot((x-h[0])/h[2],(y-h[1])/h[3]);return e>.85&&e<1.05},{fit:1,br:2,road:0});
  torch(Math.round(h[0]-h[2]*.55),Math.round(h[1]-h[3]*.6))}
 /* cristais (provisório: brilho no lugar da arte que virá) */
 for(let k=0;k<26;k++){const t=k/26*6.283,x=92+Math.cos(t)*49,y=62+Math.sin(t)*33;dark.push([x*T,y*T,70,.8])}
 /* a estátua antiga meio afundada no lago, entre as duas ilhas (provisória: a cabeça de estátua do kit; a arte certa
    — cabeça e um braço saindo da água — vem na folha do Lago). Fica na água: não precisa de colisão. */
 {const sx=99*T,sy=72*T,c=mkA('statue_head');put(c,sx-(c.width>>1),sy);fx.statue=[sx,sy-6,c.width];dark.push([sx,sy-30,90,.45])}
 /* ruínas afundadas em volta da estátua: colunas, muro e um arco saindo da água (só a parte de cima da peça; a linha da
    água é a base). Provisório: peças de ruína do kit; ficam na água, sem colisão. */
 {const sunk=(n,tx,ty,keep,flip)=>{const a=mkA(n,flip),h=Math.round(a.height*keep),[c,,q]=cmCv(a.width,h);q.drawImage(a,0,0);
   const x=tx*T+8-(a.width>>1),y=ty*T+8;put(c,x,y);fx.sunk.push([tx*T+8,y-2,a.width])};
  sunk('ruin_gate',112,68,.62,false);sunk('column',86,66,.7,false);sunk('column_broken',105,63,.72,true);
  sunk('ruin_wall',84,73,.55,false);sunk('column',114,79,.6,true);sunk('column_broken',80,64,.7,false);}
 /* luz vinda do fundo: cristais no fundo do lago, manchas âmbar e azuladas pulsando embaixo da água */
 for(const [x,y,c] of[[99,72,0],[88,68,1],[110,72,0],[94,64,1],[104,80,1],[82,70,0],[116,64,1],[72,72,1],[124,70,0]])fx.deep.push([x*T,y*T,c,hq(x,y)*6.28]);
 /* vida no lago: ondinhas e reflexos, gotas pingando do teto, névoa fina sobre a água, feixes de luz de fendas do teto */
 {const isW=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&TY[y*W+x]==4;
  for(let k=0;k<400&&fx.ripple.length<70;k++){const x=4+hq(k,171)*(W-8)|0,y=4+hq(k,172)*(H-8)|0;if(isW(x,y))fx.ripple.push([x*T+8,y*T+8,hq(k,173)*6.28])}
  for(let k=0;k<400&&fx.drop.length<18;k++){const x=4+hq(k,174)*(W-8)|0,y=4+hq(k,175)*(H-8)|0;if(isW(x,y))fx.drop.push([x*T+8,y*T+8,hq(k,176)*7])}
  for(let k=0;k<400&&fx.mist.length<30;k++){const x=4+hq(k,177)*(W-8)|0,y=4+hq(k,178)*(H-8)|0;if(isW(x,y))fx.mist.push([x*T+8,y*T+8,hq(k,179)*6.28])}
  for(const [x,y] of[[70,46],[118,70],[92,40],[58,70]])fx.beam.push([x*T,y*T])}
 /* poeira no ar e areia escorrendo do teto */
 for(let k=0;k<90;k++){const x=4+hq(k,61)*(W-8)|0,y=4+hq(k,62)*(H-8)|0;if(F[y*W+x])fx.dust.push([x*T+8,y*T+8,hq(k,63)*6.28])}
 for(let k=0;k<200&&fx.sand.length<16;k++){const x=4+hq(k,64)*(W-8)|0,y=4+hq(k,65)*(H-8)|0;if(F[y*W+x]&&!F[(y-1)*W+x])fx.sand.push([x*T+8,y*T-4,hq(k,66)*6.28])}
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 fcx.drawImage(oc,0,0);
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
  zones:{names:zn,z:Z},
  /* saída: a borda sul (colunas 56-63) volta para o Acampamento dos Nômades, na frente da porta (px) */
  portals:{trig:[{k:'edge',m:'ga',x:78*16+8,y:15*16}],cells:[56,57,58,59,60,61,62,63].flatMap(x=>[x,H-1,0])}}}
