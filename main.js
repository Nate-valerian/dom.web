const CONTACT_LINKS = {
  whatsapp: 'https://wa.me/79850932711',
  telegram: 'https://t.me/domwomenspace',
  max: 'https://max.ru/domwomenspace'
};

(function(){
  var form=document.getElementById('contactForm');
  var whatsApp=document.getElementById('contactSubmit');
  var telegram=document.getElementById('telegramContact');
  var max=document.getElementById('maxContact');
  if(!form||!whatsApp)return;
  function val(id){var el=document.getElementById(id);return el&&el.value.trim()?el.value.trim():'';}
  function message(){
    var lines=['Здравствуйте! Хочу записаться в ДОМ.'];
    var name=val('contactName'), phone=val('contactPhone'), program=val('contactProgram'), date=val('contactDate'), promo=val('contactPromo');
    if(name)lines.push('Имя: '+name);
    if(phone)lines.push('Контакт: '+phone);
    if(program)lines.push('Формат: '+program);
    if(date)lines.push('Дата/место: '+date);
    if(promo)lines.push('Промокод: '+promo);
    return lines.join('\n');
  }
  function buildLinks(){
    whatsApp.href=CONTACT_LINKS.whatsapp+'?text='+encodeURIComponent(message());
    if(telegram)telegram.href=CONTACT_LINKS.telegram;
    if(max)max.href=CONTACT_LINKS.max;
  }
  form.addEventListener('input',buildLinks);
  form.addEventListener('submit',function(e){e.preventDefault();buildLinks();window.open(whatsApp.href,'_blank','noopener');});
  whatsApp.addEventListener('click',buildLinks);
  buildLinks();
})();

/* ── CURSOR ── */
const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;cur2.style.left=rx+'px';cur2.style.top=ry+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,.pillar,.prog-card,.whom-card,.gs,.choice-card,.round-circle,.format-tab').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='10px';cur.style.height='10px';cur2.style.width='50px';cur2.style.height='50px'});
  el.addEventListener('mouseleave',()=>{cur.style.width='6px';cur.style.height='6px';cur2.style.width='32px';cur2.style.height='32px'});
});

/* ── SPARKLES ── */
const canvas=document.getElementById('sparkle-canvas');
const ctx=canvas.getContext('2d');
let W,H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();
window.addEventListener('resize',resize);

const sparks=[];
const MAX=80;

document.addEventListener('mousemove',e=>{
  if(Math.random()<.35&&sparks.length<MAX){
    sparks.push({
      x:e.clientX,y:e.clientY,
      vx:(Math.random()-.5)*2.5,
      vy:(Math.random()-1.2)*2.5,
      r:Math.random()*2.5+.5,
      life:1,
      decay:Math.random()*.025+.015,
      hue:Math.random()*20+40
    });
  }
});

function drawSparks(){
  ctx.clearRect(0,0,W,H);
  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i];
    s.x+=s.vx;s.y+=s.vy;s.vy+=.06;s.life-=s.decay;
    if(s.life<=0){sparks.splice(i,1);continue}
    ctx.save();
    ctx.globalAlpha=s.life*.9;
    // star shape
    const a=s.r*2;
    ctx.beginPath();
    for(let p=0;p<5;p++){
      const angle=(p*4*Math.PI/5)-Math.PI/2;
      const innerAngle=angle+Math.PI/5;
      p===0?ctx.moveTo(s.x+a*Math.cos(angle),s.y+a*Math.sin(angle)):ctx.lineTo(s.x+a*Math.cos(angle),s.y+a*Math.sin(angle));
      ctx.lineTo(s.x+(a*.4)*Math.cos(innerAngle),s.y+(a*.4)*Math.sin(innerAngle));
    }
    ctx.closePath();
    ctx.fillStyle=`hsl(${s.hue}, 80%, 72%)`;
    ctx.fill();
    // glow
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r*.7,0,Math.PI*2);
    ctx.fillStyle=`hsla(${s.hue},90%,85%,${s.life*.5})`;
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(drawSparks);
}
drawSparks();

/* ── PARTICLES ── */
const pp=document.getElementById('particles');
for(let i=0;i<38;i++){const d=document.createElement('div');d.className='p';d.style.cssText=`left:${Math.random()*100}%;width:${Math.random()*2.5+.5}px;height:${Math.random()*2.5+.5}px;animation-duration:${Math.random()*16+10}s;animation-delay:${Math.random()*16}s`;pp.appendChild(d)}

/* ── NAV SCROLL ── */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>60));

/* ── FADE UP ── */
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('v')}),{threshold:.06});
document.querySelectorAll('.fu').forEach(el=>obs.observe(el));

/* ── TABS ── */
function switchTab(id,btn){
  document.querySelectorAll('.format-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.format-pane').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pane-'+id).classList.add('active');
}

/* ══════════════════════════════════
   BACKGROUND TEXTURE PAINTER
   Inspired by DOM walls: black velvet
   with organic gold mineral veins
══════════════════════════════════ */
(function(){
  const c = document.getElementById('bg-canvas');
  const g = c.getContext('2d');
  let W, H;

  function resize(){
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    paint();
  }

  function noise(x, y, seed){
    // Simple smooth noise using sin
    return (Math.sin(x * 0.3 + seed) * Math.cos(y * 0.2 + seed * 1.3) +
            Math.sin(x * 0.07 + seed * 2.1) * Math.cos(y * 0.11 + seed) +
            Math.sin(x * 0.019 + seed * 0.7) * Math.cos(y * 0.023 + seed * 1.7)) / 3;
  }

  function fbm(x, y, octaves){
    let v = 0, amp = 0.5, freq = 1;
    for(let i=0;i<octaves;i++){
      v += noise(x*freq, y*freq, i*17.3) * amp;
      amp *= 0.5; freq *= 2.1;
    }
    return v;
  }

  function paint(){
    // Base: deep black
    g.fillStyle = '#07070d';
    g.fillRect(0, 0, W, H);

    // Build texture pixel by pixel via ImageData for performance
    const idata = g.createImageData(W, H);
    const d = idata.data;

    for(let y=0;y<H;y+=2){
      for(let x=0;x<W;x+=2){
        const nx = x / W * 6;
        const ny = y / H * 9;

        // Fractal brownian motion for organic texture
        const f = fbm(nx, ny, 5);
        const f2 = fbm(nx + f * 1.8, ny + f * 1.4, 4);
        const f3 = fbm(nx + f2 * 2.2, ny + f2 * 1.9, 3);

        // Base darkness with warm undertone (like burnt copper wall)
        const base = (f3 + 1) * 0.5;
        
        // Gold vein logic: high-contrast narrow bands
        const vein = Math.pow(Math.max(0, 1 - Math.abs(f2 * 3.5)), 3.5);
        const vein2 = Math.pow(Math.max(0, 1 - Math.abs(f3 * 4.2)), 4);
        
        // Mineral pitting (the black pits in your wall)
        const pit = Math.pow(Math.max(0, -f * 2.5), 2);

        // Depth variation
        const depth = (fbm(nx*1.5, ny*1.5, 3) + 1) * 0.5;

        // Color channels
        // R: warm dark base + gold vein
        const r = Math.min(255, Math.round(
          base * 22 +           // very dark base
          depth * 8 +           // slight depth variation
          vein * 120 +          // primary gold vein
          vein2 * 80 +          // secondary vein
          pit * 3               // pits stay dark
        ));

        // G: slightly less gold (copper tones)
        const gv = Math.min(255, Math.round(
          base * 14 +
          depth * 5 +
          vein * 78 +
          vein2 * 50
        ));

        // B: very dark, slight blue in shadows
        const b = Math.min(255, Math.round(
          base * 8 +
          depth * 3 +
          vein * 25 +
          vein2 * 15
        ));

        // Write 2x2 block for performance
        const i = (y * W + x) * 4;
        d[i]=r; d[i+1]=gv; d[i+2]=b; d[i+3]=255;
        d[i+4]=r; d[i+5]=gv; d[i+6]=b; d[i+7]=255;
        if(y+1<H){
          const i2 = ((y+1)*W+x)*4;
          d[i2]=r; d[i2+1]=gv; d[i2+2]=b; d[i2+3]=255;
          d[i2+4]=r; d[i2+5]=gv; d[i2+6]=b; d[i2+7]=255;
        }
      }
    }
    g.putImageData(idata, 0, 0);

    // Large atmospheric glow overlays (like light hitting the wall)
    // Warm gold spotlight top-left
    const g1 = g.createRadialGradient(W*0.25, H*0.2, 0, W*0.25, H*0.2, W*0.55);
    g1.addColorStop(0, 'rgba(180,130,40,0.18)');
    g1.addColorStop(0.5,'rgba(120,80,20,0.08)');
    g1.addColorStop(1, 'transparent');
    g.fillStyle=g1; g.fillRect(0,0,W,H);

    // Cooler shadow bottom-right
    const g2 = g.createRadialGradient(W*0.8, H*0.85, 0, W*0.8, H*0.85, W*0.5);
    g2.addColorStop(0, 'rgba(5,3,1,0.45)');
    g2.addColorStop(1, 'transparent');
    g.fillStyle=g2; g.fillRect(0,0,W,H);

    // Subtle warm streak across middle
    const g3 = g.createLinearGradient(0, H*0.45, W, H*0.55);
    g3.addColorStop(0,'transparent');
    g3.addColorStop(0.35,'rgba(140,95,25,0.06)');
    g3.addColorStop(0.65,'rgba(160,110,30,0.09)');
    g3.addColorStop(1,'transparent');
    g.fillStyle=g3; g.fillRect(0,0,W,H);
  }

  window.addEventListener('resize', resize);
  resize();
})();



function toggleAcc(slug){
  var item = document.getElementById('acc-'+slug);
  var isOpen = item.classList.contains('open');
  // close all in same pane
  var pane = item.closest('.format-pane');
  pane.querySelectorAll('.prog-acc-item.open').forEach(function(el){
    if(el !== item) el.classList.remove('open');
  });
  item.classList.toggle('open', !isOpen);
}

(function(){
  document.querySelectorAll('.media-card video source').forEach(function(source){
    source.addEventListener('error',function(){
      var card = source.closest('.media-card');
      if(card) card.classList.add('media-missing');
    });
  });
})();








function ckAccept(){try{localStorage.setItem('dom_ck','1');}catch(e){}document.getElementById('ckBanner').classList.remove('show');}
function ckDecline(){try{localStorage.setItem('dom_ck','0');}catch(e){}document.getElementById('ckBanner').classList.remove('show');}
(function(){
  var consent=null;
  try{consent=localStorage.getItem('dom_ck');}catch(e){}
  if(consent===null){
    setTimeout(function(){document.getElementById('ckBanner').classList.add('show');},2000);
  }
})();

function toggleLegal(id){
  var body=document.getElementById('lb-'+id);
  var tab=document.getElementById('lt-'+id);
  var isOpen=body.classList.contains('open');
  // close all
  document.querySelectorAll('.legal-body').forEach(function(b){b.classList.remove('open')});
  document.querySelectorAll('.legal-tab').forEach(function(t){t.classList.remove('open')});
  if(!isOpen){body.classList.add('open');tab.classList.add('open');}
}
