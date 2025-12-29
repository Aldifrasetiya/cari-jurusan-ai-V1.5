import uvicorn
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="API Cari Jurusan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = joblib.load('model/model_cari_jurusan_v1.5.pkl')
    print("✅ Model AI berhasil dimuat!")
except FileNotFoundError:
    print("❌ ERROR: File model tidak ditemukan. Pastikan 'model_cari_jurusan_ai.pkl' ada di folder model.")
    model = None

class ScoreInput(BaseModel):
    logika: float
    verbal: float
    sosial: float
    kreatif: float
    analitis: float

@app.get("/")
def home():
    return {"message": "API Cari Jurusan AI is Running! 🚀"}

@app.post("/predict")
def predict_jurusan(scores: ScoreInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum dimuat di server.")
    
    input_data = pd.DataFrame([{
        'logika': scores.logika,
        'verbal': scores.verbal,
        'sosial': scores.sosial,
        'kreatif': scores.kreatif,
        'analitis': scores.analitis
    }])

    try:
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        class_names = model.classes_
        
        prob_dict = {
            class_name: float(prob) 
            for class_name, prob in zip(class_names, probabilities)
        }
        
        sorted_prob = dict(sorted(prob_dict.items(), key=lambda item: item[1], reverse=True))
        sorted_prob = dict(sorted(prob_dict.items(), key=lambda item: item[1], reverse=True))

        return {
            "prediction": prediction,
            "probabilities": sorted_prob
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)