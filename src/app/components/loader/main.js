define(function(require) {
    var _ = require('underscore'),
        template = _.template(require('text!./template.html')),
        loading = false,
        counter = 0,
        loader;

    /**
     * css3 loading animation. credit to http://tobiasahlin.com/spinkit/
     * @module component/loader
     */
    var exports = {

        start: function() {

            counter++;

            if (loader) {
                return;
            }

            var tmp = document.createElement('div');
            tmp.innerHTML = template();
            loader = document.body.appendChild(tmp.childNodes[0]);
        },

        stop: function() {
            counter--;

            if (loader && !counter) {
                document.body.removeChild(loader);
                loader = null;
            }
        },

        reset: function() {

            if (loader) {
                counter = 1;
                this.stop();
            }

        }
    };
    
    return exports;
});
