// ===============================
// CONFIGURAÇÕES DO SITE
// Edite aqui com os dados reais.
// ===============================

const CONFIG = {
  nomeNegocio: "SoaresExpress",
  nomeEntregador: "Rafa",
  cidade: "Sua cidade",
  telefoneWhatsApp: "553198104460", // Ex: 5511999999999, sem +, espaços ou traços.
  gasolinaLitro: 7,
  taxaBase: 10,
  precoPorKm: 2,
  valorMinimo: 15,
  taxaForaArea: 12,
  taxaEspera: 7,
  taxaFragil: 5,
  adicionalMedio: 5,
  adicionalGrande: 10,
  multiplicadorExpressa: 1.35,
  multiplicadorUrgente: 1.55,
  multiplicadorNoite: 1.2,
  multiplicadorChuva: 1.25,
  multiplicadorNoiteChuva: 1.4
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
let ultimoPedido = "";
let soundEnabled = false;
let audioCtx = null;
let lastScrollSound = 0;
const $ = (selector) => document.querySelector(selector);

function buildWhatsappUrl(message) {
  return `https://wa.me/${CONFIG.telefoneWhatsApp}?text=${encodeURIComponent(message)}`;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function atualizarSite() {
  document.title = `${CONFIG.nomeNegocio} | Entregas de Moto`;
  const brand = $(".brand strong");
  if (brand) brand.textContent = CONFIG.nomeNegocio;

  setText("#baseFeeLabel", money.format(CONFIG.taxaBase));
  setText("#kmFeeLabel", money.format(CONFIG.precoPorKm));
  setText("#minFeeLabel", money.format(CONFIG.valorMinimo));
  setText("#gasLabel", `${money.format(CONFIG.gasolinaLitro)}/L`);

  const msg = `Olá! Vim pelo site da ${CONFIG.nomeNegocio} e quero pedir uma entrega.`;
  const url = buildWhatsappUrl(msg);
  ["headerWhatsapp", "contactWhatsapp", "floatingWhatsapp"].forEach((id) => {
    const link = document.getElementById(id);
    if (link) link.href = url;
  });
}

function setupMenu() {
  const btn = $("#menuBtn");
  const nav = $("#nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    playUiSound("click");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        playUiSound("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
  items.forEach((item) => observer.observe(item));
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      playUiSound("click");
      smoothScrollTo(target, 850);
    });
  });
}

function smoothScrollTo(target, duration = 800) {
  const start = window.scrollY;
  const topbar = $("#topbar");
  const offset = topbar ? topbar.offsetHeight + 10 : 0;
  const end = target.getBoundingClientRect().top + start - offset;
  const distance = end - start;
  const startTime = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function setupScrollEffects() {
  const progress = $("#scrollProgress");
  const topbar = $("#topbar");
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
    if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 16);
    if (soundEnabled && performance.now() - lastScrollSound > 420 && window.scrollY > 80) {
      lastScrollSound = performance.now();
      playUiSound("scroll");
    }
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function setupTilt() {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)");
  });
}

function setupMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) return;
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    item.addEventListener("mouseleave", () => item.style.transform = "");
    item.addEventListener("click", () => playUiSound("click"));
  });
}

function setupSound() {
  const btn = $("#soundBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    soundEnabled = !soundEnabled;
    btn.classList.toggle("active", soundEnabled);
    btn.textContent = soundEnabled ? "🔊 Som" : "🔇 Som";
    btn.setAttribute("aria-pressed", String(soundEnabled));
    playUiSound(soundEnabled ? "on" : "off");
  });
}

function playUiSound(type = "click") {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const map = {
    click: [520, 0.045, 0.035],
    reveal: [740, 0.03, 0.018],
    scroll: [260, 0.025, 0.012],
    on: [660, 0.09, 0.04],
    off: [180, 0.07, 0.035],
    success: [880, 0.11, 0.05]
  };
  const [frequency, duration, volume] = map[type] || map.click;
  oscillator.type = type === "scroll" ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * 0.55), now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function getOptionText(id) {
  const select = document.getElementById(id);
  return select.options[select.selectedIndex].text;
}

function getFormData() {
  return {
    cliente: $("#cliente").value.trim(),
    telefone: $("#telefone").value.trim(),
    origem: $("#origem").value.trim(),
    destino: $("#destino").value.trim(),
    distancia: Number($("#distancia").value),
    tipo: $("#tipo").value,
    tamanho: $("#tamanho").value,
    periodo: $("#periodo").value,
    idaVolta: $("#idaVolta").checked,
    foraArea: $("#foraArea").checked,
    espera: $("#espera").checked,
    fragil: $("#fragil").checked
  };
}

function calcularFrete(dados) {
  const itens = [];
  let subtotal = CONFIG.taxaBase;
  itens.push(["Taxa base", CONFIG.taxaBase]);

  const distanciaValor = dados.distancia * CONFIG.precoPorKm;
  subtotal += distanciaValor;
  itens.push([`${dados.distancia.toFixed(1)} km x ${money.format(CONFIG.precoPorKm)}`, distanciaValor]);

  if (dados.tamanho === "medio") { subtotal += CONFIG.adicionalMedio; itens.push(["Pacote médio", CONFIG.adicionalMedio]); }
  if (dados.tamanho === "grande") { subtotal += CONFIG.adicionalGrande; itens.push(["Pacote grande", CONFIG.adicionalGrande]); }
  if (dados.idaVolta) { subtotal += distanciaValor; itens.push(["Ida e volta", distanciaValor]); }
  if (dados.foraArea) { subtotal += CONFIG.taxaForaArea; itens.push(["Fora da área principal", CONFIG.taxaForaArea]); }
  if (dados.espera) { subtotal += CONFIG.taxaEspera; itens.push(["Espera no local", CONFIG.taxaEspera]); }
  if (dados.fragil) { subtotal += CONFIG.taxaFragil; itens.push(["Cuidado extra / frágil", CONFIG.taxaFragil]); }

  let multiplicador = 1;
  let adicionalNome = "";
  if (dados.tipo === "expressa") { multiplicador *= CONFIG.multiplicadorExpressa; adicionalNome += "Expressa "; }
  if (dados.tipo === "urgente") { multiplicador *= CONFIG.multiplicadorUrgente; adicionalNome += "Urgente "; }
  if (dados.periodo === "noite") { multiplicador *= CONFIG.multiplicadorNoite; adicionalNome += "Noite "; }
  if (dados.periodo === "chuva") { multiplicador *= CONFIG.multiplicadorChuva; adicionalNome += "Chuva "; }
  if (dados.periodo === "noiteChuva") { multiplicador *= CONFIG.multiplicadorNoiteChuva; adicionalNome += "Noite + chuva "; }

  let total = subtotal * multiplicador;
  if (multiplicador > 1) itens.push([`Adicional: ${adicionalNome.trim()}`, total - subtotal]);
  if (total < CONFIG.valorMinimo) { itens.push(["Ajuste para valor mínimo", CONFIG.valorMinimo - total]); total = CONFIG.valorMinimo; }
  return { total, itens };
}

function montarPedido(dados, total) {
  return [
    `Olá! Quero solicitar uma entrega pela ${CONFIG.nomeNegocio}.`,
    ``,
    `Cliente: ${dados.cliente}`,
    `Telefone: ${dados.telefone || "Não informado"}`,
    `Retirada: ${dados.origem}`,
    `Entrega: ${dados.destino}`,
    `Distância aproximada: ${dados.distancia.toFixed(1)} km`,
    `Tipo: ${getOptionText("tipo")}`,
    `Pacote: ${getOptionText("tamanho")}`,
    `Período: ${getOptionText("periodo")}`,
    `Ida e volta: ${dados.idaVolta ? "Sim" : "Não"}`,
    `Fora da área principal: ${dados.foraArea ? "Sim" : "Não"}`,
    `Espera no local: ${dados.espera ? "Sim" : "Não"}`,
    `Item frágil: ${dados.fragil ? "Sim" : "Não"}`,
    ``,
    `Valor estimado: ${money.format(total)}`,
    ``,
    `Pode confirmar disponibilidade e valor final?`
  ].join("\n");
}

function setupCalculator() {
  const form = $("#freteForm");
  const copyBtn = $("#copiarPedido");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const dados = getFormData();
    if (!dados.distancia || dados.distancia <= 0) {
      alert("Informe uma distância válida em km.");
      return;
    }
    const calculo = calcularFrete(dados);
    ultimoPedido = montarPedido(dados, calculo.total);
    $("#valorFrete").textContent = money.format(calculo.total);
    $("#resumoFrete").textContent = `Estimativa para ${dados.distancia.toFixed(1)} km, de "${dados.origem}" até "${dados.destino}".`;
    $("#breakdown").innerHTML = calculo.itens.map(([label, value]) => `<div><span>${label}</span><strong>${money.format(value)}</strong></div>`).join("");
    $("#sendWhatsapp").href = buildWhatsappUrl(ultimoPedido);
    $("#resultado").hidden = false;
    playUiSound("success");
    smoothScrollTo($("#resultado"), 500);
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      if (!ultimoPedido) { alert("Calcule o frete primeiro."); return; }
      try {
        await navigator.clipboard.writeText(ultimoPedido);
        alert("Pedido copiado!");
        playUiSound("success");
      } catch {
        alert("Não consegui copiar automaticamente. Use o botão do WhatsApp.");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarSite();
  setupMenu();
  setupReveal();
  setupSmoothScroll();
  setupScrollEffects();
  setupTilt();
  setupMagneticButtons();
  setupSound();
  setupCalculator();
});
