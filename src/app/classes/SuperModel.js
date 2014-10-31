define(['./EditStatus', 'backbone'], function(EditStatus, Backbone) {

    /**
     * the super class for the Models. Normally, all model classes should inherit from
     * this class.
     * @class
     */
    var exports = Backbone.Model.extend({

        /**
         * return true if the instance has never been tempered with, otherwise false.
         * @return {boolean}
         */
        isPristine: function() {
            return !this.get('RecordID') && (!this.get('EditStatus') || this.get('EditStatus') === EditStatus.None);
        },

        /**
         * return true if the instance isPristine or marked as "create"
         * @return {boolean}
         */
        isNew: function() {
            return this.isPristine() || this.get('EditStatus') === EditStatus.Create;
        },

        /**
         * return true if the instance has been modified.
         * @return {boolean}
         */
        isDirty: function() {
            return !!this._dirty;
        },

        /**
         * under some circumstances, when the internal state of an instance is changed
         * we don't wish it to be marked as "dirty". so it's simply set to true exclusively
         * when it's meant to be.
         * @summary exclusively mark the instance modified.
         * @param {boolean} dirty
         * @return {object} the instance itself for chaining
         */
        setDirty: function(dirty) {
            this._dirty = dirty;
            return this;
        },

        /**
         * a simple algorithm to set the correct status
         * @param {number} toStatus - EditStatus enum to change to
         * @param {boolean} silent - pass true if not to fire model events
         * @return {object} the instance itself for chaining
         */
        changeEditStatus: function(toStatus, silent) {
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

            this.unset('EditStatus', {
                silent: true
            }).set('EditStatus', newStatus, {
                silent: !!silent
            });
            return this;
        }

    });

    return exports;

});
