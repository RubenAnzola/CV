// ... (mantiene las funciones de carga de foto y moverFoto) ...

async function pedirOpcionesIA(tipo) {
    const cargo = document.getElementById('input-titulo').value;
    const panel = document.getElementById('ai-suggestions');
    if(!cargo) return alert("Por favor, introduce tu cargo.");

    panel.innerHTML = "<div class='ai-card'>🧠 La IA está redactando sugerencias premium...</div>";

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
            card.style = "background:white; padding:15px; margin-bottom:12px; border:1px solid #eee; cursor:pointer; border-radius:8px; font-size:12.5px; transition: 0.2s; border-left: 4px solid #3498db;";
            card.textContent = texto;
            
            card.onclick = () => {
                if(tipo === 'resumen') {
                    document.getElementById('p-sobremi').innerText = texto;
                } else {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${cargo}</strong> | Empresa<br>${texto}`;
                    document.getElementById('p-experiencia').appendChild(li);
                }
            };
            panel.appendChild(card);
        });
    } catch (e) { 
        panel.innerHTML = "<h4>Servidor despertando... reintenta en 15 seg.</h4>"; 
    }
}