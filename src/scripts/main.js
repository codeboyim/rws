require.config({
    deps: ['app', 'helpers/date', 'helpers/currency', 'jquery-ui/i18n/datepicker-en-AU'],

    baseUrl: 'app',

    paths: {
        'jquery-ui': '../lib/jquery-ui/ui',
        'underscore': '../lib/underscore/underscore',
        'backbone': '../lib/backbone/backbone',
        'jquery': '../lib/jquery/dist/jquery',
        'text': '../lib/requirejs-text/text',
        'risk': 'components/risk',
        'treatment': 'components/treatment',
        'analysis': 'components/analysis',
        'assessment': 'components/assessment',
        'note': 'components/note',
        'factor': 'components/factor',
    },
    packages: [{
        name: 'app',
        location: '.'
    }, {
        name: 'modal',
        location: 'components/modal'
    }, {
        name: 'loader',
        location: 'components/loader'
    }, {
        name: 'alert',
        location: 'components/alert'
    }]

});

require(['loader'], function(loader) {
    loader.start();
});
require(['app'], function(app) {
    $.noConflict();
    window.app = app;
    console.info('now, you can type \'app.log()\' display current risk model. type \'app.clear()\' to clear the fields');
});
