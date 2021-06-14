import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
// import PaperPlaneImg from '../../../../Images/paper-plane.png';
import { Matrics } from '../../../common/styles'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements'
import Http from '../../../api/http'
import APICaller from '../../../util/apiCaller'
import { formatTime } from '../../../common/helper/time'
import imgGroupViewing from '../../../../Images/GroupAppointmentModal/IC_GROUP_VIEWING.png'
import _ from 'lodash'
import { radio_props } from '../../../common/constants'

const { width, height } = Dimensions.get('window')

class GroupAppointmentView extends Component {
  constructor(props) {
    super(props)
    let today = new Date()

    let minDate = new Date()
    minDate.setDate(today.getDate() + (today.getHours() >= 13 ? 1 : 0))
    this.state = {
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
      appointmentData: [],
      isLoading: false,
      loader: false,
      isDiffTime: false,
      isSelectedExistTime: 0,
    }
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
        isDatePickerVisible: false,
      },
      () => {
        if (this.state.selectedTimeObj) {
          this._handleTimePicker(this.state.selectedTimeObj)
        }
      }
    )
  }
  _handleTimePicker = (date) => {
    let hours = date.getHours()
    let minutes = date.getMinutes()

    const { selectedDateObj } = this.state

    const isSameDay =
      selectedDateObj &&
      selectedDateObj.getDate() === new Date().getDate() &&
      selectedDateObj.getMonth() === new Date().getMonth() &&
      selectedDateObj.getFullYear() === new Date().getFullYear()

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
        selectedTimeObj: null,
      })
      this._hideAlertView()
    } else if (isTomorrow && new Date().getHours() >= 21 && hours < 13) {
      this.setState({
        alert_message: 'Time must be between 1pm and 8pm',
        isTimePickerVisible: false,
        selectedTime: 'Select Time',
        selectedTimeHours: 0,
        selectedTimeMinutes: 0,
        selectedTimeObj: null,
      })
      this._hideAlertView()
    } else if (hours < 10 || hours > 20 || (hours === 20 && minutes > 0)) {
      this.setState({
        alert_message: 'Time must be between 10am and 8pm',
        isTimePickerVisible: false,
        selectedTime: 'Select Time',
        selectedTimeHours: 0,
        selectedTimeMinutes: 0,
        selectedTimeObj: null,
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
        isTimePickerVisible: false,
      })
    }
  }
  handleSubmit = (value) => {
    this.setState({ isLoading: true })
    if (this.state.selectedDateObj === null && this.state.isDiffTime == true) {
      this.setState({ alert_message: 'Date must be required' })
      this._hideAlertView()
      this.setState({ isLoading: false })
    } else if (
      this.state.selectedTime === 'Select Time' &&
      this.state.isDiffTime == true
    ) {
      this.setState({ alert_message: 'Time must be required' })
      this._hideAlertView()
      this.setState({ isLoading: false })
    } else {
      this.showLoader()
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        const { selectedDateObj } = this.state
        const date =
          this.state.isDiffTime == true
            ? `${selectedDateObj.getFullYear()}-${(selectedDateObj.getMonth() +
              1 <
              10
              ? '0'
              : '') +
            (selectedDateObj.getMonth() + 1)}-${(selectedDateObj.getDate() <
              10
              ? '0'
              : '') + selectedDateObj.getDate()}T`
            : ''
        const time =
          this.state.isDiffTime == true ? `${this.state.selectedTime}` : ''
        const {
          appointmentData,
          propertyId,
        } = this.props.navigation.state.params
        const body = {
          time:
            this.state.isDiffTime == true
              ? date + time
              : appointmentData[this.state.isSelectedExistTime],
          propertyId: propertyId,
          userId:
            user_information && user_information.userId
              ? user_information.userId
              : '',
        }

        APICaller(
          Http.postAppointment,
          'POST',
          user_information.token,
          JSON.stringify(body)
        ).then((json) => {
          this.setState({ isLoading: false })
          if (json.status === 200) {
            this.hideLoader()
            this.props.navigation.state.params.handleConfirm()
          } else if (json.status !== 500 || json.status !== 200) {
            this.hideLoader()
            Alert.alert(
              json.data.message,
              [{ text: 'OK', onPress: () => this.exit() }],
              { cancelable: false }
            )
          } else if (json.status === 500) {
            this.setState({
              alert_message: 'Internal server error',
            })
            this._hideAlertView()
            this.hideLoader()
          }
        })
      }
    }
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
  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }
  handleExit = (value) => {
    this.props.toggleModal(!this.props.modalVisible)
    this.props.handleConfirm(value)
  }
  exit = () => {
    this.props.toggleModal(!this.props.modalVisible)
  }

  showLoader = () => {
    this.setState({ loader: true })
  }

  hideLoader = () => {
    this.setState({ loader: false })
  }

  renderDateTimeView = () => {
    const { appointmentData } = this.props.navigation.state.params
    const { isSelectedExistTime } = this.state
    return _.map(appointmentData, (key, index) => {
      if (index < 5) {
        return (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              marginBottom: Matrics.ScaleValue(10),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isSelectedExistTime: index,
                  isDiffTime: false,
                })
              }}
              accessible={true}
              accessibilityLabel='groupCheckBtn'
            >
              <Icon
                name={
                  index == isSelectedExistTime
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={Matrics.ScaleValue(20)}
                style={{ color: 'gray' }}
              />
            </TouchableOpacity>
            <Text
              style={
                index == isSelectedExistTime
                  ? styles.selectedTextStyle
                  : styles.unSelectedTextStyle
              }
            >{`${formatTime('dddd', key)} (${formatTime(
              'Do MMMM, h a',
              key
            )})`}</Text>
          </View>
        )
      } else {
        return null
      }
    })
  }
  handleClose() {
    this.props.toggleModal(!this.props.modalVisible)
  }
  _navigationBack = () => this.props.navigation.goBack()
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
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <TouchableOpacity
          onPress={() => this._navigationBack()}
          style={{ alignItems: 'center', flexDirection: 'row' }}
          accessible={true}
          accessibilityLabel='groupBackIconBtn'
        >
          <Icon name='keyboard-arrow-left' size={35} />
          <Text
            style={{
              fontSize: Matrics.ScaleValue(14),
              textAlign: 'left',
              fontFamily: 'OpenSans-Regular',
              color: '#000',
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: Matrics.ScaleValue(15),
              alignItems: 'center',
              color: '#000',
              marginLeft: Matrics.ScaleValue(-100),
            }}
          >
            Chat Request
          </Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      // <Modal
      //   transparent={true}
      //   animationType={'slide'}
      //   visible={this.props.modalVisible}
      //   onRequestClose={() => {}}
      // >
      <>
        {/* <View style={styles.mainContainer}> */}
        {this.state.alert_message !== '' &&
          this.AlertView(this.state.alert_message)}
        <View style={styles.modalContainer}>
          {this._viewHeader()}
          {/* <View style={{ width: width, height: height, position: 'absolute', alignContent: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator animating={this.state.loader} size="large" color="grey" />
                          </View> */}

          {this.state.loader && (
            <View style={styles.LoaderContainer}>
              <View style={styles.LoaderWrapper}>
                <ActivityIndicator
                  animating={this.state.loader}
                  size='large'
                  color='black'
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.LoaderText}>Loading...</Text>
              </View>
            </View>
          )}

          <ScrollView
            contentContainerStyle={{
              width: '90%',
              alignItems: 'flex-start',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              paddingBottom: Matrics.ScaleValue(10),
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* <Text style={styles.selectDateTextStyle}>Please select your date:</Text> */}
            <View
              style={{
                alignSelf: 'center',
              }}
            >
              <Image
                testID='groupViewing'
                style={styles.modalImageView}
                source={imgGroupViewing}
                resizeMode={'contain'}
              />
            </View>
            <Text style={styles.headerText}>
              Join one of our group viewing {`\n`} and enjoy RM50 discount if
              you rent this unit!
            </Text>

            <View style={styles.checkBoxDateContainer}>
              {this.renderDateTimeView()}
            </View>
            <View style={styles.sepratorViewContainer}>
              <View style={styles.sepratorView} />
              <Text style={styles.sepratorText}>or</Text>
              <View style={styles.sepratorView} />
            </View>

            <View style={[styles.checkBoxDateContainer, { marginBottom: 0 }]}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: Matrics.ScaleValue(10),
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isDiffTime: !this.state.isDiffTime,
                      isSelectedExistTime: -1,
                    })
                  }}
                  accessible={true}
                  accessibilityLabel='groupDiffTimeCheckBtn'
                >
                  <Icon
                    name={
                      this.state.isDiffTime == true
                        ? 'radio-button-checked'
                        : 'radio-button-unchecked'
                    }
                    size={Matrics.ScaleValue(20)}
                    style={{ color: 'gray' }}
                  />
                </TouchableOpacity>
                <Text
                  style={
                    this.state.isDiffTime == true
                      ? styles.diffTimeSelectTextStyle
                      : styles.diffTimeUnSelectTextStyle
                  }
                >
                  Request different timing
                </Text>
              </View>
            </View>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'flex-start',
                marginTop: 5,
              }}
            >
              <View>
                <View
                  style={[
                    styles.dropDownContainerStyle,
                    {
                      marginBottom: Matrics.ScaleValue(15),
                      marginTop: Matrics.ScaleValue(15),
                    },
                  ]}
                >
                  <Text style={[styles.selectedTextStyle, { paddingLeft: 0 }]}>
                    Date
                  </Text>
                  <TouchableOpacity
                    style={styles.dropDownViewStyle}
                    onPress={() => {
                      if (this.state.isDiffTime == true) {
                        this._showDateTimePicker('isDatePickerVisible')
                      }
                    }}
                    accessible={true}
                    accessibilityLabel='groupSelectedDateBtn'
                  >
                    <Text style={[styles.unSelectedTextStyle, { flex: 1 }]}>
                      {this.state.selectedDate}
                    </Text>
                    <Icon
                      name='expand-more'
                      color='gray'
                      size={Matrics.ScaleValue(22)}
                      style={{
                        color: '#4885ED',
                        alignSelf: 'flex-end',
                        width: Matrics.ScaleValue(30),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    ...styles.dropDownContainerStyle,
                    marginBottom: 0,
                  }}
                >
                  <Text style={styles.selectedTextStyleTime}>Time</Text>
                  <View style={styles.dummy} />
                </View>
                <View style={styles.timeSelectionView}>
                  <FlatList
                    data={radio_props}
                    style={styles.flatListStyle}
                    extraData={this.state}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (this.state.isDiffTime == true) {
                            this._handleTimePicker,
                              this.setState({
                                selectedTime: radio_props[index].time.trim(),
                              })
                          }
                        }}
                        accessible={true}
                        accessibilityLabel='groupListItemBtn'
                      >
                        <View
                          style={
                            this.state.selectedTime ===
                              radio_props[index].time.trim()
                              ? styles.timeBorderStyleSelected
                              : styles.timeBorderStyle
                          }
                        >
                          <Text
                            style={
                              this.state.selectedTime ===
                                radio_props[index].time.trim()
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

                {/* <TouchableOpacity
                    style={styles.dropDownViewStyle}
                    onPress={() => {
                      if (this.state.isDiffTime == true) {
                        this._showDateTimePicker('isTimePickerVisible');
                      }
                    }}
                  >
                    <Text style={styles.unSelectedTextStyle}>
                      {this.state.selectedTime}
                    </Text>
                    <Icon
                      name="expand-more"
                      color="gray"
                      size={Matrics.ScaleValue(22)}
                      style={{
                        color: '#4885ED',
                        width: Matrics.ScaleValue(30)
                      }}
                    />
                  </TouchableOpacity> */}
              </View>
            </View>
            <View
              style={{
                height: Matrics.ScaleValue(80),
                width: width * 0.8,
                marginLeft: 12,
                alignSelf: 'center',
              }}
            >
              <TouchableOpacity
                style={[
                  styles.selectedButtonStyle,
                  { backgroundColor: '#FFE100' },
                ]}
                onPress={() => {
                  this.handleSubmit()
                }}
                accessible={true}
                accessibilityLabel='groupSubmitBtn'
              >
                {this.state.isLoading ? (
                  <ActivityIndicator size='small' color='white' />
                ) : (
                    <Text
                      style={[
                        styles.selectedButtonTextStyle,
                        { fontSize: Matrics.ScaleValue(15), color: 'black' },
                      ]}
                    >
                      Submit
                    </Text>
                  )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        {/* </View> */}
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
      </>
      //{' '}
      // </Modal>
    )
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  closeHeader: {
    height: Matrics.ScaleValue(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 30,
  },
  headerText: {
    alignContent: 'center',
    color: 'black',
    alignSelf: 'center',
    paddingHorizontal: Matrics.ScaleValue(15),
    fontFamily: 'OpenSans-Bold',
    fontSize: Matrics.ScaleValue(14),
    marginBottom: Matrics.ScaleValue(10),
    textAlign: 'center',
  },
  modalImageView: {
    width: Matrics.ScaleValue(140),
    // marginLeft: Matrics.ScaleValue(85),
    alignContent: 'center',
    height: Matrics.ScaleValue(140),
    alignSelf: 'flex-start',
  },
  selectDateTextStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
  },
  checkBoxDateContainer: {
    width: '90%',
    marginTop: Matrics.ScaleValue(10),
    alignSelf: 'center',
    marginHorizontal: Matrics.ScaleValue(25),
    paddingHorizontal: Matrics.ScaleValue(15),
  },
  selectedTextStyleTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'black',
    alignSelf: 'flex-start',
  },
  selectedTextStyle: {
    paddingLeft: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'black',
  },
  unSelectedTextStyle: {
    paddingLeft: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'gray',
    // flex: 1
  },
  selectedButtonStyle: {
    height: Matrics.ScaleValue(40),
    backgroundColor: 'black',
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.78,
    justifyContent: 'center',
    marginVertical: Matrics.ScaleValue(15),
    padding: 2,
  },
  selectedButtonTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(12),
    color: 'white',
    fontWeight: '500',
  },
  unSelectedButtonStyle: {
    height: Matrics.ScaleValue(40),
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unSelectedButtonTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'black',
  },
  sepratorViewContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 15,
    marginHorizontal: Matrics.ScaleValue(20),
    marginVertical: Matrics.ScaleValue(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sepratorView: {
    height: 1,
    backgroundColor: 'black',
    flex: 1,
    marginHorizontal: Matrics.ScaleValue(10),
  },
  sepratorText: {
    width: Matrics.ScaleValue(18),
    height: Matrics.ScaleValue(18),
    fontSize: Matrics.ScaleValue(14),
    textAlign: 'center',
  },
  dropDownContainerStyle: {
    flexDirection: 'row',
    marginBottom: Matrics.ScaleValue(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownViewStyle: {
    flexDirection: 'row',
    height: Matrics.ScaleValue(35),
    width: '73%',
    marginLeft: Matrics.ScaleValue(15),
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: Matrics.ScaleValue(10),
  },
  dropDownTextStyle: {
    flex: 1,
  },
  diffTimeUnSelectTextStyle: {
    paddingLeft: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'gray',
  },
  diffTimeSelectTextStyle: {
    paddingLeft: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'black',
  },
  LoaderContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  LoaderWrapper: {
    width: '25%',
    height: '18%',
    backgroundColor: '#FFE100',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: Matrics.ScaleValue(10),
  },
  LoaderText: {
    color: 'black',
    textAlign: 'center',
  },
  timeBorderStyleSelected: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFE100',
    margin: Matrics.ScaleValue(8),
  },
  timeBorderStyle: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    margin: Matrics.ScaleValue(7),
  },
  timeText: {
    color: 'grey',
    textAlign: 'center',
  },
  timeTextSelected: {
    color: '#FFE100',
    textAlign: 'center',
  },
  flatListStyle: {
    // width: "80%",
    alignSelf: 'center',
  },
  timeSelectionView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: Matrics.ScaleValue(10),
  },
  dummy: {
    flexDirection: 'row',
    height: Matrics.ScaleValue(28),
    width: '73%',
    marginLeft: Matrics.ScaleValue(15),
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Matrics.ScaleValue(10),
  },
})
function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAppointmentView)
