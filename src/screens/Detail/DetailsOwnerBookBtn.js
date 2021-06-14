//This component is for displaying all 3 kind of buttons in floating style (outside property details scroll view)
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import { Matrics, Fonts, Color } from '../../common/styles'
import * as _ from 'lodash'

const DetailsOwnerBookBtn = (props) => {
  const {
    isSale,
    ExtrainfoStyle,
    showChatButton,
    userId,
    propertyInfo,
    onPressNext,

    _connectSocket
  } = props

  const _chatWithOwnerBtn = (book = false, isSaleVal) => {
    return (
      <View style={[{ position: 'absolute', bottom: 0, right: 0 }]}>
        <View style={[ExtrainfoStyle.bottomButton]}>
          <View style={[ExtrainfoStyle.styleViewShadow]}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel='chatDetailAppBtn'
              onPress={() => {
                AsyncStorage.setItem('clickOnChatRequest', 'true')
                onPressNext(isSaleVal)
              }}
              direction='up'
              containerStyle={{}}
              style={styles.buttonViewStyle}
            >
              <Text style={styles.buttonTextStyle}>
                {book
                  ? propertyInfo.isVirtualViewingSupported == true
                    ? `Book Virtual Appointment`
                    : `Book Appointment Now`
                  : ` Chat with `}
                {book ? null : props.propertyInfo.user.name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const _goToChat = () => {
    return (
      <View>
        <View style={ExtrainfoStyle.bottomButton}>
          <View style={ExtrainfoStyle.styleViewShadow}>
            <TouchableOpacity
              onPress={() => {
                _connectSocket()
              }}
              accessible={true}
              accessibilityLabel='chatDetailOpenChatBtn'
              style={styles.buttonViewStyle}
            >
              <Text style={styles.buttonTextStyle}>Open Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  if (showChatButton) {
    if (userId) {
      if (propertyInfo.user.id === userId) {
        return <View />
      } else {
        if (!propertyInfo.KOH && !propertyInfo.chatServerConversationId) {
          return _chatWithOwnerBtn(false, isSale)
        } else if (
          (propertyInfo.KOH && propertyInfo.chatServerConversationId) ||
          (propertyInfo.chatServerConversationId && !propertyInfo.KOH)
        ) {
          return _goToChat()
        } else if (propertyInfo.KOH && !propertyInfo.chatServerConversationId) {
          return _chatWithOwnerBtn(true, isSale)
        }
      }
    } else {
      if (propertyInfo.KOH) {
        return _chatWithOwnerBtn(true, isSale)
      } else {
        return _chatWithOwnerBtn(false, isSale)
      }
    }
  } else {
    return null
  }

  if (showChatButton) {
    if (userId) {
      if (propertyInfo.user.id === userId) {
        return <View />
      } else {
        if (!propertyInfo.KOH && !propertyInfo.chatServerConversationId) {
          return OwnerChatBookAppointmentBtn(false, isSale)
        } else if (
          (propertyInfo.KOH && propertyInfo.chatServerConversationId) ||
          (propertyInfo.chatServerConversationId && !propertyInfo.KOH)
        ) {
          return _goToChat()
        } else if (propertyInfo.KOH && !propertyInfo.chatServerConversationId) {
          return OwnerChatBookAppointmentBtn(true, isSale)
        }
      }
    } else {
      if (propertyInfo.KOH) {
        return OwnerChatBookAppointmentBtn(true, isSale)
      } else {
        return OwnerChatBookAppointmentBtn(false, isSale)
      }
    }
  } else {
    return null
  }
}

const styles = StyleSheet.create({
  mainViewContainer: { flex: 1 },
  iconWithTextViewContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: Matrics.ScaleValue(5),
    marginHorizontal: Matrics.ScaleValue(20),
    marginVertical: Matrics.ScaleValue(10),
    paddingHorizontal: Matrics.ScaleValue(10),
    paddingVertical: Matrics.ScaleValue(15)
  },
  iconWithTextViewTextStyle: {
    flex: 1,
    fontSize: Matrics.ScaleValue(11),
    fontFamily: 'OpenSans-Regular',
    marginLeft: Matrics.ScaleValue(5),
    color: 'black'
  },
  buttonViewStyle: {
    // backgroundColor: 'red',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTextStyle: {
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
    color: 'white'
  },
  respondTimeText: {
    fontSize: Matrics.ScaleValue(11),
    fontFamily: Fonts.type.OpenSansMedium,
    color: Color.black,
    marginTop: Matrics.ScaleValue(10)
  }
})

export default DetailsOwnerBookBtn
