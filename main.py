from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuración de CORS corregida para producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos robusto
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
    return {"status": "Servidor de IA para CV activo"}

# Endpoint de IA con más lógica
@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    profesion = query.titulo.lower()
    
    conocimiento = {
        "desarrollador": {
            "resumen": "Desarrollador con enfoque en arquitecturas escalables y optimización de código. Experto en resolver problemas mediante soluciones tecnológicas innovadoras.",
            "logros": "• Desarrollo de aplicaciones web de alto rendimiento.\n• Optimización de bases de datos reduciendo tiempos de carga.\n• Implementación de metodologías ágiles."
        },
        "vendedor": {
            "resumen": "Profesional de ventas con gran capacidad de negociación y cierre. Enfocado en la satisfacción del cliente y cumplimiento de metas comerciales.",
            "logros": "• Superación constante de cuotas de ventas trimestrales.\n• Expansión de cartera de clientes en un 30%.\n• Gestión eficiente de CRM y post-venta."
        }
    }

    default = {
        "resumen": "Profesional proactivo con capacidad de liderazgo y adaptabilidad, comprometido con el crecimiento organizacional y la excelencia.",
        "logros": "• Cumplimiento de objetivos en tiempos críticos.\n• Colaboración en equipos multidisciplinarios.\n• Propuesta de mejoras en procesos internos."
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