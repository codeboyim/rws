define(function(require) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        $ = require('jquery');

    var exports = Backbone.View.extend({

        template: _.template(require('text!./template.htm')),

        attributes: {
            'class': 'compModalWrap'
        },

        events: {
            'click [data-click]': '_domEvents'
        },

        initialize: function() {
            this._content = null;
            this._contentAppended = false;
        },

        render: function(content, className) {
            var $modal;

            this._content = content;
            this.$el.html(this.template());

            window.setTimeout(_.bind(function() {
                $modal = this.$el.find('.compModal').addClass(className + ' compModalActive');
            }, this), 60);

            this.listenTo(content, {
                'removed': function() {
                    this.remove();
                },
                'rendered': function() {
                    this._content.$el.addClass('compModalContent');

                    window.requestAnimationFrame(_.bind(function() {
                        this._content.$el.addClass('compModalContentActive');
                    }, this));

                }
            });

            this.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', _.bind(function() {
                if (!this._contentAppended) {
                    $modal.append(this._content.render().$el);
                    this._contentAppended = true;
                }
            }, this));

            return this;
        },

        _domEvents: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.type === 'click' && $(e.currentTarget).data('click') === 'close') {
                this._content.remove();
            }
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this);
            this.trigger('removed', this);
        },

        close: function() {
            this._content.remove();
        }

    });

    return exports;
});
