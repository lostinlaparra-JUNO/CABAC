const C='cabac-v21';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./rotulo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.endsWith('supabase.co'))return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put('./index.html',cp));return r}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{
    if(r.ok&&(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.hostname))){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return r})));
});
