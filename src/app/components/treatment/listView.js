define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Model = require('./model'),
        Collection = require('./collection'),
        EditStatus = require('classes/EditStatus'),
        tmplListItem = require('text!./tmplListItem.htm'),
        Modal = require('modal'),
        View = require('./view');

    var exports = require('backbone').View.extend({

        tmplListItem: _.template(tmplListItem),

        events: {
            'click [data-click]': '_domEvents',
            'focus :text[readonly], textarea[readonly]': '_domEvents'
        },

        /** @constructs */
        initialize: function(options) {

            if (!this.collection) {
                this.collection = new Collection([new Model]);
            } else if (this.collection.length === 0) {
                this.collection.add({}, {
                    silent: true
                });
            }
            this.$el.addClass('compTreatmentList');
            this.listenTo(this.collection, 'all', this._collectionChanged);

        },

        render: function() {
            var $cloned = this.$el.children().remove().end().clone(),
                treatments = this._findNonDeleteTreatments();

            if (!treatments.length) {
                treatments.push(this.collection.add(new Model, {
                    silent: true
                }));
            };
            _.each(treatments, function(treatment) {
                $cloned.append(this._renderListItem(treatment));
            }, this);

            this.$el.append($cloned.children());

            return this;
        },

        _renderListItem: function(treatment) {
            var $item = $(this.tmplListItem(treatment.toJSON())).data('treatment', treatment);
            treatment.$item = $item;
            this._bindViewData(treatment.toJSON(), treatment.$item);
            return $item;
        },

        _collectionChanged: function(event) {
            var treatment,
                val,
                treatments;

            switch (event) {

                case 'reset':
                    this.render();
                    break;

                case 'add':
                    treatment = arguments[1];
                    options = arguments[3];

                    if (options.at) {
                        this._renderListItem(treatment).insertAfter(this.$el.find('[data-treatment]:eq(' + (options.at - 1) + ')'));
                    } else {
                        this._renderListItem(treatment).appendTo(this.$el);
                    }

                    break;

                case 'remove':
                    treatment = arguments[1];
                    treatment.$item.remove();
                    break;

                case 'sort':
                    options = arguments[2];
                    if (options.treatment && options.another && options.action) {

                        if (options.action === 'up') {
                            options.treatment.$item.insertBefore(options.another.$item);
                        } else { //down
                            options.treatment.$item.insertAfter(options.another.$item);
                        }

                    }
                    break;

                case 'change:EditStatus':
                    treatment = arguments[1];
                    val = arguments[2];

                    if (val === EditStatus.Delete) {
                        treatment.$item.remove();
                    }
                    break;

                case 'change':
                    treatment = arguments[1];
                    this._bindViewData(treatment.toJSON(), treatment.$item);
                    break;
            }


        },

        _domEvents: function(e) {
            var type = e.type,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                cmd,
                treatment = $t.parents('[data-treatment]:eq(0)').data('treatment'),
                idx = this.collection.indexOf(treatment),
                len = this.collection.length,
                another,
                list,
                order,
                notes,
                gis,
                view;

            e.stopPropagation();

            if (type === 'click') {
                cmd = $t.data('click');
                e.preventDefault();

                switch (cmd) {

                    case 'add':

                        _.each(_.filter(this.collection.rest(idx + 1), this._nonDeleteFilter), function(t) {
                            t.set({
                                'OrderItem': t.get('OrderItem') + 1
                            }, {
                                silent: true
                            }).changeEditStatus(EditStatus.Update);
                        }, this);

                        this.collection.add({
                            OrderItem: treatment.get('OrderItem') + 1
                        }, {
                            at: idx + 1
                        });
                        break;

                    case 'del':

                        if (confirm('You are going to delete this Treatment.\r\nDo you want to continue?')) {

                            _.each(_.filter(this.collection.rest(idx + 1), this._nonDeleteFilter), function(t) {
                                t.set({
                                    'OrderItem': t.get('OrderItem') - 1
                                }, {
                                    silent: true
                                }).changeEditStatus(EditStatus.Update);
                            }, this);


                            if (treatment.isNew()) {
                                this.collection.remove(treatment);
                            } else {
                                treatment.changeEditStatus(EditStatus.Delete);
                            }

                            if (!this._findNonDeleteTreatments().length) {
                                this.collection.add(new Model);
                            }

                        }
                        break;

                    case 'up':

                        if (idx > 0) {
                            another = _.last(_.filter(this.collection.first(idx), this._nonDeleteFilter));

                            if (another) {
                                this._swapOrderItem(another, treatment);
                                this.collection.sort({
                                    'treatment': treatment,
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
                                this._swapOrderItem(another, treatment);
                                this.collection.sort({
                                    'treatment': treatment,
                                    'another': another,
                                    'action': 'down'
                                });
                            }
                        }
                        break;

                    case 'edit':
                        view = new View({
                            model: new Model(treatment.toJSON()),
                        });

                        this.listenTo(view, 'saved', function(props) {
                            treatment.set(props);
                        });

                        Modal.show(view, 'compTreatmentModal');
                        break;

                    case 'note':

                        require('modal').show(
                            new(require('note/listView'))({
                                collection: treatment.Notes
                            }), 'compNoteListModal');

                        break;

                    case '':
                        break;
                }
            }

        },

        _nonDeleteFilter: function(treatment) {
            return treatment.get('EditStatus') !== EditStatus.Delete;
        },

        _findNonDeleteTreatments: function() {
            return this.collection.filter(this._nonDeleteFilter);
        },

        _swapOrderItem: function(m1, m2) {
            var order = m1.get('OrderItem');
            m1.set({
                'OrderItem': m2.get('OrderItem')
            }).changeEditStatus(EditStatus.Update, true);
            m2.set({
                'OrderItem': order
            }).changeEditStatus(EditStatus.Update);
        },

        _bindViewData: function(data, $el) {
            var $t;

            _.each(data, function(val, key) {
                $t = $el.find('[name=' + key + ']');

                if ($t.length === 0) {
                    return false;
                }

                switch ($t.prop('tagName').toLowerCase() + ($t.attr('type') ? (':' + $t.attr('type')) : '')) {

                    case 'select':

                        if (!_.find($t.children(),

                                function(opt, i) {

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

                        if ($t.hasClass('date-field')) {
                            $t.val(val ? val.localeFormat('d') : '')
                        } else {
                            $t.val(val || '');
                        }

                        break;
                }

            });
        }

    });

    return exports;

});
