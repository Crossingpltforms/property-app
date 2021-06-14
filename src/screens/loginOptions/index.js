import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { Button } from '../../common/components'
import { Images, Color } from '../../common/styles'

export default class LoginOptions extends Component {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Number', {
                screenName: 'LoginOptions',
              })
            }
            style={styles.backTouch}
            accessible={true}
            accessibilityLabel='loginBtn'
          >
            <Image testID='back' source={Images.back} />
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText}>Login</Text>

        <Text style={styles.descText}>
          You can choose to login using email or phone number.
        </Text>

        <View style={styles.btnView}>
          <Button
            label='Phone No'
            color={Color.black}
            bgColor={Color.white}
            customStyle={styles.btn1Styles}
            onPress={() =>
              this.props.navigation.navigate('Number', { screenName: 'Home' })
            }
            accessible={true}
            accessibilityLabel='loginNormalPhoneBtn'
          />
          <Button
            label='Email'
            customStyle={styles.btn2Styles}
            color={Color.black}
            // onPress={() => this.props.navigation.navigate("Email")}
            accessible={true}
            accessibilityLabel='loginNormalEmailBtn'
          />
        </View>
      </View>
    )
  }
}
