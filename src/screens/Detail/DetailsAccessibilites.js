import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {Matrics} from '../../common/styles';

const DetailsAccessibilites = (props) => {
  const {ExtrainfoStyle, propertyInfo} = props;

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
        Accessibility
      </Text>
      <View
        style={{
          flex: 1,
          width: '85%',
          justifyContent: 'flex-start',
          marginTop: 10,
        }}>
        <FlatList
          data={propertyInfo.pois}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 5,
                marginRight: 5,
              }}>
              {/* <Icon name='place' color='#39D196' size={24} /> */}
              <Text
                numberOfLines={2}
                style={[
                  ExtrainfoStyle.PropertyInfoViewTabLabel,
                  {
                    marginLeft: 0,
                    marginRight: 10,
                    fontFamily: 'OpenSans-Regular',
                  },
                ]}>
                {item.name ? item.name : ''} -{' '}
                {item != undefined && item.distance ? item.distance : ''}
                {' m'}
              </Text>
            </View>
          )}
          numColumns={1}
        />
      </View>
    </View>
  );
};

export default DetailsAccessibilites;
