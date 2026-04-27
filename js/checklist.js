function renderChecklist() {
    const app = document.getElementById('app');
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
        <div style="margin-bottom: 30px">
            <h1><i class="fas fa-tasks"></i> Checklist do Evento</h1>
            <p style="opacity:0.6">Controle de prontidão e materiais para a ação</p>
        </div>

        <div class="grid-checklist">
            ${eventos.length > 0 ? eventos.map(ev => `
                <div class="glass-card" style="margin-bottom:15px; cursor:pointer; border-left: 4px solid #16a76f" onclick="abrirChecklistDetalhado(${ev.id})">
                    <div style="display:flex; justify-content:space-between; align-items:center">
                        <div>
                            <h3 style="margin:0">${ev.nome}</h3>
                            <small>${ev.municipio || 'Local'} - ${ev.uf}</small>
                        </div>
                        <div style="text-align:right">
                             <span id="progresso-${ev.id}" style="font-size:12px; color:#ffcc00">
                                <i class="fas fa-check-circle"></i> ${calcularProgresso(ev)}%
                             </span>
                        </div>
                    </div>
                </div>
            `).join('') : '<p style="opacity:0.5; text-align:center">Nenhum evento ativo para checklist.</p>'}
        </div>

        <div id="modalChecklist" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; justify-content: center; align-items: center; padding: 15px;">
            <div class="glass-card" style="width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding:20px; border: 1px solid #00ff40">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
                    <h2 style="color:#00ff40"><i class="fas fa-clipboard-list"></i> Itens de Prontidão</h2>
                    <button onclick="fecharModalChecklist()" style="background:none; border:none; color:white; font-size:30px; cursor:pointer">&times;</button>
                </div>
                <div id="listaItensChecklist"></div>
                <button onclick="fecharModalChecklist()" style="width:100%; padding:15px; background:#00ff40; color:black; font-weight:bold; border:none; border-radius:5px; margin-top:20px; cursor:pointer">
                    FINALIZAR CONFERÊNCIA
                </button>
            </div>
        </div>
    `;
}

const itensPadraoChecklist = [
    "Apresentação (PPT/Vídeo)",
    "Roteiro do Cerimonial",
    "Certificados Impressos",
    "Convites Enviados",
    "Artes Digitais (Card/Banner)",
    "Verificação de Internet",
    "Computadores Testados",
    "Equipe Escalada",
    "Reserva de Hotel/Passagem",
    "Material de Apoio (Brindes/Pastas)"
];

function abrirChecklistDetalhado(eventoId) {
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = eventos.find(e => e.id == eventoId);
    if(!ev) return;

    const modal = document.getElementById('modalChecklist');
    const container = document.getElementById('listaItensChecklist');
    modal.style.display = 'flex';

    const checklistSalvo = ev.checklistNovo || [];
    const personalizados = ev.checklistPersonalizados || [];

    container.innerHTML = `
        <div id="checklistItensFixos">
            ${itensPadraoChecklist.map(item => `
                <label style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin-bottom:10px; cursor:pointer">
                    <input type="checkbox" style="width:22px; height:22px" 
                        ${checklistSalvo.includes(item) ? 'checked' : ''} 
                        onchange="toggleItemChecklist(${ev.id}, '${item.replace(/'/g, "\\'")}')">
                    <span style="font-size:15px">${item}</span>
                </label>
            `).join('')}
        </div>
        <div id="personalizadosContainer">
            ${personalizados.map(item => `
                <div class="personalizado-item">
                    <label style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin-bottom:10px; cursor:pointer">
                        <input type="checkbox" style="width:22px; height:22px" 
                            ${checklistSalvo.includes(item) ? 'checked' : ''} 
                            onchange="toggleItemChecklist(${ev.id}, '${item.replace(/'/g, "\\'")}')">
                        <span>${item}</span>
                        <button onclick="removerItemPersonalizado(${ev.id}, '${item.replace(/'/g, "\\'")}')" style="margin-left:auto; background:none; border:none; color:red; cursor:pointer;">&times;</button>
                    </label>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 15px;">
            <label>Novo item personalizado:</label>
            <div style="display: flex; gap: 10px; margin-top: 8px;">
                <input type="text" id="novoItemChecklist" placeholder="Ex: Contrato de transporte" style="flex:1; background:rgba(255,255,255,0.1); border:none; padding:8px; border-radius:5px;">
                <button onclick="adicionarItemPersonalizado(${ev.id})" class="btn-acao" style="background:var(--primary); color:#000; padding:8px 15px;">Adicionar</button>
            </div>
        </div>
    `;
}

function toggleItemChecklist(eventoId, item) {
    let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const idx = eventos.findIndex(e => e.id == eventoId);
    if (idx === -1) return;

    if (!eventos[idx].checklistNovo) eventos[idx].checklistNovo = [];
    
    const itemIdx = eventos[idx].checklistNovo.indexOf(item);
    if (itemIdx === -1) {
        eventos[idx].checklistNovo.push(item);
    } else {
        eventos[idx].checklistNovo.splice(itemIdx, 1);
    }

    localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
}

function adicionarItemPersonalizado(eventoId) {
    const input = document.getElementById('novoItemChecklist');
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';

    let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const idx = eventos.findIndex(e => e.id == eventoId);
    if (idx === -1) return;
    if (!eventos[idx].checklistPersonalizados) eventos[idx].checklistPersonalizados = [];
    eventos[idx].checklistPersonalizados.push(texto);
    localStorage.setItem('mcom_eventos', JSON.stringify(eventos));

    fecharModalChecklist();
    abrirChecklistDetalhado(eventoId);
}

function removerItemPersonalizado(eventoId, texto) {
    let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const idx = eventos.findIndex(e => e.id == eventoId);
    if (idx !== -1 && eventos[idx].checklistPersonalizados) {
        eventos[idx].checklistPersonalizados = eventos[idx].checklistPersonalizados.filter(i => i !== texto);
        if (eventos[idx].checklistNovo) {
            eventos[idx].checklistNovo = eventos[idx].checklistNovo.filter(i => i !== texto);
        }
        localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
        fecharModalChecklist();
        abrirChecklistDetalhado(eventoId);
    }
}

function calcularProgresso(ev) {
    const totalItens = itensPadraoChecklist.length + (ev.checklistPersonalizados ? ev.checklistPersonalizados.length : 0);
    if (totalItens === 0) return 0;
    const marcados = ev.checklistNovo ? ev.checklistNovo.length : 0;
    return Math.round((marcados / totalItens) * 100);
}

function fecharModalChecklist() {
    document.getElementById('modalChecklist').style.display = 'none';
    renderChecklist();
}
