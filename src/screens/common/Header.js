import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';

import HeaderStyle from '../../styles/Header.style';

const Header = (props) => {
  const {
    headerTitle,
    disableBackNavigation,
    myReferees = false,
    onMyRefereesPress,
    onBackPress = () => props.navigation.goBack(), // default behaviour
  } = props;
  return (
    <View style={HeaderStyle.header}>
      {(disableBackNavigation === undefined || !disableBackNavigation) && (
        <TouchableOpacity
          onPress={onBackPress}
          accessible={true}
          accessibilityLabel="headerBackArrow">
          <Icon
            name="arrow-back"
            size={30}
            style={HeaderStyle.headerLeftArrow}
          />
        </TouchableOpacity>
      )}
      <Text style={HeaderStyle.headerTitle}>{headerTitle}</Text>
      {myReferees == true && (
        <View style={HeaderStyle.myRefreesViewContainer}>
          <TouchableOpacity
            style={HeaderStyle.myRefreesButtonContainer}
            onPress={onMyRefereesPress}
            accessible={true}
            accessibilityLabel="headerMyRef">
            <Text style={HeaderStyle.myRefreeButtonTextStyle}>My Referees</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default withNavigation(Header);
