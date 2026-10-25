import {useEffect,useState} from "react";
import {motion} from "framer-motion";
import I from "./Icon.jsx";
import {FRAMES} from "./lib/frames";
import {buildFrame} from "./lib/detect";
import {compose} from "./lib/compose";
const Link=({href,children,...p})=><a href={"#"+href} {...p}>{children}</a>;
// foto pengganti sementara (siluet) sebelum kamu memasang foto contoh sendiri
const AV="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfdbfe"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs><rect width="120" height="90" fill="url(#g)"/><circle cx="60" cy="36" r="15" fill="#fff" opacity=".9"/><path d="M26 90c4-22 20-30 34-30s30 8 34 30z" fill="#fff" opacity=".9"/></svg>');
const rd=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[]}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
async function small(file){
 let bm;try{bm=await createImageBitmap(file,{imageOrientation:"from-image"})}catch{bm=await createImageBitmap(file)}
 const k=Math.min(1,640/Math.max(bm.width,bm.height)),c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);
 const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bm,0,0,c.width,c.height);bm.close?.();return c.toDataURL("image/jpeg",.85)}
const Strip=({bg,pat,n,label,rot,w,ph,o})=>(
 <motion.div aria-hidden="true" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} whileHover={{rotate:0,scale:1.04}}
  style={{rotate:rot,background:bg,width:w}} className="relative shrink-0 border-4 border-white p-2 shadow-xl">
  {pat&&<div className="stripes absolute inset-x-0 top-0 h-3"/>}
  <div className="mt-2 space-y-2">{Array.from({length:n}).map((_,i)=><img key={i} src={ph(o+i)} alt="" className="aspect-[4/3] w-full rounded border-2 border-ink object-cover"/>)}</div>
  <div className="paper -rotate-3 mx-1 mt-2 border-2 border-ink py-1 text-center font-display text-sm">{label}</div>
 </motion.div>);
const STEPS=[["camera","Ambil / unggah foto","Pakai kamera atau pilih dari galeri."],["image","Pilih bingkai","Ganti bingkai kapan saja, fotomu tetap aman."],["download","Unduh hasil","Simpan sebagai PNG atau JPEG."]];

export default function Home(){
 const [demo,setDemo]=useState(()=>rd("pb_demo")),[frames,setFrames]=useState(()=>rd("pb_frames")),[prev,setPrev]=useState({}),[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);
 const ph=i=>demo.length?demo[i%demo.length]:AV;
 useEffect(()=>{let dead=false;const photos=demo.length?demo:[AV];
  (async()=>{const o={};for(const f of frames){try{const c=document.createElement("canvas");await compose(c,f,photos);o[f.id]=c.toDataURL("image/jpeg",.82)}catch{}}if(!dead)setPrev(o)})();return()=>{dead=true}},[frames,demo]);
 async function pickDemo(e){const fs=[...e.target.files].slice(0,4);e.target.value="";setMsg("");const out=[];
  for(const f of fs){if(!/^image\//.test(f.type)||f.size>10e6)continue;try{out.push(await small(f))}catch{}}
  if(!out.length){setMsg("Foto tidak bisa dibaca. Pilih JPG, PNG, atau WebP (maks 10 MB).");return}
  setDemo(out);setMsg(wr("pb_demo",out)?`${out.length} foto contoh dipasang. Foto hanya tersimpan di browser ini.`:"Foto contoh dipakai sementara (penyimpanan browser penuh).")}
 async function pickFrames(e){const fs=[...e.target.files];e.target.value="";setMsg("");setBusy(true);const out=[];
  for(const [i,f] of fs.entries()){try{const b=await buildFrame(f);
   if(!b){setMsg(`Area foto kosong tidak ditemukan pada "${f.name}".`);continue}
   out.push({...b,id:"c"+Date.now()+i,name:f.name.replace(/\.[^.]+$/,"").slice(0,18),cat:"Bingkai Saya",slots:b.rects.length,custom:true})}
   catch{setMsg("Gambar bingkai tidak bisa dibaca.")}}
  setBusy(false);if(out.length){const all=[...frames,...out];setFrames(all);setMsg(wr("pb_frames",all)?`${out.length} bingkai kolase ditambahkan.`:"Penyimpanan browser penuh: bingkai hanya tampil sampai halaman ditutup.")}}
 const go=id=>e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"})};
 const nav="inline-flex min-h-11 items-center gap-1 rounded-full px-4 text-sm font-semibold ";
 const lab="inline-flex min-h-12 cursor-pointer items-center rounded-full px-5 text-sm font-bold ";
 return(<div className="flex min-h-dvh flex-col">
  <header className="bg-cream px-4 py-3 md:px-10">
   <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
    <a href="#/" aria-label="Photobooth Club, beranda" className="relative block px-3">
     <span className="burst absolute -left-1 -top-3 h-14 w-24 bg-pb" aria-hidden="true"/>
     <span className="relative block font-display text-2xl leading-6 text-white [-webkit-text-stroke:2px_#14267a]">PHOTOBOOTH<br/><span className="ml-4">CLUB</span></span></a>
    <nav aria-label="Menu utama" className="hidden gap-2 md:flex">
     <a aria-current="page" href="#/" className={nav+"border-b-4 border-pb"}><I n="house" className="h-4 w-4"/> Beranda</a>
     <a href="#/" onClick={go("vibe")} className={nav}><I n="layout-grid" className="h-4 w-4"/> Pilih Bingkai</a>
     <a href="#/" onClick={go("cara")} className={nav}><I n="lightbulb" className="h-4 w-4"/> Cara Pakai</a></nav>
    <Link href="/studio" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-pb px-5 text-sm font-bold text-white shadow-md"><I n="camera" className="h-5 w-5"/> Mulai Foto</Link>
   </div>
   <nav aria-label="Menu utama" className="mx-auto mt-2 flex max-w-6xl gap-2 overflow-x-auto md:hidden">
    <a aria-current="page" href="#/" className={nav+"bg-navy text-white"}>Beranda</a>
    <a href="#/" onClick={go("vibe")} className={nav+"bg-white"}>Pilih Bingkai</a>
    <a href="#/" onClick={go("kolase")} className={nav+"bg-white"}>Kolase</a>
    <a href="#/" onClick={go("cara")} className={nav+"bg-white"}>Cara Pakai</a></nav>
  </header>

  <main className="flex-1">
   <section className="relative bg-navy px-5 pb-10 pt-8 md:px-10">
    <div className="checker absolute left-0 top-0 h-full w-3 md:w-10" aria-hidden="true"/>
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row">
     <div className="text-center md:order-2 md:w-1/2 md:text-left">
      <div className="relative mx-auto w-fit md:mx-0"><div className="burst absolute -inset-x-6 -inset-y-8 bg-pb" aria-hidden="true"/>
       <motion.h1 initial={{scale:.85,opacity:0}} animate={{scale:1,opacity:1}} style={{fontSize:"clamp(2.4rem,11vw,4.5rem)"}} className="stroke relative font-display leading-none text-white">CAPTURE YOUR<br/>MOMENTS!</motion.h1></div>
      <p className="mx-auto mt-9 w-fit max-w-full -rotate-1 bg-cream px-4 py-2 font-hand text-2xl font-bold md:mx-0">Bikin foto seru dengan bingkai favoritmu</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
       <Link href="/studio" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pb px-8 text-base font-bold text-white shadow-lg"><I n="camera" className="h-5 w-5"/> Mulai Foto</Link>
       <a href="#/" onClick={go("vibe")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-cream px-6 text-sm font-semibold text-cream"><I n="images" className="h-5 w-5"/> Lihat Bingkai</a></div>
     </div>
     <div className="flex w-full items-start justify-center gap-2 md:order-1 md:w-1/2 md:gap-3">
      <Strip bg="#f6f0e1" pat n={2} label="After School Date" rot={-4} w={112} ph={ph} o={0}/>
      <Strip bg="#2347b5" n={2} label="Good Mood" rot={2} w={112} ph={ph} o={2}/>
      <Strip bg="#e23232" n={3} label="Bestie Time" rot={5} w={96} ph={ph} o={4}/>
     </div>
    </div>
   </section>

   <section id="vibe" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-10">
    <h2 className="mx-auto w-fit -skew-x-6 bg-navy px-8 py-2 font-display text-2xl text-white">PILIH VIBE KAMU</h2>
    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
     {FRAMES.slice(0,4).map((f,i)=>(<li key={f.id}>
      <Link href={`/studio?frame=${f.id}`} className="block rounded-xl bg-white p-3 shadow transition active:scale-95">
       <div style={{background:f.bg}} className="rounded border-2 border-ink p-1.5"><img src={ph(i)} alt="" className="aspect-[4/3] w-full rounded object-cover"/></div>
       <div className="mt-3 flex items-center justify-between gap-2"><div><div className="text-sm font-bold leading-tight">{f.name}</div><div className="text-xs opacity-70">{f.slots} foto</div></div>
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-white"><I n="chevron-right" className="h-5 w-5"/></span></div></Link></li>))}
    </ul>
   </section>

   <section id="kolase" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-10">
    <h2 className="mx-auto w-fit -skew-x-6 bg-pb px-8 py-2 font-display text-2xl text-white">KOLASE BINGKAIMU</h2>
    {frames.length>0?<ul className="mt-6 flex gap-4 overflow-x-auto px-1 pb-4">{frames.map((f,i)=>(<li key={f.id} className="w-40 shrink-0 md:w-48">
     <Link href={`/studio?frame=${f.id}`} style={{transform:`rotate(${i%2?2:-2}deg)`}} className="block rounded-xl bg-white p-2 shadow transition active:scale-95">
      {prev[f.id]?<img src={prev[f.id]} alt={`Bingkai ${f.name}`} className="aspect-[3/5] w-full rounded bg-gray-50 object-contain"/>:<div className="grid aspect-[3/5] place-items-center text-xs">Menyiapkan…</div>}
      <div className="mt-2 text-sm font-bold">{f.name}</div><div className="text-xs opacity-70">{f.slots} foto · ketuk untuk pakai</div></Link></li>))}</ul>
    :<p className="mt-4 text-center text-sm">Belum ada bingkai kolase. Pilih gambar bingkai dari galeri HP-mu, area fotonya terdeteksi otomatis.</p>}
    <div className="mt-4 flex flex-wrap justify-center gap-3">
     <label className={lab+"border-2 border-dashed border-ink"}>{busy?"Memproses…":<><I n="plus" className="mr-2 h-5 w-5"/>Tambah bingkai kolase</>}<input type="file" accept="image/*" multiple disabled={busy} onChange={pickFrames} className="sr-only"/></label>
     <label className={lab+"border-2 border-ink bg-white"}><I n="images" className="mr-2 h-5 w-5"/>Ganti foto contoh<input type="file" accept="image/*" multiple onChange={pickDemo} className="sr-only"/></label></div>
    {msg&&<p role="status" className="mt-3 text-center text-sm font-semibold">{msg}</p>}
    <p className="mt-2 text-center text-xs opacity-80">Foto contoh dan bingkai hanya tersimpan di browser ini, tidak dikirim ke server.</p>
   </section>

   <section id="cara" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-12">
    <h2 className="text-center font-hand text-3xl font-bold">Cara pakai</h2>
    <ol className="mt-4 grid gap-3 md:grid-cols-3">{STEPS.map(([i,t,d],n)=>(
     <li key={t} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow"><span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pb text-white"><I n={i} className="h-6 w-6"/></span>
      <div><div className="font-bold">{n+1}. {t}</div><div className="text-sm opacity-80">{d}</div></div></li>))}</ol>
   </section>
  </main>

  <footer className="bg-navy px-4 py-5 text-center text-sm text-white">
   <p className="flex items-center justify-center gap-2"><I n="lock" className="h-4 w-4"/><span>Fotomu diproses di perangkatmu dan tidak dikirim ke server.</span></p>
   <p className="mt-1 opacity-90">@photobooth club · Good Frames, Good Memories <I n="sparkles" className="h-4 w-4 align-[-2px]"/></p>
  </footer>
 </div>);
}
