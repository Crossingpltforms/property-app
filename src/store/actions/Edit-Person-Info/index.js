import {
  UPDATE_INPUT_FIELDS,
  UPDATE_USER_TYPE,
  UPDATE_ERROR_ALERT,
  GET_PROFILE_DETAILS,
  GET_PROFILE_DETAILS_SUCCESS,
  GET_PROFILE_DETAILS_FAIL,
  UPDATE_PROFILE_DETAILS,
  UPDATE_PROFILE_DETAILS_SUCCESS,
  UPDATE_PROFILE_DETAILS_FAIL
} from '../../constant'

export function updateInputFields (key, value) {
  return { type: UPDATE_INPUT_FIELDS, key, value }
}

export function updateUserType (key, value) {
  return { type: UPDATE_USER_TYPE, key, value }
}

export function updateErrorAlert (error_alert) {
  return { type: UPDATE_ERROR_ALERT, error_alert }
}

export function getProfileDetails (payload, resolve, reject) {
  return { type: GET_PROFILE_DETAILS, payload, resolve, reject }
}

export function getProfileSuccess (payload) {
  return { type: GET_PROFILE_DETAILS_SUCCESS, payload: payload }
}

export function getProfileError (error) {
  return { type: GET_PROFILE_DETAILS_FAIL, payload: error }
}

export function updateProfileDetailsAction (payload, resolve, reject) {
  return { type: UPDATE_PROFILE_DETAILS, payload, resolve, reject }
}

export function updateProfileSuccess (payload) {
  return { type: UPDATE_PROFILE_DETAILS_SUCCESS, payload: payload }
}

export function updateProfileError (error) {
  return { type: UPDATE_PROFILE_DETAILS_FAIL, payload: error }
}
