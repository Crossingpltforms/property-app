import React from 'react';
// import {CheckBox} from 'native-base';
import {View} from 'react-native';
import ExtrainfoStyle from './styles';

export default (props) => (
  <View style={{flex: 1}}>
    {/* <CheckBox
      checked={props.state[props.keyValue]}
      style={
        props.state[props.keyValue]
          ? ExtrainfoStyle.checkboxSelected
          : ExtrainfoStyle.checkboxUnSelected
      }
      onPress={props._toggleCheckBox(
        props.keyValue,
        !props.state[props.keyValue],
        props.formState,
      )}
      accessible={true}
      accessibilityLabel={
        props.accessibilityLabel || `extraInfoSellCheckbox${props.keyValue}`
      }
    /> */}
  </View>
);
