import getData from "./scrap.js";
import parseJobPage from "./parser.js";


chrome.action.onClicked.addListener(async (tab) => { 
    const resume = await chrome.storage.local.get(["resume"]);
    if(!resume.resume) {
        console.log("resume not found");
        chrome.tabs.create({ url: "input.html" });
        return;
    }
    const resumeData = resume.resume.data;
    const data = await getData(tab.id);
    const parsedData = parseJobPage(data.toString());
    if(parsedData) {
        console.log(parsedData)
    }else {
        console.log("data gaya chaa mudane");
    }
});