import {
  UPDATE_INPUT_FIELDS,
  UPDATE_ERROR_ALERT,
  UPDATE_USER_TYPE
} from '../../constant'

const initialState = {
  profile_image:
    'https://cdn.iconscout.com/icon/free/png-256/avatar-380-456332.png',
  name: '',
  email: '',
  whatsappNumber: '',
  phone_number: '',
  country: '',
  occupation: '',
  gender: '',
  error_alert: '',
  on_loading: false,
  type: 0,

  numberOfProperties: 0,
  experience: '',
  companyName: '',
  contractType: '',
  monthlyIncome: 0,
  paxNumber: 1,
  reasonForMove: '',
  cityOfLiving: '',
  dob: ''
}

export default function EditPersonInfoReducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_INPUT_FIELDS:
      return {
        ...state,
        [action.key]: action.value,
        error_alert: ''
      }
    case UPDATE_ERROR_ALERT:
      return {
        ...state,
        error_alert: action.error_alert
      }
    case UPDATE_USER_TYPE:
      return {
        ...state,
        [action.key]: action.value
      }
    default:
      return state
  }
}
