/**********************************\\
//  MK Service Worker               \\
//__________________________________*/

const version = "1.27";
let cacheon = new URL(location.href).searchParams.get("cache");
if (cacheon == "true") { cacheon = true } else { cacheon = false };

// Assets do cache Base:
const swAssets = [
	'./',
	'./index.html',
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

const sw_cacheUpdate = async (nameCache) => {
	if (!cacheon) {
		return false;
	}
	console.log(`%c<< SW__IN:%c ATUALIZANDO CACHE`, "color:lawngreen;", "color:MediumOrchid;");
	caches.open(nameCache).then((cache) => {
		const stack = [];
		// ADD ==> Coleta as rotas e guarda.
		swAssets.forEach((rota) => stack.push(
			cache.add(rota).catch(_ => console.log(`%c<< SW__IN:%c FALHA ao fazer CACHE nesta rota > ${rota}`, "color:lawngreen;", "background-color:black;color:red;"))
		));
		return Promise.all(stack);
	})
};

const sw_messageToClients = (action = "cache-atualizado", str = "") => {
	let obj = {
		action: action,
		str: str,
		ver: version
	}
	console.log(`%c<< SW__IN:%c >> COMUNICAÇÃO:`, "color:lawngreen;", "color:MediumOrchid;", obj);
	clients.matchAll({
		includeUncontrolled: false,
		type: "window",
	}).then(clients => {
		clients.forEach(client => { client.postMessage(obj) });
	})
}

// Ao receber solicitação de sync. Mas falha muito
// O Sync "deveria" se executar sempre que a internet do usuário retornar ao estado de online.
// self.addEventListener('sync', ev => {
// 	console.log(`%c<< SW__IN:%c SYNC`, "color:green;", "color:yellow;");
// 	ev.waitUntil(sw_messageToClients("sync", ev.tag));
// });

// Comunicação
self.addEventListener('message', async (ev) => {
	let msg = ev.data;
	console.log(`%c<< SW__IN:%c << COMUNICAÇÃO:`, "color:lawngreen;", "color:MediumOrchid;", msg);
	switch (msg.action) {
		case "UpdateCache":
			ev.waitUntil(sw_cacheUpdate('sw_v_static_' + version).then(r => {
				sw_messageToClients("cache-atualizado");
			}));
			break;
		case "Versão":
			sw_messageToClients("Versão");
			break;
	}
});

// Ao instalar uma nova versão
self.addEventListener('install', ev => {
	console.log(`%c<< SW__IN:%c INSTALLING`, "color:lawngreen;", "color:MediumOrchid;");
	ev.waitUntil(sw_cacheUpdate('sw_v_static_' + version));
	console.log(`%c<< SW__IN:%c INSTALLED (Auto-Update)`, "color:lawngreen;", "color:MediumOrchid;");
	self.skipWaiting();
});

// Ao ativar nova versão
self.addEventListener("activate", ev => {
	console.log(`%c<< SW__IN:%c NOVA VERSÃO ATIVA! (Removendo versões antigas)`, "color:lawngreen;", "color:MediumOrchid;");
	// Aqui limpa versoes antigas.
	// Possivel problema: 2 Abas, usando o mesmo cache,
	//   mas uma aba avança versão e a outra não.
	// A segunda irá limpar o cache da primeira.
	ev.waitUntil(caches.keys()
		.then(versoesCache => {
			return Promise.all(versoesCache
				.filter(k => (k !== 'sw_v_static_' + version) && (k !== 'sw_v_found_' + version))
				.map(k => caches.delete(k))
			)
		})
	);
	ev.waitUntil(self.clients.claim());

})

// Proxy
self.addEventListener("fetch", ev => {
	// Aqui é possível alterar entre as políticas baseado na url do fetch.

	// SE online, NetWork First, SE offline, Cache First.
	if (navigator.onLine) {
		// Network-First. All Online
		ev.respondWith(
			fetch(ev.request)
				.catch(err => {
					// Se Network Falhar, retorna o Cache.
					return caches.match(ev.request);
				})
		);
	} else {
		// Cache-First. All Cache First
		ev.respondWith(
			// Mesma URL = Offline Cache.
			caches.match(ev.request).then(cacheRes => {
				// Always try get
				const returnNetwork = fetch(ev.request).then((fetchRes) => {
					return caches.open('sw_v_found_' + version).then(cache => {
						cache.put(ev.request.url, fetchRes.clone());
						//sw_cacheLimitSize('sw_v_found_' + version, 50);
						return fetchRes;
					});
				});
				return cacheRes || returnNetwork;
			}).catch(() => {
				if (ev.request.url.indexOf('.html') > -1) {
					return caches.match(swAssets[1]);
				}
			})
		);
	}
})