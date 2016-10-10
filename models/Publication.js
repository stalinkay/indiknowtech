var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Publication Model
 * ==========
 */

var Publication = new keystone.List('Publication', {
	map: { name: 'refrence' },
	autokey: { path: 'slug', from: 'refrence', unique: true },
});

Publication.add({
	refrence: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	link: { type: String},
	linktext: { type: String},
	categories: { type: Types.Relationship, ref: 'PublicationCategory', many: true },
});

Publication.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Publication.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Publication.register();
