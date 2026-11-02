/* On the emote page, read the saved YouTube avatar from an earlier main-page visit.
   A fresh direct API request is only needed when there is no cached avatar. */
(()=>{
 const cfg=window.CRYSTAL_YOUTUBE_CONFIG||{};
 const key=String(cfg.apiKey||'').trim();const handle=String(cfg.channelHandle||'Crystalsdreamdrops').replace(/^@/,'');
 const cacheKey='crystal-youtube-avatar-v1-'+handle.toLowerCase();
 const okay=key.length>15&&!/PASTE|PLACEHOLDER|YOUR_/i.test(key);
 function apply(url){window.CRYSTAL_setAvatar?.(url)}
 try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(saved&&Date.now()-saved.time<7*24*60*60*1000)apply(saved.url)}catch{}
 if(!okay)return;
 fetch('https://www.googleapis.com/youtube/v3/channels?'+new URLSearchParams({part:'snippet',forHandle:handle,key})).then(r=>r.ok?r.json():null).then(o=>{const t=o?.items?.[0]?.snippet?.thumbnails||{};const url=(t.high||t.medium||t.default)?.url;if(url){apply(url);try{localStorage.setItem(cacheKey,JSON.stringify({time:Date.now(),url}))}catch{}}}).catch(()=>{});
})();
