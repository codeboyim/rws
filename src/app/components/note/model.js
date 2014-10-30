define(function(require) {
    var EditStatus = require('classes/EditStatus'),
        backend = require('helpers/backend');

    var exports = require('classes/SuperModel').extend({
        defaults: {
            'RecordID': 0,
            'NoteTypeID': '0',
            'NoteTypeDesc': '',
            'NoteStatusID': '0',
            'NoteStatusDesc': '',
            'RaisedBy': '',
            'DateRaised': new Date(),
            'Comment': '',
            'EditStatus': EditStatus.None
        },
        validate: function(attrs, options) {
            var error = '';

            if (attrs.NoteTypeID === '0' ||
                attrs.NoteStatusID === '0' ||
                attrs.RaisedBy.trim() === '' ||
                !attrs.DateRaised ||
                attrs.Comment.length === 0) {
                error = 'Please fill the required fields';
            }

            return error || null;
        }

    });

    exports.getRefData = function() {
        return backend.getNoteRefData();
    };

    return exports;
});
