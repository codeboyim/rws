define(function(require) {
    var $ = require('jquery'),
        _ = require('underscore')
    alert = require('alert');

    return require('backbone').View.extend({

        template: _.template(require('text!./template.html')),

        events: {
            'click [data-click]': '_domEvents',
            'keyup :text[name]': '_domEvents'
        },

        initialize: function(options) {
            _.bindAll(this, '_beforeunload', '_subViewRendered');

            this.model = this.model || new(require('./model'));
            this._factorListView = null;
            this._analysisListView = null;
            this.listenTo(this.model, 'all', this._modelChanged);

            $(window).on('beforeunload', this._beforeunload);

        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this._subViewCount = 0;

            this._analysisListView = new(require('analysis/listView'))({
                    el: this.$('[data-contentid=analysisListView]').get(0),
                    collection: this.model.Analyses
                })
                .once('rendered', this._subViewRendered)
                .render();

            this._factorListView = new(require('factor/listView'))({
                    el: this.$('[data-contentid=factorListView]').get(0),
                    collection: this.model.RiskFactors
                })
                .once('rendered', this._subViewRendered)
                .render();

            return this;
        },

        _subViewRendered: function(view) {
            var props;

            view.renderedToRiskView = true;

            if (this._isSubViewRendered(this._analysisListView) && this._isSubViewRendered(this._factorListView)) {
                props = this.model.toJSON();
                this.model.clear({
                    silent: true
                }).set(props).setDirty(false);
                this.trigger('rendered', this);
            }
        },

        _isSubViewRendered: function(view) {
            return view && view.renderedToRiskView;
        },

        _modelChanged: function(event, model, val) {
            var error,
                matched,
                $input;

            switch (event) {

                case 'invalid':
                    console.warn(this.model.validationError);
                    break;

                case 'change:AssetID':
                    this._getByName('AssetID').val(val || '');
                    break;

                case 'change:AssetName':
                    this._getByName('AssetName').val(val || '');
                    break;

                case 'change:AssetOwner':
                    this._getByName('AssetOwner').val(val || '');
                    break;

                case 'change:activeStep':
                    this._get('button[data-inactivestep]').prop('disabled', false);
                    this._get('button[data-inactivestep="' + val + '"]').prop('disabled', true);
                    this._get('section[data-activestep]').hide();
                    this._get('section[data-activestep="' + val + '"]').show();
                    break;

                default:
                    break;

            }
        },

        _domEvents: function(e) {
            var type = e.type,
                $el = $(type === 'click' ? e.currentTarget : e.target),
                cmd, val,
                attrName, newProp,
                noteListView;

            if (type === 'click') {
                e.preventDefault();
                cmd = $el.data('click');

                switch (cmd) {

                    case 'go-next':
                        this.model.set('activeStep', this.model.get('activeStep') + 1);
                        break;

                    case 'go-prev':
                        this.model.set('activeStep', this.model.get('activeStep') - 1);
                        break;

                    case 'show-notes':
                        noteListView = new(require('note/listView'))({
                            collection: this.model.Notes
                        });

                        require('modal').show(noteListView, 'compNoteListModal');
                        break;

                    case 'save':
                        this.model.save().done(function() {
                            alert('Risk information saved', 'success');
                        });
                        break;


                    case 'reset':
                    case 'reload':
                        if (!this.model.isDirty()) {
                            this._reloadModel(cmd);
                        } else {
                            alert('You may lose any unsaved changes.\r\nDo you want to continue?', 'warning', function() {
                                this._reloadModel(cmd);
                            }, function() {}, this);
                        }
                        break;

                }
            } else if (type === 'keyup') {
                /*cared input name is after the corresponding prop's name*/
                attrName = $el.attr('name');
                val = $el.val().trim();
                newProp = {};
                newProp[attrName] = val;

                this.model.set(newProp, {
                    silent: true
                }).setDirty(true);
            }
        },

        _reloadModel: function(cmd) {
            if (cmd === 'reset') {
                this.model.set(new this.model.defaults).setDirty(false);
            } else {
                this.model.fetch();
            }
        },

        _beforeunload: function() {
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
            return this._get('[name="' + name + '"]');
        }
    });

});
