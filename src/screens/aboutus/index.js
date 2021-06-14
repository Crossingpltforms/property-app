import React, {Component, Fragment} from 'react';
import {
  Text,
  Image,
  ScrollView,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';
import Container from '../../components/Container';

import Header from '../common/Header';
import style from './style';

import DownloadsOne from '../../../Images/aboutus/Downloads.png';
import DownloadsTwo from '../../../Images/aboutus/Downloads_30_25.png';
import Landlords from '../../../Images/aboutus/landlords_25_25.png';
import Tenants from '../../../Images/aboutus/tenants_25_20.png';

import StarImage from '../../../Images/aboutus/featured_in/star_108_55.png';
import TheSunImage from '../../../Images/aboutus/featured_in/thesun_108_50.png';
import VulconImage from '../../../Images/aboutus/featured_in/Vulcan_141_3.png';
import ChinaPressImage from '../../../Images/aboutus/featured_in/china-press_206_82.png';
import OhBulanImage from '../../../Images/aboutus/featured_in/ohbulan_108_34.png';
import MalaysianReserve from '../../../Images/aboutus/featured_in/themalaysianreserve_187_44.png';

const DescriptionContentWithHeader = ({title, children}) => (
  <Fragment>
    <Text style={style.descriptionContentWithHeader_1}>{title}</Text>
    <Text style={style.descriptionContentWithHeader_2}>{children}</Text>
  </Fragment>
);

export default class AboutUs extends Component {
  handleBackButton = () => {
    this._navigationBack();
    return true;
  };

  _navigationBack = () => this.props.navigation.goBack();

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <Container style={style.root}>
        <Header headerTitle="About Us" navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={style.descriptionScrollView}>
          <Text style={style.descriptionTitle}>Who We Are</Text>
          <Text style={style.descriptionContent}>
            A dedicated team of misfits aiming to mindblow the property world.
            Passionate, driven and armed with technology, we believe that
            everyone deserves a fair chance in the property market.
          </Text>
          <Text style={style.descriptionContent}>
            "Race or gender doesn't tell you everything about the person or who
            they are. What matters is your character, merit and performance." -
            Wong Whei Meng
          </Text>
          <Text style={style.descriptionTitle}>What We Do</Text>
          <Text style={style.descriptionContent}>
            Originally called “Speedrent”, our founder, Wong Whei Meng,
            established Speedrent Technology SDN BHD in 2015. We combine
            protection and technological innovation in the house rental and
            property market.
          </Text>
          <Text style={style.descriptionContent}>
            Partnered with Allianz General Insurance since 2017, we connect
            landlords with quality tenants while providing rental protection and
            a host of other services such as rental collection and secure
            tenancy agreements. Landlords can secure their property with Allianz
            up to RM42,000 while tenants can rent with No Deposit.
          </Text>

          <Text style={style.descriptionContent}>
            In 2019, we started a new chapter and expanded our services to
            include buying property and more - as SPEEDHOME!
          </Text>
          <Text style={style.descriptionTitle}>Our Mission</Text>
          <Text style={style.descriptionContent}>
            To make home renting as great as renting and living in a 6-star
            hotel.
          </Text>
          <Text style={style.descriptionTitle}>What We Stand For</Text>
          <DescriptionContentWithHeader title={'No Discrimination'}>
            Everyone deserves fair treatment regardless of colour.
          </DescriptionContentWithHeader>
          <DescriptionContentWithHeader title="A Secure Renting Experience">
            Landlords deserve to be secured as well. Together with Allianz,
            landlords can choose to secure their property up to RM42,000.
          </DescriptionContentWithHeader>
          <DescriptionContentWithHeader title="Affordable Renting">
            Everyone deserves a place to stay regardless of their circumstances.
            Tenants can rent with No Deposit.
          </DescriptionContentWithHeader>
          <Text style={style.descriptionTitle}>Achievements</Text>
          <View style={style.achievementsView}>
            <View style={style.achievementsViewTab}>
              <Image
                accessible
                accessibilityLabel="downloadOne"
                testID="downloadOne"
                style={style.customImageSize(20, 25)}
                source={DownloadsOne}
              />
              <Text style={style.achievementsViewText}>250,000+ Downloads</Text>
            </View>
            <View style={style.achievementsViewTab}>
              <Image
                accessible
                accessibilityLabel="downloadTwo"
                testID="downloadTwo"
                style={style.customImageSize(30, 25)}
                source={DownloadsTwo}
              />
              <Text style={style.achievementsViewText}>3,000+ Downloads</Text>
            </View>
            <View
              style={style.achievementsViewTab}
              accessibilityLabel="letstrythis"
              accessible
              testID="letstrytest"
              resourceID="letstrytest">
              <Image
                accessible
                accessibility
                accessibilityLabel="landlords"
                resourceID="landlords"
                testID="landlords"
                style={style.customImageSize(25, 25)}
                source={Landlords}
              />
              <Text
                style={style.achievementsViewText}
                accessible={true}
                testID={'ButtonText'}
                accessibilityLabel={'ButtonTextDesc'}>
                3,000+ Landlords
              </Text>
            </View>
            <View style={style.achievementsViewTab}>
              <Image
                accessible
                accessibilityLabel="tenants"
                testID="tenants"
                style={style.customImageSize(25, 20)}
                source={Tenants}
              />
              <Text style={style.achievementsViewText}>3,000+ Tenants</Text>
            </View>
          </View>
          <Text style={style.descriptionTitle}>Featured in</Text>
          <View style={style.featuredView}>
            <View style={style.featuredViewOne}>
              <Image
                accessible
                accessibilityLabel="star"
                testID="star"
                source={StarImage}
                style={style.customImageSize(108, 55)}
              />
              <View style={style.customSize(width * 0.2, 'auto')} />
              <Image
                accessible
                accessibilityLabel="sun"
                testID="sun"
                source={TheSunImage}
                style={style.customImageSize(108, 50)}
              />
            </View>
            <View style={style.customSize('auto', 15)} />
            <View style={style.featuredViewOne}>
              <Image
                accessible
                accessibilityLabel="vulcon"
                testID="vulcon"
                source={VulconImage}
                style={style.customImageSize(141, 30)}
              />
            </View>
            <View style={style.customSize('auto', 10)} />
            <Image
              accessible
              accessibilityLabel="chinaPress"
              testID="chinaPress"
              source={ChinaPressImage}
              style={style.customImageSize(206, 82)}
            />
            <View style={style.customSize('auto', 10)} />
            <Image
              accessible
              accessibilityLabel="ohBhulan"
              testID="ohBhulan"
              source={OhBulanImage}
              style={style.customImageSize(108, 34)}
            />
            <View style={style.customSize('auto', 10)} />
            <Image
              accessible
              accessibilityLabel="ohBhulan"
              testID="malaysianReserve"
              source={MalaysianReserve}
              style={style.customImageSize(187, 44)}
            />
            <View style={style.customSize('auto', 50)} />
          </View>
        </ScrollView>
      </Container>
    );
  }
}
