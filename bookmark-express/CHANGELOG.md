# changelog

## v8.1 | 2018-05-19
* `misc` Added background page to keep extension loaded in memory, thus improving load performance of popup.html

## v8.0 | 2016-07-22
* `feature` Made URL less obvious and added tooltip with full URL
* `misc` Ported entire (I think) extension to using RequireJS (Almond)

## v7.2 | 2016-04-11
* `bugfix` Search input now properly gets focus on extension startup in Windows

## v7.1 | 2015-10-01
* `bugfix` Moving namespace.js to misc folder in src caused exceptions because build.sh ignores all misc folders

## v7 | 2015-09-29
* `feature` Scroll with results automatically when using arrow keys to select
* `feature` Search bar is now sticky
* `bugfix` Keyboard navigation moved input cursor to front or back of input. If front, window scrolls to top
* `bugfix` Bookmarks hash is different on Chrome startup but only first time opened
* `bugfix` Fixed sorting problem with most used bookmarks. Extension no longer loses counts.
* `misc` Ported config store to Backbone model for easier management

## v6.1 | 2015-09-11
* `bugfix` bke.config was undefined on work computer. Added check for bke.config to be built if undefined

## v6 | 2015-09-10
* `feature` Results sort by most used, based on counts of using a bookmark from within extension
* `bugfix` Fixed margin at bottom of last result
* `bugfix` Results don't flicker when searching
* `misc` Switched extension to use Backbone views

## v5 | 2015-08-31
* `feature` Added favicons to results

## v4 | 2015-08-30
* `feature` Results display path where bookmark is located within Chrome's bookmark tree
* `feature` Introduced config cache to house generated path data, being it is not stored by Chrome. Cache only updates on detected changes to bookmarks.

## v3 | 2015-03-06
* `feature` Can navigate and open results using keyboard

## v2 | 2015-02-23
* `feature` Added search hit highlighting to results

## v1 | 2015-02-01
* `feature` Can search bookmarks!
