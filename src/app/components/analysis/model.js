define(function(require) {
    var regexHour = /^(?:\d*\.\d?|\d+)$/,
        regexCurrency = /^(?:\d*\.\d{0,2}|\d+)$/,
        backend = require('helpers/backend'),
        _ = require('underscore'),
        EditStatus = require('classes/EditStatus');

    var exports = require('classes/SuperModel').extend({

        defaults: function() {
            return {
                'RecordID': 0,
                'TypeID': 0,
                'TypeDesc': '',
                'DateAssessed': null,
                'AssessorID': 0,
                'AssessorName': '',
                'AssessmentTeam': '',
                'EffortHours': null,
                'HourlyRate': null,
                'TotalCost': null,
                'EditStatus': EditStatus.None
            }
        },

        validate: function(attrs, options) {
            var msg = [];

            if (options && options.prop && attrs.hasOwnProperty(options.prop)) {

                if (options.prop === 'EffortHours' || options.prop === 'HourlyRate') {

                    if (!_.isNull(attrs['EffortHours']) && (!_.isNumber(attrs['EffortHours']) || !regexHour.test(attrs['EffortHours']))) {
                        msg.push('\"Effort Hours\" expects a number with optional 1 decimal place.');
                    }

                    if (!_.isNull(attrs['HourlyRate']) && (!_.isNumber(attrs['HourlyRate']) || !regexCurrency.test(attrs['HourlyRate']))) {
                        msg.push('\"Hourly Rate\" expects a number with optional 2 decimal places.');
                    }

                } else if (options.prop === 'TotalCost' && !_.isNull(attrs['TotalCost']) && (!_.isNumber(attrs['TotalCost']) || !regexCurrency.test(attrs['TotalCost']))) {
                    msg.push('\"Total Cost\" expects a number with optional 2 decimal places.');
                }

                if (msg.length > 0) {
                    return msg;
                } else {
                    return null;
                }
            }


            if (!attrs['TypeID']) {
                msg.push('You must select an Analysis Type');
            }

            if (_.isNull(attrs['DateAssessed'])) {
                msg.push('You must select the Date of Risk Assessment');
            }

            if (!attrs['AssessorName']) {
                msg.push('You must select a Risk Assessor');
            }

            if (!attrs['AssessmentTeam']) {
                msg.push('You must enter Assessment Team');
            }

            if (msg.length > 0) {
                return msg;
            }
        },

        toServerObject: function() {
            var obj = {},
                d;

            _.each(exports._modelObjectMap, function(objName, modelName) {

                obj[objName] = this.get(modelName);

                if (_.isDate(obj[objName])) {
                    obj[objName].toUTC();
                }

            }, this);

            return obj;
        }

    });

    exports._modelObjectMap = {
        'RecordID': 'RecordID',
        'TypeID': 'AnalysisTypeID',
        'TypeDesc': 'AnalysisTypeDesc',
        'DateAssessed': 'DateAssessment',
        'AssessorID': 'AssessorID',
        'AssessorName': 'AssessorFullName',
        'AssessmentTeam': 'AssessTeam',
        'EffortHours': 'ActualEffortHour',
        'HourlyRate': 'HourlyRate',
        'TotalCost': 'AssessCost'
    };

    exports.fromServerObject = function(servObj) {
        var model = {};

        _.each(exports._modelObjectMap, function(objName, modelName) {
            var d;

            model[modelName] = servObj[objName];

            if (_.isDate(model[modelName])) {
                model[modelName].toLocal();
            }

        }, this);

        return model;
    };

    exports.getRefData = function() {
        return backend.getAnalysisRefData();
    }

    return exports;
});
