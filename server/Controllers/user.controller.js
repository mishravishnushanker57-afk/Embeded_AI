import User from "../Models/user.model.js"

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `getCurrentUser failed: ${error.message}` })
  }
}

export const saveAssistant = async (req, res) => {
  try {
    const {
      assistantName,
      buisnessName,
      buisnessType,
      buisnessDescription,
      tone,
      theme,
      geminiApiKey,
      pages,
    } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.assistantName = assistantName
    user.buisnessName = buisnessName
    user.buisnessType = buisnessType
    user.buisnessDescription = buisnessDescription
    user.tone = tone
    user.theme = theme

    if (geminiApiKey) {
      user.geminiApiKey = geminiApiKey
      user.geminiStatus = "active"
    }

    user.pages = pages || []
    user.isSetupComplete = true

    await user.save()

    // Returning user is required for: setUser(res.data.user)
    return res.status(200).json({
      message: "Assistant saved successfully",
      user,
    })
  } catch (error) {
    return res.status(500).json({ message: `Failed to save assistant: ${error.message}` })
  }
}