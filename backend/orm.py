"""SQLAlchemy ORM models for persistent database storage"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from database import Base


class User(Base):
    """User account model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    personality = relationship("Personality", back_populates="user", uselist=False, cascade="all, delete-orphan")
    avatar = relationship("Avatar", back_populates="user", uselist=False, cascade="all, delete-orphan")
    streak = relationship("Streak", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"


class ChatHistory(Base):
    """Chat message history model"""
    __tablename__ = "chat_histories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(String(50), nullable=False, index=True)  # Group messages by conversation
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationship
    user = relationship("User", back_populates="chat_histories")


class Memory(Base):
    """Long-term memory model - facts extracted from conversations"""
    __tablename__ = "memories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    fact = Column(Text, nullable=False)  # The actual fact/memory
    category = Column(String(50), nullable=False)  # "preference", "emotion", "event", "interest"
    frequency = Column(Integer, default=1)  # How many times this fact was mentioned
    last_accessed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="memories")


class Personality(Base):
    """AI personality customization for each user"""
    __tablename__ = "personalities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Personality sliders (0-100)
    empathy = Column(Integer, default=70)  # Caring ↔ Savage
    chaos = Column(Integer, default=40)    # Calm ↔ Chaotic
    formality = Column(Integer, default=50)  # Casual ↔ Formal
    intensity = Column(Integer, default=60)  # Chill ↔ Intense
    
    # Communication settings
    message_length = Column(Integer, default=50)  # 0-100 scale
    emoji_usage = Column(Integer, default=60)     # 0-100 scale
    humor_level = Column(Integer, default=50)     # 0-100 scale
    
    # Behavior settings
    checkin_frequency = Column(Integer, default=3)  # hours
    memory_intensity = Column(Integer, default=70)  # 0-100 scale
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="personality")


class Avatar(Base):
    """Avatar customization model - complete character definition"""
    __tablename__ = "avatars"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # ==================== IDENTITY ====================
    ai_name = Column(String(50), default="Echo")
    gender = Column(String(50), default="non-binary")  # male, female, non-binary, custom
    age_range = Column(Integer, default=25)  # slider 18-50
    pronouns = Column(String(50), default="they/them")  # they/them, she/her, he/him, custom
    
    # ==================== PHYSICAL APPEARANCE - FACE ====================
    face_shape = Column(String(50), default="oval")  # round, sharp, oval
    skin_tone = Column(String(7), default="#fdbcb4")  # hex color
    eye_type = Column(String(50), default="soft")  # sharp, soft, sleepy, expressive
    eye_color = Column(String(7), default="#8b7355")  # hex color
    eyebrow_style = Column(String(50), default="natural")  # natural, bold, thin, arched
    
    # ==================== PHYSICAL APPEARANCE - HAIR ====================
    hair_style = Column(String(50), default="long")  # short, medium, long, curly, straight, messy
    hair_color = Column(String(7), default="#2c2416")  # hex color
    
    # ==================== PHYSICAL APPEARANCE - BODY ====================
    height = Column(Integer, default=50)  # 0-100 slider (short to tall)
    build = Column(String(50), default="average")  # slim, average, athletic, curvy
    
    # ==================== STYLE ====================
    outfit_vibe = Column(String(50), default="casual")  # casual, streetwear, soft, formal, dark_academia
    
    # ==================== ACCESSORIES ====================
    has_glasses = Column(Boolean, default=False)
    glasses_style = Column(String(50), nullable=True)  # cat-eye, round, rectangle, none
    has_piercings = Column(Boolean, default=False)
    piercing_count = Column(Integer, default=0)  # number of piercings
    has_jewelry = Column(Boolean, default=False)
    jewelry_type = Column(String(100), nullable=True)  # comma-separated: necklace, rings, bracelets
    
    # ==================== VISUAL PERSONALITY LINK ====================
    # These reflect personality traits in visual form
    glow_color = Column(String(7), default="#a855f7")  # aurora glow
    glow_intensity = Column(Integer, default=70)  # 0-100
    color_warmth = Column(Integer, default=50)  # 0-100 (cool to warm)
    expression_tendency = Column(String(50), default="neutral")  # soft, neutral, intense, playful
    
    # ==================== AVATAR GENERATION ====================
    avatar_url = Column(String(500), nullable=True)  # Generated avatar image URL
    avatar_config = Column(String(2000), nullable=True)  # JSON config for avatar generation
    
    # ==================== METADATA ====================
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="avatar")


class Streak(Base):
    """Relationship streak and engagement tracking"""
    __tablename__ = "streaks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    streak_days = Column(Integer, default=0)
    last_active_date = Column(DateTime(timezone=True), server_default=func.now())
    highest_streak = Column(Integer, default=0)
    relationship_level = Column(String(50), default="new")  # "new", "growing", "close", "intimate"
    
    total_messages = Column(Integer, default=0)
    total_check_ins = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="streak")
