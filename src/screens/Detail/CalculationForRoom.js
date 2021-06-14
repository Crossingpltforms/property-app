import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import OnlyRM99 from '../../../Images/UI/only-rm-99.png'
import OnlyRM149 from '../../../Images/UI/only-rm-149.png'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const CalculationForRoom = props => {
  const { ExtrainfoStyle, calculatePrice, propertyInfo } = props
  const SPEEDSIGN_Fee = 399
  const price = calculatePrice(propertyInfo.price)
  const totalPrice = 1 * price + SPEEDSIGN_Fee * 1.06
  const _openUrl = url => () => Linking.openURL(url)

  return price <= 799 ? (
    propertyInfo.type === 'ROOM' ? null : (
      <View
        style={{
          backgroundColor: '#f3e1ff',
          height: 120,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            width: width * 0.8,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            testID='price'
            source={
              price >= 0 && price <= 499
                ? OnlyRM99
                : price >= 500 && price <= 799
                ? OnlyRM149
                : imgNoDeposit
            }
            style={
              price > 799
                ? { height: 70, width: 70, marginLeft: 10 }
                : { height: 50, width: 50, marginLeft: 10, marginRight: 10 }
            }
          />
          <View style={{ flexDirection: 'column' }}>
            <Text style={[ExtrainfoStyle.imgTextBody, { paddingBottom: 5 }]}>
              {price > 799
                ? 'To Move In :'
                : 'GET A TENANCY AGREEMENT FROM \nSPEEDSIGN'}
            </Text>
            <Text>
              {price > 799 && (
                <Text style={ExtrainfoStyle.imgTextBody}>RM {totalPrice}</Text>
              )}
              <Text
                style={[
                  ExtrainfoStyle.imgTextTiny,
                  {
                    paddingLeft: 5,
                    fontSize: 15,
                    fontFamily: 'OpenSans-Light'
                  }
                ]}
              >
                {price > 799
                  ? ` (1st month ${price} + Tenancy Speedsign Fee 399 + 6%SST)`
                  : 'Protect your rights with unbiased e-agreement'}
              </Text>
            </Text>
            {price <= 799 && (
              <TouchableOpacity
                onPress={() => _openUrl('https://sign.speedrent.com/login')}
                accessible={true}
                accessibilityLabel='calLearnMoreBtn'
              >
                <Text style={ExtrainfoStyle.learnMoreLink}>Learn More</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  ) : null
}

export default CalculationForRoom
