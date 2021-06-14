import React from 'react';
import * as _ from 'lodash';

const validateInput = (value, type) => {
  let errorMsg = '';
  switch (type) {
    case 'email':
      if (_.isEmpty(value)) {
        errorMsg = "Email can't be empty";
      } else if (value) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(value) === false) {
          errorMsg = 'Email is Not Correct';
        }
      }
      break;
    case 'mobile':
      if (_.isEmpty(value)) {
        errorMsg = "Mobile number can't be empty";
      } else if (value.length < 8 && value.length > 10) {
        errorMsg = 'Mobile number is Not Correct';
      }
      break;
    case 'name':
      if (_.isEmpty(value)) {
        errorMsg = "Name can't be empty";
      }
      break;
    case 'nric':
      if (_.isEmpty(value)) {
        errorMsg = "NRIC Number can't be empty";
      } else if (value.length !== 14) {
        errorMsg = 'NRIC Number is Not Correct';
      }
      break;
    default:
      break;
  }
  return errorMsg;
};

export default validateInput;
