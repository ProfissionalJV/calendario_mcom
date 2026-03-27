// --- 1. FUNÇÕES DE APOIO ---

function preencherDadosCrc(valor) {
    const manual = document.getElementById('nomeCrcManual');
    const campoUf = document.getElementById('uf');
    const campoNome = document.getElementById('nome');

    if (valor === 'outro') {
        manual.style.display = 'block';
        campoUf.value = '';
    } else {
        manual.style.display = 'none';
        const index = parseInt(valor);
        const crcSelecionado = listaBaseCRCs[index];
        
        if (crcSelecionado) {
            campoUf.value = crcSelecionado.uf;
            if (!campoNome.value) campoNome.value = `Ação no ${crcSelecionado.nome}`;
            const campoMunicipio = document.getElementById('municipio');
            if (!campoMunicipio.value) campoMunicipio.value = crcSelecionado.cidade;
        }
    }
}

function tratarMudancaTipo(tipo) {
    const manual = document.getElementById('tipoManual');
    const areaArquivos = document.getElementById('areaUploadArquivos');
    
    manual.style.display = (tipo === 'outro') ? 'block' : 'none';
    areaArquivos.style.display = (tipo === 'doacao') ? 'grid' : 'none';

    toggleCamposDinamicos(tipo);
}

function toggleCamposDinamicos(tipo) {
    const container = document.getElementById('camposDinamicos');
    const editId = sessionStorage.getItem('editando_evento_id');
    let e = null;
    if(editId) {
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        e = lista.find(ev => ev.id == editId);
    }

    if (tipo === 'doacao') {
        container.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-box"></i> Detalhes da Doação</h4>
            <div class="form-grid">
                <div>
                    <label>Quantidade de PCs</label>
                    <input type="number" id="qtdComp" placeholder="Ex: 50" value="${e?.qtdComp || ''}">
                </div>
                <div>
                    <label>PIDs (Separe por vírgula)</label>
                    <input type="text" id="pids" placeholder="Ex: 102, 105" value="${e?.pids || ''}">
                </div>
            </div>`;
    } else if (tipo === 'formacao') {
        container.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-graduation-cap"></i> Detalhes da Formação</h4>
            <div class="form-grid">
                <div>
                    <label>Qtd de Alunos</label>
                    <input type="number" id="qtdAlunos" placeholder="Ex: 30" value="${e?.qtdAlunos || ''}">
                </div>
                <div>
                    <label>Nome do Curso</label>
                    <input type="text" id="curso" placeholder="Ex: Informática Básica" value="${e?.curso || ''}">
                </div>
            </div>`;
    } else {
        container.innerHTML = `<h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-info-circle"></i> Outros Detalhes</h4><p style="opacity:0.5; font-size:12px">Use o campo de detalhamento abaixo para informações específicas.</p>`;
    }
}

// --- 2. RENDERIZAÇÃO ---

function renderEventoForm() {
    const app = document.getElementById('app');
    const editId = sessionStorage.getItem('editando_evento_id');
    let ev = null;
    
    if (editId) {
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        ev = lista.find(e => e.id == editId);
    }

    app.innerHTML = `
    <div class="glass-card">
        <h2><i class="fas ${ev ? 'fa-edit' : 'fa-calendar-plus'}"></i> 
            ${ev ? 'Editar Evento' : 'Detalhar Novo Evento'}
        </h2>
        
        <div class="form-grid">
            <div style="grid-column: span 2">
                <label><i class="fas fa-landmark"></i> CRC Responsável</label>
                <select id="nomeCrc" onchange="preencherDadosCrc(this.value)" style="width:100%">
                    <option value="">Selecione o CRC...</option>
                    ${listaBaseCRCs.map((c, index) => {
                        const label = `${c.nome} (${c.cidade}/${c.uf}) | Meta: ${c.metaDoacao}`;
                        const selected = (ev && ev.crcId == index) ? 'selected' : '';
                        return `<option value="${index}" ${selected}>${label}</option>`;
                    }).join('')}
                    <option value="outro">-- Outro / Manual --</option>
                </select>
                <input type="text" id="nomeCrcManual" placeholder="Nome do Local/Entidade" style="display:none; width:100%; margin-top:10px">
            </div>
            <div>
                <label>Nome do Evento</label>
                <input type="text" id="nome" placeholder="Ex: Entrega de PCs" value="${ev ? ev.nome : ''}">
            </div>
            <div>
                <label>Município</label>
                <input type="text" id="municipio" placeholder="Cidade do evento" value="${ev ? (ev.municipio || '') : ''}">
            </div>
            <div>
                <label>UF</label>
                <input type="text" id="uf" maxlength="2" style="text-transform: uppercase" value="${ev ? ev.uf : ''}">
            </div>
             <div>
                <label>Status/Obs</label>
                <select id="statusLogistica" style="width:100%">
                    <option value="Confirmado" ${ev?.statusLogistica === 'Confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                    <option value="Pendências" ${ev?.statusLogistica === 'Pendências' ? 'selected' : ''}>⏳ Pendente</option>
                </select>
            </div>
        </div>

        <div class="form-grid" style="margin-top:20px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
            <div style="grid-column: span 4"><h4><i class="fas fa-calendar-alt"></i> Período e Agenda</h4></div>
            <div>
                <label>Data Início</label>
                <input type="date" id="dtInicio" value="${ev ? (ev.dataInicio || ev.dataEvento) : ''}">
            </div>
            <div>
                <label>Data Fim</label>
                <input type="date" id="dtFim" value="${ev ? ev.dataFim : ''}">
            </div>
            <div>
                <label>Montagem</label>
                <select id="montagem">
                    <option value="Não Requer" ${ev?.montagem === 'Não Requer' ? 'selected' : ''}>Não Requer</option>
                    <option value="1 dia antes" ${ev?.montagem === '1 dia antes' ? 'selected' : ''}>1 dia antes</option>
                    <option value="2 dias antes" ${ev?.montagem === '2 dias antes' ? 'selected' : ''}>2 dias antes</option>
                </select>
            </div>
            <div>
                <label>Horário</label>
                <input type="text" id="horario" placeholder="Ex: 10:30" value="${ev ? ev.horario : ''}">
            </div>
            <div>
                <label>Data Ida</label>
                <input type="date" id="dataIda" value="${ev ? (ev.dataIda || '') : ''}">
            </div>
            <div>
                <label>Data Volta</label>
                <input type="date" id="dataVolta" value="${ev ? (ev.dataVolta || '') : ''}">
            </div>
            <div style="grid-column: span 2">
                <label>Endereço</label>
                <input type="text" id="endereco" placeholder="Local completo" value="${ev ? ev.endereco : ''}">
            </div>
        </div>

        <div style="margin-top:20px">
            <label style="color: var(--primary); font-weight: bold; font-size: 12px; display: block; margin-bottom: 5px;">TIPO DE EVENTO</label>
            <select id="tipo" onchange="tratarMudancaTipo(this.value)" style="width:100%">
                <option value="doacao">🎁 Doação (Padrão)</option>
                <option value="formacao">🎓 Formação (Formatura)</option>
                <option value="inauguracao">🚀 Inauguração de CRC</option>
                <option value="carreta">🚛 Carreta Digital</option>
                <option value="caravana">🏛️ Caravana Federativa</option>
                <option value="governo">🤝 Governo na Rua</option>
                <option value="outro">➕ Outros (Especificar)</option>
            </select>
            <input type="text" id="tipoManual" placeholder="Descreva o tipo" style="display:none; margin-top:10px; width:100%">
        </div>

        <div id="camposDinamicos" style="margin-top: 15px; padding: 15px; background: rgba(0,255,136,0.05); border-radius: 8px;"></div>

        <div id="areaUploadArquivos" class="form-grid" style="margin-top:20px; display:none">
            <div>
                <label><i class="fas fa-user-edit"></i> Indicação</label>
                <input type="text" id="indicacaoManual" placeholder="Quem indicou?" value="${ev ? (ev.indicacao || '') : ''}">
            </div>
        </div>

        <div style="margin-top:20px">
            <label><i class="fas fa-align-left"></i> Detalhamento / Briefing / Observação</label>
            <textarea id="detalhamento" rows="4" style="width:100%">${ev ? (ev.detalhamento || '') : ''}</textarea>
        </div>

        <div style="display:flex; gap:15px; margin-top:30px">
            <button onclick="salvarEvento()" style="flex:2; background: var(--primary); color: #000; font-weight: bold; height: 55px;">
                <i class="fas fa-save"></i> ${ev ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR EVENTO'}
            </button>
            ${ev ? `<button onclick="cancelarEdicao()" style="flex:1;">CANCELAR</button>` : ''}
        </div>
    </div>`;

    if(ev) {
        document.getElementById('tipo').value = ['doacao', 'formacao', 'inauguracao', 'carreta', 'caravana', 'governo'].includes(ev.tipo) ? ev.tipo : 'outro';
    }
    tratarMudancaTipo(document.getElementById('tipo').value);
}

// --- 3. PERSISTÊNCIA ---

async function salvarEvento() {
    const nome = document.getElementById('nome').value;
    const dtInicio = document.getElementById('dtInicio').value;
    const tipoBase = document.getElementById('tipo').value;
    const crcSelect = document.getElementById('nomeCrc').value;

    if(!nome || !dtInicio) return alert("Por favor, preencha o Nome e a Data!");

    const editId = sessionStorage.getItem('editando_evento_id');
    let listaAtual = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    let crcNomeFinal = "";
    let crcIdFinal = null;

    if (crcSelect === 'outro') {
        crcNomeFinal = document.getElementById('nomeCrcManual').value;
    } else if (crcSelect !== "") {
        const index = parseInt(crcSelect);
        crcIdFinal = index;
        crcNomeFinal = listaBaseCRCs[index].nome;
    }

    const obj = {
        id: editId ? Number(editId) : Date.now(),
        nome: nome,
        municipio: document.getElementById('municipio').value,
        uf: document.getElementById('uf').value.toUpperCase(),
        tipo: tipoBase === 'outro' ? document.getElementById('tipoManual').value : tipoBase,
        crcVinculado: crcNomeFinal,
        crcId: crcIdFinal,
        dataInicio: dtInicio,
        dataEvento: dtInicio, 
        dataFim: document.getElementById('dtFim').value,
        montagem: document.getElementById('montagem').value,
        dataIda: document.getElementById('dataIda').value,
        dataVolta: document.getElementById('dataVolta').value,
        horario: document.getElementById('horario').value,
        endereco: document.getElementById('endereco').value,
        detalhamento: document.getElementById('detalhamento').value,
        statusLogistica: document.getElementById('statusLogistica').value,
        indicacao: document.getElementById('indicacaoManual')?.value || "N/A",
        qtdComp: document.getElementById('qtdComp')?.value || null,
        pids: document.getElementById('pids')?.value || null,
        qtdAlunos: document.getElementById('qtdAlunos')?.value || null,
        curso: document.getElementById('curso')?.value || null,
        equipe: editId ? (listaAtual.find(e => e.id == editId)?.equipe || []) : []
    };

    console.log("🚀 Disparando sincronia com GitHub...");
    
    // Chama a função do main.js
    await salvarNoGithub(obj); 

    if (editId) {
        sessionStorage.removeItem('editando_evento_id'); 
    }
    
    renderView('dashboard');
}

function cancelarEdicao() {
    sessionStorage.removeItem('editando_evento_id');
    renderView('dashboard');
}