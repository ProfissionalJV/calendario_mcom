// 1. Configuração do Reconhecimento de Voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
}

// Listas para identificar membros (mesmas usadas em equipe.js)
const nomesMCOM = ["ASPAD", "ASCOM", "Gabinete do Ministro", "SEXEC", "ASPAR / Cerimonial"];
const nomesEventuais = [
    "Frederico de Siqueira (Ministro de Estado das Comunicações)",
    "Francis Meneses (Coordenador de Projetos)",
    "Hermano Tercius (Secretário de Telecomunicações)",
    "Ludymilla Chagas (Chefe da Assessoria de Participação Social e Diversidade)",
    "Munique Souza (Assessora Técnica)",
    "Pedro Henrique Silva (Assessor Técnico)",
    "Sônia Faustino (Secretária Executiva)",
    "Thayana Vianna (Assessoria de imprensa)"
];

function renderComandoOz() {
    const app = document.getElementById('app');
    const listaEventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
    <div class="glass-card" style="text-align:center;">
        <div style="font-size: 50px; color: var(--primary); margin-bottom: 10px;">
            <i class="fas fa-robot"></i>
        </div>
        <h2>Comando OZ</h2>
        <p style="opacity:0.7">Fale o nome do evento ou selecione na lista abaixo</p>
        
        <div style="margin: 25px 0;">
            <button onclick="ouvirVoz()" id="btnVoz" style="width:100px; height:100px; border-radius:50%; background:var(--primary); color:#000; font-size:35px; box-shadow: 0 0 30px var(--primary); border:none; cursor:pointer; transition: 0.3s;">
                <i class="fas fa-microphone"></i>
            </button>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display:block; margin-bottom:5px; font-size:12px; opacity:0.6">OU SELECIONE O EVENTO:</label>
            <select id="ozSelect" style="width:100%; padding:12px; border-radius:8px; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--primary);">
                <option value="">-- Buscar Evento Cadastrado --</option>
                ${listaEventos.map(e => `<option value="${e.id}">${e.nome} (${e.uf})</option>`).join('')}
            </select>
        </div>

        <button onclick="execOZ()" style="width:100%; font-weight:bold; height:45px; background:var(--primary); color:#000">
            <i class="fas fa-bolt"></i> GERAR RESUMO PARA WHATSAPP
        </button>
        
        <div id="ozOut" style="margin-top:20px; text-align:left;"></div>
    </div>`;
}

// --- LÓGICA DE VOZ (mantida igual) ---
function ouvirVoz() {
    if (!recognition) {
        alert("Ops! Seu navegador não suporta reconhecimento de voz.");
        return;
    }
    const btn = document.getElementById('btnVoz');
    btn.style.background = "#ff4444"; 
    btn.innerHTML = `<i class="fas fa-dot-circle fa-beat"></i>`;
    try {
        recognition.start();
    } catch (e) {
        recognition.stop();
        setTimeout(() => recognition.start(), 400);
    }
    recognition.onresult = (event) => {
        const fala = event.results[0][0].transcript.toLowerCase().replace('.', '');
        const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        const encontrado = lista.find(e => e.nome.toLowerCase().includes(fala) || e.uf.toLowerCase() === fala);
        if (encontrado) {
            document.getElementById('ozSelect').value = encontrado.id;
            execOZ();
        } else {
            alert("OZ não reconheceu o evento: " + fala);
        }
    };
    recognition.onerror = () => resetBtnVoz();
    recognition.onend = () => resetBtnVoz();
}

function resetBtnVoz() {
    const btn = document.getElementById('btnVoz');
    if (btn) {
        btn.style.background = "var(--primary)";
        btn.innerHTML = `<i class="fas fa-microphone"></i>`;
    }
}

// --- GERAÇÃO DO RESUMO (MODIFICADO) ---
function execOZ() {
    const id = document.getElementById('ozSelect').value;
    if (!id) return alert("Selecione ou fale um evento!");

    const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = lista.find(e => e.id == id);
    const out = document.getElementById('ozOut');

    if (!ev) return;

    // Formata data
    const dataBr = ev.dataInicio ? ev.dataInicio.split('-').reverse().join('/') : 'A definir';

    // Quantidade de doação ou formação
    let quantidadeTexto = "";
    const tipo = ev.tipo || "doacao";
    if (tipo === "doacao") {
        const qtd = ev.qtdComp || (ev.tipo === 'doacao' ? "não informada" : "0");
        quantidadeTexto = `${qtd} computadores`;
    } else if (tipo === "formacao") {
        const qtd = ev.qtdAlunos || "não informada";
        quantidadeTexto = `${qtd} alunos formados`;
    } else {
        quantidadeTexto = "não se aplica";
    }

    // CRC participante (nome e convênio, se disponível)
    let crcTexto = "";
    if (ev.crcVinculado) {
        crcTexto = ev.crcVinculado;
        if (ev.convenioSelecionado) crcTexto += ` (Convênio ${ev.convenioSelecionado})`;
    } else if (ev.crcIds && ev.crcIds.length > 0 && window.listaBaseCRCs) {
        const idx = ev.crcIds[0];
        const crc = window.listaBaseCRCs[idx];
        if (crc) crcTexto = crc.nome;
        if (ev.convenioSelecionado) crcTexto += ` (Convênio ${ev.convenioSelecionado})`;
    } else {
        crcTexto = "Não informado";
    }

    // Equipe (MCOM + CGID)
    const equipeGeral = ev.equipe || [];
    // Participantes do MCOM (apenas os títulos/funções, sem cargos longos)
    const mcomPresentes = nomesMCOM.filter(nome => equipeGeral.includes(nome));
    // Participantes eventuais (opcional – você pode incluir se quiser)
    const eventuaisPresentes = nomesEventuais.filter(n => equipeGeral.includes(n));
    // CGID: apenas o texto "CGID" independentemente de nomes
    const temCGID = equipeGeral.some(nome => nome.includes("Karine") || nome.includes("Gustavo") || nome.includes("Daliane") || nome.includes("Victoria"));
    
    let equipeTexto = "";
    if (mcomPresentes.length) equipeTexto += `MCOM: ${mcomPresentes.join(', ')}; `;
    if (temCGID) equipeTexto += `CGID; `;
    if (eventuaisPresentes.length) equipeTexto += `Equipe Eventual: ${eventuaisPresentes.map(n => n.split('(')[0].trim()).join(', ')}; `;
    if (equipeTexto === "") equipeTexto = "Não informada";

    // Construção do texto final com apenas três emojis (🤖, 📌, 📍)
    const txt = `🤖 *COMANDO OZ: RESUMO OPERACIONAL*
---------------------------------------
📌 *EVENTO:* ${ev.nome.toUpperCase()}
📍 *LOCAL:* ${ev.endereco || 'A definir'}
📅 *DATA:* ${dataBr} às ${ev.horario || 'A definir'}

*AÇÃO:* ${tipo === 'doacao' ? 'Doação' : tipo === 'formacao' ? 'Formação' : tipo.toUpperCase()}
*QUANTIDADE:* ${quantidadeTexto}
*CRC:* ${crcTexto}
*EQUIPE:* ${equipeTexto}
${ev.indicacao && ev.indicacao !== 'N/A' ? `📋 *INDICAÇÃO:* ${ev.indicacao}` : ''}

*OBSERVAÇÕES:*
${ev.detalhamento ? ev.detalhamento.substring(0, 250) + (ev.detalhamento.length > 250 ? '...' : '') : 'Sem informações adicionais.'}
---------------------------------------
_Enviado via MCOM Gestão Integrada_`;

    out.innerHTML = `
        <div class="glass-card" style="background:rgba(0,0,0,0.3); border:1px solid var(--primary); padding:15px;">
            <h4 style="color:var(--primary); margin-bottom:10px;"><i class="fas fa-comment-alt"></i> Preview:</h4>
            <textarea id="textoCopiaOz" style="width:100%; height:200px; background:transparent; color:#eee; border:none; font-family:monospace; font-size:12px; resize:none;">${txt}</textarea>
            <button onclick="copiarTextoOZ()" id="btnCopiar" style="width:100%; background:#25D366; color:white; margin-top:15px; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">
                <i class="fab fa-whatsapp"></i> COPIAR E ENVIAR
            </button>
        </div>`;
}

function copiarTextoOZ() {
    const area = document.getElementById('textoCopiaOz');
    area.select();
    try {
        navigator.clipboard.writeText(area.value);
        const btn = document.getElementById('btnCopiar');
        btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
        btn.style.background = "#128C7E";
        setTimeout(() => renderComandoOz(), 2000);
    } catch (err) {
        alert("Erro ao copiar. Tente selecionar o texto manualmente.");
    }
}

// Garantir que a função seja global
window.renderComandoOz = renderComandoOz;
