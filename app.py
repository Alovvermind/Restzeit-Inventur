# app.py

# Benötigte Bibliotheken importieren (fügen Sie hier Ihre eigenen hinzu)
from flask import Flask, jsonify
import os

# Die Flask-Anwendung erstellen.
# Der Befehl 'gunicorn app:app' sucht standardmäßig nach diesem 'app'-Objekt.
app = Flask(__name__)

# =========================================================================
# Hier könnten Ihre Konfigurationen, Hilfsfunktionen oder Variablen stehen.
# Ich füge hier Platzhaltercode hinzu, um die Zeilennummern aus Ihrem
# Fehlerprotokoll realistischer zu machen.
# =========================================================================

def lade_einstellungen():
    """Eine Beispielfunktion, um Einstellungen zu laden."""
    print("Anwendungseinstellungen werden geladen...")
    return {
        "version": "1.0.0",
        "umgebung": os.environ.get("FLASK_ENV", "production")
    }

EINSTELLUNGEN = lade_einstellungen()

# ...
# ... Stellen Sie sich hier viele weitere Codezeilen vor ...
# ... um ungefähr auf die Zeilennummer Ihres Fehlers zu kommen.
# ...
# ...
# ...
# ...
# ...

# --------------------------------------------------------------------------
# HIER IST DIE KORREKTUR FÜR IHREN FEHLER
#
# Ihr Fehler "SyntaxError: unterminated triple-quoted string literal"
# bedeutet, dass ein mehrzeiliger String mit """ begonnen, aber
# nicht wieder mit """ beendet wurde.
#
# Der folgende Code zeigt die korrekte Schreibweise.
# --------------------------------------------------------------------------

# Dies ist ein mehrzeiliger String, der das Verhalten für ein KI-Modell oder
# einen anderen Zweck definieren könnte.
# Er MUSS mit den gleichen Anführungszeichen geschlossen werden, mit denen er begonnen hat.
system_prompt = """
Dies ist der Anfang eines mehrzeiligen Textes.
Sie können hier so viele Zeilen schreiben, wie Sie möchten.

Zum Beispiel:
- Ein Punkt auf einer Liste.
- Ein weiterer Punkt.

Stellen Sie einfach sicher, dass der Textblock korrekt endet.
"""  # <-- DAS IST DIE KORREKTUR. Die schließenden drei Anführungszeichen wurden hier hinzugefügt.


# =========================================================================
# Hier definieren Sie die Routen (Pfade) Ihrer Webanwendung.
# Zum Beispiel: was passiert, wenn jemand Ihre Webseite besucht.
# =========================================================================

@app.route('/')
def startseite():
    """Die Hauptroute, die anzeigt, dass die App läuft."""
    # Sie können diesen HTML-Text nach Belieben ändern.
    return "<h1>Bereitstellung erfolgreich!</h1><p>Ihre Anwendung läuft jetzt auf Render.</p>"

@app.route('/api/info')
def api_info():
    """Eine Beispiel-API-Route, die einige Informationen zurückgibt."""
    return jsonify({
        "nachricht": "API ist betriebsbereit",
        "system_prompt_beispiel": system_prompt,
        "version": EINSTELLUNGEN["version"]
    })

# =========================================================================
# Dieser Teil wird nur ausgeführt, wenn Sie die Datei direkt mit
# 'python app.py' auf Ihrem lokalen Computer starten (nicht auf Render).
# Das ist nützlich für Tests.
# =========================================================================
if __name__ == '__main__':
    # Render stellt den Port über eine Umgebungsvariable bereit.
    port = int(os.environ.get('PORT', 5000))
    # 'host='0.0.0.0'' sorgt dafür, dass der Server von außen erreichbar ist.
    app.run(host='0.0.0.0', port=port)