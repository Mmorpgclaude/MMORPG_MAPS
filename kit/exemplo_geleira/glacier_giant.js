/* ---------- Geleira do Gigante Adormecido (mapa 'gj') — v10.7, ao norte da Floresta dos Pinheiros ----------
   O Rio Congelado da Floresta sobe para o norte e nasce numa cachoeira congelada no pé de uma geleira enorme. Na parede de
   gelo há um gigante (jötunn) preso, dormindo. No caminho: o Vale do Rio (entrada, ponte de troncos), um Acampamento
   Abandonado de exploradores, o Campo de Fendas (fendas azuis com pontes de gelo e de corda) e, do outro lado, o Machado e o
   Elmo do gigante caídos na neve. À noite, aurora boreal (fx_gj.gd).
   Objetos: a própria arte da folha do Ricardo (Assets_Geleira), recortada por tools/gj_art.py em tools/art_gj/ e carregada
   pelo build_interior.py em window.ART. Chão: pintor por pixel abaixo, espelhado em shaders/gj_floor.gdshader.
   gen_data: R = andável, G = distância até a trilha × 10, B = tipo do chão × 40
   (0 neve, 1 gelo da geleira, 2 rio congelado, 3 fenda, 4 rocha, 5 topo da geleira). 1 tile = 16 px. */
function glacierGiant(){
 const T=16,W=150,H=120,FW=W*T,FH=H*T;
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vor=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1]};
 /* vorC: como vor, mais o centro da célula mais perto (para os tufos de neve) */
 const vorC=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0,ccx=0,ccy=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2;ccx=px;ccy=py}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1,ccx,ccy]};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const S=new Array(W*H).fill(0),Z=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={aurora:1,mist:[],fall:null,glint:[],bird:[],smoke:[]};
 const zn=['Geleira do Gigante Adormecido','Vale do Rio','Acampamento Abandonado','Campo de Fendas','Machado e Elmo','Paredão da Geleira','Cachoeira Congelada'];
 const put=(cv,x,yb,lb)=>{const ybase=Math.round(yb);const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e);return e};
 const blk=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)S[y*W+x]=1};

 /* ===== geografia (por tile) ===== */
 const TY=new Uint8Array(W*H);
 const rxG=y=>88+Math.sin((119-y)/9)*3+Math.sin((119-y)/23)*4;              /* centro do rio (tiles): na borda sul fica em 88, igual à Floresta */
 const wallY=x=>24+Math.floor(vn(x*16,0,90,61)*4);                          /* pé da parede da geleira (tiles) */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=0;
  if(y<wallY(x)+9+vn(x*16,y*16,60,63)*4||(x>98&&y<96&&vn(x*16,y*16,120,64)>.38)||vn(x*16,y*16,150,62)>.7)t=1;
  if(y<wallY(x))t=5;
  else{const hw=2.3+(vn(x*16,y*16,40,65)-.5)*.8;if(Math.abs(x+.5-rxG(y))<hw)t=2}
  const e=Math.min(x,W-1-x,H-1-y)+(vn(x*16,y*16,50,66)-.5)*3;if(e<3&&!(y>H-6&&x>=84&&x<=94)&&!(x>W-6&&y>=56&&y<=66))t=y<wallY(x)?5:4;   /* v10.9: passagem leste para Utgard (linhas 56-66) */
  TY[y*W+x]=t}
 /* rochedos de granito com neve */
 for(const [ox,oy,rx,ry] of[[24,62,4,3],[30,98,3,2],[52,106,4,2],[66,80,3,2],[16,42,4,3],[120,102,4,3],[140,84,3,3],[112,30,3,2],[22,30,3,2]])
  for(let y=oy-ry-2;y<=oy+ry+2;y++)for(let x=ox-rx-2;x<=ox+rx+2;x++){if(x<0||y<0||x>=W||y>=H)continue;if(Math.hypot((x-ox)/rx,(y-oy)/ry)<.85+vn(x*16,y*16,30,68)*.35&&TY[y*W+x]!=2)TY[y*W+x]=4}
 /* fendas do Campo de Fendas: três rachaduras de norte a sul, cada uma com uma ponte */
 const CRV=[0,1,2].map(k=>y=>108+k*12+Math.sin(y/6+k)*1.5+(vn(0,y*16,80,67+k)-.5)*3);
 const BRY=[60,55,50],BRK=['icearch','ropebridge','icearch'];
 for(let k=0;k<3;k++)for(let y=28;y<=92;y++){const c=CRV[k](y),taper=Math.min(1,(y-27)/4,(93-y)/6);for(let x=Math.floor(c-3);x<=Math.ceil(c+3);x++){
  const hw=(1.1+(vn(x*16,y*16,30,70)-.5)*.6)*taper;if(y>=wallY(x)&&Math.abs(x+.5-c)<hw)TY[y*W+x]=3}}
 /* trilhas */
 const BRX=[0,1,2].map(k=>CRV[k](BRY[k]));
 const TR=[[92,119.5],[93,112],[92,105.5],[84,104.5],[74,99],[60,92],[46,82],[38,76]];   /* entrada -> ponte de troncos -> acampamento */
 const TG=[[60,92],[63,74],[65,56],[62,40],[61,32]];                                     /* para o gigante */
 const TX=[[140,47],[143,54],[146,60],[149.5,61]];                                     /* v10.9: do machado até a passagem leste */
 const TE=[[74,99],[92,94],[100,80],[103,66],[BRX[0]-4,BRY[0]],[BRX[0]+4,BRY[0]],[BRX[1]-4,BRY[1]],[BRX[1]+4,BRY[1]],[BRX[2]-4,BRY[2]],[BRX[2]+4,BRY[2]],[140,46]];
 const RDD=new Float32Array(W*H).fill(99);
 for(const L of[TR,TG,TE,TX]){for(let k=0;k<L.length-1;k++){const [ax,ay]=L[k],[bx,by]=L[k+1],n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);
  for(let q=0;q<=n;q++){const x=ax+(bx-ax)*q/n,y=ay+(by-ay)*q/n;for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;
   const d=Math.hypot(tx+.5-x,ty+.5-y),ii=ty*W+tx;if(d<RDD[ii])RDD[ii]=d;if(d<1.8&&TY[ii]==4)TY[ii]=0}}}}
 const BRIDGE=new Uint8Array(W*H);for(let k=0;k<3;k++)for(let y=BRY[k]-1;y<=BRY[k]+1;y++)for(let x=Math.round(BRX[k])-3;x<=Math.round(BRX[k])+3;x++)BRIDGE[y*W+x]=1;
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=(TY[i]<=2||BRIDGE[i])?1:0;
 const RQ=new Float32Array(W*H);for(let i=0;i<W*H;i++)RQ[i]=Math.min(255,Math.round(RDD[i]*10))/10;   /* a distância como fica gravada no gen_data */

 /* ===== pintura por pixel (espelhada em shaders/gj_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10)/16));
 const bilQ=(x,y)=>{const X=(x-8)/16,Y=(y-8)/16,x0=clamp(Math.floor(X),0,W-2),y0=clamp(Math.floor(Y),0,H-2),u=clamp(X-x0,0,1),v=clamp(Y-y0,0,1);
  const a=RQ[y0*W+x0],b=RQ[y0*W+x0+1],c=RQ[(y0+1)*W+x0],d=RQ[(y0+1)*W+x0+1];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const hS=(a,b)=>vn(a,b,14,43)*.55+vn(a,b,42,44)*.45;
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.95+.08*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  if(tp==0){/* neve fofa em tufos, luz do alto à esquerda */
   const v=vorC(X,Y,13,45),ddx=(X-v[3])/13,ddy=(Y-v[4])/13,gx=hS(X+3,Y)-hS(X-3,Y),gy=hS(X,Y+3)-hS(X,Y-3);
   const L=clamp(.66-(ddx+ddy)*.5+(1-v[2]/13)*.12-(gx+gy)*3,0,1);r=168+76*L;g=188+60*L;b=222+33*L;
   if(v[1]<1.1&&ddx+ddy>-.1){r*=.88;g*=.91;b*=.97}r*=grain;g*=grain;b*=grain;
   const rd=bilQ(X,Y)+(vn(X,Y,10,12)-.5)*.9;if(rd<1.9){const m=Math.min(1,(1.9-rd)/1.9*1.6);r*=1-m*.14;g*=1-m*.12;b*=1-m*.07;
    if(m>.35){const fp=((x>>2)+(y>>3))&3;if(fp==0&&(y&7)<3&&(x&3)==1&&hq(x>>2,y>>3)<.35){r*=.86;g*=.88;b*=.93}}}
   if(hq(x,y*3)<.005){r=255;g=255;b=255}}
  else if(tp==1){/* gelo da geleira: placas com rachaduras brancas */
   const vr=vor(X,Y,52,46),t=vn(X,Y,70,47)*.7+vn(X,Y,18,60)*.3,k=clamp(1-vr[2]/52,0,1);r=128+34*t+10*k;g=182+26*t+8*k;b=230+16*t+5*k;
   if(vr[1]<.7){r=228;g=244;b=255}else if(vr[1]<1.6){r+=12;g+=10;b+=6}else if(vr[1]<2.6){r-=8;g-=6;b-=2}
   if(Math.sin(X*.5-Y*.3+vn(X,Y,40,17)*6)>.95){r+=20;g+=16;b+=10}r*=grain;g*=grain;b*=grain;if(hq(x,y*7)<.004){r=255;g=255;b=255}}
  else if(tp==2){/* rio congelado: gelo escuro com rachaduras e brilho */
   const vr=vor(X,Y,26,48),t=vn(X,Y,40,49);r=40+20*t;g=82+24*t;b=138+22*t;if(vr[1]<.8){r=150;g=196;b=236}
   if(Math.sin(X*.4+Y*.2+vn(X,Y,30,55)*5)>.97){r+=40;g+=40;b+=30}r*=grain;g*=grain;b*=grain}
  else if(tp==3){/* fenda: parede de gelo descendo e o fundo azul-escuro */
   let up=0;for(let k=1;k<=24;k++){if(PT(X,Y-k)!=3){up=k;break}}
   if(up>0&&up<=14){const v=up/14;r=140-100*v;g=196-126*v;b=236-116*v;if(((x+Math.floor(vn(X,0,5,52)*6))%6)<1){r*=.85;g*=.85;b*=.9}if(up<5&&hq(x>>1,3)<.5){r=220;g=240;b=255}}
   else{const n=vn(X,Y,30,56);r=14+n*12;g=26+n*16;b=54+n*22}
   let dn=0;for(let k=1;k<=3;k++){if(PT(X,Y+k)!=3){dn=k;break}}if(dn>0){r=226;g=238;b=252}}
  else if(tp==4){/* granito com neve */
   const v=vorC(X,Y,20,53),ddx=(X-v[3])/20,ddy=(Y-v[4])/20,m=.88+.24*hq(v[0],5),L=clamp(.55-(ddx+ddy)*.6,0,1);
   r=(52+88*L)*m;g=(56+90*L)*m;b=(68+94*L)*m;
   if(v[1]<1.2){r=30;g=32;b=40}else if(ddy<-.16+(vn(X,Y,6,54)-.5)*.24){const k2=.86+.14*L;r=232*k2;g=240*k2;b=252*k2}r*=grain;g*=grain;b*=grain}
  else{/* topo da geleira (atrás da parede) */
   const gx=hS(X+3,Y)-hS(X-3,Y),gy=hS(X,Y+3)-hS(X,Y-3),L=clamp(.7-(gx+gy)*7,0,1);r=186+64*L;g=204+46*L;b=232+23*L;
   const vr=vor(X,Y,64,57);if(vr[1]<.8&&vn(X,Y,40,58)>.45){r=150;g=196;b=236}r*=grain;g*=grain;b*=grain}
  if(tp<=2){let dd=99;for(let k=1;k<=10;k++){const t2=PT(X,Y-k);if(t2==4||t2==5){dd=k;break}}if(dd<10){const kk=.72+.28*dd/10;r*=kk;g*=kk;b*=kk*1.02}}
  return [clamp(r,0,255)|0,clamp(g,0,255)|0,clamp(b,0,255)|0]};
 const [fc]=cmCv(FW,FH),fcx=fc.getContext('2d'),im=fcx.createImageData(FW,FH),Dd=im.data;
 for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){const c=paint(x,y),o=(y*FW+x)*4;Dd[o]=c[0];Dd[o+1]=c[1];Dd[o+2]=c[2];Dd[o+3]=255}
 fcx.putImageData(im,0,0);
 /* camada de cima do chão (ov): as pontes, por onde se anda */
 const [oc,,octx]=cmCv(FW,FH);
 const art=(n,flip)=>{const a=ART[n],[c,,q]=cmCv(a.width,a.height);if(flip){q.translate(a.width,0);q.scale(-1,1)}q.drawImage(a,0,0);return c};
 const ovArt=(n,cx,cy)=>{const a=ART[n];octx.drawImage(a,Math.round(cx-a.width/2),Math.round(cy-a.height/2))};

 /* ===== colisão base e zonas ===== */
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const i=ty*W+tx;if(!F[i])S[i]=1;
  const e=(a,b,rx,ry)=>Math.hypot((tx-a)/rx,(ty-b)/ry)<1;let z=0;
  if(ty>=95)z=1;if(tx>=100&&tx<136&&ty>=26&&ty<=92)z=3;if(tx>=136&&ty>=26&&ty<=62)z=4;if(e(38,74,10,7))z=2;if(ty<wallY(tx)+6)z=5;if(e(rxG(28),30,8,5))z=6;Z[i]=z}
 for(let x=0;x<W;x++){S[x]=1}

 /* ===== objetos (arte da folha) ===== */
 const used=new Uint8Array(W*H);const res=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)used[y*W+x]=1};
 /* place: centro x e base y em px; bloqueia uma faixa no pé (fração da largura, linhas) */
 const place=(n,cx,by,bw,bh,flip,lb)=>{const c=art(n,flip);put(c,cx-c.width/2,by,lb);if(bw>0){const hw=c.width*bw/2;blk(Math.floor((cx-hw)/T),Math.floor((by-1)/T)-(bh-1),Math.floor((cx+hw-1)/T),Math.floor((by-1)/T))}
  res(Math.floor((cx-c.width/2)/T),Math.floor((by-c.height*.4)/T),Math.floor((cx+c.width/2)/T),Math.floor(by/T));return c};
 /* --- Paredão da Geleira: o gigante no meio, a cachoeira onde nasce o rio, blocos de gelo nos lados --- */
 const GX=60,WFX=Math.round(rxG(28)*T);
 place('giant',GX*T+8,(wallY(GX)+3)*T,.8,2);
 place('waterfall',WFX,(wallY(Math.round(rxG(28)))+4)*T+4,0,0);fx.fall=[WFX,(wallY(Math.round(rxG(28)))-6)*T,(wallY(Math.round(rxG(28)))+3)*T,40];
 {let x=-20,k=0;while(x<FW+20){const n=(k%3==1)?'icewall':'icecliff',w=ART[n].width,c=x+w/2;
   if(Math.abs(c-(GX*T+8))<w/2+110||Math.abs(c-WFX)<w/2+70){x+=16;continue}
   const tx=clamp(Math.round(c/T),0,W-1);place(n,c,(wallY(tx)+1)*T+6,0,0,hq(k,3)<.5);x+=w-34;k++}}
 place('runestone',48*T,34*T,.5,1);place('crystal_big',73*T,32*T,.6,1);place('crystal_s1',77*T,34*T,.6,1);place('crystal_s2',44*T,31*T,.6,1);
 place('iceblocks',81*T,31*T,.7,1);place('iceblocks2',102*T,33*T,.7,1);place('crystal_s3',55*T,37*T,.6,1);place('rockice',22*T+8,32*T,.7,2);place('rockice',122*T,31*T,.7,2,true);
 for(const [x,y] of[[69,36],[52,30],[85,35],[96,31]])fx.glint.push([x*T,y*T]);
 /* --- Acampamento Abandonado --- */
 place('tent',37*T,74*T,.7,2);place('firepit',43*T,77*T,.6,1);place('crates',30*T,75*T,.8,1);place('sled',46*T,72*T,.7,1);place('mappost',33*T,79*T,.5,1);
 place('pickaxe',40*T,80*T,0,0);place('rope',43*T,80*T,0,0);place('backpack',30*T+8,78*T+4,0,0);place('rock2',26*T,72*T,.6,1);place('deadbush',48*T,78*T,0,0);
 /* --- Campo de Fendas: pontes, estacas, névoa saindo das fendas --- */
 for(let k=0;k<3;k++){ovArt(BRK[k],BRX[k]*T+8,BRY[k]*T+8);if(BRK[k]=='ropebridge'){}res(Math.round(BRX[k])-4,BRY[k]-2,Math.round(BRX[k])+4,BRY[k]+2)}
 place('ropeposts',(BRX[1]-5)*T,(BRY[1]+2)*T,.5,1);
 for(let k=0;k<3;k++)for(let y=30;y<=90;y+=4)fx.mist.push([Math.round(CRV[k](y)*T+8),y*T+8]);
 /* --- Machado e Elmo do gigante --- */
 place('axe',141*T,42*T,.4,1);place('helmet',136*T,50*T,.7,1);place('shield',145*T,49*T,.7,1,true);place('skeleton',140*T,56*T,.6,1);place('skull',134*T,55*T,.6,1);
 place('rockice',144*T,36*T,.7,2,true);place('rock1',131*T,46*T,.6,1);
 /* --- Vale do Rio: ponte de troncos onde a trilha cruza o rio --- */
 ovArt('logbridge',Math.round(rxG(105)*T)+8,105*T+4);res(Math.round(rxG(105))-4,103,Math.round(rxG(105))+4,107);
 place('rock3',97*T,112*T,0,0);
 /* --- enfeites espalhados --- */
 const free=(x,y,need)=>{if(x<2||y<2||x>=W-2||y>=H-2)return false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const k=(y+j)*W+x+i;if(!F[k]||S[k]||used[k]||BRIDGE[k])return false;if(need>=0&&TY[k]!=need&&!(need==9&&TY[k]<=1))return false}
  if(RDD[y*W+x]<3.2)return false;if(Math.abs(x+.5-rxG(y))<4.5)return false;return true};
 const spots=(n,sd,need,test=()=>true)=>{const L=[];for(let t=0;t<n*90&&L.length<n;t++){const x=2+hq(t,sd)*(W-4)|0,y=2+hq(sd,t)*(H-4)|0;if(!test(x,y)||!free(x,y,need))continue;res(x-1,y-2,x+1,y+1);L.push([x,y])}return L};
 const PIN=['pine1','pine2','pine3'];
 for(const [x,y] of spots(44,101,0,(x,y)=>y>40&&!(x>98&&y<96)))place(PIN[(hq(x,y)*3)|0],x*T+8,(y+1)*T,.25,1,hq(y,x)<.5);
 for(const [x,y] of spots(14,102,9))place(['rock1','rock2','rock3','rock4'][(hq(x,y)*4)|0],x*T+8,(y+1)*T,.5,1,hq(y,x)<.5);
 for(const [x,y] of spots(12,103,0,(x,y)=>y>40))place(['deadbush','deadshrub','bush'][(hq(x,y)*3)|0],x*T+8,(y+1)*T,0,0);
 for(const [x,y] of spots(12,104,1))place(['crystal_s1','crystal_s2','crystal_s3','iceblocks'][(hq(x,y)*4)|0],x*T+8,(y+1)*T,.5,1),fx.glint.push([x*T+8,y*T]);
 /* corvos */
 for(let k=0;k<3;k++)fx.bird.push([(30+hq(k,1)*90)*T,(40+hq(k,2)*60)*T,10,hq(k,4)*6.28]);
 fcx.drawImage(oc,0,0);
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
   zones:{names:zn,z:Z},
   /* saída sul: volta para a Floresta dos Pinheiros (colunas 84-94, igual à borda norte da Floresta) */
   portals:{trig:[{k:'edge',m:'nn',y:24,dx:0},{k:'edge',m:'ug',x:24,dy:0}],cells:[84,85,86,87,88,89,90,91,92,93,94].flatMap(x=>[x,H-1,0]).concat([56,57,58,59,60,61,62,63,64,65,66].flatMap(y=>[W-1,y,1]))}}}
