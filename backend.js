import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resAi from "./ai.js";
const app = express();
dotenv.config();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/ai", (req, res) => {
  const {resumeData, parsedData} = req.body;
  try {
    const result = resAi(resumeData, parsedData);
    res.status(200).json({ 
      message: "success",
      finalResume: result
     });
  }
  catch (error) {
    ers.status(500).json({
      message: "error aa gaya .. AI hai ki kahi de ai hai",
    })
  }
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});


