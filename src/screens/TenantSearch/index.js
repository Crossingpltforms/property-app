import React, { Component } from 'react'
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  BackHandler,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Container from '../../components/Container'
import { NavigationActions } from 'react-navigation'
import { Icon } from 'react-native-elements'
import _ from 'lodash'

import APICaller from '../../util/apiCaller'
import Http from '../../api/http'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

import TenantChatRequest from './TenantChatRequest'
import TenantChatRequestSuccess from './TenantChatRequestSuccess'
import { No_IMAGE_LINK } from '../../common/constants'

class TenantSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchList: [],
      latitude:
        (props.navigation.state.params &&
          props.navigation.state.params.latitude) ||
        0,
      longitude:
        (props.navigation.state.params &&
          props.navigation.state.params.longitude) ||
        0,
      propertyId:
        (props.navigation.state.params &&
          props.navigation.state.params.propertyId) ||
        0,
      infoData: null,
      showTenants: false,
      tenantChatRequestModalVisible: false,
      tenantChatRequestSuccessModalVisible: false
    }
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentDidMount () {
    this.getTenantSearchList()
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.navigation.state.params &&
      (prevState.latitude !== this.props.navigation.state.params.latitude ||
        prevState.longitude !== this.props.navigation.state.params.longitude ||
        prevState.propertyId !== this.props.navigation.state.params.propertyId)
    ) {
      this.setState(
        {
          latitude:
            (this.props.navigation.state.params &&
              this.props.navigation.state.params.latitude) ||
            0,
          longitude:
            (this.props.navigation.state.params &&
              this.props.navigation.state.params.longitude) ||
            0,
          propertyId:
            (this.props.navigation.state.params &&
              this.props.navigation.state.params.propertyId) ||
            0
        },
        () => {
          this.getTenantSearchList()
        }
      )
    }
  }

  navigationBack = () => {
    this.props.navigation.goBack()
  }

  getTenantSearchList = () => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        lat:
          (this.props.navigation.state.params &&
            this.props.navigation.state.params.latitude) ||
          0,
        lng:
          (this.props.navigation.state.params &&
            this.props.navigation.state.params.longitude) ||
          0
      }

      APICaller(
        Http.tenantSearchListEndPoint,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then(json => {
        if (json.status === 200) {
          this.setState({
            searchList: json.data,
            showTenants: true
          })
        }
      })
    }
  }

  viewHeader = () => {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this.navigationBack()}
              accessible={true}
              accessibilityLabel='tenantSearchBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Search Tenant
            </Text>
          </View>
        </View>
      </View>
    )
  }

  displayInfo = () => {
    if (this.state.showTenants) {
      if (this.state.searchList && this.state.searchList.length > 0) {
        return (
          <FlatList
            data={this.state.searchList}
            keyExtractor={item => Math.random().toString(2)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ infoData: item }, () =>
                    this.toggleModal('tenantChatRequestModalVisible', true)
                  )
                }}
                style={{
                  backgroundColor: 'white',
                  height: 80,
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
                accessible={true}
                accessibilityLabel='tenantSearchChatModalBtn'
              >
                <Image
                  testID='tenantAvatar'
                  source={{
                    uri:
                      item.tenant && item.tenant.avatar
                        ? item.tenant.avatar
                        : No_IMAGE_LINK
                  }}
                  style={{
                    height: 60,
                    width: 60,
                    marginLeft: 10,
                    backgroundColor: '#cccccc',
                    borderRadius: 30
                  }}
                />

                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'flex-start'
                  }}
                >
                  <View
                    style={{ flex: 1, flexDirection: 'row', maxHeight: 30 }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{
                        flex: 1,
                        fontSize: 14,
                        textAlign: 'left',
                        paddingLeft: 10,
                        paddingTop: 5,
                        fontWeight: '500',
                        color: '#000'
                      }}
                    >
                      {item.tenant.name || ''}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: 'left',
                        paddingLeft: 10,
                        fontWeight: '500',
                        color: '#000'
                      }}
                    >
                      {item.budget ? `RM ${item.budget}` : ''}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      } else {
        return (
          <View
            style={{
              height: height,
              width: width,
              padding: 10
            }}
          >
            <Text
              style={{
                fontWeight: 'bold'
              }}
            >
              No tenant found
            </Text>
          </View>
        )
      }
    } else {
      return (
        <View>
          <ActivityIndicator
            animating={!this.state.isLoading}
            size='large'
            color='black'
            style={{ marginBottom: 5 }}
          />
        </View>
      )
    }
  }

  toggleModal = (modal, value) => {
    this.setState({ [modal]: value })
  }

  chatRequestConfirm = () => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        chatRequestID:
          (this.state.infoData.chatRequestId &&
            this.state.infoData.chatRequestId) ||
          0,
        propertyID: this.state.propertyId || 0
      }

      APICaller(
        Http.tenantSearchChatRequestEndPoint,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then(json => {
        if (json.status !== 200) {
          Alert.alert(
            '',
            json.data.message,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          )
        } else if (json.status === 200) {
          this.toggleModal('tenantChatRequestSuccessModalVisible', true)
        }
      })
    }
  }

  handleGotoChat = () => {
    this.props.navigation.navigate({
      routeName: 'Tab',
      params: {},
      action: NavigationActions.navigate({ routeName: 'ChatTab' })
    })
  }

  render () {
    return (
      <Container>
        {this.viewHeader()}
        {this.displayInfo()}

        <TenantChatRequest
          modalVisible={this.state.tenantChatRequestModalVisible}
          toggleModal={value => {
            this.toggleModal('tenantChatRequestModalVisible', value)
          }}
          tenant={(this.state.infoData && this.state.infoData.tenant) || {}}
          budget={(this.state.infoData && this.state.infoData.budget) || 0}
          handleConfirm={() => {
            this.chatRequestConfirm()
          }}
        />

        <TenantChatRequestSuccess
          modalVisible={this.state.tenantChatRequestSuccessModalVisible}
          toggleModal={value => {
            this.toggleModal('tenantChatRequestSuccessModalVisible', value)
          }}
          tenant={(this.state.infoData && this.state.infoData.tenant) || {}}
          handleGotoChat={() => {
            this.handleGotoChat()
          }}
        />
      </Container>
    )
  }
}

function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TenantSearch)
