import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../components/Container'
import APICaller from '../util/apiCaller'
import { updateProfileDetails, resetPassword } from '../api/http'
import { Matrics } from '../common/styles'
import { logEvent } from '../util/fbAnalytics'
import { Icon } from 'react-native-elements'
import ErrorDialog from '../components/ErrorDialog'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../util/trackEventNames'
import { setLoginUserData } from '../store/actions'
import NetCoreSDK from 'smartech-react-native'
import { assets } from '../../Images/index'
import {
  GraphRequest,
  GraphRequestManager,
  AccessToken,
  LoginManager
} from 'react-native-fbsdk'

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      email: null,
      emailError: null,
      nameError: null,
      whatsappError: null,
      screenName: props.navigation.state.params.screenName,
      whatsappNumber: props.navigation.state.params.whatsappNumber,
      mobileNumber: props.navigation.state.params.whatsappNumber,
      countryName: props.navigation.state.params.countryName,
      isLoading: false,
      editable: false,
      selectTextOnFocus: false,
      isAgreementSelected: true,
      showErrorDialog: false,
      facebookId: '',
      fbAccessToken: ''
    }
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  saveInformation() {
    if (!global.networkConnection) return
    if (!this.state.name) {
      this.setState({
        nameError: 'Please enter full name'
      })
      return
    }
    if (!this.state.email) {
      this.setState({
        emailError: 'Please enter email'
      })
      return
    }
    if (!this.validate(this.state.email)) {
      this.setState({
        emailError: 'Please enter valid email'
      })
      return
    }
    if (this.state.whatsappNumber == '') {
      this.setState({
        whatsappError: 'Please enter WhatsApp number'
      })
      return
    }
    if (
      this.state.whatsappNumber !== '' &&
      this.state.whatsappNumber.length < 10
    ) {
      this.setState({
        whatsappError: 'Please enter at least 10 characters'
      })
      return
    }

    this.showLoader()
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        const data = JSON.parse(res)

        const token = data.token
        const userId = data.userId
        const name = this.state.name
        const email = this.state.email
        const phone = this.state.mobileNumber
        const obj = {
          token,
          userId,
          name,
          phone,
          email
        }
        AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
        this.props.setLoginUserData(obj)
        let body = {
          name: this.state.name,
          email: this.state.email,
          whatsappNumber: this.state.whatsappNumber,
          country: this.state.countryName,
          avatar:
            'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        }
        if (this.state.facebookId && this.state.fbAccessToken) {
          body = {
            ...body,
            facebookId: this.state.facebookId,
            fbAccessToken: this.state.fbAccessToken
          }
        }
        APICaller(
          updateProfileDetails(data.userId),
          'PUT',
          data.token,
          JSON.stringify(body)
        ).then((json) => {
          if (!json) {
            this.hideLoader()
            return
          }
          // this.props.navigation.navigate("Otp");
          if (json.status === 200) {
              // this.props.navigation.navigate("Home");
              this.setState({ token: data.token })
              const token = data.token
              const userId = data.userId
              const name = this.state.name
              const phone = this.state.whatsappNumber
              const email = this.state.email
              const obj = { token, userId, name, phone, email }
              AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
              this.props.setLoginUserData(obj)

              NetCoreSDK.login(email)
              const payloadata = {
                NAME: name,
                EMAIL_ADDRESS: email,
                MOBILE: this.state.mobileNumber.replace('+', '')
              }
              NetCoreSDK.profile(payloadata)
              analytics().logEvent(trackerEventSubmit.login.action.userLogin, {
                email: this.state.email
              })
              logEvent(trackerEventSubmit.login.action.userLogin)
              this.hideLoader()
              this.props.navigation.navigate('Terms', {
                screenName: this.state.screenName
              })
          } else {
            this.hideLoader()
            this.displayError()
            Alert.alert(json.data.message)
          }
        })
      }
    })
  }

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(text) === false) {
      this.setState({ email: text })
      return false
    } else {
      this.setState({ email: text })
      return true
    }
  }

  fbLogin() {
    this.setState({
      isLoading: true
    })
    LoginManager.logInWithPermissions(['public_profile'])
      .then((result) => {
        AccessToken.getCurrentAccessToken().then((token) => {
          new GraphRequestManager()
            .addRequest(
              new GraphRequest(
                '/me',
                {
                  accessToken: token.accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name'
                    }
                  }
                },
                (err, res) => {
                  if (err) {
                    this.setState({
                      isLoading: false
                    })
                  } else {
                    this.setState({
                      name: res.name,
                      email: res.email,
                      facebookId: res.id,
                      fbAccessToken: token.accessToken,
                      isLoading: false
                    })
                  }
                }
              )
            )
            .start()
        })
      })
      .catch((err) => {
        console.log('Facebook current access token error ' + err)
        this.setState({
          isLoading: false
        })
      })
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error)
    } else {
      console.log('Success fetching data: ' + result)
    }
  }

  _navigationBack = () => this.props.navigation.goBack()

  gotoNextPage() {
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        const data = JSON.parse(res)
        this.props.navigation.navigate(this.state.screenName, {
          token: data.token
        })
      }
    })
  }

  render() {
    const { isLoading } = this.state

    return (
      <Container style={styles.header}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 30}
          >
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View
                style={{ width: '100%', alignItems: 'center', marginTop: 30 }}
              >
                <Image
                  source={assets.homeImg}
                  style={{ height: 40, width: 40 }}
                />
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
                    width: '90%',
                    marginHorizontal: 20,
                    alignItems: 'center'
                  }}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      paddingVertical: 20,
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ width: 30 }}></View>
                    <Text
                      style={{
                        fontSize: 22,
                        color: '#000',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      Profile
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Number', {
                          screenName: 'LoginOptions'
                        })
                      }
                      accessible={true}
                      accessibilityLabel='createListCloseIconBtn'
                      style={{ width: 30, alignItems: 'flex-end' }}
                    >
                      <Icon name='close' size={22} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: 45,
                      backgroundColor: '#4568B2',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      marginBottom: 20,
                      overflow: 'hidden'
                    }}
                    onPress={() => this.fbLogin()}
                  >
                    <Image source={assets.continueWithFB} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{ width: '90%', flexDirection: 'row', marginTop: 10 }}
                >
                  <View
                    style={{
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderTopColor: 'grey',
                      flex: 1
                    }}
                  ></View>
                  <Text style={{ marginHorizontal: 10, marginTop: -7 }}>
                    OR
                  </Text>
                  <View
                    style={{
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderTopColor: 'grey',
                      flex: 1
                    }}
                  ></View>
                </View>

                <View
                  style={{
                    width: '90%',
                    marginHorizontal: 20
                  }}
                >
                  <Text
                    style={[
                      styles.byTapText,
                      { fontSize: Matrics.ScaleValue(15), marginTop: 10 }
                    ]}
                  >
                    Full name
                  </Text>

                  <TextInput
                    testID='name'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderRadius: 10,
                      backgroundColor: '#EEEEEE',
                      paddingHorizontal: 10
                    }}
                    placeholder='Enter name'
                    placeholderTextColor='#9AA1A9'
                    onChangeText={(text) => {
                      this.setState({ name: text })
                      if (text.length > 0) {
                        this.setState({ nameError: null })
                      }
                    }}
                    value={this.state.name}
                    accessible={true}
                    accessibilityLabel='confirmScreenFNInput'
                  />

                  {this.state.nameError && (
                    <Text
                      style={[
                        styles.byTapText,
                        {
                          fontSize: Matrics.ScaleValue(12),
                          textAlign: 'left',
                          color: 'red',
                          marginTop: 5
                        }
                      ]}
                    >
                      {this.state.nameError}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.byTapText,
                      { fontSize: Matrics.ScaleValue(15), marginTop: 10 }
                    ]}
                  >
                    Email address
                  </Text>

                  <TextInput
                    testID='email'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderRadius: 10,
                      backgroundColor: '#EEEEEE',
                      paddingHorizontal: 10
                    }}
                    placeholder='test@gmail.com'
                    placeholderTextColor='#9AA1A9'
                    keyboardType='email-address'
                    onChangeText={(text) => {
                      this.setState({ email: text })
                      if (text.length > 0) {
                        this.setState({ emailError: null })
                      }
                    }}
                    value={this.state.email}
                    accessible={true}
                    accessibilityLabel='confirmScreenEmailInput'
                  />

                  {this.state.emailError && (
                    <Text
                      style={[
                        styles.byTapText,
                        {
                          fontSize: Matrics.ScaleValue(12),
                          textAlign: 'left',
                          color: 'red',
                          marginTop: 5
                        }
                      ]}
                    >
                      {this.state.emailError}
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.byTapText,
                      { fontSize: Matrics.ScaleValue(15), marginTop: 10 }
                    ]}
                  >
                    WhatsApp number
                  </Text>

                  <TextInput
                    testID='number'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderRadius: 10,
                      backgroundColor: '#EEEEEE',
                      paddingHorizontal: 10,
                      color: this.state.editable ? '#000' : '#9AA1A9'
                    }}
                    placeholder={this.state.whatsappNumber}
                    placeholderTextColor='#9AA1A9'
                    keyboardType='number-pad'
                    editable={this.state.editable}
                    onChangeText={(text) => {
                      this.setState({
                        whatsappNumber: text,
                        whatsappError: null
                      })
                    }}
                    value={this.state.whatsappNumber}
                    accessible={true}
                    accessibilityLabel='confirmScreenNumbInput'
                  />

                  {this.state.whatsappError && (
                    <Text
                      style={[
                        styles.byTapText,
                        {
                          fontSize: Matrics.ScaleValue(12),
                          textAlign: 'left',
                          color: 'red',
                          marginTop: 5
                        }
                      ]}
                    >
                      {this.state.whatsappError}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: Matrics.ScaleValue(3),
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      disabled={
                        this.state.whatsappNumber !== this.state.mobileNumber
                      }
                      onPress={() => {
                        this.setState({
                          isAgreementSelected: !this.state.isAgreementSelected,
                          editable: !this.state.editable,
                          selectTextOnFocus: !this.state.selectTextOnFocus
                        })
                      }}
                      accessible={true}
                      accessibilityLabel='confirmCheckBoxBtn'
                    >
                      <Icon
                        name={
                          this.state.isAgreementSelected
                            ? 'check-box'
                            : 'check-box-outline-blank'
                        }
                        size={Matrics.ScaleValue(18)}
                        color='#00D392'
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: Matrics.ScaleValue(12),
                        paddingLeft: Matrics.ScaleValue(10)
                      }}
                    >
                      Same as mobile number
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => this.saveInformation()}
                    accessible={true}
                    accessibilityLabel='AgreeNContBtn'
                    style={{
                      justifyContent: 'center',
                      backgroundColor: '#FFE100',
                      height: 50,
                      width: '100%',
                      borderRadius: 10,
                      marginVertical: 30
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        textAlign: 'center',
                        color: 'black'
                      }}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>

                  {/* <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                    paddingTop: 30,
                    paddingLeft: 35,
                    paddingRight: 35
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#000" }}>
                    By clicking "Continue", you are indicating that you have read
                    and understand the terms and conditions herein. If you do not
                    agree with the terms, please do not use this Application.
              </Text>
                </View>
              </View> */}

                  {/* <View style={{ flexDirection: "row" }}>
                <View style={{ paddingLeft: 35, paddingTop: 30, paddingBottom: 30 }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Terms", { name: this.state.name, email: this.state.email, whatsappNumber: this.state.whatsappNumber })}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#4885ED",
                        textAlign: "center",
                        textDecorationLine: "underline"
                      }}
                    >
                      Learn more about terms and condition
                </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    paddingTop: 30,
                    paddingLeft: 10,
                    paddingBottom: 30
                  }}
                >
                  <Icon
                    name="md-arrow-dropright"
                    style={{ color: "#4885ED", fontSize: 20 }}
                  />
                </View>
              </View> */}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {isLoading && (
            <View pointerEvents={'none'} style={styles.loadingStyle}>
              <ActivityIndicator
                animating={isLoading}
                size='large'
                color='grey'
              />
            </View>
          )}
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
    backgroundColor: '#FFE100'
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  loadingStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  byTapText: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: '#000',
    marginBottom: 5
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
export default connect(mapStateToProps, mapDispatchToProps)(Confirm)
