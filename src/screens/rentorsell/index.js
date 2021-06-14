import React, { Component } from 'react'

import { TouchableOpacity, Text, View, Image, Dimensions } from 'react-native'

// Custom Components
import RentImage from '../../../Images/rent.png'
import BuyImage from '../../../Images/sell.png'
import styles from './styles'
import CreateListingStyle from '../create-listing/styles'

export default class RentOrSell extends Component {
  constructor(props) {
    super(props)

    const { width, height } = Dimensions.get('window')

    this.state = {
      screenWidth: width,
      screenHeigth: height,
      selectedType: null,
      showAlert: false,
    }
  }

  _updateSelectedType = (type) => () => this.setState({ selectedType: type })

  _navigateNext = () => {
    if (this.state.selectedType !== null) {
      this.state.selectedType === 'rent'
        ? this.props.navigation.navigate('CreateListing')
        : this.props.navigation.navigate('CreateListingSell')
    } else {
      this.setState({ showAlert: true })
      setTimeout(() => this.setState({ showAlert: false }), 2000)
    }
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
          alignItems: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
              }}
            >
              Post
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{ ...CreateListingStyle.root, flex: 1 }}>
        {this._viewHeader()}

        {/* <ScrollView
          style={{
            width: "100%"
          }}
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%"
          }}
        > */}
        <View style={styles.title}>
          <Text style={CreateListingStyle.text1}>
            Create a Post by adding Property
          </Text>
        </View>

        {this.state.showAlert && (
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 12,
              color: '#e32b2b',
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            Please select the option, rent or sell.
          </Text>
        )}

        <View style={[styles.buttonView, { flex: 0.5 }]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('CreateListing')
            }}
            accessible={true}
            accessibilityLabel='rentorSellRentBtn'
          >
            <Image
              testID='rent'
              source={RentImage}
              style={{
                tintColor: '#4885ED',
                width: this.state.screenWidth * 0.25,
                height: this.state.screenWidth * 0.25,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              this.props.navigation.navigate('CreateListing')
            }}
            accessible={true}
            accessibilityLabel='rentorSellCreatListBtn'
          >
            <View style={styles.textStyleHousingType}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#4885ED',
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: 14,
                }}
              >
                Rent Property
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonView, { flex: 0.5 }]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('CreateListingSell')
            }}
            accessible={true}
            accessibilityLabel='rentorSellCreateByListBtn'
          >
            <Image
              testID='buy'
              source={BuyImage}
              style={{
                tintColor: '#4885ED',
                width: this.state.screenWidth * 0.25,
                height: this.state.screenWidth * 0.25,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              this.props.navigation.navigate('CreateListingSell')
            }}
            accessible={true}
            accessibilityLabel='rentorSellPropBtn'
          >
            <View style={styles.textStyleHousingType}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#4885ED',
                  fontFamily: 'OpenSans-SemiBold',
                  fontSize: 14,
                }}
              >
                Sell Property
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}

        {/* <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButtonStyle}
            onPress={this._navigateNext}
          >
            <Text style={CreateListingStyle.text1}>Next</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }
}
