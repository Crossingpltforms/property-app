import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container from '../../components/Container'
import styles from './styles'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import { Matrics } from '../../common/styles'
// import firebase from 'react-native-firebase'
import { Icon } from 'react-native-elements'
import ErrorDialog from '../../components/ErrorDialog'
import { setLoginUserData, setLoginUserProfileData } from '../../store/actions'
import { assets } from '../../../Images/index'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import AsyncStorage from '@react-native-community/async-storage'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import NetCoreSDK from 'smartech-react-native'
import messaging from '@react-native-firebase/messaging'
import { ActivityIndicatorModal } from '../../common/components/activityIndicatorModal'

const PreCheck = (props) => {
  const [screenName, setScreenName] = useState('')
  const [countryName, setCountryName] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [phoneNo, setPhoneNo] = useState(null)
  const [token, setToken] = useState('')
  const [showErrorDialog, setshowErrorDialog] = useState(false)
  const [showFB, toggleFB] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [otpError, setotpError] = useState('')

  useEffect(() => {
    const params = props.navigation.state.params
    if (params) {
      setScreenName(params.screenName)
      setCountryName(params.countryName)
      setPhoneNo(params.phoneNo)
      setCountryCode(params.countryCode)
    }
  })
  useEffect(() => {
    const params = props.navigation.state.params
    const body = {
      phoneNo: params.countryCode + params.phoneNo
    }
    APICaller(`${Http.facebookConnect}`, 'POST', '', JSON.stringify(body)).then(
      (response) => {
        toggleFB(response.data.isAuthorised)
      }
    )
  }, [])

  const getUserData = () => {
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        let user_credentials = JSON.parse(res)
        setToken(user_credentials.token)
        APICaller(
          `${Http.profileDetails(user_credentials.userId)}/profile`,
          'GET',
          user_credentials.token,
          ''
        ).then(async (response) => {
          // console.log('response..', response)
          if (response && response.data && response.data.email) {
            // FB can't get name so update again with proper name
            const token = user_credentials.token
            const userId = user_credentials.userId
            const name = response.data.name
            const phone = countryCode + phoneNo
            const obj = { token, userId, name, phone }
            await AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
            props.setLoginUserData(obj)

            NetCoreSDK.login(response.data.email)
            const payLoadData = {
              NAME: response.data.name ? response.data.name : '',
              EMAIL_ADDRESS: response.data.email ? response.data.email : '',
              MOBILE: response.data.phoneNumber ? response.data.phoneNumber : ''
            }
            NetCoreSDK.profile(payLoadData)
          }
          props.setLoginUserProfileData(response.data ? response.data : null)
          if (response.data && response.data.country !== null) {
            setCountryName(response.data.country)
            saveInformation()
          } else {
            saveInformation()
          }
        })
      }
    })
  }
  const saveInformation = () => {
    if (!global.networkConnection) return
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        const data = JSON.parse(res)
        const body = {
          country: countryName
        }
        APICaller(
          Http.updateProfileDetails(data.userId),
          'PUT',
          data.token,
          JSON.stringify(body)
        ).then((json) => {
          if (!json) {
            return
          }
          if (json.status === 200) {
            analytics().logEvent(trackerEventSubmit.login.action.userLogin)

            setShowLoader(false)
            props.navigation.navigate(screenName, {
              token: token
            })
          } else {
            displayError()
          }
        })
      }
    })
  }

  const postToken = () => {
    if (!global.networkConnection) return
    let user_credentials = null
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        user_credentials = JSON.parse(res)
      }
    })
    AsyncStorage.getItem('fcmToken').then((res) => {
      if (res) {
        postTokenApiCall(res, user_credentials)
      } else {
        getDeviceToken(user_credentials)
      }
    })
  }
  const postTokenApiCall = (token, user_credentials) => {
    if (user_credentials.token) {
      const body = {
        cloudId: token
      }
      APICaller(
        Http.saveToken,
        'POST',
        user_credentials.token,
        JSON.stringify(body)
      ).then((json) => {
        if (json.status !== 200) {
          // displayError()
        } else {
          console.log('store successfully token')
        }
      })
    }
  }

  const getDeviceToken = (user_credentials) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          messaging()
            .getToken()
            .then((token) => {
              AsyncStorage.setItem('fcmToken', token)
              postTokenApiCall(token, user_credentials)
            })
        } else {
          messaging()
            .requestPermission()
            .then(() => {
              messaging()
                .getToken()
                .then((token) => {
                  AsyncStorage.setItem('fcmToken', token)
                  postTokenApiCall(token, user_credentials)
                })
            })
            .catch((error) => {})
        }
      })
  }
  const setAccInfo = async (response) => {
    const token = response.data.token
    const userId = response.data.userId
    const name = response.data.name
    const phone = countryCode + phoneNo
    const obj = { token, userId, name, phone }
    await AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
    props.setLoginUserData(obj)
  }

  const fbLogin = () => {
    setShowLoader(true)
    LoginManager.logInWithPermissions(['public_profile']).then(
      (result) => {
        console.log('result', result)
        AccessToken.getCurrentAccessToken().then((data) => {
          console.log('data', data)
          const fbBody = {
            accessToken: data.accessToken,
            phoneNo: countryCode + phoneNo
          }
          APICaller(
            `${Http.facebookVerify}`,
            'POST',
            '',
            JSON.stringify(fbBody)
          ).then((response) => {
            console.log('response', response)
            if (!response) return
            if (response.status === 401) {
              setShowLoader(false)
              props.navigation.navigate('BlockedUser')
              return
            }
            if (response.status === 200) {
              setToken(response.data.token)
              setAccInfo(response)
              analytics().logEvent(trackerEventSubmit.login.action.enterOTP)

              postToken()
              const name = response.data.name
              if (name === 'Guest') {
                setShowLoader(false)
                props.navigation.navigate('Confirm', {
                  screenName: screenName,
                  whatsappNumber: '+' + countryCode + phoneNo,
                  countryName: countryName
                })
              } else if (name === '') {
                setShowLoader(false)
                props.navigation.navigate('Confirm', {
                  screenName: screenName,
                  whatsappNumber: '+' + countryCode + phoneNo,
                  countryName: countryName
                })
              } else {
                getUserData()
              }
            } else {
              if (response.status === 422 || response.status === 500) {
                setotpError('Something went wrong. Try again.')
              } else {
                displayError()
              }
            }
          })
        })
      },
      function (error) {
        alert('Login failed with error: ' + error)
      }
    )
  }

  const AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '100%',
        height: 70,
        bottom: '10%',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: 'white'
        }}
      >
        {message.replace('null', 'empty')}
      </Text>
    </View>
  )
  const _navigationBack = () => props.navigation.goBack()
  const _viewHeader = () => {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'center'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => _navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='otpBackBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
            <Text
              style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  const displayError = () => {
    setshowErrorDialog(true)
  }
  return (
    <Container style={styles.header}>
      <View style={{ flex: 1 }}>
        {_viewHeader()}
        {showLoader && <ActivityIndicatorModal />}
        <View style={{ width: '100%', alignItems: 'center', marginTop: 30 }}>
          <Image source={assets.homeImg} style={{ height: 40, width: 40 }} />
        </View>
        <View
          style={{
            backgroundColor: '#ffffff',
            margin: 20,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              marginVertical: 20
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 18,
                color: '#000',
                textAlign: 'left'
              }}
            >
              Welcome
            </Text>
          </View>
          {showFB && (
            <TouchableOpacity
              style={{
                width: 270,
                height: 40,
                backgroundColor: '#4568B2',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginBottom: 20,
                overflow: 'hidden'
              }}
              onPress={() => fbLogin()}
            >
              <Image source={assets.continueWithFB} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              width: 270,
              height: 40,
              backgroundColor: '#FFE100',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginBottom: 20,
              overflow: 'hidden'
            }}
            onPress={() => {
              props.navigation.navigate('Otp', {
                phoneNo: phoneNo,
                countryCode: countryCode,
                screenName: screenName,
                countryName: countryName
              })
            }}
          >
            <Text>Request 4 digit OTP</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ErrorDialog
        modalVisible={showErrorDialog}
        headerText='Oops!'
        bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
        toggleModal={(value) => {
          setshowErrorDialog(false)
        }}
      />
    </Container>
  )
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      { setLoginUserData, setLoginUserProfileData },
      dispatch
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreCheck)
