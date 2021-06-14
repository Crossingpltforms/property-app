import React from 'react'
import { ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'

export const ActivityIndicatorModal = () => {
  return (
    <Modal
      isVisible={true}
      backdropOpacity={0.4}
      style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
    >
      <ActivityIndicator size='large' color='#FFF' />
    </Modal>
  )
}
