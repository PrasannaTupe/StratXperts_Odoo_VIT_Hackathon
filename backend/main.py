from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, get_db
import models

# --- IMPORT ALL ROUTERS ---
from routers import auth, users, expenses, ml, rules, approvals

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReimburseAI API")

# --- CRITICAL CORS FIX ---
# This must come BEFORE include_router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE ALL ROUTERS ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(ml.router)
app.include_router(rules.router)
app.include_router(approvals.router)

@app.get("/")
def health_check():
    return {"status": "success", "message": "ReimburseAI Backend is Live!"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "MySQL Database connected flawlessly!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")