import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import { getRoomTypeLabel } from '../../common/helper/common'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from 'react-native-elements'
import imgDown from '../../../Images/More/drop-down-arrow.png'
// Custom Components
import Header from '../common/Header'
import ErrorDialog from '../../components/ErrorDialog'
import ProgressiveImageBackground from '../../common/components/progressiveImageBackground/index'
import ProgressiveImage from '../../common/components/progressiveImage/index'

import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
const { width, height } = Dimensions.get('window')
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'

import styles from './style'
import { No_IMAGE_LINK } from '../../common/constants'
import NoRecordComponent from '../my-listing/NoRecordComponent'
import { Matrics } from '../../common/styles'
import { withNavigationFocus } from 'react-navigation'

class MyFavourites extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      isLoading: false,
      pageNumber: 0,
      pageSize: 5,
      totalElements: 0,
      alert_message: '',
      showErrorDialog: false,
      isOpenappoinments: true,
      isFavourites: false,
      appoinmentsData: '',
      user: null
    }
  }
  handleBackButton = () => {
    this._navigationBack()
    return true
  }
  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }
  _navigationBack = () => this.props.navigation.goBack()
  componentDidMount () {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ user: user_credentials }, () => {
        this._loadListFromServer(this.state.pageNumber)
      })
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('...', prevProps.isFocused)
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({ pageNumber: 0 }, function () {
        this.setState({ list: [] }, function () {
          this._loadListFromServer(this.state.pageNumber)
        })
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true
    }
    return false
  }

  _loadListFromServer (pageNumber) {
    const { user } = this.state
    if (user) {
      this.setState({ isLoading: true })
      let requestURL = `${Http.myFavourites(
        user.userId
      )}?pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
      APICaller(requestURL, 'GET', user.token, '').then(response => {
        if (response.status === 200) {
          this.setState({
            ...this.state,
            list:
              pageNumber == 0
                ? response.data.content
                : [...this.state.list, ...response.data.content],
            isLoading: false,
            totalElements: response.data.totalElements
          })
        } else {
          this.setState({ isLoading: false })
        }
      })

      APICaller(
        Http.getAppointmentByUserId(user.userId),
        'GET',
        user.token,
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
  _loadNextSetOfList = () => {
    if (this.state.list.length < this.state.totalElements)
      this._loadListFromServer(this.state.pageNumber + 1)
    this.setState({ ...this.state, pageNumber: this.state.pageNumber + 1 })
  }
  Capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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

  displayPorpertyType (propertyType) {
    if (propertyType === 'landed_sale') {
      return 'Landed-sale'
    } else if (propertyType === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return propertyType
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
    const { user } = this.state
    return (
      <View>
        {formatDate &&
          formatDate.length > 0 &&
          new Date(formatDate[0]) >= new Date() &&
          item.propertyDto.user.id !== user.userId &&
          item.status === true && (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                marginBottom: 10
              }}
              accessible={true}
              accessibilityLabel='myFavProgImagBgBtn'
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
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        {item.propertyDto != undefined &&
                        item.propertyDto.noDeposit &&
                        item.propertyDto.noDeposit === true &&
                        item.propertyDto.type !== 'ROOM' ? (
                          <Image
                            testID='noDeposit'
                            source={imgNoDeposit}
                            style={{ height: 60, width: 60, marginLeft: 10 }}
                          />
                        ) : (
                          <View />
                        )}

                        {item.propertyDto.videos &&
                        item.propertyDto.videos.length > 0 ? (
                          <Image
                            testID='contactLess'
                            source={imgContactLess}
                            style={{ height: 50, width: 50, marginRight: 10 }}
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
                              {item.propertyDto.carpark
                                ? item.propertyDto.carpark
                                : '0'}
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
    )
  }
  removefav (id) {
    return (
      <TouchableOpacity
        style={{ zIndex: 1 }}
        onPress={() => this.removeFavouritePropertiesDetails(id)}
        accessible={true}
        accessibilityLabel='myFavIconBtn'
      >
        <Icon name='favorite' size={25} color={'red'} />
      </TouchableOpacity>
    )
  }
  renderRow = (item, props) => {
    let roomType = getRoomTypeLabel(
      item.property && item.property.roomType != undefined
        ? item.property.roomType
        : ''
    )
    let isExpired = false
    if (item.property.status === 'ACTIVE' && item.property.active === true) {
      isExpired = false
    } else if (
      item.property.status === 'ACTIVE' &&
      item.property.active === false
    ) {
      //'inactive'
      isExpired = true
    } else if (item.property.status === 'SUSPENDED') {
      isExpired = true
    } else if (item.property.status === 'EXPIRED') {
      isExpired = true
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (!isExpired) {
            this.props.navigation.navigate('ListingPageDetail', {
              propertyInfo: {
                id: item.property.id,
                propertyData: item.property,
                user: item.user,
                isfav: true,
                favItemId: item.id,
                reloadListFav: this._loadListFromServer.bind(this)
              }
            })
          } else {
            this.setState(
              {
                alert_message:
                  'This is listing is no longer available, you can un-favorite it or keep it here to see if it becomes available again in the future'
              },
              () => {
                this._hideAlertView()
              }
            )
          }
        }}
        // style={styles.favBtnContainer}
        accessible={true}
        accessibilityLabel='myFavDetailBtn'
      >
        <View style={styles.styleItem}>
          <View
            style={{ alignItems: 'center', width: '90%', position: 'relative' }}
          >
            {isExpired ? (
              <View style={styles.expiredWraper}>
                <Text style={styles.expiredText}>Unavailable !</Text>
              </View>
            ) : null}
            <ProgressiveImageBackground
              source={{
                uri:
                  item.property.images.length > 0
                    ? item.property.images[0].url
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.property != undefined &&
                  item.property.noDeposit &&
                  item.property.noDeposit === true &&
                  item.property.type !== 'ROOM' ? (
                    <Image
                      testID='noDeposit'
                      source={imgNoDeposit}
                      style={{ height: 60, width: 60, marginLeft: 10 }}
                    />
                  ) : (
                    <View />
                  )}

                  {item.property.videos && item.property.videos.length > 0 ? (
                    <Image
                      testID='contactLess'
                      source={imgContactLess}
                      style={{ height: 50, width: 50, marginRight: 10 }}
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
                      {item.property.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      alignItems: 'center',
                      paddingTop: 5,
                      paddingLeft: 5,
                      paddingRight: 5
                    }}
                  >
                    {this.removefav(item.id)}
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
                    {item.property.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
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
                        : `${item.property.sqft} sqft`}{' '}
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
                          item.property.type.toLowerCase()
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
                      {this._displayFurnishType(item.property.furnishType)}
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
                      {item.property.bedroom ? item.property.bedroom : '0'}
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
                      {item.property.bathroomType !== null
                        ? this.Capitalize(
                            item.property.bathroomType.toLowerCase()
                          )
                        : item.property.bathroom}
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
                      {item.property.carpark ? item.property.carpark : '0'}
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
                      RM {this.format(item.property.price)}
                    </Text>
                  </View>
                </View>
              </View>
            </ProgressiveImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  format (amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  removeFavouritePropertiesDetails = favItemId => {
    try {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.removeFavProperty(favItemId)}`,
          'DELETE',
          user_information.token,
          ''
        ).then(json => {
          if (json && json.status === 200) {
            this.setState(
              {
                pageNumber: 0,
                alert_message: 'Property removed from favourites'
              },
              () => {
                this._loadListFromServer(this.state.pageNumber)
              }
            )
            this._hideAlertView()
          }
        })
      }
    } catch (err) {
      alert(err)
    }
  }

  AlertView = message => {
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
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }
  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2500)
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View
        style={{ height: 0.5, width: '100%', backgroundColor: '#ffffff' }}
      />
    )
  }
  HeaderPress (selectedNumber) {
    if (selectedNumber === '1') {
      this.setState({
        isOpenappoinments: this.state.isOpenappoinments === true ? false : true,
        isFavourites: false
      })
    } else if (selectedNumber === '2') {
      this.setState({
        isFavourites: this.state.isFavourites === true ? false : true,
        isOpenappoinments: false
      })
    }
  }
  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {this.state.alert_message !== '' &&
          this.AlertView(this.state.alert_message)}
        <View style={[styles.root, { flex: 1 }]}>
          <View
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              left: 0,
              alignItems: 'center',
              alignSelf: 'center'
            }}
          >
            <ActivityIndicator
              animating={this.state.isLoading}
              size='large'
              color='grey'
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.HeaderPress('1')}
            style={styles.category_View}
            accessible={true}
            accessibilityLabel='myFavUpCommingAppBtn'
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: '#90278E'
                }}
              />
              <Text
                style={[
                  styles.text1,
                  {
                    fontSize: 17,
                    fontFamily: 'OpenSans-SemiBold',
                    marginLeft: 10
                  }
                ]}
              >
                Upcoming Appointments
              </Text>
            </View>
            <Image
              testID='down'
              source={imgDown}
              style={[
                styles.iconStyle,
                {
                  transform: this.state.isOpenappoinments
                    ? [{ rotate: '180deg' }]
                    : [{ rotate: '0deg' }]
                }
              ]}
            />
          </TouchableOpacity>
          {this.state.isOpenappoinments && (
            <FlatList
              keyboardShouldPersistTaps={'always'}
              style={{ paddingBottom: 20, paddingTop: 10, width: '100%' }}
              data={this.state.appoinmentsData}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={
                <NoRecordComponent
                  height={Matrics.ScaleValue(50)}
                  width={Matrics.ScaleValue(50)}
                />
              }
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item }) =>
                this.renderAppoinmentRow(item, this.props)
              }
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={1}
              onEndReached={this._loadNextSetOfList}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.HeaderPress('2')}
            style={styles.category_View}
            accessible={true}
            accessibilityLabel='myFavListingBtn'
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20
              }}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: '#90278E'
                }}
              />
              <Text
                style={[
                  styles.text1,
                  {
                    fontSize: 17,
                    fontFamily: 'OpenSans-SemiBold',
                    marginLeft: 10
                  }
                ]}
              >
                Favourite Listings
              </Text>
            </View>
            <Image
              testID='favorites'
              source={imgDown}
              style={[
                styles.iconStyle,
                {
                  transform: this.state.isFavourites
                    ? [{ rotate: '180deg' }]
                    : [{ rotate: '0deg' }]
                }
              ]}
            />
          </TouchableOpacity>
          {this.state.isFavourites && (
            <FlatList
              keyboardShouldPersistTaps={'always'}
              style={{
                paddingBottom: 30,
                paddingTop: 10,
                width: '100%'
              }}
              data={this.state.list}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={
                <NoRecordComponent
                  height={Matrics.ScaleValue(50)}
                  width={Matrics.ScaleValue(50)}
                />
              }
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item }) => this.renderRow(item, this.props)}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={1}
              onEndReached={this._loadNextSetOfList}
            />
          )}
        </View>
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

function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(MyFavourites))
