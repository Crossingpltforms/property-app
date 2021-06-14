/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import backgroundPush from './src/util/backgroundPush'
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
// AppRegistry.registerHeadlessTask(
//   'RNFirebaseBackgroundMessage',
//   () => backgroundPush
// )
