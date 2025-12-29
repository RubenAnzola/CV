from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos con todas las secciones nuevas
class CVData(BaseModel):
    id: str
    nombre: str
    titulo: str
    email: str
    sobremi: str
    experiencia: str
    herramientas: str
    cursos: str
    idiomas: str
    color: str

class IAQuery(BaseModel):
    titulo: str

cvs_db = {}

@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    profesion = query.titulo.lower()
    
    conocimiento = {
        "desarrollador": {
            "resumen": "Desarrollador enfocado en soluciones escalables y código limpio. Experto en optimizar procesos y resolver problemas complejos.",
            "logros": "• Diseño de arquitecturas de microservicios.\n• Optimización de bases de datos.\n• Implementación de CI/CD."
        },
        "vendedor": {
            "resumen": "Profesional de ventas orientado a objetivos con amplia experiencia en negociación estratégica y fidelización de clientes.",
            "logros": "• Incremento de ventas trimestrales en un 25%.\n• Liderazgo de campañas de prospección.\n• Gestión experta de CRM."
        }
    }

    default = {
        "resumen": "Profesional proactivo comprometido con la excelencia y el crecimiento dentro de equipos dinámicos.",
        "logros": "• Gestión de proyectos cumpliendo plazos.\n• Mejora de la comunicación interna.\n• Resolución proactiva de incidencias."
    }

    return conocimiento.get(profesion, default)

@app.post("/guardar-cv")
def guardar_cv(data: CVData):
    cvs_db[data.id] = data.model_dump()
    return {"status": "success", "message": "CV guardado correctamente"}

@app.get("/recuperar-cv/{codigo}")
def recuperar_cv(codigo: str):
    if codigo in cvs_db: return cvs_db[codigo]
    raise HTTPException(status_code=404, detail="CV no encontrado")