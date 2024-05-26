if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("../sw.js").then(() => {
		mkt.l("Service Worker Registrado.");
	}).catch(() => {
		mkt.l("Service Worker NÃO Registrado.");
	});
} else {
	mkt.w("Sem Suporte a Service Worker")
}