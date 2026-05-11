// --- 1. VARIÁVEIS GLOBAIS ---
let crcsSelecionadosIds = [];        // IDs dos CRCs agregados (índices na listaCRCsConsolidada)
let convenioSelecionado = "";        // número do convênio escolhido para o CRC atualmente selecionado
let ultimoCrcSelecionado = null;     // guarda o último CRC adicionado para popular o select

// --- 2. CARREGAR LISTAS ---
function carregarListas() {
    if (typeof window.listaCRCsConsolidada === 'undefined') {
        setTimeout(() => carregarListas(), 200);
        return;
    }
    console.log(`📋 ${window.listaCRCsConsolidada.length} CRCs agregados carregados`);
}
carregarListas();

// --- 3. FUNÇÕES DE APOIO (tipo, dinâmicos) ---
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
    if (editId) {
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        e = lista.find(ev => ev.id == editId);
    }
    if (tipo === 'doacao') {
        container.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-box"></i> Detalhes da Doação</h4>
            <div class="form-grid">
                <div><label>Quantidade de PCs</label><input type="number" id="qtdComp" placeholder="Ex: 50" value="${e?.qtdComp || ''}"></div>
            </div>`;
    } else if (tipo === 'formacao') {
        container.innerHTML = `
            <h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-graduation-cap"></i> Detalhes da Formação</h4>
            <div class="form-grid">
                <div><label>Qtd de Alunos</label><input type="number" id="qtdAlunos" placeholder="Ex: 30" value="${e?.qtdAlunos || ''}"></div>
                <div><label>Nome do Curso</label><input type="text" id="curso" placeholder="Ex: Informática Básica" value="${e?.curso || ''}"></div>
            </div>`;
    } else {
        container.innerHTML = `<h4 style="color:var(--primary); margin-bottom:10px"><i class="fas fa-info-circle"></i> Outros Detalhes</h4><p style="opacity:0.5; font-size:12px">Use o campo de detalhamento abaixo.</p>`;
    }
}

// --- 4. RENDERIZAÇÃO DO FORMULÁRIO ---
function renderEventoForm() {
    if (!window.listaCRCsConsolidada) {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="glass-card"><h3>Carregando dados...</h3><p>Aguarde um instante.</p></div>';
        setTimeout(() => renderEventoForm(), 500);
        return;
    }

    const app = document.getElementById('app');
    const editId = sessionStorage.getItem('editando_evento_id');
    let ev = null;
    if (editId) {
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        ev = lista.find(e => e.id == editId);
    }

    // Carregar seleções salvas (apenas um CRC por evento – ajuste se quiser múltiplos)
    if (ev && ev.crcId !== undefined && ev.crcId !== null) {
        crcsSelecionadosIds = [ev.crcId];
        convenioSelecionado = ev.convenioSelecionado || "";
    } else {
        crcsSelecionadosIds = [];
        convenioSelecionado = "";
    }

    app.innerHTML = `
    <div class="glass-card" style="padding: 25px;">
        <h2><i class="fas ${ev ? 'fa-edit' : 'fa-calendar-plus'}"></i> ${ev ? 'Editar Evento' : 'Novo Evento'}</h2>
        
        <!-- LINHA 1: Busca CRC, Nome, Município, UF -->
        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
                <label><i class="fas fa-landmark"></i> CRC</label>
                <div style="position: relative;">
                    <input type="text" id="buscaCrcInput" placeholder="Digite nome, UF ou cidade..." autocomplete="off"
                           style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--primary); background: rgba(0,0,0,0.3); color: white;">
                    <div id="sugestoesCrc" style="position: absolute; top: 100%; left: 0; right: 0; background: #1e1e2f; border: 1px solid var(--primary); border-radius: 8px; max-height: 200px; overflow-y: auto; z-index: 1000; display: none; margin-top: 4px;"></div>
                </div>
            </div>
            <div>
                <label><i class="fas fa-tag"></i> Nome do Evento</label>
                <input type="text" id="nome" value="${ev ? ev.nome : ''}" style="width: 100%;">
            </div>
            <div>
                <label>Município</label>
                <input type="text" id="municipio" value="${ev ? (ev.municipio || '') : ''}" style="width: 100%;">
            </div>
            <div>
                <label>UF</label>
                <input type="text" id="uf" maxlength="2" style="text-transform: uppercase; width: 100%;" value="${ev ? ev.uf : ''}">
            </div>
        </div>

        <!-- LINHA 2: Seleção de Nº SICONV (convênio) -->
        <div id="convenioSelectContainer" style="margin-bottom: 20px; display: ${crcsSelecionadosIds.length > 0 ? 'block' : 'none'};">
            <label><i class="fas fa-hashtag"></i> Selecionar Nº SICONV (convênio)</label>
            <select id="convenioSelecionadoSelect" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--primary); color: white;">
                <option value="">-- Escolha o número do convênio --</option>
            </select>
        </div>

        <!-- LINHA 3: CRC Selecionado (tag) -->
        <div style="margin-bottom: 20px;">
            <label><i class="fas fa-check-circle"></i> CRC Selecionado</label>
            <div id="crcTagsContainer" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; min-height: 45px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.2);"></div>
        </div>

        <!-- LINHA 4: Status/Obs -->
        <div style="margin-bottom: 20px;">
            <label><i class="fas fa-chart-line"></i> Status / Observação</label>
            <select id="statusLogistica" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--primary); color: white;">
                <option value="Confirmado" ${ev?.statusLogistica === 'Confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                <option value="Pendências" ${ev?.statusLogistica === 'Pendências' ? 'selected' : ''}>⏳ Pendente</option>
            </select>
        </div>

        <!-- DEMAIS CAMPOS (período, agenda, tipo, detalhamento, planilha) -->
       <div style="margin-top:20px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
            <h4 style="margin-bottom: 15px;"><i class="fas fa-calendar-alt"></i> Período e Agenda</h4>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                <div><label>Data Início</label><input type="date" id="dtInicio" value="${ev ? (ev.dataInicio || ev.dataEvento) : ''}" style="width:100%;"></div>
                <div><label>Data Fim</label><input type="date" id="dtFim" value="${ev ? ev.dataFim : ''}" style="width:100%;"></div>
                <div><label>Montagem</label>
                    <select id="montagem" style="width:100%;">
                        <option value="Não Requer" ${ev?.montagem === 'Não Requer' ? 'selected' : ''}>Não Requer</option>
                        <option value="1 dia antes" ${ev?.montagem === '1 dia antes' ? 'selected' : ''}>1 dia antes</option>
                        <option value="2 dias antes" ${ev?.montagem === '2 dias antes' ? 'selected' : ''}>2 dias antes</option>
                    </select>
                </div>
                <div><label>Horário</label><input type="text" id="horario" value="${ev ? ev.horario : ''}" style="width:100%;"></div>
                <div><label>Data Ida</label><input type="date" id="dataIda" value="${ev ? (ev.dataIda || '') : ''}" style="width:100%;"></div>
                <div><label>Data Volta</label><input type="date" id="dataVolta" value="${ev ? (ev.dataVolta || '') : ''}" style="width:100%;"></div>
                <div style="grid-column: span 2"><label>Endereço - Evento</label><input type="text" id="endereco" value="${ev ? ev.endereco : ''}" style="width:100%;"></div>
            </div>
        </div>

        <div style="margin-top:20px">
            <label style="color: var(--primary); font-weight: bold;">TIPO DE EVENTO</label>
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
            <div><label><i class="fas fa-user-edit"></i> Indicação</label><input type="text" id="indicacaoManual" value="${ev ? (ev.indicacao || '') : ''}"></div>
        </div>

        <div style="margin-top:20px">
            <label><i class="fas fa-align-left"></i> Detalhamento / Briefing / Observação</label>
            <textarea id="detalhamento" rows="4" style="width:100%">${ev ? (ev.detalhamento || '') : ''}</textarea>
        </div>

        <div style="margin-top:20px">
            <label><i class="fas fa-file-excel"></i> Planilha de Acompanhamento (Excel)</label>
            <input type="file" id="planilhaEvento" accept=".xlsx, .xls">
            ${ev && ev.planilhaUrl ? `<p><a href="${ev.planilhaUrl}" target="_blank">Planilha atual</a> <button type="button" onclick="removerPlanilha()" style="background:none; border:1px solid red; padding:2px 8px;">Remover</button></p>` : ''}
        </div>

        <div style="display:flex; gap:15px; margin-top:30px">
            <button onclick="salvarEvento()" style="flex:2; background: var(--primary); color: #000; font-weight: bold; height: 55px; border-radius: 8px;"><i class="fas fa-save"></i> ${ev ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR EVENTO'}</button>
            ${ev ? `<button onclick="cancelarEdicao()" style="flex:1; background: rgba(255,255,255,0.1);">CANCELAR</button>` : ''}
        </div>
    </div>`;

    if (ev) {
        document.getElementById('tipo').value = ['doacao', 'formacao', 'inauguracao', 'carreta', 'caravana', 'governo'].includes(ev.tipo) ? ev.tipo : 'outro';
        if (ev.tipo === 'outro') document.getElementById('tipoManual').value = ev.tipo;
    }
    tratarMudancaTipo(document.getElementById('tipo').value);
    initCrcBuscaECovenio();
}

// --- 5. LÓGICA DE BUSCA E SELEÇÃO DE CONVÊNIO ---
function initCrcBuscaECovenio() {
    const inputBusca = document.getElementById('buscaCrcInput');
    const sugestoesDiv = document.getElementById('sugestoesCrc');
    const tagsContainer = document.getElementById('crcTagsContainer');
    const convenioDiv = document.getElementById('convenioSelectContainer');
    const selectConvenio = document.getElementById('convenioSelecionadoSelect');

    function atualizarTags() {
        tagsContainer.innerHTML = '';
        if (crcsSelecionadosIds.length === 0) {
            tagsContainer.innerHTML = '<span style="opacity:0.5; font-size:13px;">Nenhum CRC selecionado</span>';
            convenioDiv.style.display = 'none';
            return;
        }
        for (let idx of crcsSelecionadosIds) {
            const crc = window.listaCRCsConsolidada[idx];
            if (!crc) continue;
            const tag = document.createElement('span');
            tag.style.background = 'linear-gradient(135deg, rgba(46,204,113,0.2), rgba(46,204,113,0.05))';
            tag.style.color = '#c3ffd1';
            tag.style.border = '1px solid #2ecc71';
            tag.style.padding = '5px 12px';
            tag.style.borderRadius = '30px';
            tag.style.fontSize = '13px';
            tag.style.display = 'inline-flex';
            tag.style.alignItems = 'center';
            tag.style.gap = '8px';
            tag.style.fontWeight = '500';
            tag.innerHTML = `${crc.nome} (${crc.uf}) - ${convenioSelecionado ? `Convênio ${convenioSelecionado}` : 'Nenhum convênio'} <span style="color:#ff6666; cursor:pointer; margin-left:8px;">&times;</span>`;
            tag.querySelector('span:last-child').addEventListener('click', (e) => {
                e.stopPropagation();
                crcsSelecionadosIds = [];
                convenioSelecionado = "";
                atualizarTags();
            });
            tagsContainer.appendChild(tag);
        }
        if (crcsSelecionadosIds.length > 0) {
            convenioDiv.style.display = 'block';
            popularSelectConvenio(crcsSelecionadosIds[0]);
        } else {
            convenioDiv.style.display = 'none';
        }
    }

    function popularSelectConvenio(crcIdx) {
        const crc = window.listaCRCsConsolidada[crcIdx];
        if (!crc) return;
        // Buscar convênios reais para este CRC (nome + UF) no rawCRCs
        const conveniosDisponiveis = window.rawCRCs ? window.rawCRCs.filter(c => c.nome === crc.nome && c.uf === crc.uf) : [];
        selectConvenio.innerHTML = '<option value="">-- Escolha o número do convênio --</option>';
        conveniosDisponiveis.forEach(c => {
            const selected = (convenioSelecionado === c.convenio) ? 'selected' : '';
            selectConvenio.innerHTML += `<option value="${c.convenio}" ${selected}>${c.convenio}</option>`;
        });
        if (conveniosDisponiveis.length === 0) {
            selectConvenio.innerHTML = '<option value="">Nenhum convênio disponível</option>';
        }
    }

    selectConvenio.addEventListener('change', (e) => {
        convenioSelecionado = e.target.value;
        atualizarTags();
    });

    function buscarSugestoes() {
        const termo = inputBusca.value.toLowerCase().trim();
        if (termo.length < 2) {
            sugestoesDiv.style.display = 'none';
            return;
        }
        const resultados = window.listaCRCsConsolidada.filter(crc => {
            return crc.nome.toLowerCase().includes(termo) ||
                   crc.uf.toLowerCase().includes(termo) ||
                   crc.cidade.toLowerCase().includes(termo);
        }).slice(0, 10);
        if (resultados.length === 0) {
            sugestoesDiv.style.display = 'none';
            return;
        }
        sugestoesDiv.innerHTML = resultados.map(crc => {
            const idx = window.listaCRCsConsolidada.findIndex(c => c === crc);
            return `<div data-idx="${idx}" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s;">
                        <span style="font-weight:bold;">${crc.nome} (${crc.uf})</span><br>
                        <small>${crc.cidade}</small>
                    </div>`;
        }).join('');
        sugestoesDiv.style.display = 'block';
        sugestoesDiv.querySelectorAll('div').forEach(div => {
            div.addEventListener('click', () => {
                const idx = parseInt(div.dataset.idx);
                if (crcsSelecionadosIds.length === 0 || crcsSelecionadosIds[0] !== idx) {
                    crcsSelecionadosIds = [idx];
                    convenioSelecionado = "";
                    atualizarTags();
                }
                inputBusca.value = '';
                sugestoesDiv.style.display = 'none';
            });
        });
    }

    inputBusca.addEventListener('input', buscarSugestoes);
    document.addEventListener('click', (e) => {
        if (!sugestoesDiv.contains(e.target) && e.target !== inputBusca) {
            sugestoesDiv.style.display = 'none';
        }
    });
    atualizarTags();
}

// --- 6. SALVAR EVENTO (com crcId + convenioSelecionado) ---
async function salvarEvento() {
    try {
        const nome = document.getElementById('nome')?.value;
        const dtInicio = document.getElementById('dtInicio')?.value;
        if (!nome || !dtInicio) return alert("Preencha Nome e Data!");
        if (crcsSelecionadosIds.length === 0) return alert("Selecione um CRC!");
        if (!convenioSelecionado) return alert("Selecione o número do convênio!");

        const editId = sessionStorage.getItem('editando_evento_id');
        let listaAtual = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        const crcId = crcsSelecionadosIds[0];
        const crc = window.listaCRCsConsolidada[crcId];

        let planilhaUrl = null;
        const arquivoPlanilha = document.getElementById('planilhaEvento')?.files[0];
        if (arquivoPlanilha) planilhaUrl = await subirArquivoParaGithub(arquivoPlanilha, `planilha_${Date.now()}`);

        const novoEvento = {
            id: editId ? Number(editId) : Date.now(),
            nome,
            municipio: document.getElementById('municipio')?.value || '',
            uf: document.getElementById('uf')?.value.toUpperCase() || '',
            tipo: document.getElementById('tipo').value === 'outro' ? document.getElementById('tipoManual')?.value : document.getElementById('tipo').value,
            crcId: crcId,
            crcVinculado: crc.nome,
            convenioSelecionado: convenioSelecionado,
            dataInicio: dtInicio, dataEvento: dtInicio, dataFim: document.getElementById('dtFim')?.value || '',
            montagem: document.getElementById('montagem')?.value || '', dataIda: document.getElementById('dataIda')?.value || '',
            dataVolta: document.getElementById('dataVolta')?.value || '', horario: document.getElementById('horario')?.value || '',
            endereco: document.getElementById('endereco')?.value || '', detalhamento: document.getElementById('detalhamento')?.value || '',
            statusLogistica: document.getElementById('statusLogistica')?.value || 'Pendente', indicacao: document.getElementById('indicacaoManual')?.value || "N/A",
            qtdComp: document.getElementById('qtdComp')?.value || null, pids: document.getElementById('pids')?.value || null,
            qtdAlunos: document.getElementById('qtdAlunos')?.value || null, curso: document.getElementById('curso')?.value || null,
            equipe: editId ? (listaAtual.find(e => e.id == editId)?.equipe || []) : [],
            planilhaUrl: planilhaUrl || (editId ? listaAtual.find(e => e.id == editId)?.planilhaUrl : null)
        };

        if (editId) {
            const index = listaAtual.findIndex(ev => ev.id == editId);
            if (index !== -1) listaAtual[index] = novoEvento;
            await atualizarBancoGitHubCompleto(listaAtual);
            localStorage.setItem('mcom_eventos', JSON.stringify(listaAtual));
            alert("✅ Evento atualizado com sucesso!");
            renderView('dashboard');
            sessionStorage.removeItem('editando_evento_id');
        } else {
            listaAtual.push(novoEvento);
            await atualizarBancoGitHubCompleto(listaAtual);
            localStorage.setItem('mcom_eventos', JSON.stringify(listaAtual));
            alert("✅ Evento salvo com sucesso!");
            renderView('dashboard');
        }
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("❌ Erro ao salvar evento. Verifique o console.");
    }
}

function cancelarEdicao() { sessionStorage.removeItem('editando_evento_id'); renderView('dashboard'); }

window.removerPlanilha = async function() {
    const editId = sessionStorage.getItem('editando_evento_id');
    if (!editId) return;
    let listaAtual = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const index = listaAtual.findIndex(ev => ev.id == editId);
    if (index !== -1) {
        delete listaAtual[index].planilhaUrl;
        localStorage.setItem('mcom_eventos', JSON.stringify(listaAtual));
        await atualizarBancoGitHubCompleto(listaAtual);
        renderEventoForm();
    }
};

// Exportar funções globalmente
window.renderEventoForm = renderEventoForm;
window.salvarEvento = salvarEvento;
window.cancelarEdicao = cancelarEdicao;
window.tratarMudancaTipo = tratarMudancaTipo;
window.toggleCamposDinamicos = toggleCamposDinamicos;
