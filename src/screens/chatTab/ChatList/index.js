import React, { Component } from 'react'
import { withNavigationFocus } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { subscribe, connectSocket } from '../../../api/socketIo'
import ChatItem from './ChatItem'
import {
  DeviceEventEmitter,
  NativeModules,
  TouchableOpacity
} from 'react-native'
import { checkNotifications } from 'react-native-permissions'
import RNAndroidNotificationPermission from 'react-native-android-notification-permission'
import { SearchBar } from 'react-native-elements'
import PushNotification from 'react-native-push-notification'
import messaging, {
  AuthorizationStatus
} from '@react-native-firebase/messaging'
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Animated,
  Linking,
  Platform,
  AppState
} from 'react-native'
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from 'recyclerlistview'
import {
  CONVERSATION_LIST,
  SESSION_USER,
  TOPIC_USER,
  TOPIC_TOKEN,
  CONVERSATIONS_LIST_SINGLE,
  CONVERSATION_ARCHIVE,
  CONVERSATION_PIN,
  CONVERSATION_UNPIN
} from '../../../api/socket-event'
import * as _ from 'lodash'

const SCREEN_WIDTH = Dimensions.get('window').width

class ChatList extends Component {
  constructor(props) {
    super(props)
    this.currenetView = false
    this.openSettings = this.openSettings.bind(this)
    this.state = {
      searchText: '',
      filteredData: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]),

      socket: null,
      sessionUser: null,
      token: '',

      isSomeoneTypingStatus: false,
      isSomeoneTypingUserId: '',
      conversationList: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
        []
      ),
      convoListEmpty: true,
      NotificationPermisson: false,
      searchValue: '',
      loadMoreConv: false,
      curPage: 0,
      totalPages: 0,

      isLoading: false,
      newDataLoading: false,
      isRefreshing: false,
      flatListReady: false,
      slideUpValue: new Animated.Value(0),
      pushNotificationPermission: true,
      appState: AppState.currentState,

      pinnedMessage: []
    }
    this.layoutProvider = new LayoutProvider(
      i => {
        return (
          this.state.conversationList.getDataForIndex(i) &&
          this.state.conversationList.getDataForIndex(i).type
        )
      },
      (type, dim) => {
        switch (type) {
          case 'NORMAL':
            dim.width = SCREEN_WIDTH
            dim.height = 100
            break
          default:
            dim.width = 0
            dim.height = 0
            break
        }
      }
    )
    Keyboard.dismiss()

    this.currenetView = true
  }

  componentDidMount() {
    //this.props.navigateOption();
    AppState.addEventListener('change', this._handleAppStateChange)
    this.requestPermission()
    if (this.props.token) {
      this.setState(
        {
          token: this.props.token,
          isLoading: true
        },
        () => {
          this.connect(this.state.token)
        }
      )
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props != nextProps) {
      return true
    }
    if (this.state != nextState) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // this.onRefresh();
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.token != this.state.token) {
      this.setState(
        {
          token: this.props.token,
          isLoading: true,
          conversationList: new DataProvider(
            (r1, r2) => r1 !== r2
          ).cloneWithRows([]),
          curPage: 0
        },
        () => {
          this.connect(props.token)
        }
      )
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  async _checkAndroidNotificationPermission() {
    const permissions = await RNAndroidNotificationPermission.checkNoticficationPermission()
    if (!permissions) {
      this.setState({ pushNotificationPermission: false })
    } else {
      this.setState({ pushNotificationPermission: true })
    }
  }
  openSettings() {
    NativeModules.OpenSettings.openNetworkSettings(data => {
      alert(data)
    })
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setTimeout(() => {
        this.requestPermission()
      }, 100)
    }
    this.setState({ appState: nextAppState })
  }

  async requestPermission() {
    if (Platform.OS == 'ios') {
      checkNotifications().then(({ status, settings }) => {
        if (status === 'authorized' || status === 'granted') {
          this.setState({ pushNotificationPermission: true })
        } else {
          this.setState({ pushNotificationPermission: false })
        }
      })
    } else {
      this._checkAndroidNotificationPermission()
    }
  }

  _scrolled() {
    this.setState({ flatListReady: true })
  }
  array_move = (arr, old_index, new_index) => {
    new_index = ((new_index % arr.length) + arr.length) % arr.length
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
    return arr // for testing
  }
  connect = token => {
    const socket = connectSocket(token)
    this.setState({
      isLoading: true,
      socket: socket
    })
    const randomId = 'rand_' + Math.floor(Math.random() * 1000000 + 1)
    socket.on('connect', () => {
      subscribe(socket, TOPIC_TOKEN + randomId)
      socket.on(SESSION_USER, res => {
        const sessionUser = res.data
        this.setState(
          {
            sessionUser: sessionUser
          },
          () => {
            subscribe(
              socket,
              TOPIC_USER + sessionUser.sessionId + '/conversation'
            )
            this.fetchList()
          }
        )
      })

      // causing memory leaks

      // if (this.currenetView) {
      socket.on(CONVERSATIONS_LIST_SINGLE, data => {
        const listToUpdate = data.data
        let conversationList =
          this.state.conversationList &&
          this.state.conversationList._data &&
          this.state.conversationList._data.filter(
            obj => obj.item.id !== listToUpdate.id
          )

        if (conversationList && conversationList !== null) {
          if (this.state.deletedList !== undefined) {
            conversationList = conversationList.unshift({
              type: 'NORMAL',
              item: listToUpdate
            })
            if (this.state.deletedList && this.state.deletedList.length) {
              conversationList = conversationList.filter(
                data1 =>
                  !this.state.deletedList.find(
                    data2 => data2.id === data1.item.id
                  )
              )
            }
            conversationList.sort(function (x, y) {
              return y.dateCreated - x.dateCreated
            })
            this.setState({
              conversationList: new DataProvider(
                (r1, r2) => r1.item.id !== r2.item.id
              ).cloneWithRows(conversationList)
            })
          } else {
            let objIndex = 0
            objIndex = conversationList.findIndex(
              obj => obj.item.id == listToUpdate.id
            )

            // not -1
            if (objIndex !== -1) {
              conversationList[objIndex] = {
                type: 'NORMAL',
                item: listToUpdate
              }
            } else {
              conversationList.push({
                type: 'NORMAL',
                item: listToUpdate
              })
              objIndex = conversationList.findIndex(
                obj => obj.item.id == listToUpdate.id
              )
            }
            const newArray = this.array_move(conversationList, objIndex, 0)
            this.setState({
              conversationList: new DataProvider(
                (r1, r2) => r1 !== r2
              ).cloneWithRows(newArray)
            })
          }
        }
      })
      // }
    })
  }

  archiveConversation = (item, justReload = false) => {
    const { socket } = this.state
    if (item.id && !justReload) {
      socket.emit(CONVERSATION_ARCHIVE, item.id, isArchive => {
        this._updateLogicArchiveConversation(item)
      })
    } else if (item.id && justReload) {
      // skip api call and just update UI ref from chat detail screen
      this._updateLogicArchiveConversation(item)
    }
  }

  _updateLogicArchiveConversation = item => {
    DeviceEventEmitter.emit('readMessage')
    var arr = this.state.conversationList._data
    if (arr && arr.length) {
      arr = arr.filter(data => data.item.id !== item.id)
    }

    if (!this.state.deletedList) {
      this.setState({ deletedList: [{ id: item.id }] })
    } else if (!this.state.deletedList.find(dData => dData.id === item.id)) {
      this.setState({
        deletedList: [...this.state.deletedList, { id: item.id }]
      })
    }

    //arr.splice(index, 1);

    this.setState(
      {
        conversationList: new DataProvider(
          (r1, r2) => r1.item.id !== r2.item.id
        ).cloneWithRows(arr)
      },
      () => {
        this.setState({ deletedList: undefined })
        //his.search(this.state.searchText || '');
      }
    )
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1
      while (k--) {
        arr.push(undefined)
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
    return arr
  }

  pinnedConversation = (id, index) => {
    const { socket } = this.state
    if (id) {
      socket.emit(CONVERSATION_PIN, id, isPinned => {
        var newArr = []
        var arr = this.state.conversationList._data
        arr[index].item.pinned = true
        var pinnedMsg = this.state.pinnedMessage
        pinnedMsg.push(arr[index])
        newArr = this.array_move(
          this.state.conversationList._data,
          index,
          pinnedMsg.length - 1
        )
        this.setState({
          pinnedMessage: pinnedMsg,
          conversationList: new DataProvider(
            (r1, r2) => r1.item.id !== r2.item.id
          ).cloneWithRows(newArr)
        })
      })
    }
  }
  unPinnedConversation = (id, index) => {
    const { socket } = this.state
    if (id) {
      socket.emit(CONVERSATION_UNPIN, id, isUnPinned => {
        var newArr = []
        var arr = this.state.conversationList._data
        arr[index].item.pinned = false
        var pinnedMsg = this.state.pinnedMessage
        let pinnedMsgArrIndex = pinnedMsg.findIndex(data => data.item.id == id)

        if (pinnedMsgArrIndex != -1) {
          pinnedMsg.splice(pinnedMsgArrIndex, 1)
        }
        newArr = this.array_move(
          this.state.conversationList._data,
          index,
          this.state.pinnedMessage.length
        )
        this.setState({
          pinnedMessage: pinnedMsg,
          conversationList: new DataProvider(
            (r1, r2) => r1.item.id !== r2.item.id
          ).cloneWithRows(newArr)
        })
      })
    }
  }

  getIndex(id) {
    for (
      let index = 0;
      index < this.state.conversationList._data.length;
      index++
    ) {
      const element = this.state.conversationList._data[index]

      if (element.item.id === id) {
        return index
      }
    }
    // return this.state.conversationList._data.findIndex(obj => obj.item.id === id);
  }

  getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }
  fetchList = () => {
    const { socket, curPage } = this.state
    socket.emit(CONVERSATION_LIST, curPage, 10, '*')

    if (curPage == 0) {
      this.setState({ conversationList: [] })
    }

    socket.on(CONVERSATION_LIST, list => {
      const data = list.data.content.content
      // console.log('data....', data)
      let dataProviderData = []
      for (let i = 0; i < data.length; i += 1) {
        dataProviderData.push({
          type: 'NORMAL',
          item: data[i]
        })
      }
      if (data) {
        if (this.state.conversationList._data && this.state.curPage > 0) {
          dataProviderData = dataProviderData.filter(
            data =>
              !this.state.conversationList._data.find(
                data1 => data1.item.id === data.item.id
              )
          )
          if (this.state.deletedList && this.state.deletedList.length) {
            dataProviderData = dataProviderData.filter(
              data =>
                !this.state.deletedList.find(data1 => data1.id === data.item.id)
            )
          }
          let concatArray = [
            ...this.state.conversationList._data,
            ...dataProviderData
          ]
          let pinnedMsgArr = concatArray.filter(
            data => data.item.pinned == true
          )
          // const newArray = this.getUniqueListBy(concatArray, 'id')
          this.setState({
            pinnedMessage: pinnedMsgArr,
            conversationList: new DataProvider(
              (r1, r2) => r1.item.id !== r2.item.id
            ).cloneWithRows(concatArray),
            isLoading: false,
            newDataLoading: false
          })
        } else {
          if (this.state.deletedList && this.state.deletedList.length) {
            dataProviderData = dataProviderData.filter(
              data =>
                !this.state.deletedList.find(data1 => data1.id === data.item.id)
            )
          }
          let pinnedMsgArr = dataProviderData.filter(
            data => data.item.pinned == true
          )
          this.setState({
            pinnedMessage: pinnedMsgArr,
            conversationList: new DataProvider(
              (r1, r2) => r1.item.id !== r2.item.id
            ).cloneWithRows(dataProviderData),
            isLoading: false,
            newDataLoading: false
          })
        }
      } else {
        this.setState({
          isLoading: false,
          newDataLoading: false
        })
      }
    })
  }

  renderChatConversation = (chat, index) => {
    let updatedChatList = this.state.conversationList._data.map(res => {
      if (chat.id === res.item.id) {
        res.item.unReadMsgCount = 0
      }
      return res
    })

    const dataProviderData = []
    for (let i = 0; i < updatedChatList.length; i += 1) {
      dataProviderData.push({
        type: 'NORMAL',
        item: updatedChatList[i].item
      })
    }

    this.setState({
      conversationList: new DataProvider(
        (r1, r2) => r1.item.id !== r2.item.id
      ).cloneWithRows(dataProviderData),
      isLoading: false,
      newDataLoading: false
    })
    //clearInterval(this.props.clear);
    PushNotification.removeAllDeliveredNotifications()
    // PushNotification.clearLocalNotification(parseInt(123))
    // PushNotification.cancelLocalNotifications({ id: '123' })
    this.props.navigation.navigate('ChatMessages', {
      chat: chat,
      user: this.state.sessionUser,
      socket: this.state.socket,
      token: this.state.token,
      onGoBack: this.chatDetailActionCallBack, // used this function for pin/unpin & archive function
      itemIndex: index
    })
  }

  chatDetailActionCallBack = data => {
    // Condition to handle pin/unpin
    if (!_.isEmpty(data.pinActionType)) {
      if (data.pinActionType === 'PIN') {
        this.pinnedConversation(data.item.id, data.itemIndex)
      } else if (data.pinActionType === 'UNPIN') {
        this.unPinnedConversation(data.item.id, data.itemIndex)
      }
    }

    // Condition to handle archive
    if (!_.isEmpty(data.action) && data.action === 'delete') {
      this.archiveConversation(data.item, true)
    }
  }

  renderFooter = () => {
    if (!this.state.newDataLoading) return null
    return <ActivityIndicator animating size='large' />
  }

  loadMore = () => {
    const { curPage } = this.state
    this.setState(
      {
        curPage: curPage + 1,
        newDataLoading: true
      },
      () => {
        this.fetchList()
      }
    )
    // you can now load more data here from your backend
  }
  rowRenderer = (type, data, index) => {
    return (
      data.item && (
        <ChatItem
          key={data.item.id + 'chat'}
          chat={{ ...data.item }}
          renderMessages={item => {
            this.renderChatConversation(item, index)
          }}
          deleteChat={item => {
            this.archiveConversation(item)
          }}
          onPinnedIconClicked={item => {
            if (item) {
              if (item.pinned == false) this.pinnedConversation(item.id, index)
              else this.unPinnedConversation(item.id, index)
            }
          }}
        />
      )
    )
  }

  _start = () => {
    Animated.timing(this.state.slideUpValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start()
  }
  displayNotificationBanner() {
    this._start()
    return (
      <Animated.View
        style={{
          height: 40,
          transform: [
            {
              translateX: this.state.slideUpValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
                // outputRange: [-600, 0]
              })
            }
          ],
          backgroundColor: '#0F77C6',
          width: SCREEN_WIDTH,
          justifyContent: 'center'
        }}
      >
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => {
            Platform.OS == 'ios'
              ? Linking.openURL('app-settings:')
              : this.openSettings()
          }}
          accessible={true}
          accessibilityLabel='chatListNotiOffOnBtn'
        >
          <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>
            Notifications are currently off. Tap to turn on.
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  search = searchText => {
    let filteredData =
      this.state.conversationList &&
      this.state.conversationList._data &&
      this.state.conversationList._data.filter(function (item) {
        return item.item.subject
          .toLowerCase()
          .includes(searchText.toLowerCase())
      })

    this.setState({
      filteredData: new DataProvider(
        (r1, r2) => r1.item.id !== r2.item.id
      ).cloneWithRows(filteredData),
      searchText: searchText
    })
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        {!this.state.pushNotificationPermission &&
          this.displayNotificationBanner()}

        <SearchBar
          round={true}
          lightTheme={true}
          placeholder='Search...'
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={this.search}
          value={this.state.searchText}
        />

        {this.state.sessionUser ? (
          <>
            {this.state.isLoading ? (
              <ActivityIndicator
                style={{
                  flex: 1
                }}
                size='large'
                color='#0000ff'
              />
            ) : this.state.conversationList._data &&
              this.state.conversationList._data.length > 0 ? (
                  <RecyclerListView
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1 }}
                    // dataProvider={(this.state.filteredData && this.state.filteredData._data.length > 0) ? this.state.filteredData : this.state.conversationList}
                    dataProvider={
                      this.state.searchText !== ''
                        ? this.state.filteredData
                        : this.state.conversationList
                    }
                    layoutProvider={this.layoutProvider}
                    rowRenderer={(type, data, index) =>
                      this.rowRenderer(type, data, index)
                    }
                    extendedState={this.state}
                    // rowRenderer={this.rowRenderer()}
                    onEndReached={() => this.loadMore()}
                    onEndReachedThreshold={1}
                    renderFooter={this.renderFooter}
                  />
                ) : (
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Icon
                      name='ios-chatbubbles'
                      type='ionicon'
                      color='#dddddd'
                      size={60}
                    />
                    <Text
                      style={{
                        color: '#dddddd',
                        fontSize: 15,
                        marginTop: 10
                      }}
                    >
                      No chats yet
                </Text>
                  </View>
                )}
          </>
        ) : (
            <ActivityIndicator
              style={{
                flex: 1
              }}
              size='large'
              color='#0000ff'
            />
          )}
      </View>
    )
  }
}

export default withNavigationFocus(ChatList)
