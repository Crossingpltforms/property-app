import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Matrics } from '../../common/styles'

const DetailsDesc = props => {
  const { ExtrainfoStyle, description } = props
  return (
    <View style={[ExtrainfoStyle.furnishingView, styles.mainContainer]}>
      <Text style={styles.labelTextStyle}>Description</Text>
      <Text
        style={[ExtrainfoStyle.PropertyInfoViewTabLabel, styles.descTextStyle]}
      >
        {description}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginVertical: Matrics.ScaleValue(10)
  },
  labelTextStyle: {
    fontSize: 15,
    textAlign: 'left',
    fontWeight: '600',
    color: '#000',
    fontFamily: 'OpenSans-SemiBold'
  },
  descTextStyle: {
    marginTop: Matrics.ScaleValue(10),
    marginLeft: 0,
    fontFamily: 'OpenSans-Regular'
  }
})

export default DetailsDesc
