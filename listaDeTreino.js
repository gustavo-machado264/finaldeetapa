// --- ELEMENTOS DO DOM ---
const procurar = document.getElementById('procurarTreino');
const treinoInput = document.getElementById('treino');
const areaTreino = document.getElementById('treino2');
const listaProcurados = document.getElementById('procurados');

// --- LISTA DE EXERCÍCIOS ---
const exercicios = [
    { nome: 'Supino Inclinado', descricao: 'Deite no banco inclinado, segure a barra, abaixe até o peito e empurre de volta', series: '3 séries de 10 repetições', observacao: 'Peso: Moderado', imagem: './img/supino.png', video: 'https://youtube.com/shorts/NrurrUZ9bfw?si=lxbkKnMSPIyEiP7l' },
    { nome: 'Agachamento Livre', descricao: 'Fique em pé com os pés na largura dos ombros, agache mantendo as costas retas e volte à posição inicial', series: '4 séries de 12 repetições', observacao: 'Peso: Leve a Moderado', imagem: './img/agachamento.png', video: 'https://youtube.com/shorts/8V2SwkHTLek?si=LeS0jGNWqUOoJT-P' },
    { nome: 'Peck Deck', descricao: 'Sente-se na máquina, posicione os braços nas almofadas e junte-os à frente do peito', series: '3 séries de 12-15 repetições', observacao: 'Peso: Leve a Moderado', imagem: './img/peck-deck.png', video: 'https://youtube.com/shorts/rOrr4kSwQpE?si=JmpAGKgH7b3e3dot' },
    { nome: 'Desenvolvimento com Halteres', descricao: 'Sente-se em um banco com encosto, segure os halteres na altura dos ombros e empurre-os para cima até estender os braços', series: '3 séries de 10-12 repetições', observacao: 'Peso: Moderado', imagem: './img/desenvolvimento.png', video: 'https://youtube.com/shorts/Wywt3mN-6RA?si=OVi7fczoJfgBDwle' },
    { nome: 'Levantamento Terra', descricao: 'Com a barra no chão, mantenha as costas retas, levante a barra estendendo os quadris e joelhos, depois abaixe lentamente', series: '4 séries de 6-8 repetições', observacao: 'Peso: Pesado', imagem: './img/terra.png', video: 'https://youtube.com/shorts/oSaXuwqLpWc?si=jZjfumXlELBCZCmJ' },
    { nome: 'Barra Fixa', descricao: 'Segure a barra com as palmas das mãos voltadas para frente, puxe o corpo para cima até o queixo ultrapassar a barra e abaixe lentamente', series: '3 séries de 8-10 repetições', observacao: 'Peso: Peso Corporal', imagem: './img/barra.png', video: 'https://youtube.com/shorts/BYYxtz9MtDc?si=G9_F307teGa4smK8' },
    { nome: 'Flexão de Braço', descricao: 'Deite-se de barriga para baixo, coloque as mãos no chão na largura dos ombros, empurre o corpo para cima e abaixe novamente', series: '4 séries de 12-15 repetições', observacao: 'Peso: Peso Corporal', imagem: './img/flexao.png', video: 'https://youtube.com/shorts/pRzxpe5_LLk?si=BHjJ6aWQ-tfgd-1w' },
    { nome: 'Abdominal', descricao: 'Deite-se de costas com os joelhos dobrados, levante a parte superior do corpo em direção aos joelhos e volte à posição inicial', series: '3 séries de 15-20 repetições', observacao: 'Peso: Peso Corporal', imagem: './img/abdominal.png', video: 'https://youtube.com/shorts/kiqKO0tTFVw?si=XryMhiVBmkr12nJC' },
    { nome: 'Prancha', descricao: 'Deite-se de bruços, levante o corpo apoiando-se nos antebraços e pontas dos pés, mantendo o corpo reto', series: '3 séries de 30-60 segundos', observacao: 'Peso: Peso Corporal', imagem: './img/prancha.png', video: 'https://youtube.com/shorts/jZY0XzzXleI?si=9CLTzjWM7PD0jkky' },
    { nome: 'Pull-Over com Halteres', descricao: 'Deite-se em um banco, segure um haltere com ambas as mãos acima do peito, abaixe-o lentamente atrás da cabeça e retorne à posição inicial', series: '3 séries de 10-12 repetições', observacao: 'Peso: Moderado', imagem: './img/pull-over.png', video: 'https://youtube.com/shorts/Datv2L6t3-4?si=poTimOvBD5gY4-Zt' },
    { nome: 'Elevação Lateral de Ombros com Halteres', descricao: 'Fique em pé segurando halteres ao lado do corpo, levante-os lateralmente até a altura dos ombros e abaixe lentamente', series: '3 séries de 12-15 repetições', observacao: 'Peso: Leve a Moderado', imagem: './img/lateral.png', video: 'https://youtube.com/shorts/nhQ4mdk0TmM?si=86dPDwEEfiEen18l' },
    { nome: 'Rosca Direta com Barra', descricao: 'Segure a barra com as palmas das mãos voltadas para cima, levante a barra em direção aos ombros e abaixe lentamente', series: '3 séries de 10-12 repetições', observacao: 'Peso: Moderado', imagem: './img/rosca.png', video: 'https://youtube.com/shorts/ojlJslnaae4?si=R8wug0pa47gCvCcj' }
];

// --- FUNÇÃO PARA CRIAR CARD ---
function criarCard(exercicio, comAdicionar = true) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <img src="${exercicio.imagem}" alt="${exercicio.nome}">
        <h3>${exercicio.nome}</h3>
        <p>${exercicio.descricao}</p>
        <p>${exercicio.series}</p>
        <p>${exercicio.observacao}</p>
        <div class="card-buttons">
            <button class="btn-card btn-video">Vídeo</button>
            ${comAdicionar ? '<button class="btn-card btn-adicionar">Adicionar</button>' : ''}
            <button class="btn-card btn-remover">Remover</button>
        </div>
    `;

    // Botões
    card.querySelector('.btn-video').addEventListener('click', () => {
        window.open(exercicio.video, '_blank');
    });

    const btnAdicionar = card.querySelector('.btn-adicionar');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            // Evita duplicatas
            const jaAdicionado = Array.from(areaTreino.children).some(c => c.querySelector('h3').textContent === exercicio.nome);
            if (jaAdicionado) {
                alert('Este treino já está na sua lista!');
                return;
            }
            const clone = criarCard(exercicio, false); // clone sem botão adicionar
            areaTreino.appendChild(clone);
        });
    }

    card.querySelector('.btn-remover').addEventListener('click', () => {
        card.remove();
    });

    return card;
}

// --- EVENTO DE BUSCA ---
procurar.addEventListener('click', () => {
    const termo = treinoInput.value.trim().toLowerCase();
    listaProcurados.innerHTML = '';

    const resultados = exercicios.filter(ex => ex.nome.toLowerCase().includes(termo));
    if (resultados.length === 0) {
        alert('Treino não encontrado. Tente novamente.');
        return;
    }

    resultados.forEach(ex => {
        const card = criarCard(ex, true);
        listaProcurados.appendChild(card);
    });
});
