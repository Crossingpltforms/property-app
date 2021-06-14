import React from 'react'
import { TouchableOpacity, Text, View, Linking, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import styles from './styles'

const { height, width } = Dimensions.get('window')

const RejectedModal = (props) => {
  const { isVisible, closeModal } = props
  return (
    <Modal
      animationType={'slide'}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.rejectedModalInnerWrapper}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            height: 200,
            width: '80%',
          }}
        >
          <View
            style={{
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
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
              Sorry!
            </Text>
          </View>
          <Text style={{ padding: 20, textAlign: 'center' }}>
            <Text style={{ fontFamily: 'OpenSans-Light' }}>
              This property has been rejected, please email{' '}
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans-SemiBold' }}
              onPress={() => Linking.openURL('mailto:hello@speedhome.com')}
            >
              hello@speedhome.com
            </Text>
            <Text
              style={{ fontFamily: 'OpenSans-Light' }}
              onPress={() => Linking.openURL('mailto:hello@speedhome.com')}
            >
              {' '}
              for more information
            </Text>
          </Text>
          <View style={styles.HeaderStyle}>
            <TouchableOpacity
              style={{ width: '40%' }}
              onPress={closeModal}
              accessible={true}
              accessibilityLabel='rejModalOkayBtn'
            >
              <View
                style={[
                  styles.textStyleHousingType,
                  { backgroundColor: '#FFE100' },
                ]}
              >
                <Text style={{ textAlign: 'center' }}>Okay</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default RejectedModal
