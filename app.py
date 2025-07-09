import os
import logging
from datetime import datetime
from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from google import genai
from google.genai import types
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Environment configuration
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
DEBUG_MODE = ENVIRONMENT == "development"

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", "sqlite:///database.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy()
db.init_app(app)

# Database base class for models
class Base(DeclarativeBase):
    pass

# Import or define your models here
from models import create_models
ReflectionSession, AppUsage = create_models(db)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

# Initialize Gemini AI client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "your-api-key-here"))

# Create tables if not exist
with app.app_context():
    db.create_all()
    logging.info("Database tables created")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyse", methods=["POST", "OPTIONS"])
def analyse():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Keine Daten empfangen."}), 400
            
        user_text = data.get("text", "")
        
        if not user_text.strip():
            return jsonify({"error": "Bitte geben Sie einen Text für die Analyse ein."}), 400

        system_prompt = """
        Du bist eine mitfühlende, aber ehrliche KI, die Menschen bei ihrer Inventur im Sinne des 4. Schritts der Anonymen Alkoholiker
