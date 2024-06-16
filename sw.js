/**********************************\\
//  MK Service Worker               \\
//__________________________________*/

const version = "1.81";
let log = new URL(location.href).searchParams.get("log");
if (log == null) { log = 1; }
let p = new URL(location.href).searchParams.get("p");
if (p == null) { p = 0; } else { p = Number(p); }
const cacheName = "sw_v_static_" + version;

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

// Inside of Worker
const showError = (msg, erro) => {
	if (log >= 3) console.log(`%cI> %cSW_ERRO: %c${msg}%c ->`, "color:lawngreen;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
}

// Inside of Worker
const showInfo = (msg, data) => {
	if (log >= 3) console.log(`%cI> %cSW_INFO: %c${msg}%c ->`, "color:lawngreen;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
}

const sw_cacheUpdate = async (nameCache) => {
	showInfo("Atualizando Cache...", nameCache);
	caches.open(nameCache).then((cache) => {
		const stack = [];
		// ADD ==> Coleta as rotas e guarda.
		swAssets.forEach((rota) => stack.push(
			cache.add(rota).catch(_ => showError("Falha no cache da rota: ", rota))
		));
		return Promise.all(stack);
	})
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
			ev.waitUntil(sw_cacheUpdate('sw_v_static_' + version).then(r => {
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
	ev.waitUntil(showInfo("Detectada mudança de versao...", version));
	ev.waitUntil(sw_cacheUpdate('sw_v_static_' + version));
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
				.filter(k => (k !== 'sw_v_static_' + version) && (k !== 'sw_v_found_' + version))
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
	// Verifica Path dos Assets
	if (!swAssets.includes(checkUrl)) {
		ev.respondWith(fetch(ev.request));
	} else {
		console.log("Politica", p);
		console.log("Url", ev.request.url);
		switch (p) {
			case 0:
				// 0 - Stale-While-Revalidate
				ev.respondWith(
					caches.open(cacheName).then((cache) => {
						cache.match(checkUrl).then(async (inCache) => {
							if (inCache) {
								return inCache;
							} else {
								return fetch(ev.request).then(networkResponse => {
									cache.put(checkUrl, networkResponse.clone());
								});
							}
						}).catch(err => {
							console.log("Erro oo encontrar o cache", err);
							return fetch(ev.request).then((networkResponse) => {
								cache.put(ev.request, networkResponse.clone())
							})
						})
					}).catch(err => {
						console.log("Erro oo abrir o cache", err);
						return fetch(ev.request).then((networkResponse) => {
							cache.put(ev.request, networkResponse.clone())
						})
					})
				)
				break;

			case 1:
				// 1 - Cache first, then Network
				ev.respondWith(
					caches.open(cacheName).then((cache) => {
						cache.match(ev.request).then((cacheResponse) => {
							if (cacheResponse) {
								return cacheResponse;
							} else {
								return fetch(ev.request).then((networkResponse) => {
									cache.put(ev.request, networkResponse.clone())
									return networkResponse;
								})
							}
						})
					})
				)
				break;

			case 2:
				// 2 - Network first, then Cache
				ev.respondWith(
					fetch(ev.request).catch(() => { // Só retorna cache se deu erro no fetch
						return caches.match(ev.request);
					})
				);
				break;

			case 3:
				// 3 - Cache only
				ev.respondWith(
					caches.open(cacheName).then((cache) => {
						cache.match(ev.request).then((cacheResponse) => {
							return cacheResponse;
						})
					})
				)
				break;

			case 4:
				// 4 - Network only
				ev.respondWith(
					fetch(ev.request).then((networkResponse) => {
						return networkResponse;
					})
				)
				break;
		}
	}

})