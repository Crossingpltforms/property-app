import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'

const DetailsProperty = props => {
  const { ExtrainfoStyle, propertyInfo, Capitalize, isSale } = props

  //func
  const openForAll = () => {
    if (propertyInfo.allRaces === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='check-circle' color='black' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            This property is open for all races
          </Text>
        </View>
      )
    }
  }

  const isMinStay = () => {
    // const { rentalPeriod } = this.props.navigation.state.params
    if (!isSale === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='today' color='black' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            {/* Min. {(rentalPeriod != null && rentalPeriod != undefined) ? rentalPeriod : 3} month rental with surcharge */}
            {/* Min. 3 month rental with surcharge */}
            Minimum rental period of 3 month with surcharge
          </Text>
        </View>
      )
    }
  }

  const isPetFriendly = () => {
    if (propertyInfo.petFriendly === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='thumb-up' color='black' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            This property is pet-friendly
          </Text>
        </View>
      )
    }
  }
  const openNegotiable = () => {
    if (propertyInfo.negotiable === true) {
      return (
        <View style={ExtrainfoStyle.PropertyInfoViewTab}>
          <Icon name='thumb-up' color='black' size={22} />
          <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
            The rental is negotiable
          </Text>
        </View>
      )
    }
  }
  const _viewTitleType = () => {
    return (
      <View style={ExtrainfoStyle.PropertyInfoViewTab}>
        <Icon name='check-circle' color='black' size={22} />
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          Title Type: {Capitalize(propertyInfo.leaseType.toLowerCase())}
        </Text>
      </View>
    )
  }

  const _viewPropertyType = () => {
    return (
      <View style={ExtrainfoStyle.PropertyInfoViewTab}>
        <Icon name='thumb-up' color='black' size={22} />
        <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
          This property is Bumi Lot
        </Text>
      </View>
    )
  }
  //func

  if (isSale) {
    return (
      <View style={ExtrainfoStyle.furnishingView}>
        {_viewTitleType()}
        {propertyInfo.bumiLot && _viewPropertyType()}
      </View>
    )
  } else {
    return (
      <View style={ExtrainfoStyle.furnishingView}>
        {propertyInfo.fullyFurnishable && (
          <View style={ExtrainfoStyle.PropertyInfoViewTab}>
            <Icon name='check-circle' color='black' size={22} />
            <Text style={ExtrainfoStyle.PropertyInfoViewTabLabel}>
              Landlord is willing to furnish at extra cost
            </Text>
          </View>
        )}
        {openForAll()}
        {isMinStay()}
        {isPetFriendly()}
        {openNegotiable()}
      </View>
    )
  }
}

export default DetailsProperty
