# api-field-validation-middleware
Lightweight Express middleware for API request body field validation.

### Features

 - Configurable via `validationParams`
 - Reject undesirable fields sent in excess of requirements
 - Check data types, regex and numeric parameters
 - Check nested objects & arrays
 - Return failed keys

### Installation

>`npm install api-field-validation-middleware`
    
### Usage
import:

`import validateApiFields from "api-field-validation-middleware"`

and use as:

```js
const validationParams = {
	rejectAdditionalFields: false,
	returnFailedValues: true,
	fields: [
		{
			key: "fullName",
			required: true,
			valueConstraints: {
				type: "string"
			}
		},
		{
			key: "address",
			required: true,
			valueConstraints: {
				type: "object"
			},
			nestedValues: [
				{
					key: "postcode",
					required: true,
					valueConstraints: {
						type: "string",
						regex: /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
					}
				}
				[...]
			]
		}
	]
}

// Express route
router.post("/new-customer", validateApiFields(validationParams), (req, res) => {
	// Functionality
}
```
## API

### Configuration
|Props|Type|Default|Description|
|--|--|--|--|
| rejectAdditionalFields | boolean | false | Reject fields that shouldn't be included in request |
| returnFailedValues | boolean | false | Return list of failed object keys in `res.json()` |
| fields | array | | Constraints / validation params for body fields

### Field params
```js
{
	key: string, // name of field
	required: boolean, // If field is required or not
	valueConstraints: {
		type?: "string" | "number" | "object" | "array" | "boolean",
		min?: number, // Minimum value (for numbers)
		max?: number, // Maximum value (for numbers)
		wholeNumber: boolean, // INT or Float (for numbers)
		regex: RegExp // (for strings)
	},
	// Object version
	nestedValues: [
		// Field structure for all nested values
		e.g. {
			key: string,
			required: boolean,
			valueConstraints: {
				type: "string",
				[...]
			}
		}
	],
	// Array version
	nestedValues: {
		freeArray: boolean, // Can array contain any values
		valueConstraints: {
			type?: "string" | "number" | "object" | "array" | "boolean",
			min?: number, // Minimum value (for numbers)
			max?: number, // Maximum value (for numbers)
			wholeNumber: boolean, // INT or Float (for numbers)
			regex: RegExp // (for strings)
		},
		nestedValues: [] // or {} nestedValues version,
		minLength?: number, // Minimum length of array, default: 0
		maxLength?: number, // Maximum length of array, default: 100,000
	}
}

```