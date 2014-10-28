define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery');

    var exports = require('backbone').View.extend({
        template: _.template(require('text!./template.html')),

        events: {
            'click [data-click]': '_domEvents'
        },
        initialize: function(options) {
            _.bindAll(this, 'remove');
            this._message = options.message || '';
            this._buttons = options.buttons || [];
            this._type = options.type || 'notice';

            switch (this._type) {
                case 'success':
                    this._faicon = 'check-circle';
                    break;
                case 'error':
                    this._faicon = 'times-circle';
                    break;
                case 'warning':
                    this._faicon = 'exclamation-triangle';
                    break;
                case 'notice':
                default:
                    this._faicon = 'exclamation-circle';
                    break;
            }
        },

        render: function() {
            this.$el.html(this.template());
            this.trigger('rendered', this);

            // if (!this._buttons.length) {
            //     window.setTimeout(this.remove, 5000);
            // }

            return this;
        },
        _domEvents: function(e) {
            var action = $(e.currentTarget).data('click'),
                button;

            if (action) {
                e.preventDefault();
                e.stopPropagation();

                button = _.find(this._buttons, function(btn) {
                    return btn.key === action;
                });

                if (button && _.isFunction(button.callback) && !button.callback.apply(this)) {
                    this.remove();
                }
            }
        },

        remove: function() {
            require('backbone').View.prototype.remove.call(this);
            this.trigger('removed', this);
        }
    });

    return exports;
});
