# caveDiver.js

diving deep into a JavaScript object array the caveDiver continus in search of lost and forgotten *predicates*... Okay that's enough of that. caveDiver.js makes it easy to compare two JavaScript object arrays and return information about changes.

caveDiver.js allows you to compare two data sets with different formats and define how a *modification* is defined.

## example
#### 1.
basic implementation with default configuration
```
var cd = new caveDiver();
var chat_1 = [{
  id: 10,
  username: 'foobar',
  modified: 1451606400
}, {
  id: 11,
  username: 'barfoo',
  modified: 1451608400
}];
var chat_2 = [{
  id: 10,
  username: 'foobar',
  modified: 1451610400
}, {
  id: 12,
  username: 'barfoo',
  modified: 1451614400
}];
console.log(cd.compare(chat_1,chat_2));
```
**output**
```
{
	add__obj_array: [{
		id: 12,
		username: 'barfoo',
		modified: 1451614400
	}],
	remove__obj_array: [{
		id: 11,
		username: 'barfoo',
		modified: 1451608400
	}],
	modify__obj_array: [{
		lhs: {
			id: 10,
			username: 'foobar',
			modified: 1451606400
		},
		rhs: {
			id: 10,
			username: 'foobar',
			modified: 1451610400
		}
	}]
}
```
#### 4. 
passing configurations
```
// initiate
var options = {};
var cd = new caveDiver(options);
// update
cd.update__options(options)
```

## configuration
### settings
* return_id_array [false]
* return_object_array [true]
* return_clean_object_array [false]

### callbacks
* id_lhs
* id_rhs
* return_lhs
* return_rhs
* match
* compare