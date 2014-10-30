define(function(require) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        $ = require('jquery'),
        _views = [],
        _container = null;

    var exports = _.extend({

            show: function(content, className) {
                var view = new(require('./view')),
                    container;

                if (!_views.length) {

                    _container = $('<div class="compModalContainer"><div class="compModalOverlay"></div></div>')
                        .appendTo(document.body)
                        .on('click', this.close);

                    $(document).on('keydown', this.close);

                    //prevent double scrollbars when modal shows
                    $(document.body).css('overflow', 'hidden');
                } else {
                    _views[0].hide();
                }

                view.render(content, className).$el.appendTo(_container);

                _views.unshift(view);

                this.listenTo(view, 'removed', function(v) {
                    _views.splice(_views.indexOf(v), 1);

                    if (!_views.length) {
                        _container.off('click');
                        _container.remove();
                        _container = null;
                        $(document).off('keydown', this.close);
                        $(document.body).css('overflow', '');
                    } else {

                        _views[0].show();
                    }

                });
            },

            close: function() {
                var args = [].slice.apply(arguments);

                if (args[0] && args[0].type === 'keydown') {

                    if (args[0].keyCode === 27) {
                        _views[0].close();
                    }
                } else if (args[0] && args[0].type === 'click') {
                    if (~args[0].target.className.indexOf('compModalWrap')) {
                        _views[0].close();
                    }
                } else {
                    _views[0].close();

                }
            }
        },
        Backbone.Events);

    return exports;
});
