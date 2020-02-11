/*
 * Read - Assignator
 */
const assert = require('assert');
const fieldify = require("../index");

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

describe('Read Assignator', function() {
	it('should skip sub entries because read is false', function(done) {
		const extract = fieldify.assign(schema, (user, dst, object, source) => {
            dst["_read"] = object.$read;
        
            // do not follow the rest in any case
            if(object.$read === false) return(false);
        });
        
        const jsons = JSON.stringify(extract);
        if(jsons != '{"entry":{"_read":false}}') {
            done("Entry is different: "+jsons);
        }
        else {
            done();
        }
	});
    
    it('should continue sub entries even read is false', function(done) {
		const extract = fieldify.assign(schema, (user, dst, object, source) => {
            dst["_read"] = object.$read;
        });

        const jsons = JSON.stringify(extract);
        if(jsons != '{"entry":{"_read":false,"subEntry1":{"_read":true},"subEntry2":{"_read":true,"subEntry22":{"_read":true}}}}') {
            done("Entry is different: "+jsons);
        }
        else {
            done();
        }
	});

});


