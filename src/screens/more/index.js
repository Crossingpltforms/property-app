import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  Linking,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import style from './style'
import { withNavigationFocus } from 'react-navigation'
import NetcoreSDK from 'smartech-react-native'
import AboutUsImage from '../../../Images/More/about_us.png'
import ContactUsImage from '../../../Images/More/contact_us.png'
import { assets } from '../../../Images/index'
// import MediaImage from "../../../Images/More/media.png";
import HelpImage from '../../../Images/More/help.png'
// import BlogImage from "../../../Images/More/blog.png";
import InfoImage from '../../../Images/More/info.png'
import UserLoginImage from '../../../Images/More/user_login.png'
import UserLogoutImage from '../../../Images/More/user_logout.png'
import imgRentalCollection from '../../../Images/More/payment-method.png'
import imgReferFrd from '../../../Images/More/IC_REFER.png'
import { setLoginUserData } from '../../store/actions'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import { No_IMAGE_LINK } from '../../common/constants'
import { AccessToken, LoginManager } from 'react-native-fbsdk'

class More extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: '',
      token: '',
      userId: '',
      isLogin: false,
      showErrorDialog: false
    }
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.isUserLogin == true) {
      this.setState({ isLogin: true })
      this.getUserInfo()
    } else {
      this.setState({ isLogin: false })
    }
  }

  componentDidMount() {
    if (this.props.isUserLogin == true) {
      this.setState({ isLogin: true })
      this.getUserInfo()
    } else {
      this.setState({ isLogin: false })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      AsyncStorage.getItem('accountInfo').then((res) => {
        if (!res) {
          this.props.setLoginUserData(null)
          return
        }
      })
      if (this.props.isUserLogin == true) {
        this.setState({ isLogin: true })
        this.getUserInfo()
      } else {
        this.setState({ isLogin: false })
      }
    }
  }

  getUserInfo() {
    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then((response) => {
        if (response.status === 200) {
          if (response.data.name === 'Guest' || response.data.name === '') {
            this.setState({ isLogin: false })
            AsyncStorage.removeItem('accountInfo')
            this.props.setLoginUserData(null)
          } else {
            this.setState({ userData: response.data })
          }
        } else {
          this.displayError()
        }
      })
    }
  }

  fbLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then((result) => {
      AccessToken.getCurrentAccessToken().then((data) => {
        this.setState(
          {
            userData: {
              ...this.state.userData,
              facebookId: data.userID
            }
          },
          () => {
            this.updateUserAPICall()
          }
        )
      })
    })
  }

  updateUserAPICall = () => {
    let user_credentials = this.props.userLoginData
    let localUserData = { ...this.state.userData }
    delete localUserData.avatar
    APICaller(
      Http.updateProfileDetails(user_credentials.userId),
      'PUT',
      user_credentials.token,
      JSON.stringify(localUserData)
    ).then((json) => {
      LoginManager.logOut()
      // manual logout to show custom button for logout instead of facebook lib logout, keep track via facebookId from db
      if (json.status === 200) {
      } else {
        // TODO crashlytics
        alert('fail' + json)
      }
    })
  }

  handleLogin() {
    if (!this.state.isLogin) {
      AsyncStorage.removeItem('accountInfo')
      this.props.setLoginUserData(null)
      this.props.navigation.navigate('Number', {
        screenName: 'Home'
      })
    } else {
      this.displayConfirmationAlert()
      // AsyncStorage.removeItem("accountInfo");
      // this.setState({ isLogin: false })
    }
  }

  displayConfirmationAlert() {
    Alert.alert(
      '',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.removeItem('accountInfo')
            this.props.setLoginUserData(null)
            NetcoreSDK.logout()
            NetcoreSDK.clearIdentity()
            this.setState({ isLogin: false })
          }
        }
      ],
      { cancelable: false }
    )
  }

  _renderInfoPart() {
    return (
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Image
            testID='profileImg'
            style={style.profileImg}
            // defaultSource={require("../../../Images/avatar.png")}
            source={{
              uri:
                this.state.userData && this.state.userData.avatar
                  ? this.state.userData.avatar
                  : No_IMAGE_LINK
            }}
          />

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginLeft: 20
            }}
          >
            <Text style={style.TextStyleHeaderTag}>
              {this.state.userData.name}
            </Text>

            <Text style={[style.textStyle, { fontFamily: 'OpenSans-Light' }]}>
              {this.state.userData.email}
            </Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('EditPersonInfo')}
              accessible={true}
              accessibilityLabel='editPersonNavBtn'
            >
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[
                    style.textStyle,
                    {
                      textDecorationLine: 'underline',
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 13,
                      color: '#4885ED'
                    }
                  ]}
                >
                  Edit Profile
                </Text>
                {/* <Icon name="chevron-right" size={20} style={{ color: "#4885ED" }} /> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.state.userData.facebookId != 0 &&
          this.state.userData.facebookId ? (
            <TouchableOpacity
              style={{
                minHeight: 33,
                backgroundColor: '#4568B2',
                width: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginBottom: 20
              }}
              onPress={() => {
                this.setState(
                  {
                    userData: {
                      ...this.state.userData,
                      facebookId: 0
                    }
                  },
                  () => {
                    this.updateUserAPICall()
                  }
                )
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>
                Unlink facebook
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                width: 221,
                height: 33,
                backgroundColor: '#4568B2',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginBottom: 20,
                overflow: 'hidden'
              }}
              onPress={() => this.fbLogin()}
            >
              <Image source={assets.continueWithFB} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  _viewHeader() {
    console.log('this.state.userData', this.state.userData)
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000'
              }}
            >
              More
            </Text>
          </View>
        </View>
      </View>
    )
  }

  _openUrl = (url) => () => Linking.openURL(url)

  _navAboutUs = () => this.props.navigation.navigate('AboutUs')

  _navContactUs = () => this.props.navigation.navigate('ContactUs')

  _navLandlordHelp = () => this.props.navigation.navigate('LandlordHelp')

  _navTenantHelp = () => this.props.navigation.navigate('TenantHelp')

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  render() {
    return (
      <Container>
        {this._viewHeader()}

        <ScrollView
          contentContainerStyle={style.root}
          scrollEnabled={true}
          keyboardShouldPersistTaps={'handled'}
        >
          {this.state.isLogin ? (
            <View style={style.container}>
              {this._renderInfoPart()}
              <TouchableOpacity
                style={{ ...style.listStyle, marginTop: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('RentalCollection')
                }}
                accessible={true}
                accessibilityLabel='rentalCollNavBtn'
              >
                <Text style={[style.textStyle, { flex: 1 }]}>
                  Rental Collection
                </Text>
                <View>
                  <Image
                    testID='rentalCollection'
                    source={imgRentalCollection}
                    style={{ width: 27, height: 27, resizeMode: 'contain' }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...style.listStyle, marginTop: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('Refer', {
                    email: this.state.userData.email
                  })
                }}
                accessible={true}
                accessibilityLabel='referNavBtn'
              >
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Text style={[style.textStyle, {}]}>Refer a Friend</Text>
                  <View
                    style={{
                      backgroundColor: '#4885ED',
                      borderRadius: 5,
                      paddingLeft: 5,
                      paddingRight: 5,
                      marginLeft: 10
                    }}
                  >
                    <Text style={[style.textStyle, { color: 'white' }]}>
                      New
                    </Text>
                  </View>
                </View>
                <View>
                  <Image
                    testID='referFriend'
                    source={imgReferFrd}
                    style={{ width: 27, height: 27, resizeMode: 'contain' }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  height: 0.7,
                  backgroundColor: '#CFCFCF',
                  marginTop: 20
                }}
              />
            </View>
          ) : (
            <View />
          )}

          <View style={[style.listViewOne, { paddingBottom: 40 }]}>
            <View style={style.listContent}>
              <Text style={style.textAbout}>ABOUT SPEEDHOME</Text>
            </View>

            <TouchableOpacity
              onPress={this._navAboutUs}
              style={style.listContent}
              accessible={true}
              accessibilityLabel='aboutUsNavBtn'
            >
              <Text style={style.textOne}>About Us</Text>
              <Image
                testID='aboutUs'
                style={{ height: 20, width: 20 }}
                source={AboutUsImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._navContactUs}
              style={style.listContent}
              accessible={true}
              accessibilityLabel='contactUsNavBtn'
            >
              <Text style={style.textOne}>Contact Us</Text>
              <Image
                testID='contactUs'
                style={{ height: 20, width: 20 }}
                source={ContactUsImage}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={this._openUrl(
                "https://blog.speedhome.com/blog/pr-masterlist"
              )}
              style={style.listContent}
            >
              <Text style={style.textOne}>Media</Text>
              <Image source={MediaImage} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={this._navLandlordHelp}
              style={style.listContent}
              accessible={true}
              accessibilityLabel='landLoardHelpNavBtn'
            >
              <Text style={style.textOne}>Landlord Help</Text>
              <Image
                testID='helpLandlord'
                style={{ height: 20, width: 20 }}
                source={HelpImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._navTenantHelp}
              style={style.listContent}
              accessible={true}
              accessibilityLabel='tenantHelpNavBtn'
            >
              <Text style={style.textOne}>Tenant Help</Text>
              <Image
                testID='helpTenant'
                style={{ height: 20, width: 20 }}
                source={HelpImage}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={this._openUrl("https://blog.speedhome.com/blog")}
              style={style.listContent}
            >
              <Text style={style.textOne}>Blog</Text>
              <Image source={BlogImage} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AppDetail')
              }}
              style={style.listContent}
              accessible={true}
              accessibilityLabel='appDetailNavBtn'
            >
              <Text style={style.textOne}>Info</Text>
              <Image
                testID='info'
                style={{ height: 20, width: 20 }}
                source={InfoImage}
              />
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: 0.7,
                backgroundColor: '#CFCFCF',
                marginTop: 20
              }}
            />

            <TouchableOpacity
              onPress={() => {
                this.handleLogin()
              }}
              style={[style.listContent, { marginTop: 40 }]}
              accessible={true}
              accessibilityLabel='handleLoginBtn'
            >
              <Text
                style={[
                  style.textStyle,
                  { color: this.state.isLogin ? 'red' : 'green', width: 200 }
                ]}
              >
                {this.state.isLogin ? 'Log out ' : 'Login '}
              </Text>
              <Image
                testID='userLog'
                style={{ height: 20, width: 20 }}
                source={this.state.isLogin ? UserLogoutImage : UserLoginImage}
              />
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: 0.7,
                backgroundColor: '#CFCFCF',
                marginTop: 10
              }}
            />
          </View>
        </ScrollView>

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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(More))
