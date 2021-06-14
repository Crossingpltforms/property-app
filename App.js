import React from 'react'
import {
  Linking,
  Platform,
  StatusBar,
  Image,
  DeviceEventEmitter,
  View,
  LogBox
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Provider } from 'react-redux'
import urlParse from 'url-parse'
import { SafeAreaView, StackActions, NavigationActions } from 'react-navigation'
import Http from './src/api/http'
import APICaller from './src/util/apiCaller'
import PushNotificationHandler from './src/util/pushNotificationHandler'
import InternetConnection from './src/common/components/internet-connection'
import analytics from '@react-native-firebase/analytics'

import { logEvent, events } from './src/util/fbAnalytics'
import { utmParams } from './src/common/constants'
import { Sentry } from 'react-native-sentry'
import { store } from './src/store'
import { trackerEventSubmit } from './src/util/trackEventNames'
import { LoggedAppContainer } from './src/router/Authenticated'
import { AppContainer } from './src/router/NonAuthenticated'
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

Sentry.config(
  'https://d72dd7d160174c8a87bbc8e4c40fc21b@o348320.ingest.sentry.io/2209214'
).install()

const getActiveRouteName = (navigationState) => {
  if (!navigationState) {
    return null
  }

  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getActiveRouteName(route)
  }

  return route.routeName
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.onNotificationCliked = this.onNotificationCliked.bind(this)
    LogBox.ignoreAllLogs(true)
    this.state = {
      openScreen: ''
    }
  }

  UNSAFE_componentWillMount() {
    AsyncStorage.setItem('referral', 'false')
  }

  componentDidMount() {
    Sentry.config(
      'https://d72dd7d160174c8a87bbc8e4c40fc21b@o348320.ingest.sentry.io/2209214'
    ).install()
    DeviceEventEmitter.addListener('notificationClicked', (data) => {
      this.onNotificationCliked(data.data)
    })
    AsyncStorage.setItem('conversationId', '')
    AsyncStorage.setItem('clickOnChatRequest', 'false')
    AsyncStorage.setItem('displayType', 'RENT')
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (!res) {
        AsyncStorage.removeItem('accountInfo')
        this.setState({ openScreen: 'Login' })
      } else {
        const data = JSON.parse(res)
        // console.log('++++', data)
        if (data.name === 'Guest' || data.name === '') {
          AsyncStorage.removeItem('accountInfo')
          this.setState({ openScreen: 'Login' })
        } else {
          this.setState({ openScreen: 'Tab' })
        }
      }
    })
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        this.navigate(url)
      })
      Linking.addEventListener('url', this.handleOpenURL)
    } else {
      Linking.addEventListener('url', this.handleOpenURL)
      setTimeout(() => {
        //this.goToNextView("Tab");
      }, 3000)
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
    DeviceEventEmitter.removeListener('notificationClicked')
  }

  getQueryVariable(variable, url) {
    const splittedPath = url.split('?')
    var query = splittedPath[1]
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] == variable) {
        return true
      }
    }
    return false
  }

  navigate = (url) => {
    if (url) {
      if (url.includes('invitereferrals')) {
        AsyncStorage.setItem('referral', 'true')
      } else {
        AsyncStorage.setItem('referral', 'false')
      }
      const parsedUrl = urlParse(url, true)
      const pathName = parsedUrl.pathname || ''
      const splittedPath = pathName.split('/')
      const routeName = splittedPath[1] || ''
      const additionalData = splittedPath[2] || ''

      if (parsedUrl.query && Object.keys(parsedUrl.query).length > 0) {
        const utmParamExists = Object.keys(parsedUrl.query).some((key) =>
          utmParams.includes(key)
        )
        if (utmParamExists) {
          let utmParameters = {}
          parsedUrl.query && Object.keys(parsedUrl.query).forEach((key) => {
            if (utmParams.includes(key)) {
              utmParameters[key] = parsedUrl.query[key]
            }
          })
          const utmParamsQuery = Object.keys(utmParameters)
            .map((key) => key + '=' + utmParameters[key])
            .join('&')
          this.updateInstallSource(utmParamsQuery)
        }
      }
      if (routeName === 'chat') {
        AsyncStorage.getItem('accountInfo').then((res) => {
          if (!res) {
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({ routeName: 'Login' })
              )
          } else {
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({
                  routeName: 'Tab',
                  params: {},
                  action: NavigationActions.navigate({ routeName: 'ChatTab' })
                })
              )
          }
        })
      } else if (routeName === 'post') {
        AsyncStorage.getItem('accountInfo').then((res) => {
          if (!res) {
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({ routeName: 'Login' })
              )
          } else {
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({ routeName: 'MyListing' })
              )
          }
        })
      } else if (routeName === 'rent') {
        this.navigatorRef &&
          this.navigatorRef != null &&
          this.navigatorRef.dispatch(
            NavigationActions.navigate({
              routeName: 'Tab',
              params: {},
              action: NavigationActions.navigate({
                routeName: 'KeywordSearchList',
                params: { locationString: additionalData }
              })
            })
          )
      } else if (routeName === 'ads') {
        const propertyData = additionalData.split('-')
        const propertyId = propertyData[propertyData.length - 1] || ''
        APICaller(Http.getPropertyById(propertyId), 'GET', null, '').then(
          (response) => {
            if (response.status === 200) {
              if (
                response.data.status === 'ACTIVE' &&
                response.data.active === true
              ) {
                this.navigatorRef &&
                  this.navigatorRef != null &&
                  this.navigatorRef.dispatch(
                    NavigationActions.navigate({
                      routeName: 'ListingPageDetail',
                      params: { propertyInfo: response.data }
                    })
                  )
              } else {
                this.navigatorRef &&
                  this.navigatorRef != null &&
                  this.navigatorRef.dispatch(
                    NavigationActions.navigate({
                      routeName: 'KeywordSearchList',
                      params: {
                        locationString: response.data.name,
                        similarListing: true
                      }
                    })
                  )
              }
            } else {
              // this.goToNextView("Tab");
            }
          }
        )
      } else if (
        parsedUrl.protocol === 'speedhome:' &&
        parsedUrl.host === 'search'
      ) {
        this.navigatorRef &&
          this.navigatorRef != null &&
          this.navigatorRef.dispatch(
            NavigationActions.navigate({
              routeName: 'KeywordSearchList',
              params: { locationString: decodeURI(routeName) }
              // action: NavigationActions.navigate({
              //   routeName: 'KeywordSearchList',
              //   params: { locationString: additionalData }
              // })
            })
          )
      } else {
        // this.goToNextView("Tab");
      }
    } else {
      setTimeout(() => {
        // this.goToNextView("Tab");
      }, 3000)
    }
  }

  handleOpenURL = (event) => {
    this.navigate(event.url)
  }

  goToNextView = (nextView = null) => {
    let mainScreen = nextView || ''

    this.navigatorRef &&
      this.navigatorRef != null &&
      this.navigatorRef.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: mainScreen })]
        })
      )

    return
  }

  updateInstallSource = (utmParamsQuery) => {
    if (!global.networkConnection) return

    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        const requestURL = Http.updateInstallSource(JSON.parse(res).userId)
        const body = {
          source: utmParamsQuery
        }
        APICaller(requestURL, 'POST', '', JSON.stringify(body)).then(
          (json) => { }
        )
      }
    })
  }

  handleNavigationStateChange = (prevState, currentState, action) => {
    const currentScreen = getActiveRouteName(currentState)
    const prevScreen = getActiveRouteName(prevState)

    if (prevScreen !== currentScreen) {
      // tracker.trackScreenView(currentScreen)
      logEvent(trackerEventSubmit.user.action.pageLoad, {
        screen: currentScreen
      })
      // analytics().setCurrentScreen(currentScreen, currentScreen)
      analytics().logScreenView({ screen_name: currentScreen })
    }
  }

  onNotificationCliked = (notificationData) => {
    if (notificationData) {
      if (notificationData.type === 1)
        AsyncStorage.getItem('accountInfo').then((res) => {
          if (!res) {
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({ routeName: 'Login' })
              )
          } else {
            // console.log('notifications background ' + this.state.openScreen)
            this.navigatorRef &&
              this.navigatorRef != null &&
              this.navigatorRef.dispatch(
                NavigationActions.navigate({
                  routeName: 'Tab',
                  params: {},
                  action: NavigationActions.navigate({
                    routeName: 'ChatTab',
                    params: { date: new Date() }
                  })
                })
              )
          }
        })
    }
  }

  postDeviceTokenApiCall = (token) => {
    if (!global.networkConnection) return
    let user_credentials = null
    AsyncStorage.getItem('accountInfo').then((res) => {
      if (res) {
        user_credentials = JSON.parse(res)
        const body = {
          cloudId: token
        }
        APICaller(
          Http.saveToken,
          'POST',
          user_credentials.token,
          JSON.stringify(body)
        ).then((json) => {
          if (json.status == 200) {
            console.log('store successfully token')
          }
        })
      }
    })
  }

  render() {
    const LoginComponent = AppContainer()
    const AuthenticatedComponent = LoggedAppContainer()
    return (
      <Provider store={store}>
        <StatusBar backgroundColor='#FFE100' barStyle='dark-content' />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#FFE100' }}
          forceInset={{ bottom: 'never' }}
        >
          
          {this.state.openScreen === 'Tab' ? (
            <AuthenticatedComponent
              ref={(nav) => (this.navigatorRef = nav)}
              onNavigationStateChange={this.handleNavigationStateChange}
              persistNavigationState={this.persistNavigationState}
            />
          ) : this.state.openScreen === 'Login' ? (
            <LoginComponent
              ref={(nav) => (this.navigatorRef = nav)}
              onNavigationStateChange={this.handleNavigationStateChange}
              persistNavigationState={this.persistNavigationState}
            />
          ) : (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFE100'
                  }}
                >
                  {/* <ActivityIndicator animating = {true} style = {{width: 50, height: 50, color: 'black'}}></ActivityIndicator> */}
                  <Image
                    testID='splash'
                    source={require('./Images/splash.png')}
                    style={{ flex: 1 }}
                    resizeMode='contain'
                  />
                </View>
              )}
          <PushNotificationHandler
            onPostToken={(token) => this.postDeviceTokenApiCall(token)}
            onNotificationCliked={this.onNotificationCliked.bind(this)}
          />
          <InternetConnection />
        </SafeAreaView>
      </Provider>
    )
  }
}

export default App
