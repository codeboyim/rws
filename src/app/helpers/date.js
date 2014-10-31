define(['jquery-ui/datepicker'], function(datepicker) {
    /**
     * define default date parse and toString functions
     */

    Date.prototype.formatDate = function() {
        return datepicker.formatDate(datepicker._defaults.dateFormat, this);
    }

    Date.parseDate = function(strDate) {
        return datepicker.parseDate(datepicker._defaults.dateFormat, strDate);
    }

    return null;
});
