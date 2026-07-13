import getData from "./scrap";

chrome.action.onClicked.addListener((tab) => { 
    const data =  getData(tab.url);
    console.log(data);
});