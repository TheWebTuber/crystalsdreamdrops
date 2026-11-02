/* Emotes gallery — uses user's EXISTING jdgifs.json and GIF/image files.
   Search, sort, original filename display and one-click copy link preserved.
   No invented GIFs. No server or API required. */
(()=>{'use strict';
 const config=window.CRYSTAL_EMOTE_CONFIG||{};
 const gallery=document.getElementById('gallery'),search=document.getElementById('emote-search'),sort=document.getElementById('emote-sort');
 const counter=document.getElementById('gallery-count'),empty=document.getElementById('emote-empty'),emptyTitle=document.getElementById('emote-empty-title'),emptyMessage=document.getElementById('emote-empty-message');
 let all=[];
 const manifestUrls=config.manifestUrls||['./jdgifs.json','../jdgifs.json'];
 const bases=config.imageBaseUrls||['./jdemotes/','../jdemotes/','./'];
 const create=(tag,cls,content)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;return el};
 const filename=(file)=>String(file).split('/').pop()||'';
 function candidates(file){if(/^https?:\/\//i.test(file))return [file];if(file.startsWith('/'))return [new URL(file,document.baseURI).href];return bases.map(base=>new URL(base+file,document.baseURI).href)}
 function normalize(input){const list=Array.isArray(input)?input:Array.isArray(input?.gifs)?input.gifs:Array.isArray(input?.emotes)?input.emotes:[];return list.map((x)=>typeof x==='string'?{file:x,title:filename(x).replace(/\.[^.]+$/,'').replace(/[_-]/g,' ')}:{file:String(x.file||x.filename||x.src||x.url||''),title:String(x.name||x.title||filename(x.file||x.src||x.url||'').replace(/\.[^.]+$/,'').replace(/[_-]/g,' '))}).filter(x=>x.file&&!x.file.includes('..')).filter(x=>/\.(gif|png|jpe?g|webp|apng)(\?.*)?$/i.test(x.file));}
 function setEmpty(title,message){gallery.replaceChildren();counter.textContent='0 emotes';empty.hidden=false;emptyTitle.textContent=title;emptyMessage.textContent=message;}
 function render(){const query=search.value.trim().toLowerCase();const results=all.filter(x=>x.title.toLowerCase().includes(query)||filename(x.file).toLowerCase().includes(query)).sort((a,b)=>a.title.localeCompare(b.title));if(sort.value==='reverse')results.reverse();gallery.replaceChildren();counter.textContent=results.length+' of '+all.length+' emotes';empty.hidden=results.length>0;if(!results.length){emptyTitle.textContent=query?'No blooms found for that search.':'The garden is resting.';emptyMessage.textContent=query?'Try a different name or clear your search.':'There are no emotes in the current manifest.';return}
 const fragment=document.createDocumentFragment();
 for(const emote of results){
  const c=create('article','emote-card'),box=create('div','emote-img-wrap'),img=create('img');img.alt=emote.title;img.loading='lazy';img.decoding='async';let urls=candidates(emote.file),i=0;img.src=urls[0];img.onerror=()=>{i++;if(i<urls.length)img.src=urls[i];else{img.onerror=null;img.alt='Image unavailable: '+emote.title;}};box.append(img);
  const title=create('div','emote-title',emote.title),button=create('button','emote-copy','Copy link');button.type='button';button.setAttribute('aria-label','Copy link for '+emote.title);
  button.addEventListener('click',async()=>{const url=img.currentSrc||img.src;try{await navigator.clipboard.writeText(url);button.textContent='Copied! ✓';button.classList.add('copied');setTimeout(()=>{button.textContent='Copy link';button.classList.remove('copied')},1700)}catch{const input=document.createElement('textarea');input.value=url;input.setAttribute('readonly','');input.style.position='fixed';input.style.left='-9999px';document.body.append(input);input.select();const worked=document.execCommand('copy');input.remove();button.textContent=worked?'Copied! ✓':'Copy failed';setTimeout(()=>{button.textContent='Copy link'},1700)}});
  c.append(box,title,button);fragment.append(c);
 }gallery.append(fragment)
 }
 async function load(){counter.textContent='Loading emotes…';for(const u of manifestUrls){try{const res=await fetch(u,{cache:'no-cache'});if(!res.ok)continue;const data=await res.json();const items=normalize(data);if(!Array.isArray(data)&&!Array.isArray(data?.gifs)&&!Array.isArray(data?.emotes))continue;all=items;render();return;}catch(err){console.info('Emote manifest not found at',u)}}setEmpty('The emotes need their home.','The original GIF collection was not included in the redesign. Copy your existing jdgifs.json and jdemotes/ folder into the uploaded site, or update emotes/emote-config.js with their actual paths.');}
 search.addEventListener('input',render);sort.addEventListener('change',render);load();
})();
