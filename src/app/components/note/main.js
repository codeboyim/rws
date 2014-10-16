define(['backend', 'EditStatus', './NoteCollection', './NoteListView', './NoteView'],
function (backend, EditStatus, NoteCollection, NoteListView, NoteView) {
    var NoteModel = (new NoteCollection()).model;

    var exports = _.extend({
        _views: {}
    }, Backbone.Events);

    exports.loadView = function (name, options) {
        var self = this,
            note,
            collection;

        if (!this._views[name]) {

            switch (name) {
                case 'list':
                    this._views[name] = new NoteListView({ collection: options && options.collection || null, readOnly: options && options.readOnly });
                    break;

                case 'note':
                    this._views[name] = new NoteView({ readOnly: options && options.readOnly });
                    break;
            }

            if (this._views[name]) {
                this.listenTo(this._views[name], 'all', self._noteEvents);
            }
        }

        return this._views[name] || null;
    }

    exports.getView = function (name) {
        return this._views[name] || null;
    };

    exports._noteEvents = function (event) {
        var view,
            note;

        switch (event) {
            case 'new':
            case 'edit':
                note = arguments[1];

                view = this.loadView('note', { readOnly: this._views['list'] && this._views['list'].getReadOnly() }).on('loaded', function (v) {
                    v.model.clear({ silent: true }).set(note.toJSON());
                }).render();

                view.originalModel = note;
                break;

            case 'saved':

                if (arguments[2].collection.indexOf(arguments[2]) < 0) {
                    note = arguments[2].collection.add(arguments[1].toJSON()).changeEditStatus(EditStatus.Create);
                }
                else {
                    note = arguments[2].set(arguments[1].toJSON()).changeEditStatus(EditStatus.Update);
                }

                break;

            case 'unloaded':
                view = arguments[1];

                _.each(this._views, function (_view, name) {

                    if (view === _view) {
                        this.stopListening(this._views[name]);
                        this._views[name] = null;
                    }

                }, this);
                break;
        }

    };

    return exports;

});