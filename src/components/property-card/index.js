import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
  ActivityIndicator
} from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './styles'
import { No_IMAGE_LINK } from '../../common/constants'
import { Matrics, Color } from '../../common/styles'

import bathtub from '../../../Images/bathtub.png'
import car_park from '../../../Images/car_park.png'
import imgNoDeposit from '../../../Images/UI/zero_deposit.png'
import imgInstantView from '../../../Images/UI/instant_view.png'
import imgContactLess from '../../../Images/UI/icon-contactless.png'
import ProgressiveImage from '../../common/components/progressiveImage/index'
import * as _ from 'lodash'

function Capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function displayFurnishType(furnishType) {
  if (furnishType === 'NONE') {
    return 'Unfurnished'
  } else if (furnishType === 'PARTIAL') {
    return 'Partially Furnished'
  } else {
    return 'Fully Furnished'
  }
}

function displayPorpertyType(propertyType) {
  if (propertyType === 'landed_sale') {
    return 'Landed-sale'
  } else if (propertyType === 'highrise_sale') {
    return 'Highrise-sale'
  } else {
    return propertyType
  }
}

function imageScrollHandler({ nativeEvent }) {
  const slide = Math.ceil(
    nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
  )
}

function displayIndicator(number) {
  return (
    <View
      style={{
        position: 'absolute',
        height: Matrics.ScaleValue(20),
        width: Matrics.ScaleValue(100),
        flexDirection: 'row',
        backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}
    >
      {Array.from({ length: 4 }, (_, i) => {
        return (
          <View
            key={i}
            style={{
              width: Matrics.ScaleValue(5),
              height: Matrics.ScaleValue(5),
              borderRadius: Matrics.ScaleValue(5) / 2,
              backgroundColor: Color.white,
              backgroundColor: 'red',
              margin: Matrics.ScaleValue(2)
            }}
          />
        )
      })}
    </View>
  )
}

function imageSlider(data, onPress, scrollStyle) {
  return (
    <ScrollView
      style={{
        flex: 1
      }}
      contentContainerStyle={{ alignItems: 'center' }}
      horizontal
      pagingEnabled
      onScroll={imageScrollHandler}
      scrollEventThrottle={16}
      decelerationRate={'fast'}
      showsHorizontalScrollIndicator={false}
    >
      {data &&
        data.images.map((image, index) => (
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.sliderScrollStyle, scrollStyle]}
            key={index}
            onPress={onPress}
            accessible={true}
            accessibilityLabel='progressiveImgBtn'
          >
            <ProgressiveImage
              key={index}
              source={{
                uri: _.get(image, 'url', No_IMAGE_LINK),
                cache: 'reload'
              }}
              style={styles.sliderImageStyle}
              resizeMode='cover'
            />
          </TouchableOpacity>
        ))}
    </ScrollView>
  )
}

const PropertyCard = ({
  data,
  price,
  isBoost = false,
  roomType = '',
  showMap = false,
  showSlider = true,
  onPress,
  onMapPress,
  containerStyle,
  scrollStyle
}) => {
  return (
    <View style={[styles.mainContainerStyle, containerStyle]}>
      <TouchableOpacity
        style={styles.touchableMainContainer}
        activeOpacity={1}
        onPress={onPress}
        accessible={true}
        accessibilityLabel='propCardSliderBtn'
      >
        <View
          style={[
            styles.imageMainViewContainer,
            { justifyContent: 'flex-end' }
          ]}
        >
          {showSlider == true ? (
            imageSlider(data, onPress, scrollStyle)
          ) : (
            <Image
              source={{
                uri: _.get(data, 'images[0].url', No_IMAGE_LINK)
              }}
              style={styles.imageStyle}
              resizeMode='cover'
            />
          )}
        </View>

        <View style={styles.detailTextMainViewContainer}>
          <View style={styles.priceViewStyle}>
            <Text style={styles.priceTextStyle}>RM {price}</Text>
            {isBoost === true ? (
              <View style={styles.newListingViewStyle}>
                <Text style={styles.newListingTextStyle}>New Listing</Text>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View style={styles.nameContainerStyle}>
            <Text style={styles.typeTextStyle}>
              {data.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.nameTextStyle}
            >
              {data.name}
            </Text>
          </View>
          <View style={styles.otherInfoContainerStyle}>
            <View style={styles.otherInfoViewStyle}>
              <View style={styles.infoViewStyle}>
                <Icon
                  name='business'
                  size={Matrics.ScaleValue(15)}
                  color={Color.black}
                />
                <Text style={styles.detailTextStyle}>
                  {Capitalize(displayPorpertyType(data.type.toLowerCase()))}
                </Text>
              </View>
              <View style={styles.infoViewStyle}>
                <Icon
                  name='straighten'
                  size={Matrics.ScaleValue(15)}
                  color={Color.black}
                />
                <Text style={styles.detailTextStyle}>
                  {roomType !== '' ? roomType : `${data.sqft} sqft`}
                </Text>
              </View>
              <View style={styles.infoViewStyle}>
                <Icon
                  name='weekend'
                  size={Matrics.ScaleValue(15)}
                  color={Color.black}
                />
                <Text style={styles.detailTextStyle}>
                  {displayFurnishType(data.furnishType)}
                </Text>
              </View>
            </View>
            <View style={styles.otherInfoViewStyle}>
              <View style={styles.infoViewStyle}>
                <Icon
                  name='hotel'
                  size={Matrics.ScaleValue(15)}
                  color={Color.black}
                />
                <Text style={styles.detailTextStyle}>
                  {data.bedroom} bedrooms
                </Text>
              </View>
              <View style={styles.infoViewStyle}>
                <Image source={bathtub} style={styles.iconStyle} />
                <Text style={styles.detailTextStyle}>
                  {data.bathroomType !== null
                    ? Capitalize(data.bathroomType.toLowerCase())
                    : data.bathroom}{' '}
                  bathrooms
                </Text>
              </View>
              <View style={styles.infoViewStyle}>
                <Image source={car_park} style={styles.iconStyle} />
                <Text style={styles.detailTextStyle}>
                  {data.carpark} carpark
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.tagContainerStyle}>
          {data && data.noDeposit === true && data.type !== 'ROOM' ? (
            <Image source={imgNoDeposit} style={styles.tagImageStyle} />
          ) : (
            <View />
          )}
          {data.videos && data.videos.length > 0 ? (
            <Image source={imgContactLess} style={styles.tagImageStyle} />
          ) : (
            <View />
          )}
        </View>
        {showMap == true && (
          <TouchableOpacity
            style={styles.mapButtonContainer}
            onPress={onMapPress}
            accessible={true}
            accessibilityLabel='propCardMapBtn'
          >
            <Icon
              name='map'
              size={Matrics.ScaleValue(18)}
              color={Color.dodgerBlue}
            />
            <Text style={styles.detailTextStyle}>Map</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  )
}
export default PropertyCard
