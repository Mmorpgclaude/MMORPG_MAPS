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
