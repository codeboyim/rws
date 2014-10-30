define(function(require) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        $ = require('jquery'),
        Model = require('./model'),
        alert = require('alert');

    var exports = Backbone.View.extend({
        template: _.template(require('text!./template.html')),
        tmplType: null,
        refData: null,

        events: {
            'click [data-click]': '_domEvents',
            'change :radio, select': '_domEvents',
            'keyup [data-keyup]': '_domEvents'
        },

        initialize: function(options) {
            _.bindAll(this, '_windowUnload');

            if (!this.model) {
                this.model = new Model();
            }
            this.listenTo(this.model, 'all', this._modelChanged);
            $(window).on('beforeunload', this._windowUnload);

        },

        render: function() {

            if (!this.refData) {
                this._get('TypeID').prop('disabled', true);
                Model.getRefData()
                    .done(_.bind(function(d) {
                        exports.prototype.refData = d || {};
                        this._render();
                    }, this))
                    .always(_.bind(function() {
                        this._get('TypeID').prop('disabled', false);
                    }, this));
            } else {
                this._render();
            }

            return this;
        },

        _render: function() {
            var attrs;

            this.$el.html(this.template());

            this._get('.date-field').datepicker({
                showOn: 'focus',
                duration: "fast",
                maxDate: new Date(),
                onSelect: _.bind(this._dateSelected, this)
            });

            attrs = this.model.toJSON();

            this.model.clear({
                silent: true
            }).set(attrs);
            this.trigger('rendered', this);

        },

        remove: function() {

            $.Deferred(_.bind(function(deferred) {

                if (!this.model.isDirty()) {
                    deferred.resolve();
                } else {
                    alert('You may lose unsaved changes.\r\nDo you want to continue?', 'warning', function() {
                        deferred.resolve();
                    }, function() {});
                }
            }, this)).done(_.bind(function() {

                $(window).off('beforeunload', this._windowUnload);
                this._get('.date-field').datepicker('destroy');
                Backbone.View.prototype.remove.apply(this);
                this.trigger('removed', this);

            }, this));
        },

        _domEvents: function(e) {
            var type = e.type,
                $t = type === 'click' ? $(e.currentTarget) : $(e.target),
                cmd,
                name,
                val,
                obj,
                defaults;

            e.stopPropagation();

            if (type === 'click') {
                cmd = $t.data('click');

                switch (cmd) {

                    case 'close':
                        this.remove();
                        break;

                    case 'save':

                        if (this.model.isValid()) {
                            this.trigger('saved', this.model.unset('EditStatus').toJSON());
                            this.model.setDirty(false);
                            this.remove();
                        }

                        break;
                }
            } else if (type === 'change') {
                name = $t.attr('name');
                val = $t.val();
                defaults = this.model.defaults();

                if (!_.isUndefined(defaults[name])) {
                    obj = {};
                    obj[name] = val;

                    if (name === 'TypeID') {
                        obj['TypeDesc'] = (val !== '0' && this._searchRefData('AnalysisTypes', val) || {}).desc || '';
                    }

                    this.model.set(obj, {
                        silent: true
                    }).setDirty(true);
                }
            } else if (type === 'keyup') {
                name = $t.attr('name');
                val = $t.val();
                obj = {};
                obj[name] = val;

                if (_.contains(['EffortHours', 'HourlyRate', 'TotalCost'], name)) {

                    obj[name] = val.trim() === '' ? null : Number(val.trim());

                    if (name === 'TotalCost') {
                        _.extend(obj, {
                            'EffortHours': null,
                            'HourlyRate': null
                        });
                    } else {
                        _.extend(obj, {
                            'TotalCost': null
                        });
                    }

                    if (this.model.set(obj, {
                            validate: true,
                            prop: name
                        })) {

                        if (_.isNumber(this.model.get('EffortHours')) && _.isNumber(this.model.get('HourlyRate'))) {
                            this.model.set({
                                'TotalCost': Math.round(this.model.get('EffortHours') * this.model.get('HourlyRate') * 100) / 100
                            });
                        }

                    }

                } else {
                    this.model.set(obj, {
                        silent: true
                    }).setDirty(true);
                }

            }
        },

        _modelChanged: function(eventName) {
            var changed,
                defaults,
                options = arguments[3];

            if (eventName === 'invalid') {
                alert(this.model.validationError, 'warning');
            } else if (eventName === 'change') {

                defaults = this.model.defaults();

                _.each(this.model.setDirty(true).attributes, function(val, key) {

                    if (this._get(key).length > 0) {
                        switch (key) {
                            case 'DateAssessed':
                                this._get(key).datepicker('setDate', val);
                                break;
                            default:
                                this._get(key).val(val || defaults[key]);
                                break;
                        }
                    }
                }, this);
            }
        },

        _dateSelected: function() {
            var newProps = {},
                name = arguments[1].input.attr('name'),
                defaults = this.model.defaults();

            //check if the datetime property is of model's
            if (!_.isUndefined(defaults[name])) {
                newProps[name] = this._get(name).datepicker('getDate');
                this.model.set(newProps, {
                    silent: true
                }).setDirty(true);
            }
        },

        _windowUnload: function() {
            if (this.model.isDirty()) {
                return 'You may lose unsaved changes.';
            }
        },

        /**
         * quick method to get dom element by name, class or id
         * @param {string} identifier - element name, otherwise id, when started with '#', or class, when started with '.'
         */
        _get: function(identifier) {
            this._cache = this._cache || {};

            if (identifier[0] === '#' || identifier[0] === '.') {
                this._cache[identifier] = this.$(identifier);
            } else {
                this._cache[identifier] = this.$('[name=' + identifier + ']');
            }

            return this._cache[identifier];
        },
        _searchRefData: function(type, id) {
            return _.find(this.refData[type], function(d) {
                return d.id === id;
            });
        }
    });



    return exports;
});
