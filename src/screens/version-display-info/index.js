import React, { Component } from 'react'
import { TouchableOpacity, Text, View, BackHandler } from 'react-native'
import VersionNumber from 'react-native-version-number'

import { Icon } from 'react-native-elements'

import style from './style'

export default class AppDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  _navigationBack = () => this.props.navigation.goBack()

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
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='versionInfoBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Settings
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View
        style={{ flexDirection: 'column', flex: 1, backgroundColor: '#FFFFFF' }}
      >
        {this._viewHeader()}

        <View style={[style.container, { flexDirection: 'column' }]}>
          <Text
            style={[
              style.PropertyInfoViewTabLabel,
              { fontFamily: 'OpenSans-SemiBold', marginTop: 20 }
            ]}
          >
            INFO
          </Text>
          <View
            style={{
              backgroundColor: 'grey',
              height: 1,
              marginTop: 5,
              marginLeft: 10,
              marginRight: 10
            }}
          />

          <Text
            style={[
              style.PropertyInfoViewTabLabel,
              { fontFamily: 'OpenSans-SemiBold', marginTop: 10 }
            ]}
          >
            Build Version
          </Text>
          <Text style={[style.PropertyInfoViewTabLabel, { fontSize: 14 }]}>
            {VersionNumber.appVersion} ({VersionNumber.buildVersion})
          </Text>

          {/* <Text style={[style.PropertyInfoViewTabLabel, { fontFamily: "OpenSans-SemiBold", marginTop: 15,}]}>Build Date</Text>
        <Text style={style.PropertyInfoViewTabLabel}>03 Jun 2019</Text> */}
        </View>
      </View>
    )
  }
}
