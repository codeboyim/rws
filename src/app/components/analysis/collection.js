define(['backbone', 'underscore', './model'], function (Backbone, _, Model) {

    var exports = Backbone.Collection.extend({
        model: Model,
        comparator: function (a1, a2) {

            if (_.isNull(a1.get('DateAssessed')) && _.isNull(a2.get('DateAssessed'))) {
                return 0;
            } else if (_.isNull(a1.get('DateAssessed'))) {
                return 1;
            } else if (_.isNull(a2.get('DateAssessed'))) {
                return -1;
            } else {
                return a2.get('DateAssessed') - a1.get('DateAssessed');
            }
        }
    });

    return exports;
});