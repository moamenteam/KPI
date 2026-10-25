/* First Brand shared theme loader — add to every page's <head>:
     <link rel="stylesheet" href="./theme.css">
     <script src="./theme.js"></script>
   Always applies the SnowUI theme (from the free SnowUI dashboard kit by ByeWind). */
(function(){
  var root=document.documentElement;
  // fonts: Inter (English) + IBM Plex Sans Arabic (Arabic)
  var f=document.createElement("link"); f.rel="stylesheet";
  f.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap";
  document.head.appendChild(f);
  // SnowUI is the one look for every page
  root.dataset.ui="snow";
  root.dataset.page=((location.pathname.split("/").pop()||"index.html").replace(".html",""))||"index";
  // remove colours a page may still set inline from old "Look & logo" settings
  function clean(){ ["--teal","--teal-soft","--teal2","--ink","--pri","--pri-soft"].forEach(function(p){ root.style.removeProperty(p); }); }
  clean();
  new MutationObserver(function(){
    if(root.dataset.ui!=="snow") root.dataset.ui="snow";
    if(root.style.getPropertyValue("--teal")||root.style.getPropertyValue("--ink")||root.style.getPropertyValue("--pri")) clean();
  }).observe(root,{attributes:true,attributeFilter:["style","data-ui"]});
})();
