define(function(require) {
    var _ = require('underscore');

    var exports = function(message) {
        var cancelCb,
            okCb,
            buttons = [],
            args = [].slice.call(arguments, 1),
            type = 'notice',
            context = args[args.length - 1];


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
            type: type
        }), 'compAlertModal ' + type);
    };

    return exports;
});
