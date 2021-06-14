import React, { Component } from 'react'
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Matrics } from '../../../common/styles'
import { Icon } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Http from '../../../api/http'
import APICaller from '../../../util/apiCaller'
import imgInstanceViewing from '../../../../Images/UI/IC_INSTANT_VIEWING.png'

import RadioForm from 'react-native-simple-radio-button'

import styles from './styles'
import { radio_props } from '../../../common/constants'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../../util/trackEventNames'
import { logEvent, events } from '../../../util/fbAnalytics'

class InstantViewRequestModal extends Component {
  constructor(props) {
    super(props)
    let today = new Date()

    let minDate = new Date()
    minDate.setDate(today.getDate() + (today.getHours() >= 13 ? 1 : 0))

    this.state = {
      value: 0,
      selectTime: false,
      selectTimeStyle: '',
      isLoading: false,
      selectedDate: `Date (dd/mm/yyyy)`, //`${minDate.getUTCDate()}/${minDate.getUTCMonth() + 1}/${minDate.getUTCFullYear()}`,
      selectedDateObj: null,
      selectedTime: 'Select Time',
      selectedTimeHours: 0,
      selectedTimeMinutes: 0,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      minimumDate: minDate,
      alert_message: '',
      selectedDateObjForPicker: minDate,
      selectedTimeObj: null,
      defaultTime: '',
      initialPosition: 0,
      propertyId: ''
    }
  }

  componentDidMount() {
    var ID = this.props.navigation.getParam('propertyId', 'null-ID')
    this.setState({
      ...this.state,
      propertyId: ID
    })
    AsyncStorage.getItem('chatRequestInfo').then((res) => {
      const data = JSON.parse(res)
      if (data && data != null && data != undefined) {
        this.setState(
          {
            selectedDate:
              data && data != null && data.dates != null
                ? data.dates
                : `Date (dd/mm/yyyy)`,
            selectedTime: data.times,
            selectedDateObj: new Date(data.dateObjs)
          },
          function () {
            const dateToFormat = new Date(this.state.selectedDateObj)

            const isSameDay =
              dateToFormat &&
              dateToFormat.getDate() === new Date().getDate() &&
              dateToFormat.getMonth() === new Date().getMonth() &&
              dateToFormat.getFullYear() === new Date().getFullYear()

            this.setState({ defaultTime: data.time })

            if (isSameDay) {
              this.setState({
                date: `Date (dd/mm/yyyy)`,
                time: 'Select Time',
                selectedDateObj: null
              })
            }
          }
        )
      }
    })
  }

  _showDateTimePicker = (stateName) => {
    this.setState({ [stateName]: true })
  }

  _hideDateTimePicker = (stateName) => {
    this.setState({ [stateName]: false })
  }

  _handleDatePicker = (date) => {
    this.setState(
      {
        selectedDate: `${date.getDate()}/${date.getMonth() +
          1}/${date.getFullYear()}`,
        selectedDateObj: date,
        selectedDateObjForPicker: date,
        isDatePickerVisible: false
      },
      () => {
        if (this.state.selectedTimeObj) {
          this._handleTimePicker(this.state.selectedTimeObj)
        }
      }
    )
  }

  _handleTime(isSameDay, date, selectedDateObj) {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let tomorrowDate = new Date()
    tomorrowDate.setDate(new Date().getDate() + 1)

    const isTomorrow =
      selectedDateObj &&
      selectedDateObj.getDate() === tomorrowDate.getDate() &&
      selectedDateObj.getMonth() === tomorrowDate.getMonth() &&
      selectedDateObj.getFullYear() === tomorrowDate.getFullYear()

    if (
      isSameDay &&
      (hours < new Date().getHours() ||
        (hours === new Date().getHours() && minutes < new Date().getMinutes()))
    ) {
      this.setState({
        alert_message:
          'This time slot is too soon, Please change to a later timing.',
        isTimePickerVisible: false,
        selectedTime: 'Select Time',
        selectedTimeHours: 0,
        selectedTimeMinutes: 0,
        selectedTimeObj: null
      })
      this._hideAlertView()
    } else if (isTomorrow && new Date().getHours() >= 21 && hours < 13) {
      this.setState({
        alert_message: 'Time must be between 1pm and 8pm',
        isTimePickerVisible: false,
        selectedTime: 'Select Time',
        selectedTimeHours: 0,
        selectedTimeMinutes: 0,
        selectedTimeObj: null
      })
      this._hideAlertView()
    } else if (hours < 10 || hours > 20 || (hours === 20 && minutes > 0)) {
      this.setState({
        alert_message: 'Time must be between 10am and 8pm',
        isTimePickerVisible: false,
        selectedTime: 'Select Time',
        selectedTimeHours: 0,
        selectedTimeMinutes: 0,
        selectedTimeObj: null
      })
      this._hideAlertView()
    } else {
      let hoursText = hours <= 12 ? hours : hours - 12
      hoursText = hoursText < 10 ? `0${hoursText}` : hoursText
      let minutesText = minutes < 10 ? `0${minutes}` : minutes

      this.setState({
        selectedTimeHours: hours,
        selectedTimeMinutes: minutes,
        selectedTime: `${hoursText}:${minutesText} ${hours < 12 ? 'AM' : 'PM'}`,
        selectedTimeObj: date,
        isTimePickerVisible: false
      })
    }
  }

  _handleTimePicker = (date) => {
    const { selectedDateObj } = this.state

    const isSameDay =
      selectedDateObj &&
      selectedDateObj.getDate() === new Date().getDate() &&
      selectedDateObj.getMonth() === new Date().getMonth() &&
      selectedDateObj.getFullYear() === new Date().getFullYear()

    this.setState({ defaultTime: '' })

    this._handleTime(isSameDay, date, selectedDateObj)
  }

  AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
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

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          flexDirection: 'row',
          alignItems: 'center',
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <TouchableOpacity
          onPress={() => this._exit()}
          style={{ alignItems: 'center', flexDirection: 'row' }}
          accessible={true}
          accessibilityLabel='instantModalLeftBtn'
        >
          <Icon name='keyboard-arrow-left' size={35} />
          <Text
            style={{
              fontSize: Matrics.ScaleValue(14),
              textAlign: 'left',
              fontFamily: 'OpenSans-Regular',
              color: '#000'
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: Matrics.ScaleValue(15),
              alignItems: 'center',
              color: '#000',
              marginLeft: Matrics.ScaleValue(-100)
            }}
          >
            Viewing Time
          </Text>
        </View>
      </View>
    )
  }

  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  handleSubmit = () => {
    if (this.state.selectedDateObj === null) {
      this.setState({ alert_message: 'Date must be required' })
      this._hideAlertView()
    } else if (this.state.selectedTime === 'Select Time') {
      this.setState({ alert_message: 'Time must be required' })
      this._hideAlertView()
    } else {
      this.showLoader()
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData

        const { selectedDateObj } = this.state
        const date = `${selectedDateObj.getFullYear()}-${(selectedDateObj.getMonth() +
          1 <
          10
          ? '0'
          : '') +
          (selectedDateObj.getMonth() + 1)}-${(selectedDateObj.getDate() < 10
            ? '0'
            : '') + selectedDateObj.getDate()}T`
        const time = `${this.state.selectedTime.substring(0, 5)}:00`

        const body = {
          time:
            this.state.defaultTime !== ''
              ? date + this.state.defaultTime
              : date + time,
          propertyId: this.state.propertyId,
          userId:
            user_information && user_information.userId
              ? user_information.userId
              : ''
        }

        const times = this.state.selectedTime
        const dates = this.state.selectedDate
        const dateObjs = this.state.selectedDateObj
        const obj = { dates, times, dateObjs, time }
        AsyncStorage.setItem('chatRequestInfo', JSON.stringify(obj))

        APICaller(
          Http.postAppointment,
          'POST',
          user_information.token,
          JSON.stringify(body)
        ).then((json) => {
          if (
            json.status === 400 ||
            json.status === 403 ||
            json.status === 401 ||
            json.status === 501
          ) {
            this.setState({ alert_message: json.data.message })
            this._hideAlertView()
            this.hideLoader()
          } else if (json.status === 500) {
            this.setState({ alert_message: 'Internal server error' })
            this._hideAlertView()
            this.hideLoader()
          } else if (json.status === 200) {
            analytics().logEvent(
              trackerEventSubmit.chatWithOwner.action.chatRequestSubmit2
            )
            logEvent(trackerEventSubmit.chatWithOwner.action.chatRequestSubmit2)
            this.hideLoader()
            this.props.navigation.state.params.successSubmitted()
          }
        })
      }
    }
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._exit)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._exit)
  }

  _exit = () => {
    //this.props.navigation.state.params.handleBackFromInfo();
    this.props.navigation.navigate('ListingPageDetail')
    return true
  }

  _timeselection(value) {
    return (
      <View style={styles.timeSelectionView}>
        <FlatList
          data={value}
          style={styles.flatListStyle}
          extraData={this.state}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selectedTime: value[index].time.trim(),
                  selectTimeStyle: item.value,
                  defaultTime: ''
                })
              }}
              accessible={true}
              accessibilityLabel='instantModalListBtn'
            >
              <View
                style={
                  this.state.selectTimeStyle === item.value
                    ? styles.timeBorderStyleSelected
                    : styles.timeBorderStyle
                }
              >
                <Text
                  style={
                    this.state.selectTimeStyle === item.value
                      ? styles.timeTextSelected
                      : styles.timeText
                  }
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  render() {
    return (
      <View>
        {/* <Modal
                    transparent={true}
                    animationType={"slide"}
                    visible={this.props.modalVisible}
                    onRequestClose={() => { }}> */}
        {this._viewHeader()}
        <ScrollView contentContainerStyle={styles.mainContainer}>
          {this.state.alert_message !== '' &&
            this.AlertView(this.state.alert_message)}

          <View style={styles.modalContainer}>
            {/* <View style={{ width: width, height: height, position: 'absolute', alignContent: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator animating={this.state.isLoading} size="large" color="grey" />
                        </View> */}

            {this.state.isLoading && (
              <View style={styles.LoaderContainer}>
                <View style={styles.LoaderWrapper}>
                  <ActivityIndicator
                    animating={this.state.isLoading}
                    size='large'
                    color='black'
                    style={{ marginBottom: 5 }}
                  />
                  <Text style={styles.LoaderText}>Loading...</Text>
                </View>
              </View>
            )}
            <Text style={styles.headerText}>
              Choose your preferred viewing time
            </Text>
            <Image
              testID='instanceView'
              style={styles.modalImageView}
              source={imgInstanceViewing}
              resizeMode={'contain'}
            />
            <View style={{ marginVertical: Matrics.ScaleValue(10) }}>
              <View
                style={[
                  styles.dropDownContainerStyle,
                  {
                    marginBottom: Matrics.ScaleValue(15),
                    marginTop: Matrics.ScaleValue(15)
                  }
                ]}
              >
                <Text style={styles.selectedTextStyle}>Date</Text>
                <TouchableOpacity
                  style={styles.dropDownViewStyle}
                  onPress={() =>
                    this._showDateTimePicker('isDatePickerVisible')
                  }
                  accessible={true}
                  accessibilityLabel='instantModalSelectedDateBtn'
                >
                  <Text style={styles.unSelectedTextStyle}>
                    {this.state.selectedDate}
                  </Text>
                  <Icon
                    name='expand-more'
                    color='gray'
                    size={Matrics.ScaleValue(22)}
                    style={{ color: '#4885ED', width: Matrics.ScaleValue(30) }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.dropDownContainerStyle}>
                <Text style={styles.selectedTextStyle}>Time</Text>
                <View style={styles.dummy} />
                {/* <TouchableOpacity
                  style={styles.dropDownViewStyle}
                  onPress={() => this.setState({ selectTime: true })}
                >
                  <Text style={styles.unSelectedTextStyle}>
                    {this.state.selectedTime}
                  </Text>
                  <Icon
                    name="expand-more"
                    color="gray"
                    size={Matrics.ScaleValue(22)}
                    style={{ color: "#4885ED", width: Matrics.ScaleValue(30) }}
                  />
                </TouchableOpacity> */}
              </View>
              {this._timeselection(radio_props)}
            </View>
            {/* <Text style={styles.selectDateTextStyle}>This is not confirmed appointment time. Our staff will {'\n'}contact you to reconfirm the viewing time.</Text> */}
            <View
              style={{
                height: Matrics.ScaleValue(60),
                width: '85%',
                marginBottom: Matrics.ScaleValue(65)
              }}
            >
              <TouchableOpacity
                style={styles.selectedButtonStyle}
                onPress={() => {
                  this.handleSubmit()
                }}
                accessible={true}
                accessibilityLabel='instantModalSubmitBtn'
              >
                <Text style={styles.selectedButtonTextStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <DateTimePicker
          datePickerContainerStyleIOS={{ paddingHorizontal: 40 }}
          minimumDate={this.state.minimumDate}
          date={this.state.selectedDateObjForPicker}
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this._handleDatePicker}
          onCancel={() => this._hideDateTimePicker('isDatePickerVisible')}
        />

        <DateTimePicker
          mode={'time'}
          is24Hour={false}
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this._handleTimePicker}
          onCancel={() => this._hideDateTimePicker('isTimePickerVisible')}
        />

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={this.state.selectTime}
          onRequestClose={() => { }}
        >
          <View style={styles.mainContainer}>
            <View
              style={[
                styles.modalContainer,
                { borderRadius: 5, width: '80%', height: '70%' }
              ]}
            >
              <View
                style={{
                  borderRadius: 5,
                  flexDirection: 'row',
                  backgroundColor: '#FFE100',
                  height: 40,
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    textAlign: 'left',
                    paddingLeft: 15,
                    fontFamily: 'OpenSans-SemiBold',
                    color: '#000000'
                  }}
                >
                  Select Time
                </Text>
              </View>

              <ScrollView
                style={{ marginBottom: 10 }}
                showsVerticalScrollIndicator={false}
              >
                <RadioForm
                  buttonColor={'#2196f3'}
                  labelColor={'#000'}
                  radio_props={radio_props}
                  initial={this.state.initialPosition}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    height: '100%',
                    overflow: 'hidden'
                  }}
                  onPress={(value) => {
                    this.setState({
                      selectedTime: radio_props[value].label.trim(),
                      selectTimeStyle: false,
                      initialPosition: value,
                      defaultTime: ''
                    })
                  }}
                  accessible={true}
                  accessibilityLabel='instaViewReqRadioBtn'
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* </Modal> */}
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData
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
)(InstantViewRequestModal)
