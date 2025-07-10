document.getElementById("reflectionForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const text = document.getElementById("reflectionText").value;
    const resultBox = document.getElementById("analysisResult");
    const loading = document.getElementById("loadingIndicator");
    const errorBox = document.getElementById("errorSection");
    const results = document.getElementById("resultsSection");

    errorBox.style.display = "none";
    results.style.display = "none";
    loading.style.display = "block";

    try {
        const res = await fetch("/analyse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await res.json();
        loading.style.display = "none";

        if (data.antwort) {
            resultBox.innerHTML = data.antwort.replace(/\n/g, "<br>");
            results.style.display = "block";
        } else {
            throw new Error(data.error || "Unbekannter Fehler");
        }
    } catch (err) {
        loading.style.display = "none";
        document.getElementById("errorMessage").innerText = err.message;
        errorBox.style.display = "block";
    }
});

function startNewReflection() {
    document.getElementById("reflectionText").value = "";
    document.getElementById("resultsSection").style.display = "none";
}