const swCache = 'site-static';
const swAssets = [
	'/',
	'/index.html',
	'/js/app.js',
	'/js/mkt.js',
	'/js/popperv2.js',
	'/js/site.js',
	'/css/reset.css',
	'/css/bootstrap.min.css',
	'/css/bootstrap.min.css.map',
	'/css/mk.css',
	'/css/site.css',
	'/img/icons/ok_512.png',
];

const sw_cacheUpdate = (cache) => {
	console.log('UPDATING CACHE');
	const stack = [];
	swAssets.forEach((rota) => stack.push(
		cache.add(rota).catch(_ => console.error(`SW Falhou no cache do item: ${rota}`))
	));
	return Promise.all(stack);
};

// Ao instalar uma nova versão
self.addEventListener('install', ev => {
	//console.log('service worker installed');
	ev.waitUntil(caches.open(swCache).then(sw_cacheUpdate));
});

// Ao ativar nova versão
self.addEventListener("activate", ev => {
	// console.log("SW Ativado: ", ev);
})

// Proxy
self.addEventListener("fetch", ev => {
	// console.log("Request: ", ev.request);
	ev.respondWith(
		caches.match(ev.request).then(cacheRes => {
			return cacheRes || fetch(ev.request);
		})
	);
})