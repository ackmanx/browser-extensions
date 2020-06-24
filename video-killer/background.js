const whitelist = [
    'chrome://',
    'chrome-search',
    'youtube.com',
    'gstatic.com', //youtube wont work without this whitelisted too
    'about:blank', //youtube wont work without this whitelisted too
    'google.com',
]

chrome.webNavigation.onCompleted.addListener(function(page) {
    if (whitelist.some(urlToSkip => page.url.includes(urlToSkip))) {
        return
    }

    console.log('injecting into', page.url)

    //Because this is a background script, we need to specify which tab to run it in
    chrome.tabs.executeScript(page.tabId, {
        file: 'injected.js'
    });
});
