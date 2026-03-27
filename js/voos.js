function renderViewVoos() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="glass-card">
        <h2><i class="fas fa-plane"></i> Central de Logística Aérea</h2>
        <div class="form-grid">
            <input type="text" id="origem" placeholder="Origem (IATA: BSB)" maxlength="3" style="text-transform: uppercase">
            <input type="text" id="destino" placeholder="Destino (IATA: SSA)" maxlength="3" style="text-transform: uppercase">
            <input type="date" id="dataVoo">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;">
            <button onclick="abrirBusca('skyscanner')" style="background:#00d391; color:#05203c; font-weight:bold">
                <i class="fas fa-search"></i> SKYSCANNER (Automático)
            </button>
            <button onclick="abrirBusca('google')" style="background:#4285F4; font-weight:bold">
                <i class="fab fa-google"></i> GOOGLE FLIGHTS
            </button>
            <button onclick="abrirBusca('latam')" style="background:#ff0011; font-weight:bold">
                <i class="fas fa-plane"></i> LATAM
            </button>
            <button onclick="abrirBusca('azul')" style="background:#003399; font-weight:bold">
                <i class="fas fa-plane-up"></i> AZUL
            </button>
            <button onclick="abrirBusca('gol')" style="background:#ff6700; color:white; font-weight:bold; grid-column: span 2;">
                <i class="fas fa-plane-arrival"></i> GOL Linhas Aéreas
            </button>
        </div>
    </div>`;
}

function abrirBusca(cia) {
    const org = document.getElementById('origem').value.toUpperCase();
    const des = document.getElementById('destino').value.toUpperCase();
    const dataRaw = document.getElementById('dataVoo').value;

    let url = "";
    if (cia === 'skyscanner' || cia === 'google') {
        if (!org || !des || !dataRaw) return alert("Preencha os dados para busca automática!");
        const [ano, mes, dia] = dataRaw.split('-');
        url = (cia === 'skyscanner') 
            ? `https://www.skyscanner.com.br/transporte/passagens-aereas/${org}/${des}/${ano.slice(2)}${mes}${dia}/?adultsv2=1&cabinclass=economy&rtn=0`
            : `https://www.google.com/travel/flights?q=Flights%20to%20${des}%20from%20${org}%20on%20${dataRaw}%20oneway`;
    } else {
        const links = {
            'latam': 'https://www.latamairlines.com/br/pt',
            'azul': 'https://www.voeazul.com.br/br/pt/home',
            'gol': 'https://www.voegol.com.br/'
        };
        url = links[cia];
    }
    window.open(url, '_blank');
}