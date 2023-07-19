'use strict'

const checkField = (value, key, constraint) => {
    switch(key) {
        case "type": {
            return typeof value === constraint
        }
            
        case "regex":
            return constraint.test(value)

        case "min":
            return value >= constraint

        case "max":
            return value <= constraint

        case "wholeNumber": {
            return (value % 1 === 0) === constraint
        }
    }
}

const checkValueConstraints = (fieldRules, value) => {
    if(fieldRules.valueConstraints.type === "object") {
        return !validateApiFields(value, fieldRules.nestedValues)
    } else if (fieldRules.valueConstraints.type === "array") {
        const config = fieldRules.nestedValues;
        
        if(Array.isArray(value) === false) {
            return true;
        } else if(config.freeArray) {
            return !(value.length >= config.minLength || 0 && value.length <= config.maxLength || 100000)
        } else {
            return value.some(item => {
                return Object.keys(config.valueConstraints).some(key => {
                    const constraint = config.valueConstraints[key];
                    
                    if(key === "type" && constraint === "array") {
                        return checkValueConstraints(fieldRules.nestedValues, item)
                    } else {
                        return !checkField(item, key, constraint)
                    }
                })
            }) ? true : !(value.length >= (config.minLength || 0) && value.length <= (config.maxLength || 100000))
        }
    } else {
        return Object.keys(fieldRules.valueConstraints).some(key => {
            const constraint = fieldRules.valueConstraints[key];
            return !checkField(value, key, constraint)
        })
    }
}

const validateApiFields = (fields, fieldValidation) => {
    const allFields = fieldValidation.fields || fieldValidation;

    let failedValues = [];

    if(fieldValidation.rejectAdditionalFields) {
        const additionalFields = Object.keys(fields).filter(f => {
            return !allFields.some(v => {
                v.key === f
            })
        }) 
        
        if(additionalFields.length > 0) {
            return {
                passed: false,
                failedValues: additionalFields,
                additionalFieldFailure: true
            }
        }
    }

    
    let passed = true;

    // Iterate through each value and check against criteria
    for (let i = 0; i < allFields.length; i++) {
        const fieldRules = allFields[i];
        const value = fields[fieldRules.key];

        if(value === undefined) {
            if(fieldRules.required) {
                if(fieldValidation.returnFailedValues) failedValues.push(fieldRules.key)

                passed = false
            }
    
            continue; 
        };

        // Check value constraints
        const constraintValidation = checkValueConstraints(fieldRules, value)

        if(constraintValidation === true) { 
            passed = false; 

            if(fieldValidation.returnFailedValues) failedValues.push(fieldRules.key);
            continue;
        }
    }

    return {
        passed: passed,
        failedValues: failedValues
    }
}

const middlewareWrapper = (fieldValidation) => {
    return (req, res, next) => {
        const v = validateApiFields(req.body, fieldValidation)
    
        if(v.passed) {
            next();
        } else {
            if(v.additionalFieldFailure) {
                res.status(400).json(`The following fields are not permitted: ${v.failedValues.json(", ")}`)
            } else if(fieldValidation.returnFailedValues) {
                res.status(400).json(`The following fields were incorrectly formatted: ${v.failedValues.join(", ")}`)
            } else {
                res.status(400).json("One or more fields in this request were incorrectly formatted")
            }
        }
    }
}

module.exports = middlewareWrapper