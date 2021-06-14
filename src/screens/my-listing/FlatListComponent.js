import React from 'react'
import { TouchableOpacity, Text, View, FlatList } from 'react-native'
import { Icon } from 'react-native-elements'
import { getRoomTypeLabel } from '../../common/helper/common'
import MyListingPropertyCard from '../../components/MyListing-property-card'
import styles from './styles'

const FlatListComponent = (props) => {
  const { data, deleteListing, modalEditVisible, clickedItem } = props

  const FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={styles.itemSeperator} />
    )
  }

  const distanceCalc = (lat1, lon1, lat2, lon2) => {
    var radlat1 = (Math.PI * lat1) / 180
    var radlat2 = (Math.PI * lat2) / 180
    var theta = lon1 - lon2
    var radtheta = (Math.PI * theta) / 180
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
  }
  const renderFooterProperty = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.closeEditModal()
          props.openAddPropertyBtn()
        }}
        style={[styles.category_View, styles.addMorePropertyBtn]}
        accessible={true}
        accessibilityLabel='myListFlatListAddBtn'
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}
        >
          <Icon name='add' size={25} color='#4885ED' />
          <Text
            style={[
              styles.text1,
              { fontSize: 15, fontFamily: 'OpenSans-SemiBold', marginLeft: 10 },
            ]}
          >
            Post another Property
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const format = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, '$&,')
  }

  const renderData = (key, index) => {
    const roomType = getRoomTypeLabel(key.roomType)
    const distance = distanceCalc(key.latitude, key.longitude, 3.139, 101.6869)

    return (
      <View>
        <MyListingPropertyCard
          data={key}
          index={index}
          showSlider={true}
          price={format(key.price)}
          distance={distance}
          roomType={roomType}
          modalEditVisible={modalEditVisible}
          clickedItem={clickedItem}
          onTenantSearchPress={() => {
            props.closeEditModal(),
              props.navigation.navigate('TenantSearch', {
                latitude: key.latitude || 0,
                longitude: key.longitude || 0,
                propertyId: key.id,
              })
          }}
          onViewAppointmentPress={() => {
            if (key.KOH === false) {
              props.closeEditModal()
              props.navigation.navigate('HomeRunnerCollectKey', {
                id: key.id,
              })
            }
          }}
          onResubmitPress={() => {
            props.closeEditModal(),
              props.navigation.navigate('Editlisting', {
                details: key,
              })
          }}
          onPress={() => {
            props.closeEditModal(),
              props.navigation.navigate('ListingPageDetail', {
                propertyInfo: key,
              })
          }}
          onThreeDotPress={() => props.clickedMoreBtn(index)}
          onPressEditList={() => {
            props.closeEditModal()
            props.navigation.navigate('Editlisting', {
              details: key,
            })
          }}
          onPressArchieve={() => {
            props.closeEditModal(), deleteListing(key)
          }}
          onRetriveKeyPress={() => {
            props.closeEditModal(), props.handleReturnKeyButton(key)
          }}
        />
      </View>
    )
  }
  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={FlatListItemSeparator}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => <View>{renderData(item, index)}</View>}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      removeClippedSubviews={true}
      ListFooterComponent={
        props.ListFooterComponent ? renderFooterProperty : null
      }
      ListEmptyComponent={props.ListEmptyComponent}
    />
  )
}

export default FlatListComponent
