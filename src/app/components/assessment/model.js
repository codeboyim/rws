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
            var msg = [];

            if (_.isNull(attrs.IsFrequent)) {
                msg.push('You must answer "Do fires occur frequently"');
            }

            if (_.isNull(attrs.IsExpectedToSpread)) {
                msg.push('You must answer "If a fire occurs, is it expected to spread and reach the asset?"');
            }

            switch (attrs.AssetCategoryCode) {

                case 'HS':

                    if (!attrs.VegetationClassID) {
                        msg.push('You must select "Vegetation Class"');
                    }

                    if (!attrs.VegetationAgeID) {
                        msg.push('You must select "Vegetation Age"');
                    }

                    if (!attrs.CanopyID) {
                        msg.push('You must select "Canopy"');
                    }

                    if (!attrs.VulnerabilityID) {
                        msg.push('You must select "Vulnerability"');
                    }

                    break;

                case 'EC':

                    if (!attrs.ImpactLevelID) {
                        msg.push('You must select "Level of Impact"');
                    }

                    if (!attrs.RecoveryCostsID) {
                        msg.push('You must select "Recovery Costs"');
                    }

                    break;

                case 'EN':

                    if (!attrs.ConservationStatusID) {
                        msg.push('You must select "Conservation Status"');
                    }

                    if (!attrs.GeographicExtentID) {
                        msg.push('You must select "Geographic Extent"');
                    }

                    if (!attrs.PotentialImpactID) {
                        msg.push('You must select "Potential Impact of Fire"');
                    }

                    break;

                default:
                    break;
            }

            return msg.length > 0 ? msg : null;
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
