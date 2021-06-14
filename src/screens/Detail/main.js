import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Share,
  AppState,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-banner-carousel'
import YouTube from '../../util/youtubeController'
import { NavigationActions, StackActions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { withNavigationFocus } from 'react-navigation'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import { No_IMAGE_LINK, NETCORE_TRACK_EVENT } from '../../common/constants'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'
import CustomInteractionManager from '../../util/CustomInteractionManager'
// Import style
import ExtrainfoStyle from './styles'

import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'
// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'

import { getRoomTypeLabel } from '../../common/helper/common'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import ErrorDialog from '../../components/ErrorDialog'
import { connectSocket, subscribe } from '../../api/socketIo'
import {
  CONVERSATION,
  TOPIC_TOKEN,
  TOPIC_USER,
  SESSION_USER
} from '../../api/socket-event'
import DetailsMap from './DetailsMap'
import DetailsAccessibilites from './DetailsAccessibilites'
import DetailsFacilities from './DetailsFacilities'
import DetailsFurnishing from './DetailsFurnishing'
import DetailsDesc from './DetailsDescription'
import ViewDivider from './ViewDivider'
import DetailsAvailability from './DetailsAvailability'
import DetailsProperty from './DetailsProperty'
import DetailsDeposit from './DetailsDeposit'
import DetailsInfo from './DetailsInfo'
import DetailsReportModal from './DetailsReportModal'
import DetailsPreviewModal from './DetailsPreviewModal'
import DetailsLoader from './DetailsLoader'
import AlertView from './AlertView'
import DetailsChatWithOwnerButton from './DetailsChatWithOwnerButton'
const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

let counter = 0

class ListingPageDetail extends Component {
  constructor(props) {
    super(props)
    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      isMapReady: false,
      showErrorDialog: false,
      modalVisible: false,
      imageUri: undefined,
      favItemId: '',
      isLogin: false,
      favProperty: false,
      alert_message: '',
      page: 0,
      relatedPropertiesList: '',
      userId: '',
      propertyInfo: null,
      reloadListFav: null,
      isActiveProperty: false,
      imagePosition:
        this._imageSlider != null ? this._imageSlider.getCurrentPage() + 1 : 1,
      reportModal: false,
      reportListingText: '',
      scrollPosition: 0,
      report_error_msg: null,
      myCountry: 'Malaysia',
      token: '',
      didFinishInitialAnimation: false,
      appState: '',
      youtubeController: false,
      originalStack: null,
      focusedScreen: false,
      showChatButton: false,
      authToken: '',
      socket: null,
      sessionUser: null,
      chat: null,
      isLoading: true
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    navigation.addListener('willFocus', () =>
      this.setState({
        focusedScreen: true
      })
    )
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    )

    AppState.addEventListener('change', this.handleAppStateChange)
    AsyncStorage.setItem('clickOnChatRequest', 'false')

    CustomInteractionManager.runAfterInteractions(() => {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        this.getPropertyDetailsInfo(
          user_information,
          this.props.navigation.state.params.propertyInfo.id
        )
      } else {
        this.getPropertyDetailsInfo(
          null,
          this.props.navigation.state.params.propertyInfo.id
        )
      }
    })
  }
  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        if (this.props.isFocused) {
          if (user_information) {
            this.getPropertyDetailsInfo(
              user_information,
              this.props.navigation.state.params.propertyInfo.id
            )
          } else {
            this.getPropertyDetailsInfo(
              null,
              this.props.navigation.state.params.propertyInfo.id
            )
          }
        }
        AsyncStorage.getItem('clickOnChatRequest').then((res) => {
          if (res === 'true') {
            AsyncStorage.setItem('clickOnChatRequest', 'false')
            var isSale = this.state.propertyInfo.type
              .toLowerCase()
              .includes('_sale')
            this.onPressNext(isSale)
          }
        })
      } else {
      }
    }
  }
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleAppStateChange = (nextAppState) => {
    this.setState({
      F: nextAppState
    })
  }

  addEventTracking = (user_information) => {
    if (user_information) {
      const body = {
        attr: 'ViewListing',
        id: this.state.propertyInfo.id
      }
      APICaller(
        Http.eventTrackig,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then((json) => {
        if (json.status !== 200) {
          // TODO crashlytics
        }
      })
    }
  }

  getRelatedProperties = () => {
    const body = {
      propertyId: this.state.propertyInfo.id,
      pageNumber: this.state.page,
      pageSize: 10
    }
    APICaller(
      Http.relatedPropertiesEndPoint,
      'POST',
      '',
      JSON.stringify(body)
    ).then((json) => {
      if (json.status === 200) {
        this.setState({
          totalElements: json.data.totalElements
        })
        if (this.state.relatedPropertiesList.length > 0) {
          var arr = this.state.relatedPropertiesList.concat(
            json.data && json.data.content
          )
          this.setState({ relatedPropertiesList: arr })
        } else {
          this.setState({
            relatedPropertiesList: json.data && json.data.content
          })
        }
      } else {
        this.displayError()
      }
    })
  }
  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.getRelatedProperties()
      }
    )
  }
  handleBackButtonClick() {
    this.props.navigation.goBack()
    return true
  }
  displayError() {
    this.setState({ showErrorDialog: true })
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
            arrProperty.map((item, key) => {
              if (item.property.id === this.state.propertyInfo.id) {
                this.setState({ favItemId: item.id })
                this.setState({ favProperty: true })
                return
              }
            })
          } else {
            this.setState({
              favProperty: false
            })
            this.displayError()
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  }

  getPropertyDetailsInfo = (user_information, propertyId) => {
    try {
      APICaller(
        `${Http.getPropertyById(propertyId)}`,
        'GET',
        user_information ? user_information.token : null,
        ''
      ).then((json) => {
        if (!json) {
          return
        }
        if (json.status === 200) {
          this.setState(
            {
              showChatButton: true,
              propertyInfo: json.data,
              authToken: user_information ? user_information.token : '',
              reloadListFav: json.data && json.data.reloadListFav,
              isActiveProperty: json.data && json.data.active,
              isLoading: false,
              userId: (user_information && user_information.userId) || '',
              isLogin: user_information ? true : false,
              didFinishInitialAnimation: true
            },
            () => {
              this.getfavouritePropertiesDetails()
              const NetCorePayload = {
                Area_of_property: json.data && json.data.address,
                property_value: this.state.propertyInfo.price
              }
              NetcoreSDK.track(
                NETCORE_TRACK_EVENT.VIEW_PROPERTY,
                NetCorePayload
              )
              this.addEventTracking(user_information)
              this.getRelatedProperties()
            }
          )
        } else {
          this.setState({
            showChatButton: true,
            userId: (user_information && user_information.userId) || '',
            isLogin: user_information ? true : false,
            didFinishInitialAnimation: true
          })
        }
      })
    } catch (error) {
      alert(error)
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
              alert_message: 'Property removed from favourites'
            })
            this._hideAlertView()
            if (this.state.reloadListFav) {
              this.state.reloadListFav(0)
            } else {
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MyFavourites' })
                  ]
                })
              )
            }
          } else {
            this.setState({
              favProperty: true
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
      propertyId: this.state.propertyInfo.id
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
              alert_message: 'Liked this property'
            })
            this._hideAlertView()
          } else {
            this.setState({
              alert_message: json.data.message
            })
            this._hideAlertView()
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
              reason: this.state.reportListingText
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
              if (json.status === 200) {
                this.setState({
                  alert_message: 'Property reported successfully.',
                  reportListingText: ''
                })
                this._hideAlertView()
              } else if (json.status === 422) {
                this.setState({
                  alert_message: 'Property already reported.',
                  reportListingText: ''
                })
                this._hideAlertView()
              } else {
                this.displayError()
              }
            })
          } else {
            this.props.navigation.navigate('Number', {
              screenName: 'ListingPageDetail'
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
        reportModal: !this.state.reportModal
      })
    } else {
      this.props.navigation.navigate('Number', {
        screenName: 'ListingPageDetail'
      })
    }
  }
  shareDetails = async () => {
    try {
      const shareURL = `https://speedhome.com/ads/${encodeURIComponent(
        this.state.propertyInfo.name
      )}-${this.state.propertyInfo.ref}`
      const result = await Share.share({
        message: shareURL
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

  getName(stringName) {
    return stringName
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
  }
  _displayReport() {
    return this.state.propertyInfo.user.id === this.state.userId ? (
      <View />
    ) : (
      <View
        style={[
          ExtrainfoStyle.furnishingView,
          { alignItems: 'center', justifyContent: 'center', marginTop: 25 }
        ]}
      >
        <View style={[ExtrainfoStyle.styleReportView]}>
          <TouchableOpacity
            onPress={() => this.onReportProperty()}
            accessible={true}
            accessibilityLabel='mainReportListNowBtn'
          >
            {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                textAlign: 'center',
                color: 'grey'
              }}
            >
              Report this listing now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  calculatePrice(price) {
    const {
      rentalPeriod,
      rentalPeriodValue
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
  updateInfo = (data) => {
    this.setState({
      scrollPosition: 0,
      imagePosition: 1,
      page: 0,
      propertyInfo: data,
      favProperty: false
    })

    if (this._imageSlider != undefined) this._imageSlider.gotoPage(1)
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      this.setState({
        userId:
          user_information && user_information.userId
            ? user_information.userId
            : '',
        isLogin: user_information ? true : false
      })
      this.getfavouritePropertiesDetails()
    }
    this.setState({ relatedPropertiesList: '' }, function() {
      this.getRelatedProperties()
    })
    // this._scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }
  _ViewPropertiesSlider(key) {
    if (key) {
      let roomType = getRoomTypeLabel(
        key && key.roomType != undefined ? key.roomType : ''
      )
      let d1 = new Date()
      let d2 =
        key && key.boostExpiry !== undefined
          ? new Date(key.boostExpiry)
          : new Date()
      var isBoost = d1.getTime() <= d2.getTime()
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.updateInfo(key)
          }}
          accessible={true}
          accessibilityLabel='mainPropSliderBtn'
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginLeft: 10
            }}
          >
            <View
              style={[
                ExtrainfoStyle.styleItem,
                {
                  marginRight: 10,
                  marginBottom: 10,
                  borderColor: 'grey',
                  borderWidth: 0.5,
                  borderRadius: 5
                }
              ]}
            >
              <View
                style={{ alignItems: 'center', width: '100%', borderRadius: 5 }}
              >
                <ProgressiveImageBackground
                  source={{
                    uri:
                      key && key.images && key.images.length > 0
                        ? key.images[0].url
                        : No_IMAGE_LINK
                  }}
                  style={{
                    height: height * 0.3,
                    width: width * 0.7,
                    backgroundColor: '#cccccc',
                    borderRadius: 5
                  }}
                  imageStyle={{ borderRadius: 5 }}
                >
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      flexDirection: 'column'
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {key != undefined &&
                      key.noDeposit != undefined &&
                      key.noDeposit === true &&
                      key.type != undefined &&
                      key.type !== 'ROOM' ? (
                        <Image
                          testID='noDeposit'
                          source={imgNoDeposit}
                          style={{ height: 50, width: 50 }}
                        />
                      ) : (
                        <View />
                      )}

                      {/* {key.instantView === true ? (
                        <Image
                          source={imgInstantView}
                          style={{ height: 40, width: 40, marginRight: 5 }}
                        />
                      ) : (
                        <View />
                      )} */}
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
                            key &&
                            key.noDeposit != undefined &&
                            key.noDeposit === true
                              ? key.type != undefined && key.type !== 'ROOM'
                                ? 0
                                : 10
                              : 10
                        }
                      ]}
                    >
                      {key != undefined && key.distance ? key.distance : ''}
                    </Text>
                  </View>
                  <View style={ExtrainfoStyle.styleInfo}>
                    <View
                      style={[
                        ExtrainfoStyle.styleInfo,
                        { backgroundColor: 'white', height: height * 0.16 }
                      ]}
                    >
                      <View
                        style={{ flexDirection: 'column', paddingBottom: 8 }}
                      >
                        <View
                          style={{
                            flexDirection: 'column',
                            paddingLeft: 10,
                            marginTop: 3
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              fontWeight: '500',
                              color: 'black'
                            }}
                          >
                            {key.name}
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              paddingTop: 3,
                              alignItems: 'center'
                            }}
                          >
                            {isBoost === true ? (
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: '#90278E',
                                  alignItems: 'center',
                                  marginRight: 10
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 10,
                                    textAlign: 'left',
                                    fontFamily: 'OpenSans-SemiBold',
                                    color: '#90278E',
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    paddingTop: 2,
                                    paddingBottom: 2
                                  }}
                                >
                                  New Listing
                                </Text>
                              </View>
                            ) : (
                              <View />
                            )}

                            <Text
                              style={{
                                fontSize: 12,
                                textAlign: 'left',
                                fontFamily: 'OpenSans-SemiBold',
                                color: 'green'
                              }}
                            >
                              {key.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
                            </Text>
                          </View>

                          <Text
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              marginTop: 5,
                              fontWeight: '500',
                              color: 'red'
                            }}
                          >
                            RM {this.format(key.price)}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingTop: 3
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: 10,
                                textAlign: 'left',
                                fontFamily: 'OpenSans-Light',
                                color: '#000'
                              }}
                            >
                              {roomType !== '' ? roomType : `${key.sqft} sqft`}{' '}
                              |
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 10,
                                textAlign: 'left',
                                fontFamily: 'OpenSans-Light',
                                color: '#000'
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
                                color: '#000'
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
                            paddingTop: 3,
                            alignItems: 'center'
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontSize: 14,
                                textAlign: 'left',
                                color: '#000'
                              }}
                            >
                              {key.bedroom}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'flex-start'
                            }}
                          >
                            <View>
                              <Image
                                testID='bedroom'
                                source={img1}
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 10
                                }}
                              />
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  textAlign: 'left',
                                  paddingLeft: 10,
                                  color: '#000'
                                }}
                              >
                                {key.bathroom}
                              </Text>
                            </View>
                            <View>
                              <Image
                                testID='bathroom'
                                source={img2}
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 10
                                }}
                              />
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  textAlign: 'left',
                                  paddingLeft: 10,
                                  color: '#000'
                                }}
                              >
                                {key.carpark}
                              </Text>
                            </View>
                            <View>
                              <Image
                                testID='carpark'
                                source={img3}
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 10
                                }}
                              />
                            </View>
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
      )
    }
  }

  _viewFlatList() {
    return (
      <View style={{ width: '100%' }}>
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
            { alignItems: 'flex-start', marginTop: 25 }
          ]}
        >
          <Text
            style={{
              paddingLeft: 10,
              fontSize: 15,
              textAlign: 'left',
              fontWeight: '600',
              color: '#000',
              fontFamily: 'OpenSans-SemiBold'
            }}
          >
            Recommended properties
          </Text>
          {this._viewFlatList()}
        </View>
      )
    }
  }
  onPressNext(isSale) {
    analytics().logEvent(
      trackerEventSubmit.chatWithOwner.action.chatRequestBtnClick
    )
    logEvent(trackerEventSubmit.chatWithOwner.action.chatRequestBtnClick)
    if (this.props.isUserLogin == true) {
      analytics().logEvent(
        trackerEventSubmit.chatWithOwner.action.createChatRequest
      )
      logEvent(trackerEventSubmit.chatWithOwner.action.createChatRequest)

      if (isSale) {
        this.props.navigation.navigate('ChatRequestSell', {
          propertyInfo: this.state.propertyInfo
        })
      } else {
        this.getUserData()
      }
    } else {
      this.props.navigation.navigate('Number', {
        screenName: 'ListingPageDetail'
      })
    }
  }

  getUserData() {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      user_credentials = JSON.parse(res)
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
          isUserLogin: true,
          relatedPropsize: this.state.relatedPropertiesList.length
        })
      })
    } else {
      this.props.navigation.navigate('ChatRequest', {
        propertyInfo: this.state.propertyInfo,
        myCountry: this.state.myCountry,
        token: this.state.token,
        isUserLogin: false,
        relatedPropsize: this.state.relatedPropertiesList.length
      })
    }
  }
  _connectSocket = () => {
    this.setState({
      isLoading: true
    })
    const socket = this.state.socket
      ? this.state.socket
      : connectSocket(this.state.authToken)
    if (!socket) {
      this.setState({
        isLoading: false
      })
    }
    const randomId = 'rand_' + Math.floor(Math.random() * 1000000 + 1)
    socket.on('connect', () => {
      subscribe(socket, TOPIC_TOKEN + randomId)
      socket.on(SESSION_USER, (res) => {
        const sessionUser = res.data
        subscribe(socket, TOPIC_USER + sessionUser.sessionId + '/conversation')
        socket.emit(
          CONVERSATION,
          this.state.propertyInfo.chatServerConversationId
        )
        socket.on(CONVERSATION, (data) => {
          if (data) {
            this.setState(
              {
                socket: socket,
                sessionUser: sessionUser,
                chat: data.data
              },
              () => {
                this.setState({
                  isLoading: false
                })
                this.props.navigation.navigate('ChatMessages', {
                  chat: data.data,
                  user: sessionUser,
                  socket: socket,
                  token: this.state.authToken
                })
              }
            )
          } else {
            this.setState({
              isLoading: false
            })
          }
        })
      })
    })
    socket.on('connect_timeout', (timeout) => {
      this.setState({
        isLoading: false
      })
    })
    socket.on('connect_error', (error) => {
      this.setState({
        isLoading: false
      })
    })
  }
  _navigationBack = () => {
    this.props.navigation.goBack()
  }
  getVideoId = (url) => {
    const id = url.split('/')

    return `${id[4].toString()}`
  }
  renderYoutube(url) {
    return (
      <YouTube
        arrImages={this.state.propertyInfo.images}
        position={this.state.imagePosition}
        videoId={this.getVideoId(url)}
        screen='Listing'
      />
    )
  }
  renderPage(image, index) {
    let regexForyoutubeLink =
      '(?:[hH][tT]{2}[pP][sS]{0,1}://)?[wW]{0,3}.{0,1}[yY][oO][uU][tT][uU](?:.[bB][eE]|[bB][eE].[cC][oO][mM])?/(?:(?:[wW][aA][tT][cC][hH])?(?:/)??(?:.*)?[vV]=([a-zA-Z0-9--]+).*|([A-Za-z0-9--]+))'
    let regexexp = new RegExp(regexForyoutubeLink, 'g')

    return (
      <View key={index}>
        {regexexp.test(image.url) ? (
          <View
            style={{
              backgroundColor: 'transparent',
              height: '100%',
              width,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {this.state.didFinishInitialAnimation ? (
              this.renderYoutube(image.url)
            ) : (
              <View />
            )}
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            style={{ height: '100%', width: width }}
            key={index}
            onPress={() =>
              this.props.navigation.navigate('ImageView', {
                propertyInfo: this.state.propertyInfo
              })
            }
            accessible={true}
            accessibilityLabel='mainPropInfoBtn'
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
                  marginTop: 0
                }
              ]}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }
  viewImages() {
    return (
      <View>
        <Carousel
          ref={(component) => (this._imageSlider = component)}
          style={[ExtrainfoStyle.backgroundImage]}
          autoplay={false}
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
          'rgba(255, 255, 255, 0)'
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
            justifyContent: 'center'
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ flex: 2.5, alignItems: 'center', flexDirection: 'row' }}
            >
              <TouchableOpacity
                onPress={() => this._navigationBack()}
                accessible={true}
                accessibilityLabel='mainBackArrowIconBtn'
              >
                <Icon name='arrow-back' size={30} />
              </TouchableOpacity>
              {/* <Text numberOfLines={1} style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 17, color: '#000', paddingLeft: 10 }}>{this.state.propertyInfo.name}</Text> */}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              {this.state.isLogin && (
                <TouchableOpacity
                  onPress={() =>
                    this.state.favProperty === false
                      ? this.favouritePropertiesDetails()
                      : this.removeFavouritePropertiesDetails()
                  }
                  style={{ marginLeft: 5, paddingHorizontal: 5 }}
                  accessible={true}
                  accessibilityLabel='mainFavIconBtn'
                >
                  {this.state.favProperty ? (
                    <Icon name='favorite' size={25} color={'red'} />
                  ) : (
                    <Icon name='favorite-border' size={25} />
                  )}
                </TouchableOpacity>
              )}
              {this.state.propertyInfo.active && (
                <TouchableOpacity
                  onPress={() => this.shareDetails()}
                  style={{ marginLeft: 5, paddingHorizontal: 5 }}
                  accessible={true}
                  accessibilityLabel='mainShareIconBtn'
                >
                  <Icon name='share' size={25} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    )
  }
  //methods related componentDidMount
  handleOnScroll = (event) => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <DetailsLoader
          ExtrainfoStyle={ExtrainfoStyle}
          isLoading={this.state.isLoading}
        />
      )
    } else {
      const isSale = this.state.propertyInfo.type
        .toLowerCase()
        .includes('_sale')
      const { didFinishInitialAnimation } = this.state

      return (
        <View ref='_view'>
          {this.state.alert_message !== '' && (
            <AlertView alert_message={this.state.alert_message} />
          )}
          <ScrollView
            // ref='_scrollView'
            // ref={id => (this._scrollView = id)}
            onScroll={this.handleOnScroll}
            scrollEventThrottle={50}
          >
            <View
              style={[ExtrainfoStyle.root, { flex: 1, paddingBottom: 150 }]}
            >
              <View style={{ height: 350, width: width }}>
                {didFinishInitialAnimation && this.state.focusedScreen
                  ? this.viewImages()
                  : null}

                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    height: 30,
                    width: 50,
                    borderRadius: 15,
                    marginLeft: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: -50
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#FFF',
                      fontFamily: 'OpenSans-SemiBold'
                    }}
                  >
                    {`${this.state.imagePosition} / ${
                      this.state.propertyInfo.images.length
                    }`}
                  </Text>
                </View>
              </View>

              <DetailsInfo
                isSale={isSale}
                navigation={this.props.navigation}
                propertyInfo={this.state.propertyInfo}
                Capitalize={(val) => this.Capitalize(val)}
                _displayFurnishType={this._displayFurnishType}
                calculatePrice={(price) => this.calculatePrice(price)}
                format={this.format}
                ExtrainfoStyle={ExtrainfoStyle}
              />
              {/* {this._viewInformation()} */}

              <DetailsDeposit
                ExtrainfoStyle={ExtrainfoStyle}
                propertyInfo={this.state.propertyInfo}
                calculatePrice={(price) => this.calculatePrice(price)}
                format={this.format}
              />

              <DetailsProperty
                ExtrainfoStyle={ExtrainfoStyle}
                propertyInfo={this.state.propertyInfo}
                Capitalize={(val) => this.Capitalize(val)}
                isSale={isSale}
              />
              <DetailsAvailability
                ExtrainfoStyle={ExtrainfoStyle}
                propertyInfo={this.state.propertyInfo}
              />

              <ViewDivider />

              <DetailsDesc
                ExtrainfoStyle={ExtrainfoStyle}
                description={this.state.propertyInfo.description}
              />

              <ViewDivider />

              {didFinishInitialAnimation && (
                <DetailsFurnishing
                  ExtrainfoStyle={ExtrainfoStyle}
                  propertyInfo={this.state.propertyInfo}
                  getName={this.getName}
                />
              )}

              {didFinishInitialAnimation && (
                <DetailsFacilities
                  ExtrainfoStyle={ExtrainfoStyle}
                  propertyInfo={this.state.propertyInfo}
                  getName={this.getName}
                />
              )}

              {didFinishInitialAnimation && (
                <DetailsAccessibilites
                  ExtrainfoStyle={ExtrainfoStyle}
                  propertyInfo={this.state.propertyInfo}
                />
              )}

              <ViewDivider />

              {didFinishInitialAnimation && (
                <DetailsMap
                  onMapReady={() => this.setState({ isMapReady: true })}
                  isMapReady={this.state.isMapReady}
                  ExtrainfoStyle={ExtrainfoStyle}
                  propertyInfo={this.state.propertyInfo}
                />
              )}

              {didFinishInitialAnimation && this._displayReport()}

              {didFinishInitialAnimation && this._viewRecommondedProperties()}
            </View>
          </ScrollView>

          {/* Cr push */}
          <DetailsChatWithOwnerButton
            isSale={isSale}
            ExtrainfoStyle={ExtrainfoStyle}
            showChatButton={this.state.showChatButton}
            userId={this.state.userId}
            propertyInfo={this.state.propertyInfo}
            onPressNext={(val) => this.onPressNext(val)}
            _connectSocket={() => this._connectSocket()}
          />
          <View style={{ position: 'absolute', height: 50, width: width }}>
            {this._viewHeader()}
          </View>

          <DetailsPreviewModal
            modalVisible={this.state.modalVisible}
            toggleModal={(val) => {
              this.setState({
                modalVisible: val
              })
            }}
            imageUri={this.state.imageUri}
          />
          <DetailsReportModal
            reportModal={this.state.reportModal}
            ExtrainfoStyle={ExtrainfoStyle}
            reportListingText={this.state.reportListingText}
            report_error_msg={this.state.report_error_msg}
            onChageReport={(e) =>
              this.setState({
                reportListingText: e
              })
            }
            onReportProperty={this.onReportProperty}
            onReportPropertySubit={this.onReportPropertySubit}
          />
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
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ListingPageDetail))

// const styles = StyleSheet.create({

// })
