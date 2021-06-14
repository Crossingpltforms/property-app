import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
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
import imgMore from '../../../Images/More/ic_more.png'
import PropertyApprovalStatus from '../../common/components/propertyStatus'
import ProgressiveImage from '../../common/components/progressiveImage/index'

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
        alignSelf: 'center',
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
              margin: Matrics.ScaleValue(2),
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
        flex: 1,
      }}
      contentContainerStyle={{ alignItems: 'center' }}
      horizontal
      pagingEnabled
      onScroll={imageScrollHandler}
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
            accessibilityLabel='imageSliderBtn'
          >
            <ProgressiveImage
              key={index}
              source={{ uri: image.url ? image.url : No_IMAGE_LINK }}
              resizeMode='cover'
              style={styles.sliderImageStyle}
            />
          </TouchableOpacity>
        ))}
    </ScrollView>
  )
}

function threeDots(key, onThreeDotPress) {
  {
    return key.type.toLowerCase().includes('_sale') ||
      key.active === false ||
      key.status === 'EXPIRED' ||
      key.status === 'SUSPENDED' ? (
        <View />
      ) : (
        <TouchableOpacity
          style={styles.threeDotImageViewStyle}
          onPress={onThreeDotPress}
          accessible={true}
          accessibilityLabel='moreHorizontalBtn'
        >
          <Icon
            name='more-horiz'
            size={Matrics.ScaleValue(20)}
            color={Color.darkGray}
          />
        </TouchableOpacity>
      )
  }
}

const MyListingPropertyCard = ({
  data,
  index,
  price,
  distance,
  isBoost = false,
  roomType = '',
  showMap = false,
  showSlider = true,
  modalEditVisible,
  clickedItem,
  onPress,
  onTenantSearchPress,
  onViewAppointmentPress,
  onThreeDotPress,
  onRetriveKeyPress,
  onResubmitPress,
  onPressEditList,
  onPressArchieve,
  onMapPress,
  containerStyle,
  scrollStyle,
}) => {

  return (
    <View style={styles.main}>
      <View style={styles.chatAndCRViewContainer}>
        <View style={styles.chatAndCRInnerView}>
          <Icon
            name='remove-red-eye'
            size={Matrics.ScaleValue(20)}
            color={Color.darkGray}
          />
          <Text style={[styles.detailTextStyle, { color: Color.darkGray }]}>
            {data.stats && data.stats.viewCount} View
          </Text>
        </View>
        <View style={styles.chatAndCRInnerView}>
          <Icon
            name='chat'
            size={Matrics.ScaleValue(20)}
            color={Color.darkGray}
          />
          <Text style={[styles.detailTextStyle, { color: Color.darkGray }]}>
            {data.stats && data.stats.crCount} chat
          </Text>
        </View>
        <View>{threeDots(data, onThreeDotPress)}</View>
      </View>

      <View style={[styles.mainContainerStyle, containerStyle]}>
        {modalEditVisible && index === clickedItem && (
          <View style={styles.typeDropDownRoot}>
            <TouchableOpacity
              style={styles.typeDropDownViews}
              onPress={onPressEditList}
              accessible={true}
              accessibilityLabel='myListEditListingBtn'
            >
              <Text>Edit Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeDropDownViews}
              onPress={onPressArchieve}
              accessible={true}
              accessibilityLabel='reactivateArchiveBtn2'
            >
              <Text>{data.active === false ? 'Reactivate' : 'Archive'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.touchableMainContainer}
          activeOpacity={1}
          onPress={onPress}
          accessible={true}
          accessibilityLabel='myListingSliderBtn2'
        >
          <View
            style={[
              styles.imageMainViewContainer,
              { justifyContent: 'flex-end' },
            ]}
          >
            {showSlider == true ? (
              imageSlider(data, onPress, scrollStyle)
            ) : (
                // <FastImage
                //   style={styles.imageStyle}
                //   source={{
                //     uri:
                //       data.images.length > 0 ? data.images[0].url : No_IMAGE_LINK,
                //     priority: FastImage.priority.normal
                //   }}
                //   resizeMode={FastImage.resizeMode.cover}
                // />
                <ProgressiveImage
                  source={{
                    uri:
                      data.images.length > 0 ? data.images[0].url : No_IMAGE_LINK,
                  }}
                  style={styles.imageStyle}
                  resizeMode='cover'
                />
              )}
          </View>
          <PropertyApprovalStatus
            propertyInfo={data}
            currentPage={{ pageName: 'MY_LISTING' }}
          />
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
              accessibilityLabel='myListingMapBtn'
            >
              <Icon
                name='map'
                size={Matrics.ScaleValue(18)}
                color={Color.dodgerBlue}
              />
              <Text style={styles.detailTextStyle}>Map</Text>
            </TouchableOpacity>
          )}

          {data.status === 'SUSPENDED' ? (
            <View style={styles.resubmitBtnContainer}>
              <View style={styles.resubmitBtnInnerWrapper}>
                <Icon name='report' size={25} />
                <Text numberOfLines={1} style={styles.deleteReasonText}>
                  {data.deleteReason}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.buttonStyle, styles.blueButton]}
                onPress={onResubmitPress}
                accessible={true}
                accessibilityLabel='myListingResubmitBtn'
              >
                <Text style={[styles.buttonTextStyle, styles.blueButtonText]}>
                  Resubmit
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
              <View>
                {data.type.toLowerCase().includes('_sale') ||
                  data.active === false ||
                  data.status === 'EXPIRED' ||
                  data.status === 'SUSPENDED' ? (
                    <View style={styles.inActiveSectionButtonContainer}>
                      <TouchableOpacity
                        style={[styles.buttonStyle, styles.blueButton]}
                        onPress={onPressEditList}
                        accessible={true}
                        accessibilityLabel='myListingEditListingBtn'
                      >
                        <Text
                          style={[styles.buttonTextStyle, styles.blueButtonText]}
                        >
                          Edit Listing
                    </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={onPressArchieve}
                        style={[styles.buttonStyle, styles.simpleButton]}
                        accessible={true}
                        accessibilityLabel='reactivateArchiveBtn3'
                      >
                        <Text
                          style={[styles.simpleButtonText, styles.buttonTextStyle]}
                        >
                          {data.active === false ? 'Reactivate' : 'Archive'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                {data.type.toLowerCase().includes('_sale') ||
                  data.active === false ||
                  data.status === 'EXPIRED' ||
                  (data.status === 'SUSPENDED' ? null : (
                    <TouchableOpacity
                      style={[styles.buttonStyle, styles.blueButton]}
                      onPress={onTenantSearchPress}
                      accessible={true}
                      accessibilityLabel='myListingTenantSearchBtn'
                    >
                      <Text
                        style={[styles.buttonTextStyle, styles.blueButtonText]}
                      >
                        Tenant Search
                    </Text>
                    </TouchableOpacity>
                  ))}

                {data.status === 'ACTIVE' &&
                  data.active === true &&
                  data.price > 500 &&
                  (data.type === 'LANDED' || data.type === 'HIGHRISE') &&
                  distance <= 40 &&
                  data.KOH === true ? (
                    <TouchableOpacity
                      onPress={onRetriveKeyPress}
                      style={[styles.buttonStyle, styles.simpleButton]}
                      accessible={true}
                      accessibilityLabel='freeRetrieveBtn'
                    >
                      <Text
                        style={[styles.buttonTextStyle, styles.simpleButtonText]}
                      >
                        {data.KOH === false ? 'Free Viewings' : 'Retrieve key'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                {data.status === 'ACTIVE' &&
                  data.active === true &&
                  data.price > 500 &&
                  (data.type === 'LANDED' || data.type === 'HIGHRISE') &&
                  distance <= 40 &&
                  data.KOH === false ? (
                    <TouchableOpacity
                      onPress={onViewAppointmentPress}
                      style={[styles.buttonStyle, styles.simpleButton]}
                      accessible={true}
                      accessibilityLabel='keyRetrieveBtn'
                    >
                      <Text
                        style={[styles.buttonTextStyle, styles.simpleButtonText]}
                      >
                        {data.KOH === false ? 'Key Collection' : 'Retrieve key'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
              </View>
            )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default MyListingPropertyCard
