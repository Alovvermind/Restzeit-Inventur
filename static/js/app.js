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
    
    // Add network status monitoring
    function updateNetworkStatus() {
        if (!navigator.onLine) {
            showError('Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung.');
            analyzeBtn.disabled = true;
        } else {
            analyzeBtn.disabled = false;
        }
    }
    
    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus(); // Initial check

    // Guided reflection prompts
    const reflectionPrompts = {
        pride: {
            title: "Stolz",
            questions: [
                "Wann habe ich mich heute oder in letzter Zeit überlegen oder besser als andere gefühlt?",
                "In welchen Situationen möchte ich unbedingt recht haben oder das letzte Wort haben?",
                "Wo fällt es mir schwer, Fehler zuzugeben oder um Hilfe zu bitten?",
                "Welche Komplimente oder Anerkennung brauche ich, um mich gut zu fühlen?"
            ]
        },
        resentment: {
            title: "Groll",
            questions: [
                "Gegen wen oder was hege ich Groll und warum?",
                "Welche alten Verletzungen trage ich noch in mir?",
                "Wann denke ich an vergangene Ungerechtigkeiten und ärgere mich darüber?",
                "Wie beeinflusst dieser Groll mein heutiges Verhalten und meine Beziehungen?"
            ]
        },
        fear: {
            title: "Angst",
            questions: [
                "Wovor habe ich am meisten Angst und wie zeigt sich das in meinem Verhalten?",
                "Welche Entscheidungen treffe ich aus Angst statt aus Vertrauen?",
                "Wie hindert mich die Angst daran, authentisch zu sein?",
                "Welche Zukunftssorgen beschäftigen mich am meisten?"
            ]
        },
        control: {
            title: "Kontrolle",
            questions: [
                "Wo versuche ich, andere Menschen oder Situationen zu kontrollieren?",
                "Wie reagiere ich, wenn die Dinge nicht nach meinem Plan laufen?",
                "Welche Bereiche meines Lebens kann ich schwer loslassen?",
                "Wann fällt es mir schwer, anderen zu vertrauen oder Verantwortung abzugeben?"
            ]
        },
        jealousy: {
            title: "Eifersucht",
            questions: [
                "Auf wen oder was bin ich eifersüchtig und warum?",
                "Welche Erfolge oder Besitztümer anderer lösen Neid in mir aus?",
                "Wie zeigt sich meine Eifersucht in meinen Beziehungen?",
                "Was fehlt mir, dass ich mich durch andere bedroht fühle?"
            ]
        },
        dishonesty: {
            title: "Unehrlichkeit",
            questions: [
                "Wo bin ich nicht ehrlich zu mir selbst oder anderen?",
                "Welche kleinen Lügen oder Ausreden verwende ich regelmäßig?",
                "Wo verschweige ich wichtige Dinge oder gebe mich anders, als ich bin?",
                "Welche Wahrheiten fällt es mir schwer auszusprechen?"
            ]
        }
    };

    // Add event listeners for defect buttons
    document.querySelectorAll('.defect-btn').forEach(button => {
        button.addEventListener('click', function() {
            const defect = this.dataset.defect;
            showGuidedPrompts(defect);
        });
    });

    function showGuidedPrompts(defect) {
        const prompt = reflectionPrompts[defect];
        const guidedPromptsDiv = document.getElementById('guidedPrompts');
        const promptQuestions = document.getElementById('promptQuestions');
        
        // Update active button state
        document.querySelectorAll('.defect-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-defect="${defect}"]`).classList.add('active');
        
        // Create questions HTML
        let questionsHTML = `<p class="fw-bold mb-2">${prompt.title}:</p><ul class="mb-0">`;
        prompt.questions.forEach(question => {
            questionsHTML += `<li class="mb-1">${question}</li>`;
        });
        questionsHTML += '</ul>';
        
        promptQuestions.innerHTML = questionsHTML;
        guidedPromptsDiv.style.display = 'block';
        
        // Store current defect for use in useGuidedPrompt
        window.currentDefect = defect;
    }

    window.useGuidedPrompt = function() {
        const defect = window.currentDefect;
        const prompt = reflectionPrompts[defect];
        
        let guidedText = `Charakterdefizit: ${prompt.title}\n\n`;
        guidedText += "Reflexionsfragen:\n";
        prompt.questions.forEach((question, index) => {
            guidedText += `${index + 1}. ${question}\n\n`;
        });
        guidedText += "Meine Antworten:\n";
        
        textArea.value = guidedText;
        textArea.style.height = 'auto';
        textArea.style.height = (textArea.scrollHeight) + 'px';
        textArea.focus();
        
        // Scroll to textarea
        textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = textArea.value.trim();
        if (!text) {
            showError('Bitte geben Sie einen Text für die Analyse ein.');
            return;
        }

        if (text.length < 5) {
            showError('Bitte geben Sie einen Text für die Analyse ein.');
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
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                // Show loading state
                showLoading();
                
                // Check if online
                if (!navigator.onLine) {
                    showError('Keine Internetverbindung. Bitte überprüfen Sie Ihre Netzwerkverbindung.');
                    return;
                }
                
                // Use relative URL that works with any domain
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
                
                const response = await fetch('./analyse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                // Check if response is ok
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }));
                    
                    // If it's a server error (5xx), try again
                    if (response.status >= 500 && retryCount < maxRetries - 1) {
                        retryCount++;
                        updateLoadingMessage(`Versuch ${retryCount + 1} von ${maxRetries}...`);
                        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Progressive delay
                        continue;
                    }
                    
                    showError(errorData.error || `HTTP Fehler: ${response.status}`);
                    return;
                }

                const data = await response.json();

                if (data.antwort) {
                    showResults(data.antwort);
                    return; // Success, exit retry loop
                } else {
                    showError(data.error || 'Keine Antwort vom Server erhalten.');
                    return;
                }
            } catch (error) {
                console.error('Network error:', error);
                
                // If it's a network error and we have retries left, try again
                if ((error.name === 'AbortError' || error.name === 'TypeError' || error.name === 'NetworkError') && retryCount < maxRetries - 1) {
                    retryCount++;
                    updateLoadingMessage(`Netzwerkfehler. Versuch ${retryCount + 1} von ${maxRetries}...`);
                    await new Promise(resolve => setTimeout(resolve, 3000 * retryCount)); // Progressive delay
                    continue;
                }
                
                // Final error after all retries
                if (error.name === 'AbortError') {
                    showError('Die Anfrage hat zu lange gedauert. Öffentliche WLAN-Netzwerke blockieren manchmal solche Anfragen. Versuchen Sie es mit einem anderen Netzwerk.');
                    showNetworkWarning();
                } else if (error.name === 'TypeError' || error.name === 'NetworkError') {
                    showError('Netzwerkfehler. Öffentliche WLAN-Netzwerke (wie bei Penny) blockieren oft solche Anfragen. Versuchen Sie es mit mobilem Internet oder einem anderen WLAN.');
                    showNetworkWarning();
                } else {
                    showError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
                }
                break; // Exit retry loop on final error
            } finally {
                hideLoading();
            }
        }
    }

    function showLoading() {
        loadingIndicator.style.display = 'block';
        resultsSection.style.display = 'none';
        errorSection.style.display = 'none';
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analysiere...';
    }
    
    function updateLoadingMessage(message) {
        analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${message}`;
    }
    
    function showNetworkWarning() {
        const networkWarning = document.getElementById('networkWarning');
        if (networkWarning) {
            networkWarning.style.display = 'block';
            // Hide warning after 10 seconds
            setTimeout(() => {
                networkWarning.style.display = 'none';
            }, 10000);
        }
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
        
        // Check if content is scrollable and show hint
        const scrollHint = document.getElementById('scrollHint');
        setTimeout(() => {
            if (analysisResult.scrollHeight > analysisResult.clientHeight) {
                scrollHint.style.display = 'block';
            } else {
                scrollHint.style.display = 'none';
            }
        }, 100);
        
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
