import React from 'react';
import {View, Text, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const DetailsCover = (props) => {
  const {
    ExtrainfoStyle,
    didFinishInitialAnimation,
    focusedScreen,
    imagePosition,
    propertyInfo,
  } = props;

  return (
    <View style={{height: 350, width: width}}>
      {didFinishInitialAnimation && focusedScreen ? viewImages() : null}

      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          height: 30,
          width: 50,
          borderRadius: 15,
          marginLeft: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -50,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: '#FFF',
            fontFamily: 'OpenSans-SemiBold',
          }}>
          {`${imagePosition} / ${propertyInfo.images.length}`}
        </Text>
      </View>
    </View>
  );
};

export default DetailsCover;
