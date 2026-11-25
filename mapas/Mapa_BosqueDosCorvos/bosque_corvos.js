/* ---------- Bosque dos Corvos Brancos (mapa 'lc') — ao norte do Passo de Hrimfjell (nh), posição (110, -660) ----------
   O bosque sagrado no alto das montanhas, de onde os corvos descem para todo o Reino do Gelo. Árvores mortas de madeira
   branca, a Árvore dos Corvos gigante no norte (com o altar no pé), o Poço Sagrado a oeste, o Ninhal a leste e a Clareira
   do Guardião a noroeste (sem a cabana: o jogo é plano e a casa tinha volume demais). Entrada só pelo sul (colunas 70-80), vindo do Passo de Hrimfjell.
   Objetos: a própria arte da folha do Ricardo (Assets_BosqueDosCorvos), recortada por recorta_folha.py em arte/.
   Chão: pintor por pixel abaixo, espelhado em lc_floor.gdshader.
   gen_data: R = andável, G = distância até a trilha × 10, B = tipo do chão × 40
   (0 neve, 1 chão do bosque, 2 trilha de terra congelada, 3 gelo escuro, 4 rocha, 5 neve pisada). 1 tile = 16 px. */
function ravenWood(){
 const T=16,W=150,H=120,FW=W*T,FH=H*T;
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vor=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1]};
 /* vorC: como vor, mais o centro da célula mais perto */
 const vorC=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0,ccx=0,ccy=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2;ccx=px;ccy=py}else if(d<d2)d2=d}return [id,(d2-d1)/2,d1,ccx,ccy]};
 const clamp=(v,a,b)=>v<a?a:v>b?b:v;
 const S=new Array(W*H).fill(0),Z=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={mist:[],raven:[],feather:[],candle:[],rune:[],eyes:[]};
 const zn=['Bosque dos Corvos Brancos','Trilha do Passo','Bosque Branco','Ninhal','Poço Sagrado','Árvore dos Corvos','Clareira do Guardião'];
 const put=(cv,x,yb,lb)=>{const ybase=Math.round(yb);const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e);return e};
 const blk=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)S[y*W+x]=1};
 const EL=(x,y,a,b,rx,ry)=>Math.hypot((x-a)/rx,(y-b)/ry);

 /* ===== geografia (por tile) ===== */
 const PX0=70,PX1=80;                                            /* passagem sul (colunas 70-80) para o Passo de Hrimfjell */
 const TREE=[75,30],WELL=[31,65],CAB=[34,35],NIN=[117,62],POND=[104,90];
 const TY=new Uint8Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let t=0;const X=x*16,Y=y*16;
  if(y>44&&y<102&&vn(X,Y,110,80)*.75+vn(X,Y,40,86)*.25>.58)t=1;                                              /* manchas de chão do bosque */
  if(EL(x,y,NIN[0],NIN[1],14,10)+(vn(X,Y,40,81)-.5)*.5<1)t=1;                         /* Ninhal: folhas, gravetos e penas */
  if(EL(x,y,TREE[0],TREE[1]+4,15,7)+(vn(X,Y,40,82)-.5)*.4<1)t=5;                  /* clareiras de neve pisada */
  if(EL(x,y,WELL[0],WELL[1],9,6)+(vn(X,Y,40,82)-.5)*.4<1)t=5;
  if(EL(x,y,CAB[0],CAB[1],11,6)+(vn(X,Y,40,82)-.5)*.4<1)t=5;
  if(EL(x,y,POND[0],POND[1],8,4.5)+(vn(X,Y,50,83)-.5)*.5<1)t=3;                       /* lagoa congelada */
  const e=Math.min(x,W-1-x,y-2,H-1-y)+(vn(X,Y,60,84)-.5)*4;
  const gap=y>=H-9&&x>=PX0-1&&x<=PX1+1&&!(y==H-1&&(x<PX0||x>PX1));
  if(e<4&&!gap)t=4;
  TY[y*W+x]=t}
 /* rochedos */
 for(const [ox,oy,rx,ry] of[[18,92,4,3],[130,98,4,3],[132,32,5,3],[52,17,4,2],[100,18,4,2],[13,46,3,3],[137,78,3,2],[94,108,3,2],[50,104,3,2]])
  for(let y=oy-ry-2;y<=oy+ry+2;y++)for(let x=ox-rx-2;x<=ox+rx+2;x++){if(x<0||y<0||x>=W||y>=H)continue;if(Math.hypot((x-ox)/rx,(y-oy)/ry)<.85+vn(x*16,y*16,30,68)*.35&&TY[y*W+x]!=3)TY[y*W+x]=4}
 /* trilhas */
 const TR=[[75,119.5],[75,112],[73,104],[70,95],[71,84],[74,74],[76,64],[75,52],[75,44],[75,37],[75,33]];   /* entrada -> Árvore dos Corvos */
 const TP=[[71,84],[60,77],[48,71],[38,66]];                                                      /* para o Poço Sagrado */
 const TN=[[74,74],[88,68],[100,64],[110,62]];                                                    /* para o Ninhal */
 const TC=[[75,44],[62,40],[50,38],[42,37]];                                                      /* para a Clareira do Guardião */
 const RDD=new Float32Array(W*H).fill(99);
 for(const L of[TR,TP,TN,TC]){for(let k=0;k<L.length-1;k++){const [ax,ay]=L[k],[bx,by]=L[k+1],n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);
  for(let q=0;q<=n;q++){const x=ax+(bx-ax)*q/n,y=ay+(by-ay)*q/n;for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;
   const d=Math.hypot(tx+.5-x,ty+.5-y),ii=ty*W+tx;if(d<RDD[ii])RDD[ii]=d;if(d<1.8&&TY[ii]==4)TY[ii]=0}}}}
 for(let i=0;i<W*H;i++){const x=i%W,y=(i/W)|0;if(RDD[i]<1.25+(vn(x*16,y*16,24,85)-.5)*.7&&TY[i]!=4&&TY[i]!=3)TY[i]=2}
 const F=new Uint8Array(W*H);for(let i=0;i<W*H;i++)F[i]=TY[i]!=4?1:0;
 const RQ=new Float32Array(W*H);for(let i=0;i<W*H;i++)RQ[i]=Math.min(255,Math.round(RDD[i]*10))/10;   /* a distância como fica gravada no gen_data */

 /* ===== pintura por pixel (espelhada em lc_floor.gdshader) ===== */
 const TYc=(tx,ty)=>TY[clamp(ty,0,H-1)*W+clamp(tx,0,W-1)];
 const PT=(X,Y)=>TYc(Math.floor((X+(vn(X,Y,7,50)-.5)*10+(vn(X,Y,26,58)-.5)*20+(vn(X,Y,3,60)-.5)*6)/16),Math.floor((Y+(vn(X,Y,7,51)-.5)*10+(vn(X,Y,26,59)-.5)*20+(vn(X,Y,3,61)-.5)*6)/16));
 const bilQ=(x,y)=>{const X=(x-8)/16,Y=(y-8)/16,x0=clamp(Math.floor(X),0,W-2),y0=clamp(Math.floor(Y),0,H-2),u=clamp(X-x0,0,1),v=clamp(Y-y0,0,1);
  const a=RQ[y0*W+x0],b=RQ[y0*W+x0+1],c=RQ[(y0+1)*W+x0],d=RQ[(y0+1)*W+x0+1];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const hS=(a,b)=>vn(a,b,14,43)*.55+vn(a,b,42,44)*.45;
 const paint=(x,y)=>{const X=x,Y=y,tp=PT(X,Y),grain=.95+.08*hq(x,y)*hq(x+1,y>>1);let r,g,b;
  const rd=bilQ(X,Y)+(vn(X,Y,10,12)-.5)*.9;
  if(tp==0||tp==5){/* neve cinza-azulada em tufos, luz do alto à esquerda; 5 = pisada, com pegadas e terra */
   const v=vorC(X,Y,12,45),ddx=(X-v[3])/12,ddy=(Y-v[4])/12,gx=hS(X+3,Y)-hS(X-3,Y),gy=hS(X,Y+3)-hS(X,Y-3);
   const L=clamp(.62-(ddx+ddy)*.5+(1-v[2]/12)*.12-(gx+gy)*3,0,1);r=146+68*L;g=160+58*L;b=198+40*L;
   if(v[1]<1.1&&ddx+ddy>-.1){r*=.88;g*=.9;b*=.95}
   if(tp==5){const h=hq((x>>3)*3+1,(y>>3)*5+2);
    if(h<.35){const px=(x&7)-3.5+(h*8-1.4),py=(y&7)-3.5;if(px*px/4+py*py/9<1){r*=.84;g*=.86;b*=.9}}
    if(hq(x*5,y)<.006){r=96;g=86;b=88}}
   r*=grain;g*=grain;b*=grain;
   if(rd<1.9){const m=Math.min(1,(1.9-rd)/1.9*1.6);r*=1-m*.2;g*=1-m*.2;b*=1-m*.16}
   if(hq(x,y*3)<.004){r=236;g=240;b=252}}
  else if(tp==1){/* chão do bosque: terra escura com folhas mortas, gravetos e manchas de neve */
   const n=vn(X,Y,9,70)*.6+vn(X,Y,30,71)*.4;r=48+40*n;g=42+38*n;b=47+36*n;
   if(hq(x>>2,(y>>2)+7)<.2){const lx=(x&3)-1.5,ly=(y&3)-1.5;if(lx*lx+ly*ly<2.6){const k=hq(x>>2,(y>>2)+9);if(k<.4){r=118;g=66;b=46}else if(k<.75){r=96;g=58;b=44}else{r=140;g=96;b=58}}}
   const tw=hq(x>>3,(y>>3)+11);if(tw<.1){const dg=tw<.05?((x&7)==(y&7)):((x&7)==7-(y&7));if(dg){r=104;g=90;b=80}}
   const s=vn(X,Y,20,72)+(hq(x,y)-.5)*.08;if(s>.62){const k=clamp((s-.62)*8,0,1);r=r+(196-r)*k;g=g+(202-g)*k;b=b+(222-b)*k}
   r*=grain;g*=grain;b*=grain}
  else if(tp==2){/* trilha de terra congelada com pedrinhas e neve nas beiras */
   const n=vn(X,Y,8,73)*.6+vn(X,Y,26,74)*.4;r=60+34*n;g=53+31*n;b=56+28*n;
   const v=vorC(X,Y,6,75);if(hq(v[0],3)<.3&&v[2]<2.4){const L=clamp(.6-((X-v[3])+(Y-v[4]))*.25,0,1);r=96+50*L;g=92+48*L;b=98+52*L}
   if(rd>.9){const s=vn(X,Y,7,76);if(s>.55+(1.6-rd)*.3){r=192;g=198;b=220}}
   r*=grain;g*=grain;b*=grain}
  else if(tp==3){/* gelo escuro da lagoa: placas com rachaduras claras e brilhos */
   const vr=vor(X,Y,22,77),t=vn(X,Y,36,78);r=46+40*t;g=62+42*t;b=92+48*t;
   if(vr[1]<.7){r=176;g=192;b=224}else if(vr[1]<1.5){r+=10;g+=12;b+=14}
   if(Math.sin(X*.4+Y*.25+vn(X,Y,30,79)*5)>.97){r+=36;g+=38;b+=40}r*=grain;g*=grain;b*=grain}
  else{/* rocha cinza com neve no alto e musgo seco */
   const v=vorC(X,Y,18,53),ddx=(X-v[3])/18,ddy=(Y-v[4])/18,m=.88+.24*hq(v[0],5),L=clamp(.55-(ddx+ddy)*.6,0,1);
   r=(36+92*L)*m;g=(37+90*L)*m;b=(42+96*L)*m;
   if(v[1]<1.2){r=18;g=18;b=24}else if(ddy<-.16+(vn(X,Y,6,54)-.5)*.24){const k2=.86+.14*L;r=214*k2;g=220*k2;b=238*k2}
   else if(vn(X,Y,7,80)>.64){r=r*.6+38;g=g*.6+48;b=b*.6+22}
   r*=grain;g*=grain;b*=grain}
  if(tp!=4){let dd=99;for(let k=1;k<=8;k++){if(PT(X,Y-k)==4){dd=k;break}}if(dd<8){const kk=.7+.3*dd/8;r*=kk;g*=kk;b*=kk*1.03}}
  return [clamp(r,0,255)|0,clamp(g,0,255)|0,clamp(b,0,255)|0]};
 const [fc]=cmCv(FW,FH),fcx=fc.getContext('2d'),im=fcx.createImageData(FW,FH),Dd=im.data;
 for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){const c=paint(x,y),o=(y*FW+x)*4;Dd[o]=c[0];Dd[o+1]=c[1];Dd[o+2]=c[2];Dd[o+3]=255}
 fcx.putImageData(im,0,0);
 /* camada de cima do chão (ov): penas pretas caídas no chão */
 const [oc,,octx]=cmCv(FW,FH);
 const art=(n,flip)=>{const a=ART[n],[c,,q]=cmCv(a.width,a.height);if(flip){q.translate(a.width,0);q.scale(-1,1)}q.drawImage(a,0,0);return c};
 const ovArt=(n,cx,cy,flip)=>{const a=art(n,flip);octx.drawImage(a,Math.round(cx-a.width/2),Math.round(cy-a.height/2))};

 /* ===== colisão base e zonas ===== */
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const i=ty*W+tx;if(!F[i])S[i]=1;let z=0;
  if(ty>=40&&ty<100)z=2;if(ty>=100)z=1;
  if(EL(tx,ty,NIN[0],NIN[1],18,13)<1)z=3;if(EL(tx,ty,WELL[0],WELL[1],15,11)<1)z=4;if(EL(tx,ty,CAB[0],CAB[1],15,9)<1)z=6;if(EL(tx,ty,TREE[0],TREE[1]+3,20,12)<1)z=5;
  Z[i]=z}
 for(let x=0;x<W;x++){S[x]=1;if(x<PX0||x>PX1)S[(H-1)*W+x]=1}

 /* ===== objetos (arte da folha) ===== */
 const used=new Uint8Array(W*H);const res=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)used[y*W+x]=1};
 /* place: centro x e base y em px; bloqueia uma faixa no pé (fração da largura, linhas) */
 const place=(n,cx,by,bw,bh,flip,lb)=>{const c=art(n,flip);put(c,cx-c.width/2,by,lb);if(bw>0){const hw=c.width*bw/2;blk(Math.floor((cx-hw)/T),Math.floor((by-1)/T)-(bh-1),Math.floor((cx+hw-1)/T),Math.floor((by-1)/T))}
  res(Math.floor((cx-c.width/2)/T),Math.floor((by-c.height*.4)/T),Math.floor((cx+c.width/2)/T),Math.floor(by/T));return c};
 /* topo da peça (px) e ponto da folha -> ponto do mapa: (esquerda + ox, topo + oy) */
 const at=(n,cx,by,ox,oy)=>[Math.round(cx-ART[n].width/2)+ox,Math.round(by)-ART[n].height+oy];

 /* --- Árvore dos Corvos e o altar no pé --- */
 const TRX=TREE[0]*T+8,TRB=TREE[1]*T;
 place('ravtree',TRX,TRB,.3,2);
 for(let k=0;k<7;k++)fx.raven.push([TRX,TRB-150,90+hq(k,21)*60,30+hq(k,22)*24,hq(k,23)*6.28,.35+hq(k,24)*.3]);
 for(let k=0;k<6;k++)fx.feather.push([TRX-110+hq(k,25)*220,TRB-190+hq(k,26)*90,hq(k,27)*6.28]);
 const ALX=67*T,ALB=37*T;place('altar',ALX,ALB,.8,2);
 for(const [ox,oy] of[[18,56],[27,58],[69,50]]){const p=at('altar',ALX,ALB,ox,oy);fx.candle.push(p);dark.push([p[0],p[1],56,.9])}
 place('stake',62*T,34*T,.4,1);place('stake',89*T,33*T,.4,1,true);
 /* --- Poço Sagrado --- */
 const WX=WELL[0]*T+8,WB=(WELL[1]+1)*T;place('well',WX,WB,.85,3);
 for(const [ox,oy] of[[17,20],[89,20]]){const p=at('well',WX,WB,ox,oy);fx.rune.push(p);dark.push([p[0],p[1],40,.55])}
 place('stake',(WELL[0]-7)*T,(WELL[1]-1)*T,.4,1);place('stake',(WELL[0]+7)*T,(WELL[1]+2)*T,.4,1,true);
 place('mush2',(WELL[0]-6)*T,(WELL[1]+4)*T,0,0);place('grass1',(WELL[0]+6)*T,(WELL[1]-3)*T,0,0);
 /* --- Clareira do Guardião (sem cabana) --- */
 place('stake',(CAB[0]+1)*T,(CAB[1]-1)*T,.4,1,true);place('rocks_pile',(CAB[0]-3)*T,(CAB[1]-4)*T,.6,1);
 place('bench',(CAB[0]+2)*T,(CAB[1]+2)*T,.8,1);place('stake',(CAB[0]-8)*T,(CAB[1]+1)*T,.4,1);place('log',(CAB[0]+9)*T,(CAB[1]-1)*T,.7,1,true);
 place('stump',(CAB[0]-7)*T,(CAB[1]-3)*T,.6,1);
 /* --- Ninhal: árvores com ninho, ninhos no chão, corvos pousados e penas --- */
 for(const [x,y,f] of[[109,55,0],[126,58,1],[121,69,0],[111,68,1]])place('dtree_nest',x*T,y*T,.3,1,f);
 for(const [x,y] of[[116,58],[124,64],[113,62]])place('nest',x*T,y*T,.7,1);
 for(const [n,x,y,f] of[['crow1',118,60,0],['crow2',122,61,1],['crow1',114,65,1],['crow3',119,66,0],['crow2',111,59,0],['crow1',125,67,0]])place(n,x*T+(hq(x,y)*8|0),y*T,0,0,f);
 for(let k=0;k<26;k++){const x=NIN[0]-12+hq(k,31)*24,y=NIN[1]-8+hq(k,32)*16;if(TY[(y|0)*W+(x|0)]!=4)ovArt(hq(k,33)<.5?'feather1':'feather2',x*T,y*T,hq(k,34)<.5)}
 for(let k=0;k<10;k++){const x=TREE[0]-12+hq(k,35)*24,y=TREE[1]+2+hq(k,36)*7;if(TY[(y|0)*W+(x|0)]!=4&&RDD[(y|0)*W+(x|0)]>1.5)ovArt(hq(k,37)<.5?'feather1':'feather2',x*T,y*T,hq(k,38)<.5)}
 for(let k=0;k<5;k++)fx.feather.push([(NIN[0]-10+hq(k,39)*20)*T,(NIN[1]-10+hq(k,40)*10)*T,hq(k,41)*6.28]);
 place('skull',58*T,88*T,.5,1);
 /* --- Trilha do Passo: pinheiros mortos e pedras na entrada --- */
 place('dpine1',66*T,110*T,.25,1);place('dpine2',84*T,108*T,.25,1,true);place('rock_big',62*T,116*T,.7,2);place('rock_mid',88*T,115*T,.7,1);
 place('rock_tall',83*T,101*T,.6,1);place('dpine2',65*T,100*T,.25,1);

 /* --- enfeites espalhados: só onde é livre, longe das trilhas e das passagens --- */
 const nearRock=(x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const tx=x+i,ty=y+j;if(tx<0||ty<0||tx>=W||ty>=H||TY[ty*W+tx]==4)return true}return false};
 const free=(x,y,need)=>{if(x<2||y<2||x>=W-2||y>=H-2)return false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const k=(y+j)*W+x+i;if(!F[k]||S[k]||used[k]||TY[k]==3)return false;if(need>=0&&TY[k]!=need)return false}
  if(RDD[y*W+x]<3.2)return false;if(y>H-12&&x>PX0-8&&x<PX1+8)return false;return true};
 const spots=(n,sd,need,test=()=>true)=>{const L=[];for(let t=0;t<n*90&&L.length<n;t++){const x=2+hq(t,sd)*(W-4)|0,y=2+hq(sd,t)*(H-4)|0;if(!test(x,y)||!free(x,y,need))continue;res(x-1,y-2,x+1,y+1);L.push([x,y])}return L};
 const DT=['dtree1','dtree2','dtree3','dpine1','dpine2'];
 /* mata morta densa junto aos paredões (fecha as bordas) */
 for(const [x,y] of spots(70,101,-1,(x,y)=>nearRock(x,y,2)))place(DT[(hq(x,y)*5)|0],x*T+8,(y+1)*T,.25,1,hq(y,x)<.5);
 /* Bosque Branco: árvores mortas brancas */
 for(const [x,y] of spots(46,102,-1,(x,y)=>y>40&&y<100&&EL(x,y,NIN[0],NIN[1],16,12)>1&&EL(x,y,WELL[0],WELL[1],12,9)>1))place(DT[(hq(x,y)*3)|0],x*T+8,(y+1)*T,.25,1,hq(y,x)<.5);
 for(const [x,y] of spots(8,103,-1,(x,y)=>y>44&&y<100))place(hq(x,y)<.5?'log':'stump',x*T+8,(y+1)*T,.6,1,hq(y,x)<.5);
 for(const [x,y] of spots(14,104,-1,(x,y)=>nearRock(x,y,3)))place(['rock_big','rock_mid','rock_s','rocks_flat','rocks_pile','rock_tall','rock_low'][(hq(x,y)*7)|0],x*T+8,(y+1)*T,.6,1,hq(y,x)<.5);
 for(const [x,y] of spots(16,105,-1,(x,y)=>y>40))place(['bush1','bush2','thorn1','thorn2','root1','root2'][(hq(x,y)*6)|0],x*T+8,(y+1)*T,0,0,hq(y,x)<.5);
 for(const [x,y] of spots(14,106,-1))place(['grass1','grass2','mush1','mush2','mush3','pebble'][(hq(x,y)*6)|0],x*T+8,(y+1)*T,0,0,hq(y,x)<.5);
 for(const [x,y] of spots(14,108,-1,(x,y)=>y<=40&&EL(x,y,TREE[0],TREE[1],18,10)>1&&EL(x,y,CAB[0],CAB[1],14,8)>1))place(DT[(hq(x,y)*5)|0],x*T+8,(y+1)*T,.25,1,hq(y,x)<.5);
 /* névoa baixa e olhos no escuro */
 for(let k=0;k<70;k++){const x=6+hq(k,51)*(W-12)|0,y=42+hq(k,52)*60|0;if(F[y*W+x])fx.mist.push([x*T+8,y*T+8])}
 for(const [x,y] of spots(16,107,-1,(x,y)=>y>40&&y<104))fx.eyes.push([x*T+8,y*T-6,hq(x,y)*6.28]);
 fcx.drawImage(oc,0,0);
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=TY[i]*40;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
   zones:{names:zn,z:Z},
   /* saída sul: para o Passo de Hrimfjell (colunas 70-80; o Passo abre a mesma faixa na borda norte) */
   portals:{trig:[{k:'edge',m:'nh',y:24,dx:0}],cells:[70,71,72,73,74,75,76,77,78,79,80].flatMap(x=>[x,H-1,0])}}}
