define(function(require) {
    var EditStatus = require('classes/EditStatus'),
        _ = require('underscore');

    var exports = require('classes/SuperModel').extend({

        initialize: function() {
            this.on('change:IsFrequent change:IsExpectedToSpread', this._calculateRating);
        },

        defaults: {
            'RecordID': 0,
            'AssetCategoryCode': '',
            'IsFrequent': null,
            'IsExpectedToSpread': null,
            'VegetationClassID': null,
            'VegetationAgeID': null,
            'CanopyID': null,
            'SeparationID': null,
            'VulnerabilityID': null,
            'ImpactLevelID': null,
            'RecoveryCostsID': null,
            'ConservationStatusID': null,
            'GeographicExtentID': null,
            'PotentialImpactID': null,
            'Rating': null,
            'RatingColor': null,
            'EditStatus': EditStatus.None
        },

        validate: function(attrs, options) {
            var valid = true;

            if (_.isNull(attrs.IsFrequent) || _.isNull(attrs.IsExpectedToSpread)) {
                valid = false;
            } else {

                switch (attrs.AssetCategoryCode) {

                    case 'HS':

                        if (!attrs.VegetationClassID || !attrs.VegetationAgeID || !attrs.CanopyID || !attrs.VulnerabilityID) {
                            valid = false;
                        }

                        break;

                    case 'EC':

                        if (!attrs.ImpactLevelID || !attrs.RecoveryCostsID) {
                            valid = false;
                        }

                        break;

                    case 'EN':

                        if (!attrs.ConservationStatusID || !attrs.GeographicExtentID || !attrs.PotentialImpactID) {
                            valid = false;
                        }

                        break;

                    default:
                        break;
                }
            }

            return valid ? null : 'Please select required fields';
        },

        _calculateRating: function() {
            var rating = null,
                color = '',
                isFrequent = this.get('IsFrequent'),
                isExpectedToSpread = this.get('IsExpectedToSpread');

            if (!_.isNull(isFrequent) && !_.isNull(isExpectedToSpread)) {

                if (isFrequent === isExpectedToSpread) {

                    if (isFrequent) {
                        rating = 3;
                        color = '#f18f91';
                    } else {
                        rating = 1;
                        color = '#55b053';
                    }

                } else {
                    rating = 2;
                    color = '#cad064';
                }
            }

            this.set({
                'Rating': rating,
                'RatingColor': color
            }, {
                silent: true
            });
        }
    });

    exports.getRefData = function() {
        return require('helpers/backend').getAssessmentRefData();
    };

    return exports;
});
