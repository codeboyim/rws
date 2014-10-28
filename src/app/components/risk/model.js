define(function(require) {
    var _ = require('underscore'),
        backend = require('helpers/backend');

    var exports = require('classes/SuperModel').extend({

        initialize: function(options) {

            this.Analyses = new(require('analysis/collection'));
            this.Analyses.on('all', _.bind(this._collectionPropertyChanged, this, 'Analyses'));

            this.RiskFactors = new(require('factor/collection'));
            this.RiskFactors.on('all', _.bind(this._collectionPropertyChanged, this, 'RiskFactors'));

            this.Notes = new(require('note/collection'));
            this.Notes.on('all', _.bind(this._collectionPropertyChanged, this, 'Notes'));

            this.on('all', this._modelChanged);
        },

        _collectionPropertyChanged: function(type) {
            var options = arguments[arguments.length - 1];

            this.unset(type, {
                silent: true
            }).set(type, this[type].toJSON(), {
                silent: true
            });

            if (arguments[1] === 'change:EditStatus') {
                this.setDirty(true);
            }
        },

        _modelChanged: function(event, model, value) {
            var matched;

            if ((matched = /^change:(Analyses|RiskFactors|Notes)$/.exec(event))) {
                this[matched[1]].reset(value, {
                    spawn: true
                });
            }

        },

        defaults: function() {

            return {
                'RecordID': 0,
                'RiskNumber': 0,
                'AssetName': null,
                'AssetID': 0,
                'AssetOwner': null,
                'Notes': [],
                'Analyses': [],
                'RiskFactors': [{}],

                /*exclusive props for the view*/
                'activeStep': 0
            };

        },

        validate: function(attrs, options) {

        },

        sync: function(method, model, options) {

            switch (method) {

                case 'create':
                case 'update':

                    if (this.isDirty()) {
                        return backend.saveRisk(model).done(function(props) {
                            model.set(props).setDirty(false);
                        });
                    }

                    break;

                case 'read':

                    return backend.getRiskById(model.get('id')).done(function(props) {
                        model.set(props).setDirty(false);
                    });

                    break;
            }

        }
    });

    return exports
});
