/* Optional analytics: never send shared URLs, journey inputs or concession choices. */
(()=>{
  const key='london-fare-check-analytics',id='G-RH4RRXHSKV',page='https://fedianine.com/tfl/calculator.html';
  let enabled=false,loaded=false,interacted=false,timer,last='';
  const status=document.getElementById('analytics-status'),panel=document.getElementById('analytics-preferences');
  const privacySignal=navigator.globalPrivacyControl||navigator.doNotTrack==='1';
  function saved(){try{return localStorage.getItem(key);}catch{return null;}}
  function remember(v){try{localStorage.setItem(key,v);}catch{}}
  function enable(){
    if(privacySignal){status.textContent='Analytics stays off because your browser requests privacy.';return;}
    enabled=true;remember('yes');status.textContent='Optional analytics is on. Travel choices and shared links are never sent.';
    if(loaded){gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});return;}
    loaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:page,page_referrer:document.referrer?new URL(document.referrer).origin:''});
    gtag('event','page_view',{page_location:page,page_title:'London Travelcard vs Pay As You Go Calculator',page_referrer:document.referrer?new URL(document.referrer).origin:''});
    const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(tag);
  }
  function disable(){
    enabled=false;remember('no');clearTimeout(timer);if(window.gtag)gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    for(const name of document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(n=>n==='_ga'||n.startsWith('_ga_')))for(const domain of ['',location.hostname,'.'+location.hostname])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'');
    status.textContent='Optional analytics is off.';
  }
  document.getElementById('analytics-allow').addEventListener('click',enable);document.getElementById('analytics-decline').addEventListener('click',disable);
  document.addEventListener('input',e=>{if(e.target.closest('#travel-form'))interacted=true;},true);
  document.addEventListener('click',e=>{if(e.target.closest('#travel-form'))interacted=true;},true);
  function track(name,data={}){if(enabled&&window.gtag)gtag('event',name,{...data,page_location:page});}
  window.LondonAnalytics={result(r,custom){if(!interacted)return;clearTimeout(timer);timer=setTimeout(()=>{const next=r.winner+':'+custom;if(next!==last){last=next;track('comparison_completed',{recommendation:r.winner,plan_type:custom?'weekly':'usual'});}},800);},share(){track('share_comparison');}};
  if(privacySignal){status.textContent='Analytics is off because your browser requests privacy.';document.getElementById('analytics-allow').disabled=true;}
  else if(saved()==='yes')enable();
  else if(saved()==='no')status.textContent='Optional analytics is off.';
  panel.addEventListener('toggle',()=>{if(panel.open&&saved()===null)status.textContent='Analytics is off. You can optionally help us understand whether this calculator is useful.';});
})();
