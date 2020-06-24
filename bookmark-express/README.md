# Bookmark Express
* This extension displays a list of your bookmarks filtered by instant search. That's it.
* You can find it [in the Chrome Store](https://chrome.google.com/webstore/detail/bookmark-express/edgcdcdceojjbiebdbgmacecicaknjih)

### Features TL;DR
* Instant search through Chrome bookmarks
* Search hit highlighting showing which part of the bookmark result, title or URL, was a hit
* Results display absolute path so you can see where they are located
* Most accessed bookmarks sorted on top
* Keyboard navigation through results

### Features (with boring explanations)
* Instant search through Chrome bookmarks
    * Every keystroke performs a search of all bookmarks. Chrome's API returns results where there is a hit in either the title or the URL. This is actually lightning fast so I am okay searching on key stroke.
* Search hit highlighting showing which part of the bookmark result, title or URL, was a hit
* Results display absolute path so you can see where they are located
    * A hash is made of the stringified JSON of all bookmarks on load. This is compared to the hash stored in localstorage. If they are different, then there must have been changes to the bookmarks in Chrome, so we regenerate the absolute path map.
* Most accessed bookmarks sorted on top
    * Opening a bookmark via the extension will increment that bookmark's counter and then the counter is saved in localstorage. Results are sorted for most accessed bookmarks are on top.
* Keyboard navigation through results
    * Up and Down arrow keys will scroll the results, selecting the next one. They do not simply scroll the page.
    * Enter key will open the currently selected bookmark.

### Developer Installation

* Open Chrome's extension page at chrome://extensions
* Enable Developer Mode with the checkbox
* Click on 'Load Unpacked Extension'
* The icon should show up nearby Chrome's menu button
    * Purple icon is for dev version. Before uploading to Chrome Store, this is changed to the green icon to indicate prod version.
* You can right-click on the extension icon and inspect it for debugging and playing
* You can view a full-screen version by going to chrome-extension://<extension-id>/index.html

### Testing
* Run the unit tests by opening SpecRunner.html
