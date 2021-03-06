var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Team Model
 * ==========
 */

var Team = new keystone.List('Team', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true }
});

Team.add({
    name: { type: String},
    position: {type: String},
    role: {type: String},
    priority: {type: String, required: true, default: '0'},
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    image: { type: Types.CloudinaryImage },
    discription: { type: Types.Html, wysiwyg: true, height: 150 },
    categories: { type: Types.Relationship, ref: 'TeamCategory', many: true }
});

Team.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

Team.defaultColumns = 'title, priority, state|20%, author|20%, publishedDate|20%';
Team.register();
