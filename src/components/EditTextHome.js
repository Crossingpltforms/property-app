import React from 'react'
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { styles } from '../styles/EditTextStyleHome'
import { Matrics } from '../common/styles'

const EditTextHome = ({
  type,
  onPress,
  onChangeType,
  onSelect,
  onChangeText,
  onSubmitEditing,
  value
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onChangeType}
        style={{ flexDirection: 'row', alignItems: 'center' }}
        accessible={true}
        accessibilityLabel='homeImageBtn'
      >
        <Image
          testID='home'
          source={require('../../Images/home.png')}
          style={{
            height: Matrics.ScaleValue(20),
            width: Matrics.ScaleValue(20),
            marginLeft: Matrics.ScaleValue(5),
            marginRight: Matrics.ScaleValue(5)
          }}
        />
        <Text style={styles.TextStyleHeaderTag}>{type}</Text>
        <Icon
          name='keyboard-arrow-down'
          size={Matrics.ScaleValue(20)}
          style={{ color: '#707070' }}
        />
      </TouchableOpacity>
      <View
        style={{
          height: Matrics.ScaleValue(22),
          width: 1,
          backgroundColor: 'black',
          marginLeft: Matrics.ScaleValue(5)
        }}
      />
      <TouchableOpacity
        onPress={onSelect}
        style={{ flexDirection: 'row', flex: 3 }}
        accessible={true}
        accessibilityLabel='areaNameBtn'
      >
        <TextInput
          testID='areaName'
          onFocus={onSelect}
          onTouchStart={() => onSelect}
          pointerEvents='none'
          editable={false}
          style={[styles.styleEdittext]}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder='Type in Area / Property Name'
          value={value}
          accessible={true}
          accessibilityLabel='editTextHomeSearchPropertyTextBox'
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: 'absolute',
          paddingRight: Matrics.ScaleValue(5),
          paddingLeft: Matrics.ScaleValue(10)
        }}
        accessible={true}
        accessibilityLabel='editTextHomeSearchIconBtn'
      >
        <Icon
          name='search'
          style={{ color: '#707070', fontSize: Matrics.ScaleValue(20) }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default EditTextHome
