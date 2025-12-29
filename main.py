from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class IAQuery(BaseModel):
    titulo: str

@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    # Tomamos la profesión y la ponemos bonita (ej: "ingeniero" -> "Ingeniero")
    cargo = query.titulo.title()
    
    # --- CEREBRO DINÁMICO ---
    # Estas plantillas funcionan para CUALQUIER cargo
    
    plantillas_resumen = [
        f"Profesional consolidado como {cargo}, con una sólida trayectoria enfocada en la eficiencia operativa y la consecución de objetivos estratégicos.",
        f"Experto en el área de {cargo} con habilidades demostradas para liderar iniciativas complejas y aportar soluciones innovadoras al equipo.",
        f"Como {cargo}, me caracterizo por mi capacidad de adaptación, aprendizaje continuo y enfoque en la calidad del servicio.",
        f"{cargo} altamente motivado, con experiencia práctica y un firme compromiso con el desarrollo profesional y el trabajo en equipo.",
        f"Especialista ejerciendo como {cargo}, orientado a resultados y con gran capacidad para la resolución de problemas bajo presión."
    ]

    plantillas_logros = [
        f"Optimización de procesos clave relacionados con las funciones de {cargo}, mejorando la productividad en un 20%.",
        f"Liderazgo exitoso de proyectos en el rol de {cargo}, cumpliendo con todos los plazos y estándares de calidad.",
        f"Implementación de nuevas metodologías para modernizar las tareas habituales de {cargo}.",
        "Reconocimiento por desempeño sobresaliente y contribución proactiva al éxito del departamento.",
        f"Capacitación y mentoría de nuevos miembros del equipo en prácticas de {cargo}."
    ]

    # Mezclamos las opciones para que siempre parezcan frescas
    random.shuffle(plantillas_resumen)
    random.shuffle(plantillas_logros)

    # Devolvemos las 3 mejores opciones generadas
    return {
        "opciones_resumen": plantillas_resumen[:3],
        "opciones_logros": plantillas_logros[:3]
    }