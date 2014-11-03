define(function(require) {
    var _ = require('underscore'),
        store = require('helpers/store'),
        loader = require('loader'),
        riskView = new(require('risk/view'))({
            el: document.getElementById('appContainer')
        }).on('rendered', function() {
            loader.stop();
        });

    riskView.render();

    /**
     * APIs for testing from console
     * @exports app
     */
    return {
        log: function() {
            console.info('current risk view model', JSON.stringify(riskView.model.toJSON()));
        },
        clear: function() {
            riskView.model.clear({
                silent: true
            }).set(new riskView.model.defaults).setDirty(false);
            console.info('risk view model has been cleared');
        }
    }
});
