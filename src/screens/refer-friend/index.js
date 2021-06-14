import React, { Component } from 'react'
import {
  Text,
  Image,
  ScrollView,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
  BackHandler,
  Clipboard
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container from '../../components/Container'
import Invitereferrals from 'react-native-invitereferrals'
import Header from '../common/Header'
import style from './style'

import { No_IMAGE_LINK } from '../../common/constants/index'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import forum from '../../../Images/More/forum.png'
import description from '../../../Images/More/description.png'
import referShare from '../../../Images/More/refer-share-img.png'
import winner from '../../../Images/More/winner.png'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Color, Matrics } from '../../common/styles'
import { ShareDialog } from 'react-native-fbsdk'

class Refer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userId: '',
      userName: '',
      userEmail: props.navigation.state.params.email,
      userPhone: '',
      displayToast: false
    }
  }

  getUserInfo () {
    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        if (response.status === 200) {
          this.setState({ userData: response.data })
        }
      })
    }
  }

  componentDidMount () {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.getUserInfo()
      this.setState({
        userName: user_credentials.name,
        userEmail: this.state.userEmail,
        userPhone: user_credentials.phone,
        userId: user_credentials.userId
      })
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  handlePress = () => {
    Invitereferrals.inline_btn('23829')
  }

  displayToastMessage = () => {
    this.setState({ displayToast: true })
    setTimeout(() => {
      this.setState({ displayToast: false })
    }, 2000)
  }

  render () {
    const { height } = Dimensions.get('window')
    return (
      <Container style={style.root}>
        <Header
          headerTitle='Refer'
          navigation={this.props.navigation}
          myReferees={false}
        />

        <ScrollView contentContainerStyle={style.descriptionScrollView}>
          <View style={style.primaryBox}>
            <View style={style.userBox}>
              <Image
                style={style.profileImg}
                // defaultSource={require("../../../Images/avatar.png")}
                source={{
                  uri:
                    this.state.userData && this.state.userData.avatar
                      ? this.state.userData.avatar
                      : No_IMAGE_LINK
                }}
              />
              <View style={style.myReferOutterViewContainer}>
                <Text style={style.username}>
                  {this.state.userData ? this.state.userData.name : ''}
                </Text>
                <View style={style.myReferInnerViewContainer}>
                  <TouchableOpacity
                    style={style.myRefreesButtonContainer}
                    onPress={() => {
                      this.props.navigation.navigate('MyReferees')
                    }}
                  >
                    <Text style={style.myRefreeButtonTextStyle}>
                      My Referees
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={style.secondaryBox}>
              <Text style={style.descriptionTitle}>
                Introduce SPEEDHOME both get rewarded RM100. Want to know how?
              </Text>

              <View style={style.pointBox}>
                <Text style={style.point}>1</Text>
                <Text style={style.pointText}>
                  Share your unique link with your friends.
                </Text>
              </View>

              <View style={style.pointBox}>
                <Text style={style.point}>2</Text>
                <Text style={style.pointText}>
                  Your friend uploads property for rent or put a chat request
                  using your link.
                </Text>
              </View>

              <View style={style.pointBox}>
                <Text style={style.point}>3</Text>
                <Text style={style.pointText}>
                  If your friends make a deal, you get RM300* cash and your
                  friends get a RM100 discount from the SPEEDSIGN fee or
                  insurance premium.
                </Text>
              </View>

              <Text style={style.descriptionTitle}>Want to know more?</Text>

              <View style={style.pointBox}>
                <Image
                  source={forum}
                  style={style.imagePoint}
                  resizeMode='contain'
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    marginVertical: height * 0.01
                  }}
                  onPress={() =>
                    Linking.openURL(`https://speedhome.com/more/refer/faq`)
                  }
                  accessible={true}
                  accessibilityLabel='referFrndFAQBtn'
                >
                  <Text style={style.pointText}>
                    Frequently asked questions
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={style.pointBox}>
                <Image
                  source={description}
                  style={style.imagePoint}
                  resizeMode='contain'
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    marginVertical: height * 0.01
                  }}
                  onPress={() =>
                    Linking.openURL(
                      `https://speedhome.com/more/refer/termscondition`
                    )
                  }
                  accessible={true}
                  accessibilityLabel='referFrndTACBtn'
                >
                  <Text style={style.pointText}>Terms and Conditions</Text>
                </TouchableOpacity>
              </View>

              <View style={style.pointBox}>
                <Image
                  source={winner}
                  style={[style.imagePoint, { tintColor: Color.primary }]}
                  resizeMode='contain'
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    marginVertical: height * 0.01
                  }}
                  onPress={() =>
                    Linking.openURL(
                      `https://speedhome.com/blog/referral-program-reward-list/`
                    )
                  }
                  accessible={true}
                  accessibilityLabel='referFrndEarnedBtn'
                >
                  <Text style={style.pointText}>
                    Find out who earned this week
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={style.primaryBox}>
            <Image
              source={referShare}
              style={style.imageMain}
              resizeMode='contain'
            />

            <View style={style.secondaryBox}>
              <Text style={style.descriptionTitle}>
                Refer by sharing your link
              </Text>

              <View style={style.pointBox}>
                <Text style={style.pointText}>
                  Your link is worth a discount for your referral friends and
                  money for you! Your friends will gain a RM100 cash rebate by
                  registering through your link and done a deal while you will
                  be rewarded RM300*.
                </Text>
              </View>

              <View style={style.copyBox}>
                <Text
                  style={{
                    flex: 1,
                    paddingRight: 10
                  }}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {`https://speedhome.com/refer/` + `${this.state.userPhone}`}
                </Text>

                <TouchableOpacity
                  style={{ marginTop: 10, marginBottom: 10, paddingRight: 10 }}
                  onPress={() => {
                    Clipboard.setString(
                      `https://speedhome.com/refer/` + `${this.state.userPhone}`
                    )
                    this.displayToastMessage()
                  }}
                  accessible={true}
                  accessibilityLabel='referFrndCopyLnkBtn'
                >
                  <Text style={{ fontWeight: 'bold' }}>COPY LINK</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginBottom: 20
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    const url =
                      `https://www.facebook.com/sharer/sharer.php?u=` +
                      `https://speedhome.com/refer/` +
                      `${this.state.userPhone}`
                    const shareLinkContent = {
                      contentType: 'link',
                      contentUrl: url,
                      contentDescription: ''
                    }
                    ShareDialog.canShow(shareLinkContent)
                      .then(function (canShow) {
                        if (canShow) {
                          return ShareDialog.show(shareLinkContent)
                        }
                      })
                      .then(
                        function (result) {
                          if (result.isCancelled) {
                            // alert('Share operation was cancelled')
                          } else {
                            alert('Shared Successfully')
                          }
                        },
                        function (error) {
                          alert('Share failed with error: ' + error.message)
                        }
                      )
                    // const url =
                    //   `https://www.facebook.com/sharer/sharer.php?u=` +
                    //   `https://speedhome.com/refer/` +
                    //   `${this.state.userPhone}`
                    // Linking.openURL(url)
                  }}
                  accessible={true}
                  accessibilityLabel='referFrndShareBtn'
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 150,
                      height: 40,
                      backgroundColor: '#3b5998',
                      borderRadius: 30
                    }}
                  >
                    <FontAwesome
                      size={20}
                      color='#ffffff'
                      name='facebook'
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ color: '#ffffff', fontWeight: '800' }}>
                      Facebook
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    const url =
                      'whatsapp://send?text=' +
                      `https://speedhome.com/refer/` +
                      `${this.state.userPhone}`
                    Linking.openURL(url)
                  }}
                  accessible={true}
                  accessibilityLabel='referFrndWPbtn'
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 150,
                      height: 40,
                      backgroundColor: '#25D366',
                      borderRadius: 30
                    }}
                  >
                    <FontAwesome
                      size={20}
                      color='#ffffff'
                      name='whatsapp'
                      style={{ marginRight: 15 }}
                    />
                    <Text style={{ color: '#ffffff', fontWeight: '800' }}>
                      WhatsApp
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        {this.state.displayToast == true && (
          <View style={style.toastViewStyle}>
            <Text style={style.toastTextStyle}>Link Copied</Text>
          </View>
        )}
      </Container>
    )
  }
}
function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Refer)
