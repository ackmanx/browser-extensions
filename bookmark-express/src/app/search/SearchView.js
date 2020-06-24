define('search/view', function (require) {

    var Backbone = require('backbone');
    var jQuery = require('jquery');
    var bkeKeys = require('util/keys');
    
    return Backbone.View.extend({
        el: '#search-bar-view',
        events: {
            //input...
            //  is used for typing search queries
            //  does not fire for control characters
            'input #searchBar': 'handleSearchInput',
            //keydown...
            //  is used for changing the selected bookmark
            //  is fired before character is considered part of an input's value
            //  does not cause the cursor in an input to change position if default is prevented
            'keydown #searchBar': 'handleBookmarkSelect'
        },
        render: function () {
            this.$el.html('<input id="searchBar" type="text" placeholder="start typing"/>');
            return this;
        },
        handleSearchInput: function (event) {
            var searchQuery = jQuery(event.target).val();
            this.trigger('bke:performSearch', searchQuery);
        },
        handleBookmarkSelect: function (event) {
            var keyCode = bkeKeys.getKeyCode(event);

            if (!this.isNavigationKey(keyCode)) return;

            event.preventDefault();

            switch (keyCode) {
                case bkeKeys.UP:
                    this.trigger('bke:changeSelectedBookmark', 'up');
                    break;
                case bkeKeys.DOWN:
                    this.trigger('bke:changeSelectedBookmark', 'down');
                    break;
                case bkeKeys.ENTER:
                    if (jQuery('#searchBar').val().length > 1) {
                        this.trigger('bke:openBookmark');
                    }
                    break;
            }
        },
        isNavigationKey: function (keyCode) {
            return keyCode == bkeKeys.UP || keyCode == bkeKeys.DOWN || keyCode == bkeKeys.ENTER;
        },
        enableSearch: function () {
            jQuery('#loading-label').hide();
            jQuery('#searchBar').show().focus();
        }
    });
});