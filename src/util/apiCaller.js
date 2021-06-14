// import { Alert } from 'react-native';
import axios from 'axios'
import Http from '../api/http'

import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import VersionNumber from 'react-native-version-number'
import Helper from '../util/helper'
import { StackActions, NavigationActions } from 'react-navigation'

const staticPath = Http.APIURL
const appsVersion = VersionNumber.appVersion.replace('.', '_').replace('.', '_')

const isProduction = Http.PRODUCTION
// Authorization header
async function deviceUniqueId() {
  return await DeviceInfo.getUniqueId()
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: isProduction
    ? Platform.OS == 'ios'
      ? 'adm_oKSX8oSwkQcg4o3wYJN4RaMpPt2kWS'
      : 'adm_vAv5Vsq9ENJVAH7aVWShAR2q2ueL7D'
    : Platform.OS == 'ios'
      ? 'adm_LnyU4qLtvWpnzNeN7ENf5c4EZjNvP6'
      : 'adm_tiMYKQpDm8VAhtBngyRwFLXaE4aMv7',
  'X-OS-Version': Platform.OS == 'ios' ? `i_${appsVersion}` : `a_${appsVersion}`
}

// const isItProfileAPI = endPoint => {
//   const slices = endPoint.split('/')
//   return slices.length === 3 && slices[0] === 'users' && slices[2] === 'profile'
// }

const APICaller = async (endPoint, method, token, body) => {
  // console.log("body", body);
  // console.log("method", method);
  // console.log("token", token);
  // console.log("endPoint", endPoint);

  let uId = await deviceUniqueId()
  const userToken = await Helper.getLocalStorageItem('accountInfo', 'token')

  let headerToken = userToken || token || ''
  // console.log(headerToken, "headerToken");
  return await axios({
    method: method || 'GET',
    url: `${staticPath}/${endPoint}`,
    data: body,
    headers: headerToken
      ? { ...headers, Authorization: headerToken, 'X-Device-ID': uId }
      : { ...headers, 'X-Device-ID': uId }
  })
    .then(response => {
      return response
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 401) {
          Helper.logout()
          if (`${endPoint}` !== Http.pinVerify) {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'BlockedUser' })]
              })
            )
          }
          return { data: '', status: 401 }
        }
        return {
          data: error.response.data ? error.response.data : '',
          status: error.response.status ? error.response.status : ''
        }
      } else {
        return { data: 'network error', status: 1000 }
      }
    })
}

export default APICaller
