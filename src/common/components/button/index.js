import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Color, Matrics, Fonts } from '../../styles'

export const Button = ({
  label,
  onPress,
  customStyle,
  children,
  customTextStyle,
  customIcon,
  bgColor,
  color,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel='commonCompBtn'
    >
      <View
        style={[styles.buttonStyle, customStyle, { backgroundColor: bgColor }]}
      >
        {customIcon && <View style={styles.customIcon}>{customIcon}</View>}
        <Text
          style={[styles.buttonTextStyle, customTextStyle, { color: color }]}
        >
          {label}
        </Text>
        {children}
      </View>
    </TouchableOpacity>
  )
}
const styles = {
  buttonStyle: {
    backgroundColor: Color.darkRed,
    height: Matrics.ScaleValue(45),
    justifyContent: 'center',
    alignItems: 'center',
    width: Matrics.screenWidth - Matrics.ScaleValue(50),
    borderRadius: Matrics.ScaleValue(5),
  },
  buttonTextStyle: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    textAlign: 'center',
  },
  customIcon: {
    position: 'absolute',
    zIndex: 1,
    left: Matrics.ScaleValue(20),
  },
}
