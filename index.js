var matIdentity = require( 'gl-mat4/identity' ),
	matRotateX = require( 'gl-mat4/rotateX' ),
	matRotateY = require( 'gl-mat4/rotateY' ),
	matRotateZ = require( 'gl-mat4/rotateZ' ),
	matScale = require( 'gl-mat4/scale' ),
	matTranslate = require( 'gl-mat4/translate' ),
	matPerspect = require( 'gl-mat4/perspective' ),
	DEG_TO_RAD =  Math.PI / 180;

var absdom = function( settings ) {

	if( !( this instanceof absdom ) )
		return new absdom( settings );

	settings = settings || {};

	this.transform = [];
	this.element = settings.element || document.createElement( 'div' );
	this.useWidthHeight = settings.useWidthHeight || false;
	this.oWidth = this._width = settings.width || 100;
	this.oHeight = this._height = settings.height || 100;
	this.oDepth = this._depth = settings.depth || 100;
	this.perspective = settings.perspective || 1000;
	this.perspectiveOriginX = settings.perspectiveOriginX || 50;
	this.perspectiveOriginY = settings.perspectiveOriginY || 50;

	this.doCSS();
};

absdom.prototype = {

	_scaleX: 1,
	_scaleY: 1,
	_scaleZ: 1,

	doCSS: function() {

		var style = this.element.style;

		style.transformOrigin = '0px 0px';

		matIdentity( this.transform );
		matTranslate( this.transform, this.transform, [ this._x, this._y, this._z ] );
		matRotateX( this.transform, this.transform, this.rotateX * DEG_TO_RAD );
		matRotateY( this.transform, this.transform, this.rotateY * DEG_TO_RAD );
		matRotateZ( this.transform, this.transform, this.rotateZ * DEG_TO_RAD );

		if( this.useWidthHeight ) {

			style.width = this._width + 'px';
			style.height = this._height + 'px';
		} else {

			matScale( this.transform, this.transform, [ this._scaleX, this._scaleY, this._scaleZ ] );
		}

		matTranslate( this.transform, this.transform, [ - this._aX, - this._aY, - this._aZ ] );

		style.transform = 'matrix3d( ' + this.transform.join( ',' ) + ' )';
		style.opacity = this._alpha;
	}
};

p( 'x', 0 );
p( 'y', 0 );
p( 'z', 0 );
p( 'aX', 0 );
p( 'aY', 0 );
p( 'aZ', 0 );
p( 'rotateX', 0 );
p( 'rotateY', 0 );
p( 'rotateZ', 0 );
p( 'alpha', 1 );
p( 'perspective', 200 );

dp( 'width', 
	getter( 'width' ),
	function( value ) {

		this._width = value;
		this._scaleX = value / this.oWidth;

		this.doCSS();
	});

dp( 'height', 
	getter( 'height' ),
	function( value ) {

		this._height = value;
		this._scaleY = value / this.oHeight;

		this.doCSS();
	});

dp( 'depth', 
	getter( 'depth' ),
	function( value ) {

		this._depth = value;
		this._scaleZ = value / this.oDepth;

		this.doCSS();
	});



dp( 'scaleX', 
	getter( 'scaleX' ),
	function( value ) {

		this._scaleX = value;
		this._width = value * this.oWidth;

		this.doCSS();
	});

dp( 'scaleY', 
	getter( 'scaleY' ),
	function( value ) {

		this._scaleY = value;
		this._height = value * this.oHeight;
		
		this.doCSS();
	});

dp( 'scaleZ', 
	getter( 'scaleZ' ),
	function( value ) {

		this._scaleZ = value;
		this._depth = value * this.oDepth;

		this.doCSS();
	});






function p( name, val ) {

	absdom.prototype[ '_' + name ] = val;

	dp( name, getter( name ), setter( name ) );
}

function getter( name ) {

	var pVar = '_' + name;

	return function() {

		return this[ pVar ];
	}
}

function setter( name ) {

	var pVar = '_' + name;

	return function( value ) {

		this[ pVar ] = value;

		this.doCSS();
	}
}

function dpERR() {

	for( var i = 0, len = arguments.length; i < len; i++ ) {

		var name = arguments[ i ],
			err = new Error( 'The property ' + name + ' is not supported' ),
			errFunc = function() {

				throw new Error( 'This property is not supported: ' + name );
			};

		dp( name, errFunc, errFunc );
	}
}

function dp( name, get, set ) {

	var upperName = name.substr( 0, 1 ).toUpperCase() + name.substr( 1 ),
		getName = 'get' + upperName,
		setName = 'set' + upperName,
		p = absdom.prototype;

	p[ getName ] = get;
	p[ setName ] = set;
	Object.defineProperty( p, name, {
		get: get, 
		set: set 
	});
}

function get3DCSS( name, x, y, z, append ) {

	append = append || '';

	return name + '(' +
					  x + append + ',' +
					  y + append + ',' +
					  z + append +
				  ') '
}

module.exports = absdom;