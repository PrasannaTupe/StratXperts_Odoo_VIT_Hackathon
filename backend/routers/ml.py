from fastapi import APIRouter, UploadFile, File
import time
from pydantic import BaseModel

router = APIRouter(prefix="/ml", tags=["AI & ML"])

class ChatRequest(BaseModel):
    user_id: int
    message: str

@router.post("/ocr-receipt")
async def parse_receipt_mock(file: UploadFile = File(...)):
    time.sleep(1.5) 
    mock_ai_response = {
        "amount": 1450.00,
        "currency": "USD",
        "date": "2024-10-24",
        "vendor_name": "Tech Conference Alpha",
        "category": "Travel",
        "description": "Flight ticket and hotel booking"
    }
    return {"status": "success", "file_name": file.filename, "extracted_data": mock_ai_response}

@router.post("/chat")
async def ai_chatbot(data: ChatRequest):
    time.sleep(1) # Simulate AI typing
    
    # Mock intelligent routing based on keywords
    msg = data.message.lower()
    if "pending" in msg or "status" in msg:
        reply = "You currently have 1 expense pending approval for $1,450.00 (Tech Conference Alpha). It is currently waiting on your manager's review."
    elif "policy" in msg or "allowance" in msg:
        reply = "According to company policy, meal allowances are capped at $50 per day, and flights must be booked in economy class."
    else:
        reply = "I am your ReimburseAI assistant. I can help you check expense statuses or answer policy questions! What do you need?"
        
    return {"reply": reply}