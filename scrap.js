export default async function getData(tabId) {
  const [{result}] = await chrome.scripting.executeScript({
    target:{tabId},
    func: () => {
      return document.documentElement.innerHTML;
    }
  })
  return result;
}