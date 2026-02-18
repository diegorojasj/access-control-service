import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Get the environment variables
user = os.getenv("POSTGRES_USER", "postgres")
password = os.getenv("POSTGRES_PASSWORD", "1234")
db = os.getenv("POSTGRES_DB", "access_control_service")
host = os.getenv("POSTGRES_HOST", "localhost")
port = os.getenv("POSTGRES_PORT", "5432")

# Construct the URL
DATABASE_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"

# Create the engine
engine = create_engine(DATABASE_URL)

# Create session
session = sessionmaker(bind=engine, autoflush=False, autocommit=False)