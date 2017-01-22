var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

PostCategory.add({
	name: { type: String, required: true },
	priority: {type: String, required: true, default: '0'},
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.defaultColumns = 'name, priority|50%';
PostCategory.register();
