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
		mkSw.config = config;
		if (typeof mkSw.config == "object") {
			if (mkSw.config.cache != false) {
				mkSw.config.cache = true;
			}
			if (mkSw.config.log != null) {
				mkSw.config.log = mkSw.config.log;
			} else {
				mkSw.config.log = 1;
			}
			if (mkSw.config.url == null) {
				let url_path = location.pathname;
				let liof = url_path.lastIndexOf("/");
				if (liof >= 0) {
					url_path = location.pathname.slice(0, liof) + "/";
				}
				let fullUrl = location.origin + url_path;
				mkSw.showInfo("Full Url", fullUrl, 1)
				mkSw.workerUrl = new URL(fullUrl);
				mkSw.workerUrl.pathname += "sw.js"
				mkSw.workerUrl.searchParams.set("cache", mkSw.config.cache);
				mkSw.workerUrl.searchParams.set("log", mkSw.config.log);
				mkSw.config.url = mkSw.workerUrl.href;
			}
			if (mkSw.config.aoAtualizarVersao != null) {
				mkSw.aoAtualizarVersao = mkSw.config.aoAtualizarVersao;
			}
			mkSw.config.versao = mkSw._getVersaoAtual();
		}
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
			mkSw.showError("Falhou em obter a versão atual", registro);
			return null;
		}

		// GATILHO de UPDATE (Só se executa se o SW for modificado)
		navigator.serviceWorker.getRegistration().then(reg => {
			mkSw.showInfo("Registro bem sucedido", registro.scope, 1)
			mkSw.showInfo("Log Level", mkSw.config.log);
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

		}).catch(err => { mkSw.showError("Falhou", err) })

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
						let listaVersoes = [mkSw._getVersaoAtual(), ev.data.ver];
						mkSw.showInfo(`Versão MUDOU:`, listaVersoes);
						mkSw._setVersaoAtual(ev.data.ver);
						mkSw.aoAtualizarVersao(listaVersoes[1], listaVersoes[0]);
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
	static showError = (msg, erro, nivel = 2) => {
		if (mkSw.config.log >= nivel) console.log(`%cO> %cSW_ERRO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
	}

	// Out of Worker
	static showInfo = (msg, data, nivel = 2) => {
		if (mkSw.config.log >= nivel) console.log(`%cO> %cSW_INFO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
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
		mkSw.updateConcluido = null;
		let c = 0;
		await mkSw.getUpdate().catch(ree => { re(ree) });
		mkSw.sendMessageToSW({ action: "UpdateFull" });
		return new Promise((r, re) => {
			let esperandoRespostaUpdate = () => {
				if (mkSw.updateConcluido != null) {
					r(mkSw.updateConcluido);
				} else {
					if (c > 100) {
						re("Timeout");
					} else {
						setTimeout(() => {
							c++;
							esperandoRespostaUpdate();
						}, 10);
					}
				}
			}
			esperandoRespostaUpdate();
		});
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