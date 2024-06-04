/**********************************\\
//  MK SW - Tools - Offline         \\
//__________________________________*/

if ("serviceWorker" in navigator) {
	// Registro do SW
	navigator.serviceWorker.register("./sw.js").then((reg) => {
		mkt.l(`%cSW Registrado em ${reg.scope}`, "color:green;");
	}).catch((err) => {
		mkt.l("%cRegistrar SW Falhou: ", "color:red;background-color:black;", err);
	});

	// Verificação da Versão Atual
	navigator.serviceWorker.getRegistration()
		.then(reg => {
			reg.addEventListener("updatefound", (ev) => {
				const swInstall = reg.installing;
				swInstall.addEventListener("statechange", () => {
					if (swInstall.state == "installed") {
						// Nova Versão Instalada (Informar usuário)
						mkt.l("%cNova Versão Instalada e Waiting Reload. ", "color:lime;");
						if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = "Uma nova versão foi encontrada. Atualize.";
						if (mkt.Q("#indexRefresh")) mkt.QverOn("#indexRefresh");
					} else {
						// Atual em uso
						mkt.l("%cNova versão atualmente em uso.", "color:green;");
						if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = "Nova Versão instalada.";
					}
				})
			})
		}).catch(err => {
			mkt.l("%cErro durante verificação da versão atual.", "color:red;background-color:black;");
		});

	//
	navigator.serviceWorker.addEventListener("message", ev => {
		switch (ev.data.action) {
			case "cache-atualizado":
				if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = "Cache Atualizado.";
				break;
			case "sync":
				if (mkt.Q("#swOutputInfo")) mkt.Q("#swOutputInfo").innerHTML = `Sync Tag: ${ev.data.str}`;
				break;
		}
	})

} else {
	mkt.l("%cSem suporte a Service Worker (Verificar HTTPS)", "color:red;background-color:black;");
}

class mkSw {
	// Atualizar no SW.
	static getUpdate = () => {
		mkt.l("%c>> Update Register.", "color:gold;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.update();
		});
	}
	// Desregistrar no SW.
	static del = () => {
		mkt.l("%c>> Desregistrando SW.", "color:gold;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister();
		});
	}
	// Registrar pra Sincronizar
	static returnTagOnSync = (tag) => {
		if ("SyncManager" in window) {
			mkt.l("%c>> Sending to Sync SW:", "color:gold;", tag);
			navigator.serviceWorker?.getRegistration().then(reg => {
				reg.sync.register(tag);
			});
		}
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		mkt.l("%c>> To SW:", "color:gold;", message);
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(message)
		} else {
			mkt.l("%cSem controller para enviar mensagem.", "color:red;");
		}
	}
	// Update All Clients via Message
	static requestCacheUpdate = () => {
		mkSw.sendMessageToSW({
			action: "cacheUpdate"
		})
	}
}