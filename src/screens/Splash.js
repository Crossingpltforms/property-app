import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationActions, StackActions } from 'react-navigation'

export default class Splash extends Component {
  UNSAFE_componentWillMount () {
    AsyncStorage.setItem('displayType', 'RENT')
    this.props.navigation.addListener('willFocus', payload => {
      if (
        payload &&
        payload.action &&
        payload.action.type !== 'Navigation/INIT'
      ) {
        this.goToNextView('Tab')
      }
    })
  }

  goToNextView = (nextView = null) => {
    mainScreen = nextView || mainScreen

    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: mainScreen })]
      })
    )

    return
  }

  resetRoute () {
    const goHome = NavigationActions.navigate({
      routeName: 'Tab',
      params: {}
    })
    this.props.navigation.dispatch(goHome)
  }

  render () {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator size="large" color="red" /> */}
        <Image
          testID="splash"
          resizeMode='contain'
          source={require('../../Images/splash.png')}
          style={{ flex: 1 }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE100'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
