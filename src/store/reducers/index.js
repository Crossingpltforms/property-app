import { combineReducers } from 'redux'

import login from './Login'
import editPersonInfo from './Edit-Person-Info'
import loginData from './LoginData'

const rootReducer = combineReducers({
  login,
  loginData,
  editPersonInfo
})

export default rootReducer
