define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Model = require('./model');

    var exports = require('backbone').View.extend({

        refData: null,

        consequenceTemplates: {
            'HS': _.template(require('text!./tmplHS.html')),
            'EC': _.template(require('text!./tmplEC.html')),
            'EN': _.template(require('text!./tmplEN.html'))
        },

        tmplOption: _.template('<option value="<%=id%>"><%-desc%></option>'),
        template: _.template(require('text!./template.html')),

        events: {
            'click [data-click]': '_domEvents',
            'change :radio, select': '_domEvents',
            'keyup :text, textarea': '_domEvents'
        },

        initialize: function(options) {
            _.bindAll(this, '_beforeunload');

            if (!this.model) {
                this.model = new Model;
            }

            this.listenTo(this.model, 'all', this._modelChanged);
            $(window).on('beforeunload', this._beforeunload);
        },

        render: function() {

            if (!this.refData) {

                Model.getRefData()
                    .done(_.bind(function(refData) {

                        if (refData.Separations) {
                            refData.Separations = _.sortBy(refData.Separations, 'code');
                        }
                        if (refData.SlopeDegrees) {
                            refData.SlopeDegrees = _.sortBy(refData.SlopeDegrees, 'code');
                        }

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

            this.model.clear({
                silent: true
            }).set(props);

            this.trigger('rendered', this);
            return this;
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
                require('backbone').View.prototype.remove.apply(this);
                this.trigger('removed', this);
            }, this));

        },

        _modelChanged: function(event) {
            var categoryName,
                code,
                codemap,
                vegID,
                vegCate,
                matched,
                input,
                name,
                typedName,
                attrVal,
                opt;

            switch (event) {
                case 'invalid':
                    alert(this.model.validationError);
                    break;

                case 'change:VegetationClassID':
                    this._getByName('VegetationAgeID').find('option:not(:eq(0))').remove();
                    this._getByName('CanopyID').find('option:not(:eq(0))').remove();
                    vegID = arguments[2];

                    if (vegID) {

                        this._renderVegSubCategories(_.find(this.refData.VegClasses, function(vc) {
                            return vc.id === vegID;
                        }));

                    } else {

                        this.model.set({
                            'VegetationAgeID': null,
                            'CanopyID': null
                        });
                    }

                    break;

                default:

                    break;
            }

            matched = /change:(.*)/.exec(event);

            if (matched && (name = matched[1]) && (input = this._getByName(name))[0]) {
                typedName = input.prop('tagName').toLowerCase() + (input.attr('type') ? (':' + input.attr('type')) : '');
                attrVal = arguments[2];

                switch (typedName) {
                    case 'input:text':
                    case 'textarea':
                    case 'select':
                        input.val(attrVal ? attrVal : (typedName === 'select' ? 0 : ''));

                        break;

                    case 'input:radio':

                        if (typeof attrVal === 'boolean' || attrVal) {
                            input.filter('[value=' + attrVal.toString() + ']').attr('checked', true);
                            code = input.filter(':checked').data('code');

                            if ((matched = /(.*)ID/.exec(name)) && this.model.has(matched[1] + 'Code')) {
                                this.model.set(matched[1] + 'Code', !_.isUndefined(code) ? code : '', {
                                    silent: true
                                });
                            }

                        } else {
                            input.attr('checked', false);
                        }

                        break;
                }

            }

        },

        _renderVegSubCategories: function(veg) {
            var tmpSelect = $('<select></select>'),
                canopyId = this.model.get('CanopyID'),
                ageId = this.model.get('VegetationAgeID');

            this._getByName('VegetationAgeID').html(this.tmplOption({
                'id': 0,
                'desc': '--'
            }));

            this._getByName('CanopyID').html(this.tmplOption({
                'id': 0,
                'desc': '--'
            }));

            if (veg) {
                _.each(veg.age, function(age) {
                    $(this.tmplOption(age)).appendTo(tmpSelect).prop('selected', age.id === ageId);
                }, this);

                this._getByName('VegetationAgeID').append(tmpSelect.children());

                _.each(veg.canopy, function(canopy) {
                    $(this.tmplOption(canopy)).appendTo(tmpSelect).prop('selected', canopy.id === canopyId);
                }, this);

                this._getByName('CanopyID').append(tmpSelect.children());
            }
        },

        _domEvents: function(e) {
            var type = e.type,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                cmd = $t.data(type),
                name = $t.attr('name'),
                props = {},
                val,
                silent = false;

            e.stopPropagation();

            if (type === 'click') {
                e.preventDefault();

                switch (cmd) {

                    case 'close':
                        this.remove();
                        return;

                    case 'save':

                        if (this.model.isValid()) {
                            this.trigger('saved', this.model.setDirty(false).toJSON());
                            this.remove();
                        }

                        break;
                }

            } else if (type === 'change') {

                if ($t.is(':radio')) {
                    val = this._getByName(name).filter(':checked').val();

                    if (_.contains(['IsFrequent', 'IsExpectedToSpread'], name)) {
                        props[name] = val === 'true';
                    } else {
                        props[name] = val;
                    }

                } else if ($t.is('select')) {
                    console.log(typeof $t.val());
                    props[name] = $t.val();

                    if (name === 'VegetationClassID') {
                        _.extend(props, {
                            'CanopyID': null,
                            'VegetationAgeID': null
                        });
                    }
                }

                this.model.set(props).setDirty(true);
            } else if (type === 'keyup') {

                if ($t.is(':text, textarea')) {
                    val = $t.val();
                    props[name] = val;
                    silent = true;
                }

                this.model.set(props).setDirty(true);
            }
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
        }

    });

    return exports;
});
