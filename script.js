const API_URL = 'https://cv-gmiv.onrender.com'; 

// Sincronización simple
function sincronizar(idDestino, valor) {
    document.getElementById(idDestino).innerText = valor;
}

// CARGAR FOTO CORREGIDO
function cargarFoto(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const img = document.getElementById('img-preview');
        img.src = reader.result;
        document.getElementById('marco-foto').classList.add('visible');
    }
    reader.readAsDataURL(event.target.files[0]);
}

function toggleFormaFoto() {
    document.getElementById('marco-foto').classList.toggle('circle');
}

function moverFotoX(val) {
    const img = document.getElementById('img-preview');
    const posY = img.style.objectPosition.split(' ')[1] || '50%';
    img.style.objectPosition = `${val}% ${posY}`;
}

function moverFotoY(val) {
    const img = document.getElementById('img-preview');
    const posX = img.style.objectPosition.split(' ')[0] || '50%';
    img.style.objectPosition = `${posX} ${val}%`;
}

function cambiarColor(color) {
    document.documentElement.style.setProperty('--primary', color);
}

function cambiarFuente(fuente) {
    document.documentElement.style.setProperty('--font-main', fuente);
}

// IA
async function pedirOpcionesIA(tipo) {
    const profesion = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    if (!profesion) return alert("Escribe tu profesión primero");

    panel.innerHTML = "<h4>Generando opciones...</h4>";

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: profesion })
        });
        const data = await res.json();
        
        panel.innerHTML = `<h4>Sugerencias para ${profesion}:</h4>`;
        const opciones = tipo === 'resumen' ? data.opciones_resumen : data.opciones_logros;

        opciones.forEach(texto => {
            const card = document.createElement('div');
            card.className = 'ai-card';
            card.style = "background:white; padding:10px; margin-bottom:10px; border:1px solid #ddd; cursor:pointer; border-radius:5px; font-size:13px;";
            card.textContent = texto;
            
            card.onclick = () => {
                if(tipo === 'resumen') {
                    document.getElementById('p-sobremi').textContent = texto;
                } else {
                    const li = document.createElement('li');
                    li.textContent = texto;
                    document.getElementById('p-experiencia').appendChild(li);
                }
            };
            panel.appendChild(card);
        });
    } catch (e) {
        panel.innerHTML = "<h4>Servidor despertando... reintenta en 10 seg.</h4>";
    }
}