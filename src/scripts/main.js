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
    }]

});


require(['app'], function(app) {
    $.noConflict();
    window.app = app;
});
