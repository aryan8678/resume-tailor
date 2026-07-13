import getData from "./scrap.js";

chrome.action.onClicked.addListener(async (tab) => { 
    const data = await getData(tab.id);
    // console.log(data);
    if(data) {
        console.log(data)
    }else {
        console.log("data gaya chaa mudane");
    }
});