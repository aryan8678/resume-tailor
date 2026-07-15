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
    
    const base64String = rawData.split(',')[1];
    const resumeData = atob(base64String);
    
    const data = await getData(tab.id);
    const parsedData = parseJobPage(data.toString());
    if (!parsedData) {
      console.log("data gaya chaa mudane");
      return;
    }
    const finalResume = await fetch("http://localhost:8080/ai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeData, parsedData })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        return data.finalResume;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});