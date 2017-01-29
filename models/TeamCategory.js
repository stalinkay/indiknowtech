var keystone = require('keystone');

/**
 * Team Category Model
 * ==================
 */

var TeamCategory = new keystone.List('TeamCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

TeamCategory.add({
	name: { type: String, required: true },
	priority: {type: String, required: true, default: '0'},
});

TeamCategory.relationship({ ref: 'Team', path: 'categories' });

TeamCategory.register();
