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
        /**
         * output current risk model JSON string to console
         */
        log: function() {
            console.log(JSON.stringify(riskView.model.toJSON()));
        },
        /**
         * reset risk model
         */
        clear: function() {
            riskView.model.clear({
                silent: true
            }).set(new riskView.model.defaults).setDirty(false);
        },
        /**
         * load last record in temprary in-memory data store
         */
        loadSample: function() {
            riskView.model.clear({
                silent: true
            }).set(store.risks[store.risks.length - 1]).setDirty(false);
        }
    }
});
