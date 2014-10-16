define(function(require) {
    var store = require('./store'),
        $ = require('jquery');

    return {

        /**
         * retrieve bundled reference data
         * @param {object=} cb - hash object of optional callbacks for interested field, e.g. {'NoteTypes': {success:function(object=), failed:function(): always:function(), ... }}
         * @param {object} refDataHash - hash object whose keys are interested field names and values are respective codes, e.g. {'NoteTypes': 'notetype', ...}
         */
        _getBundleRefData: function(refDataHash) {
            var _this = this,
                refData = {},
                fields = _.keys(refDataHash),
                codes = _.values(refDataHash);

            return $
                .when.apply($,
                    _.map(codes,
                        _.bind(function(code) {
                            return this._getRefData(code);
                        }, this)))
                .then(function() {
                    var vals = [].slice.apply(arguments);

                    _.each(fields, function(f, i) {
                        refData[f] = vals[i];
                    });

                    return refData;
                });

        },

        _getAjaxBundleRefData: function(refDataHash) {
            var fields = _.keys(refDataHash),
                refData = {},
                url = $PAN$APPROOT + 'Governance/AS3959.aspx/GetRefData';

            return $.Deferred(function(d) {
                $.when.apply($, _.map(fields, function(f) {
                    return $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        data: $PAN$JSON.serialize({
                            code: refDataHash[f]
                        }),
                        dataType: 'json'
                    })
                })).done(function() {
                    var resps;

                    if (fields.length > 1) {
                        resps = [].slice.apply(arguments);
                    } else {
                        resps = [
                            [].slice.apply(arguments)
                        ];
                    }

                    _.each(fields, function(f, i) {
                        refData[f] = (resps[i][0].d || resps[i][0]).result || null;
                    });

                    d.resolve(refData);

                }).fail(function(res) {
                    res.responseText;
                }).always(function() {});
            }).promise();


        },
        /** call server to retrieve reference data */
        _getRefData: function(code) {

            return $.Deferred(function(deferred) {
                //mimic the networking delay
                window.setTimeout(function() {
                    deferred.resolve(store[code]);
                }, 1000);
            }).promise();
        },

        getRefData: function(cb, code) {
            return this._getRefData(cb, code);
        },

        getAS3959RefData: function(cb) {
            return $.Deferred(function(d) {
                d.resolve();
            });
        },

        getNoteRefData: function() {
            return this._getBundleRefData({
                'NoteTypes': 'notetype',
                'NoteStatuses': 'notestat'
            });
        },

        getRescheduleReasons: function(cb) {
            return this._getAjaxBundleRefData({
                'Reschedule': 'reschedule'
            });
        },

        getAnalysisRefData: function() {
            return this._getBundleRefData({
                'AnalysisTypes': 'riskassessmentmethod'
            });
        },

        getRiskFactorRefData: function() {
            return this._getBundleRefData({
                'AssetCategories': 'assetcategory'
            });
        },

        getAssessmentRefData: function() {

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
            return this._getBundleRefData({
                'TreatmentStrategis': 'TreatStrat',
                'TreatmentManagers': 'Treatmgr',
                'BushfireManagementZones': 'bmz'
            });
        },

        getSubRefData: function(id) {

            return $.Deferred(function(d) {
                window.setTimeout(function() {
                    d.resolve(store.subrefdata[id] || null);
                }, 500);
            }).promise();
        },

        saveRisk: function(risk) {

            return $.Deferred(function(d) {

                window.setTimeout(function() {
                    store.risks.push(risk.toJSON());
                    d.resolve(risk.toJSON());
                }, 500);

            }).promise();
        },

        getRiskById: function(id) {

            return $.Deferred(function(d) {

                window.setTimeout(function() {
                    d.resolve(store.risks[store.risks.length - 1] || null);
                }, 500);

            }).promise();
        }
    };

});
