// --- FUNÇÃO ATUALIZADA PARA SUPORTAR MÚLTIPLOS CRCs ---
function obterDadosCRC(evento) {
    // 1. Se o evento tem múltiplos CRCs (novo formato)
    if (evento.crcIds && evento.crcIds.length > 0) {
        const crcs = evento.crcIds.map(id => listaBaseCRCs[id]).filter(c => c);
        if (crcs.length > 0) {
            return {
                multiplos: true,
                lista: crcs,
                nomes: crcs.map(c => c.nome),
                ufs: [...new Set(crcs.map(c => c.uf))],
                investimentoTotal: crcs.reduce((acc, c) => {
                    let valor = parseFloat(c.investimento.replace(/[R$\s.]/g, '').replace(',', '.'));
                    return acc + (isNaN(valor) ? 0 : valor);
                }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                metaDoacaoTotal: crcs.reduce((acc, c) => acc + (parseInt(c.metaDoacao) || 0), 0),
                metaFormacaoTotal: crcs.reduce((acc, c) => acc + (parseInt(c.metaFormacao) || 0), 0),
                primeiro: crcs[0]
            };
        }
    }

    // 2. Compatibilidade com evento de CRC único (antigo)
    if (evento.crcId !== undefined && evento.crcId !== null && listaBaseCRCs[evento.crcId]) {
        const crc = listaBaseCRCs[evento.crcId];
        return {
            multiplos: false,
            lista: [crc],
            nomes: [crc.nome],
            ufs: [crc.uf],
            investimentoTotal: crc.investimento,
            metaDoacaoTotal: parseInt(crc.metaDoacao) || 0,
            metaFormacaoTotal: parseInt(crc.metaFormacao) || 0,
            primeiro: crc
        };
    }

    // 3. Fallback
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
            metaFormacao: "0"
        }
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
        // Restaura fonte normal para o texto que virá depois (opcional)
        doc.setFont("helvetica", "normal");
    }

    // --- AGENDA ---
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

    // --- PARTICIPANTES ---
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
    
    // --- INFORMAÇÕES PRINCIPAIS ---
    y += 10;
    addTituloSecao("INFORMAÇÕES PRINCIPAIS");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    doc.setFont("helvetica", "normal");
    
    let fraseDinamica = "";
    const tipo = ev.tipo || "doacao";
    const qtdComputadores = ev.qtdComp || (ev.tipo === 'doacao' ? crcData.metaDoacaoTotal : 0);
    const qtdFormacao = ev.qtdAlunos || crcData.metaFormacaoTotal;
    const listaCRCsTexto = crcData.multiplos ? crcData.nomes.join(', ') : (crcData.primeiro?.nome || 'CRC não identificado');

    if (tipo === "caravana" || tipo === "governo" || tipo === "carreta") {
        const nomes = { 'caravana': 'Caravana Federativa', 'governo': 'Governo na Rua', 'carreta': 'Carreta Digital' };
        fraseDinamica = `A ${nomes[tipo]} ocorrerá no estado de ${ev.uf} (${cidadeFinal}) no âmbito da doação de ${qtdComputadores} computadores e formação de ${qtdFormacao} alunos.`;
    } 
    else if (tipo === "inauguracao") {
        fraseDinamica = `Será realizada a inauguração do(s) CRC(s) ${listaCRCsTexto}, localizado(s) em ${cidadeFinal}/${ev.uf}, fortalecendo a rede de inclusão digital do Programa Computadores para Inclusão.`;
    }
    else if (tipo === "formacao") {
        fraseDinamica = `Será realizada a cerimônia de entrega de certificados para a formação de ${qtdFormacao} alunos através do programa em ${cidadeFinal}/${ev.uf}.`;
    }
    else {
        fraseDinamica = `Será realizada a doação de ${qtdComputadores} computadores recondicionados através do programa em ${cidadeFinal}/${ev.uf}.`;
    }

    if(notas) fraseDinamica += ` ${notas}`;
    
    const splitInfo = doc.splitTextToSize(`• ${fraseDinamica}`, 140);
    doc.text(splitInfo, 40, y);
    y += (splitInfo.length * 6) + 12;

    // --- HISTÓRICO DO PARCEIRO (com fonte normal garantida) ---
    addTituloSecao("HISTÓRICO DO(S) PARCEIRO(S) (CRC)");
    doc.setTextColor(pretoTexto[0], pretoTexto[1], pretoTexto[2]);
    
    if (crcData.multiplos && crcData.lista.length > 1) {
        const metasDoacaoTotal = crcData.metaDoacaoTotal;
        const metasFormacaoTotal = crcData.metaFormacaoTotal;
        const investTotal = crcData.investimentoTotal;
        const nomesCRC = crcData.nomes.join(', ');
        const ufsCRC = crcData.ufs.join(', ');
        let textoMulti = `Os Centros de Recondicionamento de Computadores (${nomesCRC}) integram o Programa Computadores para Inclusão. Juntos, somam um investimento total de ${investTotal}, com metas consolidadas de doação de ${metasDoacaoTotal} computadores e ${metasFormacaoTotal} certificados de formação. Atuam nos estados: ${ufsCRC}.`;
        
        doc.setFont("helvetica", "normal");
        const splitMulti = doc.splitTextToSize(`• ${textoMulti}`, 140);
        doc.text(splitMulti, 40, y);
        y += (splitMulti.length * 6) + 5;
    } else {
        const crcUnico = crcData.primeiro;
        const textoUnico = `O Centro de Recondicionamento de Computadores ${crcUnico.nome} integra o Programa Computadores para Inclusão. Com investimento total de ${crcUnico.investimento}, as metas incluem a doação de ${crcUnico.metaDoacao} computadores e ${crcUnico.metaFormacao} certificados de formação.`;
        
        // Força fonte normal antes de escrever
        doc.setFont("helvetica", "normal");
        const splitUnico = doc.splitTextToSize(`• ${textoUnico}`, 140);
        doc.text(splitUnico, 40, y);
        y += (splitUnico.length * 6) + 5;
    }

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
