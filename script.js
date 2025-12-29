const API_URL = 'https://cv-gmiv.onrender.com';

// 1. SINCRONIZACIÓN NOMBRE
const inNom = document.getElementById('in-nombre');
const inApe = document.getElementById('in-apellido');
function updateName() {
    const full = `${inNom.value} ${inApe.value}`.trim() || "NOMBRE APELLIDO";
    document.getElementById('p-nombre-completo').innerText = full.toUpperCase();
}
inNom.addEventListener('input', updateName);
inApe.addEventListener('input', updateName);

// 2. SINCRONIZACIÓN CONTACTO
const simpleFields = {
    'in-profesion': 'p-titulo-cv',
    'in-tlf': 'p-tlf',
    'in-email': 'p-email',
    'in-ubicacion': 'p-ubicacion'
};
Object.entries(simpleFields).forEach(([inId, outId]) => {
    document.getElementById(inId).addEventListener('input', (e) => {
        document.getElementById(outId).innerText = e.target.value;
    });
});

// 3. LOGICA EDUCACIÓN (4 campos -> 1 bloque)
const eduInputs = ['in-edu-inst', 'in-edu-tit', 'in-edu-ini', 'in-edu-fin'];
eduInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateEducacion);
});

function updateEducacion() {
    const inst = document.getElementById('in-edu-inst').value;
    const tit = document.getElementById('in-edu-tit').value;
    const ini = document.getElementById('in-edu-ini').value;
    const fin = document.getElementById('in-edu-fin').value;
    
    // Formato: Título <br> Institución <br> Año - Año
    let html = "";
    if (tit) html += `<strong>${tit}</strong><br>`;
    if (inst) html += `${inst}<br>`;
    if (ini || fin) html += `<small style="color:#666">${ini} - ${fin}</small>`;
    
    document.getElementById('p-educacion-container').innerHTML = html;
}

// 4. HABILIDADES
document.getElementById('in-habilidades').addEventListener('input', (e) => {
    const items = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    const html = items.map(i => `<li>${i}</li>`).join('');
    document.getElementById('p-habilidades').innerHTML = html;
});

// 5. IA GEMINI (Manejo de Cargo Específico)
async function pedirOpcionesIA(tipo) {
    let cargoParaIA = "";
    const panel = document.getElementById('ai-suggestions');

    // Si pedimos logros, usamos el campo "Cargo" de experiencia, si no, el general
    if (tipo === 'experiencia') {
        cargoParaIA = document.getElementById('in-exp-cargo').value;
        if (!cargoParaIA) return alert("Por favor, escribe el CARGO en la sección de Experiencia.");
    } else {
        cargoParaIA = document.getElementById('input-titulo-ia').value;
        if (!cargoParaIA) return alert("Escribe tu profesión en la sección de Perfil IA.");
    }

    panel.innerHTML = `<div class='ai-card-float' style='text-align:center; color:#555;'>🧠 Analizando ${cargoParaIA}...</div>`;

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: cargoParaIA })
        });
        const data = await res.json();
        
        panel.innerHTML = `<h4>Sugerencias para: ${cargoParaIA}</h4>`;
        const opciones = tipo === 'resumen' ? data.opciones_resumen : data.opciones_logros;

        opciones.forEach(texto => {
            const card = document.createElement('div');
            card.className = "ai-card-float";
            card.textContent = texto;
            card.onclick = () => {
                if(tipo === 'resumen') {
                    document.getElementById('p-sobremi').innerText = texto;
                } else {
                    const empresa = document.getElementById('in-exp-empresa').value || "Empresa";
                    const li = document.createElement('li');
                    // Formato Logro: Cargo | Empresa + Texto IA
                    li.innerHTML = `<strong>${cargoParaIA}</strong> | ${empresa}<br>${texto}`;
                    document.getElementById('p-experiencia').appendChild(li);
                }
            };
            panel.appendChild(card);
        });
    } catch (e) { panel.innerHTML = "<h4>Error de conexión.</h4>"; }
}

// 6. FOTO
function cargarFoto(e) {
    const reader = new FileReader();
    reader.onload = () => {
        const img = document.getElementById('img-preview');
        img.src = reader.result;
        document.getElementById('marco-foto').classList.add('visible');
    };
    reader.readAsDataURL(e.target.files[0]);
}
function toggleFormaFoto() { document.getElementById('marco-foto').classList.toggle('circle'); }
function moverFotoX(v) { document.getElementById('img-preview').style.objectPosition = `${v}% 50%`; }
function moverFotoY(v) { document.getElementById('img-preview').style.objectPosition = `50% ${v}%`; }