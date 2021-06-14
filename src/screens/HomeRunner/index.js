import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  ActivityIndicator,
  BackHandler,
  Alert,
  Modal
} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Header from '../common/Header'
import ErrorDialog from '../../components/ErrorDialog'
import RadioForm from 'react-native-simple-radio-button'
import { Icon } from 'react-native-elements'
import Color from '../../common/styles/color'
// import images
import HomeRunnerImg from '../../../Images/homerunner.png'
import styles from './styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { radio_props } from '../../common/constants'
import { Calendar } from 'react-native-calendars'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../util/trackEventNames'
import {
  holidayDisableDatesObj,
  DISABLED_DAYS
} from '../../common/constants/index'
import moment from 'moment'
import { logEvent, events } from '../../util/fbAnalytics'

class HomeRunner extends Component {

  constructor(props) {
    super(props)

    let today = new Date()
    let minDate = new Date()
    minDate.setDate(today.getDate() + 1)
    let maxDate = new Date()
    maxDate.setDate(today.getDate() + 8)

    const currentMonthMarkDays = this.getDaysInMonth(
      moment().month(),
      moment().year(),
      DISABLED_DAYS
    )
    this.state = {
      isLoading: false,
      showErrorDialog: false,
      collectionAddress: '',
      collectionDate: `${minDate.getDate()}/${minDate.getMonth() +
        1}/${minDate.getFullYear()}`,
      collectionTime: '09:00 AM',
      collectionTimeHours: 9,
      collectionTimeMinutes: 0,
      remarks: '',
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      minimumDate: minDate,
      maximumDate: maxDate,
      alert_message: '',
      selectedTime: 'Select Time',
      defaultTime: '',
      initialPosition: 0,
      selectTime: false,
      markedDates: {
        ...currentMonthMarkDays,
        ...holidayDisableDatesObj
      }
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

  FormInputText = (
    title,
    placeholder,
    alertMsg,
    stateName,
    showAlert,
    keyboard,
    textLimit = null
  ) => {
    return (
      <View style={styles.formInputRoot}>
        <Text style={styles.text1}> {title}</Text>
        <TextInput
          testID='stateName'
          style={styles.formInput}
          placeholder={placeholder}
          value={this.state[stateName]}
          onChangeText={val => this.textInputChange(val, stateName)}
          keyboardType={keyboard}
          maxLength={textLimit}
          accessible={true}
          accessibilityLabel='homeRunnerMainStateNameInput'
        />
        {showAlert && <Text style={styles.formTextError}>{alertMsg}</Text>}
      </View>
    )
  }

  textInputChange = (val, stateName) => {
    this.setState({ [stateName]: val })
  }

  _showDateTimePicker = stateName => {
    this.setState({ [stateName]: true })
  }

  _hideDateTimePicker = stateName => {
    this.setState({ [stateName]: false })
  }

  _handleDatePicker = date => {
    var dateFormat = `${date.day}/${date.month}/${date.year}`
    this.setState({
      collectionDate: dateFormat,
      isDatePickerVisible: false
    })
  }

  _handleTimePicker = date => {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let hoursText = hours <= 12 ? hours : hours - 12
    hoursText = hoursText < 10 ? `0${hoursText}` : hoursText
    let minutesText = minutes < 10 ? `0${minutes}` : minutes

    this.setState({
      collectionTimeHours: hours,
      collectionTimeMinutes: minutes,
      collectionTime: `${hoursText}:${minutesText} ${hours < 12 ? 'AM' : 'PM'}`,
      isTimePickerVisible: false
    })
  }

  AlertView = message => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
        height: 70,
        bottom: '10%',
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

  _hideAlertView() {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  handleCancel = () => {
    this.gotoNextStep()
  }

  handleSave = () => {
    const {
      collectionAddress,
      collectionDate,
      collectionTime,
      collectionTimeHours,
      collectionTimeMinutes,
      remarks,
      selectedTime
    } = this.state

    if (collectionAddress.trim() === '') {
      this.setState({ alert_message: 'Address is required' })
      this._hideAlertView()
    } else if (collectionDate.trim() === '') {
      this.setState({ alert_message: 'Date is required' })
      this._hideAlertView()
    } else if (selectedTime === 'Select Time') {
      this.setState({ alert_message: 'Time must be required' })
      this._hideAlertView()
    } else {
      this.showLoader()

      let seprateTime = selectedTime.split(' ')
      let dateFormat = collectionDate.split('/')
      let hoursText =
        collectionTimeHours <= 12
          ? collectionTimeHours
          : collectionTimeHours - 12
      hoursText = hoursText < 10 ? `0${hoursText}` : hoursText
      let minutesText =
        collectionTimeMinutes < 10
          ? `0${collectionTimeMinutes}`
          : collectionTimeMinutes

      let body = {
        pickupAddress: collectionAddress,
        pickupDateTime: `${(parseInt(dateFormat[0]) < 10 ? '0' : '') +
          parseInt(dateFormat[0])}-${(parseInt(dateFormat[1]) < 10 ? '0' : '') +
          parseInt(dateFormat[1])}-${dateFormat[2]} ${seprateTime[0]}:00 ${seprateTime[1]
          }`,
        propertyId: this.props.navigation.getParam('id'),
        remarks: remarks
      }

      APICaller(Http.homeRunnerEndPoint, 'PUT', '', JSON.stringify(body)).then(
        json => {
          if (json.status === 200) {
            this.setState({
              isLoading: false
            })
            Alert.alert(
              'Success',
              'Request sent sucessfully.',
              [{ text: 'OK', onPress: () => this.gotoNextStep() }],
              { cancelable: false }
            )

            analytics().logEvent(
              trackerEventSubmit.postProperty.action.createListingKeyCollection
            )

            logEvent(
              trackerEventSubmit.postProperty.action.createListingKeyCollection
            )
          } else {
            this.setState({
              isLoading: false,
              showErrorDialog: true
            })
          }
        }
      )
    }
  }
  getDaysInMonth(month, year, days) {
    let pivot = moment()
      .month(month)
      .year(year)
      .startOf('month')
    const end = moment()
      .month(month)
      .year(year)
      .endOf('month')

    let dates = {}
    const disabled = { disabled: true }
    while (pivot.isBefore(end)) {
      days.forEach(day => {
        dates[pivot.day(day).format('YYYY-MM-DD')] = disabled
      })
      pivot.add(7, 'days')
    }

    return dates
  }

  onMonthChange = date => {
    const monthDates = this.getDaysInMonth(
      date.month - 1,
      date.year,
      DISABLED_DAYS
    )
    this.setState({
      markedDates: {
        ...monthDates,
        ...holidayDisableDatesObj
      }
    })
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  gotoNextStep = () => {
    this.props.navigation.navigate('ShareList', {
      id: this.props.navigation.getParam('id')
    })
  }

  render() {
    console.log("Date PIcker", this.state.isDatePickerVisible, "collectiondate", this.state.collectionDate)
    return (
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Header
          headerTitle='Key Collection'
          navigation={this.props.navigation}
          disableBackNavigation={true}
        />
        <ScrollView
          contentContainerStyle={styles.root}
          scrollEnabled={true}
          style={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps={'handled'}
        >
          {this.state.alert_message !== '' &&
            this.AlertView(this.state.alert_message)}

          <Image
            testID='homeRunner'
            source={HomeRunnerImg}
            resizeMode={'contain'}
            style={{
              width: '50%',
              marginTop: 20,
              marginBottom: 20
            }}
          />
          {/* <Text style={styles.TextStyleHeaderTag}>Viewing Management</Text> */}
          <Text
            style={{
              width: '70%',
              fontSize: 16,
              paddingBottom: 10,
              textAlign: 'center',
              fontWeight: '600',
              color: '#000',
              fontFamily: 'OpenSans-SemiBold'
            }}
          >
            Our homerunners will do viewing for FREE
          </Text>

          {this.state.isDatePickerVisible && (
            <Modal
              transparent={true}
              animationType={'slide'}
              isVisible={this.state.isDatePickerVisible}
              onRequestClose={() =>
                this._hideDateTimePicker('isDatePickerVisible')
              }
            >
              <View style={styles.mainContainer}>
                <Calendar
                  // Enable the option to swipe between months. Default = false
                  onMonthChange={date => this.onMonthChange(date)}
                  disabledDaysIndexes={[0, 6]}
                  onDayPress={day => {
                    this._handleDatePicker(day)
                  }}
                  current={moment(
                    this.state.collectionDate,
                    'DD/MM/YYYY'
                  ).format()}
                  markedDates={this.state.markedDates}
                  minDate={this.state.minimumDate}
                  maxDate={this.state.maximumDate}
                  disableAllTouchEventsForDisabledDays
                  style={styles.dateContainer}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: 'black',
                    selectedDayBackgroundColor: '#ffffff',
                    selectedDayTextColor: Color.cherryRed,
                    dayTextColor: 'black',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#ffffff',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    monthTextColor: 'black',
                    indicatorColor: 'blue',
                    textDayFontFamily: 'OpenSans-Light',
                    textMonthFontFamily: 'OpenSans-Light',
                    textDayHeaderFontFamily: 'OpenSans-Light',
                    textDayFontWeight: '700',
                    textMonthFontWeight: '700',
                    textDayHeaderFontWeight: '400',
                    textDayFontSize: 20,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 15
                  }}
                />
              </View>
            </Modal>
          )}

          <DateTimePicker
            mode={'time'}
            is24Hour={false}
            isVisible={this.state.isTimePickerVisible}
            onConfirm={this._handleTimePicker}
            onCancel={() => this._hideDateTimePicker('isTimePickerVisible')}
          />

          {this.FormInputText(
            'Collection Address',
            'E.g Lily & Rose Apartment',
            'No msg',
            'collectionAddress',
            false,
            'default'
          )}

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={[styles.formInputRoot2, { marginRight: 10 }]}>
              <Text style={styles.text1}>Date</Text>
              <Text style={styles.text2}>
                Except weekends and Public Holidays
              </Text>
              <TouchableOpacity
                style={[styles.formInput2, { justifyContent: 'center' }]}
                onPress={() => this._showDateTimePicker('isDatePickerVisible')}
                accessible={true}
                accessibilityLabel='homeRunnerMainDateBtn'
              >
                <Text style={styles.formInputText}>
                  {this.state.collectionDate}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.formInputRoot2, { marginLeft: 10 }]}>
              <Text style={styles.text1}>Time</Text>
              <Text style={styles.text2}>Available from 10 am to 6 pm</Text>
              <TouchableOpacity
                style={[styles.formInput2, { justifyContent: 'center' }]}
                onPress={() => this.setState({ selectTime: true })}
                accessible={true}
                accessibilityLabel='homeRunnerMainTimeBtn'
              >
                <Text style={styles.formInputText}>
                  {this.state.selectedTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {this.FormInputText(
            'Remarks',
            'E.g Meet at Lobby 2 / Set of 4 keys',
            'No msg',
            'remarks',
            false,
            'default'
          )}

          <View
            style={{
              marginTop: 30,
              marginBottom: 20,
              marginRight: 30,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.handleCancel()
              }}
              style={[styles.button3, { marginRight: 10 }]}
              accessible={true}
              accessibilityLabel='homeRunnerMainLaterBtn'
            >
              <Text
                style={[
                  styles.text1,
                  { fontSize: 14, fontFamily: 'OpenSans-Regular' }
                ]}
              >
                Maybe Later
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button2, { marginLeft: 10 }]}
              onPress={() => {
                this.handleSave()
              }}
              accessible={true}
              accessibilityLabel='homeRunnerMainCollectKeyBtn'
            >
              <Text
                style={[
                  styles.text1,
                  { fontSize: 14, fontFamily: 'OpenSans-Bold' }
                ]}
              >
                Collect key
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={value => {
            this.setState({ showErrorDialog: false })
          }}
        />

        {this.state.isLoading && (
          <View style={styles.LoaderContainer}>
            <ActivityIndicator
              animating={this.state.isLoading}
              size='large'
              color='black'
              style={{ marginBottom: 5 }}
            />
            <Text style={styles.LoaderText}>Loading...</Text>
          </View>
        )}

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
                <TouchableOpacity
                  onPress={() => this.setState({ selectTime: false })}
                  style={{ paddingRight: 15 }}
                  accessible={true}
                  accessibilityLabel='homeRunnerMainClearBtn'
                >
                  <Icon name='clear' size={25} style={{ color: '#000' }} />
                </TouchableOpacity>
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
                  onPress={value => {
                    this.setState({
                      selectedTime: radio_props[value].label.trim(),
                      selectTime: false,
                      initialPosition: value,
                      defaultTime: ''
                    })
                  }}
                  accessible={true}
                  accessibilityLabel='homeRunnerMainRadioBtn'
                />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Container>
    )
  }
}

export default HomeRunner
