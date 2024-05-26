if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("../sw.js").then((reg) => {
		mkt.l("Service Worker Registrado:", reg);
	}).catch((err) => {
		mkt.l("Service Worker NÃO Registrado:", err);
	});
} else {
	mkt.w("Sem Suporte a Service Worker")
}