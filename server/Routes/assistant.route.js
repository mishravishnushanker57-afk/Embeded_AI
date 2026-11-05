
import express from "express";
import { getAssistantConfig } from "../Controllers/assistant.controller.js";
import { askAssistant } from "../Configs/gemini.js";

const assistantRouter = express.Router();

assistantRouter.get("/config/:userId", getAssistantConfig);
assistantRouter.post("/ask", askAssistant);

export default assistantRouter;
