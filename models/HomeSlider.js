var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * HomeSlider Model
 * ==========
 */

var HomeSlider = new keystone.List('HomeSlider', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

HomeSlider.add({
	title: { type: String, index: true, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	image1: { type: Types.CloudinaryImage },
	image2: { type: Types.CloudinaryImage },
	image3: { type: Types.CloudinaryImage },
	image4: { type: Types.CloudinaryImage },
	image5: { type: Types.CloudinaryImage },
});

HomeSlider.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

HomeSlider.defaultColumns = 'title, state|20%';
HomeSlider.register();
