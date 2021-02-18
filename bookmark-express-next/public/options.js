function saveOptions(event) {
    chrome.storage.local.set({
        userOptions: {
            showUrls: event.target.checked,
        },
    })
}

document.querySelector('input').addEventListener('click', saveOptions)
