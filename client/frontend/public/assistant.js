
(function () {
    const script = document.currentScript;
    const userId = script?.dataset?.userId;

    let assistantConfig = null;
    let isOpen = false;

    if (!userId) {
        console.error("Assistant userId is missing. Check data-user-id in your embed code.");
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://localhost:5173/assistant.css";
    document.head.appendChild(link);

    // Create assistant popup
    const popup = document.createElement("div");
    popup.className = "shifra-popup theme-glass";

    popup.innerHTML = `
        <div class="shifra-overlay"></div>

        <div class="shifra-content">
            <div class="shifra-top">
                <div class="shifra-orb-wrap">
                    <div class="shifra-orb-glow"></div>
                    <div class="shifra-orb"></div>
                </div>

                <h2 class="shifra-title">Hello, I am your AI assistant</h2>

                <p class="shifra-sub">
                    Your smart AI assistant.
                    <br />
                    Ask anything about your website.
                </p>

                <div class="shifra-status">Tap button to speak</div>

                <div class="shifra-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div class="shifra-user-text"></div>
                <div class="shifra-ai-text"></div>
            </div>

            <div class="shifra-bottom">
                <button class="shifra-mic" type="button" aria-label="Speak">
                    <img
                        src="http://localhost:5173/mic.png"
                        alt="Microphone"
                        class="shifra-mic-icon"
                    />
                </button>
            </div>
        </div>
    `;

    // Create floating assistant button
    const button = document.createElement("button");
    button.className = "shifra-btn theme-glass";
    button.type = "button";
    button.setAttribute("aria-label", "Open AI assistant");

    button.innerHTML = `
        <img
            src="http://localhost:5173/logo.png"
            alt="Open assistant"
        />
    `;

    // Append elements when DOM is ready
    function mountAssistant() {
        if (!document.body.contains(popup)) {
            document.body.appendChild(popup);
        }

        if (!document.body.contains(button)) {
            document.body.appendChild(button);
        }

        popup.style.display = "none";
    }

    if (document.body) {
        mountAssistant();
    } else {
        document.addEventListener("DOMContentLoaded", mountAssistant, {
            once: true
        });
    }

    // Open and close popup
    button.addEventListener("click", () => {
        isOpen = !isOpen;
        popup.style.display = isOpen ? "flex" : "none";
    });

    // Popup elements
    const status = popup.querySelector(".shifra-status");
    const wave = popup.querySelector(".shifra-wave");
    const userText = popup.querySelector(".shifra-user-text");
    const aiText = popup.querySelector(".shifra-ai-text");
    const mic = popup.querySelector(".shifra-mic");

    // Apply assistant configuration
    const applyConfig = () => {
        if (!assistantConfig) return;

        const theme = assistantConfig.theme || "glass";

        popup.className = `shifra-popup theme-${theme}`;
        button.className = `shifra-btn theme-${theme}`;

        const title = popup.querySelector(".shifra-title");
        if (title) {
            title.textContent =
                `Hello, I'm ${assistantConfig.assistantName || "your AI assistant"}`;
        }

        const subTitle = popup.querySelector(".shifra-sub");
        if (subTitle) {
            subTitle.textContent =
                `Welcome to ${assistantConfig.buisnessName || "our"} website. I'm here to assist you.`;
        }
    };

    // Load assistant configuration
    const loadAssistant = async () => {
        if (!userId) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/assistant/config/${encodeURIComponent(userId)}`
            );

            const data = await response.json();
            console.log("STATUS:", response.status);
            console.log("BODY:", JSON.stringify(data, null, 2));

            if (!response.ok) {
                console.error("Config loading failed:", response.status, data);
                return;
            }

            // Supports both { user: {...} } and direct config responses
            assistantConfig = data.user || data;
            applyConfig();

        } catch (error) {
            console.error("Error loading assistant config:", error);
        }
    };

    loadAssistant();

    // Text-to-speech
    const speak = (message) => {
        const text = String(message || "Sorry, I couldn't generate a response.");

        window.speechSynthesis.cancel();

        aiText.textContent = text;
        status.textContent = "Speaking...";
        wave.style.opacity = "1";

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onend = () => {
            status.textContent = "Tap button to speak";
            wave.style.opacity = "0";
        };

        speech.onerror = () => {
            status.textContent = "Tap button to speak";
            wave.style.opacity = "0";
        };

        window.speechSynthesis.speak(speech);
    };

    // Speech recognition
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        status.textContent = "Speech recognition is not supported in this browser.";
        mic.disabled = true;
        console.error("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    // Start listening
    mic.addEventListener("click", () => {
        if (isListening) {
            recognition.stop();
            return;
        }

        try {
            window.speechSynthesis.cancel();

            userText.textContent = "";
            aiText.textContent = "";
            status.textContent = "Listening...";
            wave.style.opacity = "1";

            recognition.start();
            isListening = true;
        } catch (error) {
            console.error("Speech recognition start error:", error);
            status.textContent = "Please try again";
            wave.style.opacity = "0";
            isListening = false;
        }
    });

    recognition.onresult = async (event) => {
        const message = event.results[0][0].transcript.trim();

        userText.textContent = "You: " + message;

        recognition.stop();
        isListening = false;
        wave.style.opacity = "0";

        if (!message) {
            status.textContent = "Please try speaking again";
            return;
        }

        status.textContent = "Generating response...";

        try {
            const res = await fetch(
                "http://localhost:8000/api/assistant/ask",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId,
                        message,
                        currentPath: window.location.pathname
                    })
                }
            );

            // Read and log the backend response
            const data = await res.json();

            console.log("Assistant request status:", res.status);
            console.log("Assistant request response:", data);

            if (!res.ok || !data.success) {
                const errorMessage =
                    data.message || `Request failed with status ${res.status}`;

                console.error("Assistant API error:", errorMessage);
                speak(errorMessage);
                return;
            }

            // Navigate to a page if requested
            if (data.action === "navigate" && data.path) {
                speak(data.response || "Navigating to the requested page.");

                setTimeout(() => {
                    window.location.href = data.path;
                }, 2000);

                return;
            }

            // Speak the AI response
            speak(data.aiResponse || data.response || "I didn't receive a response.");

        } catch (error) {
            console.error("Assistant request error:", error);

            speak("Unable to connect to the assistant server. Please try again.");
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        isListening = false;
        wave.style.opacity = "0";

        if (event.error === "not-allowed") {
            status.textContent = "Please allow microphone access.";
        } else {
            status.textContent = "Tap button to speak";
        }
    };

    recognition.onend = () => {
        isListening = false;

        if (status.textContent === "Listening...") {
            status.textContent = "Tap button to speak";
            wave.style.opacity = "0";
        }
    };
})();
