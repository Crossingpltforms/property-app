import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'
import { Matrics, Color } from '../../common/styles'
import PropertyApprovalStatus from '../../common/components/propertyStatus'

const { width } = Dimensions.get('window')

const CalculationForOther = props => {
  const { ExtrainfoStyle, propertyInfo, calculatePrice, format } = props
  const SPEEDSIGN_Fee = 399
  const totalPrice =
    1 * calculatePrice(propertyInfo.price) + SPEEDSIGN_Fee * 1.06
  return (
    <View style={styles.mainViewContainer}>
      <PropertyApprovalStatus
        propertyInfo={propertyInfo}
        currentPage={{ pageName: 'LISTING_DETAILS' }}
      />
      <Text style={[ExtrainfoStyle.imgTextBody, { paddingBottom: 5 }]}>
        To Move In :
      </Text>
      <View style={styles.rowViewStyle}>
        <Text style={styles.rowTextStyle}>1 st month rental</Text>
        <Text style={styles.rowPriceTextStyle}>
          RM {parseFloat(calculatePrice(propertyInfo.price)).toFixed(2)}
        </Text>
      </View>
      <View style={styles.rowViewStyle}>
        <Text style={styles.rowTextStyle}>SPEEDSIGN Fee</Text>
        <Text style={styles.rowPriceTextStyle}>
          RM {parseFloat(SPEEDSIGN_Fee).toFixed(2)}
        </Text>
      </View>
      <View style={styles.rowViewStyle}>
        <Text style={styles.rowTextStyle}>6% SST</Text>
        <Text style={styles.rowPriceTextStyle}>
          RM {parseFloat(SPEEDSIGN_Fee * 0.06).toFixed(2)}
        </Text>
      </View>
      <View style={styles.dashedSepratorStyle} />
      <View style={styles.rowViewStyle}>
        <Text style={styles.rowTextStyle}>Total</Text>
        <Text style={styles.rowPriceTextStyle}>
          {`RM ${format(totalPrice)}`}
          {/* RM {parseFloat(format(totalPrice)).toFixed(2)} */}
        </Text>
      </View>
    </View>
    // <View
    //   style={{
    //     backgroundColor: '#f3e1ff',
    //     height: 100,
    //     width: '100%',
    //     alignItems: 'center',
    //     justifyContent: 'center'
    //   }}
    // >
    //   <View
    //     style={{
    //       width: width * 0.8,
    //       justifyContent: 'center',
    //       flexDirection: 'row',
    //       alignItems: 'center'
    //     }}
    //   >
    //     <View style={{ flexDirection: 'column', marginRight: 50 }}>
    //       <Text style={[ExtrainfoStyle.imgTextBody, { paddingBottom: 5 }]}>
    //         To Move In :
    //       </Text>
    //       <Text>
    //         <Text style={ExtrainfoStyle.imgTextBody}>
    //           {`RM ${format(totalPrice)}`}{' '}
    //         </Text>
    //         <Text
    //           style={[
    //             ExtrainfoStyle.imgTextTiny,
    //             { paddingLeft: 5, fontSize: 15, fontFamily: 'OpenSans-Light' }
    //           ]}
    //         >
    //           {' '}
    //           {`(1st month ${calculatePrice(
    //             propertyInfo.price
    //           )} + Tenancy agreement fee 399 + 6%SST)`}
    //         </Text>
    //       </Text>
    //     </View>
    //   </View>
    // </View>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    paddingHorizontal: Matrics.ScaleValue(20),
    paddingVertical: Matrics.ScaleValue(10)
  },
  rowViewStyle: {
    flexDirection: 'row',
    paddingVertical: Matrics.ScaleValue(1)
  },
  rowTextStyle: { flex: 1, fontSize: 15, fontFamily: 'OpenSans-Regular' },
  rowPriceTextStyle: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    alignSelf: 'flex-end'
  },
  dashedSepratorStyle: {
    marginVertical: Matrics.ScaleValue(2),
    borderStyle: 'dashed',
    borderColor: Color.darkGray,
    borderWidth: 1,
    borderRadius: 1
  }
})
export default CalculationForOther
