var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});


	// Load comments on the Post
	view.on('init', function (next) {
		keystone.list('PostComment').model.find()
			.where('post', locals.data.post)
			.where('commentState', 'published')
			.sort('-publishedOn')
			.exec(function (err, comments) {
					if (err) return res.err(err);
					if (!comments) return res.notfound('Post comments not found');
					locals.data.comments = comments;
					next();
			});
	});

	// Create a Comment
	view.on('post', {action: 'comment.create'}, function (next) {

			var newComment = new (keystone.list('PostComment')).model({
					state: 'published',
					post: locals.data.post.id
			});

			var updater = newComment.getUpdateHandler(req);

			updater.process(req.body, {
					field: 'content',
					field: 'usrName',
					flashErrors: true,
					logErrors: true,
			}, function (err) {
					if (err) {
							locals.validationErrors = err.errors;
					} else {
							req.flash('success', 'Your comment was added.');
							return res.redirect('/blog/post/' + locals.data.post.slug + '#comment-id-' + newComment.id);
					}
					next();
			});

	});

	// Render the view
	view.render('post');
};
