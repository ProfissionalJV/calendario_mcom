function renderEquipe() {
    const app = document.getElementById('app');
    // Buscamos os eventos atualizados do localStorage para evitar bugs de memória
    const eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
    <div class="glass-card">
        <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px">
            <div style="background:var(--primary); color:black; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center">
                <i class="fas fa-users-gear"></i>
            </div>
            <div>
                <h2 style="margin:0">Gestão de Equipe & Autoridades</h2>
                <p style="margin:0; opacity:0.6; font-size:14px">Escalona a comitiva para eventos ativos</p>
            </div>
        </div>
        
        <div style="margin-bottom:25px">
            <label style="display:block; margin-bottom:8px; font-size:12px; color:var(--primary); font-weight:bold">SELECIONE O EVENTO DESTINO:</label>
            <select id="selectEvento" style="width:100%; padding:12px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:8px" onchange="carregarEquipeExistente(this.value)">
                <option value="">Aguardando seleção...</option>
                ${eventosAtuais.map(e => `<option value="${e.id}">${e.nome} (${e.uf})</option>`).join('')}
            </select>
        </div>

        <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
            <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05)">
                <h4 style="color:var(--primary); margin-bottom:15px; display:flex; align-items:center; gap:10px">
                    <i class="fas fa-id-badge"></i> EQUIPE CGID
                </h4>
                <div style="display:flex; flex-direction:column; gap:10px">
                    ${["Karine", "Gustavo", "Daliane", "Victória"].map(nome => `
                        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px; transition:0.2s" class="check-item">
                            <input type="checkbox" class="part" value="${nome}" style="width:18px; height:18px; accent-color:var(--primary)">
                            <span>${nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05)">
                <h4 style="color:var(--primary); margin-bottom:15px; display:flex; align-items:center; gap:10px">
                    <i class="fas fa-building-columns"></i> MCOM / GABINETE
                </h4>
                <div style="display:flex; flex-direction:column; gap:10px">
                    ${["Ministro", "Ministra Interina", "ASPAD", "ASCOM", "SEXEC"].map(nome => `
                        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px; transition:0.2s" class="check-item">
                            <input type="checkbox" class="part" value="${nome}" style="width:18px; height:18px; accent-color:var(--primary)">
                            <span>${nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); margin-top:20px">
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-user-plus"></i> Outros Participantes</h4>
            <input type="text" id="outrosEquipe" placeholder="Ex: Deputado Fulano, Assessor X (separe por vírgula)" 
            style="width:100%; padding:12px; background:rgba(0,0,0,0.2); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:8px">
        </div>

        <button onclick="vincularEquipe()" style="width:100%; margin-top:25px; padding:15px; background:var(--primary); color:#000; font-weight:900; border:none; border-radius:8px; cursor:pointer; letter-spacing:1px">
            <i class="fas fa-save"></i> CONFIRMAR EQUIPE
        </button>
    </div>`;

    // Adiciona o efeito visual de hover via CSS dinâmico
    const style = document.createElement('style');
    style.innerHTML = `
        .check-item:hover { background: rgba(0,255,136,0.1) !important; }
        .part:checked + span { color: var(--primary); font-weight: bold; }
    `;
    document.head.appendChild(style);
}

// AS FUNÇÕES VINCULAR E CARREGAR PERMANECEM IGUAIS (SÓ GARANTA QUE USEM O LOCALSTORAGE ATUALIZADO)
function vincularEquipe() {
    const id = document.getElementById('selectEvento').value;
    if(!id) return alert("Selecione um evento primeiro!");

    const selecionados = Array.from(document.querySelectorAll('.part:checked')).map(c => c.value);
    const outros = document.getElementById('outrosEquipe').value;
    if(outros) {
        const listaOutros = outros.split(',').map(item => item.trim()).filter(i => i !== "");
        selecionados.push(...listaOutros);
    }

    let eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const index = eventosAtuais.findIndex(e => e.id == id);
    
    if(index !== -1) {
        eventosAtuais[index].equipe = selecionados;
        localStorage.setItem('mcom_eventos', JSON.stringify(eventosAtuais));
        alert("Escala da equipe salva com sucesso!");
        renderView('dashboard');
    }
}

function carregarEquipeExistente(id) {
    document.querySelectorAll('.part').forEach(c => c.checked = false);
    document.getElementById('outrosEquipe').value = '';

    const eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = eventosAtuais.find(e => e.id == id);
    
    if(ev && ev.equipe) {
        const nomesFixos = ["Karine", "Gustavo", "Daliane", "Victória", "Ministro", "Ministra Interina", "ASPAD", "ASCOM", "SEXEC"];
        let outrosLista = [];

        ev.equipe.forEach(nome => {
            if(nomesFixos.includes(nome)) {
                const check = Array.from(document.querySelectorAll('.part')).find(c => c.value === nome);
                if(check) check.checked = true;
            } else {
                outrosLista.push(nome);
            }
        });

        if(outrosLista.length > 0) {
            document.getElementById('outrosEquipe').value = outrosLista.join(', ');
        }
    }
}