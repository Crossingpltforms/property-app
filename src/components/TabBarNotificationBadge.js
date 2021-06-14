import React, { Component } from 'react'
import { View, Text, DeviceEventEmitter } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Http from '../api/http'
import APICaller from '../util/apiCaller'

class NotificationBadge extends Component {
  constructor (props) {
    super(props)
    ;(this.state = {
      unreadMessage: 0
    }),
      //---- Trigger event when read message -----//
      (this.litsner = DeviceEventEmitter.addListener('readMessage', data => {
        this.renderUnreadChatCountApi()
      }))
  }
  componentDidMount () {
    AsyncStorage.getItem('accountInfo').then(res => {
      if (res) {
        this.renderUnreadChatCountApiCall()
      }
    })
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      if (this.props.isUserLogin !== nextProps.isUserLogin) {
        this.renderUnreadChatCountApi(nextProps)
      }
      return true
    }
    return false
  }
  componentWillUnmount () {
    DeviceEventEmitter.removeListener('readMessage')
  }
  renderUnreadChatCountApi = nextProps => {
    if (
      (this.props &&
        this.props.isUserLogin &&
        this.props.isUserLogin == true) ||
      (nextProps && nextProps.isUserLogin && nextProps.isUserLogin == true)
    ) {
      APICaller(Http.getTotalUnreadChatNumber(), 'GET', null, '').then(
        response => {
          if (response.status === 200) {
            this.setState({
              unreadMessage: response.data
            })
          } else {
            this.setState({
              unreadMessage: 0
            })
          }
        }
      )
    }
  }
  renderUnreadChatCountApiCall = () => {
    APICaller(Http.getTotalUnreadChatNumber(), 'GET', null, '').then(
      response => {
        if (response.status === 200) {
          this.setState({
            unreadMessage: response.data
          })
        } else {
          this.setState({
            unreadMessage: 0
          })
        }
      }
    )
  }
  //   return null
  render () {
    if (!parseInt(this.state.unreadMessage) > 0) {
      return null
    }

    return (
      <View
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: '#4885ed',
          height: 20,
          width: 20,
          borderRadius: 20 / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {}
        <Text
          style={{
            fontSize: 8,
            color: '#fff'
          }}
        >
          {parseInt(this.state.unreadMessage) > 99
            ? '99+'
            : this.state.unreadMessage}
        </Text>
      </View>
    )
  }
}

function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBadge)
