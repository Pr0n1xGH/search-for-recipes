import json
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from translators import translate_text


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    title: str
    summary: str

class ValueRequest(BaseModel):
    text: str

@app.post("/api/endpoint")
def ru_text(request: TextRequest):
    trn_title = translate_text(request.title, to_language='ru')
    trn_summary = translate_text(request.summary, to_language='ru')
    return {"new_title": trn_title, "new_summary": trn_summary}

@app.post("/api/endpoint/en")
def en_text(request: ValueRequest):
    trn_text = translate_text(request.text, to_language='en')
    return {"text": trn_text}

if __name__ == "__main__":
    uvicorn.run(app)