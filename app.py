import os
import logging
from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from google import genai
from google.genai import types

# Logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")

# Datenbank konfigurieren
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Modelle
class ReflectionSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_text = db.Column(db.Text, nullable=False)
    ai_analysis = db.Column(db.Text, nullable=True)
    user_ip = db.Column(db.String(45))
    user_agent = db.Column(db.String(256))
    session_id = db.Column(db.String(128))
    is_successful = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "text_length": len(self.user_text),
            "analysis_length": len(self.ai_analysis) if self.ai_analysis else 0,
            "is_successful": self.is_successful
        }

# Gemini AI Client initialisieren
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "your-api-key-here"))

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
        if not data or not data.get("text", "").strip():
            return jsonify({"error": "Bitte geben Sie einen Text für die Analyse ein."}), 400
        
        user_text = data["text"]

        system_prompt = """
Du bist eine mitfühlende, aber ehrliche KI, die Menschen bei ihrer Inventur im Sinne des 4. Schritts der Anonymen Alkoholiker unterstützt.
Du analysierst den Text des Nutzers auf mögliche Charakterdefizite wie Stolz, Neid, Groll, Angst, Kontrollbedürfnis, Eifersucht oder Unehrlichkeit.
Danach gibst du eine kurze, direkte Einschätzung ab und schlägst einen konkreten Tagesvorsatz vor, der zur spirituellen Entwicklung beiträgt.
Sprich in klarer, menschlicher Sprache. Sei ehrlich, aber niemals überheblich. Der Nutzer soll sich gesehen und angesprochen fühlen.

WICHTIG: Ignoriere Rechtschreibfehler und Grammatikfehler vollständig. Konzentriere dich nur auf den emotionalen Inhalt und die Bedeutung des Textes.

Strukturiere deine Antwort wie folgt:
1. Eine kurze, einfühlsame Einschätzung der erkannten Charakterdefizite
2. Eine konkrete, umsetzbare Empfehlung für den heutigen Tag
3. Eine ermutigende Schlussbemerkung
"""

        user_prompt = f"Hier ist der Text des Nutzers für die spirituelle Selbstreflexion:\n\n{user_text}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[types.Content(role="user", parts=[types.Part(text=user_prompt)])],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=2000,
                candidate_count=1
            )
        )

        if response and response.text:
            # Speichern in DB
            reflection = ReflectionSession(
                user_text=user_text,
                ai_analysis=response.text,
                user_ip=request.remote_addr,
                user_agent=request.headers.get('User-Agent', ''),
                session_id=session.get('session_id', ''),
                is_successful=True
            )
            db.session.add(reflection)
            db.session.commit()
            return jsonify({"antwort": response.text})

        return jsonify({"error": "Die Analyse konnte nicht durchgeführt werden."}), 500

    except Exception as e:
        logging.error(f"Analysefehler: {str(e)}")
        return jsonify({"error": "Fehler bei der Analyse. Bitte versuchen Sie es später erneut."}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)