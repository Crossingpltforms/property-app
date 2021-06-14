import firebase from 'react-native-firebase'

export default async data => {
  try {
    console.log('.... background push')

    const channel = new firebase.notifications.Android.Channel(
      'com.reactnativewithspeedhome.default_channel_id',
      'SpeedHome',
      firebase.notifications.Android.Importance.High
    ).setDescription('Speedhome notification')
    firebase.notifications().android.createChannel(channel)

    const localNotification = new firebase.notifications.Notification({
      sound: 'default',
      show_in_foreground: true
    })
      .setNotificationId(data.messageId)
      .setTitle('SpeedHome')
      .setBody('works')
      .setData(JSON.parse(data.data.data))
      .android.setAutoCancel(true)
      .android.setGroupAlertBehaviour(true)
      .android.setVibrate(1000)
      .android.setChannelId('com.reactnativewithspeedhome.default_channel_id') // e.g. the id you chose above
      .android.setSmallIcon('ic_launcher_round') // create this icon in Android Studio
      .android.setLargeIcon('ic_stat_notification')
      .android.setPriority(firebase.notifications.Android.Priority.High)

    await firebase
      .notifications()
      .displayNotification(localNotification)
      .catch(err => {
        // TODO crashlytics
      })
    return Promise.resolve()
  } catch (e) {
    return Promise.resolve()
  }
}
