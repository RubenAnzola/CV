const API_URL = 'https://cv-gmiv.onrender.com'; 

// --- 1. PERSONALIZACIÓN VISUAL ---
function cambiarColor(color) {
    document.documentElement.style.setProperty('--primary', color);
}

function cambiarFuente(fuente) {
    document.documentElement.style.setProperty('--font-main', fuente);
}

// --- 2. MANEJO DE FOTO ---
function cargarFoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('img-preview');
            img.src = e.target.result;
            document.getElementById('marco-foto').classList.add('visible');
        }
        reader.readAsDataURL(file);
    }
}

function toggleFormaFoto() {
    const marco = document.getElementById('marco-foto');
    marco.classList.toggle('circle');
}

// Mover foto (X e Y) usando object-position
function moverFotoX(valor) {
    const img = document.getElementById('img-preview');
    // Obtenemos el valor Y actual para no perderlo
    const currentY = img.style.objectPosition.split(' ')[1] || '50%';
    img.style.objectPosition = `${valor}% ${currentY}`;
}

function moverFotoY(valor) {
    const img = document.getElementById('img-preview');
    const currentX = img.style.objectPosition.split(' ')[0] || '50%';
    img.style.objectPosition = `${currentX} ${valor}%`;
}

// --- 3. LÓGICA DE IA (6 OPCIONES) ---
async function pedirOpcionesIA(tipo) {
    const profesion = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    
    if (!profesion) return alert("⚠️ Escribe tu profesión primero.");

    panel.innerHTML = `
        <div class="ai-card" style="border-color: #aaa; background:#f0f0f0;">
            ⏳ <strong>Analizando perfil de: ${profesion}</strong>...<br>Generando 6 opciones profesionales...
        </div>`;

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: profesion })
        });
        
        if (!res.ok) throw new Error("Error Servidor");
        const data = await res.json();
        
        panel.innerHTML = `<h4>6 Opciones para: ${profesion}</h4><p style="font-size:11px; color:#666">Haz clic para insertar:</p>`;
        
        const opciones = tipo === 'resumen' ? data.opciones_resumen : data.opciones_logros;

        opciones.forEach((texto, index) => {
            const card = document.createElement('div');
            card.className = 'ai-card';
            card.innerHTML = `<strong>Opción ${index + 1}:</strong><br>${texto}`;
            
            card.onclick = () => {
                if(tipo === 'resumen') {
                    const el = document.getElementById('p-sobremi');
                    el.textContent = texto;
                    flashEffect(el);
                } else {
                    const ul = document.getElementById('p-experiencia');
                    const li = document.createElement('li');
                    li.textContent = texto;
                    ul.appendChild(li);
                    flashEffect(li);
                }
            };
            panel.appendChild(card);
        });

    } catch (err) {
        panel.innerHTML = `<div class="ai-card" style="color:red;">⚠️ El servidor está despertando. Intenta de nuevo en 10 seg.</div>`;
    }
}

function flashEffect(element) {
    element.style.backgroundColor = "#e2e8f0";
    setTimeout(() => element.style.backgroundColor = "transparent", 400);
}