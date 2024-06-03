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
						mkt.l("%cNova Versão Instalada e Waiting Reload: ", "color:lime;");
					} else {
						mkt.l("%cNova versão atualmente em uso.", "color:green;");
					}
				})
			})
		}).catch(err => {
			mkt.l("%cErro durante verificação da versão atual.", "color:red;background-color:black;");
		});

} else {
	mkt.l("%cSem suporte a Service Worker (Verificar HTTPS)", "color:red;background-color:black;");
}

class mkOffline {
	static getUpdate = () => {

	}
}