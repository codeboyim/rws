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
        },

        render: function(content, className) {
            var $modal;

            this._content = content;
            this._className = className;
            this.$el.html(this.template());
            this._$modal = this.$el.find('.compModal');
            this._status = null;

            this.show('openning');

            this.listenTo(content, {
                'removed': function() {
                    if (this._status === 'closing') {
                        this.remove();
                    } else {
                        this.close();
                    }
                },
                'rendered': function() {
                    this._content.$el.addClass('compModalContent');

                    window.requestAnimationFrame(_.bind(function() {
                        this._content.$el.addClass('compModalContentActive');
                    }, this));

                }
            });

            this.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', _.bind(function() {

                switch (this._status) {
                    case 'openning':
                        this._$modal.append(this._content.render().$el);
                        break;
                    case 'showing':
                        this._content.$el.show();
                        break;
                    case 'hiding':
                        this.trigger('hidden');
                        break;
                    case 'closing':
                        this._content.remove();
                        break;
                }

                this._status = null;
            }, this));

            return this;
        },

        _domEvents: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.type === 'click' && $(e.currentTarget).data('click') === 'close') {
                this.close();
            }
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this);
            this.trigger('removed', this);
        },

        show: function(status) {

            window.setTimeout(_.bind(function() {
                this._status = status || 'showing';
                this._$modal.addClass(this._className + ' compModalActive');
            }, this), 60);

        },

        hide: function(status) {
            this._content.$el.hide();
            this._status = status || 'hidding';
            this._$modal.removeClass(this._className).removeClass('compModalActive');
        },
        close: function() {
            this.hide('closing');
        }

    });

    return exports;
});
