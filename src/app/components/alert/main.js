define(function(require) {
    var _ = require('underscore');

    /**
     * a replacement of browser's alert and confirm popup windows
     * @module components/alert
     * @param {string} message
     * @param {string} [type="notice"] - one of "notice", "warning", "success" and "error"
     * @param {function()} [okCallback] - if defined, "OK" button will be on
     * @param {function()} [cancelCallback] - if defined, "Cancel" button will be on
     * @param {object} [context] - the this object in ok and cancel callbacks
     */
    var exports = function(message) {
        var cancelCb,
            okCb,
            buttons = [],
            args = [].slice.call(arguments, 1),
            type = 'notice',
            context = args[args.length - 1];

        //normalize arguments
        if (typeof args[0] !== 'string') {
            args.unshift(type);
        }

        type = args[0];
        okCb = args[1] || null;
        cancelCb = args[2] || null;

        if (typeof context !== 'object') {
            context = null;
        }

        if (okCb && typeof(okCb) === 'function') {
            buttons.push({
                key: 'ok',
                text: 'OK',
                callback: _.bind(okCb, context)
            });
        }

        if (cancelCb && typeof(cancelCb) === 'function') {
            buttons.push({
                key: 'cancel',
                text: 'Cancel',
                callback: _.bind(cancelCb, context)
            });
        }

        require('modal').show(new(require('./view'))({
            message: message,
            buttons: buttons,
            type: type,
            buttonsClicked: function(key) {

                if (key === 'ok' && _.isFunction(okCb)) {
                    okCb.apply(context);
                } else if (key === 'cancel' && _.isFunction(cancelCb)) {
                    cancelCb.apply(context);
                }

            }
        }), 'compAlertModal ' + type);
    };

    return exports;
});
