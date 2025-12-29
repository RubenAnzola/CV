const API_URL = 'https://tareadiciembre.onrender.com'; 

const inputs = {
    nombre: document.getElementById('input-nombre'),
    titulo: document.getElementById('input-titulo'),
    email: document.getElementById('input-email'),
    sobremi: document.getElementById('input-sobremi'),
    experiencia: document.getElementById('input-experiencia'),
    herramientas: document.getElementById('input-herramientas'),
    cursos: document.getElementById('input-cursos'),
    idiomas: document.getElementById('input-idiomas')
};

const preview = {
    nombre: document.getElementById('p-nombre'),
    titulo: document.getElementById('p-titulo'),
    email: document.getElementById('p-email'),
    sobremi: document.getElementById('p-sobremi'),
    experiencia: document.getElementById('p-experiencia'),
    herramientas: document.getElementById('p-herramientas'),
    cursos: document.getElementById('p-cursos'),
    idiomas: document.getElementById('p-idiomas')
};

const papelCV = document.getElementById('cv-preview');

// Actualización en tiempo real
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
        preview[key].textContent = inputs[key].value || "...";
    });
});

// --- FUNCIONES DE IA ---
async function llamarIA(tipo) {
    const profesion = inputs.titulo.value;
    if (!profesion || profesion === "Tu Profesión") return alert("Escribe tu profesión primero.");

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "🪄 Pensando...";

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: profesion })
        });
        const data = await res.json();

        if (tipo === 'resumen') {
            inputs.sobremi.value = data.resumen;
            preview.sobremi.textContent = data.resumen;
        } else {
            inputs.experiencia.value = data.logros;
            preview.experiencia.textContent = data.logros;
        }
    } catch (err) {
        alert("El servidor está despertando, intenta de nuevo en segundos.");
    } finally {
        btn.textContent = originalText;
    }
}

function aplicarFuente(familia) {
    const fuentes = {
        'Lora': "'Lora', serif",
        'Roboto': "'Roboto', sans-serif",
        'Dancing Script': "'Dancing Script', cursive",
        'Playfair Display': "'Playfair Display', serif"
    };
    if (fuentes[familia]) papelCV.style.fontFamily = fuentes[familia];
}

// Colores e Impresión
document.querySelectorAll('.btn-color').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        document.documentElement.style.setProperty('--primary', color);
    });
});

document.getElementById('btn-descargar').addEventListener('click', () => window.print());