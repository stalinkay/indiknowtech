require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var moment = require('moment');
var Pikaday = require('pikaday');
var React = require('react');

module.exports = React.createClass({

	displayName: 'DateInput',

	// set default properties
	getDefaultProps: function getDefaultProps() {
		return {
			format: 'YYYY-MM-DD'
		};
	},

	getInitialState: function getInitialState() {
		return {
			value: this.props.value,
			id: Math.round(Math.random() * 100000)
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(newProps) {
		if (newProps.value === this.state.value) return;
		this.setState({
			value: newProps.value
		});
		this.picker.setMoment(moment(newProps.value, this.props.format));
	},

	componentDidMount: function componentDidMount() {
		var _this = this;

		this.picker = new Pikaday({
			field: this.getDOMNode(),
			format: this.props.format,
			yearRange: this.props.yearRange,
			onSelect: function onSelect(date) {
				// eslint-disable-line no-unused-vars
				if (_this.props.onChange && _this.picker.toString() !== _this.props.value) {
					_this.props.onChange(_this.picker.toString());
				}
			}
		});
	},

	componentWillUnmount: function componentWillUnmount() {
		this.picker.destroy();
	},

	handleChange: function handleChange(e) {
		if (e.target.value === this.state.value) return;
		this.setState({ value: e.target.value });
	},

	handleBlur: function handleBlur(e) {
		// eslint-disable-line no-unused-vars
		if (this.state.value === this.props.value) return;
		var newValue = moment(this.state.value, this.props.format);
		if (newValue.isValid()) {
			this.picker.setMoment(newValue);
		} else {
			this.picker.setDate(null);
			if (this.props.onChange) this.props.onChange('');
		}
	},

	render: function render() {
		return React.createElement('input', { type: 'text', name: this.props.name, value: this.state.value, placeholder: this.props.placeholder, onChange: this.handleChange, onBlur: this.handleBlur, autoComplete: 'off', className: 'form-control' });
	}

});

},{"moment":undefined,"pikaday":undefined,"react":undefined}],2:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({

	displayName: 'Note',

	render: function render() {
		return this.props.note ? React.createElement('div', { className: 'field-note', dangerouslySetInnerHTML: { __html: this.props.note } }) : null;
	}

});

},{"react":undefined}],3:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react');

var lastId = 0;

function newItem(value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

module.exports = {
	getInitialState: function getInitialState() {
		return {
			values: this.props.value.map(newItem)
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.value.join('|') !== _.pluck(this.state.values, 'value').join('|')) {
			this.setState({
				values: nextProps.value.map(newItem)
			});
		}
	},

	addItem: function addItem() {
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},

	removeItem: function removeItem(i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},

	updateItem: function updateItem(i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		this.setState({
			values: updatedValues
		});
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},

	valueChanged: function valueChanged(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},

	renderItem: function renderItem(i) {
		/* eslint-disable no-script-url */
		return React.createElement('div', { key: i.key, className: 'field-item' }, React.createElement('a', { href: 'javascript:;', className: 'field-item-button btn-cancel', onClick: this.removeItem.bind(this, i) }, '×'), React.createElement('input', { ref: 'input_' + i.key, className: 'form-control multi', type: 'text', name: this.props.path, value: i.value, onChange: this.updateItem.bind(this, i), autoComplete: 'off' }));
		/* eslint-enable */
	},

	renderField: function renderField() {
		return React.createElement('div', null, this.state.values.map(this.renderItem), React.createElement('button', { type: 'button', className: 'btn btn-xs btn-default', onClick: this.addItem }, 'Add item'));
	},

	// Override shouldCollapse to check for array length
	shouldCollapse: function shouldCollapse() {
		return this.props.collapse && !this.props.value.length;
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react":undefined}],4:[function(require,module,exports){
(function (global){
'use strict';

/* global Pikaday */

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    moment = require('moment');

var lastId = 0;

function newItem(value) {
	lastId++;
	return { key: 'i' + lastId, value: value, picker: null };
}

module.exports = {
	// set default properties
	getDefaultProps: function getDefaultProps() {
		return {
			format: 'YYYY-MM-DD',
			pickers: []
		};
	},

	getInitialState: function getInitialState() {
		return {
			values: this.props.value.map(newItem)
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.value.join('|') !== _.pluck(this.state.values, 'value').join('|')) {
			this.setState({
				values: nextProps.value.map(newItem)
			});
		}
	},

	componentWillUpdate: function componentWillUpdate() {
		this.props.value.forEach(function (val, i) {
			// Destroy each of our datepickers
			if (this.props.pickers[i]) {
				this.props.pickers[i].destroy();
			}
		}, this);
	},

	componentDidUpdate: function componentDidUpdate() {
		this.props.value.forEach(function (val, i) {
			var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
			// Add a date picker to each updated field
			this.props.pickers[i] = new Pikaday({
				field: dateInput,
				format: this.props.format,
				onSelect: function (date) {
					//eslint-disable-line no-unused-vars
					if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
						this.props.value[i] = this.props.pickers[i].toString();
						this.props.onChange(this.props.pickers[i].toString());
					}
				}.bind(this)
			});
		}, this);
	},

	componentDidMount: function componentDidMount() {
		this.props.value.forEach(function (val, i) {
			var dateInput = this.getDOMNode().getElementsByClassName('datepicker_' + this.state.values[i].key)[0];
			if (this.props.pickers[i]) this.props.pickers[i].destroy();
			this.props.pickers[i] = new Pikaday({
				field: dateInput,
				format: this.props.format,
				onSelect: function (date) {
					//eslint-disable-line no-unused-vars
					if (this.props.onChange && this.props.pickers[i].toString() !== val.value) {
						this.props.value[i] = this.props.pickers[i].toString();
						this.props.onChange(this.props.pickers[i].toString());
					}
				}.bind(this)
			});
		}, this);
	},

	addItem: function addItem() {
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},

	removeItem: function removeItem(i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues
		});
		this.valueChanged(_.pluck(newValues, 'value'));
	},

	updateItem: function updateItem(i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;
		this.setState({
			values: updatedValues
		});
		this.valueChanged(_.pluck(updatedValues, 'value'));
	},

	valueChanged: function valueChanged(values) {
		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},

	handleBlur: function handleBlur(e) {
		//eslint-disable-line no-unused-vars
		if (this.state.value === this.props.value) return;
		this.picker.setMoment(moment(this.state.value, this.props.format));
	},

	renderItem: function renderItem(i) {
		/* eslint-disable no-script-url */
		return React.createElement('div', { key: i.key, className: 'field-item' }, React.createElement('a', { href: 'javascript:;', className: 'field-item-button btn-cancel', onClick: this.removeItem.bind(this, i) }, '×'), React.createElement('input', { ref: 'input_' + i.key, className: 'form-control multi datepicker_' + i.key, type: 'text', name: this.props.path, value: i.value, onChange: this.updateItem.bind(this, i), autoComplete: 'off' }));
		/* eslint-enable */
	},

	renderField: function renderField() {
		return React.createElement('div', null, this.state.values.map(this.renderItem), React.createElement('button', { type: 'button', className: 'btn btn-xs btn-default', onClick: this.addItem }, 'Add date'));
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"moment":undefined,"react":undefined}],5:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cx = require('classnames');
var evalDependsOn = require('../utils/evalDependsOn.js');
var React = require('react');
var Note = require('../components/Note');

function validateSpec(spec) {
	if (!_.isObject(spec.supports)) {
		spec.supports = {};
	}
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

var Base = module.exports.Base = {

	getInitialState: function getInitialState() {
		return {};
	},

	valueChanged: function valueChanged(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value
		});
	},

	shouldCollapse: function shouldCollapse() {
		return this.props.collapse && !this.props.value;
	},

	shouldRenderField: function shouldRenderField() {
		if (!this.props.noedit) return true;
		if (this.props.mode === 'create' && this.props.initial) return true;
		return false;
	},

	focus: function focus() {
		if (!this.refs[this.spec.focusTargetRef]) return;
		this.refs[this.spec.focusTargetRef].getDOMNode().focus();
	},

	renderLabel: function renderLabel() {
		if (!this.props.label) return null;
		return React.createElement('label', { className: 'field-label' }, this.props.label);
	},

	renderNote: function renderNote() {
		if (!this.props.note) return null;
		return React.createElement(Note, { note: this.props.note });
	},

	renderField: function renderField() {
		return React.createElement('input', { type: 'text', ref: 'focusTarget', name: this.props.path, placeholder: this.props.placeholder, value: this.props.value, onChange: this.valueChanged, autoComplete: 'off', className: 'form-control' });
	},

	renderValue: function renderValue() {
		return React.createElement('div', { className: 'field-value' }, this.props.value);
	},

	renderUI: function renderUI(spec) {
		//eslint-disable-line no-unused-vars
		var wrapperClassName = cx('field', 'field-type-' + this.props.type, this.props.className, { 'field-has-label': this.props.label });
		var fieldClassName = cx('field-ui', 'field-size-' + this.props.size);
		return React.createElement('div', { className: wrapperClassName }, this.renderLabel(), React.createElement('div', { className: fieldClassName }, this.shouldRenderField() ? this.renderField() : this.renderValue(), this.renderNote()));
	}

};

var Mixins = module.exports.Mixins = {

	Collapse: {

		componentWillMount: function componentWillMount() {
			this.setState({
				isCollapsed: this.shouldCollapse()
			});
		},

		componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed) {
				this.focus();
			}
		},

		uncollapse: function uncollapse() {
			this.setState({
				isCollapsed: false
			});
		},

		renderCollapse: function renderCollapse() {
			if (!this.shouldRenderField()) {
				return null;
			}
			/* eslint-disable no-script-url */
			return React.createElement('div', { className: 'field field-type-' + this.props.type }, React.createElement('div', { className: 'col-sm-12' }, React.createElement('label', { className: 'uncollapse' }, React.createElement('a', { href: 'javascript:;', onClick: this.uncollapse }, '+ Add ', this.props.label.toLowerCase()))));
			/* eslint-enable */
		}
	}
};

module.exports.create = function (spec) {

	spec = validateSpec(spec || {});

	var excludeBaseMethods = [];

	var field = {

		spec: spec,

		displayName: spec.displayName,

		mixins: [Mixins.Collapse],

		render: function render() {
			if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
				return null;
			}
			if (this.state.isCollapsed) {
				return this.renderCollapse();
			}
			return this.renderUI(spec);
		}

	};

	if (spec.mixins) {
		_.each(spec.mixins, function (mixin) {
			_.each(mixin, function (method, name) {
				if (Base[name]) excludeBaseMethods.push(name);
			});
		});
	}

	_.extend(field, _.omit(Base, excludeBaseMethods));
	_.extend(field, _.omit(spec, 'mixins'));

	if (_.isArray(spec.mixins)) {
		field.mixins = field.mixins.concat(spec.mixins);
	}

	return React.createClass(field);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../components/Note":2,"../utils/evalDependsOn.js":37,"classnames":undefined,"react":undefined}],6:[function(require,module,exports){
'use strict';

module.exports = require('../localfile/LocalFileField');

},{"../localfile/LocalFileField":20}],7:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'BooleanField',

	valueChanged: function valueChanged(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.checked
		});
	},

	renderUI: function renderUI() {

		if (this.props.hidden) {
			return React.createElement('input', { type: 'hidden', name: this.props.path, value: this.props.value });
		}

		var input,
		    fieldClassName = 'field-ui';

		if (this.props.indent) {
			fieldClassName += ' field-indented';
		}

		if (this.shouldRenderField()) {
			input = React.createElement('div', { className: fieldClassName }, React.createElement('label', { htmlFor: this.props.path, className: 'checkbox' }, React.createElement('input', { type: 'checkbox', name: this.props.path, id: this.props.path, value: 'true', checked: this.props.value, onChange: this.valueChanged }), this.props.label), this.renderNote());
		} else {
			var state = this.props.value ? 'checked' : 'unchecked';
			var imgSrc = '/keystone/images/icons/16/checkbox-' + state + '.png';
			input = React.createElement('div', { className: fieldClassName }, React.createElement('img', { src: imgSrc, width: '16', height: '16', className: state, style: { marginRight: 5 } }), React.createElement('span', null, this.props.label), React.createElement('div', null, this.renderNote()));
		}

		return React.createElement('div', { className: 'field field-type-boolean' }, input);
	}

});

},{"../Field":5,"react":undefined}],8:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null),
    React = require('react'),
    Field = require('../Field'),
    Note = require('../../components/Note'),
    Select = require('react-select');

var SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

module.exports = Field.create({

	displayName: 'CloudinaryImageField',

	fileFieldNode: function fileFieldNode() {
		return this.refs.fileField.getDOMNode();
	},

	changeImage: function changeImage() {
		this.refs.fileField.getDOMNode().click();
	},

	getImageSource: function getImageSource() {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getImageURL: function getImageURL() {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	/**
  * Reset origin and removal.
  */
	undoRemove: function undoRemove() {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource: null,
			origin: false,
			action: null
		});
	},

	/**
  * Check support for input files on input change.
  */
	fileChanged: function fileChanged(event) {
		var self = this;

		if (window.FileReader) {
			var files = event.target.files;
			_.each(files, function (f) {
				if (!_.contains(SUPPORTED_TYPES, f.type)) {
					self.removeImage();
					alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
					return false;
				}

				var fileReader = new FileReader();
				fileReader.onload = function (e) {
					if (!self.isMounted()) return;
					self.setState({
						localSource: e.target.result,
						origin: 'local'
					});
				};
				fileReader.readAsDataURL(f);
			});
		} else {
			this.setState({
				origin: 'local'
			});
		}
	},

	/**
  * If we have a local file added then remove it and reset the file field.
  */
	removeImage: function removeImage(e) {
		var state = {
			localSource: null,
			origin: false
		};

		if (this.hasLocal()) {
			this.fileFieldNode().value = '';
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},

	/**
  * Is the currently active image uploaded in this session?
  */
	hasLocal: function hasLocal() {
		return this.state.origin === 'local';
	},

	/**
  * Do we have an image preview to display?
  */
	hasImage: function hasImage() {
		return this.hasExisting() || this.hasLocal();
	},

	/**
  * Do we have an existing file?
  */
	hasExisting: function hasExisting() {
		return !!this.props.value.url;
	},

	/**
  * Render an image preview
  */
	renderImagePreview: function renderImagePreview() {
		var iconClassName;
		var className = 'image-preview';

		if (this.hasLocal()) {
			className += ' upload-pending';
			iconClassName = 'ion-upload upload-pending';
		} else if (this.state.removeExisting) {
			className += ' removed';
			iconClassName = 'delete-pending ion-close';
		}

		var body = [this.renderImagePreviewThumbnail()];
		if (iconClassName) body.push(React.createElement('div', { key: this.props.path + '_preview_icon', className: iconClassName }));

		var url = this.getImageURL();

		if (url) {
			body = React.createElement('a', { className: 'img-thumbnail', href: this.getImageURL() }, body);
		} else {
			body = React.createElement('div', { className: 'img-thumbnail' }, body);
		}

		return React.createElement('div', { key: this.props.path + '_preview', className: className }, body);
	},

	renderImagePreviewThumbnail: function renderImagePreviewThumbnail() {
		return React.createElement('img', { key: this.props.path + '_preview_thumbnail', className: 'img-load', style: { height: '90' }, src: this.getImageSource() });
	},

	/**
  * Render image details - leave these out if we're uploading a local file or
  * the existing file is to be removed.
  */
	renderImageDetails: function renderImageDetails(add) {
		var values = null;

		if (!this.hasLocal() && !this.state.removeExisting) {
			values = React.createElement('div', { className: 'image-values' }, React.createElement('div', { className: 'field-value' }, this.props.value.url), this.renderImageDimensions());
		}

		return React.createElement('div', { key: this.props.path + '_details', className: 'image-details' }, values, add);
	},

	renderImageDimensions: function renderImageDimensions() {
		return React.createElement('div', { className: 'field-value' }, this.props.value.width, ' x ', this.props.value.height);
	},

	/**
  * Render an alert.
  * 
  *  - On a local file, output a "to be uploaded" message.
  *  - On a cloudinary file, output a "from cloudinary" message.
  *  - On removal of existing file, output a "save to remove" message.
  */
	renderAlert: function renderAlert() {
		if (this.hasLocal()) {
			return React.createElement('div', { className: 'upload-queued pull-left' }, React.createElement('div', { className: 'alert alert-success' }, 'Image selected - save to upload'));
		} else if (this.state.origin === 'cloudinary') {
			return React.createElement('div', { className: 'select-queued pull-left' }, React.createElement('div', { className: 'alert alert-success' }, 'Image selected from Cloudinary'));
		} else if (this.state.removeExisting) {
			return React.createElement('div', { className: 'delete-queued pull-left' }, React.createElement('div', { className: 'alert alert-danger' }, 'Image ', this.props.autoCleanup ? 'deleted' : 'removed', ' - save to confirm'));
		} else {
			return null;
		}
	},

	/**
  * Output clear/delete/remove button.
  *
  *  - On removal of existing image, output "undo remove" button.
  *  - Otherwise output Cancel/Delete image button.
  */
	renderClearButton: function renderClearButton() {
		if (this.state.removeExisting) {
			return React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel btn-undo-image', onClick: this.undoRemove }, 'Undo Remove');
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = this.props.autoCleanup ? 'Delete Image' : 'Remove Image';
			}
			return React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel btn-delete-image', onClick: this.removeImage }, clearText);
		}
	},

	renderFileField: function renderFileField() {
		return React.createElement('input', { ref: 'fileField', type: 'file', name: this.props.paths.upload, className: 'field-upload', onChange: this.fileChanged });
	},

	renderFileAction: function renderFileAction() {
		return React.createElement('input', { type: 'hidden', name: this.props.paths.action, className: 'field-action', value: this.state.action });
	},

	renderImageToolbar: function renderImageToolbar() {
		return React.createElement('div', { key: this.props.path + '_toolbar', className: 'image-toolbar' }, React.createElement('div', { className: 'pull-left' }, React.createElement('button', { type: 'button', onClick: this.changeImage, className: 'btn btn-default btn-upload-image' }, this.hasImage() ? 'Change' : 'Upload', ' Image'), this.hasImage() && this.renderClearButton()), this.props.select && this.renderImageSelect());
	},

	renderImageSelect: function renderImageSelect() {
		var selectPrefix = this.props.selectPrefix;
		var getOptions = function getOptions(input, callback) {
			$.get('/keystone/api/cloudinary/autocomplete', {
				dataType: 'json',
				data: {
					q: input
				},
				prefix: selectPrefix
			}, function (data) {
				var options = [];

				_.each(data.items, function (item) {
					options.push({
						value: item.public_id,
						label: item.public_id
					});
				});

				callback(null, {
					options: options,
					complete: true
				});
			});
		};

		return React.createElement('div', { className: 'image-select' }, React.createElement(Select, {
			placeholder: 'Search for an image from Cloudinary ...',
			className: 'ui-select2-cloudinary',
			name: this.props.paths.select,
			id: 'field_' + this.props.paths.select,
			asyncOptions: getOptions
		}));
	},

	renderUI: function renderUI() {
		var container = [],
		    body = [],
		    hasImage = this.hasImage(),
		    fieldClassName = 'field-ui';

		if (hasImage) {
			fieldClassName += ' has-image';
		}

		if (this.shouldRenderField()) {
			if (hasImage) {
				container.push(this.renderImagePreview());
				container.push(this.renderImageDetails(this.renderAlert()));
			}

			body.push(this.renderImageToolbar());
		} else {
			if (hasImage) {
				container.push(this.renderImagePreview());
				container.push(this.renderImageDetails());
			} else {
				container.push(React.createElement('div', { className: 'help-block' }, 'no image'));
			}
		}

		return React.createElement('div', { className: 'field field-type-cloudinaryimage' }, React.createElement('label', { className: 'field-label' }, this.props.label), this.renderFileField(), this.renderFileAction(), React.createElement('div', { className: fieldClassName }, React.createElement('div', { className: 'image-container' }, container), body, React.createElement(Note, { note: this.props.note })));
	}
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../components/Note":2,"../Field":5,"react":undefined,"react-select":undefined}],9:[function(require,module,exports){
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
    Field = require('../Field');

var SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

var Thumbnail = React.createClass({

	displayName: 'CloudinaryImagesField',

	render: function render() {
		var iconClassName, imageDetails;

		if (this.props.deleted) {
			iconClassName = 'delete-pending ion-close';
		} else if (this.props.isQueued) {
			iconClassName = 'img-uploading ion-upload';
		}

		var previewClassName = 'image-preview';
		if (this.props.deleted || this.props.isQueued) previewClassName += ' action';

		var title = '';
		var width = this.props.width;
		var height = this.props.height;
		if (width && height) title = width + ' x ' + height;

		var actionLabel = this.props.deleted ? 'Undo' : 'Remove';

		if (!this.props.isQueued) {
			imageDetails = React.createElement('div', { className: 'image-details' }, React.createElement('button', { onClick: this.props.toggleDelete, type: 'button', className: 'btn btn-link btn-cancel btn-undo-remove' }, actionLabel));
		}

		return React.createElement('div', { className: 'image-field image-sortable row col-sm-3 col-md-12', title: title }, React.createElement('div', { className: previewClassName }, React.createElement('a', { href: this.props.url, className: 'img-thumbnail' }, React.createElement('img', { style: { height: '90' }, className: 'img-load', src: this.props.url }), React.createElement('span', { className: iconClassName }))), imageDetails);
	}

});

module.exports = Field.create({

	getInitialState: function getInitialState() {
		var thumbnails = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushThumbnail(item, thumbnails);
		});

		return { thumbnails: thumbnails };
	},

	removeThumbnail: function removeThumbnail(i) {
		var thumbs = this.state.thumbnails;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ thumbnails: thumbs });
	},

	pushThumbnail: function pushThumbnail(args, thumbs) {
		thumbs = thumbs || this.state.thumbnails;
		var i = thumbs.length;
		args.toggleDelete = this.removeThumbnail.bind(this, i);
		thumbs.push(React.createElement(Thumbnail, _extends({ key: i }, args)));
	},

	fileFieldNode: function fileFieldNode() {
		return this.refs.fileField.getDOMNode();
	},

	getCount: function getCount(key) {
		var count = 0;

		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props[key]) count++;
		});

		return count;
	},

	renderFileField: function renderFileField() {
		return React.createElement('input', { ref: 'fileField', type: 'file', name: this.props.paths.upload, multiple: true, className: 'field-upload', onChange: this.uploadFile });
	},

	clearFiles: function clearFiles() {
		this.fileFieldNode().value = '';

		this.setState({
			thumbnails: this.state.thumbnails.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile: function uploadFile(event) {
		var self = this;

		var files = event.target.files;
		_.each(files, function (f) {
			if (!_.contains(SUPPORTED_TYPES, f.type)) {
				alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
				return;
			}

			if (window.FileReader) {
				var fileReader = new FileReader();
				fileReader.onload = function (e) {
					self.pushThumbnail({ isQueued: true, url: e.target.result });
					self.forceUpdate();
				};
				fileReader.readAsDataURL(f);
			} else {
				self.pushThumbnail({ isQueued: true, url: '#' });
				self.forceUpdate();
			}
		});
	},

	changeImage: function changeImage() {
		this.fileFieldNode().click();
	},

	hasFiles: function hasFiles() {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar: function renderToolbar() {
		var body = [];

		var push = function push(queueType, alertType, count, action) {
			if (count <= 0) return;

			var imageText = count === 1 ? 'image' : 'images';

			body.push(React.createElement('div', { key: queueType + '-toolbar', className: queueType + '-queued' + ' pull-left' }, React.createElement('div', { className: 'alert alert-' + alertType }, count, ' ', imageText, ' ', action, ' - save to confirm')));
		};

		push('upload', 'success', this.getCount('isQueued'), 'queued for upload');
		push('delete', 'danger', this.getCount('deleted'), 'removed');

		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = React.createElement('button', { type: 'button', className: 'btn btn-default btn-upload', onClick: this.clearFiles }, 'Clear selection');
		}

		return React.createElement('div', { className: 'images-toolbar row col-sm-3 col-md-12' }, React.createElement('div', { className: 'pull-left' }, React.createElement('button', { type: 'button', className: 'btn btn-default btn-upload', onClick: this.changeImage }, 'Select files'), clearFilesButton), body);
	},

	renderPlaceholder: function renderPlaceholder() {
		return React.createElement('div', { className: 'image-field image-upload row col-sm-3 col-md-12', onClick: this.changeImage }, React.createElement('div', { className: 'image-preview' }, React.createElement('span', { className: 'img-thumbnail' }, React.createElement('span', { className: 'img-dropzone' }), React.createElement('div', { className: 'ion-picture img-uploading' }))), React.createElement('div', { className: 'image-details' }, React.createElement('span', { className: 'image-message' }, 'Click to upload')));
	},

	renderContainer: function renderContainer() {
		return React.createElement('div', { className: 'images-container clearfix' }, this.state.thumbnails);
	},

	renderFieldAction: function renderFieldAction() {
		var value = '';
		var remove = [];
		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props.public_id);
		});
		if (remove.length) value = 'remove:' + remove.join(',');

		return React.createElement('input', { ref: 'action', className: 'field-action', type: 'hidden', value: value, name: this.props.paths.action });
	},

	renderUploadsField: function renderUploadsField() {
		return React.createElement('input', { ref: 'uploads', className: 'field-uploads', type: 'hidden', name: this.props.paths.uploads });
	},

	renderUI: function renderUI() {
		return React.createElement('div', { className: 'field field-type-cloudinaryimages' }, React.createElement('label', { className: 'field-label' }, this.props.label), this.renderFieldAction(), this.renderUploadsField(), this.renderFileField(), React.createElement('div', { className: 'field-ui' }, this.renderContainer(), this.renderToolbar()));
	}
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined}],10:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    Field = require('../Field'),
    CodeMirror = (typeof window !== "undefined" ? window['CodeMirror'] : typeof global !== "undefined" ? global['CodeMirror'] : null);

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

module.exports = Field.create({

	displayName: 'CodeField',

	getInitialState: function getInitialState() {
		return {
			isFocused: false
		};
	},

	componentDidMount: function componentDidMount() {
		if (!this.refs.codemirror) {
			return;
		}

		var options = _.defaults({}, this.props.editor, {
			lineNumbers: true,
			readOnly: this.shouldRenderField() ? false : true
		});

		this.codeMirror = CodeMirror.fromTextArea(this.refs.codemirror.getDOMNode(), options);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this._currentCodemirrorValue = this.props.value;
	},

	componentWillUnmount: function componentWillUnmount() {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
	},

	focus: function focus() {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},

	focusChanged: function focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
	},

	codemirrorValueChanged: function codemirrorValueChanged(doc, change) {
		//eslint-disable-line no-unused-vars
		var newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderCodemirror: function renderCodemirror() {
		var className = 'CodeMirror-container';
		if (this.state.isFocused && this.shouldRenderField()) {
			className += ' is-focused';
		}
		return React.createElement('div', { className: className }, React.createElement('textarea', { ref: 'codemirror', name: this.props.path, value: this.props.value, onChange: this.valueChanged, autoComplete: 'off', className: 'form-control' }));
	},

	renderValue: function renderValue() {
		return this.renderCodemirror();
	},

	renderField: function renderField() {
		return this.renderCodemirror();
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined}],11:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'ColorField',

	valueChanged: function valueChanged(event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;
		console.log(newValue);
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderField: function renderField() {

		var colorPreview = null;

		if (this.props.value) {
			colorPreview = React.createElement('div', { style: {
					position: 'absolute',
					top: 5,
					right: 20,
					width: 24,
					height: 24,
					borderRadius: 5,
					borderStyle: 'solid',
					borderWidth: '1px',
					borderColor: '#E0E0E0',
					background: this.props.value
				} });
		}

		return React.createElement('div', null, React.createElement('input', { ref: 'field', type: 'text', className: 'form-control', onChange: this.valueChanged, name: this.props.path, value: this.props.value, autoComplete: 'off' }), colorPreview);
	}

});

},{"../Field":5,"react":undefined}],12:[function(require,module,exports){
'use strict';

var React = require('react');
var Field = require('../Field');
var Note = require('../../components/Note');
var DateInput = require('../../components/DateInput');
var _moment = require('moment');

module.exports = Field.create({

	displayName: 'DateField',

	focusTargetRef: 'dateInput',

	getInitialState: function getInitialState() {
		return {
			value: this.props.value ? this.moment(this.props.value).format(this.props.dateFormat) : ''
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			dateFormat: 'YYYY-MM-DD'
		};
	},

	moment: function moment(value) {
		var m = _moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function isValid(value) {
		return _moment(value, this.props.dateFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function format(dateValue, _format) {
		_format = _format || this.props.dateFormat;
		return dateValue ? this.moment(this.props.dateValue).format(_format) : '';
	},

	setDate: function setDate(dateValue) {
		this.setState({ value: dateValue });
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(dateValue) ? dateValue : null
		});
	},

	setToday: function setToday() {
		this.setDate(_moment().format(this.props.dateFormat));
	},

	valueChanged: function valueChanged(value) {
		this.setDate(value);
	},

	renderUI: function renderUI() {

		var input;
		var fieldClassName = 'field-ui';

		if (this.shouldRenderField()) {
			input = React.createElement('div', { className: fieldClassName }, React.createElement(DateInput, { ref: 'dateInput', name: this.props.path, format: this.props.dateFormat, value: this.state.value, placeholder: this.props.datePlaceholder, onChange: this.valueChanged, yearRange: this.props.yearRange }), React.createElement('button', { type: 'button', className: 'btn btn-default btn-set-today', onClick: this.setToday }, 'Today'));
		} else {
			input = React.createElement('div', { className: fieldClassName }, React.createElement('div', { className: 'field-value' }, this.format(this.props.value, this.props.dateFormat)));
		}

		return React.createElement('div', { className: 'field field-type-date' }, React.createElement('label', { htmlFor: this.props.path, className: 'field-label' }, this.props.label), input, React.createElement('div', { className: 'col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 field-note-wrapper' }, React.createElement(Note, { note: this.props.note })));
	}

});

},{"../../components/DateInput":1,"../../components/Note":2,"../Field":5,"moment":undefined,"react":undefined}],13:[function(require,module,exports){
'use strict';

var Field = require('../Field'),
    ArrayFieldMixin = require('../../mixins/DateArrayField');

module.exports = Field.create({

	displayName: 'DateArrayField',

	mixins: [ArrayFieldMixin]

});

},{"../../mixins/DateArrayField":4,"../Field":5}],14:[function(require,module,exports){
'use strict';

var React = require('react');
var Field = require('../Field');
var Note = require('../../components/Note');
var DateInput = require('../../components/DateInput');
var _moment = require('moment');

module.exports = Field.create({

	displayName: 'DatetimeField',

	focusTargetRef: 'dateInput',

	getInitialState: function getInitialState() {
		return {
			dateValue: this.props.value ? this.moment(this.props.value).format(this.props.dateFormat) : '',
			timeValue: this.props.value ? this.moment(this.props.value).format(this.props.timeFormat) : ''
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			formatString: 'YYYY-MM-DD, h:mm a'
		};
	},

	moment: function moment(value) {
		var m = _moment(value);
		if (this.props.isUTC) m.utc();
		return m;
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function isValid(value) {
		return _moment(value, this.props.formatString).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function format(value, _format) {
		_format = _format || this.props.dateFormat + ' ' + this.props.timeFormat;
		return value ? this.moment(value).format(_format) : '';
	},

	handleChange: function handleChange(dateValue, timeValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.props.dateFormat + ' ' + this.props.timeFormat;
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? _moment(value, datetimeFormat).toISOString() : null
		});
	},

	dateChanged: function dateChanged(value) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged: function timeChanged(event) {
		this.setState({ timeValue: event.target.value });
		this.handleChange(this.state.dateValue, event.target.value);
	},

	setNow: function setNow() {
		var dateValue = _moment().format(this.props.dateFormat);
		var timeValue = _moment().format(this.props.timeFormat);
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue
		});
		this.handleChange(dateValue, timeValue);
	},

	renderUI: function renderUI() {
		var input;
		var fieldClassName = 'field-ui';
		if (this.shouldRenderField()) {
			input = React.createElement('div', { className: fieldClassName }, React.createElement(DateInput, { ref: 'dateInput', name: this.props.paths.date, value: this.state.dateValue, placeholder: this.props.datePlaceholder, format: this.props.dateFormat, onChange: this.dateChanged }), React.createElement('input', { type: 'text', name: this.props.paths.time, value: this.state.timeValue, placeholder: this.props.timePlaceholder, onChange: this.timeChanged, autoComplete: 'off', className: 'form-control time' }), React.createElement('button', { type: 'button', className: 'btn btn-default btn-set-now', onClick: this.setNow }, 'Now'));
		} else {
			input = React.createElement('div', { className: fieldClassName }, React.createElement('div', { className: 'field-value' }, this.format(this.props.value, this.props.formatString)));
		}
		return React.createElement('div', { className: 'field field-type-datetime' }, React.createElement('label', { className: 'field-label' }, this.props.label), input, React.createElement('div', { className: 'col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 field-note-wrapper' }, React.createElement(Note, { note: this.props.note })));
	}
});

},{"../../components/DateInput":1,"../../components/Note":2,"../Field":5,"moment":undefined,"react":undefined}],15:[function(require,module,exports){
'use strict';

/*
	TODO:
	- gravatar
	- validate email address
 */

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'EmailField',

	renderValue: function renderValue() {
		return this.props.value ? React.createElement('a', { className: 'ui-related-item', href: 'mailto:' + this.props.value }, this.props.value) : React.createElement('div', { className: 'help-block' }, '(not set)');
	}

});

},{"../Field":5,"react":undefined}],16:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'EmbedlyField',

	// always defers to renderValue; there is no form UI for this field
	renderField: function renderField() {
		return this.renderValue();
	},

	renderValue: function renderValue() {

		if (!this.props.value.exists) {
			return React.createElement('div', { className: 'field-value' }, '(not set)');
		}

		var imagePreview = this.props.value.thumbnailUrl ? React.createElement('div', { className: 'image-preview' }, React.createElement('a', { href: this.props.value.url, className: 'img-thumbnail' }, React.createElement('img', { width: this.props.value.thumbnailWidth, height: this.props.value.thumbnailHeight, src: this.props.value.thumbnailUrl }))) : null;

		// TODO review this return statement
		return React.createElement('div', null, React.createElement('div', { className: 'field-value' }, this.props.value.providerName, ' ', this.props.value.type), React.createElement('div', { className: 'field-value' }, this.props.value.url), imagePreview);

		// if item.get(field.paths.exists)
		// 	.field-value= item.get(field.paths.providerName) + ' ' + utils.upcase(item.get(field.paths.type))
		// 	.field-value= item.get(field.paths.url)
		// 	if item.get(field.paths.thumbnailUrl)
		// 		.image-preview
		// 			a(href=item.get(field.paths.url), rel=field.path).img-thumbnail
		// 				img(width=item.get(field.paths.thumbnailWidth), height=item.get(field.paths.thumbnailHeight), src=item.get(field.paths.thumbnailUrl))

		//return <div className="field-value">{this.props.value}</div>;
	}

});

},{"../Field":5,"react":undefined}],17:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'GeopointField',

	focusTargetRef: 'lat',

	valueChanged: function valueChanged(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},

	renderValue: function renderValue() {
		if (this.props.value[1] && this.props.value[0]) {
			return React.createElement('div', { className: 'field-value' }, this.props.value[1], ', ', this.props.value[0]); //eslint-disable-line comma-spacing
		}
		return React.createElement('div', { className: 'field-value' }, '(not set)');
	},

	renderField: function renderField() {
		return React.createElement('div', { className: 'form-row' }, React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'text', name: this.props.path + '[1]', placeholder: 'Latitude', ref: 'lat', value: this.props.value[1], onChange: this.valueChanged.bind(this, 1), autoComplete: 'off', className: 'form-control' })), React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'text', name: this.props.path + '[0]', placeholder: 'Longitude', ref: 'lng', value: this.props.value[0], onChange: this.valueChanged.bind(this, 0), autoComplete: 'off', className: 'form-control' })));
	}

});

},{"../Field":5,"react":undefined}],18:[function(require,module,exports){
(function (global){
'use strict';

var tinymce = (typeof window !== "undefined" ? window['tinymce'] : typeof global !== "undefined" ? global['tinymce'] : null),
    React = require('react'),
    Field = require('../Field'),
    _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var lastId = 0;

function getId() {
	return 'keystone-html-' + lastId++;
}

module.exports = Field.create({

	displayName: 'HtmlField',

	getInitialState: function getInitialState() {
		return {
			id: getId(),
			isFocused: false
		};
	},

	initWysiwyg: function initWysiwyg() {
		if (!this.props.wysiwyg) return;

		var self = this;
		var opts = this.getOptions();

		opts.setup = function (editor) {
			self.editor = editor;
			editor.on('change', self.valueChanged);
			editor.on('focus', self.focusChanged.bind(self, true));
			editor.on('blur', self.focusChanged.bind(self, false));
		};

		this._currentValue = this.props.value;
		tinymce.init(opts);
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		if (prevState.isCollapsed && !this.state.isCollapsed) {
			this.initWysiwyg();
		}

		if (_.isEqual(this.props.dependsOn, this.props.currentDependencies) && !_.isEqual(this.props.currentDependencies, prevProps.currentDependencies)) {
			var instance = tinymce.get(prevState.id);
			if (instance) {
				tinymce.EditorManager.execCommand('mceRemoveEditor', true, prevState.id);
				this.initWysiwyg();
			} else {
				this.initWysiwyg();
			}
		}
	},

	componentDidMount: function componentDidMount() {
		this.initWysiwyg();
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},

	focusChanged: function focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
	},

	valueChanged: function valueChanged() {
		var content;
		if (this.editor) {
			content = this.editor.getContent();
		} else if (this.refs.editor) {
			content = this.refs.editor.getDOMNode().value;
		} else {
			return;
		}

		this._currentValue = content;
		this.props.onChange({
			path: this.props.path,
			value: content
		});
	},

	getOptions: function getOptions() {
		var plugins = ['code', 'link'],
		    options = _.defaults({}, this.props.wysiwyg, Keystone.wysiwyg.options),
		    toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link',
		    i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			var additionalButtons = options.additionalButtons.split(',');
			for (i = 0; i < additionalButtons.length; i++) {
				toolbar += ' | ' + additionalButtons[i];
			}
		}
		if (options.additionalPlugins) {
			var additionalPlugins = options.additionalPlugins.split(',');
			for (i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (options.importcss) {
			plugins.push('importcss');
			var importcssOptions = {
				content_css: options.importcss,
				importcss_append: true,
				importcss_merge_classes: true
			};

			_.extend(options.additionalOptions, importcssOptions);
		}

		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}

		var opts = {
			selector: '#' + this.state.id,
			toolbar: toolbar,
			plugins: plugins,
			menubar: options.menubar || false,
			skin: options.skin || 'keystone'
		};

		if (this.shouldRenderField()) {
			opts.uploadimage_form_url = '/keystone/api/cloudinary/upload';
		} else {
			_.extend(opts, {
				mode: 'textareas',
				readonly: true,
				menubar: false,
				toolbar: 'code',
				statusbar: false
			});
		}

		if (options.additionalOptions) {
			_.extend(opts, options.additionalOptions);
		}

		return opts;
	},

	getFieldClassName: function getFieldClassName() {
		var className = this.props.wysiwyg ? 'wysiwyg' : 'code';
		return className;
	},

	renderEditor: function renderEditor(readOnly) {
		var className = this.state.isFocused ? 'is-focused' : '';
		var style = {
			height: this.props.height
		};
		return React.createElement('div', { className: className }, React.createElement('textarea', { ref: 'editor', style: style, onChange: this.valueChanged, id: this.state.id, className: this.getFieldClassName(), name: this.props.path, readOnly: readOnly, value: this.props.value }));
	},

	renderField: function renderField() {
		return this.renderEditor();
	},

	renderValue: function renderValue() {
		return this.renderEditor(true);
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined}],19:[function(require,module,exports){
'use strict';

var Field = require('../Field');

module.exports = Field.create({
	displayName: 'KeyField'
});

},{"../Field":5}],20:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field'),
    Note = require('../../components/Note');

module.exports = Field.create({

	shouldCollapse: function shouldCollapse() {
		return this.props.collapse && !this.hasExisting();
	},

	fileFieldNode: function fileFieldNode() {
		return this.refs.fileField.getDOMNode();
	},

	changeFile: function changeFile() {
		this.refs.fileField.getDOMNode().click();
	},

	getFileSource: function getFileSource() {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getFileURL: function getFileURL() {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	undoRemove: function undoRemove() {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource: null,
			origin: false,
			action: null
		});
	},

	fileChanged: function fileChanged(event) {
		//eslint-disable-line no-unused-vars
		this.setState({
			origin: 'local'
		});
	},

	removeFile: function removeFile(e) {
		var state = {
			localSource: null,
			origin: false
		};

		if (this.hasLocal()) {
			this.fileFieldNode().value = '';
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},

	hasLocal: function hasLocal() {
		return this.state.origin === 'local';
	},

	hasFile: function hasFile() {
		return this.hasExisting() || this.hasLocal();
	},

	hasExisting: function hasExisting() {
		return !!this.props.value.filename;
	},

	getFilename: function getFilename() {
		if (this.hasLocal()) {
			return this.fileFieldNode().value.split('\\').pop();
		} else {
			return this.props.value.filename;
		}
	},

	renderFileDetails: function renderFileDetails(add) {
		var values = null;

		if (this.hasFile() && !this.state.removeExisting) {
			values = React.createElement('div', { className: 'file-values' }, React.createElement('div', { className: 'field-value' }, this.getFilename()));
		}

		return React.createElement('div', { key: this.props.path + '_details', className: 'file-details' }, values, add);
	},

	renderAlert: function renderAlert() {
		if (this.hasLocal()) {
			return React.createElement('div', { className: 'upload-queued pull-left' }, React.createElement('div', { className: 'alert alert-success' }, 'File selected - save to upload'));
		} else if (this.state.origin === 'cloudinary') {
			return React.createElement('div', { className: 'select-queued pull-left' }, React.createElement('div', { className: 'alert alert-success' }, 'File selected from Cloudinary'));
		} else if (this.state.removeExisting) {
			return React.createElement('div', { className: 'delete-queued pull-left' }, React.createElement('div', { className: 'alert alert-danger' }, 'File ', this.props.autoCleanup ? 'deleted' : 'removed', ' - save to confirm'));
		} else {
			return null;
		}
	},

	renderClearButton: function renderClearButton() {
		if (this.state.removeExisting) {
			return React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel btn-undo-file', onClick: this.undoRemove }, 'Undo Remove');
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = this.props.autoCleanup ? 'Delete File' : 'Remove File';
			}
			return React.createElement('button', { type: 'button', className: 'btn btn-link btn-cancel btn-delete-file', onClick: this.removeFile }, clearText);
		}
	},

	renderFileField: function renderFileField() {
		return React.createElement('input', { ref: 'fileField', type: 'file', name: this.props.paths.upload, className: 'field-upload', onChange: this.fileChanged });
	},

	renderFileAction: function renderFileAction() {
		return React.createElement('input', { type: 'hidden', name: this.props.paths.action, className: 'field-action', value: this.state.action });
	},

	renderFileToolbar: function renderFileToolbar() {
		return React.createElement('div', { key: this.props.path + '_toolbar', className: 'file-toolbar' }, React.createElement('div', { className: 'pull-left' }, React.createElement('button', { type: 'button', onClick: this.changeFile, className: 'btn btn-default btn-upload-file' }, this.hasFile() ? 'Change' : 'Upload', ' File'), this.hasFile() && this.renderClearButton()));
	},

	renderUI: function renderUI() {
		var container = [],
		    body = [],
		    hasFile = this.hasFile(),
		    fieldClassName = 'field-ui';

		if (hasFile) {
			fieldClassName += ' has-file';
		}

		if (this.shouldRenderField()) {
			if (hasFile) {
				container.push(this.renderFileDetails(this.renderAlert()));
			}
			body.push(this.renderFileToolbar());
		} else {
			if (hasFile) {
				container.push(this.renderFileDetails());
			} else {
				container.push(React.createElement('div', { className: 'help-block' }, 'no file'));
			}
		}

		return React.createElement('div', { className: 'field field-type-localfile' }, React.createElement('label', { className: 'field-label' }, this.props.label), this.renderFileField(), this.renderFileAction(), React.createElement('div', { className: fieldClassName }, React.createElement('div', { className: 'file-container' }, container), body, React.createElement(Note, { note: this.props.note })));
	}

});

},{"../../components/Note":2,"../Field":5,"react":undefined}],21:[function(require,module,exports){
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
    bytes = require('bytes'),
    React = require('react'),
    Field = require('../Field');

var ICON_EXTS = ['aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'css', 'dat', 'dmg', 'doc', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h', 'hpp', 'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3', 'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots', 'ott', 'pdf', 'php', 'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss', 'sql', 'tga', 'tgz', 'tiff', 'txt', 'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip'];

var Item = React.createClass({
	displayName: 'Item',

	render: function render() {
		var filename = this.props.filename;
		var ext = filename.split('.').pop();

		var iconName = '_blank';
		if (_.contains(ICON_EXTS, ext)) iconName = ext;

		var body = [];

		body.push(React.createElement('img', { className: 'file-icon', src: '/keystone/images/icons/32/' + iconName + '.png' }));
		body.push(React.createElement('span', { className: 'file-filename' }, filename));

		if (this.props.size) {
			body.push(React.createElement('span', { className: 'file-size' }, bytes(this.props.size)));
		}

		if (this.props.deleted) {
			body.push(React.createElement('span', { className: 'file-note-delete' }, 'save to delete'));
		} else if (this.props.isQueued) {
			body.push(React.createElement('span', { className: 'file-note-upload' }, 'save to upload'));
		}

		if (!this.props.isQueued) {
			var actionLabel = this.props.deleted ? 'undo' : 'remove';
			body.push(React.createElement('span', { className: 'file-action', onClick: this.props.toggleDelete }, actionLabel));
		}

		var itemClassName = 'file-item';
		if (this.props.deleted) itemClassName += ' file-item-deleted';

		return React.createElement('div', { className: itemClassName, key: this.props.key }, body);
	}

});

module.exports = Field.create({

	getInitialState: function getInitialState() {
		var items = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushItem(item, items);
		});

		return { items: items };
	},

	removeItem: function removeItem(i) {
		var thumbs = this.state.items;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ items: thumbs });
	},

	pushItem: function pushItem(args, thumbs) {
		thumbs = thumbs || this.state.items;
		var i = thumbs.length;
		args.toggleDelete = this.removeItem.bind(this, i);
		thumbs.push(React.createElement(Item, _extends({ key: i }, args)));
	},

	fileFieldNode: function fileFieldNode() {
		return this.refs.fileField.getDOMNode();
	},

	renderFileField: function renderFileField() {
		return React.createElement('input', { ref: 'fileField', type: 'file', name: this.props.paths.upload, multiple: true, className: 'field-upload', onChange: this.uploadFile });
	},

	clearFiles: function clearFiles() {
		this.fileFieldNode().value = '';

		this.setState({
			items: this.state.items.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile: function uploadFile(event) {
		var self = this;

		var files = event.target.files;
		_.each(files, function (f) {
			self.pushItem({ isQueued: true, filename: f.name });
			self.forceUpdate();
		});
	},

	changeFiles: function changeFiles() {
		this.fileFieldNode().click();
	},

	hasFiles: function hasFiles() {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar: function renderToolbar() {
		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = React.createElement('button', { type: 'button', className: 'btn btn-default btn-upload', onClick: this.clearFiles }, 'Clear uploads');
		}

		return React.createElement('div', { className: 'files-toolbar row col-sm-3 col-md-12' }, React.createElement('div', { className: 'pull-left' }, React.createElement('button', { type: 'button', className: 'btn btn-default btn-upload', onClick: this.changeFiles }, 'Upload'), clearFilesButton));
	},

	renderPlaceholder: function renderPlaceholder() {
		return React.createElement('div', { className: 'file-field file-upload row col-sm-3 col-md-12', onClick: this.changeFiles }, React.createElement('div', { className: 'file-preview' }, React.createElement('span', { className: 'file-thumbnail' }, React.createElement('span', { className: 'file-dropzone' }), React.createElement('div', { className: 'ion-picture file-uploading' }))), React.createElement('div', { className: 'file-details' }, React.createElement('span', { className: 'file-message' }, 'Click to upload')));
	},

	renderContainer: function renderContainer() {
		return React.createElement('div', { className: 'files-container clearfix' }, this.state.items);
	},

	renderFieldAction: function renderFieldAction() {
		var value = '';
		var remove = [];
		_.each(this.state.items, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
		});
		if (remove.length) value = 'delete:' + remove.join(',');

		return React.createElement('input', { ref: 'action', className: 'field-action', type: 'hidden', value: value, name: this.props.paths.action });
	},

	renderUploadsField: function renderUploadsField() {
		return React.createElement('input', { ref: 'uploads', className: 'field-uploads', type: 'hidden', name: this.props.paths.uploads });
	},

	renderUI: function renderUI() {
		return React.createElement('div', { className: 'field field-type-files' }, React.createElement('label', { className: 'field-label' }, this.props.label), this.renderFieldAction(), this.renderUploadsField(), this.renderFileField(), React.createElement('div', { className: 'field-ui' }, this.renderContainer(), this.renderToolbar()));
	}
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"bytes":undefined,"react":undefined}],22:[function(require,module,exports){
(function (global){
'use strict';

/**
 * TODO:
 * - Custom path support
 */

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    Field = require('../Field'),
    Note = require('../../components/Note');

module.exports = Field.create({

	displayName: 'LocationField',

	getInitialState: function getInitialState() {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false
		};
	},

	componentWillMount: function componentWillMount() {

		var collapsedFields = {};

		_.each(['number', 'name', 'street2', 'geo'], function (i) {
			if (!this.props.value[i]) {
				collapsedFields[i] = true;
			}
		}, this);

		this.setState({
			collapsedFields: collapsedFields
		});
	},

	componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
		if (prevState.fieldsCollapsed && !this.state.fieldsCollapsed) {
			this.refs.number.getDOMNode().focus();
		}
	},

	shouldCollapse: function shouldCollapse() {
		return this.formatValue() ? false : true;
	},

	uncollapseFields: function uncollapseFields() {
		this.setState({
			collapsedFields: {}
		});
	},

	fieldChanged: function fieldChanged(path, event) {
		var value = this.props.value;
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},

	geoChanged: function geoChanged(i, event) {
		var value = this.props.value;
		if (!value.geo) {
			value.geo = ['', ''];
		}
		value.geo[i] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},

	formatValue: function formatValue() {
		return _.compact([this.props.value.number, this.props.value.name, this.props.value.street1, this.props.value.street2, this.props.value.suburb, this.props.value.state, this.props.value.postcode, this.props.value.country]).join(', ');
	},

	renderValue: function renderValue() {
		return React.createElement('div', { className: 'field-value' }, this.formatValue() || '(no value)');
	},

	renderField: function renderField(path, label, collapse) {
		//eslint-disable-line no-unused-vars

		if (this.state.collapsedFields[path]) {
			return null;
		}

		return React.createElement('div', { className: 'row' }, React.createElement('div', { className: 'col-sm-2 location-field-label' }, React.createElement('label', { className: 'text-muted' }, label)), React.createElement('div', { className: 'col-sm-10 col-md-7 col-lg-6 location-field-controls' }, React.createElement('input', { type: 'text', name: this.props.path + '.' + path, ref: path, value: this.props.value[path], onChange: this.fieldChanged.bind(this, path), className: 'form-control' })));
	},

	renderStateAndPostcode: function renderStateAndPostcode() {
		return React.createElement('div', { className: 'row' }, React.createElement('div', { className: 'col-sm-2 location-field-label' }, React.createElement('label', { className: 'text-muted' }, 'State/Postcode')), React.createElement('div', { className: 'col-sm-10 col-md-7 col-lg-6 location-field-controls' }, React.createElement('div', { className: 'form-row' }, React.createElement('div', { className: 'col-xs-6' }, React.createElement('input', { type: 'text', name: this.props.path + '.state', ref: 'state', value: this.props.value.state, onChange: this.fieldChanged.bind(this, 'state'), className: 'form-control', placeholder: 'State' })), React.createElement('div', { className: 'col-xs-6' }, React.createElement('input', { type: 'text', name: this.props.path + '.postcode', ref: 'postcode', value: this.props.value.postcode, onChange: this.fieldChanged.bind(this, 'postcode'), className: 'form-control', placeholder: 'Postcode' })))));
	},

	renderGeo: function renderGeo() {

		if (this.state.collapsedFields.geo) {
			return null;
		}

		return React.createElement('div', { className: 'row' }, React.createElement('div', { className: 'col-sm-2 location-field-label' }, React.createElement('label', { className: 'text-muted' }, 'Lat / Lng')), React.createElement('div', { className: 'col-sm-10 col-md-7 col-lg-6 location-field-controls' }, React.createElement('div', { className: 'form-row' }, React.createElement('div', { className: 'col-xs-6' }, React.createElement('input', { type: 'text', name: this.props.paths.geo + '[1]', ref: 'geo1', value: this.props.value.geo ? this.props.value.geo[1] : '', onChange: this.geoChanged.bind(this, 1), placeholder: 'Latitude', className: 'form-control' })), React.createElement('div', { className: 'col-xs-6' }, React.createElement('input', { type: 'text', name: this.props.paths.geo + '[0]', ref: 'geo0', value: this.props.value.geo ? this.props.value.geo[0] : '', onChange: this.geoChanged.bind(this, 0), placeholder: 'Longitude', className: 'form-control' })))));
	},

	updateGoogleOption: function updateGoogleOption(key, e) {
		var newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},

	renderGoogleOptions: function renderGoogleOptions() {
		if (!this.props.enableMapsAPI) return null;
		var replace = this.state.improve ? React.createElement('label', { className: 'checkbox overwrite', htmlFor: this.props.paths.overwrite }, React.createElement('input', { type: 'checkbox', name: this.props.paths.overwrite, id: this.props.paths.overwrite, value: 'true', onChange: this.updateGoogleOption.bind(this, 'overwrite'), checked: this.state.overwrite }), 'Replace existing data') : null;
		return React.createElement('div', { className: 'row' }, React.createElement('div', { className: 'col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 improve-options' }, React.createElement('label', { className: 'checkbox autoimprove', htmlFor: this.props.paths.improve, title: 'When checked, this will attempt to fill missing fields. It will also get the lat/long' }, React.createElement('input', { type: 'checkbox', name: this.props.paths.improve, id: this.props.paths.improve, value: 'true', onChange: this.updateGoogleOption.bind(this, 'improve'), checked: this.state.improve }), 'Autodetect and improve location on save'), replace));
	},

	renderUI: function renderUI() {

		if (!this.shouldRenderField()) {
			return React.createElement('div', { className: 'field field-type-location' }, React.createElement('label', { className: 'field-label' }, this.props.label), React.createElement('div', { className: 'field-ui noedit' }, this.renderValue()));
		}

		/* eslint-disable no-script-url */
		var showMore = !_.isEmpty(this.state.collapsedFields) ? React.createElement('a', { href: 'javascript:;', className: 'field-label-companion', onClick: this.uncollapseFields }, '(show more fields)') : null;
		/* eslint-enable */

		return React.createElement('div', { className: 'field field-type-location' }, React.createElement('div', { className: 'field-ui' }, React.createElement('label', null, this.props.label), showMore, this.renderField('number', 'PO Box / Shop', true), this.renderField('name', 'Building Name', true), this.renderField('street1', 'Street Address'), this.renderField('street2', 'Street Address 2', true), this.renderField('suburb', 'Suburb'), this.renderStateAndPostcode(), this.renderField('country', 'Country'), this.renderGeo(), this.renderGoogleOptions(), React.createElement(Note, { note: this.props.note })));
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../components/Note":2,"../Field":5,"react":undefined}],23:[function(require,module,exports){
(function (global){
'use strict';

var React = require('react'),
    Field = require('../Field');

// Scope jQuery and the bootstrap-markdown editor so it will mount
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
require('./lib/bootstrap-markdown');

// Append/remove ### surround the selection
// Source: https://github.com/toopay/bootstrap-markdown/blob/master/js/bootstrap-markdown.js#L909
var toggleHeading = function toggleHeading(e, level) {
	var chunk,
	    cursor,
	    selected = e.getSelection(),
	    content = e.getContent(),
	    pointer,
	    prevChar;

	if (selected.length === 0) {
		// Give extra word
		chunk = e.__localize('heading text');
	} else {
		chunk = selected.text + '\n';
	}

	// transform selection and set the cursor into chunked text
	if ((pointer = level.length + 1, content.substr(selected.start - pointer, pointer) === level + ' ') || (pointer = level.length, content.substr(selected.start - pointer, pointer) === level)) {
		e.setSelection(selected.start - pointer, selected.end);
		e.replaceSelection(chunk);
		cursor = selected.start - pointer;
	} else if (selected.start > 0 && (prevChar = content.substr(selected.start - 1, 1), !!prevChar && prevChar !== '\n')) {
		e.replaceSelection('\n\n' + level + ' ' + chunk);
		cursor = selected.start + level.length + 3;
	} else {
		// Empty string before element
		e.replaceSelection(level + ' ' + chunk);
		cursor = selected.start + level.length + 1;
	}

	// Set the cursor
	e.setSelection(cursor, cursor + chunk.length);
};

var renderMarkdown = function renderMarkdown(component) {
	// dependsOn means that sometimes the component is mounted as a null, so account for that & noop
	if (!component.refs.markdownTextarea) {
		return;
	}

	var options = {
		autofocus: false,
		savable: false,
		resize: 'vertical',
		height: component.props.height,
		hiddenButtons: ['Heading'],

		// Heading buttons
		additionalButtons: [{
			name: 'groupHeaders',
			data: [{
				name: 'cmdH1',
				title: 'Heading 1',
				btnText: 'H1',
				callback: function callback(e) {
					toggleHeading(e, '#');
				}
			}, {
				name: 'cmdH2',
				title: 'Heading 2',
				btnText: 'H2',
				callback: function callback(e) {
					toggleHeading(e, '##');
				}
			}, {
				name: 'cmdH3',
				title: 'Heading 3',
				btnText: 'H3',
				callback: function callback(e) {
					toggleHeading(e, '###');
				}
			}, {
				name: 'cmdH4',
				title: 'Heading 4',
				btnText: 'H4',
				callback: function callback(e) {
					toggleHeading(e, '####');
				}
			}]
		}],

		// Insert Header buttons into the toolbar
		reorderButtonGroups: ['groupFont', 'groupHeaders', 'groupLink', 'groupMisc', 'groupUtil']
	};

	if (component.props.toolbarOptions.hiddenButtons) {
		var hiddenButtons = 'string' === typeof component.props.toolbarOptions.hiddenButtons ? component.props.toolbarOptions.hiddenButtons.split(',') : component.props.toolbarOptions.hiddenButtons;
		options.hiddenButtons = options.hiddenButtons.concat(hiddenButtons);
	}

	$(component.refs.markdownTextarea.getDOMNode()).markdown(options);
};

module.exports = Field.create({

	displayName: 'MarkdownField',

	// Override `shouldCollapse` to check the markdown field correctly
	shouldCollapse: function shouldCollapse() {
		return this.props.collapse && !this.props.value.md;
	},

	// only have access to `refs` once component is mounted
	componentDidMount: function componentDidMount() {
		if (this.props.wysiwyg) {
			renderMarkdown(this);
		}
	},

	// only have access to `refs` once component is mounted
	componentDidUpdate: function componentDidUpdate() {
		if (this.props.wysiwyg) {
			renderMarkdown(this);
		}
	},

	renderField: function renderField() {
		var styles = {
			padding: 8,
			height: this.props.height
		};

		return React.createElement('div', { className: 'md-editor' }, React.createElement('textarea', { name: this.props.paths.md, style: styles, defaultValue: this.props.value.md, ref: 'markdownTextarea', className: 'form-control markdown code' }));
	}
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"./lib/bootstrap-markdown":24,"react":undefined}],24:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* ===================================================
* bootstrap-markdown.js v2.7.0
* http://github.com/toopay/bootstrap-markdown
* ===================================================
* Copyright 2013-2014 Taufan Aditya
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ========================================================== */

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var marked = require('marked');

/* MARKDOWN CLASS DEFINITION
 * ========================== */

var Markdown = function Markdown(element, options) {
	// Class Properties
	this.$ns = 'bootstrap-markdown';
	this.$element = $(element);
	this.$editable = { el: null, type: null, attrKeys: [], attrValues: [], content: null };
	this.$options = $.extend(true, {}, $.fn.markdown.defaults, options, this.$element.data(), this.$element.data('options'));
	this.$oldContent = null;
	this.$isPreview = false;
	this.$isFullscreen = false;
	this.$editor = null;
	this.$textarea = null;
	this.$handler = [];
	this.$callback = [];
	this.$nextTab = [];

	this.showEditor();
};

Markdown.prototype = {

	constructor: Markdown,

	__alterButtons: function __alterButtons(name, alter) {
		var handler = this.$handler,
		    isAll = name == 'all',
		    that = this;

		$.each(handler, function (k, v) {
			var halt = true;
			if (isAll) {
				halt = false;
			} else {
				halt = v.indexOf(name) < 0;
			}

			if (halt == false) {
				alter(that.$editor.find('button[data-handler="' + v + '"]'));
			}
		});
	},

	__buildButtons: function __buildButtons(buttonsArray, container) {
		var i,
		    ns = this.$ns,
		    handler = this.$handler,
		    callback = this.$callback;

		for (i = 0; i < buttonsArray.length; i++) {
			// Build each group container
			var y,
			    btnGroups = buttonsArray[i];
			for (y = 0; y < btnGroups.length; y++) {
				// Build each button group
				var z,
				    buttons = btnGroups[y].data,
				    btnGroupContainer = $('<div/>', {
					'class': 'btn-group'
				});

				for (z = 0; z < buttons.length; z++) {
					var button = buttons[z],
					    buttonContainer,
					    buttonIconContainer,
					    buttonHandler = ns + '-' + button.name,
					    buttonIcon = this.__getIcon(button.icon),
					    btnText = button.btnText ? button.btnText : '',
					    btnClass = button.btnClass ? button.btnClass : 'btn',
					    tabIndex = button.tabIndex ? button.tabIndex : '-1',
					    hotkey = typeof button.hotkey !== 'undefined' ? button.hotkey : '',
					    hotkeyCaption = typeof jQuery.hotkeys !== 'undefined' && hotkey !== '' ? ' (' + hotkey + ')' : '';

					// Construct the button object
					buttonContainer = $('<button></button>');
					buttonContainer.text(' ' + this.__localize(btnText)).addClass('btn-default btn-sm').addClass(btnClass);
					if (btnClass.match(/btn\-(primary|success|info|warning|danger|link)/)) {
						buttonContainer.removeClass('btn-default');
					}
					buttonContainer.attr({
						'type': 'button',
						'title': this.__localize(button.title) + hotkeyCaption,
						'tabindex': tabIndex,
						'data-provider': ns,
						'data-handler': buttonHandler,
						'data-hotkey': hotkey
					});
					if (button.toggle == true) {
						buttonContainer.attr('data-toggle', 'button');
					}
					buttonIconContainer = $('<span/>');
					buttonIconContainer.addClass(buttonIcon);
					buttonIconContainer.prependTo(buttonContainer);

					// Attach the button object
					btnGroupContainer.append(buttonContainer);

					// Register handler and callback
					handler.push(buttonHandler);
					callback.push(button.callback);
				}

				// Attach the button group into container dom
				container.append(btnGroupContainer);
			}
		}

		return container;
	},
	__setListener: function __setListener() {
		// Set size and resizable Properties
		var hasRows = typeof this.$textarea.attr('rows') != 'undefined',
		    maxRows = this.$textarea.val().split("\n").length > 5 ? this.$textarea.val().split("\n").length : '5',
		    rowsVal = hasRows ? this.$textarea.attr('rows') : maxRows;

		this.$textarea.attr('rows', rowsVal);
		if (this.$options.resize) {
			this.$textarea.css('resize', this.$options.resize);
		}

		this.$textarea.on('focus', $.proxy(this.focus, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this)).on('change', $.proxy(this.change, this));

		if (this.eventSupported('keydown')) {
			this.$textarea.on('keydown', $.proxy(this.keydown, this));
		}

		// Re-attach markdown data
		this.$textarea.data('markdown', this);
	},

	__handle: function __handle(e) {
		var target = $(e.currentTarget),
		    handler = this.$handler,
		    callback = this.$callback,
		    handlerName = target.attr('data-handler'),
		    callbackIndex = handler.indexOf(handlerName),
		    callbackHandler = callback[callbackIndex];

		// Trigger the focusin
		$(e.currentTarget).focus();

		callbackHandler(this);

		// Trigger onChange for each button handle
		this.change(this);

		// Unless it was the save handler,
		// focusin the textarea
		if (handlerName.indexOf('cmdSave') < 0) {
			this.$textarea.focus();
		}

		e.preventDefault();
	},

	__localize: function __localize(string) {
		var messages = $.fn.markdown.messages,
		    language = this.$options.language;
		if (typeof messages !== 'undefined' && typeof messages[language] !== 'undefined' && typeof messages[language][string] !== 'undefined') {
			return messages[language][string];
		}
		return string;
	},

	__getIcon: function __getIcon(src) {
		return (typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object' ? src[this.$options.iconlibrary] : src;
	},

	setFullscreen: function setFullscreen(mode) {
		var $editor = this.$editor,
		    $textarea = this.$textarea;

		if (mode === true) {
			$editor.addClass('md-fullscreen-mode');
			$('body').addClass('md-nooverflow');
			this.$options.onFullscreen(this);
		} else {
			$editor.removeClass('md-fullscreen-mode');
			$('body').removeClass('md-nooverflow');
		}

		this.$isFullscreen = mode;
		$textarea.focus();
	},

	showEditor: function showEditor() {
		var instance = this,
		    textarea,
		    ns = this.$ns,
		    container = this.$element,
		    originalHeigth = container.css('height'),
		    originalWidth = container.css('width'),
		    editable = this.$editable,
		    handler = this.$handler,
		    callback = this.$callback,
		    options = this.$options,
		    editor = $('<div/>', {
			'class': 'md-editor',
			click: function click() {
				instance.focus();
			}
		});

		// Prepare the editor
		if (this.$editor == null) {
			// Create the panel
			var editorHeader = $('<div/>', {
				'class': 'md-header btn-toolbar'
			});

			// Merge the main & additional button groups together
			var allBtnGroups = [];
			if (options.buttons.length > 0) allBtnGroups = allBtnGroups.concat(options.buttons[0]);
			if (options.additionalButtons.length > 0) allBtnGroups = allBtnGroups.concat(options.additionalButtons[0]);

			// Reduce and/or reorder the button groups
			if (options.reorderButtonGroups.length > 0) {
				allBtnGroups = allBtnGroups.filter(function (btnGroup) {
					return options.reorderButtonGroups.indexOf(btnGroup.name) > -1;
				}).sort(function (a, b) {
					if (options.reorderButtonGroups.indexOf(a.name) < options.reorderButtonGroups.indexOf(b.name)) return -1;
					if (options.reorderButtonGroups.indexOf(a.name) > options.reorderButtonGroups.indexOf(b.name)) return 1;
					return 0;
				});
			}

			// Build the buttons
			if (allBtnGroups.length > 0) {
				editorHeader = this.__buildButtons([allBtnGroups], editorHeader);
			}

			if (options.fullscreen.enable) {
				editorHeader.append('<div class="md-controls"><a class="md-control md-control-fullscreen" href="javascript:;" tabIndex="-1"><span class="' + this.__getIcon(options.fullscreen.icons.fullscreenOn) + '"></span></a></div>').on('click', '.md-control-fullscreen', function (e) {
					e.preventDefault();
					instance.setFullscreen(true);
				});
			}

			editor.append(editorHeader);

			// Wrap the textarea
			if (container.is('textarea')) {
				container.before(editor);
				textarea = container;
				textarea.addClass('md-input');
				editor.append(textarea);
			} else {
				var rawContent = typeof toMarkdown == 'function' ? toMarkdown(container.html()) : container.html(),
				    currentContent = $.trim(rawContent);

				// This is some arbitrary content that could be edited
				textarea = $('<textarea/>', {
					'class': 'md-input',
					'val': currentContent
				});

				editor.append(textarea);

				// Save the editable
				editable.el = container;
				editable.type = container.prop('tagName').toLowerCase();
				editable.content = container.html();

				$(container[0].attributes).each(function () {
					editable.attrKeys.push(this.nodeName);
					editable.attrValues.push(this.nodeValue);
				});

				// Set editor to blocked the original container
				container.replaceWith(editor);
			}

			var editorFooter = $('<div/>', {
				'class': 'md-footer'
			}),
			    createFooter = false,
			    footer = '';
			// Create the footer if savable
			if (options.savable) {
				createFooter = true;
				var saveHandler = 'cmdSave';

				// Register handler and callback
				handler.push(saveHandler);
				callback.push(options.onSave);

				editorFooter.append('<button class="btn btn-success" data-provider="' + ns + '" data-handler="' + saveHandler + '"><i class="icon icon-white icon-ok"></i> ' + this.__localize('Save') + '</button>');
			}

			footer = typeof options.footer === 'function' ? options.footer(this) : options.footer;

			if ($.trim(footer) !== '') {
				createFooter = true;
				editorFooter.append(footer);
			}

			if (createFooter) editor.append(editorFooter);

			// Set width
			if (options.width && options.width !== 'inherit') {
				if (jQuery.isNumeric(options.width)) {
					editor.css('display', 'table');
					textarea.css('width', options.width + 'px');
				} else {
					editor.addClass(options.width);
				}
			}

			// Set height
			if (options.height && options.height !== 'inherit') {
				if (jQuery.isNumeric(options.height)) {
					var height = options.height;
					if (editorHeader) height = Math.max(0, height - editorHeader.outerHeight());
					if (editorFooter) height = Math.max(0, height - editorFooter.outerHeight());
					textarea.css('height', height + 'px');
				} else {
					editor.addClass(options.height);
				}
			}

			// Reference
			this.$editor = editor;
			this.$textarea = textarea;
			this.$editable = editable;
			this.$oldContent = this.getContent();

			this.__setListener();

			// Set editor attributes, data short-hand API and listener
			this.$editor.attr('id', new Date().getTime());
			this.$editor.on('click', '[data-provider="bootstrap-markdown"]', $.proxy(this.__handle, this));

			if (this.$element.is(':disabled') || this.$element.is('[readonly]')) {
				this.$editor.addClass('md-editor-disabled');
				this.disableButtons('all');
			}

			if (this.eventSupported('keydown') && _typeof(jQuery.hotkeys) === 'object') {
				editorHeader.find('[data-provider="bootstrap-markdown"]').each(function () {
					var $button = $(this),
					    hotkey = $button.attr('data-hotkey');
					if (hotkey.toLowerCase() !== '') {
						textarea.bind('keydown', hotkey, function () {
							$button.trigger('click');
							return false;
						});
					}
				});
			}

			if (options.initialstate === 'preview') {
				this.showPreview();
			} else if (options.initialstate === 'fullscreen' && options.fullscreen.enable) {
				this.setFullscreen(true);
			}
		} else {
			this.$editor.show();
		}

		if (options.autofocus) {
			this.$textarea.focus();
			this.$editor.addClass('active');
		}

		if (options.fullscreen.enable && options.fullscreen !== false) {
			this.$editor.append('\
				<div class="md-fullscreen-controls">\
					<a href="#" class="exit-fullscreen" title="Exit fullscreen"><span class="' + this.__getIcon(options.fullscreen.icons.fullscreenOff) + '"></span></a>\
				</div>');

			this.$editor.on('click', '.exit-fullscreen', function (e) {
				e.preventDefault();
				instance.setFullscreen(false);
			});
		}

		// hide hidden buttons from options
		this.hideButtons(options.hiddenButtons);

		// disable disabled buttons from options
		this.disableButtons(options.disabledButtons);

		// Trigger the onShow hook
		options.onShow(this);

		return this;
	},

	parseContent: function parseContent() {
		var content,
		    callbackContent = this.$options.onPreview(this); // Try to get the content from callback

		if (typeof callbackContent == 'string') {
			// Set the content based by callback content
			content = callbackContent;
		} else {
			// Set the content
			var val = this.$textarea.val();
			if ((typeof markdown === 'undefined' ? 'undefined' : _typeof(markdown)) == 'object') {
				content = markdown.toHTML(val);
			} else if (typeof marked == 'function') {
				content = marked(val);
			} else {
				content = val;
			}
		}

		return content;
	},

	showPreview: function showPreview() {
		var options = this.$options,
		    container = this.$textarea,
		    afterContainer = container.next(),
		    replacementContainer = $('<div/>', { 'class': 'md-preview', 'data-provider': 'markdown-preview' }),
		    content;

		// Give flag that tell the editor enter preview mode
		this.$isPreview = true;
		// Disable all buttons
		this.disableButtons('all').enableButtons('cmdPreview');

		content = this.parseContent();

		// Build preview element
		replacementContainer.html(content);

		if (afterContainer && afterContainer.attr('class') == 'md-footer') {
			// If there is footer element, insert the preview container before it
			replacementContainer.insertBefore(afterContainer);
		} else {
			// Otherwise, just append it after textarea
			container.parent().append(replacementContainer);
		}

		// Set the preview element dimensions
		replacementContainer.css({
			width: container.outerWidth() + 'px',
			height: container.outerHeight() + 'px'
		});

		if (this.$options.resize) {
			replacementContainer.css('resize', this.$options.resize);
		}

		// Hide the last-active textarea
		container.hide();

		// Attach the editor instances
		replacementContainer.data('markdown', this);

		if (this.$element.is(':disabled') || this.$element.is('[readonly]')) {
			this.$editor.addClass('md-editor-disabled');
			this.disableButtons('all');
		}

		return this;
	},

	hidePreview: function hidePreview() {
		// Give flag that tell the editor quit preview mode
		this.$isPreview = false;

		// Obtain the preview container
		var container = this.$editor.find('div[data-provider="markdown-preview"]');

		// Remove the preview container
		container.remove();

		// Enable all buttons
		this.enableButtons('all');
		// Disable configured disabled buttons
		this.disableButtons(this.$options.disabledButtons);

		// Back to the editor
		this.$textarea.show();
		this.__setListener();

		return this;
	},

	isDirty: function isDirty() {
		return this.$oldContent != this.getContent();
	},

	getContent: function getContent() {
		return this.$textarea.val();
	},

	setContent: function setContent(content) {
		this.$textarea.val(content);

		return this;
	},

	findSelection: function findSelection(chunk) {
		var content = this.getContent(),
		    startChunkPosition;

		if (startChunkPosition = content.indexOf(chunk), startChunkPosition >= 0 && chunk.length > 0) {
			var oldSelection = this.getSelection(),
			    selection;

			this.setSelection(startChunkPosition, startChunkPosition + chunk.length);
			selection = this.getSelection();

			this.setSelection(oldSelection.start, oldSelection.end);

			return selection;
		} else {
			return null;
		}
	},

	getSelection: function getSelection() {

		var e = this.$textarea[0];

		return ('selectionStart' in e && function () {
			var l = e.selectionEnd - e.selectionStart;
			return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
		} ||

		/* browser not supported */
		function () {
			return null;
		})();
	},

	setSelection: function setSelection(start, end) {

		var e = this.$textarea[0];

		return ('selectionStart' in e && function () {
			e.selectionStart = start;
			e.selectionEnd = end;
			return;
		} ||

		/* browser not supported */
		function () {
			return null;
		})();
	},

	replaceSelection: function replaceSelection(text) {

		var e = this.$textarea[0];

		return ('selectionStart' in e && function () {
			e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
			// Set cursor to the last replacement end
			e.selectionStart = e.value.length;
			return this;
		} ||

		/* browser not supported */
		function () {
			e.value += text;
			return jQuery(e);
		})();
	},

	getNextTab: function getNextTab() {
		// Shift the nextTab
		if (this.$nextTab.length == 0) {
			return null;
		} else {
			var nextTab,
			    tab = this.$nextTab.shift();

			if (typeof tab == 'function') {
				nextTab = tab();
			} else if ((typeof tab === 'undefined' ? 'undefined' : _typeof(tab)) == 'object' && tab.length > 0) {
				nextTab = tab;
			}

			return nextTab;
		}
	},

	setNextTab: function setNextTab(start, end) {
		// Push new selection into nextTab collections
		if (typeof start == 'string') {
			var that = this;
			this.$nextTab.push(function () {
				return that.findSelection(start);
			});
		} else if (typeof start == 'number' && typeof end == 'number') {
			var oldSelection = this.getSelection();

			this.setSelection(start, end);
			this.$nextTab.push(this.getSelection());

			this.setSelection(oldSelection.start, oldSelection.end);
		}

		return;
	},

	__parseButtonNameParam: function __parseButtonNameParam(nameParam) {
		var buttons = [];

		if (typeof nameParam == 'string') {
			buttons.push(nameParam);
		} else {
			buttons = nameParam;
		}

		return buttons;
	},

	enableButtons: function enableButtons(name) {
		var buttons = this.__parseButtonNameParam(name),
		    that = this;

		$.each(buttons, function (i, v) {
			that.__alterButtons(buttons[i], function (el) {
				el.removeAttr('disabled');
			});
		});

		return this;
	},

	disableButtons: function disableButtons(name) {
		var buttons = this.__parseButtonNameParam(name),
		    that = this;

		$.each(buttons, function (i, v) {
			that.__alterButtons(buttons[i], function (el) {
				el.attr('disabled', 'disabled');
			});
		});

		return this;
	},

	hideButtons: function hideButtons(name) {
		var buttons = this.__parseButtonNameParam(name),
		    that = this;

		$.each(buttons, function (i, v) {
			that.__alterButtons(buttons[i], function (el) {
				el.addClass('hidden');
			});
		});

		return this;
	},

	showButtons: function showButtons(name) {
		var buttons = this.__parseButtonNameParam(name),
		    that = this;

		$.each(buttons, function (i, v) {
			that.__alterButtons(buttons[i], function (el) {
				el.removeClass('hidden');
			});
		});

		return this;
	},

	eventSupported: function eventSupported(eventName) {
		var isSupported = eventName in this.$element;
		if (!isSupported) {
			this.$element.setAttribute(eventName, 'return;');
			isSupported = typeof this.$element[eventName] === 'function';
		}
		return isSupported;
	},

	keyup: function keyup(e) {
		var blocked = false;
		switch (e.keyCode) {
			case 40: // down arrow
			case 38: // up arrow
			case 16: // shift
			case 17: // ctrl
			case 18:
				// alt
				break;

			case 9:
				// tab
				var nextTab;
				if (nextTab = this.getNextTab(), nextTab != null) {
					// Get the nextTab if exists
					var that = this;
					setTimeout(function () {
						that.setSelection(nextTab.start, nextTab.end);
					}, 500);

					blocked = true;
				} else {
					// The next tab memory contains nothing...
					// check the cursor position to determine tab action
					var cursor = this.getSelection();

					if (cursor.start == cursor.end && cursor.end == this.getContent().length) {
						// The cursor already reach the end of the content
						blocked = false;
					} else {
						// Put the cursor to the end
						this.setSelection(this.getContent().length, this.getContent().length);

						blocked = true;
					}
				}

				break;

			case 13:
				// enter
				blocked = false;
				break;
			case 27:
				// escape
				if (this.$isFullscreen) this.setFullscreen(false);
				blocked = false;
				break;

			default:
				blocked = false;
		}

		if (blocked) {
			e.stopPropagation();
			e.preventDefault();
		}

		this.$options.onChange(this);
	},

	change: function change(e) {
		this.$options.onChange(this);
		return this;
	},

	focus: function focus(e) {
		var options = this.$options,
		    isHideable = options.hideable,
		    editor = this.$editor;

		editor.addClass('active');

		// Blur other markdown(s)
		$(document).find('.md-editor').each(function () {
			if ($(this).attr('id') != editor.attr('id')) {
				var attachedMarkdown;

				if (attachedMarkdown = $(this).find('textarea').data('markdown'), attachedMarkdown == null) {
					attachedMarkdown = $(this).find('div[data-provider="markdown-preview"]').data('markdown');
				}

				if (attachedMarkdown) {
					attachedMarkdown.blur();
				}
			}
		});

		// Trigger the onFocus hook
		options.onFocus(this);

		return this;
	},

	blur: function blur(e) {
		var options = this.$options,
		    isHideable = options.hideable,
		    editor = this.$editor,
		    editable = this.$editable;

		if (editor.hasClass('active') || this.$element.parent().length == 0) {
			editor.removeClass('active');

			if (isHideable) {

				// Check for editable elements
				if (editable.el != null) {
					// Build the original element
					var oldElement = $('<' + editable.type + '/>'),
					    content = this.getContent(),
					    currentContent = (typeof markdown === 'undefined' ? 'undefined' : _typeof(markdown)) == 'object' ? markdown.toHTML(content) : content;

					$(editable.attrKeys).each(function (k, v) {
						oldElement.attr(editable.attrKeys[k], editable.attrValues[k]);
					});

					// Get the editor content
					oldElement.html(currentContent);

					editor.replaceWith(oldElement);
				} else {
					editor.hide();
				}
			}

			// Trigger the onBlur hook
			options.onBlur(this);
		}

		return this;
	}

};

/* MARKDOWN PLUGIN DEFINITION
* ========================== */

var old = $.fn.markdown;

$.fn.markdown = function (option) {
	return this.each(function () {
		var $this = $(this),
		    data = $this.data('markdown'),
		    options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
		if (!data) $this.data('markdown', data = new Markdown(this, options));
	});
};

$.fn.markdown.messages = {};

$.fn.markdown.defaults = {
	/* Editor Properties */
	autofocus: false,
	hideable: false,
	savable: false,
	width: 'inherit',
	height: 'inherit',
	resize: 'none',
	iconlibrary: 'glyph',
	language: 'en',
	initialstate: 'editor',

	/* Buttons Properties */
	buttons: [[{
		name: 'groupFont',
		data: [{
			name: 'cmdBold',
			hotkey: 'Ctrl+B',
			title: 'Bold',
			icon: { glyph: 'glyphicon glyphicon-bold', fa: 'fa fa-bold', 'fa-3': 'icon-bold' },
			callback: function callback(e) {
				// Give/remove ** surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('strong text');
				} else {
					chunk = selected.text;
				}

				// transform selection and set the cursor into chunked text
				if (content.substr(selected.start - 2, 2) == '**' && content.substr(selected.end, 2) == '**') {
					e.setSelection(selected.start - 2, selected.end + 2);
					e.replaceSelection(chunk);
					cursor = selected.start - 2;
				} else {
					e.replaceSelection('**' + chunk + '**');
					cursor = selected.start + 2;
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}, {
			name: 'cmdItalic',
			title: 'Italic',
			hotkey: 'Ctrl+I',
			icon: { glyph: 'glyphicon glyphicon-italic', fa: 'fa fa-italic', 'fa-3': 'icon-italic' },
			callback: function callback(e) {
				// Give/remove * surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('emphasized text');
				} else {
					chunk = selected.text;
				}

				// transform selection and set the cursor into chunked text
				if (content.substr(selected.start - 1, 1) == '_' && content.substr(selected.end, 1) == '_') {
					e.setSelection(selected.start - 1, selected.end + 1);
					e.replaceSelection(chunk);
					cursor = selected.start - 1;
				} else {
					e.replaceSelection('_' + chunk + '_');
					cursor = selected.start + 1;
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}, {
			name: 'cmdHeading',
			title: 'Heading',
			hotkey: 'Ctrl+H',
			icon: { glyph: 'glyphicon glyphicon-header', fa: 'fa fa-font', 'fa-3': 'icon-font' },
			callback: function callback(e) {
				// Append/remove ### surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent(),
				    pointer,
				    prevChar;

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('heading text');
				} else {
					chunk = selected.text + '\n';
				}

				// transform selection and set the cursor into chunked text
				if ((pointer = 4, content.substr(selected.start - pointer, pointer) == '### ') || (pointer = 3, content.substr(selected.start - pointer, pointer) == '###')) {
					e.setSelection(selected.start - pointer, selected.end);
					e.replaceSelection(chunk);
					cursor = selected.start - pointer;
				} else if (selected.start > 0 && (prevChar = content.substr(selected.start - 1, 1), !!prevChar && prevChar != '\n')) {
					e.replaceSelection('\n\n### ' + chunk);
					cursor = selected.start + 6;
				} else {
					// Empty string before element
					e.replaceSelection('### ' + chunk);
					cursor = selected.start + 4;
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}]
	}, {
		name: 'groupLink',
		data: [{
			name: 'cmdUrl',
			title: 'URL/Link',
			hotkey: 'Ctrl+L',
			icon: { glyph: 'glyphicon glyphicon-link', fa: 'fa fa-link', 'fa-3': 'icon-link' },
			callback: function callback(e) {
				// Give [] surround the selection and prepend the link
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent(),
				    link;

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('enter link description here');
				} else {
					chunk = selected.text;
				}

				link = prompt(e.__localize('Insert Hyperlink'), 'http://');

				if (link != null && link != '' && link != 'http://' && link.substr(0, 4) == 'http') {
					var sanitizedLink = $('<div>' + link + '</div>').text();

					// transform selection and set the cursor into chunked text
					e.replaceSelection('[' + chunk + '](' + sanitizedLink + ')');
					cursor = selected.start + 1;

					// Set the cursor
					e.setSelection(cursor, cursor + chunk.length);
				}
			}
		}, {
			name: 'cmdImage',
			title: 'Image',
			hotkey: 'Ctrl+G',
			icon: { glyph: 'glyphicon glyphicon-picture', fa: 'fa fa-picture-o', 'fa-3': 'icon-picture' },
			callback: function callback(e) {
				// Give ![] surround the selection and prepend the image link
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent(),
				    link;

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('enter image description here');
				} else {
					chunk = selected.text;
				}

				link = prompt(e.__localize('Insert Image Hyperlink'), 'http://');

				if (link != null && link != '' && link != 'http://' && link.substr(0, 4) == 'http') {
					var sanitizedLink = $('<div>' + link + '</div>').text();

					// transform selection and set the cursor into chunked text
					e.replaceSelection('![' + chunk + '](' + sanitizedLink + ' "' + e.__localize('enter image title here') + '")');
					cursor = selected.start + 2;

					// Set the next tab
					e.setNextTab(e.__localize('enter image title here'));

					// Set the cursor
					e.setSelection(cursor, cursor + chunk.length);
				}
			}
		}]
	}, {
		name: 'groupMisc',
		data: [{
			name: 'cmdList',
			hotkey: 'Ctrl+U',
			title: 'Unordered List',
			icon: { glyph: 'glyphicon glyphicon-list', fa: 'fa fa-list', 'fa-3': 'icon-list-ul' },
			callback: function callback(e) {
				// Prepend/Give - surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				// transform selection and set the cursor into chunked text
				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('list text here');

					e.replaceSelection('- ' + chunk);
					// Set the cursor
					cursor = selected.start + 2;
				} else {
					if (selected.text.indexOf('\n') < 0) {
						chunk = selected.text;

						e.replaceSelection('- ' + chunk);

						// Set the cursor
						cursor = selected.start + 2;
					} else {
						var list = [];

						list = selected.text.split('\n');
						chunk = list[0];

						$.each(list, function (k, v) {
							list[k] = '- ' + v;
						});

						e.replaceSelection('\n\n' + list.join('\n'));

						// Set the cursor
						cursor = selected.start + 4;
					}
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}, {
			name: 'cmdListO',
			hotkey: 'Ctrl+O',
			title: 'Ordered List',
			icon: { glyph: 'glyphicon glyphicon-th-list', fa: 'fa fa-list-ol', 'fa-3': 'icon-list-ol' },
			callback: function callback(e) {

				// Prepend/Give - surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				// transform selection and set the cursor into chunked text
				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('list text here');
					e.replaceSelection('1. ' + chunk);
					// Set the cursor
					cursor = selected.start + 3;
				} else {
					if (selected.text.indexOf('\n') < 0) {
						chunk = selected.text;

						e.replaceSelection('1. ' + chunk);

						// Set the cursor
						cursor = selected.start + 3;
					} else {
						var list = [];

						list = selected.text.split('\n');
						chunk = list[0];

						$.each(list, function (k, v) {
							list[k] = '1. ' + v;
						});

						e.replaceSelection('\n\n' + list.join('\n'));

						// Set the cursor
						cursor = selected.start + 5;
					}
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}, {
			name: 'cmdCode',
			hotkey: 'Ctrl+K',
			title: 'Code',
			icon: { glyph: 'glyphicon glyphicon-asterisk', fa: 'fa fa-code', 'fa-3': 'icon-code' },
			callback: function callback(e) {

				// Give/remove ** surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('code text here');
				} else {
					chunk = selected.text;
				}

				// transform selection and set the cursor into chunked text
				if (content.substr(selected.start - 1, 1) == '`' && content.substr(selected.end, 1) == '`') {
					e.setSelection(selected.start - 1, selected.end + 1);
					e.replaceSelection(chunk);
					cursor = selected.start - 1;
				} else {
					e.replaceSelection('`' + chunk + '`');
					cursor = selected.start + 1;
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}, {
			name: 'cmdQuote',
			hotkey: 'Ctrl+Q',
			title: 'Quote',
			icon: { glyph: 'glyphicon glyphicon-comment', fa: 'fa fa-quote-left', 'fa-3': 'icon-quote-left' },
			callback: function callback(e) {
				// Prepend/Give - surround the selection
				var chunk,
				    cursor,
				    selected = e.getSelection(),
				    content = e.getContent();

				// transform selection and set the cursor into chunked text
				if (selected.length == 0) {
					// Give extra word
					chunk = e.__localize('quote here');
					e.replaceSelection('> ' + chunk);
					// Set the cursor
					cursor = selected.start + 2;
				} else {
					if (selected.text.indexOf('\n') < 0) {
						chunk = selected.text;

						e.replaceSelection('> ' + chunk);

						// Set the cursor
						cursor = selected.start + 2;
					} else {
						var list = [];

						list = selected.text.split('\n');
						chunk = list[0];

						$.each(list, function (k, v) {
							list[k] = '> ' + v;
						});

						e.replaceSelection('\n\n' + list.join('\n'));

						// Set the cursor
						cursor = selected.start + 4;
					}
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}]
	}, {
		name: 'groupUtil',
		data: [{
			name: 'cmdPreview',
			toggle: true,
			hotkey: 'Ctrl+P',
			title: 'Preview',
			btnText: 'Preview',
			btnClass: 'btn btn-sm',
			icon: { glyph: 'glyphicon glyphicon-search', fa: 'fa fa-search', 'fa-3': 'icon-search' },
			callback: function callback(e) {
				// Check the preview mode and toggle based on this flag
				var isPreview = e.$isPreview,
				    content;

				if (isPreview == false) {
					// Give flag that tell the editor enter preview mode
					e.showPreview();
				} else {
					e.hidePreview();
				}
			}
		}]
	}]],
	additionalButtons: [], // Place to hook more buttons by code
	reorderButtonGroups: [],
	hiddenButtons: [], // Default hidden buttons
	disabledButtons: [], // Default disabled buttons
	footer: '',
	fullscreen: {
		enable: true,
		icons: {
			fullscreenOn: {
				fa: 'fa fa-expand',
				glyph: 'glyphicon glyphicon-fullscreen',
				'fa-3': 'icon-resize-full'
			},
			fullscreenOff: {
				fa: 'fa fa-compress',
				glyph: 'glyphicon glyphicon-fullscreen',
				'fa-3': 'icon-resize-small'
			}
		}
	},

	/* Events hook */
	onShow: function onShow(e) {},
	onPreview: function onPreview(e) {},
	onSave: function onSave(e) {},
	onBlur: function onBlur(e) {},
	onFocus: function onFocus(e) {},
	onChange: function onChange(e) {},
	onFullscreen: function onFullscreen(e) {}
};

$.fn.markdown.Constructor = Markdown;

/* MARKDOWN NO CONFLICT
* ==================== */

$.fn.markdown.noConflict = function () {
	$.fn.markdown = old;
	return this;
};

/* MARKDOWN GLOBAL FUNCTION & DATA-API
* ==================================== */
var initMarkdown = function initMarkdown(el) {
	var $this = el;

	if ($this.data('markdown')) {
		$this.data('markdown').showEditor();
		return;
	}

	$this.markdown();
};

var analyzeMarkdown = function analyzeMarkdown(e) {
	var blurred = false,
	    el,
	    $docEditor = $(e.currentTarget);

	// Check whether it was editor childs or not
	if ((e.type == 'focusin' || e.type == 'click') && $docEditor.length == 1 && _typeof($docEditor[0]) == 'object') {
		el = $docEditor[0].activeElement;
		if (!$(el).data('markdown')) {
			if (typeof $(el).parent().parent().parent().attr('class') == "undefined" || $(el).parent().parent().parent().attr('class').indexOf('md-editor') < 0) {
				if (typeof $(el).parent().parent().attr('class') == "undefined" || $(el).parent().parent().attr('class').indexOf('md-editor') < 0) {

					blurred = true;
				}
			} else {
				blurred = false;
			}
		}

		if (blurred) {
			// Blur event
			$(document).find('.md-editor').each(function () {
				var parentMd = $(el).parent();

				if ($(this).attr('id') != parentMd.attr('id')) {
					var attachedMarkdown;

					if (attachedMarkdown = $(this).find('textarea').data('markdown'), attachedMarkdown == null) {
						attachedMarkdown = $(this).find('div[data-provider="markdown-preview"]').data('markdown');
					}

					if (attachedMarkdown) {
						attachedMarkdown.blur();
					}
				}
			});
		}

		e.stopPropagation();
	}
};

$(document).on('click.markdown.data-api', '[data-provide="markdown-editable"]', function (e) {
	initMarkdown($(this));
	e.preventDefault();
}).on('click', function (e) {
	analyzeMarkdown(e);
}).on('focusin', function (e) {
	analyzeMarkdown(e);
}).ready(function () {
	$('textarea[data-provide="markdown"]').each(function () {
		initMarkdown($(this));
	});
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"marked":undefined}],25:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'MoneyField',

	valueChanged: function valueChanged(event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderField: function renderField() {
		return React.createElement('input', { type: 'text', name: this.props.path, ref: 'focusTarget', value: this.props.value, onChange: this.valueChanged, autoComplete: 'off', className: 'form-control' });
	}

});

},{"../Field":5,"react":undefined}],26:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'NameField',

	focusTargetRef: 'first',

	valueChanged: function valueChanged(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},

	renderValue: function renderValue() {
		var values = {};
		if (this.props.value.first) {
			values.first = React.createElement('div', { className: 'field-value' }, this.props.value.first);
		}
		if (this.props.value.last) {
			values.last = React.createElement('div', { className: 'field-value' }, this.props.value.last);
		}
		if (!values.first && !values.last) {
			values.none = React.createElement('div', { className: 'field-value' });
		}
		return values;
	},

	renderField: function renderField() {
		return React.createElement('div', { className: 'form-row' }, React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'text', name: this.props.paths.first, placeholder: 'First name', ref: 'first', value: this.props.value.first, onChange: this.valueChanged.bind(this, 'first'), autoComplete: 'off', className: 'form-control' })), React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'text', name: this.props.paths.last, placeholder: 'Last name', ref: 'last', value: this.props.value.last, onChange: this.valueChanged.bind(this, 'last'), autoComplete: 'off', className: 'form-control' })));
	}

});

},{"../Field":5,"react":undefined}],27:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'NumberField',

	valueChanged: function valueChanged(event) {
		var newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue
			});
		}
	},

	renderField: function renderField() {
		return React.createElement('input', { type: 'text', name: this.props.path, ref: 'focusTarget', value: this.props.value, onChange: this.valueChanged, autoComplete: 'off', className: 'form-control' });
	}

});

},{"../Field":5,"react":undefined}],28:[function(require,module,exports){
'use strict';

var Field = require('../Field'),
    ArrayFieldMixin = require('../../mixins/ArrayField');

module.exports = Field.create({

	displayName: 'NumberArrayField',

	mixins: [ArrayFieldMixin],

	cleanInput: function cleanInput(input) {
		return input.replace(/[^\d]/g, '');
	}

});

},{"../../mixins/ArrayField":3,"../Field":5}],29:[function(require,module,exports){
(function (global){
'use strict';

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'PasswordField',

	focusTarget: 'password',

	getInitialState: function getInitialState() {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: ''
		};
	},

	componentDidUpdate: function componentDidUpdate() {
		if (this._focusAfterUpdate) {
			this._focusAfterUpdate = false;
			this.focus();
		}
	},

	valueChanged: function valueChanged(which, event) {
		this.setState(_.object([which], [event.target.value]));
		if (which === 'password') {
			this.props.onChange({
				path: this.props.path,
				value: event.target.value
			});
		}
	},

	showChangeUI: function showChangeUI() {
		this._focusAfterUpdate = true;
		this.setState({
			showChangeUI: true
		});
	},

	renderValue: function renderValue() {
		return React.createElement('div', { className: 'field-value' }, this.props.value ? 'password set' : 'password not set');
	},

	renderField: function renderField() {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},

	renderFields: function renderFields() {
		return React.createElement('div', { className: 'form-row' }, React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'password', name: this.props.path, placeholder: 'New password', ref: 'password', value: this.state.password, onChange: this.valueChanged.bind(this, 'password'), autoComplete: 'off', className: 'form-control' })), React.createElement('div', { className: 'col-sm-6' }, React.createElement('input', { type: 'password', name: this.props.paths.confirm, placeholder: 'Confirm new password', ref: 'confirm', value: this.state.confirm, onChange: this.valueChanged.bind(this, 'confirm'), autoComplete: 'off', className: 'form-control' })));
	},

	renderChangeButton: function renderChangeButton() {
		var label = this.state.passwordIsSet ? 'Change Password' : 'Set Password';
		return React.createElement('button', { type: 'button', className: 'btn btn-default', onClick: this.showChangeUI }, label);
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined}],30:[function(require,module,exports){
(function (global){
'use strict';

var Select = require('react-select'),
    React = require('react'),
    Field = require('../Field'),
    superagent = require('superagent'),
    _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = Field.create({

	displayName: 'RelationshipField',

	shouldCollapse: function shouldCollapse() {
		// many:true relationships have an Array for a value
		// so need to check length instead
		if (this.props.many) {
			return this.props.collapse && !this.props.value.length;
		}

		return this.props.collapse && !this.props.value;
	},

	getInitialState: function getInitialState() {
		return {
			ready: this.props.value ? false : true,
			simpleValue: this.props.value,
			expandedValues: null
		};
	},

	componentDidMount: function componentDidMount() {
		this.loadValues(this.props.value);
	},

	componentWillReceiveProps: function componentWillReceiveProps(newProps) {
		if (newProps.value !== this.state.simpleValue) {
			this.setState({
				ready: false,
				simpleValue: newProps.value,
				expandedValues: null
			});
			this.loadValues(newProps.value);
		}
	},

	loadValues: function loadValues(input) {
		var expandedValues = [];
		var inputs = _.compact([].concat(input));
		var self = this;

		var finish = function finish() {
			self.setState({
				ready: true,
				expandedValues: expandedValues
			});
		};

		if (!inputs.length) return finish();

		var callbackCount = 0;
		_.each(inputs, function (input) {
			expandedValues.push({
				value: input
			});
			superagent.get('/keystone/api/' + self.props.refList.path + '/' + input + '?simple').set('Accept', 'application/json').end(function (err, res) {
				if (err) {
					if (err.status === 404) {
						_.findWhere(expandedValues, { value: input }).label = input;
					} else {
						throw err;
					}
				} else {
					var value = res.body;
					_.findWhere(expandedValues, { value: value.id }).label = value.name;
				}

				callbackCount++;
				if (callbackCount === inputs.length) {
					finish();
				}
			});
		});
	},

	buildFilters: function buildFilters() {
		var filters = {};

		_.each(this.props.filters, function (value, key) {
			if (_.isString(value) && value[0] == ':') {
				//eslint-disable-line eqeqeq
				var fieldName = value.slice(1);

				var val = this.props.values[fieldName];
				if (val) {
					filters[key] = val;
					return;
				}

				// check if filtering by id and item was already saved
				if (fieldName === ':_id' && Keystone.item) {
					filters[key] = Keystone.item.id;
					return;
				}
			} else {
				filters[key] = value;
			}
		}, this);

		var parts = [];

		_.each(filters, function (val, key) {
			parts.push('filters[' + key + ']=' + encodeURIComponent(val));
		});

		return parts.join('&');
	},

	buildOptionQuery: function buildOptionQuery(input) {
		var value = input && input[0] && input[0].value || '';
		var filters = this.buildFilters();
		return 'context=relationship&q=' + value + '&list=' + Keystone.list.path + '&field=' + this.props.path + (filters ? '&' + filters : '');
	},

	getOptions: function getOptions(input, callback) {
		superagent.get('/keystone/api/' + this.props.refList.path + '/autocomplete?' + this.buildOptionQuery(input)).set('Accept', 'application/json').end(function (err, res) {
			if (err) throw err;

			var data = res.body;

			callback(null, {
				options: data.items.map(function (item) {
					return {
						value: item.id,
						label: item.name
					};
				}),
				complete: data.total === data.items.length
			});
		});
	},

	renderLoadingUI: function renderLoadingUI() {
		return React.createElement('div', { className: 'help-block' }, 'loading...');
	},

	updateValue: function updateValue(simpleValue, expandedValues) {
		this.setState({
			simpleValue: simpleValue,
			expandedValues: expandedValues
		});
		this.props.onChange({
			path: this.props.path,
			value: this.props.many ? _.pluck(expandedValues, 'value') : simpleValue
		});
	},

	renderValue: function renderValue() {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		// Todo: this is only a temporary fix, remodel
		if (this.state.expandedValues && this.state.expandedValues.length) {
			var body = [];

			_.each(this.state.expandedValues, function (item) {
				body.push(React.createElement('a', { href: '/keystone/' + this.props.refList.path + '/' + item.value, className: 'related-item-link' }, item.label));
			}, this);

			return body;
		} else {
			return React.createElement('div', { className: 'field-value' }, '(not set)');
		}
	},

	renderField: function renderField() {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		var body = [];

		if (!this.props.many && this.props.value) {
			body.push(React.createElement('a', { href: '/keystone/' + this.props.refList.path + '/' + this.props.value, className: 'btn btn-link btn-goto-linked-item' }, 'view ', this.props.refList.singular.toLowerCase()));
		}

		body.push(React.createElement(Select, { multi: this.props.many, onChange: this.updateValue, name: this.props.path, asyncOptions: this.getOptions, value: this.state.expandedValues }));

		return body;
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined,"react-select":undefined,"superagent":undefined}],31:[function(require,module,exports){
'use strict';

module.exports = require('../localfile/LocalFileField');

},{"../localfile/LocalFileField":20}],32:[function(require,module,exports){
(function (global){
'use strict';

/**
 * TODO:
 * - Custom path support
 */

var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null),
    React = require('react'),
    Select = require('react-select'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'SelectField',

	valueChanged: function valueChanged(newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && 'string' === typeof newValue) {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},

	renderValue: function renderValue() {
		var selected = _.findWhere(this.props.ops, { value: this.props.value });
		return React.createElement('div', { className: 'field-value' }, selected ? selected.label : null);
	},

	renderField: function renderField() {
		// TODO: This should be natively handled by the Select component
		var ops = this.props.numeric ? this.props.ops.map(function (i) {
			return { label: i.label, value: String(i.value) };
		}) : this.props.ops;
		var value = 'number' === typeof this.props.value ? String(this.props.value) : this.props.value;
		return React.createElement(Select, { name: this.props.path, value: value, options: ops, onChange: this.valueChanged });
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Field":5,"react":undefined,"react-select":undefined}],33:[function(require,module,exports){
'use strict';

var Field = require('../Field');

module.exports = Field.create({
	displayName: 'TextField'
});

},{"../Field":5}],34:[function(require,module,exports){
'use strict';

var React = require('react'),
    Field = require('../Field');

module.exports = Field.create({

	displayName: 'TextareaField',

	renderField: function renderField() {
		var styles = {
			height: this.props.height
		};
		return React.createElement('textarea', { name: this.props.path, styles: styles, ref: 'focusTarget', value: this.props.value, onChange: this.valueChanged, autoComplete: 'off', className: 'form-control' });
	}

});

},{"../Field":5,"react":undefined}],35:[function(require,module,exports){
'use strict';

var Field = require('../Field'),
    ArrayFieldMixin = require('../../mixins/ArrayField');

module.exports = Field.create({

	displayName: 'TextArrayField',

	mixins: [ArrayFieldMixin]

});

},{"../../mixins/ArrayField":3,"../Field":5}],36:[function(require,module,exports){
'use strict';

var Field = require('../Field');

module.exports = Field.create({
	displayName: 'UrlField'
});

},{"../Field":5}],37:[function(require,module,exports){
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

},{}],"FieldTypes":[function(require,module,exports){
'use strict';

module.exports = {
	azurefile: require('../../fields/types/azurefile/AzureFileField'),
	boolean: require('../../fields/types/boolean/BooleanField'),
	cloudinaryimage: require('../../fields/types/cloudinaryimage/CloudinaryImageField'),
	cloudinaryimages: require('../../fields/types/cloudinaryimages/CloudinaryImagesField'),
	code: require('../../fields/types/code/CodeField'),
	color: require('../../fields/types/color/ColorField'),
	date: require('../../fields/types/date/DateField'),
	datearray: require('../../fields/types/datearray/DateArrayField'),
	datetime: require('../../fields/types/datetime/DatetimeField'),
	email: require('../../fields/types/email/EmailField'),
	embedly: require('../../fields/types/embedly/EmbedlyField'),
	geopoint: require('../../fields/types/geopoint/GeoPointField'),
	html: require('../../fields/types/html/HtmlField'),
	key: require('../../fields/types/key/KeyField'),
	localfile: require('../../fields/types/localfile/LocalFileField'),
	localfiles: require('../../fields/types/localfiles/LocalFilesField'),
	location: require('../../fields/types/location/LocationField'),
	markdown: require('../../fields/types/markdown/MarkdownField'),
	money: require('../../fields/types/money/MoneyField'),
	name: require('../../fields/types/name/NameField'),
	number: require('../../fields/types/number/NumberField'),
	numberarray: require('../../fields/types/numberarray/NumberArrayField'),
	password: require('../../fields/types/password/PasswordField'),
	relationship: require('../../fields/types/relationship/RelationshipField'),
	s3file: require('../../fields/types/s3file/S3FileField'),
	select: require('../../fields/types/select/SelectField'),
	text: require('../../fields/types/text/TextField'),
	textarea: require('../../fields/types/textarea/TextareaField'),
	textarray: require('../../fields/types/textarray/TextArrayField'),
	url: require('../../fields/types/url/UrlField')
};

},{"../../fields/types/azurefile/AzureFileField":6,"../../fields/types/boolean/BooleanField":7,"../../fields/types/cloudinaryimage/CloudinaryImageField":8,"../../fields/types/cloudinaryimages/CloudinaryImagesField":9,"../../fields/types/code/CodeField":10,"../../fields/types/color/ColorField":11,"../../fields/types/date/DateField":12,"../../fields/types/datearray/DateArrayField":13,"../../fields/types/datetime/DatetimeField":14,"../../fields/types/email/EmailField":15,"../../fields/types/embedly/EmbedlyField":16,"../../fields/types/geopoint/GeoPointField":17,"../../fields/types/html/HtmlField":18,"../../fields/types/key/KeyField":19,"../../fields/types/localfile/LocalFileField":20,"../../fields/types/localfiles/LocalFilesField":21,"../../fields/types/location/LocationField":22,"../../fields/types/markdown/MarkdownField":23,"../../fields/types/money/MoneyField":25,"../../fields/types/name/NameField":26,"../../fields/types/number/NumberField":27,"../../fields/types/numberarray/NumberArrayField":28,"../../fields/types/password/PasswordField":29,"../../fields/types/relationship/RelationshipField":30,"../../fields/types/s3file/S3FileField":31,"../../fields/types/select/SelectField":32,"../../fields/types/text/TextField":33,"../../fields/types/textarea/TextareaField":34,"../../fields/types/textarray/TextArrayField":35,"../../fields/types/url/UrlField":36}]},{},[]);
