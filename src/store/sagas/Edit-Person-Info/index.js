import { takeLatest, put, call } from 'redux-saga/effects'

import { GET_PROFILE_DETAILS, UPDATE_PROFILE_DETAILS } from '../../constant'

import { profileDetailsGet, updateProfileDetails } from '../../../api/http'

import {
  updateInputFields,
  updateUserType,
  getProfileError,
  getProfileDetails
} from '../../actions'

import APICaller from '../../../util/apiCaller'

function * onGetProfileDetails (editPersonInfoAction) {
  if (!global.networkConnection) return
  let { payload, resolve, reject } = editPersonInfoAction

  var apiResponse = null
  // **** API call
  APICaller(profileDetailsGet(payload.cid), 'GET', payload.token, '')
    .then(response => {
      if (!response) return
      apiResponse = response
      if (response && response.status === 200) {
        resolve(response.data)
      } else {
        reject(response)
      }
    })
    .catch(err => alert(err))
}

function * onUpdateProfileDetails (editPersonInfoAction) {
  if (!global.networkConnection) return
  let { payload, resolve, reject } = editPersonInfoAction
  const { customer_id, token, body } = payload
  yield put(updateInputFields('on_loading', true))
  var apiResponse = null
  // **** API call
  APICaller(
    updateProfileDetails(customer_id),
    'PUT',
    token,
    JSON.stringify(body)
  )
    .then(response => {
      if (!response) return
      apiResponse = response
      if (response.status === 200) {
        alert('Profile updated successfully.')
        resolve(response)
      } else {
        reject(response)
      }
    })
    .catch(err => {
      dispatch(updateInputFields('on_loading', false))
      reject(err)
      alert(err)
    })
}

export function * editPersonInfoActionWatcher () {
  yield takeLatest(GET_PROFILE_DETAILS, onGetProfileDetails)
  yield takeLatest(UPDATE_PROFILE_DETAILS, onUpdateProfileDetails)
}
