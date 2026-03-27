function renderFipe() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="glass-card">
        <h2><i class="fas fa-truck-ramp-box"></i> Estrutura FIPE</h2>
        <select id="fipeEv" style="width:100%; margin-bottom:20px">
            ${eventos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}
        </select>
        <div class="form-grid">
            <textarea id="fipeFixa" placeholder="Estrutura Fixa (Palco, Backdrop...)" rows="5"></textarea>
            <textarea id="fipeAudio" placeholder="Audiovisual (Microfone, Som...)" rows="5"></textarea>
            <textarea id="fipeApoio" placeholder="Apoio (Água, Púlpito...)" rows="5"></textarea>
            <textarea id="fipeTi" placeholder="TI (Internet, Cabos...)" rows="5"></textarea>
        </div>
        <button onclick="salvarFipe()" style="width:100%; margin-top:20px">VINCULAR LOGÍSTICA</button>
    </div>`;
}

function salvarFipe() {
    const id = document.getElementById('fipeEv').value;
    const index = eventos.findIndex(e => e.id == id);
    if(index !== -1) {
        eventos[index].fipe = {
            fixa: document.getElementById('fipeFixa').value,
            audio: document.getElementById('fipeAudio').value,
            apoio: document.getElementById('fipeApoio').value,
            ti: document.getElementById('fipeTi').value
        };
        localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
        alert("Logística salva!");
    }
}