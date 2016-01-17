var caveDiver = ( function( document, window ) {

	function caveDiver() {
		this.options = {
			log: false,
			compare_removed: true,
			compare_added: true,
			compare_modified: true,
			apply_removed: true,
			apply_added: true,
			apply_modified: true,
			cb: {
				remove: function( id ) { console.log( 'remove', id ); },
				add: function( id, obj ) { console.log( 'add', id, obj ); },
				modify: function( id, obj1, obj2 ) { console.log( 'modify', id, obj ); }
			}
		}
	};

	caveDiver.prototype.compare = function( base_array, comparison_array, key ) {
		return this.get__diff( base_array, comparison_array, key );
	};

		caveDiver.prototype.compareApplyAll = function( base_array, comparison_array, key ) {
			var log = this.get__diff( base_array, comparison_array, key );
			this.applyAll( log, base_array, comparison_array, key );
		};

			caveDiver.prototype.applyAll = function( log, base_array, comparison_array, key ) {
				if ( this.options.apply_removed ) this.applyRemoved( log['removed'], key );
				if ( this.options.apply_added ) this.applyAdded( log['added'], comparison_array, key );
				if ( this.options.apply_modified ) this.applyModified( log['modified'], base_array, comparison_array, key );
			};

				caveDiver.prototype.applyRemoved = function( log, key ) {
					var log_ = extract__log( log, 'removed' );
					this.apply_( log_, this.options.cb.remove );
				};

				caveDiver.prototype.applyAdded = function( log, comparison_array, key ) {
					var log_ = extract__log( log, 'added' );
					this.apply_( log_, this.options.cb.add, key, comparison_array );
				};

				caveDiver.prototype.applyModified = function( log, base_array, comparison_array, key ) {
					var log_ = extract__log( log, 'modified' );
					this.apply_( log_, this.options.cb.modify, key, comparison_array );
				};

	caveDiver.prototype.apply_ = function( array, callback, key, return_obj_array_1, return_obj_array_2 ) {
		var index = 0,
			length = array.length;
		for ( index; index < length; index++ ) {
			callback( array[index], is__array( return_obj_array_1 ) ? this.get__obj_by_id( return_obj_array_1, key, array[index] ) : undefined, is__array( return_obj_array_2 ) ? this.get__obj_by_id( return_obj_array_2, key, array[index] ) : undefined );
		}
	};

	caveDiver.prototype.get__diff = function( base_array, comparison_array, key ) {

		var response = {
			removed: [],
			modified: [],
			added: []
		},
		base_ids = [],
		comparison_ids = [];

		if ( !is__array( base_array ) ) {
			return on__error(101);
		}

		if ( !is__array( comparison_array ) ) {
			return on__error(102);
		}

		if ( !is__valid_type( key, ['string', 'number'] ) ) {
			return on__error(103);
		}

		base_ids = get__ids( base_array, key );
		comparison_ids = get__ids( comparison_array, key );

		if ( this.options.compare_removed ) response.removed = get__array_diff( base_ids, comparison_ids );
		if ( this.options.compare_added ) response.added = get__array_diff( comparison_ids, base_ids );
		//  if ( this.options.compare_modified ) response.modified = get__array_modifications( comparison_ids, base_ids );

		return response;

	};

	caveDiver.prototype.get__index_by_id = function( array, key, id ) {
		return get__index_by_id( array, key, id );
	};

	caveDiver.prototype.get__obj_by_id = function( array, key, id ) {
		return array[get__index_by_id( array, key, id )];
	};

	/*
	|
	|	Helper functions
	|
	| */

	function extract__log( log, key ) {
		if ( is__array( log ) ) return log;
		if ( is__array( log[key] ) ) return log[key];
		return on__error( 301 );
	};

	function is__array( obj ) {
		return typeof obj === 'object' && typeof obj.length === 'number' ? true : false;
	};

	function is__object( obj ) {
		return typeof obj === 'object' && typeof obj.length === 'undefined' ? true : false;
	};

	function is__valid_type( obj, valid_types ) {
		return valid_types.indexOf( typeof obj ) !== -1 ? true : false;
	};

	function get__ids( array, key ) {
		var ids = [],
			index = 0,
			length = array.length;
		for ( index; index < length; index++ ) {
			key_val = array[index][key];
			if ( !is__valid_type( key_val, ['string', 'number'] ) ) return on__error( 201 );
			if ( ids.indexOf( key_val ) !== -1 ) return on__error( 202 );
			ids.push( key_val );
		}
		return ids;
	};

	function get__array_diff( array_1, array_2 ) {
		var diffs = [],
			index = 0,
			length = array_1.length;
		for( index; index < length; index++ ) {
			if ( array_2.indexOf( array_1[index] ) === -1 ) {
				diffs.push( array_1[index] );
			}
		}
		return diffs;
	};

	function get__array_duplicates( array_1, array_2 ) {
		var dups = [],
			index = 0,
			length = array_1.length;
		for( index; index < length; index++ ) {
			if ( array_2.indexOf( array_1[index] ) !== -1 ) {
				dups.push( array_1[index] );
			}
		}
		return dups;
	};

	function get__array_modifications( array_1, array_2 ) {
		var mods = [],
			dups = get__array_duplicates( array_1, array_2 ),
			index = 0,
			length = array_1.length;
		for( index; index < length; index++ ) {
			if ( dups.indexOf( array_1[index] ) !== -1 ) {
				// mods.push( array_1[index] );
				/* compare */
			}
		}
		return mods;
	};

	function get__index_by_id( array, key, id ) {
		var index = 0,
			index_at = -1;
			length = array.length;
		for ( index; index < length; index++ ) {
			if ( array[index][key] == id ) {
				if ( index_at === -1 ) {
					index_at = index;
				} else {
					return this.on__error( 202 );
				}
			}
		}
		return index_at;
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
			case 101: error_msg = 'invalid array: base_array'; break;
			case 102: error_msg = 'invalid array: comparison_array'; break;
			case 103: error_msg = 'invalid key'; break;
			case 201: error_msg = 'invalid or undefined key-value'; break;
			case 202: error_msg = 'found multiple matching key-value pairs'; break;
			case 301: error_msg = 'invalid log passed to an apply method'; break;
			case 0:
			default:
				error_msg = 'unknown';
		}
		return error_msg;
	};

	/*
	|
	|
	|
	| * /

	caveDiver.prototype.extend = function() {
		for (var key in this.settings) {
			this.defaults[key] = this.settings[key];
		}
		return this.op;
	};

	/* /.extend */

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
