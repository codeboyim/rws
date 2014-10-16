define(['backbone', 'helpers/backend', './model'], function (Backbone, backend, Model) {

    var exports = Backbone.Collection.extend({
        model: Model
    });

    return exports;
});