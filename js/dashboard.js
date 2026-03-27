// --- VARIÁVEIS GLOBAIS PARA INSTÂNCIAS DOS GRÁFICOS E MAPA ---
let instanceChartTipos = null;
let instanceChartMensal = null;
let instanceChartIndividual = null;
let mapInstance = null;

// Garante que os gráficos e o mapa se adaptem ao redimensionar
window.addEventListener('resize', () => {
    if (instanceChartTipos) instanceChartTipos.resize();
    if (instanceChartMensal) instanceChartMensal.resize();
    if (instanceChartIndividual) instanceChartIndividual.resize();
    if (mapInstance) mapInstance.invalidateSize();
});

// Coordenadas centrais aproximadas de cada estado para o mapa
const coordenadasEstados = {
    'AC': [-9.97, -67.81], 'AL': [-9.66, -35.73], 'AP': [0.03, -51.07], 'AM': [-3.11, -60.02],
    'BA': [-12.97, -38.50], 'CE': [-3.71, -38.54], 'DF': [-15.78, -47.93], 'ES': [-20.31, -40.31],
    'GO': [-16.68, -49.25], 'MA': [-2.53, -44.30], 'MT': [-15.60, -56.09], 'MS': [-20.44, -54.61],
    'MG': [-19.92, -43.94], 'PA': [-1.45, -48.50], 'PB': [-7.11, -34.86], 'PR': [-25.42, -49.27],
    'PE': [-8.05, -34.88], 'PI': [-5.09, -42.80], 'RJ': [-22.90, -43.20], 'RN': [-5.79, -35.21],
    'RS': [-30.03, -51.23], 'RO': [-8.76, -63.90], 'RR': [2.82, -60.67], 'SC': [-27.59, -48.54],
    'SP': [-23.55, -46.63], 'SE': [-10.91, -37.07], 'TO': [-10.18, -48.33]
};

// --- FUNÇÃO PRINCIPAL: RENDERIZA O DASHBOARD ---
function renderDashboard() {
    try {
        const app = document.getElementById('app');
        if (!app) return;

        document.body.classList.add('pagina-dashboard');
        const eventosAtuais = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        const totalTecnicos = eventosAtuais.reduce((acc, e) => acc + (e.equipe?.length || 0), 0);

        // Lógica de Próximo Prazo (mais próximo da data de hoje)
        const eventosComData = eventosAtuais
            .filter(ev => ev.dataEvento)
            .sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento));
        
        const proximoPrazo = eventosComData.length > 0 
            ? eventosComData[0].dataEvento.split('-').reverse().slice(0,2).join('/') 
            : '--/--';

        app.innerHTML = `
            <div class="dash-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h1 style="margin:0"><i class="fas fa-chart-line"></i> PAINEL DE CONTROLE</h1>
                    <p style="opacity:0.6; font-size:14px">Monitoramento em tempo real dos eventos CGID</p>
                </div>
                
                <select id="filtroEvento" onchange="atualizarDash(this.value)" style="width: 100%; max-width: 300px; background: rgba(0,0,0,0.3); border: 1px solid var(--primary); color: white; padding: 10px; border-radius: 8px; cursor:pointer">
                    <option value="geral">📊 Visão Geral do Índice</option>
                    ${eventosAtuais.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}
                </select>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px">
                <div class="glass-card" style="padding:20px; text-align:center">
                    <small style="opacity:0.7">Total de Eventos</small>
                    <h2 style="color:var(--primary); margin:10px 0; font-size: 2.2rem;">${eventosAtuais.length}</h2>
                    <div style="font-size:10px; color:#00ff88; font-weight:bold">Ativos no sistema</div>
                </div>
                <div class="glass-card" style="padding:20px; text-align:center">
                    <small style="opacity:0.7">Técnicos em Campo</small>
                    <h2 style="color:var(--primary); margin:10px 0; font-size: 2.2rem;">${totalTecnicos}</h2>
                    <div style="font-size:10px; opacity:0.6">Total de mobilizados</div>
                </div>
                <div class="glass-card" style="padding:20px; text-align:center">
                    <small style="opacity:0.7">Próximo Prazo</small>
                    <h2 style="font-size:2.2rem; margin:10px 0; color:white; font-weight: bold;">${proximoPrazo}</h2>
                    <div style="font-size:10px; opacity:0.6">Data do evento mais próximo</div>
                </div>
            </div>

            <div id="conteudoDinamicoDash">
                <div class="glass-card" style="padding:20px; margin-bottom: 25px">
                    <h4 style="margin-bottom:20px"><i class="fas fa-calendar-alt"></i> Volume de Eventos por Mês</h4>
                    <div style="height:250px"><canvas id="chartMensal"></canvas></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px">
                    <div class="glass-card" style="padding:20px">
                        <h4 style="margin-bottom:20px"><i class="fas fa-map-marked-alt"></i> Mapa de Distribuição</h4>
                        <div id="mapaBrasil" style="height:350px; border-radius: 8px; border: 1px solid rgba(0,255,136,0.2);"></div>
                    </div>
                    <div class="glass-card" style="padding:20px">
                        <h4 style="margin-bottom:20px"><i class="fas fa-chart-pie"></i> Mix de Tipos</h4>
                        <div style="height:350px"><canvas id="chartTipos"></canvas></div>
                    </div>
                </div>

                <h3 style="margin: 20px 0 20px 10px">Cards de Eventos</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;" id="containerCards">
                    ${renderCardsDashboard(eventosAtuais)}
                </div>
            </div>
        `;

        setTimeout(() => initCharts(eventosAtuais), 100);
    } catch (err) { console.error(err); }
}

// --- FUNÇÃO: DETALHE INDIVIDUAL DO EVENTO (GERENCIAR) ---
function atualizarDash(id) {
    if (id === 'geral') { renderDashboard(); return; }
    
    const evs = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const e = evs.find(ev => ev.id == id);
    if (!e) return;

    const container = document.getElementById('conteudoDinamicoDash');
    const dataDisplay = (e.dataEvento || "").split('-').reverse().join('/');

    container.innerHTML = `
        <div class="glass-card" style="margin-bottom: 25px; border-top: 4px solid var(--primary); padding: 25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px">
                <h3 style="margin:0; color:var(--primary)">${e.nome}</h3>
                <div style="display:flex; gap:10px">
                    <button onclick="editarEventoPeloDash(${e.id})" style="background:#ffcc00; color:black; border:none; padding:8px 20px; border-radius:8px; font-weight:bold; cursor:pointer">EDITAR DADOS</button>
                    <button onclick="renderDashboard()" style="background:none; border:1px solid white; color:white; padding:8px 20px; border-radius:8px; cursor:pointer">VOLTAR</button>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px">
                <div>
                    <p><b><i class="fas fa-map-pin"></i> UF:</b> ${e.uf} | <b>Tipo:</b> ${e.tipo.toUpperCase()}</p>
                    <p><b><i class="fas fa-calendar-day"></i> Data:</b> ${dataDisplay}</p>
                    <p><b><i class="fas fa-landmark"></i> CRC:</b> ${e.crcVinculado || 'Não informado'}</p>
                    <hr style="opacity:0.1; margin:15px 0">
                    <p><b>Checklist:</b> ${e.checklistNovo?.length || 0} itens concluídos</p>
                </div>
                <div>
                    <h4><i class="fas fa-users"></i> Equipe</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:8px; margin:10px 0">
                        ${(e.equipe && e.equipe.length > 0) ? e.equipe.map(n => `<span style="background:rgba(0,255,136,0.1); color:#00ff88; padding:4px 10px; border-radius:6px; font-size:11px; border:1px solid #00ff8833">${n}</span>`).join('') : 'Pendente'}
                    </div>
                    <div style="height: 100px"><canvas id="chartIndividual"></canvas></div>
                </div>
            </div>
            
            <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05)">
                <small style="opacity:0.6">Briefing / Observações</small>
                <p style="font-size:14px; margin-top:8px; line-height:1.6">${e.detalhamento || 'Sem observações cadastradas.'}</p>
            </div>
        </div>
    `;
    setTimeout(() => initChartIndividual(e), 50);
}

// --- FUNÇÃO: RENDERIZA OS CARDS DA VISÃO GERAL ---
function renderCardsDashboard(eventosAtuais) {
    if (eventosAtuais.length === 0) return '<div style="grid-column: 1/-1; text-align:center; padding:50px; opacity:0.5">Nenhum evento ativo.</div>';

    return eventosAtuais.map(e => {
        const corTipo = e.tipo === 'doacao' ? '#00ff88' : e.tipo === 'formacao' ? '#00d1ff' : '#ff007a';
        const dataCard = (e.dataEvento || "").split('-').reverse().join('/');
        const htmlEquipe = (e.equipe && e.equipe.length > 0) 
            ? e.equipe.map(nome => `<span style="background:rgba(0,255,136,0.1); color:#00ff88; padding:2px 8px; border-radius:4px; font-size:10px; border:1px solid rgba(0,255,136,0.2); margin-right:4px; margin-bottom:4px; display:inline-block;">${nome}</span>`).join('')
            : `<span style="color:#ff4444; font-size:10px; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> Pendente</span>`;

        return `
        <div class="glass-card" style="border-left: 4px solid ${corTipo}; padding: 20px; display: flex; flex-direction: column; min-height: 200px">
            <div style="display:flex; justify-content:space-between; align-items: flex-start;">
                <h4 style="margin:0; font-size: 15px;">${e.nome}</h4>
                <div style="display:flex; gap:8px">
                    <button onclick="concluirEvento(${e.id})" title="Arquivar" style="background:none; color:#00ff88; border:none; cursor:pointer; font-size:16px"><i class="fas fa-check-double"></i></button>
                    <button onclick="excluirEventoDash(${e.id})" style="background:none; color:rgba(255,255,255,0.2); border:none; cursor:pointer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <p style="font-size:11px; margin:8px 0; opacity:0.7"><i class="fas fa-map-marker-alt"></i> ${e.uf} | <i class="fas fa-calendar"></i> ${dataCard}</p>
            
            <div style="margin-top: 5px; flex-grow: 1;">
                <div style="display: flex; flex-wrap: wrap;">${htmlEquipe}</div>
            </div>

            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end;">
                <button onclick="atualizarDash(${e.id})" style="padding: 6px 15px; font-size: 11px; background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid #00ff88; cursor:pointer; border-radius:6px; font-weight:bold">GERENCIAR</button>
            </div>
        </div>`;
    }).join('');
}

// --- INICIALIZAÇÃO DE GRÁFICOS E MAPA ---
function initCharts(eventosAtuais) {
    const ctxMes = document.getElementById('chartMensal')?.getContext('2d');
    const ctxTip = document.getElementById('chartTipos')?.getContext('2d');
    const mapDiv = document.getElementById('mapaBrasil');

    if (!ctxMes || !ctxTip || !mapDiv) return;

    // 1. Mapa Leaflet
    if (mapInstance) mapInstance.remove();
    mapInstance = L.map('mapaBrasil').setView([-14.235, -51.925], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapInstance);

    const dadosUf = {};
    eventosAtuais.forEach(ev => { if(ev.uf) dadosUf[ev.uf] = (dadosUf[ev.uf] || 0) + 1 });

    Object.keys(dadosUf).forEach(uf => {
        if (coordenadasEstados[uf]) {
            const qtd = dadosUf[uf];
            const customIcon = L.divIcon({
                className: 'map-marker-mcom',
                html: `<div style="background-color: #00ff88; color: black; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid black; box-shadow: 0 0 8px #00ff88;">${qtd}</div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            });
            L.marker(coordenadasEstados[uf], { icon: customIcon }).addTo(mapInstance).bindPopup(`<b>${uf}</b>: ${qtd} evento(s)`);
        }
    });

    // 2. Gráfico Mensal
    if (instanceChartMensal) instanceChartMensal.destroy();
    const dadosMensais = new Array(12).fill(0);
    eventosAtuais.forEach(ev => {
        if (ev.dataEvento) {
            const mes = new Date(ev.dataEvento + 'T00:00:00').getMonth();
            dadosMensais[mes]++;
        }
    });

    instanceChartMensal = new Chart(ctxMes, {
        type: 'line',
        data: {
            labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            datasets: [{
                data: dadosMensais,
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                fill: true, tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

// 3. Gráfico Tipos
if (instanceChartTipos) instanceChartTipos.destroy();
instanceChartTipos = new Chart(ctxTip, {
    type: 'doughnut',
    data: {
        labels: ['Doação', 'Formação', 'Inauguração'],
        datasets: [{
            data: [
                eventosAtuais.filter(ev => ev.tipo === 'doacao').length,
                eventosAtuais.filter(ev => ev.tipo === 'formacao').length,
                eventosAtuais.filter(ev => ev.tipo === 'inauguracao').length
            ],
            backgroundColor: ['#0db969', '#00d1ff', '#ff007a'],
            borderWidth: 0
        }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        cutout: '75%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom', // Coloca as legendas abaixo do círculo
                labels: {
                    color: '#ffffff', // COR DO TEXTO AQUI (Branco brilhante)
                    font: {
                        size: 12,
                        family: "'Segoe UI', sans-serif",
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true // Deixa o ícone da legenda redondinho
                }
            }
        }
    }
});

}

function initChartIndividual(e) {
    const ctx = document.getElementById('chartIndividual')?.getContext('2d');
    if (!ctx) return;
    if (instanceChartIndividual) instanceChartIndividual.destroy();

    let score = 0;
    if (e.equipe?.length > 0) score += 50;
    if (e.checklistNovo?.length > 0) score += 50;

    instanceChartIndividual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Prontidão'],
            datasets: [{ data: [score], backgroundColor: score >= 100 ? '#00ff88' : '#ffcc00', borderRadius: 5 }]
        },
        options: {
            indexAxis: 'y',
            scales: { x: { max: 100, display: false }, y: { display: false } },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });
}

// --- FUNÇÕES DE AÇÃO ---
function concluirEvento(id) {
    if (!confirm("Arquivar este evento?")) return;
    let evs = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    let hist = JSON.parse(localStorage.getItem('mcom_historico')) || [];
    const idx = evs.findIndex(ev => ev.id == id);
    if (idx !== -1) {
        hist.push(evs.splice(idx, 1)[0]);
        localStorage.setItem('mcom_eventos', JSON.stringify(evs));
        localStorage.setItem('mcom_historico', JSON.stringify(hist));
        renderDashboard();
    }
}

function editarEventoPeloDash(id) {
    sessionStorage.setItem('editando_evento_id', id);
    if (typeof renderView === 'function') renderView('novoEvento');
}

function excluirEventoDash(id) {
    if (confirm("Excluir permanentemente?")) {
        let evs = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        localStorage.setItem('mcom_eventos', JSON.stringify(evs.filter(ev => ev.id != id)));
        renderDashboard();
    }
}