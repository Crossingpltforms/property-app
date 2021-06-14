import React, { Component } from 'react'
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import { withNavigationFocus } from 'react-navigation'
import Http from '../../api/http'
import APICaller from '../../util/apiCaller'
import ErrorDialog from '../../components/ErrorDialog'
import CustomInteractionManager from '../../util/CustomInteractionManager'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import {
  events,
  logEvent,
  logAddToWishlist,
  fbLogAddToCart,
} from '../../util/fbAnalytics'
// Import style
import ExtrainfoStyle from './styles'

// Import Images
import img1 from '../../../Images/01.jpg'
import img2 from '../../../Images/02.jpg'
import img3 from '../../../Images/03.jpg'
// import imgNoDeposit from "../../../Images/UI/zero_deposit.png";
// import imgInstantView from "../../../Images/UI/instant_view.png"
import imgReqSent from '../../../Images/GroupAppointmentModal/IC_REQUEST_SENT.png'

import { getRoomTypeLabel } from '../../common/helper/common'
import { Matrics } from '../../common/styles'
import { No_IMAGE_LINK } from '../../common/constants'

const { width, height } = Dimensions.get('window')

class MultipleCRListing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showErrorDialog: false,
      isLogin: false,
      alert_message: null,
      page: 0,
      relatedPropertiesList: '',
      userId: '',
      loading_photo: false,
      propertyInfo: props.navigation.state.params.propertyInfo.propertyData
        ? props.navigation.state.params.propertyInfo.propertyData
        : props.navigation.state.params.propertyInfo,
      token: '',
      selectedList: [],

      budget: props.navigation.state.params.budget,
      myCountry: props.navigation.state.params.myCountry,
      movingDate: props.navigation.state.params.movingDate,
      occupation: props.navigation.state.params.occupation,
      CRresponseCount: 0,
      onSelect: '',
    }
  }

  componentDidMount() {
    CustomInteractionManager.runAfterInteractions(() => {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        this.setState({
          userId: (user_information && user_information.userId) || '',
          isLogin: user_information ? true : false,
        })
      }
      this.getUserData()
      this.getRelatedProperties()
    })
  }

  chatRequestApiCall = (id) => {
    const body = {
      budget: this.state.budget,
      fromCountry: this.state.myCountry,
      movingDate: this.state.movingDate,
      noDeposit: true,
      occupation: this.state.occupation,
      propertyId: id,
      relationship: 'string',
    }
    APICaller(
      Http.chatRequestEndpoint,
      'POST',
      this.state.token,
      JSON.stringify(body)
    ).then((json) => {
      if (json.status === 200) {
        // tracker.trackEvent(
        //   trackerEventConfig.chatWithOwner.category,
        //   trackerEventConfig.chatWithOwner.action.submitChatRequest
        // );

        analytics().logEvent(
          trackerEventSubmit.chatWithOwner.action.submitChatRequest
        )

        logEvent(trackerEventSubmit.chatWithOwner.action.submitChatRequest)
        logAddToWishlist(trackerEventSubmit.chatWithOwner.action.submitChatRequest)
        if (
          this.state.propertyInfo.type !== 'ROOM' &&
          this.state.propertyInfo.price >= 500 &&
          this.state.propertyInfo.price <= 5000
        ) {
          analytics().logEvent(
            trackerEventSubmit.chatWithOwner.action.submitChatRequestNoDeposit
          )
          logEvent(trackerEventSubmit.chatWithOwner.action.submitChatRequestNoDeposit)
        }

        if (
          (this.state.propertyInfo.type === 'ROOM' &&
            this.state.propertyInfo.price >= 300 &&
            this.state.propertyInfo.price <= 2000) ||
          (this.state.propertyInfo.type !== 'ROOM' &&
            this.state.propertyInfo.price >= 500 &&
            this.state.propertyInfo.price <= 5000)
        ) {

          logEvent(
            trackerEventSubmit.chatWithOwner.action.chatRequestSubmit1
          )
          // var content = {
          //   id: this.state.propertyInfo.id,
          //   quantity: 1,
          //   name: this.state.propertyInfo.name
          // }


          // fbLogAddToCart(this.state.propertyInfo.price, 'product', JSON.stringify(content), 'RM')
        }

        const count = this.state.CRresponseCount + 1
        this.setState({ CRresponseCount: count })

        if (count === this.state.selectedList.length) {
          this.setState({ loading_photo: false })
          this.onSubmitOrClose()
        }
      } else {
        this.setState({ loading_photo: false })
        this.displayError()
      }
    })
  }

  getRelatedProperties = () => {
    const body = {
      propertyId: this.state.propertyInfo.id,
      pageNumber: this.state.page,
      pageSize: 6,
    }
    APICaller(
      Http.relatedPropertiesEndPoint,
      'POST',
      '',
      JSON.stringify(body)
    ).then((json) => {
      if (json.status === 403 || json.status === 422 || json.status === 401) {
        Alert.alert(json.data.message)
      } else if (json.status === 200) {
        this.setState({ totalElements: json.data.totalElements })
        if (this.state.relatedPropertiesList.length > 0) {
          var arr = this.state.relatedPropertiesList.concat(json.data.content)
          this.setState({ relatedPropertiesList: arr })
        } else {
          this.setState({ relatedPropertiesList: json.data.content })
        }
        // this._ViewPropertiesSlider();

        for (
          let index = 0;
          index < this.state.relatedPropertiesList.length;
          index++
        ) {
          const element = this.state.relatedPropertiesList[index]
          element['isSelected'] = false
        }

        this._viewRecommondedProperties()
      }
    })
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.getRelatedProperties()
      }
    )
  }

  _toggleCheckBox = (key_name, value, form_state) => () =>
    this.setState({
      [form_state]: { ...this.state[form_state], [key_name]: value },
    })

  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  AlertView = (message) => {
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
          opacity: 0.8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: 'white',
          }}
        >
          {message.replace('null', 'empty')}
        </Text>
      </View>
    )
  }

  displayPorpertyType() {
    if (
      this.state.propertyInfo &&
      this.state.propertyInfo.type.toLowerCase() === 'landed_sale'
    ) {
      return 'Landed-sale'
    } else if (
      this.state.propertyInfo &&
      this.state.propertyInfo.type.toLowerCase() === 'highrise_sale'
    ) {
      return 'Highrise-sale'
    } else {
      return (
        this.state.propertyInfo && this.state.propertyInfo.type.toLowerCase()
      )
    }
  }

  _displayFloor() {
    if (
      this.state.propertyInfo &&
      (this.state.propertyInfo.type === 'LANDED' ||
        this.state.propertyInfo.type.toLowerCase() === 'landed_sale')
    ) {
      if (this.state.propertyInfo.storeys === 1) return '|Single Storey'
      if (this.state.propertyInfo.storeys === 2) return '|Double Storey'
      return '|More than 2 Storeys'
    }

    if (this.state.propertyInfo.level) {
      if (
        Math.floor(parseInt(this.state.propertyInfo.level) / 10) ===
        Math.round(parseInt(this.state.propertyInfo.level) / 10) &&
        parseInt(this.state.propertyInfo.level) % 10 !== 0
      ) {
        return `|Floor level: ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0}`
        ) + 1} - ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0`
        ) + 5}`
      } else {
        return `|Floor level: ${parseInt(
          `${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0` - 5
        ) + 1} - ${Math.round(parseInt(this.state.propertyInfo.level) / 10)}0`
      }
    } else {
      return `|Floor level: ${this.state.propertyInfo.level}`
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

  calculatePrice(price) {
    const {
      rentalPeriod,
      rentalPeriodValue,
    } = this.props.navigation.state.params
    if (rentalPeriod != null && rentalPeriod != undefined) {
      const finalPrice =
        rentalPeriod != null && rentalPeriod == '12'
          ? parseInt((price / 12) * parseInt(rentalPeriod))
          : price + parseInt((price * rentalPeriodValue) / 100)
      return finalPrice
    } else {
      return this.state.propertyInfo.price
    }
  }

  format(amount) {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  press = (key) => {
    const arr = this.state.relatedPropertiesList
    arr.map((item) => {
      if (item.id === key.id) {
        item.isSelected = !item.isSelected
        if (item.isSelected === true) {
          this.state.selectedList.push(item)
        } else if (item.isSelected === false) {
          const i = this.state.selectedList.indexOf(item)
          if (i != -1) {
            this.state.selectedList.splice(i, 1)
            return this.state.selectedList
          }
        }
      }
    })
    this.setState({ relatedPropertiesList: this.state.relatedPropertiesList })
  }

  onSelect = (propertyData) => {
    if (propertyData.propertyData.isSelected === false) {
      this.press(propertyData.propertyData)
    }
  }

  onSubmitOrClose() {
    const { navigation } = this.props
    navigation.goBack()
    navigation.state.params.handleBackFromMultipleCR({
      propertyData: this.state.propertyData,
    })
  }

  _ViewPropertiesSlider(key, index) {
    let roomType = getRoomTypeLabel(
      key && key.roomType != undefined ? key.roomType : ''
    )

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('MultipleCRDetail', {
            propertyInfo: key,
            onSelect: this.onSelect,
          })
        }}
        accessible={true}
        accessibilityLabel='multiChatCrDetailBtn'
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginLeft: 10,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.press(key)
            }}
            accessible={true}
            accessibilityLabel='multiChatCheckBoxBtn'
          >
            <Icon
              name={key.isSelected ? 'check-box' : 'check-box-outline-blank'}
              size={Matrics.ScaleValue(25)}
              color='#00D392'
            />
          </TouchableOpacity>

          <Image
            testID='key'
            resizeMode='cover'
            source={{
              uri:
                key && key.images && key.images.length > 0
                  ? key.images[0].url
                  : No_IMAGE_LINK,
            }}
            style={{
              height: Matrics.ScaleValue(100),
              width: Matrics.ScaleValue(100),
              borderColor: 'grey',
              borderWidth: 1,
              marginLeft: 5,
            }}
          />

          <View style={{ flexDirection: 'column' }}>
            <View
              style={{
                flexDirection: 'column',
                paddingLeft: 10,
                marginTop: 5,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{
                  fontSize: 14,
                  width: width * 0.55,
                  textAlign: 'left',
                  fontWeight: '500',
                  color: 'black',
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
                  color: 'red',
                }}
              >
                RM {this.format(key.price)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                paddingTop: 5,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: 'left',
                    fontFamily: 'OpenSans-Light',
                    color: '#000',
                  }}
                >
                  {roomType !== '' ? roomType : `${key.sqft} sqft`} |
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: 'left',
                    fontFamily: 'OpenSans-Light',
                    color: '#000',
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
                    color: '#000',
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
                    color: '#000',
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
                    color: '#000',
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
        <View
          style={{
            margin: 10,
            backgroundColor: 'grey',
            height: 0.7,
            width: width,
          }}
        />
      </TouchableOpacity>
    )
  }

  displayPorpertiesType(propertyType) {
    if (propertyType === 'landed_sale') {
      return 'Landed-sale'
    } else if (propertyType === 'highrise_sale') {
      return 'Highrise-sale'
    } else {
      return propertyType
    }
  }

  _viewFlatList() {
    return (
      <View style={{ width: '100%' }}>
        {/* {this._ViewPropertiesSlider()} */}
        <FlatList
          style={{ paddingBottom: 20 }}
          extraData={this.state}
          data={this.state.relatedPropertiesList}
          renderItem={({ item, index }) => (
            <View>{this._ViewPropertiesSlider(item, index)}</View>
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.mySeparator}
        // onEndReachedThreshold={1}
        // onEndReached={() => {
        //   if (
        //     this.state.relatedPropertiesList.length !==
        //     this.state.totalElements
        //   ) {
        //     {
        //       this.handleLoadMore();
        //     }
        //   }
        // }}
        />
      </View>
    )
  }

  _viewRecommondedProperties() {
    if (this.state.relatedPropertiesList.length > 0) {
      return (
        <View
          style={[
            ExtrainfoStyle.furnishingView,
            { alignItems: 'center', marginTop: 25 },
          ]}
        >
          {this._viewFlatList()}
        </View>
      )
    }
  }

  onPressNext(isSale) {
    // tracker.trackEvent(
    //   trackerEventConfig.chatWithOwner.category,
    //   trackerEventConfig.chatWithOwner.action.createChatRequest
    // )
    analytics().logEvent(
      trackerEventSubmit.chatWithOwner.action.createChatRequest
    )

    logEvent(trackerEventSubmit.chatWithOwner.action.createChatRequest)

    if (this.state.selectedList.length > 0) {
      this.setState({ loading_photo: true })
      for (let index = 0; index < this.state.selectedList.length; index++) {
        const element = this.state.selectedList[index]
        this.chatRequestApiCall(element.id)
      }
    } else {
      Alert.alert(
        'Error',
        'Altease select one property',
        [
          {
            text: 'OK',
            onPress: () => { },
          },
        ],
        { cancelable: false }
      )
    }
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
      ).then((response) => {
        this.setState({ myCountry: response.data.country })
      })
    }
  }

  _displayMultipleCRButton() {
    return this.state.propertyInfo.user.id === this.state.userId ? (
      <View />
    ) : (
        <View style={ExtrainfoStyle.bottomButton}>
          <View style={ExtrainfoStyle.styleViewShadow}>
            <TouchableOpacity
              onPress={() => this.onPressNext()}
              accessible={true}
              accessibilityLabel='multiChatNextBtn'
            >
              {/* <TouchableOpacity onPress={() => this.registerNumber()}> */}
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 15,
                  textAlign: 'center',
                  color: '#000',
                }}
              >
                Send Chat Request Now
            </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
  }

  _navigationBack = () => this.props.navigation.goBack()

  render() {
    return (
      <View ref='_view'>
        {this.state.alert_message !== '' &&
          this.AlertView(this.state.alert_message)}

        {this.state.loading_photo && (
          <View style={ExtrainfoStyle.LoaderContainer}>
            <View style={ExtrainfoStyle.LoaderWrapper}>
              <ActivityIndicator
                animating={this.state.loading_photo}
                size='large'
                color='black'
                style={{ marginBottom: 5 }}
              />
              <Text style={ExtrainfoStyle.LoaderText}>Loading...</Text>
            </View>
          </View>
        )}

        {
          <View
            style={{ height: height, width: width, backgroundColor: '#FFF' }}
          >
            <View style={{ height: '100%', flexDirection: 'column' }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#FFE100',
                  height: 40,
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => this.onSubmitOrClose()}
                  style={{ paddingRight: 15, paddingLeft: 10 }}
                  accessible={true}
                  accessibilityLabel='multiChatMsgClearBtn'
                >
                  <Icon name='clear' size={30} style={{ color: '#000' }} />
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={ExtrainfoStyle.headerText}>Message Sent!</Text>

                <Image
                  testID='modalImage'
                  style={ExtrainfoStyle.modalImageView}
                  source={imgReqSent}
                  resizeMode={'contain'}
                />

                <Text
                  style={[
                    ExtrainfoStyle.headerText,
                    {
                      fontSize: Matrics.ScaleValue(14),
                      fontFamily: 'OpenSans-Regular',
                    },
                  ]}
                >
                  Most people enquire around 10 listings {'\n'} before they find
                  their dream home!
                </Text>

                <Text
                  style={[
                    ExtrainfoStyle.headerText,
                    { marginTop: Matrics.ScaleValue(20) },
                  ]}
                >
                  People also enquired on
                </Text>
              </View>

              <View style={{ height: height * 0.5 }}>
                {this._viewRecommondedProperties()}
              </View>

              {this._displayMultipleCRButton()}
            </View>

            {this.state.alert_message !== '' &&
              this.AlertView(this.state.alert_message)}
          </View>
        }

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
            this.onSubmitOrClose()
          }}
        />
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
)(withNavigationFocus(MultipleCRListing))

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: 350,
    resizeMode: 'cover',
  },
  reportInputText: {
    width: '90%',
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  viewModal2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  viewModal1: {
    borderRadius: 6,
    width: '100%',
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
  },
  buttonSubmit: {
    justifyContent: 'center',
    backgroundColor: '#FFE100',
    height: 42,
    alignItems: 'center',
    width: '30%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
  },
})
