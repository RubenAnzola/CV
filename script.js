const API_URL = 'https://cv-gmiv.onrender.com';

function sincronizar(id, val) { document.getElementById(id).innerText = val; }

function cargarFoto(e) {
    const reader = new FileReader();
    reader.onload = () => {
        const img = document.getElementById('img-preview');
        img.src = reader.result;
        const marco = document.getElementById('marco-foto');
        marco.style.display = 'block'; // Asegura visibilidad tras carga
        marco.classList.add('visible');
    };
    reader.readAsDataURL(e.target.files[0]);
}

function toggleFormaFoto() { document.getElementById('marco-foto').classList.toggle('circle'); }
function moverFotoX(v) { document.getElementById('img-preview').style.objectPosition = `${v}% ${document.getElementById('img-preview').style.objectPosition.split(' ')[1] || '50%'}`; }
function moverFotoY(v) { document.getElementById('img-preview').style.objectPosition = `${document.getElementById('img-preview').style.objectPosition.split(' ')[0] || '50%'} ${v}%`; }
function cambiarColor(c) { document.documentElement.style.setProperty('--primary', c); }

async function pedirOpcionesIA(tipo) {
    const cargo = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    if(!cargo) return alert("Escribe tu cargo primero para que la IA pueda ayudarte.");

    panel.innerHTML = "<h4>La IA de Google está redactando...</h4>";

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: cargo })
        });
        const data = await res.json();
        
        panel.innerHTML = `<h4>Sugerencias para ${cargo}:</h4>`;
        const opciones = tipo === 'resumen' ? data.opciones_resumen : data.opciones_logros;

        opciones.forEach(texto => {
            const card = document.createElement('div');
            card.className = "ai-card";
            card.textContent = texto;
            card.onclick = () => {
                if(tipo === 'resumen') document.getElementById('p-sobremi').innerText = texto;
                else {
                    const li = document.createElement('li');
                    li.innerText = texto;
                    document.getElementById('p-experiencia').appendChild(li);
                }
            };
            panel.appendChild(card);
        });
    } catch (e) { panel.innerHTML = "<h4>⚠️ El servidor está despertando. Reintenta en 15 segundos.</h4>"; }
}