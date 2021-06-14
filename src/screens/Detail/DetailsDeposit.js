import React from 'react'
import { View, Text, Image } from 'react-native'
import CalculationForRoom from './CalculationForRoom'
import CalculationForOther from './CalculationForOther'
import PropertyApprovalStatus from '../../common/components/propertyStatus'

const DetailsDeposit = props => {
  const { ExtrainfoStyle, isSale, propertyInfo, calculatePrice, format } = props

  const _viewNoCommission = () => {
    return (
      <View style={ExtrainfoStyle.noCommisionWrapperStyle}>
        <Text
          style={[ExtrainfoStyle.noCommisionBoldTextStyle, { marginBottom: 5 }]}
        >
          ZERO COMMISSION
        </Text>
        <Text style={ExtrainfoStyle.noCommisionNormalTextStyle}>
          Deal Directly with Owner
        </Text>
      </View>
    )
  }

  if (!isSale) {
    if (
      propertyInfo != undefined &&
      propertyInfo.noDeposit != undefined &&
      propertyInfo.noDeposit === true
    ) {
      if (propertyInfo.type === 'ROOM') {
        return (
          <CalculationForOther
            ExtrainfoStyle={ExtrainfoStyle}
            calculatePrice={calculatePrice}
            propertyInfo={propertyInfo}
            format={format}
          />
          // <>
          //   <PropertyApprovalStatus
          //     propertyInfo={propertyInfo}
          //     currentPage={{ pageName: 'LISTING_DETAILS_ROOM' }}
          //   />
          //   <CalculationForRoom
          //     ExtrainfoStyle={ExtrainfoStyle}
          //     calculatePrice={calculatePrice}
          //     propertyInfo={propertyInfo}
          //   />
          // </>
        )
      } else {
        return (
          <CalculationForOther
            ExtrainfoStyle={ExtrainfoStyle}
            calculatePrice={calculatePrice}
            propertyInfo={propertyInfo}
            format={format}
          />
        )
      }
    } else {
      return null
    }
  } else {
    return _viewNoCommission()
  }
}

export default DetailsDeposit
