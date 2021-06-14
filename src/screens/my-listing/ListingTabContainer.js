import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import styles from './styles'

const ListingTabContainer = (props) => {
  const { isListingOpen, isFavouriteOpen, openListing, openFavourite } = props
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={openListing}
        style={isListingOpen ? styles.tabActive : styles.tabInActive}
        accessible={true}
        accessibilityLabel='myListingContListBtn'
      >
        <Text style={styles.tabText}>Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openFavourite}
        style={isFavouriteOpen ? styles.tabActive : styles.tabInActive}
        accessible={true}
        accessibilityLabel='myListingContFavBtn'
      >
        <Text style={styles.tabText}>Favourites</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ListingTabContainer
