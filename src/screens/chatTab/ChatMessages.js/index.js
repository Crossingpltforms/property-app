import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Keyboard,
  Linking,
  BackHandler,
  StyleSheet,
  DeviceEventEmitter,
  ScrollView,
  WebView,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import {
  GiftedChat,
  Bubble,
  Send,
  Composer,
  Time,
  Avatar,
  SystemMessage,
  Message,
  utils,
  MessageText
} from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'
import axios from 'axios'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import Hyperlink from 'react-native-hyperlink'
import HTMLView from 'react-native-htmlview'
import YoutubePlayer from 'react-native-youtube-iframe'
import RBSheet from 'react-native-raw-bottom-sheet'
import { IMAGE_UPLOAD_URL, VIDEO_UPLOAD_URL } from '../../../api/socketIo'
import {
  CONVERSATION_MESSAGES,
  TYPING,
  MESSAGE,
  USER_MESSAGE,
  SYSTEM_MESSAGE,
  CONVERSATION_PIN,
  CONVERSATION_UNPIN,
  CONVERSATION_ARCHIVE
} from '../../../api/socket-event'
import icMore from '../../../../Images/More/ic_more.png'
import AliciaImg from '../../../../Images/alicia.png'
import styles from './styles'
import AppointMent from './Appointment'
import APICaller from '../../../util/apiCaller'
import Http from '../../../api/http'
import { No_IMAGE_LINK } from '../../../common/constants'
import { ActivityIndicatorModal } from '../../../common/components/activityIndicatorModal'
import { Matrics, Color } from '../../../common/styles'
import VideoPlayer from 'react-native-video-player'
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import AsyncStorage from '@react-native-community/async-storage'
import YouTube from '../../../util/youtubeController'
import { secondsToDate, formatTime } from '../../../common/helper/time'
import ActionSheet from 'react-native-action-sheet'
import Modal from 'react-native-modal'
import * as _ from 'lodash'
import PushNotification from 'react-native-push-notification'
import RNGRP from 'react-native-real-path'
const YOUTUBE_REGEX_CHECK = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const TENANT_VIEW = 'Tenant wants to set an appointment to view this unit'
const TENANT_RENT = 'Tenant wants to proceed with renting this unit'
const I_WANT_VIEW = 'I want to fix an appointment to view the unit'
const I_WANT_RENT = 'I want to proceed with renting this unit'

const linkStyles = {
  color: '#0000EE',
  textDecorationLine: 'underline'
}

const VIEWABILITY_CONFIG = {
  minimumViewTime: 50,
  // itemVisiblePercentThreshold: 100,
  viewAreaCoveragePercentThreshold: 100
}
class ChatMessages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      currentChat: null,
      user: null,
      allMessages: [],
      messageList: [],
      composerText: '',
      imagePreviewUrl: '',
      isSomeoneTypingStatus: false,
      isSomeoneTypingUserId: '',
      isSomeoneTypingConversationId: '',
      isLoading: false,
      loadEarlier: false,
      isLoadingEarlier: false,
      isImageUploading: false,
      users: this.props.navigation.state.params
        ? this.props.navigation.state.params
        : '',
      chatCoversationId: this.props.navigation.state.params.chat.custom[0]
        .value,
      lastTypingReceived: null,
      appointMentData: null,
      convId: null,
      bannerText: '',
      showPrivateChatModal: false,
      selectedPrivateChatUser: '',
      groupUsers: [],
      playing: false,
      showReplyView: false,
      showReplyPropsMsg: null,
      selectedReplyMsg: null,
      modalVisible: false,
      reportModalVisible: false,
      unreadMessage: null,
      isShowUnreadMessage: false,
      pinActionType: '',
      conversationId: '',
      showPickerModal: false
    }

    this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(this)
    this.chatDidScroll = this.chatDidScroll.bind(this)
    Keyboard.dismiss()
  }

  _lastTypingChecker = setInterval(() => {
    if (
      this.state.isSomeoneTypingStatus &&
      Math.abs(
        (new Date().getTime() - this.state.lastTypingReceived.getTime()) / 1000
      ) > 2
    ) {
      this.setState({
        isSomeoneTypingStatus: false,
        isSomeoneTypingUserId: ''
      })
    }
  }, 2000)

  handleBackButton = () => {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan()
    }

    this._navigationBack()
    return true
  }

  _navigationBack = () => {
    if (!_.isEmpty(this.state.pinActionType)) {
      if (!this.props.navigation.state.params.onGoBack) { this.props.navigation.goBack() }//when user comes from 'open chat' button
      this.props.navigation.state.params.onGoBack({
        pinActionType: this.state.pinActionType,
        item: this.state.currentChat,
        itemIndex: this.props.navigation.state.params.itemIndex
      })
    }
    this.props.navigation.goBack()
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentDidMount() {
    DeviceEventEmitter.emit('readMessage')
    console.log("this.props.navigation.state.params.chat.members", this.props.navigation.state.params.chat.members)
    console.log("this.props.navigation.state.params.chat.members", this.props.navigation.state)
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize()
    }
    const conversationId =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.id

    AsyncStorage.setItem('conversationId', `${conversationId}`)
    this.setState({ conversationId: conversationId })

    this.manageSocket()

    var groupUsersArray = []
    const members =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.members
    if (members) {
      groupUsersArray = members.filter(
        (item) => (item.email == 'noreply@speedhome.com' || item.email == '') && item.name == 'Alicia'
      )
    }
    this.setState({ groupUsers: groupUsersArray })

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      return true
    }
    if (this.state !== nextState) {
      return true
    }
    return false
  }

  reportUser = (reportMsg) => {
    if (this.state.chatCoversationId) {
      var reporteeId = ''
      var isLoggedInUserIsLandlord = false
      const { userLoginData } = this.props
      const { appointMentData, users } = this.state
      APICaller(
        `${Http.getPropertyInfo(this.state.convId)}`,
        'GET',
        this.state.user.token,
        ''
      ).then((response) => {
        if (response.status === 200) {
          let propertyInfo = response.data
          if (
            userLoginData &&
            userLoginData.userId ===
            (propertyInfo && propertyInfo.user && propertyInfo.user.id)
          ) {
            isLoggedInUserIsLandlord = true
            reporteeId =
              propertyInfo &&
              propertyInfo.property &&
              propertyInfo.property.user &&
              propertyInfo.property.user.id
          } else {
            reporteeId =
              propertyInfo && propertyInfo.user && propertyInfo.user.id
          }
          const body = {
            reporteeId: reporteeId,
            reason: reportMsg
          }
          APICaller(
            Http.reportUserAPI(this.state.convId),
            'POST',
            '',
            JSON.stringify(body)
          ).then((response) => {
            if (response.status === 200) {
              Alert.alert(
                'Reason for Report',
                'We at Speedhome takes your report very seriously and will investigate on this matter.',
                [{ text: 'OK', onPress: () => this.RBSheetRef.close() }],
                { cancelable: false }
              )
            } else if (response.status === 429) {
              Alert.alert(
                'You have already reported this',
                null,
                [{ text: 'OK', onPress: () => this.RBSheetRef.close() }],
                { cancelable: false }
              )
            } else {
              Alert.alert(
                'Something went wrong, please try again later.',
                null,
                [{ text: 'OK', onPress: () => this.RBSheetRef.close() }],
                { cancelable: false }
              )
            }
          })
        }
      })
    }
  }
  manageSocket() {
    const { chat, socket, user } = this.props.navigation.state.params
    const self = this

    this.setState(
      {
        socket: socket,
        currentChat: chat,
        user: user,
        isLoading: true,
        messageList: []
      },
      () => {
        if (socket) {
          // socket.on('connect', () => {
          socket.emit(CONVERSATION_MESSAGES, chat.id)
          socket.on(CONVERSATION_MESSAGES, (data) => {
            const conversationMessages = data.data
            if (conversationMessages.length > 49) {
              this.setState({
                loadEarlier: true
              })
            } else {
              this.setState({
                loadEarlier: false
              })
            }
            if (self.state.messageList.length > 0) {
              if (conversationMessages.length > 0) {
                self.moreMessages(conversationMessages)
              } else {
                self.setState({
                  isLoadingEarlier: false
                })
              }
            } else {
              conversationMessages.sort(function (x, y) {
                return x.dateCreated - y.dateCreated
              })
              self.receiveAllMessage(conversationMessages)
            }
          })
          socket.on(TYPING, (result) => {
            const userId = result.data.userId
            if (
              !self.state.isSomeoneTypingStatus &&
              self.state.user.id !== userId
            ) {
              self.setState({
                isSomeoneTypingStatus: true,
                isSomeoneTypingUserId: userId,
                lastTypingReceived: new Date()
              })
            }
          })
          socket.on(MESSAGE, (data) => {
            const message = data.data
            self.receiveSingleMessage(message)
          })
          // })
        }
        if (chat) {
          let conversationId = ''
          const backendCustomArray = chat.custom.filter(
            (x) => x.key === 'backend_chat_conversation_id'
          )
          if (backendCustomArray.length > 0) {
            conversationId = backendCustomArray[0].value
          }
          APICaller(
            Http.getAppointmentsByChatConversationId(conversationId),
            'GET',
            null,
            ''
          ).then((response) => {
            if (response.status === 200) {
              this.setState(
                {
                  appointMentData: response.data,
                  convId: conversationId
                },
                () => {
                  if (this.state.convId) {
                    APICaller(
                      Http.getBannerTextByChatConversationId(conversationId),
                      'GET',
                      null,
                      ''
                    )
                      .then((convBannerText) => {
                        if (
                          convBannerText &&
                          convBannerText.data &&
                          convBannerText.data.bannerText
                        ) {
                          this.setState({
                            bannerText: convBannerText.data.bannerText
                          })
                        }
                      })
                      .catch((err) => console.log(err))
                  }
                }
              )
            }
          })
        }
      }
    )
  }

  getUserByUserId = (userList, userId) => {
    if (userId) {
      let user = userList.filter((obj) => {
        return obj.id === userId
      })

      if (user.length > 0) {
        return user[0].name
      } else {
        return 'someone '
      }
    }
    return null
  }

  pinnedConversation = () => {
    const { socket, currentChat } = this.state
    socket.emit(CONVERSATION_PIN, currentChat.id, (isPinned) => {
      this.setState({
        currentChat: {
          ...this.state.currentChat,
          pinned: true
        },
        pinActionType: 'PIN'
      })
    })
  }
  unPinnedConversation = () => {
    const { socket, currentChat } = this.state
    socket.emit(CONVERSATION_UNPIN, currentChat.id, (isUnPinned) => {
      this.setState({
        currentChat: {
          ...this.state.currentChat,
          pinned: false
        },
        pinActionType: 'UNPIN'
      })
    })
  }
  archiveConversation = () => {
    const { socket, currentChat } = this.state
    socket.emit(CONVERSATION_ARCHIVE, currentChat.id, (isArchive) => {
      this._navigationBack()
    })
    this.props.navigation.state.params.onGoBack({
      action: 'delete',
      item: this.state.currentChat
    })
    this._navigationBack()
  }

  _viewHeader() {
    if (this.state.currentChat) {
      const members = this.state.currentChat.members
      return (
        <View style={styles.headerContainerStyle}>
          <View style={styles.headerViewInnerContainerStyle}>
            <TouchableOpacity
              style={styles.backButtonViewStyle}
              onPress={() => {
                if (Platform.OS === 'android') {
                  AndroidKeyboardAdjust.setAdjustPan()
                }
                this._navigationBack()
              }}
              accessible={true}
              accessibilityLabel='chatMsgArrBack'
            >
              <Icon
                name='ios-arrow-back'
                size={40}
                style={{
                  marginRight: 15
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerTitleButtonStyle}
              onPress={() => {
                if (this.state.currentChat.subject.indexOf('SPEEDHOME') > -1) {
                  this.props.navigation.navigate('SystemChatInfo', {})
                } else {
                  this.props.navigation.navigate('ChatInfo', {
                    users: this.state.currentChat.members,
                    chatCoversationId: this.state.chatCoversationId,
                    specificUserFromMessageLink: false,
                    specificUserFromMessageId: ''
                  })
                }
              }}
              accessible={true}
              accessibilityLabel='chatMsgChatInfoBtn'
            >
              <View style={styles.headerTitleViewStyle}>
                <Text style={styles.headerTitleTextStyle}>
                  {this.state.currentChat.subject.length > 25
                    ? `${this.state.currentChat.subject.substring(0, 25)}...`
                    : `${this.state.currentChat.subject.substring(0, 25)}`}
                </Text>

                {this.state.isSomeoneTypingUserId &&
                  this.state.isSomeoneTypingStatus ? (
                    this.state.currentChat.members.filter((obj) => {
                      return obj.id === this.state.isSomeoneTypingUserId
                    }).length > 0 ? (
                        <Text style={styles.typingNameTextStyle}>
                          {' '}
                          {this.getUserByUserId(
                            this.state.currentChat.members,
                            this.state.isSomeoneTypingUserId
                          ) + ' is typing'}
                        </Text>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          {members.map((member, index) => {
                            return (
                              <Text
                                key={`members-list-${index}`}
                                style={styles.headerSubTitleTextStyle}
                              >
                                {(index ? ', ' : '') + member.name}
                              </Text>
                            )
                          })}
                        </View>
                      )
                  ) : (
                    <View style={{ flexDirection: 'row' }}>
                      {members.map((member, index) => {
                        return (
                          <Text
                            key={`members-list-${index}`}
                            style={styles.headerSubTitleTextStyle}
                          >
                            {(index ? ', ' : '') + member.name}
                          </Text>
                        )
                      })}
                    </View>
                  )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerInfoImageViewStyle}
              onPress={() => {
                this.setState({ modalVisible: !this.state.modalVisible })
              }}
              accessible={true}
              accessibilityLabel='chatMsgInfoImageBtn'
            >
              <Image
                testID='info'
                style={styles.headerInfoImageStyle}
                source={icMore}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    // return null
  }
  isIncludesImgUrl = (msg) => {
    const imgChecker = ['.png', '.jpeg', '.jpg']
    const hasImgUrl = msg.match(
      new RegExp('\\b(' + imgChecker.join('|') + ')\\b', 'ig')
    )
    const imgUrlArr = Array.from(getUrls(msg))

    return {
      hasImgUrl: hasImgUrl,
      imgUrlArr: imgUrlArr
    }
  }
  moreMessages = (messages) => {
    this.setState({
      isLoadingEarlier: false
    })
    let incomingMessage = null

    let userList = this.state.users.chat.members
    let moreMessageArray = []
    var allMessagesArr = this.state.allMessages.concat(messages)
    this.setState({ allMessages: allMessagesArr })
    if (messages) {
      messages.map((message) => {
        if (message != null) {
          if (
            this.state.messageList &&
            this.state.messageList.length > 0 &&
            this.state.messageList.every(
              (item) => (item != null && item._id) !== message.id
            )
          ) {
            if (message.type === SYSTEM_MESSAGE) {
              incomingMessage = {
                _id: message.id,
                text: message.text,
                createdAt: message.dateCreated,
                system: true,
                image: '',
                readBy: message.readBy,
                quotedMessage: message.quotedMessage,
                private: message.private,
                highlightMessage: false,
                user: {
                  _id: message.sender.id,
                  name: message.sender.name
                }
              }
              moreMessageArray.push(incomingMessage)
            } else {
              let imageUrl = ''

              if (message.mediaType === 'IMAGE') {
                if (message.custom.length > 0) {
                  const imageUrlFiltered = message.custom.filter(
                    (x) => x.key === 'IMAGE_URL'
                  )
                  if (imageUrlFiltered.length > 0) {
                    imageUrl = imageUrlFiltered[0].value
                  }
                }
              } else {
                imageUrl = this.getImageUrl(message) || ''
              }
              var videoUrl = ''
              if (message.mediaType === 'VIDEO') {
                if (message.custom.length > 0) {
                  const imageUrlFiltered = message.custom.filter(
                    (x) => x.key === 'MEDIA_URL'
                  )
                  if (imageUrlFiltered.length > 0) {
                    videoUrl = imageUrlFiltered[0].value
                  }
                }
              } else {
                videoUrl = this.getImageUrl(message) || ''
              }

              userList.map((user) => {
                if (user.id === message.sender.id) {
                  incomingMessage = {
                    _id: message.id,
                    text: message.text,
                    createdAt: message.dateCreated,
                    system: false,
                    image: imageUrl,
                    video: videoUrl,
                    readBy: message.readBy,
                    quotedMessage: message.quotedMessage,
                    private: message.private,
                    highlightMessage: false,
                    user: {
                      _id: message.sender.id,
                      name: message.sender.name
                    }
                  }
                }
              })
              moreMessageArray.push(incomingMessage)
            }
          }
        }
      })
    }
    // const messageList = [...this.state.messageList];
    // const newMessageList = [...moreMessageArray, ...messageList];

    if (moreMessageArray[0] !== null) {
      moreMessageArray.sort(function (x, y) {
        return y.createdAt - x.createdAt
      })
    }
    this.setState((previousState) => ({
      messageList: GiftedChat.append(
        moreMessageArray,
        previousState.messageList
      )
    }))
  }
  imageRegex = (msg) => {
    const imgChecker = ['.png', '.jpeg', '.jpg']

    return msg.match(new RegExp('\\b(' + imgChecker.join('|') + ')\\b', 'ig'))
  }
  getUrls = (msg) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const urlArr = msg.match(urlRegex)
    let newUrlArr = []
    if (urlArr && urlArr.length > 0) {
      newUrlArr = urlArr.filter((url) => {
        const hasImgUrl = this.imageRegex(msg)
        if (hasImgUrl) {
          return url
        }
        return null
      })
    }
    return newUrlArr
  }
  getImageUrl = (message) => {
    const userName = message.sender.name
    const userMsg = message.text
    const hasImgUrl = this.imageRegex(userMsg)

    if (
      userName === 'Alicia' &&
      hasImgUrl &&
      hasImgUrl.length > 0 &&
      this.getUrls(userMsg) &&
      this.getUrls(userMsg).length > 0
    ) {
      return this.getUrls(userMsg)[0]
    }
    return null
  }
  getYoutubeLinkFromString = (msg) => {
    const GET_LINK = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi
    const youtube_link_arr = msg.match(GET_LINK)
    if (youtube_link_arr && youtube_link_arr.length > 0) {
      return youtube_link_arr
    }
  }
  getVideoUrl = (message) => {
    if (!message) {
      return
    }
    let videoUrl = ''
    if (
      this.getYoutubeLinkFromString(message) &&
      this.getYoutubeLinkFromString(message).length > 0
    ) {
      videoUrl = this.getYoutubeLinkFromString(message)[0]
    }
    return videoUrl
  }
  receiveAllMessage = (messages) => {
    let incomingMessage = null
    let userList = this.state.users.chat.members
    this.setState({ allMessages: messages })
    if (messages) {
      this.setState({
        isLoading: false,
        isLoadingEarlier: false
      })
      messages.map((message) => {
        if (message.type === SYSTEM_MESSAGE) {
          incomingMessage = {
            _id: message.id,
            text: message.text,
            createdAt: message.dateCreated,
            system: true,
            image: '',
            readBy: message.readBy,
            quotedMessage: message.quotedMessage,
            private: message.private,
            highlightMessage: false,
            user: {
              _id: message.sender.id,
              name: message.sender.name
            }
          }
        } else {
          let imageUrl = ''

          if (message.mediaType === 'IMAGE') {
            if (message.custom.length > 0) {
              const imageUrlFiltered = message.custom.filter(
                (x) => x.key === 'IMAGE_URL'
              )
              if (imageUrlFiltered.length > 0) {
                imageUrl = imageUrlFiltered[0].value
              }
            }
          } else {
            imageUrl = this.getImageUrl(message) || ''
          }
          var videoUrl = ''
          if (message.mediaType === 'VIDEO') {
            if (message.custom.length > 0) {
              const imageUrlFiltered = message.custom.filter(
                (x) => x.key === 'MEDIA_URL'
              )
              if (imageUrlFiltered.length > 0) {
                videoUrl = imageUrlFiltered[0].value
              }
            }
          } else {
            videoUrl = this.getImageUrl(message) || ''
          }

          userList.map((user) => {
            if (user.id === message.sender.id) {
              incomingMessage = {
                _id: message.id,
                text: message.text,
                createdAt: message.dateCreated,
                system: false,
                image: imageUrl,
                video: videoUrl,
                readBy: message.readBy,
                quotedMessage: message.quotedMessage,
                private: message.private,
                highlightMessage: false,
                user: {
                  _id: message.sender.id,
                  name: message.sender.name
                }
              }
            }
          })
        }

        if (incomingMessage !== null) {
          this.setState((previousState) => ({
            messageList: GiftedChat.append(
              previousState.messageList,
              incomingMessage
            )
          }))
        }
      })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }
  receiveSingleMessage = (message) => {
    let userList = this.state.users.chat.members
    var allMessagesArr = this.state.allMessages.concat(message)
    this.setState({ allMessages: allMessagesArr })
    if (message && Object.keys(message).length > 1) {
      let incomingMessage = null
      if (message.type === SYSTEM_MESSAGE) {
        incomingMessage = {
          _id: message.id,
          text: message.text,
          createdAt: message.dateCreated,
          system: true,
          image: '',
          readBy: message.readBy,
          quotedMessage: message.quotedMessage,
          private: message.private,
          highlightMessage: false,
          user: {
            _id: message.sender.id,
            name: message.sender.name
          }
        }
      } else {
        let imageUrl = ''

        if (message.mediaType === 'IMAGE') {
          if (message.custom.length > 0) {
            const imageUrlFiltered = message.custom.filter(
              (x) => x.key === 'IMAGE_URL'
            )
            if (imageUrlFiltered.length > 0) {
              imageUrl = imageUrlFiltered[0].value
            }
          }
        } else {
          imageUrl = this.getImageUrl(message) || ''
        }
        var videoUrl = ''
        if (message.mediaType === 'VIDEO') {
          if (message.custom.length > 0) {
            const imageUrlFiltered = message.custom.filter(
              (x) => x.key === 'MEDIA_URL'
            )
            if (imageUrlFiltered.length > 0) {
              videoUrl = imageUrlFiltered[0].value
            }
          }
        } else {
          videoUrl = this.getImageUrl(message) || ''
        }

        userList.map((user) => {
          if (user.id === message.sender.id) {
            incomingMessage = {
              _id: message.id,
              text: message.text,
              createdAt: message.dateCreated,
              system: false,
              image: imageUrl,
              video: videoUrl,
              readBy: message.readBy,
              quotedMessage: message.quotedMessage,
              private: message.private,
              highlightMessage: false,
              user: {
                _id: message.sender.id,
                name: message.sender.name
              }
            }
          }
        })
      }

      if (incomingMessage !== null) {
        this.setState((previousState) => ({
          messageList: GiftedChat.append(
            previousState.messageList,
            incomingMessage
          )
        }))
      }
    }
  }
  renderAvatar = (props) => {
    if (
      props.currentMessage.user &&
      props.currentMessage.user.name &&
      props.currentMessage.user.name === 'Alicia'
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (this.state.currentChat.subject.indexOf('SPEEDHOME') > -1) {
              this.props.navigation.navigate('SystemChatInfo', {})
            } else if (props.currentMessage.user.name === 'Alicia') {
              this.props.navigation.navigate('SystemChatInfo', {})
            } else if (this.state.currentChat.subject.indexOf('Alicia') > -1) {
              this.props.navigation.navigate('SystemChatInfo', {})
            } else {
              this.props.navigation.navigate('ChatInfo', {
                users: this.state.currentChat.members,
                chatCoversationId: this.state.chatCoversationId,
                specificUserFromMessageLink: false,
                specificUserFromMessageId: ''
              })
            }
          }}
          accessible={true}
          accessibilityLabel='chatMsgAliciaImageBtn'
        >
          <Image
            testID='alicia'
            style={styles.aliciaAvatarImageStyle}
            source={AliciaImg}
          />
        </TouchableOpacity>
      )
    }
    return (
      <Avatar
        {...props}
        imageStyle={{
          left: styles.imageLeftStyle,
          right: styles.imageRightStyle
        }}
        onPressAvatar={(props) => {
          this.props.navigation.navigate('ChatInfo', {
            users: this.state.currentChat.members,
            chatCoversationId: this.state.chatCoversationId,
            specificUserFromMessageLink: false,
            specificUserFromMessageId: ''
          })
        }}
      />
    )
    // }
  }
  renderRepliedNameText = (props) => {
    const quotedMessage = props.currentMessage.quotedMessage
    return this.state.user.id !==
      (props.currentMessage &&
        props.currentMessage.user &&
        props.currentMessage.user._id) ? (
        <View style={styles.replyNameOuterViewContainerStyle}>
          <MaterialIcons
            name='reply'
            size={Matrics.ScaleValue(10)}
            color={Color.textGray}
            style={{ transform: [{ rotateY: '180deg' }] }}
          />
          <Text style={[styles.replyNameTextStyle, { textAlign: 'left' }]}>
            {quotedMessage.sender.id ==
              (props.currentMessage.user && props.currentMessage.user._id)
              ? `${props.currentMessage.user.name} replied`
              : `${props.currentMessage.user.name} replied to ${quotedMessage.sender && quotedMessage.sender.name
              }`}
          </Text>
        </View>
      ) : (
        <View style={styles.replyNameOuterViewContainerStyle}>
          <MaterialIcons
            name='reply'
            size={Matrics.ScaleValue(10)}
            color={Color.textGray}
            style={{ transform: [{ rotateY: '180deg' }] }}
          />
          <Text style={[styles.replyNameTextStyle, { textAlign: 'right' }]}>
            {quotedMessage.sender.id ==
              (props.currentMessage.user && props.currentMessage.user._id)
              ? 'You replied'
              : `You replied to ${quotedMessage.sender && quotedMessage.sender.name
              }`}
          </Text>
        </View>
      )
  }
  renderBubbleNameText = (props, isPrivate) => {
    const chatMembers =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.members
    return props.currentMessage.quotedMessage != undefined ? (
      this.renderRepliedNameText(props)
    ) : this.state.user.id !==
      (props.currentMessage &&
        props.currentMessage.user &&
        props.currentMessage.user._id) ? (
          isPrivate == true ? (
            <Text style={styles.avatarTextStyle}>
              {props.currentMessage.user.name}{' '}
              <Text style={styles.avatarPrivateTextStyle}>to you (Private):</Text>
            </Text>
          ) : (
              <Text style={styles.avatarTextStyle}>
                {props.currentMessage.user.name}
              </Text>
            )
        ) : isPrivate == true ? (
          <Text style={styles.avatarPrivateTextStyle}>Privately to Alicia:</Text>
        ) : (
            chatMembers.length > 2 && (
              <Text style={styles.avatarPrivateTextStyle}>To Everyone:</Text>
            )
          )
  }

  renderReplyButtonView = (props) => {
    return (
      <View style={styles.replyIconViewContainerStyle}>
        <TouchableOpacity
          style={styles.replyButtonContainerStyle}
          onPress={() => {
            this.chatRef.focusTextInput()
            this.setState({
              showReplyView: true,
              showReplyPropsMsg: props.currentMessage
            })
          }}
          accessible={true}
          accessibilityLabel='chatMsgReplyIconBtn'
        >
          <MaterialIcons
            name='reply'
            size={Matrics.ScaleValue(15)}
            color={Color.darkGray}
          />
        </TouchableOpacity>
      </View>
    )
  }
  returnHTMLQuoteMessageView = (props, isLeftBubble) => {
    const { allMessages } = this.state

    let htmlContent = ``

    if (props.currentMessage.quotedMessage.text.includes('<url')) {
      let firstReplace = ''
      if (props.currentMessage.text.includes('<url:key_collection')) {
        const getIdFromLink = this.getCollectionTextFromUrl(
          props.currentMessage.text
        )
        firstReplace = decodeURI(
          props.currentMessage.text.replace(
            `<url:key_collection>${getIdFromLink}</url>`,
            `<a href='#'>${getIdFromLink}</a>`
          )
        )
      } else if (
        props.currentMessage.quotedMessage.text.includes('<url:post')
      ) {
        firstReplace = props.currentMessage.quotedMessage.text.replace(
          '<url:post',
          `<a href='#'`
        )
      } else if (
        props.currentMessage.quotedMessage.text.includes('<url:profile')
      ) {
        firstReplace = props.currentMessage.quotedMessage.text.replace(
          '<url:profile',
          `<a href='#'`
        )
      } else if (
        props.currentMessage.quotedMessage.text.includes('<url:ads-')
      ) {
        const pref = props.currentMessage.quotedMessage.text
          .replace('<url:ads-', '')
          .replace('>', '#')
        const ref = pref.substring(0, pref.indexOf('#'))
        firstReplace = props.currentMessage.quotedMessage.text.replace(
          `<url:ads-${ref}`,
          `<a href='#'`
        )
      } else if (
        props.currentMessage.quotedMessage.text.includes('<url:chat_profile:')
      ) {
        const getIdFromLink = this.getUserIdFromMessageText(
          props.currentMessage.quotedMessage.text
        )
        if (props.currentMessage.quotedMessage.text.indexOf('name:') > 0) {
          firstReplace = props.currentMessage.quotedMessage.text.replace(
            `<url:chat_profile:${getIdFromLink},name:${this.getNameFromUrl(
              props.currentMessage.quotedMessage.text
            )}>`,
            `<a href='#'>${decodeURI(
              this.getNameFromUrl(props.currentMessage.quotedMessage.text)
            )}`
          )
        } else {
          firstReplace = props.currentMessage.quotedMessage.text.replace(
            `<url:chat_profile:${getIdFromLink}>`,
            `<a href='#'>the Tenant`
          )
        }
        // const getIdFromLink = this.getUserIdFromMessageText(
        //   props.currentMessage.quotedMessage.text
        // )
        // firstReplace = props.currentMessage.quotedMessage.text.replace(
        //   `<url:chat_profile:${getIdFromLink}`,
        //   `<a href='#'>the profile`
        // )
      }
      const finalReplace = firstReplace.replace('</url', '</a')
      htmlContent = `<p>${finalReplace}</p>`
    } else {
      htmlContent = `<p>${props.currentMessage.quotedMessage.text}</p>`
    }

    return (
      <TouchableOpacity
        onPress={() => {
          const ReplyMsgIndex = allMessages.findIndex(
            (item) => item.id === props.currentMessage.quotedMessage.id
          )
          if (ReplyMsgIndex !== -1) {
            this.chatRef._messageContainerRef.current.scrollToIndex({
              animated: true,
              index: allMessages.length - 1 - ReplyMsgIndex
            })
          }
        }}
        style={[
          styles.replyMessageContainerStyle,
          isLeftBubble == true
            ? {
              borderBottomLeftRadius: 0,
              marginRight: Matrics.ScaleValue(60)
            }
            : {
              borderBottomRightRadius: 0,
              marginLeft: Matrics.ScaleValue(60)
            }
        ]}
        accessible={true}
        accessibilityLabel='chatMsgHtmlBtn'
      >
        <HTMLView
          value={htmlContent}
          stylesheet={styles}
          onLinkPress={() => { }}
        />
      </TouchableOpacity>
    )
  }

  renderMessageVideo = (props) => {
    const { currentMessage } = props
    var url = currentMessage.video.replace('-converted', '')

    return (
      <View style={{ padding: 5, height: 120, width: 200 }}>
        <VideoPlayer
          video={{ uri: url }}
          videoWidth={200}
          videoHeight={120}
          thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
        />
      </View>
    )
  }

  renderReplyMessageView = (props, isLeftBubble) => {
    const { allMessages, messageList } = this.state
    if (
      props.currentMessage.quotedMessage != undefined &&
      props.currentMessage.quotedMessage.text != undefined &&
      /<\/?[^>]*>/.test(props.currentMessage.quotedMessage.text)
    ) {
      return this.returnHTMLQuoteMessageView(props, isLeftBubble)
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            const ReplyMsgIndex = allMessages.findIndex(
              (item) => item.id === props.currentMessage.quotedMessage.id
            )
            if (ReplyMsgIndex !== -1) {
              this.chatRef._messageContainerRef.current.scrollToIndex({
                animated: true,
                index: allMessages.length - 1 - ReplyMsgIndex
              })
            }
            this.setState({
              selectedReplyMsg: props.currentMessage.quotedMessage
            })
          }}
          activeOpacity={1}
          style={[
            styles.replyMessageContainerStyle,
            isLeftBubble == true
              ? {
                borderBottomLeftRadius: 0,
                marginRight: Matrics.ScaleValue(60)
              }
              : {
                borderBottomRightRadius: 0,
                marginLeft: Matrics.ScaleValue(60)
              }
          ]}
          accessible={true}
          accessibilityLabel='chatMsgPhotoBtn'
        >
          <View style={{ maxHeight: Matrics.ScaleValue(75) }}>
            {props.currentMessage.quotedMessage.mediaType == 'VIDEO' && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name='videocam'
                  size={Matrics.ScaleValue(15)}
                  color={Color.textGray}
                />
                <Text>Video</Text>
              </View>
            )}

            {props.currentMessage.quotedMessage.mediaType == 'IMAGE' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name='photo'
                  size={Matrics.ScaleValue(15)}
                  color={Color.textGray}
                />
                <Text>Photo</Text>
              </View>
            ) : (
                <Text style={{ maxHeight: Matrics.ScaleValue(75) }}>
                  {props.currentMessage.quotedMessage.text}
                </Text>
              )}
          </View>
        </TouchableOpacity>
      )
    }
  }
  renderBubble = (props) => {
    // console.log('+++++', props.currentMessage, this.state.messageList)
    const { selectedReplyMsg } = this.state
    const chatMembers =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.members
    const readBy = props.currentMessage.readBy
    var isPrivate = false
    var isPrevMsgPrivate = false
    if (chatMembers.length > 2 && readBy && readBy.length <= 3) {
      isPrivate = props.currentMessage.private
      isPrevMsgPrivate = props.previousMessage.private
    }
    const currentMsgDateTime = formatTime(
      'DD/MM/YYYY HH:mm',
      props.currentMessage.createdAt
    )
    const prevMsgDateTime = formatTime(
      'DD/MM/YYYY HH:mm',
      props.previousMessage.createdAt
    )
    const isLeftBubble =
      this.state.user.id !==
      (props.currentMessage &&
        props.currentMessage.user &&
        props.currentMessage.user._id)
    if (
      utils.isSameUser(props.currentMessage, props.previousMessage) &&
      utils.isSameDay(props.currentMessage, props.previousMessage)
    ) {
      return (
        <View
          style={{
            flex: 1,
            marginVertical: Matrics.ScaleValue(5),
            alignItems: isLeftBubble == true ? 'flex-start' : 'flex-end'
          }}
        >
          {props.currentMessage.quotedMessage != undefined
            ? this.renderBubbleNameText(props, isPrivate)
            : props.previousMessage.quotedMessage != undefined ||
              currentMsgDateTime !== prevMsgDateTime
              ? this.renderBubbleNameText(props, isPrivate)
              : isPrivate !== isPrevMsgPrivate
                ? this.renderBubbleNameText(props, isPrivate)
                : null}
          {props.currentMessage.quotedMessage &&
            this.renderReplyMessageView(props, isLeftBubble)}
          <View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              },
              isLeftBubble == true
                ? { marginRight: Matrics.ScaleValue(60) }
                : { marginLeft: Matrics.ScaleValue(60) }
            ]}
          >
            {isLeftBubble == false && this.renderReplyButtonView(props)}
            <View>
              <Bubble
                {...props}
                textStyle={{
                  right: [
                    styles.bubbleTextStyle,
                    { color: isPrivate == true ? '#FFF' : '#000' }
                  ],
                  left: [
                    styles.bubbleTextStyle,
                    { color: isPrivate == true ? '#FFF' : '#000' }
                  ]
                }}
                wrapperStyle={{
                  left: [
                    styles.bubbleWrapperStyle,
                    {
                      marginRight: 5,
                      backgroundColor:
                        isPrivate == true ? 'rgba(255,0,0,0.8)' : 'transparent',
                      shadowColor: '#000',
                      borderColor:
                        selectedReplyMsg != null &&
                          selectedReplyMsg.id ===
                          (props.currentMessage && props.currentMessage._id)
                          ? Color.green
                          : Color.bubbleLightGray
                    }
                  ],
                  right: [
                    styles.bubbleWrapperStyle,
                    {
                      marginLeft: 5,
                      backgroundColor:
                        isPrivate == true ? 'rgba(255,0,0,0.8)' : 'transparent',
                      borderColor:
                        selectedReplyMsg != null &&
                          selectedReplyMsg.id ===
                          (props.currentMessage && props.currentMessage._id)
                          ? Color.green
                          : Color.bubbleLightGray
                    }
                  ]
                }}
              />
            </View>
            {isLeftBubble == true && this.renderReplyButtonView(props)}
          </View>
        </View>
      )
    }
    return (
      <View
        style={{
          flex: 1,
          marginVertical: Matrics.ScaleValue(5),
          alignItems: isLeftBubble == true ? 'flex-start' : 'flex-end'
        }}
      >
        {this.renderBubbleNameText(props, isPrivate)}
        {props.currentMessage.quotedMessage &&
          this.renderReplyMessageView(props, isLeftBubble)}
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            },
            isLeftBubble == true
              ? { marginRight: Matrics.ScaleValue(60) }
              : { marginLeft: Matrics.ScaleValue(60) }
          ]}
        >
          {isLeftBubble == false && this.renderReplyButtonView(props)}
          <View>
            <Bubble
              {...props}
              textStyle={{
                right: [
                  styles.bubbleTextStyle,
                  {
                    color: isPrivate == true ? '#FFF' : '#000'
                  }
                ],
                left: [
                  styles.bubbleTextStyle,
                  {
                    color: isPrivate == true ? '#FFF' : '#000'
                  }
                ]
              }}
              wrapperStyle={{
                left: [
                  styles.bubbleWrapperStyle,
                  {
                    marginRight: 5,
                    backgroundColor:
                      isPrivate == true ? 'rgba(255,0,0,0.8)' : '#fff',
                    shadowColor: '#000',
                    borderColor:
                      selectedReplyMsg != null &&
                        selectedReplyMsg.id ===
                        (props.currentMessage && props.currentMessage._id)
                        ? Color.green
                        : Color.bubbleLightGray
                  }
                ],
                right: [
                  styles.bubbleWrapperStyle,
                  {
                    marginLeft: 5,
                    backgroundColor:
                      isPrivate == true ? 'rgba(255,0,0,0.8)' : '#fff',
                    borderColor:
                      selectedReplyMsg != null &&
                        selectedReplyMsg.id ===
                        (props.currentMessage && props.currentMessage._id)
                        ? Color.green
                        : Color.bubbleLightGray
                  }
                ]
              }}
            />
          </View>
          {isLeftBubble == true && this.renderReplyButtonView(props)}
        </View>
      </View>
    )
  }

  renderTime = (props) => {
    const isPrivate = props.currentMessage.private
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: [
            {
              color: isPrivate == true ? '#fff' : Color.darkGray
            }
          ],
          right: [
            {
              color: isPrivate == true ? '#fff' : Color.darkGray
            }
          ]
        }}
      />
    )
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendButtonViewStyle}>
          <Image
            testID='send'
            style={styles.sendButtonImageStyle}
            source={{
              uri: 'https://static.thenounproject.com/png/383448-200.png'
            }}
            resizeMode={'center'}
          />
        </View>
      </Send>
    )
  }
  async onSend(messages = []) {
    const { selectedPrivateChatUser, showReplyPropsMsg } = this.state
    const currentChat = this.state.currentChat
    const user = this.state.user
    let incomingMessage = {
      text: '',
      type: USER_MESSAGE,
      sender: {
        id: ''
      }
    }
    messages.length > 0 &&
      messages.forEach((message) => {
        incomingMessage = {
          text: message.text,
          type: USER_MESSAGE,
          sender: {
            id: user.id
          }
        }
      })
    if (selectedPrivateChatUser != '') {
      incomingMessage['readBy'] = [{ userId: selectedPrivateChatUser.id }]
    }
    if (showReplyPropsMsg != null) {
      incomingMessage['quotedMessage'] = { id: showReplyPropsMsg._id }
    }
    this.setState({ showReplyView: false, showReplyPropsMsg: null })
    await this.state.socket.emit(MESSAGE, currentChat.id, incomingMessage)
    this.chatRef.scrollToBottom()
  }
  renderComposer = (props) => {
    if (this.state.currentChat) {
      const currentChat = this.state.currentChat
      if (props.text.length > 0) {
        this.state.socket.emit(TYPING, currentChat.id)
      }
    }
    return <Composer {...props} />
  }

  renderChatFooter = (props) => {
    console.log("Props....", this.state.groupUsers)
    const {
      showPrivateChatModal,
      selectedPrivateChatUser,
      groupUsers,
      showReplyView
    } = this.state
    const chatMembers =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.members
    const newGroupUsers = [{ name: 'Everyone' }].concat(groupUsers)

    return (
      <View>
        {chatMembers.length > 2 && (
          <View
            style={{
              height: Matrics.ScaleValue(40),
              paddingLeft: Matrics.ScaleValue(20)
            }}
          >
            <View style={styles.privateChatViewStyle}>
              <Text style={styles.textToStyle}>To: </Text>
              <View style={styles.PrivateChatButtonStyle}>
                <Menu
                  onClose={() => this.setState({ showPrivateChatModal: false })}
                  onOpen={() => {
                    this.setState({ showPrivateChatModal: true })
                  }}
                >
                  <MenuTrigger
                    text={
                      selectedPrivateChatUser == ''
                        ? `Everyone`
                        : selectedPrivateChatUser.name
                    }
                  />
                  <MenuOptions>
                    {newGroupUsers.map((item, index) => (
                      <MenuOption
                        key={index}
                        onSelect={() =>
                          this.onDropDownOptionClicked(item, index)
                        }
                        text={item.name}
                      />
                    ))}
                  </MenuOptions>
                </Menu>
                <MaterialIcons
                  name={
                    showPrivateChatModal == true
                      ? 'keyboard-arrow-down'
                      : 'keyboard-arrow-up'
                  }
                  size={Matrics.ScaleValue(18)}
                  style={{ color: Color.black }}
                />
              </View>
            </View>
          </View>
        )}
        {showReplyView == true && this.renderQuoteMessageView(props)}
      </View>
    )
  }

  renderQuoteMessageView = (props) => {
    const { showReplyPropsMsg } = this.state
    return (
      <View>
        <View style={styles.replyViewSeperatorLineStyle} />
        <View style={styles.replyContainerViewStyle}>
          <View style={styles.replyInnerViewStyle}>
            <Text style={styles.textToStyle}>
              Replying to{' '}
              <Text style={[styles.textToStyle, { fontWeight: '700' }]}>
                {showReplyPropsMsg != null &&
                  showReplyPropsMsg.user &&
                  showReplyPropsMsg.user.name}
              </Text>
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.textToStyle, { color: Color.darkGray }]}
            >
              {showReplyPropsMsg != null && showReplyPropsMsg.text}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.replyCloseViewStyle}
            onPress={() => {
              this.setState({ showReplyView: false, showReplyPropsMsg: null })
            }}
            accessible={true}
            accessibilityLabel='chatMsgCloseBtn'
          >
            <MaterialIcons name='close' size={18} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  onDropDownOptionClicked = (option, index) => {
    console.log("option", option)
    console.log("index", index)
    index == 0
      ? this.setState({
        selectedPrivateChatUser: '',
        showPrivateChatModal: false
      })
      : this.setState({
        selectedPrivateChatUser: option,
        showPrivateChatModal: false
      })
  }
  clickedOnLick = (msg) => {
    if (msg.includes('<url:key_collection')) {
      const getIdFromLink = this.getCollectionTextFromUrl(msg)
      APICaller(Http.getPropertyById(getIdFromLink.code), 'GET', null, '').then(
        (response) => {
          if (response.status === 200) {
            this.props.navigation.navigate('HomeRunnerCollectKey', {
              id: response.data.id
            })
          }
        }
      )
    } else if (msg.includes('<url:post')) {
      this.props.navigation.navigate('CreateListing')
    } else if (msg.includes('<url:profile')) {
      this.props.navigation.navigate('UserProfile')
    } else if (msg.includes('<url:ads-')) {
      const pref = msg.replace('<url:ads-', '').replace('>', '#')
      const ref = pref.substring(0, pref.indexOf('#'))
      APICaller(Http.getPropertyById(ref), 'GET', null, '').then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('ListingPageDetail', {
            propertyInfo: response.data
          })
        }
      })
    } else if (msg.includes('<url:chat_profile:')) {
      const getIdFromLink = this.getUserIdFromMessageText(msg)

      this.props.navigation.navigate('ChatInfo', {
        users: this.state.currentChat.members,
        chatCoversationId: this.state.chatCoversationId,
        specificUserFromMessageLink: true,
        specificUserFromMessageId: getIdFromLink
      })
    }
  }

  getUserIdFromMessageText = (msg) => {
    const getOnlyElementFromString = msg
      .substring(msg.indexOf('<url:'))
      .substr(0, msg.indexOf('</url>') + 1)
    return parseInt(
      getOnlyElementFromString
        .replace('<url:chat_profile:', '')
        .replace('></url>', '')
    )
  }

  renderMessageText = (props) => {
    if (
      props.currentMessage.text &&
      /<\/?[^>]*>/.test(props.currentMessage.text)
    ) {
      let htmlContent = ``
      if (props.currentMessage.text.includes('<url')) {
        let firstReplace = ''
        if (props.currentMessage.text.includes('<url:key_collection')) {
          const getIdFromLink = this.getCollectionTextFromUrl(
            props.currentMessage.text
          )

          firstReplace = decodeURI(
            props.currentMessage.text.replace(
              `<url:key_collection>${getIdFromLink}</url>`,
              `<a href='#'>${getIdFromLink}</a>`
            )
          )
        } else if (props.currentMessage.text.includes('<url:post')) {
          firstReplace = props.currentMessage.text.replace(
            '<url:post',
            `<a href='#'`
          )
        } else if (props.currentMessage.text.includes('<url:profile')) {
          firstReplace = props.currentMessage.text.replace(
            '<url:profile',
            `<a href='#'`
          )
        } else if (props.currentMessage.text.includes('<url:ads-')) {
          const pref = props.currentMessage.text
            .replace('<url:ads-', '')
            .replace('>', '#')
          const ref = pref.substring(0, pref.indexOf('#'))
          firstReplace = props.currentMessage.text.replace(
            `<url:ads-${ref}`,
            `<a href='#'`
          )
        } else if (props.currentMessage.text.includes('<url:chat_profile:')) {
          const getIdFromLink = this.getUserIdFromMessageText(
            props.currentMessage.text
          )
          if (props.currentMessage.text.indexOf('name:') > 0) {
            firstReplace = props.currentMessage.text.replace(
              `<url:chat_profile:${getIdFromLink},name:${this.getNameFromUrl(
                props.currentMessage.text
              )}>`,
              `<a href='#'>${decodeURI(
                this.getNameFromUrl(props.currentMessage.text)
              )}`
            )
          } else {
            firstReplace = props.currentMessage.text.replace(
              `<url:chat_profile:${getIdFromLink}>`,
              `<a href='#'>the Tenant`
            )
          }
        }
        const finalReplace = firstReplace.replace('</url', '</a')
        htmlContent = `<p>${finalReplace}</p>`
      } else {
        htmlContent = `<p>${props.currentMessage.text}</p>`
      }

      return (
        <View style={styles.htmlContainer}>
          <HTMLView
            value={htmlContent}
            stylesheet={styles}
            onLinkPress={() => this.clickedOnLick(props.currentMessage.text)}
          />
        </View>
      )
    } else if (
      props.currentMessage.user.name === 'Alicia' &&
      props.currentMessage.text &&
      /\r|\n/.exec(props.currentMessage.text)
    ) {
      const splitArr = props.currentMessage.text.split('\n')
      if (splitArr && splitArr.length > 0) {
        let newTextWithLineBreak = ''
        let youtubeUrl = ''
        splitArr.map((words) => {
          newTextWithLineBreak = newTextWithLineBreak + `${words} \n`
          if (YOUTUBE_REGEX_CHECK.exec(words)) {
            if (this.getYoutubeLinkFromString(words)) {
              youtubeUrl = this.getEmbededUrl(
                this.getYoutubeLinkFromString(words)[0]
              )
            }
          }
        })
        if (newTextWithLineBreak && youtubeUrl) {
          return this.renderYoutubeUrl(newTextWithLineBreak, youtubeUrl)
        } else {
          return <MessageText {...props} />
        }
      }
    } else if (
      props.currentMessage.user.name === 'Alicia' &&
      props.currentMessage.text &&
      YOUTUBE_REGEX_CHECK.exec(props.currentMessage.text)
    ) {
      if (this.getYoutubeLinkFromString(props.currentMessage.text)) {
        const embededUrl = this.getEmbededUrl(
          this.getYoutubeLinkFromString(props.currentMessage.text)[0]
        )
        return this.renderYoutubeUrl(props.currentMessage.text, embededUrl)
      } else {
        return <MessageText {...props} />
      }
    } else {
      return <MessageText {...props} />
    }
  }

  getVideoId = (link) => {
    const url = link.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    const videoId =
      url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

    return videoId
  }

  renderYoutubeUrl = (msg, embededUrl) => {
    if (embededUrl) {
      return (
        <View style={[styles.htmlContainer]}>
          <YoutubePlayer
            // ref={playerRef}
            height={200}
            width={WIDTH - 100}
            videoId={this.getVideoId(embededUrl)}
            play={this.state.playing}
            onChangeState={(event) => console.log(event)}
            onReady={() => console.log('ready')}
            onError={(e) => console.log(e)}
            onPlaybackQualityChange={(q) => console.log(q)}
            volume={50}
            playbackRate={1}
            webViewProps={{ allowsFullscreenVideo: true }}
            playerParams={{
              cc_lang_pref: 'us',
              showClosedCaptions: true
            }}
          />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(embededUrl)
            }}
            accessible={true}
            accessibilityLabel='ChatMsgBtn'
          >
            <Text style={{ color: 'blue' }}>{msg}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  getNameFromUrl = (msg) => {
    const arr = msg
      .substring(msg.indexOf('<url:'))
      .substr(0, msg.indexOf('</url>') + 1)
      .replace('<url:chat_profile:', '')
      .replace('></url>', '')
      .replace('.', '')
      .split(':')
    if (arr.length > 1) {
      return arr[1]
    }
    return 'the Tenant'
  }

  getCollectionTextFromUrl = (msg) => {
    const arr = msg
      .substring(msg.indexOf('<url:'))
      .substr(0, msg.indexOf('</url:key_collection>') + 1)
      .replace('<url:key_collection:', '')
      .split('</url:key_collection>')
    if (arr.length > 0) {
      const keyboard = arr[0].split('>')
      if (keyboard.length > 1) {
        return { code: keyboard[0], des: keyboard[1] }
      } else {
        return 'Collection Here'
      }
    }
    return 'Collection Here'
  }

  getYoutubeLinkFromString = (msg) => {
    const GET_LINK = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi
    const youtube_link_arr = msg.match(GET_LINK)
    if (youtube_link_arr && youtube_link_arr.length > 0) {
      return youtube_link_arr
    }
  }
  getEmbededUrl = (link) => {
    if (link) {
      const url = link.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      const videoId =
        url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      } else {
        return null
      }
    }

    return null
  }

  renderSystemMessage = (props) => {
    return (
      <View style={[props.containerStyle, styles.systemMessageContainerStyle]}>
        <View style={styles.systemMessageInnerContainerStyle}>
          <Hyperlink
            linkStyle={{ color: '#2980b9', fontSize: 12 }}
            linkDefault={true}
          >
            <Text style={styles.systemMessageTextStyle}>
              {props.currentMessage.text}
            </Text>
          </Hyperlink>
        </View>
      </View>
    )
  }

  _imagePickerModal = () => {
    this.setState({ showPickerModal: true })
  }
  _permissionCheck = (type) => {
    // this.setState({loading_photo: true });
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        (status) => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ).then((storagePermission) => {
              if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                this._imagePickerLogin(type)
                this.setState({ showPickerModal: false })
              } else {
                alert('Storage permission not given')
              }
            })
          } else {
            alert('Permission not granted')
          }
        }
      )
    } else {
      this.setState({ showPickerModal: false }, () =>
        setTimeout(() => {
          this._imagePickerLogin(type)
        }, 500)
      )
    }
  }
  _urgentAction = () => {
    // this.setState({loading_photo: true });
    const isOwner =
      _.get(this.props, 'userLoginData.userId') ===
      _.get(this.state, 'appointMentData.propertyDto.user.id')
    let optionsArr = [TENANT_VIEW, TENANT_RENT, 'Cancel']
    if (!isOwner) {
      optionsArr = [I_WANT_VIEW, I_WANT_RENT, 'Cancel']
    }
    ActionSheet.showActionSheetWithOptions(
      {
        options: optionsArr,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 2
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.callUrgentAPI(isOwner ? TENANT_VIEW : I_WANT_VIEW)
        } else if (buttonIndex === 1) {
          this.callUrgentAPI(isOwner ? TENANT_RENT : I_WANT_RENT)
        }
      }
    )
  }

  //------- API calling..... -------//
  callUrgentAPI = (message) => {
    const body = { context: message }
    this.setState({ isLoadingEarlier: true })
    APICaller(
      Http.callUrgentAPI(this.state.chatCoversationId),
      'POST',
      this.props.userLoginData.token,
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.status === 200) {
          Alert.alert(
            'Your request has been received',
            'We will assist you as soon as possible',
            [{ text: 'OK' }],
            { cancelable: true }
          )
        } else {
          if (res.status == 1000) {
            alert(res.data)
          } else if (res.status === 403) {
            Alert.alert('Alert', 'Permission denied to perform this operation')
          } else {
            alert(res.data.message)
          }
        }
        this.setState({ isLoadingEarlier: false })
      })
      .catch((error) => {
        alert('Something went wrong.')
      })
  }

  //------- API CALLIG..... -------//
  callUrgentAPI = (message) => {
    const body = { context: message }
    this.setState({ isLoadingEarlier: true })
    APICaller(
      Http.callUrgentAPI(this.state.chatCoversationId),
      'POST',
      this.props.userLoginData.token,
      JSON.stringify(body)
    )
      .then((res) => {
        if (res.status === 200) {
          Alert.alert(
            'Your request has been received',
            'We will assist you as soon as possible',
            [{ text: 'OK' }],
            { cancelable: true }
          )
        } else {
          if (res.status == 1000) {
            alert(res.data)
          } else {
            alert(res.data.message)
          }
        }
        this.setState({ isLoadingEarlier: false })
      })
      .catch((error) => {
        alert('Something went wrong.')
      })
  }

  _imagePickerLogin = (type = 'photo') => {
    if (type === 'takeVideo' || type === 'takePhoto') {
      ImagePicker.openCamera({
        mediaType: type === 'takeVideo' ? 'video' : 'photo'
      }).then((response) => {
        //do what you want with the video
        if (response.didCancel) {
          return
        }
        this.setState(
          {
            isImageUploading: true
          },
          () => {
            if (type === 'takeVideo') {
              this.getPreSignedURL(this.state.conversationId, response)
            } else {
              this._processImage(response)
            }
          }
        )
      })
    } else {
      ImagePicker.openPicker({
        mediaType: type === 'pickVideo' ? 'video' : 'photo'
      }).then((response) => {
        //do what you want with the video
        if (response.didCancel) {
          return
        }
        this.setState(
          {
            isImageUploading: true
          },
          () => {
            if (type === 'pickVideo') {
              this.getPreSignedURL(this.state.conversationId, response)
            } else {
              this._processImage(response)
            }
          }
        )
      })
    }
  }

  _processImage = (response) => {
    ImageResizer.createResizedImage(
      response.path,
      response.width,
      response.height,
      'JPEG',
      80
    )
      .then((res) => {
        RNFetchBlob.fs.readFile(res.path, 'base64').then((data) => {
          const source = {
            uri: response.path ? response.path : No_IMAGE_LINK,
            base64: data
          }
          if (source) {
            this.uploadImage(source, response)
          }
        })
      })
      .catch((err) => {
        this.setState({
          isImageUploading: false
        })
        alert('Something went wrong')
        // TODO error reporting
      })
  }

  getPreSignedURL = async (conversationId, responseVideo) => {
    let apiUrl =
      VIDEO_UPLOAD_URL + `${conversationId}/media/generate/presigned-url`
    const user = this.state.user
    const headers = {
      Authorization: user.token,
      'Content-Type': 'application/json'
    }
    fetch(apiUrl, {
      method: 'GET',
      headers: headers
    })
      .then((response) => response.json())
      .then((json) => {
        this.postVideo(responseVideo, json.preSignedUrl, json.mediaId)
      })
      .catch((error) => {
        this.setState({
          isImageUploading: false
        })
        alert('Someting went wrong!!')
      })
  }
  postVideo = (responseVideo, presignedUrl, mediaId) => {
    const user = this.state.user
    const type = `video/mp4`
    var uri = responseVideo.path
    if (responseVideo.path.includes('file://') === true) {
      const uriArr = responseVideo.path.split('///')
      uri = uriArr[1]
    }
    const headers = {
      'Content-Type': type
    }
    if (Platform.OS == 'ios') {
      this.videoUploading(uri, presignedUrl, headers, mediaId, user)
    } else {
      RNGRP.getRealPathFromURI(responseVideo.path)
        .then((filePath) => {
          var count = (filePath.match(/.mp4/g) || []).length
          if (count >= 2) {
            filePath = filePath.replace('.mp4', '')
          }
          this.videoUploading(filePath, presignedUrl, headers, mediaId, user)
        })
        .catch((error) => {
          this.setState({
            isImageUploading: false
          })
          alert('Something went wrong!')
        })
    }
  }

  videoUploading = (filePath, presignedUrl, headers, mediaId, user) => {
    RNFetchBlob.fetch('PUT', presignedUrl, headers, RNFetchBlob.wrap(filePath))
      .then((data) => {
        const message = {
          text: '',
          sender: {
            id: user.id,
            phone: user.phone,
            token: user.token
          },
          mediaType: 'VIDEO',
          custom: [
            {
              key: 'MEDIA_ID',
              value: mediaId
            }
          ]
        }

        this.state.socket.emit(MESSAGE, this.state.currentChat.id, message)
        this.setState({
          isImageUploading: false
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isImageUploading: false
        })

        alert('Something went wrong!')
      })
  }

  uploadImage = (source, response) => {
    let apiUrl = IMAGE_UPLOAD_URL + `${this.state.currentChat.id}/add`
    const user = this.state.user
    const fileName = response.fileName
      ? response.fileName
      : `${Math.random().toString(36).slice(-5)}.jpg`
    axios
      .post(
        apiUrl,
        {
          uploadingFile: source.base64,
          fileName: fileName
        },
        {
          headers: {
            Authorization: user.token
          }
        }
      )
      .then((res) => {
        const message = {
          text: '',
          sender: {
            id: user.id,
            phone: user.phone,
            token: user.token
          },
          mediaType: 'IMAGE',
          custom: [
            {
              key: 'IMAGE_ID',
              value: res.data.id
            }
          ]
        }
        this.state.socket.emit(MESSAGE, this.state.currentChat.id, message)
        this.setState({
          isImageUploading: false
        })
      })
      .catch((err) => {
        this.setState(
          {
            isImageUploading: false
          },
          () => {
            alert('Someting went wrong!!')
            // TODO error reporting
          }
        )
      })
  }
  renderTicks = (message) => {
    return (
      <View style={{ height: 30, width: 40 }}>
        <Text style={[styles.content.tick, { color: 'lightblue' }]}>✓✓</Text>
      </View>
    )
  }
  renderLoading = (props) => {
    return <ActivityIndicatorModal />
  }
  onLoadEarlier = () => {
    const { socket, currentChat, messageList } = this.state
    this.setState({ isLoadingEarlier: true })
    const lastMessage = messageList[messageList.length - 1]
    socket.emit(
      CONVERSATION_MESSAGES,
      currentChat.id,
      lastMessage && lastMessage._id
    )
  }
  renderFooter = (props) => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null
  }
  componentWillUnmount() {
    // AsyncStorage.setItem('isShowNotification', 'true')
    AsyncStorage.setItem('conversationId', '')
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)

    clearInterval(this._lastTypingChecker)

    this.setState({
      messageList: []
    })
  }
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    )
  }
  scrollToIndex = () => {
    const unreadMessage =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.unReadMsgCount
    this.setState({ unreadMessage: 0, isShowUnreadMessage: true })
    var indexToMove = unreadMessage - 1

    const flatlist =
      this.chatRef._messageContainerRef &&
      this.chatRef._messageContainerRef.current
    if (flatlist == null) {
      return
    }
    flatlist.scrollToIndex({ animated: true, index: indexToMove })
  }

  handleViewableItemsChanged(v) {
    const viewableItems = v.viewableItems
    const unreadMessage =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.unReadMsgCount

    // disable indicator if user reach to unread message index

    if (unreadMessage > viewableItems.length) {
      // disable indicator if user reach to unread message index
      var indexToMove = unreadMessage - 1
      for (var i = 0; i < viewableItems.length; i++) {
        if (
          viewableItems[i].item._id == this.state.messageList[indexToMove]._id
        ) {
          this.setState({ unreadMessage: 0 })
          return
        }
      }
    }
    // check if unread messages length is more than visible item length than show indicator
    if (this.state.isShowUnreadMessage) {
      return
    }

    if (unreadMessage > viewableItems.length) {
      // minus the visible message from total messages

      var leftUnreadMessage = unreadMessage - viewableItems.length

      this.setState({ unreadMessage: leftUnreadMessage })
    } else {
      // don't show indictor, set unread messages to 0
      this.setState({ unreadMessage: 0 })
    }
  }

  chatDidScroll(event) {
    this.setState({ isShowUnreadMessage: true })
  }

  render() {
    const chatMembers =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.chat &&
      this.props.navigation.state.params.chat.members
    const { currentChat } = this.state
    return (
      <MenuProvider>
        <View style={styles.safeView}>
          {this._viewHeader()}
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end'
            }}
          >
            <View style={styles.mainViewContainer}>
              {(this.state.appointMentData &&
                this.state.appointMentData.status) ||
                this.state.bannerText ? (
                  <AppointMent
                    appointMentData={this.state.appointMentData}
                    bannerText={this.state.bannerText}
                  />
                ) : null}

              {this.state.user && this.state.messageList
                ? this.state.unreadMessage > 0 && (
                  <View
                    style={{
                      alignItems: 'center',
                      width: '100%',
                      top:
                        (this.state.appointMentData &&
                          this.state.appointMentData.status) ||
                          this.state.bannerText
                          ? 80
                          : 0,
                      zIndex: 10,
                      position: 'absolute'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.scrollToIndex()}
                      style={styles.unreadMsgBtn}
                      accessible={true}
                      accessibilityLabel='chatMsgUnreadIndicatorBtn'
                    >
                      <MaterialIcons
                        name='keyboard-arrow-up'
                        size={Matrics.ScaleValue(25)}
                        color={'#fff'}
                      />
                      <View style={styles.unreadContainer}>
                        <Text style={styles.unreadCountText}>
                          {this.state.unreadMessage > 99
                            ? `99+`
                            : this.state.unreadMessage}
                        </Text>
                        <Text style={styles.unreadDes}>Unread Messsages</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
                : null}

              {this.state.user && this.state.messageList.length > 0 ? (
                <View style={{ flex: 1 }}>
                  <GiftedChat
                    ref={(ref) => (this.chatRef = ref)}
                    messages={this.state.messageList}
                    listViewProps={{
                      viewabilityConfig: VIEWABILITY_CONFIG,
                      onViewableItemsChanged: this.handleViewableItemsChanged,
                      onScroll: this.chatDidScroll
                    }}
                    renderMessageText={this.renderMessageText}
                    renderMessageVideo={this.renderMessageVideo}
                    renderSystemMessage={this.renderSystemMessage}
                    renderBubble={this.renderBubble}
                    renderTime={this.renderTime}
                    renderSend={this.renderSend}
                    onSend={async (messages) => await this.onSend(messages)}
                    renderComposer={this.renderComposer}
                    renderChatFooter={this.renderChatFooter}
                    renderLoading={() => <ActivityIndicatorModal />}
                    extraData={this.state.selectedReplyMsg}
                    renderTick={(message) => this.renderTicks(message)}
                    isAnimated
                    alwaysShowSend
                    renderAvatar={this.renderAvatar}
                    maxComposerHeight={Matrics.ScaleValue(80)}
                    loadEarlier={this.state.loadEarlier}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                    onLoadEarlier={this.onLoadEarlier}
                    onInputTextChanged={(text) => {
                      text.trim().length > 0 &&
                        this.state.showPrivateChatModal == true &&
                        this.setState({ showPrivateChatModal: false })
                    }}
                    renderActions={() => (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={styles.imagePickStyle}
                          onPress={() => this._urgentAction()}
                        >
                          <Icon
                            name={'ios-warning'}
                            color='red'
                            size={35}
                            style={{
                              borderWidth: 0
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.imagePickStyle}
                          onPress={() => this._imagePickerModal()}
                        >
                          <Icon
                            name={'ios-images'}
                            color='#999'
                            size={35}
                            style={{
                              borderWidth: 0
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    user={{
                      _id: this.state.user.id
                    }}
                    parsePatterns={(linkStyle) => [
                      {
                        pattern: /\bhttps?:\/\/\S+/gi,
                        style: linkStyles,
                        onPress: (props) => Linking.openURL(props)
                      },
                      {
                        pattern: /\bhttp?:\/\/\S+/gi,
                        style: linkStyles,
                        onPress: (props) => Linking.openURL(props)
                      }
                    ]}
                  />
                </View>
              ) : (
                  <Text style={styles.noMessageTextStyle}>
                    {this.state.messageList ? '' : 'No message found'}
                  </Text>
                )}

              {this.state.isImageUploading && <ActivityIndicatorModal />}
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
          {this.state.modalVisible && (
            <View style={styles.typeDropDownRoot}>
              <TouchableOpacity
                style={styles.typeDropDownViews}
                onPress={() => {
                  this.setState({ modalVisible: false })
                  if (
                    this.state.currentChat.subject.indexOf('SPEEDHOME') > -1
                  ) {
                    this.props.navigation.navigate('SystemChatInfo', {})
                  } else {
                    this.props.navigation.navigate('ChatInfo', {
                      users: this.state.currentChat.members,
                      chatCoversationId: this.state.chatCoversationId,
                      specificUserFromMessageLink: false,
                      specificUserFromMessageId: ''
                    })
                  }
                }}
                accessible={true}
                accessibilityLabel='chatMsgProfileBtn'
              >
                <Text style={styles.optionMenuText}>VIEW PROFILE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typeDropDownViews}
                onPress={() => {
                  this.setState({ modalVisible: false })
                  currentChat.pinned
                    ? this.unPinnedConversation()
                    : this.pinnedConversation()
                }}
                accessible={true}
                accessibilityLabel='chatMsgPinUnpinBtn'
              >
                <Text style={styles.optionMenuText}>
                  {currentChat.pinned ? 'UNPIN' : 'PIN'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typeDropDownViews}
                onPress={() => {
                  this.setState({ modalVisible: false })
                  this.archiveConversation()
                }}
                accessible={true}
                accessibilityLabel='chatMsgDeleteBtn'
              >
                <Text style={styles.optionMenuText}>DELETE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeDropDownViews, styles.highlightedOptionBtn]}
                // onPress={this._changeDisplayType('RENT', 1)}
                onPress={() => {
                  this.setState({ modalVisible: false })
                  this.RBSheetRef.open()
                }}
                accessible={true}
                accessibilityLabel='chatMsgReportBtn'
              >
                <Text style={styles.optionMenuText}>REPORT</Text>
              </TouchableOpacity>
            </View>
          )}

          <RBSheet
            ref={(ref) => {
              this.RBSheetRef = ref
            }}
            height={200}
          >
            <View style={styles.RBSheetContainer}>
              <View style={styles.RBSheetHeaderView}>
                <Text style={styles.RBSheetHeaderText}>Reason for Report</Text>
              </View>
              <View style={styles.RBSheetRowView}>
                <TouchableOpacity
                  style={styles.RBSheetRowBtn}
                  onPress={() => {
                    this.reportUser('User is attempting to scam me')
                  }}
                  accessible={true}
                  accessibilityLabel='chatMsgScamBtn'
                >
                  <Text style={styles.RBSheetRowText}>
                    User is attempting to scam me
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.RBSheetRowView}>
                <TouchableOpacity
                  style={styles.RBSheetRowBtn}
                  onPress={() => {
                    this.reportUser('Landlord is asking for deposit')
                  }}
                  accessible={true}
                  accessibilityLabel='chatMsgLandlordReportBtn'
                >
                  <Text style={styles.RBSheetRowText}>
                    Landlord is asking for deposit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </RBSheet>
        </View>
        <Modal
          isVisible={this.state.showPickerModal}
          onBackButtonPress={() => this.setState({ showPickerModal: false })}
          onBackdropPress={() => this.setState({ showPickerModal: false })}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitleText}>Select the perfect view</Text>
            <TouchableOpacity
              onPress={() => this._permissionCheck('takePhoto')}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}> Take Photo... </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this._permissionCheck('pickPhoto')}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>
                Choose Photo from Library...
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this._permissionCheck('takeVideo')}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}> Take Video... </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this._permissionCheck('pickVideo')}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>
                Choose Video from Library...
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ showPickerModal: false })}
              style={styles.modalBtn}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </MenuProvider>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages)
