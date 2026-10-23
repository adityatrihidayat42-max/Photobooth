// Deteksi area foto kosong pada gambar bingkai, lalu lubangi (alpha=0) supaya foto tampak dari belakang.
const MAXW=900;
function integral(m,W,H){const s=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let r=0;for(let x=0;x<W;x++){r+=m[y*W+x];s[(y+1)*(W+1)+x+1]=s[y*(W+1)+x+1]+r}}return s}
function win(s,W,H,x0,y0,x1,y1){return s[y1*(W+1)+x1]-s[y0*(W+1)+x1]-s[y1*(W+1)+x0]+s[y0*(W+1)+x0]}
// opening 9x9: erode (semua piksel jendela true) lalu dilate
function open(m,W,H,r=4){
 const s=integral(m,W,H),e=new Uint8Array(W*H);
 for(let y=r;y<H-r;y++)for(let x=r;x<W-r;x++)if(win(s,W,H,x-r,y-r,x+r+1,y+r+1)===(2*r+1)**2)e[y*W+x]=1;
 const s2=integral(e,W,H),o=new Uint8Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const a=Math.max(0,x-r),b=Math.max(0,y-r),c=Math.min(W,x+r+1),d=Math.min(H,y+r+1);if(win(s2,W,H,a,b,c,d)>0)o[y*W+x]=1}
 return o}
function label(m,W,H){
 const lab=new Int32Array(W*H),comps=[];let n=0;const st=[];
 for(let i=0;i<W*H;i++){if(!m[i]||lab[i])continue;n++;let x0=W,y0=H,x1=0,y1=0,a=0;st.push(i);lab[i]=n;
  while(st.length){const p=st.pop(),x=p%W,y=(p-x)/W;a++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
   if(x>0&&m[p-1]&&!lab[p-1]){lab[p-1]=n;st.push(p-1)}if(x<W-1&&m[p+1]&&!lab[p+1]){lab[p+1]=n;st.push(p+1)}
   if(y>0&&m[p-W]&&!lab[p-W]){lab[p-W]=n;st.push(p-W)}if(y<H-1&&m[p+W]&&!lab[p+W]){lab[p+W]=n;st.push(p+W)}}
  comps.push({id:n,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,a})}
 return {lab,comps}}
function find(d,W,H,test){
 const m=new Uint8Array(W*H);for(let i=0;i<W*H;i++)if(test(d[i*4],d[i*4+1],d[i*4+2]))m[i]=1;
 const {lab,comps}=label(open(m,W,H),W,H);
 const s=comps.filter(c=>c.a>0.015*W*H&&c.w<W*0.9&&c.h<H*0.9&&c.a/(c.w*c.h)>0.7);
 s.sort((a,b)=>a.y-b.y||a.x-b.x);return {lab,s}}
// d = RGBA Uint8ClampedArray. Mengembalikan {rects, hole:Uint8Array} atau null
export function detectSlots(d,W,H){
 const A=find(d,W,H,(r,g,b)=>Math.min(r,g,b)>238),B=find(d,W,H,(r,g,b)=>Math.max(r,g,b)<30);
 const R=B.s.length>A.s.length?B:A;if(!R.s.length)return null;
 const hole=new Uint8Array(W*H),rects=[];
 for(const c of R.s){rects.push([c.x,c.y,c.w,c.h]);
  for(let y=Math.max(0,c.y-3);y<Math.min(H,c.y+c.h+3);y++)for(let x=Math.max(0,c.x-3);x<Math.min(W,c.x+c.w+3);x++){
   // dilasi 3px dari komponen: cukup cek tetangga berlabel
   let ok=false;for(let dy=-3;dy<=3&&!ok;dy++)for(let dx=-3;dx<=3;dx++){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<H&&xx>=0&&xx<W&&R.lab[yy*W+xx]===c.id){ok=true;break}}
   if(ok)hole[y*W+x]=1}}
 return {rects,hole}}
// Proses File gambar -> objek bingkai {img(dataURL),W,H,rects} atau null
export async function buildFrame(file){
 const bm=await createImageBitmap(file),k=Math.min(1,MAXW/bm.width),W=Math.round(bm.width*k),H=Math.round(bm.height*k);
 const cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d",{willReadFrequently:true});x.drawImage(bm,0,0,W,H);
 const im=x.getImageData(0,0,W,H),r=detectSlots(im.data,W,H);if(!r)return null;
 for(let i=0;i<W*H;i++)if(r.hole[i])im.data[i*4+3]=0;x.putImageData(im,0,0);
 return {img:cv.toDataURL("image/webp",.9),W,H,rects:r.rects}}
