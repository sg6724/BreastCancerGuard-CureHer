import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String , ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer , primary_key = True , index = True)
    username = Column(String(50), unique = True )
    email =  Column(String(255) , unique = True , index = True)
    password = Column(String(255), nullable = False)
    
    diagnos = relationship("Diagnostics", back_populates = "user") ## back_populates is used to create the relationship between the two tables, it represents the variable name in the other table

class Diagnostics(Base):
    __tablename__ = 'diagnoses'
    id = Column(Integer , primary_key = True , index = True)
    user_id = Column(Integer , ForeignKey('users.id'))   
    diagnosis_date = Column(DateTime(timezone = True), default = datetime.now)
    disgnosis_result = Column(String(255))
    
    clump_thickness = Column(Float)
    uniformity_cell_size = Column(Float)
    uniformity_cell_shape = Column(Float)
    marginal_adhesion = Column(Float)
    single_epithelial_cell_size = Column(Float)
    bare_nuclei = Column(Float)
    bland_chromatin = Column(Float)
    normal_nucleoli = Column(Float)
    mitoses = Column(Float)
    
    user = relationship("User", back_populates = "diagnos")
