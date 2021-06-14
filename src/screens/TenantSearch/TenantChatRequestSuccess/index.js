import React, {Component} from 'react';
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import PaperPlaneImg from '../../../../Images/paper-plane.png';

import {styles} from './styles';

const {width, height} = Dimensions.get('window');

class TenantChatRequestSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleGotoChat = () => {
    this.exit();
    this.props.handleGotoChat();
  };

  exit = () => {
    this.props.toggleModal(!this.props.modalVisible);
  };

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}>
        <View
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.5)',
            height: height,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              height: 325,
              width: '90%',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderRadius: 5,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                flexDirection: 'row',
                backgroundColor: '#FF0055',
                height: 40,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#FFFFFF',
                  paddingLeft: 15,
                }}>
                Thank you
              </Text>
              <TouchableOpacity
                onPress={() => this.exit()}
                style={{paddingRight: 15}}
                accessible={true}
                accessibilityLabel="tenantChatReqScreenClearBtn">
                <Icon name="clear" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Image
              testID="paperPlane"
              source={PaperPlaneImg}
              resizeMode={'contain'}
              style={{
                width: '20%',
                height: undefined,
                aspectRatio: 1,
                marginTop: 20,
                marginBottom: 15,
              }}
            />
            <Text
              style={{
                maxHeight: 75,
                flex: 1,
                fontSize: 20,
                textAlign: 'center',
                fontFamily: 'OpenSans-Bold',
                color: '#000000',
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 15,
              }}>
              Thank you. Chat request sent successfully.
            </Text>

            <Text
              style={{
                maxHeight: 25,
                flex: 1,
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'OpenSans-Regular',
                color: '#000000',
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              Communicate even quicker on the app
            </Text>

            <TouchableOpacity
              style={{width: '90%', marginTop: 15, marginBottom: 15}}
              onPress={() => {
                this.handleGotoChat();
              }}
              accessible={true}
              accessibilityLabel="tenantChatReqScreenGoChatBtn">
              <View
                style={[
                  styles.textStyleHousingType,
                  {
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#4885ED',
                  },
                ]}>
                <Text style={{textAlign: 'center', color: '#4885ED'}}>
                  Go to Chat
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default TenantChatRequestSuccess;
