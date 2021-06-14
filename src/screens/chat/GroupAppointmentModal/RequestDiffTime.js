import React, { Component } from 'react'
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native'
// import PaperPlaneImg from "../../../../Images/paper-plane.png";
import { Matrics } from '../../../common/styles'
import { Icon } from 'react-native-elements'
// import imgReqSent from "../../../../Images/GroupAppointmentModal/IC_REQUEST_SENT.png";

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

class RequestDiffTime extends Component {
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
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={true}
        onRequestClose={() => {}}
      >
        <View style={styles.mainContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.closeHeader}>
              <Icon
                name='clear'
                size={Matrics.ScaleValue(22)}
                style={{ color: '#4885ED' }}
              />
            </View>
            <Text style={styles.headerText}>{this.props.headerText}</Text>
            <View style={{ marginVertical: Matrics.ScaleValue(10) }}>
              <View
                style={[
                  styles.dropDownContainerStyle,
                  {
                    marginBottom: Matrics.ScaleValue(15),
                    marginTop: Matrics.ScaleValue(15),
                  },
                ]}
              >
                <Text style={styles.selectedTextStyle}>Date</Text>
                <TouchableOpacity
                  style={styles.dropDownViewStyle}
                  accessible={true}
                  accessibilityLabel='requestMoreDateBtn'
                >
                  <Text style={styles.unSelectedTextStyle}>Please select</Text>
                  <Icon
                    name='expand-more'
                    color='gray'
                    size={Matrics.ScaleValue(22)}
                    style={{ color: '#4885ED', width: Matrics.ScaleValue(30) }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.dropDownContainerStyle}>
                <Text style={styles.selectedTextStyle}>Time</Text>
                <TouchableOpacity
                  style={styles.dropDownViewStyle}
                  accessible={true}
                  accessibilityLabel='requestMoreTimeBtn'
                >
                  <Text style={styles.unSelectedTextStyle}>Please select</Text>
                  <Icon
                    name='expand-more'
                    color='gray'
                    size={Matrics.ScaleValue(22)}
                    style={{ color: '#4885ED', width: Matrics.ScaleValue(30) }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: Matrics.ScaleValue(60),
                width: '85%',
                marginBottom: Matrics.ScaleValue(20),
              }}
            >
              <TouchableOpacity
                style={styles.selectedButtonStyle}
                accessible={true}
                accessibilityLabel='requestMoreSubmitBtn'
              >
                <Text style={styles.selectedButtonTextStyle}>Submit</Text>
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
    fontSize: Matrics.ScaleValue(16),
    marginHorizontal: Matrics.ScaleValue(25),
    textAlign: 'center',
  },
  modalImageView: {
    width: Matrics.ScaleValue(160),
    height: Matrics.ScaleValue(160),
  },
  selectDateTextStyle: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(17),
  },
  selectedTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(16),
    color: 'black',
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
    fontSize: Matrics.ScaleValue(15),
    color: 'white',
    fontWeight: '500',
  },
  unSelectedTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(15),
    color: 'gray',
    paddingLeft: Matrics.ScaleValue(10),
    flex: 1,
  },
  dropDownContainerStyle: {
    flexDirection: 'row',
    marginBottom: Matrics.ScaleValue(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownViewStyle: {
    flexDirection: 'row',
    height: Matrics.ScaleValue(40),
    width: '73%',
    marginLeft: Matrics.ScaleValue(15),
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: Matrics.ScaleValue(10),
  },
  dropDownTextStyle: {
    flex: 1,
  },
})
export default RequestDiffTime
