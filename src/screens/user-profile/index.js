import React, {Component} from 'react';
import {TouchableOpacity, Text, View, Image} from 'react-native';
import ErrorDialog from '../../components/ErrorDialog';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Http from '../../api/http';
import APICaller from '../../util/apiCaller';

import style from './style';

// Import Images
import imgRentalCollection from '../../../Images/More/payment-method.png';
import {No_IMAGE_LINK} from '../../common/constants';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorDialog: false,
      isLoading: false,
      userData: '',
      token: '',
      userId: '',
    };
  }

  displayError() {
    this.setState({showErrorDialog: true});
  }

  _navigationBack = () => this.props.navigation.goBack();

  _viewHeader() {
    return (
      <View
        style={{
          backgroundColor: '#FFE100',
          height: 50,
          width: '100%',
          padding: 10,
          justifyContent: 'center',
          shadowColor: 'black',
          marginBottom: 5,
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: {width: 0, height: 2},
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3, alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel="userProfileScreenBack">
              <Icon name="arrow-back" size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10,
              }}>
              Profile
            </Text>
          </View>
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.getUserInfo();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getUserInfo();
      },
    );
  }

  componentWillUnmount() {
    if (this.willFocusSubscription) this.willFocusSubscription.remove();
  }

  showLoader = () => {
    this.setState({isLoading: true});
  };

  hideLoader = () => {
    this.setState({isLoading: false});
  };

  getUserInfo() {
    if (!global.networkConnection) return;

    // this.showLoader();
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData;
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}/profile`,
        'GET',
        user_credentials.token,
        '',
      ).then((response) => {
        if (response.status === 200) {
          this.setState({userData: response.data});
        } else {
          this.displayError();
        }
      });
    }
    // this.hideLoader();
  }

  _renderInfoPart() {
    return (
      <View style={{flexDirection: 'column', marginTop: 10}}>
        <Image
          testID="profileImg"
          style={style.profileImg}
          source={{
            uri:
              this.state.userData && this.state.userData.avatar
                ? this.state.userData.avatar
                : No_IMAGE_LINK,
          }}
        />

        <Text style={style.TextStyleHeaderTag}>{this.state.userData.name}</Text>

        <Text style={[style.textStyle, {marginTop: 5}]}>
          {this.state.userData.email}
        </Text>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('EditPersonInfo')}
          accessible={true}
          accessibilityLabel="userProfileScreenEditNavBtn">
          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                style.textStyle,
                {
                  textDecorationLine: 'underline',
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#4885ED',
                },
              ]}>
              Edit Profile
            </Text>
            <Icon name="chevron-right" size={20} style={{color: '#4885ED'}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{flexDirection: 'column', flex: 1, backgroundColor: '#FFFFFF'}}>
        {this._viewHeader()}

        <View style={style.container}>
          {this._renderInfoPart()}

          <View
            style={{
              backgroundColor: 'grey',
              width: '100%',
              height: 2,
              marginTop: 20,
              marginBottom: 10,
            }}
          />
          <TouchableOpacity
            style={style.listStyle}
            onPress={() => {
              this.props.navigation.navigate('MyListing', {
                fromScreen: 'UserProfile',
              });
            }}
            accessible={true}
            accessibilityLabel="userProfileScreenMyListNavBtn">
            <Text style={[style.textStyle, {flex: 1}]}>My Listing</Text>
            <View>
              <Icon name="location-city" size={25} style={{color: '#000'}} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...style.listStyle, marginTop: 10}}
            onPress={() => {
              this.props.navigation.navigate('MyFavourites');
            }}
            accessible={true}
            accessibilityLabel="userProfileScreenMyFavNavBtn">
            <Text style={[style.textStyle, {flex: 1}]}>My Favourites</Text>
            <View>
              <Icon name="favorite-border" size={25} style={{color: '#000'}} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...style.listStyle, marginTop: 10}}
            onPress={() => {
              this.props.navigation.navigate('RentalCollection');
            }}
            accessible={true}
            accessibilityLabel="userProfileScreenRentalCollectionBtn">
            <Text style={[style.textStyle, {flex: 1}]}>Rental Collection</Text>
            <View>
              <Image
                testID="rentalCollection"
                source={imgRentalCollection}
                style={{width: 27, height: 27, resizeMode: 'contain'}}
              />
            </View>
          </TouchableOpacity>
        </View>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText="Oops!"
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({showErrorDialog: false});
          }}
        />
      </View>
    );
  }
}
function mapStateToProps({loginData}) {
  const {isUserLogin, userLoginData} = loginData;
  return {isUserLogin, userLoginData};
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
