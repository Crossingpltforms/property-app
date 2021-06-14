import React, { Component } from 'react'

import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import imgDown from '../../Images/More/drop-down-arrow.png'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import styleBody from '../screens/my-listing/styles'
import { getRoomTypeLabel } from '../common/helper/common'
import { No_IMAGE_LINK } from '../common/constants'
import APICaller from '../util/apiCaller'
import Http from '../api/http'
// Import Images
import img1 from '../../Images/01.jpg'
import img2 from '../../Images/02.jpg'
import img3 from '../../Images/03.jpg'
import imgNoDeposit from '../../Images/UI/zero_deposit.png'
// import imgInstantView from '../../Images/UI/instant_view.png'
import imgContactLess from '../../Images/UI/icon-contactless.png'

const { height } = Dimensions.get('window')

class MyList_Expandable_ListView extends Component {
  static propTypes = {
    isLandlord: PropTypes.bool,
  }

  constructor() {
    super()
    this.state = {
      layout_Height: 0,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.expanded) {
      this.setState(() => {
        return {
          layout_Height: null,
        }
      })
    } else {
      this.setState(() => {
        return {
          layout_Height: 0,
        }
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layout_Height !== nextState.layout_Height) {
      return true
    }
    return false
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

  format(amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  displayName(status) {
    if (status === 'Active') {
      return 'Active Listing'
    } else if (status === 'Inactive') {
      return 'Inactive Listing'
    } else if (status === 'Rejected') {
      return 'Rejected Listing'
    }
    // else if (status === "Expire") {
    //     return "Expire Listing"
    // }
  }

  displayColor(status) {
    if (status === 'Active') {
      return 'green'
    } else if (status === 'Inactive') {
      return 'grey'
    } else if (status === 'Rejected') {
      return 'red'
    }
    // else if (status === "Expire") {
    //     return "yellow"
    // }
  }

  deleteListing = (key) => {
    Alert.alert(
      'Update Status',
      'Do you really want to change status of this property ?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteProperty(key) },
      ],
      { cancelable: false }
    )
  }

  deleteProperty = (key) => {
    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        key.active === true
          ? `${Http.deleteListing(key.id)}`
          : `${Http.activateProperty(key.id)}`,
        'POST',
        user_credentials.token,
        {}
      ).then((response) => {
        if (
          response.status === 403 ||
          response.status === 422 ||
          response.status === 401 ||
          response.status === 400
        ) {
          Alert.alert(response.data.message)
        } else if (response.status === 200) {
          this.setState({ pageNumber: 0 }, function() {
            // this.getActiveProperties();
          })
        }
      })
    }
  }

  renderData = (item, index) => {
    let roomType = getRoomTypeLabel(
      item && item.roomType != undefined ? item.roomType : ''
    )

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          this.props.navigation.navigate('ListingPageDetail', {
            propertyInfo: item,
          })
        }}
        accessible={true}
        accessibilityLabel='listingPageDetailBtn'
      >
        <View
          style={[styleBody.styleItem, { marginTop: 10, marginBottom: 10 }]}
        >
          <View style={{ alignItems: 'center', width: '90%' }}>
            <ImageBackground
              source={{
                uri:
                  item && item.images && item.images.length > 0
                    ? item.images[0].url
                    : No_IMAGE_LINK,
              }}
              style={{
                height: 295,
                width: '100%',
                backgroundColor: '#cccccc',
                borderRadius: 5,
                marginHorizontal: 10,
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 6,
                shadowOffset: { width: 0, height: 4 },
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
                  {item && item.noDeposit === true && item.type !== 'ROOM' ? (
                    <Image
                      testID='imgNoDeposit'
                      source={imgNoDeposit}
                      style={{ height: 60, width: 60, marginLeft: 10 }}
                    />
                  ) : (
                    <View />
                  )}

                  {item.videos && item.videos.length > 0 ? (
                    <Image
                      testID='imgContactLess'
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
                  styleBody.styleInfo,
                  {
                    height:
                      item.type.toLowerCase().includes('_sale') ||
                      item.active === false
                        ? 155
                        : 195,
                  },
                ]}
              >
                <View
                  style={{
                    width: '100%',
                    marginTop: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styleBody.txtStyle}
                  >
                    {item.name}
                  </Text>
                </View>
                <View
                  style={[
                    styleBody.styleInfo,
                    {
                      backgroundColor: 'white',
                      height:
                        item.type.toLowerCase().includes('_sale') ||
                        item.active === false
                          ? 125
                          : 165,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'column' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'left',
                          fontFamily: 'OpenSans-SemiBold',
                          color: 'green',
                        }}
                      >
                        {item.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
                      </Text>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Light',
                            color: '#000',
                          }}
                        >
                          {getRoomTypeLabel(roomType) !== ''
                            ? getRoomTypeLabel(roomType)
                            : `${item.sqft} sqft`}{' '}
                          |
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Light',
                            color: '#000',
                          }}
                        >
                          {' '}
                          {this.Capitalize(
                            this.displayPorpertyType(item.type)
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
                            color: '#000',
                          }}
                        >
                          {' '}
                          {this._displayFurnishType(item.furnishType)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingTop: 10,
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
                          {item.bedroom}
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
                            color: '#000',
                          }}
                        >
                          {item.bathroomType !== null
                            ? this.Capitalize(item.bathroomType.toLowerCase())
                            : item.bathroom}
                        </Text>
                      </View>
                      <View>
                        <Image
                          testID='carpark'
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
                            color: '#000',
                          }}
                        >
                          {item.carpark}
                        </Text>
                      </View>
                      <View>
                        <Image
                          testID='price'
                          source={img3}
                          style={{ height: 15, width: 15, marginLeft: 5 }}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            paddingLeft: 10,
                            fontWeight: '500',
                            color: '#90278E',
                          }}
                        >
                          RM {this.format(item.price)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styleBody.button2,
                        { height: 35, marginRight: 10 },
                      ]}
                      onPress={() => {
                        this.props.navigation.navigate('Editlisting', {
                          details: item,
                        })
                      }}
                      accessible={true}
                      accessibilityLabel='editListingBtn2'
                    >
                      <Text
                        style={[
                          styleBody.text1,
                          { fontSize: 14, fontFamily: 'OpenSans-Bold' },
                        ]}
                      >
                        Edit Listing
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.onArchive(item)
                      }}
                      style={[
                        styleBody.button3,
                        { height: 35, marginLeft: 10 },
                      ]}
                      accessible={true}
                      accessibilityLabel='reActivateArchiveBtn'
                    >
                      <Text
                        style={[
                          styleBody.text1,
                          { fontSize: 14, fontFamily: 'OpenSans-Bold' },
                        ]}
                      >
                        {item.active === false ? 'Reactivate' : 'Archive'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {item.type.toLowerCase().includes('_sale') ||
                  item.active === false ? (
                    <View />
                  ) : (
                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styleBody.button2,
                          {
                            height: 35,
                            backgroundColor: '#4885ED',
                            width: 146,
                          },
                        ]}
                        onPress={() => {
                          this.props.navigation.navigate('TenantSearch', {
                            latitude: item.latitude || 0,
                            longitude: item.longitude || 0,
                            propertyId: item.id,
                          })
                        }}
                        accessible={true}
                        accessibilityLabel='searchForTenantBtn2'
                      >
                        <Text
                          style={[
                            styleBody.text1,
                            {
                              fontSize: 14,
                              fontFamily: 'OpenSans-Bold',
                              color: '#FFFFFF',
                            },
                          ]}
                        >
                          Search for tenant
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    )
    // }
  }

  render() {
    return (
      <View style={{}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.category_View}
          accessible={true}
          accessibilityLabel='myListExpandableListBtn'
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}
          >
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: this.displayColor(
                  this.props.item.category_Name
                ),
              }}
            />

            <Text
              style={[
                styleBody.text1,
                {
                  fontSize: 17,
                  fontFamily: 'OpenSans-SemiBold',
                  marginLeft: 10,
                },
              ]}
            >
              {this.displayName(this.props.item.category_Name)}
            </Text>
          </View>

          <Image
            testID='imgDown'
            source={imgDown}
            style={[
              styles.iconStyle,
              {
                transform: this.props.item.expanded
                  ? [{ rotate: '180deg' }]
                  : [{ rotate: '0deg' }],
              },
            ]}
          />
        </TouchableOpacity>

        <View
          style={{
            height: this.state.layout_Height == null ? height - 200 : 0,
          }}
        >
          <FlatList
            data={this.props.item.sub_Category}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <View>{this.renderData(item)}</View>}
            contentContainerStyle={{}}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyList_Expandable_ListView)

const styles = StyleSheet.create({
  iconStyle: {
    width: 15,
    height: 18,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#000',
  },
  category_Text: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    padding: 10,
  },
  category_View: {
    paddingVertical: 5,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000',
    padding: 10,
  },
  dividerStyle: {
    backgroundColor: '#CBCBCB',
    width: '100%',
    height: 1,
  },
  textStyleHousingType: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
})
