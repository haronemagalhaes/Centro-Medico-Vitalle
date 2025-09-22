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
    { id: 'raio-x', nome: 'Raio X' },
];

const terapias = [
    { id: 'massagem', nome: 'Massagem', medico: 'Ísis Rosa' },
    { id: 'drenagem-linfatica', nome: 'Drenagem Linfática', medico: 'Ísis Rosa' },
    { id: 'gesso-terapia', nome: 'Drenagem com Gesso Terapia', medico: 'Ísis Rosa' },
];

// ===== Utilidades de UI =====
function criarBotaoFaleConosco() {
    const msg = "Olá! Gostaria de mais informações sobre os atendimentos.";
    const msgCodificada = encodeURIComponent(msg);
    const link = `https://wa.me/${telefoneWhatsApp}?text=${msgCodificada}`;
    const alvo = document.getElementById("faleConoscoBtn");
    if (!alvo) return;

    alvo.innerHTML = `
    <a href="${link}" class="link-button destaque fale-cta only-text"
       target="_blank" rel="noopener noreferrer" aria-label="Fale Conosco pelo WhatsApp">
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
        const mensagem = `Olá! Quero agendar uma consulta com ${e.medico || 'profissional'} (${e.nome}).`;
        const mensagemCodificada = encodeURIComponent(mensagem);
        const link = `https://wa.me/${telefoneWhatsApp}?text=${mensagemCodificada}`;

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
             href="${link}" target="_blank" rel="noopener noreferrer">
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

    // Se clicou no mesmo, apenas alterna
    if (opened && opened.id === id) {
        const willExpand = !opened.classList.contains('expanded');
        opened.classList.toggle('expanded');
        toOpenHeader.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
        toOpenChevron.classList.toggle('rotated', willExpand);
        return;
    }

    // Fecha o atual (se houver) e, quando terminar a transição, abre o novo
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

    // Fecha todos os outros grupos e limpa setas
    GROUP_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el !== body) el.classList.remove('expanded');

        const header = el.previousElementSibling; // header do grupo
        if (header) {
            header.setAttribute('aria-expanded', (el === body && willExpand) ? 'true' : 'false');
            const chev = header.querySelector('.card-chevron');
            if (chev) {
                if (el === body && willExpand) chev.classList.add('rotated');
                else chev.classList.remove('rotated');
            }
        }
    });

    // Alterna o grupo alvo
    body.classList.toggle('expanded', willExpand);
}

/* ===== Troca suave entre painéis (se um dia voltar a usar tabs/panéis) ===== */
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

// atalhos para tabs (opcional)
function showGrupo(tipo) {
    const map = {
        especialidades: 'painelEspecialidades',
        atendimentos: 'painelAtendimentos',
        exames: 'painelExames',
        terapias: 'painelTerapias'
    };
    switchPanel(map[tipo]);
}

// ===== Botões "em breve" =====
document.addEventListener('click', (event) => {
    const el = event.target.closest('.link-button.em-breve');
    if (!el) return;
    event.preventDefault();
    alert("Em breve essa função será ativada!");
});

// ===== Voltar ao topo =====
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function bindTopBtn() {
    const btnTop = document.getElementById('btnTop');
    if (btnTop && !btnTop.dataset.bound) {
        btnTop.addEventListener('click', scrollToTop);
        btnTop.dataset.bound = '1';
    }
}

// ===== Mapa sob demanda =====
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
    // botão manual (se existir nesse layout)
    const btn = document.getElementById('loadMap');
    if (btn && !btn.dataset.bound) {
        btn.addEventListener('click', carregarMapa);
        btn.dataset.bound = '1';
    }
    // lazy via viewport (se existir nesse layout)
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

    // (re)renderiza listas (limpa antes para não duplicar)
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

// Inicializa no carregamento normal
document.addEventListener('DOMContentLoaded', () => bootstrap());

// IMPORTANTÍSSIMO: roda ao voltar do histórico (bfcache)
window.addEventListener('pageshow', (e) => {
    if (e.persisted) bootstrap(true);
});


// === Config do efeito de digitação ===
// === Config do efeito de digitação ===
const TYPEWRITER = {
    enabled: true,
    speedMs: 80,            // digitar
    deleteSpeedMs: 45,      // apagar
    pauseAfterTypeMs: 1200, // pausa ao terminar de digitar
    pauseAfterDeleteMs: 700,// pausa ao apagar tudo
    startDelayMs: 300       // atraso inicial
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
    el.classList.add('typing-caret');

    const type = (i = 0) => {
        if (i <= fullText.length) {
            el.textContent = fullText.slice(0, i);
            setTimeout(() => type(i + 1), TYPEWRITER.speedMs);
        } else {
            setTimeout(() => erase(fullText.length), TYPEWRITER.pauseAfterTypeMs);
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

document.addEventListener('DOMContentLoaded', startTypewriter);

// Re-inicia ao voltar do histórico (bfcache)
window.addEventListener('pageshow', (e) => {
    if (e.persisted) startTypewriter();
});
