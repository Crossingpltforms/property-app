import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container from '../../components/Container'
import AsyncStorage from '@react-native-community/async-storage'
import TimerCountdown from '../../components/TimerCountdown'
import styles from './styles'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import { Matrics } from '../../common/styles'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { Icon } from 'react-native-elements'
import ErrorDialog from '../../components/ErrorDialog'
import NetCoreSDK from 'smartech-react-native'
import { setLoginUserData, setLoginUserProfileData } from '../../store/actions'
import messaging from '@react-native-firebase/messaging'
import Permissions from 'react-native-permissions'

const Otp = (props) => {
  const [screenName, setscreenName] = useState('')
  const [countryName, setcountryName] = useState('')
  const [countryCode, setcountryCode] = useState('')
  const [displayResendOTP, setdisplayResendOTP] = useState(false)
  const [phoneNo, setphoneNo] = useState(null)
  const [otp, setotp] = useState('')
  const [otpError, setotpError] = useState('')
  const [startTimer, setstartTimer] = useState(true)
  const [alert_message, setalert_message] = useState('')
  const [token, settoken] = useState('')
  const [nextClicked, setnextClicked] = useState(false)
  const [showErrorDialog, setshowErrorDialog] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {

    const params = props.navigation.state.params
    if (params) {
      setscreenName(params.screenName)
      setcountryName(params.countryName)
      setphoneNo(params.phoneNo)
      setcountryCode(params.countryCode)
    }
  })
  useEffect(() => {
    if (otp.trim().length === 4) {
      otpVerify()
    }
  }, [otp])

  const otpVerify = () => {
    if (!global.networkConnection) return
    if (otp.length !== 4) {
      setnextClicked(true)
      return
    }
    if (otp === '') {
      setotpError('Invalid OTP numbers entered. Try again')

      return
    }

    if (otp.length !== 0 && otp.length < 4) {
      setotpError('Invalid OTP numbers entered. Try again')

      return
    }

    setShowLoader(true)

    const body = {
      phoneNo: countryCode + phoneNo,
      code: otp
    }

    APICaller(Http.pinVerify, 'POST', '', JSON.stringify(body)).then((json) => {
      setShowLoader(false)
      if (!json) return
      if (json.status === 403) {
        props.navigation.navigate('BlockedUser')
        return
      }
      if (json.status === 200) {
        settoken(json.data.token)
        setotpError('')
        const token = json.data.token
        const userId = json.data.userId
        const name = json.data.name
        const phone = countryCode + phoneNo
        const obj = { token, userId, name, phone }
        AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
        props.setLoginUserData(obj)
        analytics().logEvent(trackerEventSubmit.login.action.enterOTP)
        logEvent(trackerEventSubmit.login.action.enterOTP)

        postToken()
        if (name === 'Guest') {
          props.navigation.navigate('Confirm', {
            screenName: screenName,
            whatsappNumber: '+' + countryCode + phoneNo,
            countryName: countryName
          })
        } else if (name === '') {
          props.navigation.navigate('Confirm', {
            screenName: screenName,
            whatsappNumber: '+' + countryCode + phoneNo,
            countryName: countryName
          })
        } else {
          getUserData()
        }
      } else {
        if (json.status === 401) {
          setotpError('Invalid OTP numbers entered. Try again.')
        } else {
          displayError()
        }
      }
    })
  }
  const getUserData = () => {
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        let user_credentials = JSON.parse(res)
        settoken(user_credentials.token)
        APICaller(
          `${Http.profileDetails(user_credentials.userId)}/profile`,
          'GET',
          user_credentials.token,
          ''
        ).then((response) => {
          // console.log('response..', response)
          if (response && response.data && response.data.email) {
            NetCoreSDK.login(response.data.email)
            const payloadata = {
              NAME: response.data.name ? response.data.name : '',
              EMAIL_ADDRESS: response.data.email ? response.data.email : '',
              MOBILE: response.data.phoneNumber ? response.data.phoneNumber : ''
            }
            NetCoreSDK.profile(payloadata)
          }
          props.setLoginUserProfileData(response.data ? response.data : null)
          if (response.data && response.data.country !== null) {
            setcountryName(response.data.country)
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

            logEvent(trackerEventSubmit.login.action.userRegistered)
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
            .catch((error) => { })
        }
      })

    /* Permissions.requestNotifications(['alert', 'sound']).then(
      async ({ status, settings }) => {
        if (status === 'authorized' || status === 'granted') {
          await messaging()
            .requestPermission()
            .then((value) => {
              if (value) {
                messaging()
                  .getToken()
                  .then((token) => {
                    AsyncStorage.setItem('fcmToken', token)
                    postTokenApiCall(token, user_credentials)
                  })
              }
            })
        }
      }
    ) */
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

  const registerNumber = () => {
    setalert_message('OTP sent successfully')

    _hideAlertView()
    setstartTimer(true)

    hideResentOtp()

    const body = {
      phoneNo: countryCode + phoneNo
    }
    APICaller(Http.pinRequest, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (json.status !== 200) {
          displayError()
        }
      }
    )
  }
  const displayResentOtp = () => {
    setstartTimer(false)
    setdisplayResendOTP(true)
  }
  const hideResentOtp = () => {
    setdisplayResendOTP(false)
  }
  const displayTimer = () => {
    return <TimerCountdown method={displayResentOtp} initialTime={60} />
  }
  const resendOTPView = () => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <Text
          style={[
            styles.bytapText,
            { fontSize: Matrics.ScaleValue(14), textAlign: 'left' }
          ]}
        >
          Didn&apos;t get the code?
        </Text>

        <TouchableOpacity
          onPress={() => {
            displayTimer()
            registerNumber()
          }}
          style={{ flexDirection: 'column', paddingLeft: 5 }}
          accessible={true}
          accessibilityLabel='otpResentBtn'
        >
          <Text
            style={[
              styles.bytapText,
              {
                fontSize: Matrics.ScaleValue(14),
                textAlign: 'left',
                color: 'blue'
              }
            ]}
          >
            RESEND
          </Text>
          <View style={{ backgroundColor: '#000', height: 0.5 }} />
        </TouchableOpacity>
      </View>
    )
  }

  const _hideAlertView = () => {
    setTimeout(() => setalert_message(''), 2000)
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

        <View style={{ flex: 1, paddingLeft: 20 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: 50
            }}
          >
            <TouchableOpacity accessible={true} accessibilityLabel='otpPassBtn'>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 25,
                  color: '#000',
                  textAlign: 'left'
                }}
              >
                One Time Password
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <Text
              style={[
                styles.bytapText,
                { fontSize: Matrics.ScaleValue(14), textAlign: 'left' }
              ]}
            >
              OTP sent to +{countryCode} {phoneNo}
            </Text>

            <Text style={{ marginLeft: 10 }}>
              {startTimer ? displayTimer() : ''}
            </Text>
          </View>

          <OTPInputView
            style={{
              width: '80%',
              height: Matrics.ScaleValue(40),
              marginTop: Matrics.ScaleValue(15)
            }}
            pinCount={4}
            // code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={(code) => {
              setotp(code.trim())
              setnextClicked(false)
              setotpError('')
            }}
            autoFocusOnLoad={true}
            codeInputFieldStyle={styles.roundedTextInput}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              setotp(code.trim())
            }}
          />

          {displayResendOTP && resendOTPView()}
          {otpError ? (
            <Text
              style={[
                styles.bytapText,
                {
                  fontSize: Matrics.ScaleValue(12),
                  textAlign: 'left',
                  color: 'red',
                  marginTop: 5
                }
              ]}
            >
              {otpError}
            </Text>
          ) : null}
          <View style={styles.bottomButton}>
            <View style={styles.styleViewShadow}>
              <TouchableOpacity
                style={{
                  backgroundColor: otp.length === 4 ? '#00D291' : '#EBEEF5',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5
                }}
                onPress={() => {
                  if (otp.trim().length === 4) {
                    !showLoader && otpVerify()
                  }
                }}
                accessible={true}
                accessibilityLabel='otpVerifyBtn'
              >
                {showLoader == true ? (
                  <ActivityIndicator
                    size={Platform.OS == 'ios' ? 1 : 25}
                    color='white'
                  />
                ) : (
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        textAlign: 'center',
                        color: otp.length === 4 ? '#fff' : '#9AA1A9'
                      }}
                    >
                      Next
                    </Text>
                  )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {alert_message !== '' && AlertView(alert_message)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Otp)
