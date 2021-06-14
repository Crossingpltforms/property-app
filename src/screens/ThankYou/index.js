import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  TextInput,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import _ from 'lodash'
import { styles } from './styles'
import Header from '../common/Header'
import { Icon } from 'react-native-elements'
import ModalSelector from 'react-native-modal-selector'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { WebView } from 'react-native-webview'
const { width } = Dimensions.get('window')
import { Matrics } from '../../common/styles'
import {
  submitFeedback,
  updateProfileDetails,
  profileDetails
} from '../../api/http'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'

class ThankYou extends Component {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      ourPicksList: '',
      property: [
        { key: 1, section: false, value: 1, label: '1' },
        { key: 2, section: false, value: 2, label: '2' },
        { key: 3, section: false, value: 3, label: '3' },
        { key: 4, section: false, value: 5, label: '4' },
        { key: 5, section: false, value: 5, label: '5' },
        { key: 6, section: false, value: 6, label: '6' },
        { key: 7, section: false, value: 7, label: '7' },
        { key: 8, section: false, value: 8, label: '8' },
        { key: 9, section: false, value: 9, label: '9' },
        { key: 10, section: false, value: 10, label: '10' },
        { key: 11, section: false, value: 11, label: '10+' }
      ],
      levelRealEsate: [
        { key: 1, section: false, value: 'Beginner', label: 'Beginner' },
        {
          key: 2,
          section: false,
          value: 'Intermediate',
          label: 'Intermediate'
        },
        { key: 3, section: false, value: 'Expert', label: 'Expert' }
      ],
      propertyValue: '',
      levelRealEsateValue: '',
      propertyLable: '',
      levelRealEsateLable: '',
      ratingArray: [
        { rateNumber: 1, isSelected: false },
        { rateNumber: 2, isSelected: false },
        { rateNumber: 3, isSelected: false },
        { rateNumber: 4, isSelected: false },
        { rateNumber: 5, isSelected: false }
      ],
      descriptionText: '',
      displayRatingValidation: false
    }
  }

  _navigationBack = () =>
    this.props.navigation.navigate('MyListing', {
      backToHome: true,
      fromScreen: 'UserProfile'
    })

  handleBackButtonClick() {
    this.props.navigation.navigate('MyListing', {
      backToHome: true,
      fromScreen: 'UserProfile'
    })
    return true
  }

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          alignItems: 'center',
          elevation: 6,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <View
            style={{
              flex: 2.5,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'center',
              width: '100%'
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                textAlign: 'center',
                paddingLeft: 10
              }}
            >
              Thank You
            </Text>
          </View>
        </View>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 7,
            top: 10
          }}
        >
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ marginLeft: 5, paddingHorizontal: 5 }}
            accessible={true}
            accessibilityLabel='thankUScreenClearBtn'
          >
            <Icon name='clear' size={25} style={{ color: '#000' }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    // tracker.trackEvent(
    //   trackerEventConfig.postProperty.category,
    //   trackerEventConfig.postProperty.action.createListingThankYou
    // );

    analytics().logEvent(
      trackerEventSubmit.postProperty.action.createListingThankYou
    )
    logEvent(trackerEventSubmit.postProperty.action.createListingThankYou)
  }
  componentDidMount() {
    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        `${profileDetails(user_credentials.userId)}`,
        'GET',
        user_credentials.token,
        ''
      ).then((response) => {
        if (response.status === 200) {
          if (response.data.propertiesOwned === 11) {
            this.setState({
              propertyLable: '10+',
              propertyValue: response.data.propertiesOwned
            })
          } else {
            this.setState({
              propertyLable: '' + response.data.propertiesOwned,
              propertyValue: response.data.propertiesOwned
            })
          }
          this.setState({
            levelRealEsateValue: response.data.experience,
            levelRealEsateLable: response.data.experience
          })
        } else {
          this.displayError()
        }
      })
    }
  }

  getUserInfo() { }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  changeOption = (data, stateName, lable, option) => {
    this.setState({
      [lable]: option.label,
      [stateName]: option.value
    })

    let bedroomD = data

    bedroomD.map((res) => {
      if (option.label === res.label) {
        res.section = true
      } else {
        res.section = false
      }
    })

    this.setState({
      [data]: bedroomD
    })
  }

  _updateDetails = () => {
    // if (!global.networkConnection) return;
    if (this.props.isUserLogin == true) {
      let user_details = this.props.userLoginData
      let body = {
        experience: this.state.levelRealEsateValue,
        propertiesOwned:
          this.state.propertyValue == '10+' ? 11 : this.state.propertyValue
      }
      APICaller(
        updateProfileDetails(user_details.userId),
        'PUT',
        user_details.token,
        JSON.stringify(body)
      ).then((json) => {
        if (json.status === 200) {
        } else {
          // TODO crashlytics
          alert('fail' + json)
        }
      })
    }
  }

  submitFeedback = async () => {
    const { ratingArray, descriptionText } = this.state

    await this._updateDetails()

    let isRated = false
    let rating
    if (this.props.isUserLogin == true) {
      let user_details = this.props.userLoginData
      for (let item of ratingArray) {
        if (item.isSelected === true) {
          isRated = true
          rating = item.rateNumber
          break
        }
      }
      if (isRated === false) {
        this.setState({
          displayRatingValidation: true
        })
      } else {
        let body = {
          rating: isRated ? rating : '',
          comment: descriptionText,
          platform: 'APP'
        }
        APICaller(
          submitFeedback(user_details.userId),
          'POST',
          user_details.token,
          JSON.stringify(body)
        ).then((json) => {
          if (json.status === 200) {
            this.props.navigation.navigate('Home')
          } else {
            // TODO crashlytics
            alert('fail' + json)
          }
        })
      }
    }
  }

  onRatingNumberPress = (clickedItem) => {
    const { ratingArray } = this.state
    let tempRatingArray = [...ratingArray]
    for (let tempRatingItem of tempRatingArray) {
      if (clickedItem.rateNumber === tempRatingItem.rateNumber) {
        if (tempRatingItem.isSelected === false) {
          tempRatingItem.isSelected = true
        } else {
          tempRatingItem.isSelected = false
        }
      } else {
        tempRatingItem.isSelected = false
      }
    }
    this.setState(
      {
        ratingArray: tempRatingArray
      },
      () => { }
    )
  }

  render() {
    const { ratingArray } = this.state
    return (
      <Container style={{ flex: 1 }}>
        {this._viewHeader()}

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView contentContainerStyle={styles.secondViewWrapper}>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  {
                    ...styles.TextStyleHeaderTag,
                    fontSize: 24,
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500',
                    paddingLeft: 0
                  },
                  { marginTop: 10, marginBottom: 6 }
                ]}
              >
                Additional information to complete your profile
              </Text>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center',
                margin: 5
              }}
            >
              <Text
                style={[
                  {
                    ...styles.TextStyleHeaderTag,
                    fontWeight: '500',
                    paddingLeft: 0
                  },
                  { marginTop: 2 }
                ]}
              >
                How many properties?
              </Text>
              <ModalSelector
                data={this.state.property}
                initValue='Please select one'
                onChange={(option) =>
                  this.changeOption(
                    this.state.property,
                    'propertyValue',
                    'propertyLable',
                    option
                  )
                }
                optionStyle={{
                  backgroundColor: 'white',
                  borderRadius: 6,
                  marginBottom: 2
                }}
                sectionStyle={{
                  backgroundColor: '#FFDF00',
                  borderRadius: 6,
                  marginBottom: 2,
                  padding: 8
                }}
              >
                <TouchableOpacity
                  style={{
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                  accessible={true}
                  accessibilityLabel='thankUScreenPropBtn'
                >
                  <TextInput
                    testID='property'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5,
                      paddingLeft: 5
                    }}
                    placeholderTextColor='#9AA1A9'
                    value={this.state.propertyLable}
                    onChangeText={(propertyValue) => {
                      if (propertyValue === '10+') {
                        this.setState({
                          propertyLable: propertyValue,
                          propertyValue: 11
                        })
                      } else {
                        this.setState({
                          propertyLable: propertyValue,
                          propertyValue: propertyValue
                        })
                      }
                    }}
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='thankYouScreenPropInput'
                  />
                  <FontAwesome
                    name='chevron-down'
                    style={{
                      position: 'absolute',
                      marginLeft: '95%'
                    }}
                  />
                </TouchableOpacity>
              </ModalSelector>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center',
                margin: 5
              }}
            >
              <Text
                style={[
                  {
                    ...styles.TextStyleHeaderTag,
                    fontWeight: '500',
                    paddingLeft: 0
                  },
                  { marginTop: 20 }
                ]}
              >
                Level of your expertise with real esate?
              </Text>
              <ModalSelector
                data={this.state.levelRealEsate}
                initValue={this.state.levelRealEsateValue}
                onChange={(option) =>
                  this.changeOption(
                    this.state.levelRealEsate,
                    'levelRealEsateValue',
                    'levelRealEsateLable',
                    option
                  )
                }
                optionStyle={{
                  backgroundColor: 'white',
                  borderRadius: 6,
                  marginBottom: 2
                }}
                sectionStyle={{
                  backgroundColor: '#FFDF00',
                  borderRadius: 6,
                  marginBottom: 2,
                  padding: 8
                }}
              >
                <TouchableOpacity
                  style={{
                    height: Matrics.ScaleValue(40),
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                  accessible={true}
                  accessibilityLabel='thankUScreenLevelBtn'
                >
                  <TextInput
                    testID='levelRealEstate'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5,
                      paddingLeft: 5
                    }}
                    placeholder='Please select one'
                    placeholderTextColor='#9AA1A9'
                    value={this.state.levelRealEsateLable}
                    onChangeText={(levelRealEsateValue) => {
                      this.setState({
                        levelRealEsateValue: levelRealEsateValue,
                        levelRealEsateLable: levelRealEsateValue
                      })
                    }}
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='thankYouScreenLevelInput'
                  />
                  <FontAwesome
                    name='chevron-down'
                    style={{
                      position: 'absolute',
                      marginLeft: '95%'
                    }}
                  />
                </TouchableOpacity>
              </ModalSelector>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  {
                    ...styles.TextStyleHeaderTag,
                    fontSize: 24,
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500',
                    paddingLeft: 0
                  },
                  { marginTop: 10, marginBottom: 0 }
                ]}
              >
                Send us your feedback
              </Text>
              <Text
                style={[
                  {
                    fontSize: 14,
                    paddingLeft: 10,
                    color: 'black',
                    fontWeight: '500',
                    paddingLeft: 0
                  }
                ]}
              >
                We want to know your experience with SPEEDHOME so that we can
                continue to improve it.
              </Text>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  {
                    ...styles.TextStyleHeaderTag,
                    fontSize: 24,
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500',
                    paddingLeft: 0
                  },
                  { marginTop: 10, marginBottom: 0 }
                ]}
              >
                How was you experience?
              </Text>
              <View style={styles.ratingMainView}>
                <View style={styles.ratingTextView}>
                  <Text style={styles.poorText}>Poor</Text>
                  <Text style={styles.excellentText}>Excellent</Text>
                </View>
                <View style={styles.ratingNumView}>
                  {ratingArray.map((ratingItem, index) => (
                    <TouchableOpacity
                      key={`${index}`}
                      onPress={() => {
                        this.onRatingNumberPress(ratingItem)
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: ratingItem.isSelected
                            ? '#82bbff'
                            : '#4485ED',
                          marginLeft: index === 0 ? 0 : 19,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: ratingItem.isSelected
                            ? '#4485ED'
                            : '#FFF'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: ratingItem.isSelected ? '#FFF' : '#4485ED'
                          }}
                        >
                          {ratingItem.rateNumber}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {this.state.displayRatingValidation ? (
                  <Text style={{ color: 'red' }}>
                    Please rate your experience.
                  </Text>
                ) : null}
              </View>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#A2A2A2',
                borderRadius: 10,
                height: 144,
                marginTop: 25,
                overflow: 'hidden'
              }}
            >
              <TextInput
                testID='expDescription'
                keyboardType='default'
                multiline={true}
                textAlignVertical={'top'}
                maxLength={250}
                style={{
                  width: '100%',
                  height: '100%',
                  marginTop: 10,
                  paddingHorizontal: 10
                }}
                placeholder='Describe your experience here.'
                placeholderTextColor='#C4C5C6'
                fontSize={16}
                value={this.state.descriptionText}
                onChangeText={(descriptionText) => {
                  this.setState({ descriptionText: descriptionText })
                }}
                accessible={true}
                accessibilityLabel='thankYouScreenDescInput'
              />
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 12,
                    paddingLeft: 10,
                    color: 'black',
                    fontWeight: '400',
                    paddingLeft: 0
                  },
                  { marginTop: 10 }
                ]}
              >
                Your feedback may be posted on our website
              </Text>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'flex-end',
                alignSelf: 'center',
                flexDirection: 'row',
                alignContent: 'flex-end',
                marginTop: 20
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Home')
                }}
              >
                <View style={styles.skipStyle}>
                  <Text>Skip</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.submitFeedback()
                }}
              >
                <View style={styles.submitButtonStyle}>
                  <Text style={styles.submitTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: width - 30,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center'
              }}
            >
              <Text
                style={[
                  {
                    // ...styles.TextStyleHeaderTag,
                    marginTop: 5,
                    color: 'black',
                    fontSize: 20,
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500'
                  },
                  { marginTop: 20, marginBottom: 30 }
                ]}
              >
                Here's is short video covering the landlord basics just for you
              </Text>
              <View style={[styles.webViewStyle, { overflow: "hidden" }]}>
                <WebView
                  source={{
                    uri:
                      'https://www.youtube.com/embed/Fghemni83_Y?rel=0&autoplay=0&showinfo=0&controls=1'
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  androidHardwareAccelerationDisabled={true}
                  allowsInlineMediaPlayback={true}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Container>
    )
  }
}
function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ThankYou)
