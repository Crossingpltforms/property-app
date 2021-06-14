import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {getRoomTypeLabel} from '../../common/helper/common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';
import imgNoDeposit from '../../../Images/UI/zero_deposit.png';
import imgContactLess from '../../../Images/UI/icon-contactless.png';
import bathtub from '../../../Images/bathtub.png';
import car_park from '../../../Images/car_park.png';
import detailsInfoStyles from './DetailsInfoStyles';
import {Matrics, Color} from '../../common/styles';

const DetailsInfo = (props) => {
  const {
    isSale,
    navigation,
    propertyInfo,
    Capitalize,
    _displayFurnishType,
    calculatePrice,
    format,
    selectedPreviewType,
    hasVideo,
    ExtrainfoStyle,
    changeSelectedPreviewType,
    onMapCliked,
  } = props;
  const displayPorpertyType = () => {
    if (propertyInfo && propertyInfo.type.toLowerCase() === 'landed_sale') {
      return 'Landed-sale';
    } else if (
      propertyInfo &&
      propertyInfo.type.toLowerCase() === 'highrise_sale'
    ) {
      return 'Highrise-sale';
    } else {
      return propertyInfo.type.toLowerCase();
    }
  };
  const _displayFloor = () => {
    if (
      propertyInfo &&
      (propertyInfo.type === 'LANDED' ||
        propertyInfo.type.toLowerCase() === 'landed_sale')
    ) {
      if (propertyInfo.storeys === 1) return 'Single Storey';
      if (propertyInfo.storeys === 2) return 'Double Storey';
      return 'More than 2 Storeys';
    }

    if (propertyInfo.level) {
      if (
        Math.floor(parseInt(propertyInfo.level) / 10) ===
          Math.round(parseInt(propertyInfo.level) / 10) &&
        parseInt(propertyInfo.level) % 10 !== 0
      ) {
        return `Floor level: ${
          parseInt(`${Math.round(parseInt(propertyInfo.level) / 10)}0}`) + 1
        } - ${
          parseInt(`${Math.round(parseInt(propertyInfo.level) / 10)}0`) + 5
        }`;
      } else {
        return `Floor level: ${
          parseInt(`${Math.round(parseInt(propertyInfo.level) / 10)}0` - 5) + 1
        } - ${Math.round(parseInt(propertyInfo.level) / 10)}0`;
      }
    } else {
      return `Floor level: ${propertyInfo.level}`;
    }
  };

  let roomType = getRoomTypeLabel(
    propertyInfo && propertyInfo.roomType != undefined
      ? propertyInfo.roomType
      : '',
  );
  const {rentalPeriod, rentalPeriodValue} = navigation.state.params;

  let d1 = new Date();
  let d2 =
    propertyInfo && propertyInfo.boostExpiry !== undefined
      ? new Date(propertyInfo.boostExpiry)
      : new Date();
  const isBoost = d1.getTime() <= d2.getTime();

  return (
    <View style={detailsInfoStyles.detailsInfoRootContainer}>
      <View style={detailsInfoStyles.photoOrVideo}>
        <TouchableOpacity
          onPress={() => {
            selectedPreviewType !== 'IMAGE'
              ? changeSelectedPreviewType('IMAGE')
              : '';
          }}
          style={[
            detailsInfoStyles.photoOrVideoBtn,
            detailsInfoStyles.photoOrVideoBtnRight,
            selectedPreviewType === 'IMAGE'
              ? detailsInfoStyles.photoOrVideoBtnActive
              : {},
          ]}
          accessible={true}
          accessibilityLabel="detailInfoInsPhotoBtn">
          <MaterialIcons
            name="insert-photo"
            size={30}
            style={[
              detailsInfoStyles.photoOrVideoImg,
              selectedPreviewType === 'IMAGE'
                ? detailsInfoStyles.photoOrVideoImgActive
                : detailsInfoStyles.photoOrVideoImgInActive,
            ]}
          />
          <Text
            style={[
              detailsInfoStyles.btnText,
              selectedPreviewType === 'IMAGE'
                ? detailsInfoStyles.photoOrVideoTextActive
                : detailsInfoStyles.photoOrVideoTextInActive,
            ]}>
            Photos
          </Text>
        </TouchableOpacity>
        {hasVideo ? (
          <TouchableOpacity
            onPress={() => {
              selectedPreviewType !== 'VIDEO'
                ? changeSelectedPreviewType('VIDEO')
                : '';
            }}
            style={[
              detailsInfoStyles.photoOrVideoBtn,
              detailsInfoStyles.photoOrVideoBtnRight,
              selectedPreviewType === 'VIDEO'
                ? detailsInfoStyles.photoOrVideoBtnActive
                : {},
            ]}
            accessible={true}
            accessibilityLabel="detailInfoVideoCamBtn">
            <MaterialIcons
              name="videocam"
              size={30}
              style={[
                detailsInfoStyles.photoOrVideoImg,
                selectedPreviewType === 'VIDEO'
                  ? detailsInfoStyles.photoOrVideoImgActive
                  : detailsInfoStyles.photoOrVideoImgInActive,
              ]}
            />
            <Text
              style={[
                detailsInfoStyles.btnText,
                selectedPreviewType === 'VIDEO'
                  ? detailsInfoStyles.photoOrVideoTextActive
                  : detailsInfoStyles.photoOrVideoTextInActive,
              ]}>
              Videos
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={onMapCliked}
          style={[
            detailsInfoStyles.photoOrVideoBtn,
            detailsInfoStyles.photoOrVideoBtnRight,
          ]}
          accessible={true}
          accessibilityLabel="detailInfoMapBtn">
          <MaterialIcons
            name="map"
            size={30}
            style={[
              detailsInfoStyles.photoOrVideoImg,
              detailsInfoStyles.photoOrVideoImgInActive,
            ]}
          />
          <Text
            style={[
              detailsInfoStyles.btnText,
              detailsInfoStyles.photoOrVideoTextInActive,
            ]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginVertical: Matrics.ScaleValue(15),
        }}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={detailsInfoStyles.priceContainer}>
            {!isSale && (
              <Text style={detailsInfoStyles.priceTextStyle}>
                RM {format(calculatePrice(propertyInfo.price))}{' '}
                <Text
                  style={[
                    detailsInfoStyles.priceTextStyle,
                    {
                      marginLeft:
                        rentalPeriod != '12' && rentalPeriod != undefined
                          ? 5
                          : 0,
                      fontSize:
                        rentalPeriod != '12' && rentalPeriod != undefined
                          ? 13
                          : 18,
                    },
                  ]}>
                  {rentalPeriod != '12' && rentalPeriod != undefined
                    ? `( including a ${rentalPeriodValue}% short term surcharge)`
                    : ''}
                </Text>
              </Text>
            )}
            {isSale && (
              <Text
                style={[
                  ExtrainfoStyle.noCommisionBoldTextStyle,
                  detailsInfoStyles.salePriceTextStyle,
                ]}>
                RM {format(propertyInfo.price)}
              </Text>
            )}
          </View>
          {isBoost === false ? (
            <View style={detailsInfoStyles.newListingContainer}>
              <Text style={detailsInfoStyles.newListingText}>New Listing</Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View style={detailsInfoStyles.tagViewContainer}>
          {propertyInfo.videos && propertyInfo.videos.length ? (
            <View style={detailsInfoStyles.tagImageVideoViewContainer}>
              <Image
                testID="noDeposit"
                source={imgNoDeposit}
                style={detailsInfoStyles.tagImageStyle}
              />
              <Image
                testID="contactLess"
                source={imgContactLess}
                style={detailsInfoStyles.tagImageStyle}
              />
            </View>
          ) : (
            <Image
              testID="noDeposit"
              source={imgNoDeposit}
              style={detailsInfoStyles.tagImageStyle}
            />
          )}
        </View>
      </View>

      <View>
        <View style={detailsInfoStyles.propertyTypeViewContainer}>
          <Text style={detailsInfoStyles.propertyType}>
            {propertyInfo.type === 'ROOM' ? 'Room ' : 'Whole Unit '}
          </Text>
        </View>
        <Text
          selectable={true}
          style={[detailsInfoStyles.nameStyle, detailsInfoStyles.textBold]}>
          {propertyInfo.name}
        </Text>
        <Text
          selectable={true}
          style={[detailsInfoStyles.addressStyle, detailsInfoStyles.textBold]}>
          {propertyInfo.address}
        </Text>
      </View>

      <View style={detailsInfoStyles.iconWithDetailMainContainer}>
        <View style={detailsInfoStyles.iconWithDetailSubContainer}>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Icon
              name="business"
              size={Matrics.ScaleValue(18)}
              color={Color.black}
            />
            <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
              {Capitalize(displayPorpertyType())}
            </Text>
          </View>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Icon
              name="straighten"
              size={Matrics.ScaleValue(18)}
              color={Color.black}
            />
            <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
              {roomType !== '' ? roomType : `${propertyInfo.sqft} sqft`}
            </Text>
          </View>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Icon
              name="weekend"
              size={Matrics.ScaleValue(18)}
              color={Color.black}
            />
            <View>
              <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
                {_displayFurnishType(propertyInfo.furnishType)}
              </Text>
              <Text style={detailsInfoStyles.roomType}>{_displayFloor()}</Text>
            </View>
          </View>
        </View>

        <View style={[detailsInfoStyles.iconWithDetailSubContainer]}>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Icon
              name="hotel"
              size={Matrics.ScaleValue(18)}
              color={Color.black}
            />
            <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
              {propertyInfo.bedroom} bedrooms
            </Text>
          </View>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Image
              testID="bathtub"
              source={bathtub}
              style={detailsInfoStyles.iconWithDetailImageStyle}
            />
            <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
              {propertyInfo.bathroomType !== null
                ? Capitalize(propertyInfo.bathroomType.toLowerCase())
                : propertyInfo.bathroom}{' '}
              bathrooms
            </Text>
          </View>
          <View style={detailsInfoStyles.iconWithDetailViewContainer}>
            <Image
              testID="car_park"
              source={car_park}
              style={detailsInfoStyles.iconWithDetailImageStyle}
            />
            <Text style={detailsInfoStyles.iconWithDetailTextStyle}>
              {propertyInfo.carpark} carpark
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailsInfo;
