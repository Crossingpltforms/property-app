import React from 'react'
import { View, Text } from 'react-native'
import { getLongDate } from '../../common/helper'
import { Matrics } from '../../common/styles'

const DetailsAvailability = props => {
  const { ExtrainfoStyle, propertyInfo } = props
  return (
    <View
      style={[
        ExtrainfoStyle.furnishingView,
        { alignItems: 'flex-start', paddingLeft: 10, marginTop: 20 }
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'left',
            fontWeight: '600',
            color: '#000',
            fontFamily: 'OpenSans-SemiBold'
          }}
        >
          Availability :
        </Text>
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          {getLongDate(
            propertyInfo.availability.substr(
              0,
              propertyInfo.availability.indexOf('T')
            )
          )}
        </Text>
      </View>

      <View
        style={{ flexDirection: 'row', marginVertical: Matrics.ScaleValue(5) }}
      >
        <Text
          style={{
            fontSize: 14,
            textAlign: 'left',
            fontWeight: '600',
            color: '#000',
            fontFamily: 'OpenSans-SemiBold'
          }}
        >
          Last Update :
        </Text>
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          {getLongDate(
            propertyInfo.lastUpdated.substr(
              0,
              propertyInfo.lastUpdated.indexOf('T')
            )
          )}
        </Text>
      </View>
    </View>
  )
}

export default DetailsAvailability
