import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  BackHandler,
  Alert,
  FlatList,
  LayoutAnimation,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Favourites from '../my-favourites/index'
import Container from '../../components/Container'
import { Icon } from 'react-native-elements'
import RBSheet from 'react-native-raw-bottom-sheet'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import { logEvent, events } from '../../util/fbAnalytics'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'

import styles from './styles'
import { getRoomTypeLabel } from '../../common/helper/common'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'
import ErrorDialog from '../../components/ErrorDialog'
import AccordionBtn from './AccordionBtn'
import FlatListComponent from './FlatListComponent'
import PostPropertyBtn from './PostPropertyBtn'
import NoRecordComponent from './NoRecordComponent'
import RejectedModal from './RejectedModal'
import ListingTabContainer from './ListingTabContainer'

// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import imgContactLess from '../../../Images/UI/icon-contactless.png'

import RentImage from '../../../Images/rent.png'
import BuyImage from '../../../Images/sell.png'

const { width } = Dimensions.get('window')

import Expandable_ListView from '../../components/MyList_Expandable_ListView'
import { No_IMAGE_LINK } from '../../common/constants'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { Matrics } from '../../common/styles'

class MyListing extends Component {
  constructor (props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      lists: [
        {
          icon: RentImage,
          label: 'Rent Property'
        },
        {
          icon: BuyImage,
          label: 'Sell Property'
        }
      ],
      showErrorDialog: false,
      isVisible: false,
      clickedItem: 0,
      modalEditVisible: false,
      isLoading: false,
      apiCallFirst: true,
      pageNumber: 0,
      totalElements: 0,
      pageSize: -1,
      userId: null,
      status: '',
      isListingOpen: true,
      isFavouriteOpen: false,
      sort: '-dateCreated',
      activeList: '',
      fromScreen: '',

      active: [],
      inactive: [],
      rejected: [],
      expire: [],
      testData: [
        'Data1',
        'Data1',
        'Data1',
        'Data1',
        'Data1',
        'Data1',
        'Data1',
        'Data1'
      ],
      appoinmentOpen: true,
      isOpenFirst: false,
      isOpenSecond: false,
      isOpenThird: false,
      appoinmentsData: [],
      AccordionData: [
        {
          id: 0,
          expanded: false,
          category_Name: 'Active',
          sub_Category: []
        },
        {
          id: 1,
          expanded: false,
          category_Name: 'Inactive',
          sub_Category: []
        },
        {
          id: 2,
          expanded: false,
          category_Name: 'Rejected',
          sub_Category: []
        }
        // {
        //   id: 3,
        //   expanded: false,
        //   category_Name: "Expire",
        //   sub_Category: []
        // },
      ]
    }
  }

  _navigationBack = () => {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.backToHome
    ) {
      // this.props.navigation.popToTop();
      this.setState({ modalEditVisible: false }),
        this.props.navigation.navigate('Home')
    } else {
      this.props.navigation.goBack()
    }
  }

  handleBackButtonClick () {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.backToHome
    ) {
      // this.props.navigation.popToTop();
      this.setState({ modalEditVisible: false }),
        this.props.navigation.navigate('Home')
    } else {
      this.props.navigation.goBack()
    }
    return true
  }

  format (amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  _viewHeader () {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          // shadowColor: 'black',
          // shadowOpacity: 0.2,
          // elevation: 6,
          shadowOffset: { width: 0, height: 2 },
          flexDirection: 'row'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {/* <View style={{ flex: 3, alignItems: "center", flexDirection: "row" }}>
            <TouchableOpacity onPress={() => this._navigationBack()}>
              <Icon name="arrow-back" size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "OpenSans-SemiBold",
                fontSize: 17,
                color: "#000",
                paddingLeft: 10
              }}
            >
              My Listing
            </Text>
          </View> */}

          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000'
              }}
            >
              Properties
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'flex-end',
              width: width,
              position: 'absolute',
              // paddingRight: 0,
              paddingLeft: 30,
              left: 0
            }}
          >
            <TouchableOpacity
              onPress={() => {
                analytics().logEvent(
                  trackerEventSubmit.postProperty.action.postListingClick
                )
                logEvent(
                  trackerEventSubmit.postProperty.action.postListingClick
                )
                this.setState({
                  modalEditVisible: false
                }),
                  this.Standard.open()
              }}
              style={{ marginLeft: 5, paddingHorizontal: 5 }}
              accessible={true}
              accessibilityLabel='myListingScreenAddBtn'
            >
              <Icon name='add' size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // componentWillReceiveProps(props) {
  //   if (props.navigation.state.params !== undefined) {
  //     if (props.navigation.state.params !== undefined && this.state.apiCallFirst === true) {
  //       this.setState({ apiCallFirst: false }, function () {
  //         this.updateData();
  //       })
  //     }
  //   }
  // }

  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    // this.eventListner.remove();
  }

  componentDidMount () {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ userId: user_credentials.userId }, () => {
        this.getUpppoinments()
      })
    }
    this.props.navigation.addListener('willFocus', route =>
      this.pageRefresh(route)
    )
  }
  getUpppoinments () {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        Http.getAppointmentByUserId(user_credentials.userId),
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        if (response.status === 200) {
          this.setState({
            appoinmentsData: response.data
          })
        } else {
          this.setState({ isLoading: false })
        }
      })
    }
  }
  pageRefresh (route) {
    if (route.action.type === 'Navigation/NAVIGATE') {
      const {
        appoinmentOpen,
        isOpenFirst,
        isOpenSecond,
        isOpenThird
      } = this.state
      if (
        appoinmentOpen != true &&
        isOpenFirst != true &&
        isOpenSecond != true &&
        isOpenThird != true
      ) {
        this.setState(
          {
            appoinmentOpen: false,
            modalEditVisible: false,
            apiCallFirst: false
          },
          () => {
            this.setState({ appoinmentOpen: true }, () => {
              this.getUpppoinments()
              this.updateData()
            })
          }
        )
      } else {
        this.getUpppoinments()
        this.updateData()
      }
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.isFocused !== this.props.isFocused) {
  //     this.setState({ isOpenFirst: false, modalEditVisible: false }, () => {
  //       this.setState({ isOpenFirst: true })
  //     })
  //     // this.updateData();
  //   }
  // }

  updateData () {
    this.setState({ pageNumber: 0 }, function () {
      this.setState({ active: [] }, function () {
        this.setState({ inactive: [] }, function () {
          this.setState({ rejected: [] }, function () {
            this.setState({ expire: [] }, function () {
              const { AccordionData } = this.state
              for (let index = 0; index < AccordionData.length; index++) {
                const elementOld = AccordionData[index]
                AccordionData[elementOld.id].expanded = false
              }
              this.getActiveProperties()
            })
          })
        })
      })
    })
  }

  getActiveProperties () {
    if (!global.networkConnection) return

    this.showLoader()
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        Http.userProperties(
          user_credentials.userId,
          this.state.pageNumber,
          this.state.pageSize,
          this.state.sort
        ),
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        if (response.status === 200) {
          this.setState({ totalElements: response.data.totalElements })
          if (this.state.pageNumber == 0) {
            this.setState({ activeList: '' })
            this.setState({ activeList: response.data.content })
            this.arrangeAllData()
          } else {
            if (this.state.activeList.length > 0) {
              var arr = this.state.activeList.concat(response.data.content)
              this.setState({ activeList: arr })
            } else {
              this.setState({ activeList: response.data.content })
            }
            if (this.state.activeList.length !== this.state.totalElements) {
              this.setState({ pageNumber: this.state.pageNumber + 1 }, () => {
                this.getActiveProperties()
              })
            } else {
              this.setState({ apiCallFirst: true }, function () {
                this.arrangeAllData()
              })
            }
          }
        } else {
          this.hideLoader()
          this.displayError()
        }
      })
    } else {
      this.hideLoader()
    }
  }

  arrangeAllData () {
    for (let index = 0; index < this.state.activeList.length; index++) {
      const element = this.state.activeList[index]

      if (element.status === 'ACTIVE' && element.active === true) {
        const arr = this.state.active
        arr.push(element)
        this.setState({ active: arr })
      } else if (element.status === 'ACTIVE' && element.active === false) {
        const arr = this.state.inactive
        arr.push(element)
        this.setState({ inactive: arr })
      } else if (element.status === 'SUSPENDED') {
        const arr = this.state.rejected
        arr.push(element)
        this.setState({ rejected: arr })
      } else if (element.status === 'EXPIRED' && element.active === true) {
        const arr = this.state.inactive
        arr.push(element)
        this.setState({ inactive: arr })
      } else if (element.status === 'EXPIRED' && element.active === false) {
        const arr = this.state.inactive
        arr.push(element)
        this.setState({ inactive: arr })
      }
    }

    const { AccordionData } = this.state

    for (let index = 0; index < AccordionData.length; index++) {
      const elementOld = AccordionData[index]
      if (elementOld.category_Name === 'Active') {
        AccordionData[elementOld.id].sub_Category = this.state.active
      } else if (elementOld.category_Name === 'Inactive') {
        AccordionData[elementOld.id].sub_Category = this.state.inactive
      } else if (elementOld.category_Name === 'Rejected') {
        AccordionData[elementOld.id].sub_Category = this.state.rejected
      }
      // else if (elementOld.category_Name === 'Expire') {
      //   AccordionData[elementOld.id].sub_Category = this.state.expire;
      // }
    }

    this.setState({ AccordionData }, function () {
      this.hideLoader()

      const { AccordionData } = this.state
      for (let index = 0; index < AccordionData.length; index++) {
        const elementOld = AccordionData[index]
        if (elementOld.category_Name === 'Active') {
          AccordionData[elementOld.id].expanded = true
        }
      }

      this.displayData()
    })
  }

  deleteProperty = key => {
    if (!global.networkConnection) return

    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        `${Http.createProperty}/${key.id}`,
        'PUT',
        user_credentials.token,
        {}
      ).then(() => {
        APICaller(
          key.active === true
            ? `${Http.deleteListing(key.id)}`
            : `${Http.activateProperty(key.id)}`,
          'POST',
          user_credentials.token,
          {}
        ).then(response => {
          if (response.status === 422) {
            this.setState({ isVisible: true })
          } else if (response.status === 200) {
            let updatedActiveList = this.state.activeList.map(res => {
              if (key.id === res.id) {
                res.active = !key.active
              }
              return res
            })
            this.setState({ active: [] }, function () {
              this.setState({ inactive: [] }, function () {
                this.setState({ rejected: [] }, function () {
                  this.setState({ expire: [] }, function () {
                    const { AccordionData } = this.state
                    for (let index = 0; index < AccordionData.length; index++) {
                      const elementOld = AccordionData[index]
                      AccordionData[elementOld.id].expanded = false
                    }
                    this.setState(
                      { activeList: updatedActiveList },
                      function () {
                        this.arrangeAllData()
                      }
                    )
                  })
                })
              })
            })
          } else {
            this.displayError()
          }
        })
      })
    }
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  deleteListing = key => {
    Alert.alert(
      'Update Status',
      'Do you really want to change status of this property ?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.deleteProperty(key) }
      ],
      { cancelable: false }
    )
  }

  distance (lat1, lon1, lat2, lon2) {
    var radlat1 = (Math.PI * lat1) / 180
    var radlat2 = (Math.PI * lat2) / 180
    var theta = lon1 - lon2
    var radtheta = (Math.PI * theta) / 180
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
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

  update_Layout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    const array = [...this.state.AccordionData]

    array[index]['expanded'] = !array[index]['expanded']

    this.setState(() => {
      return {
        AccordionData: array
      }
    })
  }

  handleReturnKeyButton = key => {
    Alert.alert(
      'Confirmation Alert',
      'Are you sure you want your key back ? Speedhome will not be able to help you for the viewing anymore. ',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.setState({ modalEditVisible: false }),
              this.props.navigation.navigate('HomeRunnerReturnKey', {
                id: key.id
              })
          }
        }
      ],
      {
        cancelable: false
      }
    )
    return true
  }

  onDeleteListing (data) {
    this.setState({ pageNumber: 0 }, function () {
      this.getActiveProperties()
    })
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }

  displayData () {
    return this.state.AccordionData.map((item, key) => (
      <Expandable_ListView
        onArchive={key => {
          this.deleteListing(key)
        }}
        key={item.category_Name}
        onClickFunction={this.update_Layout.bind(this, key)}
        item={item}
        navigation={this.props.navigation}
      />
    ))
  }

  HeaderPress (selectedNumber) {
    this.setState({ modalEditVisible: false })

    if (selectedNumber === '1') {
      this.setState({
        isOpenFirst: this.state.isOpenFirst === true ? false : true,
        isOpenSecond: false,
        isOpenThird: false,
        appoinmentOpen: false
      })
    } else if (selectedNumber === '2') {
      this.setState({
        isOpenSecond: this.state.isOpenSecond === true ? false : true,
        isOpenThird: false,
        isOpenFirst: false,
        appoinmentOpen: false
      })
    } else if (selectedNumber === '3') {
      this.setState({
        isOpenThird: this.state.isOpenThird === true ? false : true,
        isOpenFirst: false,
        isOpenSecond: false,
        appoinmentOpen: false
      })
    } else if (selectedNumber === '4') {
      this.setState({
        appoinmentOpen: this.state.appoinmentOpen === true ? false : true,
        isOpenThird: false,
        isOpenFirst: false,
        isOpenSecond: false
      })
    }
  }

  showTime (date) {
    let formatDate = date.split('T')
    let ISTdate = new Date(`${formatDate[0]}`)
    var timeString = `${formatDate[1]}`
    var H = +timeString.substr(0, 2)
    var h = H % 12 || 12
    var ampm = H < 12 || H === 24 ? ' AM' : ' PM'
    timeString = h + timeString.substr(2, 3) + ampm
    return `${ISTdate.toString().slice(4, 16)}${timeString}`
  }

  renderAppoinmentRow = (item, props) => {
    let roomType = getRoomTypeLabel(
      item.propertyDto && item.propertyDto.roomType != undefined
        ? item.propertyDto.roomType
        : ''
    )
    let formatDate = item && item.dateTime && item.dateTime.split('T')
    const { userId } = this.state
    if (userId) {
      return (
        <View>
          <View>
            {formatDate &&
              formatDate.length > 0 &&
              new Date(formatDate[0]) >= new Date() &&
              item.propertyDto.user.id === userId &&
              item.status === true && (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    marginBottom: 20
                  }}
                  accessible={true}
                  accessibilityLabel='myListingScreenImageBgbtn'
                >
                  <View style={styles.styleItem}>
                    <View style={{ alignItems: 'center', width: '90%' }}>
                      <ProgressiveImageBackground
                        source={{
                          uri:
                            item.propertyDto.images.length > 0
                              ? item.propertyDto.images[0].url
                              : No_IMAGE_LINK
                        }}
                        style={{
                          height: 240,
                          width: '100%',
                          backgroundColor: '#cccccc',
                          borderRadius: 5,
                          marginHorizontal: 10,
                          shadowColor: 'black',
                          shadowOpacity: 0.2,
                          elevation: 6,
                          shadowOffset: { width: 0, height: 4 }
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
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            {/* {item &&
                            item.propertyDto &&
                            item.propertyDto.noDeposit === true &&
                            item.propertyDto.type !== 'ROOM' ? (
                              <Image
                                source={imgNoDeposit}
                                style={{
                                  height: 60,
                                  width: 60,
                                  marginLeft: 10
                                }}
                              />
                            ) : (
                              <View></View>
                            )} */}

                            {item.propertyDto.videos &&
                            item.propertyDto.videos.length > 0 ? (
                              <Image
                                testID='contactLess'
                                source={imgContactLess}
                                style={{
                                  height: 50,
                                  width: 50,
                                  marginRight: 10
                                }}
                              />
                            ) : (
                              <View />
                            )}
                          </View>
                        </View>

                        <View
                          style={[
                            styles.styleInfo,
                            { backgroundColor: 'white', height: 90 }
                          ]}
                        >
                          <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flex: 5 }}>
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode={'tail'}
                                  style={{
                                    fontSize: 14,
                                    textAlign: 'left',
                                    paddingLeft: 10,
                                    paddingTop: 5,
                                    fontWeight: '500',
                                    color: '#000'
                                  }}
                                >
                                  {item.propertyDto.name}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                paddingLeft: 10,
                                paddingTop: 5
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
                                {item.propertyDto.type === 'ROOM'
                                  ? 'Room '
                                  : 'Whole Unit '}
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
                                  {roomType !== ''
                                    ? roomType
                                    : `${item.propertyDto.sqft} sqft`}{' '}
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
                                    this.displayPorpertyType(
                                      item.propertyDto.type.toLowerCase()
                                    )
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
                                    item.propertyDto.furnishType
                                  )}
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
                                  {item.propertyDto.bedroom
                                    ? item.propertyDto.bedroom
                                    : '0'}
                                </Text>
                              </View>
                              <View>
                                <Image
                                  testID='bedroom'
                                  source={img1}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    marginLeft: 5
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
                                  {item.propertyDto.bathroomType !== null
                                    ? this.Capitalize(
                                        item.propertyDto.bathroomType.toLowerCase()
                                      )
                                    : item.propertyDto.bathroom}
                                </Text>
                              </View>
                              <View>
                                <Image
                                  testID='bathroom'
                                  source={img2}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    marginLeft: 5
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
                                  {item.propertyDto.carpark
                                    ? item.propertyDto.carpark
                                    : '0'}
                                </Text>
                              </View>
                              <View>
                                <Image
                                  testID='carpark'
                                  source={img3}
                                  style={{
                                    height: 15,
                                    width: 15,
                                    marginLeft: 5
                                  }}
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
                                  RM {this.format(item.propertyDto.price)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </ProgressiveImageBackground>
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: 'white',
                          elevation: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingBottom: 20,
                          paddingTop: 10,
                          marginTop: -12,
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'left',
                            paddingLeft: 10,
                            fontWeight: 'bold',
                            color: '#90278E',
                            paddingBottom: 10
                          }}
                        >
                          Upcoming Appointments
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            textAlign: 'left',
                            paddingLeft: 10,
                            fontWeight: 'bold',
                            color: 'black'
                          }}
                        >
                          {this.showTime(item.dateTime)}
                        </Text>
                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 80
                          }}
                        >
                          <View
                            style={{
                              width: '30%',
                              height: '100%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <ProgressiveImage
                              testID='propertyDto'
                              source={{
                                uri:
                                  item.propertyDto &&
                                  item.propertyDto.user &&
                                  item.propertyDto.user.avatar
                                    ? item.propertyDto.user.avatar
                                    : No_IMAGE_LINK
                              }}
                              style={{
                                height: 40,
                                width: 40,
                                borderRadius: 20,
                                backgroundColor: 'grey'
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 16,
                                textAlign: 'left',
                                paddingLeft: 10,
                                fontWeight: 'bold',
                                color: 'black'
                              }}
                            >
                              {item.propertyDto.user.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
          </View>
        </View>
      )
    }
  }

  render () {
    return (
      <Container>
        {this._viewHeader()}
        <ListingTabContainer
          isListingOpen={this.state.isListingOpen}
          isFavouriteOpen={this.state.isFavouriteOpen}
          openListing={() => {
            this.setState({ isListingOpen: true, isFavouriteOpen: false })
          }}
          openFavourite={() => {
            this.setState({ isListingOpen: false, isFavouriteOpen: true })
          }}
        />
        {this.state.isLoading && (
          <View style={styles.LoaderContainer}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size='large'
              color='black'
              style={{ marginBottom: 5 }}
            />
            <Text style={styles.LoaderText}>Loading...</Text>
          </View>
        )}

        {this.state.isListingOpen && (
          <>
            <AccordionBtn
              onClick={() => this.HeaderPress('4')}
              accordionText='Upcoming Appointments'
              isOpen={this.state.appoinmentOpen}
            />

            {this.state.appoinmentOpen && (
              <View style={{ flex: 1 }}>
                <FlatList
                  keyboardShouldPersistTaps={'always'}
                  contentContainerStyle={{
                    flexGrow: 1
                  }}
                  data={this.state.appoinmentsData}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item }) =>
                    this.renderAppoinmentRow(item, this.props)
                  }
                  keyExtractor={(item, index) => index.toString()}
                  onEndReachedThreshold={1}
                  ListEmptyComponent={
                    <NoRecordComponent
                      height={Matrics.ScaleValue(50)}
                      width={Matrics.ScaleValue(50)}
                    />
                  }
                  //onEndReached={this._loadNextSetOfList}
                />
              </View>
            )}
            <AccordionBtn
              onClick={() => this.HeaderPress('1')}
              accordionText='Active Listing'
              isOpen={this.state.isOpenFirst}
            />

            {this.state.isOpenFirst && (
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => {
                  this.setState({ modalEditVisible: false })
                }}
                accessible={true}
                accessibilityLabel='myListingScreenFlatListBtn'
              >
                {this.state.AccordionData[0].sub_Category.length > 0 ? (
                  <FlatListComponent
                    data={
                      this.state.AccordionData &&
                      this.state.AccordionData.length > 0 &&
                      this.state.AccordionData[0].sub_Category
                    }
                    deleteListing={this.deleteListing}
                    modalEditVisible={this.state.modalEditVisible}
                    clickedItem={this.state.clickedItem}
                    ListFooterComponent={true}
                    openAddPropertyBtn={() => {
                      this.Standard.open()
                    }}
                    closeEditModal={() => {
                      this.setState({ modalEditVisible: false })
                    }}
                    navigation={this.props.navigation}
                    handleReturnKeyButton={key =>
                      this.handleReturnKeyButton(key)
                    }
                    clickedMoreBtn={index => {
                      this.setState({
                        modalEditVisible: true,
                        clickedItem: index
                      })
                    }}
                  />
                ) : this.state.isLoading === false ? (
                  <PostPropertyBtn
                    onClick={() => {
                      this.setState({ modalEditVisible: false }),
                        this.Standard.open()
                    }}
                  />
                ) : null}
              </TouchableOpacity>
            )}
            <AccordionBtn
              onClick={() => this.HeaderPress('2')}
              accordionText='Inactive Listing'
              isOpen={this.state.isOpenSecond}
            />

            {this.state.isOpenSecond && (
              <View style={{ flex: 1 }}>
                <FlatListComponent
                  data={
                    this.state.AccordionData &&
                    this.state.AccordionData.length > 0 &&
                    this.state.AccordionData[1].sub_Category
                  }
                  deleteListing={this.deleteListing}
                  modalEditVisible={this.state.modalEditVisible}
                  clickedItem={this.state.clickedItem}
                  closeEditModal={() => {
                    this.setState({ modalEditVisible: false })
                  }}
                  navigation={this.props.navigation}
                  handleReturnKeyButton={key => this.handleReturnKeyButton(key)}
                  clickedMoreBtn={index => {
                    this.setState({
                      modalEditVisible: true,
                      clickedItem: index
                    })
                  }}
                  ListEmptyComponent={
                    <NoRecordComponent
                      height={Matrics.ScaleValue(50)}
                      width={Matrics.ScaleValue(50)}
                    />
                  }
                />
              </View>
            )}
            <AccordionBtn
              onClick={() => this.HeaderPress('3')}
              accordionText='Rejected Listing'
              isOpen={this.state.isOpenThird}
            />

            {this.state.isOpenThird && (
              <View style={{ flex: 1 }}>
                <FlatListComponent
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={
                    this.state.AccordionData &&
                    this.state.AccordionData.length > 0 &&
                    this.state.AccordionData[2].sub_Category
                  }
                  deleteListing={this.deleteListing}
                  modalEditVisible={this.state.modalEditVisible}
                  clickedItem={this.state.clickedItem}
                  navigation={this.props.navigation}
                  closeEditModal={() => {
                    this.setState({ modalEditVisible: false })
                  }}
                  handleReturnKeyButton={key => this.handleReturnKeyButton(key)}
                  clickedMoreBtn={index => {
                    this.setState({
                      modalEditVisible: true,
                      clickedItem: index
                    })
                  }}
                  ListEmptyComponent={
                    <NoRecordComponent
                      height={Matrics.ScaleValue(50)}
                      width={Matrics.ScaleValue(50)}
                    />
                  }
                />
              </View>
            )}
          </>
        )}
        {this.state.isFavouriteOpen && <Favourites header={true} />}
        <RejectedModal
          isVisible={this.state.isVisible}
          closeModal={() => {
            this.setState({ isVisible: !this.state.isVisible })
          }}
        />
        <RBSheet
          ref={ref => {
            this.Standard = ref
          }}
          height={200}
        >
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              Please select the option, rent or sell.
            </Text>
            {this.state.lists.map(list => (
              <TouchableOpacity
                key={list.icon}
                style={styles.listButton}
                onPress={() => {
                  this.Standard.close()
                  if (list.label === 'Rent Property') {
                    analytics().logEvent(
                      trackerEventSubmit.postProperty.action
                        .clickPropertyForRent
                    )
                    logEvent(
                      trackerEventSubmit.postProperty.action
                        .clickPropertyForRent
                    )
                    this.setState({
                      modalEditVisible: false,
                      apiCallFirst: true
                    }),
                      this.props.navigation.navigate('CreateListing')
                  } else {
                    analytics().logEvent(
                      trackerEventSubmit.postProperty.action
                        .clickPropertyForSell
                    )
                    logEvent(
                      trackerEventSubmit.postProperty.action
                        .clickPropertyForSell
                    )
                    this.setState({
                      modalEditVisible: false,
                      apiCallFirst: true
                    }),
                      this.props.navigation.navigate('CreateListingSell')
                  }
                }}
                accessible={true}
                accessibilityLabel='myListingScreenListIconBtn'
              >
                <Image
                  testID='listIcon'
                  source={list.icon}
                  style={{
                    tintColor: '#000000',
                    width: 20,
                    height: 20
                  }}
                />

                <Text style={styles.listLabel}>{list.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </RBSheet>

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
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(MyListing))
