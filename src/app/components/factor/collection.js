define(['backbone', 'underscore', './model'],
    function (Backbone, _, Model) {
        var exports = Backbone.Collection.extend({
            model: Model,
            comparator: 'OrderItem'
        });

        return exports;
    });