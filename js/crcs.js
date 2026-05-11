// --- DADOS ORIGINAIS (RAW) ---
const rawCRCs = [
{convenio: "916298/2021 (EDL)", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "2000", metaFormacao: "1000", investimento: "R$ 1.368.102,00" },
{ convenio: "962286/2024 (EMD)", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "0", metaFormacao: "300", investimento: "R$ 271.585,00" },
{ convenio: "971548/2024 (EDL)", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "2625", metaFormacao: "1313", investimento: "R$ 1.032.700,00" },
{ convenio: "971551/2024 (EDL)", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "RN", cidade: "Rio Grande do Norte", metaDoacao: "1750", metaFormacao: "1138", investimento: "R$ 539.880,00" },
{ convenio: "986873/2025 (EMD)", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "0", metaFormacao: "120", investimento: "R$ 200.000,00" },
{ convenio: "977829/2025 (EMD)", nomeCompleto: "Instituto Social e Educacional Novos Rumos", nome: "CRC NOVOS RUMOS", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "1300", metaFormacao: "4140", investimento: "R$ 5.000.000,00" },
{ convenio: "986077/2025 (EMD)", nomeCompleto: "Instituto Social e Educacional Novos Rumos", nome: "CRC NOVOS RUMOS", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "1300", metaFormacao: "1020", investimento: "R$ 3.510.000,00" },
{ convenio: "936928/2022 (MCom)", nomeCompleto: "Fundação Universidade Federal do Amapá", nome: "CRC UNIFAP", uf: "AP", cidade: "Amapá", metaDoacao: "1300", metaFormacao: "3700", investimento: "R$ 1.400.000,00" },
{ convenio: "905718/2020 (EDL)", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "GO", cidade: "Goiás", metaDoacao: "3030", metaFormacao: "1200", investimento: "R$ 1.313.581,50" },
{ convenio: "971749/2024 (EDL)", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "MG", cidade: "Minas Gerais", metaDoacao: "1500", metaFormacao: "1850", investimento: "R$ 1.149.800,00" },
{ convenio: "971758/2024 (EDL)", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "GO", cidade: "Goiás", metaDoacao: "1500", metaFormacao: "1850", investimento: "R$ 1.149.900,00" },
{ convenio: "977577/2025 (EMD)", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "DF", cidade: "Distrito Federal", metaDoacao: "500", metaFormacao: "250", investimento: "R$ 600.000,00" },
{ convenio: "905283/2020 (EMD)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "400", metaFormacao: "300", investimento: "R$ 452.538,00" },
{ convenio: "907030/2020 (EDL)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "1800", metaFormacao: "1600", investimento: "R$ 1.120.925,00" },
{ convenio: "952107/2023 (EMD)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "BA", cidade: "Bahia", metaDoacao: "600", metaFormacao: "1000", investimento: "R$ 1.035.803,60" },
{ convenio: "971556/2024 (EDL)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PB", cidade: "Paraíba", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.485.000,00" },
{ convenio: "971736/2024 (EDL)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "1500", metaFormacao: "750", investimento: "R$ 1.000.000,00" },
{ convenio: "971738/2024 (EDL)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "AL", cidade: "Alagoas", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 540.000,00" },
{ convenio: "982725/2025 (EMD)", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "0", metaFormacao: "200", investimento: "R$ 300.000,00" },
{ convenio: "971747/2024 (EDL)", nomeCompleto: "Instituto Tecnológico Conexão Digital", nome: "CRC ITCD", uf: "BA", cidade: "Bahia", metaDoacao: "2900", metaFormacao: "1600", investimento: "R$ 1.650.000,00" },
{ convenio: "936494/2022 (MCom)", nomeCompleto: "Universidade Federal do Vale do São Francisco", nome: "CRC UNIVASF", uf: "PE", cidade: "Pernambuco", metaDoacao: "1600", metaFormacao: "2600", investimento: "R$ 4.847.665,65" },
{ convenio: "954580/2023 (MCom)", nomeCompleto: "Universidade Federal do Vale do São Francisco", nome: "CRC UNIVASF", uf: "PE", cidade: "Pernambuco", metaDoacao: "0", metaFormacao: "1500", investimento: "R$ 2.555.989,64" },
{ convenio: "916548/2021 (EDL)", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "1548", metaFormacao: "1400", investimento: "R$ 1.473.087,00" },
{ convenio: "940606/2023 (EMD)", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "200", metaFormacao: "150", investimento: "R$ 515.812,15" },
{ convenio: "971748/2024 (EDL)", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "3000", metaFormacao: "1400", investimento: "R$ 1.796.270,00" },
{ convenio: "916563/2020 (EDL)", nomeCompleto: "Fundação de Proteção ao Meio Ambiente e Ecoturismo do Estado do Piauí", nome: "CRC FUNPAPI", uf: "PI", cidade: "Piauí", metaDoacao: "1650", metaFormacao: "1552", investimento: "R$ 1.256.400,82" },
{ convenio: "971753/2024 (EDL)", nomeCompleto: "Fundação de Proteção ao Meio Ambiente e Ecoturismo do Estado do Piauí", nome: "CRC FUNPAPI", uf: "PI", cidade: "Piauí", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
{ convenio: "940607/2023 (MCom)", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Sergipe", nome: "CRC IFS", uf: "SE", cidade: "Sergipe", metaDoacao: "1000", metaFormacao: "2500", investimento: "R$ 1.788.500,00" },
{ convenio: "990175/2025 (MCom)", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Sergipe", nome: "CRC IFS", uf: "SE", cidade: "Sergipe", metaDoacao: "2500", metaFormacao: "1200", investimento: "R$ 1.650.000,00" },
{ convenio: "968019/2024 (EMD)", nomeCompleto: "Instituto de Incubação e Aceleração", nome: "CRC IA", uf: "RR", cidade: "Roraima", metaDoacao: "1200", metaFormacao: "1800", investimento: "R$ 4.662.600,00" },
{ convenio: "936511/2022 (MCom)", nomeCompleto: "Empresa de Informática e Informação de Belo Horizonte", nome: "CRC PRODABEL", uf: "MG", cidade: "Minas Gerais", metaDoacao: "1500", metaFormacao: "1200", investimento: "R$ 1.200.000,00" },
{ convenio: "961906/2024 (EMD)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "600", metaFormacao: "400", investimento: "R$ 1.636.000,00" },
{ convenio: "971569/2024 (EDL)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "ES", cidade: "Espírito Santo", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 600.000,00" },
{ convenio: "971565/2024 (EDL)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "3000", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
{ convenio: "971571/2024 (EDL)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "4000", metaFormacao: "1650", investimento: "R$ 2.000.000,00" },
{ convenio: "976095/2025 (EMD)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "976105/2025 (EMD)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "800", metaFormacao: "500", investimento: "R$ 3.000.000,00" },
{ convenio: "982726/2025 (EMD)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "976097/2025 (EMD)", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "971575/2024 (EDL)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "MT", cidade: "Mato Grosso", metaDoacao: "1500", metaFormacao: "750", investimento: "R$ 1.149.405,00" },
{ convenio: "968761/2024 (EMD)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "850", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "971192/2024 (EMD)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "0", metaFormacao: "2560", investimento: "R$ 4.829.610,00" },
{ convenio: "971419/2024 (EDL)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "TO", cidade: "Tocantins", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 599.482,50" },
{ convenio: "971576/2024 (EDL)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "3000", metaFormacao: "1300", investimento: "R$ 1.998.864,00" },
{ convenio: "980932/2025 (EMD)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "400", metaFormacao: "300", investimento: "R$ 600.000,00" },
{ convenio: "978914/2025 (EMD)", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "GO", cidade: "Goiás", metaDoacao: "200", metaFormacao: "150", investimento: "R$ 300.000,00" },
{ convenio: "940588/2023 (MCom)", nomeCompleto: "Instituto Federal do Maranhão", nome: "CRC IFMA", uf: "MA", cidade: "Maranhão", metaDoacao: "1150", metaFormacao: "1725", investimento: "R$ 2.100.000,00" },
{ convenio: "972307/2024 (MCom)", nomeCompleto: "Instituto Federal do Maranhão", nome: "CRC IFMA", uf: "MA", cidade: "Maranhão", metaDoacao: "0", metaFormacao: "2000", investimento: "R$ 2.500.000,00" },
{ convenio: "971412/2024 (EDL)", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "MA", cidade: "Maranhão", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
{ convenio: "971744/2024 (EDL)", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "PA", cidade: "Pará", metaDoacao: "2000", metaFormacao: "3000", investimento: "R$ 3.300.000,00" },
{ convenio: "971746/2024 (EDL)", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "AP", cidade: "Amapá", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 600.000,00" },
{ convenio: "976354/2025 (EMD)", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "975282/2025 (EMD)", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "PA", cidade: "Pará", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
{ convenio: "971563/2024 (EDL)", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "RR", cidade: "Roraima", metaDoacao: "1000", metaFormacao: "1100", investimento: "R$ 599.400,00" },
{ convenio: "916564/2021 (EDL)", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "AM", cidade: "Amazonas", metaDoacao: "2100", metaFormacao: "2100", investimento: "R$ 1.411.787,00" },
{ convenio: "971741/2024 (EDL)", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "RO", cidade: "Rondônia", metaDoacao: "1000", metaFormacao: "1100", investimento: "R$ 599.400,00" },
{ convenio: "971743/2024 (EDL)", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "AM", cidade: "Amazonas", metaDoacao: "3000", metaFormacao: "2000", investimento: "R$ 2.199.013,60" },
{ convenio: "950990/2023 (EMD)", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "PR", cidade: "Paraná", metaDoacao: "800", metaFormacao: "600", investimento: "R$ 1.056.238,00" },
{ convenio: "971733/2024 (EDL)", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "SC", cidade: "Santa Catarina", metaDoacao: "1800", metaFormacao: "900", investimento: "R$ 1.149.759,37" },
{ convenio: "971755/2024 (EDL)", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "PR", cidade: "Paraná", metaDoacao: "3000", metaFormacao: "1250", investimento: "R$ 1.997.056,00" },
{ convenio: "936637/2022 (MCom)", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Mato Grosso do Sul", nome: "CRC IFMS", uf: "MS", cidade: "Mato Grosso do Sul", metaDoacao: "1000", metaFormacao: "2500", investimento: "R$ 1.514.038,80" }
]   

// Lista de convênios individuais (para seleção)
const listaConvenios = rawCRCs;

// --- FUNÇÃO PARA CONSOLIDAR CRCs por NOME + UF (APENAS PARA A TELA DE ÍNDICE) ---
function consolidarCRCs() {
    const mapa = new Map();
    rawCRCs.forEach(item => {
        const key = `${item.nome}|${item.uf}`;
        if (!mapa.has(key)) {
            mapa.set(key, {
                nome: item.nome,
                uf: item.uf,
                cidade: item.cidade,
                nomeCompleto: item.nomeCompleto,
                metaDoacao: parseFloat(item.metaDoacao) || 0,
                metaFormacao: parseFloat(item.metaFormacao) || 0,
                investimento: parseFloat(item.investimento.replace(/[R$\s.]/g, '').replace(',', '.')) || 0,
                qtdConvenios: 1
            });
        } else {
            const existing = mapa.get(key);
            existing.metaDoacao += parseFloat(item.metaDoacao) || 0;
            existing.metaFormacao += parseFloat(item.metaFormacao) || 0;
            existing.investimento += parseFloat(item.investimento.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
            existing.qtdConvenios++;
        }
    });
    return Array.from(mapa.values()).map(c => ({
        ...c,
        metaDoacao: c.metaDoacao.toString(),
        metaFormacao: c.metaFormacao.toString(),
        investimento: `R$ ${c.investimento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        displayName: `${c.nome} (${c.uf}) - ${c.qtdConvenios} convênio(s)`
    }));
}

const listaCRCsConsolidada = consolidarCRCs().sort((a,b) => a.nome.localeCompare(b.nome));

// --- MIGRAÇÃO PARA EVENTOS ANTIGOS (converte ID de CRC consolidado para primeiro convênio? opcional) ---
function migrarIdsEventos() {
    let eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
    let modificado = false;
    eventos = eventos.map(ev => {
        if (ev.crcIds && ev.crcIds.length > 0 && typeof ev.crcIds[0] === 'number' && ev.crcIds[0] < listaConvenios.length) {
            // já está no formato novo? se o ID existe na lista de convênios, mantém
            return ev;
        }
        // se for ID antigo (consolidado), tenta mapear para o primeiro convênio daquele CRC (fallback)
        if (ev.crcIds && ev.crcIds.length > 0) {
            const antigoId = ev.crcIds[0];
            const crcAntigo = listaCRCsConsolidada[antigoId];
            if (crcAntigo) {
                const convenioEquivalente = listaConvenios.find(c => c.nome === crcAntigo.nome && c.uf === crcAntigo.uf);
                if (convenioEquivalente) {
                    ev.crcIds = [listaConvenios.indexOf(convenioEquivalente)];
                    modificado = true;
                }
            }
        }
        return ev;
    });
    if (modificado) {
        localStorage.setItem('mcom_eventos', JSON.stringify(eventos));
        console.log("Migração de eventos para convênios individuais concluída!");
    }
}
migrarIdsEventos();

// --- RENDERIZAÇÃO DA TELA DE ÍNDICE (consolidada) ---
function renderCrcLista() {
    const app = document.getElementById('app');
    const verdeMcom = "#2ecc71";
    app.innerHTML = `
    <div class="glass-card" style="width: 95%; max-width: 1400px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <h2 style="margin:0"><i class="fas fa-landmark" style="color:${verdeMcom}"></i> Índice Consolidado de CRCs</h2>
            <span style="background:${verdeMcom}; color:black; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:bold;">
                ${listaCRCsConsolidada.length} CRC(s) agregados
            </span>
        </div>
        <div style="margin-bottom: 25px;">
            <input type="text" id="buscaCrc" placeholder="🔍 Pesquisar..." onkeyup="filtrarCrc()" style="width:100%; padding:15px; border-radius:10px; border:1px solid ${verdeMcom}; background:rgba(0,0,0,0.3); color:white;">
        </div>
        <div style="overflow-x:auto;">
            <table style="width:100%; color:white; border-collapse: collapse;">
                <thead><tr><th>SIGLA</th><th>NOME COMPLETO</th><th>UF</th><th>CIDADE</th><th>DOAÇÃO</th><th>FORMAÇÃO</th><th>INVESTIMENTO</th></tr></thead>
                <tbody id="tabelaCrc">
                    ${listaCRCsConsolidada.map(c => `
                        <tr><td><strong>${c.nome}</strong></td><td>${c.nomeCompleto}</td><td>${c.uf}</td><td>${c.cidade}</td><td>${parseInt(c.metaDoacao).toLocaleString()}</td><td>${parseInt(c.metaFormacao).toLocaleString()}</td><td>${c.investimento}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}
function filtrarCrc() {
    const input = document.getElementById('buscaCrc').value.toLowerCase();
    const rows = document.querySelectorAll('#tabelaCrc tr');
    rows.forEach(row => { row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none'; });
}


// Expor listas globalmente
window.listaConvenios = listaConvenios;
window.listaBaseCRCs = listaConvenios;   // para compatibilidade com eventos.js
window.listaCRCsConsolidada = listaCRCsConsolidada;
window.rawCRCs = rawCRCs;
