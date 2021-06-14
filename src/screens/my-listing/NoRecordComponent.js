import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './styles'
import imgNoData from '../../../Images/UI/empty.png'

const NoRecordComponent = props => {
  return (
    <View
      style={{
        justifyContent: 'center',
        height: props.height / 2,
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1
      }}
    >
      <Image
        testID="noData"
        source={imgNoData}
        style={{
          height: props.height ? props.height : 100,
          width: props.width ? props.width : 100
        }}
      />
      <Text
        style={[
          styles.text1,
          {
            fontSize: 18,
            fontFamily: 'OpenSans-SemiBold',
            marginTop: 10
          }
        ]}
      >
        No records
      </Text>
    </View>
  )
}

export default NoRecordComponent
