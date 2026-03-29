from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from typing import Dict, List
from models import ChatRequest, ChatResponse, Message, PersonalityConfig
from services import llm_service

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Besti API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for chat history
chat_histories: Dict[str, List[Message]] = {}
user_preferences: Dict[str, Dict] = {}  # Store AI name and personality preferences


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Besti API is running"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    
    user_id = request.user_id
    user_message = request.message
    personality = request.personality or PersonalityConfig()
    
    # Initialize chat history for user if not exists
    if user_id not in chat_histories:
        chat_histories[user_id] = []
    
    # Get AI name from preferences (default: Luna)
    ai_name = user_preferences.get(user_id, {}).get("ai_name", "Luna")
    
    # Add user message to history
    chat_histories[user_id].append(Message(role="user", content=user_message))
    
    # Get AI response
    ai_response = llm_service.chat(
        user_message=user_message,
        history=chat_histories[user_id],
        personality=personality,
        ai_name=ai_name
    )
    
    # Add AI response to history
    chat_histories[user_id].append(Message(role="assistant", content=ai_response))
    
    return ChatResponse(response=ai_response, ai_name=ai_name)


@app.post("/preferences")
async def set_preferences(user_id: str, ai_name: str = "Luna", personality: PersonalityConfig = None):
    """Set user preferences for AI personality and name"""
    
    if user_id not in user_preferences:
        user_preferences[user_id] = {}
    
    user_preferences[user_id]["ai_name"] = ai_name
    if personality:
        user_preferences[user_id]["personality"] = personality.dict()
    
    return {"status": "preferences_saved", "user_id": user_id, "ai_name": ai_name}


@app.get("/history/{user_id}")
async def get_history(user_id: str):
    """Get chat history for a user"""
    
    history = chat_histories.get(user_id, [])
    return {"user_id": user_id, "messages": history}


@app.post("/clear/{user_id}")
async def clear_history(user_id: str):
    """Clear chat history for a user"""
    
    if user_id in chat_histories:
        chat_histories[user_id] = []
    
    return {"status": "history_cleared", "user_id": user_id}


@app.get("/preferences/{user_id}")
async def get_preferences(user_id: str):
    """Get user preferences"""
    
    prefs = user_preferences.get(user_id, {
        "ai_name": "Luna",
        "personality": {
            "tone": "Caring",
            "energy": "Chill",
            "response_style": "Medium"
        }
    })
    
    return prefs


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
