import React from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { styles } from '../styles/EditTextStyleHome'

const EditText = ({
  type,
  onPress,
  onChangeType,
  onSelect,
  onChangeText,
  onSubmitEditing,
  value,
  onBack,
  clearSearch
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={{ flexDirection: 'row', paddingLeft: 5, alignItems: 'center' }}
        accessible={true}
        accessibilityLabel='keyboardLeftBtn'
      >
        <Icon
          name='keyboard-arrow-left'
          size={35}
          style={{ color: '#707070' }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onChangeType}
        style={{ flexDirection: 'row', marginLeft: 5, alignItems: 'center' }}
        accessible={true}
        accessibilityLabel='keyboardDownBtn'
      >
        <Text style={styles.TextStyleHeaderTag}>{type}</Text>
        <Icon
          name='keyboard-arrow-down'
          size={20}
          style={{ color: '#707070' }}
        />
      </TouchableOpacity>
      <View
        style={{
          height: 22,
          width: 1,
          backgroundColor: 'black',
          marginLeft: 5
        }}
      />
      <TouchableOpacity
        onPress={onSelect}
        style={{ flexDirection: 'row', flex: 3 }}
        accessible={true}
        accessibilityLabel='editTextSearchBtn'
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
          accessibilityLabel='editTextSearchPropertyTextBox'
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={value !== '' ? clearSearch : onPress}
        style={{
          position: 'absolute',
          paddingRight: 5,
          paddingLeft: 10,
          backgroundColor: 'white'
        }}
        accessible={true}
        accessibilityLabel='editTextSearchIconBtn'
      >
        {value == '' && (
          <Icon name='search' style={{ color: '#707070', fontSize: 20 }} />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default EditText
