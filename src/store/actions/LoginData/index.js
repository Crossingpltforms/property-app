import {
  SAVE_LOGIN_DATA,
  GET_LOGIN_DATA,
  SAVE_LOGIN_USER_PROFILE_DATA
} from '../../constant'

export function setLoginUserData (value) {
  return { type: SAVE_LOGIN_DATA, value }
}
export function setLoginUserProfileData (value) {
  return { type: SAVE_LOGIN_USER_PROFILE_DATA, value }
}
export function getLoginUserData (key, value) {
  return { type: GET_LOGIN_DATA, key, value }
}
