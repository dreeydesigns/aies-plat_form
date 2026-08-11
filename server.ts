import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/gemini/grounding", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map(chunk => chunk.web)
        .filter(web => web && web.uri && web.title);

      res.json({ result: response.text, sources });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during Gemini request" });
    }
  });

  app.post("/api/generate-course", async (req, res) => {
    try {
      const handler = (await import("./api/generate-course.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Generate course error:", err);
      res.status(500).json({ error: err.message || "Course generation failed" });
    }
  });

  app.post("/api/generate-course-upload", express.raw({ type: '*/*', limit: '10mb' }), async (req, res) => {
    try {
      const handler = (await import("./api/generate-course-upload.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Generate course upload error:", err);
      res.status(500).json({ error: err.message || "Course generation failed" });
    }
  });

  app.post("/api/gemini/tutor", async (req, res) => {
    try {
      const handler = (await import("./api/gemini/tutor.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Gemini tutor error:", err);
      res.status(500).json({ error: err.message || "Tutor API error" });
    }
  });

  app.post("/api/gemini/orchestrator", async (req, res) => {
    try {
      const handler = (await import("./api/gemini/orchestrator.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Gemini orchestrator error:", err);
      res.status(500).json({ error: err.message || "Orchestrator API error" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
