// --- GESTÃO DE EQUIPE (ATUALIZADO) ---

function renderEquipe() {
    const app = document.getElementById('app');
    const eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    // Ordem alfabética dos nomes da CGID (já com título)
    const equipeCGID = [
        "Daliane Madureira Serra (Chefe de Divisão de Acompanhamento Técnico de Projetos)",
        "Gustavo Andre Fernandes Lima (Coordenador-Geral de Inclusão Digital)",
        "Karine Do Nascimento Fonseca (Assistente)",
        "Victoria de Paula Nunes (Assistente)"
    ].sort(); // garante ordem alfabética pelo nome

    const equipeMCOM = [
        "ASPAD",
        "ASCOM",
        "Gabinete do Ministro",
        "SEXEC",
        "ASPAR / Cerimonial"
    ].sort();

    const equipeEventual = [
        "Frederico de Siqueira (Ministro de Estado das Comunicações)",
        "Francis Meneses (Coordenador de Projetos)",
        "Hermano Tercius (Secretário de Telecomunicações)",
        "Ludymilla Chagas (Chefe da Assessoria de Participação Social e Diversidade)",
        "Munique Souza (Assessora Técnica)",
        "Pedro Henrique Silva (Assessor Técnico)",
        "Sônia Faustino (Secretária Executiva)",
        "Thayana Vianna (Assessoria de imprensa)"
    ].sort();

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

        <div class="form-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px">
            <!-- Card 1: CGID -->
            <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05)">
                <h4 style="color:var(--primary); margin-bottom:15px"><i class="fas fa-id-badge"></i> EQUIPE CGID</h4>
                <div style="display:flex; flex-direction:column; gap:10px">
                    ${equipeCGID.map(nome => `
                        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px;" class="check-item-equipe">
                            <input type="checkbox" class="part-cgid" value="${nome.replace(/"/g, '&quot;')}" style="width:18px; height:18px; accent-color:var(--primary)">
                            <span>${nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Card 2: MCOM / Gabinete -->
            <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05)">
                <h4 style="color:var(--primary); margin-bottom:15px"><i class="fas fa-building-columns"></i> MCOM / GABINETE</h4>
                <div style="display:flex; flex-direction:column; gap:10px">
                    ${equipeMCOM.map(nome => `
                        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px;" class="check-item-equipe">
                            <input type="checkbox" class="part-mcom" value="${nome}" style="width:18px; height:18px; accent-color:var(--primary)">
                            <span>${nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Card 3: Equipe Eventual -->
            <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05)">
                <h4 style="color:var(--primary); margin-bottom:15px"><i class="fas fa-user-friends"></i> EQUIPE EVENTUAL</h4>
                <div style="display:flex; flex-direction:column; gap:10px">
                    ${equipeEventual.map(nome => `
                        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; border-radius:6px;" class="check-item-equipe">
                            <input type="checkbox" class="part-eventual" value="${nome.replace(/"/g, '&quot;')}" style="width:18px; height:18px; accent-color:var(--primary)">
                            <span>${nome}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Campo Outros Participantes (mantido) -->
        <div class="glass-card" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); margin-top:20px">
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-user-plus"></i> Outros Participantes (não listados acima)</h4>
            <input type="text" id="outrosEquipe" placeholder="Ex: Deputado Fulano, Assessor X (separe por vírgula)" 
            style="width:100%; padding:12px; background:rgba(0,0,0,0.2); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:8px">
        </div>

        <button onclick="vincularEquipe()" style="width:100%; margin-top:25px; padding:15px; background:var(--primary); color:#000; font-weight:900; border:none; border-radius:8px; cursor:pointer; letter-spacing:1px">
            <i class="fas fa-save"></i> CONFIRMAR EQUIPE
        </button>
    </div>`;

    // Efeito hover (opcional)
    const style = document.createElement('style');
    style.innerHTML = `
        .check-item-equipe:hover { background: rgba(0,255,136,0.1) !important; }
        input[type="checkbox"]:checked + span { color: var(--primary); font-weight: bold; }
    `;
    document.head.appendChild(style);
}

// --- FUNÇÃO PARA SALVAR EQUIPE (AGORA COM EQUIPE EVENTUAL) ---
function vincularEquipe() {
    const id = document.getElementById('selectEvento').value;
    if(!id) return alert("Selecione um evento primeiro!");

    // Coleta da CGID e MCOM (juntas no campo "equipe" para compatibilidade)
    const selecionadosCGID = Array.from(document.querySelectorAll('.part-cgid:checked')).map(c => c.value);
    const selecionadosMCOM = Array.from(document.querySelectorAll('.part-mcom:checked')).map(c => c.value);
    const selecionadosEventual = Array.from(document.querySelectorAll('.part-eventual:checked')).map(c => c.value);
    const outrosTexto = document.getElementById('outrosEquipe').value;
    let outrosLista = outrosTexto ? outrosTexto.split(',').map(item => item.trim()).filter(i => i !== "") : [];

    // Une todos os participantes "fixos" (CGID + MCOM) + outros, no campo "equipe"
    const equipeGeral = [...selecionadosCGID, ...selecionadosMCOM, ...outrosLista];

    let eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const index = eventosAtuais.findIndex(e => e.id == id);
    
    if(index !== -1) {
        eventosAtuais[index].equipe = equipeGeral;               // mantém compatibilidade com relatórios antigos
        eventosAtuais[index].equipeEventual = selecionadosEventual; // novo campo
        localStorage.setItem('mcom_eventos', JSON.stringify(eventosAtuais));
        alert("Equipe salva com sucesso!");
        renderView('dashboard');
    } else {
        alert("Evento não encontrado!");
    }
}

// --- FUNÇÃO PARA CARREGAR EQUIPE EXISTENTE (RESTAURA CHECKBOXES) ---
function carregarEquipeExistente(id) {
    // Limpa todos os checkboxes
    document.querySelectorAll('.part-cgid, .part-mcom, .part-eventual').forEach(c => c.checked = false);
    document.getElementById('outrosEquipe').value = '';

    const eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = eventosAtuais.find(e => e.id == id);
    
    if(ev && ev.equipe) {
        // Restaura CGID e MCOM (que estão no array "equipe")
        const todosFixos = ev.equipe;
        // Marca os checkboxes da CGID e MCOM
        document.querySelectorAll('.part-cgid, .part-mcom').forEach(chk => {
            if(todosFixos.includes(chk.value)) chk.checked = true;
        });

        // Restaura "Outros Participantes" (texto livre)
        const nomesFixosCGID = ["Daliane Madureira Serra (Chefe de Divisão de Acompanhamento Técnico de Projetos)",
                                 "Gustavo Andre Fernandes Lima (Coordenador-Geral de Inclusão Digital)",
                                 "Karine Do Nascimento Fonseca (Assistente)",
                                 "Victoria de Paula Nunes (Assistente)"];
        const nomesFixosMCOM = ["ASPAD", "ASCOM", "Gabinete do Ministro", "SEXEC", "ASPAR / Cerimonial"];
        const todosNomesFixos = [...nomesFixosCGID, ...nomesFixosMCOM];
        
        let outros = ev.equipe.filter(nome => !todosNomesFixos.includes(nome));
        if(outros.length > 0) {
            document.getElementById('outrosEquipe').value = outros.join(', ');
        }
    }

    // Restaura Equipe Eventual
    if(ev && ev.equipeEventual && ev.equipeEventual.length) {
        document.querySelectorAll('.part-eventual').forEach(chk => {
            if(ev.equipeEventual.includes(chk.value)) chk.checked = true;
        });
    }
}
