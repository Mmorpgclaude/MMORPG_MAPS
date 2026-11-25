/* Kit de mapas do Valdória — funções base que o gerador de mapa pode usar (as MESMAS do jogo).
   O preview.py carrega este arquivo na página antes do gerador. Não mude nada aqui: o shader do jogo depende do hq idêntico. */

/* sorteio por hash inteiro (idêntico ao do shader: shaders gen_common.gdshaderinc). NUNCA use Math.random. */
const hq=(a,b)=>{let h=Math.imul(a,374761393)+Math.imul(b,668265263);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};

/* canvas novo */
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};

/* canvas de desenho: devolve [canvas, f(cor,x,y,w,h) que pinta um retângulo, contexto 2d] */
function cmCv(w,h){const c=mk(w,h),q=c.getContext('2d'),f=(a,x,y,ww,hh)=>{q.fillStyle=a;q.fillRect(x,y,ww,hh)};c.sw=w;c.sh=h;return[c,f,q]}

/* ajudantes de desenho em pixel sobre um f(cor,x,y,w,h): elipse cheia, polígono cheio e linha */
function ufP(f){return{
 ell:(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y/ry)**2)));f(c,cx-w,cy+y,w*2+1,1)}},
 poly:(pts,c)=>{let y0=1e9,y1=-1e9;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
  for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){const xs=[],yy=y+.5;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
    if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
   xs.sort((p,q)=>p-q);for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)f(c,xa,y,xb-xa,1)}}},
 line:(x0,y0,x1,y1,c,w=1)=>{const n=Math.max(1,Math.round(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));for(let i=0;i<=n;i++)f(c,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w)}}}

window.KIT_OK=1;
