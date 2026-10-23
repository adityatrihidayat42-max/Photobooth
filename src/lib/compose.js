const INK="#14267a",RED="#ee3b3b",CREAM="#f6f0e1",YEL="#ffd23f",BLUE="#2347b5",PINK="#f6a6c9",TAU=Math.PI*2;
const load=s=>new Promise((r,j)=>{const i=new Image();i.onload=()=>i.naturalWidth&&i.naturalHeight?r(i):j(new Error("gambar tidak valid"));i.onerror=()=>j(new Error("gambar gagal dimuat"));i.src=s});
const safe=s=>load(s).catch(()=>null);
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const rr=(x,X,Y,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h)};
function star(x,cx,cy,R,fill,o={}){const{stroke,rot=0,pts=5,inner=.45,lw=3}=o;x.save();x.translate(cx,cy);x.rotate(rot);x.beginPath();
 for(let i=0;i<pts*2;i++){const r=i%2?R*inner:R,a=i*Math.PI/pts-Math.PI/2;x[i?"lineTo":"moveTo"](Math.cos(a)*r,Math.sin(a)*r)}
 x.closePath();x.fillStyle=fill;x.fill();if(stroke){x.lineWidth=lw;x.strokeStyle=stroke;x.lineJoin="round";x.stroke()}x.restore()}
const spark=(x,cx,cy,R,fill)=>star(x,cx,cy,R,fill,{pts:4,inner:.25});
function heart(x,cx,cy,s,fill,stroke,rot=0){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(s/22,s/22);x.beginPath();x.moveTo(0,10);x.bezierCurveTo(-24,-5,-12,-22,0,-9);x.bezierCurveTo(12,-22,24,-5,0,10);x.closePath();
 x.fillStyle=fill;x.fill();if(stroke){x.lineWidth=3*22/s;x.strokeStyle=stroke;x.lineJoin="round";x.stroke()}x.restore()}
function tape(x,cx,cy,w,h,rot,c="rgba(255,214,102,.9)"){x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle=c;x.fillRect(-w/2,-h/2,w,h);x.fillStyle="rgba(255,255,255,.35)";for(let i=-w/2+8;i<w/2;i+=14)x.fillRect(i,-h/2,5,h);x.restore()}
function text(x,t,cx,cy,font,fill,rot=0){x.save();x.translate(cx,cy);x.rotate(rot);x.font=font;x.textAlign="center";x.textBaseline="middle";x.fillStyle=fill;x.fillText(t,0,0);x.restore()}
function banner(x,cx,cy,t,o={}){const{w=420,h=78,rot=-.04,bg=CREAM,fg=INK,bd=INK,fs=44}=o;x.save();x.translate(cx,cy);x.rotate(rot);
 x.shadowColor="rgba(0,0,0,.3)";x.shadowOffsetY=5;x.shadowBlur=8;x.fillStyle=bg;x.beginPath();x.moveTo(-w/2,-h/2);x.lineTo(w/2,-h/2);x.lineTo(w/2-20,0);x.lineTo(w/2,h/2);x.lineTo(-w/2,h/2);x.lineTo(-w/2+20,0);x.closePath();x.fill();
 x.shadowColor="transparent";x.lineWidth=5;x.strokeStyle=bd;x.lineJoin="round";x.stroke();
 let s=fs;x.font=`${s}px Anton,Impact,sans-serif`;while(x.measureText(t).width>w-90&&s>18){s-=2;x.font=`${s}px Anton,Impact,sans-serif`}
 x.fillStyle=fg;x.textAlign="center";x.textBaseline="middle";x.fillText(t,0,3);x.restore()}
function bubble(x,cx,cy,t,rot=0,w=176,h=72){x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle="#fff";x.strokeStyle=INK;x.lineWidth=5;x.lineJoin="round";
 rr(x,-w/2,-h/2,w,h,30);x.fill();x.stroke();x.beginPath();x.moveTo(-w/4,h/2-3);x.lineTo(-w/4-16,h/2+26);x.lineTo(-w/4+24,h/2-3);x.closePath();x.fill();x.stroke();x.fillStyle="#fff";x.fillRect(-w/4-8,h/2-8,30,9);
 x.fillStyle=INK;x.font="38px Anton,Impact,sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText(t,0,2);x.restore()}
function smiley(x,cx,cy,r,rot=0){x.save();x.translate(cx,cy);x.rotate(rot);x.fillStyle=YEL;x.strokeStyle=INK;x.lineWidth=5;x.beginPath();x.arc(0,0,r,0,TAU);x.fill();x.stroke();
 x.fillStyle=INK;x.beginPath();x.arc(-r*.35,-r*.2,r*.1,0,TAU);x.arc(r*.35,-r*.2,r*.1,0,TAU);x.fill();x.beginPath();x.arc(0,r*.05,r*.5,.15*Math.PI,.85*Math.PI);x.stroke();
 x.fillStyle="rgba(238,59,59,.45)";x.beginPath();x.arc(-r*.62,r*.15,r*.14,0,TAU);x.arc(r*.62,r*.15,r*.14,0,TAU);x.fill();x.restore()}
function burst(x,cx,cy,R,fill,t,rot=0,tc=INK){x.save();x.translate(cx,cy);x.rotate(rot);star(x,0,0,R,fill,{pts:12,inner:.8,stroke:INK,lw:4});text(x,t,0,2,`${Math.round(R*.55)}px Anton,Impact,sans-serif`,tc);x.restore()}
function checker(x,X,Y,w,h,s,a,b){for(let j=0;j*s<h;j++)for(let i=0;i*s<w;i++){x.fillStyle=(i+j)%2?b:a;x.fillRect(X+i*s,Y+j*s,Math.min(s,w-i*s),Math.min(s,h-j*s))}}
function candy(x,X,Y,w,h,s=22){for(let i=0;i*s<w;i++){x.fillStyle=i%2?"#fff":RED;x.fillRect(X+i*s,Y,Math.min(s,w-i*s),h)}}
function squig(x,X,Y,w,c,n=5,a=7){x.save();x.strokeStyle=c;x.lineWidth=4;x.lineCap="round";x.beginPath();for(let i=0;i<=n*8;i++){const t=i/(n*8);x[i?"lineTo":"moveTo"](X+t*w,Y+Math.sin(t*n*TAU)*a)}x.stroke();x.restore()}
function popcorn(x,cx,cy,k,rot=0){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(k,k);x.fillStyle="#fff7d6";x.strokeStyle=INK;x.lineWidth=3;
 [[-22,-34,15],[0,-42,17],[22,-34,15],[-10,-24,14],[12,-24,14]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,TAU);x.fill();x.stroke()});
 x.beginPath();x.moveTo(-34,-18);x.lineTo(34,-18);x.lineTo(26,44);x.lineTo(-26,44);x.closePath();x.fillStyle="#fff";x.fill();x.stroke();
 x.save();x.clip();x.fillStyle=RED;[-24,-8,8,24].forEach(v=>x.fillRect(v-4,-18,8,70));x.restore();x.beginPath();x.moveTo(-34,-18);x.lineTo(34,-18);x.lineTo(26,44);x.lineTo(-26,44);x.closePath();x.stroke();x.restore()}
function lightstick(x,cx,cy,len,c,rot=0){x.save();x.translate(cx,cy);x.rotate(rot);x.shadowColor=c;x.shadowBlur=26;x.fillStyle="#fff";x.fillRect(-5,0,10,len);star(x,0,0,34,c,{stroke:"#fff",lw:3,inner:.5});x.restore()}
function photo(x,im,r,o={}){const bw=o.bw??12,w=r.w,h=r.h,rd=o.rd||0;x.save();x.translate(r.x+w/2,r.y+h/2);x.rotate(r.rot||0);
 x.shadowColor="rgba(0,0,0,.4)";x.shadowBlur=20;x.shadowOffsetY=8;x.fillStyle=o.bd||"#fff";rr(x,-w/2-bw,-h/2-bw,w+2*bw,h+2*bw,rd+bw*.6);x.fill();x.shadowColor="transparent";
 x.save();rr(x,-w/2,-h/2,w,h,rd);x.clip();
 if(im){const k=Math.max(w/im.width,h/im.height),iw=im.width*k,ih=im.height*k;x.drawImage(im,-iw/2,-ih/2,iw,ih)}
 else{x.fillStyle="#d9d9d9";x.fillRect(-w/2,-h/2,w,h);x.fillStyle="#444";x.font="bold 24px sans-serif";x.textAlign="center";x.fillText("Foto gagal dimuat",0,0)}x.restore();
 if(o.ib){x.strokeStyle=o.ib;x.lineWidth=4;rr(x,-w/2-2,-h/2-2,w+4,h+4,rd+2);x.stroke()}
 if(o.pc){x.fillStyle=o.pc;x.strokeStyle="#fff";x.lineWidth=2;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{x.beginPath();x.moveTo(a*w/2,b*h/2);x.lineTo(a*(w/2-30),b*h/2);x.lineTo(a*w/2,b*(h/2-30));x.closePath();x.fill();x.stroke()})}
 x.restore()}
function scatter(x,W,H,seed,n,fn){const r=rng(seed);for(let i=0;i<n;i++)fn(r()*W,30+r()*(H-60),r(),r())}

const T={
"after-school":{side:46,top:100,gap:48,bottom:200,rot:[-.018,.018],
 bg(x,W,H){x.fillStyle=CREAM;x.fillRect(0,0,W,H);x.fillStyle="rgba(20,38,122,.08)";for(let y=14;y<H;y+=24)for(let X=(y/24%2)*12+8;X<W;X+=24){x.beginPath();x.arc(X,y,2.2,0,TAU);x.fill()}
  scatter(x,W,H,5,12,(a,b,r,q)=>heart(x,a,b,16+r*14,"rgba(238,59,59,.2)",null,q-.5));candy(x,0,0,W,40);candy(x,0,H-40,W,40)},
 fg(x,W,H,rc){rc.forEach((r,i)=>tape(x,r.x+(i%2?r.w-44:44),r.y-6,92,28,i%2?.35:-.35));
  burst(x,rc[0].x+6,rc[0].y+4,56,YEL,"GOOD",-.2);popcorn(x,rc[0].x+rc[0].w-34,rc[0].y+rc[0].h-6,.95,.12);
  const b=rc[rc.length-1];star(x,b.x+b.w-8,b.y+b.h+2,34,RED,{stroke:INK,rot:.3,lw:4});heart(x,b.x+10,b.y+b.h+4,46,RED,"#fff",-.25);spark(x,b.x+b.w/2,b.y-26,15,YEL);
  squig(x,W/2-120,H-166,240,RED);banner(x,W/2,H-116,"AFTER SCHOOL DATE");text(x,"date night ♥",W/2,H-54,"700 34px Caveat,cursive",INK,-.03)}},
"good-mood":{side:52,top:96,gap:44,bottom:196,rot:[.02,-.02],
 bg(x,W,H){const g=x.createRadialGradient(W/2,H*.3,40,W/2,H/2,H*.8);g.addColorStop(0,"#3a62d8");g.addColorStop(1,"#1b3a99");x.fillStyle=g;x.fillRect(0,0,W,H);
  scatter(x,W,H,9,26,(a,b,r,q)=>spark(x,a,b,8+r*14,"rgba(255,255,255,.75)"));scatter(x,W,H,3,10,(a,b,r,q)=>star(x,a,b,10+q*10,YEL,{rot:r*3,stroke:INK,lw:2}));
  checker(x,0,0,W,36,36,"#fff",INK);checker(x,0,H-36,W,36,36,"#fff",INK)},
 fg(x,W,H,rc){rc.forEach((r,i)=>tape(x,r.x+(i%2?60:r.w-60),r.y-6,92,28,i%2?-.3:.3,"rgba(255,255,255,.7)"));
  bubble(x,rc[0].x+rc[0].w-78,rc[0].y-4,"Smile!",.1);const b=rc[rc.length-1];smiley(x,b.x+12,b.y+b.h-6,40,-.2);
  star(x,b.x+b.w-6,b.y+b.h+4,32,YEL,{stroke:INK,rot:.25,lw:4});spark(x,rc[0].x-4,rc[0].y+rc[0].h/2,20,"#fff");
  banner(x,W/2,H-116,"GOOD MOOD",{bg:YEL});text(x,"good vibes only ✦",W/2,H-54,"700 32px Caveat,cursive","#fff",-.03)}},
"bestie":{side:50,top:104,gap:38,bottom:190,rot:[-.02,.02,-.015],
 bg(x,W,H){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#fbc3dc");g.addColorStop(1,"#f08cb8");x.fillStyle=g;x.fillRect(0,0,W,H);
  scatter(x,W,H,11,34,(a,b,r,q)=>heart(x,a,b,12+r*20,"rgba(255,255,255,.55)",null,q-.5));scatter(x,W,H,4,12,(a,b,r)=>spark(x,a,b,8+r*10,"#fff"))},
 fg(x,W,H,rc){rc.forEach((r,i)=>tape(x,r.x+(i%2?r.w-50:50),r.y-6,90,28,i%2?.35:-.35,"rgba(255,255,255,.75)"));
  bubble(x,rc[0].x+70,rc[0].y-6,"BFF",-.1,140,66);heart(x,rc[0].x+rc[0].w-6,rc[0].y+rc[0].h-10,56,RED,"#fff",.25);
  heart(x,rc[1].x+8,rc[1].y+rc[1].h-4,44,"#ff6fa3","#fff",-.3);heart(x,rc[rc.length-1].x+rc[rc.length-1].w-14,rc[rc.length-1].y+rc[rc.length-1].h+6,40,RED,"#fff",.2);
  banner(x,W/2,H-110,"BESTIE TIME",{bg:"#fff",fg:RED});text(x,"best friends forever",W/2,H-52,"700 34px Caveat,cursive","#fff",-.03)}},
"fan-event":{side:56,top:120,gap:0,bottom:250,ar:.9,rot:[-.012],
 bg(x,W,H){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1c2f86");g.addColorStop(1,"#0b1450");x.fillStyle=g;x.fillRect(0,0,W,H);
  scatter(x,W,H*.75,2,22,(a,b,r,q)=>{x.fillStyle=`rgba(255,${180+q*70|0},${200+r*50|0},.14)`;x.beginPath();x.arc(a,b,12+r*34,0,TAU);x.fill()});
  scatter(x,W,H,8,40,(a,b,r,q)=>{x.fillStyle=[RED,YEL,"#fff","#7fd4ff"][r*4|0];x.save();x.translate(a,b);x.rotate(q*6);x.fillRect(-4,-2,9,5);x.restore()});
  const r=rng(6);for(let i=0;i<14;i++){const cx=20+i*44+r()*10,cy=H-60+r()*10;x.fillStyle="#050a2e";x.beginPath();x.arc(cx,cy,24,0,TAU);x.fill();x.fillRect(cx-28,cy+10,56,80);if(i%3==0)lightstick(x,cx+8,cy-30,30,["#ff5c8a","#7fd4ff","#ffd23f"][i%3?0:1],.1)}},
 fg(x,W,H,rc){const r=rc[0];lightstick(x,r.x-26,r.y+r.h-90,130,"#ff5c8a",-.15);lightstick(x,r.x+r.w+26,r.y+r.h-120,150,"#7fd4ff",.15);
  tape(x,r.x+r.w/2,r.y-8,110,30,-.04);burst(x,r.x+r.w-8,r.y+6,52,YEL,"WOW",.2);spark(x,r.x+6,r.y+10,24,"#fff");
  banner(x,W/2,H-214,"FAN EVENT",{bg:RED,fg:"#fff",bd:"#fff"});text(x,"see you at the concert!",W/2,H-150,"700 30px Caveat,cursive","#fff",-.03)}},
"minimalis":{side:58,top:84,gap:34,bottom:160,rot:[0],pf:{bw:10},
 bg(x,W,H){x.fillStyle="#fbf7ee";x.fillRect(0,0,W,H);x.strokeStyle="rgba(20,38,122,.09)";x.lineWidth=1;for(let i=0;i<W;i+=30){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(let j=0;j<H;j+=30){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
  x.strokeStyle=INK;x.lineWidth=3;x.strokeRect(18,18,W-36,H-36)},
 fg(x,W,H,rc){rc.forEach((r,i)=>tape(x,r.x+r.w/2,r.y-4,84,24,(i%2?.06:-.06),"rgba(255,226,140,.85)"));
  spark(x,W-52,56,16,INK);spark(x,56,H-170,12,INK);text(x,"photobooth club",W/2,H-96,"700 52px Caveat,cursive",INK,-.02);
  text(x,new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}),W/2,H-52,"22px Poppins,sans-serif","rgba(20,38,122,.7)")}},
"retro":{side:92,top:66,gap:30,bottom:124,rot:[0],pf:{bw:6,bd:"#efe3b8"},
 bg(x,W,H){x.fillStyle="#161412";x.fillRect(0,0,W,H);const r=rng(21);for(let i=0;i<1600;i++){x.fillStyle=`rgba(255,255,255,${r()*.07})`;x.fillRect(r()*W,r()*H,1.6,1.6)}
  for(let y=26;y<H-20;y+=58){[26,W-58].forEach(X=>{x.fillStyle="#e9e1cd";rr(x,X,y,32,30,7);x.fill()})}},
 fg(x,W,H,rc){rc.forEach((r,i)=>{text(x,`${i+1}A ▸`,r.x+34,r.y-12,"20px Anton,Impact,sans-serif","#f2a93b");text(x,`${i+1}`,r.x+r.w-14,r.y-12,"20px Anton,Impact,sans-serif","#f2a93b")});
  const g=x.createLinearGradient(W,0,W*.3,H*.5);g.addColorStop(0,"rgba(255,140,40,.28)");g.addColorStop(1,"rgba(255,140,40,0)");x.fillStyle=g;x.fillRect(0,0,W,H);
  text(x,"RETRO FILM 400",W/2,H-78,"40px Anton,Impact,sans-serif","#f2a93b");text(x,"photobooth club · "+new Date().getFullYear(),W/2,H-36,"20px Poppins,sans-serif","rgba(242,169,59,.8)")}}
};

// ===== Mesin tema generik: bingkai baru cukup berupa data (field th) di frames.js =====
function blob(x,c,fill,stroke,lw=4){if(stroke){x.fillStyle=stroke;c.forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r+lw,0,TAU);x.fill()})}x.fillStyle=fill;c.forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,TAU);x.fill()})}
const SK={
 heart:(x,cx,cy,s,r,P)=>heart(x,cx,cy,s,P.ac,"#fff",r),
 star:(x,cx,cy,s,r,P)=>star(x,cx,cy,s*.55,P.ac2,{stroke:P.ink,rot:r,lw:4}),
 spark:(x,cx,cy,s)=>spark(x,cx,cy,s*.55,"#fff"),
 smile:(x,cx,cy,s,r)=>smiley(x,cx,cy,s*.55,r),
 flower:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#fff";x.strokeStyle=P.ink;x.lineWidth=3;for(let i=0;i<6;i++){x.rotate(TAU/6);x.beginPath();x.ellipse(0,-s*.3,s*.16,s*.26,0,0,TAU);x.fill();x.stroke()}x.fillStyle=YEL;x.beginPath();x.arc(0,0,s*.17,0,TAU);x.fill();x.stroke();x.restore()},
 cloud:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r*.3);blob(x,[[-.32,.05,.2],[-.06,-.1,.27],[.22,.02,.22],[.4,.1,.15]].map(([a,b,c])=>[a*s,b*s,c*s]),"#fff",P.ink,4);x.restore()},
 rainbow:(x,cx,cy,s,r)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=s*.09;["#ff5a5f","#ffb347","#ffe14d","#4ecdc4","#6f8cff"].forEach((c,i)=>{x.strokeStyle=c;x.beginPath();x.arc(0,s*.2,s*(.46-i*.075),Math.PI,0);x.stroke()});x.restore()},
 cherry:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.strokeStyle="#3b7a2a";x.lineWidth=4;x.beginPath();x.moveTo(-s*.2,s*.1);x.quadraticCurveTo(-s*.1,-s*.3,s*.1,-s*.45);x.moveTo(s*.22,s*.15);x.quadraticCurveTo(s*.2,-s*.25,s*.1,-s*.45);x.stroke();x.fillStyle="#7acb5b";x.beginPath();x.ellipse(s*.2,-s*.4,s*.16,s*.07,-.5,0,TAU);x.fill();[[-.2,.18],[.22,.22]].forEach(([a,b])=>{x.fillStyle="#e8274b";x.strokeStyle=P.ink;x.lineWidth=4;x.beginPath();x.arc(a*s,b*s,s*.2,0,TAU);x.fill();x.stroke();x.fillStyle="rgba(255,255,255,.6)";x.beginPath();x.arc(a*s-s*.07,b*s-s*.07,s*.05,0,TAU);x.fill()});x.restore()},
 cone:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=4;x.strokeStyle=P.ink;x.lineJoin="round";x.fillStyle="#e8b26a";x.beginPath();x.moveTo(-s*.2,0);x.lineTo(s*.2,0);x.lineTo(0,s*.5);x.closePath();x.fill();x.stroke();[[0,-.08,.24,P.ac],[0,-.28,.2,P.ac2]].forEach(([a,b,c,f])=>{x.fillStyle=f;x.beginPath();x.arc(a*s,b*s,c*s,0,TAU);x.fill();x.stroke()});x.restore()},
 note:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac;x.strokeStyle=P.ink;x.lineWidth=4;x.beginPath();x.ellipse(-s*.12,s*.28,s*.17,s*.12,-.4,0,TAU);x.fill();x.stroke();x.fillRect(s*.02,-s*.3,s*.07,s*.6);x.strokeRect(s*.02,-s*.3,s*.07,s*.6);x.beginPath();x.moveTo(s*.09,-s*.3);x.quadraticCurveTo(s*.34,-s*.2,s*.25,s*.02);x.lineWidth=7;x.strokeStyle=P.ac;x.stroke();x.restore()},
 bolt:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.beginPath();[[.08,-.5],[-.22,.05],[0,.05],[-.1,.5],[.24,-.1],[.02,-.1]].forEach(([a,b],i)=>x[i?"lineTo":"moveTo"](a*s,b*s));x.closePath();x.fillStyle=P.ac2;x.fill();x.lineWidth=4;x.strokeStyle=P.ink;x.lineJoin="round";x.stroke();x.restore()},
 moon:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.beginPath();x.rect(-s,-s,2*s,2*s);x.arc(s*.18,-s*.05,s*.34,0,TAU);x.clip("evenodd");x.beginPath();x.arc(0,0,s*.4,0,TAU);x.fillStyle=P.ac;x.fill();x.restore()},
 sun:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac2;x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";for(let i=0;i<12;i++){x.rotate(TAU/12);x.beginPath();x.moveTo(-s*.07,-s*.34);x.lineTo(0,-s*.5);x.lineTo(s*.07,-s*.34);x.closePath();x.fill();x.stroke()}x.beginPath();x.arc(0,0,s*.3,0,TAU);x.fill();x.stroke();x.fillStyle=P.ink;x.beginPath();x.arc(-s*.1,-s*.04,s*.035,0,TAU);x.arc(s*.1,-s*.04,s*.035,0,TAU);x.fill();x.beginPath();x.arc(0,s*.02,s*.12,.2*Math.PI,.8*Math.PI);x.stroke();x.restore()},
 bow:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac;x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";[-1,1].forEach(d=>{x.beginPath();x.moveTo(0,0);x.lineTo(d*s*.5,-s*.28);x.lineTo(d*s*.5,s*.28);x.closePath();x.fill();x.stroke()});x.beginPath();x.arc(0,0,s*.12,0,TAU);x.fill();x.stroke();x.restore()},
 crown:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac;x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();[[-.4,.25],[-.4,-.15],[-.2,.05],[0,-.3],[.2,.05],[.4,-.15],[.4,.25]].forEach(([a,b],i)=>x[i?"lineTo":"moveTo"](a*s,b*s));x.closePath();x.fill();x.stroke();[[-.4,-.15],[0,-.3],[.4,-.15]].forEach(([a,b])=>{x.fillStyle="#fff";x.beginPath();x.arc(a*s,b*s,s*.06,0,TAU);x.fill();x.stroke()});x.restore()},
 butterfly:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=3;x.strokeStyle=P.ink;[-1,1].forEach(d=>{x.fillStyle=P.ac;x.beginPath();x.ellipse(d*s*.24,-s*.14,s*.22,s*.17,d*.5,0,TAU);x.fill();x.stroke();x.fillStyle=P.ac2;x.beginPath();x.ellipse(d*s*.18,s*.14,s*.15,s*.12,-d*.5,0,TAU);x.fill();x.stroke()});x.fillStyle=P.ink;x.fillRect(-s*.03,-s*.24,s*.06,s*.48);x.restore()},
 leaf:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#5cb85c";x.strokeStyle=P.ink;x.lineWidth=3;x.beginPath();x.ellipse(0,0,s*.16,s*.38,0,0,TAU);x.fill();x.stroke();x.beginPath();x.moveTo(0,-s*.34);x.lineTo(0,s*.34);x.stroke();x.restore()},
 balloon:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.strokeStyle=P.ink;x.lineWidth=3;x.beginPath();x.moveTo(0,s*.3);x.quadraticCurveTo(s*.1,s*.5,-s*.05,s*.7);x.stroke();x.fillStyle=P.ac;x.beginPath();x.ellipse(0,0,s*.26,s*.32,0,0,TAU);x.fill();x.stroke();x.beginPath();x.moveTo(0,s*.3);x.lineTo(-s*.05,s*.37);x.lineTo(s*.05,s*.37);x.closePath();x.fill();x.stroke();x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(-s*.09,-s*.1,s*.05,s*.1,.4,0,TAU);x.fill();x.restore()},
 hat:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac2;x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();x.moveTo(-s*.28,s*.32);x.lineTo(0,-s*.4);x.lineTo(s*.28,s*.32);x.closePath();x.fill();x.stroke();x.fillStyle=P.ac;[[-.08,.1],[.08,-.05],[0,.22]].forEach(([a,b])=>{x.beginPath();x.arc(a*s,b*s,s*.04,0,TAU);x.fill()});x.fillStyle="#fff";x.beginPath();x.arc(0,-s*.4,s*.07,0,TAU);x.fill();x.stroke();x.restore()},
 planet:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r-.4);x.lineWidth=4;x.strokeStyle=P.ink;x.fillStyle=P.ac2;x.beginPath();x.arc(0,0,s*.26,0,TAU);x.fill();x.stroke();x.strokeStyle=P.ac;x.lineWidth=s*.07;x.beginPath();x.ellipse(0,0,s*.45,s*.12,0,0,TAU);x.stroke();x.restore()},
 cup:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#fff";x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();x.moveTo(-s*.26,-s*.1);x.lineTo(s*.26,-s*.1);x.lineTo(s*.2,s*.28);x.lineTo(-s*.2,s*.28);x.closePath();x.fill();x.stroke();x.beginPath();x.arc(s*.28,s*.05,s*.1,-1.4,1.4);x.stroke();x.fillStyle=P.ac;x.fillRect(-s*.24,-s*.06,s*.48,s*.07);x.lineWidth=3;x.beginPath();x.moveTo(-s*.08,-s*.2);x.quadraticCurveTo(-s*.14,-s*.3,-s*.05,-s*.4);x.moveTo(s*.08,-s*.2);x.quadraticCurveTo(s*.02,-s*.3,s*.11,-s*.4);x.stroke();x.restore()},
 disco:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.fillStyle="#d7dcff";x.strokeStyle=P.ink;x.lineWidth=3;x.beginPath();x.arc(0,0,s*.36,0,TAU);x.fill();x.save();x.clip();x.strokeStyle="rgba(90,90,160,.6)";x.lineWidth=2;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(i*s*.09,-s*.4);x.lineTo(i*s*.09,s*.4);x.moveTo(-s*.4,i*s*.09);x.lineTo(s*.4,i*s*.09);x.stroke()}x.restore();x.beginPath();x.arc(0,0,s*.36,0,TAU);x.stroke();spark(x,-s*.14,-s*.14,s*.1,"#fff");x.restore()},
};
const PT={
 dots(x,W,H,P){x.fillStyle=P.pc;for(let y=12;y<H;y+=26)for(let X=((y/26|0)%2)*13+6;X<W;X+=26){x.beginPath();x.arc(X,y,3.4,0,TAU);x.fill()}},
 stripes(x,W,H,P){x.fillStyle=P.pc;for(let i=0;i<W;i+=44)x.fillRect(i,0,22,H)},
 diag(x,W,H,P){x.fillStyle=P.pc;for(let i=-H;i<W;i+=44){x.beginPath();x.moveTo(i,0);x.lineTo(i+H,H);x.lineTo(i+H+20,H);x.lineTo(i+20,0);x.fill()}},
 gingham(x,W,H,P){x.fillStyle=P.pc;for(let i=0;i<W;i+=64)x.fillRect(i,0,32,H);for(let j=0;j<H;j+=64)x.fillRect(0,j,W,32)},
 grid(x,W,H,P){x.strokeStyle=P.pc;x.lineWidth=2;for(let i=0;i<W;i+=34){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(let j=0;j<H;j+=34){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}},
 checker(x,W,H,P){x.fillStyle=P.pc;for(let j=0;j*40<H;j++)for(let i=0;i*40<W;i++)if((i+j)%2)x.fillRect(i*40,j*40,40,40)},
 waves(x,W,H,P){x.strokeStyle=P.pc;x.lineWidth=5;for(let y=30;y<H;y+=46){x.beginPath();for(let i=0;i<=W;i+=8)x[i?"lineTo":"moveTo"](i,y+Math.sin(i/22)*8);x.stroke()}},
 rays(x,W,H,P){x.fillStyle=P.pc;const R=H*1.2,cy=H*.35;for(let i=0;i<24;i+=2){const a=i*TAU/24,b=(i+1)*TAU/24;x.beginPath();x.moveTo(W/2,cy);x.lineTo(W/2+Math.cos(a)*R,cy+Math.sin(a)*R);x.lineTo(W/2+Math.cos(b)*R,cy+Math.sin(b)*R);x.fill()}},
 hearts(x,W,H,P){scatter(x,W,H,7,34,(a,b,r,q)=>heart(x,a,b,14+r*18,P.pc,null,q-.5))},
 stars(x,W,H,P){scatter(x,W,H,3,34,(a,b,r)=>spark(x,a,b,6+r*12,P.pc))},
 flowers(x,W,H,P){x.globalAlpha=.5;scatter(x,W,H,5,22,(a,b,r,q)=>SK.flower(x,a,b,26+r*26,q*6,P));x.globalAlpha=1},
 clouds(x,W,H,P){scatter(x,W,H,9,9,(a,b,r)=>{const k=70+r*60;blob(x,[[-.5,.1,.3],[-.1,-.1,.4],[.35,.05,.32]].map(([i,j,m])=>[a+i*k,b+j*k,m*k]),P.pc)})},
 confetti(x,W,H,P){scatter(x,W,H,4,70,(a,b,r,q)=>{x.fillStyle=[P.ac,P.ac2,"#fff",P.pc][r*4|0];x.save();x.translate(a,b);x.rotate(q*6);x.fillRect(-5,-2.5,11,6);x.restore()})},
 bokeh(x,W,H){scatter(x,W,H,2,26,(a,b,r,q)=>{x.fillStyle=`rgba(255,255,255,${.06+q*.12})`;x.beginPath();x.arc(a,b,14+r*40,0,TAU);x.fill()})},
};
Object.assign(SK,{
 ghost:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#fff";x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();x.moveTo(-s*.3,s*.35);x.lineTo(-s*.3,-s*.05);x.arc(0,-s*.05,s*.3,Math.PI,0);x.lineTo(s*.3,s*.35);x.lineTo(s*.2,s*.26);x.lineTo(s*.1,s*.35);x.lineTo(0,s*.26);x.lineTo(-s*.1,s*.35);x.lineTo(-s*.2,s*.26);x.closePath();x.fill();x.stroke();x.fillStyle="#2a2a3a";x.beginPath();x.arc(-s*.1,-s*.08,s*.045,0,TAU);x.arc(s*.1,-s*.08,s*.045,0,TAU);x.fill();x.beginPath();x.ellipse(0,s*.06,s*.05,s*.07,0,0,TAU);x.fill();x.restore()},
 pumpkin:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#ff8a1a";x.strokeStyle=P.ink;x.lineWidth=4;[[-.2,.3],[.2,.3],[0,.34]].forEach(([a,w])=>{x.beginPath();x.ellipse(a*s,.02*s,w*s,s*.3,0,0,TAU);x.fill();x.stroke()});x.fillStyle="#5aa02c";x.fillRect(-s*.04,-s*.4,s*.08,s*.14);x.strokeRect(-s*.04,-s*.4,s*.08,s*.14);x.fillStyle="#3a1a00";x.beginPath();x.moveTo(-s*.16,-s*.04);x.lineTo(-s*.08,-s*.04);x.lineTo(-s*.12,-s*.12);x.closePath();x.moveTo(s*.16,-s*.04);x.lineTo(s*.08,-s*.04);x.lineTo(s*.12,-s*.12);x.closePath();x.fill();x.beginPath();x.moveTo(-s*.16,s*.12);x.quadraticCurveTo(0,s*.28,s*.16,s*.12);x.strokeStyle="#3a1a00";x.stroke();x.restore()},
 snowflake:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineCap="round";[[P.ink,.13],["#fff",.07]].forEach(([c,w])=>{x.strokeStyle=c;x.lineWidth=s*w;for(let i=0;i<6;i++){x.save();x.rotate(i*Math.PI/3);x.beginPath();x.moveTo(0,0);x.lineTo(0,-s*.4);x.moveTo(0,-s*.24);x.lineTo(-s*.1,-s*.34);x.moveTo(0,-s*.24);x.lineTo(s*.1,-s*.34);x.stroke();x.restore()}});x.restore()},
 lantern:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();x.moveTo(0,-s*.5);x.lineTo(0,-s*.34);x.stroke();x.fillStyle=P.ac;x.beginPath();x.moveTo(-s*.12,-s*.34);x.lineTo(s*.12,-s*.34);x.lineTo(s*.22,-s*.1);x.lineTo(s*.18,s*.2);x.lineTo(-s*.18,s*.2);x.lineTo(-s*.22,-s*.1);x.closePath();x.fill();x.stroke();x.fillStyle=P.ac2;x.fillRect(-s*.18,s*.2,s*.36,s*.06);x.strokeRect(-s*.18,s*.2,s*.36,s*.06);x.fillStyle="rgba(255,255,255,.55)";x.beginPath();x.ellipse(0,-s*.08,s*.06,s*.18,0,0,TAU);x.fill();x.beginPath();x.moveTo(0,s*.26);x.lineTo(0,s*.42);x.stroke();x.restore()},
 cap:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle="#222";x.strokeStyle=P.ink;x.lineWidth=4;x.lineJoin="round";x.beginPath();x.moveTo(-s*.2,s*.02);x.lineTo(-s*.2,s*.22);x.quadraticCurveTo(0,s*.36,s*.2,s*.22);x.lineTo(s*.2,s*.02);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(0,-s*.26);x.lineTo(s*.45,-s*.06);x.lineTo(0,s*.14);x.lineTo(-s*.45,-s*.06);x.closePath();x.fillStyle="#333";x.fill();x.stroke();x.strokeStyle=P.ac2;x.lineWidth=4;x.beginPath();x.moveTo(s*.3,-s*.02);x.lineTo(s*.3,s*.24);x.stroke();x.fillStyle=P.ac2;x.beginPath();x.arc(s*.3,s*.27,s*.05,0,TAU);x.fill();x.restore()},
 paw:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.fillStyle=P.ac;x.strokeStyle=P.ink;x.lineWidth=3.5;x.beginPath();x.ellipse(0,s*.12,s*.2,s*.16,0,0,TAU);x.fill();x.stroke();[[-.26,-.04],[-.09,-.2],[.09,-.2],[.26,-.04]].forEach(([a,b])=>{x.beginPath();x.ellipse(a*s,b*s,s*.08,s*.1,a*.8,0,TAU);x.fill();x.stroke()});x.restore()},
 gem:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=4;x.strokeStyle=P.ink;x.lineJoin="round";x.fillStyle=P.ac;x.beginPath();x.moveTo(-s*.3,-s*.1);x.lineTo(-s*.15,-s*.3);x.lineTo(s*.15,-s*.3);x.lineTo(s*.3,-s*.1);x.lineTo(0,s*.34);x.closePath();x.fill();x.stroke();x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.moveTo(-s*.15,-s*.3);x.lineTo(0,-s*.1);x.lineTo(s*.15,-s*.3);x.closePath();x.fill();x.beginPath();x.moveTo(-s*.3,-s*.1);x.lineTo(s*.3,-s*.1);x.lineWidth=3;x.stroke();x.restore()},
 flame:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=4;x.strokeStyle=P.ink;x.lineJoin="round";x.fillStyle=P.ac;x.beginPath();x.moveTo(0,-s*.42);x.bezierCurveTo(s*.1,-s*.2,s*.34,-s*.05,s*.26,s*.2);x.bezierCurveTo(s*.2,s*.38,-s*.2,s*.38,-s*.26,s*.2);x.bezierCurveTo(-s*.3,s*.05,-s*.1,-s*.05,0,-s*.42);x.closePath();x.fill();x.stroke();x.fillStyle=P.ac2;x.beginPath();x.moveTo(0,-s*.08);x.bezierCurveTo(s*.1,s*.04,s*.15,s*.12,s*.08,s*.24);x.bezierCurveTo(0,s*.32,-s*.12,s*.28,-s*.12,s*.16);x.bezierCurveTo(-s*.12,s*.06,-s*.02,s*.04,0,-s*.08);x.closePath();x.fill();x.restore()},
 ketupat:(x,cx,cy,s,r,P)=>{x.save();x.translate(cx,cy);x.rotate(r);x.lineWidth=4;x.strokeStyle=P.ink;x.lineJoin="round";x.fillStyle="#7bc74d";x.beginPath();x.moveTo(0,-s*.3);x.lineTo(s*.3,0);x.lineTo(0,s*.3);x.lineTo(-s*.3,0);x.closePath();x.fill();x.stroke();x.save();x.clip();x.lineWidth=2.5;x.beginPath();for(let i=-2;i<=2;i++){x.moveTo(i*s*.1-s*.15,-s*.15);x.lineTo(i*s*.1+s*.15,s*.15);x.moveTo(i*s*.1+s*.15,-s*.15);x.lineTo(i*s*.1-s*.15,s*.15)}x.stroke();x.restore();x.beginPath();x.moveTo(-s*.06,s*.3);x.lineTo(-s*.1,s*.46);x.moveTo(s*.06,s*.3);x.lineTo(s*.1,s*.46);x.lineWidth=4;x.stroke();x.restore()},
});
Object.assign(PT,{
 zigzag(x,W,H,P){x.strokeStyle=P.pc;x.lineWidth=6;for(let y=24;y<H;y+=44){x.beginPath();for(let i=0;i<=W+30;i+=30)x[i?"lineTo":"moveTo"](i,y+(i/30%2?12:-12));x.stroke()}},
 argyle(x,W,H,P){x.fillStyle=P.pc;for(let j=0;j*60<H+60;j++)for(let i=0;i*60<W+60;i++){const X=i*60+(j%2?30:0),Y=j*60;x.beginPath();x.moveTo(X,Y-22);x.lineTo(X+22,Y);x.lineTo(X,Y+22);x.lineTo(X-22,Y);x.closePath();x.fill()}},
 batik(x,W,H,P){x.strokeStyle=P.pc;x.lineWidth=3;for(let j=0;j*56<H+56;j++)for(let i=0;i*56<W+56;i++){x.save();x.translate(i*56,j*56);for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.ellipse(0,-14,8,14,0,0,TAU);x.stroke()}x.beginPath();x.arc(0,0,3,0,TAU);x.stroke();x.restore()}},
 snow(x,W,H,P){x.fillStyle=P.pc;scatter(x,W,H,12,60,(a,b,r)=>{x.beginPath();x.arc(a,b,2+r*5,0,TAU);x.fill()})},
});
[["ghost",1.5],["pumpkin",1.3],["lantern",1.5],["paw",1.5],["cap",1.3],["gem",1.5],["flame",1.4],["ketupat",1.5],["snowflake",1.2]].forEach(([k,m])=>{const g=SK[k];SK[k]=(x,cx,cy,s,r,P)=>g(x,cx,cy,s*m,r,P)});
function bunting(x,W,P){x.strokeStyle=P.ink;x.lineWidth=3;x.beginPath();x.moveTo(0,18);x.quadraticCurveTo(W/2,122,W,18);x.stroke();const cs=[P.ac,P.ac2,P.pa,P.ac];
 for(let i=0;i<9;i++){const t=(i+.5)/9,px=W*t,py=18+104*t*(1-t);x.fillStyle=cs[i%4];x.beginPath();x.moveTo(px-17,py);x.lineTo(px+17,py);x.lineTo(px,py+36);x.closePath();x.fill();x.stroke()}}
function pill(x,cx,cy,t,bg,fg,bd){x.save();x.translate(cx,cy);x.rotate(-.03);x.shadowColor="rgba(0,0,0,.3)";x.shadowOffsetY=5;x.shadowBlur=8;x.fillStyle=bg;rr(x,-195,-38,390,76,38);x.fill();x.shadowColor="transparent";x.lineWidth=5;x.strokeStyle=bd;x.stroke();
 let s=44;x.font=`${s}px Anton,Impact,sans-serif`;while(x.measureText(t).width>300&&s>18){s-=2;x.font=`${s}px Anton,Impact,sans-serif`}x.fillStyle=fg;x.textAlign="center";x.textBaseline="middle";x.fillText(t,0,3);x.restore()}
function G(c,n,name){const [a,b,ac,ac2,ink,pa,pc,bd,tx]=c.p,P={ac,ac2,ink,pa,pc,tx},fm=c.fm,one=n===1,T2=name.toUpperCase(),ks=(c.st||[]).map(z=>z[0]);
 const L=fm?{side:92,top:66,gap:30,bottom:124}:one?{side:56,top:112,gap:0,bottom:256,ar:.95}:n>3?{side:90,top:104,gap:32,bottom:200}:{side:50,top:100,gap:40,bottom:212};
 return{...L,rot:fm||c.r0?[0]:[-.018,.018,-.015,.02],fin:{ac,st:tx,ns:fm},pf:{bw:c.bw||(fm?6:12),bd,rd:fm?4:16,ib:fm?0:ac,pc:fm?0:ac},
 bg(x,W,H){const g=x.createLinearGradient(0,0,W*.3,H);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,W,H);
  if(fm){const r=rng(21);for(let i=0;i<1600;i++){x.fillStyle=`rgba(255,255,255,${r()*.07})`;x.fillRect(r()*W,r()*H,1.6,1.6)}for(let y=26;y<H-20;y+=58)[26,W-58].forEach(X=>{x.fillStyle=pa;rr(x,X,y,32,30,7);x.fill()});return}
  x.save();(PT[c.pat]||PT.dots)(x,W,H,P);x.restore();
  const gl=(u,v,R)=>{const q=x.createRadialGradient(u,v,0,u,v,R);q.addColorStop(0,ca(ac,.35));q.addColorStop(1,ca(ac,0));x.fillStyle=q;x.fillRect(0,0,W,H)};gl(0,0,W*.8);gl(W,H*.55,W*.7);gl(W*.1,H,W*.7);
  if(ks.length){x.save();x.globalAlpha=.2;scatter(x,W,H,n+7,11,(u,v,r,q)=>SK[ks[r*ks.length|0]](x,u,v,70+q*50,q*2-1,P));x.restore()}
  scatter(x,W,H,a.length+n,24,(u,v,r)=>spark(x,u,v,5+r*9,"rgba(255,255,255,.75)"));if(c.bun)bunting(x,W,P)},
 fg(x,W,H,rc){
  if(fm){rc.forEach((r,i)=>{text(x,`${i+1}A ▸`,r.x+34,r.y-12,"20px Anton,Impact,sans-serif",ac);text(x,`${i+1}`,r.x+r.w-14,r.y-12,"20px Anton,Impact,sans-serif",ac)});
   const g=x.createLinearGradient(W,0,W*.3,H*.5);g.addColorStop(0,ac+"55");g.addColorStop(1,ac+"00");x.fillStyle=g;x.fillRect(0,0,W,H);
   text(x,T2,W/2,H-78,"40px Anton,Impact,sans-serif",ac);text(x,c.tl,W/2,H-36,"20px Poppins,sans-serif",tx);return}
  const f=rc[0],l=rc[rc.length-1],A={tl:[f.x,f.y],tr:[f.x+f.w,f.y],bl:[l.x,l.y+l.h],br:[l.x+l.w,l.y+l.h]};
  rc.forEach((r,i)=>washi(x,r.x+(i%2?r.w-52:52),r.y-6,96,28,i%2?.35:-.35,i%2?ac2:ac));
  (c.st||[]).forEach(([k,an,s,r=0])=>{const S=s*(n>3?1.7:1.35),h=S*.5+6;SK[k](x,Math.min(Math.max(A[an][0],h),W-h),Math.max(A[an][1],h),S,r,P)});
  const by=H-L.bottom*.6,ty=H-L.bottom*.27;
  if(ks.length){rc.slice(0,-1).forEach((r,i)=>{const y=r.y+r.h+L.gap/2;[0,1].forEach(j=>SK[ks[(i*2+j+1)%ks.length]](x,j?r.x+r.w-4:r.x+4,y,64,j?.35:-.35,P))});
   if(one)[0,1].forEach(j=>SK[ks[j%ks.length]](x,j?f.x+f.w+2:f.x-2,f.y+f.h*.5,60,j?.3:-.3,P));
   SK[ks[0]](x,W/2-232,by,56,-.2,P);SK[ks[1%ks.length]](x,W/2+232,by,56,.2,P)}
  if(c.bn==="p")pill(x,W/2,by,T2,pa,ink,ac);else banner(x,W/2,by,T2,{bg:pa,fg:ink,bd:ink});
  text(x,c.tl,W/2,ty,"700 34px Caveat,cursive",tx,-.03)}}}

const ca=(h,a)=>{h=h.replace("#","");if(h.length==3)h=[...h].map(c=>c+c).join("");const n=parseInt(h,16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`};
function washi(x,cx,cy,w,h,rot,c){x.save();x.translate(cx,cy);x.rotate(rot);x.globalAlpha=.9;x.fillStyle=c;x.fillRect(-w/2,-h/2,w,h);x.beginPath();x.rect(-w/2,-h/2,w,h);x.clip();x.globalAlpha=.5;x.fillStyle="#fff";for(let i=-w/2-h;i<w/2;i+=18){x.beginPath();x.moveTo(i,h/2);x.lineTo(i+h,-h/2);x.lineTo(i+h+7,-h/2);x.lineTo(i+7,h/2);x.closePath();x.fill()}x.restore()}
const FIN={"after-school":{ac:RED,st:INK,ns:1},"good-mood":{ac:YEL,st:"#fff",ns:1},"bestie":{ac:"#fff",st:"#fff",ns:1},"fan-event":{ac:RED,st:"#fff",ns:1},"minimalis":{ac:INK,st:INK,ns:1},"retro":{ac:"#f2a93b",st:"#f2a93b",ns:1}};
function finish(x,W,H,P){x.save();
 let g=x.createLinearGradient(0,0,W*.8,H*.5);g.addColorStop(0,"rgba(255,255,255,.2)");g.addColorStop(.5,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,W,H);
 g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,Math.max(W,H)*.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.2)");x.fillStyle=g;x.fillRect(0,0,W,H);
 x.lineWidth=10;x.strokeStyle=P.ac;rr(x,5,5,W-10,H-10,26);x.stroke();
 x.lineWidth=3;x.setLineDash([11,8]);x.strokeStyle=P.st;rr(x,20,20,W-40,H-40,20);x.stroke();x.setLineDash([]);
 [[36,36],[W-36,36],[36,H-36],[W-36,H-36]].forEach(([a,b])=>spark(x,a,b,12,"#fff"));
 if(!P.ns)text(x,"PHOTOBOOTH CLUB ✦ "+new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"2-digit"}),W/2,H-24,"700 16px Poppins,sans-serif",P.st);
 x.restore()}

async function composeImg(cv,f,photos,s){
 const fr=await load(f.img);cv.width=f.W*s;cv.height=f.H*s;const x=cv.getContext("2d");x.setTransform(s,0,0,s,0,0);
 x.fillStyle="#fff";x.fillRect(0,0,f.W,f.H);
 for(let k=0;k<f.rects.length;k++){
  const [rx,ry,rw,rh]=f.rects[k],im=await safe(photos[k%photos.length]);
  photo(x,im,{x:rx-3,y:ry-3,w:rw+6,h:rh+6},{bw:0,rd:0});
 }
 x.drawImage(fr,0,0);
}
export async function compose(cv,f,photos,s=1){
 try{await Promise.all([document.fonts.load("38px Anton"),document.fonts.load("700 30px Caveat"),document.fonts.load("22px Poppins"),document.fonts.load("700 16px Poppins")])}catch{}
 if(f.img)return composeImg(cv,f,photos,s);
 const t=f.th?G(f.th,f.slots,f.name):(T[f.id]||T["good-mood"]),n=f.slots,W=600,sw=W-2*t.side,sh=Math.round(sw*(t.ar||.75)),H=t.top+n*sh+(n-1)*t.gap+t.bottom;
 cv.width=W*s;cv.height=H*s;const x=cv.getContext("2d");x.setTransform(s,0,0,s,0,0);
 const rc=Array.from({length:n},(_,k)=>({x:t.side,y:t.top+k*(sh+t.gap),w:sw,h:sh,rot:t.rot?t.rot[k%t.rot.length]:0}));
 t.bg(x,W,H);
 for(let k=0;k<n;k++)photo(x,await safe(photos[k%photos.length]),rc[k],{rd:14,...t.pf});
 t.fg(x,W,H,rc);finish(x,W,H,t.fin||FIN[f.id]||{ac:"#fff",st:"#fff"});
}
