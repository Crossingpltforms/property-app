import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'
import { Matrics } from '../../common/styles'

export default class Terms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: false,
      email: null,
      screenName: props.navigation.state.params.screenName
      // whatsappNumber: props.navigation.state.params.whatsappNumber,
    }
  }

  componentDidMount() {
    // const params = this.props.navigation.state.params;
    // if (params) {
    //   this.setState({
    //     firstName: params.firstName,
    //     email: params.email
    //   });
    // }
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader() {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'center'
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='termsScreenBackBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
            <Text
              style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.header}>
        {/* <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Number", {
              screenName: "Terms"
            })}
            style={styles.backTouch}
          >
            <Image source={Images.back} />
          </TouchableOpacity>
        </View> */}

        {this._viewHeader()}

        <View style={{ width: '100%', marginHorizontal: 20 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: 50
            }}
          >
            <TouchableOpacity
              accessible={true}
              accessibilityLabel='termsScreenTOSBtn'
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 25,
                  color: '#000',
                  textAlign: 'left'
                }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            styles.bytapText,
            {
              fontSize: Matrics.ScaleValue(15),
              marginTop: 30,
              marginHorizontal: 20,
              flex: 3
            }
          ]}
        >
          By clicking "Continue", you are indicating that you have read and
          understand the terms and conditions herein. If you do not agree with
          the terms, please do not use this Application.
        </Text>

        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={{ flexDirection: 'column', padding: Matrics.ScaleValue(10) }}
            onPress={() => this.props.navigation.navigate('Policy')}
            accessible={true}
            accessibilityLabel='termsScreenPolicyBtn'
          >
            <Text
              style={[
                styles.bytapText,
                { fontSize: Matrics.ScaleValue(12), color: 'blue' }
              ]}
            >
              Learn more about terms and conditions
            </Text>
            <View style={{ backgroundColor: 'blue', height: 0.5 }} />
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'center',
              backgroundColor: '#FFE100',
              height: 42,
              width: '75%',
              borderRadius: 10
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(this.state.screenName)
              }
              accessible={true}
              accessibilityLabel='termsScreenAgreeBtn'
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 15,
                  textAlign: 'center',
                  color: '#000'
                }}
              >
                Agree and Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
