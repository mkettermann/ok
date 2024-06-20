
import '/@dannymoerkerke/material-webcomponents/src/material-button.js';



import { getSheetTemplate as getInstallSheetTemplate } from '/src/templates/installsheet.js';



const hasInstalledRelatedApps = 'getInstalledRelatedApps' in navigator && (await navigator.getInstalledRelatedApps()).length > 0;
const standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: tabbed)').matches;
console.log(hasInstalledRelatedApps, standalone);
const installed = hasInstalledRelatedApps || standalone;
const installationInfo = document.querySelector('#installation');

if (installationInfo) {
	installationInfo.style.display = installed ? 'none' : 'block';
}

const installButton = document.querySelector('#install-button');
const installDialog = document.querySelector('#install-dialog');
const closeButton = document.querySelector('#close-install-dialog');
const backButton = document.querySelector('#back-button');
const forwardButton = document.querySelector('#forward-button');
const screenShots = document.querySelector('#install-dialog .screenshots');
const scrollDiv = screenShots.querySelector('#install-dialog .screenshots .scroll-div');
const innerDiv = scrollDiv.querySelector('div');
let curPos;

const supportsInstallPrompt = 'onbeforeinstallprompt' in window;

window.addEventListener('load', e => {
	if (installButton) {
		installButton.disabled = window.deferredPrompt === undefined ? supportsInstallPrompt : false;
	}
});

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault();

	if (installButton) {
		installButton.disabled = false;
	}
});

if (installButton) {
	if (!supportsInstallPrompt) {
		const template = getInstallSheetTemplate();

		if (!installDialog.querySelector('.body')) {
			screenShots.insertAdjacentHTML('beforebegin', template);
		}
	}

	installButton.addEventListener('click', () => {
		if (window.deferredPrompt) {
			window.deferredPrompt.prompt();
		}
		else if (!supportsInstallPrompt) {
			curPos = 0;
			scrollDiv.scrollLeft = 0;
			installDialog.showModal();
			installDialog.querySelector('.body').scrollTop = 0;

			setTimeout(() => {
				installDialog.setAttribute('opened', '');
			})
		}
	});
}

installDialog.addEventListener('transitionend', (e) => {
	if (!installDialog.hasAttribute('opened')) {
		installDialog.close();
	}
});

closeButton.addEventListener('click', e => {
	installDialog.removeAttribute('opened');

	// fix for < iOS 17.2, when the install dialog is shown and closed the user can no longer scroll the page
	// by removing overflow:hidden from the main content and reapplying it with a short delay this is fixed
	const mainContent = document.querySelector('#main-content');
	mainContent.style.overflow = 'auto';
	setTimeout(() => {
		mainContent.style.overflow = 'hidden';
	}, 100);
});

backButton.addEventListener('click', e => {
	curPos = Math.max(scrollDiv.scrollLeft - 276, 0);
	scrollDiv.scrollTo({ left: curPos, behavior: 'smooth' });
});

forwardButton.addEventListener('click', e => {
	curPos = Math.min(scrollDiv.scrollLeft + 276, 552);
	scrollDiv.scrollTo({ left: curPos, behavior: 'smooth' });
});

window.addEventListener('appinstalled', e => {
	if (installButton) {
		installButton.disabled = true;
	}
});

