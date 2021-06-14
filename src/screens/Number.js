import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../components/Container'
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import APICaller from '../util/apiCaller'
import Http from '../api/http'
import { Matrics } from '../common/styles'
// import firebase from "react-native-firebase";
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../util/trackEventNames'
import { logEvent, events } from '../util/fbAnalytics'
import { Icon } from 'react-native-elements'
import ErrorDialog from '../components/ErrorDialog'
import { setLoginUserData } from '../store/actions'

class Number extends Component {
  constructor(props) {
    super(props)
    this.onPressFlag = this.onPressFlag.bind(this)
    this.selectCountry = this.selectCountry.bind(this)

    this.state = {
      screenName: props.navigation.state.params.screenName,
      cca2: 'my',
      selectCountryNumber: '+60',
      selected: undefined,
      phoneNumberText: '',
      countryCode: null,
      countryName: 'Malaysia',
      showErrorDialog: false,
      showLoader: false,
      countryModalOpen: false
    }
  }

  changeNumber(val) {
    this.setState({
      phoneNumberText: val
    })
  }

  onValueChange(value) {
    this.setState({
      selected: value
    })
  }

  componentDidMount() {
    AsyncStorage.setItem('CCA2', 'MY')
    this.setState({
      pickerData: this.phone.getPickerData(),
      phoneNumberText: '',
      countryCode: null,
      showLoader: false
    })
  }

  onPressFlag() {
    this.setState({ countryModalOpen: true })
  }

  selectCountry(country) {
    this.setState({ countryName: country.name })
    AsyncStorage.setItem('CCA2', country.cca2)
    this.phone.selectCountry(country.cca2.toLowerCase())
    this.setState({ cca2: country.cca2 })
    this.setState({ selectCountryNumber: `+` + country.callingCode[0] })
  }

  registerNumber = () => {
    if (!global.networkConnection) return
    const numberText = this.state.phoneNumberText
    if (!numberText) {
      this.setState({
        NumberError: 'Please Enter Valid Number'
      })
      return
    }
    if (numberText.length > 15) {
      this.setState({
        NumberError: 'Please Enter Valid Number'
      })
      return
    }
    if (numberText.length < 6) {
      this.setState({
        NumberError: 'Please Enter Valid Number'
      })
      return
    }

    this.setState({
      conturyCode: this.phone.getValue(),
      showLoader: true
    })

    var code = this.state.selectCountryNumber.replace('+', '')
    var number = numberText.substring(0, code.length)

    if (code === number) {
      number = numberText.substring(code.length, numberText.length)
    } else {
      number = numberText
    }

    const body = {
      phoneNo: '+' + code + number
    }
    AsyncStorage.removeItem('accountInfo')
    this.props.setLoginUserData(null)
    APICaller(Http.preCheck, 'POST', '', JSON.stringify(body)).then((json) => {
      if (!json.data.facebookLinked && !json.data.passwordSet) {
        APICaller(Http.pinRequest, 'POST', '', JSON.stringify(body)).then(
          (json) => {
            this.setState({ showLoader: false, phoneNumberText: '' })
            if (!json) return
            if (json.status === 200) {
              AsyncStorage.getItem('CCA2').then((res) => {
                if (res) {
                  this.setState({ cca2: res })
                } else {
                  this.setState({ cca2: 'MY' })
                }
              })
              analytics().logEvent(trackerEventSubmit.login.action.enterNumber)
              // tracker.trackEvent(trackerEventConfig.login.category, trackerEventConfig.login.action.enterNumber);
              logEvent(trackerEventSubmit.login.action.enterNumber)
              this.setState(
                {
                  showLoader: false,
                  phoneNumberText: ''
                },
                () => {
                  this.props.navigation.navigate('Otp', {
                    phoneNo: number,
                    countryCode: code,
                    screenName: this.state.screenName,
                    countryName: this.state.countryName
                  })
                }
              )
            } else {
              this.displayError()
            }
          }
        )
      } else {
        this.setState(
          {
            showLoader: false,
            phoneNumberText: ''
          },
          () => {
            this.props.navigation.navigate('PreCheck', {
              phoneNo: number,
              countryCode: code,
              screenName: this.state.screenName,
              countryName: this.state.countryName,
              loginOptions: json.data
            })
          }
        )
      }
    })
  }

  _navigationBack = () => {
    this.setState({ showLoader: false, phoneNumberText: '' })
    this.props.navigation.goBack()
  }

  _navigationBack = () => {
    this.setState({ showLoader: false, phoneNumberText: '' })
    this.props.navigation.goBack()
  }

  _viewHeader() {
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
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='numberBackBtn'
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

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  render() {
    const { showLoader } = this.state
    return (
      <Container style={styles.header}>
        <View style={{ flex: 1 }}>
          {this._viewHeader()}

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
          >
            {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding"> */}
            <View style={{ flex: 1, paddingLeft: 20 }}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  marginTop: 50
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 25,
                    color: '#000',
                    textAlign: 'left'
                  }}
                >
                  Enter Your{'\n'}Mobile Number
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingTop: 30
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    height: 40,
                    width: '25%',
                    borderColor: '#E7EAF2',
                    borderWidth: 1,
                    borderRadius: 5
                  }}
                >
                  <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                    <PhoneInput
                      ref={(ref) => {
                        this.phone = ref
                      }}
                      initialCountry='my'
                      onPressFlag={this.onPressFlag}
                      value={this.state.selectCountryNumber}
                      onChangePhoneNumber={(text) => {
                        this.setState({ selectCountryNumber: text })
                      }}
                    />
                    <CountryPicker
                      onSelect={(value) => this.selectCountry(value)}
                      translation='eng'
                      withAlphaFilter={true}
                      withCountryNameButton={true}
                      withFlag={true}
                      withEmoji={true}
                      cca2={this.state.cca2}
                      placeholder=''
                      modalProps={{
                        visible: this.state.countryModalOpen
                      }}
                      onClose={() => this.setState({ countryModalOpen: false })}
                      containerButtonStyle={{
                        height: 0,
                        width: 0
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    marginLeft: 10,
                    height: 40,
                    width: '65%',
                    borderColor: '#E7EAF2',
                    borderWidth: 1,
                    borderRadius: 5
                  }}
                >
                  <TextInput
                    testID='mobileNumber'
                    placeholder='Your Mobile Number'
                    maxLength={15}
                    value={this.state.phoneNumberText}
                    style={{
                      fontSize: 16,
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                    placeholderTextColor='#666'
                    keyboardType='phone-pad'
                    onChangeText={(val) => {
                      this.changeNumber(val)
                      if (val.length > 0) {
                        this.setState({ NumberError: null })
                      }
                    }}
                    accessible={true}
                    accessibilityLabel='numbmerScreenMobInput'
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(12),
                    marginTop: 5,
                    textAlign: 'left'
                  }
                ]}
              >
                Fill in your mobile number to Login via OTP
              </Text>

              {this.state.NumberError && (
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'red',
                      textAlign: 'center',
                      margin: Matrics.ScaleValue(5)
                    }}
                  >
                    {this.state.NumberError}
                  </Text>
                </View>
              )}

              <View style={styles.bottomButton}>
                <View
                  style={{
                    ...styles.styleViewShadow,
                    backgroundColor:
                      this.state.phoneNumberText.length < 9
                        ? '#EBEEF5'
                        : '#00D291'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      !showLoader && this.registerNumber()
                    }}
                    accessible={true}
                    accessibilityLabel='numberCompNextBtn'
                  >
                    {showLoader == true ? (
                      <ActivityIndicator
                        size={Platform.OS == 'ios' ? 1 : 30}
                        color='white'
                      />
                    ) : (
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 15,
                          textAlign: 'center',
                          color:
                            this.state.phoneNumberText.length < 9
                              ? '#9AA1A9'
                              : '#EBEEF5'
                        }}
                      >
                        Next
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerview: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20
  },
  bottomButton: {
    marginTop: 70,
    marginRight: Matrics.ScaleValue(20),
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  styleViewShadow: {
    justifyContent: 'center',
    backgroundColor: '#EBEEF5',
    height: Matrics.ScaleValue(35),
    width: '30%',
    borderRadius: 5
  },
  bytapText: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  }
})
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
    ...bindActionCreators({ setLoginUserData }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Number)
