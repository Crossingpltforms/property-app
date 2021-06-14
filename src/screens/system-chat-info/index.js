import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native'
import Container from '../../components/Container'
import styles from './styles'
import { Matrics } from '../../common/styles'
import { Icon } from 'react-native-elements'

import logo from '../../../Images/alicia.png'

export default class SystemChatInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader () {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          paddingVertical: 10,
          justifyContent: 'center'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this._navigationBack()}
            style={{ alignItems: 'center', flexDirection: 'row' }}
            accessible={true}
            accessibilityLabel='sysChatInfoBackBtn'
          >
            <Icon name='keyboard-arrow-left' size={35} />
            <Text
              style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _viewInfo () {
    return (
      <ScrollView
        style={{ marginHorizontal: 20, marginTop: 20, flexDirection: 'column' }}
      >
        <View style={{ paddingBottom: 50 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              testID='profileImg'
              source={logo}
              style={styles.profileImg}
            />

            <View
              style={{
                flexDirection: 'column',
                paddingLeft: Matrics.ScaleValue(10)
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: 'grey',
                  borderRadius: 10,
                  width: Matrics.ScaleValue(100),
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingBottom: 2,
                  paddingTop: 2
                }}
              >
                <Text
                  style={[
                    styles.TextStyleHeaderTag,
                    {
                      fontSize: Matrics.ScaleValue(12),
                      color: 'white',
                      fontFamily: 'OpenSans-Bold'
                    }
                  ]}
                >
                  SUPPORT
                </Text>
              </View>
              <Text style={[styles.TextStyleHeaderTag, {}]}>Alicia</Text>
            </View>
          </View>

          <Text
            style={[
              styles.TextStyleHeaderTag,
              {
                marginTop: 25,
                fontFamily: 'OpenSans-Bold',
                fontSize: Matrics.ScaleValue(18)
              }
            ]}
          >
            Contact detail
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text
              style={[
                styles.TextStyleHeaderTag,
                {
                  fontSize: Matrics.ScaleValue(13),
                  fontFamily: 'OpenSans-SemiBold'
                }
              ]}
            >
              Email
            </Text>
            <TouchableOpacity
              style={{ marginLeft: Matrics.ScaleValue(60) }}
              onPress={() => Linking.openURL('mailto:hello@speedhome.com')}
              accessible={true}
              accessibilityLabel='sysChatInfomailBtn'
            >
              <Text
                style={[
                  styles.TextStyleHeaderTag,
                  { fontSize: Matrics.ScaleValue(13) }
                ]}
              >
                hello@speedhome.com
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text
              style={[
                styles.TextStyleHeaderTag,
                {
                  fontSize: Matrics.ScaleValue(13),
                  fontFamily: 'OpenSans-SemiBold'
                }
              ]}
            >
              Phone
            </Text>
            <TouchableOpacity
              style={{ marginLeft: Matrics.ScaleValue(60) }}
              onPress={() => Linking.openURL('tel:6018 7777 650')}
              accessible={true}
              accessibilityLabel='sysChatInfoTelBtn'
            >
              <Text
                style={[
                  styles.TextStyleHeaderTag,
                  { fontSize: Matrics.ScaleValue(13) }
                ]}
              >
                +6018 7777 650
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }

  render () {
    return (
      <View style={styles.header}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {this._viewHeader()}

          {this._viewInfo()}
        </View>
      </View>
    )
  }
}
