const API_URL = 'https://cv-gmiv.onrender.com';

// SINCRONIZACIÓN DE IDENTIDAD SEPARADA
const inNombre = document.getElementById('in-nombre');
const inApellido = document.getElementById('in-apellido');

function actualizarNombre() {
    const full = `${inNombre.value} ${inApellido.value}`.trim() || "TU NOMBRE";
    document.getElementById('p-nombre-completo').innerText = full.toUpperCase();
}
inNombre.addEventListener('input', actualizarNombre);
inApellido.addEventListener('input', actualizarNombre);

// CONTACTO Y OTROS
const mappings = {
    'in-profesion': 'p-titulo-cv',
    'in-tlf': 'p-tlf',
    'in-email': 'p-email',
    'in-ubicacion': 'p-ubicacion'
};

Object.entries(mappings).forEach(([inId, outId]) => {
    document.getElementById(inId).addEventListener('input', (e) => {
        document.getElementById(outId).innerText = e.target.value;
    });
});

document.getElementById('in-educacion').addEventListener('input', (e) => {
    document.getElementById('p-educacion').innerHTML = e.target.value.replace(/\n/g, '<br>');
});

// FOTO
function cargarFoto(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const img = document.getElementById('img-preview');
        img.src = reader.result;
        document.getElementById('marco-foto').classList.add('visible');
    };
    reader.readAsDataURL(event.target.files[0]);
}
function toggleFormaFoto() { document.getElementById('marco-foto').classList.toggle('circle'); }
function moverFotoX(v) { document.getElementById('img-preview').style.objectPosition = `${v}% 50%`; }
function moverFotoY(v) { document.getElementById('img-preview').style.objectPosition = `50% ${v}%`; }

// IA GEMINI
async function pedirOpcionesIA(tipo) {
    const cargo = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    if(!cargo) return alert("Escribe el cargo para la IA");

    panel.innerHTML = "<div class='ai-card'>🧠 Redactando opciones profesionales...</div>";

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
            card.className = "ai-card-pro";
            card.style = "background:white; padding:15px; margin-bottom:10px; border:1px solid #eee; cursor:pointer; border-radius:8px; font-size:12.5px; border-left:4px solid #3498db;";
            card.textContent = texto;
            card.onclick = () => {
                if(tipo === 'resumen') document.getElementById('p-sobremi').innerText = texto;
                else {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${cargo}</strong><br>${texto}`;
                    document.getElementById('p-experiencia').appendChild(li);
                }
            };
            panel.appendChild(card);
        });
    } catch (e) { panel.innerHTML = "<h4>⚠️ El servidor está despertando. Reintenta.</h4>"; }
}