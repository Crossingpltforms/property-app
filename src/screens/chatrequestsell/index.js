import React, { Component } from 'react'
import {
  TouchableOpacity,
  TextInput,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetcoreSDK from 'smartech-react-native'
import Container from '../../components/Container'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { withNavigationFocus } from 'react-navigation'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import {
  logEvent,
  logAddToWishlist,
  logAddToCart
} from '../../util/fbAnalytics'

// Custom Components
import Header from '../common/Header'
import Style from './style'
import { NETCORE_TRACK_EVENT } from '../../common/constants'

class ChatRequestSell extends Component {
  constructor(props) {
    super(props)

    let propertyInfo = this.props.navigation.getParam('propertyInfo', {})

    this.state = {
      showErrorDialog: false,
      token: '',
      loading: false,
      phoneNumber: '',
      alertMessage: '',
      name: propertyInfo.name ? propertyInfo.name : '',
      address: propertyInfo.address ? propertyInfo.address : '',
      price: propertyInfo.price ? propertyInfo.price : '',
      propertyInfo: props.navigation.state.params.propertyInfo
    }
  }

  UNSAFE_componentWillMount() {
    this.getUserData()
  }

  getUserData() {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then((response) =>
        this.setState({
          ...this.state,
          phoneNumber: response.data.phoneNumber
        })
      )
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // AsyncStorage.getItem("accountInfo").then(user => {
      //   if (user) {
      //     let user_credentials = JSON.parse(user);
      //     this.setState({ phoneNumber: `+${user_credentials.phone}`, token: user_credentials.token });
      //   }
      // });
      this.getUserData()
    }
  }

  _updateTextInput(value) {
    // let numberPattern = /^\d+$/;

    // if (numberPattern.test(value)) {
    this.setState({ ...this.state, phoneNumber: value })
    // }
  }

  AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
        height: 80,
        bottom: '20%',
        zIndex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
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

  chatRequestApiCall = () => {
    this.setState({ ...this.state, loading: true })
    const body = {
      propertyId: this.state.propertyInfo.id
    }
    APICaller(
      Http.chatRequestEndpoint,
      'POST',
      this.state.token,
      JSON.stringify(body)
    ).then((json) => {
      if (json.status === 200) {
        this.setState({ ...this.state, loading: false })
        // tracker.trackEvent(
        //   trackerEventConfig.chatWithOwner.category,
        //   trackerEventConfig.chatWithOwner.action.submitChatRequest
        // );
        analytics().logEvent(
          trackerEventSubmit.chatWithOwner.action.submitChatRequest
        )
        logEvent(trackerEventSubmit.chatWithOwner.action.submitChatRequest)
        logAddToWishlist(
          trackerEventSubmit.chatWithOwner.action.submitChatRequest
        )

        if (
          (this.state.propertyInfo.type === 'ROOM' &&
            this.state.propertyInfo.price >= 300 &&
            this.state.propertyInfo.price <= 2000) ||
          (this.state.propertyInfo.type !== 'ROOM' &&
            this.state.propertyInfo.price >= 500 &&
            this.state.propertyInfo.price <= 5000)
        ) {
          logEvent(trackerEventSubmit.chatWithOwner.action.chatRequestSubmit1)
          //   var content = {
          //     id: this.state.propertyInfo.id,
          //     quantity: 1,
          //     name: this.state.propertyInfo.name
          //   }

          //  fbLogAddToCart(this.state.propertyInfo.price, 'product', JSON.stringify(content), 'RM')
        }
        if (this.state.propertyInfo.instantView) {
          this.toggleModal('instantViewConfirmationModalVisible', true)
        } else {
          this.showSuccessAlert()
        }
      } else {
        this.displayError()
      }
    })
  }

  addEventTracking = () => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        attr: 'ChatRequest',
        id: this.state.propertyInfo.id
      }
      APICaller(
        Http.eventTrackig,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then((json) => {
        if (json.status !== 200) {
          // TODO send to crashlytics
        }
      })
    }
  }

  showSuccessAlert = () => {
    Alert.alert(
      'Success',
      'Request send sucessfully.',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
      { cancelable: false }
    )
  }

  _hideAlertView() {
    setTimeout(() => this.setState({ ...this.state, alertMessage: '' }), 2000)
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  requestForChat() {
    if (this.state.phoneNumber === '') {
      this.setState({
        ...this.state,
        alertMessage: 'Enter your phone number'
      })
      this._hideAlertView()
    } else if (this.state.phoneNumber.length > 15) {
      this.setState({
        alertMessage: 'Please Enter Valid Number'
      })
      this._hideAlertView()
    } else if (this.state.phoneNumber.length < 6) {
      this.setState({
        alertMessage: 'Please Enter Valid Number'
      })
      this._hideAlertView()
    } else {
      if (this.props.isUserLogin == true) {
        const NetCorePayload = {
          Name: this.state.propertyInfo && this.state.propertyInfo.name,
          Phone_number:
            this.props.userLoginProfileData &&
            this.props.userLoginProfileData.phoneNumber,
          Email_address:
            this.props.userLoginProfileData &&
            this.props.userLoginProfileData.email,
          Property_value:
            this.state.propertyInfo && this.state.propertyInfo.price,
          Area_of_property:
            this.state.propertyInfo && this.state.propertyInfo.address
        }
        NetcoreSDK.track(NETCORE_TRACK_EVENT.SEND_CR, NetCorePayload)
        this.addEventTracking()
        this.chatRequestApiCall()
      } else {
        analytics().logEvent(
          trackerEventSubmit.chatWithOwner.action.questionaireSubmit
        )
        logEvent(trackerEventSubmit.chatWithOwner.action.questionaireSubmit)
        this.props.navigation.navigate('Number', {
          screenName: 'ChatRequestSell'
        })
        return
      }
    }
  }

  render() {
    return (
      <Container style={Style.header}>
        <View style={Style.root}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
          >
            {this.state.alertMessage !== '' &&
              this.AlertView(this.state.alertMessage)}
            {this.state.loading && (
              <View
                style={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 1
                }}
              >
                <ActivityIndicator size='large' />
              </View>
            )}
            <Header
              navigation={this.props.navigation}
              headerTitle='Chat Request'
              disableBackNavigation={false}
            />
            <View style={Style.textViewMiddle}>
              <Text style={Style.middleText}>{this.state.name}</Text>
              <Text style={Style.middleTextPara}>{this.state.address}</Text>
              <Text style={Style.middleBottomText}>{`RM ${
                this.state.price
              }`}</Text>
              <View style={Style.horizontalLine} />
              <Text style={Style.mobileTextFileLabel}>
                Your mobile number is
              </Text>
              <TextInput
                testID='phoneNumber'
                style={Style.textInput}
                maxLength={15}
                keyboardType={'number-pad'}
                value={this.state.phoneNumber}
                onChangeText={(val) => {
                  this.setState({ phoneNumber: val })
                }}
                accessible={true}
                accessibilityLabel='chatReqSellNumbInput'
              />
            </View>
            <View style={Style.bottomButton}>
              <View style={Style.styleViewShadow}>
                <TouchableOpacity
                  onPress={() => {
                    this.requestForChat()
                  }}
                  accessible={true}
                  accessibilityLabel='chatSellSubmitBtn'
                >
                  <Text style={Style.bottomButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData, userLoginProfileData } = loginData
  return {
    isUserLogin,
    userLoginData,
    userLoginProfileData
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ChatRequestSell))
