// --- 1. VARIÁVEIS GLOBAIS ---
let crcsSelecionadosIds = [];

// --- 2. CARREGAR LISTA DE CRCs (global) ---
function carregarListaCRCs() {
    if (typeof window.listaBaseCRCs !== 'undefined') {
        // já carregada
    } else if (typeof listaBaseCRCs !== 'undefined') {
        window.listaBaseCRCs = listaBaseCRCs;
    } else {
        setTimeout(() => carregarListaCRCs(), 200);
        return;
    }
    console.log(`📋 ${window.listaBaseCRCs.length} CRCs carregados`);
}

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
                <div><label>PIDs (Separe por vírgula)</label><input type="text" id="pids" placeholder="Ex: 102, 105" value="${e?.pids || ''}"></div>
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

// --- 4. RENDERIZAÇÃO DO FORMULÁRIO (layout em linhas) ---
function renderEventoForm() {
    if (!window.listaBaseCRCs || window.listaBaseCRCs.length === 0) {
        carregarListaCRCs();
        if (!window.listaBaseCRCs || window.listaBaseCRCs.length === 0) {
            const app = document.getElementById('app');
            app.innerHTML = '<div class="glass-card"><h3>Carregando dados dos CRCs...</h3><p>Aguarde um instante e tente novamente.</p></div>';
            setTimeout(() => renderEventoForm(), 500);
            return;
        }
    }

    const app = document.getElementById('app');
    const editId = sessionStorage.getItem('editando_evento_id');
    let ev = null;
    if (editId) {
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        ev = lista.find(e => e.id == editId);
    }
    crcsSelecionadosIds = (ev && ev.crcIds) ? [...ev.crcIds] : [];

    app.innerHTML = `
    <div class="glass-card" style="padding: 25px;">
        <h2 style="margin-bottom: 20px;"><i class="fas ${ev ? 'fa-edit' : 'fa-calendar-plus'}"></i> ${ev ? 'Editar Evento' : 'Novo Evento'}</h2>
        
        <!-- LINHA 1: Busca CRC, Nome, Município, UF -->
        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
                <label><i class="fas fa-landmark"></i> CRC</label>
                <div style="position: relative;">
                    <input type="text" id="buscaCrcInput" placeholder="Digite nome, UF ou cidade..." autocomplete="off"
                           style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--primary); background: rgba(0,0,0,0.3); color: white; transition: 0.2s;">
                    <div id="sugestoesCrc" style="position: absolute; top: 100%; left: 0; right: 0; background: #1e1e2f; border: 1px solid var(--primary); border-radius: 8px; max-height: 200px; overflow-y: auto; z-index: 1000; display: none; margin-top: 4px;"></div>
                </div>
            </div>
            <div>
                <label><i class="fas fa-tag"></i> Nome do Evento</label>
                <input type="text" id="nome" value="${ev ? ev.nome : ''}" style="width: 100%;">
            </div>
            <div>
                <label><i class="fas fa-city"></i> Município</label>
                <input type="text" id="municipio" value="${ev ? (ev.municipio || '') : ''}" style="width: 100%;">
            </div>
            <div>
                <label><i class="fas fa-map-marker-alt"></i> UF</label>
                <input type="text" id="uf" maxlength="2" style="text-transform: uppercase; width: 100%;" value="${ev ? ev.uf : ''}">
            </div>
        </div>

        <!-- LINHA 2: Outros CRCs -->
        <div style="margin-bottom: 20px;">
            <label><i class="fas fa-plus-circle"></i> Outros CRCs</label>
            <input type="text" id="outrosCrcs" placeholder="Digite outros CRCs separados por vírgula" style="width: 100%;" value="${ev && ev.outrosCrcs ? ev.outrosCrcs.join(', ') : ''}">
        </div>

        <!-- LINHA 3: CRCs selecionados (tags) -->
        <div style="margin-bottom: 20px;">
            <label><i class="fas fa-check-circle"></i> CRCs Selecionados</label>
            <div id="crcTagsContainer" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; min-height: 45px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.2);">
                <!-- tags serão inseridas via JS -->
            </div>
        </div>

        <!-- LINHA 4: Status/Obs (select) -->
        <div style="margin-bottom: 20px;">
            <label><i class="fas fa-chart-line"></i> Status / Observação</label>
            <select id="statusLogistica" style="width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--primary); color: white;">
                <option value="Confirmado" ${ev?.statusLogistica === 'Confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                <option value="Pendências" ${ev?.statusLogistica === 'Pendências' ? 'selected' : ''}>⏳ Pendente</option>
            </select>
        </div>

        <!-- DEMAIS CAMPOS (período, agenda, tipo, detalhamento, planilha, etc.) mantidos igual -->
        <div class="form-grid" style="margin-top:20px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
            <div style="grid-column: span 4"><h4><i class="fas fa-calendar-alt"></i> Período e Agenda</h4></div>
            <div><label>Data Início</label><input type="date" id="dtInicio" value="${ev ? (ev.dataInicio || ev.dataEvento) : ''}"></div>
            <div><label>Data Fim</label><input type="date" id="dtFim" value="${ev ? ev.dataFim : ''}"></div>
            <div><label>Montagem</label>
                <select id="montagem">
                    <option value="Não Requer" ${ev?.montagem === 'Não Requer' ? 'selected' : ''}>Não Requer</option>
                    <option value="1 dia antes" ${ev?.montagem === '1 dia antes' ? 'selected' : ''}>1 dia antes</option>
                    <option value="2 dias antes" ${ev?.montagem === '2 dias antes' ? 'selected' : ''}>2 dias antes</option>
                </select>
            </div>
            <div><label>Horário</label><input type="text" id="horario" value="${ev ? ev.horario : ''}"></div>
            <div><label>Data Ida</label><input type="date" id="dataIda" value="${ev ? (ev.dataIda || '') : ''}"></div>
            <div><label>Data Volta</label><input type="date" id="dataVolta" value="${ev ? (ev.dataVolta || '') : ''}"></div>
            <div style="grid-column: span 2"><label>Endereço</label><input type="text" id="endereco" value="${ev ? ev.endereco : ''}"></div>
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
    initCrcBuscaELayout();
}

// --- 5. LÓGICA DE BUSCA E TAGS (com visual bonito) ---
function initCrcBuscaELayout() {
    const inputBusca = document.getElementById('buscaCrcInput');
    const sugestoesDiv = document.getElementById('sugestoesCrc');
    const tagsContainer = document.getElementById('crcTagsContainer');

    function atualizarTags() {
        tagsContainer.innerHTML = '';
        if (crcsSelecionadosIds.length === 0) {
            tagsContainer.innerHTML = '<span style="opacity:0.5; font-size:13px;">Nenhum CRC selecionado</span>';
            return;
        }
        for (let idx of crcsSelecionadosIds) {
            const crc = window.listaBaseCRCs[idx];
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
            tag.style.backdropFilter = 'blur(4px)';
            tag.innerHTML = `${crc.nome} (${crc.cidade}/${crc.uf}) <span style="color:#2ecc71; cursor:pointer; font-weight:bold; font-size:16px; margin-left:4px;">&times;</span>`;
            tag.querySelector('span').addEventListener('click', (e) => {
                e.stopPropagation();
                crcsSelecionadosIds = crcsSelecionadosIds.filter(i => i !== idx);
                atualizarTags();
            });
            tagsContainer.appendChild(tag);
        }
    }

    function buscarSugestoes() {
        const termo = inputBusca.value.toLowerCase().trim();
        if (termo.length < 2) {
            sugestoesDiv.style.display = 'none';
            return;
        }
        const resultados = window.listaBaseCRCs.filter((crc) => {
            return crc.nome.toLowerCase().includes(termo) ||
                   crc.uf.toLowerCase().includes(termo) ||
                   crc.cidade.toLowerCase().includes(termo);
        }).slice(0, 10);
        if (resultados.length === 0) {
            sugestoesDiv.style.display = 'none';
            return;
        }
        sugestoesDiv.innerHTML = resultados.map(crc => {
            const idx = window.listaBaseCRCs.findIndex(c => c === crc);
            return `<div data-idx="${idx}" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.2s;" 
                            onmouseover="this.style.background='rgba(46,204,113,0.2)'" 
                            onmouseout="this.style.background='transparent'">
                        <span style="font-weight:bold;">${crc.nome}</span><br>
                        <small>${crc.cidade}/${crc.uf}</small>
                    </div>`;
        }).join('');
        sugestoesDiv.style.display = 'block';
        sugestoesDiv.querySelectorAll('div').forEach(div => {
            div.addEventListener('click', () => {
                const idx = parseInt(div.dataset.idx);
                if (!crcsSelecionadosIds.includes(idx)) {
                    crcsSelecionadosIds.push(idx);
                }
                atualizarTags();
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

// --- 6. SALVAR EVENTO (funcional) ---
async function salvarEvento() {
    try {
        const nome = document.getElementById('nome')?.value;
        const dtInicio = document.getElementById('dtInicio')?.value;
        if (!nome || !dtInicio) return alert("Preencha Nome e Data!");
        const editId = sessionStorage.getItem('editando_evento_id');
        let listaAtual = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        const crcIds = [...crcsSelecionadosIds];
        const crcNomes = crcIds.map(idx => window.listaBaseCRCs[idx]?.nome || 'CRC Desconhecido');
        const outrosCrcs = document.getElementById('outrosCrcs')?.value.split(',').map(s=>s.trim()).filter(s=>s) || [];
        const todosCrcs = [...crcNomes, ...outrosCrcs];
        let planilhaUrl = null;
        const arquivoPlanilha = document.getElementById('planilhaEvento')?.files[0];
        if (arquivoPlanilha) planilhaUrl = await subirArquivoParaGithub(arquivoPlanilha, `planilha_${Date.now()}`);
        
        const novoEvento = {
            id: editId ? Number(editId) : Date.now(),
            nome, municipio: document.getElementById('municipio')?.value || '', uf: document.getElementById('uf')?.value.toUpperCase() || '',
            tipo: document.getElementById('tipo').value === 'outro' ? document.getElementById('tipoManual')?.value : document.getElementById('tipo').value,
            crcIds, crcsVinculados: todosCrcs, outrosCrcs,
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

carregarListaCRCs();
