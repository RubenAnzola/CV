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

@app.get("/")
def home():
    return {"status": "Servidor Profesional Activo"}

@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    cargo = query.titulo.title()
    
    # --- PLANTILLAS CORPORATIVAS (MÁS COMPLETAS) ---
    plantillas_resumen = [
        f"Profesional altamente competente ejerciento como {cargo}, con una sólida trayectoria en la optimización de recursos y la implementación de estrategias que impulsan la eficiencia operativa.",
        f"{cargo} con visión estratégica y amplia experiencia en entornos exigentes. Especialista en liderar equipos multidisciplinarios y en la resolución proactiva de desafíos complejos.",
        f"Experto consolidado en el rol de {cargo}, comprometido con la excelencia técnica y la mejora continua. Destacada capacidad para gestionar proyectos críticos cumpliendo estrictos estándares de calidad.",
        f"Trayectoria probada como {cargo}, aportando soluciones innovadoras que incrementan la rentabilidad y el rendimiento. Habilidad innata para la comunicación efectiva y la negociación a nivel ejecutivo.",
        f"Perfil orientado a resultados como {cargo}, con un enfoque analítico para la toma de decisiones. Experto en identificar oportunidades de crecimiento y en la gestión integral del ciclo de vida de los proyectos.",
        f"Como {cargo}, combino conocimientos técnicos avanzados con habilidades de gestión para entregar resultados superiores. Enfocado en la satisfacción del cliente y en el desarrollo sostenible del negocio.",
        f"Especialista proactivo en funciones de {cargo}, reconocido por la capacidad de adaptación a nuevas tecnologías y mercados cambiantes, garantizando siempre la continuidad operativa.",
        f"{cargo} apasionado por la innovación y el trabajo colaborativo. Historial comprobado de éxitos en la transformación de procesos y en la elevación de los estándares de servicio."
    ]

    plantillas_logros = [
        f"Diseño y ejecución de un plan estratégico como {cargo} que resultó en un incremento del 25% en la productividad anual del departamento.",
        f"Liderazgo de un equipo de alto rendimiento en tareas de {cargo}, logrando reducir los tiempos de entrega en un 30% mediante metodologías ágiles.",
        f"Implementación exitosa de nuevos protocolos de seguridad y calidad inherentes al rol de {cargo}, alcanzando una tasa de cumplimiento del 100%.",
        f"Gestión eficiente de presupuestos y recursos como {cargo}, logrando un ahorro de costes operativos del 15% sin sacrificar la calidad final.",
        f"Desarrollo de alianzas estratégicas clave y negociación con proveedores en mi gestión como {cargo}, mejorando la cadena de valor de la empresa.",
        f"Reconocimiento corporativo al 'Mejor Desempeño' por la resolución crítica de incidencias complejas actuando como {cargo} senior.",
        f"Capacitación y mentoría de personal junior en técnicas avanzadas de {cargo}, elevando el nivel técnico general del equipo.",
        f"Supervisión directa de proyectos de gran envergadura como {cargo}, asegurando la entrega a tiempo y bajo las especificaciones del cliente."
    ]

    # Mezclamos y devolvemos 6 opciones
    random.shuffle(plantillas_resumen)
    random.shuffle(plantillas_logros)

    return {
        "opciones_resumen": plantillas_resumen[:6],
        "opciones_logros": plantillas_logros[:6]
    }