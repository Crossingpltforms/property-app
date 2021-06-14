import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  ScrollView,
  PermissionsAndroid,
  Platform,
  BackHandler
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text
} from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import CountryPicker from 'react-native-country-picker-modal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ModalSelector from 'react-native-modal-selector'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { logEvent } from '../../util/fbAnalytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { assets } from '../../../Images/index'
import {
  genderList,
  propertiesList,
  expertiseList,
  employmentTypeList,
  incomeList,
  noPaxList,
  No_IMAGE_LINK
} from '../../common/constants'
import { Matrics } from '../../common/styles'
import style from './style'
import { setLoginUserData } from '../../store/actions'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ActionSheet from 'react-native-action-sheet'

const VERIFIED = 'VERIFIED'
const COMPLETED = 'COMPLETED'
const PENDING = 'PENDING'
var BUTTONSiOS = ['Take a photo', 'Gallery', 'Cancel']

var BUTTONSandroid = ['Take a photo', 'Gallery']

var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 2

class EditPersonInfo extends Component {
  constructor(props) {
    super(props)
    let today = new Date()

    let minDate = new Date()
    minDate.setDate(today.getDate() + (today.getHours() >= 13 ? 1 : 0))

    this.state = {
      avatarSource: '',
      need_a_photo_grapher: true,
      loading_photo: false,
      propertyID: null,
      alertMessage: '',
      gender: '',
      userName: null,
      cca2: '',

      isDatePickerVisible: false,
      selectedDateObj: null,
      selectedDate: `dd/mm/yyyy`,
      minimumDate: today,

      genderList: genderList,
      propertiesList: propertiesList,
      expertiseList: expertiseList,
      employmentTypeList: employmentTypeList,
      incomeList: incomeList,
      noPaxList: noPaxList,
      zeroDepEligibilityStatus: PENDING,
      showCountryPicker: false
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
    this.state.genderList.map((val)=>{val.section = false}) //to reset gender selection
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      // console.log('...next props.', nextProps)
      {
        if (nextProps.contractType != null) {
          const arrContractType = this.state.employmentTypeList.map((val) => {
            if (
              val.label.toString().toLowerCase() ===
              (nextProps && nextProps != null)
                ? nextProps.contractType.toString().toLowerCase()
                : ''
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              employmentTypeList: arrContractType
            },
            () => {}
          )
        }
      }

      {
        if (nextProps.monthlyIncome != null) {
          const arrIncomeType = this.state.incomeList.map((val) => {
            if (
              val.label.toString().toLowerCase() ===
              nextProps.monthlyIncome.toString().toLowerCase()
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              incomeList: arrIncomeType
            },
            () => {}
          )
        }
      }

      {
        if (nextProps.gender != null) {
          const arrGenderType = this.state.genderList.map((val) => {
            if (
              val.label.toString().toLowerCase() ===
              nextProps.gender.toString().toLowerCase()
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              genderList: arrGenderType
            },
            () => {}
          )
        }
      }

      {
        if (nextProps.paxNumber != null) {
          const arrPaxType = this.state.noPaxList.map((val) => {
            if (
              val.label.toString().toLowerCase() ===
              nextProps.paxNumber.toString().toLowerCase()
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              noPaxList: arrPaxType
            },
            () => {}
          )
        }
      }
      if (nextProps.numberOfProperties !== this.props.numberOfProperties) {
        //Perform some operatio
        this.changeOptionInitial(
          this.state.propertiesList,
          String(this.props.numberOfProperties)
        ),
          this.changeOptionInitial(
            this.state.expertiseList,
            this.props.experience
          )
      } else {
        this.changeOptionInitial(
          this.state.propertiesList,
          String(this.props.numberOfProperties)
        ),
          this.changeOptionInitial(
            this.state.expertiseList,
            this.props.experience
          )
      }
      return true
    }
    if (this.state != nextState) {
      return true
    }
    return false
  }

  // used this API to get zero deposit eligibility status
  getUserDocAPI = () => {
    let data = this.props.userLoginData
    APICaller(Http.getUserDocuments(data.userId), 'GET', data.token, '').then(
      (response) => {
        if (
          response &&
          response.verificationStatus &&
          response.verificationStatus === VERIFIED
        ) {
          this.setState({
            zeroDepEligibilityStatus: VERIFIED
          })
        } else if (
          response &&
          response.data &&
          response.data.documentFileDtoList &&
          response.data.documentFileDtoList.length > 0
        ) {
          this.setState({
            zeroDepEligibilityStatus: COMPLETED
          })
        } else {
          this.setState({
            zeroDepEligibilityStatus: PENDING
          })
        }
      }
    )
  }

  componentDidMount() {
    if (this.props.type === 0) {
      this.setState({ isLand: false, isTenant: true })
    } else {
      this.setState({ isLand: true, isTenant: false })
    }
    if (this.props.isUserLogin == true) {
      let data = this.props.userLoginData
      this.setState({ userName: data.name })
      this.setState({ token: data.token })
      this.setState({ customer_id: data.userId })
      this.props.getProfileDetails(
        { cid: data.userId, token: data.token },
        (res) => {
          this.manageTextFields(res)
        },
        () => {}
      )
      this.getUserDocAPI()
    }
    AsyncStorage.getItem('CCA2').then((res) => {
      if (res) {
        this.setState({ cca2: res })
      } else {
        this.setState({ cca2: 'MY' })
      }
    })
  }

  manageTextFields = (data) => {
    if (data) {
      this.props.updateInputFields('name', data.name)
      this.props.updateInputFields('email', data.email)
      this.props.updateInputFields('phone_number', data.phoneNumber)
      this.props.updateInputFields('country', data.country)
      this.props.updateInputFields('occupation', data.occupation)
      this.props.updateInputFields('profile_image', data.avatar)
      this.props.updateInputFields('whatsappNumber', data.whatsappNumber)
      this.props.updateUserType('type', data.type)
      if (data.propertiesOwned === 11) {
        this.props.updateInputFields('numberOfProperties', '10+')
      } else {
        this.props.updateInputFields('numberOfProperties', data.propertiesOwned)
      }
      this.props.updateInputFields('experience', data.experience)
      this.props.updateInputFields('companyName', data.companyName)
      this.props.updateInputFields('contractType', data.contractType)
      this.props.updateInputFields('monthlyIncome', data.monthlyIncome)
      this.props.updateInputFields('paxNumber', data.paxNumber)
      this.props.updateInputFields('reasonForMove', data.reasonForMove)
      this.props.updateInputFields('cityOfLiving', data.cityOfLiving)
      this.props.updateInputFields('dob', data.dob)
      if(data.gender==null){this.state.genderList.map((val)=>{val.section = false})} //to reset gender selection
      this.props.updateInputFields('gender', data.gender)
    }
  }

  _updateErrorAlert(field) {
    this.props.updateErrorAlert(field)
  }

  _updateProfile = () => {
    let incomeMonthly = 0
    if (
      this.props.monthlyIncome &&
      this.props.monthlyIncome === 'Less than 2k'
    ) {
      incomeMonthly = 1999
    } else if (
      this.props.monthlyIncome &&
      this.props.monthlyIncome === '2k - 4k'
    ) {
      incomeMonthly = 2000
    } else if (
      this.props.monthlyIncome &&
      this.props.monthlyIncome === '4k - 8k'
    ) {
      incomeMonthly = 4000
    } else if (
      this.props.monthlyIncome &&
      this.props.monthlyIncome === 'More than 8k'
    ) {
      incomeMonthly = 8000
    }

    if (!this.props.name) {
      this.scrollRef.scrollTo(0)
      this._updateErrorAlert('name')
    } else if (!this.props.email) {
      this.scrollRef.scrollTo(0)
      this._updateErrorAlert('email')
    } else if (!this.validate(this.props.email)) {
      this.scrollRef.scrollTo(0)
      this._updateErrorAlert('email_valid')
    } else if (!this.props.phone_number) {
      this.scrollRef.scrollTo(0)
      this._updateErrorAlert('phone_number')
    } else if (
      this.props.whatsappNumber &&
      this.props.whatsappNumber !== '' &&
      this.props.whatsappNumber.length < 10
    ) {
      this._updateErrorAlert('whatsappNumber')
    } else if (!this.props.dob) {
      this._updateErrorAlert('date_of_birth')
    } else if (!this.props.gender) {
      this._updateErrorAlert('gender')
    } else if (!this.props.cityOfLiving) {
      this._updateErrorAlert('cityOfLiving')
    } else {
      this._updateErrorAlert('')
      let body = {
        avatar:
          this.state.avatarSource != '' ? this.state.avatarSource.base64 : '',
        name: this.props.name,
        email: this.props.email,
        phoneNumber: this.props.phone_number,
        country: this.props.country,
        occupation: this.props.occupation,
        whatsappNumber: !this.props.whatsappNumber
          ? this.props.phone_number
          : this.props.whatsappNumber,
        type: this.props.type,
        gender: this.props.gender,
        propertiesOwned:
          this.props.numberOfProperties == '10+'
            ? 11
            : this.props.numberOfProperties,
        experience: this.props.experience,
        companyName: this.props.companyName,
        contractType: this.props.contractType,
        monthlyIncome: incomeMonthly,
        paxNumber: this.props.paxNumber,
        reasonForMove: this.props.reasonForMove,
        cityOfLiving: this.props.cityOfLiving,
        dob: this.props.dob
      }
      if (this.props.isUserLogin == true) {
        let user_details = this.props.userLoginData
        this.props.updateProfileDetailsAction(
          {
            customer_id: user_details.userId,
            token: user_details.token,
            body: body
          },
          (res) => {
            if (res != null && res.status == 200) {
              this.props.getProfileDetails(
                { cid: user_details.userId, token: user_details.token },
                (res) => {
                  this.manageTextFields(res)
                },
                () => {}
              )
              analytics().logEvent(
                trackerEventSubmit.user.action.updateProfile,
                body
              )
              logEvent(trackerEventSubmit.user.action.updateProfile, body)
              this.props.updateInputFields('on_loading', false)
            } else {
              this.props.updateInputFields('on_loading', false)
            }
          },
          (error) => {
            if (error && error.data && error.data.message) {
              alert(error && error.data && error.data.message)
            }
            this.props.updateInputFields('on_loading', false)
          }
        )
      }
    }
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

  _updateInputFields = (key) => (value) =>
    this.props.updateInputFields(key, value)

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='editPersonBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Edit personal info
            </Text>
          </View>
          {/* <TouchableOpacity onPress={() => this.logoutOption()}>
            <FontAwesome name="sign-out" size={30} color="black" />
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }

  _imagePikcer = () => {
    // this.setState({ ...this.state, loading_photo: true })

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        (status) => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ).then((storagePermission) => {
              if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                ActionSheet.showActionSheetWithOptions(
                  {
                    options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    tintColor: 'blue'
                  },
                  (buttonIndex) => {
                    this._imagePickerLogin(buttonIndex)
                  }
                )
              } else {
                alert('Storage permission not given')
              }
            })
          } else {
            alert('Permission not granted')
          }
        }
      )
    } else {
      ActionSheet.showActionSheetWithOptions(
        {
          options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: 'blue'
        },
        (buttonIndex) => {
          this._imagePickerLogin(buttonIndex)
        }
      )
    }
  }

  _imagePickerLogin(buttonIndex) {
    this.setState({ ...this.state, loading_photo: false })
    if (buttonIndex === 0) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true
      }).then((response) => {
        const parts = response.path.split('.')
        const imageType = parts.pop()

        if (imageType !== 'gif') {
          const source = {
            uri: response.path ? response.path : No_IMAGE_LINK,
            base64: response.data
          }
          this.setState({
            ...this.state,
            avatarSource: source
          })
        } else {
          alert('Animated image not allow')
        }
      })
    } else if (buttonIndex === 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true
      }).then((response) => {
        const parts = response.path.split('.')
        const imageType = parts.pop()

        if (imageType !== 'gif') {
          const source = {
            uri: response.path ? response.path : No_IMAGE_LINK,
            base64: response.data
          }
          this.setState({
            ...this.state,
            avatarSource: source
          })
        } else {
          alert('Animated image not allow')
        }
      })
    }
  }

  logoutOption() {
    AsyncStorage.removeItem('accountInfo')
    this.props.setLoginUserData(null)
    this.props.navigation.popToTop()
    analytics().resetAnalyticsData()
    // this.props.navigation.navigate("Number");
  }

  _handleDatePicker = (date) => {
    const dateNew = `${date.getFullYear()}-${
      (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
    }-${(date.getDate() < 10 ? '0' : '') + date.getDate()}T`
    const time = `00:00:00`
    this.props.updateInputFields('dob', dateNew + time)

    this.setState(
      {
        selectedDate: `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`,
        selectedDateObj: date,
        isDatePickerVisible: false
      },
      () => {
        if (this.state.selectedTimeObj) {
          this._handleTimePicker(this.state.selectedTimeObj)
        }
      }
    )
  }

  _showDateTimePicker = (stateName) => {
    this.setState({ [stateName]: true })
  }

  _hideDateTimePicker = (stateName) => {
    this.setState({ [stateName]: false })
  }

  changeOption = (data, stateName, option) => {
    if (option.label === '10+') {
      this.setState({
        [stateName]: 11
      })
      this.props.updateInputFields(stateName, 11)
    } else {
      this.setState({
        [stateName]: option.label
      })
      this.props.updateInputFields(stateName, option.label)
    }

    let bedroomD = data

    bedroomD.map((res) => {
      if (option.label === res.label) {
        res.section = true
      } else {
        res.section = false
      }
    })

    this.setState({
      [data]: bedroomD
    })
  }

  changeOptionInitial = (data, stateName) => {
    let bedroomD = data
    bedroomD.map((res) => {
      if (stateName === res.label) {
        res.section = true
      } else {
        res.section = false
      }
    })

    this.setState({
      [data]: bedroomD
    })
  }

  render() {
    let newDate = ''

    if (this.props.dob !== '' && this.props.dob !== null) {
      let dateOfBirth = this.props.dob.substring(0, this.props.dob.indexOf('T'))
      newDate = dateOfBirth.replace('-', '/')
      newDate = newDate.replace('-', '/')
    }

    if (this.props.monthlyIncome === 1999) {
      this.props.updateInputFields('monthlyIncome', 'Less than 2k')
    } else if (this.props.monthlyIncome === 2000) {
      this.props.updateInputFields('monthlyIncome', '2k - 4k')
    } else if (this.props.monthlyIncome === 4000) {
      this.props.updateInputFields('monthlyIncome', '4k - 8k')
    } else if (this.props.monthlyIncome === 8000) {
      this.props.updateInputFields('monthlyIncome', 'More than 8k')
    }

    return (
      <Container>
        {this.state.loading_photo && (
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1
            }}
          >
            <ActivityIndicator size='large' />
          </View>
        )}
        {this._viewHeader()}

        {this.props.on_loading && (
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'white',
              opacity: 0.5
            }}
          >
            <ActivityIndicator color='red' size='large' />
          </View>
        )}

        <ScrollView
          ref={(ref) => (this.scrollRef = ref)}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={style.root}
        >
          <View style={style.body}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  this._imagePikcer()
                }}
                accessible={true}
                accessibilityLabel='editPersonProfileImageBtn'
              >
                <Image
                  testID='profileImg'
                  style={style.profileImg}
                  source={
                    this.state.avatarSource == ''
                      ? {
                          uri: this.props.profile_image
                            ? this.props.profile_image
                            : No_IMAGE_LINK
                        }
                      : this.state.avatarSource
                  }
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                marginTop: 100,
                marginLeft: '55%'
              }}
              onPress={() => this._imagePikcer()}
              accessible={true}
              accessibilityLabel='editPersonCameraImageBtn'
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: '#00D392',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon name='photo-camera' color='#FFFFFF' size={25} />
              </View>
            </TouchableOpacity>

            {/* <View style={style.zeroDepMainCont}>
              <View style={style.zeroDepContainer}>
                <Image
                  source={
                    this.state.zeroDepEligibilityStatus === VERIFIED
                      ? assets.credActiveGreenIcon
                      : assets.credInActiveIcon
                  }
                />
                <Text style={style.zeroEligiText}>
                  Zero Deposite Eligibility
                </Text>
              </View>
              {this.state.zeroDepEligibilityStatus !== VERIFIED && (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ZeroDepositEligibility', {
                      calBackMethod: () => this.getUserDocAPI()
                    })
                  }
                >
                  <Text style={style.checkNowText}>
                    {this.state.zeroDepEligibilityStatus === COMPLETED
                      ? 'Re-Submit'
                      : 'Check Now'}
                  </Text>
                </TouchableOpacity>
              )}
            </View> */}

            <Text
              style={[
                style.TextStyleHeaderTag,
                {
                  marginTop: 25,
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: Matrics.ScaleValue(18)
                }
              ]}
            >
              Personal detail
            </Text>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={[
                  style.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(14),
                    marginTop: 20,
                    fontFamily: 'OpenSans-SemiBold'
                  }
                ]}
              >
                Name
              </Text>

              <TextInput
                testID='name'
                style={{
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5
                }}
                placeholder='Enter name'
                placeholderTextColor='#9AA1A9'
                onChangeText={this._updateInputFields('name')}
                value={this.props.name}
                accessible={true}
                accessibilityLabel='editPerInfoNameInput'
              />

              {this.props.error_alert === 'name' && (
                <Text style={style.alert}>*Name field cannot be empty</Text>
              )}
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={[
                  style.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(14),
                    marginTop: 20,
                    fontFamily: 'OpenSans-SemiBold'
                  }
                ]}
              >
                Email
              </Text>

              <TextInput
                testID='email'
                style={{
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5
                }}
                placeholder='test@gmail.com'
                placeholderTextColor='#9AA1A9'
                keyboardType='email-address'
                value={this.props.email}
                onChangeText={this._updateInputFields('email')}
                accessible={true}
                accessibilityLabel='editPerInfoEmailInput'
              />

              {this.props.error_alert === 'email' && (
                <Text style={style.alert}>*Email field cannot be empty</Text>
              )}
              {this.props.error_alert === 'email_valid' && (
                <Text style={style.alert}>*Enter the valid email address</Text>
              )}
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={[
                  style.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(14),
                    marginTop: 20,
                    fontFamily: 'OpenSans-SemiBold'
                  }
                ]}
              >
                Phone Number
              </Text>

              <TextInput
                testID='phoneNumber'
                style={{
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5,
                  color: this.state.editable ? '#000' : '#000'
                }}
                placeholder={this.state.whatsappNumber}
                placeholderTextColor='#9AA1A9'
                keyboardType='number-pad'
                value={this.props.phone_number}
                onChangeText={this._updateInputFields('phone_number')}
                editable={false}
                accessible={true}
                accessibilityLabel='editPerInfoPhoneInput'
              />

              {this.props.error_alert === 'phone_number' && (
                <Text style={style.alert}>*Phone number cannot be empty</Text>
              )}
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={[
                  style.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(14),
                    marginTop: 20,
                    fontFamily: 'OpenSans-SemiBold'
                  }
                ]}
              >
                Whatsapp Number
              </Text>

              <TextInput
                testID='whatsappNumber'
                style={{
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5,
                  color: this.state.editable ? '#000' : '#000'
                }}
                maxLength={15}
                placeholder={this.state.whatsappNumber}
                placeholderTextColor='#9AA1A9'
                keyboardType='number-pad'
                value={
                  this.props.whatsappNumber !== null
                    ? this.props.whatsappNumber
                    : this.props.phone_number
                }
                onChangeText={this._updateInputFields('whatsappNumber')}
                accessible={true}
                accessibilityLabel='editPerInfoWPNumberInput'
              />

              {this.props.error_alert === 'whatsappNumber' && (
                <Text style={style.alert}>
                  *Please Enter atleast 10 characters
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  marginRight: 10
                }}
              >
                <Text
                  style={[
                    style.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      marginTop: 20,
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  Date of birth
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    this._showDateTimePicker('isDatePickerVisible')
                  }
                  style={{
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  accessible={true}
                  accessibilityLabel='editPersonDatePickBtn'
                >
                  <TextInput
                    testID='selectedDate'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5,
                      color: this.state.editable ? '#000' : '#000'
                    }}
                    pointerEvents='none'
                    placeholder={this.state.selectedDate}
                    placeholderTextColor='#9AA1A9'
                    value={newDate}
                    editable={false}
                    accessible={true}
                    accessibilityLabel='editPerInfoSelectDateInput'
                  />

                  <FontAwesome
                    name='chevron-down'
                    style={{ position: 'absolute', marginLeft: '90%' }}
                  />
                </TouchableOpacity>
                {this.props.error_alert === 'date_of_birth' && (
                  <Text style={style.alert}>*This field is required</Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  marginLeft: 10
                }}
              >
                <Text
                  style={[
                    style.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      marginTop: 20,
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  Gender
                </Text>
                <ModalSelector
                  data={this.state.genderList}
                  initValue='Select Bedroom'
                  onChange={(option) =>
                    this.changeOption(this.state.genderList, 'gender', option)
                  }
                  optionStyle={{
                    backgroundColor: 'white',
                    borderRadius: 6,
                    marginBottom: 2
                  }}
                  sectionStyle={{
                    backgroundColor: '#FFDF00',
                    borderRadius: 6,
                    marginBottom: 2,
                    padding: 8
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this._imagePikcer()}
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                    accessible={true}
                    accessibilityLabel='editPersonGenderBtn'
                  >
                    <TextInput
                      testID='gender'
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        borderBottomColor: '#9AA1A9',
                        borderBottomWidth: 0.5,
                        color: this.state.editable ? '#000' : '#000'
                      }}
                      placeholder={'Please select one'}
                      placeholderTextColor='#9AA1A9'
                      pointerEvents='none'
                      value={this.props.gender}
                      editable={false}
                      accessible={true}
                      accessibilityLabel='editPerInfoGenderInput'
                    />

                    <FontAwesome
                      name='chevron-down'
                      style={{ position: 'absolute', marginLeft: '90%' }}
                    />
                  </TouchableOpacity>
                </ModalSelector>
                {this.props.error_alert === 'gender' && (
                  <Text style={style.alert}>*Please select a gender</Text>
                )}
              </View>
            </View>

            <View>
              <View
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <Text
                  style={[
                    style.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      marginTop: 20,
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  Location
                </Text>

                <TextInput
                  testID='cityOfLiving'
                  style={{
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    borderBottomColor: '#9AA1A9',
                    borderBottomWidth: 0.5
                  }}
                  placeholder='Enter Location'
                  placeholderTextColor='#9AA1A9'
                  onChangeText={this._updateInputFields('cityOfLiving')}
                  value={this.props.cityOfLiving}
                  accessible={true}
                  accessibilityLabel='editPerInfoLocationInput'
                />

                {this.props.error_alert === 'cityOfLiving' && (
                  <Text style={style.alert}>*This field is required</Text>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text
                style={[
                  style.bytapText,
                  {
                    fontSize: Matrics.ScaleValue(14),
                    marginTop: 20,
                    fontFamily: 'OpenSans-SemiBold'
                  }
                ]}
              >
                Nationality
              </Text>

              <TouchableOpacity
                style={[style.dropdownItemStyle, {}]}
                onPress={() => this.setState({ showCountryPicker: true })}
                accessible={true}
                accessibilityLabel='editPersonCountryBtn'
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <CountryPicker
                    ref={(ref) => (this.countryPicker = ref)}
                    visible={this.state.showCountryPicker}
                    translation='eng'
                    countryCode={this.state.cca2}
                    withFlagButton={true}
                    onSelect={(v) => {
                      this.props.updateInputFields('country', v.name)
                      this.setState({
                        ...this.state,
                        cca2: v.cca2,
                        showCountryPicker: false
                      })
                      AsyncStorage.setItem('CCA2', v.cca2)
                    }}
                    onClose={() => this.setState({ showCountryPicker: false })}
                  />
                  <Text style={style.dropdownText}>
                    {this.props.country !== null
                      ? this.props.country
                      : 'Malaysia'}
                  </Text>
                </View>
                <FontAwesome name='chevron-down' />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#9AA1A9',
                  height: 1.4,
                  width: '100%'
                }}
              />
            </View>

            <Text
              style={[
                style.TextStyleHeaderTag,
                {
                  marginTop: 30,
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: Matrics.ScaleValue(18)
                }
              ]}
            >
              Additional info
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 25 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.updateUserType('type', 0)
                }}
                style={{
                  height: 40,
                  width: '50%',
                  backgroundColor: this.props.type === 0 ? 'black' : 'grey',
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                accessible={true}
                accessibilityLabel='editPersonLandloardBtn'
              >
                <Text
                  style={[
                    style.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      color: 'white',
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  Landlord
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.updateUserType('type', 1)
                }}
                style={{
                  height: 40,
                  width: '50%',
                  backgroundColor: this.props.type === 1 ? 'black' : 'grey',
                  borderTopEndRadius: 15,
                  borderTopStartRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                accessible={true}
                accessibilityLabel='editPersonTenantBtn'
              >
                <Text
                  style={[
                    style.bytapText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      color: 'white',
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  Tenant
                </Text>
              </TouchableOpacity>
            </View>

            {this.props.type === 0 ? (
              <View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    How many properties?
                  </Text>
                  <ModalSelector
                    data={this.state.propertiesList}
                    initValue='Select Bedroom'
                    onChange={(option) =>
                      this.changeOption(
                        this.state.propertiesList,
                        'numberOfProperties',
                        option
                      )
                    }
                    optionStyle={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      marginBottom: 2
                    }}
                    sectionStyle={{
                      backgroundColor: '#FFDF00',
                      borderRadius: 6,
                      marginBottom: 2,
                      padding: 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this._imagePikcer()}
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                      accessible={true}
                      accessibilityLabel='editPersonNumPropBtn'
                    >
                      <TextInput
                        testID='numberOfProperties'
                        style={{
                          height: Matrics.ScaleValue(40),
                          width: '100%',
                          borderBottomColor: '#9AA1A9',
                          borderBottomWidth: 0.5,
                          color: this.state.editable ? '#000' : '#000'
                        }}
                        placeholder={'Please select one'}
                        placeholderTextColor='#9AA1A9'
                        pointerEvents='none'
                        value={String(
                          this.props.numberOfProperties === 11
                            ? '10+'
                            : this.props.numberOfProperties
                        )}
                        editable={false}
                        accessible={true}
                        accessibilityLabel='editPerInfoNumbPropInput'
                      />

                      <FontAwesome
                        name='chevron-down'
                        style={{ position: 'absolute', marginLeft: '96%' }}
                      />
                    </TouchableOpacity>
                  </ModalSelector>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Level of your expertise with real estate?
                  </Text>
                  <ModalSelector
                    data={this.state.expertiseList}
                    initValue='Select Bedroom'
                    onChange={(option) =>
                      this.changeOption(
                        this.state.expertiseList,
                        'experience',
                        option
                      )
                    }
                    optionStyle={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      marginBottom: 2
                    }}
                    sectionStyle={{
                      backgroundColor: '#FFDF00',
                      borderRadius: 6,
                      marginBottom: 2,
                      padding: 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this._imagePikcer()}
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                      accessible={true}
                      accessibilityLabel='editPersonExpBtn'
                    >
                      <TextInput
                        testID='experience'
                        style={{
                          height: Matrics.ScaleValue(40),
                          width: '100%',
                          borderBottomColor: '#9AA1A9',
                          borderBottomWidth: 0.5,
                          color: this.state.editable ? '#000' : '#000'
                        }}
                        placeholder={'Please select one'}
                        placeholderTextColor='#9AA1A9'
                        pointerEvents='none'
                        value={this.props.experience}
                        editable={false}
                        accessible={true}
                        accessibilityLabel='editPerInfoExpInput'
                      />

                      <FontAwesome
                        name='chevron-down'
                        style={{ position: 'absolute', marginLeft: '96%' }}
                      />
                    </TouchableOpacity>
                  </ModalSelector>
                </View>
              </View>
            ) : (
              <View>
                <View
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Occupation
                  </Text>

                  <TextInput
                    testID='occupation'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Enter Occupation'
                    placeholderTextColor='#9AA1A9'
                    onChangeText={this._updateInputFields('occupation')}
                    value={this.props.occupation}
                    accessible={true}
                    accessibilityLabel='editPerInfoOccupInput'
                  />

                  {this.props.error_alert === 'occupation' && (
                    <Text style={style.alert}>*Enter your occupation.</Text>
                  )}
                </View>

                <View
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Employer Name{' '}
                    <Text
                      style={[
                        style.bytapText,
                        {
                          fontSize: Matrics.ScaleValue(12),
                          marginTop: 20,
                          fontFamily: 'OpenSans-Regular'
                        }
                      ]}
                    >
                      (University Name if student)
                    </Text>
                  </Text>

                  <TextInput
                    testID='companyName'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Enter Name'
                    placeholderTextColor='#9AA1A9'
                    onChangeText={this._updateInputFields('companyName')}
                    value={this.props.companyName}
                    accessible={true}
                    accessibilityLabel='editPerInfoCompNameInput'
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Type of employment
                  </Text>
                  <ModalSelector
                    data={this.state.employmentTypeList}
                    initValue='Select Bedroom'
                    onChange={(option) =>
                      this.changeOption(
                        this.state.employmentTypeList,
                        'contractType',
                        option
                      )
                    }
                    optionStyle={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      marginBottom: 2
                    }}
                    sectionStyle={{
                      backgroundColor: '#FFDF00',
                      borderRadius: 6,
                      marginBottom: 2,
                      padding: 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this._imagePikcer()}
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                      accessible={true}
                      accessibilityLabel='editPersonContactBtn'
                    >
                      <TextInput
                        testID='contractType'
                        style={{
                          height: Matrics.ScaleValue(40),
                          width: '100%',
                          borderBottomColor: '#9AA1A9',
                          borderBottomWidth: 0.5,
                          color: this.state.editable ? '#000' : '#000'
                        }}
                        placeholder={'Please select one'}
                        placeholderTextColor='#9AA1A9'
                        pointerEvents='none'
                        value={this.props.contractType}
                        editable={false}
                        accessible={true}
                        accessibilityLabel='editPerInfoContTypeInput'
                      />

                      <FontAwesome
                        name='chevron-down'
                        style={{ position: 'absolute', marginLeft: '96%' }}
                      />
                    </TouchableOpacity>
                  </ModalSelector>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Monthly income
                  </Text>
                  <ModalSelector
                    data={this.state.incomeList}
                    initValue='Select Bedroom'
                    onChange={(option) =>
                      this.changeOption(
                        this.state.incomeList,
                        'monthlyIncome',
                        option
                      )
                    }
                    optionStyle={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      marginBottom: 2
                    }}
                    sectionStyle={{
                      backgroundColor: '#FFDF00',
                      borderRadius: 6,
                      marginBottom: 2,
                      padding: 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this._imagePikcer()}
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                      accessible={true}
                      accessibilityLabel='editPersonIncomeBtn'
                    >
                      <TextInput
                        testID='monthlyIncome'
                        style={{
                          height: Matrics.ScaleValue(40),
                          width: '100%',
                          borderBottomColor: '#9AA1A9',
                          borderBottomWidth: 0.5,
                          color: this.state.editable ? '#000' : '#000'
                        }}
                        placeholder={'Please select one'}
                        placeholderTextColor='#9AA1A9'
                        pointerEvents='none'
                        value={this.props.monthlyIncome}
                        editable={false}
                        accessible={true}
                        accessibilityLabel='editPerInfoIncomeInput'
                      />

                      <FontAwesome
                        name='chevron-down'
                        style={{ position: 'absolute', marginLeft: '96%' }}
                      />
                    </TouchableOpacity>
                  </ModalSelector>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flex: 1
                  }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    No of pax
                  </Text>
                  <ModalSelector
                    data={this.state.noPaxList}
                    initValue='Select Bedroom'
                    onChange={(option) =>
                      this.changeOption(
                        this.state.noPaxList,
                        'paxNumber',
                        option
                      )
                    }
                    optionStyle={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      marginBottom: 2
                    }}
                    sectionStyle={{
                      backgroundColor: '#FFDF00',
                      borderRadius: 6,
                      marginBottom: 2,
                      padding: 8
                    }}
                  >
                    <View
                      style={{
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                      }}
                    >
                      <TextInput
                        testID='paxNumber'
                        style={{
                          height: Matrics.ScaleValue(40),
                          width: '100%',
                          borderBottomColor: '#9AA1A9',
                          borderBottomWidth: 0.5,
                          color: this.state.editable ? '#000' : '#000'
                        }}
                        placeholder={'Please select one'}
                        placeholderTextColor='#9AA1A9'
                        pointerEvents='none'
                        value={String(this.props.paxNumber)}
                        editable={false}
                        accessible={true}
                        accessibilityLabel='editPerInfoPaxInput'
                      />

                      <FontAwesome
                        name='chevron-down'
                        style={{ position: 'absolute', marginLeft: '96%' }}
                      />
                    </View>
                  </ModalSelector>
                </View>

                <View
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Text
                    style={[
                      style.bytapText,
                      {
                        fontSize: Matrics.ScaleValue(14),
                        marginTop: 20,
                        fontFamily: 'OpenSans-SemiBold'
                      }
                    ]}
                  >
                    Reason for move
                  </Text>

                  <TextInput
                    testID='reasonForMove'
                    style={{
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Eg. Nearer to office'
                    placeholderTextColor='#9AA1A9'
                    onChangeText={this._updateInputFields('reasonForMove')}
                    value={this.props.reasonForMove}
                    accessible={true}
                    accessibilityLabel='editPerInfoReasonInput'
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={style.button}
              onPress={this._updateProfile}
              accessible={true}
              accessibilityLabel='editPersonUpdateBtn'
            >
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DateTimePicker
          datePickerContainerStyleIOS={{ paddingHorizontal: 40 }}
          maximumDate={this.state.minimumDate}
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this._handleDatePicker}
          onCancel={() => this._hideDateTimePicker('isDatePickerVisible')}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonInfo)
