
if ('serviceWorker' in navigator) {
	const registerServiceWorker = async () => {
		await navigator.serviceWorker.register('/service-worker.js');
		const registration = await navigator.serviceWorker.ready;

		if (registration.waiting && registration.active) {
			console.log('new sw waiting');
			window.swNeedUpdate = true;
		}

		registration.onupdatefound = () => {
			const installingWorker = registration.installing;

			if (installingWorker) {
				console.log('installing sw found');
				installingWorker.onstatechange = async () => {
					if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
						console.log('new sw installed');
						window.swNeedUpdate = true;

						await SWHelper.prepareCachesForUpdate();
						await SWHelper.skipWaiting();
					}
				};
			}

		};
	};

	registerServiceWorker();

	const SWHelper = {
		async getWaitingWorker() {
			const registrations = await navigator?.serviceWorker?.getRegistrations() || [];
			const registrationWithWaiting = registrations.find(reg => reg.waiting);
			return registrationWithWaiting?.waiting;
		},

		async skipWaiting() {
			return (await SWHelper.getWaitingWorker())?.postMessage({ type: 'SKIP_WAITING' });
		},

		async prepareCachesForUpdate() {
			return (await SWHelper.getWaitingWorker())?.postMessage({ type: 'PREPARE_CACHES_FOR_UPDATE' });
		}
	};

	window.addEventListener('beforeunload', async () => {
		if (window.swNeedUpdate) {
			console.log('send skipWaiting');
			window.swNeedUpdate = false;
			await SWHelper.skipWaiting();
		}
	});
}

document.querySelector('#reload').addEventListener('click', e => location.reload());
