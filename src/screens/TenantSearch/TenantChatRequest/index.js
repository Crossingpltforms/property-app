import React, {Component} from 'react';
import {Modal, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';

import {styles} from './styles';

const {width, height} = Dimensions.get('window');

class TenantChatRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = () => {
    this.exit();
    this.props.handleConfirm();
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
              height: 275,
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
                Contact Tenant
              </Text>
              <TouchableOpacity
                onPress={() => this.exit()}
                style={{paddingRight: 15}}
                accessible={true}
                accessibilityLabel="tenantSearchReqChatClearBtn">
                <Icon name="clear" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                maxHeight: 125,
                flex: 1,
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'OpenSans-Bold',
                color: '#000000',
                paddingTop: 15,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 5,
              }}>
              {`${
                this.props.tenant.name || ''
              } is looking to rent around your area with a budget of RM ${
                this.props.budget || '0'
              } . Do you want to start a chat with him/her?`}
            </Text>

            <Text
              style={{
                flex: 1,
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'OpenSans-Regular',
                color: '#000000',
                paddingLeft: 20,
                paddingRight: 20,
                maxHeight: 40,
              }}>
              Communicate even quicker on the app
            </Text>

            <TouchableOpacity
              style={{width: '90%', marginTop: 5, marginBottom: 15}}
              onPress={() => {
                this.handleSubmit();
              }}
              accessible={true}
              accessibilityLabel="tenantSearchChatWithTenantBtn">
              <View
                style={[
                  styles.textStyleHousingType,
                  {backgroundColor: '#4885ED'},
                ]}>
                <Text style={{textAlign: 'center', color: '#FFFFFF'}}>
                  Chat with tenant
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default TenantChatRequest;
