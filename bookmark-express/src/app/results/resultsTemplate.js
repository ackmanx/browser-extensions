define('results/resultsTemplate', function (require) {

    //& in Mustache has something to do with escaping... I think
    //The target (_blank) is required because Chrome won't let you change the location of the extension without tabs permission
    //favicon is made possible by chrome://favicon/ permission, which isn't documented in their API
    return '\
    <li data-bookmark-id="{{bookmarkId}}" data-times-accessed="{{timesAccessed}}">\
        <div class="left-panel" style="background-image: url(chrome://favicon/{{url}})">\
            &nbsp;\
        </div>\
        <div class="right-panel">\
            <a class="bookmark-link" href="{{&url}}" target="_blank">{{&titleHighlights}}</a>\
            <br />\
            <span class="folderPath">{{path}}</span>\
            <br />\
            <span class="url" title="{{url}}">{{&urlHighlights}}</span>\
        </div>\
    </li>\
';

});