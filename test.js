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
    console.log(resumeData);
    const data = await getData(tab.id);
    const parsedData = parseJobPage(data.toString());
    if(parsedData) {
        console.log(parsedData.title, "\n", parsedData.description, "\n",parsedData.skills ,"\n", parsedData.importantText); 
    }else {
        console.log("data gaya chaa mudane");
    }
});