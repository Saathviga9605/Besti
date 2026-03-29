from pydantic import BaseModel
from typing import List, Optional


class PersonalityConfig(BaseModel):
    """AI personality configuration"""
    tone: str = "Caring"  # Caring, Funny, Sarcastic, Protective, Romantic
    energy: str = "Chill"  # Chill, Chaotic, Deep
    response_style: str = "Medium"  # Short, Medium, Long, Emoji-heavy


class Message(BaseModel):
    """Individual message in chat history"""
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    user_id: str
    message: str
    personality: Optional[PersonalityConfig] = None


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    response: str
    ai_name: str = "Luna"
