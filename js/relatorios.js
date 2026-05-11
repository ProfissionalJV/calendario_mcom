// --- FUNÇÃO ATUALIZADA PARA SUPORTAR CRC COM CONVÊNIO SELECIONADO ---
function obterDadosCRC(evento) {
    // 1. Se o evento tem o novo formato (crcId + convenioSelecionado)
    if (evento.crcId !== undefined && evento.crcId !== null && window.listaBaseCRCs && window.listaBaseCRCs[evento.crcId]) {
        const crc = window.listaBaseCRCs[evento.crcId];
        // Adiciona o número do convênio selecionado (se existir)
        const convenioTexto = evento.convenioSelecionado || (crc.convenioTexto ? crc.convenioTexto : 'não informado');
        return {
            multiplos: false,
            lista: [crc],
            nomes: [crc.nome],
            ufs: [crc.uf],
            investimentoTotal: crc.investimento,
            metaDoacaoTotal: parseInt(crc.metaDoacao) || 0,
            metaFormacaoTotal: parseInt(crc.metaFormacao) || 0,
            primeiro: { ...crc, convenio: convenioTexto },
            convenioSelecionado: convenioTexto
        };
    }
    // 2. Fallback para eventos antigos
    return {
        multiplos: false,
        lista: [],
        nomes: [evento.crcVinculado || "CRC não identificado"],
        ufs: [evento.uf],
        investimentoTotal: "Consulte o MCom",
        metaDoacaoTotal: 0,
        metaFormacaoTotal: 0,
        primeiro: { 
            nome: evento.crcVinculado || "CRC não identificado", 
            investimento: "Consulte o MCom", 
            cidade: evento.municipio || "Brasil",
            metaDoacao: "0",
            metaFormacao: "0",
            convenio: evento.convenioSelecionado || "não informado"
        },
        convenioSelecionado: evento.convenioSelecionado || "não informado"
    };
}

// --- LISTAS FIXAS PARA PARTICIPANTES (mesmas do equipe.js) ---
const equipeCGID = [
    "Daliane Madureira Serra (Chefe de Divisão de Acompanhamento Técnico de Projetos)",
    "Gustavo Andre Fernandes Lima (Coordenador-Geral de Inclusão Digital)",
    "Karine Do Nascimento Fonseca (Assistente)",
    "Victoria de Paula Nunes (Assistente)"
];

const equipeMCOM = [
    "ASPAD",
    "ASCOM",
    "Gabinete do Ministro",
    "SEXEC",
    "ASPAR / Cerimonial"
];

// Lista de nomes da equipe eventual (para identificar)
const equipeEventualNomes = [
    "Frederico de Siqueira (Ministro de Estado das Comunicações)",
    "Francis Meneses (Coordenador de Projetos)",
    "Hermano Tercius (Secretário de Telecomunicações)",
    "Ludymilla Chagas (Chefe da Assessoria de Participação Social e Diversidade)",
    "Munique Souza (Assessora Técnica)",
    "Pedro Henrique Silva (Assessor Técnico)",
    "Sônia Faustino (Secretária Executiva)",
    "Thayana Vianna (Assessoria de imprensa)"
];

// --- FUNÇÃO PARA FORMATAR DATA (YYYY-MM-DD -> DD/MM/YYYY) ---
function formatarDataBr(dataStr) {
    if (!dataStr) return "A definir";
    const partes = dataStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return dataStr;
}

// --- FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO DA TELA ---
function renderRelatorios() {
    const app = document.getElementById('app');
    const listaEventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const verdeMcom = "#2ecc71"; 

    app.innerHTML = `
    <div class="glass-card">
        <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px">
            <div style="background:${verdeMcom}; color:black; width:45px; height:45px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div>
                <h2 style="margin:0">Gerador de Relatório MCom</h2>
                <p style="margin:0; opacity:0.6; font-size:14px">Layout Premium</p>
            </div>
        </div>

        <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:10px; border:1px solid ${verdeMcom}">
            <label style="display:block; margin-bottom:10px; color:${verdeMcom}; font-weight:bold; font-size:12px">SELECIONE O EVENTO:</label>
            <select id="relatorioEvento" style="width:100%; padding:15px; background:rgba(0,0,0,0.4); color:white; border:1px solid ${verdeMcom}; border-radius:8px; font-size:16px">
                <option value="">-- Escolha um evento --</option>
                ${listaEventos.map(e => `<option value="${e.id}">${e.nome} (${e.uf})</option>`).join('')}
            </select>
        </div>

        <div id="previewArea" style="margin-top:20px; display:none">
            <div style="margin-top:20px">
                <h4 style="color:${verdeMcom}; margin-bottom:10px"><i class="fas fa-pen-nib"></i> Detalhes Adicionais (descritivos)</h4>
                <textarea id="notasRelatorio" placeholder="Ex: Informações sobre autoridades locais ou contexto do evento..." rows="5" style="width:100%; background:rgba(0,0,0,0.2); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:15px; font-family:inherit"></textarea>
            </div>
        </div>

        <button onclick="gerarPdfRelatorio()" style="width:100%; margin-top:25px; height:60px; background:${verdeMcom}; color:black; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; gap:10px; transition: 0.3s">
            <i class="fas fa-check-circle"></i> GERAR RELATÓRIO AGORA
        </button>
    </div>`;

    document.getElementById('relatorioEvento').addEventListener('change', function() {
        document.getElementById('previewArea').style.display = this.value ? 'block' : 'none';
    });
}

// --- FUNÇÃO PARA GERAR O PDF (com todas as melhorias) ---
function gerarPdfRelatorio() {
    const id = document.getElementById('relatorioEvento').value;
    if(!id) return alert("Por favor, selecione um evento!");

    const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = lista.find(e => e.id == id);
    if (!ev) { alert("Erro: Evento não encontrado!"); return; }

    const notas = document.getElementById('notasRelatorio').value || "";
    const crcData = obterDadosCRC(ev);
    const cidadeFinal = ev.municipio || ev.cidade || (crcData.primeiro?.cidade || "Brasil");

    const { jsPDF } = window.jspdf;
    const doc = jsPDF();

    const verdeVivo = [46, 204, 113];
    const pretoTexto = [0, 0, 0];

    // --- CABEÇALHO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.text("Relatório MCom", 105, 30, { align: "center" });

    doc.setFillColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]); 
    doc.rect(30, 42, 150, 10, 'F');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`${ev.nome} – ${ev.uf}`.toUpperCase(), 105, 48.5, { align: "center" });

    let y = 70;

    function addTituloSecao(txt) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]);
        doc.text(txt, 30, y);
        y += 8;
        doc.setFont("helvetica", "normal");
    }

    // --- AGENDA ---
    addTituloSecao("AGENDA");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFontSize(10);
    
    const dataEventoFormatada = formatarDataBr(ev.dataEvento || ev.dataInicio);
    const agendaItems = [
        ["Data:", dataEventoFormatada],
        ["Horário:", ev.horario || "A definir"],
        ["Local:", `${cidadeFinal}/${ev.uf}`],
        ["Endereço:", ev.endereco || "A confirmar"]
    ];
    agendaItems.forEach(it => {
        doc.setFont("helvetica", "bold");
        doc.text(`• ${it[0]}`, 40, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${it[1]}`, 65, y);
        y += 6;
    });

    // --- PARTICIPANTES (dividido em grupos) ---
    y += 10;
    addTituloSecao("PARTICIPANTES");

    // Separar os participantes por categoria
    const todosEquipe = ev.equipe || [];
    const equipeEventualSalva = ev.equipeEventual || [];
    
    // Filtrar membros da CGID
    const cgidPresentes = equipeCGID.filter(nome => todosEquipe.includes(nome));
    // Filtrar membros do MCOM (string exata)
    const mcomPresentes = equipeMCOM.filter(nome => todosEquipe.includes(nome));
    // Filtrar eventuais salvos (que podem estar em equipeEventual ou misturados nos "outros")
    const eventuaisPresentes = equipeEventualSalva.length > 0 ? equipeEventualSalva : equipeEventualNomes.filter(n => todosEquipe.includes(n));
    // Outros participantes (não listados nas listas fixas e nem eventuais)
    const outros = todosEquipe.filter(n => 
        !equipeCGID.includes(n) && !equipeMCOM.includes(n) && !equipeEventualNomes.includes(n)
    );

    doc.setFont("helvetica", "normal");
    if (cgidPresentes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("CGID:", 40, y); y += 5;
        doc.setFont("helvetica", "normal");
        cgidPresentes.forEach(nome => {
            doc.text(`• ${nome}`, 45, y); y += 5;
        });
        y += 3;
    }
    if (mcomPresentes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("MCOM / Gabinete:", 40, y); y += 5;
        doc.setFont("helvetica", "normal");
        mcomPresentes.forEach(nome => {
            doc.text(`• ${nome}`, 45, y); y += 5;
        });
        y += 3;
    }
    if (eventuaisPresentes.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Equipe Eventual:", 40, y); y += 5;
        doc.setFont("helvetica", "normal");
        eventuaisPresentes.forEach(nome => {
            doc.text(`• ${nome}`, 45, y); y += 5;
        });
        y += 3;
    }
    if (outros.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Outros Participantes:", 40, y); y += 5;
        doc.setFont("helvetica", "normal");
        outros.forEach(nome => {
            doc.text(`• ${nome}`, 45, y); y += 5;
        });
        y += 3;
    }
    if (cgidPresentes.length === 0 && mcomPresentes.length === 0 && eventuaisPresentes.length === 0 && outros.length === 0) {
        doc.text("• Comitiva em fase de definição", 40, y); y += 8;
    }

    // --- INFORMAÇÕES PRINCIPAIS (com nome completo do programa) ---
    y += 8;
    addTituloSecao("INFORMAÇÕES PRINCIPAIS");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFont("helvetica", "normal");
    
    let fraseDinamica = "";
    const tipo = ev.tipo || "doacao";
    const qtdComputadores = ev.qtdComp || (ev.tipo === 'doacao' ? crcData.metaDoacaoTotal : 0);
    const qtdFormacao = ev.qtdAlunos || crcData.metaFormacaoTotal;

    if (tipo === "caravana" || tipo === "governo" || tipo === "carreta") {
        const nomes = { 'caravana': 'Caravana Federativa', 'governo': 'Governo na Rua', 'carreta': 'Carreta Digital' };
        fraseDinamica = `A ${nomes[tipo]} ocorrerá no estado de ${ev.uf} (${cidadeFinal}) no âmbito da doação de ${qtdComputadores} computadores e formação de ${qtdFormacao} alunos.`;
    } 
    else if (tipo === "inauguracao") {
        fraseDinamica = `Será realizada a inauguração do CRC ${crcData.primeiro.nome}, localizado em ${cidadeFinal}/${ev.uf}, fortalecendo a rede de inclusão digital do Programa Computadores para Inclusão.`;
    }
    else if (tipo === "formacao") {
        fraseDinamica = `Será realizada a cerimônia de entrega de certificados para a formação de ${qtdFormacao} alunos através do Programa Computadores para Inclusão em ${cidadeFinal}/${ev.uf}.`;
    }
    else {
        fraseDinamica = `Será realizada a doação de ${qtdComputadores} computadores recondicionados através do Programa Computadores para Inclusão em ${cidadeFinal}/${ev.uf}.`;
    }

    if (ev.detalhamento && ev.detalhamento.trim() !== "") {
        fraseDinamica += ` ${ev.detalhamento}`;
    }
    
    const splitInfo = doc.splitTextToSize(`• ${fraseDinamica}`, 140);
    doc.text(splitInfo, 40, y);
    y += (splitInfo.length * 6) + 10;

    // --- DETALHES ADICIONAIS (Indicação, FIPE, Artes, Mídias, Planilha) ---
    addTituloSecao("DETALHES ADICIONAIS");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFont("helvetica", "normal");
    let detalhesY = y;
    if (ev.indicacao && ev.indicacao !== "N/A") {
        doc.text(`• Indicação: ${ev.indicacao}`, 40, detalhesY); detalhesY += 6;
    }
    if (ev.fipe && ev.fipe.length) {
        doc.text(`• Estrutura FIPE: ${ev.fipe.join(', ')}`, 40, detalhesY); detalhesY += 6;
    }
    if (ev.artes && ev.artes.itens && ev.artes.itens.length) {
        doc.text(`• Pack de Artes: ${ev.artes.itens.join(', ')}`, 40, detalhesY); detalhesY += 6;
    }
    const qtdMidias = (ev.galeria && ev.galeria.length) ? ev.galeria.length : 0;
    doc.text(`• Mídias capturadas: ${qtdMidias} foto(s)/vídeo(s)`, 40, detalhesY); detalhesY += 6;
    if (tipo === "doacao" && ev.planilhaUrl) {
        doc.text(`• Planilha de doação: anexada`, 40, detalhesY); detalhesY += 6;
    }
    if (detalhesY === y) {
        doc.text("• Nenhum detalhe adicional cadastrado", 40, y); detalhesY += 6;
    }
    y = detalhesY + 4;

    // --- CHECKLIST DO EVENTO ---
    addTituloSecao("CHECKLIST DO EVENTO");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFont("helvetica", "normal");
    const checklistItens = ev.checklistNovo || [];
    if (checklistItens.length) {
        checklistItens.forEach(item => {
            doc.text(`• ${item}`, 40, y); y += 5;
        });
    } else {
        doc.text("• Nenhum item registrado no checklist", 40, y); y += 6;
    }
    y += 6;

    // --- HISTÓRICO DO PARCEIRO (com convênio) ---
    addTituloSecao("HISTÓRICO DO PARCEIRO (CRC)");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    const crcUnico = crcData.primeiro;
    const convenioTexto = crcData.convenioSelecionado || "não informado";
    const textoHistorico = `O Centro de Recondicionamento de Computadores ${crcUnico.nome} integra o Programa Computadores para Inclusão (Convênio SICONV: ${convenioTexto}). Com investimento total de ${crcUnico.investimento}, as metas incluem a doação de ${crcUnico.metaDoacao} computadores e ${crcUnico.metaFormacao} certificados de formação.`;
    doc.setFont("helvetica", "normal");
    const splitHist = doc.splitTextToSize(`• ${textoHistorico}`, 140);
    doc.text(splitHist, 40, y);
    y += (splitHist.length * 6) + 5;

    // --- NOTAS ADICIONAIS (se houver) ---
    if (notas) {
        addTituloSecao("OBSERVAÇÕES FINAIS");
        doc.setFont("helvetica", "normal");
        const splitNotas = doc.splitTextToSize(`• ${notas}`, 140);
        doc.text(splitNotas, 40, y);
        y += (splitNotas.length * 6) + 5;
    }

    // --- RODAPÉ ---
    doc.setDrawColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("gov.br/mcom", 25, 287);
    doc.text("MINISTÉRIO DAS COMUNICAÇÕES", 145, 287);

    doc.save(`Relatório_${ev.uf}_${cidadeFinal.replace(/ /g, '_')}.pdf`);
}
