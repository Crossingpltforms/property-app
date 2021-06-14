import React, { Component } from 'react'
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Text,
  View,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  SafeAreaView,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from 'recyclerlistview'
const { StatusBarManager } = NativeModules
import Container from '../../components/Container'
import { Icon } from 'react-native-elements'
import EditText from '../../components/EditText'
import _ from 'lodash'
import MapView, { Marker } from 'react-native-maps'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import DeviceInfo from 'react-native-device-info'
import ModalSelector from 'react-native-modal-selector'
import { getStatusBarHeight } from 'react-native-status-bar-height'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import ErrorDialog from '../../components/ErrorDialog'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'
import { logEvent, events } from '../../util/fbAnalytics'
const { width, height } = Dimensions.get('window')

import { styles } from './styles'
import { Matrics } from '../../common/styles'

// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'

import unSelectedPin from '../../../Images/UI/unselectedpin.png'
import selectedPin from '../../../Images/UI/selectedpin.png'
import listingImage from '../../../Images/noInfo.png'

import {
  rentalPeriod,
  No_IMAGE_LINK,
  NETCORE_TRACK_EVENT
} from '../../common/constants'

import { getRoomTypeLabel, priceFormat } from '../../common/helper/common'
import PropertyCard from '../../components/property-card'

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005
const SCREEN_WIDTH = Dimensions.get('window').width

class KeywordSearchList extends Component {
  // animatedValue = new Animated.Value(0)

  constructor(props) {
    super(props)
    this.state = {
      isMapReady: false,
      showErrorDialog: false,
      tapOnMarker: false,
      isExpanded: false,
      test: false,
      displayMap: false,
      STATUSBAR_HEIGHT: 0,
      selectedMapIndex: '',
      isFullDisplay: true,
      isLoading: false,
      apiCallFor: 'keyword',
      modalVisible: false,
      values: [0, 6000],
      locationString: props.navigation.state.params.locationString,
      filterParam: props.navigation.state.params.filterParam,
      lableId:
        props.navigation.state.params.lableId !== undefined
          ? props.navigation.state.params.lableId
          : '',
      page: 0,
      pageSize: 15,
      latitude: '',
      longitude: '',
      currentLat: 0,
      currentLng: 0,
      totalElements: 0,
      infoData: '',
      searchName: '',

      alert_message: '',
      displayType: 'RENT',

      searchString: props.navigation.state.params.locationString,
      searchNameList: '',
      autoCompleteLocationString: '',
      typeModalVisible: false,
      searchModelVisible: false,
      type: '',
      isSelectHighrise: false,
      isSelectLand: false,
      selectedTitleType: '',
      furnishType: '',
      bathroomTypeSelection: '',
      bedroom: null,
      bathroom: 0,
      roomTypeSelection: '',
      bathroomType: '',
      carpark: 0,
      nearLrt: false,
      allRaces: false,
      instantView: false,
      petFriendly: false,
      lat: 0,
      lang: 0,
      maxPrice: 6000,
      minPrice: 0,
      sorting: '',

      filterViewOn: true,
      mapViewOn: true,
      viewType: '',
      searchList: '',
      mapSearchList: [],
      conversationList: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
        []
      ),
      housingType: [
        {
          id: 0,
          name: 'Room',
          isSelected: false,
          value: 'ROOM'
        },
        {
          id: 1,
          name: 'Landed',
          isSelected: false,
          value: 'LANDED'
        },
        {
          id: 2,
          name: 'High-Rise',
          isSelected: false,
          value: 'HIGHRISE'
        }
      ],
      housingBuyType: [
        {
          id: 0,
          name: 'Landed',
          isSelected: false,
          value: 'LANDED_SALE'
        },
        {
          id: 1,
          name: 'High-Rise',
          isSelected: false,
          value: 'HIGHRISE_SALE'
        }
      ],
      sortingType: [
        {
          id: 0,
          name: 'Relevance',
          isSelected: true,
          value: ''
        },
        {
          id: 1,
          name: 'Distance',
          isSelected: false,
          value: 'distance'
        },
        {
          id: 2,
          name: 'Price',
          isSelected: false,
          value: 'price'
        }
      ],
      housingTypeFurniture: [
        {
          id: 0,
          name: 'No Furnishing',
          isSelected: false,
          value: 'NONE'
        },
        {
          id: 1,
          name: 'Partial Furnishing',
          isSelected: false,
          value: 'PARTIAL'
        },
        {
          id: 2,
          name: 'Fully Furnishing',
          isSelected: false,
          value: 'FULL'
        }
      ],
      numberOfRooms: [
        {
          id: 0,
          name: 'Studio',
          isSelected: false,
          value: 0
        },
        {
          id: 1,
          name: '1',
          isSelected: false,
          value: 1
        },
        {
          id: 2,
          name: '2+',
          isSelected: false,
          value: 2
        },
        {
          id: 3,
          name: '3+',
          isSelected: false,
          value: 3
        },
        {
          id: 4,
          name: '4+',
          isSelected: false,
          value: 4
        }
      ],
      numberOfBathrooms: [
        {
          id: 0,
          name: '1+',
          isSelected: false,
          value: 1
        },
        {
          id: 1,
          name: '2+',
          isSelected: false,
          value: 2
        },
        {
          id: 2,
          name: '3+',
          isSelected: false,
          value: 3
        },
        {
          id: 3,
          name: '4+',
          isSelected: false,
          value: 4
        }
      ],
      numberOfParking: [
        {
          id: 0,
          name: '1+',
          isSelected: false,
          value: 1
        },
        {
          id: 1,
          name: '2+',
          isSelected: false,
          value: 2
        },
        {
          id: 2,
          name: '3+',
          isSelected: false,
          value: 3
        },
        {
          id: 3,
          name: '4+',
          isSelected: false,
          value: 4
        }
      ],
      extraInfo: [
        {
          id: 0,
          name: 'Nearby LRT',
          isSelected: false,
          value: 'nearLrt'
        },
        {
          id: 1,
          name: 'Pet Friendly',
          isSelected: false,
          value: 'petFriendly'
        },
        {
          id: 2,
          name: 'accept all races',
          isSelected: false,
          value: 'allRaces'
        },
        {
          id: 3,
          name: 'Instant view',
          isSelected: false,
          value: 'instantView'
        }
      ],
      extraInfoBuy: [
        {
          id: 0,
          name: 'Nearby LRT',
          isSelected: false,
          value: 'nearLrt'
        },
        {
          id: 1,
          name: 'None bumi lot',
          isSelected: false,
          value: 'allRaces'
        }
      ],
      roomType: [
        {
          id: 0,
          name: 'Single',
          isSelected: false,
          value: 'SMALL'
        },
        {
          id: 1,
          name: 'Middle',
          isSelected: false,
          value: 'MEDIUM'
        },
        {
          id: 2,
          name: 'Master',
          isSelected: false,
          value: 'MASTER'
        },
        {
          id: 3,
          name: 'Any',
          isSelected: false,
          value: ''
        }
      ],
      bathroomType: [
        {
          id: 0,
          name: 'Private',
          isSelected: false,
          value: 'PRIVATE'
        },
        {
          id: 1,
          name: 'Shared',
          isSelected: false,
          value: 'SHARED'
        },
        {
          id: 2,
          name: 'Any',
          isSelected: false,
          value: ''
        }
      ],
      titleType: [
        {
          id: 0,
          name: 'Freehold',
          isSelected: false,
          value: 'FREEHOLD'
        },
        {
          id: 1,
          name: 'Leasehold',
          isSelected: false,
          value: 'LEASEHOLD'
        }
        // {
        //   id: 2,
        //   name: 'Bumi Lot',
        //   isSelected: false,
        //   value: 'BUMILOT',
        // }
      ],
      sortingPropertyType: [
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
          restoredArray: [],
          value: 'BUY'
        }
      ],
      rentalPeriodTimeData: rentalPeriod,
      rentalPeriodTime: '12',
      rentalPeriodValue: 0,
      layoutProvider: this.getLayoutProvider(),
      allowAPICalls: true,
      empty: false
    }
  }

  getLayoutProvider = () => {
    return new LayoutProvider(
      () => {
        return 1
      },
      (type, dim, index) => {
        dim.width = SCREEN_WIDTH
        dim.height = 260
      }
    )
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
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.setState({ STATUSBAR_HEIGHT: getStatusBarHeight() })
    } else {
      this.setState({ STATUSBAR_HEIGHT: StatusBarManager.HEIGHT })
    }

    this.resetFilter()

    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      const restoredArray = JSON.parse(res)
      this.setState({
        restoredArray: restoredArray !== null ? restoredArray.reverse() : []
      })
    })

    // this.listener = this.animatedValue.addListener(this.onAnimatedValueChange.bind(this))

    this.setState({
      mapSearchList: '',
      searchList: '',
      conversationList: this.newDataProvider()
    })

    AsyncStorage.getItem('displayType').then((res) => {
      if (res === '' || res === null) {
        this.setState({ displayType: this.state.displayType })
        AsyncStorage.setItem('displayType', 'RENT')
      } else {
        this.setState({ displayType: res })
        this.state.sortingPropertyType.map((item, index) => {
          if (item.value.toLowerCase() === res.toLowerCase()) {
            this.changeSortTypeStateValue(true, index)
          } else {
            this.changeSortTypeStateValue(false, index)
          }
        })
      }
    })
  }

  key_exists(key, search) {
    if (
      !search ||
      (search.constructor !== Array && search.constructor !== Object)
    ) {
      return false
    }
    for (var i = 0; i < search.length; i++) {
      if (search[i] === key) {
        return true
      }
    }
    return key in search
  }

  changeSortTypeStateValue(isSelect, index) {
    if (this.state.displayType === 'BUY') {
      this.setState({ values: [0, 5000000] })
      this.setState({ maxPrice: 5000000 })
    } else {
      this.setState({ values: [0, 6000] })
      this.setState({ maxPrice: 6000 })
    }
    const newArray = this.state.sortingPropertyType
    newArray[index].isSelected = isSelect
    this.setState({ sortingPropertyType: newArray })

    const filterParam = this.state.filterParam
    if (filterParam != undefined && filterParam != null) {
      filterParam.nearLrt ? this.setState({ nearLrt: filterParam.nearLrt }) : ''
      filterParam.allRaces
        ? this.setState({ allRaces: filterParam.allRaces })
        : ''
      filterParam.instantView
        ? this.setState({ instantView: filterParam.instantView })
        : ''
      filterParam.petFriendly
        ? this.setState({ petFriendly: filterParam.petFriendly })
        : ''
      filterParam.pageNumber ? this.setState({ page: 0 }) : ''
      filterParam.pageSize
        ? this.setState({ pageSize: filterParam.pageSize })
        : ''
      filterParam.sort ? this.setState({ sorting: filterParam.sort }) : ''
      filterParam.latitude
        ? this.setState({ currentLat: filterParam.latitude })
        : ''
      filterParam.longitude
        ? this.setState({ currentLng: filterParam.longitude })
        : ''
      filterParam.leaseType
        ? this.setState({ selectedTitleType: filterParam.leaseType })
        : ''
      filterParam.landmarkLabelId
        ? this.setState({ lableId: filterParam.landmarkLabelId })
        : ''
      filterParam.type ? this.setState({ type: filterParam.type }) : ''
      filterParam.furnishType
        ? this.setState({ furnishType: filterParam.furnishType })
        : ''
      filterParam.carpark ? this.setState({ carpark: filterParam.carpark }) : ''
      filterParam.bedroom ? this.setState({ bedroom: filterParam.bedroom }) : ''
      filterParam.bathroom
        ? this.setState({ bathroom: filterParam.bathroom })
        : ''
      filterParam.bathroomType
        ? this.setState({ bathroomTypeSelection: filterParam.bathroomType })
        : ''

      if (this.state.displayType === 'BUY') {
        if (filterParam.maxPrice != undefined && filterParam.maxPrice != null) {
          this.setState({
            values: [filterParam.minPrice, filterParam.maxPrice]
          })
        } else {
          this.setState({ values: [filterParam.minPrice, 5000000] })
        }

        if (filterParam.type != undefined && filterParam.type != null) {
          const houseBuyType = this.state.housingBuyType.map((val, index) => {
            if (val.value.toString() === filterParam.type.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          })
          this.setState({
            housingBuyType: houseBuyType
          })
        }

        if (filterParam.types != undefined && filterParam.types != null) {
          const housingTypes = this.state.housingBuyType.map((val, index) => {
            if (this.key_exists(val.value, filterParam.types) === true) {
              val.isSelected = true
            }
            return val
          })
          this.setState({
            housingBuyType: housingTypes
          })
        }

        if (
          filterParam.leaseType != undefined &&
          filterParam.leaseType != null
        ) {
          const titlesType = this.state.titleType.map((val, index) => {
            if (val.value.toString() === filterParam.leaseType.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          })
          this.setState({
            titleType: titlesType
          })
        }

        const InfoBuy = this.state.extraInfoBuy.map((val, index) => {
          if (val.value.toString() === 'nearLrt') {
            if (filterParam.nearLrt === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          } else if (val.value.toString() === 'allRaces') {
            if (filterParam.allRaces === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          } else {
          }
          return val
        })
        this.setState({
          extraInfoBuy: InfoBuy
        })
      } else {
        if (filterParam.maxPrice != undefined && filterParam.maxPrice != null) {
          this.setState({
            values: [filterParam.minPrice, filterParam.maxPrice]
          })
        } else {
          this.setState({ values: [filterParam.minPrice, 6000] })
        }

        if (filterParam.type != undefined && filterParam.type != null) {
          const HouseType = this.state.housingType.map((val, index) => {
            if (val.value.toString() === filterParam.type.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          })
          this.setState({
            housingType: HouseType
          })
        }

        if (filterParam.types != undefined && filterParam.types != null) {
          const housingTypes = this.state.housingType.map((val, index) => {
            if (this.key_exists(val.value, filterParam.types) === true) {
              if (val.value === 'HIGHRISE') {
                this.setState({ isSelectHighrise: true })
              } else if (val.value === 'LANDED') {
                this.setState({ isSelectLand: true })
              }

              val.isSelected = true
            }
            return val
          })
          this.setState({
            housingType: housingTypes
          })
        }

        const InfoRent = this.state.extraInfo.map((val, index) => {
          if (val.value.toString() === 'nearLrt') {
            if (filterParam.nearLrt === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          } else if (val.value.toString() === 'allRaces') {
            if (filterParam.allRaces === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          } else if (val.value.toString() === 'petFriendly') {
            if (filterParam.petFriendly === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          } else if (val.value.toString() === 'instantView') {
            if (filterParam.instantView === true) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
          }
          return val
        })
        this.setState({
          extraInfo: InfoRent
        })
      }

      if (
        filterParam.furnishType != undefined &&
        filterParam.furnishType != null
      ) {
        const FurnishType = this.state.housingTypeFurniture.map(
          (val, index) => {
            if (val.value.toString() === filterParam.furnishType.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          }
        )
        this.setState({
          housingTypeFurniture: FurnishType
        })
      }

      if (filterParam.bathroom != undefined && filterParam.bathroom != null) {
        const Bathrooms = this.state.numberOfBathrooms.map((val, index) => {
          if (val.value.toString() === filterParam.bathroom.toString()) {
            val.isSelected = true
          } else {
            val.isSelected = false
          }
          return val
        })
        this.setState({
          numberOfBathrooms: Bathrooms
        })
      }

      if (filterParam.carpark != undefined && filterParam.carpark != null) {
        const numberParking = this.state.numberOfParking.map((val, index) => {
          if (val.value.toString() === filterParam.carpark.toString()) {
            val.isSelected = true
          } else {
            val.isSelected = false
          }
          return val
        })
        this.setState({
          numberOfParking: numberParking
        })
      }

      if (filterParam.bedroom != undefined && filterParam.bedroom != null) {
        if (this.state.displayType !== 'ROOM') {
          if (filterParam.bedroom != undefined && filterParam.bedroom != null) {
            const numberRooms = this.state.numberOfRooms.map((val, index) => {
              if (val.value.toString() === filterParam.bedroom.toString()) {
                val.isSelected = true
              } else {
                val.isSelected = false
              }
              return val
            })
            this.setState({
              numberOfRooms: numberRooms
            })
          }
        }

        if (
          filterParam.bathroomType != undefined &&
          filterParam.bathroomType != null
        ) {
          const BathroomType = this.state.bathroomType.map((val, index) => {
            if (val.value.toString() === filterParam.bathroomType.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          })
          this.setState({
            bathroomType: BathroomType
          })
        }
      } else {
        if (
          filterParam &&
          filterParam.roomType != undefined &&
          filterParam.roomType != null
        ) {
          const roomsType = this.state.roomType.map((val, index) => {
            if (val.value.toString() === filterParam.roomType.toString()) {
              val.isSelected = true
            } else {
              val.isSelected = false
            }
            return val
          })
          this.setState({
            roomType: roomsType
          })
        }
      }
    }

    if (isSelect === true) {
      this.searchProperty()
    }
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = (allowAPICalls = true) => {
    this.setState({ isLoading: false, allowAPICalls: allowAPICalls })
  }

  getAutoCompletePropertyList = (location) => {
    this.setState({ apiCallFor: 'autocompleteproperty', empty: false })

    this.showLoader()

    if (!global.networkConnection) return

    this.setState({
      locationString:
        this.state.autoCompleteLocationString === ''
          ? location
          : this.state.autoCompleteLocationString
    })

    var body = {
      keywords:
        this.state.autoCompleteLocationString === ''
          ? location
          : this.state.autoCompleteLocationString,
      pageSize: this.state.pageSize,
      pageNumber: this.state.page,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      sort: 'location'
    }

    if (this.state.displayType === 'BUY') {
      if (this.state.values[1] !== 5000000) {
        body['maxPrice'] = this.state.values[1]
      }
    } else {
      if (this.state.values[1] !== 6000) {
        body['maxPrice'] = this.state.values[1]
      }
    }

    if (
      this.state.isSelectHighrise === true &&
      this.state.isSelectLand === true
    ) {
      body['types'] = ['HIGHRISE', 'LANDED']
    } else {
      if (this.state.type !== '') {
        body['type'] = this.state.type
      } else {
        if (this.state.displayType === 'BUY' && this.state.type === '') {
          body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
        }
      }
    }

    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      if (res) {
        const restoredArray = JSON.parse(res)
        const dic = body
        dic['p_type'] = this.state.displayType
        restoredArray.push(dic)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(restoredArray))
      } else {
        const recentData = []
        const dic = body
        dic['p_type'] = this.state.displayType
        recentData.push(dic)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(recentData))
      }
    })

    APICaller(Http.propertySearch, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (!json) return
        if (json.status === 200) {
          const { searchList } = this.state

          const NetCorePayload = {
            Area_of_property:
              this.state.autoCompleteLocationString === ''
                ? location
                : this.state.autoCompleteLocationString
          }
          NetcoreSDK.track(NETCORE_TRACK_EVENT.SEARCH_FOR_AREA, NetCorePayload)

          this.addEventTracking(
            this.state.autoCompleteLocationString === ''
              ? location
              : this.state.autoCompleteLocationString
          )

          analytics().logEvent(trackerEventSubmit.postProperty.action.search)
          logEvent(trackerEventSubmit.postProperty.action.search)
          if (json.data.empty) {
            this.setState({
              totalElements: 0,
              empty: json.data.empty,
              alert_message: 'No Properties found'
            })
            this.hideLoader()

            this._hideAlertView()
          } else {
            this.updateSearchListValue(json.data && json.data.content)
            this.setState({
              totalElements: json.data.totalElements,
              infoData: ''
            })
            if (this.state.displayMap === true) {
              this.setState({ viewType: 'map', displayMap: true })
            } else {
              this.setState({ viewType: 'search' })
            }
            this.hideLoader()
            this.displaySearchList()
          }
        } else {
          this.hideLoader()
          this.displayError()
        }
      }
    )
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

  displayAutoCompleteList = (key) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={styles.listStyle}
          onPress={() => {
            this.searchToogleModel(!this.state.searchModelVisible),
              this.searchAutoCompleteProperty(key.label)
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListLocationBtn'
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

  updateSearchListValue = (data) => {
    if (data) {
      let dataProviderData = []
      for (let i = 0; i < data.length; i += 1) {
        dataProviderData.push({
          type: 'NORMAL',
          item: data[i]
        })
      }
      if (this.state.searchList.length > 0) {
        const arr = this.state.searchList.concat(data)
        this.setState(
          {
            conversationList: new DataProvider(
              (r1, r2) => r1 !== r2
            ).cloneWithRows(arr),
            searchList: arr
          },
          () => {
            this.state.searchList != ''
              ? this.setState({
                latitude: this.state.searchList[0].latitude,
                longitude: this.state.searchList[0].longitude
              })
              : null
          }
        )
      } else {
        this.setState(
          {
            conversationList: new DataProvider(
              (r1, r2) => r1 !== r2
            ).cloneWithRows(data),
            searchList: data,
            mapSearchList: data
          },
          () => {
            this.state.searchList != ''
              ? this.setState({
                latitude: this.state.searchList[0].latitude,
                longitude: this.state.searchList[0].longitude
              })
              : null
          }
        )
      }
    }
  }

  getSearchHomeList = () => {
    this.setState({ apiCallFor: 'keyword', empty: false })
    this.showLoader()
    if (!global.networkConnection) return

    // this.setState({ locationString: this.state.locationString });
    var body = {
      keywords: this.state.locationString,
      pageSize: 10,
      pageNumber: this.state.page,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      sort: 'location'
    }

    const filterParam = this.state.filterParam
    if (filterParam != undefined && filterParam != null) {
      body['minPrice'] = filterParam.minPrice
      body['maxPrice'] = filterParam.maxPrice
    } else {
      if (this.state.displayType === 'BUY') {
        if (this.state.values[1] !== 5000000) {
          body['maxPrice'] = this.state.values[1]
        }
      } else {
        if (this.state.values[1] !== 6000) {
          body['maxPrice'] = this.state.values[1]
        }
      }
    }

    // if (this.state.lableId !== '') {
    //   body['landmarkLabelId'] = this.state.lableId;
    // }

    if (
      this.state.isSelectHighrise === true &&
      this.state.isSelectLand === true
    ) {
      body['types'] = ['HIGHRISE', 'LANDED']
    } else {
      if (this.state.type !== '') {
        body['type'] = this.state.type
      } else {
        if (this.state.displayType === 'BUY' && this.state.type === '') {
          body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
        }
      }
    }

    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      if (res) {
        const restoredArray = JSON.parse(res)
        var dic = body
        dic['p_type'] = this.state.displayType
        restoredArray.push(dic)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(restoredArray))
      } else {
        var recentData = []
        var dic = body
        dic['p_type'] = this.state.displayType
        recentData.push(body)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(recentData))
      }
    })
    APICaller(Http.propertySearch, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (!json) return
        if (json.status === 200) {
          const { searchList } = this.state

          const NetCorePayload = {
            Area_of_property: this.state.locationString
          }
          NetcoreSDK.track(NETCORE_TRACK_EVENT.SEARCH_FOR_AREA, NetCorePayload)

          this.addEventTracking(this.state.locationString)

          analytics().logEvent(trackerEventSubmit.postProperty.action.search)
          logEvent(trackerEventSubmit.postProperty.action.search)
          if (json.data.empty) {
            this.setState({
              totalElements: 0,
              empty: json.data.empty,
              alert_message: 'No Properties found'
            })
            this.hideLoader()
            this.setState({})
            this._hideAlertView()
          } else {
            this.updateSearchListValue(json.data && json.data.content)
            this.setState({
              totalElements: json.data.totalElements,
              infoData: ''
            })
            if (this.state.displayMap === true) {
              this.setState({ viewType: 'map', displayMap: true })
            } else {
              this.setState({ viewType: 'search' })
            }
            this.hideLoader()
            this.displaySearchList()
          }
        } else {
          this.hideLoader()
          this.displayError()
        }
      }
    )
  }

  getFilterSearchList = () => {
    this.setState({ apiCallFor: 'filter', empty: false })
    this.showLoader()
    if (!global.networkConnection) return
    // this.setState({ locationString: this.state.locationString });

    var body = {
      keywords: this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      sort: this.state.sorting
    }

    const filterParam = this.state.filterParam
    if (filterParam != undefined && filterParam != null) {
      body['minPrice'] = filterParam.minPrice
      body['maxPrice'] = filterParam.maxPrice
    } else {
      if (this.state.displayType === 'BUY') {
        if (this.state.values[1] !== 5000000) {
          body['maxPrice'] = this.state.values[1]
        }
      } else {
        if (this.state.values[1] !== 6000) {
          body['maxPrice'] = this.state.values[1]
        }
      }
    }

    if (
      this.state.displayType === 'BUY' &&
      this.state.selectedTitleType !== ''
    ) {
      body['leaseType'] = this.state.selectedTitleType
    }

    // if (this.state.lableId !== '') {
    //   body['landmarkLabelId'] = this.state.lableId;
    // }

    if (
      this.state.isSelectHighrise === true &&
      this.state.isSelectLand === true
    ) {
      body['types'] = ['HIGHRISE', 'LANDED']
    } else {
      if (this.state.type !== '') {
        body['type'] = this.state.type
      } else {
        if (this.state.displayType === 'BUY' && this.state.type === '') {
          body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
        }
      }
    }

    if (this.state.furnishType !== '') {
      body['furnishType'] = this.state.furnishType
    }

    if (this.state.carpark !== 0) {
      body['carpark'] = this.state.carpark
    }

    if (this.state.bedroom !== null) {
      body['bedroom'] = this.state.bedroom
    }

    if (this.state.bathroom !== 0) {
      body['bathroom'] = this.state.bathroom
    }

    var bodyRoom = {
      keywords:
        this.state.locationString === ''
          ? 'kuala lumpur'
          : this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      sort: this.state.sorting
    }

    if (this.state.displayType === 'BUY') {
      if (this.state.values[1] !== 5000000) {
        bodyRoom['maxPrice'] = this.state.values[1]
      }
    } else {
      if (this.state.values[1] !== 6000) {
        bodyRoom['maxPrice'] = this.state.values[1]
      }
    }

    // if (this.state.displayType === 'BUY') {
    //   bodyRoom["leaseType"] = this.state.selectedTitleType;
    // }

    // if (this.state.lableId !== '') {
    //   bodyRoom['landmarkLabelId'] = this.state.lableId;
    // }

    if (this.state.type !== '') {
      bodyRoom['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        bodyRoom['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
    }

    if (this.state.furnishType !== '') {
      bodyRoom['furnishType'] = this.state.furnishType
    }

    if (this.state.carpark !== 0) {
      bodyRoom['carpark'] = this.state.carpark
    }
    if (this.state.bathroomTypeSelection !== '') {
      bodyRoom['bathroomType'] = this.state.bathroomTypeSelection
    }
    if (this.state.roomTypeSelection !== '') {
      bodyRoom['roomType'] = this.state.roomTypeSelection
    }

    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      if (res) {
        const restoredArray = JSON.parse(res)
        var dic = this.state.type === 'ROOM' ? bodyRoom : body
        dic['p_type'] = this.state.displayType
        restoredArray.push(dic)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(restoredArray))
      } else {
        var recentData = []
        var dic = this.state.type === 'ROOM' ? bodyRoom : body
        dic['p_type'] = this.state.displayType
        recentData.push(dic)
        AsyncStorage.setItem('recentSearchInfo', JSON.stringify(recentData))
      }
    })
    APICaller(
      Http.propertySearch,
      'POST',
      '',
      JSON.stringify(this.state.type === 'ROOM' ? bodyRoom : body)
    ).then((json) => {
      if (!json) return
      if (json.status === 200) {
        const { searchList } = this.state
        this.addEventTracking(
          this.state.locationString === ''
            ? 'kuala lumpur'
            : this.state.locationString
        )

        const NetCorePayload = {
          Area_of_property:
            this.state.locationString === ''
              ? 'kuala lumpur'
              : this.state.locationString
        }
        NetcoreSDK.track(NETCORE_TRACK_EVENT.SEARCH_FOR_AREA, NetCorePayload)
        analytics().logEvent(trackerEventSubmit.postProperty.action.search)
        logEvent(trackerEventSubmit.postProperty.action.search)
        if (json.data.empty) {
          this.setState({
            totalElements: 0,
            empty: json.data.empty,
            alert_message: 'No Properties found'
          })
          this.hideLoader()
          this._hideAlertView()
        } else {
          this.updateSearchListValue(json.data && json.data.content)
          this.setState({
            totalElements: json.data.totalElements,
            infoData: ''
          })
          if (this.state.displayMap === true) {
            this.setState({ viewType: 'map', displayMap: true })
          } else {
            this.setState({ viewType: 'search' })
          }
          this.hideLoader()
          this.displaySearchList()
        }
      } else {
        this.hideLoader()
        this.displayError()
      }
    })
  }

  getPropertiesFromLatLng = () => {
    // this.showLoader();

    if (!global.networkConnection) return

    // this.setState({ locationString: this.state.locationString });

    var body = {
      // "keywords": this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      sort: this.state.sorting,
      map: 1,
      latitude: this.state.currentLat,
      longitude: this.state.currentLng
    }

    const filterParam = this.state.filterParam

    if (filterParam != undefined && filterParam != null) {
      body['minPrice'] = filterParam.minPrice
      body['maxPrice'] = filterParam.maxPrice
    } else {
      if (this.state.displayType === 'BUY') {
        if (this.state.values[1] !== 5000000) {
          body['maxPrice'] = this.state.values[1]
        }
      } else {
        if (this.state.values[1] !== 6000) {
          body['maxPrice'] = this.state.values[1]
        }
      }
    }

    if (
      this.state.displayType === 'BUY' &&
      this.state.selectedTitleType !== ''
    ) {
      body['leaseType'] = this.state.selectedTitleType
    }

    // if (this.state.lableId !== '') {
    //   body['landmarkLabelId'] = this.state.lableId;
    // }

    if (
      this.state.isSelectHighrise === true &&
      this.state.isSelectLand === true
    ) {
      body['types'] = ['HIGHRISE', 'LANDED']
    } else {
      if (this.state.type !== '') {
        body['type'] = this.state.type
      } else {
        if (this.state.displayType === 'BUY' && this.state.type === '') {
          body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
        }
      }
    }

    if (this.state.furnishType !== '') {
      body['furnishType'] = this.state.furnishType
    }

    if (this.state.carpark !== 0) {
      body['carpark'] = this.state.carpark
    }
    if (this.state.bedroom !== 0) {
      body['bedroom'] = this.state.bedroom
    }
    if (this.state.bathroom !== 0) {
      body['bathroom'] = this.state.bathroom
    }

    var bodyRoom = {
      // "keywords": this.state.locationString === '' ? 'kuala lumpur' : this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      allRaces: this.state.allRaces,
      instantView: this.state.instantView,
      petFriendly: this.state.petFriendly,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      sort: this.state.sorting,
      map: 1,
      latitude: this.state.currentLat,
      longitude: this.state.currentLng
    }

    if (filterParam != undefined && filterParam != null) {
      body['minPrice'] = filterParam.minPrice
      body['maxPrice'] = filterParam.maxPrice
    } else {
      if (this.state.displayType === 'BUY') {
        if (this.state.values[1] !== 5000000) {
          bodyRoom['maxPrice'] = this.state.values[1]
        }
      } else {
        if (this.state.values[1] !== 6000) {
          bodyRoom['maxPrice'] = this.state.values[1]
        }
      }
    }

    // if (this.state.lableId !== '') {
    //   bodyRoom['landmarkLabelId'] = this.state.lableId;
    // }

    if (this.state.type !== '') {
      bodyRoom['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        bodyRoom['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
    }

    if (this.state.furnishType !== '') {
      bodyRoom['furnishType'] = this.state.furnishType
    }

    if (this.state.carpark !== 0) {
      bodyRoom['carpark'] = this.state.carpark
    }
    if (this.state.bathroomTypeSelection !== '') {
      bodyRoom['bathroomType'] = this.state.bathroomTypeSelection
    }
    if (this.state.roomTypeSelection !== '') {
      bodyRoom['roomType'] = this.state.roomTypeSelection
    }

    APICaller(
      Http.propertySearch,
      'POST',
      '',
      JSON.stringify(this.state.type === 'ROOM' ? bodyRoom : body)
    ).then((json) => {
      if (!json) return
      if (json.status === 200) {
        const { mapSearchList } = this.state
        this.addEventTracking(this.state.locationString)
        const NetCorePayload = {
          Area_of_property:
            this.state.locationString === ''
              ? 'kuala lumpur'
              : this.state.locationString
        }
        NetcoreSDK.track(NETCORE_TRACK_EVENT.SEARCH_FOR_AREA, NetCorePayload)

        analytics().logEvent(trackerEventSubmit.postProperty.action.search)
        logEvent(trackerEventSubmit.postProperty.action.search)
        if (json.data.empty) {
          this.setState({
            alert_message: 'No Properties found'
          })
          this._hideAlertView()
        } else {
          this.setState({ mapSearchList: json.data.content }, () => {
            mapSearchList != ''
              ? this.setState({
                latitude: mapSearchList[0].latitude,
                longitude: mapSearchList[0].longitude
              })
              : null
          })
          if (this.state.displayMap === true) {
            this.setState({ viewType: 'map', displayMap: true })
          } else {
            this.setState({ viewType: 'search' })
          }
          if (this.state.tapOnMarker) {
            this.expandMapData()
          }
        }
      } else {
        this.hideLoader()
        this.displayError()
      }
    })
  }

  addEventTracking = (keyword) => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        attr: 'Search',
        id: keyword
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

  expandMapData() {
    this.setState({ tapOnMarker: true })
    const newArray = []
    this.state.mapSearchList &&
      this.state.mapSearchList.forEach((obj) => {
        if (this.state.displayType === 'BUY') {
          if (
            !newArray.some(
              (o) =>
                this.roundToTwo(o.latitude) === this.roundToTwo(obj.latitude) &&
                this.roundToTwo(o.longitude) === this.roundToTwo(obj.longitude)
            )
          ) {
            newArray.push({ ...obj })
          } else {
            const newObj = obj

            newObj.latitude = obj.latitude + 0.1 / 2000
            newObj.longitude = obj.longitude + 0.1 / 2000

            this.updateLatLngForBuy(newArray, newObj)
          }
        } else {
          if (
            !newArray.some(
              (o) =>
                o.latitude === obj.latitude && o.longitude === obj.longitude
            )
          ) {
            newArray.push({ ...obj })
          } else {
            const newObj = obj

            newObj.latitude = obj.latitude + 0.1 / 2000
            newObj.longitude = obj.longitude + 0.1 / 2000

            this.updateLatLng(newArray, newObj)
          }
        }
      })

    if (newArray.length === this.state.mapSearchList.length) {
      this.setState({ mapSearchList: newArray })
    }
  }

  roundToTwo(num) {
    return +(Math.round(num + 'e+4') + 'e-4')
  }

  updateLatLngForBuy(newArray, value) {
    newArray &&
      newArray.forEach((obj) => {
        if (
          this.roundToTwo(obj.latitude) === this.roundToTwo(value.latitude) &&
          this.roundToTwo(obj.longitude) === this.roundToTwo(value.longitude)
        ) {
          var newObj = value

          newObj.latitude = value.latitude + 0.1 / 3000
          newObj.longitude = value.longitude + 0.1 / 3000

          this.updateLatLngForBuy(newArray, newObj)
          if (newArray.length === this.state.mapSearchList.length) {
            return
          }
        } else {
          if (obj === newArray[newArray.length - 1]) {
            newArray.push({ ...value })
            return
          }
        }
      })
  }

  updateLatLng(newArray, value) {
    newArray &&
      newArray.forEach((obj) => {
        if (
          obj.latitude === value.latitude &&
          obj.longitude === value.longitude
        ) {
          var newObj = value

          newObj.latitude = value.latitude + 0.1 / 2000
          newObj.longitude = value.longitude + 0.1 / 2000

          this.updateLatLng(newArray, newObj)
          if (newArray.length === this.state.mapSearchList.length) {
            return
          }
        } else {
          if (obj === newArray[newArray.length - 1]) {
            newArray.push({ ...value })
            return
          }
        }
      })
  }

  displayItemOrFilterView() {
    if (this.state.filterViewOn == true) {
      this.setState({ filterViewOn: false })
    } else {
      this.setState({ filterViewOn: true })
    }
  }

  displayMapView() {
    if (this.state.mapViewOn == true) {
      this.setState({ mapViewOn: false })
    } else {
      this.setState({ mapViewOn: true })
    }
  }

  // selectButton(selectVal) {
  //   this.setState({ housingType: housingType });
  // }

  renderHousingType = () => {
    const { housingType } = this.state
    return _.map(housingType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            if (housingType[id].value === 'ROOM') {
              for (let index = 0; index < housingType.length; index++) {
                const elementOld = housingType[index]

                if (elementOld.id === id) {
                  housingType[elementOld.id].isSelected =
                    isSelected === true ? false : true
                } else {
                  housingType[elementOld.id].isSelected = false
                }
              }

              this.setState({ type: '' })
              this.setState({ isSelectLand: false })
              this.setState({ isSelectHighrise: false })

              for (let index = 0; index < housingType.length; index++) {
                const element = housingType[index]
                if (element.isSelected === true) {
                  this.setState({ type: element.value })
                }
              }
            } else {
              for (let index = 0; index < housingType.length; index++) {
                const elementOld = housingType[index]

                if (elementOld.value === 'ROOM') {
                  housingType[elementOld.id].isSelected = false
                }
              }

              housingType[id].isSelected = isSelected === true ? false : true

              this.setState({ type: '' })
              this.setState({ isSelectLand: false })
              this.setState({ isSelectHighrise: false })

              for (let index = 0; index < housingType.length; index++) {
                const element = housingType[index]
                if (element.isSelected === true) {
                  this.setState({ type: element.value })
                  if (element.value === 'LANDED') {
                    this.setState({ isSelectLand: true })
                  }
                  if (element.value === 'HIGHRISE') {
                    this.setState({ isSelectHighrise: true })
                  }
                }
              }
            }

            this.setState({ housingType })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListNameBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderHousingBuyType = () => {
    const { housingBuyType } = this.state
    return _.map(housingBuyType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < housingBuyType.length; index++) {
              const elementOld = housingBuyType[index]

              if (elementOld.id === id) {
                housingBuyType[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                housingBuyType[elementOld.id].isSelected = false
              }
            }

            this.setState({ type: '' })
            this.setState({ isSelectLand: false })
            this.setState({ isSelectHighrise: false })

            for (let index = 0; index < housingBuyType.length; index++) {
              const element = housingBuyType[index]
              if (element.isSelected === true) {
                this.setState({ type: element.value })
              }
            }

            // housingType[id].isSelected = isSelected === true ? false : true;
            this.setState({ housingBuyType })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListHuseTypeBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  displayRecentSearchList = (key) => {
    return key.p_type == this.state.displayType ? (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={[styles.listStyle, { height: 40 }]}
          onPress={() => {
            this.setState({ searchNameList: '' }),
              this.searchToogleModel(!this.state.searchModelVisible),
              this.setState({ filterParam: key }, () => {
                // this.searchAutoCompleteProperty(key.keywords)
                this.setState({ locationString: key.keywords }, () => {
                  if (this.state.displayType === 'BUY') {
                    this.changeSortTypeStateValue(true, 1)
                  } else {
                    this.changeSortTypeStateValue(true, 0)
                  }
                })
              })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListKeywordBtn'
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
                        ? `${priceFormat(key.minPrice)} - ${key.maxPrice === '6000'
                          ? `${priceFormat(key.maxPrice)}+ RM`
                          : `${priceFormat(key.maxPrice)} RM`
                        } `
                        : `${priceFormat(key.minPrice)} - ${key.maxPrice === '6000'
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
                        ? `${this.getUnitRange(key.minPrice)} - ${key.maxPrice === '5000000'
                          ? `${this.getUnitRange(key.maxPrice)}+ RM`
                          : `${this.getUnitRange(key.maxPrice)} RM`
                        }`
                        : `${this.getUnitRange(key.minPrice)} - ${key.maxPrice === '5000000'
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
                        ? `${priceFormat(key.minPrice)} - ${key.maxPrice === '6000'
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
                        : `${this.getUnitRange(key.minPrice)} - ${key.maxPrice === '5000000'
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

  renderTitleType = () => {
    const { titleType } = this.state
    return _.map(titleType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < titleType.length; index++) {
              const elementOld = titleType[index]

              if (elementOld.id === id) {
                titleType[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                titleType[elementOld.id].isSelected = false
              }
            }

            this.setState({ selectedTitleType: '' })

            for (let index = 0; index < titleType.length; index++) {
              const element = titleType[index]
              if (element.isSelected === true) {
                this.setState({ selectedTitleType: element.value })
              }
            }

            // housingType[id].isSelected = isSelected === true ? false : true;
            this.setState({ titleType })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListHousingTypeBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderHousingFurnitureType = () => {
    const { housingTypeFurniture } = this.state
    return _.map(housingTypeFurniture, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < housingTypeFurniture.length; index++) {
              const elementOld = housingTypeFurniture[index]

              if (elementOld.id === id) {
                housingTypeFurniture[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                housingTypeFurniture[elementOld.id].isSelected = false
              }
            }

            this.setState({ furnishType: '' })

            for (let index = 0; index < housingTypeFurniture.length; index++) {
              const element = housingTypeFurniture[index]
              if (element.isSelected === true) {
                this.setState({ furnishType: element.value })
              }
            }

            this.setState({ housingTypeFurniture })
          }}
          style={{ marginBottom: 5 }}
          accessible={true}
          accessibilityLabel='keywordSearchListFurnType'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderNumberOfRooms = () => {
    const { numberOfRooms } = this.state
    return _.map(numberOfRooms, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < numberOfRooms.length; index++) {
              const elementOld = numberOfRooms[index]

              if (elementOld.id === id) {
                numberOfRooms[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                numberOfRooms[elementOld.id].isSelected = false
              }
            }

            this.setState({ bedroom: null })

            for (let index = 0; index < numberOfRooms.length; index++) {
              const element = numberOfRooms[index]
              if (element.isSelected === true) {
                this.setState({ bedroom: element.value })
              }
            }

            // numberOfRooms[id].isSelected = isSelected === true ? false : true;
            this.setState({ numberOfRooms })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListBedBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderNumberOfBathrooms = () => {
    const { numberOfBathrooms } = this.state
    return _.map(numberOfBathrooms, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < numberOfBathrooms.length; index++) {
              const elementOld = numberOfBathrooms[index]

              if (elementOld.id === id) {
                numberOfBathrooms[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                numberOfBathrooms[elementOld.id].isSelected = false
              }
            }

            this.setState({ bathroom: 0 })

            for (let index = 0; index < numberOfBathrooms.length; index++) {
              const element = numberOfBathrooms[index]
              if (element.isSelected === true) {
                this.setState({ bathroom: element.value })
              }
            }

            // numberOfBathrooms[id].isSelected = isSelected === true ? false : true;
            this.setState({ numberOfBathrooms })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListBathBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderNumberOfParkings = () => {
    const { numberOfParking } = this.state
    return _.map(numberOfParking, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < numberOfParking.length; index++) {
              const elementOld = numberOfParking[index]

              if (elementOld.id === id) {
                numberOfParking[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                numberOfParking[elementOld.id].isSelected = false
              }
            }

            this.setState({ carpark: 0 })

            for (let index = 0; index < numberOfParking.length; index++) {
              const element = numberOfParking[index]
              if (element.isSelected === true) {
                this.setState({ carpark: element.value })
              }
            }

            this.setState({ numberOfParking })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListParkBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderNumberOfExtraInfo = () => {
    const { extraInfo, extraInfoBuy } = this.state
    if (this.state.displayType === 'RENT') {
      return _.map(extraInfo, ({ id, name, isSelected }, key) => {
        return (
          <TouchableOpacity
            key={id}
            onPress={() => {
              for (let index = 0; index < extraInfo.length; index++) {
                const elementOld = extraInfo[index]

                if (elementOld.id === id) {
                  extraInfo[elementOld.id].isSelected =
                    isSelected === true ? false : true
                } else {
                  extraInfo[elementOld.id].isSelected = false
                }
              }
              for (let index = 0; index < extraInfo.length; index++) {
                const element = extraInfo[index]
                const key = element.value
                if (key == 'nearLrt') {
                  this.setState({ nearLrt: element.isSelected })
                } else if (key == 'allRaces') {
                  this.setState({ allRaces: element.isSelected })
                } else if (key == 'petFriendly') {
                  this.setState({ petFriendly: element.isSelected })
                } else {
                  this.setState({ instantView: element.isSelected })
                }
              }
              this.setState({ extraInfo: extraInfo })
            }}
            accessible={true}
            accessibilityLabel='keywordSearchListExtraInfoBtn'
          >
            <View
              style={
                isSelected
                  ? [
                    styles.textStyleHousingType,
                    {
                      backgroundColor: '#4885ED',
                      marginRight: 5,
                      marginBottom: 5
                    }
                  ]
                  : [
                    styles.textStyleHousingType,
                    { marginRight: 5, marginBottom: 5 }
                  ]
              }
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: isSelected ? 'white' : 'black'
                }}
              >
                {name}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })
    } else {
      return _.map(extraInfoBuy, ({ id, name, isSelected }, key) => {
        return (
          <TouchableOpacity
            key={id}
            onPress={() => {
              for (let index = 0; index < extraInfoBuy.length; index++) {
                const elementOld = extraInfoBuy[index]
                if (elementOld.id === id) {
                  extraInfoBuy[elementOld.id].isSelected =
                    isSelected === true ? false : true
                } else {
                  extraInfoBuy[elementOld.id].isSelected = false
                }
              }
              for (let index = 0; index < extraInfoBuy.length; index++) {
                const element = extraInfoBuy[index]
                const key = element.value
                if (key == 'nearLrt') {
                  this.setState({ nearLrt: element.isSelected })
                } else {
                  this.setState({ allRaces: element.isSelected })
                }
              }
              this.setState({ petFriendly: false })
              this.setState({ instantView: false })
              this.setState({ extraInfoBuy: extraInfoBuy })
            }}
            accessible={true}
            accessibilityLabel='keywordSearchListNearLtrBtn'
          >
            <View
              style={
                isSelected
                  ? [
                    styles.textStyleHousingType,
                    {
                      backgroundColor: '#4885ED',
                      marginRight: 5,
                      marginBottom: 5
                    }
                  ]
                  : [
                    styles.textStyleHousingType,
                    { marginRight: 5, marginBottom: 5 }
                  ]
              }
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: isSelected ? 'white' : 'black'
                }}
              >
                {name}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })
    }
  }

  renderRoomType = () => {
    const { roomType } = this.state
    return _.map(roomType, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < roomType.length; index++) {
              const elementOld = roomType[index]

              if (elementOld.id === id) {
                roomType[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                roomType[elementOld.id].isSelected = false
              }
            }

            this.setState({ roomTypeSelection: '' })

            for (let index = 0; index < roomType.length; index++) {
              const element = roomType[index]
              if (element.isSelected === true) {
                this.setState({ roomTypeSelection: element.value })
              }
            }

            // housingTypeFurniture[id].isSelected = isSelected === true ? false : true;
            this.setState({ roomType })
          }}
          style={{ marginBottom: 5 }}
          accessible={true}
          accessibilityLabel='keywordSearchListRoomBtn'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  renderBathroomType = () => {
    const { bathroomType } = this.state
    return _.map(bathroomType, ({ id, name, isSelected }, key) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            for (let index = 0; index < bathroomType.length; index++) {
              const elementOld = bathroomType[index]

              if (elementOld.id === id) {
                bathroomType[elementOld.id].isSelected =
                  isSelected === true ? false : true
              } else {
                bathroomType[elementOld.id].isSelected = false
              }
            }

            this.setState({ bathroomTypeSelection: '' })

            for (let index = 0; index < bathroomType.length; index++) {
              const element = bathroomType[index]
              if (element.isSelected === true) {
                this.setState({ bathroomTypeSelection: element.value })
              }
            }

            // housingTypeFurniture[id].isSelected = isSelected === true ? false : true;
            this.setState({ bathroomType })
          }}
          style={{ marginBottom: 5 }}
          accessible={true}
          accessibilityLabel='keywordSearchListBathBtn2'
        >
          <View
            style={
              isSelected
                ? [
                  styles.textStyleHousingType,
                  { backgroundColor: '#4885ED', marginRight: 5 }
                ]
                : [styles.textStyleHousingType, { marginRight: 5 }]
            }
          >
            <Text
              style={{
                textAlign: 'center',
                color: isSelected ? 'white' : 'black'
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
  }

  resetFilter() {
    // const arr = (this.state.displayType === 'RENT') ? this.state.extraInfo : this.state.extraInfoBuy;

    const housingType = this.state.housingType
    const titleType = this.state.titleType
    const housingBuyType = this.state.housingBuyType
    const housingTypeFurniture = this.state.housingTypeFurniture
    const numberOfRooms = this.state.numberOfRooms
    const numberOfBathrooms = this.state.numberOfBathrooms
    const numberOfParking = this.state.numberOfParking
    const extraInfo = this.state.extraInfo

    const roomType = this.state.roomType
    const bathroomType = this.state.bathroomType

    const { extraInfoBuy } = this.state

    this.resetSlider()

    this.setState(
      { rentalPeriodTime: '12', rentalPeriodValue: 0 },
      function () {
        const arrRentalPeriod = this.state.rentalPeriodTimeData.map(
          (val, index) => {
            if (val.label.toLowerCase() === this.state.rentalPeriodTime) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          }
        )
        this.setState({
          rentalPeriodTimeData: arrRentalPeriod
        })
      }
    )

    for (let index = 0; index < titleType.length; index++) {
      const element = titleType[index]
      titleType[element.id].isSelected = false
      this.setState({ selectedTitleType: '' })
    }
    this.setState({ titleType: titleType })

    for (let index = 0; index < roomType.length; index++) {
      const element = roomType[index]
      roomType[element.id].isSelected = false
      this.setState({ roomTypeSelection: '' })
    }
    this.setState({ roomType: roomType })

    for (let index = 0; index < bathroomType.length; index++) {
      const element = bathroomType[index]
      bathroomType[element.id].isSelected = false
      this.setState({ bathroomTypeSelection: '' })
    }
    this.setState({ bathroomType: bathroomType })

    if (this.state.displayType === 'BUY') {
      for (let index = 0; index < housingBuyType.length; index++) {
        const element = housingBuyType[index]
        if (element.name === 'All') {
          housingBuyType[element.id].isSelected = true
        } else {
          housingBuyType[element.id].isSelected = false
        }

        this.setState({ type: '' })
        this.setState({ isSelectLand: false })
        this.setState({ isSelectHighrise: false })
      }
      this.setState({ housingBuyType: housingBuyType })
    } else {
      for (let index = 0; index < housingType.length; index++) {
        const element = housingType[index]
        if (element.name === 'All') {
          housingType[element.id].isSelected = true
        } else {
          housingType[element.id].isSelected = false
        }

        this.setState({ type: '' })
        this.setState({ isSelectLand: false })
        this.setState({ isSelectHighrise: false })
      }
      this.setState({ housingType: housingType })
    }

    for (let index = 0; index < housingTypeFurniture.length; index++) {
      const element = housingTypeFurniture[index]
      housingTypeFurniture[element.id].isSelected = false
      this.setState({ furnishType: '' })
    }

    this.setState({ housingTypeFurniture: housingTypeFurniture })

    for (let index = 0; index < numberOfRooms.length; index++) {
      const element = numberOfRooms[index]
      numberOfRooms[element.id].isSelected = false
      this.setState({ bedroom: null })
    }

    this.setState({ numberOfRooms: numberOfRooms })

    for (let index = 0; index < numberOfBathrooms.length; index++) {
      const element = numberOfBathrooms[index]
      numberOfBathrooms[element.id].isSelected = false
      this.setState({ bathroom: 0 })
    }

    this.setState({ numberOfBathrooms: numberOfBathrooms })

    for (let index = 0; index < numberOfParking.length; index++) {
      const element = numberOfParking[index]
      numberOfParking[element.id].isSelected = false
      this.setState({ carpark: 0 })
    }

    this.setState({ numberOfParking: numberOfParking })

    if (this.state.displayType === 'RENT') {
      for (let index = 0; index < extraInfo.length; index++) {
        const element = extraInfo[index]
        extraInfo[element.id].isSelected = false
        // this.setState({ nearLrt: false });
        const key = extraInfo[element.id].value
        if (key == 'nearLrt') {
          this.setState({ nearLrt: false })
        } else if (key == 'allRaces') {
          this.setState({ allRaces: false })
        } else if (key == 'petFriendly') {
          this.setState({ petFriendly: false })
        } else {
          this.setState({ instantView: false })
        }
      }
      this.setState({ extraInfo: extraInfo })
    } else {
      for (let index = 0; index < extraInfoBuy.length; index++) {
        const element = extraInfoBuy[index]
        extraInfoBuy[element.id].isSelected = false
        // this.setState({ nearLrt: false });
        const key = extraInfoBuy[element.id].value
        if (key == 'nearLrt') {
          this.setState({ nearLrt: false })
        } else this.setState({ allRaces: false })
      }
      this.setState({ petFriendly: false })
      this.setState({ instantView: false })
      this.setState({ extraInfoBuy: extraInfoBuy })
    }
  }

  typeToggleModal(visible) {
    this.setState({ typeModalVisible: visible })
  }

  searchToogleModel(visible) {
    this.setState({ searchModelVisible: visible }, () => {
      setTimeout(() => this.showSearchResult(visible), 1000)
    })
  }

  showSearchResult = (visible) => {
    AsyncStorage.getItem('recentSearchInfo').then((res) => {
      const restoredArray = JSON.parse(res)
      this.setState({
        restoredArray: restoredArray !== null ? restoredArray.reverse() : []
      })
    })

    if (this.state.searchModelVisible === true) {
      this.refs && this.refs.PasswordInput && this.refs.PasswordInput.focus()
      this.setState({ searchModelVisible: visible }, () => {
        this.getAutoCompleteList(this.state.searchString)
      })
    }
  }

  _renderPropertyType = () => {
    const { sortingPropertyType } = this.state
    return _.map(sortingPropertyType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          style={{ width: '100%' }}
          onPress={() => {
            for (let index = 0; index < sortingPropertyType.length; index++) {
              if (sortingPropertyType[index].id === id) {
                sortingPropertyType[index].isSelected = true
                // AsyncStorage.setItem('displayType', sortingPropertyType[index].value);
              } else {
                sortingPropertyType[index].isSelected = false
              }
            }
            this.setState({ sortingPropertyType })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListPropType'
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

  // resetType() {
  //   AsyncStorage.getItem("displayType").then(res => {
  //     if (res === "" || res === null) {
  //       this.setState({ displayType: this.state.displayType });
  //       AsyncStorage.setItem('displayType', 'RENT');
  //       this.searchProperty();
  //     } else {
  //       this.setState({ displayType: res });
  //       this.state.sortingPropertyType.map((item, index) => {
  //         if (item.value.toLowerCase() === res.toLowerCase()) {
  //           this.changeSortTypeStateValue(true, index);
  //         }
  //         else {
  //           this.changeSortTypeStateValue(false, index);
  //         }
  //       })
  //       this.searchProperty();
  //     }
  //   });
  // }

  displaySearchList = (key) => {
    if (!key) {
      return
    }

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
        {key && (
          <PropertyCard
            data={key}
            price={this.format(key.price)}
            isBoost={isBoost}
            roomType={roomType}
            showMap={true}
            onPress={() => {
              this.props.navigation.navigate('ListingPageDetail', {
                propertyInfo: key,
                rentalPeriod: this.state.rentalPeriodTime,
                rentalPeriodValue: this.state.rentalPeriodValue
              })
            }}
            onMapPress={() => {
              this.setState(
                { latitude: key.latitude, longitude: key.longitude },
                () => this.setState({ viewType: 'map', displayMap: true })
              )
            }}
          />
        )}
      </View>
    )
  }

  calculatePrice(price) {
    const finalPrice =
      this.state.rentalPeriodTime == 12
        ? parseInt((price / 12) * parseInt(this.state.rentalPeriodTime))
        : price + parseInt(price * this.state.rentalPeriodValue) / 100
    return finalPrice
  }

  displayPorpertyType(type) {
    if (type.toLowerCase() === 'landed_sale') {
      return 'Landed-sale'
    } else if (type.toLowerCase() === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return type.toLowerCase()
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

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }

  handleLoadMore = () => {
    if (!this.state.allowAPICalls) {
      return
    }

    this.setState(
      {
        page: this.state.page + 1,
        allowAPICalls: false
      },
      () => {
        if (this.state.apiCallFor === 'keyword') {
          this.getSearchHomeList()
        } else if (this.state.apiCallFor === 'sort') {
          this.getFilterSearchList()
        } else if (this.state.apiCallFor === 'filter') {
          this.getFilterSearchList()
        } else if (this.state.apiCallFor === 'autocompleteproperty') {
          this.getAutoCompletePropertyList(
            this.state.autoCompleteLocationString
          )
        }
      }
    )
  }

  multiSliderValuesChange = (values) => {
    this.setState({ filterParam: null })
    if (this.state.displayType === 'RENT') {
      if (values[1] - values[0] < 50) {
        let newArr = Array(values[0], values[1] + 49)
        this.setState({ values: newArr })
      } else {
        this.setState({
          values
        })
      }
    } else {
      this.setState({
        values
      })
    }
  }

  resetSlider() {
    if (this.state.displayType === 'BUY') {
      this.setState({ values: [0, 5000000] })
    } else {
      this.setState({ values: [0, 6000] })
    }
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

  format(amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
  changeOption = (data, stateName, option) => {
    this.setState({
      [stateName]: option.label
    })

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
  renderRentalPeriod() {
    return (
      <View style={styles.formInputGroup}>
        <Text style={[styles.TextStyleHeaderFilter, { marginTop: 5 }]}>
          {' '}
          Rental Period{' '}
        </Text>
        <ModalSelector
          cancelText='Cancel'
          data={this.state.rentalPeriodTimeData}
          initValue=''
          onChange={(option) => {
            this.setState({ rentalPeriodValue: option.value }, () => {
              this.changeOption(
                this.state.rentalPeriodTimeData,
                'rentalPeriodTime',
                option
              )
            })
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
            accessibilityLabel='keywordSearchListRentalPeriodBtn'
          >
            <Text style={{ marginLeft: 5 }}>{this.state.rentalPeriodTime}</Text>
            <Icon name='keyboard-arrow-down' />
          </TouchableOpacity>
        </ModalSelector>
      </View>
    )
  }

  mainFilterView() {
    return (
      <View>
        <ScrollView>
          <View style={{ paddingBottom: 90 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#FFE100',
                height: 40,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  textAlign: 'left',
                  paddingLeft: 15,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#000000'
                }}
              >
                Filter
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.renderConditionalView(
                    this.setState({ viewType: 'search' })
                  )
                }
                style={{ paddingRight: 15 }}
                accessible={true}
                accessibilityLabel='keywordSearchListFilterClearBtn'
              >
                <Icon name='clear' size={25} style={{ color: '#000' }} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 15
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginTop: 20,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[styles.TextStyleHeaderFilter, { paddingBottom: 0 }]}
                >
                  Price (RM)
                </Text>
                {this.state.displayType === 'RENT' ? (
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontSize: 14,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Light',
                      color: '#000'
                    }}
                  >
                    {priceFormat(this.state.values[0])} -{' '}
                    {this.state.values[1] === this.state.maxPrice
                      ? `${priceFormat(this.state.values[1])}+`
                      : `${priceFormat(this.state.values[1])}`}
                  </Text>
                ) : (
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 10,
                        fontSize: 14,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Light',
                        color: '#000'
                      }}
                    >
                      {this.getUnitRange(this.state.values[0])} -{' '}
                      {this.state.values[1] === this.state.maxPrice
                        ? `${this.getUnitRange(this.state.values[1])}+`
                        : this.getUnitRange(this.state.values[1])}
                    </Text>
                  )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10
                }}
              >
                <MultiSlider
                  ref={(ref) => (this.modalRef = ref)}
                  allowOverlap={false}
                  minMarkerOverlapDistance={100}
                  style={{ width: width }}
                  values={[this.state.values[0], this.state.values[1]]}
                  sliderLength={width - Matrics.ScaleValue(70)}
                  onValuesChange={this.multiSliderValuesChange}
                  min={0}
                  max={this.state.displayType === 'BUY' ? 5000000 : 6000}
                  step={this.state.displayType === 'BUY' ? 10000 : 1}
                  markerStyle={
                    Platform.OS == 'android' ? { height: 25, width: 25 } : {}
                  }
                />
              </View>
              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 10 }]}>
                Housing Type
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.state.displayType === 'BUY'
                  ? this.renderHousingBuyType()
                  : this.renderHousingType()}
              </View>
              {this.state.displayType === 'BUY' ? (
                <View>
                  <Text
                    style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}
                  >
                    Title Type
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {this.renderTitleType()}
                  </View>
                </View>
              ) : (
                  <View />
                )}
              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}>
                Furnish Level
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 5,
                  flex: 1,
                  flexWrap: 'wrap'
                }}
              >
                {this.renderHousingFurnitureType()}
              </View>

              {/* {this.state.displayType.toLocaleLowerCase() === 'rent' &&
                this.renderRentalPeriod()} */}

              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 15 }]}>
                {' '}
                {this.state.type === 'ROOM'
                  ? 'Room Type'
                  : 'Number of rooms'}{' '}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.state.type === 'ROOM'
                  ? this.renderRoomType()
                  : this.renderNumberOfRooms()}
              </View>
              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}>
                {this.state.type === 'ROOM'
                  ? 'Bathroom Type'
                  : 'Number of bathrooms'}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.state.type === 'ROOM'
                  ? this.renderBathroomType()
                  : this.renderNumberOfBathrooms()}
              </View>
              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}>
                Number of car parks
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {this.renderNumberOfParkings()}
              </View>
              <Text style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}>
                Extra Information
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.renderNumberOfExtraInfo()}
              </View>
            </View>
          </View>
        </ScrollView>
        {this.state.alert_message !== '' &&
          this.AlertView(this.state.alert_message)}
        <View style={styles.bottomBarView}>
          <View style={styles.separatorLineStyle} />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', height: 80 }}
          >
            <View style={styles.HeaderStyle}>
              <TouchableOpacity
                style={{ marginRight: 5, width: '80%' }}
                onPress={() => {
                  this.setState({ filterParam: null })
                  this.resetFilter()
                }}
                accessible={true}
                accessibilityLabel='keywordSearchListResetFilterBtn'
              >
                <Text
                  style={[styles.textStyleHousingType, { textAlign: 'center' }]}
                >
                  Reset Filter
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.HeaderStyle}>
              <TouchableOpacity
                style={{ marginRight: 5, width: '80%' }}
                onPress={() => {
                  this.searchProperty()
                }}
                accessible={true}
                accessibilityLabel='keywordSearchListFilterNowBtn'
              >
                <View
                  style={[
                    styles.textStyleHousingType,
                    { backgroundColor: '#FFE100' }
                  ]}
                >
                  <Text style={{ textAlign: 'center' }}>Filter Now</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _hideAlertView() {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '100%',
        height: 70,
        bottom: '10%',
        zIndex: 1,
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

  newDataProvider = () => {
    return new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([])
  }

  searchProperty = () => {
    this.setState({ page: 0 }, () => {
      this.setState(
        {
          searchList: '',
          conversationList: this.newDataProvider(),
          mapSearchList: ''
        },
        () => this.getFilterSearchList()
      )
    })
  }

  _displayInfo() {
    if (this.state.infoData !== '') {
      let roomType = getRoomTypeLabel(
        this.state.infoData && this.state.infoData.roomType != undefined
          ? this.state.infoData.roomType
          : ''
      )
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('ListingPageDetail', {
              propertyInfo: this.state.infoData,
              rentalPeriod: this.state.rentalPeriodTime,
              rentalPeriodValue: this.state.rentalPeriodValue
            })
          }}
          style={{
            backgroundColor: 'white',
            height: '25%',
            alignItems: 'center',
            flexDirection: 'row'
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListDispInfoBtn'
        >
          <ProgressiveImage
            testID='infoData'
            source={{
              uri:
                this.state.infoData &&
                  this.state.infoData.images &&
                  this.state.infoData.images.length > 0
                  ? this.state.infoData.images[0].url
                  : No_IMAGE_LINK
            }}
            style={{
              height: '90%',
              width: 100,
              marginLeft: 10,
              backgroundColor: '#cccccc',
              borderRadius: 5
            }}
          />

          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text
                numberOfLines={2}
                ellipsizeMode={'tail'}
                style={{
                  flex: 1,
                  fontSize: 14,
                  textAlign: 'left',
                  paddingLeft: 10,
                  paddingTop: 5,
                  fontWeight: '500',
                  color: '#000'
                }}
              >
                {this.state.infoData.name}
              </Text>
              <TouchableOpacity
                style={{ paddingRight: 15 }}
                onPress={() => {
                  this.setState({ infoData: '', selectedMapIndex: '' })
                }}
                accessible={true}
                accessibilityLabel='keywordSearchListInfoImageClearIconBtn'
              >
                <Icon name='clear' size={25} style={{ color: '#000' }} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                textAlign: 'left',
                fontWeight: '500',
                paddingLeft: 10,
                color: 'red'
              }}
            >
              RM{' '}
              {this.format(
                this.state.displayType.toLocaleLowerCase() === 'rent'
                  ? this.calculatePrice(this.state.infoData.price)
                  : this.state.infoData.price
              )}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.state.infoData != undefined &&
                this.state.infoData.noDeposit === true &&
                this.state.infoData.type !== 'ROOM' ? (
                  <Image
                    testID='noDeposit'
                    source={imgNoDeposit}
                    style={{ height: 50, width: 50 }}
                  />
                ) : (
                  <View />
                )}
              {this.state.infoData &&
                this.state.infoData.videos &&
                this.state.infoData.videos.length > 0 ? (
                  <Image
                    testID='contactLess'
                    source={imgContactLess}
                    style={{ height: 40, width: 40, margin: 10 }}
                  />
                ) : (
                  <View />
                )}
            </View>

            <View
              style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}
            >
              <Text
                style={{
                  fontSize: 10,
                  textAlign: 'left',
                  fontFamily: 'OpenSans-Light',
                  color: '#000'
                }}
              >
                {roomType !== ''
                  ? roomType
                  : `${this.state.infoData.sqft} sqft`}{' '}
                |
              </Text>
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
                  this.displayPorpertyType(this.state.infoData.type)
                )}{' '}
                |
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  textAlign: 'left',
                  fontFamily: 'OpenSans-Light',
                  color: '#000'
                }}
              >
                {' '}
                {this._displayFurnishType(this.state.infoData.furnishType)}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                flexDirection: 'row',
                paddingTop: 5
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text
                  style={{ fontSize: 14, textAlign: 'left', color: '#000' }}
                >
                  {this.state.infoData.bedroom}
                </Text>
                <Image
                  testID='bedroom'
                  source={img1}
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    paddingLeft: 10,
                    color: '#000'
                  }}
                >
                  {this.state.infoData.bathroomType !== null
                    ? this.Capitalize(
                      this.state.infoData.bathroomType.toLowerCase()
                    )
                    : this.state.infoData.bathroom}
                </Text>
                <Image
                  testID='bathroom'
                  source={img2}
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    paddingLeft: 10,
                    color: '#000'
                  }}
                >
                  {this.state.infoData.carpark}
                </Text>
                <Image
                  testID='carpark'
                  source={img3}
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  _onMarkerPress(markerData) {
    this.setState({ infoData: markerData }, () => {
      this.expandMapData()
      this._displayInfo()
      this.setState({ selectedMapIndex: this.state.infoData.id })
    })
  }

  mainMapView() {
    const { latitude, longitude } = this.state
    return (
      <Container>
        <View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {latitude != '' && longitude != '' ? (
              <MapView
                key={this.state.forceRefresh}
                ref={(mapView) => {
                  this._mapView = mapView
                }}
                style={{ height: height, width: width }}
                onMapReady={() => this.setState({ isMapReady: true })}
                initialRegion={{
                  latitude:
                    this.state.latitude === '' ? 3.139 : this.state.latitude,
                  longitude:
                    this.state.longitude === ''
                      ? 101.6869
                      : this.state.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                }}
                onPress={(e) => {
                  if (e.nativeEvent.action !== 'marker-press') {
                    this.setState({ infoData: '', selectedMapIndex: '' })
                  } else {
                  }
                }}
                onRegionChangeComplete={(region) => {
                  this.setState(
                    {
                      currentLat: region.latitude,
                      currentLng: region.longitude
                    },
                    () => this.getPropertiesFromLatLng()
                  )
                }}
              >
                {this.state.isMapReady == true &&
                  this.state.mapSearchList.length > 0
                  ? this.state.mapSearchList.map((marker) => (
                    <MapView.Marker
                      key={marker.id}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                      }}
                      title={marker.title}
                      onPress={this._onMarkerPress.bind(this, marker)}
                    >
                      <ProgressiveImageBackground
                        source={
                          this.state.selectedMapIndex === marker.id
                            ? selectedPin
                            : unSelectedPin
                        }
                        resizeMode='contain'
                        style={{
                          height: 30,
                          width: 80,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            marginTop: -5,
                            fontWeight: '500',
                            color:
                              this.state.selectedMapIndex === marker.id
                                ? '#81257F'
                                : '#39D196'
                          }}
                        >
                          RM{' '}
                          {this.getUnitRange(
                            this.state.displayType.toLocaleLowerCase() ===
                              'rent'
                              ? this.calculatePrice(marker.price)
                              : marker.price
                          )}
                        </Text>
                      </ProgressiveImageBackground>
                    </MapView.Marker>
                  ))
                  : // <Marker
                  //   coordinate={{
                  //     latitude: 3.139,
                  //     longitude: 101.6869
                  //   }}
                  // />
                  null}
              </MapView>
            ) : null}
          </View>
        </View>

        {this._displayInfo()}
      </Container>
    )
  }

  _ViewPropertiesSlider() {
    if (this.state.infoData !== '') {
      var key = this.state.infoData

      let roomType = getRoomTypeLabel(
        key && key.roomType != undefined ? key.roomType : ''
      )

      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ListingPageDetail', {
                propertyInfo: key
              })
            }}
            accessible={true}
            accessibilityLabel='keywordSearchListPropSliderImageBtn'
          >
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                padding: 10,
                paddingBottom: 20
              }}
            >
              <View
                style={[
                  styles.styleItem,
                  { width: width, alignItems: 'center' }
                ]}
              >
                <ProgressiveImageBackground
                  source={{
                    uri:
                      key && key.images && key.images.length > 0
                        ? key.images[0].url
                        : No_IMAGE_LINK
                  }}
                  style={{
                    height: 180,
                    width: width * 0.7,
                    backgroundColor: '#cccccc'
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
                      {key && key.noDeposit === true && key.type !== 'ROOM' ? (
                        <Image
                          testID='noDeposit'
                          source={imgNoDeposit}
                          style={{ height: 50, width: 50 }}
                        />
                      ) : (
                          <View />
                        )}
                      {key && key.videos && key.videos.length > 0 ? (
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
                        styles.txtKmStyle,
                        {
                          marginTop:
                            key && key.noDeposit === true
                              ? key.type !== 'ROOM'
                                ? 0
                                : 10
                              : 10
                        }
                      ]}
                    >
                      {key != undefined && key.distance ? key.distance : ''} Km
                    </Text>
                  </View>
                  <View style={styles.styleInfo}>
                    <View
                      style={[
                        styles.styleInfo,
                        { backgroundColor: 'white', height: 90 }
                      ]}
                    >
                      <View style={{ flexDirection: 'column' }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            paddingLeft: 10,
                            marginTop: 5
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
                            paddingTop: 5
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
                            paddingTop: 7,
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
                              style={{ height: 15, width: 15, marginLeft: 10 }}
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
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              margin: 10,
              marginEnd: 20,
              position: 'absolute',
              alignSelf: 'flex-end'
            }}
            onPress={() => {
              this.setState({ infoData: '' })
            }}
            accessible={true}
            accessibilityLabel='keywordSearchListSliderClearIconBtn'
          >
            <Icon name='clear' size={25} style={{ color: '#000' }} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }

  renderConditionalView(viewName) {
    if (this.state.viewType === 'map') {
      return this.mainMapView()
    } else if (this.state.viewType === 'filter') {
      return this.mainFilterView()
    } else {
      return this.mianSearchView()
    }
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible })
  }

  _renderCountriesType = () => {
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

                this.setState({ sorting: sortingType[index].value })
              } else {
                sortingType[index].isSelected = false
              }
            }
            this.setState({ sortingType })
          }}
          accessible={true}
          accessibilityLabel='keywordSearchListCountriesBtn'
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

  mianSearchView() {
    return (
      <View style={{ height: '100%' }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {this.state.totalElements !== 0 || this.state.empty === true ? (
            <View
              style={[
                styles.styleTextFound,
                { paddingLeft: 40, paddingRight: 40 }
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#000'
                }}
              >
                {' '}
                {this.state.totalElements} results{' '}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'OpenSans-Light',
                  color: '#000'
                }}
              >
                in{' '}
                {this.state.searchString === ''
                  ? this.state.locationString
                  : this.state.searchString}
              </Text>
            </View>
          ) : (
              <View />
            )}

          {/* <FlatList
            style={{ paddingBottom: 20, marginTop: 10 }}
            data={this.state.searchList}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => (
              <View>
                {this.displaySearchList(item)}
              </View>
            )}
            removeClippedSubviews={true}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.mySeparator}
            onEndReachedThreshold={1}
            onEndReached={() => {
              if (this.state.searchList.length !== this.state.totalElements) {
                { this.handleLoadMore() }
              }
            }
            }
          /> */}

          {this.state.conversationList &&
            this.state.conversationList._data &&
            this.state.conversationList._data.length > 0 ? (
              <RecyclerListView
                ItemSeparatorComponent={this.FlatListItemSeparator}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1 }}
                dataProvider={this.state.conversationList}
                layoutProvider={this.state.layoutProvider}
                rowRenderer={this.rowRenderer}
                onEndReached={() => {
                  if (this.state.searchList.length !== this.state.totalElements) {
                    {
                      this.handleLoadMore()
                    }
                  }
                }}
                forceNonDeterministicRendering={true}
                onEndReachedThreshold={0.5}
              />
            ) : null}
        </View>
      </View>
    )
  }

  rowRenderer = (type, data, index) => {
    return <View style={{ flex: 1 }}>{this.displaySearchList(data)}</View>
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader() {
    return (
      <View style={{ paddingLeft: 15 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='keywordSearchListHeaderBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Back
            </Text>
          </View>
        </View>
      </View>
    )
  }

  displaySearchData() {
    return (
      <View style={{ flex: 1, width: width, position: 'absolute' }}>
        <FlatList
          style={{ backgroundColor: 'white', height: height * 0.7 }}
          data={this.state.searchNameList}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <View>{this.displayAutoCompleteList(item)}</View>
          )}
        />
      </View>
    )
  }

  searchAutoCompleteProperty = (locationString) => {
    this.setState({ page: 0 }, () => {
      this.setState(
        {
          searchList: '',
          conversationList: this.newDataProvider(),
          mapSearchList: ''
        },
        () => {
          this.setState(
            {
              page: 0,
              searchNameList: '',
              searchString: locationString,
              locationString: locationString,
              autoCompleteLocationString: locationString
            },
            () => {
              this.getAutoCompletePropertyList(locationString)
            }
          )
        }
      )
    })
  }

  _changeDisplayType = (type, index) => () => {
    this.setState(
      { displayType: type, displayMap: false, test: false },
      function () {
        this.setState({ typeModalVisible: false })
        AsyncStorage.setItem('displayType', type)
        this.changeSortTypeStateValue(true, index)
      }
    )
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Container>
          {this.state.viewType != 'filter' && (
            <View
              style={{
                top: -5,
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#FFE100'
              }}
            >
              {/* {this._viewHeader()} */}
              <View style={{ alignItems: 'center', height: 60 }}>
                <EditText
                  type={this.state.displayType}
                  onChangeType={() => {
                    this.typeToggleModal(!this.state.typeModalVisible)
                  }}
                  onBack={() => {
                    this._navigationBack()
                  }}
                  onSelect={() => {
                    this.searchToogleModel(true)
                  }}
                  value={
                    this.state.locationString.length > 0
                      ? this.state.locationString
                      : this.state.locationString
                  }
                  clearSearch={() => {
                    Keyboard.dismiss(),
                      this.setState({ locationString: 'kuala lumpur' })
                    this.searchAutoCompleteProperty('kuala lumpur')
                  }}
                  onPress={() => {
                    Keyboard.dismiss(),
                      this.state.locationString !== ''
                        ? (this.setState({ autoCompleteLocationString: '' }),
                          this.searchAutoCompleteProperty(
                            this.state.locationString
                          ))
                        : (this.setState({ autoCompleteLocationString: '' }),
                          this.searchAutoCompleteProperty('kuala lumpur'))
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#FFE100',
                  paddingBottom: 10,
                  height: 35
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                  onPress={() => {
                    this.toggleModal(true)
                  }}
                  accessible={true}
                  accessibilityLabel='keywordSearchListSortIconBtn'
                >
                  <Icon name='swap-vert' size={20} color='black' />
                  <Text style={styles.styleHeaderOption}>Sort</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                  onPress={() =>
                    this.renderConditionalView(
                      this.state.viewType === 'filter'
                        ? this.setState({ viewType: 'search' })
                        : this.setState({ viewType: 'filter' })
                    )
                  }
                  accessible={true}
                  accessibilityLabel='keywordSearchListFilterBtn'
                >
                  <Icon name='filter-list' size={20} color='black' />
                  <Text style={[styles.styleHeaderOption, {}]}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                  onPress={() => {
                    if (this._panel !== undefined && this._panel !== null) {
                      this._panel.show(60)
                    }
                    this.renderConditionalView(
                      this.state.viewType === 'map'
                        ? this.setState({
                          viewType: 'search',
                          displayMap: false,
                          test: false,
                          tapOnMarker: false
                        })
                        : this.setState({
                          viewType: 'map',
                          displayMap: true,
                          test: true,
                          infoData: '',
                          selectedMapIndex: ''
                        })
                    )
                  }}
                  accessible={true}
                  accessibilityLabel='keywordSearchListMapBtn'
                >
                  <View
                    style={{
                      borderRadius: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      backgroundColor:
                        this.state.test === true ? '#E1C402' : '#FFE100',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon name='map' size={20} color='black' />
                    <Text style={[styles.styleHeaderOption, {}]}>Map</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {this.state.typeModalVisible && (
            <View style={styles.typeDropDownRoot}>
              <TouchableOpacity
                style={styles.typeDropDownViews}
                onPress={this._changeDisplayType('BUY', 0)}
                accessible={true}
                accessibilityLabel='keywordSearchListBuyBtn'
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
                accessibilityLabel='keywordSearchListRentBtn'
              >
                <Text>Rent</Text>
                {this.state.displayType === 'RENT' && (
                  <Icon name='check' size={14} />
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={{ flex: 1 }}>
            {this.props.navigation.state.params &&
              this.props.navigation.state.params.similarListing ? (
                <View style={styles.similarPropertyView}>
                  <Text style={styles.similarTaskText}>We are sorry.</Text>
                  <Text style={styles.similarTaskText}>
                    This property has been rented out.
                </Text>
                  <Text style={styles.smallSimilarText}>
                    We have similar properties for you to check
                </Text>
                  <Image
                    testID='listing'
                    source={listingImage}
                    style={styles.similarImage}
                  />
                  <View style={styles.similarTitleView}>
                    <Text style={styles.similarListingTitle}>
                      Similar listings
                  </Text>
                  </View>
                </View>
              ) : null}
            {this.renderConditionalView('search')}

            {this.state.isLoading ? (
              <View
                style={{ position: 'absolute', top: '50%', right: 0, left: 0 }}
              >
                <ActivityIndicator
                  animating={this.state.isLoading}
                  size='large'
                  color='grey'
                />
              </View>
            ) : (
                <View />
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
                    accessibilityLabel='keywordSearchListSearchStringBackIconBtn'
                  >
                    <Icon
                      name='arrow-back'
                      size={20}
                      style={{ color: '#000' }}
                    />
                  </TouchableOpacity>
                  <TextInput
                    testID='searchString'
                    style={{
                      width: '80%',
                      height: 50,
                      fontSize: 14,
                      color: '#000'
                    }}
                    autoFocus={true}
                    ref={'PasswordInput'}
                    value={this.state.searchString}
                    returnKeyType='done'
                    onSubmitEditing={() => {
                      this.searchToogleModel(!this.state.searchModelVisible),
                        this.setState({ searchNameList: '' }),
                        this.setState(
                          {
                            locationString:
                              this.state.searchString === ''
                                ? 'kuala lumpur'
                                : this.state.searchString
                          },
                          () => {
                            if (this.state.displayType === 'BUY') {
                              this.changeSortTypeStateValue(true, 1)
                            } else {
                              this.changeSortTypeStateValue(true, 0)
                            }
                          }
                        )
                    }}
                    keyboardType={'web-search'}
                    placeholder='Type in Area / Property Name'
                    accessible={true}
                    accessibilityLabel='keywordSearchListPropertyTextBoxInput'
                    onChangeText={(searchString) => {
                      this.setState({ searchString: searchString }),
                        this.getAutoCompleteList(searchString)
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ searchString: '' }),
                        this.getAutoCompleteList('')
                    }}
                    style={{ paddingRight: 5 }}
                    accessible={true}
                    accessibilityLabel='keywordSearchListKeywordClearBtn'
                  >
                    <Icon name='clear' size={20} style={{ color: '#000' }} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    height: 5,
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

          <Modal
            transparent={true}
            animationType={'slide'}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false })
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(52, 52, 52, 0.5)',
                height: height,
                width: width,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: 250,
                  width: '70%'
                }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    flexDirection: 'row',
                    backgroundColor: '#FFE100',
                    height: 40,
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      textAlign: 'left',
                      paddingLeft: 15,
                      fontFamily: 'OpenSans-SemiBold',
                      color: '#000000'
                    }}
                  >
                    Sort
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.toggleModal(!this.state.modalVisible)}
                    style={{ paddingRight: 15 }}
                    accessible={true}
                    accessibilityLabel='keywordSearchListModalBtn'
                  >
                    <Icon name='clear' size={25} style={{ color: '#000' }} />
                  </TouchableOpacity>
                </View>

                {this._renderCountriesType()}

                <View style={styles.HeaderStyle}>
                  <TouchableOpacity
                    style={{ marginRight: 5, width: '60%' }}
                    onPress={() => {
                      this.toggleModal(!this.state.modalVisible),
                        this.searchProperty()
                    }}
                    accessible={true}
                    accessibilityLabel='keywordSearchListSortNowbtn'
                  >
                    <View
                      style={[
                        styles.textStyleHousingType,
                        { backgroundColor: '#FFE100' }
                      ]}
                    >
                      <Text style={{ textAlign: 'center' }}>Sort Now</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <ErrorDialog
            modalVisible={this.state.showErrorDialog}
            headerText='Oops!'
            bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
            toggleModal={(value) => {
              this.setState({ showErrorDialog: false })
            }}
          />
        </Container>
      </SafeAreaView>
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
    ...bindActionCreators({}, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearchList)
