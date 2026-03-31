from pydantic import BaseModel
from typing import List, Optional, Union


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
    user_id: Union[int, str]  # Accept both int and str
    message: str
    personality: Optional[PersonalityConfig] = None
    message_id: Optional[int] = None  # For editing messages - if provided, updates existing message


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    response: str
    ai_name: str = "Luna"
    message_id: Optional[int] = None  # ID of the user message (for regeneration/editing)
