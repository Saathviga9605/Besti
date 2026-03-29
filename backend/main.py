from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from typing import Dict, List
from models import ChatRequest, ChatResponse, Message, PersonalityConfig
from services import llm_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Besti API", version="2.0")

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
    logger.info("Health check called")
    return {"message": "Besti API is running", "status": "ok"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    
    try:
        logger.info(f"Chat request from user: {request.user_id}")
        
        user_id = request.user_id
        user_message = request.message
        
        if not user_message or not user_message.strip():
            logger.warning(f"Empty message from user: {user_id}")
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        personality = request.personality or PersonalityConfig()
        
        # Initialize chat history for user if not exists
        if user_id not in chat_histories:
            chat_histories[user_id] = []
            logger.info(f"Created new chat history for user: {user_id}")
        
        # Get AI name from preferences (default: Luna)
        ai_name = user_preferences.get(user_id, {}).get("ai_name", "Luna")
        
        # Add user message to history
        chat_histories[user_id].append(Message(role="user", content=user_message))
        logger.info(f"Added user message to history. History length: {len(chat_histories[user_id])}")
        
        # Get AI response
        logger.info(f"Requesting AI response for user: {user_id}")
        ai_response = llm_service.chat(
            user_message=user_message,
            history=chat_histories[user_id],
            personality=personality,
            ai_name=ai_name
        )
        logger.info(f"Received AI response (length: {len(ai_response)})")
        
        # Add AI response to history
        chat_histories[user_id].append(Message(role="assistant", content=ai_response))
        
        response = ChatResponse(response=ai_response, ai_name=ai_name)
        logger.info(f"Returning response for user: {user_id}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        error_message = f"Error processing chat: {str(e)}"
        logger.error(error_message, exc_info=True)
        raise HTTPException(status_code=500, detail=error_message)




@app.post("/preferences")
async def set_preferences(user_id: str, ai_name: str = "Luna", personality: PersonalityConfig = None):
    """Set user preferences for AI personality and name"""
    
    try:
        logger.info(f"Setting preferences for user: {user_id}")
        
        if user_id not in user_preferences:
            user_preferences[user_id] = {}
        
        user_preferences[user_id]["ai_name"] = ai_name
        if personality:
            user_preferences[user_id]["personality"] = personality.dict()
        
        logger.info(f"Preferences saved for user: {user_id}")
        return {"status": "preferences_saved", "user_id": user_id, "ai_name": ai_name}
    
    except Exception as e:
        error_message = f"Error saving preferences: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


@app.get("/history/{user_id}")
async def get_history(user_id: str):
    """Get chat history for a user"""
    
    try:
        logger.info(f"Getting history for user: {user_id}")
        
        history = chat_histories.get(user_id, [])
        return {"user_id": user_id, "messages": [{"role": msg.role, "content": msg.content} for msg in history]}
    
    except Exception as e:
        error_message = f"Error fetching history: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


@app.post("/clear/{user_id}")
async def clear_history(user_id: str):
    """Clear chat history for a user"""
    
    try:
        logger.info(f"Clearing history for user: {user_id}")
        
        if user_id in chat_histories:
            chat_histories[user_id] = []
        
        return {"status": "history_cleared", "user_id": user_id}
    
    except Exception as e:
        error_message = f"Error clearing history: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


@app.get("/preferences/{user_id}")
async def get_preferences(user_id: str):
    """Get user preferences"""
    
    try:
        logger.info(f"Getting preferences for user: {user_id}")
        
        prefs = user_preferences.get(user_id, {
            "ai_name": "Luna",
            "personality": {
                "tone": "Caring",
                "energy": "Chill",
                "response_style": "Medium"
            }
        })
        
        return prefs
    
    except Exception as e:
        error_message = f"Error fetching preferences: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
