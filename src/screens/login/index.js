import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import styles from './styles'
import { Images, Color } from '../../common/styles'
import { Button } from '../../common/components'
import { Matrics } from '../../common/styles'
import { setLoginUserData } from '../../store/actions'

class Login extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFE100' }}>
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <View style={styles.headerview}>
            <View style={styles.imageBgView}>
              <Image
                testID='welcomeHome'
                source={Images.welcomeHome}
                style={styles.bgImageStyle}
              />
            </View>
          </View>
          <View style={[styles.titleMainView, { flexDirection: 'column' }]}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  styles.welcomeText,
                  {
                    fontFamily: 'OpenSans-Bold',
                    fontSize: Matrics.ScaleValue(25),
                  },
                ]}
              >
                SPEED
              </Text>
              <Text
                style={[
                  styles.welcomeText,
                  {
                    fontFamily: 'OpenSans-Regular',
                    fontSize: Matrics.ScaleValue(25),
                  },
                ]}
              >
                HOME
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <View style={styles.viewLoginOptions}>
            <Button
              label='Login'
              bgColor={'#00D392'}
              color={Color.white}
              onPress={() =>
                this.props.navigation.navigate('Number', { screenName: 'Home' })
              }
              accessible={true}
              accessibilityLabel='loginNormalBtn'
            />
            <TouchableOpacity
              style={{
                flexDirection: 'column',
                padding: Matrics.ScaleValue(10),
              }}
              onPress={() => {
                AsyncStorage.removeItem('accountInfo')
                this.props.setLoginUserData(null)
                this.props.navigation.navigate('Home')
              }}
              accessible={true}
              accessibilityLabel='loginLaterBtn'
            >
              <Text
                style={[styles.bytapText, { fontSize: Matrics.ScaleValue(14) }]}
              >
                Login Later
              </Text>
              <View style={{ backgroundColor: '#000', height: 0.5 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.viewBytap}>
            <Text style={styles.bytapText}>
              By tapping Login, Create Account or Skip, I agree to SPEEDHOME
              Terms of Service, Payments Terms of Service, Privacy Policy, and
              No discrimination Policy.
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setLoginUserData }, dispatch),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
