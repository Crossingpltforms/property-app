import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { Fonts } from '../../styles'

export default class InternetConnection extends Component {
  state = {
    isConnected: true,
    isLoading: false,
  }

  setNetworkStatus = (state) => {
    // if (this.state.isConnected != status)
    this.setState({ isConnected: state.isConnected })
    global.networkConnection = state.isConnected
  }

  componentDidMount() {
    global.networkConnection = true
    this.unsubscribe = NetInfo.addEventListener((state) => {
      this.setNetworkStatus(state)
    })
    // AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnMount() {
    this.unsubscribe()
    // NetInfo.isConnected.removeEventListener(
    //   'connectionChange',
    //   this.setNetworkStatus
    // )
    // AppState.removeEventListener("change", this._handleAppStateChange);
  }

  render() {
    return (
      <View>
        {!this.state.isConnected ? (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel='noInternetBtn'
            onPress={() => {
              NetInfo.fetch().then(this.setNetworkStatus)
            }}
          >
            <View style={styles.container}>
              <Text style={styles.textStyle}>No Internet Connection</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }
}
const styles = {
  container: {
    backgroundColor: 'black',
    justifyContent: 'center',
    paddingVertical: 10,
    // height:100,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontFamily: Fonts.type.ArimoBold,
  },
}
