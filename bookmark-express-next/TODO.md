# New Features
## Use high-resolution favicons
I could have a service worker (requires manifest v3) or async task to look through for a manifest or apple icon entry in the document

Then I could store the location of one in the config to use and fallback to regular if there's none

https://developer.mozilla.org/manifest.json

## Search bar actions
Bookmark current page
* Requires building a cache of folders and their dates added or used or something
* Favorites
    * Use Chip component
    * Need to save these settings
    * Need UI to add favorites
    * Perhaps use the Options page
* Recent
    * Might be able to use dateGroupModified to get recently used folders
* Browse folders
    * Use TreeView component

## Results actions
Edit

## Options
Open bookmark in current tab
    https://developer.chrome.com/docs/extensions/mv2/manifest/activeTab/
    https://stackoverflow.com/questions/27747067/how-do-i-open-a-link-in-the-current-tab-for-my-chrome-extension
