export declare type Fields = {
    [key: string]: any
}
type FieldTypes =
    | "string"
    | "number"
    | "object"
    | "array"
    | "boolean"
type TypeConstraints = {
    type?: FieldTypes,
    min?: number // For numbers
    max?: number // For numbers
    wholeNumber?: boolean // For number - decide if INT or FLOAT
    regex?: RegExp,
}
type ArrayConstraints = {
    freeArray: boolean,
    valueConstraints: TypeConstraints,
    nestedValues?: FieldStructure[] | ArrayConstraints,
    minLength?: number,
    maxLength?: number
}
type FieldStructure = {
    key?: string,
    required?: boolean,
    nestedValues?: FieldStructure[] | ArrayConstraints, // For arrays & objects
    freeArray: boolean // For arrays with ANY value composition
    valueConstraints: TypeConstraints
}
export interface ValidationParams {
    rejectAdditionalFields?: boolean,
    returnFailedValues?: boolean,
    fields: FieldStructure[]
}