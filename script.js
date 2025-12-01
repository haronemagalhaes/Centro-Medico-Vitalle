// ===== Config =====
const telefoneWhatsApp = "5582996316976";
const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbyiEI3R0mw7PrutWfGikiTTE2sg4kEtQvse24fqMfTfOcBUjY4On3DX6LrxkmjOClo/exec";

// ===== Dados vindos do Sheets (inicialmente vazios) =====
let especialidades = [];
let atendimentos = [];
let exames = [];
let terapias = [];

// Busca dados do Google Sheets (Apps Script)
async function carregarDadosDoSheets() {
  try {
    const resp = await fetch(SHEET_API_URL);
    if (!resp.ok) {
      throw new Error("Erro HTTP ao buscar dados: " + resp.status);
    }

    const todos = await resp.json();

    // Separa por grupo, de acordo com a coluna "grupo" da planilha
    especialidades = todos.filter((i) => i.grupo === "especialidades");
    atendimentos = todos.filter((i) => i.grupo === "atendimentos");
    exames = todos.filter((i) => i.grupo === "exames");
    terapias = todos.filter((i) => i.grupo === "terapias");

    console.log("Dados carregados do Sheets:", {
      especialidades,
      atendimentos,
      exames,
      terapias,
    });
  } catch (err) {
    console.error("Falha ao carregar dados do Google Sheets:", err);
    // Se quiser, aqui você pode mostrar uma mensagem na tela pro usuário
  }
}

/* ===== Saudações dinâmicas (horário de Brasília) ===== */
function _nowInBrasilia() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
}
function getSaudacaoBrasilia() {
  const h = _nowInBrasilia().getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}
function abrirWhatsApp(msgBody) {
  const saudacao = getSaudacaoBrasilia();
  const fullMsg = `${saudacao}! ${msgBody}`;
  const url = `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(
    fullMsg
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// ===== Utilidades de UI =====
function criarBotaoFaleConosco() {
  const alvo = document.getElementById("faleConoscoBtn");
  if (!alvo) return;

  const msgBody = "Gostaria de mais informações sobre os atendimentos.";
  alvo.innerHTML = `
    <a href="#"
       class="link-button destaque fale-cta only-text"
       onclick="abrirWhatsApp('${msgBody.replace(/'/g, "\\'")}'); return false;"
       rel="noopener noreferrer" aria-label="Fale Conosco pelo WhatsApp">
      <strong class="label">Fale Conosco</strong>
    </a>
  `;
}

/**
 * Renderiza cards por especialidade.
 *
 * Cada linha da planilha é 1 médico.
 * Se tiver mais de um médico com o mesmo "nome" (ex.: "Clínico Geral"),
 * eles aparecem TODOS dentro do mesmo card.
 */
function renderCards(lista, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Agrupa itens por nome da especialidade
  const porEspecialidade = {};
  lista.forEach((item) => {
    const key = item.nome || "";
    if (!key) return;
    if (!porEspecialidade[key]) {
      porEspecialidade[key] = [];
    }
    porEspecialidade[key].push(item);
  });

  const partes = Object.entries(porEspecialidade).map(([nome, medicos]) => {
    const base = medicos[0] || {};
    const idBase =
      base.id || nome.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const grupo = base.grupo || "";
    const isClinicoGeral = nome.toLowerCase().includes("clinico");

    // ===== LISTA DE MÉDICOS (foto + nome + CRM/CRP) =====
    let medicoListaHtml = "";

    // Para EXAMES não mostramos bloco de profissional
    if (grupo !== "exames") {
      // Atendimentos usam CRP, demais usam CRM
      const docLabel = grupo === "atendimentos" ? "CRP" : "CRM";

      medicoListaHtml = medicos
        .map((m) => {
          const fotoHtml = m.fotoUrl
            ? `
              <img
                src="${m.fotoUrl}"
                alt="Foto de ${m.medico || nome || "profissional"}"
                class="doctor-avatar"
                loading="lazy"
              />
            `
            : "";

          const nomeMedico = m.medico || "";
       const crmHtml = m.crm
  ? `<span class="doctor-crm">${m.crm}</span>`
  : "";


          // Se não tiver nada pra mostrar, pula
          if (!fotoHtml && !nomeMedico && !crmHtml) return "";

          if (isClinicoGeral) {
            // Para Clínico Geral: botão individual por médico (mais organizado)
            const msgMed = `Quero agendar uma consulta com ${
              m.medico || "o(a) médico(a)"
            } (${nome}).`;
            const msgMedEscapada = msgMed.replace(/'/g, "\\'");

            return `
              <div class="doctor-row doctor-row--with-button">
                ${fotoHtml}
                <div class="doctor-info">
                  ${
                    nomeMedico
                      ? `<span class="doctor-name">${nomeMedico}</span>`
                      : ""
                  }
                  ${crmHtml}
                  <button
                    type="button"
                    class="whats-main-btn whats-main-btn--secondary"
                    onclick="abrirWhatsApp('${msgMedEscapada}'); return false;"
                  >
                    <span class="whats-main-btn-label">
                      Agendar com ${nomeMedico || "profissional"}
                    </span>
                  </button>
                </div>
              </div>
            `;
          }

          return `
            <div class="doctor-row">
              ${fotoHtml}
              <div class="doctor-info">
                ${
                  nomeMedico
                    ? `<span class="doctor-name">${nomeMedico}</span>`
                    : ""
                }
                ${crmHtml}
              </div>
            </div>
          `;
        })
        .join("");
    }

    
    let mensagemPadrao;
    if (grupo === "exames") {
      mensagemPadrao = `Quero agendar o exame ${nome}.`;
    } else {
      mensagemPadrao = `Quero agendar uma consulta em ${nome}.`;
    }

    if (!isClinicoGeral && medicos.length === 1 && medicos[0].medico) {
      const unico = medicos[0].medico;
      if (grupo === "exames") {
        mensagemPadrao = `Quero agendar o exame ${nome} com ${unico}.`;
      } else {
        mensagemPadrao = `Quero agendar uma consulta com ${unico} (${nome}).`;
      }
    }
    const mensagemEscapada = mensagemPadrao.replace(/'/g, "\\'");

    let botaoAgendarHtml = "";

    if (!isClinicoGeral) {
      botaoAgendarHtml = `
        <button
          type="button"
          class="whats-main-btn"
          onclick="abrirWhatsApp('${mensagemEscapada}'); return false;"
        >
          <span class="whats-main-btn-label">Agendar via WhatsApp</span>
        </button>
      `;
    }

    return `
      <div class="card">
        <button id="hdr-${idBase}" class="card-header" aria-expanded="false"
                onclick="toggleUniqueSmooth('${idBase}', '${containerId}')">
          <span class="card-title">
            ${base.emoji || ""} <strong>${nome}</strong>
          </span>
          <span id="chev-${idBase}" class="card-chevron" aria-hidden="true">›</span>
        </button>

      <div class="card-body subcard card-body--doctors" id="${idBase}">

          ${medicoListaHtml}
          ${botaoAgendarHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = partes.join("");
}

/* ===== Acordeão interno com transição suave (fecha -> abre) ===== */
function toggleUniqueSmooth(id, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const toOpenBody = document.getElementById(id);
  const toOpenHeader = document.getElementById(`hdr-${id}`);
  const toOpenChevron = document.getElementById(`chev-${id}`);
  if (!toOpenBody || !toOpenHeader || !toOpenChevron) return;

  const opened = container.querySelector(".subcard.expanded");
  const openedHeader = opened
    ? document.getElementById(`hdr-${opened.id}`)
    : null;
  const openedChevron = opened
    ? document.getElementById(`chev-${opened.id}`)
    : null;

  if (opened && opened.id === id) {
    const willExpand = !opened.classList.contains("expanded");
    opened.classList.toggle("expanded");
    toOpenHeader.setAttribute("aria-expanded", willExpand ? "true" : "false");
    toOpenChevron.classList.toggle("rotated", willExpand);
    return;
  }

  const openNext = () => {
    toOpenBody.classList.add("expanded");
    toOpenHeader.setAttribute("aria-expanded", "true");
    toOpenChevron.classList.add("rotated");
  };

  if (opened) {
    opened.classList.remove("expanded");
    if (openedHeader) openedHeader.setAttribute("aria-expanded", "false");
    if (openedChevron) openedChevron.classList.remove("rotated");

    opened.addEventListener(
      "transitionend",
      (ev) => {
        if (ev.propertyName === "max-height") openNext();
      },
      { once: true }
    );
  } else {
    openNext();
  }
}

/* ===== Grupos (abre/fecha cada bloco principal) ===== */
const GROUP_IDS = [
  "cardEspecialidades",
  "cardAtendimentos",
  "cardExames",
  "cardTerapias",
];

function toggleCard(bodyId) {
  const body = document.getElementById(bodyId);
  if (!body) return;

  const willExpand = !body.classList.contains("expanded");

  GROUP_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el !== body) el.classList.remove("expanded");

    const header = el.previousElementSibling;
    if (header) {
      header.setAttribute(
        "aria-expanded",
        el === body && willExpand ? "true" : "false"
      );
      const chev = header.querySelector(".card-chevron");
      if (chev) {
        if (el === body && willExpand) chev.classList.add("rotated");
        else chev.classList.remove("rotated");
      }
    }
  });

  body.classList.toggle("expanded", willExpand);
}

/* ===== Troca suave entre painéis (se tiver abas) ===== */
function switchPanel(panelId) {
  const next = document.getElementById(panelId);
  if (!next) return;

  const current = document.querySelector(".panel.is-active");
  if (current === next) return;

  if (current) {
    current.classList.remove("is-active");
    current.addEventListener(
      "transitionend",
      () => {
        next.classList.add("is-active");
        next.scrollIntoView({ block: "start", behavior: "smooth" });
      },
      { once: true }
    );
  } else {
    next.classList.add("is-active");
  }
}

function showGrupo(tipo) {
  const map = {
    especialidades: "painelEspecialidades",
    atendimentos: "painelAtendimentos",
    exames: "painelExames",
    terapias: "painelTerapias",
  };
  switchPanel(map[tipo]);
}

/* ===== Botões "em breve" ===== */
document.addEventListener("click", (event) => {
  const el = event.target.closest(".link-button.em-breve");
  if (!el) return;
  event.preventDefault();
  alert("Em breve essa função será ativada!");
});

/* ===== Voltar ao topo ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function bindTopBtn() {
  const btnTop = document.getElementById("btnTop");
  if (btnTop && !btnTop.dataset.bound) {
    btnTop.addEventListener("click", scrollToTop);
    btnTop.dataset.bound = "1";
  }
}

/* ===== Mapa sob demanda (se usar) ===== */
function carregarMapa() {
  const wrap = document.getElementById("mapWrap");
  if (!wrap || wrap.dataset.loaded) return;
  wrap.dataset.loaded = "1";
  wrap.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=Praça+Delmiro+Gouveia,+93,+Centro,+Delmiro+Gouveia,+AL&output=embed"
      width="100%" height="180" style="border:0; border-radius:8px; margin-top:1.5rem;"
      allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" decoding="async">
    </iframe>
  `;
  const btn = document.getElementById("loadMap");
  if (btn) btn.remove();
}

function prepararMapaSobDemanda() {
  const btn = document.getElementById("loadMap");
  if (btn && !btn.dataset.bound) {
    btn.addEventListener("click", carregarMapa);
    btn.dataset.bound = "1";
  }
  const target = document.querySelector(".footer-map");
  if ("IntersectionObserver" in window && target && !target.dataset.ioBound) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            carregarMapa();
            io.disconnect();
            break;
          }
        }
      },
      { root: null, threshold: 0.35 }
    );
    io.observe(target);
    target.dataset.ioBound = "1";
  }
}

/* ========= BOOTSTRAP ÚNICO (idempotente) ========= */
async function bootstrap(force = false) {
  if (!force && document.body.dataset.bootstrapped === "1") return;
  document.body.dataset.bootstrapped = "1";

  criarBotaoFaleConosco();

  // 1) Carrega do Google Sheets
  await carregarDadosDoSheets();

  // 2) Renderiza com os dados vindos da planilha
  const sets = [
    ["cardEspecialidades", especialidades],
    ["cardAtendimentos", atendimentos],
    ["cardExames", exames],
    ["cardTerapias", terapias],
  ];
  sets.forEach(([id, data]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
    renderCards(data, id);
  });

  bindTopBtn();
  prepararMapaSobDemanda();
}

/* ===== Inicialização ===== */
document.addEventListener("DOMContentLoaded", () => {
  bootstrap();
  startTypewriter();
});

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    bootstrap(true);
    startTypewriter();
  }
});

/* ===== Efeito de digitação ===== */
const TYPEWRITER = {
  enabled: true,
  speedMs: 80,
  deleteSpeedMs: 45,
  pauseAfterTypeMs: 1200,
  pauseAfterDeleteMs: 700,
  startDelayMs: 300,
};

function startTypewriter() {
  if (!TYPEWRITER.enabled) return;

  const reduceMotion = window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  if (reduceMotion) return;

  const el = document.getElementById("clinicName");
  if (!el) return;

  const fullText = (el.dataset.text ?? el.textContent ?? "").trim();
  if (!fullText) return;

  el.textContent = "";

  const type = (i = 0) => {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i);
      setTimeout(() => type(i + 1), TYPEWRITER.speedMs);
    }
  };

  setTimeout(() => type(0), TYPEWRITER.startDelayMs);
}
