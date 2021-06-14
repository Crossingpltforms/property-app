import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

const Container = props => {
  return (
    <View style={[{ flex: 1 }, props.style]}>
      {props.children}
    </View>
  )
}

export default Container
