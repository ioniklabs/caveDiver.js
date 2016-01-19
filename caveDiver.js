/*
|
|	caveDiver.js - diving deep into a JavaScript object array
|	the caveDiver continus in search of lost and forgotten
|	predicates... Okay that's enough of that. caveDiver.js
|	makes it easy to compare two JavaScript object arrays and
|	return information about changes.
|
|	credit: 	IonikLabs (http://www.ioniklabs.com)
|	author: 	Matt Johnson
|	source: 	https://github.com/ioniklabs/caveDiver.js 
|
| */

var caveDiver = ( function( document, window ) {

	function caveDiver( options ) {
		var this_ = this;
		this.options = {
			return_id_array: false,
			return_object_array: true,
			return_clean_object_array: false,
			callback: {
				id_lhs: function( lhs ) {
					return lhs.id;
				},
				id_rhs: function( rhs ) {
					return rhs.id;
				},
				return_lhs: function( lhs ) {
					return lhs;
				},
				return_rhs: function( rhs ) {
					return rhs;
				},
				match: function( lhs, rhs ) {
					return this_.options.callback.id_lhs( lhs ) === this_.options.callback.id_rhs( rhs );
				},
				compare: function( lhs, rhs ) {
					return lhs.modified === rhs.modified;
				}
			}
		};
		if ( is__object( options ) ) this.options = extend( this.options, options );
	};

	caveDiver.prototype.update__options = function( options ) {
		if ( !is__object( options ) ) return on__error( 103 );
		this.options = extend( this.options, options );
	};

	caveDiver.prototype.compare = function( lhs, rhs ) {
		if ( !is__array( lhs ) ) on__error( 101 );
		if ( !is__array( rhs ) ) on__error( 102 );
		var lhs_id = [],
			rhs_id = [];

		var response = {};

		if ( this.options.return_id_array ) {
			extend( response, {
				add__id_array: [],
				remove__id_array: [],
				modify__id_array: []
			} );
		}

		if ( this.options.return_object_array ) {
			extend( response, {
				add__obj_array: [],
				remove__obj_array: [],
				modify__obj_array: []
			} );
		}

		lhs_id = get__flat_id_array( lhs, this.options.callback.id_lhs );
		rhs_id = get__flat_id_array( rhs, this.options.callback.id_rhs );

		var index = 0;
			length = lhs_id.length,
			match = false;

		for( index; index < length; index++ ) {
			if ( rhs_id.indexOf( lhs_id[index] ) === -1 ) {
				if ( this.options.return_id_array ) response.remove__id_array.push( lhs_id[index] );
				if ( this.options.return_object_array ) response.remove__obj_array.push( this.options.return_clean_object_array ? this.options.callback.return_lhs( lhs[index] ) : lhs[index] );
			} else {
				match = find__match( lhs[index], rhs, this.options.callback.match );
				if ( is__object( match ) ) {
					if ( !this.options.callback.compare( lhs[index], match ) ) {
						if ( this.options.return_id_array ) response.modify__id_array.push( rhs_id[index] );
						if ( this.options.return_object_array ) {
							response.modify__obj_array.push( {
								lhs: this.options.return_clean_object_array ? this.options.callback.return_lhs( lhs[index] ) : lhs[index],
								rhs: this.options.return_clean_object_array ? this.options.callback.return_rhs( rhs[index] ) : rhs[index]
							} );
						}
					}
				}
			}
		}

		var index = 0;
			length = rhs_id.length;

		for( index; index < length; index++ ) {
			if ( lhs_id.indexOf( rhs_id[index] ) === -1 ) {
				if ( this.options.return_id_array ) response.add__id_array.push( rhs_id[index] );
				if ( this.options.return_object_array ) response.add__obj_array.push( this.options.return_clean_object_array ? this.options.callback.return_rhs( rhs[index] ) : rhs[index] );
			}
		}

		return response;
	};

	caveDiver.prototype.find__match = function( obj, array, predicate ) {
		return find__match( obj, array, predicate );
	};

	function get__flat_id_array( array, callback ) {
		var index = 0;
			length = array.length,
			array_id = [],
			unique_id = null;
		for ( index; index < length; index++ ) {
			unique_id = callback(array[index]);
			if ( !is__valid_type( unique_id, ['string', 'number'] ) ) return on__error( 201 );
			if ( array_id.indexOf( unique_id ) !== -1 ) return on__error( 202 );
			array_id.push( unique_id );
		}
		return array_id;
	};

	function find__match( obj, array, predicate ) {
		var index = 0,
			length = array.length;
		for ( index; index < length; index++ ) {
			if ( predicate( obj, array[index] ) ) return array[index];
		}
		return {};
	};

	/*
	|
	|	Helper functions
	|
	| */

	function extend( obj_1, obj_2 ) {
		for (var key in obj_2) {
			obj_1[key] = obj_2[key];
		}
		return obj_1;
	};

	function is__array( variable ) {
		return variable instanceof Array ? true : false;
	};

	function is__object( variable ) {
		return variable instanceof Object ? true : false;
	};

	function is__function( variable ) {
		return variable instanceof Function ? true : false;
	};

	function is__valid_type( variable, valid_types ) {
		return valid_types.indexOf( typeof variable ) !== -1 ? true : false;
	};

	/*
	|
	|	Error handling
	|
	| */

	function on__error( id ) {
		throw {
			error_code: id,
			error_msg: get__error_msg( id )
		};
	};

	function get__error_msg( id, msg ) {
		var error_msg;
		switch( id ) {
			case 101: error_msg = 'invalid array'; break;
			case 102: error_msg = 'invalid array'; break;
			case 103: error_msg = 'invalid object'; break;
			case 201: error_msg = 'invalid or undefined key-value'; break;
			case 202: error_msg = 'found multiple matching key-value pairs'; break;
			case 0:
			default:
				error_msg = 'unknown';
		}
		return error_msg;
	};

	/*
	|
	|	Polyfills
	|
	| */

		/*
		|
		|	IndexOf
		|	Credit : Julien Bouquillon : https://github.com/revolunet
		|
		| */

		if ( !Array.prototype.indexOf ) {

			Array.prototype.indexOf = function( elt ) {
				var len = this.length >>> 0;
				var from = Number( arguments[1] ) || 0;

				from = ( from < 0 ) ? Math.ceil( from ) : Math.floor( from );

				if ( from < 0 ) from += len;

				for ( ; from < len; from++ ) {
					if ( from in this && this[from] === elt ) return from;
				}

				return -1;

			};

		}

	return caveDiver;

} )( document, window );
