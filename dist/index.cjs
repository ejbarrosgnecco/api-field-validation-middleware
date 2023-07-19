'use strict';

if(process.env.NODE_ENV === "production") {
    module.exports = require("./validate-api-fields.production")
} else {
    module.exports = require("./validate-api-fields.development")
}