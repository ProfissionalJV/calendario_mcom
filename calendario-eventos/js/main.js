// Banco de dados global
let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

function renderView(view) {
    const app = document.getElementById('app');
    window.scrollTo(0, 0);
    
    eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    switch (view) {
        case 'dashboard': renderDashboard(); break;
        case 'novoEvento': renderEventoForm(); break;
        case 'baseDados': renderBaseDados(); break;
        case 'voos': renderViewVoos(); break;
        case 'fipe': renderFipe(); break;
        case 'participantes': renderEquipe(); break;
        case 'crc_lista': renderCrcLista(); break;
        case 'comandoOz': renderComandoOz(); break;
        case 'artes': renderArtes(); break;
        case 'listagemGeral': renderListagemGeral(); break;
        case 'midia': renderMidia(); break;
        case 'relatorios': renderRelatorios(); break;
        case 'logistica': renderLogistica(); break;
        case 'checklist': renderChecklist(); break;
        default: app.innerHTML = `<h1>Em construção (${view})</h1>`;
    }
}

// Inicializa o App
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Iniciando App via Netlify Bridge...");
    try {
        await buscarDoGithub(); 
        renderView('dashboard');
    } catch (e) {
        console.error("Falha ao sincronizar inicialização:", e);
        renderView('dashboard'); 
    }
});

function toggleMenu() {
    const sidebar = document.querySelector('.sidebar'); 
    if(sidebar) sidebar.classList.toggle('active');
}

// Fechar o menu automaticamente no mobile
document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            toggleMenu();
        }
    });
});

// --- FUNÇÕES DE COMUNICAÇÃO (VIA NETLIFY BRIDGE /API/) ---

// 1. BUSCAR DADOS (PULL)
async function buscarDoGithub() {
    try {
        const response = await fetch('/api/download?path=database.json');
        if (!response.ok) throw new Error(`Erro Netlify: ${response.status}`);

        const data = await response.json();
        const decodificado = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
        const conteudo = JSON.parse(decodificado);

        console.log("✅ Sincronizado via Netlify!");
        localStorage.setItem('mcom_eventos', JSON.stringify(conteudo));
        return conteudo;
    } catch (error) {
        console.error("❌ Falha na Sincronia:", error);
        return JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    }
}

// 2. SALVAR NOVO EVENTO (PUSH) - ESTA ERA A QUE ESTAVA FALTANDO!
async function salvarNoGithub(novoEvento) {
    console.log("Iniciando salvamento seguro via API...");
    try {
        const res = await fetch('/api/download?path=database.json');
        const fileData = await res.json();
        
        const binario = atob(fileData.content.replace(/\s/g, ''));
        let conteudo = JSON.parse(decodeURIComponent(escape(binario)));
        
        conteudo.push(novoEvento);

        const jsonString = JSON.stringify(conteudo, null, 2);
        const conteudoBase64 = btoa(unescape(encodeURIComponent(jsonString)));

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                fileName: 'database.json',
                content: conteudoBase64,
                message: `Novo evento: ${novoEvento.municipio || 'registro'}`,
                sha: fileData.sha
            })
        });

        if (response.ok) {
            console.log("✅ Sucesso no GitHub!");
            alert("✅ Evento salvo e sincronizado!");
            localStorage.setItem('mcom_eventos', JSON.stringify(conteudo));
            renderView('dashboard');
        } else {
            throw new Error("Falha no upload");
        }
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao sincronizar dados.");
    }
}

// 3. EXCLUIR EVENTO (CORRIGIDA)
async function excluirNoGithub(idEvento) {
    try {
        // Primeiro, buscamos o SHA e o conteúdo atual
        const res = await fetch('/api/download?path=database.json');
        const fileData = await res.json();
        
        if (!res.ok) throw new Error("Não conseguiu buscar o SHA para excluir");

        const binario = atob(fileData.content.replace(/\s/g, ''));
        let conteudo = JSON.parse(decodeURIComponent(escape(binario)));
        
        // Filtramos para remover o evento
        const novaLista = conteudo.filter(ev => ev.id != idEvento);
        const conteudoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(novaLista, null, 2))));

        // Enviamos a nova lista com o SHA que acabamos de pegar
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                fileName: 'database.json',
                content: conteudoBase64,
                message: `Excluindo evento ID: ${idEvento}`,
                sha: fileData.sha // CRUCIAL: Sem isso o GitHub nega!
            })
        });

        if (response.ok) {
            localStorage.setItem('mcom_eventos', JSON.stringify(novaLista));
            console.log("✅ Excluído com sucesso!");
            return true;
        } else {
            const erroStatus = await response.json();
            console.error("Erro no upload da exclusão:", erroStatus);
            return false;
        }
    } catch (error) {
        console.error("Erro ao excluir no GitHub:", error);
        return false;
    }
}

// 4. SUBIR FOTO
async function subirFotoParaGithub(base64Data, nomeReferencia) {
    const apenasBase64 = base64Data.split(',')[1];
    const nomeArquivo = `foto_${Date.now()}.jpg`;

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                fileName: nomeArquivo,
                content: apenasBase64,
                message: `Upload foto: ${nomeReferencia}`
            })
        });

        const data = await response.json();
        return response.ok ? data.content.download_url : null;
    } catch (error) {
        console.error("Erro no upload da foto:", error);
        return null;
    }
}

// 5. ATUALIZAR BANCO COMPLETO / EDIÇÃO (CORRIGIDA)
async function atualizarBancoGitHubCompleto(listaNova) {
    try {
        // 1. Pega o SHA atual
        const res = await fetch('/api/download?path=database.json');
        const fileData = await res.json();
        
        if (!res.ok) throw new Error("Não conseguiu buscar o SHA para atualizar");

        // 2. Transforma a lista nova em Base64
        const conteudoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(listaNova, null, 2))));

        // 3. Envia a atualização com o SHA
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                fileName: 'database.json',
                content: conteudoBase64,
                message: "Sincronizando atualização de dados",
                sha: fileData.sha // CRUCIAL: Sem isso dá erro de sincronia!
            })
        });

        if (response.ok) {
            console.log("✅ Banco de dados atualizado com sucesso!");
            return true;
        } else {
            const erroStatus = await response.json();
            console.error("Erro no upload da atualização:", erroStatus);
            return false;
        }
    } catch (error) {
        console.error("Erro na função atualizarBancoGitHubCompleto:", error);
        throw error;
    }
}