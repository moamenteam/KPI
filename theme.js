/* First Brand shared theme loader — add to every page's <head>:
     <link rel="stylesheet" href="./theme.css">
     <script src="./theme.js"></script>
   Always applies the "Clay" theme, plus optional site sound:
     • a soft light-piano background (generated in the browser, no audio file)
     • a "ding" whenever a page shows a message (Saved, contact logged, …)
   Sound is OFF until the user presses the ♪ button; the choice is remembered on that device. */
(function(){
  var root=document.documentElement, UI="clay";
  // fonts: Poppins (English) + IBM Plex Sans Arabic (Arabic)
  var f=document.createElement("link"); f.rel="stylesheet";
  f.href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap";
  document.head.appendChild(f);
  // Clay is the one look for every page
  root.dataset.ui=UI;
  root.dataset.page=((location.pathname.split("/").pop()||"index.html").replace(".html",""))||"index";
  // remove colours a page may still set inline from old "Look & logo" settings
  function clean(){ ["--teal","--teal-soft","--teal2","--ink","--pri","--pri-soft"].forEach(function(p){ root.style.removeProperty(p); }); }
  clean();
  new MutationObserver(function(){
    if(root.dataset.ui!==UI) root.dataset.ui=UI;
    if(root.style.getPropertyValue("--teal")||root.style.getPropertyValue("--ink")||root.style.getPropertyValue("--pri")) clean();
  }).observe(root,{attributes:true,attributeFilter:["style","data-ui"]});

  /* ======================= SOUND ======================= */
  var KEY="fb_sound", VOLUME=0.22;                 // background volume (0–1)
  var on=false; try{ on=localStorage.getItem(KEY)==="on"; }catch(e){}
  var ctx=null, master=null, music=null, timer=null, step=0, btn=null;
  function mtof(m){ return 440*Math.pow(2,(m-69)/12); }
  function audio(){
    if(ctx) return true;
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
    ctx=new AC(); master=ctx.createGain(); master.gain.value=1; master.connect(ctx.destination);
    // soft echo so the piano sounds roomy
    music=ctx.createGain(); music.gain.value=0;
    var dl=ctx.createDelay(1), fb=ctx.createGain(), wet=ctx.createGain(), lp=ctx.createBiquadFilter();
    dl.delayTime.value=.33; fb.gain.value=.32; wet.gain.value=.35; lp.type="lowpass"; lp.frequency.value=2400;
    music.connect(master); music.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(master);
    return true;
  }
  function note(freq,t,dur,g,dest,type){
    var o=ctx.createOscillator(), v=ctx.createGain(), fl=ctx.createBiquadFilter();
    o.type=type||"triangle"; o.frequency.setValueAtTime(freq,t); fl.type="lowpass"; fl.frequency.value=2600;
    v.gain.setValueAtTime(0,t); v.gain.linearRampToValueAtTime(g,t+.008); v.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(fl); fl.connect(v); v.connect(dest); o.start(t); o.stop(t+dur+.05);
  }
  // light piano: gentle chord every 4 s + a soft pentatonic melody
  var CHORDS=[[48,55,64],[45,52,60],[41,48,57],[43,50,59]], SCALE=[72,74,76,79,81,84];
  function pianoStep(){
    var t=ctx.currentTime+.05;
    if(step%8===0) CHORDS[(step/8)%4].forEach(function(m){ note(mtof(m),t,3.2,.07,music); });
    if(Math.random()<.55){ var m=SCALE[Math.floor(Math.random()*SCALE.length)]; note(mtof(m),t,1.8,.10,music); note(mtof(m+12),t,.6,.025,music,"sine"); }
    step++;
  }
  function startMusic(){
    if(!audio()) return; ctx.resume();
    if(!timer){ step=0; pianoStep(); timer=setInterval(pianoStep,500); }
    music.gain.cancelScheduledValues(ctx.currentTime); music.gain.setTargetAtTime(VOLUME,ctx.currentTime,1.2);   // fade in
  }
  function stopMusic(){
    if(!ctx) return;
    music.gain.cancelScheduledValues(ctx.currentTime); music.gain.setTargetAtTime(0,ctx.currentTime,.4);       // fade out
    setTimeout(function(){ if(!on && timer){ clearInterval(timer); timer=null; } },1500);
  }
  function ding(){
    if(!on||!audio()) return; ctx.resume(); var t=ctx.currentTime+.02;
    note(1046,t,1.4,.28,master,"sine"); note(2093,t,.8,.07,master,"sine"); note(1568,t+.12,1.2,.14,master,"sine");
  }
  window.fbDing=ding;   // pages can call fbDing() for their own notifications

  // the ♪ button
  var ICON_ON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
  var ICON_OFF='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M3 3l18 18"/></svg>';
  function paint(){
    if(!btn) return; var ar=(root.lang||"").indexOf("ar")===0;
    btn.innerHTML=on?ICON_ON:ICON_OFF; btn.classList.toggle("on",on);
    var lab=on?(ar?"إيقاف الصوت":"Turn sound off"):(ar?"تشغيل الصوت":"Turn sound on");
    btn.title=lab; btn.setAttribute("aria-label",lab); btn.setAttribute("aria-pressed",on?"true":"false");
  }
  function toggle(){
    on=!on; try{ localStorage.setItem(KEY,on?"on":"off"); }catch(e){}
    if(on){ startMusic(); ding(); } else stopMusic(); paint();
  }
  function addButton(){
    if(btn||!document.body) return;
    btn=document.createElement("button"); btn.type="button"; btn.className="fb-sound"; btn.addEventListener("click",function(e){ e.stopPropagation(); toggle(); });
    document.body.appendChild(btn); paint();
    new MutationObserver(paint).observe(root,{attributes:true,attributeFilter:["lang"]});
  }
  // browsers only allow sound after a tap/click: if sound was left on, resume on the first one
  function firstTouch(){ if(on) startMusic(); document.removeEventListener("pointerdown",firstTouch,true); document.removeEventListener("keydown",firstTouch,true); }
  document.addEventListener("pointerdown",firstTouch,true); document.addEventListener("keydown",firstTouch,true);
  // ding when a page shows a message (".toast"), but not for error messages
  function watchToasts(){
    new MutationObserver(function(list){
      for(var i=0;i<list.length;i++){ var a=list[i].addedNodes;
        for(var j=0;j<a.length;j++){ var n=a[j]; if(n.nodeType!==1) continue;
          var el=n.classList&&n.classList.contains("toast")? n : (n.querySelector&&n.querySelector(".toast"));
          if(el && !el.classList.contains("err") && !el.classList.contains("bad")){ ding(); return; } } }
    }).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){ addButton(); watchToasts(); });
  else { addButton(); watchToasts(); }
})();
