from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Configuración de CORS para permitir conexión desde GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELO DE DATOS ---
class CVData(BaseModel):
    id: str  # Usaremos el email como identificador único
    nombre: str
    titulo: str
    email: str
    sobremi: str
    experiencia: str
    color: str

# Base de datos temporal (en memoria)
cvs_db = {}

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "Generador de CV Online activo"}

# 1. Guardar o actualizar un CV
@app.post("/guardar-cv")
def guardar_cv(data: CVData):
    # Guardamos los datos usando el ID (email) como llave
    cvs_db[data.id] = data.model_dump()
    return {
        "status": "success",
        "message": "CV guardado correctamente",
        "id_recuperacion": data.id
    }

# 2. Recuperar un CV existente
@app.get("/recuperar-cv/{codigo}")
def recuperar_cv(codigo: str):
    if codigo in cvs_db:
        return cvs_db[codigo]
    raise HTTPException(status_code=404, detail="No se encontró ningún CV con ese código")

# 3. Listar todos los IDs guardados (opcional para debug)
@app.get("/debug-cvs")
def debug_cvs():
    return {"total": len(cvs_db), "codigos_disponibles": list(cvs_db.keys())}