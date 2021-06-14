import React, { Component, useEffect, useState } from 'react'
import { View, Platform, DeviceEventEmitter, AppState } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
// import firebase from 'react-native-firebase'
import PushNotification from 'react-native-push-notification'
import messaging, {
  AuthorizationStatus
} from '@react-native-firebase/messaging'

export default class PushNotificationHandler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState
    }
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    Platform.OS == 'ios'
      ? this.setUpPushNotificationIos()
      : this.requestUserPermission()
  }

  componentWillUnmount() {
    // this.lister.remove()
    // this.notificationListener()
    // this.notificationOpenedListener()

  }

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState })
  }

  // ****** New Firebase plugin for notification *******//
  async requestUserPermission() {
    await messaging()
      .requestPermission()
      .then(value => {
        if (value) {
          messaging()
            .getToken()
            .then(token => {
              console.log('+++++', token)
              AsyncStorage.setItem('fcmToken', token)
              this.props.onPostToken(token)
            })
        }
      })

    messaging().onMessage(async remoteMessage => {
      console.log('++......fcm message', this.state.appState, remoteMessage)
      if (
        this.state.appState == 'active' &&
        remoteMessage &&
        remoteMessage.notification
      ) {
        var notificationData = JSON.parse(
          remoteMessage && remoteMessage.data && remoteMessage.data.data
        )

        // get conversation id of texting user
        AsyncStorage.getItem('conversationId').then(conversationId => {
          // if conversation id is not match with current notification id then send notification otherwise do not send
          if (conversationId == notificationData.conversationId) {
            // return user without notification
            return
          } else {
            // send local notification to user
            this.renderSendLocalNotification(remoteMessage)
          }
        })


      }
    })

    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage
      // )
      if (remoteMessage && remoteMessage.data && remoteMessage.data.data) {
        var notificationData = JSON.parse(remoteMessage.data.data)
        setTimeout(() => {
          this.props.onNotificationCliked(notificationData)
        }, 1000)
      }
    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage.notification
          // )
          if (remoteMessage && remoteMessage.data && remoteMessage.data.data) {
            var notificationData = JSON.parse(remoteMessage.data.data)
            setTimeout(() => {
              this.props.onNotificationCliked(notificationData)
            }, 1000)
          }
        }
      })
  }
  // -----****  send local notification for android ****----- //
  renderSendLocalNotification(remoteMessage) {
    var notificationData = JSON.parse(
      remoteMessage && remoteMessage.data && remoteMessage.data.data
    )

    PushNotification.localNotification({
      largeIcon: '',
      color: 'black',
      smallIcon: 'ic_stat_notification',
      color: 'black',
      vibrate: true,
      vibration: 300,
      tag: 'some_tag',
      group: 'group',
      importance: 'high',
      // id: 123,
      // messageId: 123,
      // userInfo: { id: 123 },
      id: notificationData ? notificationData.conversationId : null,
      messageId: notificationData ? notificationData.conversationId : null,
      channelId: notificationData ? notificationData.conversationId : null,
      title:
        remoteMessage.notification && remoteMessage.notification.title
          ? remoteMessage.notification.title
          : 'SPEEDHOME',
      message:
        remoteMessage.notification && remoteMessage.notification.body
          ? remoteMessage.notification.body
          : ''
    })
  }

  /*
// -----****  Old Notification setup for android ****----- //
async checkPermission () {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
      this.getToken()
    } else {
      this.requestPermission()
    }
  }

  async getToken () {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log('....++++', fcmToken)

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
      // fcmToken = await messaging().getToken()
      console.log('...', fcmToken)
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    }
  }

  async requestPermission () {
    try {
      await firebase.messaging().requestPermission()
      // User has authorised
      this.getToken()
    } catch (error) {
      // User has rejected permissions
    }
  }

  async createNotificationListeners () {
    // ----- Triggered when a particular notification has been received in foreground ---- //
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('foreground notification')
        const { title, body, notificationId } = notification

        this.displayNotification(title, body, notificationId)
      })

    // ----- If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows: ----- //
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        if (notificationOpen) {
          console.log('notification open...', notificationOpen)

          const { title, body, notificationId } = notificationOpen.notification

          // this.displayNotification(title, body, notificationId);

          if (
            notificationOpen &&
            notificationOpen.notification &&
            notificationOpen.notification._data.data
          ) {
            var notificationData = JSON.parse(
              notificationOpen.notification._data.data
            )
            setTimeout(() => {
              this.props.onNotificationCliked(notificationData)
            }, 1000)
          }
        }
      })

    // ----- If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows: ---- //
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      const { title, body, notificationId } = notificationOpen.notification

      // this.displayNotification(title, body, notificationId);

      if (
        notificationOpen &&
        notificationOpen.notification &&
        notificationOpen.notification._data.data
      ) {
        var notificationData = JSON.parse(
          notificationOpen.notification._data.data
        )
        setTimeout(() => {
          this.props.onNotificationCliked(notificationData)
        }, 1000)
      }
    }

    // ---- Method call when application launch ---- //
    this.messageListener = firebase.messaging().onMessage(message => {
      //process  message
      const { title, body, notificationId } = message

      this.displayNotification(title, body, notificationId)
    })
  }

  // ----- Create and display notification custom function for android ----- //
  displayNotification = (title, body, notificationId) => {
    const channel = new firebase.notifications.Android.Channel(
      'com.reactnativewithspeedhome.default_channel_id',
      'SpeedHome',
      firebase.notifications.Android.Importance.High
    ).setDescription('Speedhome notification')
    firebase.notifications().android.createChannel(channel)
    const localNotification = new firebase.notifications.Notification({
      sound: 'default',
      local: true,
      show_in_foreground: true
    })
      .setNotificationId(notificationId)
      .setTitle(title)
      .setBody(body)
      .android.setGroup('test')
      .android.setGroupSummary(true)
      .android.setAutoCancel(true)
      .android.setBigText(body)
      .android.setVibrate(1000)
      .android.setChannelId('com.reactnativewithspeedhome.default_channel_id')
      .android.setSmallIcon('ic_launcher_round')
      .android.setLargeIcon('ic_stat_notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)

    firebase
      .notifications()
      .displayNotification(localNotification)
      .catch(err => console.error(err))
  }

*/

  // ----- Notification setup for iOS ----- //
  setUpPushNotificationIos() {
    PushNotificationIOS.addEventListener('register', token => {
      if (token) {
        AsyncStorage.setItem('fcmToken', token)
      }
    })

    PushNotificationIOS.addEventListener(
      'registrationError',
      registrationError => { }
    )

    PushNotificationIOS.addEventListener('notification', function (
      notification
    ) {
      if (!notification) {
        return
      }
      const data = notification.getData()
      setTimeout(() => {
        DeviceEventEmitter.emit('notificationClicked', {
          data: JSON.parse(data.message)
        })
      }, 1000)
      // setTimeout(() => {
      // 	this.props.onNotificationCliked(data.message);
      // }, 2000);
    })



    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return
      }
      const data = notification.getData()
      setTimeout(() => {
        DeviceEventEmitter.emit('notificationClicked', {
          data: JSON.parse(data.message)
        })
      }, 1000)
    })
    PushNotificationIOS.requestPermissions()
  }


  // cancel notification for a user 
  cancelNotificationForAUser = (id) => {
    PushNotification.cancelLocalNotifications({ id: id })
  }


  render() {
    return <View />
  }
}
