"use strict";
/**********************************\\
//  MK SW - Tools                   \\
//__________________________________*/
// Versionamento, Cacheamento, PWA

class mksw {
	static config = null;
	static workerUrl = "";
	static updateConcluido = null;

	static installButton = null;
	static installContainer = null;

	// Registra e vincula a função de cada evento
	static start = async (config) => {
		mksw.config = config;
		if (typeof mksw.config == "object") {
			if (mksw.config.cache == null) {
				mksw.config.cache = 1;
			}
			if (mksw.config.f == null) {
				mksw.config.f = "";
			}
			if (mksw.config.log != null) {
				mksw.config.log = mksw.config.log;
			} else {
				mksw.config.log = 1;
			}
			if (mksw.config.url == null) {
				let url_path = location.pathname;
				let liof = url_path.lastIndexOf("/");
				if (liof >= 0) {
					url_path = location.pathname.slice(0, liof) + "/";
				}
				let fullUrl = location.origin + url_path;
				mksw.showInfo("Full Url", fullUrl, 2);
				mksw.workerUrl = new URL(fullUrl);
				mksw.workerUrl.pathname += "sw.js";
			} else {
				mksw.workerUrl = new URL(mksw.config.url);
			}
			if (mksw.config.aoAtualizarVersao != null) {
				mksw.aoAtualizarVersao = mksw.config.aoAtualizarVersao;
			}
			mksw.workerUrl.searchParams.set("p", mksw.config.cache);
			mksw.workerUrl.searchParams.set("f", mksw.config.f);
			mksw.workerUrl.searchParams.set("log", mksw.config.log);
			mksw.config.url = mksw.workerUrl.href;
			mksw.config.versao = mksw._getVersaoAtual();
		}
		// Não iniciar quando indisponível
		if (!("serviceWorker" in navigator)) {
			mksw.showError("Sem suporte a Service Worker (Verificar HTTPS)", "")
			return null;
		}

		// Registrar do SW
		await navigator.serviceWorker.register(mksw.workerUrl.href).catch((err) => mksw.showError("Register", err));
		const registro = await navigator.serviceWorker.ready;

		if (registro.waiting && registro.active) {
			mksw.showInfo("Opa! Nova versão encontrada", registro.waiting, registro.active);
			window.swWaitingForUpdate = true;
		}

		// GATILHO de UPDATE (Só se executa se o SW for modificado)
		registro.onupdatefound = (ev) => {
			const swInstalando = registro.installing;
			if (swInstalando) swInstalando.onstatechange = async () => {
				if (swInstalando.state === 'installed' && navigator.serviceWorker.controller) {
					mksw.showInfo("SW sob controle:", swInstalando.state);
					window.swWaitingForUpdate = true;
					await mksw.prepareCachesForUpdate();
					await mksw.skipWaiting();
				}
			};
		}

		// GATILHO de SAIDA
		window.addEventListener('beforeunload', async () => {
			if (window.swWaitingForUpdate) {
				mksw.showInfo("Antes de Sair. Skip Updates");
				window.swWaitingForUpdate = false;
				await mksw.skipWaiting();
			}
		});

		// GATILHO de COMUNICAÇÃO
		navigator.serviceWorker.addEventListener("message", ev => {
			mksw.showInfo("<< COMUNICAÇÃO", ev.data);
			switch (ev.data.type) {

				case "UPDATED_CACHE":
					mksw.showInfo("Update Concluído", ev.data.ver);
					mksw.updateConcluido = ev.data.ver;
					break;

				case "VERSION":
					if (ev.data.ver != mksw._getVersaoAtual()) {
						let listaVersoes = [mksw._getVersaoAtual(), ev.data.ver];
						mksw.showInfo(`Versão MUDOU:`, listaVersoes);
						mksw._setVersaoAtual(ev.data.ver);
						mksw.aoAtualizarVersao(listaVersoes[1], listaVersoes[0]);
					}
					break;

				case "sync":
					mksw.showInfo("Sincronizado", ev.data.ver);
					break;
			}
		})

		// Request Subscribe Nofication from server.
		mksw.subcribeNotifications(registro);

		// Request Notification
		if (!("Notification" in window)) {
			mksw.showError("Sem suporte a Notificações", "");
		} else {
			Notification.requestPermission((status) => {
				mksw.showInfo("Notif. Status ", status);
			});
			// mksw.notify("Welcome", {
			// 	body: "Bem Vindo.",
			// 	icon: "img/icons/ok_72.png",
			// 	vibrate: [100, 30, 100, 30, 100],
			// 	data: {
			// 		datRecebeu: Math.floor(Date.now()),
			// 		loc: mksw.config.urlOrigem + "#FromClickEvent",
			// 	},
			// 	actions: [
			// 		{
			// 			action: "confirm",
			// 			title: "OK",
			// 		}
			// 	],
			// 	requireInteraction: true,
			// 	onclose: (ev) => {
			// 		mksw.showInfo("ONCLOSE", ev);
			// 	}
			// });
		}

		return mksw.config;
	}

	// SW Erros
	static showError = (msg, erro) => {
		console.error(`%cO> %cSW_ERRO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
	}

	// SW Info
	static showInfo = (msg, data, nivel = 2) => {
		if (mksw.config.log >= nivel) console.log(`%cO> %cSW_INFO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
	}

	// Coleta dos Workers em estado de Aguardo
	static getWaitingWorker = async () => {
		const registrations = await navigator?.serviceWorker?.getRegistrations() || [];
		const registrationWithWaiting = registrations.find(r => r.waiting);
		return registrationWithWaiting?.waiting;
	}

	// Skip Waiting
	static skipWaiting = async () => {
		let obj = { type: 'SKIP_WAITING' }
		mksw.showInfo(">> COMUNICAÇÃO (ToWaiting)", obj);
		return (await mksw.getWaitingWorker())?.postMessage(obj);
	}

	// Solicita Refazer Cache.
	static prepareCachesForUpdate = async () => {
		let obj = { type: 'PREPARE_CACHES_FOR_UPDATE' }
		mksw.showInfo(">> COMUNICAÇÃO (ToWaiting)", obj);
		return (await mksw.getWaitingWorker())?.postMessage(obj);
	}

	static aoAtualizarVersao = (versao) => {
		mksw.showInfo("fn aoAtualizarVersao recebeu: ", versao);
	}

	// Atualizar no SW.
	static getUpdate = () => {
		return new Promise((r, reject) => {
			mksw.showInfo("Solicitando Update de Versão...", mksw._getVersaoAtual());
			navigator.serviceWorker?.getRegistration().then(reg => {
				reg.update();
				mksw.skipWaiting();
				r();
			}).catch(erro => {
				reject(erro);
			});
		})
	}
	// Solicita Versao.
	static getVersao = () => {
		if (!mksw.sendMessageToSW({ type: "VERSION" })) {
			mksw.showError("Falha de comunicação");
		}
	}
	// Desregistrar no SW.
	static del = () => {
		mksw.showInfo("Desregistrando Serviço...");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister().then(r => {
				mksw.showInfo("SW Desregistrado.");
			});
		});
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		if (navigator.serviceWorker.controller) {
			mksw.showInfo(">> COMUNICAÇÃO", message);
			navigator.serviceWorker.controller.postMessage(message);
			return true;
		} else {
			mksw.showError("Sem controller para enviar mensagem.", navigator.serviceWorker.controller);
			return false;
		}
	}
	// Update All Clients via Message
	static requestUpdate = async () => {
		mksw.updateConcluido = null;
		let c = 0;
		await mksw.getUpdate().catch(ree => { mksw.showError(ree) });
		if (!mksw.sendMessageToSW({ type: "PREPARE_CACHES_FOR_UPDATE" })) {
			return "Erro de Comunicação";
		};
		return new Promise((r, re) => {
			let esperandoRespostaUpdate = () => {
				mksw.showInfo("Em espera de resposta do Update. Checagem: ", c, 4)
				if (mksw.updateConcluido != null) {
					r(mksw.updateConcluido);
				} else {
					if (c > 100) {
						mksw.showError("Timeout");
					} else {
						setTimeout(() => {
							c++;
							esperandoRespostaUpdate();
						}, 100);
					}
				}
			}
			esperandoRespostaUpdate();
		});
	}

	static _getVersaoAtual = () => {
		if (!localStorage.sw_VersaoAtual) localStorage.sw_VersaoAtual = "0.0";
		return localStorage.sw_VersaoAtual;
	};

	static _setVersaoAtual = (versao) => {
		localStorage.sw_VersaoAtual = versao.toString();
	};

	// Checagem se já está instalado
	static _isInstalled = async () => {
		const hasInstalledRelatedApps = (('getInstalledRelatedApps' in navigator) && (await navigator.getInstalledRelatedApps()).length > 0);
		const standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: tabbed)').matches;
		mksw.showInfo("Instado Related / Standalone", [hasInstalledRelatedApps, standalone]);
		return hasInstalledRelatedApps || standalone;
	}

	static notify = async (titulo, opcoes) => {
		if (Notification.permission === "granted") {
			navigator.serviceWorker.ready.then(r => {
				r.showNotification(titulo, opcoes);
			});
		}
	}

	static subcribeNotifications = async (registro) => {
		let sub = await registro.pushManager.subscribe({ userVisibleOnly: true });
		mksw.showInfo("Subs: ", sub);
		mksw.showInfo("Endpoint: ", sub.endpoint);
	}
}

(async () => {
	// COLETA
	// mksw.installContainer = document.querySelector('#installation');

	// if (installContainer) {
	// 	installContainer.style.display = await mksw._isInstalled() ? 'none' : 'block';
	// }

	// // const installButton = document.querySelector('#install-button');
	// const installDialog = document.querySelector('#install-dialog');
	// const closeButton = document.querySelector('#close-install-dialog');
	// const backButton = document.querySelector('#back-button');
	// const forwardButton = document.querySelector('#forward-button');
	// const screenShots = document.querySelector('#install-dialog .screenshots');
	// const scrollDiv = screenShots.querySelector('#install-dialog .screenshots .scroll-div');
	// const innerDiv = scrollDiv.querySelector('div');
	// let curPos;

	// const supportsInstallPrompt = 'onbeforeinstallprompt' in window;

	// window.addEventListener('load', e => {
	// 	if (mksw.installButton) {
	// 		mksw.installButton.disabled = window.deferredPrompt === undefined ? supportsInstallPrompt : false;
	// 	}
	// });

	// window.addEventListener('beforeinstallprompt', e => {
	// 	e.preventDefault();

	// 	if (mksw.installButton) {
	// 		mksw.installButton.disabled = false;
	// 	}
	// });

	// if (mksw.installButton) {
	// 	if (!supportsInstallPrompt) {
	// 		const template = getInstallSheetTemplate();

	// 		if (!installDialog.querySelector('.body')) {
	// 			screenShots.insertAdjacentHTML('beforebegin', template);
	// 		}
	// 	}

	// 	mksw.installButton.addEventListener('click', () => {
	// 		if (window.deferredPrompt) {
	// 			window.deferredPrompt.prompt();
	// 		}
	// 		else if (!supportsInstallPrompt) {
	// 			curPos = 0;
	// 			scrollDiv.scrollLeft = 0;
	// 			installDialog.showModal();
	// 			installDialog.querySelector('.body').scrollTop = 0;

	// 			setTimeout(() => {
	// 				installDialog.setAttribute('opened', '');
	// 			})
	// 		}
	// 	});
	// }

	// installDialog.addEventListener('transitionend', (e) => {
	// 	if (!installDialog.hasAttribute('opened')) {
	// 		installDialog.close();
	// 	}
	// });

	// closeButton.addEventListener('click', e => {
	// 	installDialog.removeAttribute('opened');

	// 	// fix for < iOS 17.2, when the install dialog is shown and closed the user can no longer scroll the page
	// 	// by removing overflow:hidden from the main content and reapplying it with a short delay this is fixed
	// 	const mainContent = document.querySelector('#main-content');
	// 	mainContent.style.overflow = 'auto';
	// 	setTimeout(() => {
	// 		mainContent.style.overflow = 'hidden';
	// 	}, 100);
	// });

	// backButton.addEventListener('click', e => {
	// 	curPos = Math.max(scrollDiv.scrollLeft - 276, 0);
	// 	scrollDiv.scrollTo({ left: curPos, behavior: 'smooth' });
	// });

	// forwardButton.addEventListener('click', e => {
	// 	curPos = Math.min(scrollDiv.scrollLeft + 276, 552);
	// 	scrollDiv.scrollTo({ left: curPos, behavior: 'smooth' });
	// });

	// window.addEventListener('appinstalled', e => {
	// 	if (mksw.installButton) {
	// 		mksw.installButton.disabled = true;
	// 	}
	// });
})();

