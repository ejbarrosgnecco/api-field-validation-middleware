'use strict';

if(process.env.NODE_ENV === "production") {
    export default "./validate-api-fields.production"
} else {
    export default "./validate-api-fields.development"
}