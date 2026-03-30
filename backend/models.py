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


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    response: str
    ai_name: str = "Luna"


# ==================== CHARACTER CREATION ====================

class CharacterIdentity(BaseModel):
    """Step 1: Character identity"""
    ai_name: str
    gender: str  # male, female, non-binary, custom
    age_range: int = 25  # 18-50
    pronouns: str


class CharacterAppearance(BaseModel):
    """Step 2: Physical appearance"""
    # Face
    face_shape: str = "oval"  # round, sharp, oval
    skin_tone: str = "#fdbcb4"
    eye_type: str = "soft"  # sharp, soft, sleepy, expressive
    eye_color: str = "#8b7355"
    eyebrow_style: str = "natural"
    
    # Hair
    hair_style: str = "long"  # short, medium, long, curly, straight, messy
    hair_color: str = "#2c2416"
    
    # Body
    height: int = 50  # 0-100 slider
    build: str = "average"  # slim, average, athletic, curvy
    
    # Style & Accessories
    outfit_vibe: str = "casual"  # casual, streetwear, soft, formal, dark_academia
    has_glasses: bool = False
    glasses_style: Optional[str] = None
    has_piercings: bool = False
    piercing_count: int = 0
    has_jewelry: bool = False
    jewelry_type: Optional[str] = None


class CharacterPersonality(BaseModel):
    """Step 3: Visual personality link"""
    glow_color: str = "#a855f7"
    glow_intensity: int = 70  # 0-100
    color_warmth: int = 50  # 0-100 (cool to warm)
    expression_tendency: str = "neutral"  # soft, neutral, intense, playful


class CharacterCreationRequest(BaseModel):
    """Complete character creation request"""
    identity: CharacterIdentity
    appearance: CharacterAppearance
    personality: CharacterPersonality


class CharacterResponse(BaseModel):
    """Character data response"""
    id: int
    user_id: int
    ai_name: str
    gender: str
    age_range: int
    pronouns: str
    avatar_url: Optional[str]
    glow_color: str
    glow_intensity: int
    
    class Config:
        from_attributes = True
