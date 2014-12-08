define(function(require) {
    var store = require('./store'),
        $ = require('jquery'),
        loader = require('loader'),

        /**
         * network throtting simulation in ms
         * @type {Number}
         */
        mimicAjaxDelay = 2000;

    return {

        /**
         * retrieve bundled reference data
         * @param {Object} refDataHash - hash object whose keys are interested field names and values are respective codes, e.g. {'NoteTypes': 'notetype', ...}
         */
        _getBundleRefData: function(refDataHash) {
            var refData = {},
                fields = _.keys(refDataHash),
                codes = _.values(refDataHash);

            return $.when.apply($,
                    _.map(codes,
                        _.bind(function(code) {
                            return this._getRefData(code);
                        }, this)))
                .then(function() {
                    var vals = [].slice.apply(arguments);

                    _.each(fields, function(f, i) {
                        refData[f] = vals[i];
                    });

                    console.log('done');

                    return refData;
                });

        },

        /**
         * retrieve reference data
         * @param  {String} code
         * @return {Object} $.promise
         */
        _getRefData: function(code) {
            loader.start();

            return $.Deferred(function(deferred) {
                window.setTimeout(function() {
                    deferred.resolve(store[code]);
                    loader.stop();
                }, mimicAjaxDelay);
            }).promise();
        },

        getNoteRefData: function() {
            console.log('loading Note reference data');
            return this._getBundleRefData({
                'NoteTypes': 'notetype',
                'NoteStatuses': 'notestat'
            });
        },

        getAnalysisRefData: function() {
            console.log('loading Analysis reference data');
            return this._getBundleRefData({
                'AnalysisTypes': 'riskassessmentmethod'
            });
        },

        getRiskFactorRefData: function() {
            console.log('loading Risk Factor reference data');
            return this._getBundleRefData({
                'AssetCategories': 'assetcategory'
            });
        },

        getAssessmentRefData: function() {
            console.log('loading Assessment reference data');
            return this._getBundleRefData({
                'VegClasses': 'vegetationclass',
                'Separations': 'separation',
                'Vulnerabilities': 'vulnerab',
                'ImpactLevels': 'impactlvl',
                'RecoveryCosts': 'recocost',
                'ConservationStatus': 'conservst',
                'GeographicExtents': 'geoextent',
                'PotentialImpacts': 'fireimpact'
            });
        },

        getTreatmentRefData: function() {
            console.log('loading Treatment reference data');
            return this._getBundleRefData({
                'TreatmentStrategis': 'TreatStrat',
                'TreatmentManagers': 'Treatmgr',
                'BushfireManagementZones': 'bmz'
            });
        },

        getSubRefData: function(id) {
            loader.start();
            console.log('loading sub reference data');

            return $.Deferred(function(d) {
                window.setTimeout(function() {
                    d.resolve(store.subrefdata[id] || null);
                    console.log('done');
                    loader.stop();
                }, mimicAjaxDelay);
            }).promise();
        },

        saveRisk: function(risk) {
            loader.start();
            console.log('saving Risk');

            return $.Deferred(function(d) {

                window.setTimeout(function() {
                    store.risks.push(risk.toJSON());
                    d.resolve(risk.toJSON());
                    loader.stop();
                }, mimicAjaxDelay);

            }).promise();
        },

        getRiskById: function(id) {
            loader.start();
            console.log('loading Risk');

            return $.Deferred(function(d) {

                window.setTimeout(function() {
                    d.resolve(store.risks[store.risks.length - 1] || null);
                    loader.stop();
                }, mimicAjaxDelay);

            }).promise();
        }
    };

});
