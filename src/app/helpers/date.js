define(['jquery-ui/datepicker'], function(datepicker){
    Date.prototype.formatDate = function(){
        return datepicker.formatDate(datepicker._defaults.dateFormat, this);
    }
    
    Date.parseDate = function(strDate){
        return datepicker.parseDate(datepicker._defaults.dateFormat, strDate);
    }
    
    return null;
});