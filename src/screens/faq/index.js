import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'

export default class FAQ extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleBackButton = () => {
    this._navigationBack()
    return true
  }

  _navigationBack = () => this.props.navigation.goBack()

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  _navigationBack = () => this.props.navigation.goBack()

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
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='faqLeftBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
          </TouchableOpacity>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flex: 1,
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                marginLeft: -35,
              }}
            >
              Refer
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.header}>
        {this._viewHeader()}

        <View style={{ width: '100%', marginHorizontal: 20 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: 20,
            }}
          >
            <Text
              style={[
                styles.descriptionTitle,
                { fontFamily: 'OpenSans-SemiBold', fontSize: 18 },
              ]}
            >
              Frequantly Asked Questions
            </Text>
          </View>
        </View>

        <View style={{ margin: 20, flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text
              style={[
                styles.descriptionTitle,
                { fontFamily: 'OpenSans-SemiBold', fontSize: 13 },
              ]}
            >
              How many people can I invite with the link?
            </Text>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  paddingTop: 0,
                  fontSize: 13,
                  color: 'grey',
                },
              ]}
            >
              You can invite as many people as you want!
            </Text>

            <Text
              style={[
                styles.descriptionTitle,
                { fontFamily: 'OpenSans-SemiBold', fontSize: 13 },
              ]}
            >
              How do I redeem my RM100? When will I get my RM100?
            </Text>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  paddingTop: 0,
                  fontSize: 13,
                  color: 'grey',
                },
              ]}
            >
              You will be able to redeem your RM100 once your friend reaches the
              stage of signing the tenancy agreement and has bought the
              insurance premium, the referral amount of RM 100 will be credited
              to your bank account within 7 working days.
            </Text>

            <Text
              style={[
                styles.descriptionTitle,
                { fontFamily: 'OpenSans-SemiBold', fontSize: 13 },
              ]}
            >
              Is there a limit to how many times I can get RM100?
            </Text>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  paddingTop: 0,
                  fontSize: 13,
                  color: 'grey',
                },
              ]}
            >
              No, there isn’t. {'\n'}The more people/friends you get to post
              property + find a tenant with us, the more RM100 you can claim!{' '}
              {'\n'}
              {'\n'}For example, if you successfully invited 5 people to post on
              our platform and all 5 of them found tenants with us, you will get
              RM500.
            </Text>

            <Text
              style={[
                styles.descriptionTitle,
                { fontFamily: 'OpenSans-SemiBold', fontSize: 13 },
              ]}
            >
              What incentive will my friends receive?
            </Text>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  paddingTop: 0,
                  fontSize: 13,
                  color: 'grey',
                },
              ]}
            >
              Your friends will receive a discount of RM100 reward on their
              insurance premium when they have successfully rented with{' '}
              <Text
                style={[
                  styles.descriptionTitle,
                  { fontFamily: 'OpenSans-Bold', paddingTop: 0, fontSize: 13 },
                ]}
              >
                SPEED
              </Text>
              HOME Tenant through{' '}
              <Text
                style={[
                  styles.descriptionTitle,
                  { fontFamily: 'OpenSans-Bold', paddingTop: 0, fontSize: 13 },
                ]}
              >
                SPEED
              </Text>
              SIGN.
            </Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}
