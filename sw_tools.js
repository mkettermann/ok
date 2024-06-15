"use strict"
/**********************************\\
//  MK SW - Tools                   \\
//__________________________________*/
// Versionamento, Cacheamento, PWA

class mkSw {
	config = null;

	// Registra e vincula a função de cada evento
	static start = async (config) => {
		if (typeof config == "object") {
			if (config.cache != true) {
				config.cache = false;
			}
			if (config.url == null) {
				config.url = "/sw.js?cache=" + config.cache;
			}
			if (config.quiet == false) {
				config.log = true;
			} else {
				config.log = false;
			}
			if (config.aoAtualizarVersao != null) {
				mkSw.aoAtualizarVersao = config.aoAtualizarVersao;
			}
		}
		mkSw.config = config;
		// Não iniciar quando indisponível
		if (!("serviceWorker" in navigator)) {
			mkSw.showError("Sem suporte a Service Worker (Verificar HTTPS)", "")
			return null;
		}

		// Registrar do SW
		await navigator.serviceWorker.register(mkSw.config.url).catch((err) => mkSw.showError("Register", err));

		// Valida Registro
		let asyncRegistro = navigator.serviceWorker.getRegistration();
		asyncRegistro.catch((err) => mkSw.showError("GET Registro", err));
		let registro = await asyncRegistro;
		if (registro == null) {
			mkSw.showError("Registro Nulo", "Falhou em obter a versão atual");
			return null;
		}

		// LOG INFO
		if (mkSw.config.log) mkSw.showInfo("Registro bem sucedido", registro.scope)
		if (mkSw.config.log) mkSw.showInfo("Cache Ativo", mkSw.config.cache);

		// GATILHO de UPDATE (Só se executa se o SW for modificado)
		registro.addEventListener("updatefound", (ev) => {
			const instalacao = registro.installing;
			instalacao?.addEventListener("statechange", () => {
				if (instalacao.state == "installed") { // installed / activating / activated
					// Nova Versão Instalada (Informar usuário)
					if (mkSw.config.log) mkSw.showInfo("Concluida nova instalação do SW (por byte) (Solicitando versão)", instalacao.state);
					mkSw.sendMessageToSW({ action: "Versão" })
				}
				if (mkSw.config.log) mkSw.showInfo("Estado da instalação: ", instalacao.state);
			})
		})

		// GATILHO de COMUNICAÇÃO
		navigator.serviceWorker.addEventListener("message", ev => {
			if (mkSw.config.log) mkSw.showInfo("<< COMUNICAÇÃO", ev.data);
			switch (ev.data.action) {
				case "cache-atualizado":
					if (mkSw.config.log) mkSw.showInfo("Dados Atualizados", ev.data.ver);
					break;
				case "Versão":
					if (mkSw.config.log) mkSw.showInfo("Versão", ev.data.ver);
					mkSw.aoAtualizarVersao(ev.data.ver);
					break;
				case "sync":
					if (mkSw.config.log) mkSw.showInfo("Sincronizado", ev.data.ver);
					break;
			}
		})

		return mkSw.config;
	}

	static showError = (msg, erro) => {
		console.log(`%c>> %cSW_ERRO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0009;color:red;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", erro);
	}

	static showInfo = (msg, data) => {
		console.log(`%c>> %cSW_INFO: %c${msg}%c ->`, "color:MediumOrchid;", "color:MediumSpringGreen;", "background:#0005;color:green;border-radius:3px;padding:0px 3px;", "color:MediumOrchid;", data);
	}

	static aoAtualizarVersao = (versao) => {
		if (mkSw.config.log) mkSw.showInfo("fn aoAtualizarVersao recebeu: ", versao);
	}

	// Atualizar no SW.
	static getUpdate = () => {
		if (mkSw.config.log) mkSw.showInfo("Solicitando Update de Versão...", ev.data.ver);
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.update();
		});
	}
	// Desregistrar no SW.
	static del = () => {
		if (mkSw.config.log) mkSw.showInfo("Desregistrando Serviço...", ev.data.ver);
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister().then(r => {
				if (mkSw.config.log) mkSw.showInfo("SW Desregistrado.", ev.data.ver);
			});
		});
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		if (mkSw.config.log) mkSw.showInfo(">> COMUNICAÇÃO", message);
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(message)
		} else {
			if (mkSw.config.log) mkSw.showError("Sem controller para enviar mensagem.", navigator.serviceWorker.controller);
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