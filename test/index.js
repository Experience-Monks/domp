var absdom = require( '../index' ),
	item = null;

document.body.style.margin = '0 0';
document.body.style.padding = '0 0';


var container = document.body,
	items = [], 
	item;

container.style.perspective = '500px';
container.style.perspectiveOrigin = '200px 200px';

for( var i = 0, len = 100; i < len; i++ ) {

	item = document.createElement( 'div' );
	item.style.background = '#00CAFE';
	item.style.position = 'absolute';

	container.appendChild( item );
	items[ i ] = absdom( { useWidthHeight: true, element: item } );
	items[ i ].x = Math.random() * 500;
	items[ i ].y = Math.random() * 500;
	items[ i ].alpha = 0.5;
}




function enter() {

	for( var i = 0, len = items.length; i < len; i++ ) {

		item = items[ i ];
		item.rotateX += 1;
		item.z -= 10;
	}

	requestAnimationFrame( enter );
}

enter();