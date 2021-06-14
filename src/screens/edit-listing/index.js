import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  FlatList,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Header from '../common/Header'
import ModalSelector from 'react-native-modal-selector'
import Icon from 'react-native-vector-icons/FontAwesome'
// import images
import HousesIcon from '../../../Images/houses.png'
import HousesIconLite from '../../../Images/houses_lite.png'
import BedIcon from '../../../Images/bed.png'
import BedIconDark from '../../../Images/bed_dark.png'
import ApartmentIcon from '../../../Images/apartment.png'
import ApartmentIconDark from '../../../Images/apartment_dark.png'
import styles from './styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ErrorDialog from '../../components/ErrorDialog'

import {
  roomTypesConst as RoomType,
  bedRoomTypeConst,
  bedRoomTypeConstHighrise,
  bathRoomTypeConst,
  parkingTypeConst,
  furnishingTypeConst,
  floorLevelLandedTypeConst,
  paxTypeConst,
  bathRoom_roomtype_Type_Const
} from '../../common/constants/index'
import { Matrics } from '../../common/styles'

// const FormInput = props => (
//   <View style={styles.formInputRoot}>
//     <Text style={styles.text1}> {props.title}</Text>
//     <TextInput
//       style={styles.formInput}
//       placeholder={props.placeholder}
//       value={props.stateName}
//       onChangeText={val => props.onChange}
//     />
//     {props.showAlert && (
//       <Text style={styles.formTextError}>{props.alertMsg}</Text>
//     )}
//   </View>
// );

class Editlisting extends Component {
  constructor (props) {
    super(props)

    let propertyType = (this.props.navigation.state.params.details
      ? this.props.navigation.state.params.details.type
      : ''
    ).split('_')
    let isSale = false

    if (propertyType.length > 1 && propertyType[1] === 'SALE') {
      isSale = true
    }

    this.state = {
      showErrorDialog: false,
      arrProperty: '',
      itemName: '',
      Sqtfeet: '',
      bathRoom: '',
      parking: '',
      price: '',
      roomType: 'Single',
      alert_message: '',
      property_type: 'landed',
      im_the_owner_of_unit: null,
      is_the_price_negotiable: null,
      im_willing_to_fully_furnish: null,
      furnishing: 'Unfurnished',
      roomTypedata: RoomType,
      property_id: 0,
      bedroom: 0,
      furnish: '',
      bathRoom_roomtype_data: bathRoom_roomtype_Type_Const,
      bathroom: 1,
      bedRoomdata: bedRoomTypeConst,
      bedRoomdataHighrise: bedRoomTypeConstHighrise,
      bathRoomdata: bathRoomTypeConst,
      parkingdata: parkingTypeConst,
      furnishingdata: furnishingTypeConst,
      floorLevelLandeddata: floorLevelLandedTypeConst,
      paxdata: paxTypeConst,
      pax: 1,
      floorLevel: null,
      floorLevelLanded: 'Single',
      postCode: null,
      propertyName: null,
      sqft: null,
      address: null,
      storeys: null,
      listDetailsData: '',
      bathRoom_roomtype: 'Private',
      level: '',
      lastLat: 0,
      lastLong: 0,
      isSale,
      enableScrollViewScroll: true,
      title_type: 'Choose one',
      leaseTypeData: [
        { key: 1, section: false, label: 'Lease Hold', value: 'LEASEHOLD' },
        { key: 2, section: false, label: 'Free Hold', value: 'FREEHOLD' }
      ]
    }
  }

  displayError () {
    this.setState({ showErrorDialog: true })
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

  componentDidMount () {
    const details = this.props.navigation.state.params.details

    this.setState({
      property_type: details.type ? details.type.toLowerCase() : 'landed',
      lastLat: details.latitude,
      lastLong: details.longitude,
      listDetailsData: details,
      pax: details.roommate,
      property_id: details.id,
      itemName: details.name,
      roomType: details.roomType ? details.roomType : '',

      sqft: details.sqft ? details.sqft.toString() : '0',
      floorLevelLanded: floorLevelLandedTypeConst.filter(i =>
        i.key === details.storeys ? details.storeys : 1
      )[0].label,
      storeys: details.level ? details.level.toString() : '1',
      bedroom: details.bedroom
        ? details.bedroom.toString()
        : details.type.toLowerCase() === 'landed_sale' ||
          details.type.toLowerCase() === 'landed'
        ? '1'
        : 'Studio',
      parking: details.carpark ? details.carpark.toString() : '0',
      price: details.price ? details.price.toString() : '0',
      postCode: details.postcode ? details.postcode.toString() : '0',
      address: details.address,
      furnishing: details.furnishType ? details.furnishType.toString() : '0',
      title_type: details.leaseType ? details.leaseType : 'Choose Type',
      im_the_owner_of_unit: details.owner,
      is_the_price_negotiable: details.negotiable,
      im_willing_to_fully_furnish: details.fullyFurnishable,
      images: details.images,
      level: details.level,
      floorLevel:
        details.type.toLowerCase() === 'landed' ||
        details.type.toLowerCase() === 'landed_sale'
          ? floorLevelLandedTypeConst.filter(i =>
              i.key === details.storeys ? details.storeys : 1
            )[0].label
          : details.level,
      // TODO which to use?
      floorLevelLanded:
        details.type.toLowerCase() === 'landed' ||
        details.type.toLowerCase() === 'landed_sale'
          ? floorLevelLandedTypeConst.filter(i =>
              i.key === details.storeys ? details.storeys : 1
            )[0].label
          : details.level
    })

    if (
      details.type.toString().toLowerCase() === 'landed_sale' ||
      details.type.toString().toLowerCase() === 'landed'
    ) {
      const arrBedStudioType = this.state.bedRoomdata.map((val, index) => {
        if (
          val.key.toString().toLowerCase() ===
          details.bedroom.toString().toLowerCase()
        ) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState(
        {
          bedRoomdata: arrBedStudioType
        },
        () => {}
      )
    } else {
      const arrBedType = this.state.bedRoomdataHighrise.map((val, index) => {
        if (
          val.key.toString().toLowerCase() ===
          details.bedroom.toString().toLowerCase()
        ) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState(
        {
          bedRoomdataHighrise: arrBedType
        },
        () => {}
      )
    }

    var newitem = [],
      newRoomTypeData = [],
      newfloorLandedData = []
    let key = 1
    for (let furnish of this.state.furnishingdata) {
      let section = false
      if (furnish.value.toLowerCase() === details.furnishType.toLowerCase()) {
        section = true
        this.setState({
          furnishing: furnish.label
        })
      }
      newitem.push({
        key: key,
        section: section,
        label: furnish.label,
        value: furnish.value
      })
      key++
      this.setState(
        {
          furnishingdata: newitem
        },
        () => {}
      )
    }

    if (this.state.isSale) {
      const arrLeaseType = this.state.leaseTypeData.map((val, index) => {
        if (val.value.toLowerCase() === details.leaseType.toLowerCase()) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState({
        leaseTypeData: arrLeaseType
      })
    }

    if (details.type.toLowerCase() === 'room') {
      this.setState({
        bathRoom_roomtype: details.bathroomType
          ? details.bathroomType
              .toString()
              .charAt(0)
              .toUpperCase() +
            details.bathroomType
              .toString()
              .slice(1)
              .toLowerCase()
          : 'Private'
      })
    } else {
      this.setState({
        bathroom: details.bathroom ? details.bathroom.toString() : '0'
      })
    }

    const arrParkType = this.state.parkingdata.map((val, index) => {
      if (val.label.toString() === details.carpark.toString()) {
        val.section = true
      } else {
        val.section = false
      }
      return val
    })
    this.setState({
      parkingdata: arrParkType
    })

    if (details.type.toLowerCase() === 'room') {
      for (let room of this.state.roomTypedata) {
        let section = false
        if (room.value.toLowerCase() === details.roomType.toLowerCase()) {
          section = true
          this.setState({
            roomType: room.label
          })
        }
        newRoomTypeData.push({
          key: key,
          section: section,
          label: room.label,
          value: room.value
        })
        key++
        this.setState(
          {
            roomTypedata: newRoomTypeData
          },
          () => {}
        )
      }
      const arrBathroomType = this.state.bathRoom_roomtype_data.map(
        (val, index) => {
          if (
            val.label.toLowerCase() ===
            details.bathroomType.toString().toLowerCase()
          ) {
            val.section = true
          } else {
            val.section = false
          }
          return val
        }
      )
      this.setState({
        bathRoom_roomtype_data: arrBathroomType
      })
      const arrpaxType = this.state.paxdata.map((val, index) => {
        if (val.label.toString() === details.roommate.toString()) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState({
        paxdata: arrpaxType
      })
    } else {
      const arrBathType = this.state.bathRoomdata.map((val, index) => {
        if (val.label.toString() === details.bathroom.toString()) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState({
        bathRoomdata: arrBathType
      })
      const arrBedType = this.state.bedRoomdata.map((val, index) => {
        if (val.label.toString() === details.bedroom.toString()) {
          val.section = true
        } else {
          val.section = false
        }
        return val
      })
      this.setState({
        bedRoomdata: arrBedType
      })
    }

    if (
      details.type.toLowerCase() === 'landed' ||
      details.type.toLowerCase() === 'landed_sale'
    ) {
      for (let fLevel of this.state.floorLevelLandeddata) {
        let section = false
        if (fLevel.key === details.storeys) {
          section = true
          this.setState({
            floorLevelLanded: fLevel.label
          })
        }
        newfloorLandedData.push({
          key: fLevel.key,
          section: section,
          label: fLevel.label
        })
        key++
        this.setState(
          {
            floorLevelLandeddata: newfloorLandedData
          },
          () => {}
        )
      }
    }
  }

  bindDataInUI () {}

  _hideAlertView () {
    setTimeout(() => this.setState({ ...this.state, alert_message: '' }), 2000)
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
              accessibilityLabel='editScreenDownBtn'
            >
              <Text>{stateVal}</Text>
              <Icon name='chevron-down' />
            </TouchableOpacity>
          </ModalSelector>
        </View>
      </View>
    )
  }

  FormInputText = (
    title,
    placeholder,
    alertMsg,
    stateName,
    showAlert,
    keyboard,
    value = null,
    textLimit = null
  ) => {
    return (
      <View style={styles.formInputRoot}>
        <Text style={styles.text1}> {title}</Text>
        <TextInput
          testID='stateName'
          style={styles.formInput}
          placeholder={placeholder}
          value={value}
          onChangeText={val => this.textInputChange(val, stateName)}
          keyboardType={keyboard}
          maxLength={textLimit}
          accessible={true}
          accessibilityLabel='editListingStateNameInput'
        />
        {showAlert && <Text style={styles.formTextError}>{alertMsg}</Text>}
      </View>
    )
  }

  textInputChange = (val, stateName) => this.setState({ [stateName]: val })

  changeOption = (data, stateName, option) => {
    this.setState({
      [stateName]: option.label
    })
    ;+'  ' + this.state.floorLevel

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

  _displayCloseIcon () {
    return this.state.arrProperty !== '' ? (
      <TouchableOpacity
        onPress={() => this.setName()}
        style={{ marginLeft: 5 }}
        accessible={true}
        accessibilityLabel='editScreenCloseIconBtn'
      >
        <Icon name='close' size={25} />
      </TouchableOpacity>
    ) : (
      <View />
    )
  }

  setName () {
    this.setState({ arrProperty: '' })
    this.setState({ itemName: this.state.searchString })
    this.setState({ address: '' })
    this.setState({ postCode: '' })
    this.setState({
      lastLat: 0,
      lastLong: 0
    })
  }

  returnAutoCompleteView = () => {
    return (
      <View
        // onStartShouldSetResponderCapture={() => {
        //   this.onStartShouldSetResponderCapture()
        // }}
        style={{
          height: Matrics.ScaleValue(220),
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
        />
      </View>
    )
  }

  displayAutoCompleteList = key => {
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <TouchableOpacity
          style={{
            height: Matrics.ScaleValue(30),
            justifyContent: 'center',
            padding: 5
          }}
          onPress={() => {
            this.setState({ arrProperty: '' })
            this.setState({ itemName: key.label })
            this.setState({ address: key.address })
            this.setState({ postCode: key.postcode })
            this.setState({
              lastLat: key.lat ? key.lat : 0,
              lastLong: key.lon ? key.lon : 0
            })
          }}
          accessible={true}
          accessibilityLabel='editScreenAutoCompListBtn'
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

  _updatePropertyType = val => () => {
    if (val === 'landed' || val === 'landed_sale') {
      this.setState({
        ...this.state,
        property_type: val,
        floorLevel: this.state.floorLevelLandeddata.filter(i =>
          i.key === this.state.storeys ? this.state.storeys : 1
        )[0].label,
        floorLevelLanded: this.state.floorLevelLandeddata.filter(i =>
          i.key === this.state.storeys ? this.state.storeys : 1
        )[0].label
      })
    } else {
      this.setState({
        ...this.state,
        property_type: val,
        floorLevel: this.state.level ? this.state.level : ''
      })
    }
  }

  _updateImTheOwnerOfUnit = val => () =>
    this.setState({ ...this.state, im_the_owner_of_unit: val })

  _updateIsThePriceNegotiable = val => () =>
    this.setState({ ...this.state, is_the_price_negotiable: val })

  _updateImWillingToFullyFurnish = val => () =>
    this.setState({ ...this.state, im_willing_to_fully_furnish: val })

  _navigateUploadPhoto = () =>
    this.props.navigation.navigate('Editlistupload', {
      details: this.state.listDetailsData,
      item: this.props.navigation.state.params.item
    })

  FormInputGroup () {
    const Proptype = this.state.property_type

    return (
      <View style={styles.formInputGroupRoot}>
        {this.state.property_type !== 'room' ? (
          <View style={styles.formInputGroup}>
            <Text style={styles.text1}> Bedroom</Text>
            <ModalSelector
              data={
                Proptype === 'landed_sale' || Proptype === 'landed'
                  ? this.state.bedRoomdata
                  : this.state.bedRoomdataHighrise
              }
              initValue='Select Bedroom'
              onChange={option =>
                this.changeOption(
                  this.state.property_type === 'landed_sale' ||
                    this.state.property_type === 'landed'
                    ? this.state.bedRoomdata
                    : this.state.bedRoomdataHighrise,
                  'bedroom',
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
                style={styles.picker}
                accessible={true}
                accessibilityLabel='editScreenBedBtn'
              >
                {this.state.property_type === 'landed_sale' ||
                this.state.property_type !== 'landed' ? (
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
                accessibilityLabel='editScreenRoomTypeBtn'
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
              accessibilityLabel='editScreenBathBtn'
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
  }

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
            accessibilityLabel='editScreenParkBtn'
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
            accessibilityLabel='editScreenFurnBtn'
          >
            <Text>{this.state.furnishing}</Text>
            <Icon name='chevron-down' />
          </TouchableOpacity>
        </ModalSelector>
      </View>
    </View>
  )

  updatePropertyAPI = () => {
    if (!global.networkConnection) return
    const furnish_type = this.state.furnishingdata.filter(res => res.section)

    if (!this.state.itemName) {
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
      this.state.property_type !== 'landed' &&
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
      var body = {
        name: this.state.itemName,
        address: this.state.address,
        postcode: this.state.postCode,
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
      if (this.state.isSale) {
        body['leaseType'] = this.state.title_type
          .split(' ')
          .join('')
          .toUpperCase()
      }
      if (this.state.property_type === 'room') {
        const room_type = this.state.roomTypedata.filter(res => res.section)
        body['roomType'] =
          room_type.length > 0 ? room_type[0].value.toUpperCase() : 'SMALL'
        body['level'] =
          this.state.property_type.toLowerCase() !== 'landed' ||
          this.state.property_type.toLowerCase() !== 'landed_sale'
            ? this.state.floorLevel
            : ''
        body['roommate'] = this.state.pax
        body['bathroomType'] = this.state.bathRoom_roomtype.toUpperCase()
      } else if (
        this.state.property_type === 'landed' ||
        this.state.property_type === 'landed_sale'
      ) {
        const f_level = this.state.floorLevelLandeddata.filter(
          // TODO is this used?
          res => res.section
        )
        body['storeys'] =
          this.state.property_type.toLowerCase() === 'landed' ||
          this.state.property_type.toLowerCase() === 'landed_sale'
            ? floorLevelLandedTypeConst.filter(
                i => i.label === this.state.floorLevelLanded
              )[0].key
            : 1
        if (
          this.state.property_type === 'landed_sale' ||
          this.state.property_type === 'landed'
        ) {
          body['bedroom'] = this.state.bedroom
        } else {
          body['bedroom'] =
            this.state.bedroom === 'Studio' ? '0' : this.state.bedroom
        }
        body['bathroom'] = this.state.bathroom
        body['sqft'] = this.state.sqft
      } else {
        body['level'] =
          this.state.property_type.toLowerCase() !== 'landed' ||
          this.state.property_type.toLowerCase() !== 'landed_sale'
            ? this.state.floorLevel
            : ''
        if (
          this.state.property_type === 'landed_sale' ||
          this.state.property_type === 'landed'
        ) {
          body['bedroom'] = this.state.bedroom
        } else {
          body['bedroom'] =
            this.state.bedroom === 'Studio' ? '0' : this.state.bedroom
        }
        body['bathroom'] = this.state.bathroom
        body['sqft'] = this.state.sqft
      }

      try {
        if (this.props.isUserLogin == true) {
          let user_information = this.props.userLoginData
          APICaller(
            `${Http.updateProperty(this.state.property_id)}`,
            'PUT',
            user_information.token,
            JSON.stringify(body)
          ).then(json => {
            if (!json) {
              return
            }
            if (json.status === 200) {
              // this.props.navigation.navigate("Editlistupload", {item: this.props.navigation.state.params.details});

              this.props.navigation.navigate('Editlistupload', {
                details: this.state.listDetailsData,
                item: this.state.images ? this.state.images : [],
                property_id: this.state.property_id
                  ? this.state.property_id
                  : null
              })
            } else {
              this.setState({
                ...this.state
              })
              this._hideAlertView()

              this.displayError()
            }
          })
        } else {
          if (!this.state.itemName) {
            this.setState({
              ...this.state,
              alert_message: 'Enter property name'
            })
            this._hideAlertView()
          } else if (!this.state.address) {
            this.setState({ ...this.state, alert_message: 'Enter address' })
            this._hideAlertView()
          } else if (!this.state.postCode) {
            this.setState({
              ...this.state,
              alert_message: 'Enter postal code'
            })
            this._hideAlertView()
          } else if (!this.state.sqft) {
            this.setState({
              ...this.state,
              alert_message: 'Enter Square feet'
            })
            this._hideAlertView()
          } else if (!this.state.storeys) {
            this.setState({
              ...this.state,
              alert_message: 'Enter Floor level'
            })
            this._hideAlertView()
          } else {
            this.props.navigation.navigate('Editlistupload', {
              details: this.state.listDetailsData,
              item: this.state.images ? this.state.images : [],
              property_id: this.state.property_id
                ? this.state.property_id
                : null
            })
          }
        }
      } catch (err) {
        alert(err)
      }
    }
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
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Header headerTitle='Edit Listing' navigation={this.props.navigation} />
        <KeyboardAvoidingView
          // onStartShouldSetResponderCapture={() => {
          //   this.setState({ enableScrollViewScroll: true })
          // }}
          style={{ flex: 1 }}
          behavior='padding'
        >
          <ScrollView contentContainerStyle={styles.root}>
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
                {!this.state.isSale && (
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      style={
                        this.state.property_type === 'room'
                          ? styles.iconView
                          : {
                              ...styles.iconView,
                              backgroundColor: '#E5E5E5'
                            }
                      }
                      activeOpacity={1}
                      accessible={true}
                      accessibilityLabel='editScreenRoomImageBtn'
                    >
                      <Image
                        testID='room'
                        source={
                          this.state.property_type === 'room'
                            ? BedIconDark
                            : BedIcon
                        }
                      />
                    </TouchableOpacity>
                    <Text style={styles.text1}>Room</Text>
                  </View>
                )}
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={
                      this.state.property_type === 'landed' ||
                      this.state.property_type === 'landed_sale'
                        ? styles.iconView
                        : {
                            ...styles.iconView,
                            backgroundColor: '#E5E5E5'
                          }
                    }
                    activeOpacity={1}
                    accessible={true}
                    accessibilityLabel='editScreenLandedSaleBtn'
                  >
                    <Image
                      testID='landed_sale'
                      source={
                        this.state.property_type === 'landed' ||
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
                      this.state.property_type === 'highrise' ||
                      this.state.property_type === 'highrise_sale'
                        ? styles.iconView
                        : {
                            ...styles.iconView,
                            backgroundColor: '#E5E5E5'
                          }
                    }
                    activeOpacity={1}
                    accessible={true}
                    accessibilityLabel='editScreenHighRiseSaleBtn'
                  >
                    <Image
                      testID='highrise_sale'
                      source={
                        this.state.property_type === 'highrise' ||
                        this.state.property_type === 'highrise_sale'
                          ? ApartmentIconDark
                          : ApartmentIcon
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.text1}>High-Rise</Text>
                </View>
              </View>
              <Text style={styles.text2}>I am the owner of this unit:</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={
                    this.state.im_the_owner_of_unit
                      ? styles.button1
                      : {
                          ...styles.button1,
                          backgroundColor: '#E5E5E5'
                        }
                  }
                  onPress={this._updateImTheOwnerOfUnit(
                    !this.state.im_the_owner_of_unit
                  )}
                  accessible={true}
                  accessibilityLabel='editScreenOwnerYesBtn'
                >
                  <Text
                    style={
                      this.state.im_the_owner_of_unit
                        ? styles.text1
                        : { ...styles.text1, color: '#888888' }
                    }
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.state.im_the_owner_of_unit
                      ? {
                          ...styles.button1,
                          backgroundColor: '#E5E5E5'
                        }
                      : styles.button1
                  }
                  onPress={this._updateImTheOwnerOfUnit(
                    !this.state.im_the_owner_of_unit
                  )}
                  accessible={true}
                  accessibilityLabel='editScreenOwnerNoBtn'
                >
                  <Text
                    style={
                      this.state.im_the_owner_of_unit
                        ? { ...styles.text1, color: '#888888' }
                        : styles.text1
                    }
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formInputRoot}>
              <Text style={styles.text1}> Property Name </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  testID='state'
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder='E.g Lily & Rose Apartment'
                  value={this.state['itemName']}
                  onChangeText={val => {
                    this.setState({ searchString: val })
                    this.textInputChange(val, 'itemName')
                    this.getPropertyNameAutocompleteAPI(val)
                  }}
                  onSubmitEditing={() => {
                    this.setState({ arrProperty: '' }, function () {
                      this.setState({ itemName: this.state.searchString })
                      this.setState({ address: '' })
                      this.setState({ postCode: '' })
                      this.setState({
                        lastLat: 0,
                        lastLong: 0
                      })
                    })
                  }}
                  keyboardType='default'
                  accessible={true}
                  accessibilityLabel='editListingApartmentInput'
                />

                {this._displayCloseIcon()}
              </View>

              {this.state.arrProperty != '' &&
              this.state.arrProperty != undefined &&
              this.state.itemName != '' ? (
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
              'default',
              this.state.address,
              null
            )}
            {this.FormInputText(
              'Post Code',
              'E.g 66558',
              'No msg',
              'postCode',
              false,
              'number-pad',
              this.state.postCode,
              8
            )}
            {this.state.property_type !== 'room' &&
              this.FormInputText(
                'Build-up Size (sqft)',
                'E.g 1000',
                '*this refers to the total area occupied by your property/house',
                'sqft',
                true,
                'number-pad',
                this.state.sqft,
                6
              )}
            {this.state.isSale && (
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
                      accessibilityLabel='editScreenTitleTypeBtn'
                    >
                      <Text>
                        {this.state.title_type
                          .split('H')
                          .join(' H')
                          .split(' ')
                          .map(
                            i => `${i.charAt(0)}${i.substr(1).toLowerCase()}`
                          )
                          .join(' ')}
                      </Text>
                      <Icon name='chevron-down' />
                    </TouchableOpacity>
                  </ModalSelector>
                </View>
              </View>
            )}

            {this.state.property_type === 'landed' ||
            this.state.property_type === 'landed_sale'
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
                  'number-pad',
                  this.state.floorLevel,
                  null
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
              'number-pad',
              this.state.price,
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
                  accessibilityLabel='editScreenNegYesBtn'
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
                  accessibilityLabel='editScreenNegNoBtn'
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

            {!this.state.isSale && this.state.furnishing !== 'Fully furnished' && (
              <View style={styles.queryView}>
                <Text style={styles.text3}>
                  I'm willing to fully furnish this unit at extra cost:{' '}
                </Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={
                      this.state.im_willing_to_fully_furnish
                        ? styles.button1
                        : {
                            ...styles.button1,
                            backgroundColor: '#E5E5E5'
                          }
                    }
                    onPress={this._updateImWillingToFullyFurnish(
                      !this.state.im_willing_to_fully_furnish
                    )}
                    accessible={true}
                    accessibilityLabel='editScreenFurnYesBtn'
                  >
                    <Text
                      style={
                        this.state.im_willing_to_fully_furnish
                          ? styles.text1
                          : { ...styles.text1, color: '#888888' }
                      }
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.state.im_willing_to_fully_furnish
                        ? {
                            ...styles.button1,
                            backgroundColor: '#E5E5E5'
                          }
                        : styles.button1
                    }
                    onPress={this._updateImWillingToFullyFurnish(
                      !this.state.im_willing_to_fully_furnish
                    )}
                    accessible={true}
                    accessibilityLabel='editScreenFurnNoBtn'
                  >
                    <Text
                      style={
                        this.state.im_willing_to_fully_furnish
                          ? { ...styles.text1, color: '#888888' }
                          : styles.text1
                      }
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.button2}
              onPress={() => this.updatePropertyAPI()}
              accessible={true}
              accessibilityLabel='editScreenNextBtn'
            >
              <Text style={styles.text1}>Next</Text>
            </TouchableOpacity>
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
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editlisting)
