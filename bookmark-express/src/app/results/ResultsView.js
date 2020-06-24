define('results/view', function (require) {

    var jQuery = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    var bkeUtil = require('util/util');
    var template = require('results/resultsTemplate');

    return Backbone.View.extend({
        el: '#bookmarks',
        events: {
            'click .bookmark-link': 'openBookmark'
        },
        initialize: function () {
            this.listenTo(bke.in.searchView, 'bke:performSearch', this.performSearch);
            this.listenTo(bke.in.searchView, 'bke:openBookmark', this.openSelectedBookmark);
            this.listenTo(bke.in.searchView, 'bke:changeSelectedBookmark', this.changeSelectedBookmark);
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Takes a query and searches against Chrome's bookmark's API
         * Renders the results, adding highlighting to search hits
         */
        performSearch: function (searchQuery) {
            var self = this;

            //Skip search for 1 character
            var $bookmarks = jQuery('#bookmarks');
            if (searchQuery.length < 2) {
                this.$el.html('');
                $bookmarks.css('margin-top', 0);
                return;
            }

            $bookmarks.css('margin-top', 40);

            //Query Chrome's bookmarks directly and process results async
            chrome.bookmarks.search(searchQuery, function (results) {
                var bookmarkData = bke.config.get('bookmarkData');

                //We modify our results to add in extra data and sort
                var resultsWithConfig = _.chain(results)
                    .filter(function (bookmarkNode) {
                        //Filter out folders
                        return bookmarkNode.url
                    })
                    .each(function (bookmark) {
                        //todo: This is stupid because it'll only happen once. Move this to cache update
                        //Make sure timesAccessed is not undefined, otherwise sort will be incorrect
                        var configEntry = bookmarkData[bookmark.id];
                        if (configEntry.timesAccessed === undefined) {
                            configEntry.timesAccessed = 0;
                        }

                        //Add in the config data for this bookmark
                        _.extendOwn(bookmark, configEntry);
                    })
                    .sortBy('timesAccessed') //asc
                    .value() //removes underscore wrapper
                    .reverse(); //desc

                var resultsHtml = '';
                _.each(resultsWithConfig, function (bookmark) {

                    var templateModel = {
                        bookmarkId: bookmark.id,
                        titleHighlights: self.addSearchHitHighlights(bookmark.title, searchQuery),
                        urlHighlights: self.addSearchHitHighlights(bookmark.url, searchQuery),
                        url: bookmark.url,
                        path: bookmarkData[bookmark.id].path,
                        timesAccessed: bookmark.timesAccessed
                    };

                    resultsHtml += Mustache.render(template, templateModel);
                });

                self.$el.html(resultsHtml);

                self.changeSelectedBookmark();
            });
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * returns String of text with spans to highlight search hits
         */
        addSearchHitHighlights: function (sourceText, searchQuery) {
            if (!searchQuery || !sourceText) {
                console.error('Missing parameters');
                return;
            }

            var searchHits = [];
            var highlightedText = sourceText;
            var queryParts = _(searchQuery.trim().split(' ')).filter(function (query) {
                return query.length > 1;
            });

            _(queryParts).each(function (queryPart, index) {
                var replaceText = '\t' + index + '\t';
                var searchHitStringIndex = highlightedText.toLowerCase().indexOf(queryPart.toLowerCase());
                searchHits[index] = highlightedText.substr(searchHitStringIndex, queryPart.length);
                highlightedText = highlightedText.replace(new RegExp(bkeUtil.escapeRegExp(queryPart), 'gi'), replaceText);
            });

            _(queryParts).each(function (queryPart, index) {
                var replaceText = '<span class="search-hit">' + searchHits[index] + '</span>';
                highlightedText = highlightedText.replace(new RegExp('\t' + index + '\t', 'g'), replaceText);
            });

            return highlightedText;
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * This is used to highlight a bookmark when navigating with the keyboard
         * It is fired on load too to highlight the first bookmark
         */
        changeSelectedBookmark: function (direction) {
            var $selected = jQuery('.selected');
            var $newSelected;
            switch (direction) {
                case 'up':
                    $newSelected = $selected.prev();
                    break;
                case 'down':
                    $newSelected = $selected.next();
                    break;
                default:
                    //Select first result if we don't specify
                    this.$el.children().first().addClass('selected');
                    return;
            }
            //If at the beginning or end, $newSelected will be empty, so we leave selected alone
            if ($newSelected.length) {
                var pixelsVisible = this.numberPixelsOfElementVisible($newSelected);
                var pixelsOffscreen = $newSelected.outerHeight() - pixelsVisible;

                if (pixelsOffscreen > 0) {
                    var $body = jQuery('body');
                    var scrollPosition = 0;

                    if (direction == 'up') {
                        scrollPosition = $body.scrollTop() - pixelsOffscreen - 10;
                    } else if (direction == 'down') {
                        scrollPosition = $body.scrollTop() + pixelsOffscreen + 10;
                    }

                    $body.scrollTop(scrollPosition);
                }

                $selected.removeClass('selected');
                $newSelected.addClass('selected');
            }
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Returns 0 if element is below viewport, else returns number of pixels visible in viewport
         * This voodoo just works, so I'm not going to mess with it other than reformatting
         * http://stackoverflow.com/questions/24768795/get-the-visible-height-of-a-div-with-jquery#answer-26831113
         */
        numberPixelsOfElementVisible: function ($el) {
            var windowHeight = jQuery(window).height(),
                outerHeight = $el.outerHeight(), //pixels of height of element, including padding, margins and borders
                rectangle = $el[0].getBoundingClientRect(), //get non-jquery bounding client rectangle
                rectangleTop = rectangle.top, //pixels from the top of window to top of element
                rectangleBottom = rectangle.bottom; //pixels from the top of window to bottom of element

            var pixelsVisible = rectangleTop > 0
                ? Math.min(outerHeight, windowHeight - rectangleTop)
                : ( rectangleBottom < windowHeight ? rectangleBottom : windowHeight );

            return Math.max(0, pixelsVisible)
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Opens the currently selected bookmark in a new window
         * Chrome does not allow changing the current window without the tabs permission
         */
        openSelectedBookmark: function () {
            var $selected = jQuery('.selected');
            this.incrementTimesAccessed($selected.data('bookmarkId'));
            window.open($selected.find('.bookmark-link').attr('href'), "_blank");
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * Opens a bookmark from mouse click in a new window, making sure to increment its timesAccessed config
         */
        openBookmark: function (event) {
            event.preventDefault();
            var $target = jQuery(event.target);
            var bookmarkId = $target.parents('li').data('bookmark-id');
            this.incrementTimesAccessed(bookmarkId);
            window.open($target.attr('href'));
        },
        /* ---------------------------------------------------------------------------------------------------------------------
         * For given bookmarkId, add one to its timesAccessed config and persist in localstorage
         */
        incrementTimesAccessed: function (bookmarkId) {
            var bookmarkData = bke.config.get('bookmarkData');
            var timesAccessed = bookmarkData[bookmarkId].timesAccessed;
            bookmarkData[bookmarkId].timesAccessed = timesAccessed ? ++timesAccessed : 1;
            bke.config.save();
        }
    });
});
