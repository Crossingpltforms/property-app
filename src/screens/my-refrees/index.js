import React, { Component } from 'react'
import {
  Text,
  Image,
  ScrollView,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import Container from '../../components/Container'
import Invitereferrals from 'react-native-invitereferrals'
import Header from '../common/Header'
import style from './styles'
import Clipboard from '@react-native-community/clipboard'
import imgReferMain from '../../../Images/More/REFERRAL_MAIN.png'
import imgShare from '../../../Images/More/IC_SHARE.png'
import imgUploadProperty from '../../../Images/More/IC_UPLOAD_PROPERTY.png'
import imgReward from '../../../Images/More/IC_REWARD.png'
import { Matrics, Color } from '../../common/styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { Loader } from '../../common/components'

class MyReferees extends Component {
  constructor (props) {
    super(props)
    this.state = {
      displayToast: false,
      myRefereerData: [],
      displayLoader: false
    }
  }

  componentDidMount () {
    this.getMyRefereerListApi()
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

  displayToastMessage = () => {
    this.setState({ displayToast: true })
    setTimeout(() => {
      this.setState({ displayToast: false })
    }, 2000)
  }

  //------- API CALLIG..... -------//
  getMyRefereerListApi = () => {
    this.setState({ displayLoader: true })
    APICaller(
      Http.myRefereerList(this.props.userLoginData.userId),
      'GET',
      this.props.userLoginData.token,
      ''
    ).then(json => {
      this.setState({ displayLoader: false })
      if (json.status == 200) {
        this.setState({ myRefereerData: json.data })
      }
    })
  }

  //------- Render UI -------//
  renderRefereerInfoView = () => {
    const { myRefereerData } = this.state
    return (
      <View style={{ flex: 1 }}>
        <View style={style.myRefereeInfoViewContainer}>
          <Text
            style={[
              style.descriptionContentWithHeader_1,
              { marginTop: Matrics.ScaleValue(35) }
            ]}
          >
            My referees
          </Text>
          <View style={style.myRefereerInnerViewContainer}>
            <View style={style.myRefereerInfoChildContainer}>
              <Text
                style={[
                  style.mediumTextStyle,
                  { marginVertical: Matrics.ScaleValue(3) }
                ]}
              >
                Property rented out (
                {myRefereerData && myRefereerData.length > 0
                  ? myRefereerData[0].numberOfDeal
                  : 0}
                )
              </Text>
              <Text
                style={[
                  style.mediumTextStyle,
                  { marginVertical: Matrics.ScaleValue(3) }
                ]}
              >
                Property listed (
                {myRefereerData && myRefereerData.length > 0
                  ? myRefereerData[0].numberOfListing
                  : 0}
                )
              </Text>
              <Text
                style={[
                  style.mediumTextStyle,
                  { marginVertical: Matrics.ScaleValue(3) }
                ]}
              >
                Chat request received (
                {myRefereerData && myRefereerData.length > 0
                  ? myRefereerData[0].numberOfCr
                  : 0}
                )
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <Text
                style={[
                  style.mediumTextStyle,
                  { marginHorizontal: Matrics.ScaleValue(5) }
                ]}
              >
                RM{' '}
                {myRefereerData && myRefereerData.length > 0
                  ? myRefereerData[0].reward
                  : 0}
              </Text>
            </View>
          </View>
        </View>
        <View style={style.wantToMoreViewContainer}>
          <Icon name='people' size={35} color={Color.lightGray} />
        </View>
      </View>
    )
  }

  renderNoRefereerView = () => {
    return (
      <View>
        <View style={[style.wantToMoreViewContainer, { position: 'relative' }]}>
          <Icon name='assignment' size={35} color={Color.lightGray} />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: Matrics.ScaleValue(20)
          }}
        >
          <Text
            style={[
              style.descriptionContentWithHeader_1,
              { marginTop: Matrics.ScaleValue(20) }
            ]}
          >
            No referees yet
          </Text>
          <Text
            style={[
              style.mediumTextStyle,
              {
                marginTop: Matrics.ScaleValue(10),
                textAlign: 'center',
                fontSize: Matrics.ScaleValue(12)
              }
            ]}
          >
            If the property is rented out, you will get RM300*. Also your
            referral friends will get a RM100 discount on the tenancy agreement
            or insurance premium.
          </Text>
        </View>
      </View>
    )
  }

  //------- Render Cycle -------//
  render () {
    const { myRefereerData, displayLoader } = this.state
    const { width, height } = Dimensions.get('window')
    return (
      <Container style={style.root}>
        <Header headerTitle='My referees' navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={style.descriptionScrollView}>
          <View style={style.innerMainViewContainer}>
            {displayLoader && <Loader text='Loading...' />}
            {myRefereerData.length > 0
              ? this.renderRefereerInfoView()
              : this.renderNoRefereerView()}

            <View style={style.wantToMoreChildContainer}>
              <Text
                style={[
                  style.descriptionTitle,
                  { fontFamily: 'OpenSans-Bold', fontSize: 18 }
                ]}
              >
                Want to know more ?
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  marginVertical: height * 0.02
                }}
                onPress={() =>
                  Linking.openURL(`https://speedhome.com/more/refer/faq`)
                }
                accessible={true}
                accessibilityLabel='myRefreesScreenFQABtn'
              >
                <Text style={[style.bytapText, { fontSize: 12 }]}>
                  See frequently asked questions
                </Text>
                <View style={{ backgroundColor: 'blue', height: 0.5 }} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: 'column', marginBottom: height * 0.02 }}
                onPress={() =>
                  Linking.openURL(
                    `https://speedhome.com/more/refer/termscondition`
                  )
                }
                accessible={true}
                accessibilityLabel='myRefreesScreenTNCbtn'
              >
                <Text style={[style.bytapText, { fontSize: 12 }]}>
                  Terms and Conditions
                </Text>
                <View style={{ backgroundColor: 'blue', height: 0.5 }} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: 'column', marginBottom: height * 0.06 }}
                onPress={() =>
                  Linking.openURL(
                    `https://speedhome.com/blog/referral-program-reward-list/`
                  )
                }
                accessible={true}
                accessibilityLabel='myRefreesScreenEarnBtn'
              >
                <Text style={[style.bytapText, { fontSize: 12 }]}>
                  Find out who earned this week
                </Text>
                <View style={{ backgroundColor: 'blue', height: 0.5 }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Container>
    )
  }
}
function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyReferees)
