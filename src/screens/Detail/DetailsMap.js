import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
  Image
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Icon } from 'react-native-elements'
import { Matrics } from '../../common/styles'
import { Platform } from 'react-native'

const LATITUDE_DELTA = 0.001
const LONGITUDE_DELTA = 0.0005

const DetailsMap = (props) => {
  const {
    ExtrainfoStyle,
    propertyInfo,
    isMapReady,
    onMapReady,
    containerStyle
  } = props
  return (
    <View
      style={[
        ExtrainfoStyle.furnishingView,
        {
          alignItems: 'flex-start',
          marginVertical: Matrics.ScaleValue(10),
          paddingLeft: 10
        },
        containerStyle
      ]}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        props.yPosition(layout.y)
      }}
    >
      <Text style={styles.labelViewStyle}>Location</Text>
      {/* <TouchableOpacity
        style={styles.mapContainerStyle}
        onPress={() => createTwoButtonAlert}
      > */}
      <MapView
        style={styles.mapViewStyle}
        onMapReady={onMapReady}
        showsMyLocationButton={false}
        onPress={() => {
          Alert.alert(
            'Are you sure?',
            'You want to open the link in browser ?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: () => {
                  if (Platform.OS == 'ios') {
                    Linking.openURL(
                      `http://maps.apple.com/maps?daddr=${
                        propertyInfo.latitude
                      },${propertyInfo.longitude}`
                    )
                  } else {
                    Linking.openURL(
                      `http://maps.google.com/maps?daddr=${
                        propertyInfo.latitude
                      },${propertyInfo.longitude}`
                    ).catch((err) => console.error('An error occurred', err))
                  }
                  // Linking.openURL(
                  //   `https://www.google.com/maps/search/?api=1&query=${propertyInfo.latitude},${propertyInfo.longitude}`
                  // )
                }
              }
            ],
            { cancelable: false }
          )
        }}
        initialRegion={{
          latitude: propertyInfo.latitude,
          longitude: propertyInfo.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
      >
        {isMapReady == true && (
          <Marker
            coordinate={{
              latitude: propertyInfo.latitude,
              longitude: propertyInfo.longitude
            }}
            description={propertyInfo.name}
          >
            <View style={styles.markerImageOuterStyle}>
              <Image
                testID='mapMarker'
                source={require('../../../Images/map-marker.png')}
                style={styles.markerImageStyle}
                accessible={true}
                accessibilityLabel='mapImageMarkerIcon'
              />
            </View>
          </Marker>
        )}
      </MapView>
      {/* </TouchableOpacity> */}
    </View>
  )
}
const styles = StyleSheet.create({
  labelViewStyle: {
    fontSize: 15,
    textAlign: 'left',
    fontWeight: '600',
    color: '#000',
    fontFamily: 'OpenSans-SemiBold'
  },
  mapContainerStyle: {
    height: Matrics.ScaleValue(200),
    width: '100%'
  },
  mapViewStyle: {
    height: Matrics.ScaleValue(200),
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginTop: Matrics.ScaleValue(5)
  },
  markerImageStyle: {
    height: Matrics.ScaleValue(40),
    width: Matrics.ScaleValue(40),
    borderRadius: Matrics.ScaleValue(40) / 2
  },
  markerImageOuterStyle: {
    height: Matrics.ScaleValue(70),
    width: Matrics.ScaleValue(70),
    borderRadius: Matrics.ScaleValue(70) / 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default DetailsMap
