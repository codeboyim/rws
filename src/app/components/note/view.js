define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery');

    var exports = require('backbone').View.extend({

        refData: null,

        template: _.template(require('text!./template.html')),

        events: {
            'click [data-click]': '_domEvents',
            'change select': '_domEvents',
            'keyup :text, textarea': '_domEvents'
        },
        initialize: function(options) {
            _.bindAll(this, '_windowUnload');

            if (!this.model) {
                this.model = new(require('./model'));
            }

            $(window).on('beforeunload', this._windowUnload);
            this.listenTo(this.model, 'all', this._modelChanged);
        },

        render: function() {

            if (!this.refData) {

                require('./model').getRefData().done(_.bind(function(d) {
                    exports.prototype.refData = d;
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
            this._$dateRaised = this.$('[name=DateRaised]');
            this._$dateRaised.datepicker({
                showOn: 'focus',
                duration: "fast",
                maxDate: new Date(),
                onSelect: _.bind(this._noteDateSelected, this)
            });

            this.model.clear({
                silent: true
            }).set(props);

            this.trigger('rendered', this);
        },

        remove: function() {

            if (this.model.isDirty() && !confirm('You may lose unsaved changes.\r\nDo you want to continue?')) {
                return;
            }

            this._$dateRaised.datepicker('destroy');
            $(window).off('beforeunload', this._windowUnload);
            require('backbone').View.prototype.remove.apply(this);
            this.trigger('removed', this);
        },

        _modelChanged: function(event) {
            var props;

            if (event === 'change' && (props = this.model.changedAttributes())) {

                _.each(props, function(v, k) {
                    var el = this._get(k);

                    if (el.length > 0) {

                        if (k === 'DateRaised') {
                            el.val(v ? v.formatDate() : '');
                        } else if (el.is(':text') || el.is('textarea')) {
                            el.val(v || '');
                        } else if (el.is('select')) {
                            el.val(0).find('option[value=' + (v || 0) + ']').attr('selected', true);
                        }
                    }

                }, this);
                
            } else if (event === 'invalid') {
                console.warn(this.model.validationError);
            }

        },

        _windowUnload: function() {

            if (this.model.isDirty()) {
                return 'You may lose any unsaved changes.\r\nDo you want to continue?';
            }
        },

        _noteDateSelected: function(text, inst) {

            this.model.set({
                'DateRaised': inst.input.datepicker('getDate')
            }, {
                silent: true
            }).setDirty(true);

        },

        _domEvents: function(e) {
            var type = e.type,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                cmd,
                prop;

            e.stopPropagation();

            if (type === 'click') {
                e.preventDefault();
                cmd = $t.data('click');

                switch (cmd) {

                    case 'close':
                        this.remove();
                        break;

                    case 'save':

                        if (!this.model.isDirty()) {
                            return this.remove();
                        }

                        if (this.model.isValid()) {
                            this.trigger('saved', this.model.toJSON());
                            this.model.setDirty(false);
                            this.remove();
                        }

                        break;

                    default:
                        break;
                }
            } else if (type === 'change' || type === 'keyup') {
                prop = {};

                prop[$t.attr('name')] = $t.val();

                if ($t.attr('name') === 'NoteTypeID') {
                    prop['NoteTypeDesc'] = $t.find(':selected').text();
                } else if ($t.attr('name') === 'NoteStatusID') {
                    prop['NoteStatusDesc'] = $t.find(':selected').text();
                }

                this.model.set(prop, {
                    silent: true
                });

                this.model.setDirty(true);
            } else {
                //fallback
            }
        },

        _get: function(identifier) {

            if (!this._cached) {
                this._cached = {};
            }

            if (!this._cached[identifier]) {

                if (identifier[0] === '#' || identifier[0] === '.') {
                    this._cached[identifier] = this.$(identifier);
                } else {
                    this._cached[identifier] = this.$('[name=' + identifier + ']');
                }

            }
            return this._cached[identifier];

        }

    });

    return exports;

});
