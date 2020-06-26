const skiplist = [
    'chrome://',
    'chrome-search',
    'youtube.com',
    'gstatic.com', //youtube wont work without this being skipped too
    'about:blank', //youtube wont work without this being skipped too
    'google.com',
]

chrome.webNavigation.onCompleted.addListener(function(page) {
    // In order to allow video from certain sites, we have to skip searching for video on certain domains
    if (skiplist.some(urlToSkip => page.url.includes(urlToSkip))) {
        return
    }

    console.log('injecting into', page.url)

    //Because this is a background script, we need to specify which tab to run it in
    chrome.tabs.executeScript(page.tabId, {
        file: 'injected.js'
    });
});
