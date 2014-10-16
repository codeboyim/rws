define(function(require) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        $ = require('jquery'),
        Collection = require('./collection'),
        View = require('./view'),
        Model = require('./model'),
        Modal = require('modal'),
        EditStatus = require('classes/EditStatus');

    var exports = Backbone.View.extend({

        template: _.template(require('text!./tmplList.html')),

        events: {
            'click [data-click]': '_domEvents'
        },

        initialize: function(options) {
            this.collection = this.collection || new Collection;
            this.listenTo(this.collection, 'all', this.render);
        },

        render: function() {

            _.each(this.$el.html(this.template({
                analyses: this.collection.toJSON(),
            })).find('tbody tr'), function(tr, i) {
                $(tr).data('analysis', this.collection.at(i));
            }, this);

            this.rendered = true;
            this.trigger('rendered', this);

            return this;
        },

        _domEvents: function(e) {
            var type = e.type,
                $el = type === 'click' ? $(e.currentTarget) : $(e.target),
                cmd, val,
                analysisModel = null,
                analysisView;

            e.stopPropagation();

            if (type === 'click') {
                e.preventDefault();
                cmd = $el.data('click');

                switch (cmd) {

                    case 'edit':
                        analysisModel = $el.parents('tr:eq(0)').data('analysis');

                    case 'create':
                        analysisView = new View({
                            model: new Model(analysisModel ? analysisModel.toJSON() : null)
                        });

                        this.listenTo(analysisView, {
                            'rendered': _.bind(this._analysisViewEvents, this, 'rendered'),
                            'removed': _.bind(this._analysisViewEvents, this, 'removed'),
                            'saved': _.bind(this._analysisViewEvents, this, 'saved', analysisModel)
                        })

                        Modal.show(analysisView, 'compAnalysisModal');
                        break;

                    case 'del':

                        if (confirm('You are going to delete this analysis.\r\nDo you want to continue?')) {
                            this.collection.remove($el.parents('tr:eq(0)').data('analysis'));
                        }

                        break;
                }
            }
        },

        _analysisViewEvents: function(event) {
            var analysisModel, analysisView, newAttrs;

            switch (event) {

                case 'rendered':
                    analysisView = arguments[1];
                    analysisView.model.setDirty(false);
                    break;

                case 'removed':
                    analysisView = arguments[1];
                    this.stopListening(analysisView);
                    break;

                case 'saved':
                    analysisModel = arguments[1];
                    newAttrs = arguments[2];

                    if (analysisModel) {
                        analysisModel.set(newAttrs).changeEditStatus(EditStatus.Update);
                        this.collection.sort();
                    } else {
                        this.collection.add(newAttrs).changeEditStatus(EditStatus.Create);
                    }

                    break;

            }

        }

    });


    return exports;

});
