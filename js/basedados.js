// --- RENDERIZAÇÃO DA TELA DE BASE DE DADOS ---

function renderBaseDados() {
    const app = document.getElementById('app');
    
    // Unificamos os eventos ativos e os concluídos do histórico para a base master
    const ativos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const historico = JSON.parse(localStorage.getItem('mcom_historico')) || [];
    const todos = [...ativos, ...historico];

    app.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 30px">
            <div>
                <h1><i class="fas fa-database"></i> Base de Dados Master</h1>
                <p style="opacity:0.6">Dados consolidados e logística de viagens</p>
            </div>
            <button onclick="exportarHistoricoExcel()" style="background:#2ecc71; color:#000; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:10px">
                <i class="fas fa-file-excel" style="font-size:20px"></i> BAIXAR EXCEL COMPLETO (3 ABAS)
            </button>
        </div>

        <div class="glass-card" style="overflow-x: auto;">
            <table style="width:100%; border-collapse: collapse; color: white; font-size:14px">
                <thead>
                    <tr style="text-align:left; border-bottom: 2px solid var(--primary)">
                        <th style="padding:15px">Evento / CRC</th>
                        <th>Município/UF</th>
                        <th>Período</th>
                        <th>Status</th>
                        <th>Ida/Volta</th>
                    </tr>
                </thead>
                <tbody>
                    ${todos.length > 0 ? todos.reverse().map(h => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05)">
                            <td style="padding:15px">
                                <strong>${h.nome}</strong><br>
                                <small style="opacity:0.7">${h.crcVinculado || '-'}</small>
                            </td>
                            <td>${h.municipio || '-'}/${h.uf}</td>
                            <td>${h.dataInicio ? h.dataInicio.split('-').reverse().join('/') : '-'}</td>
                            <td>
                                <span style="color:${h.statusLogistica === 'Confirmado' ? '#00ff88' : '#ffcc00'}">
                                    ${h.statusLogistica || 'Ativo'}
                                </span>
                            </td>
                            <td style="font-size:12px; opacity:0.8">
                                I: ${h.dataIda ? h.dataIda.split('-').reverse().join('/') : '--'}<br>
                                V: ${h.dataVolta ? h.dataVolta.split('-').reverse().join('/') : '--'}
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="5" style="padding:30px; text-align:center; opacity:0.5">Nenhum registro encontrado.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

// --- FUNÇÃO DE EXPORTAÇÃO MULTI-ABA (SHEETJS) ---

function exportarHistoricoExcel() {
    const ativos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const historico = JSON.parse(localStorage.getItem('mcom_historico')) || [];
    const todos = [...ativos, ...historico];

    if(todos.length === 0) return alert("Não existem dados para exportar!");

    // 1. MAPEAMENTO DA ABA GERAL
    const dataGeral = todos.map(h => ({
        "Evento": h.nome || "",
        "CRC": h.crcVinculado || "",
        "Município": h.municipio || "",
        "UF": h.uf || "",
        "Data Início": h.dataInicio || "",
        "Data Fim": h.dataFim || "",
        "Horário": h.horario || "",
        "Montagem": h.montagem || "",
        "Data Ida": h.dataIda || "",
        "Data Volta": h.dataVolta || "",
        "Participantes CGID": Array.isArray(h.equipe) ? h.equipe.join(", ") : "",
        "Participantes MCOM": h.participantesMcom || "",
        "Status": h.statusLogistica || "Pendente",
        "Endereço": h.endereco || "",
        "Custo FIPE (Total)": h.fipe?.valorTotal || 0
    }));

    // 2. MAPEAMENTO DA ABA LISTA DE PIDS
    const dataPids = todos
        .filter(h => h.pids && h.pids.trim() !== "")
        .map(h => ({
            "Evento": h.nome,
            "Município": h.municipio,
            "UF": h.uf,
            "Lista de PIDs": h.pids
        }));

    // 3. MAPEAMENTO DA ABA INFORMAÇÕES DE VOO
    const dataVoos = [];
    todos.forEach(h => {
        if(h.logisticaVoos && h.logisticaVoos.length > 0) {
            h.logisticaVoos.forEach(v => {
                dataVoos.push({
                    "Evento": h.nome,
                    "Participante": v.nome,
                    "Localizador": v.localizador || "",
                    "Cia Aérea": v.cia || "",
                    "Data/Hora Voo": v.dataHora || "",
                    "Trecho": v.trecho || ""
                });
            });
        }
    });

    // CRIAÇÃO DO ARQUIVO (WORKBOOK)
    const wb = XLSX.utils.book_new();

    // Adiciona Aba Geral
    const wsGeral = XLSX.utils.json_to_sheet(dataGeral);
    XLSX.utils.book_append_sheet(wb, wsGeral, "Resumo Geral");

    // Adiciona Aba PIDs (apenas se houver dados)
    if(dataPids.length > 0) {
        const wsPids = XLSX.utils.json_to_sheet(dataPids);
        XLSX.utils.book_append_sheet(wb, wsPids, "Lista de PIDs");
    }

    // Adiciona Aba Voos (apenas se houver dados)
    if(dataVoos.length > 0) {
        const wsVoos = XLSX.utils.json_to_sheet(dataVoos);
        XLSX.utils.book_append_sheet(wb, wsVoos, "Informações de Voo");
    }

    // Geração do arquivo para o usuário
    XLSX.writeFile(wb, `Base_MCOM_Logistica_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
}

// --- FUNÇÃO PARA LIMPAR TUDO (USAR COM CAUTELA) ---
function limparHistoricoCompleto() {
    if(confirm("Deseja apagar TODO o histórico? Esta ação não pode ser desfeita.")) {
        localStorage.setItem('mcom_historico', JSON.stringify([]));
        renderBaseDados();
    }
}