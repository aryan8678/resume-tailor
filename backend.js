import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resAi from "./ai.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/ai", async (req, res) => {
  const {resumeData, parsedData} = req.body;
  try {
    const result = await resAi(resumeData, parsedData);
    res.status(200).json({ 
      message: "success",
      finalResume: result
     });
  }
  catch (error) {
    console.error("Error in /ai route:", error);
    res.status(500).json({
      message: "error aa gaya .. AI hai ki kahi de ai hai",
    });
  }
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});


