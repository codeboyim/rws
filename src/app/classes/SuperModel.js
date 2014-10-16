define(['./EditStatus', 'backbone'], function (EditStatus, Backbone) {
    
    var exports = Backbone.Model.extend({

        isPristine: function () {
            return !this.get('RecordID') && (!this.get('EditStatus') || this.get('EditStatus') === EditStatus.None);
        },

        isNew: function () {
            return this.isPristine() || this.get('EditStatus') === EditStatus.Create;
        },

        isDirty: function () {
            return !!this._dirty;
        },

        setDirty: function (dirty) {
            this._dirty = dirty;
            return this;
        },

        changeEditStatus: function (toStatus, silent) {
            var newStatus = EditStatus.None,
                nowStatus = this.get('EditStatus');

            switch (toStatus) {

                case EditStatus.Create:
                case EditStatus.Delete:
                    newStatus = toStatus;
                    break;

                case EditStatus.Update:
                    newStatus = this.isNew() ? EditStatus.Create : EditStatus.Update;
                    break;
            }

            if (!this._dirty) {
                this._dirty = true;
            }

            this.unset('EditStatus', { silent: true }).set('EditStatus', newStatus, { silent: !!silent });
            return this;
        }

    });
    
    return exports;

});