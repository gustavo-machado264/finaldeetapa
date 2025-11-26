document.getElementById("buscarGPS").addEventListener("click", () => {
    const cidade = document.getElementById("cidadeInput").value.trim().toLowerCase();
    const modalidade = document.getElementById("modalidadeSelect").value.trim().toLowerCase();
    const dataFiltro = document.getElementById("filtroData").value;

    const lista = document.getElementById("lista-campeonatos");
    lista.innerHTML = "";


    /* ==== BOXE ==== */
    if (
        (cidade.includes("são paulo") || cidade.includes("sp")) &&
        modalidade === "boxe" &&
        dataFiltro === "próximo"
    ) {
        lista.innerHTML = `
            <div class="card resultado-item">
                <h2>Campeonato Paulista de Boxe 2026</h2>
                <p><strong>Local:</strong> São Paulo - SP</p>
                <p><strong>Data:</strong> 8, 15 e 22 de Abril</p>
                <p><strong>Modalidade:</strong> Boxe</p>

                <a href="https://www.febesp.com.br/" class="btn-link">Ver mais</a>

                <div class="insta">
                    <a href="https://www.instagram.com/feboxesp/">Instagram da federação de boxe</a>
                </div>
            </div>
        `;
        return;
    }


    /* ==== MUAY THAI ==== */
    if (
        (cidade.includes("são paulo") || cidade.includes("sp")) &&
        (modalidade === "muay thai" || modalidade === "muaythai") &&
        dataFiltro === "próximo"
    ) {
        lista.innerHTML = `
            <div class="card resultado-item">
                <h2>Circuito Paulista de Muay Thai 2026</h2>
                <p><strong>Local:</strong> São Paulo - SP</p>
                <p><strong>Data:</strong> 10 e 24 de Agosto</p>
                <p><strong>Modalidade:</strong> Muay Thai</p>

                <a href="https://soucompetidor.com.br/pt-br/eventos/todos-os-eventos/p2377-campeonato-paulista-de-muay-thai-3-edicao/" class="btn-link">Ver mais</a>

                <div class="insta">
                    <a href="https://www.instagram.com/federacaopaulistamuaythai?igsh=aTI4amx0czd3eXh5">Instagram da federação de Muay Thai</a>
                </div>
            </div>
        `;
        return;
    }


    /* ==== JIU-JITSU ==== */
    if (
        (cidade.includes("são paulo") || cidade.includes("sp")) &&
        (modalidade === "jiu jitsu" || modalidade === "jiu-jitsu" || modalidade === "jiujitsu") &&
        dataFiltro === "próximo"
    ) {
        lista.innerHTML = `
            <div class="card resultado-item">
                <h2>Open Paulista de Jiu-Jitsu 2026</h2>
                <p><strong>Local:</strong> São Paulo - SP</p>
                <p><strong>Data:</strong> 12 e 19 de Setembro</p>
                <p><strong>Modalidade:</strong> Jiu-Jitsu</p>

                <a href="https://cbjj.com.br/" class="btn-link">Ver mais</a>

                <div class="insta">
                    <a href="https://www.instagram.com/cbjjoficial/">Instagram da CBJJ</a>
                </div>
            </div>
        `;
        return;
    }


    /* ==== NENHUM ENCONTRADO ==== */
    lista.innerHTML = `
        <p class="no-results">Nenhum campeonato encontrado com esses filtros.</p>
    `;
});