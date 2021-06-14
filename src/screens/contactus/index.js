import React, { Component, Fragment } from 'react'
import {
  Text,
  Image,
  ScrollView,
  View,
  Linking,
  Clipboard,
  BackHandler
} from 'react-native'
import Container from '../../components/Container'

import Header from '../common/Header'
import style from './style'

import CoverImage from '../../../Images/contactus/contact_us_174_150.png'

const GENERAL_EMAIL = 'hello@speedhome.com'
const FINANCE_EMAIL = 'finance@speedhome.com'
const PARTNERSHIP_COLLAB_EMAIL = 'kennethgan@speedhome.com'
const FINANCE_NUMBER = '+6018 7777 650'
const PARTNER_COLLAB_NUMBER = '+6018 2192 696'

const ContactDetails = ({
  title,
  children0,
  children1,
  children2,
  url1,
  url2,
  onLongPress,
  onLongPressOther
}) => (
  <Fragment>
    <Text style={style.contactDetailsWithHeader_1}>{title}</Text>
    {children0 !== null && children0 !== undefined && children0 !== '' ? (
      <Text style={style.contactDetailsWithHeader_2}>{children0}</Text>
    ) : null}
    <Text
      style={style.contactDetailsWithHeader_2}
      onPress={() => Linking.openURL(url1)}
      onLongPress={onLongPress}
    >
      {children1}
    </Text>
    {children2 !== null && children2 !== undefined && children2 !== '' ? (
      <Text
        style={style.contactDetailsWithHeader_2}
        onPress={() => Linking.openURL(url2)}
        onLongPress={onLongPressOther}
      >
        {children2}
      </Text>
    ) : null}
  </Fragment>
)

export default class ContactUs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertMessage: ''
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  displayAlert = (url) => {
    Clipboard.setString(url)
    this.setState({ alertMessage: 'Text copies' })
    this.hideAlertView()
  }
  AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: 100,
        height: 30,
        bottom: 15,
        // zIndex: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        opacity: 0.9
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: 'white'
        }}
      >
        {message.replace('null', 'empty')}
      </Text>
    </View>
  )
  hideAlertView = () => {
    setTimeout(() => {
      this.setState({ alertMessage: '' })
    }, 2000)
  }
  render() {
    return (
      <View style={style.root}>
        <Header headerTitle='Contact Us' navigation={this.props.navigation} />
        {this.state.alertMessage !== '' &&
          this.AlertView(this.state.alertMessage)}
        <ScrollView contentContainerStyle={style.contactScrollView}>
          <Text style={style.contactTitle}>Keep in touch</Text>
          <ContactDetails
            title='General Enquiries:'
            children1={GENERAL_EMAIL}
            url1={`mailto:${GENERAL_EMAIL}`}
            onLongPress={() => {
              this.displayAlert(GENERAL_EMAIL)
            }}
            children2={FINANCE_NUMBER}
            url2={`tel:${FINANCE_NUMBER}`}
            onLongPressOther={() => {
              this.displayAlert(FINANCE_NUMBER)
            }}
          />
          <ContactDetails
            title='Finance/Claims:'
            children1={FINANCE_EMAIL}
            url1={`mailto:${FINANCE_EMAIL}`}
            onLongPress={() => {
              this.displayAlert(FINANCE_EMAIL)
            }}
          />
          <ContactDetails
            title='Partnership/Collaboration:'
            children0='Kenneth Gan'
            children1={PARTNERSHIP_COLLAB_EMAIL}
            url1={`mailto:${PARTNERSHIP_COLLAB_EMAIL}`}
            onLongPress={() => {
              this.displayAlert(PARTNERSHIP_COLLAB_EMAIL)
            }}
            children2={PARTNER_COLLAB_NUMBER}
            url2={`tel:${PARTNER_COLLAB_NUMBER}`}
            onLongPressOther={() => {
              this.displayAlert(PARTNER_COLLAB_NUMBER)
            }}
          />
          <View style={style.customSize('auto', 50)} />
          <Image testID='cover' source={CoverImage} style={style.coverImage} />
          <View style={style.customSize('auto', 50)} />
        </ScrollView>
      </View>
    )
  }
}
