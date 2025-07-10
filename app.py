import os
import logging
from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")

# Datenbank konfigurieren
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", "sqlite:///database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# CORS erlauben (optional, falls nötig)
CORS(app)

# Beispiel Model (nur minimal)
class ReflectionSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_text = db.Column(db.Text, nullable=False)
    ai_analysis = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

with app.app_context():
    db.create_all()
    logging.info("DB-Tabelle erstellt")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyse", methods=["POST"])
def analyse():
    data = request.json
    user_text = data.get("text", "").strip()
    if not user_text:
        return jsonify({"error": "Bitte Text eingeben."}), 400

    # Simulierter AI-Antworttext
    antwort = f"Analyse des Textes:\n\n{user_text[:100]}..."

    # Speichern in DB (optional)
    try:
        session_entry = ReflectionSession(user_text=user_text, ai_analysis=antwort)
        db.session.add(session_entry)
        db.session.commit()
    except Exception as e:
        logging.error(f"DB Fehler: {e}")

    return jsonify({"antwort": antwort})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)