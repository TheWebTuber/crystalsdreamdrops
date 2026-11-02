(()=>{'use strict';
 const button=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
 if(button&&nav){button.addEventListener('click',()=>{const on=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!on));button.setAttribute('aria-label',on?'Open menu':'Close menu');nav.classList.toggle('is-open',!on)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open menu');nav.classList.remove('is-open')}));}
 // The locally rendered fairy image stays as the fallback until the YouTube API returns a channel portrait.
 const fallback='https://dreamdropscrew.creatorpromote.com/img/jd.png';
 document.querySelectorAll('#main-avatar,#emote-avatar').forEach(img=>{const fallback=location.pathname.includes('/emotes')?'../img/flower-mark.svg':'img/flower-mark.svg';const recover=()=>{if(!img.src.includes('flower-mark.svg'))img.src=fallback};img.addEventListener('error',recover);if(img.complete&&img.naturalWidth===0)recover()});
 window.CRYSTAL_PROFILE_FALLBACK=fallback;
 window.CRYSTAL_setAvatar=(url)=>{
   if(typeof url!=='string')return;
   try{const u=new URL(url);if(u.protocol!=='https:'||!/(^|\.)(googleusercontent\.com|ytimg\.com)$/.test(u.hostname))return;}catch{return;}
   ['main-avatar','emote-avatar'].forEach(id=>{const e=document.getElementById(id);if(e){e.src=url;e.referrerPolicy='no-referrer'}});
   const fav=document.querySelector('#site-favicon');if(fav){fav.href=url;fav.removeAttribute('type');}
 };
})();
