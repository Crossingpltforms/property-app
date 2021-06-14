import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  BackHandler,
  Dimensions,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import ChatRequestStyle from '../../styles/ChatRequestStyle'
import { Icon } from 'react-native-elements'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import ModalSelector from 'react-native-modal-selector'

import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import { formatTime } from '../../common/helper/time'
import { withNavigationFocus } from 'react-navigation'
import { trackerEventSubmit } from '../../util/trackEventNames'
import {
  events,
  logEvent,
  logAddToWishlist,
  logAddToCart,
  fbLogAddToCart
} from '../../util/fbAnalytics'
import { Matrics } from '../../common/styles'
import { scale } from '../../common/helper'
import InstantViewConfirmationModal from './InstantViewConfirmationModal'
// import InstantViewRequestModal from "./InstantViewRequestModal";
// import GroupAppointmentView from "./GroupAppointmentModal/GroupAppointmentView";
import RequestSent from './GroupAppointmentModal/RequestSent'
import { getRoomTypeLabel } from '../../common/helper/common'
import { No_IMAGE_LINK, NETCORE_TRACK_EVENT } from '../../common/constants'
import ProgressiveImage from '../../common/components/progressiveImage/index'

const { height } = Dimensions.get('window')

const TENANCY_DURATION = [
  { key: 1, label: '3 Months', value: '3 ' },
  { key: 2, label: '4 Months', value: '4 ' },
  { key: 3, label: '5 Months', value: '5 ' },
  { key: 4, label: '6 Months', value: '6 ' },
  { key: 5, label: '7 Months', value: '7 ' },
  { key: 6, label: '8 Months', value: '8 ' },
  { key: 7, label: '9 Months', value: '9 ' },
  { key: 8, label: '10 Months', value: '10' },
  { key: 9, label: '11 Months', value: '11' },
  { key: 10, label: '12 Months', value: '12' }
]

class ChatRequest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showErrorDialog: false,
      token:
        props.navigation.state.params.token === undefined
          ? ''
          : props.navigation.state.params.token,
      workingAs: 'Lawyer',
      email: '',
      mobile: '',
      myDate: 'dd/mm/yyyy',
      myCountry: props.navigation.state.params.myCountry,
      propertyInfo: props.navigation.state.params.propertyInfo,
      budget: '',
      occupation: '',
      alertMessage: '',
      loading_photo: false,
      instantViewConfirmationModalVisible: false,
      instantViewRequestModalVisible: false,
      groupAppointmentModalVisible: false,
      showSuccessAlert: false,
      appointmentData: [],
      isAgreementSelected: true,
      isUserLogin: props.navigation.state.params.isUserLogin,
      isOccupationData: false,
      relatedPropsize:
        props.navigation.state.params.relatedPropsize === undefined
          ? 0
          : props.navigation.state.params.relatedPropsize,
      movingDate: '',
      paxNumber: 0,
      income: '',
      selectedDate: '',
      defaultMovingDate: '',
      selectDate: false,
      tenancyDuration: ''
    }
  }

  _handleBackPress = () => {
    this._navigationBack()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
  }

  componentDidUpdate (prevProps, nextProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (prevProps.navigation.state.params.myCountry == nextProps.myCountry) {
        this.getUserData()
      } else {
        if (prevProps.navigation.state.params.token !== nextProps.token) {
          this.getUserData()
        }
      }
    }
  }

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
    this.getUserData()
  }

  getUserData () {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}`,
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        if (response.data) {
          let newDate = ''
          if (this.state.selectDate === false) {
            if (
              response.data.movingDate !== '' &&
              response.data.movingDate !== null
            ) {
              let dateOfBirth =
                response.data &&
                response.data.movingDate &&
                response.data.movingDate.substring(
                  0,
                  response.data.movingDate.indexOf('T')
                )
              newDate = dateOfBirth && dateOfBirth.replace('-', '/')
              newDate = newDate && newDate.replace('-', '/')
              this.setState({ myDate: dateOfBirth })
            }
          }

          this.setState({ email: response.data.email })
          this.setState({ defaultMovingDate: response.data.movingDate })
          this.setState({ mobile: response.data.phoneNumber })
          this.setState({ occupation: response.data.occupation })
          this.setState({ myCountry: response.data.country })
          this.setState({ isUserLogin: true })
          this.setState({ paxNumber: response.data.paxNumber })
          this.setState({ income: response.data.monthlyIncome })

          if (response.data.occupation !== null) {
            this.setState({ isOccupationData: true })
          }
        }
      })
    }
  }

  AlertView = message => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
        height: 80,
        bottom: '20%',
        zIndex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        opacity: 0.8
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: 'white',
          margin: 10
        }}
      >
        {message.replace('null', 'empty')}
      </Text>
    </View>
  )

  _hideAlertView () {
    setTimeout(() => this.setState({ alertMessage: '' }), 2000)
  }

  _displayhideAlertView () {
    setTimeout(() => this.setState({ alertMessage: '' }), 7000)
  }

  goNationality = () => {
    this.props.navigation.navigate('Nationality')
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  _viewHeader () {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          flexDirection: 'row',
          alignItems: 'center',
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <TouchableOpacity
          onPress={() => this._navigationBack()}
          style={{ alignItems: 'center', flexDirection: 'row' }}
          accessible={true}
          accessibilityLabel='chatReqLeftBtn'
        >
          <Icon name='keyboard-arrow-left' size={35} />
          <Text
            style={{
              fontSize: Matrics.ScaleValue(14),
              textAlign: 'left',
              fontFamily: 'OpenSans-Regular',
              color: '#000'
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: Matrics.ScaleValue(15),
              alignItems: 'center',
              color: '#000',
              marginLeft: Matrics.ScaleValue(-100)
            }}
          >
            Chat Request
          </Text>
        </View>
      </View>
    )
  }

  onSelect = data => {
    this.setState(
      { myDate: data.myDate, selectedDate: data.myDate, selectDate: true },
      () => {}
    )
  }

  onSelectCountry = data => {
    this.setState({ myCountry: data.myCountry })
  }

  componentDidMount () {
    if (this.props.isUserLogin == true) {
      let data = this.props.userLoginData
      this.setState({ token: data.token })
    }
  }

  propertyAlertApi () {
    if (this.props.isUserLogin == true) {
      const {
        bathroom,
        bedroom,
        carpark,
        furnishType,
        latitude,
        longitude,
        price,
        type
      } = this.state.propertyInfo
      const email = this.state.email
      const searchFilter = {
        bathroom: bathroom,
        address: this.state.propertyInfo.address,
        bedroom: bedroom,
        carpark: carpark,
        furnishType: furnishType,
        latitude: latitude,
        longitude: longitude,
        maxPrice: price,
        type: type
      }
      const body = {
        email: email,
        searchFilter: searchFilter
      }
      APICaller(
        Http.propertyAlert,
        'POST',
        this.state.token,
        JSON.stringify(body)
      ).then(json => {
        if (json.status !== 200) {
          // TODO error reporting
        }
      })
    }
  }

  checkAppointment () {
    this.setState({ loading_photo: true })
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.getAppointment(this.state.propertyInfo.id)}`,
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        this.setState({ loading_photo: false })
        if (response.status === 200) {
          if (this.state.isAgreementSelected) {
            this.propertyAlertApi()
          }
          if (response.data.Appointments.length > 0) {
            this.setState({ loading_photo: false })
            this.setState(
              { appointmentData: response.data.Appointments },
              () => {
                if (this.state.propertyInfo.price >= 500) {
                  this.props.navigation.navigate('GroupAppointmentView', {
                    appointmentData: response.data.Appointments,
                    propertyId: this.state.propertyInfo.id,
                    handleConfirm: () => {
                      let dateFormat = this.state.myDate.split('/')
                      this.state.relatedPropsize > 2
                      this.props.navigation.navigate('MultipleCRListing', {
                        propertyInfo: this.state.propertyInfo,
                        budget: this.state.budget,
                        myCountry: this.state.myCountry,
                        movingDate:
                          [dateFormat[2], dateFormat[1], dateFormat[0]].join(
                            '-'
                          ) + 'T07:01:27.738Z',
                        occupation: this.state.occupation,
                        handleBackFromMultipleCR: this.handleBackFromMultipleCR
                      })
                    }
                  })
                  // this.toggleModal('groupAppointmentModalVisible', true);
                } else {
                  this.chatRequestApiCall()
                }
              }
            )
          } else {
            // this.chatRequestApiCall();
            // this.toggleModal("instantViewRequestModalVisible", true);
            this.props.navigation.navigate('instantViewRequestModal', {
              successSubmitted: () => {
                this.props.navigation.navigate('AdditionalInfo', {
                  handleBackFromInfo: this.handleBackFromInfo
                })
              },
              handleBackFromInfo: this.handleBackFromInfo,
              propertyId:
                (this.state.propertyInfo && this.state.propertyInfo.id) || ''
            })
          }
        } else {
          this.displayError()
        }
      })
    }
  }

  addEventTracking = () => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        attr: 'ChatRequest',
        id: this.state.propertyInfo.id
      }
      APICaller(
        Http.eventTrackig,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then(json => {
        if (json.status !== 200) {
          // TODO send to crashlytics
        }
      })
    }
  }

  saveInformation () {
    let dateFormat = this.state.myDate.split('/')
    // let movingDate =
    //   [dateFormat[2], dateFormat[1], dateFormat[0]].join("-") +
    //   "T07:01:27.738Z";

    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let data = this.props.userLoginData
      const body = {
        movingDate:
          this.state.selectedDate !== ''
            ? [dateFormat[2], dateFormat[1], dateFormat[0]].join('-') +
              'T07:01:27.738Z'
            : this.state.defaultMovingDate,
        paxNumber: this.state.paxNumber,
        monthlyIncome: this.state.income,
        occupation: this.state.occupation
      }
      APICaller(
        `${Http.updateProfileDetails(data.userId)}`,
        'PUT',
        data.token,
        JSON.stringify(body)
      ).then(json => {}) // TODO error reporting
    }
  }

  chatRequestApiCall = () => {
    this.setState({ loading_photo: true })
    let dateFormat = this.state.myDate.split('/')
    var moveinDate = ''

    if (dateFormat[1] === undefined) {
      moveinDate = [dateFormat[0]].join('-') + 'T07:01:27.738Z'
    } else {
      moveinDate =
        [dateFormat[2], dateFormat[1], dateFormat[0]].join('-') +
        'T07:01:27.738Z'
    }

    const body = {
      budget: this.state.budget,
      fromCountry: this.state.myCountry,
      movingDate:
        this.state.selectedDate !== ''
          ? moveinDate
          : this.state.defaultMovingDate,
      noDeposit: true,
      occupation: this.state.occupation,
      propertyId: this.state.propertyInfo.id,
      relationship: 'string',
      tenancyDuration: parseInt(this.state.tenancyDuration)
    }

    APICaller(
      Http.chatRequestEndpoint,
      'POST',
      this.state.token,
      JSON.stringify(body)
    ).then(json => {
      if (json.status === 200) {
        this.setState({ loading_photo: false })
        analytics().logEvent(
          trackerEventSubmit.chatWithOwner.action.submitChatRequest
        )
        logEvent(trackerEventSubmit.chatWithOwner.action.submitChatRequest)
        logAddToWishlist(
          trackerEventSubmit.chatWithOwner.action.submitChatRequest
        )

        if (
          this.state.propertyInfo.type !== 'ROOM' &&
          this.state.propertyInfo.price >= 500 &&
          this.state.propertyInfo.price <= 5000
        ) {
          analytics().logEvent(
            trackerEventSubmit.chatWithOwner.action.submitChatRequestNoDeposit
          )
          logEvent(
            trackerEventSubmit.chatWithOwner.action.submitChatRequestNoDeposit
          )
        }

        if (
          (this.state.propertyInfo.type === 'ROOM' &&
            this.state.propertyInfo.price >= 300 &&
            this.state.propertyInfo.price <= 2000) ||
          (this.state.propertyInfo.type !== 'ROOM' &&
            this.state.propertyInfo.price >= 500 &&
            this.state.propertyInfo.price <= 5000)
        ) {
          logEvent(trackerEventSubmit.chatWithOwner.action.chatRequestSubmit1)
          analytics().logEvent(
            trackerEventSubmit.chatWithOwner.action.chatRequestSubmit1
          )
        }
        debugger
        if (
          this.state.propertyInfo.type === 'LANDED' ||
          this.state.propertyInfo.type === 'HIGHRISE'
        ) {
          if (
            this.state.propertyInfo.price >= 800 &&
            this.state.propertyInfo.price <= 5000
          ) {
            var params = {
              propertyId: this.state.propertyInfo.id,
              propertyName: this.state.propertyInfo.name
            }

            var content = {
              id: this.state.propertyInfo.id,
              quantity: 1,
              name: this.state.propertyInfo.name
            }

            fbLogAddToCart(
              this.state.propertyInfo.price,
              'product',
              JSON.stringify(content),
              'RM'
            )

            logEvent(
              trackerEventSubmit.chatWithOwner.action
                .landedOrHighRisePropertyChatRequest
            )
            analytics().logEvent(
              trackerEventSubmit.chatWithOwner.action
                .landedOrHighRisePropertyChatRequest
            )
          }
        }

        const NetCorePayload = {
          Name: this.state.propertyInfo && this.state.propertyInfo.name,
          Phone_number:
            this.props.userLoginProfileData &&
            this.props.userLoginProfileData.phoneNumber,
          Email_address:
            this.props.userLoginProfileData &&
            this.props.userLoginProfileData.email,
          Property_value:
            this.state.propertyInfo && this.state.propertyInfo.price,
          Area_of_property:
            this.state.propertyInfo && this.state.propertyInfo.address,
          Duration_of_tenancy: this.state.tenancyDuration
        }
        NetcoreSDK.track(NETCORE_TRACK_EVENT.SEND_CR, NetCorePayload)

        this.addEventTracking()
        this.saveInformation()
        this.checkAppointment()
        // if (this.state.propertyInfo.instantView) {
        // this.toggleModal("instantViewConfirmationModalVisible", true);
        // this.toggleModal("instantViewRequestModalVisible", true);
        // } else {
        // this.showSuccessAlert();
        // }
      } else {
        this.setState({ loading_photo: false })
        this.displayError()
      }
    })
  }

  showSuccessAlert = () => {
    Alert.alert(
      'Success',
      'Request send sucessfully.',
      [{ text: 'OK', onPress: () => this._navigationBack() }],
      { cancelable: false }
    )
  }

  requestForChat () {
    if (this.state.myDate === '' || this.state.myDate === 'dd/mm/yyyy') {
      this.setState({ alertMessage: 'Enter move in date' })
      this._hideAlertView()

      return
    }

    const date_component = this.state.myDate.split('/')

    if (!date_component || date_component.length !== 3) {
      this.setState({ alertMessage: 'Invalid move in date' })
      this._hideAlertView()

      return
    }

    const movingDate = formatTime(
      'YYYY-MM-DD',
      new Date(
        [date_component[2], date_component[1], date_component[0]].join('-')
      )
    )
    const availabilityDate = formatTime(
      'YYYY-MM-DD',
      new Date(this.state.propertyInfo.availability)
    )

    const isValidDate = new Date(availabilityDate) <= new Date(movingDate)

    if (isValidDate === false) {
      this.setState({
        alertMessage:
          'Move in date cannot be before availability date. If possible change the move in date or enquire another unit.'
      })
      this._displayhideAlertView()
    } else if (this.state.budget === '') {
      this.setState({ alertMessage: 'Enter Offer' })
      this._hideAlertView()
    } else if (parseInt(this.state.budget) < 1) {
      this.setState({ alertMessage: 'Offer must be greater than 0' })
      this._hideAlertView()
    } else if (
      parseInt(this.state.budget) <
      parseInt(this.state.propertyInfo.price) * 0.85
    ) {
      this.setState({
        alertMessage: `Offer can not be less than RM ${this.state.propertyInfo
          .price * 0.85}.`
      })
      this._hideAlertView()
    } else if (!/^[0-9]+$/.test(this.state.budget)) {
      this.setState({
        alertMessage: 'Enter only Number for Budget'
      })
      this._hideAlertView()
    } else if (this.state.occupation === '') {
      this.setState({
        alertMessage: 'Enter your occupation'
      })
      this._hideAlertView()
    } else if (this.state.tenancyDuration === '') {
      this.setState({
        alertMessage: 'Enter tenancy duration'
      })
      this._hideAlertView()
    } else {
      if (this.props.isUserLogin == true) {
        this.chatRequestApiCall()
      } else {
        analytics().logEvent(
          trackerEventSubmit.chatWithOwner.action.questionaireSubmit
        )
        logEvent(trackerEventSubmit.chatWithOwner.action.questionaireSubmit)
        this.props.navigation.navigate('Number', {
          screenName: 'ChatRequest'
        })
        return
      }
    }
  }

  toggleModal = (modal, value) => {
    this.setState({ [modal]: value })
  }

  handleInstantViewConfirmation = viewUnit => {
    if (viewUnit) {
      this.toggleModal('instantViewRequestModalVisible', true)
    } else {
      this._navigationBack()
    }
  }

  handleGroupAppointmentConfirmation = viewUnit => {
    this.toggleModal('groupAppointmentModalVisible', true)
  }

  handleClosePopup () {
    this.setState({ showSuccessAlert: false })
  }

  format (amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  displayPorpertyType (type) {
    if (type.toLowerCase() === 'landed_sale') {
      return 'Landed-sale'
    } else if (type.toLowerCase() === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return type.toLowerCase()
    }
  }

  _displayFurnishType (furnishType) {
    if (furnishType === 'NONE') {
      return 'Unfurnished'
    } else if (furnishType === 'PARTIAL') {
      return 'Partially Furnished'
    } else {
      return 'Fully Furnished'
    }
  }

  Capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleBackFromMultipleCR = propertyData => {
    if (propertyData !== '') {
      this.toggleModal('showSuccessAlert', true)
    }
  }

  handleBackFromInfo = propertyData => {
    this.toggleModal('groupAppointmentModalVisible', false)
    let dateFormat = this.state.myDate.split('/')
    this.state.relatedPropsize > 2
      ? this.props.navigation.navigate('MultipleCRListing', {
          propertyInfo: this.state.propertyInfo,
          budget: this.state.budget,
          myCountry: this.state.myCountry,
          movingDate:
            [dateFormat[2], dateFormat[1], dateFormat[0]].join('-') +
            'T07:01:27.738Z',
          occupation: this.state.occupation,
          handleBackFromMultipleCR: this.handleBackFromMultipleCR
        })
      : this.toggleModal('showSuccessAlert', true)
  }

  changeOption = (data, stateName, option) => {
    this.setState({
      [stateName]: option.label
    })

    let bedroomD = data

    bedroomD.map(res => {
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

  formatDate = date => {
    let formatDate = date.split('T')
    let ISTdate = new Date(`${formatDate[0]}`)
    return `${ISTdate.toString().slice(4, 15)}`
  }

  render () {
    let roomType = getRoomTypeLabel(this.state.propertyInfo.roomType)

    return (
      <Container>
        {this._viewHeader()}

        {this.state.alertMessage !== '' &&
          this.AlertView(this.state.alertMessage)}

        {this.state.loading_photo && (
          <View
            style={{
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

        <ScrollView contentContainerStyle={[ChatRequestStyle.root]}>
          <KeyboardAvoidingView
            behavior='position'
            keyboardVerticalOffset={scale(-20)}
          >
            <View style={[ChatRequestStyle.body, { marginTop: 15 }]}>
              <Text
                style={{
                  fontSize: Matrics.ScaleValue(14),
                  textAlign: 'left',
                  color: '#000',
                  fontFamily: 'OpenSans-SemiBold'
                }}
              >
                Landlord would like to know you better {'\n'}with these
                questions.
              </Text>

              <View
                style={{
                  backgroundColor: '#EBEEF5',
                  borderRadius: Matrics.ScaleValue(10),
                  width: '100%',
                  marginVertical: Matrics.ScaleValue(20),
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: { width: 0, height: 2 }
                }}
              >
                <ProgressiveImage
                  testID='propertyInfo'
                  source={{
                    uri:
                      this.state.propertyInfo &&
                      this.state.propertyInfo.images.length > 0
                        ? this.state.propertyInfo.images[0].url
                        : No_IMAGE_LINK
                  }}
                  style={{ height: 60, width: 60, borderRadius: 10 }}
                />

                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: 10,
                    width: '75%'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{
                        fontSize: Matrics.ScaleValue(13),
                        textAlign: 'left',
                        color: '#000',
                        fontFamily: 'OpenSans-SemiBold',
                        width: '75%'
                      }}
                    >
                      {this.state.propertyInfo.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: 'right',
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#90278E'
                      }}
                    >
                      RM {this.format(this.state.propertyInfo.price)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: Matrics.ScaleValue(5)
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'left',
                          fontFamily: 'OpenSans-Light',
                          color: '#000'
                        }}
                      >
                        {roomType !== ''
                          ? roomType
                          : `${this.state.propertyInfo.sqft} sqft`}{' '}
                        |
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'left',
                          fontFamily: 'OpenSans-Light',
                          color: '#000'
                        }}
                      >
                        {' '}
                        {this.Capitalize(
                          this.displayPorpertyType(this.state.propertyInfo.type)
                        )}{' '}
                        |
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'left',
                          fontFamily: 'OpenSans-Light',
                          color: '#000'
                        }}
                      >
                        {' '}
                        {this._displayFurnishType(
                          this.state.propertyInfo.furnishType
                        )}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      paddingLeft: 40,
                      marginTop: height * 0.003,
                      marginBottom: height * 0.002
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-SemiBold',
                        fontSize: 11,
                        marginTop: height * 0.003
                      }}
                    >
                      {`availability : ${this.formatDate(
                        this.state.propertyInfo.availability
                      )}`}
                    </Text>
                  </View>
                </View>
              </View>

              <Text
                style={[
                  ChatRequestStyle.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Your Move-In Date?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MoveIndate', {
                    onSelect: this.onSelect,
                    availabilityDate: this.state.propertyInfo.availability
                  })
                }
                accessible={true}
                accessibilityLabel='chatRefMyDate'
              >
                <TextInput
                  testID='myDate'
                  keyboardType='number-pad'
                  editable={false}
                  selectTextOnFocus={false}
                  autofocus={false}
                  pointerEvents='none'
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    borderBottomColor: '#9AA1A9',
                    borderBottomWidth: 0.5
                  }}
                  placeholder=''
                  placeholderTextColor='#9AA1A9'
                  accessible={true}
                  accessibilityLabel='chatReqScreenMyDateInput'
                >
                  {this.state.myDate}
                </TextInput>
              </TouchableOpacity>

              <Text
                style={[
                  ChatRequestStyle.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Make an Offer
              </Text>

              <TextInput
                testID='budget'
                keyboardType='number-pad'
                style={{
                  fontFamily: 'OpenSans-Regular',
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5
                }}
                placeholder=''
                placeholderTextColor='#9AA1A9'
                onChangeText={text => {
                  this.setState({ budget: text })
                }}
                accessible={true}
                accessibilityLabel='chatReqScreenBudgetInput'
              />
              <Text
                style={[
                  ChatRequestStyle.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Tenancy duration
              </Text>

              <ModalSelector
                data={TENANCY_DURATION}
                initValue='Select Tenancy duration'
                onChange={option => {
                  this.setState({
                    tenancyDuration: option && option.value
                  })
                }}
                optionStyle={{
                  backgroundColor: 'white',
                  borderRadius: 6,
                  marginBottom: 2
                }}
                sectionStyle={{
                  // backgroundColor: '#FFDF00',
                  borderRadius: 6,
                  marginBottom: 2,
                  padding: 8
                }}
              >
                <TouchableOpacity
                  key={this.state.tenancyDuration}
                  style={[
                    ChatRequestStyle.pickerStyle,
                    {
                      width: Matrics.screenWidth - 30,
                      borderLeftWidth: 0,
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      paddingBottom: 10
                    }
                  ]}
                  accessible={true}
                  accessibilityLabel='chatRefTenancyBtn'
                >
                  <Text>{this.state.tenancyDuration}</Text>
                </TouchableOpacity>
              </ModalSelector>

              {/* {this.state.isUserLogin === false ||
                this.state.myCountry === '' ||
                this.state.isOccupationData === false ? ( */}
              <View>
                <Text
                  style={[
                    ChatRequestStyle.bytapText,
                    { marginTop: Matrics.ScaleValue(20) }
                  ]}
                >
                  Your Nationality?
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Nationality', {
                      onSelect: this.onSelectCountry,
                      myCountry: this.state.myCountry
                    })
                  }
                  accessible={true}
                  accessibilityLabel='chatRefMyCountryBtn'
                >
                  <TextInput
                    testID='myCountry'
                    editable={false}
                    selectTextOnFocus={false}
                    autofocus={false}
                    pointerEvents='none'
                    keyboardType='number-pad'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder=''
                    placeholderTextColor='#9AA1A9'
                    accessible={true}
                    accessibilityLabel='chatReqScreenMyCountryInput'
                  >
                    {this.state.myCountry}
                  </TextInput>
                </TouchableOpacity>
              </View>
              {/* ) : (
                  <View />
                )} */}

              {/* {this.state.occupation === '' ||
                this.state.isOccupationData === false ||
                this.state.isUserLogin === false ? ( */}
              <View>
                <Text
                  style={[
                    ChatRequestStyle.bytapText,
                    { marginTop: Matrics.ScaleValue(20) }
                  ]}
                >
                  Your Occupation?
                </Text>

                <TextInput
                  testID='occupation'
                  keyboardType='default'
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    borderBottomColor: '#9AA1A9',
                    borderBottomWidth: 0.5
                  }}
                  placeholder=''
                  placeholderTextColor='#9AA1A9'
                  value={this.state.occupation}
                  onChangeText={occupation => {
                    this.setState({ occupation: occupation })
                  }}
                  accessible={true}
                  accessibilityLabel='chatReqScreenOccupInput'
                />
              </View>
              {/* ) : (
                  <View />
                )} */}

              {this.state.isUserLogin === false ? (
                <View>
                  <Text
                    style={[
                      ChatRequestStyle.bytapText,
                      { marginTop: Matrics.ScaleValue(20) }
                    ]}
                  >
                    Your Mobile Number?
                  </Text>

                  <TextInput
                    testID='mobile'
                    keyboardType='phone-pad'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder=''
                    placeholderTextColor='#9AA1A9'
                    value={this.state.mobile}
                    onChangeText={e => {
                      let numberPattern = /^\d+$/

                      if (numberPattern.test(e)) {
                        this.setState({ mobile: e })
                      }
                    }}
                    accessible={true}
                    accessibilityLabel='chatReqScreenMobileInput'
                  />
                </View>
              ) : (
                <View />
              )}
              {/* {this.state.isUserLogin === false ||
              this.state.myCountry === '' ||
              this.state.isOccupationData === false ? ( */}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: Matrics.ScaleValue(15),
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isAgreementSelected: !this.state.isAgreementSelected
                    })
                  }}
                  accessible={true}
                  accessibilityLabel='chatRefCheckBoxBtn'
                >
                  <Icon
                    name={
                      this.state.isAgreementSelected
                        ? 'check-box'
                        : 'check-box-outline-blank'
                    }
                    size={Matrics.ScaleValue(22)}
                    style={{ color: 'black' }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(12),
                    paddingLeft: Matrics.ScaleValue(10)
                  }}
                >
                  Be informed first when similar listings are posted.
                </Text>
              </View>

              <View style={ChatRequestStyle.bottomButton}>
                <View style={ChatRequestStyle.styleViewShadow}>
                  <TouchableOpacity
                    style={{
                      // backgroundColor: 'red',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => this.requestForChat()}
                    accessible={true}
                    accessibilityLabel='chatRefSubmitBtn'
                  >
                    {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        textAlign: 'center',
                        color: '#000'
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        <InstantViewConfirmationModal
          modalVisible={this.state.instantViewConfirmationModalVisible}
          toggleModal={value =>
            this.toggleModal('instantViewConfirmationModalVisible', value)
          }
          handleConfirm={value => this.handleInstantViewConfirmation(value)}
        />

        {/* <InstantViewRequestModal
          modalVisible={this.state.instantViewRequestModalVisible}
          toggleModal={value => {
            this.toggleModal("instantViewRequestModalVisible", value);
            this._navigationBack();
          }}
          successSubmitted={value => {
            this.toggleModal("instantViewRequestModalVisible", value);

            this.props.navigation.navigate("AdditionalInfo", {
              handleBackFromInfo: this.handleBackFromInfo
            });
          }}
          propertyId={
            (this.state.propertyInfo && this.state.propertyInfo.id) || ""
          }
        /> */}

        {/* <GroupAppointmentView
          modalVisible={this.state.groupAppointmentModalVisible}
          appointmentData={this.state.appointmentData}
          propertyId={this.state.propertyInfo.id}
          toggleModal={value =>
            this.toggleModal('groupAppointmentModalVisible', value)
          }
          handleConfirm={() => {
            this.toggleModal('groupAppointmentModalVisible', false);
            let dateFormat = this.state.myDate.split('/');
            this.state.relatedPropsize > 2
              ? this.props.navigation.navigate('MultipleCRListing', {
                  propertyInfo: this.state.propertyInfo,
                  budget: this.state.budget,
                  myCountry: this.state.myCountry,
                  movingDate:
                    [dateFormat[2], dateFormat[1], dateFormat[0]].join('-') +
                    'T07:01:27.738Z',
                  occupation: this.state.occupation,
                  handleBackFromMultipleCR: this.handleBackFromMultipleCR
                })
              : this.toggleModal('showSuccessAlert', true);
          }}
        /> */}

        <RequestSent
          modalVisible={this.state.showSuccessAlert}
          headerText='Request Sent'
          bodyText={`Our team will come back to \n you to confirm the appointment`}
          toggleModal={value => {
            this.toggleModal('showSuccessAlert', value)
            if (value === false) {
              this._navigationBack()
            }
          }}
        />

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong.Please contact hello@speedrent.com for assistance.`}
          toggleModal={value => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}

function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData, userLoginProfileData } = loginData
  return {
    isUserLogin,
    userLoginData,
    userLoginProfileData
  }
}
function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ChatRequest))
