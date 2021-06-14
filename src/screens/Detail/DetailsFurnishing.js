import React from 'react';
import {View, Text} from 'react-native';
import {Matrics} from '../../common/styles';

const DetailsFurnishing = (props) => {
  const {ExtrainfoStyle, propertyInfo, getName} = props;
  var data = '';
  propertyInfo &&
    propertyInfo.furnishes &&
    propertyInfo.furnishes.map((item, index) => {
      return (data =
        data +
        getName(
          item.replace('_', ' ') +
            (index == propertyInfo.furnishes.length - 1 ? '' : ', '),
        ));
    });
  return (
    <View
      style={[
        ExtrainfoStyle.furnishingView,
        {
          alignItems: 'flex-start',
          paddingLeft: 10,
          marginVertical: Matrics.ScaleValue(10),
        },
      ]}>
      <Text
        style={{
          fontSize: 15,
          textAlign: 'left',
          fontWeight: '600',
          color: '#000',
          fontFamily: 'OpenSans-SemiBold',
        }}>
        Furnishing
      </Text>
      <View
        style={{
          flex: 1,
          width: '85%',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Text
          style={[
            ExtrainfoStyle.PropertyInfoViewTabLabel,
            {
              marginLeft: 0,
              marginRight: 10,
              fontFamily: 'OpenSans-Regular',
            },
          ]}>
          {data}
        </Text>
      </View>
    </View>
  );
};

export default DetailsFurnishing;
