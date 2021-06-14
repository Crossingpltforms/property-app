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

import HomeImage from '../../../Images/landlordhelp/home-48px.png'
import PersonSearch from '../../../Images/landlordhelp/person_search-48px.png'
import FastCheck from '../../../Images/landlordhelp/fact_check-48px.png'
import Security from '../../../Images/landlordhelp/security-48px.png'

const LandlordContentView = ({ icon, title, extraText, children }) => (
  <View style={style.landlordContentView}>
    <View style={style.imageContainer}>{icon}</View>
    <Text style={style.contentWithHeader_1}>{title}</Text>
    <Text style={style.contentWithHeader_2}>{children}</Text>
    <Text style={style.extraText}>{extraText}</Text>
  </View>
)

export default class LandlordHelp extends Component {
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
        <Header
          headerTitle='Landlord Help'
          navigation={this.props.navigation}
        />
        <ScrollView contentContainerStyle={style.landlordScrollView}>
          <Text style={style.landlordTitle}>
            How to Rent Out Your House using SPEEDHOME?
          </Text>
          <LandlordContentView
            icon={
              <Image
                testID='postProperty'
                source={HomeImage}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title='Post Property for Free'
            extraText='* Subject to supported areas'
          >
            Upload HD and bright photos of
            your house. We can optionally help
            you to show your house to
            interested tenants.
          </LandlordContentView>
          <LandlordContentView
            icon={
              <Image
                testID='getMatched'
                source={PersonSearch}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title='Get Matched with Tenant'
          >
            The interested tenants can chat
            with you instantly OR you can make
            an offer through our "Tenant
            Search" feature.
          </LandlordContentView>
          <LandlordContentView
            icon={
              <Image
                testID='backGroundCheck'
                source={FastCheck}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Background check & Sign Tenancy Agreement Online`}
          >
            Once your tenant clears a complete
            Zero Deposit Eligibility check, you
            can proceed to sign your online
            tenancy agreement which will be stamped by LHDN.
          </LandlordContentView>
          <LandlordContentView
            icon={
              <Image
                testID='allianzProtection'
                source={Security}
                style={[
                  style.customImageSize(48, 48),
                  { tintColor: color.iconBlue }
                ]}
              />
            }
            title={`Allianz Protection up to RM42,000 and Get Your Rent On-time`}
          >
            With out Allianz Insurance
            Protection, you are now 20x better
            protected. Enjoy a worry free rental
            experience alogn with Free Rental
            Collection.
          </LandlordContentView>
          <Text style={style.bottomText}>
            For more information,{' '}
            <Text
              unde
              style={{ textDecorationLine: 'underline' }}
              onPress={() =>
                Linking.openURL('https://speedhome.com/learn/landlord')
              }
            >
              click here.
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
