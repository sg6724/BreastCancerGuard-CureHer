from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import logging
from datetime import timedelta

# from database import get_db, engine
# from sqlalchemy.orm import Session
# import models, schemas, auth
# from models import Base

# Create database tables
# Base.metadata.create_all(bind=engine)
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173",  # Add your frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post("/token", response_model=schemas.Token)
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = auth.authenticate_user(db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = auth.create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.post("/register", response_model=schemas.User)
# async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     # Check if username already exists
#     db_user = db.query(models.User).filter(models.User.username == user.username).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
    
#     # Check if email already exists
#     db_user = db.query(models.User).filter(models.User.email == user.email).first()
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     # Create new user with hashed password
#     hashed_password = auth.get_password_hash(user.password)
#     db_user = models.User(
#         username=user.username,
#         email=user.email,
#         password=hashed_password,
#         full_name=user.full_name
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @app.get("/users/me", response_model=schemas.User)
# async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
#     return current_user
class BatchDiagnosisRequest(BaseModel):
    patients: list[list[float]]


class DiagnosisRequest(BaseModel):
    features: list

# Load models and scaler
scaler = joblib.load("models/scaler.pkl")
gmm_model = joblib.load("models/cluster_model.pkl")
rf_model = joblib.load("models/rf_model.pkl")
cluster_to_diagnosis = joblib.load("models/cluster_to_diagnosis.joblib")


@app.post("/api/batch-diagnose")
def batch_diagnose(request: BatchDiagnosisRequest):
    try:
        if not request.patients:
            raise ValueError("No patient data received")

        features_array = np.array(request.patients)
        if features_array.shape[1] != scaler.n_features_in_:
            raise ValueError(f"Expected {scaler.n_features_in_} features, but got {features_array.shape[1]}")

        features_scaled = scaler.transform(features_array)
        clusters = gmm_model.predict(features_scaled)
        confidences = np.max(gmm_model.predict_proba(features_scaled), axis=1)
        diagnoses = [cluster_to_diagnosis[c] for c in clusters]

        results = [
            {"patient_id": i + 1, "diagnosis": diagnoses[i], "confidence": float(confidences[i])}
            for i in range(len(diagnoses))
        ]

        return {"summary": {"total_patients": len(diagnoses)}, "results": results}
    except Exception as e:
        logger.error(f"Error in /api/batch-diagnose: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/diagnose")
def diagnose(request: DiagnosisRequest):
    try:
        features = np.array(request.features).reshape(1, -1)
        if features.shape[1] != scaler.n_features_in_:
            raise ValueError(f"Expected {scaler.n_features_in_} features, but got {features.shape[1]}")

        features_scaled = scaler.transform(features)

        # Using Gaussian Mixture Model
        diagnosis_cluster = gmm_model.predict(features_scaled)[0]
        diagnosis = cluster_to_diagnosis[diagnosis_cluster]
        confidence = max(gmm_model.predict_proba(features_scaled)[0])

        return {
            "diagnosis": diagnosis,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error in /diagnose: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/recommendations")
def recommendations(request: DiagnosisRequest):
    try:
        logger.info(f"Received features for recommendations: {request.features}")
        features = np.array(request.features).reshape(1, -1)
        if features.shape[1] != scaler.n_features_in_:
            raise ValueError(f"Expected {scaler.n_features_in_} features, but got {features.shape[1]}")
        
        logger.info("Features reshaped successfully")

        features_scaled = scaler.transform(features)
        
        logger.info("Features scaled successfully")

        diagnosis = rf_model.predict(features_scaled)[0]
        probabilities = rf_model.predict_proba(features_scaled)[0]
        confidence = max(probabilities)
        
        logger.info(f"Diagnosis: {diagnosis}, Confidence: {confidence}")

        if diagnosis == 4:
            recommendation = """
            Urgent Recommendations:
            - Consult an Oncologist Immediately: Discuss treatment options like surgery, chemotherapy, radiation, targeted therapy, or immunotherapy. Get a second opinion if needed.
            - Biopsy & Staging: Identify cancer stage and spread (localized or metastatic).
            - Genetic Testing: If family history exists, check for BRCA1/BRCA2 mutations.

            Treatment-Based Recommendations:
            - Surgery: Lumpectomy (removal of the tumor) or mastectomy (removal of the breast).
            - Radiation Therapy: Used post-surgery to kill remaining cancer cells.
            - Chemotherapy: Used if cancer is aggressive or has spread.
            - Hormone Therapy (if ER+/PR+ cancer): Medications like Tamoxifen or Aromatase inhibitors to block hormones.
            - Targeted Therapy (if HER2+ cancer): Drugs like Herceptin (Trastuzumab) for HER2-positive cases.

            Lifestyle & Support Recommendations:
            - Diet & Nutrition: Increase antioxidants, omega-3s, and fiber. Reduce processed foods and high-sugar diets.
            - Exercise & Physical Activity: Stay active but avoid excessive strain.
            - Mental Health Support: Join support groups, therapy, or counseling.
            - Financial & Social Support: Guide patients on insurance, treatment funds, and caregiver support.

            Follow-Up Care:
            - Frequent doctor visits (every few months in the first years).
            - Regular scans & blood tests to monitor progress.
            - Long-term hormone therapy or medication adherence if prescribed.
            """
        else:
            recommendation = """
            General Recommendations:
            - Regular Monitoring: Follow up with a doctor for periodic breast exams and imaging (ultrasound/mammogram) as advised.
            - Healthy Lifestyle: Maintain a balanced diet rich in fruits, vegetables, and whole grains. Exercise regularly to maintain a healthy weight. Limit alcohol consumption and avoid smoking.
            - Breast Self-Exams: Perform monthly self-examinations to detect any changes.
            - Hormonal Balance: If on hormone therapy, discuss risks with a doctor.
            - Manage Stress: Yoga, meditation, and mindfulness exercises can help.

            When to Seek Medical Attention Again?
            - If there are new lumps, pain, or changes in breast size or shape.
            - If there is nipple discharge or skin changes (redness, dimpling).
            - If any other unusual breast symptoms appear.
            """

        logger.info("Recommendation generated successfully")

        return {
            "recommendation": recommendation,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error in /recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Breast Cancer Diagnosis and Recommendation System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

