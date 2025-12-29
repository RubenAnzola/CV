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
    
    plantillas_resumen = [
        f"Profesional altamente competente ejerciendo como {cargo}, con una sólida trayectoria en la optimización de recursos y la implementación de estrategias que impulsan la eficiencia operativa.",
        f"{cargo} con visión estratégica y amplia experiencia en entornos exigentes. Especialista en liderar equipos multidisciplinarios y en la resolución proactiva de desafíos complejos.",
        f"Experto consolidado en el rol de {cargo}, comprometido con la excelencia técnica y la mejora continua. Destacada capacidad para gestionar proyectos críticos cumpliendo estándares internacionales.",
        f"Trayectoria probada como {cargo}, aportando soluciones innovadoras que incrementan la rentabilidad. Habilidad innata para la comunicación efectiva y la negociación a nivel corporativo.",
        f"Perfil orientado a resultados como {cargo}, con un enfoque analítico para la toma de decisiones. Experto en identificar oportunidades de crecimiento y gestión integral de proyectos.",
        f"Especialista proactivo en funciones de {cargo}, reconocido por la capacidad de adaptación a nuevas tecnologías, garantizando siempre la continuidad y excelencia operativa."
    ]

    plantillas_logros = [
        f"Diseño y ejecución de un plan estratégico como {cargo} que resultó en un incremento del 25% en la productividad anual.",
        f"Liderazgo de un equipo de alto rendimiento en tareas de {cargo}, logrando reducir los tiempos de entrega en un 30%.",
        f"Implementación exitosa de nuevos protocolos de calidad inherentes al rol de {cargo}, alcanzando una tasa de cumplimiento del 100%.",
        f"Gestión eficiente de presupuestos y recursos como {cargo}, logrando un ahorro de costes operativos del 15% anual.",
        f"Desarrollo de alianzas estratégicas clave y negociación con proveedores en mi gestión como {cargo}.",
        f"Reconocimiento corporativo por la resolución de incidencias complejas actuando como {cargo} senior."
    ]

    random.shuffle(plantillas_resumen)
    random.shuffle(plantillas_logros)

    return {
        "opciones_resumen": plantillas_resumen[:6],
        "opciones_logros": plantillas_logros[:6]
    }