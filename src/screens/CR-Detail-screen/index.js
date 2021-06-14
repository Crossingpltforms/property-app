import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Share,
  StyleSheet,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-banner-carousel'

import { StackActions, NavigationActions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps'
import { withNavigationFocus } from 'react-navigation'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import { getLongDate } from '../../common/helper'
import CustomInteractionManager from '../../util/CustomInteractionManager'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'
// Import style
import ExtrainfoStyle from './styles'

// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'

import OnlyRM99 from '../../../Images/UI/only-rm-99.png'
import OnlyRM149 from '../../../Images/UI/only-rm-149.png'

const { width } = Dimensions.get('window')
import { getRoomTypeLabel } from '../../common/helper/common'
import { No_IMAGE_LINK } from '../../common/constants'

let counter = 0

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005

class MultipleCRDetail extends Component {
  constructor(props) {
    super(props)
    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      isMapReady: false,
      showErrorDialog: false,
      modalVisible: false,
      imageUri: undefined,
      favItemId: props.navigation.state.params.propertyInfo.favItemId
        ? props.navigation.state.params.propertyInfo.favItemId
        : '',
      isLogin: false,
      favProperty: props.navigation.state.params.propertyInfo.isfav
        ? true
        : false,
      alert_message: null,
      page: 0,
      relatedPropertiesList: '',
      userId: '',
      propertyInfo: props.navigation.state.params.propertyInfo.propertyData
        ? props.navigation.state.params.propertyInfo.propertyData
        : props.navigation.state.params.propertyInfo,
      reloading: false,
      reloadListFav: props.navigation.state.params.propertyInfo.reloadListFav,
      isActiveProperty: props.navigation.state.params.propertyInfo.active,
      imagePosition:
        this._imageSlider != null ? this._imageSlider.getCurrentPage() + 1 : 1,
      reportModal: false,
      reportListingText: '',
      scrollPosition: 0,
      report_error_msg: null,
      myCountry: 'Malaysia',
      token: '',
      didFinishInitialAnimation: false,
    }
  }

  componentDidMount() {
    CustomInteractionManager.runAfterInteractions(() => {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        this.setState({
          userId: (user_information && user_information.userId) || '',
          isLogin: user_information ? true : false,
          didFinishInitialAnimation: true,
        })
        this.getfavouritePropertiesDetails()
      }
      this.getRelatedProperties()
    })
  }

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // this.setState({
      //   reportModal: true
      // });
    }
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  getRelatedProperties = () => {
    const body = {
      propertyId: this.state.propertyInfo.id,
      pageNumber: this.state.page,
      pageSize: 10,
    }
    APICaller(
      Http.relatedPropertiesEndPoint,
      'POST',
      '',
      JSON.stringify(body)
    ).then((json) => {
      if (json.status === 200) {
        this.setState({ totalElements: json.data.totalElements })
        if (this.state.relatedPropertiesList.length > 0) {
          var arr = this.state.relatedPropertiesList.concat(json.data.content)
          this.setState({ relatedPropertiesList: arr })
        } else {
          this.setState({ relatedPropertiesList: json.data.content })
        }
        this._ViewPropertiesSlider()
      } else {
        this.displayError()
      }
    })
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.getRelatedProperties()
      }
    )
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  _navigationBack = () => this.props.navigation.goBack()

  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true
  }

  _toggleCheckBox = (key_name, value, form_state) => () =>
    this.setState({
      [form_state]: { ...this.state[form_state], [key_name]: value },
    })

  toggleModal(visible) {
    this.setState({ modalVisible: visible })
  }

  getfavouritePropertiesDetails = () => {
    try {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.favProperty(
            user_information && user_information.userId
              ? user_information.userId
              : ''
          )}`,
          'GET',
          user_information.token,
          ''
        ).then((json) => {
          if (!json) {
            return
          }
          if (json.status === 200) {
            const arrProperty = json.data.content
            const isFav = arrProperty.map((item, key) => {
              if (item.property.id === this.state.propertyInfo.id) {
                this.setState({ favItemId: item.id })
                this.setState({ favProperty: true })
                return
              }
            })
          } else {
            this.setState({
              favProperty: false,
            })
            this.displayError()
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  }

  removeFavouritePropertiesDetails = () => {
    try {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.removeFavProperty(this.state.favItemId)}`,
          'DELETE',
          user_information.token /*"BW8xUYul48rY0fYycpgKivUtr6boBjho"*/,
          ''
        ).then((json) => {
          if (!json) {
            return
          }
          if (json.status === 200) {
            this.setState({
              favProperty: false,
              alert_message: 'Property removed from favourites',
            })
            this._hideAlertView()
            if (this.state.reloadListFav) {
              this.state.reloadListFav(0)
            } else {
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MyFavourites' }),
                  ],
                })
              )
            }
          } else {
            this.setState({
              favProperty: true,
            })
            this.displayError()
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  }

  favouritePropertiesDetails = () => {
    const body = {
      propertyId: this.state.propertyInfo.id,
    }
    try {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.favProperty(
            user_information && user_information.userId
              ? user_information.userId
              : ''
          )}`,
          'POST',
          user_information.token,
          JSON.stringify(body)
        ).then((json) => {
          if (!json) {
            return
          }

          if (json.status === 200) {
            this.setState({ favItemId: json.data.id })

            this.setState({
              favProperty: true,
              alert_message: 'Liked this property',
            })
            this._hideAlertView()
          } else {
            this.displayError()
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  }
  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  _hideReportAlertView = () => {
    setTimeout(() => this.setState({ report_error_msg: null }), 2000)
  }

  onReportPropertySubit = () => {
    if (this.state.reportListingText.length > 0) {
      this.setState({ report_error_msg: null })
      this.onReportProperty()
      setTimeout(() => {
        try {
          if (this.props.isUserLogin == true) {
            let user_information = this.props.userLoginData
            var body = {
              reason: this.state.reportListingText,
            }
            APICaller(
              `${Http.reportProperty(this.state.propertyInfo.id)}`,
              'POST',
              user_information.token,
              JSON.stringify(body)
            ).then((json) => {
              if (!json) {
                return
              }
              if (
                json.status === 403 ||
                json.status === 401 ||
                json.status === 400
              ) {
                // TODO error reporting
              } else if (json.status === 200) {
                this.setState({
                  alert_message: 'Property reported successfully.',
                  reportListingText: '',
                })
                this._hideAlertView()
              } else if (json.status === 422) {
                this.setState({
                  alert_message: 'Property already reported.',
                  reportListingText: '',
                })
                this._hideAlertView()
              }
            })
          } else {
            this.props.navigation.navigate('Number', {
              screenName: 'ListingPageDetail',
            })
          }
        } catch (err) {
          alert(err)
        }
      }, 200)
    } else {
      this.setState({ report_error_msg: 'Please enter reason' })
      this._hideReportAlertView()
    }
  }

  onReportProperty = () => {
    if (this.props.isUserLogin == true) {
      this.setState({
        reportModal: !this.state.reportModal,
      })
    } else {
      this.props.navigation.navigate('Number', {
        screenName: 'ListingPageDetail',
      })
    }
  }

  AlertView = (message) => {
    if (!message) {
      return
    }
    return (
      <View
        style={{
          position: 'absolute',
          textAlign: 'center',
          backgroundColor: 'black',
          width: '90%',
          left: '5%',
          height: 70,
          bottom: '20%',
          zIndex: 1,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 0.8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: 'white',
          }}
        >
          {message.replace('null', 'empty')}
        </Text>
      </View>
    )
  }

  shareDetails = async () => {
    try {
      const shareURL = `https://speedhome.com/ads/${encodeURIComponent(
        this.state.propertyInfo.name
      )}-${this.state.propertyInfo.ref}`
      const result = await Share.share({
        message: shareURL,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  _viewInformation() {
    var isSale = this.state.propertyInfo.type.toLowerCase().includes('_sale')
    let roomType = getRoomTypeLabel(
      this.state.propertyInfo && this.state.propertyInfo.roomType != undefined
        ? this.state.propertyInfo.roomType
        : ''
    )
    const {
      rentalPeriod,
      rentalPeriodValue,
    } = this.props.navigation.state.params
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          marginTop: 10,
          padding: 10,
          width: width - 30,
        }}
      >
        <Text
          selectable={true}
          style={{
            fontSize: 18,
            textAlign: 'left',
            fontWeight: '600',
            color: '#000',
            fontFamily: 'OpenSans-SemiBold',
          }}
        >
          {this.state.propertyInfo.name}
        </Text>

        <Text
          selectable={true}
          style={{
            fontSize: 14,
            textAlign: 'left',
            fontFamily: 'OpenSans-Light',
            color: '#000',
          }}
        >
          {this.state.propertyInfo.address}
        </Text>

        <Text
          style={{
            paddingTop: 10,
            fontSize: 13,
            textAlign: 'left',
            fontFamily: 'OpenSans-SemiBold',
            color: 'green',
          }}
        >
          {this.state.propertyInfo.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
        </Text>

        <Text style={{ flexDirection: 'row', paddingTop: 10 }}>
          <Text
            style={{
              fontSize: 13,
              textAlign: 'left',
              fontFamily: 'OpenSans-Light',
              color: '#000',
            }}
          >
            {roomType !== ''
              ? roomType
              : `${this.state.propertyInfo.sqft} sqft`}{' '}
            |
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: 'left',
              fontFamily: 'OpenSans-Light',
              color: '#000',
            }}
          >
            {this.Capitalize(this.displayPorpertyType())} |
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: 'left',
              fontFamily: 'OpenSans-Light',
              color: '#000',
            }}
          >
            {this._displayFurnishType(this.state.propertyInfo.furnishType)}
          </Text>
          <Text
            style={{
              fontSize: 13,
              textAlign: 'left',
              fontFamily: 'OpenSans-Light',
              color: '#000',
            }}
          >
            {this._displayFloor()}
          </Text>
        </Text>

        <View
          style={{ paddingTop: 10, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, textAlign: 'left', color: '#000' }}>
              {this.state.propertyInfo.bedroom}
            </Text>
            <Image
              testID='bedroom'
              source={img1}
              style={{ height: 20, width: 20, marginLeft: 5 }}
            />
            <Text
              style={{
                fontSize: 14,
                textAlign: 'left',
                paddingLeft: 15,
                color: '#000',
              }}
            >
              {this.state.propertyInfo.bathroomType !== null
                ? this.Capitalize(
                    this.state.propertyInfo.bathroomType.toLowerCase()
                  )
                : this.state.propertyInfo.bathroom}
            </Text>
            <Image
              testID='carpark'
              source={img2}
              style={{ height: 20, width: 20, marginLeft: 5 }}
            />
            <Text
              style={{
                fontSize: 14,
                textAlign: 'left',
                paddingLeft: 15,
                color: '#000',
              }}
            >
              {this.state.propertyInfo.carpark}
            </Text>
            <Image
              testID='propertyInfo'
              source={img3}
              style={{ height: 20, width: 20, marginLeft: 5 }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginLeft: 5,
            }}
          >
            {!isSale && (
              <Text
                style={{
                  fontSize:
                    rentalPeriod != '12' && rentalPeriod != undefined ? 13 : 18,
                  marginRight: 5,
                  marginLeft:
                    rentalPeriod != '12' && rentalPeriod != undefined ? 5 : 0,
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#90278E',
                  fontFamily: 'OpenSans-SemiBold',
                }}
              >
                RM{' '}
                {this.format(
                  this.calculatePrice(this.state.propertyInfo.price)
                )}{' '}
                {rentalPeriod != '12' && rentalPeriod != undefined
                  ? `( including a ${rentalPeriodValue}% short term surcharge)`
                  : ''}
              </Text>
            )}

            {isSale && (
              <Text
                style={[
                  ExtrainfoStyle.noCommisionBoldTextStyle,
                  {
                    fontSize: 18,
                    marginRight: 5,
                    textAlign: 'left',
                    fontWeight: '600',
                    fontFamily: 'OpenSans-SemiBold',
                  },
                ]}
              >
                RM {this.format(this.state.propertyInfo.price)}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#ededed',
              borderRadius: 20,
              marginRight: 8,
            }}
          >
            <Image
              testID='userAvatar'
              source={{
                uri:
                  this.state.propertyInfo &&
                  this.state.propertyInfo.user &&
                  this.state.propertyInfo.avatar
                    ? this.state.propertyInfo.user.avatar
                    : No_IMAGE_LINK,
              }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'left',
              fontWeight: '300',
              color: '#000',
              fontFamily: 'OpenSans-Light',
            }}
          >
            {this.state.propertyInfo.user.name}
          </Text>
        </View>
      </View>
    )
  }

  displayPorpertyType() {
    if (
      this.state.propertyInfo &&
      this.state.propertyInfo.type.toLowerCase() === 'landed_sale'
    ) {
      return 'Landed-sale'
    } else if (
      this.state.propertyInfo &&
      this.state.propertyInfo.type.toLowerCase() === 'highrise_sale'
    ) {
      return 'Highrise-sale'
    } else {
      return (
        this.state.propertyInfo && this.state.propertyInfo.type.toLowerCase()
      )
    }
  }

  _displayFloor() {
    if (
      this.state.propertyInfo.type === 'LANDED' ||
      this.state.propertyInfo.type.toLowerCase() === 'landed_sale'
    ) {
      if (this.state.propertyInfo.storeys === 1) return '|Single Storey'
      if (this.state.propertyInfo.storeys === 2) return '|Double Storey'
      return '|More than 2 Storeys'
    }

    if (this.state.propertyInfo.level) {
      if (
        Math.floor(parseInt(this.state.propertyInfo.level) / 10) ===
          Math.round(parseInt(this.state.propertyInfo.level) / 10) &&
        parseInt(this.state.propertyInfo.level) % 10 !== 0
      ) {
        return `|Floor level: ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0}`
        ) + 1} - ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0`
        ) + 5}`
      } else {
        return `|Floor level: ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0` - 5
        ) + 1} - ${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0`
      }
    } else {
      return `|Floor level: ${this.state.propertyInfo.level}`
    }
  }

  _displayFurnishType(furnishType) {
    if (furnishType === 'NONE') {
      return 'Unfurnished'
    } else if (furnishType === 'PARTIAL') {
      return 'Partially Furnished'
    } else {
      return 'Fully Furnished'
    }
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  openForAll() {
    if (this.state.propertyInfo.allRaces === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='check-circle' color='#39D196' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            This property is open for all races
          </Text>
        </View>
      )
    }
  }
  isPetFriendly() {
    if (this.state.propertyInfo.petFriendly === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='check-circle' color='#39D196' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            This property is pet-friendly
          </Text>
        </View>
      )
    }
  }
  isMinStay() {
    var isSale = this.state.propertyInfo.type.toLowerCase().includes('_sale')
    const { rentalPeriod } = this.props.navigation.state.params
    if (!isSale === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='check-circle' color='#39D196' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            {/* Min. {(rentalPeriod != null && rentalPeriod != undefined) ? rentalPeriod : 3} month rental with surcharge */}
            {/* Min. 3 month rental with surcharge */}
            Minimum rental period of 3 month with surcharge
          </Text>
        </View>
      )
    }
  }

  openNegotiable() {
    if (this.state.propertyInfo.negotiable === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='check-circle' color='#39D196' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            The rental is negotiable
          </Text>
        </View>
      )
    }
  }

  _viewTitleType() {
    return (
      <View style={ExtrainfoStyle.PropertyInfoViewTab}>
        <Icon name='check-circle' color='#39D196' size={22} />
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          Title Type:{' '}
          {this.Capitalize(this.state.propertyInfo.leaseType.toLowerCase())}
        </Text>
      </View>
    )
  }
  _viewPropertyType() {
    return (
      <View style={ExtrainfoStyle.PropertyInfoViewTab}>
        <Icon name='check-circle' color='#39D196' size={22} />
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          This property is Bumi Lot
        </Text>
      </View>
    )
  }

  _viewPropertyDetail() {
    var isSale = this.state.propertyInfo.type.toLowerCase().includes('_sale')
    if (isSale) {
      return (
        <View style={ExtrainfoStyle.furnishingView}>
          {this._viewTitleType()}
          {this.state.propertyInfo.bumiLot && this._viewPropertyType()}
        </View>
      )
    } else {
      return (
        <View style={ExtrainfoStyle.furnishingView}>
          {this.state.propertyInfo.fullyFurnishable && (
            <View style={ExtrainfoStyle.PropertyInfoViewTab}>
              <Icon name='check-circle' color='#39D196' size={22} />
              <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
                Landlord is willing to furnish at extra cost
              </Text>
            </View>
          )}
          {this.openForAll()}
          {this.isMinStay()}
          {this.isPetFriendly()}
          {this.openNegotiable()}
        </View>
      )
    }
  }

  _viewFurnitureList() {
    return (
      <View
        style={{
          flex: 1,
          width: '85%',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <FlatList
          data={this.state.propertyInfo.furnishes}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 15,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              <Icon name='check-circle' color='#39D196' size={22} />
              <Text
                numberOfLines={1}
                style={[
                  ExtrainfoStyle.PropertyInfoViewTabLabel,
                  { marginLeft: 0, marginRight: 10 },
                ]}
              >
                {' '}
                {this.getName(item.replace('_', ' '))}
              </Text>
            </View>
          )}
          numColumns={2}
        />
      </View>
    )
  }
  different

  getName(stringName) {
    return stringName
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
  }

  _viewFacilityList() {
    return (
      <View
        style={{
          flex: 1,
          width: '85%',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <FlatList
          data={this.state.propertyInfo.facilities}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 15,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              <Icon name='check-circle' color='#39D196' size={22} />
              <Text
                numberOfLines={1}
                style={[
                  ExtrainfoStyle.PropertyInfoViewTabLabel,
                  { marginLeft: 0, marginRight: 10 },
                ]}
              >
                {' '}
                {this.getName(item.replace('_', ' '))}{' '}
              </Text>
            </View>
          )}
          numColumns={2}
        />
      </View>
    )
  }

  _viewAccessibilityList() {
    return (
      <View
        style={{
          flex: 1,
          width: '85%',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <FlatList
          data={this.state.propertyInfo.pois}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 15,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              <Icon name='place' color='#39D196' size={24} />
              <Text
                numberOfLines={2}
                style={[
                  ExtrainfoStyle.PropertyInfoViewTabLabel,
                  { marginLeft: 0, marginRight: 10 },
                ]}
              >
                {' '}
                {item.name ? item.name : ''} -{' '}
                {item != undefined && item.distance ? item.distance : ''}
                {' m '}
              </Text>
            </View>
          )}
          numColumns={1}
        />
      </View>
    )
  }

  _viewMap() {
    return (
      <MapView
        style={{
          height: 200,
          width: '100%',
          borderColor: 'black',
          borderWidth: 1,
          marginTop: 20,
        }}
        onMapReady={() => this.setState({ isMapReady: true })}
        initialRegion={{
          latitude: this.state.propertyInfo.latitude,
          longitude: this.state.propertyInfo.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {this.state.isMapReady == true && (
          <Marker
            coordinate={{
              latitude: this.state.propertyInfo.latitude,
              longitude: this.state.propertyInfo.longitude,
            }}
            description={this.state.propertyInfo.name}
          >
            <Icon name='place' color='red' size={24} />
          </Marker>
        )}
      </MapView>
    )
  }

  _viewNoDeposit() {
    if (
      this.state.propertyInfo != undefined &&
      this.state.propertyInfo.noDeposit === true
    ) {
      return this.state.propertyInfo.type === 'ROOM'
        ? this._calculationForRoom()
        : this._calculationForOther()
    }
  }

  _displayReport() {
    return this.state.propertyInfo.user.id === this.state.userId ? (
      <View />
    ) : (
      <View
        style={[
          ExtrainfoStyle.furnishingView,
          { alignItems: 'center', justifyContent: 'center', marginTop: 25 },
        ]}
      >
        <View style={[ExtrainfoStyle.styleReportView]}>
          <TouchableOpacity
            onPress={() => this.onReportProperty()}
            accessible={true}
            accessibilityLabel='crDetailReportBtn'
          >
            {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                textAlign: 'center',
                color: 'grey',
              }}
            >
              Report this listing now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _calculationForOther() {
    const price = this.state.propertyInfo.price
    const totalPrice =
      1 * this.calculatePrice(this.state.propertyInfo.price) + 399 * 1.06
    const { rentalPeriod } = this.props.navigation.state.params
    return (
      <View
        style={{
          backgroundColor: '#f3e1ff',
          height: 100,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: width * 0.8,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {this.state.propertyInfo &&
          this.state.propertyInfo.videos &&
          this.state.propertyInfo.videos.length > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                testID='noDeposit'
                source={imgNoDeposit}
                style={{ height: 60, width: 60, marginLeft: 60 }}
              />
              <Image
                testID='contactLess'
                source={imgContactLess}
                style={{ height: 50, width: 50, marginRight: 10 }}
              />
            </View>
          ) : (
            <Image
              testID='noDeposit'
              source={imgNoDeposit}
              style={{ height: 70, width: 70, marginLeft: 10 }}
            />
          )}

          <View style={{ flexDirection: 'column', marginRight: 50 }}>
            <Text style={[ExtrainfoStyle.imgTextBody, { paddingBottom: 5 }]}>
              To Move In :
            </Text>
            <Text>
              <Text style={ExtrainfoStyle.imgTextBody}>
                {`RM ${this.format(totalPrice)}`}{' '}
              </Text>
              <Text
                style={[
                  ExtrainfoStyle.imgTextTiny,
                  {
                    paddingLeft: 5,
                    fontSize: 15,
                    fontFamily: 'OpenSans-Light',
                  },
                ]}
              >
                {' '}
                {`(1st month ${this.calculatePrice(
                  this.state.propertyInfo.price
                )} + Tenancy Speedsign Fee 399 + 6%SST)`}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  calculatePrice(price) {
    const {
      rentalPeriod,
      rentalPeriodValue,
    } = this.props.navigation.state.params
    if (rentalPeriod != null && rentalPeriod != undefined) {
      const finalPrice =
        rentalPeriod != null && rentalPeriod == '12'
          ? parseInt((price / 12) * parseInt(rentalPeriod))
          : price + parseInt((price * rentalPeriodValue) / 100)
      return finalPrice
    } else {
      return this.state.propertyInfo.price
    }
  }

  format(amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  _calculationForRoom() {
    const price = this.calculatePrice(this.state.propertyInfo.price)
    // const totalPrice = 1 * this.state.propertyInfo.price + 149 * 1.06;
    const totalPrice = 1 * price + 149 * 1.06
    return price <= 799 ? (
      <View
        style={{
          backgroundColor: '#f3e1ff',
          height: 110,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: width * 0.8,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            testID='price'
            source={
              price >= 0 && price <= 499
                ? OnlyRM99
                : price >= 500 && price <= 799
                ? OnlyRM149
                : imgNoDeposit
            }
            style={
              price > 799
                ? { height: 70, width: 70, marginLeft: 10 }
                : { height: 50, width: 50, marginLeft: 10, marginRight: 10 }
            }
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={[ExtrainfoStyle.imgTextBody, { paddingBottom: 5 }]}>
              {price > 799
                ? 'To Move In :'
                : 'GET A TENANCY AGREEMENT FROM \nSPEEDSIGN'}
            </Text>
            <Text>
              {price > 799 && (
                <Text style={ExtrainfoStyle.imgTextBody}>RM {totalPrice}</Text>
              )}
              <Text
                style={[
                  ExtrainfoStyle.imgTextTiny,
                  {
                    paddingLeft: 5,
                    fontSize: 15,
                    fontFamily: 'OpenSans-Light',
                  },
                ]}
              >
                {price > 799
                  ? ` (1st month ${price} + Tenancy Speedsign Fee 399 + 6%SST)`
                  : 'Protect your rights with unbiased e-agreement'}
              </Text>
            </Text>
            {price <= 799 && (
              <TouchableOpacity
                onPress={this._openUrl('https://sign.speedrent.com/login')}
                accessible={true}
                accessibilityLabel='crLearnMoreBtn'
              >
                <Text style={styles.learnMoreLink}>Learn More</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    ) : (
      <View />
    )
  }

  _openUrl = (url) => () => Linking.openURL(url)

  _viewNoCommission() {
    // if (this.state.propertyInfo.noDeposit === true) {
    return (
      <View style={ExtrainfoStyle.noCommisionWrapperStyle}>
        <Text
          style={[ExtrainfoStyle.noCommisionBoldTextStyle, { marginBottom: 5 }]}
        >
          ZERO COMMISSION
        </Text>
        <Text style={ExtrainfoStyle.noCommisionNormalTextStyle}>
          Deal Directly with Owner
        </Text>
      </View>
    )
    // }
  }

  updateInfo = (data) => {
    this.setState({ scrollPosition: 0 })
    this.setState({ imagePosition: 1 })
    if (this._imageSlider != undefined) this._imageSlider.gotoPage(1)
    imagePos = 1
    this.setState({ page: 0 })
    this.setState({ propertyInfo: data })
    this.setState({ favProperty: false })
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      this.setState({
        userId:
          user_information && user_information.userId
            ? user_information.userId
            : '',
      })
      this.setState({ isLogin: user_information ? true : false })
      this.getfavouritePropertiesDetails()
    }
    this.setState({ relatedPropertiesList: '' }, function() {
      this.getRelatedProperties()
    })
    this._scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  _ViewPropertiesSlider(key) {
    let roomType = getRoomTypeLabel(
      key && key.roomType != undefined ? key.roomType : ''
    )

    return key != undefined && key != null ? (
      <TouchableOpacity
        onPress={() => {
          this.updateInfo(key)
        }}
        accessible={true}
        accessibilityLabel='crProgressiveImageBtn'
      >
        <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
          <View
            style={[
              ExtrainfoStyle.styleItem,
              {
                marginRight: 10,
                marginBottom: 10,
                borderColor: 'grey',
                borderWidth: 0.5,
                borderRadius: 5,
              },
            ]}
          >
            <View
              style={{ alignItems: 'center', width: '100%', borderRadius: 5 }}
            >
              <ProgressiveImageBackground
                source={{
                  uri:
                    key.images && key.images.length > 0
                      ? key.images[0].url
                      : No_IMAGE_LINK,
                }}
                style={{
                  height: 180,
                  width: width * 0.7,
                  backgroundColor: '#cccccc',
                  borderRadius: 5,
                }}
                imageStyle={{ borderRadius: 5 }}
              >
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexDirection: 'column',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {key.noDeposit === true && key.type !== 'ROOM' ? (
                      <Image
                        testID='noDeposit'
                        source={imgNoDeposit}
                        style={{ height: 50, width: 50 }}
                      />
                    ) : (
                      <View />
                    )}

                    {key.videos && key.videos.length > 0 ? (
                      <Image
                        testID='contactLess'
                        source={imgContactLess}
                        style={{ height: 40, width: 40, marginRight: 5 }}
                      />
                    ) : (
                      <View />
                    )}
                  </View>

                  <Text
                    style={[
                      ExtrainfoStyle.txtKmStyle,
                      {
                        marginTop:
                          key.noDeposit === true
                            ? key.type !== 'ROOM'
                              ? 0
                              : 10
                            : 10,
                      },
                    ]}
                  >
                    {key != undefined && key.distance ? key.distance : ''} Km
                  </Text>
                </View>
                <View style={ExtrainfoStyle.styleInfo}>
                  <View
                    style={[
                      ExtrainfoStyle.styleInfo,
                      { backgroundColor: 'white', height: 90 },
                    ]}
                  >
                    <View style={{ flexDirection: 'column' }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          paddingLeft: 10,
                          marginTop: 5,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            fontWeight: '500',
                            color: 'black',
                          }}
                        >
                          {key.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            marginTop: 5,
                            fontWeight: '500',
                            color: 'red',
                          }}
                        >
                          RM {this.format(key.price)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 10,
                          paddingTop: 5,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 10,
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Light',
                              color: '#000',
                            }}
                          >
                            {roomType !== '' ? roomType : `${key.sqft} sqft`} |
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 10,
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Light',
                              color: '#000',
                            }}
                          >
                            {' '}
                            {this.Capitalize(
                              this.displayPorpertyType(key.type.toLowerCase())
                            )}{' '}
                            |
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 10,
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Light',
                              color: '#000',
                            }}
                          >
                            {' '}
                            {this._displayFurnishType(key.furnishType)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 10,
                          paddingTop: 7,
                          alignItems: 'center',
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              color: '#000',
                            }}
                          >
                            {key.bedroom}
                          </Text>
                        </View>
                        <View>
                          <Image
                            testID='bedroom'
                            source={img1}
                            style={{ height: 15, width: 15, marginLeft: 10 }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              paddingLeft: 10,
                              color: '#000',
                            }}
                          >
                            {key.bathroom}
                          </Text>
                        </View>
                        <View>
                          <Image
                            testID='bathroom'
                            source={img2}
                            style={{ height: 15, width: 15, marginLeft: 10 }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              paddingLeft: 10,
                              color: '#000',
                            }}
                          >
                            {key.carpark}
                          </Text>
                        </View>
                        <View>
                          <Image
                            testID='carpark'
                            source={img3}
                            style={{ height: 15, width: 15, marginLeft: 10 }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ProgressiveImageBackground>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : null
  }

  displayPorpertiesType(propertyType) {
    if (propertyType === 'landed_sale') {
      return 'Landed-sale'
    } else if (propertyType === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return propertyType
    }
  }

  _viewFlatList() {
    return (
      <View style={{ width: '100%' }}>
        {/* {this._ViewPropertiesSlider()} */}
        <FlatList
          style={{ paddingBottom: 20 }}
          horizontal={true}
          data={this.state.relatedPropertiesList}
          renderItem={({ item }) => (
            <View>{this._ViewPropertiesSlider(item)}</View>
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.mySeparator}
          onEndReachedThreshold={1}
          onEndReached={() => {
            if (
              this.state.relatedPropertiesList.length !==
              this.state.totalElements
            ) {
              {
                this.handleLoadMore()
              }
            }
          }}
        />
      </View>
    )
  }

  _viewRecommondedProperties() {
    if (this.state.relatedPropertiesList.length > 0) {
      return (
        <View
          style={[
            ExtrainfoStyle.furnishingView,
            { alignItems: 'flex-start', marginTop: 25 },
          ]}
        >
          <Text
            style={{
              paddingLeft: 10,
              fontSize: 15,
              textAlign: 'left',
              fontWeight: '600',
              color: '#000',
              fontFamily: 'OpenSans-SemiBold',
            }}
          >
            Recommended properties
          </Text>
          {this._viewFlatList()}
        </View>
      )
    }
  }

  onPressNext() {
    const { navigation } = this.props
    navigation.goBack()
    navigation.state.params.onSelect({ propertyData: this.state.propertyInfo })
  }

  getUserData() {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then((response) => {
        this.setState({ myCountry: response.data.country })

        this.props.navigation.navigate('ChatRequest', {
          propertyInfo: this.state.propertyInfo,
          myCountry: this.state.myCountry,
          token: this.state.token,
        })
      })
    } else {
      this.props.navigation.navigate('ChatRequest', {
        propertyInfo: this.state.propertyInfo,
        myCountry: this.state.myCountry,
        token: this.state.token,
      })
    }
  }

  _displayChatWithOwner(isSale) {
    return this.state.propertyInfo.user.id === this.state.userId ? (
      <View />
    ) : (
      <View style={ExtrainfoStyle.bottomButton}>
        <View style={ExtrainfoStyle.styleViewShadow}>
          <TouchableOpacity
            onPress={() => this.onPressNext()}
            accessible={true}
            accessibilityLabel='crAddChatBtn'
          >
            {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                textAlign: 'center',
                color: '#000',
              }}
            >
              Add to Chat Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _navigationBack = () => this.props.navigation.goBack()

  renderPage(image, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          this.props.navigation.navigate('ImageView', {
            propertyInfo: this.state.propertyInfo,
          })
        }
        accessible={true}
        accessibilityLabel='crProprtyInfoBtn'
      >
        <ProgressiveImage
          testID='propertyInfo'
          key={index}
          source={{ uri: image.url ? image.url : No_IMAGE_LINK }}
          resizeMode='cover'
          style={[
            ExtrainfoStyle.imgStyle,
            {
              backgroundColor: '#cccccc',
              height: '100%',
              marginTop: 0,
            },
          ]}
        />
      </TouchableOpacity>
    )
  }

  viewImages() {
    return (
      <View>
        <Carousel
          ref={(component) => (this._imageSlider = component)}
          style={[styles.backgroundImage]}
          autoplay
          autoplayTimeout={3000}
          loop
          index={0}
          pageSize={width}
          pageIndicatorStyle={{ backgroundColor: 'white' }}
          activePageIndicatorStyle={{ backgroundColor: '#FF0054' }}
          onPageChanged={(index) => {
            this.setState({ imagePosition: index + 1 })
          }}
          showsPageIndicator={false}
        >
          {this.state.propertyInfo &&
            this.state.propertyInfo.images &&
            this.state.propertyInfo.images.map((image, index) =>
              this.renderPage(image, index)
            )}
        </Carousel>
      </View>
    )
  }

  _viewHeader() {
    return (
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.6)',
          'rgba(255, 255, 255, 0.4)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0)',
        ]}
      >
        <View
          style={{
            backgroundColor: `rgba(255, 225, 0, ${this.state.scrollPosition /
              18 /
              10})`,
            height: 50,
            width: '100%',
            padding: 10,
            justifyContent: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ flex: 2.5, alignItems: 'center', flexDirection: 'row' }}
            >
              <TouchableOpacity
                onPress={() => this._navigationBack()}
                accessible={true}
                accessibilityLabel='crBackBtn'
              >
                <Icon name='arrow-back' size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    )
  }

  handleOnScroll = (event) => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }

  render() {
    // var isSale = "LANDED_SALE".toLowerCase().includes("_sale");
    var isSale = this.state.propertyInfo.type.toLowerCase().includes('_sale')
    const { didFinishInitialAnimation } = this.state

    return (
      <View ref='_view'>
        {this.state.alert_message !== '' &&
          this.AlertView(this.state.alert_message)}
        {this.state.reloading ? null : (
          <ScrollView
            ref='_scrollView'
            ref={(id) => (this._scrollView = id)}
            onScroll={this.handleOnScroll}
            scrollEventThrottle={50}
          >
            <View
              style={[ExtrainfoStyle.root, { flex: 1, paddingBottom: 150 }]}
            >
              <View style={{ height: 350, width: width }}>
                {didFinishInitialAnimation ? this.viewImages() : null}

                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    height: 30,
                    width: 50,
                    borderRadius: 15,
                    marginLeft: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: -50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#FFF',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    {`${this.state.imagePosition} / ${
                      this.state.propertyInfo.images.length
                    }`}
                  </Text>
                </View>
              </View>

              {this._viewInformation()}

              {!isSale ? this._viewNoDeposit() : this._viewNoCommission()}

              {this._viewPropertyDetail()}

              <View
                style={[
                  ExtrainfoStyle.furnishingView,
                  { alignItems: 'flex-start', paddingLeft: 10, marginTop: 20 },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Availability :
                  </Text>
                  <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
                    {getLongDate(
                      this.state.propertyInfo.availability.substr(
                        0,
                        this.state.propertyInfo.availability.indexOf('T')
                      )
                    )}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Last Update :
                  </Text>
                  <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
                    {getLongDate(
                      this.state.propertyInfo.lastUpdated.substr(
                        0,
                        this.state.propertyInfo.lastUpdated.indexOf('T')
                      )
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  width: '100%',
                  height: 15,
                  marginTop: 10,
                }}
              />

              <View
                style={[
                  ExtrainfoStyle.furnishingView,
                  { alignItems: 'flex-start', paddingLeft: 10, marginTop: 20 },
                ]}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#000',
                    fontFamily: 'OpenSans-SemiBold',
                  }}
                >
                  Description
                </Text>
                <Text
                  style={[
                    ExtrainfoStyle.PropertyInfoViewTabLabel,
                    { marginTop: 20, marginLeft: 0 },
                  ]}
                >
                  {this.state.propertyInfo.description}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  width: '100%',
                  height: 15,
                  marginTop: 10,
                }}
              />

              {didFinishInitialAnimation && (
                <View
                  style={[
                    ExtrainfoStyle.furnishingView,
                    {
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                      marginTop: 20,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Furnishing
                  </Text>
                  {this._viewFurnitureList()}
                </View>
              )}

              {didFinishInitialAnimation && (
                <View
                  style={[
                    ExtrainfoStyle.furnishingView,
                    {
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                      marginTop: 25,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Facilities
                  </Text>
                  {this._viewFacilityList()}
                </View>
              )}

              {didFinishInitialAnimation && (
                <View
                  style={[
                    ExtrainfoStyle.furnishingView,
                    {
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                      marginTop: 25,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Accessibility
                  </Text>
                  {this._viewAccessibilityList()}
                </View>
              )}

              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  width: '100%',
                  height: 15,
                  marginTop: 10,
                }}
              />

              {didFinishInitialAnimation && (
                <View
                  style={[
                    ExtrainfoStyle.furnishingView,
                    { alignItems: 'flex-start', marginTop: 25 },
                  ]}
                >
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontSize: 15,
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'OpenSans-SemiBold',
                    }}
                  >
                    Location
                  </Text>
                  {this._viewMap()}
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {this._displayChatWithOwner(isSale)}

        <View style={{ position: 'absolute', height: 50, width: width }}>
          {this._viewHeader()}
        </View>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(MultipleCRDetail))

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: 350,
    resizeMode: 'cover',
  },
  reportInputText: {
    width: '90%',
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  viewModal2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  viewModal1: {
    borderRadius: 6,
    width: '100%',
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
  },
  buttonSubmit: {
    justifyContent: 'center',
    backgroundColor: '#FFE100',
    height: 42,
    alignItems: 'center',
    width: '30%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
  },
})
