// --- NOVO ÍNDICE ATUALIZADO (DADOS COMPLETOS) ---
const listaBaseCRCs = [
    { convenio: "916298", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "2000", metaFormacao: "1000", investimento: "R$ 1.368.102,00" },
    { convenio: "962286", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "0", metaFormacao: "300", investimento: "R$ 271.585,00" },
    { convenio: "971548", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "2625", metaFormacao: "1313", investimento: "R$ 1.032.700,00" },
    { convenio: "971551", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "RN", cidade: "Rio Grande do Norte", metaDoacao: "1750", metaFormacao: "1138", investimento: "R$ 539.880,00" },
    { convenio: "986873", nomeCompleto: "Instituto de Assistência e Proteção Social - IAPS", nome: "CRC IAPS", uf: "CE", cidade: "Ceará", metaDoacao: "0", metaFormacao: "120", investimento: "R$ 200.000,00" },
    { convenio: "977829", nomeCompleto: "Instituto Social e Educacional Novos Rumos", nome: "CRC NOVOS RUMOS", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "1300", metaFormacao: "4140", investimento: "R$ 5.000.000,00" },
    { convenio: "986077", nomeCompleto: "Instituto Social e Educacional Novos Rumos", nome: "CRC NOVOS RUMOS", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "1300", metaFormacao: "1020", investimento: "R$ 3.510.000,00" },
    { convenio: "936998", nomeCompleto: "Fundação Universidade Federal do Amapá", nome: "CRC UNIFAP", uf: "AP", cidade: "Amapá", metaDoacao: "1300", metaFormacao: "3700", investimento: "R$ 1.400.000,00" },
    { convenio: "905718", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "GO", cidade: "Goiás", metaDoacao: "3030", metaFormacao: "1200", investimento: "R$ 1.313.581,50" },
    { convenio: "971749", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "MG", cidade: "Minas Gerais", metaDoacao: "1500", metaFormacao: "1850", investimento: "R$ 1.149.800,00" },
    { convenio: "971758", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "GO", cidade: "Goiás", metaDoacao: "1500", metaFormacao: "1850", investimento: "R$ 1.149.900,00" },
    { convenio: "977577", nomeCompleto: "Insituto Brasileiros Amigos da Vida", nome: "CRC IBAV", uf: "DF", cidade: "Distrito Federal", metaDoacao: "500", metaFormacao: "250", investimento: "R$ 600.000,00" },
    { convenio: "905283", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "400", metaFormacao: "300", investimento: "R$ 452.538,00" },
    { convenio: "907030", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "1800", metaFormacao: "1600", investimento: "R$ 1.120.925,00" },
    { convenio: "952107", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "BA", cidade: "Bahia", metaDoacao: "600", metaFormacao: "1000", investimento: "R$ 1.035.803,60" },
    { convenio: "971556", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PB", cidade: "Paraíba", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.485.000,00" },
    { convenio: "971736", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "1500", metaFormacao: "750", investimento: "R$ 1.000.000,00" },
    { convenio: "971738", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "AL", cidade: "Alagoas", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 540.000,00" },
    { convenio: "982725", nomeCompleto: "Instituto de Inovação e Economia Circular", nome: "CRC IEC", uf: "PE", cidade: "Pernambuco", metaDoacao: "0", metaFormacao: "200", investimento: "R$ 300.000,00" },
    { convenio: "971747", nomeCompleto: "Instituto Tecnológico Conexão Digital", nome: "CRC ITCD", uf: "BA", cidade: "Bahia", metaDoacao: "2900", metaFormacao: "1600", investimento: "R$ 1.650.000,00" },
    { convenio: "936494", nomeCompleto: "Universidade Federal do Vale do São Francisco", nome: "CRC UNIVASF", uf: "PE", cidade: "Pernambuco", metaDoacao: "1600", metaFormacao: "2600", investimento: "R$ 4.847.665,65" },
    { convenio: "954580", nomeCompleto: "Universidade Federal do Vale do São Francisco", nome: "CRC UNIVASF", uf: "PE", cidade: "Pernambuco", metaDoacao: "0", metaFormacao: "1500", investimento: "R$ 2.555.989,64" },
    { convenio: "916548", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "1548", metaFormacao: "1400", investimento: "R$ 1.473.087,00" },
    { convenio: "940606", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "200", metaFormacao: "150", investimento: "R$ 515.812,15" },
    { convenio: "971748", nomeCompleto: "Núcleo Comunitário e Cultural Belém Novo", nome: "CRC NCC BELÉM", uf: "RS", cidade: "Rio Grande do Sul", metaDoacao: "3000", metaFormacao: "1400", investimento: "R$ 1.796.270,00" },
    { convenio: "916563", nomeCompleto: "Fundação de Proteção ao Meio Ambiente e Ecoturismo do Estado do Piauí", nome: "CRC FUNPAPI", uf: "PI", cidade: "Piauí", metaDoacao: "1650", metaFormacao: "1552", investimento: "R$ 1.256.400,82" },
    { convenio: "971753", nomeCompleto: "Fundação de Proteção ao Meio Ambiente e Ecoturismo do Estado do Piauí", nome: "CRC FUNPAPI", uf: "PI", cidade: "Piauí", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
    { convenio: "940607", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Sergipe", nome: "CRC IFS", uf: "SE", cidade: "Sergipe", metaDoacao: "1000", metaFormacao: "2500", investimento: "R$ 1.788.500,00" },
    { convenio: "990175", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Sergipe", nome: "CRC IFS", uf: "SE", cidade: "Sergipe", metaDoacao: "2500", metaFormacao: "1200", investimento: "R$ 1.650.000,00" },
    { convenio: "968019", nomeCompleto: "Instituto de Incubação e Aceleração", nome: "CRC IA", uf: "RR", cidade: "Roraima", metaDoacao: "1200", metaFormacao: "1800", investimento: "R$ 4.662.600,00" },
    { convenio: "936511", nomeCompleto: "Empresa de Informática e Informação de Belo Horizonte", nome: "CRC PRODABEL", uf: "MG", cidade: "Minas Gerais", metaDoacao: "1500", metaFormacao: "1200", investimento: "R$ 1.200.000,00" },
    { convenio: "961906", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "600", metaFormacao: "400", investimento: "R$ 1.636.000,00" },
    { convenio: "971569", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "ES", cidade: "Espírito Santo", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 600.000,00" },
    { convenio: "971565", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "3000", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
    { convenio: "971571", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "4000", metaFormacao: "1650", investimento: "R$ 2.000.000,00" },
    { convenio: "976095", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "976105", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "RJ", cidade: "Rio de Janeiro", metaDoacao: "800", metaFormacao: "500", investimento: "R$ 3.000.000,00" },
    { convenio: "982726", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "976097", nomeCompleto: "Instituto Nova Agora de Cidadania", nome: "CRC INAC", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "971575", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "MT", cidade: "Mato Grosso", metaDoacao: "1500", metaFormacao: "750", investimento: "R$ 1.149.405,00" },
    { convenio: "968761", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "850", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "971192", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "0", metaFormacao: "2560", investimento: "R$ 4.829.610,00" },
    { convenio: "971419", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "TO", cidade: "Tocantins", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 599.482,50" },
    { convenio: "971576", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "3000", metaFormacao: "1300", investimento: "R$ 1.998.864,00" },
    { convenio: "980932", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "DF", cidade: "Distrito Federal", metaDoacao: "400", metaFormacao: "300", investimento: "R$ 600.000,00" },
    { convenio: "978914", nomeCompleto: "Programando o Futuro", nome: "CRC PROGRAMANDO", uf: "GO", cidade: "Goiás", metaDoacao: "200", metaFormacao: "150", investimento: "R$ 300.000,00" },
    { convenio: "940588", nomeCompleto: "Instituto Federal do Maranhão", nome: "CRC IFMA", uf: "MA", cidade: "Maranhão", metaDoacao: "1150", metaFormacao: "1725", investimento: "R$ 2.100.000,00" },
    { convenio: "972307", nomeCompleto: "Instituto Federal do Maranhão", nome: "CRC IFMA", uf: "MA", cidade: "Maranhão", metaDoacao: "0", metaFormacao: "2000", investimento: "R$ 2.500.000,00" },
    { convenio: "971412", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "MA", cidade: "Maranhão", metaDoacao: "2200", metaFormacao: "1000", investimento: "R$ 1.650.000,00" },
    { convenio: "971744", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "PA", cidade: "Pará", metaDoacao: "2000", metaFormacao: "3000", investimento: "R$ 3.300.000,00" },
    { convenio: "971746", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "AP", cidade: "Amapá", metaDoacao: "1000", metaFormacao: "650", investimento: "R$ 600.000,00" },
    { convenio: "976354", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "SP", cidade: "São Paulo", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "975282", nomeCompleto: "Instituto Gustavo Hessel", nome: "CRC IGH", uf: "PA", cidade: "Pará", metaDoacao: "500", metaFormacao: "300", investimento: "R$ 1.000.000,00" },
    { convenio: "971563", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "RR", cidade: "Roraima", metaDoacao: "1000", metaFormacao: "1100", investimento: "R$ 599.400,00" },
    { convenio: "916564", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "AM", cidade: "Amazonas", metaDoacao: "2100", metaFormacao: "2100", investimento: "R$ 1.411.787,00" },
    { convenio: "971741", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "RO", cidade: "Rondônia", metaDoacao: "1000", metaFormacao: "1100", investimento: "R$ 599.400,00" },
    { convenio: "971743", nomeCompleto: "Instituto Descarte Correto", nome: "CRC IDC", uf: "AM", cidade: "Amazonas", metaDoacao: "3000", metaFormacao: "2000", investimento: "R$ 2.199.013,60" },
    { convenio: "950990", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "PR", cidade: "Paraná", metaDoacao: "800", metaFormacao: "600", investimento: "R$ 1.056.238,00" },
    { convenio: "971733", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "SC", cidade: "Santa Catarina", metaDoacao: "1800", metaFormacao: "900", investimento: "R$ 1.149.759,37" },
    { convenio: "971755", nomeCompleto: "Asssociação Gestora de E-letro", nome: "CRC E-LETRO", uf: "PR", cidade: "Paraná", metaDoacao: "3000", metaFormacao: "1250", investimento: "R$ 1.997.056,00" },
    { convenio: "936637", nomeCompleto: "Instituto Federal de Educação, Ciência e Tecnologia de Mato Grosso do Sul", nome: "CRC IFMS", uf: "MS", cidade: "Mato Grosso do Sul", metaDoacao: "1000", metaFormacao: "2500", investimento: "R$ 1.514.038,80" }
];

function renderCrcLista() {
    const app = document.getElementById('app');
    const verdeMcom = "#2ecc71";

    app.innerHTML = `
    <div class="glass-card" style="width: 95%; max-width: 1400px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <h2 style="margin:0"><i class="fas fa-landmark" style="color:${verdeMcom}"></i> Índice Consolidado de CRCs</h2>
            <span style="background:${verdeMcom}; color:black; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:bold;">
                ${listaBaseCRCs.length} CONVÊNIOS ATIVOS
            </span>
        </div>

        <div style="margin-bottom: 25px;">
            <input type="text" id="buscaCrc" placeholder="🔍 Pesquisar por sigla, UF, convênio ou parceiro..." onkeyup="filtrarCrc()" 
            style="width:100%; padding:15px; border-radius:10px; border:1px solid ${verdeMcom}; background:rgba(0,0,0,0.3); color:white; font-size:16px;">
        </div>

        <div style="overflow-x:auto; border-radius:10px; border: 1px solid rgba(255,255,255,0.1);">
            <table style="width:100%; color:white; border-collapse: collapse; font-size:13px; min-width:1200px;">
                <thead>
                    <tr style="background: rgba(46, 204, 113, 0.1); text-align:left;">
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom};">CONVÊNIO</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom};">SIGLA</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom};">NOME COMPLETO</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom}; text-align:center;">UF</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom};">CIDADE</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom}; text-align:center;">DOAÇÃO</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom}; text-align:center;">FORMAÇÃO</th>
                        <th style="padding:15px; border-bottom: 2px solid ${verdeMcom};">INVESTIMENTO</th>
                    </tr>
                </thead>
                <tbody id="tabelaCrc">
                    ${listaBaseCRCs.map(c => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                            <td style="padding:12px; font-family:monospace; color:${verdeMcom}">${c.convenio}</td>
                            <td style="padding:12px; font-weight:bold;">${c.nome}</td>
                            <td style="padding:12px; opacity:0.8; max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${c.nomeCompleto}">${c.nomeCompleto}</td>
                            <td style="padding:12px; text-align:center;"><span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${c.uf}</span></td>
                            <td style="padding:12px;">${c.cidade}</td>
                            <td style="padding:12px; text-align:center; font-weight:bold; color:#ecf0f1">${c.metaDoacao}</td>
                            <td style="padding:12px; text-align:center; font-weight:bold; color:#ecf0f1">${c.metaFormacao}</td>
                            <td style="padding:12px; font-weight:bold; color:${verdeMcom}">${c.investimento}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function filtrarCrc() {
    const input = document.getElementById('buscaCrc').value.toLowerCase();
    const rows = document.querySelectorAll('#tabelaCrc tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
    });
}