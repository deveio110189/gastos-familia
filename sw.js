// Atualizar este número força todos os celulares a baixar a versão nova
const CACHE = 'gastos-familia-v6';
const ASSETS = [
  '/gastos-familia/',
  '/gastos-familia/index.html',
  '/gastos-familia/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // Ativa imediatamente sem esperar fechar o app
});

self.addEventListener('activate', e => {
  // Apaga TODOS os caches antigos automaticamente
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] Deletando cache antigo:', k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim(); // Assume controle imediato de todas as abas
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Estratégia: tenta rede primeiro, cai pro cache se offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
