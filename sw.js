// Service Worker Versão
const version = "1.91";

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
let p = new URL(location.href).searchParams.get("p");
if (p == null) { p = 1; } else { p = Number(p); } // Padrão CacheFirst
const cacheName = "sw_v_static_" + version; // Assets ao instalar
const cacheFound = "sw_v_found_" + version; // Assets que irá guardar durante.



const filesToCache = [
	...swAssets,
];
// const debug = false;
// const log = debug ? console.log.bind(console) : () => {};
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

const sw_messageToClients = (action, str = "") => {
	let obj = {
		type: action,
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
	switch (obj.type) {
		case "PREPARE_CACHES_FOR_UPDATE":
			ev.waitUntil(sw_cacheUpdate(cacheName).then(r => {
				sw_messageToClients("UpdateFull");
			}));
			break;
		case "SKIP_WAITING":
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

// // POLÍTICAS SW PROXY
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


// -----

const IDBConfig = {
	name: 'pwa-db',
	version,
	store: {
		name: `pwa-store`,
		keyPath: 'timestamp'
	}
};

// const templateFolder = '/src/templates';
// const header = `${templateFolder}/header.html`;
// const footer = `${templateFolder}/footer.html`;

const createIndexedDB = ({ name, store }) => {
	const request = self.indexedDB.open(name, 1);
	return new Promise((resolve, reject) => {
		request.onupgradeneeded = e => {
			const db = e.target.result;
			if (!db.objectStoreNames.contains(store.name)) {
				db.createObjectStore(store.name, { keyPath: store.keyPath });
				showInfo('IDB Store Criado', store.name);
			}
			[...db.objectStoreNames].filter((name) => name !== store.name).forEach((name) => db.deleteObjectStore(name));
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
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

const prepareCachesForUpdate = async () => {
	const { latestCacheName, outdatedCacheNames } = await getCacheStorageNames();
	if (!latestCacheName || !outdatedCacheNames?.length) {
		return null;
	}
	const latestCache = await caches?.open(latestCacheName);
	const latestCacheKeys = (await latestCache?.keys())?.map(c => c.url) || [];
	const latestCacheMainKey = latestCacheKeys?.find(url => url.includes('/index.html'));
	const latestCacheMainKeyResponse = latestCacheMainKey ? await latestCache.match(latestCacheMainKey) : null;
	const latestCacheOtherKeys = latestCacheKeys.filter(url => url !== latestCacheMainKey) || [];
	const cachePromises = outdatedCacheNames.map(cacheName => {
		const getCacheDone = async () => {
			const cache = await caches?.open(cacheName);
			const cacheKeys = (await cache?.keys())?.map(c => c.url) || [];
			const cacheMainKey = cacheKeys?.find(url => url.includes('/index.html'));
			if (cacheMainKey && latestCacheMainKeyResponse) {
				await cache.put(cacheMainKey, latestCacheMainKeyResponse.clone());
			}
			return Promise.all(
				latestCacheOtherKeys
					.filter(key => !cacheKeys.includes(key))
					.map(url => cache.add(url).catch(r => console.error(r))),
			);
		};
		return getCacheDone();
	});
	return Promise.all(cachePromises);
};

// const getStreamedHtmlResponse = (url) => {
// 	const stream = new ReadableStream({
// 		async start(controller) {
// 			const pushToStream = stream => {
// 				const reader = stream.getReader();
// 				return reader.read().then(function process({ value, done }) {
// 					if (done) {
// 						return;
// 					}
// 					controller.enqueue(value);
// 					return reader.read().then(process);
// 				});
// 			};

// 			const templates = [
// 				caches.match(header),
// 				caches.match(`${templateFolder}${url}.html`),
// 				caches.match(footer),
// 			];
// 			const responses = await Promise.all(templates);

// 			for (const template of responses) {
// 				await pushToStream(template.body);
// 			}

// 			controller.close();
// 		}
// 	});


// 	return new Response(stream, {
// 		headers: { 'Content-Type': 'text/html; charset=utf-8' }
// 	});
// };

const installHandler = e => {
	e.waitUntil(
		self.clients.matchAll({
			includeUncontrolled: true,
		})
			.then(clients => {
				caches.open(cacheName)
					.then(cache => cache.addAll(filesToCache.map(file => new Request(file, { cache: 'no-cache' }))))
			})
			.catch(err => console.error('cache error', err))
	);
};

const activateHandler = e => {
	e.waitUntil(
		caches.keys()
			.then(names => Promise.all(
				names
					.filter(name => name !== cacheName)
					.map(name => caches.delete(name))
			))
	);
};

// const _fetchHandler = async e => {
// 	const { request } = e;
// 	const { url, method, headers, mode, credentials, cache } = request;
// 	// if (url.includes('google')) {
// 	// 	return false;
// 	// }
// 	showInfo('Fetch', [url, request.method]);
// 	e.respondWith(
// 		caches.match(request, { ignoreVary: true, ignoreSearch: true })
// 			.then(inCache => {
// 				if (inCache) {
// 					return inCache;
// 				}
// 				if (url.startsWith(location.origin) && !url.match(/\.[a-zA-Z]{2,4}$/)) {
// 					const indexUrl = url.endsWith('/') ? `${url}index.html` : `${url}/index.html`;
// 					showInfo('Tentando coletar Index', indexUrl);
// 					const indexRequest = new Request(indexUrl, { method, headers, credentials, cache });
// 					return caches.match(indexRequest, { ignoreSearch: true })
// 				}
// 				return fetch(e.request);
// 			})
// 			.then(inNetwork => {
// 				if (inNetwork) {
// 					return inNetwork;
// 				}
// 				showInfo('Sem resposta da URL', url);
// 				return fetch(e.request);
// 			})
// 			.catch(err => console.error('fetch error:', 'url:', url, 'error:', err))
// 	);
// };

// const fetchHandler = async e => {
// 	const { request } = e;
// 	const { url, method, headers, mode, credentials, cache } = request;
// 	// if (url.includes('google')) {
// 	// 	return false;
// 	// }
// 	showInfo('Fetch', [url, request.method]);
// 	const { origin, pathname } = new URL(url);
// 	if (origin === location.origin && !pathname.match(/\.[a-zA-Z0-9-]{2,5}$/)) {
// 		const pageURL = pathname === '/' ? '/home' : pathname;
// 		e.respondWith(getStreamedHtmlResponse(pageURL));
// 	} else {
// 		e.respondWith(
// 			caches.match(request, { ignoreVary: true, ignoreSearch: true })
// 				.then(inCache => {
// 					if (inCache) {
// 						return inCache;
// 					}
// 					return fetch(e.request);
// 				})
// 				.then(inNetwork => {
// 					if (inNetwork) {
// 						return inNetwork;
// 					}
// 					showInfo('Sem resposta da URL', url);
// 					return fetch(e.request);
// 				})
// 				.catch(err => showError('Fail to Fetch', err))
// 		);
// 	}
// };

const getClients = async () => await self.clients.matchAll({
	includeUncontrolled: true,
});

const hasActiveClients = async () => {
	const clients = await getClients();
	return clients.some(({ visibilityState }) => visibilityState === 'visible');
};

const sendMessage = async message => {
	const clients = await getClients();
	clients.forEach((client) => client.postMessage({ type: 'message', message }));
}

const pushHandler = async e => {
	const data = e.data.json();
	const { title, message, interaction } = data;

	const options = {
		body: message,
		icon: '/src/img/icons/icon-512x512.png',
		vibrate: [100, 50, 100],
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

	e.waitUntil(
		self.registration.showNotification(title, options)
			.then(hasActiveClients)
			.then((activeClients) => {
				if (!activeClients) {
					self.numBadges += 1;
					navigator.setAppBadge(self.numBadges);
				}
			})
			.catch(err => sendMessage(err))
	)
};

const messageHandler = async ({ data }) => {
	const { type } = data;
	switch (type) {

		// case 'transition-type-change':
		// 	const { transitionType } = data;
		// 	const headerResponse = await (await caches.match(header)).text();
		// 	const newHeader = headerResponse.replace(/data-transition="(.+?)"/,
		// 		`data-transition="${transitionType}"`);
		// 	const headers = { headers: { 'Content-Type': 'text/html; charset=utf-8' } };
		// 	const cache = await caches.open(cacheName);
		// 	await cache.put(header, new Response(newHeader, headers));
		// 	break;

		case 'clearBadges':
			self.numBadges = 0;
			if ('clearAppBadge' in navigator) {
				navigator.clearAppBadge();
			}
			break;

		case 'SKIP_WAITING':
			const clients = await self.clients.matchAll({
				includeUncontrolled: true,
			});
			if (clients.length < 2) {
				self.skipWaiting();
			}
			break;

		case 'PREPARE_CACHES_FOR_UPDATE':
			await prepareCachesForUpdate();
			break;
	}
}

const syncHandler = async e => {
	const title = 'Background Sync demo';
	const message = 'Background Sync demo message';
	if (e.tag.startsWith('sync-demo')) {
		const options = {
			body: message,
			icon: '/src/img/icons/icon-512x512.png',
			vibrate: [100, 50, 100],
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
		e.waitUntil(
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
};

const notificationClickHandler = async e => {
	e.notification.close();
};

// self.addEventListener('install', installHandler);
// self.addEventListener('activate', activateHandler);
// self.addEventListener('fetch', fetchHandler);
self.addEventListener('push', pushHandler);
self.addEventListener('notificationclick', notificationClickHandler)
self.addEventListener('sync', syncHandler);
// self.addEventListener('message', messageHandler);

self.addEventListener('backgroundfetchsuccess', async (e) => {
	const { id } = e.registration;
	const clients = await getClients();

	clients.forEach((client) => client.postMessage({ type: 'background-fetch-success', id }));
});