import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import ChatList from './ChatList/index';

class ChatTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      token: null,
      isLoading: false,
      conversationList: null,
    };
    this.socket = {};
  }

  _userFunctionNav() {
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    ) {
      const {user, chat, token, socket} = this.props.navigation.state.params;
      if (user !== undefined) {
        this.props.navigation.navigate('ChatMessages', {
          chat: chat,
          user: user,
          socket: socket,
          token: token,
        });
      } else {
        return <View />;
      }
    } else {
      return <View />;
    }
  }

  componentDidMount() {
    if (this.props.isUserLogin && this.props.isUserLogin == true) {
      let data = this.props.userLoginData;
      this.setState({
        userId: data.userId,
        token: data.token,
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this._userFunctionNav);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      this.setState({isLoading: true});
      if (nextProps && nextProps.isUserLogin && nextProps.isUserLogin == true) {
        let data = nextProps.userLoginData;
        this.setState({
          userId: data.userId,
          token: data.token,
        });
      } else {
        this.props.navigation.navigate('Login');
      }
      return true;
    }
    if (this.state != nextState) {
      return true;
    }
    return false;
  }

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'black',
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: {width: 0, height: 2},
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10,
              }}>
              Chat
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const token = this.state.token;
    return (
      <View style={styles.safeView}>
        {this._userFunctionNav()}
        {this._viewHeader()}
        {token ? (
          <ChatList
            token={token}
            //navigateOption={this._checkTheNavFromChatMessage}
            clear={this._userFunctionNav}
          />
        ) : null}
      </View>
    );
  }
}
function mapStateToProps({loginData}) {
  const {isUserLogin, userLoginData} = loginData;
  return {
    isUserLogin,
    userLoginData,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatTab);
