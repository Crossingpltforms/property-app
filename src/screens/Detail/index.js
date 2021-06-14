import React, { PureComponent } from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Share,
  AppState,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import YouTube from '../../util/youtubeController'
import { Icon } from 'react-native-elements'
import { withNavigationFocus } from 'react-navigation'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import { No_IMAGE_LINK, NETCORE_TRACK_EVENT } from '../../common/constants'
import CustomInteractionManager from '../../util/CustomInteractionManager'
// Import style
import ExtrainfoStyle from './styles'

import { getRoomTypeLabel } from '../../common/helper/common'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
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
import DetailsAvailability from './DetailsAvailability'
import DetailsProperty from './DetailsProperty'
import DetailsDeposit from './DetailsDeposit'
import DetailsInfo from './DetailsInfo'
import DetailsReportModal from './DetailsReportModal'
import DetailsPreviewModal from './DetailsPreviewModal'
import DetailsChatWithOwnerButton from './DetailsChatWithOwnerButton' //This component is just not is for to display message=>`You can chat directly with the owner, ask questions and get to know the property online or in person.` inside property details scroll view.
import DetailsLoader from './DetailsLoader'
import AlertView from './AlertView'
import { Color, Matrics } from '../../common/styles'
import PropertyCard from '../../components/property-card'
import ProgressiveImage from '../../common/components/progressiveImage/index'
import Carousel from 'react-native-snap-carousel'
import { screenWidth } from '../../common/styles/matrics'
import { propertyListArr } from '../../util/commonFunctions'
import { logEvent, events } from '../../util/fbAnalytics'
import DetailsOwnerBookBtn from './DetailsOwnerBookBtn' //This component is for displaying all 3 kind of buttons in floating style (outside property details scroll view)
import InViewPort from '@coffeebeanslabs/react-native-inviewport'
const { width } = Dimensions.get('window')

const HEADER_MAX_HEIGHT = 300

class DetailsPage extends PureComponent {
  constructor(props) {
    super(props)
    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      isActionButtonVisible: true,
      isMapReady: false,
      refreshing: false,
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
      activeSlide: 0,
      imagePosition: this._imageSlider != null ? activeSlide : 1,
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
      isLoading: true,
      selectedPreviewType: 'IMAGE',
      hasVideo: false,
      activeImageIndex: 0,
      showImageLightBoxModal: false,
      yPos: null
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
        if (user_information) {
          this.getPropertyDetailsInfo(
            user_information,
            this.props.navigation.state.params &&
            this.props.navigation.state.params.propertyInfo &&
            this.props.navigation.state.params.propertyInfo.id
          )
        } else {
          this.getPropertyDetailsInfo(
            null,
            this.props.navigation.state.params &&
            this.props.navigation.state.params.propertyInfo &&
            this.props.navigation.state.params.propertyInfo.id
          )
        }
      } else {
        this.getPropertyDetailsInfo(
          null,
          this.props.navigation.state.params &&
          this.props.navigation.state.params.propertyInfo &&
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
              this.props.navigation.state.params &&
              this.props.navigation.state.params.propertyInfo &&
              this.props.navigation.state.params.propertyInfo.id
            )
          } else {
            this.getPropertyDetailsInfo(
              null,
              this.props.navigation.state.params &&
              this.props.navigation.state.params.propertyInfo &&
              this.props.navigation.state.params.propertyInfo.id
            )
          }
        }

        AsyncStorage.getItem('clickOnChatRequest').then(res => {
          if (res === 'true') {
            AsyncStorage.setItem('clickOnChatRequest', 'false')
            var isSale = this.state.propertyInfo.type
              .toLowerCase()
              .includes('_sale')
            this.onPressNext(isSale)
          }
        })
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

  handleAppStateChange = nextAppState => {
    this.setState({
      F: nextAppState
    })
  }

  addEventTracking = user_information => {
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
      ).then(json => {
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
    ).then(json => {
      if (json.status === 200) {
        const relatedPropObj = propertyListArr(json.data.content)
        this.setState({
          totalElements: json.data && json.data.totalElements
        })
        if (this.state.relatedPropertiesList.length > 0) {
          var arr = this.state.relatedPropertiesList.concat(relatedPropObj)
          this.setState({ relatedPropertiesList: arr })
        } else {
          this.setState({
            relatedPropertiesList: relatedPropObj
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
        ).then(json => {
          if (!json) {
            return
          }
          if (json.status === 200) {
            const arrProperty = json.data && json.data.content
            if (arrProperty != undefined) {
              arrProperty.map((item, key) => {
                if (item.property.id === this.state.propertyInfo.id) {
                  this.setState({ favItemId: item.id })
                  this.setState({ favProperty: true })
                  return
                }
              })
            }
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
      ).then(json => {
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
              didFinishInitialAnimation: true,
              selectedPreviewType:
                json.data && json.data.videos && json.data.videos.length > 0
                  ? 'VIDEO'
                  : json.data && json.data.images && json.data.images.length > 0
                    ? 'IMAGE'
                    : '',
              hasVideo:
                json.data && json.data.videos && json.data.videos.length > 0
                  ? true
                  : false
            },
            async () => {
              await this.getfavouritePropertiesDetails()
              this.scroll.scrollTo({
                x: 0,
                y: 0,
                animated: true
              })

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

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{ height: '100%', width: width }}
        key={index}
        onPress={() =>
          this.props.navigation.navigate('ImageView', {
            propertyInfo: this.state.propertyInfo,
            currentIndex: index
          })
        }
        accessible={true}
        accessibilityLabel='disReportPrImageBtn'
      >
        <ProgressiveImage
          key={index}
          source={{ uri: item.url ? item.url : No_IMAGE_LINK }}
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
    )
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
        ).then(json => {
          if (!json) {
            return
          }
          if (json.status === 200) {
            this.setState({
              favProperty: false,
              alert_message: 'Property removed from favourites'
            })
            this._hideAlertView()
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
        ).then(json => {
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
            ).then(json => {
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
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
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
              accessibilityLabel='disReportNowBtn'
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
  updateInfo = data => {
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
    this.setState({ relatedPropertiesList: '' }, function () {
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
        <View style={{ flex: 1 }}>
          <PropertyCard
            data={key}
            showSlider={true}
            price={this.format(key.price)}
            isBoost={isBoost}
            roomType={roomType}
            onPress={() => {
              this.props.navigation.push('ListingPageDetail', {
                propertyInfo: key,
                key: key.id
              })
            }}
            containerStyle={{
              width: Matrics.ScaleValue(250),
              marginHorizontal: Matrics.ScaleValue(8)
            }}
            scrollStyle={{ width: Matrics.ScaleValue(250) }}
          />
        </View>
      )
    }
  }

  _viewFlatList() {
    return (
      <View>
        <FlatList
          horizontal
          keyboardShouldPersistTaps={'always'}
          data={this.state.relatedPropertiesList}
          ItemSeparatorComponent={this.mySeparator}
          renderItem={({ item, index }) => this._ViewPropertiesSlider(item)}
          keyExtractor={(item, index) => index.toString()}
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
    if (
      this.state.relatedPropertiesList &&
      this.state.relatedPropertiesList.length > 0

    ) {

      return (

        <View
          style={{
            flex: 1,
            marginVertical: Matrics.ScaleValue(10),
            marginLeft: Matrics.ScaleValue(10),
            paddingLeft: 5
          }}
        // style={[
        //   ExtrainfoStyle.furnishingView,
        //   { alignItems: 'flex-start', marginTop: 25 }
        // ]}
        >
          <InViewPort onChange={(isVisible) => this._checkVisibleChatButton(isVisible)}>
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
          </InViewPort>
          {this._viewFlatList()}
        </View>
      )
    }
  }

  _checkVisibleChatButton(issVisible) {
    // console.log("iss",issVisible)
    if (issVisible && issVisible === true) {
      this.setState({ isActionButtonVisible: false })
    }
    else {
      this.setState({ isActionButtonVisible: true })
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
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
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
    const socket = connectSocket(this.state.authToken)
    if (!socket) {
      this.setState({
        isLoading: false
      })
    }
    const randomId = 'rand_' + Math.floor(Math.random() * 1000000 + 1)
    socket.on('connect', () => {
      subscribe(socket, TOPIC_TOKEN + randomId)
      socket.on(SESSION_USER, res => {
        const sessionUser = res.data
        subscribe(socket, TOPIC_USER + sessionUser.sessionId + '/conversation')
        socket.emit(
          CONVERSATION,
          this.state.propertyInfo.chatServerConversationId
        )
        socket.on(CONVERSATION, data => {
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
    socket.on('connect_timeout', timeout => {
      this.setState({
        isLoading: false
      })
    })
    socket.on('connect_error', error => {
      this.setState({
        isLoading: false
      })
    })
  }
  _navigationBack = () => {
    this.props.navigation.goBack()
  }
  getVideoId = url => {
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
              accessibilityLabel='disRepImageBtn'
            >
              <Image
                testID='cover'
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
            position: 'absolute',
            bottom: 20,
            left: 10
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#FFF',
              fontFamily: 'OpenSans-SemiBold'
            }}
          >
            {`${index + 1} / ${this.state.propertyInfo.images.length}`}
          </Text>
        </View>
      </View>
    )
  }

  //methods related componentDidMount
  handleOnScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
  }
  changeSelectedPreviewType = type => {
    this.setState({
      selectedPreviewType: type
    })
  }

  renderButton(isSale, didFinishInitialAnimation) {
    return (
      <View>
        <DetailsOwnerBookBtn
          isSale={isSale}
          ExtrainfoStyle={ExtrainfoStyle}
          showChatButton={this.state.showChatButton}
          userId={this.state.userId}
          propertyInfo={this.state.propertyInfo}
          onPressNext={val => this.onPressNext(val)}
          _connectSocket={() => this._connectSocket()}
        ></DetailsOwnerBookBtn>
      </View>
    )
  }

  _renderScrollViewContent(isSale, didFinishInitialAnimation) {
    return (

      <View style={[styles.scrollViewContent, ExtrainfoStyle.root]}>
        <View
          style={[
            styles.backgroundImage,
            {
              opacity: 1
            }
          ]}
        >
          {this.renderImgOrVideo()}
        </View>
        <DetailsInfo
          isSale={isSale}
          navigation={this.props.navigation}
          propertyInfo={this.state.propertyInfo}
          Capitalize={val => this.Capitalize(val)}
          _displayFurnishType={this._displayFurnishType}
          calculatePrice={price => this.calculatePrice(price)}
          format={this.format}
          ExtrainfoStyle={ExtrainfoStyle}
          selectedPreviewType={this.state.selectedPreviewType}
          hasVideo={this.state.hasVideo}
          changeSelectedPreviewType={this.changeSelectedPreviewType}
          onMapCliked={() => {
            const { yPos } = this.state
            yPos != null
              ? this.scroll.scrollTo({
                x: 0,
                y: yPos - Matrics.ScaleValue(50),
                animated: true
              })
              : this.scroll.scrollToEnd()
          }}
        />
        {/* {this._viewInformation()} */}

        <DetailsDeposit
          ExtrainfoStyle={ExtrainfoStyle}
          propertyInfo={this.state.propertyInfo}
          calculatePrice={price => this.calculatePrice(price)}
          format={this.format}
        />

        <DetailsProperty
          ExtrainfoStyle={ExtrainfoStyle}
          propertyInfo={this.state.propertyInfo}
          Capitalize={val => this.Capitalize(val)}
          isSale={isSale}
        />
        <DetailsAvailability
          ExtrainfoStyle={ExtrainfoStyle}
          propertyInfo={this.state.propertyInfo}
        />

        <DetailsChatWithOwnerButton
          isSale={isSale}
          ExtrainfoStyle={ExtrainfoStyle}
          showChatButton={this.state.showChatButton}
          userId={this.state.userId}
          propertyInfo={this.state.propertyInfo}
          onPressNext={val => this.onPressNext(val)}
          _connectSocket={() => this._connectSocket()}
        />

        <DetailsDesc
          ExtrainfoStyle={ExtrainfoStyle}
          description={this.state.propertyInfo.description}
        />

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

        {didFinishInitialAnimation && (
          <DetailsMap
            onMapReady={() => this.setState({ isMapReady: true })}
            isMapReady={this.state.isMapReady}
            ExtrainfoStyle={ExtrainfoStyle}
            propertyInfo={this.state.propertyInfo}
            yPosition={y => this.setState({ yPos: y })}
          />
        )}

        {didFinishInitialAnimation && this._displayReport()}
        {
          didFinishInitialAnimation && this._viewRecommondedProperties()}

      </View>
    )
  }

  renderImgOrVideo = () => {
    if (this.state.selectedPreviewType === 'IMAGE') {
      return (
        <View style={[ExtrainfoStyle.renderImgOrVideoContainer]}>
          <View style={ExtrainfoStyle.imgCounterContainer}>
            <Text style={ExtrainfoStyle.imgCounterText}>
              {`${this.state.activeSlide + 1} / ${this.state.propertyInfo.images.length
                }`}
            </Text>
          </View>
          <Carousel
            data={this.state.propertyInfo.images}
            renderItem={this._renderItem}
            onSnapToItem={index => this.setState({ activeSlide: index })}
            removeClippedSubviews={true}
            maxToRenderPerBatch={2}
            inactiveSlideOpacity={1}
            shouldOptimizeUpdates={true}
            inactiveSlideScale={1}
            initialNumToRender={2}
            itemWidth={screenWidth}
            lockScrollWhileSnapping={true}
            decelerationRate={'fast'}
            sliderWidth={screenWidth}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )
    } else if (this.state.selectedPreviewType === 'VIDEO') {
      let regexForyoutubeLink =
        '(?:[hH][tT]{2}[pP][sS]{0,1}://)?[wW]{0,3}.{0,1}[yY][oO][uU][tT][uU](?:.[bB][eE]|[bB][eE].[cC][oO][mM])?/(?:(?:[wW][aA][tT][cC][hH])?(?:/)??(?:.*)?[vV]=([a-zA-Z0-9--]+).*|([A-Za-z0-9--]+))'
      let regexexp = new RegExp(regexForyoutubeLink, 'g')
      if (
        this.state.propertyInfo.videos &&
        this.state.propertyInfo.videos.length > 0
      ) {
        if (regexexp.test(this.state.propertyInfo.videos[0].url)) {
          return (
            <View
              style={[
                {
                  height: '100%',
                  backgroundColor: '#000',
                  flex: 1,
                  justifyContent: 'center'
                }
              ]}
            >
              {this.state.didFinishInitialAnimation ? (
                this.renderYoutube(this.state.propertyInfo.videos[0].url)
              ) : (
                  <View />
                )}
            </View>
          )
        }
      }
    }
  }

  // ----------- HEADER VIEW -----------------//
  renderHeaderView = () => {
    const { propertyInfo } = this.state
    const propertyInfoUserId =
      propertyInfo && propertyInfo.user && propertyInfo.user.id
    const loginData = this.props.userLoginData
    return (
      <View style={[styles.bar]}>
        <View style={ExtrainfoStyle.navBarContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={ExtrainfoStyle.navBarBackIconView}>
              <TouchableOpacity
                onPress={() => this._navigationBack()}
                accessible={true}
                accessibilityLabel='disReportBackBtn'
              >
                <Icon name='arrow-back' color='#000' size={30} />
              </TouchableOpacity>
            </View>
            <View style={ExtrainfoStyle.navBarIconViewContainer}>
              {this.state.propertyInfo.active && (
                <TouchableOpacity
                  onPress={() => this.shareDetails()}
                  style={ExtrainfoStyle.navBarShreIconStyle}
                  accessible={true}
                  accessibilityLabel='disReportVideoBtn'
                >
                  <Icon name='share' size={25} color='#000' />
                </TouchableOpacity>
              )}
              {this.state.isLogin && propertyInfoUserId !== loginData.userId && (
                <TouchableOpacity
                  onPress={() => {
                    this.state.favProperty === false
                      ? this.favouritePropertiesDetails()
                      : this.removeFavouritePropertiesDetails()
                  }}
                  style={ExtrainfoStyle.navBarFavIconStyle}
                  accessible={true}
                  accessibilityLabel='disReportFavBtn'
                >
                  {this.state.favProperty ? (
                    <Icon name='favorite' size={25} color={'red'} />
                  ) : (
                      <Icon
                        name='favorite-border'
                        size={25}
                        color={
                          this.state.selectedPreviewType === 'VIDEO'
                            ? '#fff'
                            : '#000'
                        }
                      />
                    )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }
  _listViewOffset = 0
  // ----------- RENDER METHOD ---------------//
  render() {
    const { propertyInfo } = this.state
    const propertyInfoUserId =
      propertyInfo && propertyInfo.user && propertyInfo.user.id
    const loginData = this.props.userLoginData
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    // const scrollY = Animated.add(
    //   this.state.scrollY,
    //   Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0
    // )

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
        <View style={styles.animatedFill}>
          {this.state.alert_message !== '' && (
            <AlertView alert_message={this.state.alert_message} />
          )}
          {this.renderHeaderView()}

          <ScrollView
            ref={c => {
              this.scroll = c
            }}

            style={styles.animatedFill}
          >
            {this._renderScrollViewContent(isSale, didFinishInitialAnimation)}

          </ScrollView>

          {this.state.isActionButtonVisible
            ? this.renderButton(isSale, didFinishInitialAnimation)
            : null}
          <DetailsPreviewModal
            modalVisible={this.state.modalVisible}
            toggleModal={val => {
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
            onChageReport={e =>
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
            toggleModal={value => {
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
)(withNavigationFocus(DetailsPage))

const styles = StyleSheet.create({
  animatedFill: {
    flex: 1,
    backgroundColor: Color.white
  },
  content: {
    flex: 1
  },
  backgroundImage: {
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover'
  },
  bar: {
    backgroundColor: 'transparent',
    // marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    width: '100%',
    backgroundColor: Color.primary
  },
  title: {
    color: 'white',
    fontSize: 18
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    // paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: Color.bgColor,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
