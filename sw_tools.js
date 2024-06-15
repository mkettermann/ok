"use strict"
/**********************************\\
//  MK SW - Tools                   \\
//__________________________________*/
// Versionamento, Cacheamento, PWA

class mkSw {
	static config = null;
	static workerUrl = "";
	static updateConcluido = null;

	// Registra e vincula a função de cada evento
	static start = async (config) => {
		if (typeof config == "object") {
			if (config.cache != true) {
				config.cache = false;
			}
			if (config.quiet == false) {
				config.log = true;
			} else {
				config.log = false;
			}
			if (config.url == null) {
				mkSw.workerUrl = new URL(location.href);
				mkSw.workerUrl.pathname += "sw.js"
				mkSw.workerUrl.searchParams.set("cache", config.cache);
				mkSw.workerUrl.searchParams.set("log", config.log);
				config.url = mkSw.workerUrl.href;
			}
			if (config.aoAtualizarVersao != null) {
				mkSw.aoAtualizarVersao = config.aoAtualizarVersao;
			}
			config.versao = mkSw._getVersaoAtual();
		}
		mkSw.config = config;
		// Não iniciar quando indisponível
		if (!("serviceWorker" in navigator)) {
			mkSw.showError("Sem suporte a Service Worker (Verificar HTTPS)", "")
			return null;
		}

		// Registrar do SW
		let registro = await navigator.serviceWorker.register(mkSw.workerUrl.href).catch((err) => mkSw.showError("Register", err));

		// Valida Registro
		// let registro = await navigator.serviceWorker.getRegistration().catch((err) => mkSw.showError("GET Registro", err));
		if (registro == null) {
			mkSw.showError("Registro Nulo", "Falhou em obter a versão atual");
			return null;
		}

		// GATILHO de UPDATE (Só se executa se o SW for modificado)
		navigator.serviceWorker.getRegistration().then(reg => {
			mkSw.showInfo("Registro bem sucedido", registro.scope)
			mkSw.showInfo("Cache Ativo", mkSw.config.cache);

			if (reg) reg.onupdatefound = (ev) => {
				const instalacao = reg.installing;

				if (instalacao) instalacao.onstatechange = () => {
					mkSw.showInfo("Estado da instalação: ", instalacao.state);
					if (instalacao.state == "installed") { // installed / activating / activated
						mkSw.skipWaiting();
					}
				};

			};

		}).catch(err => { mkSw.showError("Falhou em obter a versão atual", err) })

		// GATILHO de COMUNICAÇÃO
		navigator.serviceWorker.addEventListener("message", ev => {
			mkSw.showInfo("<< COMUNICAÇÃO", ev.data);
			switch (ev.data.action) {
				case "UpdateFull":
					mkSw.showInfo("Update Concluído", ev.data.ver);
					mkSw.updateConcluido = ev.data.ver;
					break;
				case "Versão":
					if (ev.data.ver != mkSw._getVersaoAtual()) {
						mkSw.showInfo(`Versão MUDOU:`, [mkSw._getVersaoAtual(), ev.data.ver]);
						mkSw._setVersaoAtual(ev.data.ver);
						mkSw.aoAtualizarVersao(ev.data.ver);
					}
					break;
				case "sync":
					mkSw.showInfo("Sincronizado", ev.data.ver);
					break;
			}
		})

		return mkSw.config;
	}

	// Out of Worker
	static showError = (msg, erro) => {
		console.log(`%cO> %cSW_ERRO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
	}

	// Out of Worker
	static showInfo = (msg, data) => {
		console.log(`%cO> %cSW_INFO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
	}

	static aoAtualizarVersao = (versao) => {
		mkSw.showInfo("fn aoAtualizarVersao recebeu: ", versao);
	}

	// Atualizar no SW.
	static getUpdate = () => {
		return new Promise((r, re) => {
			mkSw.showInfo("Solicitando Update de Versão...");
			navigator.serviceWorker?.getRegistration().then(reg => {
				reg.update();
				r();
			}).catch(erro => {
				re(erro);
			});
		})
	}
	// Solicita Versao.
	static getVersao = () => {
		if (!mkSw.sendMessageToSW({ action: "Versão" })) {
			re("Falha de comunicação");
		}
	}
	// Desregistrar no SW.
	static del = () => {
		mkSw.showInfo("Desregistrando Serviço...");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister().then(r => {
				mkSw.showInfo("SW Desregistrado.");
			});
		});
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		mkSw.showInfo(">> COMUNICAÇÃO", message);
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(message)
			return true;
		} else {
			mkSw.showError("Sem controller para enviar mensagem.", navigator.serviceWorker.controller);
			return false;
		}
	}
	// Update All Clients via Message
	static requestUpdate = async () => {
		await mkSw.getUpdate().catch(ree => { re(ree) });
		if (!mkSw.sendMessageToSW({
			action: "UpdateFull"
		})) {
			re("Falha de comunicação");
		}
	}

	// Update All Clients via Message
	static skipWaiting = async () => {
		(await navigator.serviceWorker?.getRegistration()).waiting.postMessage({ action: "skipWaiting" })
	}

	static _getVersaoAtual = () => {
		if (!localStorage.sw_VersaoAtual) localStorage.sw_VersaoAtual = "0.0";
		return localStorage.sw_VersaoAtual;
	};

	static _setVersaoAtual = (versao) => {
		localStorage.sw_VersaoAtual = versao;
	};
}