import getData from "./scrap.js";
import parseJobPage from "./parser.js";


chrome.action.onClicked.addListener(async (tab) => { 
    const resume = await chrome.storage.local.get(["resume"]);
    if(!resume.resume) {
        console.log("resume not found");
        chrome.tabs.create({ url: "input.html" });
        return;
    }
    const rawData = resume.resume.data;
    
    const base64String = rawData.split(",")[1];
    const data = await getData(tab.id);
    const parsedData = parseJobPage(data.toString());
    if (!parsedData) {
      console.log("data gaya chaa mudane");
      return;
    }
    const finalResume = await fetch("http://localhost:8080/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeData: base64String, parsedData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        chrome.tabs.create({ url });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
});