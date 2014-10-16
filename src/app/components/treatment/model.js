define(function(require) {
    var backend = require('helpers/backend')
    EditStatus = require('classes/EditStatus');

    var exports = require('classes/SuperModel').extend({

        initialize: function() {
            this.Notes = new(require('note/collection'));

            this.listenTo(this.Notes, 'all', this._collectionPropertyChanged)
                .on('change', this._changed);
        },

        defaults: {
            'RecordID': 0,
            'TreatmentObjective': null,
            'ResponsiblePersonName': null,
            'ScheduledDate': null,
            'OrderItem': 0,
            'EditStatus': EditStatus.None,
            'Notes': null,
            'TreatmentStrategyID': '0',
            'TreatmentStrategyDesc': null,
            'TreatmentTypeID': '0',
            'TreatmentTypeDesc': null,
            'TreatmentManagerID': '0',
            'BushfireManagementZoneID': '0',
            'IsPartOfPlan': null,
            'FireManagementPlan': null
        },

        validate: function(attrs, options) {
            var msg = [];

            if (attrs.TreatmentStrategyID === '0') {
                msg.push('You must select \"Treatment Strategy\"');
            }

            if (attrs.TreatmentTypeID === '0') {
                msg.push('You must select \"Treatment\"');
            }

            return msg.length > 0 ? msg : false;
        },
        _collectionPropertyChanged: function(event) {

            this.set('Notes', this.Notes.toJSON(), {
                silent: true
            });

            if (event === 'change:EditStatus') {
                this.changeEditStatus(EditStatus.Update);
            }
        },
        _changed: function() {
            this.Notes.reset(this.get('Notes'));
        }

    });

    exports.getRefData = function() {
        return backend.getTreatmentRefData();
    };

    exports.getTreatmentTypes = function(id) {
        return backend.getSubRefData(id);
    };
    return exports;
});
