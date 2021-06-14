import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'
import { Matrics } from '../../common/styles'

const { height } = Dimensions.get('window')

export default class ReferTermsCondition extends Component {
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
            accessibilityLabel='referTermsBtn'
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
              Tearms and Conditions
            </Text>
          </View>
        </View>

        <View style={{ margin: 20, flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  fontSize: Matrics.ScaleValue(13),
                },
              ]}
            >
              We’d love for you to share{' '}
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Bold',
                    paddingTop: 0,
                    fontSize: Matrics.ScaleValue(13),
                  },
                ]}
              >
                SPEED
              </Text>
              HOME's greatness with your friends and, if you do so, we will
              reward you both if your friend signs their agreement with their
              tenant on our{' '}
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Bold',
                    paddingTop: 0,
                    fontSize: Matrics.ScaleValue(13),
                  },
                ]}
              >
                SPEED
              </Text>
              SIGN. When you enter your email address on our referral page, we
              will send you an email containing a unique referral link, which
              you can then share with your friends.
            </Text>

            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  fontSize: Matrics.ScaleValue(13),
                },
              ]}
            >
              If your friend clicks your unique link, uploads their property and
              successfully rent it out with{' '}
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Bold',
                    paddingTop: 0,
                    fontSize: Matrics.ScaleValue(13),
                  },
                ]}
              >
                SPEED
              </Text>
              HOME, we will be in contact with you and then transfer your reward
              in 7 working days. Your friend will receive RM100 discount on
              their Insurance fees.
            </Text>

            <Text
              style={[
                styles.descriptionTitle,
                {
                  fontFamily: 'OpenSans-Regular',
                  fontSize: Matrics.ScaleValue(13),
                },
              ]}
            >
              Note that completion can take a few months, so there will be a
              delay between sending the referral link and receiving the referral
              bonus. The following terms apply:
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: height * 0.03,
              }}
            >
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#000',
                }}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(13),
                    paddingTop: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                The referral scheme only applies to new customers.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: height * 0.03,
              }}
            >
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#000',
                }}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(13),
                    paddingTop: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                The new customer must sign up to find or rent out their property
                with{' '}
                <Text
                  style={[
                    styles.descriptionTitle,
                    {
                      fontFamily: 'OpenSans-Bold',
                      paddingTop: 0,
                      fontSize: Matrics.ScaleValue(13),
                    },
                  ]}
                >
                  SPEED
                </Text>
                HOME within six months
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: height * 0.03,
              }}
            >
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#000',
                }}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(13),
                    paddingTop: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                Referral codes may not be sent out as spam, commercialised,
                posted on the internet, advertised, mass distributed or sold.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: height * 0.03,
              }}
            >
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#000',
                }}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(13),
                    paddingTop: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                You cannot refer yourself or your immediate family.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: height * 0.03,
              }}
            >
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#000',
                }}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(13),
                    paddingTop: 0,
                    marginLeft: 10,
                  },
                ]}
              >
                We reserve the right to withhold payments of the referral reward
                in our sole discretion if we deem there has been a misuse of the
                referral programme.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
