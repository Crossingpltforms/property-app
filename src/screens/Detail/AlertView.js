import React from 'react';
import {View, Text} from 'react-native';

const AlertView = (props) => {
  const {alert_message} = props;

  if (!alert_message) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'black',
        width: '90%',
        left: '5%',
        height: 70,
        bottom: '20%',
        zIndex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
      }}>
      <Text
        style={{
          fontSize: 15,
          color: 'white',
        }}>
        {alert_message.replace('null', 'empty')}
      </Text>
    </View>
  );
};

export default AlertView;
