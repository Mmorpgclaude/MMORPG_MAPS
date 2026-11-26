/* ---------- Acampamento dos Nômades (mapa 'nd') — a oeste de Al-Sahrah (dq), posição (-130, 640) ----------
   A tribo do deserto que vive do lado de fora dos muros da cidade: o Círculo das Tendas em volta da fogueira grande,
   o Poço da Tribo, o Mercado da Tribo e o Mirante nas dunas. A tribo é viva: tendas inteiras e
   coloridas, a tenda do chefe, varal, tear, mercado de especiarias e lanternas (folha Assets_Nomades do Ricardo). Sem animais (pedido do Ricardo): nada de bichos, de
   abutres nem de ossadas. Entrada só pelo leste (linhas 46-54), pelo portão oeste da muralha de Al-Sahrah.
   Feito sobre o exemplo do Deserto do kit (v10.23): o PINTOR DO CHÃO, o ds5b e o ajudante da arte são cópia exata
   (o shader nd_floor.gdshader é o dx_floor.gdshader sem mudança); mudam só a GRADE, as zonas, os objetos e as passagens.
   Objetos: a folha da tribo (Assets_Nomades) e peças prontas de exemplo_deserto/arte (folhas do Ricardo). 1 tile = 16 px. */
function nomadCamp(){
 const T=16,W=150,H=120,FW=W*T,FH=H*T;
 let [fc,f]=cmCv(FW,FH),P=ufP(f);const cx=fc.getContext('2d');
 const vn=(x,y,s,sd)=>{const X=x/s,Y=y/s,x0=Math.floor(X),y0=Math.floor(Y),fx=X-x0,fy=Y-y0,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),
  a=hq(x0+sd*131,y0),b=hq(x0+1+sd*131,y0),c=hq(x0+sd*131,y0+1),d=hq(x0+1+sd*131,y0+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
 const vor=(x,y,s,sd)=>{const gx=Math.floor(x/s),gy=Math.floor(y/s);let d1=1e9,d2=1e9,id=0;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx2=gx+i,cy2=gy+j,px=(cx2+.15+.7*hq(cx2+sd,cy2*7))*s,py=(cy2+.15+.7*hq(cx2*5,cy2+sd))*s,d=Math.hypot(x-px,y-py);
   if(d<d1){d2=d1;d1=d;id=cx2*7919+cy2}else if(d<d2)d2=d}return [id,(d2-d1)/2]};
 const SA=[[196,160,104],[210,176,118],[184,148,94],[222,190,132]],           /* areia */
  SS=['#5a3e22','#7a5632','#9a7244','#b88e58','#d4ac74','#ead0a0'],              /* arenito (escuro → claro) */
  RD=['#6a1e14','#8a2a1a','#b03a22'],TQ=['#0e4a4a','#16706a','#2aa098','#6ad0c4'],SF=['#8a5a10','#c08a1a','#e8b83a'],
  GD=['#5a4410','#8a6a1c','#c09a3a','#f0d27a'],WD=['#3a2414','#5a3a20','#7a5230','#9a6c40'],PL=['#1e3a14','#2e5a1e','#4a7a2a','#6a9a3a'];
 const RK=['#4a1c12','#6a2a1a','#8a3a22','#a8502e','#c06a3e','#d8875a'];
 const S=new Array(W*H).fill(0),ents=[],dark=[];
 const fx={flag:[],bird:[],devil:[],oasis:null,fire:[],gate:null};
 const put=(cv,x,ybase,lb)=>{const e={img:cv,x:Math.round(x),y:ybase,z:ybase-cv.height+2,sw:cv.width,sh:cv.height};if(lb)e.lb=lb;ents.push(e)};
 /* ===== grade de tiles ===== */
 const F=new Uint8Array(W*H).fill(1),M=new Uint8Array(W*H);
 const solid=(x,y,m)=>{if(x>=0&&y>=0&&x<W&&y<H){F[y*W+x]=0;M[y*W+x]=m}};
 const at=(x,y)=>x<0||y<0||x>=W||y>=H?0:F[y*W+x];
 const carve=(pts,r0,sd)=>{for(let k=0;k<pts.length-1;k++){const [ax,ay]=pts[k],[bx,by]=pts[k+1],n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);
  for(let s2=0;s2<=n;s2++){const x=ax+(bx-ax)*s2/n,y=ay+(by-ay)*s2/n,r=r0+vn(x*16,y*16,90,sd)*1.6;for(let j=Math.floor(y-r);j<=Math.ceil(y+r);j++)for(let i=Math.floor(x-r);i<=Math.ceil(x+r);i++)if(i>=0&&j>=0&&i<W&&j<H&&Math.hypot(i-x,j-y)<=r)F[j*W+i]=1}}};
 const clear=(x0,y0,r)=>{for(let j=Math.floor(y0-r);j<=Math.ceil(y0+r);j++)for(let i=Math.floor(x0-r);i<=Math.ceil(x0+r);i++)if(i>=0&&j>=0&&i<W&&j<H&&Math.hypot(i-x0,(j-y0)*1.2)<=r)F[j*W+i]=1};
 /* dunas altas pelo ruído (M=2). Não use rocha (M=1) com a cor 5b: ela vira mancha marrom; rochedos são peças da arte */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=vn(x*16,y*16,230,17)*.75+vn(x*16,y*16,70,23)*.25;if(d>.6)solid(x,y,2)}
 /* a estrada que vem do portão oeste de Al-Sahrah (leste) até o Círculo das Tendas, e os caminhos até as outras áreas */
 const RM=[[149,50],[134,52],[118,48],[100,53],[84,56],[74,57]];
 const CAMP=[60,58],WELL=[38,82],CART=[92,84],LOOK=[52,24];
 /* áreas de caça: campos grandes e quase vazios (só enfeite nas beiradas), para o jogo pôr as criaturas */
 const H1=[116,99,17],H2=[116,24,15],H3=[20,46,14];          /* [x, y, raio] Planície Escaldante, Vale das Areias Vermelhas, Campos do Vento */
 const GATE=[122,87],ARC=[112,12];                            /* entradas das cavernas (a base da peça): Templo Soterrado e Gruta do Arco */
 carve(RM,3,3);carve([[64,64],[52,72],[38,82]],2.6,4);carve([[78,60],[86,72],[92,84]],2.6,5);carve([[58,48],[54,36],[52,24]],2.4,6);
 carve([[118,48],[117,36],[116,24]],2.6,7);carve([[92,84],[104,92],[116,99]],2.6,8);carve([[44,58],[30,52],[20,46]],2.6,9);
 clear(CAMP[0],CAMP[1],18);clear(WELL[0],WELL[1],9);clear(CART[0],CART[1],11);clear(LOOK[0],LOOK[1],8);
 for(const h of[H1,H2,H3])clear(h[0],h[1],h[2]);
 /* bordas fechadas, menos a passagem leste (linhas 46-54) para Al-Sahrah */
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const pas=y>=46&&y<=54;if(x<3||(x>=W-3&&!pas)||y<3||y>=H-3)solid(x,y,2)}
 for(let y=46;y<=54;y++)for(let x=0;x<5;x++){F[y*W+W-1-x]=1}
 /* paredão de duna atrás das entradas das cavernas: a peça fica encostada nele e a porta fica no vão */
 for(let y=0;y<=ARC[1]-1;y++)for(let x=ARC[0]-14;x<=ARC[0]+14;x++){const e=Math.hypot((x-ARC[0]-.5)/11,(y-(ARC[1]-9))/9)+(vn(x*16,y*16,40,21)-.5)*.35;if(e<1)solid(x,y,2)}
 /* o Templo Soterrado: um monte de areia arredondado cobrindo o templo, com o portal saindo na frente */
 for(let y=GATE[1]-16;y<=GATE[1]-1;y++)for(let x=GATE[0]-14;x<=GATE[0]+14;x++){const e=Math.hypot((x-GATE[0])/12,(y-(GATE[1]-7))/7.5)+(vn(x*16,y*16,40,19)-.5)*.35;if(e<1)solid(x,y,2)}
 /* tira bolsões de chão sem ligação com a passagem leste */
 {const seen=new Uint8Array(W*H),q=[50*W+W-2];seen[q[0]]=1;while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(!seen[n]&&F[n]){seen[n]=1;q.push(n)}}}
  for(let i=0;i<W*H;i++)if(F[i]&&!seen[i])solid(i%W,(i/W)|0,2)}
 for(let i=0;i<W*H;i++)S[i]=F[i]?0:1;
 /* zonas */
 const zn=['Dunas do Oeste','Estrada de Al-Sahrah','Círculo das Tendas','Poço da Tribo','Mercado da Tribo','Mirante das Dunas',
  'Planície Escaldante','Vale das Areias Vermelhas','Campos do Vento','Entrada do Templo Soterrado','Gruta do Arco Vermelho'];
 const Z=new Array(W*H).fill(0);
 const RDD=new Float32Array(W*H).fill(99);{const pts=[];for(let k=0;k<RM.length-1;k++){const [ax,ay]=RM[k],[bx,by]=RM[k+1],n=Math.ceil(Math.hypot(bx-ax,by-ay)*2);for(let s2=0;s2<=n;s2++)pts.push([ax+(bx-ax)*s2/n,ay+(by-ay)*s2/n])}
  for(const [x,y] of pts)for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const tx=Math.round(x+i),ty=Math.round(y+j);if(tx<0||ty<0||tx>=W||ty>=H)continue;const dd=Math.hypot(tx+.5-x,ty+.5-y);if(dd<RDD[ty*W+tx])RDD[ty*W+tx]=dd}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=(a,r)=>Math.hypot(x-a[0],(y-a[1])*1.2)<r;let z=RDD[y*W+x]<4?1:0;
  if(d(CAMP,15))z=2;else if(d(WELL,10))z=3;else if(d(CART,12))z=4;else if(d(LOOK,9))z=5;else if(d(GATE,6))z=9;else if(d(ARC,6))z=10;else if(d(H1,H1[2]))z=6;else if(d(H2,H2[2]))z=7;else if(d(H3,H3[2]))z=8;Z[y*W+x]=z}
 const bil=(A,x,y)=>{const X=(x-8)/16,Y=(y-8)/16,x0=Math.max(0,Math.min(W-2,Math.floor(X))),y0=Math.max(0,Math.min(H-2,Math.floor(Y))),u=Math.max(0,Math.min(1,X-x0)),v=Math.max(0,Math.min(1,Y-y0));
  const a=A[y0*W+x0],b=A[y0*W+x0+1],c=A[(y0+1)*W+x0],d=A[(y0+1)*W+x0+1];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};

 /* ===== pintura por pixel ===== */
 const SOL=new Uint8Array(FW*FH),MAT=new Uint8Array(FW*FH);
 for(let y=0;y<FH;y++){for(let x=0;x<FW;x++){const tx=Math.min(W-1,x>>4),ty=Math.min(H-1,y>>4),p=y*FW+x;
  /* muralha: contorno reto; rocha e duna: contorno orgânico */
  const tm=M[ty*W+tx];if(!F[ty*W+tx]&&tm==3){SOL[p]=1;MAT[p]=3;continue}
  const X=(x-8)/16,Y=(y-8)/16,x0=Math.floor(X),y0=Math.floor(Y),u=X-x0,v=Y-y0;
  const a=at(x0,y0),b=at(x0+1,y0),c=at(x0,y0+1),d=at(x0+1,y0+1),fv=a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v+(vn(x,y,10,36)-.5)*.5;
  if(fv<.5){SOL[p]=1;const rx=Math.max(0,Math.min(W-1,Math.round(X+(vn(x,y,14,40)-.5)*1.8))),ry=Math.max(0,Math.min(H-1,Math.round(Y+(vn(x,y,14,41)-.5)*1.8)));let m=M[ry*W+rx]||M[ty*W+tx]||2;if(m==3)m=2;MAT[p]=m}}}
 const FD=new Uint8Array(FW*FH).fill(255);for(let x=0;x<FW;x++){let run=255;for(let y=FH-1;y>=0;y--){const p=y*FW+x;if(!SOL[p])run=0;else if(run<255)run++;FD[p]=run}}
 const sol=(x,y)=>x<0||y<0||x>=FW||y>=FH?1:SOL[y*FW+x];
 const hgt=(x,y)=>vn(x,y,170,7)*.65+vn(x,y,55,8)*.35;
 const C=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const RKc=RK.map(C),SSc=SS.map(C);
 const im=cx.createImageData(FW,FH),D=im.data;
 /* v10.23: passo final do chão do Deserto (cor 5b aprovada pelo Ricardo), idêntico a shaders/ds_post.gdshaderinc.
    modo 0 = não muda (mar), 1 = só a paleta, 2 = paleta + ondulações e manchinhas (areia andável) */
 const P5B=[[150,104,62],[198,146,90],[218,168,108],[232,186,122],[240,198,132],[246,210,144],[250,226,170]],L5B=[107.2,144.5,155.6,166.7,179.6,196.1];
 const ds5b=(r,g,b,x,y,md)=>{const R=Math.max(0,Math.min(255,r))|0,G=Math.max(0,Math.min(255,g))|0,B=Math.max(0,Math.min(255,b))|0;
  if(md==0||G>R+6||B>R)return [R,G,B];
  const L=R*.3+G*.55+B*.15;let v;if(L<=L5B[0])v=0;else if(L>=L5B[5])v=5;else{let k=0;while(L>L5B[k+1])k++;v=k+(L-L5B[k])/(L5B[k+1]-L5B[k])}
  let q=Math.floor(v+.5);
  if(md==2){const warp=vn(x,y,80,71)*16+vn(x,y,26,72)*5,ph=(x*.38+y*.92+warp)/22,f=ph-Math.floor(ph),amp=vn(x,y,64,73);
   if(amp>.4){if(f<.08)q=Math.min(q+1,6);else if(f<.2)q=Math.max(q-1,0)}
   const s=hq(x*3+11,y*5+7);if(s<.004)return [172,124,80];if(s>.996)return [252,236,190]}
  return P5B[q]};
 for(let y=0;y<FH;y++){const ty=y>>4;for(let x=0;x<FW;x++){const tx=x>>4,o=(y*FW+x)*4,p=y*FW+x;let r,g,b,md=1;
  const grain=.93+.14*hq(x,y)*hq(x+1,y>>1);
  if(SOL[p]){const m=MAT[p],fd=FD[p];
   if(m==1){const fh=26+vn(x,3,13,30)*16|0;
    if(fd>0&&fd<=fh){/* paredão de arenito vermelho em camadas */const v=fd/fh,lay=((y+vn(x,y,30,31)*8)/5|0)%6,cc=RKc[[2,3,1,4,2,3][lay]];let k=.62+.5*v+.1*hq(x,y);
      if(fh-fd<2)k*=1.3;if(fd<3)k*=.55;if(hq(x>>1,y)<.04)k*=.75;if(((x+(y>>2))%11)==0&&hq(x>>3,y>>2)<.5)k*=.82;r=cc[0]*k;g=cc[1]*k;b=cc[2]*k}
    else{/* topo do platô de rocha: mesas em degraus, fendas e areia acumulada */const hh=vn(x,y,90,42),ter=Math.floor(hh*5),fr2=hh*5-ter,n=vn(x,y,26,32)*.6+vn(x,y,7,33)*.4;
     let cc=[RKc[2],RKc[3],RKc[3],RKc[4],RKc[4]][ter];let k=grain*(.88+.12*n);if(fr2<.08)k*=.72;else if(fr2>.92)k*=1.12;
     const [vid,ve]=vor(x,y,56,43);if(hq(vid,9)<.3){if(ve<.9)k*=.7;else if(ve<1.8)k*=.9}
     {const sd2=vn(x,y,34,44)*.8+vn(x,y,9,46)*.2;if(sd2>.74){const t=Math.min(1,(sd2-.74)*8),tt2=vn(x,y,8,45);cc=[cc[0]+(200+20*tt2-cc[0])*t,cc[1]+(150+20*tt2-cc[1])*t,cc[2]+(100+14*tt2-cc[2])*t]}}
     if(hq(vid,5)<.12&&ve>4&&hq(x>>2,y>>2)<.03){cc=[90,110,50]}let e=0;for(let k2=1;k2<=4;k2++){if(!sol(x-k2,y)||!sol(x+k2,y)||!sol(x,y-k2)){e=k2;break}}if(e)k*=1+.5/e;
     r=cc[0]*k;g=cc[1]*k;b=cc[2]*k;if(hq(x,y*3)<.006){r=150;g=110;b=80}}}
   else if(m==3){const fh=36;
    if(fd>0&&fd<=fh){const row=((y)/6|0),bx=(x+(row&1)*8)%16;const cc=bx==0||y%6==0?SSc[1]:hq(x>>2,y>>1)<.5?SSc[3]:SSc[2];let k=.75+.35*(fd/fh);if(fd<3)k*=.6;r=cc[0]*k;g=cc[1]*k;b=cc[2]*k}
    else{const u=x%16,v=y%12;let cc=hq(x>>4,(y/12)|0)<.5?SSc[4]:SSc[3];let k=grain;if(u==0||v==0)cc=SSc[1];else if(u==1||v==1)k*=1.12;
     if((x%48)<2||(x%48)>45)cc=SSc[2];if(x%80<6){cc=SSc[5];if(x%80==5)cc=SSc[1]}r=cc[0]*k;g=cc[1]*k;b=cc[2]*k}}
   else{const fh=16+vn(x,5,17,37)*10|0;
    if(fd>0&&fd<=fh){/* encosta da duna alta */const v=fd/fh,rip=Math.sin((x*.45+y*1.1+vn(x,y,30,38)*10)*.6);let k=(.72+.36*v)*(.97+.03*rip)*grain;r=214*k;g=176*k;b=118*k;if(fd<3){r*=.75;g*=.75;b*=.78}}
    else{/* topo da duna: claro, com cristas iluminadas */const h=hgt(x,y),gx=hgt(x+5,y)-hgt(x-5,y),gy=hgt(x,y+5)-hgt(x,y-5),sh=-(gx+gy)*9;
     const rip=Math.sin((x*.35+y*.9+vn(x,y,40,2)*14)*.55);let k=(1.02+sh*.25)*(.96+.04*rip)*grain;r=226*k;g=190*k;b=132*k;
     let e=0;for(let k2=1;k2<=3;k2++){if(!sol(x-k2,y)||!sol(x+k2,y)||!sol(x,y-k2)){e=k2;break}}if(e){r*=1+.12/e;g*=1+.12/e;b*=1+.1/e}}}}
  else{/* chão */md=2;const z=Z[ty*W+tx];
   const h=hgt(x,y),gx=hgt(x+5,y)-hgt(x-5,y),gy=hgt(x,y+5)-hgt(x,y-5),sh=-(gx+gy)*9;
   const rip=Math.sin((x*.35+y*.9+vn(x,y,40,2)*14)*.55);
   let col;
   {const t=vn(x,y,60,4)*.6+h*.4;col=[192+34*t,156+36*t,100+34*t];let k=grain*(.95+.05*rip)*(1+sh*.18);r=col[0]*k;g=col[1]*k;b=col[2]*k;
    if(hq(x,y*3)<.008){r+=30;g+=26;b+=20}}
   /* estrada antiga de pedras (rota central e praça dos portões), meio coberta de areia */
   const rd=bil(RDD,x,y)+(vn(x,y,10,12)-.5)*.9,plaza=false;
   if((rd<2.1||plaza)&&vn(x,y,26,9)<(plaza?.78:.6)){md=1;const sw=plaza?28:16,shh=plaza?22:16,row=Math.floor(y/shh),off=(row&1)*(sw>>1),u=(x+off)%sw,v=y%shh,id=hq(Math.floor((x+off)/sw),row);
    let cc=[[200,166,114],[214,180,126],[188,154,102]][(id*3)|0],k=grain*(.95+.1*hq(id*99|0,3));if(u==0||v==0)cc=[136,104,68];else if(u==1||v==1)k*=1.1;else if(u==sw-1||v==shh-1)k*=.85;
    if(plaza&&Math.abs(y-50*T-8)<30&&((x>>4)%3==0)&&u>4&&v>4&&u<sw-4&&v<shh-4)cc=[42,150,140];
    r=cc[0]*k;g=cc[1]*k;b=cc[2]*k}
   /* sombra embaixo dos paredões e ao lado deles */
   let dd=99;for(let k2=1;k2<=14;k2++){if(sol(x,y-k2)){dd=Math.min(dd,k2-3);break}}for(let k2=1;k2<=6;k2++){if(sol(x-k2,y)||sol(x+k2,y)||sol(x,y+k2)){dd=Math.min(dd,k2+2);break}}
   if(dd<14){const k=.6+.4*Math.max(0,dd)/14;r*=k;g*=k;b*=k}}
  {const c5=ds5b(r,g,b,x,y,md);D[o]=c5[0];D[o+1]=c5[1];D[o+2]=c5[2];D[o+3]=255}}}
 cx.putImageData(im,0,0);
 /* daqui em diante, desenhos no chão vão para a camada de cima (ov) */
 const [oc,ofc]=cmCv(FW,FH);f=ofc;P=ufP(ofc);
 /* ===== objetos: a arte das folhas (pasta arte/) ===== */
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

 aRes(W-10,43,W-1,57);   /* passagem livre */
 const last=()=>ents[ents.length-1];
 /* fogueiras da folha da tribo: (ox, oy) = ponto da chama dentro da peça */
 const fire=(n,tx,ty,ox,oy,o={})=>{if(aNear(n,tx,ty,o)){const e=last(),x=e.x+ox,y=e.z-2+oy;fx.fire.push([x,y]);dark.push([x,y,110,1])}};
 const lamp=(tx,ty,o={})=>{if(aNear('lantern_post',tx,ty,Object.assign({m:0,bw:0},o))){const e=last();for(const [ox,oy] of[[28,14],[23,44]])dark.push([e.x+ox,e.z-2+oy,64,.8])}};
 const seat=(n,tx,ty)=>aNear(n,tx,ty,{walk:true,bw:0,fit:0,res:0,road:0,m:0});
 /* Círculo das Tendas: a tenda do chefe ao norte, o tapete dele estendido na frente (no chão), a fogueira grande no meio
    com almofadas e banquinhos em volta, as tendas da tribo em roda, estandartes, varal, tear e tapetes enrolados */
 const RUG=[CAMP[0],CAMP[1]-1];
 {const r=ART.chief_rug;oc.getContext('2d').drawImage(r,RUG[0]*T+8-(r.width>>1),RUG[1]*T+8-(r.height>>1));
  aRes(RUG[0]-4,RUG[1]-2,RUG[0]+4,RUG[1]+2)}
 aNear('tent',CAMP[0],CAMP[1]-5,{fit:1,br:2,road:0,res:0,m:0});
 fire('bigfire',CAMP[0],CAMP[1]+5,38,42,{road:0,res:0});
 for(const [n,dx,dy] of[['cushion_r',-4,5],['cushion_b',4,5],['cushion_y',-2,8],['stool_r',2,8],['stool_t',-4,7],['stool_b',4,7]])seat(n,CAMP[0]+dx,CAMP[1]+dy);
 for(const [n,dx,dy,fl] of[['tent',-15,1,0],['tent',15,1,1],['tent',-12,12,0],['tent',12,12,1],['tent',0,16,0]])aNear(n,CAMP[0]+dx,CAMP[1]+dy,{flip:!!fl,road:1,res:2,fit:1});
 aNear('tribe_banner',CAMP[0]-10,CAMP[1]-5,{m:0,bw:0,road:0});aNear('tribe_banner',CAMP[0]+10,CAMP[1]-5,{m:0,bw:0,road:0});
 aNear('tribe_flag',CAMP[0]+19,CAMP[1]-4,{m:0,bw:0,road:0});
 aNear('clothesline',CAMP[0]-20,CAMP[1]+6,{road:1});aNear('loom',CAMP[0]-8,CAMP[1]+18,{road:1});aNear('rugs',CAMP[0]+19,CAMP[1]+7,{road:1});
 lamp(CAMP[0]-6,CAMP[1]+2);lamp(CAMP[0]+6,CAMP[1]+2);
 aScat(['jar','jar','goods'],5,303,(x,y)=>Z[y*W+x]==2&&Math.hypot(x-CAMP[0],y-(CAMP[1]-4))>8,{fit:0,bw:0,road:1});
 /* Poço da Tribo: o poço com toldo, a fogueira pequena com o bule, o cavalete dos odres e a mesa baixa do chá */
 aNear('tribe_well',WELL[0],WELL[1],{fit:2,br:2});aNear('waterskins',WELL[0]+6,WELL[1]-1,{});
 fire('smallfire',WELL[0]-5,WELL[1]+3,21,26,{});aNear('teatable',WELL[0]+1,WELL[1]+5,{});
 seat('cushion_b',WELL[0]-1,WELL[1]+7);seat('cushion_r',WELL[0]+3,WELL[1]+7);
 aNear('cactus_m',WELL[0]-7,WELL[1]-4,{bw:0});aNear('cactus_barrel',WELL[0]+7,WELL[1]-5,{bw:0});
 /* Mercado da Tribo: a barraca de especiarias, os odres, potes, e as carroças que trazem as mercadorias */
 aNear('spice_stall',CART[0],CART[1]-4,{fit:2,br:2});aNear('waterskins',CART[0]+7,CART[1]-3,{flip:true});
 aNear('wagon',CART[0]-6,CART[1]+3,{m:0,fit:1});aNear('wagon',CART[0]+6,CART[1]+5,{m:0,fit:1,flip:true});
 aNear('goods',CART[0]-8,CART[1]-3,{});aNear('rugs',CART[0]+1,CART[1]+6,{});lamp(CART[0]-3,CART[1]-8);
 /* entradas das cavernas, encostadas no paredão: o vão escuro é pintado no ov; a porta são os tiles do vão */
 const og=oc.getContext('2d');
 const hole=(cx,by,w,h)=>{for(let k=0;k<6;k++){og.fillStyle='rgba(20,12,8,'+(.25+k*.13)+')';og.beginPath();og.ellipse(cx,by-h/2,w/2-k*2,h/2-k*2,0,0,Math.PI*2);og.fill()}};
 hole(GATE[0]*T+8,(GATE[1]+1)*T-6,56,70);aPut('ruin_gate',GATE[0],GATE[1],{bw:3,br:1,cols:[-3,-2,2,3],res:2});
 hole(ARC[0]*T+16,(ARC[1]+1)*T-6,60,64);aPut('rock_arch',ARC[0],ARC[1],Object.assign({res:2},ARCH));
 const doors=[{m:'ts',cells:[GATE[0]-1,GATE[1],GATE[0],GATE[1],GATE[0]+1,GATE[1]],x:60*T+8,y:85*T},
              {m:'ga',cells:[ARC[0],ARC[1],ARC[0]+1,ARC[1]],x:60*T+8,y:85*T}];
 aRes(GATE[0]-4,GATE[1],GATE[0]+4,GATE[1]+3);aRes(ARC[0]-4,ARC[1],ARC[0]+5,ARC[1]+3);
 aNear('lantern_post',GATE[0]-5,GATE[1]+1,{m:0,bw:0,road:0});aNear('lantern_post',GATE[0]+5,GATE[1]+1,{m:0,bw:0,road:0,flip:true});
 /* Mirante das Dunas */
 aNear('cairn',LOOK[0],LOOK[1],{fit:2});aNear('tribe_flag',LOOK[0]+3,LOOK[1]-1,{m:0,bw:0});aNear('rock_tall',LOOK[0]-6,LOOK[1]-2,{fit:3,br:2});
 /* estrada: marcos e a placa do portão */
 for(const x of[90,112,128])aNear('milestone',x,47,{bw:0});
 aNear('signpost',W-7,45,{m:0,lb:'Al-Sahrah',bw:1,road:0});aNear('lamppost',W-12,56,{m:0,bw:0,road:0});
 /* espalhados (sem animais nem ossadas; as plantas verdes e o capim alto NÃO entram) */
 const OPEN=(x,y)=>Z[y*W+x]<=1;
 const EDGE=(x,y)=>{for(const h of[H1,H2,H3]){const e=Math.hypot(x-h[0],(y-h[1])*1.2)/h[2];if(e<1)return e>.8}return false};
 aScat(['rock_s','rock_red','rock_red2','pebbles1','pebbles2','dry_bush','cactus_s'],22,320,EDGE,{bw:0});aScat(['rock_m','rock_tall'],4,321,EDGE,{fit:2,br:2,road:4});
 aScat(['rock_tall','rock_m','rock_big'],5,307,OPEN,{fit:3,br:2,road:5,res:2});aScat(ROCKS_S,24,308,OPEN,{bw:0});aScat(DRY,32,309,OPEN,{bw:0,walk:true,fit:0});
 aScat(['cactus_s','cactus_m','cactus_barrel','cactus_flower'],12,311,OPEN,{bw:0});aScat(['dead_tree'],5,312,OPEN,{bw:1});
 /* efeitos (fx_nd.gd): redemoinhos de poeira e o fogo das fogueiras (sem abutres: nada de animais) */
 for(let k=0;k<4;k++)fx.devil.push([(20+hq(k,5)*110)*T,(15+hq(k,6)*90)*T,30+hq(k,7)*60,hq(k,8)*6.28]);
 cx.drawImage(oc,0,0);
 const genD=(()=>{const [dc]=cmCv(W,H),dx=dc.getContext('2d'),id=dx.createImageData(W,H);for(let i=0;i<W*H;i++){id.data[i*4]=F[i]?255:0;id.data[i*4+1]=Math.min(255,Math.round(RDD[i]*10));id.data[i*4+2]=(M[i]&15)+Z[i]*16;id.data[i*4+3]=255}dx.putImageData(id,0,0);return dc.toDataURL('image/png')})();
 return {gen:{data:genD,ov:oc.toDataURL('image/png')},W,H,floor:fc.toDataURL('image/png'),S,ents:ents.map(e=>({x:e.x,y:e.y,z:e.z,sw:e.sw,sh:e.sh,lb:e.lb,url:e.img.toDataURL('image/png')})),fx,dark,
  zones:{names:zn,z:Z},
  /* passagem: leste (linhas 46-54) para Al-Sahrah, pelo portão oeste da muralha; sem deslocamento */
  portals:{trig:[{k:'edge',m:'dq',x:24,dy:0}],cells:[46,47,48,49,50,51,52,53,54].flatMap(y=>[W-1,y,0])},
  /* portas das cavernas (lugares de dentro): tiles da porta, mapa de destino e onde chega lá dentro (px) */
  doors}}
