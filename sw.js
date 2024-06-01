const swCacheBase = 'okb-v2'; // Estático
const swCacheNovo = 'okn-v2'; // Dinamico

// Assets do cache Base:
const swAssets = [
	'./',
	'./html/offline.html',
	'./index.html',
	'./js/app.js',
	'./js/mkt.js',
	'./js/popperv2.js',
	'./js/site.js',
	'./css/reset.css',
	'./css/divListagem.css',
	'./css/bootstrap-icons/font/bootstrap-icons.css',
	'./css/bootstrap.min.css',
	'./css/mk.css',
	'./css/site.css',
	'./img/icons/ok_512.png',
];

const sw_cacheUpdate = (cache) => {
	console.log('UPDATING CACHE');
	const stack = [];
	swAssets.forEach((rota) => stack.push(
		cache.add(rota).catch(_ => console.error(`SW Falhou no cache do item: ${rota}`))
	));
	return Promise.all(stack);
};

// cache size limit function
const sw_cacheLimitSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if (keys.length > size) {
				cache.delete(keys[0]).then(sw_cacheLimitSize(name, size));
			}
		});
	});
};

// Ao instalar uma nova versão
self.addEventListener('install', ev => {
	//console.log('service worker installed');
	ev.waitUntil(caches.open(swCacheBase).then(sw_cacheUpdate));
});

// Ao ativar nova versão
self.addEventListener("activate", ev => {
	// console.log("SW Ativado: ", ev);
	ev.waitUntil(
		caches.keys().then(versoesCache => {
			return Promise.all(versoesCache
				.filter(k => k !== swCacheBase && k !== swCacheNovo)
				.map(k => caches.delete(k))
			);
		})
	);
})

// Proxy
self.addEventListener("fetch", ev => {
	// console.log("Request: ", ev.request);
	ev.respondWith(
		caches.match(ev.request).then(cacheRes => {
			return cacheRes || fetch(ev.request).then(fetchRes => {
				return caches.open(swCacheNovo).then(cache => {
					cache.put(ev.request.url, fetchRes.clone());
					sw_cacheLimitSize(swCacheNovo, 50);
					return fetchRes;
				})
			});
		}).catch(() => {
			if (ev.request.url.indexOf('.html') > -1) {
				return caches.match(swAssets[1]);
			}
		})
	);
})