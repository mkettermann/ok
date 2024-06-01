let arq = null;

let listas = [];
let keys = [
	{ k: "mTit", l: "Título", requer: true },
	{ k: "mDes", l: "Descrição", tag: "textarea", atr: `rows="10"`, requer: true },
	{ k: "mTit2", l: "SubTítulo", requer: true, f: false },
	{ k: "mCod", l: "COD", requer: true, f: false },
	{ k: "mDat", l: "Data", atr: `type="date"`, v: mkt.dataGetData(), requer: true },
];
keys = keys.map(i => new mktm(i).toObject())

// FUNCOES
const fr = (i) => {
	let f = {};
	for (let e of i) {
		f[e] ? f[e]++ : (f[e] = 1);
	}
	return Math.floor(
		Object.values(f).reduce((a, b) => {
			return (a + b) / 2;
		})
	);
};

const em = (i, x, s) => {
	let o = i;
	for (let c = x; c > 0; c--) {
		o = en(o, s);
	}
	return o;
};

const en = (i, s) => {
	let u = i.length - 1;
	let o = [];
	let c = 0;
	while (c <= u) {
		let p = (c + 1) % 4;
		if (p == 0 && c != 0) {
			s
				? o.push(...[i[c - 2], i[c], i[c - 1], i[c - 3]])
				: o.push(...[i[c], i[c - 3], i[c - 1], i[c - 2]]);
		}
		c++;
	}
	return o;
};

const re = (i) => {
	let c = "";
	while (!(i.length % 4 == 0)) {
		c += i[i.length - 1];
		i = i.slice(0, i.length - 1);
	}
	return [i, c];
};

const op = (i) => {
	let b = [];
	let a = [
		..."VnyEqWRBOUYsz2391LbGNuHgeachTjdrAioX0MwPZQkStmv4pJx78=KlDI65CFf",
	];
	let c = a.slice(60, a.length);
	b = em(a, i, 1);
	let o = [];
	for (let c = 0; c < b.length; c += 4)
		o.push(b[c + 2] + b[c + 1] + b[c + 3] + b[c]);
	o.sort().reverse();
	for (let x in o) o[x] = [...o[x]].reverse().join("");
	return [...(o.join("") + c.join(""))];
};

const m = (i, b, r) => {
	if (r) b = b.reverse();
	let d = b.length;
	let o = [];
	for (let x in i) {
		let c = b.indexOf(i[x]) + 1;
		if (c >= d) c = 0;
		o.push(b[c]);
	}
	return o;
};

const fi = (i) => {
	i = [...i];
	let r = re(i);
	let e = em(r[0], fr(i) + 1, true);
	let mo = Math.floor(Math.random() * 99);
	let b = op(mo);
	let o = m(e, b, false);
	return mo.toString().padStart(2, "0") + o.join("") + r[1];
};

const fo = (i) => {
	let mo = Number(i.substring(0, 2));
	let b = op(mo);
	let a = m([...i.substring(2, i.length)], b, true);
	let r = re(a);
	let e = em(r[0], fr(a) + 1, false);
	let o = [];
	for (let p = 0; p <= e.length; p++) o[p] = e[p];
	return o.join("") + r[1];
};

const aoExportar = () => {
	let codificado = fi(mkt.to64(JSON.stringify(listas[0].dadosFull)));
	var a = document.createElement("a");
	var blobData = new Blob([codificado]);
	a.href = URL.createObjectURL(blobData);
	a.download = "cc" + mkt.dataGetData() + ".zip";
	a.click();
};

const configListagem = (conteudo) => {
	let mkt_cfg = new mktc(keys);
	mkt_cfg.dados = [];
	if (conteudo) mkt_cfg.dados = conteudo;
	mkt_cfg.url = null;
	mkt_cfg.sortBy = "mTit";
	mkt_cfg.sortDir = "mTit";
	mkt_cfg.aoConcluirExibicao = () => {
		mkt.Q(".totais").innerHTML = `${listas[0].dadosFull.length} Registros.`
	};
	mkt_cfg.aoIniciarListagem = () => {
		mkt.Q(".totais").innerHTML = ``
	};
	return mkt_cfg;
}

const aoReceberConteudo = (conteudo) => {
	listas[0] = new mkt(configListagem(conteudo));
	mkt.QverOff(".body");
	mkt.QverOn(".listas");
};

const aoClicarCriar = () => {
	listas[0] = new mkt(configListagem());
	mkt.QverOff(".body");
	mkt.QverOn(".listas");
};

const aoSair = () => {
	listas = [];
	mkt.QverOn(".body");
	mkt.QverOff(".listas");
};

const lerTexto = async (arq) => {
	return new Promise((r) => {
		let leitor = new FileReader();
		leitor.onload = () => {
			r(leitor.result);
		};
		leitor.readAsText(arq);
	});
};

const aoAlterarInputImport = async (ev) => {
	let arqs = ev.target.files;
	if (arqs.length > 0) {
		let conteudo = await lerTexto(arqs[0]);
		splitado = conteudo.split("█");
		let dados = [];
		for (var i = 0; i < splitado.length - 1; i = i + 5) {
			dados.push({
				mCod: splitado[i],
				mTit: splitado[i + 1],
				mTit2: splitado[i + 2],
				mDat: splitado[i + 3],
				mDes: splitado[i + 4],
			});
		}
		aoReceberConteudo(dados);
	}
};

const aoAlterarInput = async (ev) => {
	let arqs = ev.target.files;
	if (arqs.length > 0) {
		let alvo = mkt.Q(ev.target).closest(".descarregavel").children[0];
		alvo.innerHTML = arqs[0].name;
		let conteudo = await lerTexto(arqs[0]);
		let d = JSON.parse(mkt.from64(fo(conteudo)));
		aoReceberConteudo(d);
	}
};

const aoDescarregar = async (ev) => {
	ev.preventDefault();
	let arqs = ev.dataTransfer.files; // the files that were dropped
	if (arqs.length > 0) {
		let alvo = mkt.Q(ev.target).closest(".descarregavel").children[0];
		alvo.innerHTML = arqs[0].name;
		let conteudo = await lerTexto(arqs[0]);
		let d = JSON.parse(mkt.from64(fo(conteudo)));
		aoReceberConteudo(d);
	}
	mkt.QAll(".carga").forEach((e) => {
		e.classList.remove("carga");
	});
	mkt.QAll("input[type='file']").forEach((e) => {
		e.value = "";
	});
};

const aoPassarCarga = (ev) => {
	ev.preventDefault();
	let eSobre = ev.toElement;
	mkt.QAll(".carga").forEach((e) => {
		e.classList.remove("carga");
	});
	if (eSobre.classList.contains("descarregavel")) {
		eSobre.classList.add("carga");
	}
};

const aoClicarNivel2Cancelar = () => {
	mkt.QverOn(".listas");
	mkt.QverOff(".operacaoContainer");
};

const uiGetADD = async (listId) => {
	mkt.QverOff(".listas");
	mkt.QverOn(".operacaoContainer");
	mkt.Q(".operacaoTitulo").innerHTML = "Adicionar";
	mkt.Q(".operacaoAcao").innerHTML = "Adicionar";
	mkt.Q(".operacaoBotao i").classList.remove("bi-pencil");
	mkt.Q(".operacaoBotao i").classList.add("bi-plus-circle");
	mkt.Q(".operacaoBotao").setAttribute(
		"onclick",
		"uiSetADD(" + listId + ")"
	);
	await mkt.moldeOA(listas[listId].getModel(), "#modeloOperacao", ".operacaoCampos", true, false);
	mkt.QAll(".operacaoCampos .iConsultas").forEach(e => { e.classList.remove("iConsultas"); e.classList.add("iNovo") })
	mkt.Q(".operacaoCampos .iNovo[name='" + listas[listId].c.pk + "']").value = listas[listId].getNewPK();
	mkt.QAll(".operacaoCampos .iNovo").forEach(e => {
		e.classList.add("w-100")
	});
	mkt.Q(".operacaoCampos .iNovo[name='mTit']").focus();
};

const uiGetEDIT = async (este, listId) => {
	let cod = este.closest("tr").id;
	mkt.QverOff(".listas");
	mkt.QverOn(".operacaoContainer");
	mkt.Q(".operacaoTitulo").innerHTML = "Editar";
	mkt.Q(".operacaoAcao").innerHTML = "Editar";
	mkt.Q(".operacaoBotao i").classList.remove("bi-plus-circle");
	mkt.Q(".operacaoBotao i").classList.add("bi-pencil");
	mkt.Q(".operacaoBotao").setAttribute(
		"onclick",
		"uiSetEDIT('" + listas[listId].c.pk + "','" + cod + "', " + listId + ")"
	);
	await mkt.moldeOA(listas[listId].getModel(cod), "#modeloOperacao", ".operacaoCampos");
	mkt.QAll(".operacaoCampos .iConsultas").forEach(e => { e.classList.remove("iConsultas"); e.classList.add("iEdit") })
	mkt.QAll(".operacaoCampos .iEdit").forEach(e => {
		e.classList.add("w-100")
	});
};

const uiGetDEL = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mkt.mkConfirma("Você realmente quer deletar esta linha?").then((r) => {
		if (r) uiSetDEL(k, v, listId);
	});
};

/**********************************\\
//  CRUD UI								          \\
//__________________________________*/
const uiSetADD = async (listId) => {
	let obj = mkt.geraObjForm(".operacaoCampos");
	// Método de ADICIONAR da biblioteca:
	listas[listId].add(obj);
	mkt.QverOff(".operacaoContainer");
	mkt.QverOn(".listas");
};
const uiSetEDIT = async (k, v, listId) => {
	let obj = mkt.geraObjForm(".operacaoCampos");
	// Método de EDITAR da biblioteca:
	listas[listId].edit(obj, k, v);
	mkt.QverOff(".operacaoContainer");
	mkt.QverOn(".listas");
};
const uiSetDEL = async (k, v, listId) => {
	// Método de DELETAR da biblioteca:
	listas[listId].del(k, v);
	mkt.QverOff(".operacaoContainer");
	mkt.QverOn(".listas");
};
const uiClearFiltro = async (listId) => {
	// Método de LIMPAR FILTRO da biblioteca:
	listas[listId].clearFiltro();
	mkt.QverOff(".operacaoContainer");
	mkt.QverOn(".listas");
};

/**********************************\\
//  PERFORMANCE						          \\
//__________________________________*/
const site_see_performance = (type, name, data, options = "") => {
	mkt.l(`%c${type}: %c${name} | %c${data ? Math.round(data) + 'ms' : ''} %c${options}`, "color: red",
		"color: green", "color: gray", "color: lightblue");
}

// ONLOAD
window.addEventListener("load", () => {
	// Navigation Timing API
	const navEntries = performance.getEntriesByType("navigation");
	navEntries.forEach(entry => {
		site_see_performance("navigation", "fetch-start", entry.fetchStart);
		const ttfb = entry.responseStart - entry.fetchStart;
		site_see_performance("navigation", "ttfb", ttfb);
	});
	// OLD timing API
	if (navEntries.length == 0) {
		site_see_performance("navigation", "fetch-start", performance.timing.fetchStart);
		const ttfb = performance.timing.responseStart - performance.timing.fetchStart;
		site_see_performance("navigation", "ttfb", ttfb);
	}
	// Resource Timing API
	const resEntries = performance.getEntriesByType("resource");
	resEntries.forEach(entry => {
		const size = `${Math.round(entry.encodedBodySize / 1024)}Kb`;
		const ttfb = entry.responseStart - entry.fetchStart;
		site_see_performance(entry.initiatorType, entry.name, ttfb, size);
	});

	// Performance Observer for User Timing
	const userObserver = new PerformanceObserver(list => {
		list.getEntries().forEach(entry => {
			site_see_performance(entry.entryType, entry.name,
				entry.entryType == "mark" ? entry.startTime : entry.duration);
		});
	});
	userObserver.observe({ entryTypes: ["mark", "measure"] });

	// Paint Timing
	const paintObserver = new PerformanceObserver(list => {
		const firstPaint = list.getEntriesByName("first-paint");
		if (firstPaint.length > 0) {
			site_see_performance("Paint", "First Paint", firstPaint[0].startTime);
		}
		const firstContentfulPaint = list.getEntriesByName("first-contentful-paint");
		if (firstContentfulPaint.length > 0) {
			site_see_performance("Paint", "First Contentful Paint", firstContentfulPaint[0].startTime);
		}
	});
	try {
		userObserver.observe({ entryTypes: ["paint"] });
	} catch (e) {
		console.log("Paint Timing API not available");
	}

	// Long Task API
	const taskObserver = new PerformanceObserver(list => {
		list.getEntries().forEach(entry => site_see_performance("Long Task", "Thread used for too long"));
	});
	try {
		taskObserver.observe({ entryTypes: ["longtask"] });
	} catch (e) { }

	// Frame Timing API
	const frameObserver = new PerformanceObserver(list => {
		list.getEntries().forEach(entry => site_see_performance("Frame drop", "Problem",
			entry.duration));
	});
	try {
		frameObserver.observe({ entryTypes: ["frame"] });
	} catch (e) { }

	// Server Timing
	const serverTiming = performance.getEntriesByType("navigation")[0].serverTiming;
	serverTiming.forEach(timing => {
		site_see_performance("Server", timing.name, timing.duration);
	})
});