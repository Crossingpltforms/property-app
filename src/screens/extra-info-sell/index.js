import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  BackHandler,
  Dimensions,
  Alert
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
// Custom Components
import Header from '../common/Header'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon } from 'react-native-elements'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Referral from 'react-native-invitereferrals'

// Import style
import style from './styles'

import Advertisement from '../../../Images/advertisement1.png'
import imgUpadateInactive from '../../../Images/IC_LISTING_LIVE.png'

import Furnishing from './Furnishing'
import Facilities from './Facilities'
import DateTimePicker from 'react-native-modal-datetime-picker'
import ModalSelector from 'react-native-modal-selector'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { Matrics } from '../../common/styles'
// import { CheckBox } from 'native-base'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import CongratulationsPopup from '../../components/CongratulationPopup'
import { setLoginUserData } from '../../store/actions'

let date = new Date()
date.setDate(date.getDate() + 1) // tomorrow
const minDateValue = date.toISOString()
const { width, height } = Dimensions.get('window')

class ExtraInfoSell extends Component {
  constructor (props) {
    super(props)

    this.initialState = {
      furnishing: {
        nameOfPerson: 'your friend',
        showReferralDialog: false,

        curtain: false,
        mattress: false,
        ac: false,
        hood_hub: false,
        water_heater: false,
        dining_table: false,
        wardrobe: false,
        kitchen_cabinet: false,
        refrigerator: false,
        washingMachine: false,
        sofa: false,
        oven: false,
        microwave: false,
        tv: false,
        bedFrame: false,
        internet: false
      },
      facilities: {
        barbeque_area: false,
        covered_parking: false,
        gymnasium: false,
        basketball: false,
        restaurant: false,
        dobby: false,
        nursery: false,
        playground: false,
        tennis_court: false,
        twenty_four_hr_security: false,
        mart: false,
        squash_court: false,
        badminton: false,
        elevator: false,
        swimmingPool: false,
        Sauna: false
      },

      isBomiLot: false,
      isAcceptAllRaces: false,
      isPetFriendly: false,
      isDateTimePickerVisible: false,
      avalible_date: '',
      // title_type: "Choose one",
      show_date: 'Date(dd/mm/yyyy)',
      minimum_stay: 0,
      description: '',
      minimum_stay_data: [
        { key: 1, section: true, label: '0' },
        { key: 2, section: false, label: '1' },
        { key: 3, section: false, label: '2' },
        {
          key: 4,
          section: false,
          label: '3'
        },
        { key: 5, section: false, label: '4' },
        { key: 6, section: false, label: '5' },
        { key: 7, section: false, label: '6' },
        { key: 8, section: false, label: '7' },
        { key: 9, section: false, label: '8' },
        { key: 10, section: false, label: '9' },
        { key: 11, section: false, label: '10' },
        { key: 12, section: false, label: '11' }
      ],
      alertMessage: '',
      allData: this.props.navigation.state.params.bodyData
      // leaseTypeData: [
      //   { key: 1, section: false, label: "Lease Hold" },
      //   { key: 2, section: false, label: "Free Hold" }
      // ]
    }

    this.state = {
      ...this.initialState,
      minimumDate: new Date()
    }
  }

  UNSAFE_componentWillMount () {
    this.getUserInfo()

    AsyncStorage.setItem(
      'UpLoadImageData',
      JSON.stringify({
        route: 'ExtraInfoSell',
        bodyData: this.props.navigation.state.params.bodyData,
        id: this.props.navigation.getParam('id')
      })
    )

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    this.setState({
      description: this.props.navigation.state.params.bodyData.description
    })
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
        if (
          response.status === 403 ||
          response.status === 422 ||
          response.status === 401
        ) {
          Alert.alert(response.data.message)
        } else if (response.status === 200) {
          if (response.data.name === 'Guest' || response.data.name === '') {
            this.setState({ isLogin: false })
            AsyncStorage.removeItem('accountInfo')
            this.props.setLoginUserData(null)
          } else {
            this.setState({ userData: response.data })
            const token = user_credentials.token
            const userId = user_credentials.userId
            const name = response.data.name
            const email = response.data.email
            const phone = response.data.phoneNumber
            const obj = { token, userId, name, phone, email }
            AsyncStorage.setItem('accountInfo', JSON.stringify(obj))
            this.props.setLoginUserData(obj)
            Referral.tracking(
              'register',
              response.data.email,
              '23829',
              null,
              null,
              this.handleData
            )
          }
        }
      })
    }
  }

  handleData = res => {
    res = JSON.parse(res)
    if (res.response.conversion_details.conversion === 'success') {
      this.setState(
        { nameOfPerson: res.response.conversion_details.referrer_name },
        () => {
          this.setState({ showReferralDialog: true })
        }
      )
    } else {
      this.setState({ showReferralDialog: false })
    }
  }

  componentWillUnmount () {
    AsyncStorage.removeItem('UpLoadImageData')

    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick = () => {
    this.props.navigation.popToTop()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  _toggleCheckBox = (key_name, value, form_state) => () =>
    this.setState({
      ...this.state,
      [form_state]: { ...this.state[form_state], [key_name]: value }
    })

  _showDateTimePicker = () =>
    this.setState({ ...this.state, isDateTimePickerVisible: true })

  _hideDateTimePicker = () =>
    this.setState({ ...this.state, isDateTimePickerVisible: false })

  _handleDateTimePicker = date => {
    this.setState({
      ...this.state,
      avalible_date: `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1 < 10
          ? `0${date.getUTCMonth() + 1}`
          : date.getUTCMonth() + 1
      }-${
        date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()
      }T${
        date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
      }:${
        date.getUTCMinutes() < 10
          ? `0${date.getUTCMinutes()}`
          : date.getUTCMinutes()
      }:${
        date.getUTCSeconds() < 10
          ? `0${date.getUTCSeconds()}`
          : date.getUTCSeconds()
      }.${
        date.getUTCMilliseconds() < 10
          ? `0${date.getUTCMilliseconds()}`
          : date.getUTCMilliseconds()
      }Z`,
      // avalible_date: "2019-06-14T09:43:27.654Z",
      show_date: `${date.getUTCDate()}/${date.getUTCMonth() +
        1}/${date.getUTCFullYear()}`
    })
    this.setState({ isDateTimePickerVisible: false })
  }

  _nextFunction = () => {
    if (!global.networkConnection) return

    let body = {
      availability: this.state.avalible_date,
      // minimumstay: this.state.minimum_stay,
      // leaseType: this.state.title_type
      //   .split(" ")
      //   .join("")
      //   .toUpperCase(),
      description: this.state.description,
      petFriendly: this.state.isPetFriendly,
      allRaces: this.state.isAcceptAllRaces,
      bumiLot: this.state.isBomiLot,
      furnishes: Object.entries(this.state.furnishing)
        .filter(i => i[1])
        .map(i => i[0]),
      facilities: Object.entries(this.state.facilities)
        .filter(i => i[1])
        .map(i => i[0])
    }

    // if(this.state.title_type == "Choose one" || this.state.title_type == ""){
    //   this.setState({
    //     ...this.state,
    //     alertMessage: "Please select title type."
    //   });
    //   this._hideAlertView();
    // }
    if (this.state.show_date !== 'Date(dd/mm/yyyy)') {
      // tracker.trackEvent(
      //   trackerEventConfig.postProperty.category,
      //   trackerEventConfig.postProperty.action.createListing3
      // );
      analytics().logEvent(
        trackerEventSubmit.postProperty.action.createListing3
      )

      logEvent(trackerEventSubmit.postProperty.action.createListing3)

      // tracker.trackEvent(
      //   trackerEventConfig.postProperty.category,
      //   trackerEventConfig.postProperty.action.fillExtraInfo
      // );
      analytics().logEvent(trackerEventSubmit.postProperty.action.fillExtraInfo)

      logEvent(trackerEventSubmit.postProperty.action.fillExtraInfo)
      this.props.navigation.navigate('ConfirmGPS', {
        bodyData: body,
        allData: this.state.allData,
        id: this.props.navigation.getParam('id')
      })
      this._hideAlertView()
    } else {
      this.setState({
        ...this.state,
        alertMessage: 'Please select available date.'
      })
      this._hideAlertView()
      // }
    }
  }

  AlertView = message => {
    if (!message) return
    return (
      <View style={style.alertViewRoot}>
        <Text style={style.customText(15, 'white', 'normal')}>
          {message.replace('null', 'empty')}
        </Text>
      </View>
    )
  }

  _hideAlertView () {
    setTimeout(() => this.setState({ ...this.state, alertMessage: '' }), 2000)
  }

  appUpdatesBanner (bannerImage, title, desc1, desc2) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          accessible={true}
          accessibilityLabel='extraInfoSellBannerBtn'
        >
          <View style={style.updateAdBannerContainer}>
            <View style={style.updateAdBannerImage}>
              <Image
                testID='banner'
                source={bannerImage}
                style={{
                  width: Matrics.ScaleValue(75),
                  height: Matrics.ScaleValue(75)
                }}
                resizeMode='contain'
              />
            </View>
            <View style={style.updateAdBannerTextContainer}>
              <View style={style.updateAdBannerTextView}>
                <Text style={style.updateAdBannerTextTitle}>{title}</Text>
                {/* <TouchableOpacity style={style.updateAdBannerClose}>
                  <Icon
                    name={''}
                    size={Matrics.ScaleValue(18)}
                    style={{ color: '#4885ED' }}
                  />
                </TouchableOpacity> */}
              </View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={style.updateAdBannerTextChild}>{desc1}</Text>
                {/* <Text style={style.updateAdBannerTextChild}>{desc2}</Text> */}
              </View>
              <Text
                style={[
                  style.updateAdBannerTextChild,
                  {
                    fontFamily: 'OpenSans-Italic',
                    color: 'grey',
                    paddingBottom: 5,
                    flex: 1
                  }
                ]}
              >
                We just need a few more info and our team will review your
                listing soon.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={style.root}>
        <Header
          navigation={this.props.navigation}
          headerTitle='Extra Information'
          disableBackNavigation={false}
        />
        <ScrollView style={{ flex: 1 }}>
          {this.appUpdatesBanner(
            imgUpadateInactive,
            'Congratulations!',
            'Thank you for posting your listing on SPEEDHOME!',
            ''
          )}

          <View style={style.progressRoot}>
            <View style={style.progressView1}>
              <Text style={style.customText(14, 'black', 'normal')}>
                Step 3 of 3:{' '}
              </Text>
              <Text style={style.customText(14, 'black', 'bold')}>
                Extra Info
              </Text>
            </View>
          </View>

          {/* <View style={style.labelTop}>
            <Text style={style.labTopText}>Photo successfully uploaded!</Text>
          </View> */}

          {this.state.alertMessage !== '' &&
            this.AlertView(this.state.alertMessage)}

          <DateTimePicker
            datePickerContainerStyleIOS={{ paddingHorizontal: 40 }}
            minimumDate={this.state.minimumDate}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDateTimePicker}
            onCancel={this._hideDateTimePicker}
          />

          <Furnishing
            state={this.state}
            _toggleCheckBox={this._toggleCheckBox}
          />

          <Facilities
            state={this.state}
            _toggleCheckBox={this._toggleCheckBox}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10
            }}
          >
            <Text style={[style.furnishingLabel, { marginLeft: 0, flex: 1 }]}>
              Description
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flex: 1.5,
                marginTop: height * 0.025
              }}
            >
              <View style={{ flexDirection: 'column', width: '30%' }}>
                <View
                  style={{
                    height: Matrics.ScaleValue(10),
                    backgroundColor:
                      this.state.description.length <= 200
                        ? 'rgba(255, 12, 28, 1)'
                        : 'rgba(255, 169, 170, 1)',
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5
                  }}
                />
                <Text
                  style={[
                    style.formLabel,
                    {
                      textAlign: 'center',
                      marginTop: 2,
                      color:
                        this.state.description.length <= 200 ? 'black' : 'grey'
                    }
                  ]}
                >
                  Weak
                </Text>
              </View>

              <View style={{ width: '3%', height: Matrics.ScaleValue(10) }} />

              <View style={{ width: '30%', flexDirection: 'column' }}>
                <View
                  style={{
                    height: Matrics.ScaleValue(10),
                    backgroundColor:
                      this.state.description.length > 200 &&
                      this.state.description.length <= 350
                        ? 'rgba(255, 135, 40, 1)'
                        : 'rgba(255, 218, 173, 1)'
                  }}
                />
                <Text
                  style={[
                    style.formLabel,
                    {
                      textAlign: 'center',
                      marginTop: 2,
                      color:
                        this.state.description.length > 200 &&
                        this.state.description.length <= 350
                          ? 'black'
                          : 'grey'
                    }
                  ]}
                >
                  Medium
                </Text>
              </View>

              <View style={{ width: '3%', height: Matrics.ScaleValue(10) }} />

              <View style={{ width: '30%', flexDirection: 'column' }}>
                <View
                  style={{
                    height: Matrics.ScaleValue(10),
                    backgroundColor:
                      this.state.description.length > 350
                        ? 'rgba(0, 255, 52, 1)'
                        : 'rgba(160, 255, 174, 1)',
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5
                  }}
                />
                <Text
                  style={[
                    style.formLabel,
                    {
                      textAlign: 'center',
                      marginTop: 2,
                      color:
                        this.state.description.length > 350 ? 'black' : 'grey'
                    }
                  ]}
                >
                  Strong
                </Text>
              </View>
            </View>
          </View>

          <TextInput
            testID='description'
            style={style.descriptInput}
            numberOfLines={10}
            multiline={true}
            value={this.state.description}
            onChangeText={e => {
              this.setState({ ...this.state, description: e })
              if (e.length > 0) {
                this.setState({ alertMessage: null })
              }
            }}
            accessible={true}
            accessibilityLabel='extraInfoSellDescInput'
          />

          <View style={style.extraField}>
            <View style={[style.furnishingViewTab]}>
              <View>
                {/* <CheckBox
                  checked={this.state.isBomiLot}
                  style={
                    this.state.isBomiLot
                      ? [style.checkboxSelected, { marginRight: 10 }]
                      : [style.checkboxUnSelected, { marginRight: 10 }]
                  }
                  onPress={() => {
                    this.setState({
                      isBomiLot: !this.state.isBomiLot,
                    })
                  }}
                  accessible={true}
                  accessibilityLabel='extraInfoSellMainIsBomiLotCheckBox'
                /> */}
              </View>
              <View style={{ marginLeft: 10, width: '100%' }}>
                <Text
                  style={{
                    ...style.furnishingViewTabLabel,
                    fontWeight: '600'
                  }}
                >
                  This unit is Bumi Lot
                </Text>
              </View>
            </View>
            {/* <View style={[style.furnishingViewTab]}>
              <View>
                <CheckBox
                  checked={this.state.isPetFriendly}
                  style={
                    this.state.isPetFriendly
                      ? [style.checkboxSelected, { marginRight: 10 }]
                      : [style.checkboxUnSelected, { marginRight: 10 }]
                  }
                  onPress={() => {
                    this.setState({ isPetFriendly: !this.state.isPetFriendly });
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={style.furnishingViewTabLabel}>
                  Pet friendly
                </Text>
              </View>
            </View> */}
          </View>

          {/* <View style={style.form}>
            <Text style={style.formLabel}>Title type:</Text>
            <ModalSelector
              data={this.state.leaseTypeData}
              onChange={option => {
                let leaseType = this.state.leaseTypeData.map(i => ({
                  ...i,
                  section: option.label === i.label ? true : false
                }));

                this.setState({ leaseTypeData: leaseType });
                this.setState({ title_type: option.label });
              }}
              optionStyle={{
                backgroundColor: "white",
                borderRadius: 6,
                marginBottom: 2
              }}
              sectionStyle={{
                backgroundColor: "#FFDF00",
                borderRadius: 6,
                marginBottom: 2,
                padding: 8
              }}
            >
              <TouchableOpacity
                style={{
                  ...style.formInput,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <Text
                  style={
                    this.state.title_type === "Choose one"
                      ? {
                          fontSize: 9,
                          fontWeight: "normal",
                          color: "grey"
                        }
                      : {
                          fontSize: 9,
                          fontWeight: "normal",
                          color: "black"
                        }
                  }
                >
                  {this.state.title_type}
                </Text>
                <FontAwesome name='chevron-down' />
              </TouchableOpacity>
            </ModalSelector>
          </View> */}

          <View style={style.form}>
            <Text style={style.formLabel}>Availability date:</Text>
            <TouchableOpacity
              style={style.formInput}
              onPress={this._showDateTimePicker}
              accessible={true}
              accessibilityLabel='extraInfoSellDatePickerBtn'
            >
              <Text
                style={
                  this.state.show_date === 'Date(dd/mm/yyyy)'
                    ? {
                        fontSize: 9,
                        fontWeight: 'normal',
                        color: 'grey'
                      }
                    : {
                        fontSize: 9,
                        fontWeight: 'normal',
                        color: 'black'
                      }
                }
                onPress={this._showDateTimePicker}
              >
                {this.state.show_date}
              </Text>
            </TouchableOpacity>
          </View>

          {/* <Image
            source={Advertisement}
            style={{
              width: Matrics.screenWidth - 30,
              height: 100,
              marginTop: 20,
              marginBottom: 20
            }}
            resizeMode={"stretch"}
          /> */}

          <View
            style={{
              ...style.form,
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {/* <TouchableOpacity
              onPress={this._navigationBack}
              style={style.formBack}
            >
              <Icon name='arrow-back' size={15} style={style.headerLeftArrow} />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={style.nextButton}
              onPress={this._nextFunction}
              accessible={true}
              accessibilityLabel='extraInfoSellFinishBtn'
            >
              <Text style={style.nextButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {this.state.showReferralDialog === true ? (
          <CongratulationsPopup
            modalVisible={this.state.showReferralDialog}
            headerText='Congratulations'
            bodyText={` Congratulations , you have posted a property under referral of user ${this.state.nameOfPerson}`}
            toggleModal={value => {
              if (value === false) {
                this.setState({ showReferralDialog: false })
                AsyncStorage.setItem('referral', 'referred')
              }
            }}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }
}
function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData
  }
}
function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setLoginUserData }, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExtraInfoSell)
