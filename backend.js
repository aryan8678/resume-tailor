import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resAi from "./ai.js";
import latex from "node-latex";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/ai", async (req, res) => {
  const { resumeData, parsedData } = req.body;

  try {
    const pdfBuffer = Buffer.from(resumeData, "base64");
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const result = await resAi(resumeText, parsedData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');

    const pdf = latex(result);
    pdf.pipe(res);

    pdf.on("error", (err) => {
      console.error("LaTeX compilation error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error compiling LaTeX" });
      }
    });
  } catch (error) {
    console.error("Error in /ai route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "error aa gaya .. AI hai ki kahi de ai hai",
      });
    }
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
