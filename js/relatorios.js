// --- FUNÇÃO PARA OBTER DADOS DO CRC/CONVÊNIO CORRETO ---
function obterDadosCRC(evento) {
    // Tenta obter o convênio a partir do rawCRCs (lista original)
    if (evento.convenioSelecionado && window.rawCRCs) {
        const convenioEncontrado = window.rawCRCs.find(c => c.convenio === evento.convenioSelecionado);
        if (convenioEncontrado) {
            return {
                nome: convenioEncontrado.nome,
                uf: convenioEncontrado.uf,
                cidade: convenioEncontrado.cidade,
                investimento: convenioEncontrado.investimento,
                metaDoacao: convenioEncontrado.metaDoacao,
                metaFormacao: convenioEncontrado.metaFormacao,
                convenio: convenioEncontrado.convenio
            };
        }
    }
    // Fallback: tenta pelo crcId (se existir listaBaseCRCs)
    if (evento.crcId !== undefined && evento.crcId !== null && window.listaBaseCRCs && window.listaBaseCRCs[evento.crcId]) {
        const crc = window.listaBaseCRCs[evento.crcId];
        return {
            nome: crc.nome,
            uf: crc.uf,
            cidade: crc.cidade,
            investimento: crc.investimento,
            metaDoacao: crc.metaDoacao,
            metaFormacao: crc.metaFormacao,
            convenio: evento.convenioSelecionado || "não informado"
        };
    }
    // Fallback final
    return {
        nome: evento.crcVinculado || "CRC não identificado",
        uf: evento.uf,
        cidade: evento.municipio || "Brasil",
        investimento: "Consulte o MCom",
        metaDoacao: "0",
        metaFormacao: "0",
        convenio: evento.convenioSelecionado || "não informado"
    };
}

// --- LISTAS FIXAS PARA PARTICIPANTES ---
const equipeCGID = [
    "Daliane Madureira Serra (Chefe de Divisão de Acompanhamento Técnico de Projetos)",
    "Gustavo Andre Fernandes Lima (Coordenador-Geral de Inclusão Digital)",
    "Karine Do Nascimento Fonseca (Assistente)",
    "Victoria de Paula Nunes (Assistente)"
];

const equipeMCOM = ["ASPAD", "ASCOM", "Gabinete do Ministro", "SEXEC", "ASPAR / Cerimonial"];

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

// --- FUNÇÃO PARA FORMATAR DATA ---
function formatarDataBr(dataStr) {
    if (!dataStr) return "A definir";
    const partes = dataStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return dataStr;
}

// --- RENDERIZAÇÃO DA TELA (mantida igual) ---
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

// --- FUNÇÃO PARA GERAR PDF COM QUEBRA DE PÁGINA AUTOMÁTICA ---
function gerarPdfRelatorio() {
    const id = document.getElementById('relatorioEvento').value;
    if (!id) return alert("Por favor, selecione um evento!");

    const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = lista.find(e => e.id == id);
    if (!ev) { alert("Erro: Evento não encontrado!"); return; }

    const notas = document.getElementById('notasRelatorio').value || "";
    const crc = obterDadosCRC(ev);
    const cidadeFinal = ev.municipio || crc.cidade || "Brasil";

    const { jsPDF } = window.jspdf;
    const doc = jsPDF();
    const verdeVivo = [46, 204, 113];
    const pretoTexto = [0, 0, 0];

    let y = 70; // posição Y atual
    const limitePagina = 270; // altura máxima antes de quebrar página

    function verificarQuebraPagina(alturaNecessaria = 0) {
        if (y + alturaNecessaria > limitePagina) {
            doc.addPage();
            y = 30; // reset após quebra de página (margem superior)
            return true;
        }
        return false;
    }

    function addTituloSecao(txt) {
        verificarQuebraPagina(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]);
        doc.text(txt, 30, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    }

    function addTextoLinha(texto, indent = 40) {
        const linhas = doc.splitTextToSize(texto, 140);
        verificarQuebraPagina(linhas.length * 6);
        doc.text(linhas, indent, y);
        y += linhas.length * 6;
    }

    // --- CABEÇALHO (primeira página) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.text("Relatório MCom", 105, 30, { align: "center" });
    doc.setFillColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]); 
    doc.rect(30, 42, 150, 10, 'F');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`${ev.nome} – ${ev.uf}`.toUpperCase(), 105, 48.5, { align: "center" });

    // --- AGENDA ---
    addTituloSecao("AGENDA");
    const dataEventoFormatada = formatarDataBr(ev.dataEvento || ev.dataInicio);
    addTextoLinha(`• Data: ${dataEventoFormatada}`);
    addTextoLinha(`• Horário: ${ev.horario || "A definir"}`);
    addTextoLinha(`• Local: ${cidadeFinal}/${ev.uf}`);
    addTextoLinha(`• Endereço: ${ev.endereco || "A confirmar"}`);
    y += 4;

    // --- PARTICIPANTES ---
    addTituloSecao("PARTICIPANTES");
    const todosEquipe = ev.equipe || [];
    const equipeEventualSalva = ev.equipeEventual || [];
    const cgidPresentes = equipeCGID.filter(nome => todosEquipe.includes(nome));
    const mcomPresentes = equipeMCOM.filter(nome => todosEquipe.includes(nome));
    const eventuaisPresentes = equipeEventualSalva.length > 0 ? equipeEventualSalva : equipeEventualNomes.filter(n => todosEquipe.includes(n));
    const outros = todosEquipe.filter(n => !equipeCGID.includes(n) && !equipeMCOM.includes(n) && !equipeEventualNomes.includes(n));

    if (cgidPresentes.length) {
        addTextoLinha(`CGID:`, 45);
        cgidPresentes.forEach(nome => addTextoLinha(`• ${nome}`, 50));
        y += 2;
    }
    if (mcomPresentes.length) {
        addTextoLinha(`MCOM / Gabinete:`, 45);
        mcomPresentes.forEach(nome => addTextoLinha(`• ${nome}`, 50));
        y += 2;
    }
    if (eventuaisPresentes.length) {
        addTextoLinha(`Equipe Eventual:`, 45);
        eventuaisPresentes.forEach(nome => addTextoLinha(`• ${nome}`, 50));
        y += 2;
    }
    if (outros.length) {
        addTextoLinha(`Outros Participantes:`, 45);
        outros.forEach(nome => addTextoLinha(`• ${nome}`, 50));
        y += 2;
    }
    if (cgidPresentes.length === 0 && mcomPresentes.length === 0 && eventuaisPresentes.length === 0 && outros.length === 0) {
        addTextoLinha(`• Comitiva em fase de definição`, 40);
    }
    y += 6;

    // --- INFORMAÇÕES PRINCIPAIS ---
    addTituloSecao("INFORMAÇÕES PRINCIPAIS");
    const tipo = ev.tipo || "doacao";
    const qtdComputadores = ev.qtdComp || (tipo === 'doacao' ? crc.metaDoacao : 0);
    const qtdFormacao = ev.qtdAlunos || crc.metaFormacao;
    let fraseDinamica = "";

    if (tipo === "caravana" || tipo === "governo" || tipo === "carreta") {
        const nomes = { 'caravana': 'Caravana Federativa', 'governo': 'Governo na Rua', 'carreta': 'Carreta Digital' };
        fraseDinamica = `A ${nomes[tipo]} ocorrerá no estado de ${ev.uf} (${cidadeFinal}) no âmbito da doação de ${qtdComputadores} computadores e formação de ${qtdFormacao} alunos.`;
    } else if (tipo === "inauguracao") {
        fraseDinamica = `Será realizada a inauguração do CRC ${crc.nome}, localizado em ${cidadeFinal}/${ev.uf}, fortalecendo a rede de inclusão digital do Programa Computadores para Inclusão.`;
    } else if (tipo === "formacao") {
        fraseDinamica = `Será realizada a cerimônia de entrega de certificados para a formação de ${qtdFormacao} alunos através do Programa Computadores para Inclusão em ${cidadeFinal}/${ev.uf}.`;
    } else {
        fraseDinamica = `Será realizada a doação de ${qtdComputadores} computadores recondicionados através do Programa Computadores para Inclusão em ${cidadeFinal}/${ev.uf}.`;
    }
    if (ev.detalhamento && ev.detalhamento.trim() !== "") fraseDinamica += ` ${ev.detalhamento}`;
    addTextoLinha(`• ${fraseDinamica}`);
    y += 8;

    // --- DETALHES ADICIONAIS ---
    addTituloSecao("DETALHES ADICIONAIS");
    let temDetalhes = false;
    if (ev.indicacao && ev.indicacao !== "N/A") { addTextoLinha(`• Indicação: ${ev.indicacao}`); temDetalhes = true; }
    if (ev.fipe && ev.fipe.length) { addTextoLinha(`• Estrutura FIPE: ${ev.fipe.join(', ')}`); temDetalhes = true; }
    if (ev.artes && ev.artes.itens && ev.artes.itens.length) { addTextoLinha(`• Pack de Artes: ${ev.artes.itens.join(', ')}`); temDetalhes = true; }
    const qtdMidias = (ev.galeria && ev.galeria.length) ? ev.galeria.length : 0;
    addTextoLinha(`• Mídias capturadas: ${qtdMidias} foto(s)/vídeo(s)`); temDetalhes = true;
    if (tipo === "doacao" && ev.planilhaUrl) { addTextoLinha(`• Planilha de doação: anexada`); temDetalhes = true; }
    if (!temDetalhes) addTextoLinha(`• Nenhum detalhe adicional cadastrado`);
    y += 6;

    // --- CHECKLIST DO EVENTO ---
    addTituloSecao("CHECKLIST DO EVENTO");
    const checklistItens = ev.checklistNovo || [];
    if (checklistItens.length) checklistItens.forEach(item => addTextoLinha(`• ${item}`));
    else addTextoLinha(`• Nenhum item registrado no checklist`);
    y += 6;

    // --- HISTÓRICO DO PARCEIRO ---
    addTituloSecao("HISTÓRICO DO PARCEIRO (CRC)");
    const textoHistorico = `O Centro de Recondicionamento de Computadores ${crc.nome} integra o Programa Computadores para Inclusão (Convênio SICONV: ${crc.convenio}). Com investimento total de ${crc.investimento}, as metas incluem a doação de ${crc.metaDoacao} computadores e ${crc.metaFormacao} certificados de formação.`;
    addTextoLinha(`• ${textoHistorico}`);
    y += 8;

    // --- NOTAS ADICIONAIS ---
    if (notas) {
        addTituloSecao("OBSERVAÇÕES FINAIS");
        addTextoLinha(`• ${notas}`);
        y += 6;
    }

    // --- RODAPÉ (apenas na última página) ---
    doc.setDrawColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 287, 190, 287);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("gov.br/mcom", 25, 293);
    doc.text("MINISTÉRIO DAS COMUNICAÇÕES", 145, 293);

    doc.save(`Relatório_${ev.uf}_${cidadeFinal.replace(/ /g, '_')}.pdf`);
}
