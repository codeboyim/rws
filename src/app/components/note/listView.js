define(function(require) {
    var $ = require('jquery'),
        _ = require('underscore'),
        EditStatus = require('classes/EditStatus'),
        alert = require('alert');

    /**
     * alert view
     * @class
     */
    var exports = require('backbone').View.extend({

        template: _.template(require('text!./tmplList.html')),

        tmplListItem: _.template(require('text!./tmplListItem.html')),

        events: {
            'click [data-click]': '_domEvents'
        },

        initialize: function(options) {

            if (!this.collection) {
                this.collection = new require('./collection');
            }

            this.listenTo(this.collection, 'all', this.render);
        },

        render: function() {
            var $tbl = $(this.template()),
                $tbody = $tbl.find('tbody');

            this.$el.children().remove();

            this.collection.each(function(note) {
                if (note.get('EditStatus') !== EditStatus.Delete) {
                    $tbody.append($(this.tmplListItem(note.toJSON())).data('note', note));
                }
            }, this);

            this.$el.append($tbl);
            this.trigger('rendered', this);
            return this;
        },

        remove: function() {
            require('backbone').View.prototype.remove.apply(this);
            this.trigger('removed', this);
        },

        _domEvents: function(e) {
            var type = e.type,
                $t = $(type === 'click' ? e.currentTarget : e.target),
                cmd,
                note = $t.parents('tr:eq(0)').data('note'),
                view;

            e.stopPropagation();

            if (type === 'click') {
                cmd = $t.data('click');

                switch (cmd) {

                    case 'create':
                    case 'edit':
                        view = new(require('./view'))({
                            model: cmd === 'edit' ? new(require('./model'))(note.toJSON()) : null
                        });

                        this.listenTo(view, {
                            'removed': this._noteViewRemoved,
                            'saved': _.bind(this._noteViewSaved, this, note)
                        });

                        require('modal').show(view, 'compNoteModal');
                        break;

                    case 'close':
                        this.remove();
                        break;

                    case 'del':
                        alert('You are going to delete this note.\r\nDo you want to continue?', 'warning', function() {

                            if (note.isNew()) {
                                this.collection.remove(note);
                            } else {
                                note.changeEditStatus(EditStatus.Delete);
                            }

                            this.trigger('deleted', note);
                        }, function() {}, this);
                        break;
                }
            }

        },
        _noteViewRemoved: function(view) {
            this.stopListening(view);
        },

        _noteViewSaved: function(note, props) {
            if (note) {
                note.set(props).changeEditStatus(EditStatus.Update);
            } else {
                this.collection.add(props).changeEditStatus(EditStatus.Create);
            }
        }
    });


    return exports;

});
