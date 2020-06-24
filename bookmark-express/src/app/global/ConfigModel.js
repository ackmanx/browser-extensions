define('bke/config', function (require) {

    var Backbone = require('backbone');
    var _ = require('underscore');
    var Spark = require('sparkmd5');
    
    return Backbone.Model.extend({
        initialize: function () {
            var model = this;

            this.fetch();

            this.checkUpdate(function (shouldUpdate) {
                if (shouldUpdate) {
                    model.update();
                }
            });
        },
        //@Override
        fetch: function () {
            this.set('hash', localStorage.getItem('hash'));

            var bookmarkData;
            try {
                bookmarkData = JSON.parse(localStorage.getItem('bookmarkData'));
            }
            catch (ex) {
                //If parsing fails, put undefined into the model to cause bookmarkData to update
                bookmarkData = undefined;
                console.error(ex.stack);
            }

            this.set('bookmarkData', bookmarkData);
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Save the model to local storage. Note that _tmp_ properties are not saved because they are not added to the model's attributes property
         */
        //@Override
        save: function () {
            localStorage.setItem('hash', this.get('hash'));
            localStorage.setItem('bookmarkData', JSON.stringify(this.get('bookmarkData')));
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Checks Chrome's bookmark list, compares to localstorage cache and updates if necessary
         * Extension search bar is enabled after the check is finished, so user cannot search while cache is building
         */
        checkUpdate: function (finishedCallback) {
            var model = this;

            chrome.bookmarks.getTree(function (currentBookmarkTree) {
                var updateRequired = true;

                /*
                 * To determine if there were bookmark changes so we can update our config, compare the current hash to our localstorage one
                 * The root node Chrome provides has a new dateAdded when Chrome starts, so we need to exclude it from our hash calculation
                 * dateGroupModified on bookmarknode is unreliable and doesn't update on deletes, so cannot use that to determine changes
                 */
                var jsonToHash = '';
                _.each(currentBookmarkTree[0].children, function (node) {
                    jsonToHash += JSON.stringify(node);
                });
                var currentHash = Spark.hash(jsonToHash);

                model._tmp_hash = currentHash;
                model._tmp_currentBookmarkTree = currentBookmarkTree;

                //Require an update if there is no bookmark data at all
                if (!model.get('bookmarkData')) {
                    console.log('Bookmark data not found. Building...');
                    updateRequired = true;
                }

                //Require an update if the stored hash does not match the current bookmark tree hash
                if (model.get('hash') !== currentHash) {
                    console.log('Bookmarks updated in Chrome. Re-calculating path data...');
                    updateRequired = true;
                }

                finishedCallback(updateRequired);
            });
        },
        update: function () {
            var bookmarkData = this.generatePaths(this._tmp_currentBookmarkTree);

            this.set('hash', this._tmp_hash);
            this.set('bookmarkData', bookmarkData);
            this.save();

            bke.in.searchView.enableSearch(); //todo: use a global event
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Takes an array of bookmark nodes and creates a map of IDs, where the value is an object with the full path of each bookmark's location
         */
        generatePaths: function (bookmarks) {
            //[0] is the only element and is a BookmarkNode of the tree root
            //Passing in bookmarkData so we don't lose other data for each node (like timesAccessed)
            return this.buildPath(bookmarks[0], [], this.get('bookmarkData') || {});
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Takes a node and traverses it depth-first
         * pathStack has the path to the current level
         * pathMap is the final object that gets built up containing paths for every leaf node
         */
        buildPath: function (bookmarkNode, pathStack, pathMap) {
            var that = this;

            //Everything has a title except the root node, and we don't want that in our stack
            if (bookmarkNode.title) {
                pathStack.push(bookmarkNode.title);
            }

            //Folders don't have url properties, so we know to go deeper
            if (!bookmarkNode.url) {
                _.each(bookmarkNode.children, function (childNode) {
                    that.buildPath(childNode, pathStack, pathMap);
                });
            } else {
                if (!pathMap[bookmarkNode.id]) {
                    pathMap[bookmarkNode.id] = {};
                }
                //Array has string values, so slice doesn't create a situation with two references to the same objects
                pathMap[bookmarkNode.id].path = pathStack.slice(0, -1).join(' / ');
            }

            pathStack.pop();

            return pathMap;
        }
    });

});