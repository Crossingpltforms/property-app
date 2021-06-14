import React from 'react'
// import { CheckBox } from 'native-base'
import CheckBox from 'react-native-check-box'
import { View } from 'react-native'
import ExtrainfoStyle from '../../styles/Extrainfo.style'

const CustomCheckBox = (props) => (
  <View style={{ flex: 1 }}>
    <CheckBox
      isChecked={props.state[props.keyValue]}
      style={
        props.state[props.keyValue]
          ? ExtrainfoStyle.checkboxSelected
          : ExtrainfoStyle.checkboxUnSelected
      }
      onClick={props._toggleCheckBox(
        props.keyValue,
        !props.state[props.keyValue],
        props.formState
      )}
      accessible={true}
      accessibilityLabel={
        props.accessibilityLabel || `extraInfoSellCheckbox${props.keyValue}`
      }
    />
  </View>
)

export default CustomCheckBox
