import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  Image,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Matrics, Images } from '../../../common/styles'
import CoverOne from '../../../../Images/Covers/Cover1.png'
import LinearGradient from 'react-native-linear-gradient'
import styles from './styles'
import Http from '../../../api/http'
import APICaller from '../../../util/apiCaller'
import { No_IMAGE_LINK } from '../../constants'

import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import { getRoomTypeLabel } from '../../helper/common'

const Listing = (props) => {
  const deleteProperty = (id) => {
    if (!global.networkConnection) return
    if (props.isUserLogin == true) {
      let user_credentials = props.userLoginData
      APICaller(
        `${Http.deleteListing(id)}`,
        'POST',
        user_credentials.token,
        {}
      ).then((response) => {
        if (
          response.status === 403 ||
          response.status === 422 ||
          response.status === 401 ||
          response.status === 400
        ) {
          Alert.alert(response.data.message)
        } else if (response.status === 200) {
          // props.item.item.isRemove = true;
          props.onDeleteListing(id)
          alert('Removed Successfully')
        }
      })
    }
  }

  const deleteListing = (id) => {
    Alert.alert(
      'Delete Property',
      'Do you really want to delete this property ?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        { text: 'OK', onPress: () => deleteProperty(id) }
      ],
      { cancelable: false }
    )
  }

  let images = CoverOne
  if (props.item.item.images[0]) {
    images = {
      uri:
        props.item && props.item.item && props.item.item.images
          ? props.item.item.images[0].url
          : No_IMAGE_LINK
    }
  }

  let roomType = getRoomTypeLabel(
    props.item.item && props.item.item.roomType != undefined
      ? props.item.item.roomType
      : ''
  )

  AsyncStorage.setItem('ItemName', props.item.item.name)
  return (
    !props.item.item.isRemove && (
      <MenuProvider>
        <View style={styles.view2}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel='listPageDetailBtn'
            style={styles.imageBGView}
            onPress={() => {
              props.navigation.navigate('ListingPageDetail', {
                propertyInfo: props.item.item
              })
            }}
          >
            <ImageBackground
              source={images}
              style={styles.imagebg1}
              resizeMode='stretch'
            >
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}
                style={{
                  width: '99%',
                  alignSelf: 'center',
                  height: Matrics.ScaleValue(155),
                  justifyContent: 'flex-end'
                }}
              >
                <Text style={styles.text2}>{props.item.item.name}</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          <Menu
            onSelect={(value) => alert(`Selected number: ${value}`)}
            style={styles.Menuopt}
          >
            <MenuTrigger>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel='menuIconBtn'
              >
                <View>
                  <Image
                    testID='splash'
                    style={styles.Menu}
                    source={Images.menuIcon}
                    resizeMode='stretch'
                  />
                </View>
              </TouchableOpacity>
            </MenuTrigger>

            <MenuOptions>
              <MenuOption value={1} text='One' />
              <MenuOption value={2}>
                <Text style={{ color: 'red' }}>Two</Text>
              </MenuOption>
              <MenuOption value={3} disabled={true} text='Three' />
            </MenuOptions>

            {/* <MenuOptions optionsContainerStyle={{ width: 120, right: 70, height: 120, position: 'absolute', borderRadius: 10 }}>
            <MenuOption
              style={{ marginLeft: 10, marginTop: 5 }}
              // onSelect={() => Actions.EditService()}
            >
            <Text style={{ color: 'black' }}>Edit</Text>
            </MenuOption>
            <View style={{ backgroundColor: '#eaeaea', height: 1 }}></View>
            
            <MenuOption
            style={{ marginLeft: 10, marginTop: 5 }}
            // onSelect={() => alert('All')}
            >
            <Text style={{ color: 'black' }}>Archive</Text>
            </MenuOption>
            <View style={{ backgroundColor: '#eaeaea', height: 1 }}></View>

            <MenuOption
            style={{ marginLeft: 10, marginTop: 5 }}
            // onSelect={() => alert('All')}
            >
            <Text style={{ color: 'black' }}>Share</Text>
            </MenuOption>
          </MenuOptions> */}
          </Menu>

          <View style={styles.view3}>
            <Text style={styles.text1}>RM {props.item.item.price}</Text>
            <Text style={styles.text3}>
              {roomType !== '' ? roomType : `${props.item.item.sqft} sqft`} |
              {props.item.item.type.toLowerCase().charAt(0).toUpperCase() +
                props.item.item.type.toLowerCase().slice(1)}{' '}
              |
              {props.item.item.furnishType === 'NONE'
                ? 'Unfurnished'
                : props.item.item.furnishType === 'PARTIAL'
                ? 'Partially Furnished'
                : 'Fully Furnished'}
            </Text>
            <View style={styles.view4}>
              <View style={styles.view5}>
                <Text style={styles.text1}>{props.item.item.bedroom}</Text>
                <Image
                  testID='bedroom'
                  source={Images.bedroom}
                  style={styles.ml1}
                />
              </View>
              <View style={styles.view5}>
                <Text style={styles.text1}>
                  {props.item.item.bathroomType !== null
                    ? props.item.item.bathroomType
                        .toLowerCase()
                        .charAt(0)
                        .toUpperCase() +
                      props.item.item.bathroomType.toLowerCase().slice(1)
                    : props.item.item.bathroom}
                </Text>
                <Image
                  testID='shawar'
                  source={Images.shawar}
                  style={styles.ml1}
                />
              </View>
              <View style={styles.view5}>
                <Text style={styles.text1}>{props.item.item.carpark}</Text>
                <Image
                  testID='parking'
                  source={Images.parking}
                  style={styles.ml1}
                />
              </View>
            </View>
            <View style={styles.buttonGroup1}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel='commonEditListingBtn'
                style={styles.button2}
                onPress={() => {
                  props.navigation.navigate('Editlisting', {
                    details: props.item.item
                  })
                }}
              >
                <Text style={styles.text1}>Edit Listing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel='commonDeleteBtn'
                onPress={() => {
                  deleteListing(props.item.item.id)
                }}
                style={styles.button3}
              >
                <Text style={styles.text1}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </MenuProvider>
    )
  )
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return { isUserLogin, userLoginData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Listing)
