import React, { Component, Fragment } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import Header from '../common/Header'
import MapView from 'react-native-maps'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ErrorDialog from '../../components/ErrorDialog'

import Style from './style'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import {
  logEvent,
  fbLogCompleteRegistration,
  logUnlockAchievement
} from '../../util/fbAnalytics'

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005

class ConfirmGPS extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showErrorDialog: false,
      selectedAddress: '',
      selectedAddressLat: 0,
      selectedAddressLng: 0,
      latitude: parseFloat(this.props.navigation.state.params.allData.latitude),
      longitude: parseFloat(
        this.props.navigation.state.params.allData.longitude
      ),
      alertMessage: '',
      uploading_photo: false
    }
  }

  UNSAFE_componentWillMount () {
    let address = this.props.navigation.state.params.allData.address
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick = () => {
    this.props.navigation.popToTop()
    return true
  }

  displayError () {
    this.setState({ showErrorDialog: true })
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

  _navigateToMyListing = () => {
    this.setState({ uploading_photo: true })
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      var body = this.props.navigation.getParam('bodyData')
      if (
        this.state.selectedAddressLat != 0 &&
        this.state.selectedAddressLng != 0
      ) {
        body['latitude'] = this.state.selectedAddressLat
        body['longitude'] = this.state.selectedAddressLng
      }
      let distance = this.distance(
        this.state.selectedAddressLat,
        this.state.selectedAddressLng,
        3.139,
        101.6869
      )

      APICaller(
        `${Http.createProperty}/${this.props.navigation.getParam('id')}`,
        'PUT',
        user_information.token,
        JSON.stringify(body)
      ).then(response => {
        if (!response) return
        if (response.status === 200) {
          AsyncStorage.removeItem('UpLoadImageData')
          this.setState({
            ...this.state,
            alertMessage: 'Property posted successfully.',
            uploading_photo: false
          })

          if (
            ['LANDED', 'HIGHRISE'].indexOf(
              this.props.navigation.state.params.allData.type
            ) !== -1
          ) {
            if (distance <= 40) {
              this.props.navigation.navigate('HomeRunner', {
                id: this.props.navigation.getParam('id')
              })
            } else {
              this.props.navigation.navigate('ShareList', {
                id: this.props.navigation.getParam('id')
              })
            }
          } else {
            this.props.navigation.navigate('ShareList', {
              id: this.props.navigation.getParam('id')
            })
          }

          if (
            response.data.type == 'LANDED' ||
            response.data.type == 'HIGHRISE'
          ) {
            if (response.data.price >= 800 && response.data.price <= 5000) {
              const params = {
                propertyValue: response.data.price
              }
              var content = {
                id: response.data.id,
                quantity: 1,
                name: response.data.name
              }

              fbLogCompleteRegistration(
                response.data.price,
                'product',
                JSON.stringify(content),
                'RM'
              )

              logEvent(
                trackerEventSubmit.chatWithOwner.action.completeRegistration,
                params
              )

              analytics().logEvent(
                trackerEventSubmit.chatWithOwner.action.completeRegistration,
                params
              )
              logEvent(
                trackerEventSubmit.postProperty.action.appPostProperty,
                params
              )

              analytics().logEvent(
                trackerEventSubmit.postProperty.action.appPostProperty,
                params
              )
            }
          }

          analytics().logEvent(
            trackerEventSubmit.postProperty.action.createListingGPS
          )

          logEvent(trackerEventSubmit.postProperty.action.createListingGPS)
          analytics().logEvent(
            trackerEventSubmit.postProperty.action.createListing
          )

          logEvent(trackerEventSubmit.postProperty.action.createListing)
          logUnlockAchievement('Property Posted')

          setTimeout(() => {
            this.setState({ ...this.initialState })
            this._hideAlertView()
            AsyncStorage.removeItem('avatarSource').then(() => {})
          }, 500)
        } else {
          this.setState({
            ...this.state,
            alertMessage: response.data.message,
            uploading_photo: false
          })
          this.displayError()
        }
      })
    }
  }

  AlertView = message => {
    if (!message) return
    return (
      <View
        style={{
          position: 'absolute',
          textAlign: 'center',
          backgroundColor: '#FF0054',
          width: '90%',
          height: 80,
          bottom: '20%',
          zIndex: 1,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          opacity: 0.9
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

  _hideAlertView () {
    setTimeout(() => this.setState({ ...this.state, alertMessage: '' }), 2000)
  }

  render () {
    return (
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Header
          headerTitle='Confirm GPS Coordinate'
          navigation={this.props.navigation}
          disableBackNavigation={true}
        />

        {this.state.uploading_photo && (
          <View style={Style.uplaodPhotoLoaderContainer}>
            <View style={Style.uplaodPhotoLoaderWrapper}>
              <ActivityIndicator
                size='large'
                color='black'
                style={{ marginBottom: 5 }}
              />
              <Text style={Style.uplaodPhotoLoaderText}>Wait a moment..</Text>
              <Text style={Style.uplaodPhotoLoaderText}>updating...</Text>
            </View>
          </View>
        )}

        <View style={Style.root}>
          {this.state.alertMessage !== '' &&
            this.AlertView(this.state.alertMessage)}

          <Text style={Style.titleOne}>Address</Text>
          <TextInput
            testID='address'
            style={Style.textInputDesign}
            editable={false}
            // value={this.state.selectedAddress}
            value={this.props.navigation.state.params.allData.address}
            placeholder='Drag to select address'
            accessible={true}
            accessibilityLabel='confirmGPSAddInput'
          />
          <Text style={Style.titleTwo}>
            Drag and drop the cursor to the right location
          </Text>
          <View style={Style.map}>
            <FontAwesome
              name='map-marker'
              size={30}
              color='black'
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex: 1,
                marginTop: -30,
                marginLeft: -15
              }}
            />
            {this.state.latitude !== 0 && this.state.longitude !== 0 && (
              <MapView
                initialRegion={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                }}
                style={{ ...Style.map, marginTop: 0 }}
                onRegionChangeComplete={e => {
                  fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${e.latitude},${e.longitude}&key=AIzaSyCIajNAAz0Vo5uukUdcZK4OygIFyxrpdmE`
                  )
                    .then(res => res.json())
                    .then(json => {
                      if (json && json.results && json.results.length > 0) {
                        const addrComponent = json.results[0].address_components
                        var street_number = ''
                        var name = ''
                        var name_2 = ''
                        if (addrComponent && addrComponent != undefined) {
                          street_number =
                            addrComponent &&
                            addrComponent.address_components &&
                            addrComponent.address_components.length > 0
                              ? addrComponent.address_components[0].long_name
                              : ''
                          name =
                            addrComponent &&
                            addrComponent.address_components &&
                            addrComponent.address_components.length > 0 &&
                            addrComponent.address_components[1]
                              ? addrComponent.address_components[1].long_name
                              : ''
                          name_2 =
                            addrComponent &&
                            addrComponent.address_components &&
                            addrComponent.address_components.length > 0 &&
                            addrComponent.address_components[2]
                              ? addrComponent.address_components[2].long_name
                              : ''
                        }
                        this.setState({
                          ...this.state,
                          selectedAddress: `${street_number}, ${name}, ${name_2}`,
                          selectedAddressLat:
                            json.results[0].geometry &&
                            json.results[0].geometry.location &&
                            json.results[0].geometry.location.lat,
                          selectedAddressLng:
                            json.results[0].geometry &&
                            json.results[0].geometry.location &&
                            json.results[0].geometry.location.lng
                        })
                      }
                    })
                }}
              />
            )}
          </View>

          <TouchableOpacity
            style={Style.button2}
            onPress={this._navigateToMyListing}
            accessible={true}
            accessibilityLabel='confirmGpsPostBtn'
          >
            <Text style={{ ...Style.titleOne, marginTop: 0 }}>Post</Text>
          </TouchableOpacity>
        </View>

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
  return {
    isUserLogin,
    userLoginData
  }
}
function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmGPS)
