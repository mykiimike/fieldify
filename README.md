# Fieldify

**fieldify** is a schema modeler, a data extractor and a generic object iterator. It allows you to read, transform or verify a data schema.

It allows you to read or transform a schema and extract or verify related data. It is very useful for handling complex objects and schemas. Especially when designing CRUD or API input validator.

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

## Installation

```
npm install fieldify
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

