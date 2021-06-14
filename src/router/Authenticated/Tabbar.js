import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Text, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Home from '../../screens/Home'
import MyListing from '../../screens/my-listing'
import { Matrics } from '../../common/styles'
// Import Images
import imgHome from '../../../Images/Tab/ic_home_active.png'
import imgChat from '../../../Images/Tab/ic_chat_active.png'
import imgPost from '../../../Images/Tab/ic_post_active.png'
import imgMore from '../../../Images/Tab/ic_more_active.png'
import imgHomeUnselect from '../../../Images/Tab/ic_home_inactive.png'
import imgChatUnselect from '../../../Images/Tab/ic_chat_inactive.png'
import imgPostUnselect from '../../../Images/Tab/ic_post_inactive.png'
import imgMoreUnselect from '../../../Images/Tab/ic_more_inactive.png'
import ChatTab from '../../screens/chatTab'
import TabBarNavigationBadge from '../../components/TabBarNotificationBadge'
import more from '../../screens/more'

export default createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text
            style={{
              textAlign: 'center',
              fontSize: Matrics.ScaleValue(12),
              color: 'black',
            }}
          >
            Home
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) => (
          <Image
            testID='home'
            source={tintColor === '#FFE100' ? imgHome : imgHomeUnselect}
            style={{
              width: Matrics.ScaleValue(22),
              height: Matrics.ScaleValue(22),
              resizeMode: 'contain',
            }}
          />
        ),
        tabBarOnPress: ({ navigation }) => {
          navigation.navigate('Home', { date: new Date() })
        },
      },
    },
    ChatTab: {
      screen: ChatTab,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: ({ tintColor }) => (
          <TouchableOpacity
            onPress={() =>
              AsyncStorage.getItem('accountInfo').then((res) => {
                if (!res) {
                  navigation.navigate('Number', { screenName: 'ChatTab' })
                  return
                } else {
                  navigation.navigate('ChatTab', { date: new Date() })
                }
              })
            }
            accessible={true}
            accessibilityLabel='tabBarChatBtn'
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: Matrics.ScaleValue(12),
                color: 'black',
              }}
            >
              Chat
            </Text>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ horizontal, tintColor }) => (
          <TouchableOpacity
            style={{
              position: 'relative',
            }}
            onPress={() =>
              AsyncStorage.getItem('accountInfo').then((res) => {
                if (!res) {
                  navigation.navigate('Number', { screenName: 'ChatTab' })
                  return
                } else {
                  navigation.navigate('ChatTab', { date: new Date() })
                }
              })
            }
            accessible={true}
            accessibilityLabel='tabBarChatIconBtn'
          >
            <Image
              testID='chat'
              source={tintColor === '#FFE100' ? imgChat : imgChatUnselect}
              style={{
                width: Matrics.ScaleValue(22),
                height: Matrics.ScaleValue(22),
                resizeMode: 'contain',
              }}
            />
            <TabBarNavigationBadge />
          </TouchableOpacity>
        ),
        tabBarOnPress: ({ navigation }) => {
          AsyncStorage.getItem('accountInfo').then((res) => {
            if (!res) {
              navigation.navigate('Number', { screenName: 'ChatTab' })
              return
            }
            navigation.navigate('ChatTab', { date: new Date() })
          })
        },
      }),
    },
    MyListing: {
      screen: MyListing,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text
            style={{
              textAlign: 'center',
              fontSize: Matrics.ScaleValue(12),
              color: 'black',
            }}
          >
            Properties
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) => (
          <Image
            testID='post'
            source={tintColor === '#FFE100' ? imgPost : imgPostUnselect}
            style={{
              width: Matrics.ScaleValue(22),
              height: Matrics.ScaleValue(22),
              resizeMode: 'contain',
            }}
          />
        ),
        tabBarOnPress: ({ navigation }) => {
          AsyncStorage.getItem('accountInfo').then((res) => {
            if (!res) {
              navigation.navigate('Number', { screenName: 'Home' })
              return
            } else {
              DeviceEventEmitter.removeListener('MyListPress')
              DeviceEventEmitter.emit('MyListPress')
              navigation.navigate('MyListing')
            }
          })
        },
      },
    },
    More: {
      screen: more,
      navigationOptions: {
        tabBarLabel: ({ tintColor }) => (
          <Text
            style={{
              textAlign: 'center',
              fontSize: Matrics.ScaleValue(12),
              color: 'black',
            }}
          >
            More
          </Text>
        ),
        tabBarIcon: ({ horizontal, tintColor }) => (
          <Image
            testID='more'
            source={tintColor === '#FFE100' ? imgMore : imgMoreUnselect}
            style={{
              width: Matrics.ScaleValue(22),
              height: Matrics.ScaleValue(22),
              resizeMode: 'contain',
            }}
          />
        ),
        tabBarOnPress: ({ navigation }) => {
          navigation.navigate('More', { date: new Date() })
        },
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      style: {
        paddingVertical: 5,
        height: Matrics.ScaleValue(55),
      },
      tabStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      labelStyle: {
        marginLeft: 0,
      },
      activeTintColor: '#FFE100',
      inactiveTintColor: '#CFCFCF',
    },
  }
)
