"use strict"
/**********************************\\
//  MK SW - Tools                   \\
//__________________________________*/
// Versionamento, Cacheamento, PWA

class mkSw {
	// Registra e vincula a função de cada evento
	static start = async (config) => {
		if (typeof config == "object") {
			if (config.cache == true) {
				config.cache = true;
			}
			if (config.url == null) {
				config.url = "/sw.js?cache=" + config.cache;
			}
			if (config.aoAtualizarVersao != null) {
				mkSw.aoAtualizarVersao = config.aoAtualizarVersao;
			}
		}
		// Não iniciar quando indisponúvel
		if (!("serviceWorker" in navigator)) {
			mkSw.showError("Sem suporte a Service Worker (Verificar HTTPS)", "")
			return null;
		}

		// Registrar do SW
		await navigator.serviceWorker.register(config.url).catch((err) => mkSw.showError("Register", err));

		// Valida Registro
		let asyncRegistro = navigator.serviceWorker.getRegistration();
		asyncRegistro.catch((err) => mkSw.showError("GET Registro", err));
		let registro = await asyncRegistro;
		if (registro == null) {
			mkSw.showError("Registro Nulo", "Falhou em obter a versão atual");
			return null;
		}
		mkSw.showInfo("Registro bem sucedido", registro.scope)
		mkSw.showInfo("Cache Ativo", config.cache);
		// GATILHO de UPDATE (Só se executa se o SW for modificado)
		registro.addEventListener("updatefound", (ev) => {
			const instalacao = registro.installing;
			instalacao?.addEventListener("statechange", () => {
				if (instalacao.state == "installed") { // installed / activating / activated
					// Nova Versão Instalada (Informar usuário)
					mkSw.showInfo("Concluida nova instalação do SW (por byte) (Solicitando versão)");
					mkSw.sendMessageToSW({ action: "Versão" })
				}
				//mkSw.showInfo("Versão", swInstall.state);
			})
		})

		// GATILHO de COMUNICAÇÃO
		navigator.serviceWorker.addEventListener("message", ev => {
			switch (ev.data.action) {
				case "cache-atualizado":
					console.log(`%c>> SW_OUT:%c Dados Atualizados. Versão: ${ev.data.ver}`, "color:MediumSpringGreen;", "color:MediumOrchid;");
					break;
				case "Versão":
					mkSw.showInfo("Versão", ev.data.ver);
					mkSw.aoAtualizarVersao(ev.data.ver);
					break;
				case "sync":
					console.log(`%c>> SW_OUT:%c INFO SINCRONIZADO. Versão: ${ev.data.ver}`, "color:MediumSpringGreen;", "color:MediumOrchid;");
					break;
			}
		})
	}

	static showError = (msg, erro) => {
		console.log(`%c>> %cSW_ERRO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
	}

	static showInfo = (msg, data) => {
		console.log(`%c>> %cSW_INFO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
	}

	static aoAtualizarVersao = (versao) => {
		console.log(versao);
	}

	// Atualizar no SW.
	static getUpdate = () => {
		console.log(`%c>> SW_OUT:%c >> Solicitando Update...`, "color:MediumSpringGreen;", "color:MediumOrchid;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.update();
		});
	}
	// Desregistrar no SW.
	static del = () => {
		console.log(`%c>> SW_OUT:%c >> Desregistrando Serviço...`, "color:MediumSpringGreen;", "color:MediumOrchid;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister();
		});
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		console.log(`%c>> SW_OUT:%c >> COMUNICAÇÃO:`, "color:MediumSpringGreen;", "color:MediumOrchid;", message);
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(message)
		} else {
			console.log(`%c>> SW_OUT:%c >> Sem controller para enviar mensagem: `, "color:MediumSpringGreen;", "color:MediumOrchid;", message);
		}
	}
	// Update All Clients via Message
	static requestCacheUpdate = () => {
		mkSw.sendMessageToSW({
			action: "UpdateCache"
		})
	}
	// Registrar pra Sincronizar
	// static returnTagOnSync = (tag) => {
	// 	if ("SyncManager" in window) {
	// 		mkt.l("%c>> Sending to Sync SW:", "color:gold;", tag);
	// 		navigator.serviceWorker?.getRegistration().then(reg => {
	// 			reg.sync.register(tag);
	// 		});
	// 	}
	// }
}