import React from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { Fonts, Color, Matrics } from '../../styles'

const RoundedInputText = (props) => {
  const {
    title,
    placeholder,
    alertMsg = '',
    value = '',
    showAlert,
    pasteOption = true,
    keyboardType = 'default',
    maxLength = null,
    onChangeText,
    accessibilityLabel,
  } = props
  console.log('props', props)
  return (
    <View style={styles.formInputRoot}>
      <Text style={styles.text1}> {title}</Text>
      <TextInput
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        style={styles.formInput}
        placeholder={placeholder}
        value={value}
        contextMenuHidden={pasteOption}
        onChangeText={(val) => onChangeText(val)}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {showAlert && <Text style={styles.formTextError}>{alertMsg}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  text1: {
    fontSize: Matrics.ScaleValue(16),
    fontFamily: Fonts.type.OpenSansMedium,
    color: Color.black,
  },
  formInputRoot: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: Matrics.screenWidth - Matrics.ScaleValue(30),
    marginTop: Matrics.ScaleValue(20),
  },
  formInput: {
    width: Matrics.screenWidth - Matrics.ScaleValue(30),
    borderColor: Color.btnLightBorder,
    padding: Matrics.ScaleValue(10),
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(10),
    marginTop: Matrics.ScaleValue(10),
    fontSize: Matrics.ScaleValue(16),
    lineHeight: Matrics.ScaleValue(20),
  },
  formTextError: {
    fontSize: Matrics.ScaleValue(10),
    color: Color.darkRed,
    fontWeight: 'normal',
    marginTop: 1,
  },
})

export default RoundedInputText
