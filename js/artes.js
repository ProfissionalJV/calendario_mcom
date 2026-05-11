function renderArtes() {
    const app = document.getElementById('app');
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
    <div class="glass-card" id="artesContainer">
        <style>
            #artesContainer .checkbox-group {
                display: flex;
                flex-direction: column;
            }
            #artesContainer .checkbox-item {
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
                /* removemos a margin-bottom daqui para não conflitar */
                padding: 0 !important;
                line-height: normal !important;
            }
            #artesContainer .checkbox-item input[type="checkbox"] {
                margin: 0 !important;
                width: 18px;
                height: 18px;
                flex-shrink: 0;
            }
        </style>

        <h2><i class="fas fa-palette"></i> Controle de Produção de Artes</h2>
        <p style="margin-bottom:20px; opacity:0.8">Selecione o evento para definir o Pack de Artes:</p>
        
        <select id="artesEvento" style="width:100%; margin-bottom:20px" onchange="carregarDadosArtes(this.value)">
            <option value="">Selecione o Evento...</option>
            ${eventos.map(e => `<option value="${e.id}">${e.nome} (${e.uf})</option>`).join('')}
        </select>

        <div class="form-grid">
            <div class="glass-card" style="background:rgba(255,255,255,0.03)">
                <h4 style="color:var(--primary); margin-bottom: 18px;"><i class="fas fa-check-double"></i> Itens Necessários</h4>
                <div class="checkbox-group">
                    <label class="checkbox-item" style="margin-bottom: 20px;">
                        <input type="checkbox" class="art-item" value="Placa de Inauguração">
                        <span>Placa de Inauguração</span>
                    </label>
                    <label class="checkbox-item" style="margin-bottom: 20px;">
                        <input type="checkbox" class="art-item" value="Convite Digital">
                        <span>Convite de Participação</span>
                    </label>
                    <label class="checkbox-item" style="margin-bottom: 20px;">
                        <input type="checkbox" class="art-item" value="Cheque Simbólico">
                        <span>Cheque Simbólico</span>
                    </label>
                    <label class="checkbox-item" style="margin-bottom: 20px;">
                        <input type="checkbox" class="art-item" value="Certificado de Doação">
                        <span>Certificado de Doação</span>
                    </label>
                    <label class="checkbox-item" style="margin-bottom: 20px;">
                        <input type="checkbox" class="art-item" value="Certificado de Formação">
                        <span>Certificado de Formação</span>
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" class="art-item" value="Banner/Backdrop">
                        <span>Banner / Backdrop</span>
                    </label>
                </div>
            </div>

            <div class="glass-card" style="background:rgba(255,255,255,0.03)">
                <h4 style="color:var(--primary); margin-bottom: 18px;"><i class="fas fa-comment"></i> Observações para o Design</h4>
                <textarea id="artesObs" placeholder="Ex: Inserir logo da prefeitura parceira, destaque para o nome do curso..." rows="8" style="width:100%"></textarea>
            </div>
        </div>

        <div style="margin-top:20px;">
            <button onclick="salvarArtes()" style="width:100%; background:var(--primary); color:#000; font-weight:bold; padding:12px; border-radius:8px; cursor:pointer;">
                SALVAR PACK DE ARTES
            </button>
        </div>
    </div>`;
}
function salvarArtes() {
    const idEv = document.getElementById('artesEvento').value;
    if(!idEv) return alert("Selecione um evento!");

    const itens = Array.from(document.querySelectorAll('.art-item:checked')).map(i => i.value);
    const obs = document.getElementById('artesObs').value;

    const index = eventos.findIndex(e => e.id == idEv);
    if(index !== -1) {
        eventos[index].artes = {
            itens: itens,
            observacoes: obs
        };
        localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
        alert("Demanda de artes salva com sucesso!");
    }
}

function carregarDadosArtes(id) {
    // Limpa campos
    document.querySelectorAll('.art-item').forEach(i => i.checked = false);
    document.getElementById('artesObs').value = '';

    const ev = eventos.find(e => e.id == id);
    if(ev && ev.artes) {
        ev.artes.itens.forEach(item => {
            const check = Array.from(document.querySelectorAll('.art-item')).find(i => i.value === item);
            if(check) check.checked = true;
        });
        document.getElementById('artesObs').value = ev.artes.observacoes || '';
    }
}
