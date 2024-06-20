const buildFiles = [
	'/app.js',
	'/ar-vr/index.html',
	'/audio/index.html',
	'/audio-recording/index.html',
	'/audiosession/index.html',
	'/authentication/index.html',
	'/background-fetch/index.html',
	'/background-sync/index.html',
	'/barcode/index.html',
	'/bluetooth/index.html',
	'/bluetooth-test/index.html',
	'/capture-handle/index.html',
	'/contacts/index.html',
	'/device-motion/index.html',
	'/device-orientation/index.html',
	'/face-detection/index.html',
	'/file-handling/index.html',
	'/file-system/index.html',
	'/geolocation/index.html',
	'/image-gallery/index.html',
	'/index.html',
	'/info/index.html',
	'/manifest.json',
	'/media/index.html',
	'/multi-touch/index.html',
	'/network-info/index.html',
	'/nfc/index.html',
	'/notifications/index.html',
	'/page-lifecycle/index.html',
	'/payment/index.html',
	'/protocol-handler-page/index.html',
	'/protocol-handling/index.html',
	'/service-worker.js',
	'/speech-recognition/index.html',
	'/speech-synthesis/index.html',
	'/src/amplifyconfiguration.json',
	'/src/aws-exports.js',
	'/src/controllers/ar-vr.js',
	'/src/controllers/audio-recording.js',
	'/src/controllers/audio.js',
	'/src/controllers/audiosession.js',
	'/src/controllers/authentication.js',
	'/src/controllers/background-fetch.js',
	'/src/controllers/background-sync.js',
	'/src/controllers/barcode.js',
	'/src/controllers/bluetooth.js',
	'/src/controllers/bluetooth2.js',
	'/src/controllers/capture-handle.js',
	'/src/controllers/contacts.js',
	'/src/controllers/device-motion.js',
	'/src/controllers/device-orientation.js',
	'/src/controllers/face-detection.js',
	'/src/controllers/file-handling.js',
	'/src/controllers/file-system.js',
	'/src/controllers/geolocation.js',
	'/src/controllers/home.js',
	'/src/controllers/image-gallery.js',
	'/src/controllers/info.js',
	'/src/controllers/media.js',
	'/src/controllers/network-info.js',
	'/src/controllers/nfc.js',
	'/src/controllers/notifications.js',
	'/src/controllers/page-lifecycle.js',
	'/src/controllers/payment.js',
	'/src/controllers/protocol-handler-page.js',
	'/src/controllers/protocol-handling.js',
	'/src/controllers/speech-recognition.js',
	'/src/controllers/speech-synthesis.js',
	'/src/controllers/storage.js',
	'/src/controllers/vibration.js',
	'/src/controllers/view-transitions.js',
	'/src/controllers/wake-lock.js',
	'/src/controllers/web-share.js',
	'/src/css/ar-vr.css',
	'/src/css/audio-recording.css',
	'/src/css/authentication.css',
	'/src/css/background-fetch.css',
	'/src/css/barcode.css',
	'/src/css/bluetooth.css',
	'/src/css/capture-handle.css',
	'/src/css/contacts.css',
	'/src/css/face-detection.css',
	'/src/css/file-handling.css',
	'/src/css/file-system.css',
	'/src/css/fonts.css',
	'/src/css/geolocation.css',
	'/src/css/home.css',
	'/src/css/main.css',
	'/src/css/media.css',
	'/src/css/network-info.css',
	'/src/css/nfc.css',
	'/src/css/pagelifecycle.css',
	'/src/css/payment.css',
	'/src/css/prism.css',
	'/src/css/speech-recognition.css',
	'/src/css/storage.css',
	'/src/css/styles.css',
	'/src/css/transitions.css',
	'/src/css/vibration.css',
	'/src/css/web-share.css',
	'/src/elements/_file-tree.js',
	'/src/elements/barcode-reader.js',
	'/src/elements/code-snippet.js',
	'/src/elements/context-menu.js',
	'/src/elements/device-motion.js',
	'/src/elements/device-orientation.js',
	'/src/elements/face-detector.js',
	'/src/elements/file-tree.js',
	'/src/elements/google-map.js',
	'/src/elements/iterateWorker.js',
	'/src/elements/multi-touch.js',
	'/src/elements/network-information.js',
	'/src/elements/on-outside-click.js',
	'/src/elements/saveFileWorker.js',
	'/src/elements/shape-detector.js',
	'/src/elements/speech-recognition.js',
	'/src/elements/speech-synthesis.js',
	'/src/elements/web-cam.js',
	'/src/fonts/MaterialIcons-Regular.woff',
	'/src/fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
	'/src/fonts/ionicons.svg',
	'/src/fonts/ionicons.woff',
	'/src/fonts/material-icons.woff2',
	'/src/img/crate.gif',
	'/src/img/gallery/IMG_0791.webp',
	'/src/img/gallery/IMG_0829.webp',
	'/src/img/gallery/IMG_0848.webp',
	'/src/img/gallery/IMG_0860.webp',
	'/src/img/gallery/IMG_0924.webp',
	'/src/img/gallery/IMG_0927.webp',
	'/src/img/gallery/IMG_0955.webp',
	'/src/img/gallery/IMG_0966.webp',
	'/src/img/geolocation/android-chrome-settings-1.webp',
	'/src/img/geolocation/android-chrome-settings-2.webp',
	'/src/img/geolocation/android-chrome-settings-3.webp',
	'/src/img/geolocation/android-chrome-settings-4.webp',
	'/src/img/geolocation/android-chrome-settings-5.webp',
	'/src/img/geolocation/android-edge-settings-1.webp',
	'/src/img/geolocation/android-edge-settings-2.webp',
	'/src/img/geolocation/android-edge-settings-3.webp',
	'/src/img/geolocation/android-edge-settings-4.webp',
	'/src/img/geolocation/android-edge-settings-5.webp',
	'/src/img/geolocation/android-edge-settings-6.webp',
	'/src/img/geolocation/android-firefox-settings-1.webp',
	'/src/img/geolocation/android-firefox-settings-2.webp',
	'/src/img/geolocation/android-firefox-settings-3.webp',
	'/src/img/geolocation/android-firefox-settings-4.webp',
	'/src/img/geolocation/android-firefox-settings-5.webp',
	'/src/img/geolocation/android-settings-1.webp',
	'/src/img/geolocation/android-settings-2.webp',
	'/src/img/geolocation/android-settings-3.webp',
	'/src/img/geolocation/app-permissions-chrome.webp',
	'/src/img/geolocation/app-permissions-edge.webp',
	'/src/img/geolocation/app-permissions-firefox.webp',
	'/src/img/geolocation/desktop-chrome-settings-1.webp',
	'/src/img/geolocation/desktop-chrome-settings-2.webp',
	'/src/img/geolocation/desktop-chrome-settings-3.webp',
	'/src/img/geolocation/desktop-chrome-settings-4.webp',
	'/src/img/geolocation/desktop-chrome-settings-5.webp',
	'/src/img/geolocation/desktop-chrome-settings-6.webp',
	'/src/img/geolocation/desktop-edge-settings-1.webp',
	'/src/img/geolocation/desktop-edge-settings-2.webp',
	'/src/img/geolocation/desktop-edge-settings-3.webp',
	'/src/img/geolocation/desktop-edge-settings-4.webp',
	'/src/img/geolocation/desktop-edge-settings-5.webp',
	'/src/img/geolocation/desktop-firefox-settings-1.webp',
	'/src/img/geolocation/desktop-firefox-settings-2.webp',
	'/src/img/geolocation/desktop-firefox-settings-3.webp',
	'/src/img/geolocation/desktop-firefox-settings-4.webp',
	'/src/img/geolocation/desktop-firefox-settings-5.webp',
	'/src/img/geolocation/desktop-safari-settings-1.webp',
	'/src/img/geolocation/desktop-safari-settings-2.webp',
	'/src/img/geolocation/ios-chrome-settings-1.webp',
	'/src/img/geolocation/ios-chrome-settings-2.webp',
	'/src/img/geolocation/ios-edge-settings-1.webp',
	'/src/img/geolocation/ios-edge-settings-2.webp',
	'/src/img/geolocation/ios-safari-settings-1.webp',
	'/src/img/geolocation/ios-safari-settings-2.webp',
	'/src/img/geolocation/ios-settings-1.webp',
	'/src/img/geolocation/ios-settings-2.webp',
	'/src/img/geolocation/ios-settings-3.webp',
	'/src/img/geolocation/location-permission-chrome.webp',
	'/src/img/geolocation/location-permission-edge.webp',
	'/src/img/geolocation/location-permission-firefox.webp',
	'/src/img/geolocation/macos-settings-1.webp',
	'/src/img/geolocation/macos-settings-2.webp',
	'/src/img/geolocation/macos-settings-3.webp',
	'/src/img/icons/authentication-192x192.png',
	'/src/img/icons/authentication-96x96.png',
	'/src/img/icons/favicon-32.png',
	'/src/img/icons/geolocation-192x192.png',
	'/src/img/icons/geolocation-96x96.png',
	'/src/img/icons/icon-144x144.png',
	'/src/img/icons/icon-152x152.png',
	'/src/img/icons/icon-167x167.png',
	'/src/img/icons/icon-180x180.png',
	'/src/img/icons/icon-192x192.png',
	'/src/img/icons/icon-512x512.png',
	'/src/img/icons/icon-600x600.png',
	'/src/img/icons/info-192x192.png',
	'/src/img/icons/info-96x96.png',
	'/src/img/icons/manifest-icon-192.maskable.png',
	'/src/img/icons/manifest-icon-512.maskable.png',
	'/src/img/icons/mediacapture-192x192.png',
	'/src/img/icons/mediacapture-96x96.png',
	'/src/img/icons/notification.png',
	'/src/img/install/add-to-dock.svg',
	'/src/img/install/add-to-home-screen.svg',
	'/src/img/install/add-to-phone.svg',
	'/src/img/install/arrow-back.svg',
	'/src/img/install/arrow-forward.svg',
	'/src/img/install/close.svg',
	'/src/img/install/install-phone.svg',
	'/src/img/install/ios-share.svg',
	'/src/img/install/menu-vert.svg',
	'/src/img/install/menu.svg',
	'/src/img/media/mirror-conspiracy256x256.jpeg',
	'/src/img/media/mirror-conspiracy512x512.jpeg',
	'/src/img/media/mirror-conspiracy64x64.jpeg',
	'/src/img/pwa/apple-icon-120.png',
	'/src/img/pwa/apple-icon-152.png',
	'/src/img/pwa/apple-icon-167.png',
	'/src/img/pwa/apple-icon-180.png',
	'/src/img/pwa/apple-splash-1125-2436.png',
	'/src/img/pwa/apple-splash-1136-640.png',
	'/src/img/pwa/apple-splash-1170-2532.png',
	'/src/img/pwa/apple-splash-1179-2556.png',
	'/src/img/pwa/apple-splash-1242-2208.png',
	'/src/img/pwa/apple-splash-1242-2688.png',
	'/src/img/pwa/apple-splash-1284-2778.png',
	'/src/img/pwa/apple-splash-1290-2796.png',
	'/src/img/pwa/apple-splash-1334-750.png',
	'/src/img/pwa/apple-splash-1536-2048.png',
	'/src/img/pwa/apple-splash-1620-2160.png',
	'/src/img/pwa/apple-splash-1668-2224.png',
	'/src/img/pwa/apple-splash-1668-2388.png',
	'/src/img/pwa/apple-splash-1792-828.png',
	'/src/img/pwa/apple-splash-2048-1536.png',
	'/src/img/pwa/apple-splash-2048-2732.png',
	'/src/img/pwa/apple-splash-2160-1620.png',
	'/src/img/pwa/apple-splash-2208-1242.png',
	'/src/img/pwa/apple-splash-2224-1668.png',
	'/src/img/pwa/apple-splash-2388-1668.png',
	'/src/img/pwa/apple-splash-2436-1125.png',
	'/src/img/pwa/apple-splash-2532-1170.png',
	'/src/img/pwa/apple-splash-2556-1179.png',
	'/src/img/pwa/apple-splash-2688-1242.png',
	'/src/img/pwa/apple-splash-2732-2048.png',
	'/src/img/pwa/apple-splash-2778-1284.png',
	'/src/img/pwa/apple-splash-2796-1290.png',
	'/src/img/pwa/apple-splash-640-1136.png',
	'/src/img/pwa/apple-splash-750-1334.png',
	'/src/img/pwa/apple-splash-828-1792.png',
	'/src/img/pwa/apple-splash-dark-1125-2436.png',
	'/src/img/pwa/apple-splash-dark-1136-640.png',
	'/src/img/pwa/apple-splash-dark-1170-2532.png',
	'/src/img/pwa/apple-splash-dark-1179-2556.png',
	'/src/img/pwa/apple-splash-dark-1242-2208.png',
	'/src/img/pwa/apple-splash-dark-1242-2688.png',
	'/src/img/pwa/apple-splash-dark-1284-2778.png',
	'/src/img/pwa/apple-splash-dark-1290-2796.png',
	'/src/img/pwa/apple-splash-dark-1334-750.png',
	'/src/img/pwa/apple-splash-dark-1536-2048.png',
	'/src/img/pwa/apple-splash-dark-1620-2160.png',
	'/src/img/pwa/apple-splash-dark-1668-2224.png',
	'/src/img/pwa/apple-splash-dark-1668-2388.png',
	'/src/img/pwa/apple-splash-dark-1792-828.png',
	'/src/img/pwa/apple-splash-dark-2048-1536.png',
	'/src/img/pwa/apple-splash-dark-2048-2732.png',
	'/src/img/pwa/apple-splash-dark-2160-1620.png',
	'/src/img/pwa/apple-splash-dark-2208-1242.png',
	'/src/img/pwa/apple-splash-dark-2224-1668.png',
	'/src/img/pwa/apple-splash-dark-2388-1668.png',
	'/src/img/pwa/apple-splash-dark-2436-1125.png',
	'/src/img/pwa/apple-splash-dark-2532-1170.png',
	'/src/img/pwa/apple-splash-dark-2556-1179.png',
	'/src/img/pwa/apple-splash-dark-2688-1242.png',
	'/src/img/pwa/apple-splash-dark-2732-2048.png',
	'/src/img/pwa/apple-splash-dark-2778-1284.png',
	'/src/img/pwa/apple-splash-dark-2796-1290.png',
	'/src/img/pwa/apple-splash-dark-640-1136.png',
	'/src/img/pwa/apple-splash-dark-750-1334.png',
	'/src/img/pwa/apple-splash-dark-828-1792.png',
	'/src/img/pwa/manifest-icon-192.png',
	'/src/img/pwa/manifest-icon-512.png',
	'/src/img/pwalogo.png',
	'/src/img/pwalogo.svg',
	'/src/img/pwalogo.webp',
	'/src/img/robot.webp',
	'/src/img/robot_walk_idle.usdz',
	'/src/img/screenshots/shot1.png',
	'/src/img/screenshots/shot2.png',
	'/src/img/screenshots/shot3.png',
	'/src/img/screenshots/shot4.png',
	'/src/img/screenshots/shot5.png',
	'/src/img/screenshots/shot6.png',
	'/src/img/screenshots/shot7.png',
	'/src/img/screenshots/shot8.png',
	'/src/img/screenshots/shot9.png',
	'/src/img/sensors/edge-settings-motion-sensor-1.webp',
	'/src/img/sensors/edge-settings-motion-sensor-2.webp',
	'/src/img/sensors/sensors-chrome-step1.webp',
	'/src/img/sensors/sensors-chrome-step2.webp',
	'/src/img/sensors/sensors-chrome-step3.webp',
	'/src/img/sensors/sensors-chrome-step4.webp',
	'/src/img/sensors/sensors-chrome-step5.webp',
	'/src/img/social-logo.png',
	'/src/img/social-logo.webp',
	'/src/lib/bootstrap.js',
	'/src/lib/feature-support.js',
	'/src/lib/gtag.js',
	'/src/lib/idb.js',
	'/src/lib/image-gallery.js',
	'/src/lib/imagemin.mjs',
	'/src/lib/material-bottom-sheet.js',
	'/src/lib/pages.js',
	'/src/lib/post-build.js',
	'/src/lib/prism.js',
	'/src/lib/router.js',
	'/src/lib/utils.js',
	'/src/over.mp3',
	'/src/routes.js',
	'/src/routing.js',
	'/src/templates/ar-vr.html',
	'/src/templates/ar-vr.js',
	'/src/templates/audio-recording.html',
	'/src/templates/audio-recording.js',
	'/src/templates/audio.html',
	'/src/templates/audio.js',
	'/src/templates/audiosession.html',
	'/src/templates/audiosession.js',
	'/src/templates/authentication.html',
	'/src/templates/authentication.js',
	'/src/templates/background-fetch.html',
	'/src/templates/background-fetch.js',
	'/src/templates/background-sync.html',
	'/src/templates/background-sync.js',
	'/src/templates/barcode.html',
	'/src/templates/barcode.js',
	'/src/templates/bluetooth.html',
	'/src/templates/bluetooth.js',
	'/src/templates/bluetooth2.html',
	'/src/templates/bluetooth2.js',
	'/src/templates/capture-handle.html',
	'/src/templates/capture-handle.js',
	'/src/templates/contacts.html',
	'/src/templates/contacts.js',
	'/src/templates/device-motion.html',
	'/src/templates/device-motion.js',
	'/src/templates/device-orientation.html',
	'/src/templates/device-orientation.js',
	'/src/templates/face-detection.html',
	'/src/templates/face-detection.js',
	'/src/templates/file-handling.html',
	'/src/templates/file-handling.js',
	'/src/templates/file-system.html',
	'/src/templates/file-system.js',
	'/src/templates/footer.html',
	'/src/templates/footer.js',
	'/src/templates/geolocation.html',
	'/src/templates/geolocation.js',
	'/src/templates/geolocationsheet.js',
	'/src/templates/header.html',
	'/src/templates/header.js',
	'/src/templates/home.html',
	'/src/templates/home.js',
	'/src/templates/image-gallery.html',
	'/src/templates/image-gallery.js',
	'/src/templates/info.html',
	'/src/templates/info.js',
	'/src/templates/installsheet.js',
	'/src/templates/media.html',
	'/src/templates/media.js',
	'/src/templates/multi-touch.html',
	'/src/templates/multi-touch.js',
	'/src/templates/network-info.html',
	'/src/templates/network-info.js',
	'/src/templates/nfc.html',
	'/src/templates/nfc.js',
	'/src/templates/notifications.html',
	'/src/templates/notifications.js',
	'/src/templates/page-lifecycle.html',
	'/src/templates/page-lifecycle.js',
	'/src/templates/payment.html',
	'/src/templates/payment.js',
	'/src/templates/protocol-handler-page.js',
	'/src/templates/protocol-handling.html',
	'/src/templates/protocol-handling.js',
	'/src/templates/screen-orientation.html',
	'/src/templates/screen-orientation.js',
	'/src/templates/sensorsheet.js',
	'/src/templates/share-target.html',
	'/src/templates/share-target.js',
	'/src/templates/speech-recognition.html',
	'/src/templates/speech-recognition.js',
	'/src/templates/speech-synthesis.html',
	'/src/templates/speech-synthesis.js',
	'/src/templates/status.html',
	'/src/templates/status.js',
	'/src/templates/storage.html',
	'/src/templates/storage.js',
	'/src/templates/vibration.html',
	'/src/templates/vibration.js',
	'/src/templates/view-transitions.html',
	'/src/templates/view-transitions.js',
	'/src/templates/wake-lock.html',
	'/src/templates/wake-lock.js',
	'/src/templates/web-share.html',
	'/src/templates/web-share.js',
	'/src/thievery-corporation.mp3',
	'/storage/index.html',
	'/vibration/index.html',
	'/view-transitions/index.html',
	'/wake-lock/index.html',
	'/web-share/index.html',];

const staticFiles = [
	'/',
	'/notifications',
	'/@dannymoerkerke/audio-recorder/dist/audio-recorder.js',
	'/@dannymoerkerke/custom-element/dist/custom-element.es.js',
	'/@dannymoerkerke/material-webcomponents/src/material-app-bar.js',
	'/@dannymoerkerke/material-webcomponents/src/material-bottom-sheet.js',
	'/@dannymoerkerke/material-webcomponents/src/material-button.js',
	'/@dannymoerkerke/material-webcomponents/src/material-checkbox.js',
	'/@dannymoerkerke/material-webcomponents/src/material-dialog.js',
	'/@dannymoerkerke/material-webcomponents/src/material-dropdown.js',
	'/@dannymoerkerke/material-webcomponents/src/material-loader.js',
	'/@dannymoerkerke/material-webcomponents/src/material-progress.js',
	'/@dannymoerkerke/material-webcomponents/src/material-radiobutton-group.js',
	'/@dannymoerkerke/material-webcomponents/src/material-radiobutton.js',
	'/@dannymoerkerke/material-webcomponents/src/material-switch.js',
	'/@dannymoerkerke/material-webcomponents/src/material-textfield.js',
	'/three/build/three.module.js',
	// 'https://www.googletagmanager.com/gtag/js?id=G-VTKNPJ5HVC',
];

const filesToCache = [
	...buildFiles,
	...staticFiles,
];

self.numBadges = 0;
const version = 557;

const cacheName = `pwa-cache-${version}`;

const debug = false;

const log = debug ? console.log.bind(console) : () => {
};

const IDBConfig = {
	name: 'pwa-db',
	version,
	store: {

		name: `pwa-store`,
		keyPath: 'timestamp'
	}
};

const templateFolder = '/src/templates';
const header = `${templateFolder}/header.html`;
const footer = `${templateFolder}/footer.html`;

const createIndexedDB = ({ name, store }) => {
	const request = self.indexedDB.open(name, 1);

	return new Promise((resolve, reject) => {
		request.onupgradeneeded = e => {
			const db = e.target.result;

			if (!db.objectStoreNames.contains(store.name)) {
				db.createObjectStore(store.name, { keyPath: store.keyPath });
				log('create objectstore', store.name);
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

const getStreamedHtmlResponse = (url) => {
	const stream = new ReadableStream({
		async start(controller) {
			const pushToStream = stream => {
				const reader = stream.getReader();

				return reader.read().then(function process({ value, done }) {
					if (done) {
						return;
					}
					controller.enqueue(value);
					return reader.read().then(process);
				});
			};

			const templates = [
				caches.match(header),
				caches.match(`${templateFolder}${url}.html`),
				caches.match(footer),
			];

			const responses = await Promise.all(templates);

			for (const template of responses) {
				await pushToStream(template.body);
			}

			controller.close();
		}
	});


	return new Response(stream, {
		headers: { 'Content-Type': 'text/html; charset=utf-8' }
	});
};

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

const _fetchHandler = async e => {
	const { request } = e;
	const { url, method, headers, mode, credentials, cache } = request;

	if (url.includes('google')) {
		return false;
	}

	log('[Service Worker] Fetch', url, request.method);

	e.respondWith(
		caches.match(request, { ignoreVary: true, ignoreSearch: true })
			.then(response => {
				if (response) {
					log('from cache', url, request);

					return response;
				}

				if (url.startsWith(location.origin) && !url.match(/\.[a-zA-Z]{2,4}$/)) {
					const indexUrl = url.endsWith('/') ? `${url}index.html` : `${url}/index.html`;

					log('trying index request:', indexUrl);

					const indexRequest = new Request(indexUrl, { method, headers, credentials, cache });
					return caches.match(indexRequest, { ignoreSearch: true })
				}

				return fetch(e.request);
			})
			.then(response => {
				if (response) {
					return response;
				}

				console.log('no response for url:', url);
				return fetch(e.request);
			})
			.catch(err => console.error('fetch error:', 'url:', url, 'error:', err))
	);

};

const fetchHandler = async e => {
	const { request } = e;
	const { url, method, headers, mode, credentials, cache } = request;

	if (url.includes('google')) {
		return false;
	}

	log('[Service Worker] Fetch', url, request.method);
	const { origin, pathname } = new URL(url);

	if (origin === location.origin && !pathname.match(/\.[a-zA-Z0-9-]{2,5}$/)) {
		const pageURL = pathname === '/' ? '/home' : pathname;

		e.respondWith(getStreamedHtmlResponse(pageURL));
	}
	else {
		e.respondWith(
			caches.match(request, { ignoreVary: true, ignoreSearch: true })
				.then(response => {
					if (response) {
						log('from cache', url, request);

						return response;
					}


					return fetch(e.request);
				})
				.then(response => {
					if (response) {
						return response;
					}

					console.log('no response for url:', url);
					return fetch(e.request);
				})
				.catch(err => console.error('fetch error:', 'url:', url, 'error:', err))
		);
	}

};

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
		case 'transition-type-change':
			const { transitionType } = data;
			const headerResponse = await (await caches.match(header)).text();
			const newHeader = headerResponse.replace(/data-transition="(.+?)"/,
				`data-transition="${transitionType}"`);
			const headers = { headers: { 'Content-Type': 'text/html; charset=utf-8' } };
			const cache = await caches.open(cacheName);

			await cache.put(header, new Response(newHeader, headers));

			break;

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

self.addEventListener('install', installHandler);
self.addEventListener('activate', activateHandler);
self.addEventListener('fetch', fetchHandler);
self.addEventListener('push', pushHandler);
self.addEventListener('notificationclick', notificationClickHandler)
self.addEventListener('sync', syncHandler);
self.addEventListener('message', messageHandler);

self.addEventListener('backgroundfetchsuccess', async (e) => {
	const { id } = e.registration;
	const clients = await getClients();

	clients.forEach((client) => client.postMessage({ type: 'background-fetch-success', id }));
});