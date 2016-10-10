var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * News Model
 * ==========
 */

var News = new keystone.List('News', {
    map: { name: 'linktext' },
    autokey: { path: 'slug', from: 'linktext', unique: true }
});

News.add({
    linktext: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    link: { type: String},
    publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
    source: { type: String}
});

News.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

News.defaultColumns = 'linktext, state|20%, author|20%, publishedDate|20%';
News.register();
