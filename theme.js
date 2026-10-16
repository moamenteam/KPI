/* First Brand shared theme loader — add to every page's <head>:
     <link rel="stylesheet" href="./theme.css">
     <script src="./theme.js"></script>
   Picks the interface style from Supabase app_settings (brand.ui), remembers it to avoid a flash,
   and lets you preview with ?theme=glass3d | rustic | flat. */
(function(){
  var URL_="https://occubmnoepgdysbyacgj.supabase.co", KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jY3VibW5vZXBnZHlzYnlhY2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjYzMTksImV4cCI6MjEwNDQ0MjMxOX0.tATa_FtKbo6MMgaJX4XqrUqJeYnT3RSu9A03dt8fIyc";
  var root=document.documentElement, OWN=["rustic","glass3d"];
  // fonts
  var f=document.createElement("link"); f.rel="stylesheet";
  f.href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Cinzel:wght@600;700&display=swap"; document.head.appendChild(f);
  function apply(ui){ if(!ui) return; root.dataset.ui=ui; try{ localStorage.setItem("fb_ui",ui); }catch(e){} clean(); }
  // themes with their own colours: drop colour variables a page script may set inline
  function clean(){ if(OWN.indexOf(root.dataset.ui)<0) return; ["--teal","--teal-soft","--ink"].forEach(function(p){ root.style.removeProperty(p); }); }
  new MutationObserver(function(){ if(root.dataset.ui && OWN.indexOf(root.dataset.ui)>=0 && root.style.getPropertyValue("--teal")) clean(); })
    .observe(root,{attributes:true,attributeFilter:["style","data-ui"]});
  var q=new URLSearchParams(location.search).get("theme");
  if(q){ root.dataset.ui=q; clean(); }
  else {
    try{ var c=localStorage.getItem("fb_ui"); if(c) apply(c); }catch(e){}
    fetch(URL_+"/rest/v1/app_settings?key=eq.brand&select=value",{headers:{apikey:KEY,Authorization:"Bearer "+KEY}})
      .then(function(r){ return r.json(); }).then(function(d){ var v=d&&d[0]&&d[0].value; if(v&&v.ui) apply(v.ui); }).catch(function(){});
  }
  // 3D shapes: inside score cards (.mo) when present, otherwise one soft corner decoration per page
  var ART='<svg class="iso-art" viewBox="0 0 220 190" aria-hidden="true"> <defs> <linearGradient id="isoL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F0BCCD"/><stop offset="1" stop-color="#C9B8E2"/></linearGradient> <linearGradient id="isoR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3B5CE"/><stop offset="1" stop-color="#9FAEDB"/></linearGradient> <linearGradient id="isoT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8A3B6"/><stop offset="1" stop-color="#8D97C2"/></linearGradient> <radialGradient id="isoS" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#F3C3D3"/><stop offset=".55" stop-color="#B7B5DE"/><stop offset="1" stop-color="#7E8DC0"/></radialGradient> <linearGradient id="isoC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A9B3DC"/><stop offset=".45" stop-color="#F0BCCD"/><stop offset="1" stop-color="#7F8EC1"/></linearGradient> </defs> <polygon points="110,92 210,130 110,168 10,130" fill="url(#isoT)"/> <polygon points="10,130 110,168 110,190 10,190" fill="url(#isoL)"/> <polygon points="110,168 210,130 210,190 110,190" fill="url(#isoR)"/> <ellipse cx="62" cy="132" rx="20" ry="6" fill="rgba(40,46,80,.35)"/> <circle cx="58" cy="116" r="19" fill="url(#isoS)"/> <polygon points="96,24 116,16 136,24 136,104 116,112 96,104" fill="url(#isoR)"/> <polygon points="96,24 116,32 116,112 96,104" fill="url(#isoL)"/> <polygon points="96,24 116,16 136,24 116,32" fill="#C9A9C3"/> <path d="M118 96 L104 138 Q118 146 132 138 Z" fill="url(#isoC)"/> <polygon points="140,112 152,107 164,112 164,126 152,131 140,126" fill="url(#isoR)"/> <polygon points="140,112 152,117 152,131 140,126" fill="url(#isoL)"/> <polygon points="140,112 152,107 164,112 152,117" fill="#CFAFC6"/> <ellipse cx="182" cy="124" rx="22" ry="6" fill="rgba(40,46,80,.35)"/> <circle cx="180" cy="102" r="26" fill="url(#isoS)"/> </svg>';
  function decorate(){
    document.querySelectorAll(".mo:not([data-iso])").forEach(function(m){ m.dataset.iso="1"; if(!m.querySelector(".iso-art")) m.insertAdjacentHTML("afterbegin",ART); });
    if(!document.querySelector(".mo") && !document.querySelector(".fb-iso-corner") && document.body){
      document.body.insertAdjacentHTML("beforeend",ART.replace('class="iso-art"','class="fb-iso-corner"')); }
  }
  document.addEventListener("DOMContentLoaded",function(){ decorate(); new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true}); });
})();
