import React, { Component } from 'react'
import Container from '../../../components/Container'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import ModalSelector from 'react-native-modal-selector'
import { Matrics } from '../../../common/styles'
import DateTimePicker from 'react-native-modal-datetime-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Http from '../../../api/http'
import APICaller from '../../../util/apiCaller'
import ErrorDialog from '../../../components/ErrorDialog'
// import imgInstanceViewing from "../../../../Images/UI/IC_INSTANT_VIEWING.png";

import {
  employmentTypeList,
  paxTypeConst,
  genderList,
  incomeList
} from '../../../common/constants'

import styles from './styles'
import { ScrollView } from 'react-native-gesture-handler'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import { trackerEventSubmit } from '../../../util/trackEventNames'
import { logEvent, events } from '../../../util/fbAnalytics'

class AdditionalInfo extends Component {
  constructor (props) {
    super(props)
    let today = new Date()

    let minDate = new Date()
    minDate.setDate(today.getDate() + (today.getHours() >= 13 ? 1 : 0))

    this.state = {
      showErrorDialog: false,
      value: 0,
      selectTime: false,
      isLoading: false,
      selectedDateObj: null,
      selectedTime: 'Select Time',
      selectedTimeHours: 0,
      selectedTimeMinutes: 0,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      alert_message: '',
      selectedDateObjForPicker: minDate,
      selectedTimeObj: null,
      selectDate: false,
      defaultTime: '',

      contractType: employmentTypeList,
      numberOfPax: paxTypeConst,
      genderType: genderList,
      monthlyIncomeList: incomeList,

      companyName: '',
      contract: '',
      income: 0,
      noPax: 0,
      reasonToMove: '',
      gender: '',
      selectedDate: `dd/mm/yyyy`,
      myDate: 'dd/mm/yyyy',
      dob: `dd/mm/yyyy`,

      minimumDate: today
    }
  }

  componentDidMount () {
    this.getUserData()
  }

  getUserData () {
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      this.setState({ token: user_credentials.token })
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        ''
      ).then(response => {
        if (response.data.monthlyIncome === 1999) {
          this.setState({ income: 'Less than 2k' })
        } else if (response.data.monthlyIncome === 2000) {
          this.setState({ income: '2k - 4k' })
        } else if (response.data.monthlyIncome === 4000) {
          this.setState({ income: '4k - 8k' })
        } else if (response.data.monthlyIncome === 8000) {
          this.setState({ income: 'More than 8k' })
        }

        let newDate = ''
        if (this.state.selectDate === false) {
          if (response.data.dob !== '' && response.data.dob !== null) {
            let dateOfBirth = response.data.dob.substring(
              0,
              response.data.dob.indexOf('T')
            )
            newDate = dateOfBirth.replace('-', '/')
            newDate = newDate.replace('-', '/')
            this.setState({
              myDate: dateOfBirth,
              selectedDate: response.data.dob
            })
          }
        }

        this.setState({ reasonToMove: response.data.reasonForMove })
        this.setState({ gender: response.data.gender })
        this.setState({ contract: response.data.contractType })
        this.setState({ noPax: response.data.paxNumber })
        this.setState({ companyName: response.data.companyName })

        {
          const arrContractType = this.state.contractType.map((val, index) => {
            if (
              val.label.toString().toLowerCase() ===
              (response.data != null && response.data.contractType != null)
                ? response.data.contractType.toString().toLowerCase()
                : ''
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              contractType: arrContractType
            },
            () => {}
          )
        }

        {
          const arrIncomeType = this.state.monthlyIncomeList.map(
            (val, index) => {
              if (
                val.label.toString().toLowerCase() ===
                this.state.income.toString().toLowerCase()
              ) {
                val.section = true
              } else {
                val.section = false
              }
              return val
            }
          )
          this.setState(
            {
              monthlyIncomeList: arrIncomeType
            },
            () => {}
          )
        }

        {
          const arrPaxType = this.state.numberOfPax.map((val, index) => {
            if (
              val.label.toString().toLowerCase() ===
              (response &&
                response.data &&
                response.data.paxNumber &&
                response.data.paxNumber.toString().toLowerCase())
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              numberOfPax: arrPaxType
            },
            () => {}
          )
        }

        {
          const arrGenderType = this.state.genderType.map((val, index) => {
            if (
              val.label.toString().toLowerCase() ===
              (response &&
                response.data &&
                response.data.gender &&
                response.data.gender.toString().toLowerCase())
            ) {
              val.section = true
            } else {
              val.section = false
            }
            return val
          })
          this.setState(
            {
              genderType: arrGenderType
            },
            () => {}
          )
        }
      })
    }
  }

  _showDateTimePicker = stateName => {
    this.setState({ [stateName]: true })
  }

  _hideDateTimePicker = stateName => {
    this.setState({ [stateName]: false })
  }

  _handleDatePicker = date => {
    const dateNew = `${date.getFullYear()}-${(date.getMonth() + 1 < 10
      ? '0'
      : '') +
      (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') +
      date.getDate()}T`
    const time = `00:00:00`

    this.setState(
      {
        selectDate: true,
        myDate: dateNew + time,
        isDatePickerVisible: false
      },
      () => {
        if (this.state.selectedTimeObj) {
          this._handleTimePicker(this.state.selectedTimeObj)
        }
      }
    )
  }

  _handleTime (isSameDay, date, selectedDateObj) {
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

  _handleTimePicker = date => {
    const { selectedDateObj } = this.state

    const isSameDay =
      selectedDateObj &&
      selectedDateObj.getDate() === new Date().getDate() &&
      selectedDateObj.getMonth() === new Date().getMonth() &&
      selectedDateObj.getFullYear() === new Date().getFullYear()

    this.setState({ defaultTime: '' })

    this._handleTime(isSameDay, date, selectedDateObj)
  }

  AlertView = message => (
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

  _hideAlertView = () => {
    setTimeout(() => this.setState({ alert_message: '' }), 2000)
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  saveInformation () {
    if (!this.state.companyName || this.state.companyName == '') {
      this.setState({ alert_message: 'Enter company name' })
      this._hideAlertView()
    } else if (!this.state.contract || this.state.contract == '') {
      this.setState({ alert_message: 'Select type of contract' })
      this._hideAlertView()
    } else if (!this.state.income || this.state.income == '') {
      this.setState({ alert_message: 'Select monthly income' })
      this._hideAlertView()
    } else if (
      !this.state.noPax ||
      this.state.noPax == '' ||
      this.state.noPax == 0
    ) {
      this.setState({ alert_message: 'Select number of pax' })
      this._hideAlertView()
    } else if (!this.state.reasonToMove || this.state.reasonToMove == '') {
      this.setState({ alert_message: 'Enter reason for move' })
      this._hideAlertView()
    } else if (!this.state.gender || this.state.gender == '') {
      this.setState({ alert_message: 'Select gender' })
      this._hideAlertView()
    } else if (this.state.myDate == 'dd/mm/yyyy' || this.state.myDate == '') {
      this.setState({ alert_message: 'Select date of birth' })
      this._hideAlertView()
      return
    } else {
      if (!global.networkConnection) return

      let incomeMonthly = 0
      if (this.state.income === 'Less than 2k') {
        incomeMonthly = 1999
      } else if (this.state.income === '2k - 4k') {
        incomeMonthly = 2000
      } else if (this.state.income === '4k - 8k') {
        incomeMonthly = 4000
      } else if (this.state.income === 'More than 8k') {
        incomeMonthly = 8000
      }

      // let date = "";
      // let time = "";
      // if (this.state.selectedDate !== "dd/mm/yyyy") {
      //     date = `${selectedDateObj.getFullYear()}-${((selectedDateObj.getMonth() + 1) < 10 ? '0' : '') + (selectedDateObj.getMonth() + 1)}-${(selectedDateObj.getDate() < 10 ? '0' : '') + selectedDateObj.getDate()}T`;
      //     time = `00:00:00`;
      // }

      if (this.props.isUserLogin == true) {
        let data = this.props.userLoginData
        this.showLoader()
        var body = {
          companyName: this.state.companyName,
          contractType: this.state.contract,
          gender: this.state.gender,
          reasonForMove: this.state.reasonToMove
        }

        if (incomeMonthly === 0) {
          body['monthlyIncome'] = 0
        } else {
          body['monthlyIncome'] = incomeMonthly
        }

        if (this.state.noPax === 0 || this.state.noPax === null) {
          body['paxNumber'] = 0
        } else {
          body['paxNumber'] = this.state.noPax
        }

        if (this.state.myDate === 'dd/mm/yyyy') {
          body['dob'] = ''
        } else {
          body['dob'] =
            this.state.selectDate === true
              ? this.state.myDate === 'dd/mm/yyyy'
                ? ''
                : this.state.myDate
              : this.state.selectedDate
        }

        APICaller(
          `${Http.updateProfileDetails(data.userId)}`,
          'PUT',
          data.token,
          JSON.stringify(body)
        ).then(json => {
          if (!json) {
            this.hideLoader()
            return
          }
          if (json.status === 200) {
            analytics().logEvent(
              trackerEventSubmit.chatWithOwner.action.chatRequestSubmit3
            )
            logEvent(trackerEventSubmit.chatWithOwner.action.chatRequestSubmit3)
            this.setState({
              companyName: '',
              contract: '',
              income: 0,
              noPax: 0,
              reasonToMove: '',
              gender: '',
              selectedDate: `dd/mm/yyyy`,
              myDate: 'dd/mm/yyyy',
              dob: `dd/mm/yyyy`
            })
            this.hideLoader()
            this.onSubmitOrClose()
          } else {
            this.hideLoader()
            this.displayError()
          }
        })
      }
    }
  }

  onSubmitOrClose () {
    const { navigation } = this.props
    navigation.goBack()
    navigation.state.params.handleBackFromInfo({})
  }

  exit = () => {
    this.props.toggleModal(!this.props.modalVisible)
  }

  changeOption = (data, stateName, option) => {
    this.setState({
      [stateName]: option.label
    })

    let bedroomD = data

    bedroomD.map(res => {
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

  _viewHeader () {
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
          elevation: 6,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            {/* <TouchableOpacity onPress={() => this._navigationBack()}>
                  <Icon name="arrow-back" size={30} />
                </TouchableOpacity> */}
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Chat Request
            </Text>
          </View>
        </View>
      </View>
    )
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  render () {
    // let newDate = "";

    // if (this.state.dob !== "" && this.state.dob !== null) {
    //     let dateOfBirth = this.state.dob.substring(0, this.state.dob.indexOf('T'));
    //     newDate = dateOfBirth.replace("-", "/");
    //     newDate = newDate.replace("-", "/");
    // }

    return (
      <Container>
        {this._viewHeader()}
        {/* <View style={{ paddingLeft: 20, paddingRight: 20}} > */}
        {/* <View style={styles.modalContainer}> */}
        <ScrollView style={{ flex: 1 }}>
          {this.state.alert_message !== '' &&
            this.AlertView(this.state.alert_message)}
          <View
            style={{
              flex: 1,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20
            }}
          >
            <View
              style={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                flexDirection: 'row',
                height: 50,
                marginTop: 10,
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#000000'
                }}
              >
                Some additional questions
              </Text>
              {/* <TouchableOpacity
                                    onPress={() => this.props.toggleModal(!this.props.modalVisible)}
                                    style={{}}>
                                    <Icon name="clear" size={25} style={{ color: "#000" }} />
                                </TouchableOpacity> */}
            </View>

            <View style={{}}>
              <Text
                style={[
                  styles.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Name of company / University
              </Text>

              <TextInput
                testID='companyName'
                keyboardType='default'
                style={{
                  fontFamily: 'OpenSans-Regular',
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5
                }}
                placeholder='Walt Disney'
                placeholderTextColor='#9AA1A9'
                value={this.state.companyName}
                onChangeText={companyName => {
                  this.setState({ companyName: companyName })
                }}
                accessible={true}
                accessibilityLabel='chatAddInfoModalCnameInput'
              />
            </View>

            <View style={{}}>
              <Text
                style={[
                  styles.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Type of contract
              </Text>
              <ModalSelector
                data={this.state.contractType}
                initValue='Select Bedroom'
                onChange={option =>
                  this.changeOption(this.state.contractType, 'contract', option)
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
                  accessibilityLabel='addInfoTextInfoBtn'
                >
                  <TextInput
                    testID='contract'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Please select one'
                    placeholderTextColor='#9AA1A9'
                    value={this.state.contract}
                    onChangeText={contract => {
                      this.setState({ contract: contract })
                    }}
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='chatAddInfoModalContactInput'
                  />
                  <FontAwesome
                    name='chevron-down'
                    style={{ position: 'absolute', marginLeft: '95%' }}
                  />
                </TouchableOpacity>
              </ModalSelector>
            </View>

            <View style={{}}>
              <Text
                style={[
                  styles.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Monthly income
              </Text>
              <ModalSelector
                data={this.state.monthlyIncomeList}
                initValue='Select Bedroom'
                onChange={option =>
                  this.changeOption(
                    this.state.monthlyIncomeList,
                    'income',
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
                  accessibilityLabel='addInfoIncomeBtn'
                >
                  <TextInput
                    testID='income'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Please select one'
                    placeholderTextColor='#9AA1A9'
                    value={this.state.income}
                    onChangeText={income => {
                      this.setState({ income: income })
                    }}
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='chatAddInfoModalIncomeInput'
                  />
                  <FontAwesome
                    name='chevron-down'
                    style={{ position: 'absolute', marginLeft: '95%' }}
                  />
                </TouchableOpacity>
              </ModalSelector>
            </View>

            <View style={{}}>
              <Text
                style={[
                  styles.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                No. of Pax
              </Text>
              <ModalSelector
                data={this.state.numberOfPax}
                initValue='Select Bedroom'
                onChange={option =>
                  this.changeOption(this.state.numberOfPax, 'noPax', option)
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
                  accessibilityLabel='addInfoNoPaxBtn'
                >
                  <TextInput
                    testID='noPax'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder='Please select one'
                    placeholderTextColor='#9AA1A9'
                    value={String(this.state.noPax)}
                    onChangeText={noPax => {
                      this.setState({ noPax: noPax })
                    }}
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='chatAddInfoModalNoPaxInput'
                  />
                  <FontAwesome
                    name='chevron-down'
                    style={{ position: 'absolute', marginLeft: '95%' }}
                  />
                </TouchableOpacity>
              </ModalSelector>
            </View>

            <View style={{}}>
              <Text
                style={[
                  styles.bytapText,
                  { marginTop: Matrics.ScaleValue(20) }
                ]}
              >
                Reason for move
              </Text>

              <TextInput
                testID='reasonToMove'
                keyboardType='default'
                style={{
                  fontFamily: 'OpenSans-Regular',
                  height: Matrics.ScaleValue(40),
                  width: '100%',
                  borderBottomColor: '#9AA1A9',
                  borderBottomWidth: 0.5
                }}
                placeholder='0'
                placeholderTextColor='#9AA1A9'
                value={this.state.reasonToMove}
                onChangeText={reasonToMove => {
                  this.setState({ reasonToMove: reasonToMove })
                }}
                accessible={true}
                accessibilityLabel='chatAddInfoModalReasonInput'
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { marginTop: Matrics.ScaleValue(20) }
                  ]}
                >
                  Gender
                </Text>
                <ModalSelector
                  data={this.state.genderType}
                  initValue='Select Bedroom'
                  onChange={option =>
                    this.changeOption(this.state.genderType, 'gender', option)
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
                    accessibilityLabel='addInfoGenderBtn'
                  >
                    <TextInput
                      testID='gender'
                      keyboardType='default'
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        height: Matrics.ScaleValue(40),
                        width: '100%',
                        borderBottomColor: '#9AA1A9',
                        borderBottomWidth: 0.5
                      }}
                      placeholder='Please select one'
                      placeholderTextColor='#9AA1A9'
                      value={this.state.gender}
                      onChangeText={gender => {
                        this.setState({ gender: gender })
                      }}
                      pointerEvents='none'
                      editable={false}
                      accessible={true}
                      accessibilityLabel='chatAddInfoModalGenderInput'
                    />
                    <FontAwesome
                      name='chevron-down'
                      style={{ position: 'absolute', marginLeft: '92%' }}
                    />
                  </TouchableOpacity>
                </ModalSelector>
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={[
                    styles.bytapText,
                    { marginTop: Matrics.ScaleValue(20) }
                  ]}
                >
                  Date of Birth
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    this._showDateTimePicker('isDatePickerVisible')
                  }
                  accessible={true}
                  accessibilityLabel='addInfoMyDateBtn'
                >
                  <TextInput
                    testID='myDate'
                    keyboardType='default'
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      height: Matrics.ScaleValue(40),
                      width: '100%',
                      borderBottomColor: '#9AA1A9',
                      borderBottomWidth: 0.5
                    }}
                    placeholder={'dd/mm/yyyy'}
                    placeholderTextColor='#9AA1A9'
                    value={
                      this.state.myDate.indexOf('T') > -1
                        ? this.state.myDate.substring(
                            0,
                            this.state.myDate.indexOf('T')
                          )
                        : this.state.myDate
                    }
                    pointerEvents='none'
                    editable={false}
                    accessible={true}
                    accessibilityLabel='chatAddInfoModalMyDateInput'
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomButton}>
              <View style={styles.styleViewShadow}>
                <TouchableOpacity
                  onPress={() => this.saveInformation()}
                  accessible={true}
                  accessibilityLabel='addInfoSaveBtn'
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 15,
                      textAlign: 'center',
                      color: '#000'
                    }}
                  >
                    Save and exit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* </View> */}

        <DateTimePicker
          datePickerContainerStyleIOS={{ paddingHorizontal: 40 }}
          maximumDate={this.state.minimumDate}
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
        {/* </View> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInfo)
