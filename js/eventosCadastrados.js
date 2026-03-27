// --- FUNÇÃO PRINCIPAL: RENDERIZA A TELA DE LISTAGEM AGRUPADA POR MÊS ---
function renderListagemGeral() {
    const app = document.getElementById('app');
    const eventosRaw = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    // 1. Ordenar eventos por data (Recentes primeiro)
    const eventosOrdenados = eventosRaw.sort((a, b) => new Date(b.dataEvento) - new Date(a.dataEvento));

    // 2. Agrupar por Mês/Ano
    const grupos = {};
    eventosOrdenados.forEach(e => {
        const data = e.dataEvento ? new Date(e.dataEvento + 'T00:00:00') : null;
        const mesAno = data 
            ? data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()
            : "DATA NÃO DEFINIDA";
        
        if (!grupos[mesAno]) grupos[mesAno] = [];
        grupos[mesAno].push(e);
    });

    app.innerHTML = `
    <div class="glass-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
            <div>
                <h2><i class="fas fa-calendar-alt"></i> Cronograma de Eventos</h2>
                <p style="opacity:0.6; font-size:13px">Eventos organizados por ordem cronológica</p>
            </div>
            <div style="display:flex; gap:10px">
                <input type="text" id="buscaEvento" placeholder="Buscar por nome ou UF..." 
                        onkeyup="filtrarTabelaEventos()" 
                        style="padding:8px; border-radius:5px; border:1px solid var(--primary); background:rgba(0,0,0,0.2); color:white; width:250px">
                <button onclick="renderView('novoEvento')" class="btn-novo">
                    <i class="fas fa-plus"></i> NOVO EVENTO
                </button>
            </div>
        </div>
        
        <div id="containerAgrupado">
            ${eventosRaw.length === 0 ? 
                '<p style="text-align:center; padding:40px; opacity:0.5">Nenhum evento encontrado no sistema.</p>' : 
                Object.keys(grupos).map(mes => `
                    <div class="grupo-mes" style="margin-bottom: 30px">
                        <div style="background:rgba(0,255,136,0.1); padding:10px 15px; border-radius:5px; border-left:4px solid var(--primary); margin-bottom:10px">
                            <h3 style="margin:0; color:var(--primary); font-size:14px; letter-spacing:1px"><i class="far fa-calendar-check"></i> ${mes}</h3>
                        </div>
                        <div style="overflow-x:auto">
                            <table class="tabela-gestao" style="width:100%">
                                <thead>
                                    <tr>
                                        <th>Evento / Tipo</th>
                                        <th>UF</th>
                                        <th>Data</th>
                                        <th>CRC Responsável</th>
                                        <th>Prontidão</th>
                                        <th style="text-align:center"><i class="fas fa-images"></i> Mídia</th>
                                        <th style="text-align:center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${grupos[mes].map(e => {
                                        let progresso = 0;
                                        if (e.equipe?.length > 0) progresso += 25;
                                        if (e.detalhamento) progresso += 25;
                                        if (e.checklistNovo?.length > 0) progresso += 25;
                                        if (e.logisticaVoos?.length > 0) progresso += 25;

                                        const temFotos = e.galeria && e.galeria.length > 0;

                                        return `
                                        <tr class="linha-evento">
                                            <td>
                                                <span style="font-weight:bold; color:var(--primary)">${e.nome}</span><br>
                                                <small style="opacity:0.7; text-transform:uppercase">${e.tipo}</small>
                                            </td>
                                            <td>${e.uf}</td>
                                            <td>${e.dataEvento ? e.dataEvento.split('-').reverse().join('/') : '---'}</td>
                                            <td>${e.crcVinculado || '---'}</td>
                                            <td>
                                                <div style="width:100px; height:6px; background:rgba(255,255,255,0.1); border-radius:4px; margin-bottom:4px">
                                                    <div style="width:${progresso}%; height:100%; background:${progresso === 100 ? '#00ff88' : '#00ff9d'}; border-radius:4px"></div>
                                                </div>
                                                <small style="font-size:10px; opacity:0.8">${progresso}% pronto</small>
                                            </td>
                                            
                                            <td style="text-align:center">
                                                ${temFotos ? `
                                                    <button onclick="baixarFotosEvento(${e.id})" class="btn-acao edit" title="Baixar todas as fotos" style="background:rgba(0, 255, 136, 0.15); border:1px solid var(--primary); padding: 5px 10px;">
                                                        <i class="fas fa-file-download"></i> ${e.galeria.length}
                                                    </button>
                                                ` : `<small style="opacity:0.2">---</small>`}
                                            </td>

                                            <td style="text-align:center">
                                                <button onclick="editarEvento(${e.id})" class="btn-acao edit">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onclick="excluirEventoLista(${e.id})" class="btn-acao delete">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>`;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')
            }
        </div>
    </div>`;
}

async function baixarFotosEvento(idEvento) {
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const evento = eventos.find(e => e.id == idEvento);

    if (!evento || !evento.galeria || evento.galeria.length === 0) {
        return alert("Nenhuma foto encontrada.");
    }

    alert(`Iniciando download seguro via Netlify...`);

    for (let i = 0; i < evento.galeria.length; i++) {
        try {
            // Extraímos apenas o caminho 'uploads/nome_da_foto.jpg' da URL salva
            const urlSalva = evento.galeria[i].split('?')[0]; 
            const caminhoArquivo = urlSalva.split('/contents/')[1] || urlSalva.split('/main/')[1];

            // Chamamos a nossa função serverless no Netlify
            const response = await fetch(`/.netlify/functions/download?path=${caminhoArquivo}`);

            if (!response.ok) throw new Error("Falha na ponte de download");

            const data = await response.json();
            
            // O conteúdo vem em Base64 do servidor
            const blob = await (await fetch(`data:image/jpeg;base64,${data.content}`)).blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `MCOM_${evento.nome.replace(/\s+/g, '_')}_${i + 1}.jpg`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);

            await new Promise(r => setTimeout(r, 600));

        } catch (error) {
            console.error("Erro no download seguro:", error);
            alert(`Erro ao baixar foto ${i + 1}.`);
        }
    }
}

// --- FILTRO DE BUSCA ---
function filtrarTabelaEventos() {
    const termo = document.getElementById('buscaEvento').value.toLowerCase();
    const linhas = document.querySelectorAll('.linha-evento');
    const grupos = document.querySelectorAll('.grupo-mes');

    linhas.forEach(linha => {
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    });

    grupos.forEach(grupo => {
        const temLinhaVisivel = Array.from(grupo.querySelectorAll('.linha-evento')).some(l => l.style.display !== 'none');
        grupo.style.display = temLinhaVisivel ? '' : 'none';
    });
}

// --- FUNÇÃO PARA EDITAR EVENTO ---
function editarEvento(id) {
    sessionStorage.setItem('editando_evento_id', id);
    renderView('novoEvento');
}

// --- EXCLUIR EVENTO ---
async function excluirEventoLista(id) {
    if(confirm("Deseja remover este evento permanentemente da nuvem?")) {
        const sucesso = await excluirNoGithub(id);
        if (sucesso) {
            alert("✅ Evento removido do GitHub e do sistema local!");
            renderListagemGeral();
        } else {
            alert("❌ Erro ao excluir no GitHub. Verifique sua conexão ou Token.");
        }
    }
}
