let stream;
let cameraAtual = "environment"; 
let fotosTemporarias = []; 

function renderMidia() {
    const app = document.getElementById('app');
    const eventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];

    app.innerHTML = `
        <div class="glass-card">
            <h1><i class="fas fa-camera"></i> Central de Mídia</h1>
            <p style="opacity:0.7; margin-bottom:20px">Selecione o evento e capture ou envie suas fotos.</p>

            <div class="form-grid">
                <div>
                    <label>Evento Destino:</label>
                    <select id="selecionarEventoMidia">
                        <option value="">-- Selecione o Evento --</option>
                        ${eventos.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}
                    </select>

                    <label style="margin-top:15px; display:block">Captura de Imagem:</label>
                    <div style="position:relative; width:100%; border-radius:10px; overflow:hidden; background:#000; margin-bottom:10px">
                        <video id="video" autoplay playsinline style="width:100%; display:block; transform: scaleX(${cameraAtual === 'user' ? -1 : 1});"></video>
                        
                        <button onclick="alternarCamera()" style="position:absolute; top:10px; right:10px; padding:8px; border-radius:50%; width:35px; height:35px; background:rgba(0,0,0,0.6); color:#fff; border:1px solid var(--primary)">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                        <button onclick="tirarFoto()" style="width:100%">
                            <i class="fas fa-circle"></i> Tirar Foto
                        </button>
                        
                        <button onclick="document.getElementById('uploadFoto').click()" style="background:var(--glass); border:1px solid var(--glass-border); color:white">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                    </div>
                    
                    <input type="file" id="uploadFoto" accept="image/*" multiple style="display:none" onchange="processarUpload(this)">
                </div>

                <div style="border-left: 1px solid var(--glass-border); padding-left:20px">
                    <h4 style="margin-bottom:15px"><i class="fas fa-images"></i> Fotos para Salvar (<span id="count">0</span>)</h4>
                    
                    <div id="galeriaFotos" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap:8px; max-height:300px; overflow-y:auto; padding-bottom:10px">
                        <p style="opacity:0.4; font-size:12px">Nenhuma foto selecionada.</p>
                    </div>

                    <button id="btnSalvarFinal" onclick="salvarFotosNoEvento()" style="width:100%; margin-top:15px; display:none">
                        <i class="fas fa-save"></i> Salvar no Evento
                    </button>
                </div>
            </div>
        </div>
        <canvas id="canvas" style="display:none;"></canvas>
    `;

    // Inicia a câmera automaticamente ao abrir a tela
    setTimeout(iniciarCamera, 200);
}

// --- FUNÇÕES DE LÓGICA ---

async function iniciarCamera() {
    const video = document.getElementById('video');
    if (!video) return;

    try {
        if (stream) stream.getTracks().forEach(t => t.stop());
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraAtual },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Erro ao abrir câmera:", err);
    }
}

async function alternarCamera() {
    cameraAtual = (cameraAtual === "environment") ? "user" : "environment";
    await iniciarCamera();
    // Atualiza o espelhamento do vídeo (Mirror)
    document.getElementById('video').style.transform = `scaleX(${cameraAtual === 'user' ? -1 : 1})`;
}

function tirarFoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = (video.videoHeight / video.videoWidth) * 1080;

    if (cameraAtual === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    
    fotosTemporarias.push(base64);
    atualizarGaleriaUI();
}

async function processarUpload(input) {
    const files = Array.from(input.files);
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fotosTemporarias.push(e.target.result);
            atualizarGaleriaUI();
        };
        reader.readAsDataURL(file);
    }
}

function atualizarGaleriaUI() {
    const galeria = document.getElementById('galeriaFotos');
    const btnSalvar = document.getElementById('btnSalvarFinal');
    const count = document.getElementById('count');
    
    count.innerText = fotosTemporarias.length;
    
    if (fotosTemporarias.length > 0) {
        btnSalvar.style.display = 'block';
        galeria.innerHTML = fotosTemporarias.map((f, i) => `
            <div style="position:relative">
                <img src="${f}" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:5px">
                <button onclick="removerFoto(${i})" style="position:absolute; top:-5px; right:-5px; width:18px; height:18px; border-radius:50%; background:red; border:none; color:white; font-size:10px">×</button>
            </div>
        `).join('');
    } else {
        galeria.innerHTML = `<p style="opacity:0.4; font-size:12px">Nenhuma foto selecionada.</p>`;
        btnSalvar.style.display = 'none';
    }
}

function removerFoto(i) {
    fotosTemporarias.splice(i, 1);
    atualizarGaleriaUI();
}

async function salvarFotosNoEvento() {
    const evId = document.getElementById('selecionarEventoMidia').value;
    if (!evId) return alert("Selecione um evento!");

    const btn = document.getElementById('btnSalvarFinal');
    const originalText = btn.innerHTML;
    
    // Feedback visual de carregamento (Estilo Jarvis)
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> SINCRONIZANDO COM A NUVEM...`;

    try {
        const linksFotos = [];
        
        // 1. Faz o upload de cada foto para a pasta /uploads do GitHub
        for (let i = 0; i < fotosTemporarias.length; i++) {
            btn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> SUBINDO FOTO ${i + 1}/${fotosTemporarias.length}...`;
            
            // Usamos a função que criamos no main.js
            const urlGitHub = await subirFotoParaGithub(fotosTemporarias[i], `evento_${evId}_foto_${i}`);
            if (urlGitHub) linksFotos.push(urlGitHub);
        }

        // 2. Agora salvamos esses links no seu banco de dados (database.json)
        // Buscamos a lista de eventos atual
        let listaEventos = JSON.parse(localStorage.getItem('mcom_eventos')) || [];
        const index = listaEventos.findIndex(e => e.id == evId);

        if (index !== -1) {
            // Se o evento ainda não tiver uma galeria, cria uma
            if (!listaEventos[index].galeria) listaEventos[index].galeria = [];
            
            // Adiciona os novos links à galeria do evento
            listaEventos[index].galeria = [...listaEventos[index].galeria, ...linksFotos];

            // 3. Salva a lista atualizada no GitHub (usando sua função de sincronia do main.js)
            // Note: Você pode precisar de uma função no main.js que receba a lista completa
            // ou adaptar o salvarNoGithub para atualizar o item específico.
            await atualizarBancoGitHubCompleto(listaEventos); 
            
            alert("✅ Sincronização concluída! As fotos já estão no repositório do Ministério.");
        }

        // Limpa a galeria temporária
        fotosTemporarias = [];
        renderMidia();

    } catch (error) {
        console.error("Erro na sincronia:", error);
        alert("Erro ao salvar fotos. Verifique a conexão.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}