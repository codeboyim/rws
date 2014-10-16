define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Model = require('./model'),
        EditStatus = require('classes/EditStatus'),
        Modal = require('modal');

    var exports = require('backbone').View.extend({

        /** reference data 
         *@type {object}
         *@private
         *@property {object} refData.AssetCategories
         */
        refData: null,

        template: _.template(require('text!./tmplList.html')),

        tmplListItem: _.template(require('text!./tmplListItem.html')),

        events: {
            'change select': '_domEvents',
            'click [data-click]': '_domEvents',
            'keyup textarea': '_domEvents'
        },

        initialize: function(options) {

            if (!this.collection) {
                this.collection = new(require('./collection'))([new Model]);
            } else if (this.collection.length === 0) {
                this.collection.add({}, {
                    silent: true
                });
            }

            this.listenTo(this.collection, 'all', _.bind(this._collectionChanged, this));
        },

        render: function(reset) {
            var $item,
                factors = this._findNonDeleteFactors(),
                $clone,
                $tbody,
                list;

            $tbody = this.$el.html(this.template()).find('tbody:eq(0)');
            $clone = $tbody.clone();

            _.each(factors, function(factor, i) {
                $clone.append(this._renderListItem(factor));
            }, this);

            $tbody.append($clone.children());

            if (!reset) {
                list = this.collection.toJSON();

                if (!this.refData) {
                    Model.getRefData().done(_.bind(function(refData) {
                        exports.prototype.refData = refData || {};
                        this._render();
                    }, this));
                } else {
                    this._render();
                }
            }
            return this;
        },

        _render: function() {

            this.collection.each(function(factor) {
                this._bindViewData(factor.toJSON(), factor.$item);
            }, this);

            this.trigger('rendered', this);
        },

        _renderAssetSubCategories: function(factor) {
            var cat = this._findAssetCategory(factor.get('AssetCategoryID')),
                $sel;

            if (factor.get('AssetCategoryID') && cat && !cat.SubCategories) {

                $sel = factor.$item.find('[name=AssetSubCategoryID]').prop('disabled', true);
                Model.getSubRefData(cat.id).done(_.bind(function(_cat, d) {
                        _cat.SubCategories = d;
                        return d;
                    }, this, cat))
                    .then(_.bind(this._bindAssetSubCategories, this, factor))
                    .always(function() {
                        $sel.prop('disabled', false);
                    });

            } else {
                this._bindAssetSubCategories(factor, cat && cat.SubCategories || []);
            }
        },

        _bindAssetSubCategories: function(factor, subCates) {
            var $sel = factor.$item.find('select[name=AssetSubCategoryID]').find('option:not(:eq(0))').remove().end(),
                $selClone = $sel.clone();

            _.each(subCates, function(c) {
                $selClone.append($('<option value="' + c.id + '" ' + (factor.get('AssetSubCategoryID') === c.id ? 'selected' : '') + '>' + (c.desc || '') + '</option>'));
            });

            $sel.children().replaceWith($selClone.children());
        },

        _renderListItem: function(factor) {
            var $item = $(this.tmplListItem({
                    assetCategories: this._getAssetCategories()
                })),
                tdTreatment = $item.find('[data-contentid="treatmentListView"]'),
                attrs = factor.toJSON();

            $item.data('factor', factor);
            factor.$item = $item;
            factor.clear({
                silent: true
            }).set(attrs);

            (new(require('treatment/listView'))({
                collection: factor.Treatments,
                el: tdTreatment.get(0)
            })).render();

            return $item;
        },

        _collectionChanged: function(event) {
            var factor,
                collection,
                type,
                val,
                options,
                factors;

            switch (event) {

                case 'reset':
                    this.render(true);
                    break;

                case 'add':
                    /* (model, collection, options) */
                    factor = arguments[1];
                    options = arguments[3];

                    if (options.at) {
                        this._renderListItem(factor).insertAfter(this.$el.find('tbody>tr:eq(' + (options.at - 1) + ')'));
                    } else {
                        this._renderListItem(factor).appendTo(this.$el.find('tbody:eq(0)'));
                    }

                    break;

                case 'sort':
                    /* (collection, options) */
                    options = arguments[2];
                    if (options.factor && options.another && options.action) {

                        if (options.action === 'up') {
                            options.factor.$item.insertBefore(options.another.$item);
                        } else { //down
                            options.factor.$item.insertAfter(options.another.$item);
                        }

                    }
                    break;

                    //factor events
                case 'change:AssetCategoryID':
                    /* (model, value, options) */
                    factor = arguments[1];
                    factor.set('Assessment', _.extend(factor.get('Assessment') || {}, {
                        'AssetCategoryCode': (this._findAssetCategory(arguments[2]) || {}).code || ''
                    }), {
                        silent: true
                    });
                    this._renderAssetSubCategories(factor);
                    break;

                case 'change:EditStatus':
                    factor = arguments[1];
                    val = arguments[2];

                    if (val === EditStatus.Delete) {
                        factor.$item.remove();
                    }

                    break;

                case 'change:Assessment':
                    factor = arguments[1];
                    val = arguments[2];
                    factor.$item.find('.compFactorListItemRatingCol').css('background-color', val ? val.RatingColor : '');
                    break;

                case 'remove':
                    /* (model, collection, options) */
                    factor = arguments[1];
                    collection = arguments[2];
                    factor.$item.remove();

                    break;
                case 'change':
                    /* (model, options) */
                    factor = arguments[1];
                    this._bindViewData(factor.toJSON(), factor.$item);
                    break;
                default:
                    break;
            }

        },

        _domEvents: function(e) {
            var type = e.type,
                cmd,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                prop,
                name = $t.attr('name'),
                factor = $t.parents('[data-factor]:eq(0)').data('factor'),
                another,
                len = this.collection.length,
                idx = this.collection.indexOf(factor),
                assessmentView;

            e.stopPropagation();

            if (type === 'change' || type === 'keyup') {
                prop = {};

                if ($t.is('select')) {
                    prop[name] = $t.val();
                } else if ($t.is('textarea')) {
                    prop[name] = $t.val();
                }

                factor.set(prop).changeEditStatus(EditStatus.Update);
            } else if (type === 'click') {
                cmd = $t.data('click');
                e.preventDefault();

                switch (cmd) {

                    case 'rate':

                        assessmentView = new(require('assessment/view'))({
                            model: new(require('assessment/model'))(factor.get('Assessment'))
                        });

                        this.listenTo(assessmentView, {
                            'removed': function(view) {
                                this.stopListening(view);
                            },
                            'saved': function(props) {
                                factor.set('Assessment', props).changeEditStatus(EditStatus.Update);
                            }
                        });

                        Modal.show(assessmentView, 'compAssessmentModal');
                        break;

                    case 'add':

                        _.each(_.filter(this.collection.rest(idx + 1), this._nonDeleteFilter), function(f) {
                            f.set({
                                'OrderItem': f.get('OrderItem') + 1
                            }, {
                                silent: true
                            }).changeEditStatus(EditStatus.Update);
                        });

                        this.collection.add({
                            'OrderItem': factor.get('OrderItem') + 1
                        }, {
                            at: idx + 1
                        });
                        break;

                    case 'del':

                        if (confirm('You are going to delete this Risk Factor.\r\nDo you want to continue?')) {

                            _.each(_.filter(this.collection.rest(idx + 1), this._nonDeleteFilter), function(f) {
                                f.set({
                                    'OrderItem': f.get('OrderItem') - 1
                                }, {
                                    silent: true
                                }).changeEditStatus(EditStatus.Update);
                            });

                            if (factor.isNew()) {
                                this.collection.remove(factor);
                            } else {
                                factor.changeEditStatus(EditStatus.Delete);
                            }

                            if (!this._findNonDeleteFactors().length) {
                                this.collection.add(new Model);
                            }
                        }

                        break;

                    case 'up':

                        if (idx > 0) {

                            another = _.last(_.filter(this.collection.first(idx), this._nonDeleteFilter));

                            if (another) {
                                this._swapOrderItem(another, factor);
                                this.collection.sort({
                                    'factor': factor,
                                    'another': another,
                                    'action': 'up'
                                });
                            }

                        }

                        break;

                    case 'down':

                        if (idx < len) {
                            another = _.first(_.filter(this.collection.rest(idx + 1), this._nonDeleteFilter));

                            if (another) {
                                this._swapOrderItem(another, factor);
                                this.collection.sort({
                                    'factor': factor,
                                    'another': another,
                                    'action': 'down'
                                });
                            }
                        }

                        break;
                }
            }

        },

        _findAssetCategory: function(id) {
            return _.find(this._getAssetCategories(), function(c) {
                return c.id === id;
            });
        },

        _nonDeleteFilter: function(factor) {
            return factor.get('EditStatus') !== EditStatus.Delete;
        },

        _findNonDeleteFactors: function() {
            return this.collection.filter(this._nonDeleteFilter);
        },

        _getAssetCategories: function() {
            return (this.refData || {}).AssetCategories || [];
        },

        _swapOrderItem: function(f1, f2) {
            var order = f1.get('OrderItem');
            f1.set('OrderItem', f2.get('OrderItem'), {
                silent: true
            }).changeEditStatus(EditStatus.Update, true);
            f2.set('OrderItem', order, {
                silent: true
            }).changeEditStatus(EditStatus.Update);
        },

        _bindViewData: function(data, $item) {
            var $t;

            if (!$item) {
                return;
            }

            _.each(data, function(val, key) {
                $t = $item.find('[name=' + key + ']');

                if ($t.length === 0) {
                    return false;
                }

                switch ($t.prop('tagName').toLowerCase() + ($t.attr('type') ? (':' + $t.attr('type')) : '')) {

                    case 'select':

                        if (!_.find($t.children(), function(opt, i) {
                                if (opt.value === ((_.isNull(val) || _.isUndefined(val)) ? '' : val.toString())) {
                                    $t.prop('selectedIndex', i);
                                    return true;
                                }
                            })) {
                            $t.prop('selectedIndex', 0);
                        }

                        break;

                    case 'textarea':
                    case 'input:text':
                        $t.val(val || '');
                        break;

                }


            });

        }

    });


    return exports;
});
