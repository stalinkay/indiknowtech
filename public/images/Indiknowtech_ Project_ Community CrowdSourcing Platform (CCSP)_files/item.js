(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function blacklist(src) {
  var copy = {};
  var filter = arguments[1];

  if (typeof filter === 'string') {
    filter = {};
    for (var i = 1; i < arguments.length; i++) {
      filter[arguments[i]] = true;
    }
  }

  for (var key in src) {
    // blacklist?
    if (filter[key]) continue;

    copy[key] = src[key];
  }

  return copy;
};

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    Fields = require('FieldTypes'),
    InvalidFieldType = require('./InvalidFieldType');

var Form = React.createClass({

	displayName: 'CreateForm',

	getDefaultProps: function getDefaultProps() {
		return {
			err: null,
			values: {},
			animate: false
		};
	},

	getInitialState: function getInitialState() {

		var values = this.props.values;

		_.each(this.props.list.fields, function (field) {
			if (!values[field.path]) {
				values[field.path] = field.defaultValue;
			}
		});

		return {
			values: values
		};
	},

	handleChange: function handleChange(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	componentWillMount: function componentWillMount() {
		this._bodyStyleOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},

	componentDidMount: function componentDidMount() {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
	},

	componentWillUnmount: function componentWillUnmount() {
		document.body.style.overflow = this._bodyStyleOverflow;
	},

	getFieldProps: function getFieldProps(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		return props;
	},

	render: function render() {

		var errors = null,
		    form = {},
		    list = this.props.list,
		    formAction = '/keystone/' + list.path,
		    nameField = this.props.list.nameField,
		    focusRef;

		var modalClass = 'modal modal-md' + (this.props.animate ? ' animate' : '');

		if (this.props.err && this.props.err.errors) {
			var msgs = {};
			_.each(this.props.err.errors, function (err, path) {
				msgs[path] = React.createElement('li', null, err.message);
			});
			errors = React.createElement('div', { className: 'alert alert-danger' }, React.createElement('h4', null, 'There was an error creating the new ', list.singular, ':'), React.createElement('ul', null, msgs));
		}

		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.ref = focusRef = 'focusTarget';
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = false;
			}
			form[nameField.path] = React.createElement(Fields[nameField.type], nameFieldProps);
		}

		_.each(list.initialFields, function (path) {

			var field = list.fields[path];

			if ('function' !== typeof Fields[field.type]) {
				form[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
				return;
			}

			var fieldProps = this.getFieldProps(field);

			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}

			form[field.path] = React.createElement(Fields[field.type], fieldProps);
		}, this);

		return React.createElement('div', null, React.createElement('div', { className: modalClass }, React.createElement('div', { className: 'modal-dialog' }, React.createElement('form', { className: 'modal-content', encType: 'multipart/form-data', method: 'post', action: formAction }, React.createElement('input', { type: 'hidden', name: 'action', value: 'create' }), React.createElement('input', { type: 'hidden', name: Keystone.csrf.key, value: Keystone.csrf.value }), React.createElement('div', { className: 'modal-header' }, React.createElement('button', { type: 'button', className: 'modal-close', onClick: this.props.onCancel }), React.createElement('div', { className: 'modal-title' }, 'Create a new ', list.singular)), React.createElement('div', { className: 'modal-body' }, errors, form), React.createElement('div', { className: 'modal-footer' }, React.createElement('button', { type: 'submit', className: 'btn btn-create' }, 'Create'), React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel', onClick: this.props.onCancel }, 'cancel'))))), React.createElement('div', { className: 'modal-backdrop' }));
	}

});

module.exports = Form;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./InvalidFieldType":5,"FieldTypes":undefined,"react":undefined}],3:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    moment = require('moment'),
    React = require('react'),
    Fields = require('FieldTypes'),
    FormHeading = require('./FormHeading'),
    Toolbar = require('./Toolbar'),
    InvalidFieldType = require('./InvalidFieldType');

var EditForm = React.createClass({

	displayName: 'EditForm',

	getInitialState: function getInitialState() {
		return {
			values: _.clone(this.props.data.fields)
		};
	},

	getFieldProps: function getFieldProps(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';
		return props;
	},

	handleChange: function handleChange(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	renderNameField: function renderNameField() {

		var nameField = this.props.list.nameField,
		    nameIsEditable = this.props.list.nameIsEditable;

		function wrapNameField(field) {
			return React.createElement('div', { className: 'field item-name' }, React.createElement('div', { className: 'col-sm-12' }, field));
		}

		if (nameIsEditable) {

			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.className = 'item-name-field';
			nameFieldProps.placeholder = nameField.label;
			nameFieldProps.label = false;

			return wrapNameField(React.createElement(Fields[nameField.type], nameFieldProps));
		} else {
			return wrapNameField(React.createElement('h2', { className: 'form-heading name-value' }, this.props.data.name || '(no name)'));
		}
	},

	renderTrackingMeta: function renderTrackingMeta() {

		if (!this.props.list.tracking) return null;

		var elements = {},
		    data = {},
		    label;

		if (this.props.list.tracking.createdAt) {
			data.createdAt = this.props.data.fields[this.props.list.tracking.createdAt];
			if (data.createdAt) {
				elements.createdAt = React.createElement('div', { className: 'item-details-meta-item' }, React.createElement('span', { className: 'item-details-meta-label' }, 'Created'), React.createElement('span', { className: 'item-details-meta-info' }, moment(data.createdAt).format('Do MMM YY h:mm:ssa')));
			}
		}

		if (this.props.list.tracking.createdBy) {
			data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
			if (data.createdBy) {
				label = data.createdAt ? 'by' : 'Created by';
				// todo: harden logic around user name
				elements.createdBy = React.createElement('div', { className: 'item-details-meta-item' }, React.createElement('span', { className: 'item-details-meta-label' }, label), React.createElement('span', { className: 'item-details-meta-info' }, data.createdBy.name.first, ' ', data.createdBy.name.last));
			}
		}

		if (this.props.list.tracking.updatedAt) {
			data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
			if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
				elements.updatedAt = React.createElement('div', { className: 'item-details-meta-item' }, React.createElement('span', { className: 'item-details-meta-label' }, 'Updated'), React.createElement('span', { className: 'item-details-meta-info' }, moment(data.updatedAt).format('Do MMM YY h:mm:ssa')));
			}
		}

		if (this.props.list.tracking.updatedBy) {
			data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
			if (data.updatedBy && (!data.createdBy || data.createdBy.id !== data.updatedBy.id || elements.updatedAt)) {
				label = data.updatedAt ? 'by' : 'Created by';
				elements.updatedBy = React.createElement('div', { className: 'item-details-meta-item' }, React.createElement('span', { className: 'item-details-meta-label' }, label), React.createElement('span', { className: 'item-details-meta-info' }, data.updatedBy.name.first, ' ', data.updatedBy.name.last));
			}
		}

		return Object.keys(elements).length ? React.createElement('div', { className: 'item-details-meta' }, elements) : null;
	},

	renderFormElements: function renderFormElements() {

		var elements = {},
		    headings = 0;

		_.each(this.props.list.uiElements, function (el) {

			if (el.type === 'heading') {

				headings++;
				el.options.values = this.state.values;
				elements['h-' + headings] = React.createElement(FormHeading, el);
			} else if (el.type === 'field') {

				var field = this.props.list.fields[el.field],
				    props = this.getFieldProps(field);

				if ('function' !== typeof Fields[field.type]) {
					elements[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
					return;
				}

				if (props.dependsOn) {
					props.currentDependencies = {};
					Object.keys(props.dependsOn).forEach(function (dep) {
						props.currentDependencies[dep] = this.state.values[dep];
					}, this);
				}

				elements[field.path] = React.createElement(Fields[field.type], props);
			}
		}, this);

		return elements;
	},

	renderToolbar: function renderToolbar() {

		var toolbar = {};

		if (!this.props.list.noedit) {
			toolbar.save = React.createElement('button', { type: 'submit', className: 'btn btn-save' }, 'Save');
			// TODO: Confirm: Use React & Modal
			toolbar.reset = React.createElement('a', { href: '/keystone/' + this.props.list.path + '/' + this.props.data.id, className: 'btn btn-link btn-cancel', 'data-confirm': 'Are you sure you want to reset your changes?' }, 'reset changes');
		}

		if (!this.props.list.noedit && !this.props.list.nodelete) {
			// TODO: Confirm: Use React & Modal
			toolbar.del = React.createElement('a', { href: '/keystone/' + this.props.list.path + '?delete=' + this.props.data.id + Keystone.csrf.query, className: 'btn btn-link btn-cancel delete', 'data-confirm': 'Are you sure you want to delete this?' + this.props.list.singular.toLowerCase() }, 'delete ', this.props.list.singular.toLowerCase());
		}

		return React.createElement(Toolbar, { className: 'toolbar' }, toolbar);
	},

	render: function render() {

		return React.createElement('form', { method: 'post', encType: 'multipart/form-data', className: 'item-details' }, React.createElement('input', { type: 'hidden', name: 'action', value: 'updateItem' }), React.createElement('input', { type: 'hidden', name: Keystone.csrf.key, value: Keystone.csrf.value }), this.renderNameField(), this.renderTrackingMeta(), this.renderFormElements(), this.renderToolbar());
	}

});

module.exports = EditForm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./FormHeading":4,"./InvalidFieldType":5,"./Toolbar":7,"FieldTypes":undefined,"moment":undefined,"react":undefined}],4:[function(require,module,exports){
'use strict';

var evalDependsOn = require('../../../fields/utils/evalDependsOn.js');
var React = require('react');

module.exports = React.createClass({

	displayName: 'FormHeading',

	render: function render() {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return React.createElement('h3', { className: 'form-heading' }, this.props.content);
	}

});

},{"../../../fields/utils/evalDependsOn.js":9,"react":undefined}],5:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({

	displayName: 'InvalidFieldType',

	render: function render() {
		return React.createElement('div', { className: 'alert alert-danger' }, 'Invalid field type ', React.createElement('strong', null, this.props.type), ' at path ', React.createElement('strong', null, this.props.path));
	}

});

},{"react":undefined}],6:[function(require,module,exports){
'use strict';

var React = require('react/addons'),
    ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
    AltText = require('react-alt-text');

var Header = React.createClass({

	displayName: 'ItemViewHeader',

	getInitialState: function getInitialState() {
		return {
			searchIsVisible: false,
			searchIsFocused: false,
			searchString: ''
		};
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		if (this.state.searchIsVisible && !prevState.searchIsVisible) {
			this.refs.searchField.getDOMNode().focus();
		}
	},

	toggleCreate: function toggleCreate(visible) {
		this.props.toggleCreate(visible);
	},

	toggleSearch: function toggleSearch(visible) {
		this.setState({
			searchIsVisible: visible,
			searchIsFocused: visible,
			searchString: ''
		});
	},

	searchFocusChanged: function searchFocusChanged(focused) {
		this.setState({
			searchIsFocused: focused
		});
	},

	searchStringChanged: function searchStringChanged(event) {
		this.setState({
			searchString: event.target.value
		});
	},

	renderDrilldown: function renderDrilldown() {
		if (this.state.searchIsVisible) return null;
		/* eslint-disable no-script-url */
		return React.createElement('ul', { className: 'item-breadcrumbs', key: 'drilldown' }, React.createElement('li', null, React.createElement('a', { href: 'javascript:;', title: 'Search ' + this.props.list.plural, onClick: this.toggleSearch.bind(this, true) }, React.createElement('span', { className: 'ion-search' }))), this.renderDrilldownItems());
		/* eslint-enable */
	},

	renderDrilldownItems: function renderDrilldownItems() {

		var list = this.props.list;
		var items = this.props.data.drilldown ? this.props.data.drilldown.items : [];

		var els = items.map(function (dd) {

			var links = [];

			dd.items.forEach(function (el, i) {
				links.push(React.createElement('a', { key: 'dd' + i, href: el.href, title: dd.list.singular }, el.label));
				if (i < dd.items.length - 1) {
					links.push(React.createElement('span', { key: 'ds' + i, className: 'separator' }, ',')); //eslint-disable-line comma-spacing
				}
			});

			var more = dd.more ? React.createElement('span', null, '...') : '';

			return React.createElement('li', null, links, more);
		});

		var backIcon = !els.length ? React.createElement('span', { className: 'mr-5 ion-arrow-left-c' }) : '';

		els.push(React.createElement('li', { key: 'back' }, React.createElement('a', { href: '/keystone/' + list.path, title: 'Back to ' + list.plural }, backIcon, list.plural)));

		return els;
	},

	renderSearch: function renderSearch() {
		if (!this.state.searchIsVisible) return null;
		var list = this.props.list;
		var submitButtonClass = 'btn ' + (this.state.searchIsFocused ? 'btn-primary' : 'btn-default');
		return React.createElement('div', { className: 'searchbox', key: 'search' }, React.createElement('form', { action: '/keystone/' + list.path, className: 'form-inline searchbox-form' }, React.createElement('div', { className: 'searchbox-field' }, React.createElement('input', {
			ref: 'searchField',
			type: 'search',
			name: 'search',
			value: this.state.searchString,
			onChange: this.searchStringChanged,
			onFocus: this.searchFocusChanged.bind(this, true),
			onBlur: this.searchFocusChanged.bind(this, false),
			placeholder: 'Search ' + list.plural,
			className: 'form-control searchbox-input'
		})), React.createElement('div', { className: 'searchbox-button' }, React.createElement('button', { type: 'submit', className: submitButtonClass }, 'Search')), React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel', onClick: this.toggleSearch.bind(this, false) }, 'Cancel')));
	},

	renderInfo: function renderInfo() {
		return React.createElement('ul', { className: 'item-toolbar-info' }, this.renderKeyOrId(), this.renderCreateButton());
	},

	renderKeyOrId: function renderKeyOrId() {
		var list = this.props.list;
		if (list.autokey && this.props.data[list.autokey.path]) {
			return React.createElement('li', null, React.createElement(AltText, {
				normal: list.autokey.path + ': ' + this.props.data[list.autokey.path],
				modified: 'id: ' + this.props.data.id
			}));
		}
		return React.createElement('li', null, 'id: ', this.props.data.id);
	},

	renderCreateButton: function renderCreateButton() {
		if (this.props.list.nocreate) return null;
		/* eslint-disable no-script-url */
		return React.createElement('li', null, React.createElement('a', { className: 'item-toolbar-create-button', href: 'javascript:;', onClick: this.toggleCreate.bind(this, true) }, React.createElement('span', { className: 'mr-5 ion-plus' }), 'New ', this.props.list.singular));
		/* eslint-enable */
	},

	render: function render() {
		return React.createElement('div', null, React.createElement('div', { className: 'item-toolbar item-toolbar--header' }, React.createElement(ReactCSSTransitionGroup, { transitionName: 'ToolbarToggle', className: 'ToolbarToggle-wrapper', component: 'div' }, this.renderDrilldown(), this.renderSearch()), this.renderInfo()));
	}

});

module.exports = Header;

},{"react-alt-text":undefined,"react/addons":undefined}],7:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}return target;
};

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    blacklist = require('blacklist');

var Toolbar = React.createClass({

	displayName: 'Toolbar',

	getInitialState: function getInitialState() {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0
		};
	},

	componentDidMount: function componentDidMount() {

		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;

		var toolbar = this.refs.toolbar.getDOMNode();

		this.windowSize = this.getWindowSize();

		var toolbarStyle = window.getComputedStyle(toolbar);

		this.toolbarSize = {
			x: toolbar.offsetWidth,
			y: toolbar.offsetHeight + parseInt(toolbarStyle.marginTop || '0')
		};

		window.addEventListener('scroll', this.recalcPosition, false);
		window.addEventListener('resize', this.recalcPosition, false);

		this.recalcPosition();
	},

	getWindowSize: function getWindowSize() {
		return {
			x: window.innerWidth,
			y: window.innerHeight
		};
	},

	recalcPosition: function recalcPosition() {
		var wrapper = this.refs.wrapper.getDOMNode();

		this.toolbarSize.x = wrapper.offsetWidth;

		var offsetTop = 0;
		var offsetEl = wrapper;

		while (offsetEl) {
			offsetTop += offsetEl.offsetTop;
			offsetEl = offsetEl.offsetParent;
		}

		var maxY = offsetTop + this.toolbarSize.y;
		var viewY = window.scrollY + window.innerHeight;

		var newSize = this.getWindowSize();
		var sizeChanged = newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y;
		this.windowSize = newSize;

		var newState = {
			width: this.toolbarSize.x,
			height: this.toolbarSize.y
		};

		if (viewY > maxY && (sizeChanged || this.mode !== 'inline')) {
			this.mode = 'inline';
			newState.top = 0;
			newState.position = 'absolute';
			this.setState(newState);
		} else if (viewY <= maxY && (sizeChanged || this.mode !== 'fixed')) {
			this.mode = 'fixed';
			newState.top = window.innerHeight - this.toolbarSize.y;
			newState.position = 'fixed';
			this.setState(newState);
		}
	},

	render: function render() {
		var wrapperStyle = {
			position: 'relative',
			height: this.state.height
		};
		var toolbarProps = blacklist(this.props, 'children', 'style');
		var toolbarStyle = _.extend(this.props.style || {}, {
			position: this.state.position,
			top: this.state.top,
			width: this.state.width,
			height: this.state.height
		});
		return React.createElement('div', { ref: 'wrapper', style: wrapperStyle }, React.createElement('div', _extends({ ref: 'toolbar', style: toolbarStyle }, toolbarProps), this.props.children));
	}
});

module.exports = Toolbar;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"blacklist":1,"react":undefined}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var request = require('superagent');

var CreateForm = require('../components/CreateForm');
var EditForm = require('../components/EditForm');
var Header = require('../components/ItemViewHeader');

var View = React.createClass({

	displayName: 'ItemView',

	getInitialState: function getInitialState() {
		return {
			createIsVisible: false,
			list: Keystone.list,
			itemData: null
		};
	},

	componentDidMount: function componentDidMount() {
		this.loadItemData();
	},

	loadItemData: function loadItemData() {
		var _this = this;

		request.get('/keystone/api/' + Keystone.list.path + '/' + this.props.itemId + '?drilldown=true').set('Accept', 'application/json').end(function (err, res) {
			if (err || !res.ok) {
				// TODO: nicer error handling
				console.log('Error loading item data:', res ? res.text : err);
				alert('Error loading data (details logged to console)');
				return;
			}
			_this.setState({
				itemData: res.body
			});
		});
	},

	toggleCreate: function toggleCreate(visible) {
		this.setState({
			createIsVisible: visible
		});
	},

	renderCreateForm: function renderCreateForm() {
		if (!this.state.createIsVisible) return null;
		return React.createElement(CreateForm, { list: Keystone.list, animate: true, onCancel: this.toggleCreate.bind(this, false) });
	},

	render: function render() {
		if (!this.state.itemData) return React.createElement('div', null);
		return React.createElement('div', null, this.renderCreateForm(), React.createElement(Header, { list: this.state.list, data: this.state.itemData, toggleCreate: this.toggleCreate }), React.createElement(EditForm, { list: this.state.list, data: this.state.itemData }));
	}

});

React.render(React.createElement(View, { itemId: Keystone.itemId }), document.getElementById('item-view'));

},{"../components/CreateForm":2,"../components/EditForm":3,"../components/ItemViewHeader":6,"react":undefined,"superagent":undefined}],9:[function(require,module,exports){
"use strict";

module.exports = function evalDependsOn(dependsOn, values) {
	if (!_.isObject(dependsOn)) return true;
	var keys = _.keys(dependsOn);
	return keys.length ? _.every(keys, function (key) {
		var dependsValue = dependsOn[key];
		if (_.isBoolean(dependsValue)) {
			if (_.isBoolean(values[key])) {
				return dependsValue === values[key];
			} else {
				return dependsValue !== _.isEmpty(values[key]);
			}
		}
		var matches = _.isArray(dependsValue) ? dependsValue : [dependsValue];
		return _.contains(matches, values[key]);
	}, this) : true;
};

},{}]},{},[8]);
