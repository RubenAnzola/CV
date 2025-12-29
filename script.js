
// --- CONFIGURACIÓN DE API ---
const API_URL = 'https://tareadiciembre.onrender.com'; 

// --- REFERENCIAS DEL DOM ---
const inputs = {
    nombre: document.getElementById('input-nombre'),
    titulo: document.getElementById('input-titulo'),
    email: document.getElementById('input-email'),
    sobremi: document.getElementById('input-sobremi'),
    experiencia: document.getElementById('input-experiencia')
};

const preview = {
    nombre: document.getElementById('p-nombre'),
    titulo: document.getElementById('p-titulo'),
    email: document.getElementById('p-email'),
    sobremi: document.getElementById('p-sobremi'),
    experiencia: document.getElementById('p-experiencia')
};

// --- 1. ACTUALIZACIÓN EN TIEMPO REAL ---
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
        preview[key].textContent = inputs[key].value || getDefaultText(key);
    });
});

function getDefaultText(key) {
    const defaults = {
        nombre: "Tu Nombre",
        titulo: "Tu Profesión",
        email: "correo@ejemplo.com",
        sobremi: "Aquí aparecerá tu descripción...",
        experiencia: "Detalles de tu experiencia laboral..."
    };
    return defaults[key];
}

// --- 2. MANEJO DE LA FOTO ---
const checkFoto = document.getElementById('check-foto');
const inputFoto = document.getElementById('input-foto');
const photoContainer = document.getElementById('preview-photo-container');
const imgPreview = document.getElementById('img-preview');
const papelCV = document.getElementById('cv-preview');

checkFoto.addEventListener('change', () => {
    inputFoto.style.display = checkFoto.checked ? 'block' : 'none';
    photoContainer.classList.toggle('hidden', !checkFoto.checked);
});

inputFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// --- NUEVO: CAMBIO DE FUENTE MEJORADO ---
function aplicarFuente(familia) {
    // Definimos el "mapa" de fuentes dentro de la función
    const fuentes = {
        'Lora': "'Lora', serif",
        'Roboto': "'Roboto', sans-serif",
        'Dancing Script': "'Dancing Script', cursive",
        'Playfair Display': "'Playfair Display', serif"
    };

    // Buscamos si la familia que pulsamos existe en nuestro mapa
    if (fuentes[familia]) {
        // Manipulación del DOM: Aplicamos el valor correspondiente
        papelCV.style.fontFamily = fuentes[familia];
        console.log(`Fuente actualizada a: ${familia}`);
    } else {
        console.warn("La fuente solicitada no está configurada.");
    }
}

// --- 3. SELECTOR DE COLORES ---
document.querySelectorAll('.btn-color').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        document.documentElement.style.setProperty('--primary', color);
        if(imgPreview) imgPreview.style.borderColor = color;
    });
});

// --- 4. GUARDAR EN LA API ---
async function guardarCV() {
    const email = inputs.email.value;
    if (!email) return alert("Por favor, ingresa un email para identificar tu CV");

    const cvData = {
        id: email,
        nombre: inputs.nombre.value,
        titulo: inputs.titulo.value,
        email: email,
        sobremi: inputs.sobremi.value,
        experiencia: inputs.experiencia.value,
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    };

    try {
        const res = await fetch(`${API_URL}/guardar-cv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cvData)
        });
        const result = await res.json();
        alert(result.message);
    } catch (err) {
        console.error("Error al guardar:", err);
        alert("No se pudo conectar con el servidor.");
    }
}

// --- 5. RECUPERAR DE LA API ---
async function recuperarCV() {
    const codigo = prompt("Ingresa el email con el que guardaste tu CV:");
    if (!codigo) return;

    try {
        const res = await fetch(`${API_URL}/recuperar-cv/${codigo}`);
        if (!res.ok) throw new Error("CV no encontrado");
        
        const data = await res.json();

        // Llenar formulario y preview
        Object.keys(inputs).forEach(key => {
            inputs[key].value = data[key];
            preview[key].textContent = data[key];
        });

        // Aplicar color guardado
        document.documentElement.style.setProperty('--primary', data.color);
        alert("¡CV cargado con éxito!");

    } catch (err) {
        alert(err.message);
    }
}

// --- 6. IMPRIMIR ---
document.getElementById('btn-descargar').addEventListener('click', () => {
    window.print();
});

// Agregamos botones dinámicamente o por ID si los creaste en el HTML
// Ejemplo: si tienes <button onclick="guardarCV()">Guardar</button>