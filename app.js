if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./sw.js").then((reg) => {
		// mkt.l("Service Worker Registrado:", reg);
	}).catch((err) => {
		mkt.l("Falhou em registrar o Service Worker:", err);
	});
} else {
	mkt.w("Sem suporte a Service Worker (Verificar HTTPS)");
}