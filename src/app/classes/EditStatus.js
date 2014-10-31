define(function () {
/**
 * a flag to tell backend service what to do with the object.
 * It's mostly useful for updating the collection type of properties of an object,
 * e.g. Notes in Risk. The database won't get updated when those collections are
 * being added, deleted or modified on UI, insteadly they will be updated along with
 * the object they belong to is sent back to database.
 * @readonly
 * @enum {number}
 */
    return {
        'None': 0,
        'Create': 1,
        'Update': 2,
        'Delete': 3
    };

});
