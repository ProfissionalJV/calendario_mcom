function obterDadosCRC(evento) {
    // 1. PRIORIDADE TOTAL: Usa o ID que salvamos no evento.js
    if (evento.crcId !== undefined && evento.crcId !== null && listaBaseCRCs[evento.crcId]) {
        return listaBaseCRCs[evento.crcId];
    }

    // 2. PLANO B: Se for um evento velho, busca por Nome + UF para não dar erro
    const buscaManual = listaBaseCRCs.find(c => 
        c.nome === evento.crcVinculado && 
        c.uf === evento.uf
    );

    if (buscaManual) return buscaManual;

    // 3. FALLBACK: Se não achar nada
    return { 
        nome: evento.crcVinculado || "CRC não identificado", 
        investimento: "Consulte o MCom", 
        cidade: evento.municipio || "Brasil",
        metaDoacao: "0",
        metaFormacao: "0"
    };
}

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
                <p style="margin:0; opacity:0.6; font-size:14px">Layout Premium - Correção de Localização</p>
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
                <h4 style="color:${verdeMcom}; margin-bottom:10px"><i class="fas fa-pen-nib"></i> Detalhes Adicionais</h4>
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

function gerarPdfRelatorio() {
    const id = document.getElementById('relatorioEvento').value;
    if(!id) return alert("Por favor, selecione um evento!");

    const lista = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    const ev = lista.find(e => e.id == id);
    
    if (!ev) {
        alert("Erro: Evento não encontrado!");
        return;
    }

    const notas = document.getElementById('notasRelatorio').value || "";
    const crc = obterDadosCRC(ev);
    
    // CORREÇÃO DE LOCALIZAÇÃO: Prioridade total ao que foi digitado no cadastro
    const cidadeFinal = ev.municipio || ev.cidade || crc.cidade;

    const { jsPDF } = window.jspdf;
    const doc = jsPDF();

    const verdeVivo = [46, 204, 113];
    const pretoTexto = [0, 0, 0];

    // --- 1. CABEÇALHO ---
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
    }

    // --- 2. AGENDA ---
    addTituloSecao("AGENDA");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFontSize(10);
    
    const agendaItems = [
        ["Data:", ev.dataEvento || ev.dataInicio || "A confirmar"],
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

    // --- 3. PARTICIPANTES ---
    y += 10;
    addTituloSecao("PARTICIPANTES");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFont("helvetica", "normal");
    if(ev.equipe && ev.equipe.length > 0) {
        ev.equipe.forEach(m => {
            doc.text(`• ${m}`, 40, y);
            y += 6;
        });
    } else {
        doc.text("• Comitiva em fase de definição", 40, y);
        y += 6;
    }
    

    // --- 4. INFORMAÇÕES PRINCIPAIS ---
    y += 10;
    addTituloSecao("INFORMAÇÕES PRINCIPAIS");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);

    doc.setFont("helvetica", "normal");
    
    let fraseDinamica = "";
    const tipo = ev.tipo || "doacao";

    // Mapeamento de frases
    if (tipo === "caravana" || tipo === "governo" || tipo === "carreta") {
        const nomes = { 'caravana': 'Caravana Federativa', 'governo': 'Governo na Rua', 'carreta': 'Carreta Digital' };
        fraseDinamica = `A ${nomes[tipo]} ocorrerá no estado de ${ev.uf} (${cidadeFinal}) no âmbito da doação de ${ev.qtdComp || 0} computadores e formação de ${crc.metaFormacao || 0} alunos.`;
    } 
    else if (tipo === "inauguracao") {
        fraseDinamica = `Será realizada a inauguração do ${crc.nome}, localizado em ${cidadeFinal}/${ev.uf}, fortalecendo a rede de inclusão digital do Programa Computadores para Inclusão.`;
    }
    else if (tipo === "formacao") {
        fraseDinamica = `Será realizada a cerimônia de entrega de certificados para a formação de ${ev.qtdAlunos || 0} alunos através do programa em ${cidadeFinal}/${ev.uf}.`;
    }
    else {
        fraseDinamica = `Será realizada a doação de ${ev.qtdComp || 0} computadores recondicionados através do programa em ${cidadeFinal}/${ev.uf}.`;
    }

    if(notas) fraseDinamica += ` ${notas}`;
    
    const splitInfo = doc.splitTextToSize(`• ${fraseDinamica}`, 140);
    doc.text(splitInfo, 40, y);
    y += (splitInfo.length * 6) + 12;

    // --- 5. HISTÓRICO CRC ---
    addTituloSecao("HISTÓRICO DO PARCEIRO (CRC)");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    const textoCrc = `O Centro de Recondicionamento de Computadores ${crc.nome} integra o Programa Computadores para Inclusão. Com investimento total de ${crc.investimento}, as metas incluem a doação de ${crc.metaDoacao} computadores e ${crc.metaFormacao} certificados de formação.`;
   
    doc.setFont("helvetica", "normal");

    const splitCrc = doc.splitTextToSize(`• ${textoCrc}`, 140);
    doc.text(splitCrc, 40, y);

    // --- RODAPÉ ---
    doc.setDrawColor(verdeVivo[0], verdeVivo[1], verdeVivo[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("gov.br/mcom", 25, 287);
    doc.text("MINISTÉRIO DAS COMUNICAÇÕES", 145, 287);

    doc.save(`Relatório_${ev.uf}_${cidadeFinal}.pdf`);
}