import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import Modal from 'react-native-modal'
import { No_IMAGE_LINK } from '../../common/constants'
import { Icon } from 'react-native-elements'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const DetailsPreviewModal = (props) => {
  const { modalVisible, toggleModal, imageUri } = props

  return (
    <Modal
      transparent={true}
      animationType={'slide'}
      visible={modalVisible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          backgroundColor: 'rgba(52, 52, 52, 0.5)',
          height: height,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            width: width * 0.8,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              flexDirection: 'row',
              backgroundColor: '#FFE100',
              height: 40,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                textAlign: 'left',
                paddingLeft: 15,
                fontFamily: 'OpenSans-SemiBold',
                color: '#000000',
              }}
            >
              Preview
            </Text>
            <TouchableOpacity
              onPress={() => toggleModal(!modalVisible)}
              style={{ paddingRight: 15 }}
              accessible={true}
              accessibilityLabel='prevModalClearIconBtn'
            >
              <Icon name='clear' size={25} style={{ color: '#000' }} />
            </TouchableOpacity>
          </View>
          <Image
            testID='modal'
            source={{
              uri: imageUri !== undefined ? imageUri : No_IMAGE_LINK,
            }}
            resizeMode='contain'
            style={{ height: width * 0.8, width: width * 0.8 }}
          />
        </View>
      </View>
    </Modal>
  )
}

export default DetailsPreviewModal
