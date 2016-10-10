var keystone = require('keystone');

/**
 * StudentProject Category Model
 * ==================
 */

var StudentProjectCategory = new keystone.List('StudentProjectCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

StudentProjectCategory.add({
	name: { type: String, required: true },
});

StudentProjectCategory.relationship({ ref: 'StudentProject', path: 'categories' });

StudentProjectCategory.register();
