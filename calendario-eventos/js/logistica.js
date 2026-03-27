// --- 1. RENDERIZAÇÃO DA TELA DE LOGÍSTICA ---

function renderLogistica() {
    const app = document.getElementById('app');
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
        <div style="margin-bottom: 30px">
            <h1><i class="fas fa-plane"></i> Informações sobre Voo</h1>
            <p style="opacity:0.6">Localizadores exclusivos: Karine, Gustavo, Daliane e Victória</p>
        </div>

        <div class="grid-logistica">
            ${eventos.length > 0 ? eventos.map(ev => `
                <div class="glass-card" style="margin-bottom:15px; cursor:pointer; border-left: 4px solid #00ff88" onclick="abrirDetalhesVoo(${ev.id})">
                    <div style="display:flex; justify-content:space-between; align-items:center">
                        <div>
                            <h3 style="margin:0">${ev.nome}</h3>
                            <small>${ev.municipio || 'Cidade não informada'} - ${ev.uf}</small>
                        </div>
                        <i class="fas fa-edit" style="color:#00ff88"></i>
                    </div>
                </div>
            `).join('') : '<p style="opacity:0.5; text-align:center">Nenhum evento cadastrado.</p>'}
        </div>

        <div id="modalVoo" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; justify-content: center; align-items: center; padding: 15px;">
            <div class="glass-card" style="width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding:20px; border: 1px solid #00ff88">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
                    <h2 style="color:#00ff88"><i class="fas fa-ticket-alt"></i> Dados de Voo</h2>
                    <button onclick="fecharModalVoo()" style="background:none; border:none; color:white; font-size:30px; cursor:pointer">&times;</button>
                </div>
                <div id="listaParticipantesVoo"></div>
                <button onclick="fecharModalVoo()" style="width:100%; padding:15px; background:#00ff88; color:black; font-weight:bold; border:none; border-radius:5px; margin-top:20px; cursor:pointer">
                    CONCLUIR E SALVAR
                </button>
            </div>
        </div>
    `;
}

// --- 2. LÓGICA DE PREENCHIMENTO (NOMES FIXOS) ---

function abrirDetalhesVoo(eventoId) {
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = eventos.find(e => e.id == eventoId);
    if(!ev) return;

    const modal = document.getElementById('modalVoo');
    const container = document.getElementById('listaParticipantesVoo');
    modal.style.display = 'flex';

    // NOMES FIXOS CONFORME SOLICITADO
    const equipeFixa = ["Karine", "Gustavo", "Daliane", "Victória"];

    container.innerHTML = equipeFixa.map(nome => {
        // Busca se já existe informação salva para esse nome nesse evento
        const dadosVoo = (ev.logisticaVoos || []).find(v => v.nome === nome) || {};
        
        return `
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; margin-bottom:15px; border: 1px solid rgba(255,255,255,0.1)">
                <h4 style="color:#00ff88; margin-bottom:12px"><i class="fas fa-user"></i> ${nome}</h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                    <div>
                        <label style="font-size:10px; opacity:0.6">LOCALIZADOR</label>
                        <input type="text" placeholder="Código" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px; border-radius:4px" 
                            value="${dadosVoo.localizador || ''}" 
                            onchange="atualizarDadosVoo(${ev.id}, '${nome}', 'localizador', this.value)">
                    </div>
                    <div>
                        <label style="font-size:10px; opacity:0.6">CIA AÉREA</label>
                        <input type="text" placeholder="LATAM/Azul" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px; border-radius:4px" 
                            value="${dadosVoo.cia || ''}" 
                            onchange="atualizarDadosVoo(${ev.id}, '${nome}', 'cia', this.value)">
                    </div>
                    <div>
                        <label style="font-size:10px; opacity:0.6">DATA/HORA</label>
                        <input type="text" placeholder="Ex: 12/10 08:30" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px; border-radius:4px" 
                            value="${dadosVoo.dataHora || ''}" 
                            onchange="atualizarDadosVoo(${ev.id}, '${nome}', 'dataHora', this.value)">
                    </div>
                    <div>
                        <label style="font-size:10px; opacity:0.6">TRECHO</label>
                        <input type="text" placeholder="BSB-GRU" style="width:100%; background:#000; border:1px solid #333; color:#fff; padding:8px; border-radius:4px" 
                            value="${dadosVoo.trecho || ''}" 
                            onchange="atualizarDadosVoo(${ev.id}, '${nome}', 'trecho', this.value)">
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function atualizarDadosVoo(eventoId, nomePassageiro, campo, valor) {
    let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const idx = eventos.findIndex(e => e.id == eventoId);
    
    if (idx === -1) return;
    if (!eventos[idx].logisticaVoos) eventos[idx].logisticaVoos = [];

    let vIdx = eventos[idx].logisticaVoos.findIndex(v => v.nome === nomePassageiro);

    if (vIdx === -1) {
        let novoVoo = { nome: nomePassageiro };
        novoVoo[campo] = valor;
        eventos[idx].logisticaVoos.push(novoVoo);
    } else {
        eventos[idx].logisticaVoos[vIdx][campo] = valor;
    }

    localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
}

function fecharModalVoo() {
    document.getElementById('modalVoo').style.display = 'none';
    renderLogistica();
}