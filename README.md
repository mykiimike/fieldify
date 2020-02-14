# Fieldify

**fieldify** is a schema modeler, a data extractor and a generic object iterator. It allows you to read, transform or verify a data schema.

It allows you to read or transform a schema and extract or verify related data. It is very useful for handling complex objects and schemas. Especially when designing CRUD or API input validator.

## Installation

```
npm install fieldify
```

## Introduction

There are a few basic points in Fieldify. In particular the management of Array arrays and the use of **$** in front of certain fields.

Fieldify is a recursive object iterator which allows

* Read or transform a schema - **assignator**
* Extract and verify the input data following a schema - **iterator**

It is essential to understand the use of **$**. When a field in a schema is preceded by **$** this means that the iterator will not enter processing in this field, this allows options to be given to the parent field and this recursively.

So you can give any options you want to define the properties of a field.

```js
const schema = {
	name: {
		first: {
			$options: "string",
			$max: 30,
			$onCheck: (data, next) => { }
		},
		last: {
			$options: "string"
		}
	},
}
```

### Nested Object and Array

The last important point in Fieldify is the notion of Array and Nested object. The great ability of Fieldify is to support Nested Objects and Array. In a Fieldify schema the definition of an Array makes it possible to define the type of the field. One cannot thus define several element in an array of schema however to define one of them will allow Fieldify to authorize elements in time as source/input in the iterator.


In a schema the **assign** or the **fusion** will only take the first element of an Array to compose the output.

It's a bit complex like that but very useful every day:

```js
// a Fieldify schema
const schema = {
	name: {
		// define an array field
		first: [{
			fieldOne: {
				$opt: true
			},
			fieldTwo: {
				$opt: true
			}
		}]
	},
}

// an input
const input = {
	name: {
		first: [{
			fieldOne: 32,
			fieldTwo: 43
		},{
			fieldOne: 1,
			fieldTwo: 4
		},]
	},
}

```

## Assignator

The assigner allows you to extract fields (those that are not prefixed with **$**) from a schema in a desired format. This is particularly useful for transforming a Fieldify schema into another schema format.

Example: Transforming a Fieldify schema into a Mongo (mongoose) schema

Info: The assigner works in blocking mode. It is not recommended to let users control the schema without validation.

Below is an example of a Fieldify schema

```js
const schema = {
    entry: {
        $read: false,

        subEntry1: {
            $read: true,
        },

        subEntry2: {
            $read: true,

            subEntry22: {
                $read: true
            }
        }
    }
}
```

In the example below we transform an assigner into another format. Even if **$read** is **false** we continue to follow the tree.

```js
const extract = fieldify.assign(schema, (user, dst, object, source) => {
	dst["_read"] = object.$read;
});

/* Will return

{
	"entry": {
		"_read": false,
		"subEntry1": {
			"_read": true
		},
		"subEntry2": {
			"_read": true,
			"subEntry22": {
				"_read": true
			}
		}
	}
}
*/
```

Extract a schema and prohibit the iterator from going further in its floor if **$read** is **false**. This is **return(false)** which indicates the iterator to return to a lower floor.

```js
const extract = fieldify.assign(schema, (user, dst, object, source) => {
	dst["_read"] = object.$read;

	// do not follow the rest in any case
	if(object.$read === false) return(false);
});

/* Will return

{
	"entry": {
		"_read": false
	}
}
*/
```

There is an example that shows how to merge 2 fields into one in examples/assignator-rw.js.

## Iterator

The iterator is a means of extracting data from an entry according to the defined Fieldify scheme. This is very useful for validating or verifying input data.

