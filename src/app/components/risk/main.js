define(function (require) {
    var View = require('./view'),
        Model = require('./model');

    var exports = function (container) {
        this.view = (new View({
            el: container
        })).render();
    };

    return exports;
});