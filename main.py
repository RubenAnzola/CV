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

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class IAQuery(BaseModel):
    titulo: str

@app.post("/generar-IA")
async def generar_ia(query: IAQuery):
    try:
        prompt = f"""
        Actúa como experto en reclutamiento. Para el cargo o profesión de '{query.titulo}', genera:
        1. Seis (6) resúmenes profesionales (perfil) elegantes y atractivos (máximo 4 líneas).
        2. Seis (6) logros laborales detallados, cuantificables y potentes específicos para este rol.
        Responde SOLO en formato JSON estricto: 
        {{"resumenes": ["opcion1",...], "logros": ["logro1",...]}}
        """
        response = model.generate_content(prompt)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        return {
            "opciones_resumen": data.get('resumenes', []),
            "opciones_logros": data.get('logros', [])
        }
    except Exception as e:
        return {"error": str(e), "opciones_resumen": ["Error generando opciones"], "opciones_logros": []}