define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Model = require('./model'),
        EditStatus = require('classes/EditStatus');

    var exports = require('backbone').View.extend({

        template: _.template(require('text!./template.html')),

        tmplSelectOptions: null,

        refData: null,

        events: {
            'click [data-click]': '_domEvents',
            'change :radio, select': '_domEvents',
            'keyup :text, textarea': '_domEvents'
        },

        initialize: function(options) {
            _.bindAll(this, '_beforeunload', '_dateSelected');

            if (!this.model) {
                this.model = new Model;
            }

            this.listenTo(this.model, 'all', this._modelChanged);
            $(window).on('beforeunload', this._beforeunload);
        },

        render: function() {

            if (!this.refData) {

                Model.getRefData().done(_.bind(function(refData) {
                    exports.prototype.refData = refData;
                    this._render();
                }, this));

            } else {
                this._render();
            }

            return this;
        },

        _render: function() {
            var props = this.model.toJSON();

            this.$el.html(this.template());

            if (!this.tmplSelectOptions) {
                exports.prototype.tmplSelectOptions = _.template(this.$('[data-template="tmplSelectOptions"]').html());
            }

            this.$el.find('.date-field').datepicker({
                'showOn': 'focus',
                'duration': 'fast',
                'onSelect': this._dateSelected
            });

            this.model.clear({
                silent: true
            }).set(props);

            this.trigger('rendered', this);
        },

        _renderTreatmentTypes: function(types) {
            var val = this.model.get('TreatmentTypeID');

            this._getByName('TreatmentTypeID').html(this.tmplSelectOptions({
                options: types
            }));

            this.model.unset('TreatmentTypeID', {
                silent: true
            }).set('TreatmentTypeID', val);

        },

        remove: function() {

            //use promise to avoid duplication, and chain the async activities.
            $.Deferred(_.bind(function(deferred) {
                if (!this.model.isDirty()) {
                    deferred.resolve();
                } else {
                    alert('You may lose any unsaved changes.\r\nDo you want to continue?', 'warning', function() {
                        deferred.resolve();
                    }, function() {});
                }
            }, this)).done(_.bind(function() {
                $(window).off('beforeunload', this._beforeunload);
                this.$el.find('.date-field').datepicker('destroy');
                require('backbone').View.prototype.remove.apply(this);
                this.trigger('removed', this);
            }, this));

        },

        _modelChanged: function(event) {
            var matched,
                strategyId,
                strategy,
                strategyTypes,
                newVal = arguments[2],
                isPartOfPlan;

            if (event === 'invalid') {
                alert(this.model.validationError);
                return;
            }

            switch (event) {

                case 'change:AssetName':
                    this._get('#spnAssetName').text(newVal || '');
                    break;


                case 'change:TreatmentStrategyID':
                    this._getByName('TreatmentTypeID').find('option:not(:eq(0))').remove();
                    strategyId = newVal;

                    if (strategyId && strategyId !== '0') {
                        strategy = _.find(this.refData && this.refData.TreatmentStrategis || {}, function(v) {
                            return v.id === strategyId;
                        });

                        if (strategy) {
                            strategyTypes = strategy.types;

                            if (!strategyTypes) {
                                this._getByName('TreatmentTypeID').prop('disabled', true);

                                Model.getTreatmentTypes(strategyId)
                                    .done(_.bind(function(types) {
                                        strategy.types = types;
                                        this._renderTreatmentTypes(types);

                                    }, this))
                                    .always(_.bind(function() {
                                        if (!this._readOnly) {
                                            this._getByName('TreatmentTypeID').prop('disabled', false);
                                        }
                                    }, this));
                            } else {
                                this._renderTreatmentTypes(strategyTypes);
                            }
                        }
                    } else {
                        this.model.set({
                            'TreatmentTypeID': '0'
                        });
                    }
                    break;

                case 'change:IsPartOfPlan':
                    isPartOfPlan = typeof newVal === 'boolean' && newVal;
                    this._get('[data-domid=fireManagementPlanWrap], [data-domid=fireManagementPlanWrap] label, [data-domid=fireManagementPlanWrap] input:text')
                        .prop('disabled', !isPartOfPlan);

                    if (!isPartOfPlan) {
                        this.model.set('FireManagementPlan', '');
                    }

                    break;

            }

            matched = /change:(.*)/.exec(event);

            if (matched && (name = matched[1]) && (input = this._getByName(name))[0]) {
                typedName = input.prop('tagName').toLowerCase() + (input.attr('type') ? (':' + input.attr('type')) : '');

                switch (typedName) {

                    case 'select':

                        if (!_.find(input.children(),

                                function(opt, i) {

                                    if (opt.value === ((_.isNull(newVal) || _.isUndefined(newVal) || newVal === '0') ? '' : newVal.toString())) {
                                        input.prop('selectedIndex', i);
                                        return true;
                                    }

                                })) {
                            input.prop('selectedIndex', 0);
                        }

                        if (name === 'TreatmentStrategyID') {
                            this.model.set('TreatmentStrategyDesc', (newVal !== '0' && this._searchRefData('TreatmentStrategis', newVal) || {}).desc || '')
                        } else if (name === 'TreatmentTypeID') {
                            this.model.set('TreatmentTypeDesc', (newVal !== '0' && this._searchStrategyTypes(this.model.get('TreatmentStrategyID'), newVal) || {}).desc || '')
                        }
                        break;


                    case 'input:text':
                    case 'textarea':

                        if (input.hasClass('date-field')) {
                            input.val(newVal ? newVal.formatDate() : '')
                        } else {
                            input.val(newVal || '');
                        }

                        break;

                    case 'input:radio':

                        if (typeof newVal === 'boolean' || newVal) {
                            input.filter('[value=' + newVal.toString() + ']').attr('checked', true);
                        } else {
                            input.attr('checked', false);
                        }

                        break;
                }

            }
        },

        _domEvents: function(e) {
            var type = e.type,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                cmd = $t.data(type),
                name = $t.attr('name'),
                props = {},
                val,
                parcel,
                left;

            e.stopPropagation();

            if (type === 'click') {
                e.preventDefault();

                switch (cmd) {

                    case 'close':
                        this.remove();
                        return;

                    case 'save':

                        if (!this.model.isDirty()) {
                            this.remove();
                        } else if (!this.model.isValid()) {
                            return;
                        } else {
                            this._save();
                        }

                        break;

                    case 'undo-scheduled-date':

                        this.model.set({
                            'ScheduledDate': null
                        }).changeEditStatus(EditStatus.Update);

                        break;

                }

            } else if (type === 'change') {

                if ($t.is(':radio')) {
                    val = this._getByName(name).filter(':checked').val();

                    if (_.contains(['IsPartOfPlan'], name)) {
                        props[name] = val === 'true';
                    } else {
                        props[name] = val;
                    }

                } else if ($t.is('select')) {
                    props[name] = $t.val();

                    if (name === 'TreatmentStrategyID') {
                        _.extend(props, {
                            'TreatmentTypeID': '0'
                        });
                    }
                }

                this.model.set(props).changeEditStatus(EditStatus.Update);
            } else if (type === 'keyup') {

                if ($t.is(':text, textarea')) {
                    val = $t.val();
                    props[name] = val;
                }

                this.model.set(props).changeEditStatus(EditStatus.Update);
            }
        },

        _dateSelected: function(txt, inst) {

            this.model.set('ScheduledDate', inst.input.datepicker('getDate'), {
                silent: true
            }).changeEditStatus(EditStatus.Update);

        },

        _save: function() {
            this.trigger('saved', this.model.toJSON());
            this.model.setDirty(false);
            this.remove();
        },

        _beforeunload: function(e) {

            if (this.model.isDirty()) {
                return 'You may lose any unsaved changes.';
            }
        },

        _get: function(identifier) {
            this._cache = this._cache || {};

            if (!this._cache[identifier]) {
                this._cache[identifier] = this.$(identifier);
            }

            return this._cache[identifier];
        },

        _getByName: function(name) {
            return this._get('[name=' + name + ']');
        },

        _searchRefData: function(type, id) {
            return _.find(this.refData[type], function(d) {
                return d.id === id;
            });
        },

        _searchStrategyTypes: function(strategyId, typeId) {
            return _.find(this._searchRefData('TreatmentStrategis', strategyId).types || [], function(type) {
                return type.id === typeId;
            });
        }

    });


    return exports;

});
