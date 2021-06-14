//This component is just not is for to display message=>`You can chat directly with the owner, ask questions and get to know the property online or in person.` inside property details scroll view.
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import { Matrics, Fonts, Color } from '../../common/styles'
import * as _ from 'lodash'

const DetailsChatWithOwnerButton = (props) => {
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
      <View style={styles.mainViewContainer}>
        <View style={styles.iconWithTextViewContainer}>
          <Icon name='chat' color='black' size={Matrics.ScaleValue(20)} />
          <Text style={styles.iconWithTextViewTextStyle}>
            You can chat directly with the owner, ask questions and get to know
            the property online or in person.
          </Text>
        </View>
        <View style={ExtrainfoStyle.bottomButton}>
          <Text style={styles.respondTimeText}>
            Typically replies (
            {_.get(
              propertyInfo,
              'user.userStatsDto.responseSpeed',
              'more than 2 days'
            )}
            )
          </Text>
        </View>
      </View>
    )
  }

  const _goToChat = () => {
    //go to chat button is now been coming from DetailsOwnerBookBtn component
    return null
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

export default DetailsChatWithOwnerButton
