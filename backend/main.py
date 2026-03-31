from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
import secrets
from typing import Dict, List, Optional
from pydantic import BaseModel
from models import ChatRequest, ChatResponse, Message, PersonalityConfig
from services import llm_service
from database import init_db, get_db, SessionLocal
from orm import User, Avatar, ChatHistory
from auth import hash_password, verify_password, create_access_token, verify_token
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
        
        # Create access token (sub must be string)
        access_token = create_access_token(data={"sub": str(user.id)})
        
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
        
        # Create access token (sub must be string)
        access_token = create_access_token(data={"sub": str(user.id)})
        
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


@app.get("/")
async def root():
    """Health check endpoint"""
    logger.info("Health check called")
    return {"message": "Besti API is running", "status": "ok"}


@app.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Main chat endpoint - Database-backed with message editing and regeneration support"""
    
    try:
        logger.info(f"💬 Chat request from user: {request.user_id}")
        
        # Convert user_id to int
        user_id = int(request.user_id) if isinstance(request.user_id, str) else request.user_id
        user_message = request.message
        
        if not user_message or not user_message.strip():
            logger.warning(f"❌ Empty message from user: {user_id}")
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.error(f"❌ User not found: {user_id}")
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        
        personality = request.personality or PersonalityConfig()
        
        logger.info(f"✅ User verified: {user.username}")
        
        # Handle message editing/regeneration
        if request.message_id is not None:
            logger.info(f"📝 Editing/regenerating message {request.message_id} for user: {user_id}")
            
            # Delete all messages after the edit point to create new branch
            db.query(ChatHistory)\
                .filter(ChatHistory.user_id == user_id, ChatHistory.id > request.message_id)\
                .delete()
            db.commit()
            logger.info(f"✅ Deleted messages after ID {request.message_id}")
        
        # Get recent chat history for context
        logger.info(f"📖 Fetching chat history for user: {user_id}")
        recent_chats = db.query(ChatHistory)\
            .filter(ChatHistory.user_id == user_id)\
            .order_by(ChatHistory.created_at.asc())\
            .limit(10)\
            .all()
        
        # Convert to Message format
        history = [Message(role=chat.role, content=chat.message) for chat in recent_chats]
        
        # Add current user message to history
        history.append(Message(role="user", content=user_message))
        
        # Get AI name from preferences
        ai_name = user.username or "Assistant"
        
        # Get AI response
        logger.info(f"🤖 Calling LLM for response")
        ai_response = llm_service.chat(
            user_message=user_message,
            history=history,
            personality=personality,
            ai_name=ai_name
        )
        logger.info(f"✅ LLM response generated (length: {len(ai_response)})")
        
        # Save user message to database
        try:
            user_chat_msg = ChatHistory(
                user_id=user_id,
                conversation_id="main",
                role="user",
                message=user_message
            )
            db.add(user_chat_msg)
            db.flush()  # Get the message ID
            user_message_id = user_chat_msg.id
            
            # Save AI response to database
            ai_chat_msg = ChatHistory(
                user_id=user_id,
                conversation_id="main",
                role="assistant",
                message=ai_response
            )
            db.add(ai_chat_msg)
            db.commit()
            logger.info(f"✅ Messages saved to database (user_msg_id: {user_message_id})")
        except Exception as e:
            logger.error(f"⚠️ Error saving chat history: {e}")
            db.rollback()
            # Continue anyway - don't fail the response
        
        response = ChatResponse(
            response=ai_response, 
            ai_name=ai_name,
            message_id=user_message_id if 'user_message_id' in locals() else None
        )
        logger.info(f"✅ Response sent to user: {user_id}")
        
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


# ==================== Avatar Endpoints ====================

@app.post("/avatar/generate")
async def generate_avatar(user_id: int, seed: str = None, db: Session = Depends(get_db)):
    """Generate a random avatar using DiceBear and save it"""
    try:
        logger.info(f"🎨 Generating avatar for user: {user_id}")
        
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            logger.error(f"❌ User not found: {user_id}")
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        
        logger.info(f"✅ User found: {user.username}")
        
        # Generate DiceBear URL
        avatar_seed = seed or f"{user.username}_{secrets.token_hex(4)}"
        avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={avatar_seed}"
        
        logger.info(f"🌐 Generated DiceBear URL: {avatar_url}")
        
        # Check if avatar exists for user
        existing_avatar = db.query(Avatar).filter(Avatar.user_id == user_id).first()
        
        if existing_avatar:
            logger.info(f"📝 Updating existing avatar for user: {user_id}")
            existing_avatar.image_url = avatar_url
            existing_avatar.image_type = "generated"
            db.commit()
            logger.info(f"✅ Avatar updated for user: {user_id}")
        else:
            logger.info(f"➕ Creating new avatar for user: {user_id}")
            # Create new avatar
            avatar = Avatar(
                user_id=user_id,
                image_url=avatar_url,
                image_type="generated"
            )
            db.add(avatar)
            db.commit()
            logger.info(f"✅ Avatar created for user: {user_id}")
        
        logger.info(f"🎉 Avatar generation successful for user: {user_id}")
        return {"avatar_url": avatar_url, "user_id": user_id, "status": "success"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Avatar generation error for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Avatar generation failed: {str(e)}")


@app.get("/avatar/{user_id}")
async def get_avatar(user_id: int, db: Session = Depends(get_db)):
    """Get user's avatar"""
    try:
        logger.info(f"🖼️ Fetching avatar for user: {user_id}")
        
        avatar = db.query(Avatar).filter(Avatar.user_id == user_id).first()
        
        if not avatar or not avatar.image_url:
            logger.info(f"📭 No avatar found for user {user_id}, generating default")
            # Return default avatar if none exists
            default_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed=default_{user_id}"
            return {"avatar_url": default_url, "user_id": user_id}
        
        logger.info(f"✅ Avatar fetched for user: {user_id}")
        return {"avatar_url": avatar.image_url, "user_id": user_id}
    
    except Exception as e:
        logger.error(f"❌ Error fetching avatar for user {user_id}: {str(e)}", exc_info=True)
        # Return default on error instead of failing
        default_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed=default_{user_id}"
        return {"avatar_url": default_url, "user_id": user_id}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
