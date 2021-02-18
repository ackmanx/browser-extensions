function saveOptions() {
    chrome.storage.local.set({
        userOptions: {
            showBreadcrumbs: document.getElementById('show-breadcrumbs').checked,
            showUrls: document.getElementById('show-urls').checked,
        },
    })
}

document.getElementById('show-breadcrumbs').addEventListener('click', saveOptions)
document.getElementById('show-urls').addEventListener('click', saveOptions)
