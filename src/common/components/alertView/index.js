import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Color, Fonts } from '../../styles';

const AlertView = (message) => {
  return (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: Color.black,
        width: '90%',
        height: 50,
        bottom: '10%',
        zIndex: 1,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: Color.white,
          fontFamily: Fonts.type.OpenSansMedium,
        }}
      >
        {message.replace('null', 'empty')}
      </Text>
    </View>
  );
};

export default AlertView;
