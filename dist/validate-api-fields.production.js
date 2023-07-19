"use strict";const checkField=(e,t,r)=>{switch(t){case"type":return typeof e===r;case"regex":return r.test(e);case"min":return e>=r;case"max":return e<=r;case"wholeNumber":return e%1==0===r}},checkValueConstraints=(e,t)=>{if("object"===e.valueConstraints.type)return!validateApiFields(t,e.nestedValues);if("array"!==e.valueConstraints.type)return Object.keys(e.valueConstraints).some(r=>{let s=e.valueConstraints[r];return!checkField(t,r,s)});{let r=e.nestedValues;return!1===Array.isArray(t)||(r.freeArray?(t.length,r.minLength,!1):!!t.some(t=>Object.keys(r.valueConstraints).some(s=>{let a=r.valueConstraints[s];return"type"===s&&"array"===a?checkValueConstraints(e.nestedValues,t):!checkField(t,s,a)}))||!(t.length>=(r.minLength||0)&&t.length<=(r.maxLength||1e5)))}},validateApiFields=(e,t)=>{let r=t.fields||t,s=[];if(t.rejectAdditionalFields){let a=Object.keys(e).filter(e=>!r.some(e=>{e.key}));if(a.length>0)return{passed:!1,failedValues:a,additionalFieldFailure:!0}}let l=!0;for(let i=0;i<r.length;i++){let n=r[i],u=e[n.key];if(void 0===u){n.required&&(t.returnFailedValues&&s.push(n.key),l=!1);continue}let d=checkValueConstraints(n,u);if(!0===d){l=!1,t.returnFailedValues&&s.push(n.key);continue}}return{passed:l,failedValues:s}},middlewareWrapper=e=>(t,r,s)=>{let a=validateApiFields(t.body,e);a.passed?s():a.additionalFieldFailure?r.status(400).json(`The following fields are not permitted: ${a.failedValues.json(", ")}`):e.returnFailedValues?r.status(400).json(`The following fields were incorrectly formatted: ${a.failedValues.join(", ")}`):r.status(400).json("One or more fields in this request were incorrectly formatted")};module.exports=middlewareWrapper;