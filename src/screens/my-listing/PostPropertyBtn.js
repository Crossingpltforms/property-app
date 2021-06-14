import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'

import styles from './styles'
const PostPropertyBtn = (props) => {
  return (
    <View style={styles.postPropertyBtnContainer}>
      <TouchableOpacity
        onPress={props.onClick}
        style={[styles.category_View, styles.postPropertyBtn]}
        accessible={true}
        accessibilityLabel='postPropNewBtn'
      >
        <View style={styles.postPropertyBtnInnerWrapper}>
          <Icon name='add' size={25} color='#4885ED' />
          <Text style={[styles.text1, styles.postPropertyBtnText]}>
            Post a Property
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default PostPropertyBtn
