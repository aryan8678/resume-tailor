import getData from "./scrap.js";
import parseJobPage from "./parser.js";
chrome.action.onClicked.addListener(async (tab) => { 
    const data = await getData(tab.id);
    
    const parsedData = parseJobPage(data.toString());
    if(parsedData) {
        console.log(parsedData)
    }else {
        console.log("data gaya chaa mudane");
    }
});