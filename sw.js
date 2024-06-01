const version = "9";
const swCacheBase = 'okb-v' + version; // Estático
const swCacheNovo = 'okn-v' + version; // Dinamico

// Assets do cache Base:
const swAssets = [
	'./',
	'./index.html',
	'./app.js',
	'./css/bootstrap-icons/font/bootstrap-icons.css',
	'./css/bootstrap-icons/font/bootstrap-icons.min.css',
	'./css/bootstrap-icons/font/fonts/bootstrap-icons.woff',
	'./css/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
	'./css/bootstrap.min.css',
	'./css/divListagem.css',
	'./css/mk.css',
	'./css/reset.css',
	'./css/site.css',
	'./html/offline.html',
	'./img/icons/ok_72.png',
	'./img/icons/ok_96.png',
	'./img/icons/ok_128.png',
	'./img/icons/ok_144.png',
	'./img/icons/ok_152.png',
	'./img/icons/ok_192.png',
	'./img/icons/ok_384.png',
	'./img/icons/ok_512.png',
	'./img/icons/ok_mask_196.png',
	'./js/mkt.js',
	'./js/popperv2.js',
	'./js/site.js',
];

const sw_cacheUpdate = (cache) => {
	console.log('UPDATING CACHE');
	const stack = [];
	swAssets.forEach((rota) => stack.push(
		cache.add(rota).catch(_ => console.log(`%cSW:%c FALHA ao fazer CACHE nesta rota > ${rota}`, "color:green;", "background-color:black;color:red;"))
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
	console.log(`%cSW:%c INSTALL`, "color:green;", "color:yellow;");
	ev.waitUntil(caches.open(swCacheBase).then(sw_cacheUpdate));
});

// Ao ativar nova versão
self.addEventListener("activate", ev => {
	console.log(`%cSW:%c ACTIVATE`, "color:green;", "color:lightblue;");
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