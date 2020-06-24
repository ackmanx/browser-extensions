define('util/keys', function (require) {

    var getKeyCode = function getKeyCode (event) {
        return event.keyCode ? event.keyCode : event.which;
    };
    
    return {
        UP: 38,
        DOWN: 40,
        ENTER: 13,
        getKeyCode: getKeyCode
    }
});