// URL de tu servidor en Render
const API_URL = 'https://cv-gmiv.onrender.com'; 

// Sincronizar nombre del input al papel
function sincronizarNombre() {
    const nombreInput = document.getElementById('input-nombre-control').value;
    document.getElementById('p-nombre').textContent = nombreInput || "TU NOMBRE";
}

// Sincronizar título del input al papel automáticamente
document.getElementById('input-titulo').addEventListener('input', (e) => {
    document.getElementById('p-titulo').textContent = e.target.value || "Tu Profesión";
});

async function pedirOpcionesIA(tipo) {
    const profesion = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    
    if (!profesion) {
        alert("⚠️ Por favor, escribe tu profesión en la columna izquierda primero.");
        return;
    }

    // Mostrar estado de carga
    panel.innerHTML = `
        <h4>Pensando...</h4>
        <div class="ai-card" style="cursor: wait; opacity: 0.7;">
            🧠 Analizando el perfil de <strong>${profesion}</strong>...
            <br><small>Espera unos segundos...</small>
        </div>
    `;

    try {
        const res = await fetch(`${API_URL}/generar-IA`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: profesion })
        });
        
        if (!res.ok) throw new Error("Error en el servidor");

        const data = await res.json();
        
        // Limpiar panel
        panel.innerHTML = `<h4>Resultados para: ${profesion}</h4><p style="font-size:12px">Haz clic para añadir:</p>`;
        
        const opciones = tipo === 'resumen' ? data.opciones_resumen : data.opciones_logros;

        if (opciones.length === 0) {
            panel.innerHTML += "<p>No se encontraron sugerencias específicas.</p>";
            return;
        }

        opciones.forEach(texto => {
            const card = document.createElement('div');
            card.className = 'ai-card';
            card.textContent = texto;
            
            // Evento de clic para enviar al papel
            card.onclick = () => {
                if(tipo === 'resumen') {
                    // Reemplaza el texto del perfil
                    const perfilBox = document.getElementById('p-sobremi');
                    perfilBox.textContent = texto;
                    // Efecto visual de "flash" para indicar cambio
                    perfilBox.style.backgroundColor = "#dbeafe";
                    setTimeout(() => perfilBox.style.backgroundColor = "transparent", 500);
                } else {
                    // Añade una nueva viñeta a la experiencia
                    const lista = document.getElementById('p-experiencia');
                    const li = document.createElement('li');
                    li.textContent = texto;
                    lista.appendChild(li);
                    // Efecto visual
                    li.style.color = "#2563eb";
                    setTimeout(() => li.style.color = "black", 1000);
                }
            };
            panel.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        panel.innerHTML = `
            <h4>⚠️ Servidor Dormido</h4>
            <p>Como usamos Render Gratis, el servidor tarda 30 segundos en despertar.</p>
            <p><strong>¡Vuelve a pulsar el botón en 10 segundos!</strong></p>
        `;
    }
}