import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Animated,
  Linking,
  AppState,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../components/Container'
import APICaller from '../util/apiCaller'
import EditText from '../components/EditTextHome'
import _ from 'lodash'
import Http from '../api/http'
import { Icon } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import VersionNumber from 'react-native-version-number'
import NetCoreSDK from 'smartech-react-native'
import noDataImg from '../../Images/NoData.png'
import imgUpadateactive from '../../Images/IC_UPDATE_ACTIVE.png'
import imgUpadateInactive from '../../Images/IC_UPDATE_INACTIVE.png'
import {
  getRoomTypeLabel,
  priceFormat,
  compareVersions
} from '../common/helper/common'
import { Matrics } from '../common/styles'
import {
  IOS_APP_LINK,
  ANDROID_APP_LINK,
  No_IMAGE_LINK
} from '../common/constants'
import ReferFrds from '../components/InviteReferral'
import ErrorDialog from '../components/ErrorDialog'
import PropertyCard from '../components/property-card'
import {
  getLoginUserData,
  setLoginUserData,
  setLoginUserProfileData
} from '../store/actions'
import ProgressiveImageBackground from '../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../common/components/progressiveImage/index'
import { propertyListArr } from '../util/commonFunctions'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      springValue: new Animated.Value(100),
      backClickCount: 0,
      nameOfPerson: 'your friend',
      showReferralDialog: false,
      imageUrl: '',
      isFetching: false,
      popularAreas: '',
      specialOffers: [],
      ourPicksList: '',
      page: 0,
      searchNameList: '',
      searchString: '',
      modalVisible: false,
      searchModelVisible: false,
      displayType: 'RENT',
      sortingType: [
        {
          id: 0,
          name: 'RENT',
          isSelected: true,
          value: 'RENT'
        },
        {
          id: 1,
          name: 'BUY',
          isSelected: false,
          value: 'BUY'
        }
      ],
      restoredArray: [],
      liveVersion: '',
      displayUpdatedBanner: 'false',
      showErrorDialog: false
    }
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  LoadRealImage() {
    this.setState({ loadingImage: true })
  }

  UNSAFE_componentWillReceiveProps() {
    AsyncStorage.getItem('displayType').then((res) => {
      if (res === '' || res === null) {
        this.setState({ displayType: this.state.displayType })
        AsyncStorage.setItem('displayType', 'RENT')
      } else {
        this.setState({ displayType: res })
        this.state.sortingType.map((item, index) => {
          if (item.value.toLowerCase() === res.toLowerCase()) {
            this.changeSortTypeStateValue(true, index)
          } else {
            this.changeSortTypeStateValue(false, index)
          }
        })
      }
    })
  }

  async componentDidUpdate(prevProps) {
    if (
      this.state.ourPicksList &&
      this.state.ourPicksList.length > 0 &&
      this.state.isFetching
    ) {
      this.setState({ isFetching: false })
    }
    if (prevProps.isFocused !== this.props.isFocused) {
      AsyncStorage.getItem('displayType').then((res) => {
        if (res === '' || res === null) {
          this.setState({ displayType: this.state.displayType })
          // AsyncStorage.setItem('displayType', 'RENT');
        } else {
          this.setState({ displayType: res })
          this.state.sortingType.map((item, index) => {
            if (item.value.toLowerCase() === res.toLowerCase()) {
              this.changeSortTypeStateValue(true, index)
            } else {
              this.changeSortTypeStateValue(false, index)
            }
          })
        }
      })
      await AsyncStorage.getItem('recentSearchInfo').then((res) => {
        const restoredArray = JSON.parse(res)
        this.setState({
          restoredArray: restoredArray !== null ? restoredArray.reverse() : []
        })
      })
    }
  }

  getRecentSearchArray(restoredArray) {
    return _.filter(restoredArray, { p_type: this.state.displayType })
  }

  componentDidMount() {
    AsyncStorage.getItem('displayType').then((res) => {
      if (res === '' || res === null) {
        this.setState({ displayType: this.state.displayType })
        AsyncStorage.setItem('displayType', 'RENT')
      } else {
        this.state.sortingType.map((item, index) => {
          if (item.value.toLowerCase() === res.toLowerCase()) {
            this.changeSortTypeStateValue(true, index)
          } else {
            this.changeSortTypeStateValue(false, index)
          }
        })
        this.setState({ displayType: res })
      }

      this.getSearchHomeList()
    })
    // console.log('props...', this.props.userLoginProfileData)
    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      const restoredArray = JSON.parse(res)
      this.setState({
        restoredArray: restoredArray !== null ? restoredArray.reverse() : []
      })
    })

    this.checkApplicationLatestVersion()

    AppState.addEventListener('change', this.handleAppStateChange)

    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        let user_credentials = JSON.parse(res)
        this.props.setLoginUserData(user_credentials)
        this.postToken(user_credentials)
        this.getUserProfileData(user_credentials)
        this.getSpecialOffers(user_credentials)
      }
    })
    // AsyncStorage.getItem("displayAppUpdated").then(res => {
    //   if (res) {
    //     this.setState({ displayUpdatedBanner: res });
    //   }
    //   else {
    //     this.manageAppUpdateClose("true");
    //   }
    // });

    AsyncStorage.getItem('UpLoadImageData', (err, result) => {
      if (!err) {
        if (result) {
          let route = JSON.parse(result).route
          let bodyData = JSON.parse(result).bodyData
          let id = JSON.parse(result).id

          this.props.navigation.navigate(route, { bodyData, id })
        }
      }
    })
  }

  UNSAFE_componentWillMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this)
    )

    if (!global.networkConnection) return
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        AsyncStorage.getItem('referral').then((res) => {
          if (res === 'true') {
            this.setState({ showReferralDialog: true })
          } else {
            this.setState({ showReferralDialog: false })
          }
        })
      }
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this)
    )
  }

  _spring() {
    this.setState({ backClickCount: 1 }, () => {
      Animated.sequence([
        Animated.spring(this.state.springValue, {
          toValue: -0.15 * height,
          friction: 5,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(this.state.springValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        this.setState({ backClickCount: 0 })
      })

      this._exitAlert()
    })
  }

  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring()

    return true
  }

  _exitAlert() {
    Alert.alert(
      'Exit App',
      'Are you sure to exit the application?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => BackHandler.exitApp()
        }
      ],
      {
        cancelable: true
      }
    )
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      this.manageAppUpdateClose('false')
    }
  }

  changeSortTypeStateValue(isSelect, index) {
    const newArray = this.state.sortingType
    newArray[index].isSelected = isSelect
    this.setState({ sortingType: newArray })
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible })
  }

  popularAreasList() {
    if (!global.networkConnection) return

    // this.showLoader();

    const body = {}
    APICaller(Http.areaList, 'POST', '', JSON.stringify(body)).then((json) => {
      this.hideLoader()
      if (json.status === 200) {
        this.setState({ popularAreas: json.data.content })
      } else {
        this.displayError()
      }
    })
  }

  getSpecialOffers = (user_credentials) => {
    APICaller(Http.getSpecialOffers, 'GET', '', '')
      .then((json) => {
        if (json.status === 200) {
          this.setState({ specialOffers: json.data })
        } else {
          this.displayError()
        }
      })
      .catch((err) => {})
  }

  postToken(user_credentials) {
    if (!global.networkConnection) return
    AsyncStorage.getItem('fcmToken').then((res) => {
      if (res) {
        const body = {
          cloudId: res
        }
        APICaller(
          Http.saveToken,
          'POST',
          user_credentials.token,
          JSON.stringify(body)
        ).then((json) => {
          if (json.status !== 200) {
            this.displayError()
          }
        })
      }
    })
  }

  getUserProfileData = (user_credentials) => {
    APICaller(
      `${Http.profileDetails(user_credentials.userId)}`,
      'GET',
      user_credentials.token,
      ''
    ).then((response) => {
      if (response && response.data && response.data.email) {
        NetCoreSDK.login(response.data.email)
        const payloadata = {
          NAME: response.data.name ? response.data.name : '',
          EMAIL_ADDRESS: response.data.email ? response.data.email : '',
          MOBILE: response.data.phoneNumber ? response.data.phoneNumber : ''
        }
        NetCoreSDK.profile(payloadata)
      }
      if (response && response.data) {
        this.props.setLoginUserProfileData(response.data)
      }
    })
  }

  checkApplicationLatestVersion() {
    var v = VersionNumber.appVersion
    v = v.replace('.', '_').replace('.', '_')
    v = Platform.OS == 'ios' ? `i_${v}` : `a_${v}`
    APICaller(`${Http.getAppLatestVersion(v)}`, 'GET', '', '').then((json) => {
      if (json.status === 200) {
        if (json.data) {
          this.setState({ liveVersion: json.data.latestVersion }, function () {
            AsyncStorage.getItem('displayAppUpdated').then((res) => {
              if (res) {
                const isNewAppVersion = compareVersions(
                  json.data.latestVersion,
                  VersionNumber.appVersion
                )
                if (isNewAppVersion) {
                  this.manageAppUpdateClose('true')
                } else {
                  this.manageAppUpdateClose('false')
                }
              } else {
                this.manageAppUpdateClose('true')
              }
            })
          })
        }
      } else {
        this.displayError()
      }
    })
  }

  getAutoCompleteList(searchString) {
    if (!global.networkConnection) return
    const body = {
      keywords: searchString,
      limit: 1
    }

    APICaller(Http.autoCompleteEndPoint, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (json.status === 200) {
          this.setState({ searchNameList: '' })

          if (json.data.LOCATION) {
            this.setState({ searchNameList: json.data.LOCATION })
          }

          if (json.data.ACCESSIBILITY && this.state.searchNameList !== '') {
            const arr = this.state.searchNameList.concat(
              json.data.ACCESSIBILITY
            )
            this.setState({ searchNameList: arr })
          } else if (json.data.ACCESSIBILITY) {
            this.setState({ searchNameList: json.data.ACCESSIBILITY })
          }

          if (json.data.PROPERTY && this.state.searchNameList !== '') {
            const arr = this.state.searchNameList.concat(json.data.PROPERTY)
            this.setState({ searchNameList: arr })
          } else if (json.data.PROPERTY) {
            this.setState({ searchNameList: json.data.PROPERTY })
          }
        } else {
          this.displayError()
        }
      }
    )
  }

  getSearchHomeList = () => {
    if (!global.networkConnection) return

    if (this.state.page == 0) {
      this.showLoader()
    }

    var body = {
      minBudget: 1000,
      maxBudget: this.state.displayType === 'BUY' ? 5000000 : 6000,
      pageNumber: this.state.page,
      pageSize: 15,
      sort: ''
    }

    if (this.state.displayType === 'BUY') {
      body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
    }

    APICaller(Http.propertyOurPicks, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (json.status === 200) {
          const relatedPropObj = propertyListArr(json.data.content)
          if (this.state.page == 0) {
            this.setState({ ourPicksList: '' }, function () {
              this.setState({ totalElements: json.data.totalElements })
              if (
                this.state.ourPicksList &&
                this.state.ourPicksList.length > 0
              ) {
                var arr = this.state.ourPicksList.concat(relatedPropObj)
                this.setState({ ourPicksList: arr })
              } else {
                this.setState({ ourPicksList: relatedPropObj })
              }
              this.popularAreasList()
              this.getSpecialOffers()
            })
          } else {
            this.setState({ totalElements: json.data.totalElements })
            if (this.state.ourPicksList && this.state.ourPicksList.length > 0) {
              var arr = this.state.ourPicksList.concat(relatedPropObj)
              this.setState({ ourPicksList: arr })
            } else {
              this.setState({ ourPicksList: relatedPropObj })
            }
            this.hideLoader()
          }
          // this.displaySearchList();
        } else {
          this.hideLoader()
          this.displayError()
        }
      }
    )
  }

  displaySpecialOffers = () => {
    const { specialOffers } = this.state
    return _.map(specialOffers, (key, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          onPress={() =>
            this.props.navigation.navigate('KeywordSearchList', {
              locationString: key.campaignName
            })
          }
          accessible={true}
          accessibilityLabel='homeSpecialOfferBtn'
        >
          <View
            style={{
              paddingLeft: Matrics.ScaleValue(15)
            }}
          >
            <ProgressiveImageBackground
              source={{
                uri: key.campaignDisplayMobilePhotoUrl
                  ? key.campaignDisplayMobilePhotoUrl
                  : key.campaignDisplayPhotoUrl
                  ? key.campaignDisplayPhotoUrl
                  : No_IMAGE_LINK
              }}
              imageStyle={{ borderRadius: 5 }}
              style={{
                height: Matrics.ScaleValue(208),
                width: Matrics.ScaleValue(150),
                marginVertical: 10,
                backgroundColor: '#cccccc',
                borderRadius: 5,
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 6,
                shadowOffset: { width: 0, height: 4 }
              }}
            >
              <Text style={styles.TextStyleScrollerHeader}>
                {key.campaignName}
              </Text>
            </ProgressiveImageBackground>
          </View>
        </TouchableOpacity>
      )
    })
  }

  displayPopularAreas = () => {
    const { popularAreas } = this.state
    return _.map(popularAreas, (key, index) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={index}
          onPress={() =>
            this.props.navigation.navigate('KeywordSearchList', {
              locationString: key.name
            })
          }
          accessible={true}
          accessibilityLabel='homePopularAreaBtn'
        >
          <View
            style={{
              paddingLeft: Matrics.ScaleValue(15)
            }}
          >
            <ProgressiveImageBackground
              source={{ uri: key.imageUrl ? key.imageUrl : No_IMAGE_LINK }}
              imageStyle={{ borderRadius: 5 }}
              style={{
                height: Matrics.ScaleValue(208),
                width: Matrics.ScaleValue(150),
                marginVertical: 10,
                backgroundColor: '#cccccc',
                borderRadius: 5,
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 6,
                shadowOffset: { width: 0, height: 4 }
              }}
            >
              <Text style={styles.TextStyleScrollerHeader}>{key.name}</Text>
            </ProgressiveImageBackground>
          </View>
        </TouchableOpacity>
      )
    })
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.getSearchHomeList()
      }
    )
  }

  displayPorpertyType(propertyType) {
    if (propertyType === 'landed_sale') {
      return 'Landed-sale'
    } else if (propertyType === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return propertyType
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

  format(amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  displaySearchList = (key, index) => {
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
      <View>
        {index === 0 ? (
          <View>
            {this.state.specialOffers.length > 0 && (
              <View
                style={{ flex: 0.5, backgroundColor: '#fff', marginTop: 10 }}
              >
                <Text style={styles.TextStyleHeaderTag}>Special Offers</Text>

                <ScrollView horizontal keyboardShouldPersistTaps={'always'}>
                  <View style={{ flexDirection: 'row' }}>
                    {this.displaySpecialOffers()}
                  </View>
                </ScrollView>
              </View>
            )}
            <View style={{ flex: 0.5, backgroundColor: '#fff', marginTop: 10 }}>
              <Text style={styles.TextStyleHeaderTag}>Popular Areas</Text>

              <ScrollView horizontal keyboardShouldPersistTaps={'always'}>
                <View style={{ flexDirection: 'row' }}>
                  {this.displayPopularAreas()}
                </View>
              </ScrollView>
            </View>
            <Text
              style={[
                styles.TextStyleHeaderTag,
                { marginTop: 20, paddingBottom: 0 }
              ]}
            >
              Our Picks
            </Text>
          </View>
        ) : (
          <View />
        )}
        {key && (
          <PropertyCard
            data={key}
            price={this.format(key.price)}
            isBoost={isBoost}
            roomType={roomType}
            onPress={() => {
              this.props.navigation.navigate('ListingPageDetail', {
                propertyInfo: key
              })
            }}
          />
        )}
      </View>
    )
  }

  displayAutoCompleteList = (key) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={styles.listStyle}
          onPress={() => {
            this.setState({ searchNameList: '' }),
              this.searchToogleModel(!this.state.searchModelVisible),
              this.props.navigation.navigate('KeywordSearchList', {
                locationString: key.label !== '' ? key.label : 'kuala lumpur',
                lableId: key.id
              })
          }}
          accessible={true}
          accessibilityLabel='homeDisplayAutoCompBtn'
        >
          {key.type === 'LOCATION' ? (
            <Icon name='place' size={18} color='#000' />
          ) : key.type === 'ACCESSIBILITY' ? (
            <Icon name='directions-bus' size={18} color='#000' />
          ) : (
            <Icon name='home' size={18} color='#000' />
          )}
          <Text
            numberOfLines={1}
            style={[styles.textStyle, { flex: 2.5, marginLeft: 5 }]}
          >
            {key.label}
          </Text>

          <Text
            style={[
              styles.textStyle,
              {
                flex: 1,
                fontSize: 11,
                marginLeft: 5,
                textAlign: 'center',
                color: '#808080'
              }
            ]}
          >
            {this.Capitalize(key.type.toLowerCase())}
          </Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: 'white', width: width, height: 0 }} />
      </View>
    )
  }

  getUnitRange(value) {
    if (Math.abs(Number(value)) >= 1.0e9) {
      let v = Math.abs(Number(value)) / 1.0e9
      return `${v.toFixed(2)}B`
    } else if (Math.abs(Number(value)) >= 1.0e6) {
      let v = Math.abs(Number(value)) / 1.0e6
      return `${v.toFixed(2)}M`
    } else if (Math.abs(Number(value)) >= 1.0e3) {
      let v = Math.abs(Number(value)) / 1.0e3
      return `${v.toFixed(2)}K`
    } else {
      return Math.abs(Number(value)).toFixed(2)
    }
  }

  displayRecentSearchList = (key) => {
    return key.p_type == this.state.displayType ? (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={[styles.listStyle, { height: 40 }]}
          onPress={() => {
            this.setState({ searchNameList: '' }),
              this.searchToogleModel(!this.state.searchModelVisible),
              this.props.navigation.navigate('KeywordSearchList', {
                locationString:
                  key.keywords !== '' ? key.keywords : 'kuala lumpur',
                filterParam: key
                // lableId: key.id
              })
          }}
          accessible={true}
          accessibilityLabel='homeRecentListBtn'
        >
          {key.type === undefined ? (
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center'
              }}
            >
              <Text numberOfLines={1} style={[styles.textStyle, {}]}>
                {key.keywords === '' ? 'kuala lumpur' : key.keywords}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 13,
                      paddingTop: 3,
                      color: '#000000',
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  {key.maxPrice !== undefined
                    ? key.p_type == 'RENT'
                      ? key.types === undefined
                        ? `${priceFormat(key.minPrice)} - ${
                            key.maxPrice === '6000'
                              ? `${priceFormat(key.maxPrice)}+ RM`
                              : `${priceFormat(key.maxPrice)} RM`
                          } `
                        : `${priceFormat(key.minPrice)} - ${
                            key.maxPrice === '6000'
                              ? `${priceFormat(
                                  key.maxPrice
                                )}+ RM / ${this.Capitalize(
                                  key.types[0].toLowerCase()
                                )} - ${this.Capitalize(
                                  key.types[1].toLowerCase()
                                )}`
                              : `${priceFormat(
                                  key.maxPrice
                                )} RM / ${this.Capitalize(
                                  key.types[0].toLowerCase()
                                )} - ${this.Capitalize(
                                  key.types[1].toLowerCase()
                                )}`
                          }`
                      : key.types === undefined
                      ? `${this.getUnitRange(key.minPrice)} - ${
                          key.maxPrice === '5000000'
                            ? `${this.getUnitRange(key.maxPrice)}+ RM`
                            : `${this.getUnitRange(key.maxPrice)} RM`
                        }`
                      : `${this.getUnitRange(key.minPrice)} - ${
                          key.maxPrice === '5000000'
                            ? `${this.getUnitRange(
                                key.maxPrice
                              )}+ RM / ${this.Capitalize(
                                this.displayPropertyType(key.types[0])
                              )} - ${this.Capitalize(
                                this.displayPropertyType(key.types[1])
                              )}`
                            : `${this.getUnitRange(
                                key.maxPrice
                              )} RM / ${this.Capitalize(
                                this.displayPropertyType(key.types[0])
                              )} - ${this.Capitalize(
                                this.displayPropertyType(key.types[1])
                              )}`
                        }`
                    : key.p_type == 'RENT'
                    ? `${priceFormat(key.minPrice)} - ${priceFormat(6000)}+ RM`
                    : `${this.getUnitRange(key.minPrice)} - ${this.getUnitRange(
                        '5000000'
                      )}+ RM`}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center'
              }}
            >
              <Text numberOfLines={1} style={[styles.textStyle, {}]}>
                {key.keywords === '' ? 'kuala lumpur' : key.keywords}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontSize: 13,
                      paddingTop: 3,
                      color: '#000000',
                      fontFamily: 'OpenSans-SemiBold'
                    }
                  ]}
                >
                  {key.maxPrice !== undefined
                    ? key.p_type == 'RENT'
                      ? `${priceFormat(key.minPrice)} - ${
                          key.maxPrice === '6000'
                            ? `${priceFormat(
                                key.maxPrice
                              )}+ RM / ${this.Capitalize(
                                key.type.toLowerCase()
                              )}`
                            : `${priceFormat(
                                key.maxPrice
                              )} RM / ${this.Capitalize(
                                key.type.toLowerCase()
                              )}`
                        }`
                      : `${this.getUnitRange(key.minPrice)} - ${
                          key.maxPrice === '5000000'
                            ? `${this.getUnitRange(
                                key.maxPrice
                              )}+ RM / ${this.Capitalize(
                                this.displayPropertyType(key.type)
                              )}`
                            : `${this.getUnitRange(
                                key.maxPrice
                              )} RM / ${this.Capitalize(
                                this.displayPropertyType(key.type)
                              )}`
                        }`
                    : key.p_type == 'RENT'
                    ? `${priceFormat(key.minPrice)} - ${priceFormat(
                        6000
                      )}+ RM / ${this.Capitalize(key.type.toLowerCase())}`
                    : `${this.getUnitRange(key.minPrice)} - ${this.getUnitRange(
                        '5000000'
                      )}+ RM / ${this.Capitalize(
                        this.displayPropertyType(key.type)
                      )}`}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#D3D3D3',
            marginVertical: 5
          }}
        />
      </View>
    ) : null
  }

  displayPropertyType(type) {
    if (type.toLowerCase() === 'landed_sale') {
      return 'Landed'
    } else if (type.toLowerCase() === 'highrise_sale') {
      return 'Highrise'
    } else {
      return type.toLowerCase()
    }
  }

  checkLogin() {
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (!res) {
        this.props.navigation.navigate('Number', {
          screenName: 'Home'
        })
      } else {
        this.props.navigation.navigate('UserProfile')
        // this.props.navigation.navigate("EditPersonInfo");
      }
    })
  }

  _renderPropertyType = () => {
    const { sortingType } = this.state
    return _.map(sortingType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          style={{ width: '100%' }}
          onPress={() => {
            for (let index = 0; index < sortingType.length; index++) {
              if (sortingType[index].id === id) {
                sortingType[index].isSelected = true
                // AsyncStorage.setItem('displayType', sortingType[index].value);
              } else {
                sortingType[index].isSelected = false
              }
            }
            this.setState({ sortingType })
          }}
          accessible={true}
          accessibilityLabel='homePropertyTypeBtn'
        >
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  textAlign: 'left',
                  fontFamily: 'OpenSans-Light',
                  color: '#000'
                }}
              >
                {' '}
                {name}{' '}
              </Text>
              <Icon
                name='check'
                color={isSelected ? '#39D196' : '#FFFFFF'}
                size={22}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: '#F5F5F5',
                width: '100%',
                height: 1
              }}
            />
          </View>
        </TouchableOpacity>
      )
    })
  }

  resetType() {
    AsyncStorage.getItem('displayType').then((res) => {
      this.setState({ displayType: res })
    })
  }

  searchToogleModel(visible) {
    this.setState({ searchModelVisible: visible }, () => {
      this.showSearchResult(visible)
    })
  }

  showSearchResult = (visible) => {
    if (this.state.searchModelVisible === true) {
      this.refs.textRef && this.refs.textRef.focus()
      this.setState({ searchModelVisible: visible }, () => {
        this.getAutoCompleteList(this.state.searchString)
      })
    }
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }

  _changeDisplayType = (type, index) => () => {
    this.setState({ displayType: type })
    this.setState({ modalVisible: false })
    AsyncStorage.setItem('displayType', type)
    this.changeSortTypeStateValue(true, index)
  }

  onRefresh() {
    this.setState({ isFetching: true, page: 0 }, function () {
      this.getSearchHomeList()
    })
  }

  noDataView() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.TextStyleHeaderTag,
            { marginTop: 10, paddingBottom: 0 }
          ]}
        >
          Our Picks
        </Text>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            testID='noData'
            source={noDataImg}
            style={{
              height: Matrics.ScaleValue(50),
              width: Matrics.ScaleValue(50),
              marginRight: 20
            }}
          />
          <Text
            style={{
              fontWeight: '300',
              marginTop: 10,
              marginLeft: -15,
              fontSize: Matrics.ScaleValue(12)
            }}
          >
            No Data Found
          </Text>
        </View>
      </View>
    )
  }

  appUpdatesBanner(bannerImage, title, desc) {
    return (
      <View style={{ height: Matrics.ScaleValue(120) }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            bannerImage == imgUpadateInactive
              ? (Linking.openURL(
                  Platform.OS == 'ios' ? IOS_APP_LINK : ANDROID_APP_LINK
                ),
                this.manageAppUpdateClose('true'))
              : null
          }}
          accessible={true}
          accessibilityLabel='homeUpdateBannerBtn'
        >
          <View style={styles.updateAdBannerContainer}>
            <View style={styles.updateAdBannerImage}>
              <ProgressiveImage
                testID='banner'
                source={bannerImage}
                style={{
                  width: Matrics.ScaleValue(75),
                  height: Matrics.ScaleValue(75)
                }}
                resizeMode='contain'
              />
            </View>
            <View style={styles.updateAdBannerTextContainer}>
              <View style={styles.updateAdBannerTextView}>
                <Text style={styles.updateAdBannerTextTitle}>{title}</Text>
                <TouchableOpacity
                  style={styles.updateAdBannerClose}
                  onPress={() => {
                    bannerImage == imgUpadateactive
                      ? this.manageAppUpdateClose('false')
                      : null
                  }}
                  accessible={true}
                  accessibilityLabel='homeRightChevronBtn'
                >
                  <Icon
                    name={
                      bannerImage == imgUpadateactive
                        ? 'clear'
                        : 'chevron-right'
                    }
                    size={Matrics.ScaleValue(18)}
                    style={{ color: '#4885ED' }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.updateAdBannerTextChild}>{desc}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  manageAppUpdateClose(value) {
    AsyncStorage.setItem('displayAppUpdated', value)
    this.setState({ displayUpdatedBanner: value })
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  render() {
    const isNewAppVersion = compareVersions(
      this.state.liveVersion,
      VersionNumber.appVersion
    )
    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', backgroundColor: '#FFE100' }}>
          <EditText
            type={this.state.displayType}
            onSelect={() => {
              this.searchToogleModel(true)
            }}
            onChangeType={() => {
              this.toggleModal(!this.state.modalVisible)
            }}
            value={this.state.searchString}
            onPress={() => {
              this.setState({ searchNameList: '' }),
                this.props.navigation.navigate('KeywordSearchList', {
                  locationString:
                    this.state.searchString !== ''
                      ? this.state.searchString
                      : 'kuala lumpur',
                  lableId: ''
                })
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {isNewAppVersion
              ? this.appUpdatesBanner(
                  imgUpadateInactive,
                  'An update is available',
                  'Get updated to the latest version of this app for an even better experience with us.'
                )
              : this.state.displayUpdatedBanner == 'true'
              ? this.appUpdatesBanner(
                  imgUpadateactive,
                  'Your app is up to date',
                  'We are working round the clock to improve SPEEDHOME. We hope you will enjoy this update 🙂.'
                )
              : null}
            {this.state.ourPicksList && this.state.ourPicksList.length > 0 ? (
              <FlatList
                keyboardShouldPersistTaps={'always'}
                style={{ paddingBottom: 20 }}
                data={this.state.ourPicksList}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) =>
                  this.displaySearchList(item, index)
                }
                initialNumToRender={7}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (
                    this.state.ourPicksList.length !== this.state.totalElements
                  ) {
                    this.handleLoadMore()
                  }
                }}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
              />
            ) : (
              <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10 }}>
                <Text style={styles.TextStyleHeaderTag}>Popular Areas</Text>
                <View style={{ height: Matrics.ScaleValue(235) }}>
                  <ScrollView
                    style={{ flex: 1 }}
                    horizontal
                    keyboardShouldPersistTaps={'always'}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {this.displayPopularAreas()}
                    </View>
                  </ScrollView>
                </View>
                <View style={{ flex: 1 }}>{this.noDataView()}</View>
              </View>
            )}
          </View>
          {this.state.isLoading && (
            <View style={styles.LoaderContainer}>
              <View style={styles.LoaderWrapper}>
                <ActivityIndicator
                  animating={this.state.isLoading}
                  size='large'
                  color='black'
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.LoaderText}>Loading...</Text>
              </View>
            </View>
          )}
        </View>

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={this.state.searchModelVisible}
          onRequestClose={() => {
            this.setState({ searchModelVisible: false })
          }}
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
              borderRadius: 5,
              backgroundColor: 'rgba(52, 52, 52, 0.5)',
              width: width,
              alignItems: 'center'
            }}
            behavior='padding'
            keyboardVerticalOffset={Platform.select({
              ios: () => 20,
              android: () => -300
            })()}
            enabled
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                height: '90%',
                width: '90%',
                marginTop: DeviceInfo.hasNotch() ? 45 : 15,
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.searchToogleModel(!this.state.searchModelVisible)
                  }
                  style={{ paddingRight: 5 }}
                  accessible={true}
                  accessibilityLabel='homeBackArrowBtn'
                >
                  <Icon name='arrow-back' size={20} style={{ color: '#000' }} />
                </TouchableOpacity>
                <TextInput
                  testID='areaName'
                  style={{
                    width: '80%',
                    height: 50,
                    fontSize: 14,
                    color: '#000'
                  }}
                  autoFocus={true}
                  ref={'textRef'}
                  value={this.state.searchString}
                  returnKeyType='done'
                  onSubmitEditing={() => {
                    this.searchToogleModel(!this.state.searchModelVisible),
                      this.setState({ searchNameList: '' }),
                      this.props.navigation.navigate('KeywordSearchList', {
                        locationString:
                          this.state.searchString !== ''
                            ? this.state.searchString
                            : 'kuala lumpur',
                        lableId: ''
                      })
                  }}
                  keyboardType={'web-search'}
                  placeholder='Type in Area / Property Name'
                  accessible={true}
                  accessibilityLabel='homeSearchPropertyTextBox'
                  onChangeText={(searchString) => {
                    this.setState({ searchString: searchString }),
                      this.getAutoCompleteList(searchString)
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.searchString == '') {
                      this.searchToogleModel(false)
                    } else {
                      this.setState({ searchString: '' })
                      this.getAutoCompleteList('')
                    }
                  }}
                  style={{ paddingRight: 5 }}
                  accessible={true}
                  accessibilityLabel='homeClearIconBtn'
                >
                  <Icon name='clear' size={20} style={{ color: '#000' }} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 5,
                  elevation: 5,
                  backgroundColor: 'white',
                  shadowColor: 'grey',
                  shadowOpacity: 5,
                  shadowOffset: { width: 0, height: 5 },
                  marginTop: -10,
                  marginBottom: 10,
                  width: '100%'
                }}
              />

              {this.state.searchString.length <= 0 ? (
                <View
                  style={{
                    flexDirection: 'column',
                    width: '90%',
                    backgroundColor: 'white',
                    borderRadius: 5
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.textStyle,
                      {
                        marginTop: 5,
                        marginBottom: 5,
                        color: 'green',
                        fontFamily: 'OpenSans-SemiBold',
                        fontSize: 15
                      }
                    ]}
                  >
                    Recent searches
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      width: '100%',
                      backgroundColor: '#D3D3D3',
                      marginVertical: 5
                    }}
                  />
                </View>
              ) : (
                <View />
              )}

              {this.state.searchString.length <= 0 ? (
                <FlatList
                  style={{
                    backgroundColor: 'white',
                    marginBottom: 10,
                    borderRadius: 5,
                    width: '90%'
                  }}
                  data={this.state.restoredArray}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item }) => (
                    <View>{this.displayRecentSearchList(item)}</View>
                  )}
                />
              ) : (
                <FlatList
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    width: '90%'
                  }}
                  data={this.state.searchNameList}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item }) => (
                    <View>{this.displayAutoCompleteList(item)}</View>
                  )}
                />
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {this.state.showReferralDialog === true ? (
          <ReferFrds
            modalVisible={this.state.showReferralDialog}
            headerText='Welcome'
            bodyText={`Welcome to speedhome , you have been referred by ${this.state.nameOfPerson}. You can now post a property`}
            toggleModal={(value) => {
              if (value === false) {
                this.setState({ showReferralDialog: false })
                AsyncStorage.setItem('referral', 'referred')
              }
            }}
          />
        ) : (
          <View />
        )}

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
        {this.state.modalVisible && (
          <View style={styles.typeDropDownRoot}>
            <TouchableOpacity
              style={styles.typeDropDownViews}
              onPress={this._changeDisplayType('BUY', 0)}
              accessible={true}
              accessibilityLabel='homeBuyBtn'
            >
              <Text>Buy</Text>
              {this.state.displayType === 'BUY' && (
                <Icon name='check' size={14} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeDropDownViews}
              onPress={this._changeDisplayType('RENT', 1)}
              accessible={true}
              accessibilityLabel='homeRentBtn'
            >
              <Text>Rent</Text>
              {this.state.displayType === 'RENT' && (
                <Icon name='check' size={14} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    paddingTop: Matrics.ScaleValue(30),
    backgroundColor: '#FFE100'
  },
  headerview: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  HeaderStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'grey',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    height: Matrics.ScaleValue(60),
    width: '100%',
    marginHorizontal: Matrics.ScaleValue(10),
    marginTop: Matrics.ScaleValue(10),
    marginBottom: Matrics.ScaleValue(10)
  },
  TextStyleScrollerHeader: {
    fontSize: Matrics.ScaleValue(15),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    paddingLeft: Matrics.ScaleValue(10),
    paddingTop: Matrics.ScaleValue(10)
  },
  TextStyleScrollerDetail: {
    fontSize: Matrics.ScaleValue(10),
    color: '#fff',
    textAlign: 'left',
    paddingLeft: Matrics.ScaleValue(10),
    paddingTop: Matrics.ScaleValue(5)
  },
  TextStyleHeaderTag: {
    fontSize: Matrics.ScaleValue(18),
    fontFamily: 'OpenSans-SemiBold',
    paddingBottom: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(5),
    paddingLeft: Matrics.ScaleValue(15),
    color: '#000'
  },
  styleItem: {
    marginTop: Matrics.ScaleValue(20),
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    position: 'relative'
  },
  styleInfo: {
    flexDirection: 'column',
    borderRadius: 5,
    borderColor: 'black',
    height: Matrics.ScaleValue(100),
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  listStyle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: Matrics.ScaleValue(35),
    alignItems: 'center'
  },
  textStyle: {
    fontSize: Matrics.ScaleValue(13),
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000'
  },
  textPropertyType: {
    paddingTop: Matrics.ScaleValue(10),
    paddingBottom: Matrics.ScaleValue(10),
    paddingLeft: Matrics.ScaleValue(10),
    paddingRight: Matrics.ScaleValue(10),
    fontSize: Matrics.ScaleValue(14),
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey'
  },
  HeaderSortStyle: {
    flex: 1,
    height: Matrics.ScaleValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: 'grey',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    width: '100%'
  },
  typeDropDownRoot: {
    width: Matrics.ScaleValue(120),
    height: Matrics.ScaleValue(80),
    backgroundColor: 'white',
    position: 'absolute',
    top: Matrics.ScaleValue(55),
    zIndex: 5,
    left: Matrics.ScaleValue(16),
    borderColor: 'grey',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeDropDownViews: {
    width: '100%',
    height: Matrics.ScaleValue(39.5),
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Matrics.ScaleValue(5)
  },
  LoaderContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1
  },
  LoaderWrapper: {
    width: '25%',
    height: '18%',
    backgroundColor: '#FFE100',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: Matrics.ScaleValue(10)
  },
  LoaderText: {
    color: 'black',
    textAlign: 'center'
  },
  updateAdBannerContainer: {
    margin: Matrics.ScaleValue(10),
    flex: 1,
    backgroundColor: 'white',
    borderRadius: Matrics.ScaleValue(15),
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1.5 },
    flexDirection: 'row'
  },
  updateAdBannerImage: {
    flex: 1,
    height: Matrics.ScaleValue(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  updateAdBannerTextContainer: {
    flex: 3,
    height: Matrics.ScaleValue(100),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: Matrics.ScaleValue(5),
    flexDirection: 'column'
  },
  updateAdBannerTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: Matrics.ScaleValue(10)
  },
  updateAdBannerTextTitle: {
    fontSize: Matrics.ScaleValue(15),
    fontWeight: '800',
    fontFamily: 'OpenSans-SemiBold'
  },
  updateAdBannerTextChild: {
    fontSize: Matrics.ScaleValue(12),
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'OpenSans-Light',
    paddingRight: Matrics.ScaleValue(30)
  },
  updateAdBannerClose: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
})

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData, userLoginProfileData } = loginData
  return { isUserLogin, userLoginData, userLoginProfileData }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { setLoginUserData, getLoginUserData, setLoginUserProfileData },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Home))
