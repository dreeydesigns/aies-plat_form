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
      const handler = (await import("./api/gemini/grounding.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Grounding error:", err);
      res.status(500).json({ error: err.message || "Grounding failed" });
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

  app.post("/api/gemini/moderation", async (req, res) => {
    try {
      const handler = (await import("./api/gemini/moderation.js")).default;
      await handler(req, res as any);
    } catch (err: any) {
      console.error("Gemini moderation error:", err);
      res.status(500).json({ isToxic: false, severity: 'none', constructiveNudge: '' });
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
