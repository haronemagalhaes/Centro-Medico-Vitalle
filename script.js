// 🔹 Alerta para botões com classe "em-breve"
document.querySelectorAll('.link-button.em-breve').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // impede qualquer redirecionamento
        alert("Em breve essa função será ativada!");
    });
});

// 🔹 Alternar visibilidade com efeito acordeão
function toggleCard(id) {
    const allCards = document.querySelectorAll('.card-body');
    const selectedCard = document.getElementById(id);

    if (!selectedCard) return; // segurança caso o ID não exista

    allCards.forEach(card => {
        if (card !== selectedCard) {
            card.classList.remove('expanded'); // fecha os outros
        }
    });

    selectedCard.classList.toggle('expanded'); // alterna o atual
}

// 🔹 Botão para voltar ao topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
