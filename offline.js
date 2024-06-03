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
		}
	})

} else {
	mkt.l("%cSem suporte a Service Worker (Verificar HTTPS)", "color:red;background-color:black;");
}

class mkSw {
	// Check for Updates.
	static getUpdate = (tag) => {
		mkt.l("%cChecking for Updates.", "color:green;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.update();
		});
	}
	// Desregistrar SW.
	static del = (tag) => {
		mkt.l("%cDesregistrando SW.", "color:yellow;");
		navigator.serviceWorker?.getRegistration().then(reg => {
			reg.unregister();
		});
	}
	// Message To SW. Via Controller
	static sendMessageToSW = (message) => {
		mkt.l("%cMessage To SW:", "color:gold;", message);
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage(message)
		} else {
			mkt.l("%cSem controller para enviar mensagem.", "color:red;");
		}
	}
	// Update All Clients via Message
	static requestUpdate = () => {
		mkSw.sendMessageToSW({
			action: "update"
		})
	}
}