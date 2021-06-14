import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native'
import { Image } from 'react-native-elements'
import UserAvatar from 'react-native-user-avatar'
import styles from './styles'
import { No_IMAGE_LINK } from '../../../common/constants'
import HTMLView from 'react-native-htmlview'
import { formatTime } from '../../../common/helper/time'
import { Matrics, Color } from '../../../common/styles'
import Swipeable from 'react-native-swipeable'
import { cos } from 'react-native-reanimated'
import { Icon } from 'react-native-elements'
import pinned from '../../../../Images/pinned.png'
import unpinned from '../../../../Images/unpinned.png'

class ChatItem extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentlyOpenSwipeable: null
    }
  }

  updateData() {
    this.props.deleteChat()
  }

  renderImage = (message) => {
    let imageUrl = ''
    if (message.custom.length > 0) {
      const imageUrlFiltered = message.custom.filter(
        (x) => x.key === 'IMAGE_URL'
      )
      if (imageUrlFiltered.length > 0) {
        imageUrl = imageUrlFiltered[0].value
      }
    }
    return (
      <Image
        testID='message'
        style={ChatItemStyle.renderImageStyle}
        source={{
          uri: imageUrl ? imageUrl : No_IMAGE_LINK
        }}
      />
    )
  }
  renderLastMsg = (chat) => {
    if (chat.lastMessage && /<\/?[^>]*>/.test(chat.lastMessage.text)) {
      var str = `<p>${chat.lastMessage.text}</p>`
      var cleanText = str.replace(/<\/?[^>]+(>|$)/g, '')
      return (
        <Text
          style={[
            styles.text,
            {
              color: chat.unReadMsgCount > 0 ? '#000' : 'gray',
              fontWeight: chat.unReadMsgCount > 0 ? 'bold' : 'normal'
            }
          ]}
        >
          {cleanText
            ? cleanText.length > 30
              ? `${cleanText.substring(0, 30)}...`
              : cleanText
            : ''}
        </Text>
      )
    } else {
      return (
        <Text
          style={[
            styles.text,
            {
              color: chat.unReadMsgCount > 0 ? '#000' : 'gray',
              fontWeight: chat.unReadMsgCount > 0 ? 'bold' : 'normal'
            }
          ]}
        >
          {chat.lastMessage
            ? chat.lastMessage.text.length > 30
              ? `${chat.lastMessage.text.substring(0, 30)}...`
              : chat.lastMessage.text
            : ''}
        </Text>
      )
    }
  }

  render() {
    const { currentlyOpenSwipeable } = this.state
    const chat = this.props.chat
    const swipeBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {
          this.props.deleteChat(this.props.chat)
        }
      }
    ]
    var name = chat.subject.substring(0, 25)
    var arrayName = name.split(',')
    var CapName = arrayName[0].toUpperCase()
    var smallARR = arrayName.splice(1, 1)
    var sorted = []
    for (var i = 0; i < smallARR.length; i++) {
      sorted.push(smallARR[i].toLowerCase())
    }

    const rightButtons = [
      <TouchableOpacity
        style={ChatItemStyle.swipeableButtonContainerStyle}
        onPress={() => {
          this.props.onPinnedIconClicked(this.props.chat)
          this.state.currentlyOpenSwipeable.recenter()
        }}
        accessible={true}
        accessibilityLabel='chatItemListBtn'
      >
        <View style={ChatItemStyle.swipeableIconViewContainer}>
          <Image
            source={chat.pinned == true ? unpinned : pinned}
            style={{
              width: Matrics.ScaleValue(15),
              height: Matrics.ScaleValue(15),
              tintColor: Color.black
            }}
          />
          {/* <Icon name='pin' size={Matrics.ScaleValue(15)} color={Color.black} /> */}
        </View>
      </TouchableOpacity>,
      <TouchableOpacity
        style={ChatItemStyle.swipeableButtonContainerStyle}
        onPress={() => {
          this.props.deleteChat(this.props.chat)
          this.state.currentlyOpenSwipeable.recenter()
        }}
        accessible={true}
        accessibilityLabel='chatItemDeleteBtn'
      >
        <View style={ChatItemStyle.swipeableIconViewContainer}>
          <Icon
            name='archive'
            size={Matrics.ScaleValue(15)}
            color={Color.black}
          />
        </View>
      </TouchableOpacity>
    ]
    const onOpen = (event, gestureState, swipeable) => {
      if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
        currentlyOpenSwipeable.recenter()
      }
      this.setState({ currentlyOpenSwipeable: swipeable })
    }
    const onClose = () => currentlyOpenSwipeable.recenter()

    return (
      <Swipeable
        onRef={(ref) => (this[`swipeable ${chat.id}`] = ref)}
        key={chat.id}
        rightButtons={rightButtons}
        onRightButtonsOpenRelease={onOpen}
        onRightButtonsCloseRelease={onClose}
        rightButtonWidth={Matrics.ScaleValue(60)}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.renderMessages(chat)
            currentlyOpenSwipeable != null && currentlyOpenSwipeable.recenter()
          }}
          style={styles.listBoxContainer}
          accessible={true}
          accessibilityLabel='chatItemListSwipeableBtn'
        >
          <View style={styles.profileImageContainer}>
            {chat.lastMessage === undefined ? (
              <UserAvatar
                size={50}
                name={
                  chat.members[0].name === undefined || ''
                    ? 'SpeedHome'
                    : chat.members[0].name.substring(0, 3)
                }
                color='#FFE100'
              />
            ) : (
              <UserAvatar
                size={50}
                name={
                  chat.lastMessage.sender.name === undefined || ''
                    ? 'SpeedHome'
                    : chat.lastMessage.sender.name.substring(0, 3)
                }
                color='#FFE100'
              />
            )}
          </View>
          <View
            style={{
              flex: 6,
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: 'gray'
            }}
          >
            <View style={{ ...styles.messageContainer, width: '80%' }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  width: 200
                }}
              >
                <Text style={{ ...styles.groupName, fontWeight: '500' }}>
                  {CapName}
                </Text>
                {smallARR.length ? (
                  <Text style={[styles.groupName, { color: 'grey' }]}>
                    {`, ${smallARR.map((i) => i.toLowerCase())[0]}`}
                    {chat.subject.length > 25 ? `...` : ``}
                  </Text>
                ) : (
                  <Text />
                )}
              </View>

              {chat.lastMessage === undefined ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color: chat.unReadMsgCount > 0 ? '#000' : 'gray',
                      fontWeight: chat.unReadMsgCount > 0 ? 'bold' : 'normal'
                    }
                  ]}
                >
                  Hello
                </Text>
              ) : chat.lastMessage.mediaType === 'IMAGE' ? (
                this.renderImage(chat)
              ) : (
                this.renderLastMsg(chat)
              )}
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>
                {formatTime('MMM Do', chat.dateUpdated)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: Matrics.ScaleValue(5)
                }}
              >
                {chat.pinned == true && (
                  <Image
                    source={pinned}
                    style={ChatItemStyle.pinMessageIconStyle}
                  />
                )}
                {chat.unReadMsgCount > 0 ? (
                  <View style={ChatItemStyle.unReadMsgCountViewStyle}>
                    <Text
                      style={{
                        color: '#fff'
                      }}
                    >
                      {chat.unReadMsgCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }
}
const ChatItemStyle = StyleSheet.create({
  renderImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginTop: 3
  },
  swipeableButtonContainerStyle: {
    flex: 1,
    width: Matrics.ScaleValue(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  swipeableButtonTextStyle: {
    color: 'white',
    fontWeight: '700',
    paddingLeft: Matrics.ScaleValue(10)
  },
  swipeableIconViewContainer: {
    width: Matrics.ScaleValue(30),
    height: Matrics.ScaleValue(30),
    borderRadius: Matrics.ScaleValue(30) / 2,
    backgroundColor: 'rgb(220,220,220)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pinMessageIconStyle: {
    width: Matrics.ScaleValue(15),
    height: Matrics.ScaleValue(15),
    tintColor: Color.darkGray,
    marginHorizontal: Matrics.ScaleValue(5)
  },
  unReadMsgCountViewStyle: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    backgroundColor: '#4885ed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default ChatItem
