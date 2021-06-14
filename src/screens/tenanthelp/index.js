import React, { Component } from 'react'
import {
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  View,
  BackHandler,
  Linking
} from 'react-native'

import Header from '../common/Header'
import style from './style'
import color from '../../common/styles/color'

import LocalShipping from '../../../Images/tenanthelp/local_shipping-48px.png'
import DescImage from '../../../Images/tenanthelp/description-48px.png'
import ZeroDeposit from '../../../Images/tenanthelp/how_to_reg-48px.png'
import Chat from '../../../Images/tenanthelp/chat-48px.png'

const TenantHelpContent = ({ icon, title, extraText, children }) => (
  <View style={style.tenantHelpContent}>
    <View style={style.imageContainer}>{icon}</View>
    <Text style={style.contentWithHeader_1}>{title}</Text>
    <Text style={style.contentWithHeader_2}>{children}</Text>
    <Text style={style.extraText}>{extraText}</Text>
  </View>
)

export default class TenantHelp extends Component {
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

  render() {
    return (
      <SafeAreaView style={style.root}>
        <Header headerTitle='Tenant Help' navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={style.tenantHelpScrollView}>
          <Text style={style.tenantTitle}>
            How to Rent a Zero Deposit Home with SPEEDHOME?
          </Text>
          <TenantHelpContent
            icon={
              <Image
                testID='searchProperty'
                source={Chat}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Search for Property & ${'\n'}Chat to the Owner`}
          >
            Browse through our verified listings.
            Chat directly with the owner to
            arrange a viewing time.
          </TenantHelpContent>
          <TenantHelpContent
            icon={
              <Image
                testID='zeroDeposit'
                source={ZeroDeposit}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Zero Deposit Eligibility Check`}
          >
            Out team will collect some simple
            documents from you to run an
            eligibility check.
          </TenantHelpContent>
          <TenantHelpContent
            icon={
              <Image
                testID='signDigital'
                source={DescImage}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Sign Digital Tenancy  Agreement`}
          >
            Pay booking fee and sign our
            unbiased digital tenancy
            agreement.
          </TenantHelpContent>
          <TenantHelpContent
            icon={
              <Image
                testID='moveInto'
                source={LocalShipping}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Move Into Your New Home`}
          >
            Pay your remaining fees and take
            your keys to move in. Simple!
          </TenantHelpContent>
          <Text style={style.bottomText}>
            For more information,{' '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() =>
                Linking.openURL('https://speedhome.com/learn/tenant')
              }
            >
              click here.
            </Text>
          </Text>
          <View style={style.customSize('auto', 100)} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}
