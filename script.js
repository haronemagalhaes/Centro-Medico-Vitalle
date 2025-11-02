// ===== Config =====
const telefoneWhatsApp = "5582996316976";

// ===== Dados =====
const especialidades = [
  { id: 'neuro', nome: 'Neurologia', medico: 'Dr Leandro Araújo' },
  { id: 'clinico', nome: 'Clínico Geral', medico: 'Dr Leandro Araújo / Dr Robson Xisto' },
  { id: 'cardio', nome: 'Cardiologista', medico: 'Dr Robson Xisto' },
  { id: 'uro', nome: 'Urologista', medico: 'Dr Jaime Bonfim' },
  { id: 'ortopedista', nome: 'Ortopedista', medico: 'Dr Cláudio Soares' },
  { id: 'ortopedia', nome: 'Atendimento em Ortopedia', medico: 'Dr Breno Gomes' },
  { id: 'psiquiatria', nome: 'Atendimento em Psiquiatria', medico: 'Dr Bruno Suzart' },
  { id: 'gineco', nome: 'Ginecologista Obstétrica', medico: 'Dra Mônica Ricardo' },
  { id: 'dermato', nome: 'Dermatologista', medico: 'Dra Diana Brandão' },
  { id: 'gastro', nome: 'Gastroenterologia', medico: 'Dra Manuela Lisboa' },
  { id: 'cirurgiaodonto', nome: 'Cirurgião Dentista', medico: 'Dr Gyovanni Brito' },
  { id: 'ortodontista', nome: 'Ortodontista', medico: 'Dr Gyovanni Brito' },
  { id: 'implanto', nome: 'Implantodontista', medico: 'Dr Jacson Costa' },
  { id: 'odonto', nome: 'Odontopediatra', medico: 'Dra Edivânia Oliveira' },
];

const atendimentos = [
  { id: 'nutri', nome: 'Nutricionista', medico: 'Maria Laisa Oliveira' },
  { id: 'nutriinfantil', nome: 'Nutricionista Infantil', medico: 'Lara Evelin Nascimento' },
  { id: 'psicopedagoga', nome: 'Psicopedagoga', medico: 'Aline Dias' },
  { id: 'neuropsico', nome: 'Neuro Psicopedagoga', medico: 'Quitéria Lopes' },
  { id: 'psicologo', nome: 'Psicólogo', medico: 'Jucyellen Lima' },
  { id: 'neuropsicologa', nome: 'Neuropsicóloga', medico: 'Milene Cicigliano' },
  { id: 'fisio', nome: 'Fisioterapia', medico: 'Fabiana Monteiro' },
  { id: 'fono', nome: 'Fonoaudióloga', medico: 'Alice Barboza' },
];

const exames = [
  { id: 'mapa', nome: 'MAPA' },
  { id: 'holter', nome: 'Holter de 24 horas' },
  { id: 'eletro', nome: 'Eletrocardiograma' },
  { id: 'eco', nome: 'Ecocardiograma' },
  { id: 'endoscopia', nome: 'Endoscopia' },
  { id: 'laboratorio', nome: 'Laboratório' },
  { id: 'ultra', nome: 'Ultrassonografia' },
  { id: 'colonoscopia', nome: 'Colonoscopia' },
  { id: 'retossigmoidoscopia', nome: 'Retossigmoidoscopia' },
  { id: 'mamografia', nome: 'Mamografia' },
  { id: 'raio-x', nome: 'Raio X' },
];

const terapias = [
  { id: 'massagem', nome: 'Massagem', medico: 'Ísis Rosa' },
  { id: 'drenagem-linfatica', nome: 'Drenagem Linfática', medico: 'Ísis Rosa' },
  { id: 'gesso-terapia', nome: 'Drenagem com Gesso Terapia', medico: 'Ísis Rosa' },
];

/* ===== Saudações dinâmicas (horário de Brasília) ===== */
function _nowInBrasilia() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
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
  const url = `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(fullMsg)}`;
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
 * Renderiza cards com seta sempre visível (›) e rotação ao expandir.
 * Usa aria-expanded para acessibilidade.
 */
function renderCards(lista, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const partes = lista.map((e) => {
    const mensagem = `Quero agendar uma consulta com ${e.medico || 'profissional'} (${e.nome}).`;
    const mensagemEscapada = mensagem.replace(/'/g, "\\'");
    return `
      <div class="card">
        <button id="hdr-${e.id}" class="card-header" aria-expanded="false"
                onclick="toggleUniqueSmooth('${e.id}', '${containerId}')">
          <span class="card-title">${e.emoji || ''} <strong>${e.nome}</strong></span>
          <span id="chev-${e.id}" class="card-chevron" aria-hidden="true">›</span>
        </button>

        <div class="card-body subcard" id="${e.id}">
          ${e.medico ? `<p>${e.medico}</p>` : ''}
          <a class="link-button" style="margin-top:0.8rem;background:#25d366;color:#fff;border:none;"
             href="#"
             onclick="abrirWhatsApp('${mensagemEscapada}'); return false;"
             rel="noopener noreferrer">
            Agendar via WhatsApp
          </a>
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

  const opened = container.querySelector('.subcard.expanded');
  const openedHeader = opened ? document.getElementById(`hdr-${opened.id}`) : null;
  const openedChevron = opened ? document.getElementById(`chev-${opened.id}`) : null;

  if (opened && opened.id === id) {
    const willExpand = !opened.classList.contains('expanded');
    opened.classList.toggle('expanded');
    toOpenHeader.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
    toOpenChevron.classList.toggle('rotated', willExpand);
    return;
  }

  const openNext = () => {
    toOpenBody.classList.add('expanded');
    toOpenHeader.setAttribute('aria-expanded', 'true');
    toOpenChevron.classList.add('rotated');
  };

  if (opened) {
    opened.classList.remove('expanded');
    if (openedHeader) openedHeader.setAttribute('aria-expanded', 'false');
    if (openedChevron) openedChevron.classList.remove('rotated');

    opened.addEventListener('transitionend', (ev) => {
      if (ev.propertyName === 'max-height') openNext();
    }, { once: true });
  } else {
    openNext();
  }
}

/* ===== Grupos (layout antigo): abre/fecha cada bloco principal ===== */
const GROUP_IDS = ['cardEspecialidades', 'cardAtendimentos', 'cardExames', 'cardTerapias'];

function toggleCard(bodyId) {
  const body = document.getElementById(bodyId);
  if (!body) return;

  const willExpand = !body.classList.contains('expanded');

  GROUP_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el !== body) el.classList.remove('expanded');

    const header = el.previousElementSibling;
    if (header) {
      header.setAttribute('aria-expanded', (el === body && willExpand) ? 'true' : 'false');
      const chev = header.querySelector('.card-chevron');
      if (chev) {
        if (el === body && willExpand) chev.classList.add('rotated');
        else chev.classList.remove('rotated');
      }
    }
  });

  body.classList.toggle('expanded', willExpand);
}

/* ===== Troca suave entre painéis ===== */
function switchPanel(panelId) {
  const next = document.getElementById(panelId);
  if (!next) return;

  const current = document.querySelector('.panel.is-active');
  if (current === next) return;

  if (current) {
    current.classList.remove('is-active');
    current.addEventListener('transitionend', () => {
      next.classList.add('is-active');
      next.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, { once: true });
  } else {
    next.classList.add('is-active');
  }
}

function showGrupo(tipo) {
  const map = {
    especialidades: 'painelEspecialidades',
    atendimentos: 'painelAtendimentos',
    exames: 'painelExames',
    terapias: 'painelTerapias'
  };
  switchPanel(map[tipo]);
}

/* ===== Botões "em breve" ===== */
document.addEventListener('click', (event) => {
  const el = event.target.closest('.link-button.em-breve');
  if (!el) return;
  event.preventDefault();
  alert("Em breve essa função será ativada!");
});

/* ===== Voltar ao topo ===== */
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function bindTopBtn() {
  const btnTop = document.getElementById('btnTop');
  if (btnTop && !btnTop.dataset.bound) {
    btnTop.addEventListener('click', scrollToTop);
    btnTop.dataset.bound = '1';
  }
}

/* ===== Mapa sob demanda ===== */
function carregarMapa() {
  const wrap = document.getElementById('mapWrap');
  if (!wrap || wrap.dataset.loaded) return;
  wrap.dataset.loaded = "1";
  wrap.innerHTML = `
    <iframe
      src="https://www.google.com/maps?q=Praça+Delmiro+Gouveia,+93,+Centro,+Delmiro+Gouveia,+AL&output=embed"
      width="100%" height="180" style="border:0; border-radius:8px; margin-top:1.5rem;"
      allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" decoding="async">
    </iframe>
  `;
  const btn = document.getElementById('loadMap');
  if (btn) btn.remove();
}

function prepararMapaSobDemanda() {
  const btn = document.getElementById('loadMap');
  if (btn && !btn.dataset.bound) {
    btn.addEventListener('click', carregarMapa);
    btn.dataset.bound = '1';
  }
  const target = document.querySelector('.footer-map');
  if ('IntersectionObserver' in window && target && !target.dataset.ioBound) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          carregarMapa();
          io.disconnect();
          break;
        }
      }
    }, { root: null, threshold: 0.35 });
    io.observe(target);
    target.dataset.ioBound = '1';
  }
}

/* ========= BOOTSTRAP ÚNICO (idempotente) ========= */
function bootstrap(force = false) {
  if (!force && document.body.dataset.bootstrapped === '1') return;
  document.body.dataset.bootstrapped = '1';

  criarBotaoFaleConosco();

  const sets = [
    ['cardEspecialidades', especialidades],
    ['cardAtendimentos', atendimentos],
    ['cardExames', exames],
    ['cardTerapias', terapias],
  ];
  sets.forEach(([id, data]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
    renderCards(data, id);
  });

  bindTopBtn();
  prepararMapaSobDemanda();
}

/* ===== Inicialização ===== */
document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
  startTypewriter();
});

window.addEventListener('pageshow', (e) => {
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
  startDelayMs: 300
};

function startTypewriter() {
  if (!TYPEWRITER.enabled) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const el = document.getElementById('clinicName');
  if (!el) return;

  const fullText = (el.dataset.text ?? el.textContent ?? '').trim();
  if (!fullText) return;

  el.textContent = '';
//   el.classList.add('typing-caret');

  const type = (i = 0) => {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i);
      setTimeout(() => type(i + 1), TYPEWRITER.speedMs);
    } else {
    //   setTimeout(() => erase(fullText.length), TYPEWRITER.pauseAfterTypeMs);
    }
  };

  const erase = (i) => {
    if (i >= 0) {
      el.textContent = fullText.slice(0, i);
      setTimeout(() => erase(i - 1), TYPEWRITER.deleteSpeedMs);
    } else {
      setTimeout(() => type(0), TYPEWRITER.pauseAfterDeleteMs);
    }
  };

  setTimeout(() => type(0), TYPEWRITER.startDelayMs);
}
