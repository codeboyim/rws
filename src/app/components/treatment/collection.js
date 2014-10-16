define(function (require) {
    var Backbone = require('backbone'),
        Model = require('./model');

    var exports = Backbone.Collection.extend({
        model: Model,
        comparator: 'OrderItem'
    });

    return exports;

});