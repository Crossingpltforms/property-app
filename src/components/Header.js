import React from 'react'
import { View } from 'react-native'
import Color from '../common/styles/color'
import HeaderStyle from '../styles/Header.style'

const Header = props => {
  return (
    <View style={HeaderStyle.header}>
      <StatusBar
        backgroundColor={Color.primary}
        barStyle={
          iosBarStyle
            ? iosBarStyle
            : platformStyle === 'material'
            ? 'light-content'
            : variables.iosStatusbar
        }
        translucent={transparent ? true : translucent}
      />
      <SafeAreaView
        style={{
          backgroundColor: Color.bgColor
        }}
      >
        <View {...props} />
      </SafeAreaView>
    </View>
  )
}

export default Header
