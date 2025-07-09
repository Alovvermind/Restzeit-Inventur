// Spiritual Self-Reflection App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reflectionForm');
    const textArea = document.getElementById('reflectionText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    const analysisResult = document.getElementById('analysisResult');
    const errorMessage = document.getElementById('errorMessage');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = textArea.value.trim();
        if (!text) {
            showError('Bitte geben Sie einen Text für die Analyse ein.');
            return;
        }

        if (text.length < 10) {
            showError('Bitte geben Sie einen ausführlicheren Text ein (mindestens 10 Zeichen).');
            return;
        }

        analyzeText(text);
    });

    // Character counter for textarea
    textArea.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 5000;
        
        if (length > maxLength) {
            this.value = this.value.substring(0, maxLength);
        }
    });

    // Auto-resize textarea
    textArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    async function analyzeText(text) {
        try {
            // Show loading state
            showLoading();
            
            // Use relative URL that works with any domain
            const response = await fetch('./analyse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
                // Add timeout and retry logic
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });

            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
                showError(errorData.error || `HTTP Fehler: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (data.antwort) {
                showResults(data.antwort);
            } else {
                showError(data.error || 'Keine Antwort vom Server erhalten.');
            }
        } catch (error) {
            console.error('Network error:', error);
            if (error.name === 'AbortError') {
                showError('Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.');
            } else if (error.name === 'TypeError') {
                showError('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
            } else {
                showError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
            }
        } finally {
            hideLoading();
        }
    }

    function showLoading() {
        loadingIndicator.style.display = 'block';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analysiere...';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search me-2"></i>Analyse durchführen';
    }

    function showResults(result) {
        analysisResult.innerHTML = formatAnalysisResult(result);
        resultsSection.style.display = 'block';
        errorSection.style.display = 'none';
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Smooth scroll to error
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function formatAnalysisResult(text) {
        // Format the analysis result for better readability
        const paragraphs = text.split('\n\n');
        let formattedText = '';
        
        paragraphs.forEach((paragraph, index) => {
            if (paragraph.trim()) {
                // Check for numbered sections or bullet points
                if (paragraph.match(/^\d+\./)) {
                    formattedText += `<div class="mb-3"><strong>${paragraph}</strong></div>`;
                } else if (paragraph.includes('Tagesvorsatz') || paragraph.includes('Empfehlung')) {
                    formattedText += `<div class="alert alert-success mb-3"><i class="fas fa-star me-2"></i>${paragraph}</div>`;
                } else if (paragraph.includes('Charakterdefizit') || paragraph.includes('Einschätzung')) {
                    formattedText += `<div class="alert alert-info mb-3"><i class="fas fa-eye me-2"></i>${paragraph}</div>`;
                } else {
                    formattedText += `<p class="mb-3">${paragraph}</p>`;
                }
            }
        });
        
        return formattedText || `<p>${text}</p>`;
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!analyzeBtn.disabled) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Focus management
    textArea.focus();
});

// Global function for new reflection button
function startNewReflection() {
    const textArea = document.getElementById('reflectionText');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');
    
    // Clear form and hide results
    textArea.value = '';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Focus on textarea and scroll to top
    textArea.focus();
    textArea.style.height = 'auto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: Service worker would need to be implemented separately
        // navigator.serviceWorker.register('/sw.js');
    });
}
