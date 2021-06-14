import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

const DetailsLoader = props => {
  const { ExtrainfoStyle, isLoading } = props
  return (
    <View style={ExtrainfoStyle.LoaderContainer}>
      <View style={ExtrainfoStyle.LoaderWrapper}>
        <ActivityIndicator
          animating={isLoading}
          size='large'
          color='black'
          style={{ marginBottom: 5 }}
        />
        <Text style={ExtrainfoStyle.LoaderText}>Loading...</Text>
      </View>
    </View>
  )
}

export default DetailsLoader
