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

@app.get("/")
def home():
    return {"status": "IA CV Engine Active"}

# --- LÓGICA DE IA MEJORADA ---
@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    profesion = query.titulo.lower()
    
    conocimiento = {
        "desarrollador": {
            "resumen": "Desarrollador enfocado en soluciones escalables y código limpio. Experto en optimizar procesos y resolver problemas complejos mediante tecnología.",
            "logros": "• Diseño y despliegue de arquitecturas de microservicios.\n• Optimización de bases de datos reduciendo latencia en un 40%.\n• Implementación de CI/CD para despliegues automatizados."
        },
        "vendedor": {
            "resumen": "Profesional de ventas orientado a objetivos con amplia experiencia en negociación estratégica y fidelización de carteras de clientes clave.",
            "logros": "• Incremento de ventas trimestrales en un 25%.\n• Liderazgo de campañas de prospección en mercados internacionales.\n• Gestión experta de CRM para optimizar el embudo de ventas."
        },
        "admin": {
            "resumen": "Administrador con alta capacidad analítica y gestión eficiente de recursos, enfocado en la mejora continua de procesos operativos.",
            "logros": "• Reducción de costes operativos en un 15% mediante auditoría interna.\n• Coordinación de equipos multidisciplinarios de más de 10 personas.\n• Implementación de nuevas políticas de gestión de inventarios."
        }
    }

    # Respuesta genérica si no existe la profesión
    default = {
        "resumen": "Profesional proactivo con sólida formación y compromiso con la excelencia operativa y el crecimiento dentro de equipos dinámicos.",
        "logros": "• Gestión de proyectos cumpliendo plazos y presupuestos.\n• Mejora de la comunicación interna entre departamentos.\n• Resolución proactiva de incidencias técnicas y operativas."
    }

    return conocimiento.get(profesion, default)

@app.post("/guardar-cv")
def guardar_cv(data: CVData):
    cvs_db[data.id] = data.model_dump()
    return {"status": "success", "message": "CV guardado"}

@app.get("/recuperar-cv/{codigo}")
def recuperar_cv(codigo: str):
    if codigo in cvs_db: return cvs_db[codigo]
    raise HTTPException(status_code=404, detail="No encontrado")