import os
import logging
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from google import genai
from google.genai import types

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")
CORS(app)

# Initialize Gemini client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "your-api-key-here"))

@app.route("/")
def index():
    """Render the main page"""
    return render_template("index.html")

@app.route("/analyse", methods=["POST"])
def analyse():
    """Analyze user text for spiritual self-reflection using Gemini AI"""
    try:
        data = request.json
        user_text = data.get("text", "")
        
        if not user_text.strip():
            return jsonify({"error": "Bitte geben Sie einen Text für die Analyse ein."}), 400

        # Spiritual guidance prompt in German for AA 4th step
        system_prompt = """
        Du bist eine mitfühlende, aber ehrliche KI, die Menschen bei ihrer Inventur im Sinne des 4. Schritts der Anonymen Alkoholiker unterstützt.
        Du analysierst den Text des Nutzers auf mögliche Charakterdefizite wie Stolz, Neid, Groll, Angst, Kontrollbedürfnis, Eifersucht oder Unehrlichkeit.
        Danach gibst du eine kurze, direkte Einschätzung ab und schlägst einen konkreten Tagesvorsatz vor, der zur spirituellen Entwicklung beiträgt.
        Sprich in klarer, menschlicher Sprache. Sei ehrlich, aber niemals überheblich. Der Nutzer soll sich gesehen und angesprochen fühlen.
        
        Strukturiere deine Antwort wie folgt:
        1. Eine kurze, einfühlsame Einschätzung der erkannten Charakterdefizite
        2. Eine konkrete, umsetzbare Empfehlung für den heutigen Tag
        3. Eine ermutigende Schlussbemerkung
        """
        
        user_prompt = f"Hier ist der Text des Nutzers für die spirituelle Selbstreflexion:\n\n{user_text}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Content(role="user", parts=[types.Part(text=user_prompt)])
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=1000
            )
        )

        if response.text:
            return jsonify({"antwort": response.text})
        else:
            return jsonify({"error": "Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut."}), 500

    except Exception as e:
        logging.error(f"Error in analyse endpoint: {str(e)}")
        return jsonify({"error": "Es gab ein Problem mit der Analyse. Bitte versuchen Sie es erneut."}), 500

@app.errorhandler(404)
def not_found(error):
    return render_template("index.html"), 404

@app.errorhandler(500)
def internal_error(error):
    logging.error(f"Internal server error: {str(error)}")
    return jsonify({"error": "Ein interner Serverfehler ist aufgetreten."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
