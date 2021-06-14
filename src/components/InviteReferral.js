import React, { Component } from 'react'
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { Matrics } from '../common/styles'
import { Icon } from 'react-native-elements'
import imgReqSent from '../../Images/home.png'

const { width, height } = Dimensions.get('window')

class InviteReferral extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleExit = () => {
    this.props.toggleModal(!this.props.modalVisible)
  }
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.mainContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.closeHeader}>
              <TouchableOpacity
                onPress={() => {
                  this.handleExit()
                }}
                accessible={true}
                accessibilityLabel='inviteRefClearIconBtn'
              >
                <Icon
                  name='clear'
                  size={Matrics.ScaleValue(18)}
                  style={{ color: '#4885ED' }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>{this.props.headerText}</Text>
            <Image
              testID='modalImageView'
              style={styles.modalImageView}
              source={imgReqSent}
              resizeMode={'contain'}
            />
            <Text style={styles.selectDateTextStyle}>
              {this.props.bodyText}
            </Text>
            <View
              style={{
                height: Matrics.ScaleValue(60),
                width: '85%',
                marginVertical: Matrics.ScaleValue(15),
              }}
            >
              <TouchableOpacity
                style={styles.selectedButtonStyle}
                onPress={() => {
                  this.handleExit()
                }}
                accessible={true}
                accessibilityLabel='inviteRefOkayBtn'
              >
                <Text style={styles.selectedButtonTextStyle}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: Matrics.ScaleValue(20),
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
  },
  closeHeader: {
    height: Matrics.ScaleValue(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  headerText: {
    width: '90%',
    alignContent: 'center',
    color: 'black',
    fontFamily: 'OpenSans-Bold',
    fontSize: Matrics.ScaleValue(20),
    marginHorizontal: Matrics.ScaleValue(25),
    textAlign: 'center',
  },
  modalImageView: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(80),
    marginVertical: 20,
  },
  selectDateTextStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(15),
    paddingHorizontal: Matrics.ScaleValue(10),
  },
  selectedButtonStyle: {
    height: Matrics.ScaleValue(40),
    backgroundColor: 'black',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Matrics.ScaleValue(15),
  },
  selectedButtonTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'white',
    fontWeight: '500',
  },
})
export default InviteReferral
