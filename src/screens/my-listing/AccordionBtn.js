import React from 'react'
import { TouchableOpacity, Text, View, Image } from 'react-native'
import imgDown from '../../../Images/More/drop-down-arrow.png'

import styles from './styles'

const AccordionBtn = (props) => {
  const { accordionText, onClick, isOpen } = props

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onClick}
      style={styles.category_View}
      accessible={true}
      accessibilityLabel='myListAccBtn'
    >
      <View style={styles.accordionContainer}>
        <View
          style={[styles.accordionInnerContainer, styles.accordionUpcoming]}
        />
        <Text style={[styles.text1, styles.accordionText]}>
          {accordionText}
        </Text>
      </View>
      <Image
        testID='down'
        source={imgDown}
        style={[
          styles.iconStyle,
          {
            transform: isOpen ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }],
          },
        ]}
      />
    </TouchableOpacity>
  )
}

export default AccordionBtn
