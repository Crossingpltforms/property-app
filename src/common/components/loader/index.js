import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Matrics } from '../../styles'

export const Loader = ({ text }) => {
  return (
    <View style={styles.LoaderContainer}>
      <View style={styles.LoaderWrapper}>
        <ActivityIndicator
          size='large'
          color='black'
          style={{ marginBottom: 5 }}
        />
        <Text style={styles.LoaderText}>{text}</Text>
      </View>
    </View>
  )
}
const styles = {
  LoaderContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1
  },
  LoaderWrapper: {
    width: '25%',
    height: '18%',
    backgroundColor: '#FFE100',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: Matrics.ScaleValue(10)
  },
  LoaderText: {
    color: 'black',
    textAlign: 'center'
  }
}
