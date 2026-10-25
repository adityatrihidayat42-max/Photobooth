import {useEffect,useRef,useState} from "react";
import {motion} from "framer-motion";
import I from "./Icon.jsx";
import {FRAMES} from "./lib/frames";
import {buildFrame} from "./lib/detect";
import {compose} from "./lib/compose";

const Link=({href,children,...p})=><a href={"#"+href} {...p}>{children}</a>;
const STEPS=["Foto","Bingkai","Hasil"],Q={Tinggi:.95,Sedang:.8,Hemat:.6};
const btn="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition active:scale-95 disabled:opacity-40 ";
const pri=btn+"bg-pb text-white shadow-md",sec=btn+"border-2 border-ink bg-white",dark=btn+"bg-navy text-white";
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"bingkai";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const toBlob=(c,m,q)=>new Promise((r,j)=>c.toBlob(b=>b?r(b):j(new Error("blob")),m,q));
// true jika gambar hampir seluruhnya hitam (mis. kamera belum siap / PNG transparan)
function blank(c){const x=c.getContext("2d"),n=24;let m=0;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const d=x.getImageData(Math.floor((i+.5)*c.width/n),Math.floor((j+.5)*c.height/n),1,1).data;m=Math.max(m,d[0]+d[1]+d[2])}
 return m<24}
// gambar ke kanvas dengan latar putih (PNG/WebP transparan tidak jadi hitam saat jadi JPEG)
function draw(src,w,h){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,w,h);x.drawImage(src,0,0,w,h);return c}
async function viaImg(file){const u=URL.createObjectURL(file);try{
 const im=await new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>j(new Error("x"));i.src=u});
 const k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight));return draw(im,Math.round(im.naturalWidth*k),Math.round(im.naturalHeight*k))}finally{URL.revokeObjectURL(u)}}
// baca foto (hormati orientasi EXIF), kecilkan max 1600px; coba jalur cadangan jika hasil hitam
async function shrink(file){let c=null;
 try{let bm;try{bm=await createImageBitmap(file,{imageOrientation:"from-image"})}catch{bm=await createImageBitmap(file)}
  const k=Math.min(1,1600/Math.max(bm.width,bm.height));c=draw(bm,Math.round(bm.width*k),Math.round(bm.height*k));bm.close?.()}catch{c=null}
 if(!c||blank(c)){try{c=await viaImg(file)}catch{if(!c)throw new Error("rusak")}}
 return {url:c.toDataURL("image/jpeg",.92),blank:blank(c)}}
const Thumb=({src,alt,className})=>{const [bad,setBad]=useState(false);
 return bad?<div role="img" aria-label={alt+" gagal dimuat"} className={className+" grid place-items-center bg-gray-200 p-1 text-center text-[10px] font-bold"}>Gagal dimuat, pilih ulang</div>
  :<img src={src} alt={alt} onError={()=>setBad(true)} onLoad={e=>{if(!e.target.naturalWidth)setBad(true)}} className={className}/>};
const MiniFrame=({f})=>f.img?<img src={f.img} alt={`Bingkai ${f.name}`} loading="lazy" className="aspect-[3/4] w-full rounded bg-gray-100 object-contain"/>
 :<div aria-hidden="true" style={{background:f.bg}} className="flex aspect-[3/4] flex-col justify-center gap-1.5 rounded border-2 border-ink p-3">{Array.from({length:f.slots}).map((_,i)=><div key={i} className="min-h-0 flex-1 rounded-sm bg-white/90"/>)}</div>;
const SlotRow=({n,photos})=>photos.length?(<div className="mt-3"><div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-70">Isi slot · {Math.min(photos.length,n)} dari {n} slot punya foto sendiri</div>
 <ul className="flex flex-wrap gap-2">{Array.from({length:n}).map((_,k)=><li key={k} className="relative w-16 shrink-0"><Thumb src={photos[k%photos.length]} alt={`Slot ${k+1}`} className="aspect-square w-full rounded object-cover"/>
  <span className="absolute inset-x-0 bottom-0 rounded-b bg-black/70 text-center text-[10px] font-bold text-white">{k<photos.length?`Slot ${k+1}`:"↻ diulang"}</span></li>)}</ul></div>):null;
const Prev=({f,photos})=>{const [u,setU]=useState(null);
 useEffect(()=>{let dead=false;const c=document.createElement("canvas");
  compose(c,f,photos,.5).then(()=>{if(!dead)setU(c.toDataURL("image/jpeg",.7))}).catch(()=>{});return()=>{dead=true}},[f.id,photos]);
 return u?<img src={u} alt={`Bingkai ${f.name}`} className="aspect-[3/5] w-full rounded bg-gray-100 object-contain"/>:<div className="aspect-[3/5] w-full animate-pulse rounded bg-gray-200"/>};
const Seg=({label,opts,val,set,dis})=>(<div className="mt-3"><div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-70">{label}</div>
 <div role="radiogroup" aria-label={label} className="grid grid-flow-col auto-cols-fr gap-2">{opts.map(([v,t])=>
  <button key={v} role="radio" aria-checked={val===v} disabled={dis} onClick={()=>set(v)} className={`min-h-11 rounded-lg border-2 border-ink px-2 text-sm font-bold disabled:opacity-60 ${val===v?"bg-navy text-white":"bg-white"}`}>{val===v&&<I n="check" className="mr-1 inline h-4 w-4"/>}{t}</button>)}</div></div>);

export default function Studio(){
 const [step,setStep]=useState(1),[photos,setPhotos]=useState([]),[want,setWant]=useState(null),[fid,setFid]=useState(FRAMES[0].id),[cat,setCat]=useState("Semua"),[cam,setCam]=useState(false);
 const [err,setErr]=useState(""),[note,setNote]=useState(""),[facing,setFacing]=useState("user"),[count,setCount]=useState(0),[busy,setBusy]=useState(false),[camReady,setCamReady]=useState(false);
 const [fmt,setFmt]=useState("png"),[qual,setQual]=useState("Tinggi"),[scale,setScale]=useState(1),[exporting,setExporting]=useState(false),[rendering,setRendering]=useState(false),[downloaded,setDownloaded]=useState(false),[dims,setDims]=useState([0,0]);
 const vid=useRef(null),cv=useRef(null),st=useRef(null);
 const [custom,setCustom]=useState(()=>{try{return JSON.parse(localStorage.getItem("pb_frames")||"[]")}catch{return[]}});
 const all=[...FRAMES,...custom],frame=all.find(f=>f.id===fid)||FRAMES[0],cats=["Semua",...new Set(all.filter(f=>f.slots===want).map(f=>f.cat))];
 const short=photos.length>0&&photos.length<frame.slots;
 const max=want||4,need=Math.max(0,max-photos.length);
 useEffect(()=>{if(want&&frame.slots!==want){const f=all.find(z=>z.slots===want);if(f)setFid(f.id)}},[want,custom]);

 useEffect(()=>{try{localStorage.setItem("pb_frames",JSON.stringify(custom))}catch{setErr("Penyimpanan penuh: bingkai hanya tersedia sampai halaman ditutup.")}},[custom]);
 useEffect(()=>{const q=new URLSearchParams(location.hash.split("?")[1]||"").get("frame");if(q){setFid(q);const fr=[...FRAMES,...custom].find(z=>z.id===q);if(fr)setWant(fr.slots)}return()=>st.current?.getTracks().forEach(t=>t.stop())},[]);
 // pratinjau: selalu dari state foto + bingkai yang sedang aktif
 useEffect(()=>{if(step!==3||!photos.length)return;let dead=false;setRendering(true);
  compose(cv.current,frame,photos).then(()=>{if(dead)return;setDims([cv.current.width,cv.current.height]);setRendering(false);setDownloaded(false)})
   .catch(()=>{if(!dead){setRendering(false);setErr("Pratinjau gagal dibuat. Coba pilih ulang foto atau bingkai.")}});return()=>{dead=true}},[step,fid,photos,custom]);
 useEffect(()=>{if(step!==3||downloaded||!photos.length)return;const h=e=>{e.preventDefault();e.returnValue=""};addEventListener("beforeunload",h);return()=>removeEventListener("beforeunload",h)},[step,downloaded,photos]);
 useEffect(()=>{if(step!==1&&st.current){st.current.getTracks().forEach(k=>k.stop());st.current=null;setCam(false);setCamReady(false)}},[step]);
 useEffect(()=>{if(cam&&vid.current&&st.current)vid.current.srcObject=st.current},[cam,step,facing]);

 const add=a=>setPhotos(p=>[...p,...a].slice(0,want||4));
 function go(n){setErr("");setNote("");if(n>1){if(!want){setErr("Pilih jumlah foto dulu.");return}if(photos.length<want){setErr(`Ambil ${want-photos.length} foto lagi (butuh ${want} foto).`);return}}setStep(n)}
 function chooseWant(n){setWant(n);setPhotos(p=>p.slice(0,n));setCat("Semua");setErr("");setNote("")}
 async function addFrames(e){setErr("");const files=[...e.target.files];e.target.value="";const out=[];
  for(const [i,f] of files.entries()){try{const b=await buildFrame(f);
   if(!b){setErr(`Area foto kosong tidak ditemukan pada "${f.name}".`);continue}
   out.push({...b,id:"c"+Date.now()+i,name:f.name.replace(/\.[^.]+$/,"").slice(0,18),cat:"Bingkai Saya",slots:b.rects.length,custom:true})}
   catch{setErr("Gambar bingkai tidak bisa dibaca.")}}
  if(out.length){setCustom(c=>[...c,...out]);const m=out.find(z=>z.slots===want);if(m){setFid(m.id);setCat("Bingkai Saya")}setNote(out.map(z=>`${z.name} (${z.slots} foto)`).join(", ")+" ditambahkan. Bingkai hanya muncul sesuai jumlah foto yang dipilih.")}}
 async function startCam(face=facing){setErr("");
  if(!navigator.mediaDevices?.getUserMedia){setErr("Kamera hanya bisa dipakai lewat localhost atau HTTPS. Buka alamat localhost:5173, bukan alamat IP.");return}
  try{st.current?.getTracks().forEach(k=>k.stop());
   const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:face},audio:false});
   st.current=s;setCamReady(false);setFacing(face);setCam(true)
  }catch(e){setErr(e.name==="NotAllowedError"?"Izin kamera ditolak. Aktifkan izin kamera untuk situs ini di Chrome, atau pakai tombol Kamera HP / galeri.":e.name==="NotReadableError"?"Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu lalu coba lagi.":"Kamera tidak bisa dibuka. Coba tombol Kamera HP atau unggah dari galeri.")}}
 function snap(){const v=vid.current;
  if(!v||v.readyState<2||!v.videoWidth){setErr("Kamera belum siap. Tunggu sampai gambar kamera muncul, lalu coba lagi.");return false}
  const c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);
  if(facing==="user"){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(v,0,0);
  if(blank(c)){setErr("Foto tampak hitam. Pastikan kamera tidak tertutup dan sudah menampilkan gambar, lalu coba lagi.");return false}
  setErr("");add([c.toDataURL("image/jpeg",.92)]);return true}
 async function auto(){setBusy(true);const n=max-photos.length;for(let i=0;i<n;i++){for(let c=3;c>0;c--){setCount(c);await sleep(1000)}setCount(0);if(!snap())break;await sleep(500)}setCount(0);setBusy(false)}
 async function pick(e){setErr("");setNote("");const files=[...e.target.files];e.target.value="";const out=[];
  for(const f of files){
   if(!f.size){setErr(`File "${f.name}" kosong.`);continue}
   if(!/^image\/(jpeg|png|webp)$/.test(f.type)){setErr("Format harus JPG, PNG, atau WebP.");continue}
   if(f.size>10e6){setErr("Ukuran foto maksimal 10 MB. Pilih foto yang lebih kecil.");continue}
   try{const r=await shrink(f);out.push(r.url);if(r.blank)setErr(`Foto "${f.name}" tampak hitam. Jika bukan foto gelap, pilih foto lain.`)}catch{setErr(`Foto "${f.name}" rusak atau tidak bisa dibaca.`)}}
  if(out.length){add(out);setNote(photos.length+out.length>4?"Maksimal 4 foto; kelebihannya diabaikan.":`${out.length} foto ditambahkan.`)}}
 async function render(s){const c=document.createElement("canvas");await compose(c,frame,photos,s);return c}
 async function exportImg(){if(exporting||rendering)return;setExporting(true);setErr("");setNote("Memproses…");
  try{const c=await render(scale),mime=fmt==="png"?"image/png":"image/jpeg",blob=await toBlob(c,mime,Q[qual]);
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`photobooth-${slug(frame.name)}.${fmt==="png"?"png":"jpg"}`;
   document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
   setDownloaded(true);setNote(`Unduhan dimulai: ${a.download} (${c.width}×${c.height} px, ${Math.round(blob.size/1024)} KB). Cek notifikasi Chrome atau folder Download.`)
  }catch{setNote("");setErr("Gagal membuat file. Coba ukuran 1× atau format lain.")}
  setExporting(false)}
 async function copyPng(){setErr("");try{const blob=await toBlob(await render(1),"image/png");await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]);setNote("Gambar PNG disalin ke clipboard.")}
  catch{setErr("Browser ini belum mendukung salin gambar. Gunakan tombol Unduh.")}}
 function reset(){if(photos.length&&!confirm("Hapus semua foto dan mulai dari awal?"))return;setPhotos([]);setDownloaded(false);setNote("");setErr("");setStep(1)}
 const list=all.filter(f=>f.slots===want&&(cat==="Semua"||f.cat===cat));
 const Short=()=>short?<p className="mt-3 rounded-lg bg-yellow-100 p-3 text-sm">Bingkai ini punya {frame.slots} slot, tapi kamu baru punya {photos.length} foto, jadi foto akan diulang. <button onClick={()=>setStep(1)} className="font-bold underline">Tambah foto</button></p>:null;

 return(<main className="mx-auto max-w-3xl px-4 py-5 pb-8 lg:max-w-5xl">
  <div className="flex items-center justify-between gap-2"><Link href="/" className="inline-flex min-h-11 items-center gap-1 font-display text-xl"><I n="chevron-left" className="h-6 w-6"/> BERANDA</Link>
   <nav aria-label="Langkah" className="flex gap-1">{STEPS.map((t,i)=><button key={t} onClick={()=>go(i+1)} aria-current={step===i+1?"step":undefined} className={`min-h-11 rounded-full px-3 text-xs font-bold ${step===i+1?"bg-pb text-white":"bg-navy/10"}`}>{i+1} {t}</button>)}</nav></div>
  <div aria-live="polite" role="status">{note&&<p className="mt-3 rounded-lg bg-green-100 p-3 text-sm text-green-900">{note}</p>}</div>
  {err&&<p role="alert" className="mt-3 rounded-lg bg-red-100 p-3 text-sm text-red-800"><I n="triangle-alert" className="mr-2 inline h-4 w-4 align-[-2px]"/>{err}</p>}

  {step===1&&!want&&<section className="mt-4"><p className="text-sm font-semibold">Langkah 1 · Pilih jumlah foto dulu. Setelah itu kamu memilih bingkai yang cocok.</p>
   <ul className="mt-3 grid grid-cols-2 gap-3">{[1,2,3,4].map(n=><li key={n}><button onClick={()=>chooseWant(n)} className="w-full rounded-xl bg-white p-4 shadow transition active:scale-95">
    <div aria-hidden="true" className="mx-auto flex h-24 w-14 flex-col gap-1 rounded border-2 border-ink bg-navy p-1">{Array.from({length:n}).map((_,i)=><div key={i} className="flex-1 rounded-sm bg-white"/>)}</div>
    <div className="mt-3 text-center text-lg font-bold">{n} foto</div><div className="text-center text-xs opacity-70">{all.filter(z=>z.slots===n).length} bingkai</div></button></li>)}</ul></section>}
  {step===1&&want&&<motion.section initial={{opacity:0}} animate={{opacity:1}} className="mt-4 space-y-4">
   <p className="text-sm font-semibold">Langkah 1 · Ambil atau pilih {want} foto. <button onClick={()=>setWant(null)} className="ml-1 min-h-11 underline">Ubah jumlah</button></p>
   <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-4 border-ink bg-navy">
    {cam?<video ref={vid} autoPlay playsInline muted onPlaying={()=>setCamReady(true)} aria-label="Pratinjau kamera" className={`h-full w-full object-cover ${facing==="user"?"-scale-x-100":""}`}/>:<div className="grid h-full place-items-center p-4 text-center text-white">Mulai kamera atau pilih foto dari perangkat</div>}
    {cam&&!camReady&&<div className="absolute inset-0 grid place-items-center bg-navy/80 font-bold text-white">Menyalakan kamera…</div>}
    {count>0&&<div aria-hidden="true" className="absolute inset-0 grid place-items-center font-display text-9xl text-white [-webkit-text-stroke:3px_#14267a]">{count}</div>}</div>
   <div className="flex flex-wrap gap-3">
    {!cam?<button onClick={()=>startCam()} className={pri}><I n="camera" className="h-5 w-5"/> Mulai Kamera</button>:<>
     <button onClick={()=>snap()} disabled={busy||!camReady||need===0} className={pri}>Ambil Foto</button>
     <button onClick={auto} disabled={busy||!camReady||need===0} className={dark}><I n="timer" className="h-5 w-5"/> Otomatis 3-2-1</button>
     <button onClick={()=>startCam(facing==="user"?"environment":"user")} disabled={busy} className={sec}><I n="switch-camera" className="h-5 w-5"/> Ganti Kamera</button></>}
    <label className={sec+"inline-flex cursor-pointer items-center"}><I n="smartphone" className="mr-2 h-5 w-5"/>Kamera HP<input type="file" accept="image/*" capture="user" onChange={pick} className="sr-only"/></label>
    <label className={sec+"inline-flex cursor-pointer items-center"}><I n="images" className="mr-2 h-5 w-5"/>Pilih dari Galeri<input type="file" accept="image/*" multiple onChange={pick} className="sr-only"/></label></div>
   <p className="text-sm"><b>Mulai Kamera</b>: foto langsung di halaman ini · <b>Kamera HP</b>: buka aplikasi kamera bawaan · <b>Galeri</b>: pilih foto yang sudah ada.</p>
   <p className="text-sm font-semibold">{photos.length} dari {want} foto{need>0?` · kurang ${need} foto`:" · siap pilih bingkai"} · <I n="lock" className="inline h-4 w-4 align-[-2px]"/> diproses di perangkatmu</p>
   <ul className="grid grid-cols-4 gap-2">{photos.map((p,i)=><li key={i} className="relative"><Thumb src={p} alt={`Foto ${i+1}`} className="aspect-square w-full rounded object-cover"/>
    <button aria-label={`Hapus foto ${i+1}`} onClick={()=>setPhotos(photos.filter((_,j)=>j!==i))} className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-pb text-white"><I n="x" className="h-4 w-4"/></button></li>)}</ul>
   <button disabled={need>0} onClick={()=>go(2)} className={dark+"w-full"}>{need>0?`Ambil ${need} foto lagi`:<>Lanjut Pilih Bingkai<I n="chevron-right" className="h-5 w-5"/></>}</button></motion.section>}

  {step===2&&<section className="mt-4">
   <p className="mb-2 text-sm font-semibold">Langkah 2 · Pilih bingkai untuk {want} foto.</p>
   <div className="flex gap-2 overflow-x-auto pb-2">{cats.map(c=><button key={c} onClick={()=>setCat(c)} aria-pressed={cat===c} className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold ${cat===c?"bg-navy text-white":"bg-white"}`}>{c}</button>)}</div>
   <label className="mt-2 inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 border-dashed border-ink px-4 text-sm font-bold"><I n="plus" className="mr-2 h-5 w-5"/>Tambah bingkai dari galeri<input type="file" accept="image/*" multiple onChange={addFrames} className="sr-only"/></label>
   <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">{list.map(f=><li key={f.id}><div className={`rounded-xl bg-white p-3 shadow ${fid===f.id?"ring-4 ring-pb":""}`}>
    <button onClick={()=>setFid(f.id)} aria-pressed={fid===f.id} className="block w-full text-left">
     <Prev f={f} photos={photos}/>
     <div className="mt-2 text-sm font-bold">{fid===f.id&&<I n="check" className="mr-1 inline h-4 w-4 text-pb"/>}{f.name}<div className="text-xs font-normal opacity-70">{f.cat} · {f.slots} foto</div></div></button>
    {f.custom&&<button onClick={()=>setCustom(custom.filter(c=>c.id!==f.id))} className="mt-1 min-h-11 text-xs font-semibold text-red-700 underline">Hapus bingkai</button>}</div></li>)}</ul>
   {list.length===0&&<p className="mt-4 rounded-lg bg-white p-3 text-sm">Belum ada bingkai untuk {want} foto{cat!=="Semua"?" di kategori ini":""}. Tambahkan bingkai dari galeri, atau <button onClick={()=>{setCat("Semua");setStep(1);setWant(null)}} className="font-bold underline">ubah jumlah foto</button>.</p>}
   <SlotRow n={frame.slots} photos={photos}/>
   <Short/>
   <div className="mt-4 flex gap-3"><button onClick={()=>setStep(1)} className={sec}><I n="chevron-left" className="h-5 w-5"/>Foto</button><button onClick={()=>go(3)} className={pri+"flex-1"}>Lihat Hasil<I n="chevron-right" className="h-5 w-5"/></button></div></section>}

  {step===3&&<section className="mt-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
   <div className="text-center"><h1 className="mb-2 font-display text-xl">HASIL · {frame.name}</h1>
    <div className="relative mx-auto w-fit max-w-full rounded-lg bg-white p-2 shadow-xl">
     <canvas ref={cv} aria-label={`Hasil photobooth dengan bingkai ${frame.name}`} className="mx-auto block max-h-[65vh] w-auto max-w-full"/>
     {rendering&&<div className="absolute inset-0 grid place-items-center rounded-lg bg-white/80 font-bold">Menyiapkan hasil…</div>}</div>
    <SlotRow n={frame.slots} photos={photos}/></div>
   <div className="mt-5 rounded-xl bg-white p-4 shadow lg:mt-0">
    <h2 className="font-bold">Unduh</h2>
    <Seg label="Format" opts={[["png","PNG"],["jpeg","JPEG"]]} val={fmt} set={setFmt}/>
    <Seg label="Ukuran" opts={[[1,"1× standar"],[2,"2× HD"]]} val={scale} set={setScale}/>
    <Seg label="Kualitas (JPEG)" opts={Object.keys(Q).map(k=>[k,k])} val={qual} set={setQual} dis={fmt==="png"}/>
    <p className="mt-1 text-xs opacity-80">{fmt==="png"?"Kualitas hanya berlaku untuk JPEG. PNG selalu kualitas penuh.":"Tinggi = file lebih besar, Hemat = file lebih kecil."}</p>
    {dims[0]>0&&<p className="mt-3 text-xs opacity-80">Hasil: {dims[0]*scale} × {dims[1]*scale} px · foto diproses di perangkatmu</p>}
    <div className="mt-4 grid gap-3">
     <button onClick={exportImg} disabled={exporting||rendering} className={pri}>{exporting?"Menyiapkan hasil…":<><I n="download" className="h-5 w-5"/>Unduh {fmt==="png"?"PNG":"JPEG"}</>}</button>
     <button onClick={copyPng} disabled={exporting||rendering} className={sec}><I n="copy" className="h-5 w-5"/>Salin sebagai PNG</button></div>
    <Short/>
    <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4"><button onClick={()=>setStep(2)} className={sec}>Ganti bingkai</button><button onClick={()=>setStep(1)} className={sec}>Ganti foto</button></div>
    {downloaded&&<button onClick={reset} className={dark+"mt-3 w-full"}>Buat foto baru</button>}
    {!downloaded&&<button onClick={reset} className="mt-3 min-h-11 w-full text-sm font-semibold text-red-700 underline">Mulai ulang (hapus semua foto)</button>}
   </div></section>}
 <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs opacity-80"><I n="lock" className="h-4 w-4"/><span>Foto diproses di perangkatmu dan hilang saat tab ditutup. Bingkai tambahan tersimpan di browser ini.</span></p>
 </main>);
}
