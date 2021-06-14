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
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import { Avatar, Icon, Divider } from 'react-native-elements'
import EditText from '../../components/EditTextHome'
import _ from 'lodash'
import MapView, { Marker } from 'react-native-maps'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import DeviceInfo from 'react-native-device-info'

import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'

import { styles } from './styles'

// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'

const { width, height } = Dimensions.get('window')
import {
  getRoomTypeLabel,
  displayZeroDeposit
} from '../../common/helper/common'

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005
import { No_IMAGE_LINK, NETCORE_TRACK_EVENT } from '../../common/constants'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isMapReady: false,
      apiCallFor: 'keyword',
      displayType: 'RENT',

      modalVisible: false,
      typeModalVisible: false,
      searchModelVisible: false,

      values: [0, 6000],

      locationString: 'kuala lumpur',
      page: 0,
      pageSize: 10,
      latitude: '',
      longitude: '',
      totalElements: 0,
      infoData: '',
      searchName: '',

      alert_message: '',

      searchString: 'Kuala lumpur',
      searchNameList: '',
      autoCompleteLocationString: '',

      type: '',
      selectedTitleType: '',
      furnishType: 'NONE',
      bathroomTypeSelection: '',
      bedroom: 0,
      bathroom: 0,
      roomTypeSelection: '',
      bathroomType: '',
      carpark: 0,
      nearLrt: false,
      lat: 0,
      lang: 0,
      maxPrice: 6000,
      minPrice: 0,
      sorting: '',

      filterViewOn: true,
      mapViewOn: true,
      viewType: '',
      searchList: '',
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
        },
        {
          id: 3,
          name: 'All',
          isSelected: true,
          value: ''
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
        },
        {
          id: 2,
          name: 'All',
          isSelected: true,
          value: ''
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
          name: '2',
          isSelected: false,
          value: 2
        },
        {
          id: 3,
          name: '3',
          isSelected: false,
          value: 3
        },
        {
          id: 4,
          name: 'More than 3',
          isSelected: false,
          value: 4
        }
      ],
      numberOfBathrooms: [
        {
          id: 0,
          name: '1',
          isSelected: false,
          value: 1
        },
        {
          id: 1,
          name: '2',
          isSelected: false,
          value: 2
        },
        {
          id: 2,
          name: '3',
          isSelected: false,
          value: 3
        },
        {
          id: 3,
          name: 'More than 3',
          isSelected: false,
          value: 4
        }
      ],
      numberOfParking: [
        {
          id: 0,
          name: '1',
          isSelected: false,
          value: 1
        },
        {
          id: 1,
          name: '2',
          isSelected: false,
          value: 2
        },
        {
          id: 2,
          name: '3',
          isSelected: false,
          value: 3
        },
        {
          id: 3,
          name: 'More than 3',
          isSelected: false,
          value: 4
        }
      ],
      extraInfo: [
        {
          id: 0,
          name: 'Nearby LRT',
          isSelected: false
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
        // TODO conflict
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
          value: 'BUY'
        }
      ]
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.searchData()
  }

  componentDidMount() {
    this.searchData()
  }

  searchData() {
    this.setState({ searchList: '' })

    const str = this.props.navigation.getParam('locationString', '')
    if (str !== '') {
      this.setState(
        { autoCompleteLocationString: '', locationString: str },
        () => {
          this.searchProperty(this.state.locationString)
        }
      )
    } else {
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

    if (isSelect === true) {
      this.resetProperty()
    }
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  getAutoCompletePropertyList = (location) => {
    this.setState({ apiCallFor: 'autocompleteproperty' })

    this.showLoader()

    if (!global.networkConnection) return

    var body = {
      keywords:
        this.state.autoCompleteLocationString === ''
          ? location
          : this.state.autoCompleteLocationString,
      pageSize: this.state.pageSize,
      pageNumber: this.state.page,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
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

    if (this.state.type !== '') {
      body['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
    }

    APICaller(Http.propertySearch, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (!json) return
        if (
          json.status === 403 ||
          json.status === 422 ||
          json.status === 401 ||
          json.status === 404
        ) {
          this.hideLoader()
          Alert.alert(json.data.message)
        } else if (json.status === 200) {
          if (json.data.empty) {
            this.hideLoader()

            this.setState({
              alert_message: 'No Properties found'
            })
            this._hideAlertView()

            this.setState({ totalElements: 0 })
          } else {
            this.setState({ totalElements: json.data.totalElements })

            if (this.state.searchList.length > 0) {
              var arr = this.state.searchList.concat(json.data.content)
              this.setState({ searchList: arr })
            } else {
              this.setState({ searchList: json.data.content })
            }

            this.setState({ latitude: this.state.searchList[0].latitude })
            this.setState({ longitude: this.state.searchList[0].longitude })

            if (this.state.viewType !== 'map') {
            } else {
              this.setState({ viewType: 'search' })
              this.setState({ viewType: 'map' })
            }

            this.hideLoader()

            const NetCorePayload = {
              Area_of_property:
                this.state.autoCompleteLocationString === ''
                  ? location
                  : this.state.autoCompleteLocationString
            }
            NetcoreSDK.track(
              NETCORE_TRACK_EVENT.SEARCH_FOR_AREA,
              NetCorePayload
            )

            this.addEventTracking(
              this.state.autoCompleteLocationString === ''
                ? location
                : this.state.autoCompleteLocationString
            )
            this.displaySearchList()
          }
        }
      }
    )
  }

  getSearchHomeList = () => {
    this.setState({ apiCallFor: 'keyword' })

    this.showLoader()

    if (!global.networkConnection) return

    var body = {
      keywords:
        this.state.locationString === ''
          ? 'kuala lumpur'
          : this.state.locationString,
      pageSize: this.state.pageSize,
      pageNumber: this.state.page,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
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

    if (this.state.type !== '') {
      body['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
    }

    APICaller(Http.propertySearch, 'POST', '', JSON.stringify(body)).then(
      (json) => {
        if (!json) return
        if (
          json.status === 403 ||
          json.status === 422 ||
          json.status === 401 ||
          json.status === 404
        ) {
          this.hideLoader()
          Alert.alert(json.data.message)
        } else if (json.status === 200) {
          if (json.data.empty) {
            this.hideLoader()

            this.setState({
              alert_message: 'No Properties found'
            })
            this._hideAlertView()

            this.setState({ totalElements: 0 })
          } else {
            this.setState({ totalElements: json.data.totalElements })

            if (this.state.searchList.length > 0) {
              var arr = this.state.searchList.concat(json.data.content)
              this.setState({ searchList: arr })
            } else {
              this.setState({ searchList: json.data.content })
            }

            this.setState({ latitude: this.state.searchList[0].latitude })
            this.setState({ longitude: this.state.searchList[0].longitude })

            this.hideLoader()

            const NetCorePayload = {
              Area_of_property:
                this.state.locationString === ''
                  ? 'kuala lumpur'
                  : this.state.locationString
            }
            NetcoreSDK.track(
              NETCORE_TRACK_EVENT.SEARCH_FOR_AREA,
              NetCorePayload
            )

            this.addEventTracking(
              this.state.locationString === ''
                ? 'kuala lumpur'
                : this.state.locationString
            )
            this.displaySearchList()
          }
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
        if (
          json.status === 403 ||
          json.status === 422 ||
          json.status === 401 ||
          json.status === 404
        ) {
          Alert.alert(json.data.message)
        } else if (json.status === 200) {
          this.setState({ searchNameList: '' })

          if (json.data.LOCATION) {
            this.setState({ searchNameList: json.data.LOCATION })
          }

          if (json.data.ACCESSIBILITY && this.state.searchNameList !== '') {
            var arr = this.state.searchNameList.concat(json.data.ACCESSIBILITY)
            this.setState({ searchNameList: arr })
          } else if (json.data.ACCESSIBILITY) {
            this.setState({ searchNameList: json.data.ACCESSIBILITY })
          }

          if (json.data.PROPERTY && this.state.searchNameList !== '') {
            var arr = this.state.searchNameList.concat(json.data.PROPERTY)
            this.setState({ searchNameList: arr })
          } else if (json.data.PROPERTY) {
            this.setState({ searchNameList: json.data.PROPERTY })
          }
        }
      }
    )
  }

  getFilterSearchList = () => {
    this.setState({ apiCallFor: 'filter' })

    this.showLoader()

    if (!global.networkConnection) return
    var body = {
      keywords:
        this.state.locationString === ''
          ? 'kuala lumpur'
          : this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      sort: this.state.sorting
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
      this.state.displayType === 'BUY' &&
      this.state.selectedTitleType !== ''
    ) {
      body['leaseType'] = this.state.selectedTitleType
    }

    if (this.state.type !== '') {
      body['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        body['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
    }

    if (this.state.furnishType !== 'NONE') {
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
      keywords:
        this.state.locationString === ''
          ? 'kuala lumpur'
          : this.state.locationString,
      minPrice: this.state.values[0],
      nearLrt: this.state.nearLrt,
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

    if (this.state.type !== '') {
      bodyRoom['type'] = this.state.type
    } else {
      if (this.state.displayType === 'BUY' && this.state.type === '') {
        bodyRoom['types'] = ['HIGHRISE_SALE', 'LANDED_SALE']
      }
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
      if (json.status === 403 || json.status === 422 || json.status === 401) {
        this.hideLoader()
        Alert.alert(json.data.message)
      } else if (json.status === 200) {
        if (json.data.empty) {
          this.hideLoader()

          this.setState({
            alert_message: 'No Properties found'
          })
          this._hideAlertView()

          this.setState({ totalElements: 0 })
        } else {
          this.setState({ totalElements: json.data.totalElements })

          if (this.state.searchList.length > 0) {
            var arr = this.state.searchList.concat(json.data.content)
            this.setState({ searchList: arr })
          } else {
            this.setState({ searchList: '' })
            this.setState({ searchList: json.data.content })
          }
          this.setState({ viewType: 'search' })
          this.setState({ latitude: this.state.searchList[0].latitude })
          this.setState({ longitude: this.state.searchList[0].longitude })

          this.hideLoader()

          const NetCorePayload = {
            Area_of_property:
              this.state.locationString === ''
                ? 'kuala lumpur'
                : this.state.locationString
          }
          NetcoreSDK.track(NETCORE_TRACK_EVENT.SEARCH_FOR_AREA, NetCorePayload)

          this.addEventTracking(
            this.state.locationString === ''
              ? 'kuala lumpur'
              : this.state.locationString
          )
          this.displaySearchList()
        }
      }
    })
  }

  displayAutoCompleteList = (key) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={styles.listStyle}
          onPress={() => {
            this.searchToogleModel(!this.state.searchModelVisible),
              this.searchProperty(key.label)
          }}
          accessible={true}
          accessibilityLabel='searchScrToggleModalBtn'
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

  _hideAlertView() {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
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

  displaySearchList = (key) => {
    let roomType = getRoomTypeLabel(
      key && key.roomType != undefined ? key.roomType : ''
    )

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('ListingPageDetail', {
            propertyInfo: key
          })
        }}
        accessible={true}
        accessibilityLabel='searchScrListPageNavBtn'
      >
        {key && (
          <View style={styles.styleItem}>
            <View
              style={{
                alignItems: 'center',
                width: '90%',
                borderRadius: 5,
                borderColor: 'black',
                borderWidth: 0.5
              }}
            >
              <ProgressiveImageBackground
                source={{
                  uri:
                    key && key.images && key.images.length > 0
                      ? key.images[0].url
                      : No_IMAGE_LINK
                }}
                style={{
                  height: 240,
                  width: '100%',
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {key && key.noDeposit === true && key.type !== 'ROOM' ? (
                      <Image
                        testID='noDeposit'
                        source={imgNoDeposit}
                        style={{ height: 60, width: 60, marginLeft: 10 }}
                      />
                    ) : (
                      <View />
                    )}
                    {key.videos && key.videos.length > 0 ? (
                      <Image
                        testID='contactLess'
                        source={imgContactLess}
                        style={{ height: 50, width: 50, marginRight: 10 }}
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
                    style={{
                      width: '100%',
                      marginTop: 7,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={styles.txtStyle}
                    >
                      {key.name} lol
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.styleInfo,
                      { backgroundColor: 'white', height: 65 }
                    ]}
                  >
                    <View style={{ flexDirection: 'column' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 10,
                          paddingTop: 10
                        }}
                      >
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
                        <View>
                          <Text
                            style={{
                              fontSize: 12,
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Light',
                              color: '#000'
                            }}
                          >
                            {roomType !== '' ? roomType : `${key.sqft} sqft`} |
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
                              this.displayPorpertyType(key.type)
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
                            {this._displayFurnishType(key.furnishType)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 10,
                          paddingTop: 10,
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
                            style={{ height: 15, width: 15, marginLeft: 5 }}
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
                            {key.bathroomType !== null
                              ? this.Capitalize(key.bathroomType.toLowerCase())
                              : key.bathroom}
                          </Text>
                        </View>
                        <View>
                          <Image
                            testID='bathroom'
                            source={img2}
                            style={{ height: 15, width: 15, marginLeft: 5 }}
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
                            style={{ height: 15, width: 15, marginLeft: 5 }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            marginRight: 10
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              paddingLeft: 10,
                              fontWeight: '500',
                              color: '#90278E'
                            }}
                          >
                            RM {key.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ProgressiveImageBackground>
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
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

  renderHousingType = () => {
    const { housingType } = this.state
    return _.map(housingType, ({ id, name, isSelected }) => {
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
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

            for (let index = 0; index < housingType.length; index++) {
              const element = housingType[index]
              if (element.isSelected === true) {
                this.setState({ type: element.value })
              }
            }

            // housingType[id].isSelected = isSelected === true ? false : true;
            this.setState({ housingType })
          }}
          accessible={true}
          accessibilityLabel='searchScrRentBtn'
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
          accessibilityLabel='searchScrBuyBtn'
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
          accessibilityLabel='searchScrTitleTypeBtn'
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

            this.setState({ furnishType: 'NONE' })

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
          accessibilityLabel='searchScrFurnTypeBtn'
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

            this.setState({ bedroom: 0 })

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
          accessibilityLabel='searchScrNumRoomBtn'
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
          accessibilityLabel='searchScrBathBtn'
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
          accessibilityLabel='searchScrParkBtn'
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
    const { extraInfo } = this.state
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
              if (element.isSelected === true) {
                this.setState({ nearLrt: true })
              } else {
                this.setState({ nearLrt: false })
              }
            }

            this.setState({ extraInfo })
          }}
          accessible={true}
          accessibilityLabel='searchScrNumExraInfoBtn'
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
          accessibilityLabel='searchScrRoomTypeBtn'
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
          accessibilityLabel='searchScrBathTypeBtn'
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
    const housingType = this.state.housingType
    const housingBuyType = this.state.housingBuyType
    const titleType = this.state.titleType
    const housingTypeFurniture = this.state.housingTypeFurniture
    const numberOfRooms = this.state.numberOfRooms
    const numberOfBathrooms = this.state.numberOfBathrooms
    const numberOfParking = this.state.numberOfParking
    const extraInfo = this.state.extraInfo

    const roomType = this.state.roomType
    const bathroomType = this.state.bathroomType

    this.resetSlider()

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
      }
      this.setState({ housingType: housingType })
    }

    for (let index = 0; index < housingTypeFurniture.length; index++) {
      const element = housingTypeFurniture[index]
      housingTypeFurniture[element.id].isSelected = false
      this.setState({ furnishType: 'NONE' })
    }

    this.setState({ housingTypeFurniture: housingTypeFurniture })

    for (let index = 0; index < numberOfRooms.length; index++) {
      const element = numberOfRooms[index]
      numberOfRooms[element.id].isSelected = false
      this.setState({ bedroom: 0 })
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

    for (let index = 0; index < extraInfo.length; index++) {
      const element = extraInfo[index]
      extraInfo[element.id].isSelected = false
      this.setState({ nearLrt: false })
    }

    this.setState({ extraInfo: extraInfo })
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
    this.setState(
      {
        page: this.state.page + 1
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
        if (json.status === 403 || json.status === 422 || json.status === 401) {
          // console.log('error in event tracking')
        } else if (json.status === 200) {
          // console.log('sucessfull in event tracking')
        }
      })
    }
  }

  mianSearchView() {
    return (
      // <ScrollView>
      <View style={{ height: '100%' }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.styleTextFound}>
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
            {/* <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Light', color: '#000' }}> in {this.state.locationString === '*' ? 'All' : this.state.locationString} </Text> */}
          </View>

          <FlatList
            style={{ paddingBottom: 20, marginTop: 5 }}
            data={this.state.searchList}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item }) => (
              <View>{this.displaySearchList(item)}</View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (this.state.searchList.length !== this.state.totalElements) {
                {
                  this.handleLoadMore()
                }
              }
            }}
          />
        </View>
      </View>
      // </ScrollView>
    )
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      values
    })
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

  mainFilterView() {
    return (
      <ScrollView>
        <View>
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
              accessibilityLabel='searchScrMainFilterClearBtn'
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
                  {this.state.values[0]} - {this.state.values[1]}
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
                  {this.getUnitRange(this.state.values[1])}
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
              {/* <TextInput
              keyboardType='number-pad'
              placeholder='Min'
              maxLength={8}
              onChangeText={(minPrice) => this.setState({ minPrice: minPrice })}
              style={[styles.etStylePriceFilter, { marginRight: 10 }]} />

            <TextInput
              keyboardType='number-pad'
              placeholder='Max'
              maxLength={8}
              onChangeText={(maxPrice) => this.setState({ maxPrice: maxPrice })}
              style={styles.etStylePriceFilter} /> */}

              <MultiSlider
                allowOverlap={false}
                minMarkerOverlapDistance={100}
                style={{ width: width }}
                values={[this.state.values[0], this.state.values[1]]}
                sliderLength={280}
                onValuesChange={this.multiSliderValuesChange}
                min={0}
                max={this.state.displayType === 'BUY' ? 5000000 : 6000}
                step={this.state.displayType === 'BUY' ? 10000 : 1}
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
                <Text style={[styles.TextStyleHeaderFilter, { marginTop: 20 }]}>
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
            <View style={{ flexDirection: 'row' }}>
              {this.renderNumberOfExtraInfo()}
            </View>
            <View
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                marginTop: 20
              }}
            />
            {/* <View style={{ flexDirection: 'row', flex: 1, marginTop: 20 }}> */}
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 5,
                marginTop: 20,
                marginRight: 5
              }}
            >
              <View style={styles.HeaderStyle}>
                <TouchableOpacity
                  style={{ marginRight: 5, width: '80%' }}
                  onPress={() => this.resetFilter()}
                  accessible={true}
                  accessibilityLabel='searchScrResetFilterBtn'
                >
                  <Text
                    style={[
                      styles.textStyleHousingType,
                      { textAlign: 'center' }
                    ]}
                  >
                    Reset Filter
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.HeaderStyle}>
                <TouchableOpacity
                  style={{ marginRight: 5, width: '80%' }}
                  onPress={() => {
                    this.resetProperty()
                  }}
                  accessible={true}
                  accessibilityLabel='searchScrResetPropBtn'
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

          {this.state.alert_message !== '' &&
            this.AlertView(this.state.alert_message)}
        </View>
      </ScrollView>
    )
  }

  _displayInfo() {
    if (this.state.infoData !== '') {
      let roomType = getRoomTypeLabel(this.state.infoData.roomType)
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('ListingPageDetail', {
              propertyInfo: this.state.infoData
            })
          }}
          style={{
            backgroundColor: 'white',
            height: 100,
            alignItems: 'center',
            flexDirection: 'row'
          }}
          accessible={true}
          accessibilityLabel='searchScrDispInfoBtn'
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
              height: 80,
              width: 80,
              marginLeft: 10,
              backgroundColor: '#cccccc',
              borderRadius: 5
            }}
          />

          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text
                numberOfLines={1}
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
                  this.setState({ infoData: '' })
                }}
                accessible={true}
                accessibilityLabel='searchScrInfoDataClearBtn'
              >
                <Icon name='clear' size={25} style={{ color: '#000' }} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                textAlign: 'left',
                paddingLeft: 10,
                paddingTop: 5,
                fontWeight: '500',
                color: '#000'
              }}
            >
              RM {this.state.infoData.price}
            </Text>
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
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ListingPageDetail', {
                    propertyInfo: this.state.infoData
                  })
                }}
                style={{ paddingRight: 15 }}
                accessible={true}
                accessibilityLabel='searchScrListPageDetailBtn'
              >
                <Icon
                  name='keyboard-arrow-right'
                  size={25}
                  style={{ color: 'grey' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  _onMarkerPress(markerData) {
    this.setState({ infoData: markerData })
    {
      this._displayInfo()
    }
  }

  mainMapView() {
    return (
      <Container>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <MapView
            key={this.state.forceRefresh}
            style={{ height: height, width: width }}
            onMapReady={() => this.setState({ isMapReady: true })}
            initialRegion={{
              latitude:
                this.state.latitude === '' ? 3.139 : this.state.latitude,
              longitude:
                this.state.longitude === '' ? 101.6869 : this.state.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
          >
            {this.state.isMapReady == true &&
            this.state.searchList.length > 0 ? (
              this.state.searchList.map((marker) => (
                <MapView.Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  title={marker.title}
                  onPress={this._onMarkerPress.bind(this, marker)}
                >
                  <Icon name='home' size={20} />
                  {/* <Image source={require('../../../Images/ic_map.png')} style={{ height: 20, width: 20, }} /> */}
                </MapView.Marker>
              ))
            ) : (
              <Marker
                coordinate={{
                  latitude: 3.139,
                  longitude: 101.6869
                }}
              />
            )}
          </MapView>

          <TouchableOpacity
            onPress={() =>
              this.renderConditionalView(this.setState({ viewType: 'search' }))
            }
            style={{
              height: 40,
              width: 40,
              borderRadius: 5,
              margin: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFE100',
              position: 'absolute'
            }}
            accessible={true}
            accessibilityLabel='searchScrGridBtn'
          >
            <Text
              style={{
                fontSize: 14,
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: '500',
                color: '#000'
              }}
            >
              Grid
            </Text>
          </TouchableOpacity>
        </View>

        {this._displayInfo()}
      </Container>

      // <View style={{ flex: 1, backgroundColor: 'black' }}>
      //   <View style={{ height: height - 300, backgroundColor: 'red' }} />
      //   <View style={{ height: 200, backgroundColor: 'green' }} />
      // </View>
    )
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

  searchToogleModel(visible) {
    this.setState({ searchModelVisible: visible }, () => {
      setTimeout(() => this.showSearchResult(visible), 1000)
    })
  }

  showSearchResult = (visible) => {
    if (this.state.searchModelVisible === true) {
      this.refs && this.refs.PasswordInput && this.refs.PasswordInput.focus()
      this.setState({ searchModelVisible: visible }, () => {
        this.getAutoCompleteList(this.state.searchString)
      })
    }
  }

  typeToggleModal(visible) {
    this.setState({ typeModalVisible: visible })
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
          accessibilityLabel='searchScrPropTypeBtn'
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
      if (res === '' || res === null) {
        this.setState({ displayType: this.state.displayType })
        AsyncStorage.setItem('displayType', 'RENT')
        this.resetProperty()
      } else {
        this.setState({ displayType: res })
        this.state.sortingPropertyType.map((item, index) => {
          if (item.value.toLowerCase() === res.toLowerCase()) {
            this.changeSortTypeStateValue(true, index)
          } else {
            this.changeSortTypeStateValue(false, index)
          }
        })
        this.resetProperty()
      }
    })
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
          accessibilityLabel='searchScrCountriesTypeBtn'
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

  searchProperty = (locationString) => {
    this.setState({ page: 0 }, function () {
      this.setState({ searchList: '' }, function () {
        this.setState({ searchNameList: '' }, function () {
          this.setState({ searchString: locationString }, function () {
            this.setState(
              { autoCompleteLocationString: locationString },
              function () {
                this.setState({ locationString: locationString }, function () {
                  this.getAutoCompletePropertyList(locationString)
                })
              }
            )
          })
        })
      })
    })
  }

  resetProperty = () => {
    this.setState({ page: 0 }, function () {
      this.setState({ searchList: '' }, function () {
        this.getFilterSearchList()
      })
    })
  }

  _changeDisplayType = (type, index) => () => {
    this.setState({ displayType: type }, function () {
      this.setState({ typeModalVisible: false })
      AsyncStorage.setItem('displayType', type)
      this.changeSortTypeStateValue(true, index)
    })
  }

  render() {
    return (
      <Container>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            backgroundColor: '#FFE100'
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <EditText
              type={this.state.displayType}
              onChangeType={() => {
                this.typeToggleModal(!this.state.typeModalVisible)
              }}
              onSelect={() => {
                this.searchToogleModel(true)
              }}
              value={
                this.state.locationString.length > 0
                  ? this.state.locationString
                  : this.state.locationString
              }
              onPress={() => {
                Keyboard.dismiss(),
                  this.state.locationString !== ''
                    ? (this.setState({ autoCompleteLocationString: '' }),
                      this.searchProperty(this.state.locationString))
                    : (this.setState({ autoCompleteLocationString: '' }),
                      this.searchProperty('kuala lumpur'))
              }}
            />
          </View>

          {/* {
            this.state.searchNameList !== ''
              ?
              <View></View>
              : */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              backgroundColor: '#FFE100',
              paddingBottom: 10
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
              accessibilityLabel='searchScrSortBtn'
            >
              <Icon name='sort' size={20} color='black' />
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
              accessibilityLabel='searchScrFilterListBtn'
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
              onPress={() =>
                this.renderConditionalView(
                  this.state.viewType === 'map'
                    ? this.setState({ viewType: 'search' })
                    : this.setState({ viewType: 'map' })
                )
              }
              accessible={true}
              accessibilityLabel='searchScrMapBtn'
            >
              <Icon name='map' size={20} color='black' />
              <Text style={[styles.styleHeaderOption, {}]}>Map</Text>
            </TouchableOpacity>
          </View>
          {/* } */}
        </View>

        {this.state.typeModalVisible && (
          <View style={styles.typeDropDownRoot}>
            <TouchableOpacity
              style={styles.typeDropDownViews}
              onPress={this._changeDisplayType('BUY', 0)}
              accessible={true}
              accessibilityLabel='searchScrBuyModalBtn'
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
              accessibilityLabel='searchScrRentModalBtn'
            >
              <Text>Rent</Text>
              {this.state.displayType === 'RENT' && (
                <Icon name='check' size={14} />
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flex: 1 }}>
          {this.renderConditionalView('search')}
          <View style={{ position: 'absolute', top: '50%', right: 0, left: 0 }}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size='large'
              color='grey'
            />
          </View>
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
                  height: 50,
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
                  accessibilityLabel='searchScrLocationStringBtn'
                >
                  <Icon name='arrow-back' size={20} style={{ color: '#000' }} />
                </TouchableOpacity>
                <TextInput
                  testID='locationString'
                  style={{
                    width: '80%',
                    height: 50,
                    fontSize: 14,
                    color: '#000'
                  }}
                  ref='PasswordInput'
                  value={this.state.locationString}
                  onSubmitEditing={() => {
                    this.searchToogleModel(!this.state.searchModelVisible),
                      this.state.locationString !== ''
                        ? (this.setState({ autoCompleteLocationString: '' }),
                          this.searchProperty(this.state.locationString))
                        : (this.setState({ autoCompleteLocationString: '' }),
                          this.searchProperty('kuala lumpur'))
                  }}
                  keyboardType={'web-search'}
                  placeholder='Type in Area / Property Name'
                  accessible={true}
                  accessibilityLabel='indexSearchPropertyTextBox'
                  onChangeText={(searchString) => {
                    this.setState({ locationString: searchString }),
                      this.getAutoCompleteList(searchString)
                  }}
                  accessible={true}
                  accessibilityLabel='searchScreenWebSearchInput'
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ locationString: '' }),
                      this.getAutoCompleteList('')
                  }}
                  style={{ paddingRight: 5 }}
                  accessible={true}
                  accessibilityLabel='searchScrLocationClearBtn'
                >
                  <Icon name='clear' size={20} style={{ color: '#000' }} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 1,
                  width: '90%',
                  backgroundColor: '#D3D3D3',
                  marginTop: -5
                }}
              />
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
                  accessibilityLabel='searchScrSlideClearBtn'
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
                      this.resetProperty()
                  }}
                  accessible={true}
                  accessibilityLabel='searchScrResetPropBtn2'
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
      </Container>
    )
  }
}
function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Search)
