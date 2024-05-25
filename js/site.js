let l = (...s) => {
	console.log("=>", ...s);
};

let icoArquivo =
	"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16' class='icoArquivo'><path d='M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z'/></svg>";
let = pathIcoAdd =
	"<path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/><path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>";
let = pathIcoEdit =
	"<path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z'/>";

let arq = null;

let listas = [];
let keys = [];
// KVLR
// K (Chave)	- V (Valor) - L (Label) - R (REGEX)	- T (TAG Html) - A (Attributos Tag) - I (Value no Inner)
keys.push({ k: "mCod", v: "", l: "Id", r: "", t: "input", a: "type='text'", i: false });
keys.push({ k: "mTit", v: "", l: "Título", r: "", t: "input", a: "type='text'", i: false });
keys.push({ k: "mTit2", v: "", l: "SubTítulo", r: "", t: "input", a: "type='text'", i: false });
keys.push({ k: "mDat", v: "", l: "Data", r: mk.util.data[1], t: "input", a: "type='text'", i: false });
keys.push({ k: "mDes", v: "", l: "Descrição", r: "", t: "textarea", a: "cols='50' rows='10'", i: true });

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
	let codificado = fi(mk.encod(JSON.stringify(listas[0].dadosFull)));
	l(codificado.length);
	var a = document.createElement("a");
	var blobData = new Blob([codificado]);
	a.href = URL.createObjectURL(blobData);
	a.download = "cc" + mk.getFullData() + ".zip";
	a.click();
};

const aoReceberConteudo = (conteudo) => {
	listas[0] = new mk(
		conteudo,
		".divListagemContainer",
		"#modelo",
		".iConsultas",
		{
			keys: keys,
		}
	);
	mk.QverOff(".body");
	mk.QverOn(".listas");
};

const aoClicarCriar = () => {
	listas.push(
		new mk([], ".divListagemContainer", "#modelo", ".iConsultas", {
			keys: keys,
		})
	);
	mk.QverOff(".body");
	mk.QverOn(".listas");
};

const aoSair = () => {
	listas = [];
	mk.QverOn(".body");
	mk.QverOff(".listas");
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

const aoImportarDescodificado = async () => {
	l("Importar");
	mkt = mk.Q("input[name='importar']").click();
};

const aoAlterarInputImport = async (ev) => {
	let arqs = ev.target.files;
	l(arqs);
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
	l(arqs);
	if (arqs.length > 0) {
		let alvo = mk.getEClass(mk.Q(ev.target), "descarregavel").children[0];
		alvo.innerHTML = icoArquivo + arqs[0].name;
		let conteudo = await lerTexto(arqs[0]);
		let d = JSON.parse(mk.decod(fo(conteudo)));
		aoReceberConteudo(d);
	}
};

const aoDescarregar = async (ev) => {
	ev.preventDefault();
	let arqs = ev.dataTransfer.files; // the files that were dropped
	if (arqs.length > 0) {
		let alvo = mk.getEClass(mk.Q(ev.target), "descarregavel").children[0];
		alvo.innerHTML = icoArquivo + arqs[0].name;
		let conteudo = await lerTexto(arqs[0]);
		let d = JSON.parse(mk.decod(fo(conteudo)));
		aoReceberConteudo(d);
	}
	mk.QAll(".carga").forEach((e) => {
		e.classList.remove("carga");
	});
	mk.QAll("input[type='file']").forEach((e) => {
		e.value = "";
	});
};

const aoPassarCarga = (ev) => {
	ev.preventDefault();
	let eSobre = ev.toElement;
	mk.QAll(".carga").forEach((e) => {
		e.classList.remove("carga");
	});
	if (eSobre.classList.contains("descarregavel")) {
		eSobre.classList.add("carga");
	}
};

const aoClicarNivel2Cancelar = () => {
	mk.QverOn(".listas");
	mk.QverOff(".operacaoContainer");
};

const uiGetADD = async (listId) => {
	mk.QverOff(".listas");
	mk.QverOn(".operacaoContainer");
	mk.Q(".operacaoTitulo").innerHTML = "Adicionar";
	mk.Q(".operacaoAcao").innerHTML = "Adicionar";
	mk.Q(".operacaoAcaoIco").innerHTML = pathIcoAdd;
	mk.Q(".operacaoBotao").setAttribute(
		"onclick",
		"uiSetADD(" + listId + ")"
	);
	l(listas[listId].getModel());
	await mk.mkMoldeOA(
		listas[listId].getModel(),
		"#modeloOperacao",
		".operacaoCampos"
	);
	mk.QSet(
		".operacaoCampos input[name='" + listas[listId].c.pk + "']",
		listas[listId].getNewPK()
	);
};

const uiGetEDIT = async (tr, listId) => {
	mk.QverOff(".listas");
	mk.QverOn(".operacaoContainer");
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mk.Q(".operacaoTitulo").innerHTML = "Editar";
	mk.Q(".operacaoAcao").innerHTML = "Editar";
	mk.Q(".operacaoAcaoIco").innerHTML = pathIcoEdit;
	mk.Q(".operacaoBotao").setAttribute(
		"onclick",
		"uiSetEDIT('" + k + "','" + v + "', " + listId + ")"
	);
	let objeto = listas[listId].dadosFull.find((o) => o[k] == v);
	// l("Editando: [k:" + k + ",v:" + v + "]", objeto);
	await mk.mkMoldeOA(
		listas[listId].getKVLR(objeto),
		"#modeloOperacao",
		".operacaoCampos"
	);
};

const uiGetDEL = async (tr, listId) => {
	let k = listas[listId].c.pk;
	let v = tr.getAttribute("id");
	mk.mkConfirma("Você realmente quer deletar esta linha?").then((r) => {
		if (r) uiSetDEL(k, v, listId);
	});
};

// ACOES
const uiSetADD = async (listId) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	// Método de ADICIONAR da biblioteca:
	listas[listId].add(obj);
	mk.QverOff(".operacaoContainer");
	mk.QverOn(".listas");
};
const uiSetEDIT = async (k, v, listId) => {
	let obj = mk.mkGerarObjeto(".operacaoCampos");
	// Método de EDITAR da biblioteca:
	listas[listId].edit(obj, k, v);
	mk.QverOff(".operacaoContainer");
	mk.QverOn(".listas");
};
const uiSetDEL = async (k, v, listId) => {
	// Método de DELETAR da biblioteca:
	listas[listId].del(k, v);
	mk.QverOff(".operacaoContainer");
	mk.QverOn(".listas");
};
const uiClearFiltro = async (listId) => {
	// Método de LIMPAR FILTRO da biblioteca:
	listas[listId].clearFiltro();
	mk.QverOff(".operacaoContainer");
	mk.QverOn(".listas");
};