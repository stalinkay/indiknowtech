var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * StudentProject Model
 * ==========
 */

var StudentProject = new keystone.List('StudentProject', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

StudentProject.add({
    title: { type: String},
    name: { type: String},
    qualification: {type: Types.Select, options: 'Honors, Masters, PhD, PhD Candidate', default: 'Honors'},
    yearOfCompletion: {type: Types.Select, options: 'pending, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020', default: 'pending'},
    principalSupervisor: {type: String, default: 'Principal supervisor'},
    associateSupervisor: {type: String, default: 'Associate supervisor'},
    externalSupervisor: {type: String, default: 'External supervisor'},
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    image: { type: Types.CloudinaryImage },
    content: {
  		brief: { type: Types.Html, wysiwyg: true, height: 150 },
  		extended: { type: Types.Html, wysiwyg: true, height: 400 },
  	},
    categories: { type: Types.Relationship, ref: 'StudentProjectCategory', many: true }
});

StudentProject.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

StudentProject.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
StudentProject.register();
