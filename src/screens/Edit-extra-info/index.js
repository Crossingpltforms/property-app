import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  TextInput,
  Text,
  View,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// Custom Components
import Header from '../common/Header'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import ErrorDialog from '../../components/ErrorDialog'

// Import style
import ExtrainfoStyle from './styles'

import imgAllinaz from '../../../Images/UI/allinaz.png'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'

import Furnishing from '../extrainfo/Furnishing'
import Facilities from '../extrainfo/Facilities'
import DateTimePicker from 'react-native-modal-datetime-picker'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { Matrics } from '../../common/styles'
// import {CheckBox} from 'native-base';
import { logEvent, events } from '../../util/fbAnalytics'
import {
  tracker,
  trackerEventConfig,
  trackerEventSubmit
} from '../../util/trackEventNames'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
let date = new Date()
date.setDate(date.getDate() + 1) // tomorrow

class EditExtrainfo extends Component {
  constructor (props) {
    super(props)

    this.leaseTypeSelector = {
      LEASEHOLD: 'Lease Hold',
      FREEHOLD: 'Free Hold'
    }

    let propertyType = (this.props.navigation.state.params.details
      ? this.props.navigation.state.params.details.type
      : ''
    ).split('_')
    let isSale = false

    if (propertyType.length > 1 && propertyType[1] === 'SALE') {
      isSale = true
    }

    this.initialState = {
      furnishing: {
        curtain: false,
        mattress: false,
        ac: false,
        hood_hub: false,
        water_heater: false,
        dining_table: false,
        wardrobe: false,
        kitchen_cabinet: false,
        fridge: false,
        washingMachine: false,
        sofa: false,
        oven: false,
        microwave: false,
        tv: false,
        bedFrame: false,
        internet: false
      },
      facilities: {
        barbeque_area: false,
        covered_parking: false,
        gymnasium: false,
        basketball: false,
        restaurant: false,
        dobby: false,
        nursery: false,
        playground: false,
        tennis_court: false,
        twenty_four_hr_security: false,
        mart: false,
        squash_court: false,
        badminton: false,
        elevator: false,
        swimmingPool: false,
        Sauna: false
      },

      isBomiLot: false,
      isAcceptAllRaces: false,
      isAllowWhatsappAutomation: false,
      isPetFriendly: false,
      isDateTimePickerVisible: false,
      avalible_date: '',
      show_date: 'Date(dd/mm/yyyy)',
      minimum_stay: 0,
      description: '',
      minimum_stay_data: [
        { key: 1, section: true, label: '0' },
        { key: 2, section: false, label: '1' },
        { key: 3, section: false, label: '2' },
        { key: 4, section: false, label: '3' },
        { key: 5, section: false, label: '4' },
        { key: 6, section: false, label: '5' },
        { key: 7, section: false, label: '6' },
        { key: 8, section: false, label: '7' },
        { key: 9, section: false, label: '8' },
        { key: 10, section: false, label: '9' },
        { key: 11, section: false, label: '10' },
        { key: 12, section: false, label: '11' }
      ],
      // leaseTypeData: [
      //   { key: 1, section: false, label: "Lease Hold", value: "LEASEHOLD" },
      //   { key: 2, section: false, label: "Free Hold", value: "FREEHOLD" }
      // ],
      // title_type: this.props.navigation.state.params.details.leaseType
      //   ? this.leaseTypeSelector[
      //       this.props.navigation.state.params.details.leaseType
      //     ]
      //   : "Choose One",
      alertMessage: '',
      listDetailsData: '',
      propertyId: '',
      isSale
    }

    this.state = {
      showErrorDialog: false,
      ...this.initialState,
      minimumDate: new Date()
    }
  }

  componentDidMount () {
    const listDetails = this.props.navigation.state.params.details

    let date = new Date(listDetails.availability)

    this.setState(
      {
        propertyId: listDetails.id,
        listDetailsData: listDetails,
        facilities: listDetails.facilities,
        description: listDetails.description,
        isBomiLot: listDetails.bumiLot,
        isAcceptAllRaces: listDetails.allRaces,
        isAllowWhatsappAutomation: listDetails.allowWhatsappAutomation,
        isPetFriendly: listDetails.petFriendly,
        avalible_date: listDetails.availability,
        show_date: `${date.getUTCDate()}/${date.getUTCMonth() +
          1}/${date.getUTCFullYear()}`,
        furnishing: {
          curtain: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'curtain'
              })
              ? true
              : false
            : false,
          mattress: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'mattress'
              })
              ? true
              : false
            : false,
          ac: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'ac'
              })
              ? true
              : false
            : false,
          hood: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'hood'
              })
              ? true
              : false
            : false,
          water_heater: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'water_heater'
              })
              ? true
              : false
            : false,
          dining_table: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'dining_table'
              })
              ? true
              : false
            : false,
          wardrobe: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'wardrobe'
              })
              ? true
              : false
            : false,
          kitchen_cabinet: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'kitchen_cabinet'
              })
              ? true
              : false
            : false,
          fridge: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'fridge'
              })
              ? true
              : false
            : false,
          washing_machine: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'washing_machine'
              })
              ? true
              : false
            : false,
          sofa: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'sofa'
              })
              ? true
              : false
            : false,
          oven: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'oven'
              })
              ? true
              : false
            : false,
          microwave: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'microwave'
              })
              ? true
              : false
            : false,
          tv: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'tv'
              })
              ? true
              : false
            : false,
          bed_frame: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'bed_frame'
              })
              ? true
              : false
            : false,
          internet: listDetails.furnishes
            ? listDetails.furnishes.find(element => {
                return element === 'internet'
              })
              ? true
              : false
            : false
        },
        facilities: {
          // TODO map key conflict
          bbq: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'bbq'
              })
              ? true
              : false
            : false,
          covered_parking: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'covered_parking'
              })
              ? true
              : false
            : false,
          gym: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'gym'
              })
              ? true
              : false
            : false,
          basketball: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'basketball'
              })
              ? true
              : false
            : false,
          restaurant: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'restaurant'
              })
              ? true
              : false
            : false,
          dobby: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'dobby'
              })
              ? true
              : false
            : false,
          nursery: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'nursery'
              })
              ? true
              : false
            : false,
          playground: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'playground'
              })
              ? true
              : false
            : false,
          tennis: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'tennis'
              })
              ? true
              : false
            : false,
          security24hr: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'security24hr'
              })
              ? true
              : false
            : false,
          mart: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'mart'
              })
              ? true
              : false
            : false,
          squash: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'squash'
              })
              ? true
              : false
            : false,
          badminton: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'badminton'
              })
              ? true
              : false
            : false,
          elevator: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'elevator'
              })
              ? true
              : false
            : false,
          swimming: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'swimming'
              })
              ? true
              : false
            : false,
          sauna: listDetails.facilities
            ? listDetails.facilities.find(element => {
                return element === 'sauna'
              })
              ? true
              : false
            : false
        }
      },
      () => {}
    )
    // if(this.state.isSale){
    //   const arrLeaseType = this.state.leaseTypeData.map(
    //     (val, index) => {
    //       if (
    //         val.value.toLowerCase() ===
    //         listDetails.leaseType.toLowerCase()
    //       ) {
    //         val.section = true;
    //       } else {
    //         val.section = false;
    //       }
    //       return val;
    //     }
    //   );
    //   this.setState({
    //     leaseTypeData: arrLeaseType
    //   });
    // }
  }

  _navigationBack = () => this.props.navigation.goBack()

  _toggleCheckBox = (key_name, value, form_state) => () =>
    this.setState({
      ...this.state,
      [form_state]: { ...this.state[form_state], [key_name]: value }
    })

  _showDateTimePicker = () =>
    this.setState({ ...this.state, isDateTimePickerVisible: true })

  _hideDateTimePicker = () =>
    this.setState({ ...this.state, isDateTimePickerVisible: false })

  _handleDateTimePicker = date => {
    this.setState({
      ...this.state,
      avalible_date: `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1 < 10
          ? `0${date.getUTCMonth() + 1}`
          : date.getUTCMonth() + 1
      }-${
        date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate()
      }T${
        date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
      }:${
        date.getUTCMinutes() < 10
          ? `0${date.getUTCMinutes()}`
          : date.getUTCMinutes()
      }:${
        date.getUTCSeconds() < 10
          ? `0${date.getUTCSeconds()}`
          : date.getUTCSeconds()
      }.${
        date.getUTCMilliseconds() < 10
          ? `0${date.getUTCMilliseconds()}`
          : date.getUTCMilliseconds()
      }Z`,
      // avalible_date: "2019-06-14T09:43:27.654Z",
      show_date: `${date.getUTCDate()}/${date.getUTCMonth() +
        1}/${date.getUTCFullYear()}`
    })
    this.setState({ isDateTimePickerVisible: false })
  }

  _nextFunction = () => {
    if (!global.networkConnection) return

    let body = {
      availability: this.state.avalible_date,
      // minimumstay: this.state.minimum_stay,
      description: this.state.description,
      petFriendly: this.state.isPetFriendly,
      allRaces: this.state.isAcceptAllRaces,
      allowWhatsappAutomation: this.state.isAllowWhatsappAutomation,
      furnishes: Object.entries(this.state.furnishing)
        .filter(i => i[1])
        .map(i => i[0]),
      facilities: Object.entries(this.state.facilities)
        .filter(i => i[1])
        .map(i => i[0])
    }
    if (this.state.isSale) {
      body['bumiLot'] = this.state.isBomiLot
      // body["leaseType"] = this.state.title_type
      // .split(" ")
      // .join("")
      // .toUpperCase()
    }

    if (this.state.show_date !== 'Date(dd/mm/yyyy)') {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.createProperty}/${this.state.propertyId}`,
          'PUT',
          user_information.token,
          JSON.stringify(body)
        ).then(response => {
          if (response.status === 200) {
            // tracker.trackEvent(
            //   trackerEventConfig.postProperty.category,
            //   trackerEventConfig.postProperty.action.createListing3
            // );

            analytics().logEvent(
              trackerEventSubmit.postProperty.action.createListing3
            )
            logEvent(trackerEventSubmit.postProperty.action.createListing3)

            this.props.navigation.navigate('MyListing', {
              bodyData: body,
              details: this.state.listDetailsData,
              id: this.state.propertyId,
              fromScreen: 'EditProperty'
            })
          } else {
            this.displayError()
          }
        })
      }
      this._hideAlertView()
    } else {
      // if (
      //   Object.entries(this.state.furnishing)
      //     .filter(i => i[1])
      //     .map(i => i[0]).length <= 0
      // ) {
      //   this.setState({
      //     ...this.state,
      //     alertMessage: "Please select atleast one value for furnishing."
      //   });
      //   this._hideAlertView();
      // } else if (
      //   Object.entries(this.state.facilities)
      //     .filter(i => i[1])
      //     .map(i => i[0]).length <= 0
      // ) {
      //   this.setState({
      //     ...this.state,
      //     alertMessage: "Please select atleast one value for facilities."
      //   });
      //   this._hideAlertView();
      // } else {
      this.setState({
        ...this.state,
        alertMessage: 'Please select available date.'
      })
      this._hideAlertView()
      // }
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
      <View style={ExtrainfoStyle.root}>
        <Header
          disableBackNavigation={true}
          navigation={this.props.navigation}
          headerTitle='Extra Information'
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={ExtrainfoStyle.progressRoot}>
            <View style={ExtrainfoStyle.progressView1}>
              <Text style={ExtrainfoStyle.customText(14, 'black', 'normal')}>
                Step 3 of 3:{' '}
              </Text>
              <Text style={ExtrainfoStyle.customText(14, 'black', 'bold')}>
                Extra Info
              </Text>
            </View>
          </View>

          <View style={ExtrainfoStyle.labelTop}>
            <Text style={ExtrainfoStyle.labTopText}>
              Photo successfully uploaded!
            </Text>
          </View>

          {this.state.alertMessage !== '' &&
            this.AlertView(this.state.alertMessage)}

          <DateTimePicker
            datePickerContainerStyleIOS={{ paddingHorizontal: 40 }}
            minimumDate={this.state.minimumDate}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDateTimePicker}
            onCancel={this._hideDateTimePicker}
          />

          <Furnishing
            state={this.state}
            _toggleCheckBox={this._toggleCheckBox}
          />

          <Facilities
            state={this.state}
            _toggleCheckBox={this._toggleCheckBox}
          />

          <Text style={ExtrainfoStyle.furnishingLabel}>Description</Text>

          <TextInput
            testID='state'
            style={ExtrainfoStyle.descriptInput}
            numberOfLines={10}
            multiline={true}
            value={this.state.description}
            onChangeText={e => {
              this.setState({ ...this.state, description: e })
              if (e.length > 0) {
                this.setState({ alertMessage: null })
              }
            }}
            accessible={true}
            accessibilityLabel='editExtraInfoStateInput'
          />

          {this.state.isSale ? (
            <View style={[ExtrainfoStyle.extraField]}>
              <View style={[ExtrainfoStyle.furnishingBumiLotTab]}>
                <View>
                  {/* <CheckBox
                    checked={this.state.isBomiLot}
                    style={
                      this.state.isBomiLot
                        ? [ExtrainfoStyle.checkboxSelected, { marginRight: 10 }]
                        : [
                          ExtrainfoStyle.checkboxUnSelected,
                          { marginRight: 10 },
                        ]
                    }
                    onPress={() => {
                      this.setState({
                        isBomiLot: !this.state.isBomiLot,
                      })
                    }}
                    accessible={true}
                    accessibilityLabel='editExtraInfoIsBomiLotCheckBox'
                  /> */}
                </View>
                <View style={{ marginLeft: 10, width: '100%' }}>
                  <Text
                    style={{
                      ...ExtrainfoStyle.furnishingViewTabLabel,
                      fontWeight: '600'
                    }}
                  >
                    This unit is Bumi Lot
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={ExtrainfoStyle.extraField}>
              <View style={[ExtrainfoStyle.furnishingViewTab]}>
                <View>
                  <CheckBox
                    checked={this.state.isAcceptAllRaces}
                    style={
                      this.state.isAcceptAllRaces
                        ? [ExtrainfoStyle.checkboxSelected, { marginRight: 10 }]
                        : [
                            ExtrainfoStyle.checkboxUnSelected,
                            { marginRight: 10 }
                          ]
                    }
                    onPress={() => {
                      this.setState({
                        isAcceptAllRaces: !this.state.isAcceptAllRaces
                      })
                    }}
                    accessible={true}
                    accessibilityLabel='editExtraInfoAcceptAllRacesCheckBox'
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[ExtrainfoStyle.furnishingViewTabLabel]}>
                    Accept all races
                  </Text>
                </View>
              </View>
              <View style={[ExtrainfoStyle.furnishingViewTab]}>
                <View>
                  <CheckBox
                    checked={this.state.isPetFriendly}
                    style={
                      this.state.isPetFriendly
                        ? [ExtrainfoStyle.checkboxSelected, { marginRight: 10 }]
                        : [
                            ExtrainfoStyle.checkboxUnSelected,
                            { marginRight: 10 }
                          ]
                    }
                    onPress={() => {
                      this.setState({
                        isPetFriendly: !this.state.isPetFriendly
                      })
                    }}
                    accessible={true}
                    accessibilityLabel='editExtraInfoIsPetFriendlyCheckBox'
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={ExtrainfoStyle.furnishingViewTabLabel}>
                    Pet friendly
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* {this.state.isSale && (
            <View style={ExtrainfoStyle.form}>
              <Text style={ExtrainfoStyle.formLabel}>Title type:</Text>
              <ModalSelector
                data={this.state.leaseTypeData}
                onChange={option => {
                  let leaseType = this.state.leaseTypeData.map(i => ({
                    ...i,
                    section: option.label === i.label ? true : false
                  }));

                  this.setState({ leaseTypeData: leaseType });
                  this.setState({ title_type: option.label });
                }}
                optionStyle={{
                  backgroundColor: "white",
                  borderRadius: 6,
                  marginBottom: 2
                }}
                sectionStyle={{
                  backgroundColor: "#FFDF00",
                  borderRadius: 6,
                  marginBottom: 2,
                  padding: 8
                }}
              >
                <TouchableOpacity
                  style={{
                    ...ExtrainfoStyle.formInput,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={
                      this.state.title_type === "Choose one"
                        ? {
                            fontSize: 9,
                            fontWeight: "normal",
                            color: "grey"
                          }
                        : {
                            fontSize: 9,
                            fontWeight: "normal",
                            color: "black"
                          }
                    }
                  >
                    {this.state.title_type}
                  </Text>
                  <FontAwesome name="chevron-down" />
                </TouchableOpacity>
              </ModalSelector>
            </View>
          )} */}

          <View style={ExtrainfoStyle.form}>
            <Text style={ExtrainfoStyle.formLabel}>Availability date:</Text>
            <TouchableOpacity
              style={ExtrainfoStyle.formInput}
              onPress={this._showDateTimePicker}
              accessible={true}
              accessibilityLabel='editExtraInfoTimePickerBtn'
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: 'normal',
                  color: 'black'
                }}
              >
                {this.state.show_date}
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.isSale ? (
            <View />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginTop: Matrics.ScaleValue(15),
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isAllowWhatsappAutomation: !this.state
                      .isAllowWhatsappAutomation
                  })
                }}
                accessible={true}
                accessibilityLabel='editExtraInfoCheckBoxBtn'
              >
                <Icon
                  name={
                    this.state.isAllowWhatsappAutomation
                      ? 'check-box'
                      : 'check-box-outline-blank'
                  }
                  size={Matrics.ScaleValue(22)}
                  style={{ color: 'black' }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: Matrics.ScaleValue(14),
                  paddingLeft: Matrics.ScaleValue(10)
                }}
              >
                I allow tenants to contact me via Whatsapp
              </Text>
            </View>
          )}

          {this.state.isSale ? (
            <View />
          ) : (
            <View
              style={{
                backgroundColor: '#f3e1ff',
                height: 100,
                marginTop: 20,
                marginBottom: 20,
                width: Matrics.screenWidth - 30
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    backgroundColor: '#90278E',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'white',
                      fontFamily: 'OpenSans-Bold',
                      fontWeight: '500'
                    }}
                  >
                    LANDLORD INSURANCE AS DEPOSIT
                  </Text>
                </View>
                <Image
                  testID='noDeposit'
                  source={imgNoDeposit}
                  style={{ height: 40, width: 40 }}
                />
                <Image
                  testID='allianz'
                  source={imgAllinaz}
                  resizeMode='contain'
                  style={{ height: 40, width: 80, marginRight: 5 }}
                />
              </View>

              <View
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: '#90278E',
                    fontFamily: 'OpenSans-Bold',
                    fontWeight: '500'
                  }}
                >
                  Be secured up to RM 42,000
                </Text>
              </View>
            </View>
          )
          // <Image
          //   source={Advertisement}
          //   style={{
          //     width: Matrics.screenWidth - 30,
          //     height: 100,
          //     marginTop: 20,
          //     marginBottom: 20
          //   }}
          //   resizeMode={"stretch"}
          // />
          }

          <View
            style={{
              ...ExtrainfoStyle.form,
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {/* <TouchableOpacity
              onPress={this._navigationBack}
              style={ExtrainfoStyle.formBack}
            >
              <Icon
                name="arrow-back"
                size={15}
                style={ExtrainfoStyle.headerLeftArrow}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={ExtrainfoStyle.nextButton}
              onPress={this._nextFunction}
              accessible={true}
              accessibilityLabel='extraEditInfoFinishBtn'
            >
              <Text style={ExtrainfoStyle.nextButtonText}>Finish</Text>
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
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditExtrainfo)
