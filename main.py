from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS ---
class CVData(BaseModel):
    id: str  
    nombre: str
    titulo: str
    email: str
    sobremi: str
    experiencia: str
    color: str

# Modelo para la consulta de IA
class IAQuery(BaseModel):
    titulo: str

# Base de datos temporal
cvs_db = {}

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "Generador de CV Online activo"}

@app.post("/guardar-cv")
def guardar_cv(data: CVData):
    cvs_db[data.id] = data.model_dump()
    return {"status": "success", "message": "CV guardado correctamente"}

@app.get("/recuperar-cv/{codigo}")
def recuperar_cv(codigo: str):
    if codigo in cvs_db:
        return cvs_db[codigo]
    raise HTTPException(status_code=404, detail="No se encontró el CV")

# --- NUEVO: ASISTENTE DE IA ---
@app.post("/generar-IA")
def generar_ia(query: IAQuery):
    profesion = query.titulo.lower()
    sugerencias = {
        "desarrollador": "Desarrollador apasionado por crear soluciones tecnológicas eficientes. Experto en resolver problemas mediante código limpio y optimizado.",
        "vendedor": "Profesional orientado a resultados con gran capacidad de persuasión. Enfocado en superar metas de ventas y fidelizar clientes.",
        "diseñador": "Creativo visual con enfoque en la experiencia del usuario. Especialista en transformar ideas abstractas en diseños funcionales.",
        "admin": "Administrador organizado con alta capacidad analítica. Comprometido con la eficiencia operativa y la mejora de procesos."
    }
    
    resultado = "Profesional proactivo con sólida formación y deseos de contribuir al éxito del equipo aportando mis habilidades."
    
    for clave, texto in sugerencias.items():
        if clave in profesion:
            resultado = texto
            break
            
    return {"sugerencia": resultado}