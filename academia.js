document.addEventListener("DOMContentLoaded", () => {
    const cidadeInput = document.getElementById("cidadeInput");
    const modalidadeSelect = document.getElementById("modalidadeSelect");
    const buscarBtn = document.getElementById("buscarGPS");
    const resultadosDiv = document.getElementById("lista-campeonatos");

    const academias = [
        { nome: "Target fitclub - Alto da Mooca", cidade: "São Paulo", modalidade: "academia", endereco: "R. da Mooca, 2868 - Alto da Mooca" },
        { nome: "Fight Team Mooca", cidade: "São Paulo", modalidade: "boxe", endereco: "Rua Conde Prates, 264 - 2° andar - Parque da Mooca" },
        { nome: "CNBOX Belenzinho", cidade: "São Paulo", modalidade: "boxe", endereco: "R. Serra de Jairé, 679 - Quarta Parada" },
        { nome: "Academia Smart Fit", cidade: "São Paulo", modalidade: "academia", endereco: "Av. Cassandoca, 939 - Belenzinho" },
        { nome: "Nova União - Mooca", cidade: "São Paulo", modalidade: "jiu jitsu", endereco: "R. do Oratório, 804 - Mooca" },
        { nome: "Alliance Jiu Jitsu | Anália Franco", cidade: "São Paulo", modalidade: "jiu jitsu", endereco: "R. Arariba, 58 - Vila Reg. Feijó" },
        { nome: "Squadrao thai brasil", cidade: "São Paulo", modalidade: "muay thai", endereco: "R. Padre Raposo, 837 - Alto da Mooca" },
        { nome: "Maximum Arena", cidade: "São Paulo", modalidade: "muay thai", endereco: "Rua Siqueira Bueno, 1455 - Belenzinho" }
    ];

    function buscarAcademias() {
        const cidade = cidadeInput.value.trim().toLowerCase();
        const modalidade = modalidadeSelect.value.trim().toLowerCase();

        const filtrados = academias.filter(a => {
            const matchCidade = a.cidade.toLowerCase().includes(cidade);
            const matchModalidade = modalidade === "" || a.modalidade === modalidade;
            return matchCidade && matchModalidade;
        });

        exibirResultados(filtrados);
    }

    function exibirResultados(lista) {
        resultadosDiv.innerHTML = "";

        if (lista.length === 0) {
            resultadosDiv.innerHTML = `
                <p class="no-results">❌ Nenhuma academia encontrada</p>
            `;
            return;
        }

        lista.forEach((a, index) => {
            const card = document.createElement("div");
            card.classList.add("resultado-card");

            // Animação suave de entrada
            card.style.animation = `fadeIn 0.4s ease forwards`;
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <h3>${a.nome}</h3>
                <p><strong>📍 Cidade:</strong> ${a.cidade}</p>
                <p><strong>🔥 Modalidade:</strong> ${a.modalidade}</p>
                <p><strong>🏠 Endereço:</strong> ${a.endereco}</p>
            `;

            resultadosDiv.appendChild(card);
        });
    }

    buscarBtn.addEventListener("click", buscarAcademias);
});