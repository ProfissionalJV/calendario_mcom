function renderArtes() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="glass-card">
        <h2><i class="fas fa-palette"></i> Controle de Produção de Artes</h2>
        <p style="margin-bottom:20px; opacity:0.8">Selecione o evento para definir o Pack de Artes:</p>
        
        <select id="artesEvento" style="width:100%; margin-bottom:20px" onchange="carregarDadosArtes(this.value)">
            <option value="">Selecione o Evento...</option>
            ${eventos.map(e => `<option value="${e.id}">${e.nome} (${e.uf})</option>`).join('')}
        </select>

        <div class="form-grid">
            <div class="glass-card" style="background:rgba(255,255,255,0.03)">
                <h4 style="color:var(--primary)"><i class="fas fa-check-double"></i> Itens Necessários</h4>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px">
                    <label><input type="checkbox" class="art-item" value="Placa de Inauguração"> 🖼️ Placa de Inauguração</label>
                    <label><input type="checkbox" class="art-item" value="Convite Digital"> 📱 Convite Digital (WhatsApp)</label>
                    <label><input type="checkbox" class="art-item" value="Cheque Simbólico"> 💰 Cheque Simbólico</label>
                    <label><input type="checkbox" class="art-item" value="Certificado de Doação"> 📜 Certificado de Doação</label>
                    <label><input type="checkbox" class="art-item" value="Certificado de Formação"> 🎓 Certificado de Formação</label>
                    <label><input type="checkbox" class="art-item" value="Banner/Backdrop"> 🏛️ Banner / Backdrop</label>
                </div>
            </div>

            <div class="glass-card" style="background:rgba(255,255,255,0.03)">
                <h4 style="color:var(--primary)"><i class="fas fa-paint-brush"></i> Observações para o Design</h4>
                <textarea id="artesObs" placeholder="Ex: Inserir logo da prefeitura parceira, destaque para o nome do curso..." rows="8" style="width:100%"></textarea>
            </div>
        </div>

        <div style="margin-top:20px;">
            <button onclick="salvarArtes()" style="width:100%; background:var(--primary); color:#000; font-weight:bold">
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