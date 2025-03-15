from sqlalchemy import create_engine ## Creating the connectivity between the database and the application
from sqlalchemy.orm import sessionmaker ## Creating the session between the database and the application
## sqlalchemy session is used to interact with the database
from sqlalchemy.ext.declarative import declarative_base
## sqlalchemy declarative_base is used to create the base class for the database
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit =False , autoflush=False , bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()