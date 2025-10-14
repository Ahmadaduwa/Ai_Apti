from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()

class AnalyzeRequest(BaseModel):
    student_id: str
    features: Dict[str, float] | None = None

class AnalyzeResponse(BaseModel):
    student_id: str
    recommended_tracks: List[str]
    confidence_scores: Dict[str, float]
    explanation_text: str

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    # MVP stub: simple rules-based demo
    tracks = ["Engineering", "Computer Science", "Business"]
    confidences = {"Engineering": 0.8, "Computer Science": 0.75, "Business": 0.6}
    explanation = "Rule-based stub: strong math/science indicators."
    return AnalyzeResponse(
        student_id=req.student_id,
        recommended_tracks=tracks,
        confidence_scores=confidences,
        explanation_text=explanation,
    )


