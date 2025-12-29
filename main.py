import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Render leerá la clave desde las variables de entorno
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class IAQuery(BaseModel):
    titulo: str

@app.get("/")
def home():
    return {"status": "IA de Google Conectada"}

@app.post("/generar-IA")
async def generar_ia(query: IAQuery):
    try:
        prompt = f"""
        Actúa como experto en RRHH. Para el cargo de '{query.titulo}', genera:
        1. Seis resúmenes profesionales (máximo 4 líneas) elegantes y orgánicos.
        2. Seis logros laborales detallados y potentes para este cargo.
        Responde SOLO en formato JSON: 
        {{"resumenes": ["opcion1",...], "logros": ["logro1",...]}}
        """
        response = model.generate_content(prompt)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        return {
            "opciones_resumen": data['resumenes'],
            "opciones_logros": data['logros']
        }
    except Exception as e:
        return {"error": str(e), "opciones_resumen": ["Error al generar opciones"], "opciones_logros": []}