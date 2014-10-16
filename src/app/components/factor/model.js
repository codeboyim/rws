define(function(require) {
    var EditStatus = require('classes/EditStatus'),
        backend = require('helpers/backend');

    var exports = require('classes/SuperModel').extend({

        initialize: function() {
            this.Treatments = new(require('treatment/collection'))(this.get('Treatments'));
            this.Treatments.on('all', _.bind(this._collectionPropertyChanged, this, 'Treatments'));
            this.on('all', this._modelChanged);
        },

        defaults: {
            'RecordID': null,
            'AssetCategoryID': null,
            'AssetSubCategoryID': null,
            'RiskFactorDesc': null,
            'Assessment': null,
            'Treatments': null,
            'OrderItem': 0,
            'EditStatus': EditStatus.None
        },

        _collectionPropertyChanged: function(type, event) {
            var options = arguments[arguments.length - 1];

            this.unset(type, {
                silent: true
            }).set(type, this[type].toJSON(), {
                silent: options && !options.spawn
            });

            if (event === 'change:EditStatus') {
                this.changeEditStatus(EditStatus.Update);
            }
        },

        _modelChanged: function(event, model, value) {
            var matched;

            if ((matched = /^change:(Treatments)$/.exec(event))) {
                this[matched[1]].reset(value, {
                    spawn: false
                });
            }
        }

    });

    exports.getRefData = function() {
        return backend.getRiskFactorRefData();
    };

    exports.getSubRefData = function(id) {
        return backend.getSubRefData(id);
    }

    return exports;

});
