define('util/util', function (require) {

    //I forgot the technical reason I needed this
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    return {
        escapeRegExp: function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }
});
