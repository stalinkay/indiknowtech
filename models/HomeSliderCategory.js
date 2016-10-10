var keystone = require('keystone');

/**
 * HomeSliderCategory Model
 * ==================
 */

var HomeSliderCategory = new keystone.List('HomeSliderCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

HomeSliderCategory.add({
	name: { type: String, required: true },
});

HomeSliderCategory.relationship({ ref: 'HomeSlider', path: 'categories' });

HomeSliderCategory.register();
