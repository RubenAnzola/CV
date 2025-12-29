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

# Render leerá la clave automáticamente desde la variable de entorno que configuraste
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class IAQuery(BaseModel):
    titulo: str

@app.get("/")
def home():
    return {"status": "IA Real de Google Conectada"}

@app.post("/generar-IA")
async def generar_ia(query: IAQuery):
    try:
        # Prompt para generar contenido profesional y orgánico
        prompt = f"""
        Actúa como un experto en reclutamiento. Para el cargo de '{query.titulo}', genera:
        1. Seis resúmenes profesionales diferentes, orgánicos y de alto nivel (máximo 3 líneas cada uno).
        2. Seis logros profesionales breves y potentes para la sección de experiencia.
        Responde estrictamente en formato JSON con dos listas: 'resumenes' y 'logros'.
        """
        
        response = model.generate_content(prompt)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        
        return {
            "opciones_resumen": data['resumenes'],
            "opciones_logros": data['logros']
        }
    except Exception as e:
        return {"error": str(e), "opciones_resumen": ["Error al conectar con la IA de Google"], "opciones_logros": []}