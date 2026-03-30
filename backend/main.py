from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from typing import Dict, List, Optional, Union
from pydantic import BaseModel
from models import (
    ChatRequest, ChatResponse, Message, PersonalityConfig,
    CharacterCreationRequest, CharacterResponse, CharacterIdentity, 
    CharacterAppearance, CharacterPersonality
)
from services import llm_service
from database import init_db, get_db, SessionLocal
from orm import User, Avatar
from auth import hash_password, verify_password, create_access_token, verify_token
from avatar_generation import generate_dicebear_url, generate_avatar_config
from sqlalchemy.orm import Session
from sqlalchemy import select

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Besti API", version="2.0")

# Initialize database on startup
@app.on_event("startup")
async def startup():
    """Initialize database tables on server start"""
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Pydantic Schemas ====================

class SignupRequest(BaseModel):
    """User signup request"""
    email: str
    username: str
    password: str


class LoginRequest(BaseModel):
    """User login request"""
    email: str
    password: str


class AuthResponse(BaseModel):
    """Authentication response with token"""
    access_token: str
    token_type: str
    user_id: int
    username: str
    email: str


class UserResponse(BaseModel):
    """User profile response"""
    id: int
    email: str
    username: str
    created_at: str
    is_active: bool

    class Config:
        from_attributes = True


# ==================== Dependency Injection ====================

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    """Extract and validate current user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    # Verify token and get user_id
    user_id = verify_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    return user


# ==================== Authentication Endpoints ====================

@app.post("/auth/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account"""
    try:
        logger.info(f"Signup request for email: {request.email}")
        
        # Validate password length (6-13 characters)
        if len(request.password) < 6 or len(request.password) > 13:
            raise HTTPException(status_code=400, detail="Password must be 6-13 characters")
        
        logger.info(f"Password length validated: {len(request.password)} characters")
        
        # Check if email already exists
        existing_email = db.query(User).filter(User.email == request.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username already exists
        existing_username = db.query(User).filter(User.username == request.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Hash password with error handling
        try:
            password_hash = hash_password(request.password)
        except ValueError as ve:
            logger.error(f"Password hashing error: {str(ve)}")
            raise HTTPException(status_code=400, detail="Invalid password format")
        
        # Create new user
        user = User(
            email=request.email,
            username=request.username,
            password_hash=password_hash,
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"User created successfully: {user.id}")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user.id,
            username=user.username,
            email=user.email,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    try:
        logger.info(f"Login request for email: {request.email}")
        
        # Find user by email
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(status_code=401, detail="User account is inactive")
        
        logger.info(f"User logged in successfully: {user.id}")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user.id,
            username=user.username,
            email=user.email,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Login failed")


@app.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout endpoint (client should discard token)"""
    logger.info(f"User logged out: {current_user.id}")
    return {"status": "logged_out", "message": "Token should be discarded on client"}


@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    logger.info(f"User profile requested: {current_user.id}")
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        created_at=current_user.created_at.isoformat(),
        is_active=current_user.is_active,
    )


# ==================== In-Memory Storage (for existing endpoints) ====================

# In-memory storage for chat history and user preferences
chat_histories: Dict[str, List[Message]] = {}
user_preferences: Dict[str, Dict] = {}  # Store AI name and personality preferences


# ==================== Character Creation Endpoints ====================

@app.post("/characters/create", response_model=CharacterResponse)
async def create_character(
    request: CharacterCreationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new character for the user"""
    try:
        logger.info(f"Creating character for user: {current_user.id}")
        
        # Check if user already has a character
        existing_character = db.query(Avatar).filter(Avatar.user_id == current_user.id).first()
        if existing_character:
            logger.warning(f"User {current_user.id} already has a character, updating instead")
            # Delete old character to replace with new one
            db.delete(existing_character)
            db.commit()
        
        # Generate avatar configuration and URL
        character_data = {
            "ai_name": request.identity.ai_name,
            "gender": request.identity.gender,
            "age_range": request.identity.age_range,
            "pronouns": request.identity.pronouns,
            "face_shape": request.appearance.face_shape,
            "skin_tone": request.appearance.skin_tone,
            "eye_type": request.appearance.eye_type,
            "eye_color": request.appearance.eye_color,
            "eyebrow_style": request.appearance.eyebrow_style,
            "hair_style": request.appearance.hair_style,
            "hair_color": request.appearance.hair_color,
            "height": request.appearance.height,
            "build": request.appearance.build,
            "outfit_vibe": request.appearance.outfit_vibe,
            "has_glasses": request.appearance.has_glasses,
            "glasses_style": request.appearance.glasses_style,
            "has_piercings": request.appearance.has_piercings,
            "piercing_count": request.appearance.piercing_count,
            "has_jewelry": request.appearance.has_jewelry,
            "jewelry_type": request.appearance.jewelry_type,
            "glow_color": request.personality.glow_color,
            "glow_intensity": request.personality.glow_intensity,
            "color_warmth": request.personality.color_warmth,
            "expression_tendency": request.personality.expression_tendency,
        }
        
        # Generate DiceBear URL and config
        avatar_url = generate_dicebear_url(character_data)
        avatar_config = generate_avatar_config(character_data)
        
        # Create new Avatar record
        avatar = Avatar(
            user_id=current_user.id,
            ai_name=request.identity.ai_name,
            gender=request.identity.gender,
            age_range=request.identity.age_range,
            pronouns=request.identity.pronouns,
            face_shape=request.appearance.face_shape,
            skin_tone=request.appearance.skin_tone,
            eye_type=request.appearance.eye_type,
            eye_color=request.appearance.eye_color,
            eyebrow_style=request.appearance.eyebrow_style,
            hair_style=request.appearance.hair_style,
            hair_color=request.appearance.hair_color,
            height=request.appearance.height,
            build=request.appearance.build,
            outfit_vibe=request.appearance.outfit_vibe,
            has_glasses=request.appearance.has_glasses,
            glasses_style=request.appearance.glasses_style,
            has_piercings=request.appearance.has_piercings,
            piercing_count=request.appearance.piercing_count,
            has_jewelry=request.appearance.has_jewelry,
            jewelry_type=request.appearance.jewelry_type,
            glow_color=request.personality.glow_color,
            glow_intensity=request.personality.glow_intensity,
            color_warmth=request.personality.color_warmth,
            expression_tendency=request.personality.expression_tendency,
            avatar_url=avatar_url,
            avatar_config=avatar_config,
        )
        
        db.add(avatar)
        db.commit()
        db.refresh(avatar)
        
        logger.info(f"Character created successfully for user: {current_user.id}")
        
        # Update user preferences with AI name
        user_id_str = str(current_user.id)
        if user_id_str not in user_preferences:
            user_preferences[user_id_str] = {}
        user_preferences[user_id_str]["ai_name"] = request.identity.ai_name
        
        return CharacterResponse(
            id=avatar.id,
            user_id=avatar.user_id,
            ai_name=avatar.ai_name,
            gender=avatar.gender,
            age_range=avatar.age_range,
            pronouns=avatar.pronouns,
            avatar_url=avatar.avatar_url,
            glow_color=avatar.glow_color,
            glow_intensity=avatar.glow_intensity,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Character creation error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Character creation failed: {str(e)}")


@app.get("/characters/{user_id}", response_model=CharacterResponse)
async def get_character(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve user's character"""
    try:
        logger.info(f"Retrieving character for user: {user_id}")
        
        # Verify user is requesting their own character
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Cannot access other users' characters")
        
        # Get character from database
        avatar = db.query(Avatar).filter(Avatar.user_id == user_id).first()
        if not avatar:
            raise HTTPException(status_code=404, detail="Character not found")
        
        logger.info(f"Character retrieved for user: {user_id}")
        
        return CharacterResponse(
            id=avatar.id,
            user_id=avatar.user_id,
            ai_name=avatar.ai_name,
            gender=avatar.gender,
            age_range=avatar.age_range,
            pronouns=avatar.pronouns,
            avatar_url=avatar.avatar_url,
            glow_color=avatar.glow_color,
            glow_intensity=avatar.glow_intensity,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Character retrieval error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Character retrieval failed: {str(e)}")


@app.put("/characters/{user_id}", response_model=CharacterResponse)
async def update_character(
    user_id: int,
    request: CharacterCreationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's character"""
    try:
        logger.info(f"Updating character for user: {user_id}")
        
        # Verify user is updating their own character
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Cannot update other users' characters")
        
        # Get existing character
        avatar = db.query(Avatar).filter(Avatar.user_id == user_id).first()
        if not avatar:
            raise HTTPException(status_code=404, detail="Character not found")
        
        # Build updated character data
        character_data = {
            "ai_name": request.identity.ai_name,
            "gender": request.identity.gender,
            "age_range": request.identity.age_range,
            "pronouns": request.identity.pronouns,
            "face_shape": request.appearance.face_shape,
            "skin_tone": request.appearance.skin_tone,
            "eye_type": request.appearance.eye_type,
            "eye_color": request.appearance.eye_color,
            "eyebrow_style": request.appearance.eyebrow_style,
            "hair_style": request.appearance.hair_style,
            "hair_color": request.appearance.hair_color,
            "height": request.appearance.height,
            "build": request.appearance.build,
            "outfit_vibe": request.appearance.outfit_vibe,
            "has_glasses": request.appearance.has_glasses,
            "glasses_style": request.appearance.glasses_style,
            "has_piercings": request.appearance.has_piercings,
            "piercing_count": request.appearance.piercing_count,
            "has_jewelry": request.appearance.has_jewelry,
            "jewelry_type": request.appearance.jewelry_type,
            "glow_color": request.personality.glow_color,
            "glow_intensity": request.personality.glow_intensity,
            "color_warmth": request.personality.color_warmth,
            "expression_tendency": request.personality.expression_tendency,
        }
        
        # Generate new avatar URL and config
        avatar_url = generate_dicebear_url(character_data)
        avatar_config = generate_avatar_config(character_data)
        
        # Update Avatar record
        avatar.ai_name = request.identity.ai_name
        avatar.gender = request.identity.gender
        avatar.age_range = request.identity.age_range
        avatar.pronouns = request.identity.pronouns
        avatar.face_shape = request.appearance.face_shape
        avatar.skin_tone = request.appearance.skin_tone
        avatar.eye_type = request.appearance.eye_type
        avatar.eye_color = request.appearance.eye_color
        avatar.eyebrow_style = request.appearance.eyebrow_style
        avatar.hair_style = request.appearance.hair_style
        avatar.hair_color = request.appearance.hair_color
        avatar.height = request.appearance.height
        avatar.build = request.appearance.build
        avatar.outfit_vibe = request.appearance.outfit_vibe
        avatar.has_glasses = request.appearance.has_glasses
        avatar.glasses_style = request.appearance.glasses_style
        avatar.has_piercings = request.appearance.has_piercings
        avatar.piercing_count = request.appearance.piercing_count
        avatar.has_jewelry = request.appearance.has_jewelry
        avatar.jewelry_type = request.appearance.jewelry_type
        avatar.glow_color = request.personality.glow_color
        avatar.glow_intensity = request.personality.glow_intensity
        avatar.color_warmth = request.personality.color_warmth
        avatar.expression_tendency = request.personality.expression_tendency
        avatar.avatar_url = avatar_url
        avatar.avatar_config = avatar_config
        
        db.commit()
        db.refresh(avatar)
        
        logger.info(f"Character updated successfully for user: {user_id}")
        
        # Update user preferences
        user_id_str = str(current_user.id)
        if user_id_str not in user_preferences:
            user_preferences[user_id_str] = {}
        user_preferences[user_id_str]["ai_name"] = request.identity.ai_name
        
        return CharacterResponse(
            id=avatar.id,
            user_id=avatar.user_id,
            ai_name=avatar.ai_name,
            gender=avatar.gender,
            age_range=avatar.age_range,
            pronouns=avatar.pronouns,
            avatar_url=avatar.avatar_url,
            glow_color=avatar.glow_color,
            glow_intensity=avatar.glow_intensity,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Character update error: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Character update failed: {str(e)}")


@app.get("/characters/{user_id}/preview")
async def get_character_preview(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get character avatar preview URL"""
    try:
        logger.info(f"Getting character preview for user: {user_id}")
        
        # Verify user is requesting their own preview
        if current_user.id != user_id:
            raise HTTPException(status_code=403, detail="Cannot access other users' characters")
        
        # Get character from database
        avatar = db.query(Avatar).filter(Avatar.user_id == user_id).first()
        if not avatar:
            raise HTTPException(status_code=404, detail="Character not found")
        
        logger.info(f"Character preview retrieved for user: {user_id}")
        
        return {
            "user_id": user_id,
            "avatar_url": avatar.avatar_url,
            "ai_name": avatar.ai_name,
            "glow_color": avatar.glow_color,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Character preview retrieval error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Character preview retrieval failed: {str(e)}")


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
        
        # Convert user_id to string for consistent dict key handling
        user_id = str(request.user_id)
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
        
        # Convert to string for dict key consistency
        user_id_str = str(user_id)
        history = chat_histories.get(user_id_str, [])
        return {"user_id": user_id_str, "messages": [{"role": msg.role, "content": msg.content} for msg in history]}
    
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
        
        # Convert to string for dict key consistency
        user_id_str = str(user_id)
        prefs = user_preferences.get(user_id_str, {
            "ai_name": "Elio",
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
