from flask import Flask, request, jsonify
from google import genai
from google.genai import types
import os

app = Flask(__name__)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", "your-api-key"))

@app.route("/")
def index():
    return "<h1>Spirituelle Inventur API läuft</h1>"

@app.route("/analyse", methods=["POST"])
def analyse():
    try:
        data = request.json
        user_text = data.get("text", "").strip()
        if not user_text:
            return jsonify({"error": "Bitte gib einen Text ein."}), 400

        system_prompt = """
        Du bist eine ehrliche, mitfühlende KI, die bei der Inventur nach dem 4. Schritt der AA hilft.
        Analysiere den Text auf Charakterdefizite wie Groll, Angst, Stolz, Kontrolle, Eifersucht, Neid, Unehrlichkeit.
        Gib dann:
        1. Eine kurze, klare Einschätzung
        2. Einen konkreten Tagesvorschlag
        3. Eine ermutigende Schlussbemerkung
        """

        user_prompt = f"Hier ist der Text des Nutzers:\n\n{user_text}"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[types.Content(role="user", parts=[types.Part(text=user_prompt)])],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=1500
            )
        )

        if response and response.text:
            return jsonify({"antwort": response.text})
        else:
            return jsonify({"error": "Die Analyse konnte nicht durchgeführt werden."}), 500

    except Exception as e:
        print(f"Analyse-Fehler: {e}")
        return jsonify({"error": "Serverfehler während der Analyse."}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
