import json
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware

from closing_conversion import excel
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ton front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    title: str
    message: str

@app.get('/')
def index():
    return {"message": "Hello world"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Lire le contenu du fichier
    content = await file.read()

    try:
        data = json.loads(content.decode("utf-8"))
    except Exception as e:
        return {"message": "Erreur lors de la lecture du fichier", "error": str(e)}

    return {
        "message": "Fichier reçu et lu avec succès ✅",
        "filename": file.filename,
        "data": data
    }

@app.post('/download-closing')
async def download_excel(file: UploadFile = File(...)):
    if file.content_type != "application/json":
        return {"error": "Le fichier doit etre de type json"}

    content = await file.read()
    
    try:
        data = json.loads(content)
        excel_file = excel.create_closing_excel(data)
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={file.filename}.xlsx"}
        )
    except json.JSONDecodeError:
        return {"error": "Fichier JSON invalide"}


@app.post('/items')
def create_item(item : list[Item]):
    return {
        "message": "Item received",
        "item": item
    }
