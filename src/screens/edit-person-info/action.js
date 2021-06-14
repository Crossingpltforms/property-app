import { updateProfileDetails, profileDetailsGet } from '../../api/http'
import APICaller from '../../util/apiCaller'

export const updateInputFields = (key, value) => ({
  type: 'UPDATE_INPUT_FIELDS_EDIT_PERSON_INFO',
  key,
  value
})

export const updateUserType = (key, value) => ({
  type: 'UPDATE_USER_TYPE_EDIT_PERSON_INFO',
  key,
  value
})

export const updateErrorAlert = error_alert => ({
  type: 'UPDATE_ERROR_ALERT_EDIT_PERSON_INFO',
  error_alert
})

export const getProfileDetails = (cid, token) => dispatch => {
  if (!global.networkConnection) return
  APICaller(profileDetailsGet(cid), 'GET', token, '')
    .then(response => {
      if (!response) return
      if (response.status === 200) {
        dispatch(updateInputFields('name', response.data.name))
        dispatch(updateInputFields('email', response.data.email))
        dispatch(updateInputFields('phone_number', response.data.phoneNumber))
        dispatch(updateInputFields('country', response.data.country))
        dispatch(updateInputFields('occupation', response.data.occupation))
        dispatch(updateInputFields('profile_image', response.data.avatar))
        dispatch(
          updateInputFields('whatsappNumber', response.data.whatsappNumber)
        )
        dispatch(updateUserType('type', response.data.type))
        if (response.data.propertiesOwned === 11) {
          dispatch(updateInputFields('numberOfProperties', '10+'))
        } else {
          dispatch(
            updateInputFields(
              'numberOfProperties',
              response.data.propertiesOwned
            )
          )
        }
        dispatch(updateInputFields('experience', response.data.experience))
        dispatch(updateInputFields('companyName', response.data.companyName))
        dispatch(updateInputFields('contractType', response.data.contractType))
        dispatch(
          updateInputFields('monthlyIncome', response.data.monthlyIncome)
        )
        dispatch(updateInputFields('paxNumber', response.data.paxNumber))
        dispatch(
          updateInputFields('reasonForMove', response.data.reasonForMove)
        )
        dispatch(updateInputFields('cityOfLiving', response.data.cityOfLiving))
        dispatch(updateInputFields('dob', response.data.dob))
        dispatch(updateInputFields('gender', response.data.gender))
      }
    })
    .catch(err => alert(err))
}

export const updateProfileDetailsAction = (
  customer_id,
  token,
  body
) => dispatch => {
  if (!global.networkConnection) return

  dispatch(updateInputFields('on_loading', true))
  APICaller(
    updateProfileDetails(customer_id),
    'PUT',
    token,
    JSON.stringify(body)
  )
    .then(response => {
      if (!response) return
      if (response.status === 200) {
        dispatch(getProfileDetails(customer_id, token))
        alert('Profile updated successfully.')
      }
      dispatch(updateInputFields('on_loading', false))
    })
    .catch(err => {
      dispatch(updateInputFields('on_loading', false))
      alert(err)
    })
}
