"""Database configuration and SQLAlchemy setup"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Database connection string
# For development, use SQLite. For production, use PostgreSQL
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

if ENVIRONMENT == "production":
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/besti_db"
    )
else:
    # Development: Use SQLite file in backend directory
    DATABASE_URL = "sqlite:///./besti_dev.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to log SQL statements
    pool_size=10 if ENVIRONMENT == "production" else 1,
    max_overflow=20 if ENVIRONMENT == "production" else 0,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for all models
Base = declarative_base()

def get_db():
    """Dependency for FastAPI to inject database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
