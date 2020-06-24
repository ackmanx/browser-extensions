//
// Main logic to get old cookie and flip the value (device class)
//
chrome.pageAction.onClicked.addListener(currentTab => {
	const query = {domain: 'bestbuy.com', name: 'bby_rdp'}

	chrome.cookies.getAll(query, cookies => {
		const rdpCookie = cookies[0]

		if (rdpCookie) {
			const newDeviceClass = rdpCookie.value === 'l' ? 's' : 'l'

			const newCookie = {
				url: 'http://bestbuy.com',
				domain: 'bestbuy.com',
				expirationDate: new Date().setMonth(new Date().getMonth() + 1),
				name: 'bby_rdp',
				value: newDeviceClass
			}

			chrome.cookies.set(newCookie, newCookie => {
				setIcon(currentTab.id, newDeviceClass)
				chrome.tabs.executeScript(currentTab.id, {code: 'window.location.reload()'})
			})
		}
	})
})

//
// Ensures correct icon when opening a new tab or refreshing the page
//
chrome.tabs.onUpdated.addListener(tabId => {
	const query = {domain: 'bestbuy.com', name: 'bby_rdp'}
	chrome.cookies.getAll(query, cookies => cookies[0] ? setIcon(tabId, cookies[0].value) : setIcon(tabId))
})

//
// Helper function to set the extension's icon you see in the Chrome toolbar
//
function setIcon(tabId, deviceClass = 'unknown') {
	chrome.pageAction.setIcon({tabId: tabId, path: `app-icon-${deviceClass}.png`})
}

//
// Ensures extension is only active if the declared rules below are met. This grays out the icon when rules are not met (such as a different tab)
//
chrome.runtime.onInstalled.addListener(() => {
	//Rules are persistent so we have to clear our rules first. Not sure why there's no "add if not exists" but this is Google's recommended approach
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () =>
		chrome.declarativeContent.onPageChanged.addRules([{
			//If url matcher is true
			conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostContains: '.bestbuy.com'}})],
			//ShowPageAction "enables" the plugin
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}])
	)
})
