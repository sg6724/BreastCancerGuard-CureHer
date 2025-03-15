from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Diagnosis schemas
class DiagnosisRequest(BaseModel):
    features: List[float]

class DiagnosisResponse(BaseModel):
    diagnosis: str
    confidence: float

class DiagnosisCreate(BaseModel):
    diagnosis_result: str
    confidence: float
    clump_thickness: float
    uniformity_cell_size: float
    uniformity_cell_shape: float
    marginal_adhesion: float
    single_epithelial_cell_size: float
    bare_nuclei: float
    bland_chromatin: float
    normal_nucleoli: float
    mitoses: float

class DiagnosisResponse(DiagnosisCreate):
    id: int
    user_id: int
    diagnosis_date: datetime
    
    class Config:
        orm_mode = True