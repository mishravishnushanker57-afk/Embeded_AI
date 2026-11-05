
import express from "express";
import User from "../Models/user.model.js";

const Gemini_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

// Generate response using Gemini
export const generateGeminiResponse = async ({ prompt, apikey, user }) => {
    try {
        if (!apikey) {
            throw new Error("API key is required");
        }

        const response = await fetch(Gemini_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apikey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        if (!response.ok) {
            if (user) {
                if ([400, 401, 403].includes(response.status)) {
                    user.geminiStatus = "invalid";
                } else if (response.status === 429) {
                    user.geminiStatus = "quota_exceed";
                }

                await user.save();
            }

            const errorText = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        const text = data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!text) {
            throw new Error("No text found in Gemini response");
        }

        if (user) {
            user.geminiStatus = "active";
            await user.save();
        }

        return text;
    } catch (error) {
        console.error("Gemini error:", error.message);
        throw error;
    }
};


// Handle assistant messages
export const askAssistant = async (req, res) => {
    try {
        const { message, userId, currentPath } = req.body;

        if (!message || !userId) {
            return res.status(400).json({
                success: false,
                message: "Message and userId are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.geminiApiKey) {
            return res.status(400).json({
                success: false,
                message: "Gemini API key is not set for this user"
            });
        }

        const plan = user.plan?.toLowerCase();

        if (
            plan === "free" &&
            user.totalMessages >= user.requestLimit
        ) {
            return res.status(429).json({
                success: false,
                message: "Request limit exceeded for free plan"
            });
        }

        if (
            plan === "pro" &&
            user.proExpiresAt &&
            new Date(user.proExpiresAt) < new Date()
        ) {
            user.plan = "free";
            await user.save();

            return res.status(403).json({
                success: false,
                message: "Pro plan has expired"
            });
        }

        // Navigation handling
        const cleanedMessage = message.toLowerCase().trim();
               console.log(`this is check ${user.enableNavigation}`)


        if (user.enableNavigation) {
            const navigationWords = [
                "navigate",
                "go to",
                "open",
                "search for",
                "find",
                "look up",
                "explore",
                "show me",
                "show",
                "take me to"
            ];

            const wantsNavigation = navigationWords.some(word =>
                cleanedMessage.includes(word)
            );




            if (wantsNavigation) {
    const pages = user.pages || [];
    console.log("Message:", cleanedMessage);
    console.log("Pages:", JSON.stringify(user.pages, null, 2));



           const matchedPage = pages.find(page => {
            console.log("Checking page:", page);
        
            const keywords = Array.isArray(page.keywords)
                ? page.keywords
                : [];
        
            return keywords.some(keyword =>
                cleanedMessage.includes(keyword.toLowerCase().trim())
            );
        });
        
        console.log("Matched page:", matchedPage);




                if (matchedPage) {
                    console.log("Requested message:", cleanedMessage);
  console.log("Available pages:", user.pages);
 console.log("Matched page:", matchedPage);
  console.log("Navigation path:", matchedPage?.path);
                    if (currentPath === matchedPage.path) {

                        return res.json({
                            success: true,
                            response: `You are already on the ${matchedPage.name} page`
                        });
                    }


                    return res.json({
                        success: true,
                        action: "navigate",
                        path: matchedPage.path,
                        response: `Navigating to ${matchedPage.name} page`
                    });
                }


            }

        }

        // Build the AI prompt using your existing database field names
        const prompt = `
You are ${user.assistantName || "AI Assistant"}.

Business Name: ${user.buisnessName || ""}
Business Type: ${user.buisnessType || ""}
Business Description: ${user.buisnessDescription || ""}
Assistant Tone: ${user.tone || "friendly"}

Rules:
- Keep replies under 15 words.
- Give fast, direct responses.
- Talk naturally.
- Behave like a smart voice assistant.
- If you do not know something, say so honestly.

User Question: ${message}
`;

        const aiResponse = await generateGeminiResponse({
            prompt,
            apikey: user.geminiApiKey,
            user
        });

        if (plan === "free") {
            user.totalMessages = (user.totalMessages || 0) + 1;
            await user.save();
        }

        return res.json({
            success: true,
            aiResponse,
            response: aiResponse
        });

    } catch (error) {
        console.error("askAssistant error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Error processing request"
        });
    }
};
