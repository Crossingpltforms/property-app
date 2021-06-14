import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { getUserInfo } from '../../helper/common'

const PropertyApprovalSatus = ({ propertyInfo, currentPage }) => {
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    getUserInfo().then(res => {
      if (res) {
        const data = JSON.parse(res)
        setIsOwner(parseInt(data.userId) === parseInt(propertyInfo.user.id))
      }
    })
  }, [propertyInfo])

  const getStatus = status => {
    if (status === 'PENDING' || status === 'APPROVED') {
      if (currentPage.pageName === 'MY_LISTING' && status !== 'PENDING') {
        return null
      }

      return (
        <View
          style={[
            styles.propertyStatus,
            status === 'PENDING'
              ? styles.propertyStatusPending
              : styles.propertyStatusLive,
            currentPage.pageName === 'MY_LISTING'
              ? styles.myListingDesign
              : currentPage.pageName === 'LISTING_DETAILS_ROOM'
              ? styles.listingDetailsRoomPageDesign
              : styles.listingDetailsPageDesign
          ]}
        >
          {status === 'PENDING' ? (
            <Icon name='notifications' size={25} type='material' color='#fff' />
          ) : (
            <Icon name='album' size={25} type='material' color='#fff' />
          )}
          <Text style={styles.propertyStatusText}>
            {status === 'PENDING' ? 'PENDING' : 'LIVE'}
          </Text>
        </View>
      )
    }
    return null
  }
  if (isOwner) {
    return getStatus(propertyInfo.approvalStatus)
  }
  return null
}

const styles = StyleSheet.create({
  propertyStatus: {
    overflow: 'hidden',
    zIndex: 1,
    left: 0,
    width: '100%',
    height: 35,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  myListingDesign: {
    top: 0
  },
  listingDetailsPageDesign: {
    top: -10,
    borderRadius: 0
  },
  listingDetailsRoomPageDesign: {
    position: 'relative',
    borderRadius: 0
  },
  propertyStatusPending: {
    backgroundColor: '#f05'
  },
  propertyStatusLive: {
    backgroundColor: 'green'
  },
  propertyStatusText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 17,
    fontFamily: 'OpenSans-SemiBold'
  }
})

export default PropertyApprovalSatus
