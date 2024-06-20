// Service Worker Versão
const version = "1.104";

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

let log_level = new URL(location.href).searchParams.get("log");
if (log_level == null) { log_level = 0; }
let f = new URL(location.href).searchParams.get("f"); // ativa / desativa found (encontrado fora dos assets)
if (f != "false") { f = true; } else { f = false; };
let politica = new URL(location.href).searchParams.get("p");
if (politica == null) { politica = 1; } else { politica = Number(politica); } // Padrão CacheFirst
const cacheName = "sw_v_static_" + version; // Assets ao instalar
const cacheFound = "sw_v_found_" + version; // Assets que irá guardar durante.
self.numBadges = 0;

// Inside of Worker
const showError = (msg, erro) => {
	console.log(`%cI> %cSW_ERRO: %c${msg}%c ->`, "color:lawngreen;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
}

// Inside of Worker
const showInfo = (msg, data, nivel = 2) => {
	if (log_level >= nivel) {
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

const getClients = async () => await self.clients.matchAll({ includeUncontrolled: true });

const hasActiveClients = async () => {
	const clients = await getClients();
	return clients.some(({ visibilityState }) => visibilityState === 'visible');
};

const sw_messageToClients = async (msg, str = "") => {
	const clients = await getClients();
	let obj = {
		type: msg,
		str: str,
		ver: version
	}
	showInfo(">> COMUNICAÇÃO", obj);
	clients.forEach((client) => { client.postMessage(obj) });
}



// Comunicação
self.addEventListener('message', async (ev) => {
	const { type } = ev.data;
	showInfo("<< COMUNICAÇÃO", ev.data);
	switch (type) {

		case "PREPARE_CACHES_FOR_UPDATE":
			ev.waitUntil(sw_cacheUpdate(cacheName).then(r => {
				sw_messageToClients("UPDATED_CACHE");
			}));
			break;

		case "SKIP_WAITING":
			const clients = await getClients();
			if (clients.length < 2) {
				self.skipWaiting();
			}
			break;

		case 'CLEAR_BADGES':
			self.numBadges = 0;
			if ('clearAppBadge' in navigator) {
				navigator.clearAppBadge();
			}
			break;

		case "VERSION":
			sw_messageToClients("VERSION");
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
	showInfo(`NOVA Versao ATIVA (${version}). Removendo Antigas...`, "ATIVO");
	sw_messageToClients("VERSION");
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

// // POLÍTICAS SW PROXY
self.addEventListener("fetch", ev => {
	// Verificar possibilidade de diferentes políticas pra diferentes tipos de request.
	let url = new URL(ev.request.url);
	let checkUrl = url.origin + url.pathname;
	if (url.origin == location.origin) {
		checkUrl = url.pathname; // Apenas Path dos assets
	}
	switch (politica) {
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


// OUTRAS MECANICAS

const IDBConfig = {
	name: 'pwa-db',
	version,
	store: {
		name: `pwa-store`,
		keyPath: 'timestamp'
	}
};

const getStoreFactory = (dbName) => ({ name }, mode = 'readonly') => {
	return new Promise((resolve, reject) => {
		const request = self.indexedDB.open(dbName, 1);
		request.onsuccess = e => {
			const db = request.result;
			const transaction = db.transaction(name, mode);
			const store = transaction.objectStore(name);
			return resolve(store);
		};
		request.onerror = e => reject(request.error);
	});
};
const openStore = getStoreFactory(IDBConfig.name);
const getCacheStorageNames = async () => {
	const cacheNames = await caches.keys() || [];
	const outdatedCacheNames = cacheNames.filter(name => !name.includes(cacheName));
	const latestCacheName = cacheNames.find(name => name.includes(cacheName));
	return { latestCacheName, outdatedCacheNames };
};

// NOTIFICATION
// Close
self.addEventListener('notificationclick', async (ev) => {
	ev.notification.close();
})

// Push
self.addEventListener('push', async (ev) => {
	const data = ev.data.json();
	const { title, message, interaction } = data;

	const options = {
		body: message,
		icon: '/src/img/icons/icon-512x512.png',
		vibrate: [100, 30, 100, 30, 100],
		data: {
			dateOfArrival: Date.now()
		},
		actions: [
			{
				action: 'confirm',
				title: 'OK'
			},
			{
				action: 'close',
				title: 'Close notification'
			},
		],
		requireInteraction: interaction
	};

	ev.waitUntil(
		self.registration.showNotification(title, options)
			.then(hasActiveClients)
			.then((activeClients) => {
				if (!activeClients) {
					self.numBadges += 1;
					navigator.setAppBadge(self.numBadges);
				}
			})
			.catch(err => sw_messageToClients(err))
	)
});

// Online
self.addEventListener('sync', async ev => {
	const title = 'Background Sync demo';
	const message = 'Background Sync demo message';
	if (ev.tag.startsWith('sync-demo')) {
		const options = {
			body: message,
			icon: '/src/img/icons/icon-512x512.png',
			vibrate: [100, 30, 100, 30, 100],
			data: {
				dateOfArrival: Date.now()
			},
			actions: [
				{
					action: 'confirm',
					title: 'OK'
				},
				{
					action: 'close',
					title: 'Fechar'
				},
			]
		};
		let idbStore;
		const getNotifications = () => new Promise((resolve, reject) => {
			openStore(IDBConfig.store, 'readwrite')
				.then((store) => {
					idbStore = store;
					const request = idbStore.getAll();
					request.onsuccess = e => {
						const { result } = request;
						return resolve(result);
					};
					request.onerror = e => reject(e);
				})
		});
		ev.waitUntil(
			getNotifications()
				.then((notifications) => {
					console.log(notifications);
					const requests = notifications.map(({ message }) => {
						options.body = message;
						return self.registration.showNotification(title, options);
					});

					return Promise.all(requests)
						.then(() => openStore(IDBConfig.store, 'readwrite'))
						.then(idbStore => idbStore.clear());
				})
		)
	}
});

// Fetch in background
self.addEventListener('backgroundfetchsuccess', async (e) => {
	const { id } = e.registration;
	sw_messageToClients("background-fetch-success", id)
});