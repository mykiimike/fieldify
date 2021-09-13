# Fieldify

[![NPM](https://img.shields.io/npm/v/fieldify.svg)](https://www.npmjs.com/package/fieldify) 
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b95869f760474bfc8ac985667dd3083e)](https://app.codacy.com/manual/mv/fieldify?utm_source=github.com&utm_medium=referral&utm_content=mykiimike/fieldify&utm_campaign=Badge_Grade_Dashboard)
[![][travis-build-img]][travis-build-url]
[![][fossa-img]][fossa-url]

**Fieldify**  is a multi-purpose schema manipulation library, data extractor, generic object and schema iterator. It allows to read, transform or verify a data schema. It is very useful for handling complex objects and schemas. Especially when designing CRUD or API input validator. But also define protocols or file format, the field of Fieldify is very wide. 

## Documentations

- [Fieldify Type Manager](./lib/types/README.md)

## Installation

Using NPM :

```sh
npm install fieldify
```

Using Yarn :

```sh
yarn add fieldify
```

Including Fieldify

Using require()

```js
const fieldify = require("fieldify")
```

Using import

```js
import fieldify from "fieldify"
```

### Portability

The package is independant from other in order to have a clean base.

Fieldify is known to be ran well on different Javascript plateforms such as :

-   NodeJS 
-   In Browser (Chrome, Firefox, IE, Opera, ...)
-   Electron
-   ReactJS
-   React Native

## Fieldify Schema

Fieldify embeds a schema and types mechanism allowing to manipulate input and output data based on a schema.

![Design of the Schema](data/design-schema.png)

### Schema Declaration

It is super simple to create a single schema using Fieldfy, the design is inspired from MongoDB but Fieldify works differently.

First you need to know that the \$ sign before keys names are used to define special operation on the schema.

Let's say we just need to validate an email and a token, and after update the token can not be readed from the database.

```js

const fieldify = require("fieldify")

const { types } = fieldify;

// here is the schema
const schema = {
    email: {
        $type: "Email",
        $write: true,
        $read: true,
    },
    token: {
        $type: "String",
        $write: true,
        $read: false,
    },
}

// here we create the schema context
const hdl = new fieldify.schema("test")

// here we compile the final schema
// you can update whenever you want using hdl.compile()
// or hdl.fusion() and hdl.compile()
hdl.compile(schema)

// define a user input
const input = {
    email: "test@test.com",
    token: "supertoken"
}

// run the verifier against the input
hdl.verify(input, (fieldified) => {
    if(fieldified.error === false) {
      console.log("Error in the input")
    }
})

// verify promise version call
const fieldified = await hdl.verify(input)
if(fieldified.error === false) {
  console.log("Error in the input")
}

// after verification you can store in 
// database after encoding
hdl.encode(input, (fieldified) => {
  console.log(fieldified.result)
})

// and getting data from the database 
hdl.decode(input, (fieldified) => {
  console.log(fieldified.result)
})

// and finally filter what is going out from the db
hdl.filter(input, (fieldified) => {
  console.log(fieldified.result)
})

// filter promise version
const fieldified = await hdl.filter(input)
console.log(fieldified.result)
```

### Roles based Schema Declaration

Schema based on roles allows to define roles for some fields of the schema. This allows to limit the reading or writing of fields according to a role. Typically an administrator will be able to field a field when a user will not be able to do so. 

Fieldify provides a role management method associated to the field directly. Depending on these roles, Fieldify will create different schemes per existing role. This makes data verification or filtering much easier. 

Moreover, Fieldify allows to rewrite all 'leaf' fields starting with $. It is possible to change the values for $read or $write but also $encode or $decode. Here is how to declare a schema based on roles:

```js

const fieldify = require("fieldify")

const { roles } = fieldify

const theSchema = {
  test: {
    $type: 'String',
    // this is default role schema where the field can not write or read.
    $write: false,
    $read: false,
    $roles: {
      admin: {
        // admin can read & write
        $read: true,
        $write: true
      },
      user: {
        // user can just read, not write
        $read: true
      }
    }
  }
}

const hdl = new roles('test', theSchema)

// here we have 3 instances of schema

// verify on default role
const fieldified = await hdl.default.verify(input)
if(fieldified.error === false) {
  console.log("Error in the input")
}

// verify on admin role
const fieldified = await hdl.admin.verify(input)
if(fieldified.error === false) {
  console.log("Error in the input")
}

// verify on user role
const fieldified = await hdl.user.verify(input)
if(fieldified.error === false) {
  console.log("Error in the input")
}
````

### F2020.1 Official Types

| Type | Description | Class
|-|-|-
| String | Single string | Low
| Number | Number Type | Low
| Select | Item selector | Low
| Name | Name type | Low
| Checkbox | Single checkbox | Low
| DatePicker | Date picking functionnality | Low
| DatePickerRange | Date picking with range | Low
| DateTimePicker | Date & Time picker | Low
| Color | HTML Color selector | Low
| FieldName | Internal Field Name | Low
| Hash | Hash | Low
| KV | Single KV | Low
| URL | Valid URL | Low
| Email | E-mail address | Low
| Radio | Radio button | Low
| Country | List of Countries | Low
| Hash | HASH type field | Low
| Slug | Slug string | Low
| TimePicker | Time picking functionnality | Low
| TimePickerRange | Time picking with range | Low

### Upcomming Official Types

| Type | Description | Class
|-|-|-
| Switch | Switch button | Low
| Rate | Rate selector | Low
| Address | IRL Address | Low
| LocationGPS | GPS Position | Low

### Schema Types

Each type has it own space in a schema, few methods are exposed to perform different operations on the field. Every type are derived from fieldifyType.

Actually Fieldify Types provides different access method :
-   _verify(input, cb)_: Verify / Validate / Sanatize user input 
-   _filter(input, cb)_: Filtering Data Output generally from a database (prevent leak)
-   _encode(input, cb)_: Before to write into the database - this is how to write
-   _decode(input, cb)_: After data getting out from the database - this is how to read

Each type in a schema as it owns configuration. Fieldify supports 4 mains options on the field:

-   _$required_: Is the field is required ? true = yes, default true
-   _$read_: Is it allowed to read the field using filter(), true = yes, default false
-   _$write_: Is it allowed to write the field using verify(), true = yes, default false
-   _$type_: The field type declaration

#### Types

## Internal Design

There are a few basic points in Fieldify. In particular the management of arrays and the use of \$ in front of certain fields.

Fieldify is a recursive object iterator which allows :

-   Read or transform a schema - _assignator_
-   Extract and verify the input data following a schema - _iterator_

It is essential to understand the use of $. When a field in a schema is preceded by \$ this means that the iterator will not enter processing in this field, this allows options to be given to the parent field and this recursively.

So you can give any options you want to define the properties of a field.

```js
const schema = {
  name: {
    first: {
      $options: "string",
      $max: 30,
      $onCheck: (data, next) => {}
    },
    last: {
      $options: "string"
    }
  }
};
```

### Nested Object and Array

The last important point in Fieldify is the notion of Array and Nested object. The great ability of Fieldify is to support Nested Objects and Array. In a Fieldify schema the definition of an Array makes it possible to define the type of the field. One cannot thus define several element in an array of schema however to define one of them will allow Fieldify to authorize elements in time as source/input in the iterator.

In a schema the _assign_  _ or the _fusion\*  \* will only take the first element of an Array to compose the output.

It's a bit complex like that but very useful every day:

```js
// a Fieldify schema
const schema = {
  name: {
    // define an array field
    first: [
      {
        fieldOne: {
          $opt: true
        },
        fieldTwo: {
          $opt: true
        }
      }
    ]
  }
};

// an input
const input = {
  name: {
    first: [
      {
        fieldOne: 32,
        fieldTwo: 43
      },
      {
        fieldOne: 1,
        fieldTwo: 4
      }
    ]
  }
};
```

## Schema Assignation

The assigner allows you to extract fields (those that are not prefixed with _\$_) from a schema in a desired format. This is particularly useful for transforming a Fieldify schema into another schema format.

Example: Transforming a Fieldify schema into a Mongo (mongoose) schema

Info: The assigner works in blocking mode. It is not recommended to let users control the schema without validation.

Below is an example of a Fieldify schema

```js
const schema = {
  entry: {
    $read: false,

    subEntry1: {
      $read: true
    },

    subEntry2: {
      $read: true,

      subEntry22: {
        $read: true
      }
    }
  }
};
```

In the example below we transform an assigner into another format. Even if _\$read_  _ is _false\*  \* we continue to follow the tree.

```js
const extract = fieldify.assign(schema, (user, dst, object, source) => {
  dst["_read"] = object.$read;
});

/  * Will return

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

Extract a schema and prohibit the iterator from going further in its floor if _\$read_  _ is _false_. This is _return(false)\*  \* which indicates the iterator to return to a lower floor.

```js
const extract = fieldify.assign(schema, (user, dst, object, source) => {
  dst["_read"] = object.$read;

  // do not follow the rest in any case
  if (object.$read === false) return false;
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

## Input Iterator

Once the schema is defined and modeled it is necessary to compile it in order to optimize the traversing of the tree.

```js
const fieldify = require("fieldify");
const crypto = require("crypto");

const schema = {
  $write: false,

  name: {
    $read: false,
    $write: true,

    first: { $read: true },
    last: { $read: true }
  },
  password: {
    $write: true
  }
};
const handler = fieldify.compile(schema);
```

The _handler_  \* corresponds to the compiled instance of the schema which will be used later for the iteration.

The iterator is a means of extracting data from an entry according to the defined Fieldify scheme. This is very useful for validating or verifying input data.

This is how things start to get interesting, in the example below we are going to check some input data and assignment.

Considering the following entry:

```js
const input = {
  name: {
    first: "Michael",
    last: "Vergoz"
  },
  password: "My super password"
};
```

We will create 2 assignators, one to extract the data that is readable and the other for the data that can be written. Thus the *password* field cannot be read.

```js
function isReadable(current, next) {
  if (current.access.$read === true) {
    current.result[current.key] = current.input;
  }
  next();
}

function isWritable(current, next) {
  if (current.access.$write === true) {
    current.result[current.key] = current.input;
  }
  next();
}
```

It is important to note that the extraction functions are asynchronous and so the *next()* callback must be executed on each pass. It is thus possible to question a third party service for a field without blocking the iteration.

```js
const opts = {
  handler: handler,
  input: input,
  onAssign: isReadable,
  onEnd: iterator => {
    console.log(iterator.result);
  }
};
fieldify.iterator(opts);
```

In the example above, we retrieve the input data according to the Fieldify schema compiled handler with the *onAssign()* assignment function which will extract only the fields inheriting from a *$read* flag to _true_. In this example, the password field will not be rendered when the iteration has finished and executed the *onEnd()* callback

This type of iteration is very useful when presenting data to the user (database > user)

```js
const opts = {
  handler: handler,
  input: input,
  onAssign: isWritable,
  onEnd: iterator => {
    console.log(iterator.result);
  }
};
fieldify.iterator(opts);
```

In the example above the password field will be returned in the result. This case arises when we want to insert the data in a database (user > database)

[travis-build-img]: https://travis-ci.org/mykiimike/fieldify.svg?branch=master

[travis-build-url]: https://travis-ci.org/mykiimike/fieldify

[fossa-img]: https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmykiimike%2Ffieldify.svg?type=shield

[fossa-url]: https://app.fossa.io/projects/git%2Bgithub.com%2Fmykiimike%2Ffieldify?ref=badge_shield
