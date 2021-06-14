import React, { Component, Fragment } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
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
import Style from './styles'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005

class EditConfirmGPS extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showErrorDialog: false,
      selectedAddress: '',
      selectedAddressLat: 0,
      selectedAddressLng: 0,
      latitude: 0,
      longitude: 0,
      alertMessage: '',
      uploading_photo: false,
      latitude: '',
      longitude: ''
    }
  }

  componentDidMount () {
    const listDetails = this.props.navigation.state.params.details
    this.setState({
      latitude: listDetails.latitude,
      longitude: listDetails.longitude
    })
  }

  UNSAFE_componentWillMount () {
    if (Platform.OS == 'android') {
    } else {
      navigator.geolocation.getCurrentPosition(e => {
        this.setState({
          ...this.state,
          latitude: e.coords.latitude,
          longitude: e.coords.longitude
        })
      })
    }
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
      APICaller(
        `${Http.createProperty}/${this.props.navigation.getParam('id')}`,
        'PUT',
        user_information.token,
        JSON.stringify(body)
      ).then(response => {
        if (!response) return
        if (response.status === 200) {
          // tracker.trackEvent(
          //   trackerEventConfig.postProperty.category,
          //   trackerEventConfig.postProperty.action.createListingGPS
          // );

          analytics().logEvent(
            trackerEventSubmit.postProperty.action.clickCreateListingSubmitGPS
          )

          logEvent(
            trackerEventSubmit.postProperty.action.clickCreateListingSubmitGPS
          )
          this.setState({
            ...this.state,
            alertMessage: 'Property posted successfully.',
            uploading_photo: false
          })
          setTimeout(() => {
            this.setState({ ...this.initialState })
            this._hideAlertView()
            AsyncStorage.removeItem('avatarSource').then(() => {})
            this.props.navigation.navigate('MyListing')
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

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  render () {
    return (
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Header
          headerTitle='Confirm GPS Coordinate'
          navigation={this.props.navigation}
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
            testID='selectedAddress'
            style={Style.textInputDesign}
            editable={false}
            value={this.state.selectedAddress}
            placeholder='Drag to select address'
            accessible={true}
            accessibilityLabel='editConfirmGpsSelectAddInput'
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
            accessibilityLabel='editConfGpsPostBtn'
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

export default connect(mapStateToProps, mapDispatchToProps)(EditConfirmGPS)
