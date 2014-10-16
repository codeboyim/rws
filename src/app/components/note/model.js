define(function(require) {
    var EditStatus = require('classes/EditStatus'),
        backend = require('helpers/backend');

    var exports = require('classes/SuperModel').extend({
        defaults: {
            'RecordID': 0,
            'NoteTypeID': 0,
            'NoteTypeDesc': '',
            'NoteStatusID': 0,
            'NoteStatusDesc': '',
            'RaisedBy': null,
            'DateRaised': new Date(),
            'Comment': '',
            'EditStatus': EditStatus.None
        },
        validate: function(attrs, options) {
            var errors = [];

            if (attrs.NoteTypeID === '0') {
                errors.push('You must select \"Note Type\"');
            }

            if (attrs.NoteStatusID === '0') {
                errors.push('You must select \"Status\"');
            }

            if (attrs.RaisedBy === '') {
                errors.push('You must enter \"Raised By\"');
            }

            if (!attrs.DateRaised) {
                errors.push('You must select \"Date Raised\"');
            }

            if (attrs.Comment.length === 0) {
                errors.push('You must enter \"Comment\"');
            }

            return errors.length > 0 ? errors : null;
        }

    });

    exports.getRefData = function() {
        return backend.getNoteRefData();
    };

    return exports;
});
