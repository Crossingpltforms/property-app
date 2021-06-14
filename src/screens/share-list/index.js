import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Share,
  BackHandler,
  FlatList
} from 'react-native'
import Container from '../../components/Container'
import _ from 'lodash'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { styles } from './styles'
import { getRoomTypeLabel } from '../../common/helper/common'
import Header from '../common/Header'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import PropertyCard from '../../components/property-card'
const { width, height } = Dimensions.get('window')
import { logEvent, events } from '../../util/fbAnalytics'
export default class ShareList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ourPicksList: ''
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

  handleBackButtonClick = () => {
    this.props.navigation.popToTop()
    return true
  }

  componentDidMount() {
    var pID = this.props.navigation.getParam('id')
    this.getPropertyDetail(pID)
  }

  getPropertyDetail(p_id) {
    APICaller(Http.getPropertyById(p_id), 'GET', null, '').then((response) => {
      if (response.status === 200) {
        this.setState({ ourPicksList: response.data })
      }
    })
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

  displaySearchList = (key) => {
    let roomType = getRoomTypeLabel(
      key && key.roomType != undefined ? key.roomType : ''
    )
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column'
        }}
      >
        {key && (
          <PropertyCard
            data={key}
            price={this.format(key.price)}
            roomType={roomType}
            onPress={() => {
              this.props.navigation.navigate('ListingPageDetail', {
                propertyInfo: key
              })
            }}
          />
        )}

        <View
          style={{
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <TouchableOpacity
            style={[styles.button3, { height: 35, marginRight: 10 }]}
            onPress={() => {
              this.props.navigation.navigate('ThankYou')
              analytics().logEvent(
                trackerEventSubmit.postProperty.action
                  .clickCreateListingSkipShare
              )
              logEvent(
                trackerEventSubmit.postProperty.action
                  .clickCreateListingSkipShare
              )
            }}
            accessible={true}
            accessibilityLabel='shareListThankUBtn'
          >
            <Text
              style={[
                styles.text1,
                { fontSize: 14, fontFamily: 'OpenSans-Bold' }
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.shareDetails(key)
              analytics().logEvent(
                trackerEventSubmit.postProperty.action.createListingShare
              )

              logEvent(
                trackerEventSubmit.postProperty.action.createListingShare
              )
            }}
            style={[styles.button2, { height: 35, marginLeft: 10 }]}
            accessible={true}
            accessibilityLabel='shareListAnalyticsBtn'
          >
            <Text
              style={[
                styles.text1,
                { fontSize: 14, fontFamily: 'OpenSans-Bold' }
              ]}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  shareDetails = async (key) => {
    try {
      const shareURL = `https://speedhome.com/ads/${encodeURIComponent(
        key.name
      )}-${key.ref}`
      const result = await Share.share({
        message: shareURL
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // this.props.navigation.navigate("ThankYou");
          // shared with activity type of result.activityType
        } else {
          // this.props.navigation.navigate("ThankYou");
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Header
          headerTitle='Share your listing'
          navigation={this.props.navigation}
          disableBackNavigation={true}
        />

        <View style={{ flex: 1 }}>
          <View
            style={{
              height: height * 0.8,
              width: width,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              position: 'absolute'
            }}
          >
            <ActivityIndicator
              animating={this.state.isLoading}
              size='large'
              color='grey'
            />
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {this.state.ourPicksList != '' && (
              <FlatList
                data={[0]}
                renderItem={({ item, index }) =>
                  this.displaySearchList(this.state.ourPicksList)
                }
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
      </Container>
    )
  }
}
