
import User from "../Models/user.model.js";

export const getAssistantConfig = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-geminiApiKey");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Assistant config data",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "User ID and message are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Gemini response generation needs to be connected here.
    return res.status(501).json({
      success: false,
      message: "Assistant response generation is not implemented yet"
    });
  } catch (error) {
    console.error("askAssistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
