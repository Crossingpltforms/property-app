import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import * as _ from 'lodash'

import styles from './styles'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import { Matrics } from '../../common/styles'
import { Icon } from 'react-native-elements'
import { getRoomTypeLabel } from '../../common/helper/common'
import { No_IMAGE_LINK } from '../../common/constants'
import ErrorDialog from '../../components/ErrorDialog'
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
import DetailsMap from '../Detail/DetailsMap'
import ExtrainfoStyle from '../Detail/styles'

export default class ChatInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isMapReady: false,
      showErrorDialog: false,
      text1: '',
      users: props.navigation.state.params.users,
      currentUserId: props.navigation.state.params.userId,
      userId: '',
      chatCoversationId: props.navigation.state.params.chatCoversationId,
      userData: '',
      currentUserData: '',
      propertyData: '',
      income: '',
      isLandlord: false,
      loading_photo: false,
      specificUserFromMessageLink:
        props.navigation.state.params.specificUserFromMessageLink,
      specificUserFromMessageId:
        props.navigation.state.params.specificUserFromMessageId
    }
  }

  componentDidMount () {
    this.getInfo()
  }

  getInfo () {
    this.setState({ loading_photo: true })
    AsyncStorage.getItem('accountInfo').then(res => {
      if (res) {
        let user_credentials = JSON.parse(res)
        this.setState({
          token: user_credentials.token,
          currentUserId: user_credentials.userId
        })
        APICaller(
          `${Http.getPropertyInfo(this.state.chatCoversationId)}`,
          'GET',
          user_credentials.token,
          ''
        ).then(json => {
          if (json.status === 200) {
            this.setState({ loading_photo: false })
            this.setState({ propertyData: json.data.property })

            if (
              json.data.property == null ||
              this.state.currentUserId == json.data.property.user.id
            ) {
              this.setState({ isLandlord: false }, () => {
                this.getUserData(
                  this.state.specificUserFromMessageLink
                    ? this.state.specificUserFromMessageId
                    : json.data.user.id
                )
              })
            } else {
              this.setState({ isLandlord: true }, () => {
                this.getUserData(
                  this.state.specificUserFromMessageLink
                    ? this.state.specificUserFromMessageId
                    : json.data.property.user.id
                )
              })
            }
          } else {
            this.setState({ loading_photo: false })
            this.displayError()
          }
        })
      }
    })
  }

  getUserData (userID) {
    AsyncStorage.getItem('accountInfo').then(res => {
      if (res) {
        let user_credentials = JSON.parse(res)
        this.setState({ token: user_credentials.token })
        APICaller(
          `${Http.profileDetails(userID)}/profile/view`,
          'GET',
          user_credentials.token,
          ''
        ).then(json => {
          if (json.status === 200) {
            if (json.data.monthlyIncome === 1999) {
              this.setState({ income: 'Less than 2k' })
            } else if (json.data.monthlyIncome === 2000) {
              this.setState({ income: '2k - 4k' })
            } else if (json.data.monthlyIncome === 4000) {
              this.setState({ income: '4k - 8k' })
            } else if (json.data.monthlyIncome === 8000) {
              this.setState({ income: 'More than 8k' })
            }

            this.setState({ userData: json.data })
          } else {
            this.displayError()
          }
        })
      }
    })
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader () {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'center'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='chatInfoArrowLeftBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
            <Text
              style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  _viewInfo () {
    if (this.state.propertyData !== '' && this.state.userData !== '') {
      var key = this.state.propertyData

      let roomType = getRoomTypeLabel(
        key && key.roomType != undefined ? key.roomType : ''
      )

      return (
        <ScrollView
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            flexDirection: 'column'
          }}
          showsVerticalScrollIndicator={false}
        >
          {this.state.loading_photo && (
            <View style={styles.LoaderContainer}>
              <View style={styles.LoaderWrapper}>
                <ActivityIndicator
                  animating={this.state.loading_photo}
                  size='large'
                  color='black'
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.LoaderText}>Loading...</Text>
              </View>
            </View>
          )}

          <View style={{ paddingBottom: 50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                testID='userData'
                style={styles.profileImg}
                source={{
                  uri:
                    this.state.userData && this.state.userData.avatar
                      ? this.state.userData.avatar
                      : No_IMAGE_LINK
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  paddingLeft: Matrics.ScaleValue(10)
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: 'grey',
                    borderRadius: 10,
                    width: Matrics.ScaleValue(100),
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingBottom: 2,
                    paddingTop: 2
                  }}
                >
                  <Text
                    style={[
                      styles.TextStyleHeaderTag,
                      {
                        fontSize: Matrics.ScaleValue(12),
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }
                    ]}
                  >
                    {this.state.isLandlord === false ? 'TENANT' : 'LANDLORD'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.TextStyleHeaderTag, {}]}>
                    {this.state.userData.name}
                  </Text>
                  {this.state.isLandlord === false &&
                  this.state.userData.stats.documentVerified === true ? (
                    <Image
                      testId='verifiedUser'
                      source={verifiedTick}
                      style={styles.verifiedIcon}
                    />
                  ) : null}
                </View>
                <Text style={styles.respondTimeText}>
                  Typically replies (
                  {_.get(
                    this.state,
                    'userData.stats.responseSpeed',
                    'more than 2 days'
                  )}
                  )
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.TextStyleHeaderTag,
                {
                  marginTop: 25,
                  fontFamily: 'OpenSans-Bold',
                  fontSize: Matrics.ScaleValue(18)
                }
              ]}
            >
              Personal detail
            </Text>

            {this.state.userData.cityOfLiving === null ? (
              <View />
            ) : (
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    {
                      fontSize: Matrics.ScaleValue(13),
                      fontFamily: 'OpenSans-SemiBold',
                      flex: 1
                    }
                  ]}
                >
                  Location
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.cityOfLiving === null
                    ? 'Kuala Lumpur, Malaysia'
                    : this.state.userData.cityOfLiving}
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.cityOfLiving === null
                    ? 'Kuala Lumpur, Malaysia'
                    : this.state.userData.cityOfLiving}
                </Text>
              </View>
            )}

            {this.state.userData.country === null ? (
              <View />
            ) : (
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    {
                      fontSize: Matrics.ScaleValue(13),
                      fontFamily: 'OpenSans-SemiBold',
                      flex: 1
                    }
                  ]}
                >
                  Nationality
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.country}
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.country}
                </Text>
              </View>
            )}

            {/* {
              this.state.userData.type === 0
                ?
                <View style={{ flexDirection: 'row', marginTop: 20, }} >
                  <Text style={[styles.TextStyleHeaderTag, { fontSize: Matrics.ScaleValue(13), fontFamily: 'OpenSans-SemiBold', flex: 1 }]}>Age</Text>
                  <Text style={[styles.TextStyleHeaderTag, { fontSize: Matrics.ScaleValue(13), flex: 1.2 }]}>10</Text>
                </View>
                :
                <View></View>
            } */}

            {this.state.userData.gender === null ? (
              <View />
            ) : (
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    {
                      fontSize: Matrics.ScaleValue(13),
                      fontFamily: 'OpenSans-SemiBold',
                      flex: 1
                    }
                  ]}
                >
                  Gender
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.gender === null
                    ? 'Male'
                    : this.state.userData.gender}
                </Text>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                  ]}
                >
                  {this.state.userData.gender === null
                    ? 'Male'
                    : this.state.userData.gender}
                </Text>
              </View>
            )}

            <View
              style={{
                marginTop: 25,
                backgroundColor: 'rgba(187, 187, 187, 1)',
                height: 0.5
              }}
            />

            {this.state.isLandlord === false ? (
              <View style={{}}>
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    {
                      marginTop: 25,
                      fontFamily: 'OpenSans-Bold',
                      fontSize: Matrics.ScaleValue(18)
                    }
                  ]}
                >
                  Additional info
                </Text>

                {this.state.userData.occupation === null ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      Occupation
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.occupation === null
                        ? 'Agent'
                        : this.state.userData.occupation}
                    </Text>
                  </View>
                )}

                {this.state.userData.companyName === null ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      Employer name
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.companyName === null
                        ? 'Walt Disney'
                        : this.state.userData.companyName}
                    </Text>
                  </View>
                )}

                {this.state.userData.contractType === null ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      Type of employment
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.contractType === null
                        ? 'Permanent'
                        : this.state.userData.contractType}
                    </Text>
                  </View>
                )}

                {this.state.userData.monthlyIncome === null ||
                this.state.userData.monthlyIncome === 0 ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      Monthly income
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.income}
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.income}
                    </Text>
                  </View>
                )}

                {this.state.userData.paxNumber === null ||
                this.state.userData.paxNumber === 0 ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      No of pax
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.paxNumber === null
                        ? '2'
                        : this.state.userData.paxNumber}
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.paxNumber === null
                        ? '2'
                        : this.state.userData.paxNumber}
                    </Text>
                  </View>
                )}

                {this.state.userData.reasonForMove === null ? (
                  <View />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        {
                          fontSize: Matrics.ScaleValue(13),
                          fontFamily: 'OpenSans-SemiBold',
                          flex: 1
                        }
                      ]}
                    >
                      Reason for move
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.reasonForMove === null
                        ? 'Bigger house'
                        : this.state.userData.reasonForMove}
                    </Text>
                    <Text
                      style={[
                        styles.TextStyleHeaderTag,
                        { fontSize: Matrics.ScaleValue(13), flex: 1.2 }
                      ]}
                    >
                      {this.state.userData.reasonForMove === null
                        ? 'Bigger house'
                        : this.state.userData.reasonForMove}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    marginTop: 25,
                    backgroundColor: 'rgba(187, 187, 187, 1)',
                    height: 0.5
                  }}
                />
              </View>
            ) : (
              <View />
            )}

            <Text
              style={[
                styles.TextStyleHeaderTag,
                {
                  marginTop: 25,
                  fontFamily: 'OpenSans-Bold',
                  fontSize: Matrics.ScaleValue(20)
                }
              ]}
            >
              Listing
            </Text>
            {this.renderViewListingSection(roomType, key)}
          </View>
          <View style={{ marginBottom: 10 }}>
            <DetailsMap
              onMapReady={() => this.setState({ isMapReady: true })}
              isMapReady={this.state.isMapReady}
              ExtrainfoStyle={ExtrainfoStyle}
              containerStyle={{ paddingLeft: 0 }}
              propertyInfo={this.state.propertyData}
              yPosition={y => this.setState({ yPos: y })}
            />
          </View>

          <ErrorDialog
            modalVisible={this.state.showErrorDialog}
            headerText='Oops!'
            bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
            toggleModal={value => {
              this.setState({ showErrorDialog: false })
            }}
          />
        </ScrollView>
      )
    } else {
      return (
        <View>
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

  renderViewListingSection = (roomType, key) => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => this.onListingPress()}
        accessible={true}
        accessibilityLabel='chatInfoPropImageBtn'
      >
        <Image
          testID='propertyImg'
          style={[styles.propertyImg, { marginTop: 25 }]}
          source={{
            uri:
              this.state.propertyData.images &&
              this.state.propertyData.images.length > 0
                ? this.state.propertyData.images[0].url
                : No_IMAGE_LINK
          }}
        />
        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[
              styles.StyleHeaderTag,
              {
                width: '90%',
                marginTop: 10,
                color: '#000',
                fontSize: Matrics.ScaleValue(15)
              }
            ]}
          >
            {this.state.propertyData.name}
          </Text>

          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
                    : `${this.state.propertyData.sqft} sqft`}{' '}
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
                    this.displayPorpertyType(this.state.propertyData.type)
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
                    this.state.propertyData.furnishType
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'center'
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, textAlign: 'left', color: '#000' }}
                >
                  {key.bedroom}
                </Text>
              </View>
              <View>
                <Image
                  testId='bedroom'
                  source={img1}
                  style={{ height: 15, width: 15, marginLeft: 5 }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                    paddingLeft: 20
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
                    paddingLeft: 20,
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
            </View>

            {/* <View style={{ marginTop: 5, flexDirection: 'row', width: "65%" }} > */}
            <Text
              style={{
                fontSize: 12,
                textAlign: 'left',
                fontFamily: 'OpenSans-SemiBold',
                color: 'green',
                flex: 1,
                marginTop: 5
              }}
            >
              {this.state.propertyData.type === 'ROOM'
                ? 'Room '
                : 'Whole Unit '}
            </Text>

            <View
              style={{
                flex: 1,
                textAlign: 'left',
                marginRight: 10,
                marginTop: 5
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'left',
                  fontWeight: '500',
                  color: '#90278E'
                }}
              >
                RM {key.price}
              </Text>
            </View>
            {/* </View> */}

            {/* <TouchableOpacity>
    <Text style={[styles.StyleHeaderTag, { marginTop: 20, color: "red", fontSize: Matrics.ScaleValue(15) }]}>Report Agent</Text>
  </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onListingPress = () => {
    const { propertyData } = this.state
    APICaller(Http.getPropertyById(propertyData.id), 'GET', null, '').then(
      response => {
        if (response.status === 200) {
          if (
            response.data.status === 'ACTIVE' &&
            response.data.active === true
          ) {
            this.props.navigation.navigate('ListingPageDetail', {
              propertyInfo: response.data
            })
          } else {
            this.props.navigation.navigate('KeywordSearchList', {
              locationString: propertyData.name,
              similarListing: true
            })
          }
        }
      }
    )
  }

  render () {
    return (
      <Container style={styles.header}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {this._viewHeader()}

          {this._viewInfo()}
        </View>
      </Container>
    )
  }
}
