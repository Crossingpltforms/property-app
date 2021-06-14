import AsyncStorage from '@react-native-community/async-storage'
import NetcoreSDK from 'smartech-react-native'

const Helper = {
  getLocalStorageItem (key, value) {
    return AsyncStorage.getItem(key).then(res => {
      if (!res) return null
      const response = JSON.parse(res)
      if (value) {
        return response.token
      }
      return response
    })
  },

  logout () {
    AsyncStorage.removeItem('accountInfo')
    NetcoreSDK.logout()
    NetcoreSDK.clearIdentity()
  }
}

export default Helper
