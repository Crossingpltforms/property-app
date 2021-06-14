import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  AppState,
  Platform,
  Alert,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Header from '../common/Header'
import ModalSelector from 'react-native-modal-selector'
import Icon from 'react-native-vector-icons/FontAwesome'

// import images
import HousesIcon from '../../../Images/houses.png'
import HousesIconLite from '../../../Images/houses_lite.png'
// import BedIcon from "../../../Images/bed.png";
// import BedIconDark from "../../../Images/bed_dark.png";
import ApartmentIcon from '../../../Images/apartment.png'
import ApartmentIconDark from '../../../Images/apartment_dark.png'
import styles from './styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ErrorDialog from '../../components/ErrorDialog'

import { Matrics } from '../../common/styles'
import {
  roomTypesConst,
  paxTypeConst,
  bedRoomTypeConst,
  bedRoomTypeConstHighrise,
  bathRoomTypeConst,
  bathRoom_roomtype_Type_Const,
  parkingTypeConst,
  furnishingTypeConst,
  floorLevelLandedTypeConst
} from '../../common/constants'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import Geolocation from '@react-native-community/geolocation'

export default class CreateListingSell extends Component {
  constructor (props) {
    super(props)

    this.initialState = {
      showErrorDialog: false,
      searchString: '',
      locationPermission: undefined,
      alert_message: '',
      property_type: '',
      im_the_owner_of_unit: true,
      im_the_owner_of_unit_yes: false,
      im_the_owner_of_unit_no: false,
      is_the_price_negotiable: true,
      im_willing_to_fully_furnish: true,
      furnishing: 'Unfurnished',
      parking: 0,
      bedroom: 0,
      bathroom: 1,
      bathRoom_roomtype: 'Private',
      roomType: 'Single',
      pax: 1,
      paxdata: paxTypeConst,
      bedRoomdata: bedRoomTypeConst,
      bedRoomdataHighrise: bedRoomTypeConstHighrise,
      roomTypedata: roomTypesConst,
      bathRoomdata: bathRoomTypeConst,
      bathRoom_roomtype_data: bathRoom_roomtype_Type_Const,
      parkingdata: parkingTypeConst,
      furnishingdata: furnishingTypeConst,
      floorLevelLandeddata: floorLevelLandedTypeConst,
      price: null,
      postCode: null,
      propertyName: null,
      sqft: null,
      address: null,
      arrProperty: '',
      floorLevel: null,
      floorLevelLanded: 'Single',
      landmarkLabelId: '',
      enableScrollViewScroll: true,
      title_type: 'Choose one',
      leaseTypeData: [
        { key: 1, section: false, label: 'Lease Hold' },
        { key: 2, section: false, label: 'Free Hold' }
      ]
    }

    this.initialLocationState = {
      lastLat: 0,
      lastLong: 0
    }

    this.state = {
      ...this.initialState,
      ...this.initialLocationState
    }
  }

  componentDidMount () {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    )

    //this.props.createProperty();
    AppState.addEventListener('change', this._handleAppStateChange)
    if (Platform.OS == 'android') {
    } else {
      Geolocation.getCurrentPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          this.setState({
            lastLat: 0,
            lastLong: 0
          })
        },
        error => {},
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      )
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
    this.keyboardDidHideListener.remove()
    AppState.removeEventListener('change', this._handleAppStateChange)
    // LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
  }

  _handleAppStateChange = nextAppState => {
    if (Platform.OS == 'android') {
    } else {
      if (nextAppState === 'active') {
        Geolocation.getCurrentPosition(
          position => {
            let region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          error => {}
        )
      } else if (nextAppState === 'background') {
      }
    }
  }

  _hideAlertView () {
    setTimeout(() => this.setState({ ...this.state, alert_message: '' }), 2000)
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  AlertView = message => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
        height: 70,
        bottom: '10%',
        zIndex: 1,
        borderRadius: 6,
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

  FormInputText = (
    title,
    placeholder,
    alertMsg,
    stateName,
    showAlert,
    pasteOption,
    keyboard,
    textLimit = null
  ) => (
    <View style={styles.formInputRoot}>
      <Text style={styles.text1}> {title}</Text>
      <TextInput
        testID='stateName'
        style={styles.formInput}
        placeholder={placeholder}
        value={this.state[stateName]}
        contextMenuHidden={pasteOption}
        onChangeText={val => this.textInputChange(val, stateName)}
        keyboardType={keyboard}
        maxLength={textLimit}
        accessible={true}
        accessibilityLabel='createListSellStateNameInput'
      />
      {showAlert && <Text style={styles.formTextError}>{alertMsg}</Text>}
    </View>
  )

  textInputChange = (val, stateName) => this.setState({ [stateName]: val })

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

  _updatePropertyType = val => () =>
    this.setState({
      ...this.state,
      property_type: val,
      bedroom: val === 'landed_sale' ? 1 : 0
    })

  _updateImTheOwnerOfUnit = val => () => {
    this.setState({ ...this.state, im_the_owner_of_unit: val })

    if (val === true) {
      this.setState({ im_the_owner_of_unit_yes: true })
      this.setState({ im_the_owner_of_unit_no: false })
    } else {
      this.setState({ im_the_owner_of_unit_yes: false })
      this.setState({ im_the_owner_of_unit_no: true })
    }
  }

  _updateIsThePriceNegotiable = val => () =>
    this.setState({ ...this.state, is_the_price_negotiable: val })

  _updateImWillingToFullyFurnish = val => () =>
    this.setState({ ...this.state, im_willing_to_fully_furnish: val })

  _navigateUploadPhoto = () => this.props.navigation.navigate('UploadPhotoSell')

  FormCommonInput ({
    title,
    initValue,
    updatedDataValue,
    stateName,
    stateVal
  }) {
    return (
      <View style={styles.formInputGroupRoot}>
        <View style={[styles.formInputGroup]}>
          <Text style={styles.text1}>{title}</Text>
          <ModalSelector
            data={updatedDataValue}
            initValue={initValue}
            onChange={option =>
              this.changeOption(updatedDataValue, stateName, option)
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
              style={[styles.picker, { width: Matrics.screenWidth - 30 }]}
              accessible={true}
              accessibilityLabel='propSellDownBtn'
            >
              <Text>{stateVal}</Text>
              <Icon name='chevron-down' />
            </TouchableOpacity>
          </ModalSelector>
        </View>
      </View>
    )
  }

  FormInputGroup = props => (
    <View style={styles.formInputGroupRoot}>
      {this.state.property_type !== 'room' ? (
        <View style={styles.formInputGroup}>
          <Text style={styles.text1}> Bedroom</Text>
          <ModalSelector
            data={
              this.state.property_type !== 'landed_sale'
                ? this.state.bedRoomdataHighrise
                : this.state.bedRoomdata
            }
            initValue='Select Bedroom'
            onChange={option =>
              this.changeOption(this.state.bedRoomdata, 'bedroom', option)
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
              style={styles.picker}
              accessible={true}
              accessibilityLabel='propSellBedBtn'
            >
              {this.state.property_type === 'landed_sale' ? (
                <Text>{this.state.bedroom}</Text>
              ) : (
                <Text>
                  {this.state.bedroom === 0 ? 'Studio' : this.state.bedroom}
                </Text>
              )}
              <Icon name='chevron-down' />
            </TouchableOpacity>
          </ModalSelector>
        </View>
      ) : (
        <View style={styles.formInputGroup}>
          <Text style={styles.text1}> Room Type</Text>
          <ModalSelector
            data={this.state.roomTypedata}
            initValue='Select Room Type'
            onChange={option =>
              this.changeOption(this.state.roomTypedata, 'roomType', option)
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
              style={styles.picker}
              accessible={true}
              accessibilityLabel='propSellRoomBtn'
            >
              <Text>{this.state.roomType}</Text>
              <Icon name='chevron-down' />
            </TouchableOpacity>
          </ModalSelector>
        </View>
      )}
      <View style={styles.formInputGroup}>
        <Text style={styles.text1}> Bathroom</Text>
        <ModalSelector
          data={
            this.state.property_type === 'room'
              ? this.state.bathRoom_roomtype_data
              : this.state.bathRoomdata
          }
          initValue='Select Bathroom'
          onChange={option => {
            this.state.property_type === 'room'
              ? this.changeOption(
                  this.state.bathRoom_roomtype_data,
                  'bathRoom_roomtype',
                  option
                )
              : this.changeOption(this.state.bathRoomdata, 'bathroom', option)
          }}
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
            style={styles.picker}
            accessible={true}
            accessibilityLabel='propSellBathBtn'
          >
            <Text>
              {this.state.property_type === 'room'
                ? this.state.bathRoom_roomtype
                : this.state.bathroom}
            </Text>
            <Icon name='chevron-down' />
          </TouchableOpacity>
        </ModalSelector>
      </View>
    </View>
  )

  FormInputGroup2 = props => (
    <View style={styles.formInputGroupRoot}>
      <View>
        <Text style={styles.text1}> Parking</Text>
        <ModalSelector
          data={this.state.parkingdata}
          initValue='Select Parking'
          onChange={option =>
            this.changeOption(this.state.parkingdata, 'parking', option)
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
            style={{ ...styles.picker, width: 85 }}
            accessible={true}
            accessibilityLabel='propSellParkBtn'
          >
            <Text>{this.state.parking}</Text>
            <Icon name='chevron-down' />
          </TouchableOpacity>
        </ModalSelector>
      </View>
      <View>
        <Text style={styles.text1}> Furnishing</Text>
        <ModalSelector
          data={this.state.furnishingdata}
          initValue='Select Furnishing'
          onChange={option =>
            this.changeOption(this.state.furnishingdata, 'furnishing', option)
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
            style={{ ...styles.picker, width: 200 }}
            accessible={true}
            accessibilityLabel='propSellFurnBtn'
          >
            <Text>{this.state.furnishing}</Text>
            <Icon name='chevron-down' />
          </TouchableOpacity>
        </ModalSelector>
      </View>
    </View>
  )

  checkPrice = () => {
    if (this.state.price < 20000) {
      this.displayAlert()
    } else {
      this.createPropertyAPI()
    }
  }

  displayAlert () {
    Alert.alert(
      '',
      'So cheap, Are you sure it is for Sale?',
      [
        {
          text: 'No',
          onPress: () => {}
        },
        {
          text: 'Yes',
          onPress: () => {
            this.createPropertyAPI()
          },
          style: 'yes'
        }
      ],
      { cancelable: false }
    )
  }

  createPropertyAPI = () => {
    if (!this.state.propertyName) {
      this.setState({
        ...this.state,
        alert_message: 'Property name must be required'
      })
      this._hideAlertView()
    } else if (!this.state.address) {
      this.setState({
        ...this.state,
        alert_message: 'Address is required'
      })
      this._hideAlertView()
    } else if (!this.state.postCode) {
      this.setState({
        ...this.state,
        alert_message: 'Post code must be required'
      })
      this._hideAlertView()
    } else if (
      this.state.title_type == 'Choose one' ||
      this.state.title_type == ''
    ) {
      this.setState({
        ...this.state,
        alert_message: 'Please select title type.'
      })
      this._hideAlertView()
    } else if (
      this.state.property_type !== 'landed_sale' &&
      !this.state.floorLevel
    ) {
      this.setState({
        ...this.state,
        alert_message: 'Floor must be required'
      })
      this._hideAlertView()
    } else if (this.state.property_type !== 'room' && !this.state.sqft) {
      this.setState({
        ...this.state,
        alert_message: 'Square Feet must be required'
      })
      this._hideAlertView()
    } else if (
      this.state.property_type !== 'room' &&
      this.state.sqft < 99 &&
      this.state.sqft > 99999
    ) {
      this.setState({
        ...this.state,
        alert_message:
          'Square Feet must be greater than 99 and less than 99999.'
      })
      this._hideAlertView()
    } else if (!this.state.price) {
      this.setState({
        ...this.state,
        alert_message: 'Price must be required'
      })
      this._hideAlertView()
    } else if (this.state.price < 1) {
      this.setState({
        ...this.state,
        alert_message: 'Price must be greater than or equal to 1'
      })
      this._hideAlertView()
    } else {
      AsyncStorage.removeItem('avatarSource').then(() => {})
      const furnish_type = this.state.furnishingdata.filter(res => res.section)
      const locationLat = this.state.lastLat
      const locationLang = this.state.lastLong
      const obj = { locationLat, locationLang }
      AsyncStorage.setItem('locationLatLang', JSON.stringify(obj))
      var body = {
        leaseType: this.state.title_type
          .split(' ')
          .join('')
          .toUpperCase(),
        name: this.state.propertyName,
        address: this.state.address,
        postcode: this.state.postCode,
        landmarkLabelId: this.state.landmarkLabelId,
        price: this.state.price,
        furnishType: furnish_type.length > 0 ? furnish_type[0].value : 'NONE',
        negotiable: this.state.is_the_price_negotiable,
        fullyFurnishable: this.state.im_willing_to_fully_furnish,
        carpark: this.state.parking,
        owner: this.state.im_the_owner_of_unit,
        latitude: this.state.lastLat,
        longitude: this.state.lastLong,
        type: this.state.property_type.toUpperCase()
      }
      if (this.state.property_type === 'room') {
        const room_type = this.state.roomTypedata.filter(res => res.section)
        body['level'] = this.state.floorLevel
        body['roomType'] =
          room_type.length > 0 ? room_type[0].value.toUpperCase() : 'SMALL'
        body['roommate'] = this.state.pax
        body['bathroomType'] = this.state.bathRoom_roomtype.toUpperCase()
      } else if (this.state.property_type === 'landed_sale') {
        const f_level = this.state.floorLevelLandeddata.filter(
          res => res.section
        )
        body['storeys'] = f_level.length > 0 ? f_level[0].key : '1'
        if (this.state.property_type === 'landed_sale') {
          body['bedroom'] = this.state.bedroom
        } else {
          body['bedroom'] =
            this.state.bedroom === 'Studio' ? '0' : this.state.bedroom
        }
        body['bathroom'] = this.state.bathroom
        body['sqft'] = this.state.sqft
      } else {
        body['level'] = this.state.floorLevel
        if (this.state.property_type === 'landed_sale') {
          body['bedroom'] = this.state.bedroom
        } else {
          body['bedroom'] =
            this.state.bedroom === 'Studio' ? '0' : this.state.bedroom
        }
        body['bathroom'] = this.state.bathroom
        body['sqft'] = this.state.sqft
      }
      analytics().logEvent(
        trackerEventSubmit.postProperty.action.createListing1
      )

      // tracker.trackEvent(
      //   trackerEventConfig.postProperty.category,
      //   trackerEventConfig.postProperty.action.createListing1
      // );
      logEvent(trackerEventSubmit.postProperty.action.createListing1)
      analytics().logEvent(
        trackerEventSubmit.postProperty.action.fillPropertyDetails
      )
      // tracker.trackEvent(
      //   trackerEventConfig.postProperty.category,
      //   trackerEventConfig.postProperty.action.fillPropertyDetails
      // );
      logEvent(trackerEventSubmit.postProperty.action.fillPropertyDetails)
      this.props.navigation.navigate('UploadPhotoSell', {
        bodyData: body,
        setInitialStateCP: this._setInitialState.bind(this)
      })
    }
  }

  _setInitialState () {
    this.setState({ ...this.initialState })
  }

  getPropertyNameAutocompleteAPI (keyword) {
    if (!global.networkConnection) return
    const body = {
      keywords: keyword,
      limit: 1
    }

    APICaller(Http.autoCompleteEndPoint, 'POST', '', JSON.stringify(body)).then(
      json => {
        if (json.status === 200) {
          this.setState({ arrProperty: json.data.PROPERTY })
        } else {
          this.displayError()
        }
      }
    )
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }

  displayAutoCompleteList = key => {
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <TouchableOpacity
          style={styles.autoCompleteView}
          onPress={() => {
            this.setState({ arrProperty: '' })
            this.setState({ propertyName: key.label })
            this.setState({ address: key.address })
            this.setState({ postCode: key.postcode })
            this.setState({ landmarkLabelId: key.id })
            this.setState({
              lastLat: key.lat ? key.lat : 0,
              lastLong: key.lon ? key.lon : 0
            })
          }}
          accessible={true}
          accessibilityLabel='propSellAutoCompBtn'
        >
          <Text style={{ flex: 1 }}>{key.label}</Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: 'grey',
            width: Matrics.screenWidth - 30,
            height: 1
          }}
        />
      </View>
    )
  }

  returnAutoCompleteView = () => {
    return (
      <View
        // onStartShouldSetResponderCapture={() => {
        //   this.onStartShouldSetResponderCapture()
        // }}
        style={styles.returnAutoCompleteView2}
      >
        <FlatList
          style={styles.returnAutoCompleteView1}
          data={this.state.arrProperty}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <View>{this.displayAutoCompleteList(item)}</View>
          )}
          nestedScrollEnabled={true}
        />
      </View>
    )
  }

  setName () {
    this.setState({ arrProperty: '' })
    this.setState({ propertyName: this.state.searchString })
    this.setState({ address: '' })
    this.setState({ postCode: '' })
    this.setState({ landmarkLabelId: '' })
  }

  _displayCloseIcon () {
    return this.state.arrProperty !== '' ? (
      <TouchableOpacity
        onPress={() => this.setName()}
        style={styles.marginLeft(5)}
        accessible={true}
        accessibilityLabel='propSellCloseBtn'
      >
        <Icon name='close' size={25} />
      </TouchableOpacity>
    ) : (
      <View />
    )
  }
  onStartShouldSetResponderCapture = () => {
    this.setState({ enableScrollViewScroll: false })
    if (
      this._myScroll.contentOffset === 0 &&
      this.state.enableScrollViewScroll === false
    ) {
      this.setState({ enableScrollViewScroll: true })
    }
  }

  render () {
    return (
      <Container style={styles.style1}>
        <Header
          headerTitle='Create Listing'
          navigation={this.props.navigation}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior='padding'
          // onStartShouldSetResponderCapture={() => {
          //   this.setState({ enableScrollViewScroll: true })
          // }}
        >
          <ScrollView
            contentContainerStyle={styles.root}
            // scrollEnabled={this.state.enableScrollViewScroll}
            // ref={myScroll => (this._myScroll = myScroll)}
          >
            <View style={styles.style2}>
              <View style={styles.style3} />
              <View style={styles.style4} />
              <View style={styles.style5}>
                <Text style={styles.textCustom1(14, 'black', 'normal')}>
                  Step 1 of 3:{' '}
                </Text>
                <Text style={styles.textCustom1(14, 'black', 'bold')}>
                  Property Info
                </Text>
              </View>
            </View>
            {this.state.alert_message !== '' &&
              this.AlertView(this.state.alert_message)}

            <View style={styles.viewOne}>
              <Text style={styles.text1}>What is your property Type</Text>
              <View style={styles.viewTwo}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={
                      this.state.property_type === 'landed_sale'
                        ? styles.iconView
                        : {
                            ...styles.iconView,
                            backgroundColor: '#E5E5E5'
                          }
                    }
                    onPress={this._updatePropertyType('landed_sale')}
                    accessible={true}
                    accessibilityLabel='propSellLandSaleBtn'
                  >
                    <Image
                      testID='landed_sale'
                      source={
                        this.state.property_type === 'landed_sale'
                          ? HousesIcon
                          : HousesIconLite
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.text1}>Landed</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={
                      this.state.property_type === 'highrise_sale'
                        ? styles.iconView
                        : {
                            ...styles.iconView,
                            backgroundColor: '#E5E5E5'
                          }
                    }
                    onPress={this._updatePropertyType('highrise_sale')}
                    accessible={true}
                    accessibilityLabel='PropSellHeighRiseSaleBtn'
                  >
                    <Image
                      testID='highrise_sale'
                      source={
                        this.state.property_type === 'highrise_sale'
                          ? ApartmentIconDark
                          : ApartmentIcon
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.text1}>High-Rise</Text>
                </View>
              </View>

              {this.state.property_type !== '' ? (
                <View>
                  <Text style={styles.text2}>I am the owner of this unit:</Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={
                        this.state.im_the_owner_of_unit_yes
                          ? styles.button1
                          : {
                              ...styles.button1,
                              backgroundColor: '#E5E5E5'
                            }
                      }
                      onPress={this._updateImTheOwnerOfUnit(true)}
                      accessible={true}
                      accessibilityLabel='propSellOwnerYesBtn'
                    >
                      <Text
                        style={
                          this.state.im_the_owner_of_unit_yes
                            ? styles.text1
                            : { ...styles.text1, color: '#888888' }
                        }
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        this.state.im_the_owner_of_unit_no
                          ? styles.button1
                          : {
                              ...styles.button1,
                              backgroundColor: '#E5E5E5'
                            }
                      }
                      onPress={this._updateImTheOwnerOfUnit(false)}
                      accessible={true}
                      accessibilityLabel='propSellOwnerNoBtn'
                    >
                      <Text
                        style={
                          this.state.im_the_owner_of_unit_no
                            ? styles.text1
                            : { ...styles.text1, color: '#888888' }
                        }
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View />
              )}
            </View>

            {this.state.im_the_owner_of_unit_no === false &&
            this.state.im_the_owner_of_unit_yes === false ? (
              <View />
            ) : (
              <View>
                <View style={styles.formInputRoot}>
                  <Text style={styles.text1}>Property Name</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      testID='propertyName'
                      style={[styles.formInput, { flex: 1 }]}
                      placeholder='E.g Lily & Rose Apartment'
                      value={this.state['propertyName']}
                      onChangeText={val => {
                        this.setState({ searchString: val })
                        this.textInputChange(val, 'propertyName')
                        this.getPropertyNameAutocompleteAPI(val)
                      }}
                      onSubmitEditing={() => {
                        this.setState({ arrProperty: '' }, function () {
                          this.setState({
                            propertyName: this.state.searchString
                          })
                          this.setState({ address: '' })
                          this.setState({ postCode: '' })
                          this.setState({ landmarkLabelId: '' })
                        })
                      }}
                      keyboardType='default'
                      accessible={true}
                      accessibilityLabel='createListSellPropNameInput'
                    />

                    {this._displayCloseIcon()}
                  </View>

                  {this.state.arrProperty != '' &&
                  this.state.arrProperty != undefined &&
                  this.state.propertyName != '' ? (
                    <View
                      // onStartShouldSetResponderCapture={() => {
                      //   this.onStartShouldSetResponderCapture()
                      // }}
                      style={{
                        maxHeight: Matrics.ScaleValue(220),
                        width: Matrics.screenWidth - 30
                      }}
                    >
                      <FlatList
                        style={{
                          backgroundColor: '#eaebed',
                          borderColor: 'gray',
                          borderWidth: 1,
                          borderRadius: 5
                        }}
                        data={this.state.arrProperty}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item }) => (
                          <View>{this.displayAutoCompleteList(item)}</View>
                        )}
                        nestedScrollEnabled={true}
                      />
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
                {this.FormInputText(
                  'Address',
                  'E.g D 207, Jalan SS 26/10 Taman Mayang, Petaling Jaya',
                  'No msg',
                  'address',
                  false,
                  false,
                  'default'
                )}
                {this.FormInputText(
                  'Post Code',
                  'E.g 66558',
                  'No msg',
                  'postCode',
                  false,
                  true,
                  'number-pad',
                  8
                )}
                {this.state.property_type !== 'room' &&
                  this.FormInputText(
                    'Build-up Size (sqft)',
                    'E.g 1000',
                    '*this refers to the total area occupied by your property/house',
                    'sqft',
                    true,
                    true,
                    'number-pad',
                    6
                  )}

                <View style={styles.formInputGroupRoot}>
                  <View style={[styles.formInputGroup]}>
                    <Text style={styles.text1}> Title type:</Text>
                    <ModalSelector
                      data={this.state.leaseTypeData}
                      initValue='Select Type'
                      onChange={option => {
                        let leaseType = this.state.leaseTypeData.map(i => ({
                          ...i,
                          section: option.label === i.label ? true : false
                        }))
                        // console.log('++++', leaseType)
                        this.setState({ leaseTypeData: leaseType })
                        this.setState({ title_type: option.label })
                      }}
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
                        style={[
                          styles.picker,
                          { width: Matrics.screenWidth - 30 }
                        ]}
                        accessible={true}
                        accessibilityLabel='propSellTitleTypeBtn'
                      >
                        <Text>{this.state.title_type}</Text>
                        <Icon name='chevron-down' />
                      </TouchableOpacity>
                    </ModalSelector>
                  </View>
                </View>

                {this.state.property_type === 'landed_sale'
                  ? this.FormCommonInput({
                      title: 'Floor Level',
                      initValue: 'Select Floor Level',
                      updatedDataValue: this.state.floorLevelLandeddata,
                      stateName: 'floorLevelLanded',
                      stateVal: this.state.floorLevelLanded
                    })
                  : this.FormInputText(
                      'Floor Level',
                      'E.g 4',
                      '*',
                      'floorLevel',
                      false,
                      true,
                      'number-pad'
                    )}

                {this.state.property_type === 'room' &&
                  this.FormCommonInput({
                    title: 'Number of Pax',
                    initValue: 'Select Number of Pax',
                    updatedDataValue: this.state.paxdata,
                    stateName: 'pax',
                    stateVal: this.state.pax
                  })}

                {this.FormInputGroup()}
                {this.FormInputGroup2()}
                {this.FormInputText(
                  'Price',
                  '',
                  'No msg',
                  'price',
                  false,
                  true,
                  'number-pad',
                  12
                )}

                <View style={styles.queryView}>
                  <Text style={styles.text3}>Is the price negotiable: </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={
                        this.state.is_the_price_negotiable
                          ? styles.button1
                          : {
                              ...styles.button1,
                              backgroundColor: '#E5E5E5'
                            }
                      }
                      onPress={this._updateIsThePriceNegotiable(
                        !this.state.is_the_price_negotiable
                      )}
                      accessible={true}
                      accessibilityLabel='propSellNegYesBtn'
                    >
                      <Text
                        style={
                          this.state.is_the_price_negotiable
                            ? styles.text1
                            : { ...styles.text1, color: '#888888' }
                        }
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        this.state.is_the_price_negotiable
                          ? {
                              ...styles.button1,
                              backgroundColor: '#E5E5E5'
                            }
                          : styles.button1
                      }
                      onPress={this._updateIsThePriceNegotiable(
                        !this.state.is_the_price_negotiable
                      )}
                      accessible={true}
                      accessibilityLabel='propSellNegNoBtn'
                    >
                      <Text
                        style={
                          this.state.is_the_price_negotiable
                            ? { ...styles.text1, color: '#888888' }
                            : styles.text1
                        }
                        onPress={this._updateIsThePriceNegotiable(
                          !this.state.is_the_price_negotiable
                        )}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={this.checkPrice}
                  accessible={true}
                  accessibilityLabel='propSellNextBtn'
                >
                  <Text style={styles.text1}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={value => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}
