from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse # 1. Import this to handle special characters

# 2. Put your actual password inside the quotes here
# quote_plus safely converts symbols like '@' into URL-safe characters (like '%40')
password = urllib.parse.quote_plus("Arya_shinde@1") 

# 3. Use an 'f-string' to inject the safely encoded password
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{password}@localhost:3306/reimburse_ai"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()