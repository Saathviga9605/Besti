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
    """Avatar customization model"""
    __tablename__ = "avatars"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Avatar image
    image_type = Column(String(50), default="generated")  # "uploaded" or "generated"
    image_url = Column(String(500), nullable=True)
    
    # Color customization
    primary_color = Column(String(7), default="#06040f")  # hex color
    secondary_color = Column(String(7), default="#7c3aed")
    accent_color = Column(String(7), default="#a855f7")
    
    # Animation style
    glow_style = Column(String(50), default="aurora")  # "aurora", "neon", "soft", "none"
    glow_intensity = Column(Integer, default=70)  # 0-100
    
    # Appearance settings
    bubble_style = Column(String(50), default="glass")  # "glass", "solid", "minimal"
    font_style = Column(String(50), default="serif")    # "serif", "sans", "monospace"
    theme = Column(String(50), default="dark")          # "dark", "light", "void"
    
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
