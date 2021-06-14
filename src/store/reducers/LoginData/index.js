import {
  SAVE_LOGIN_DATA,
  GET_LOGIN_DATA,
  SAVE_LOGIN_USER_PROFILE_DATA
} from '../../constant'

const initialState = {
  isUserLogin: false,
  userLoginData: null,
  userLoginProfileData: null
}

export default function loginDataReducer (state = initialState, action) {
  switch (action.type) {
    case SAVE_LOGIN_DATA: {
      return {
        ...state,
        userLoginData: action.value,
        isUserLogin: action.value != null ? true : false
      }
    }
    case SAVE_LOGIN_USER_PROFILE_DATA: {
      return {
        ...state,
        userLoginProfileData: action.value
      }
    }
    case GET_LOGIN_DATA:
      return {
        ...state
      }
    default:
      return state
  }
}
