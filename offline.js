/**********************************\\
//  MK SW - Tools - Offline         \\
//__________________________________*/

if ("serviceWorker" in navigator) {
	// Registro do SW
	navigator.serviceWorker.register("./sw.js").then((reg) => {
		console.log(`%c>> SW_OUT:%c Registro DONE -> ${reg.scope}`, "color:MediumSpringGreen;", "color:MediumOrchid;");
	}).catch((err) => {
		console.log(`%c>> SW_OUT:%c Registro FAIL ->`, "color:MediumSpringGreen;", "color:MediumOrchid;", err);
	});

	// Verificação da Versão Atual
	// Primeira vez que entra: acredito que gere um erro por causa do assincrono do .registrar() ainda não concluiu, e aqui já ta dando .getRegistration().
	navigator.serviceWorker.getRegistration()
		.then(reg => {
			reg.addEventListener("updatefound", (ev) => {
				const swInstall = reg.installing;
				swInstall.addEventListener("statechange", () => {
					if (swInstall.state == "installed") { // installed / activating / activated
						// Nova Versão Instalada (Informar usuário)
						console.log(`%c>> SW_OUT:%c Nova versão instalada.`, "color:MediumSpringGreen;", "color:MediumOrchid;");

						// ---
						if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = "Nova versão encontrada. Atualize.";
						if (mkt.Q("#indexRefresh")) mkt.QverOn("#indexRefresh");
						// ---

					} else {
						console.log(`%c>> SW_OUT:%c Estado da versão: ${swInstall.state}`, "color:MediumSpringGreen;", "color:MediumOrchid;");
					}
				})
			})
		}).catch(err => {
			console.log(`%c>> SW_OUT:%c Falhou em obter a versão atual:`, "color:MediumSpringGreen;", "color:MediumOrchid;", err);
		});

	// COMUNICAÇÃO
	navigator.serviceWorker.addEventListener("message", ev => {
		switch (ev.data.action) {
			case "cache-atualizado":
				console.log(`%c>> SW_OUT:%c Dados Atualizados. Versão: ${ev.data.ver}`, "color:MediumSpringGreen;", "color:MediumOrchid;");

				// ---
				if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = "Cache Atualizado. Ver: " + ev.data.ver;
				// ---

				break;
			case "sync":
				console.log(`%c>> SW_OUT:%c INFO SINCRONIZADO. Versão: ${ev.data.ver}`, "color:MediumSpringGreen;", "color:MediumOrchid;");
				break;
		}
	})
} else {
	console.log(`%c>> SW_OUT:%c Sem suporte a Service Worker (Verificar HTTPS).`, "color:MediumSpringGreen;", "color:MediumOrchid;");
}

class mkSw {
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
		console.log(`%c>> SW_OUT:%c >> Comunicação:`, "color:MediumSpringGreen;", "color:MediumOrchid;", message);
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