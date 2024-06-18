// Service Worker Versão
const version = "1.86";

// Assets que serão salvos quando instalar o sw.
const swAssets = [
	'./',
	'./sw_tools.js',
	'./manifest.json',
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

/**********************************\\
//  MK SERVICE WORKER               \\
//__________________________________*/

let log = new URL(location.href).searchParams.get("log");
if (log == null) { log = 0; }
let f = new URL(location.href).searchParams.get("f"); // ativa / desativa found (encontrado fora dos assets)
if (f != "false") { f = true; } else { f = false; };
let p = new URL(location.href).searchParams.get("p");
if (p == null) { p = 1; } else { p = Number(p); } // Padrão CacheFirst
const cacheName = "sw_v_static_" + version; // Assets ao instalar
const cacheFound = "sw_v_found_" + version; // Assets que irá guardar durante.

// Inside of Worker
const showError = (msg, erro) => {
	console.log(`%cI> %cSW_ERRO: %c${msg}%c ->`, "color:lawngreen;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
}

// Inside of Worker
const showInfo = (msg, data, nivel = 2) => {
	if (log >= nivel) {
		console.log(`%cI> %cSW_INFO: %c${msg}%c ->`, "color:lawngreen;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
	}
}

const sw_cacheUpdate = async (cacheName) => {
	showInfo("Atualizando Cache...", cacheName, 2);
	caches.open(cacheName).then((cache) => {
		const stack = [];
		// ADD ==> Coleta as rotas e guarda.
		swAssets.forEach((rota) => stack.push(
			cache.add(rota).catch(_ => showError("Falha no cache da rota: ", rota))
		));
		return Promise.all(stack);
	})
};

// Aqui salva apenas no found
const sw_cacheSave = (url, inNetwork) => {
	if (swAssets.includes(url)) {
		// Se for salvar um item do asset, já salva atualiza no static.
		caches.open(cacheName).then((cache) => {
			cache.put(url, inNetwork);
		})
	} else {
		if (f) {
			caches.open(cacheFound).then((cache) => {
				showInfo(`+++ ${cacheFound}...`, url, 3);
				cache.put(url, inNetwork);
			})
		}
	}

};

const sw_messageToClients = (action, str = "") => {
	let obj = {
		action: action,
		str: str,
		ver: version
	}
	showInfo(">> COMUNICAÇÃO", obj);
	clients.matchAll({
		includeUncontrolled: false,
		type: "window",
	}).then(clients => {
		clients.forEach(client => { client.postMessage(obj) });
	})
}

// Comunicação
self.addEventListener('message', async (ev) => {
	let obj = ev.data;
	showInfo("<< COMUNICAÇÃO", obj);
	switch (obj.action) {
		case "UpdateFull":
			ev.waitUntil(sw_cacheUpdate(cacheName).then(r => {
				sw_messageToClients("UpdateFull");
			}));
			break;
		case "skipWaiting":
			self.skipWaiting();
			break;
		case "Versão":
			sw_messageToClients("Versão");
			break;
	}
});

// Ao instalar uma nova versão
self.addEventListener('install', ev => {
	ev.waitUntil(showInfo("NOVA versão! (Updating Cache...)", version));
	ev.waitUntil(sw_cacheUpdate(cacheName));
});

// Ao ativar nova versão
self.addEventListener("activate", ev => {
	showInfo(`Anunciando NOVA Versao ATIVA (${version}). Removendo Antigas...`, "ATIVO");
	sw_messageToClients("Versão");
	// Aqui limpa versoes antigas.
	// Possivel problema: 2 Abas, usando o mesmo cache,
	//   mas uma aba avança versão e a outra não.
	// A segunda irá limpar o cache da primeira.
	ev.waitUntil(caches.keys()
		.then(versoesCache => {
			return Promise.all(versoesCache
				.filter(k => (k !== cacheName) && (k !== cacheFound))
				.map(k => caches.delete(k))
			)
		})
	);
	ev.waitUntil(self.clients.claim());

})

// POLÍTICAS SW PROXY
self.addEventListener("fetch", ev => {
	let url = new URL(ev.request.url);
	let checkUrl = url.origin + url.pathname;
	if (url.origin == location.origin) {
		checkUrl = url.pathname; // Apenas Path dos assets
	}
	switch (p) {
		case 0:
			// 0 - Stale-While-Revalidate
			ev.respondWith(
				caches.match(checkUrl).then((inCache) => {
					return inCache || fetch(ev.request).then((inNetwork) => {
						sw_cacheSave(checkUrl, inNetwork.clone());
						return inNetwork;
					});
				})
			)
			break;

		case 1:
			// 1 - Cache first, then Network
			ev.respondWith(
				caches.match(checkUrl).then(async (inCache) => {
					if (inCache) {
						return inCache;
					} else {
						return fetch(ev.request).then(inNetwork => {
							sw_cacheSave(checkUrl, inNetwork.clone());
							return inNetwork;
						});
					}
				})
			)
			break;

		case 2:
			// 2 - Network first, then Cache
			ev.respondWith(
				fetch(ev.request).then(inNetwork => {
					sw_cacheSave(checkUrl, inNetwork.clone());
					return inNetwork;
				}).catch(async () => { // Só retorna cache se deu erro no fetch
					const inCache = await caches.match(checkUrl);
					if (inCache) return inCache;
				})
			);
			break;

		case 3:
			// 3 - Cache only
			ev.respondWith(
				caches.match(checkUrl).then((cacheResponse) => {
					return cacheResponse;
				})
			)
			break;

		case 4:
			// 4 - Network only
			ev.respondWith(
				fetch(ev.request).then((inNetwork) => {
					return inNetwork;
				})
			)
			break;
	}
})
