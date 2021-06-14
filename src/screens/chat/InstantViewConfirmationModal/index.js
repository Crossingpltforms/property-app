import React, { Component } from 'react'
import { Modal, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import { Matrics } from '../../../common/styles'
import { Icon } from 'react-native-elements'
import imgInstanceViewing from '../../../../Images/UI/IC_INSTANT_VIEWING.png'
import styles from './styles'

class InstantViewConfirmationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSubmit = (value) => {
    if (!value) {
      Alert.alert(
        'Success',
        'Request sent sucessfully.',
        [{ text: 'OK', onPress: () => this.handleExit(value) }],
        { cancelable: false }
      )
    } else {
      this.handleExit(value)
    }
  }

  handleExit = (value) => {
    this.props.toggleModal(!this.props.modalVisible)
    this.props.handleConfirm(value)
  }

  handleClose() {
    this.props.toggleModal(!this.props.modalVisible)
  }

  render() {
    return (
      // <Modal
      //     transparent={true}
      //     animationType={"slide"}
      //     visible={this.props.modalVisible}
      //     onRequestClose={() => { }}>

      //     <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.5)', height: height, width: width, justifyContent: 'center', alignItems: 'center' }}>

      //         <View style={{ backgroundColor: 'white', borderRadius: 5, height: 375, width: '90%', alignItems: 'center' }}>

      //             <View style={{ borderRadius: 5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, flexDirection: 'row', backgroundColor: '#FF0055', height: 40, alignItems: 'center' }}>
      //                 <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', fontFamily: 'OpenSans-SemiBold', color: '#FFFFFF' }}>Thank you</Text>
      //             </View>

      //             <Image
      //                 source={PaperPlaneImg}
      //                 resizeMode={'contain'}
      //                 style={{
      //                     width: "20%",
      //                     height: undefined,
      //                     aspectRatio: 1,
      //                     marginTop: 20,
      //                     marginBottom: 15
      //                 }}
      //             />
      //             <Text style={{ flex: 1, fontSize: 20, textAlign: 'center', fontFamily: 'OpenSans-Bold', color: '#000000', paddingLeft: 10, paddingRight: 10, paddingBottom: 15 }}>Good news!</Text>

      //             <Text style={{ flex: 1, fontSize: 14, textAlign: 'center', fontFamily: 'OpenSans-Regular', color: '#000000', paddingLeft: 20, paddingRight: 20 }}>
      //                 This is an Instant View unit. You can view the unit within 2 hours today
      //             </Text>

      //             <TouchableOpacity style={{ width: '90%', marginTop: 15 }}
      //                 onPress={() => { this.handleSubmit(true) }}
      //             >
      //                 <View style={[styles.textStyleHousingType, { backgroundColor: '#4885ED' }]}>
      //                     <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
      //                         Yes, I want to view the unit now
      //                         </Text>
      //                 </View>
      //             </TouchableOpacity>
      //             <TouchableOpacity style={{ width: '90%', marginTop: 15, marginBottom: 15 }}
      //                 onPress={() => { this.handleSubmit(false) }}
      //             >
      //                 <View style={[styles.textStyleHousingType, { backgroundColor: '#FF0055' }]}>
      //                     <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
      //                         No, I want to chat with the landlord first
      //                         </Text>
      //                 </View>
      //             </TouchableOpacity>
      //         </View>
      //     </View>
      // </Modal>

      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.mainContainer}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeHeader}
              onPress={() => {
                this.handleClose()
              }}
              accessible={true}
              accessibilityLabel='instantClearBtn'
            >
              <Icon
                name='clear'
                size={Matrics.ScaleValue(22)}
                style={{ color: '#4885ED' }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Good news!</Text>
            <Image
              testID='instanceView'
              style={styles.modalImageView}
              source={imgInstanceViewing}
              resizeMode={'contain'}
            />
            <Text style={styles.selectDateTextStyle}>
              This is an Instant View unit. {'\n'} You can view the unit within{' '}
              {'\n'} 2 hours today
            </Text>
            <View style={{ height: Matrics.ScaleValue(150), width: '85%' }}>
              <TouchableOpacity
                style={styles.selectedButtonStyle}
                onPress={() => {
                  this.handleSubmit(true)
                }}
                accessible={true}
                accessibilityLabel='instantYesBtn'
              >
                <Text style={styles.selectedButtonTextStyle}>
                  Yes, I want to view the unit now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.unSelectedButtonStyle}
                onPress={() => {
                  this.handleSubmit(false)
                }}
                accessible={true}
                accessibilityLabel='instantNoBtn'
              >
                <Text style={styles.unSelectedButtonTextStyle}>
                  No, I want to chat with the landlord
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

export default InstantViewConfirmationModal
