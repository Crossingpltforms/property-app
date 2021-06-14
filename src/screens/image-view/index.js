import React, { Component } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
  BackHandler,
  Share,
  AppState,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Carousel from 'react-native-banner-carousel'
import { Icon } from 'react-native-elements'

import YouTube from '../../util/youtubeController'
import { withNavigationFocus } from 'react-navigation'

// Import style
import ExtrainfoStyle from './styles'
import { No_IMAGE_LINK } from '../../common/constants'
import LightBox from '../Detail/LightBoxImageView'

const { width } = Dimensions.get('window')

class ImageView extends Component {
  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      modalVisible: false,
      imageUri: undefined,
      favItemId: props.navigation.state.params.propertyInfo.favItemId
        ? props.navigation.state.params.propertyInfo.favItemId
        : '',
      isLogin: false,
      favProperty: props.navigation.state.params.propertyInfo.isfav
        ? true
        : false,
      alert_message: null,
      page: 0,
      relatedPropertiesList: '',
      userId: '',
      propertyInfo: props.navigation.state.params.propertyInfo.propertyData
        ? props.navigation.state.params.propertyInfo.propertyData
        : props.navigation.state.params.propertyInfo,
      reloading: false,
      reloadListFav: props.navigation.state.params.propertyInfo.reloadListFav,
      isActiveProperty: props.navigation.state.params.propertyInfo.active,
      imagePosition: 1,
      appState: '',
      focusedScreen: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    )
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    )

    AppState.addEventListener('change', this._handleAppState)
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      this.setState({
        userId:
          user_information && user_information.userId
            ? user_information.userId
            : '',
      })
      this.setState({ isLogin: user_information ? true : false })
    }
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppState)
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  _handleAppState = (next) => {
    this.setState({
      appState: next,
    })
  }

  _navigationBack = () => {
    console.log('yes from inside')
    this.props.navigation.goBack()
  }

  handleBackButtonClick() {
    console.log('called')
    this._navigationBack()
    return true
  }

  _toggleCheckBox = (key_name, value, form_state) => () =>
    this.setState({
      ...this.state,
      [form_state]: { ...this.state[form_state], [key_name]: value },
    })

  toggleModal(visible) {
    this.setState({ modalVisible: visible })
  }

  shareDetails = async () => {
    try {
      const shareURL = `https://speedhome.com/ads/${encodeURIComponent(
        this.state.propertyInfo.name
      )}-${this.state.propertyInfo.ref}`
      const result = await Share.share({
        message: shareURL,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }
  _handleAppStateChange = () => {
    if (this.state.appState === '') {
      return this.setState({
        appState: AppState.currentState,
      })
    }
    return null
  }

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
          shadowOpacity: 0.2,
          elevation: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{ flex: 2.5, alignItems: 'center', flexDirection: 'row' }}
          >
            <TouchableOpacity
              onPress={() => this._navigationBack()}
              accessible={true}
              accessibilityLabel='imageViewBackBtn'
            >
              <Icon name='arrow-back' size={30} />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10,
              }}
            >
              {this.state.propertyInfo.name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            {this.state.propertyInfo.active && (
              <TouchableOpacity
                onPress={() => this.shareDetails()}
                style={{ marginLeft: 5, paddingHorizontal: 5 }}
                accessible={true}
                accessibilityLabel='imageViewShareIconBtn'
              >
                <Icon name='share' size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    )
  }
  // getVideoId = url => {
  //   const id = url.split('/')

  //   return `${id[4].toString()}`
  // }

  // renderPage (image, index) {
  //   let regexForyoutubeLink =
  //     '(?:[hH][tT]{2}[pP][sS]{0,1}://)?[wW]{0,3}.{0,1}[yY][oO][uU][tT][uU](?:.[bB][eE]|[bB][eE].[cC][oO][mM])?/(?:(?:[wW][aA][tT][cC][hH])?(?:/)??(?:.*)?[vV]=([a-zA-Z0-9--]+).*|([A-Za-z0-9--]+))'
  //   let regexexp = new RegExp(regexForyoutubeLink, 'g')

  //   return (
  //     <>
  //       {regexexp.test(image.url) ? (
  //         <View
  //           key={index}
  //           style={{
  //             backgroundColor: 'transparent',
  //             height: '90%',
  //             width,
  //             justifyContent: 'center',
  //             alignItems: 'center'
  //           }}
  //         >
  //           <YouTube
  //             arrImages={this.state.propertyInfo.images}
  //             position={this.state.imagePosition}
  //             videoId={this.getVideoId(image.url)}
  //           />
  //         </View>
  //       ) : (
  //         <TouchableOpacity
  //           activeOpacity={1}
  //           style={{ height: '100%', width: width }}
  //           key={index}
  //         >
  //           <Image
  //             key={index}
  //             source={{ uri: image.url ? image.url : No_IMAGE_LINK }}
  //             resizeMode='cover'
  //             style={[
  //               ExtrainfoStyle.imgStyle,
  //               {
  //                 backgroundColor: '#cccccc',
  //                 height: '100%',
  //                 marginTop: 0
  //               }
  //             ]}
  //           />
  //         </TouchableOpacity>
  //       )}
  //     </>
  //   )
  // }

  // viewImages () {
  //   return (
  //     <View>
  //       <Carousel
  //         style={[ExtrainfoStyle.backgroundImage]}
  //         autoplay={false}
  //         autoplayTimeout={3000}
  //         loop
  //         index={0}
  //         pageSize={width}
  //         pageIndicatorStyle={{ backgroundColor: 'white' }}
  //         activePageIndicatorStyle={{ backgroundColor: '#FF0054' }}
  //         onPageChanged={index => {
  //           this.setState({ imagePosition: index + 1 })
  //         }}
  //       >
  //         {this.state.propertyInfo.images.map((image, index) =>
  //           this.renderPage(image, index)
  //         )}
  //       </Carousel>
  //     </View>
  //   )
  // }

  render() {
    let sortedImageList = []
    const currentIndex = this.props.navigation.state.params.currentIndex
      ? this.props.navigation.state.params.currentIndex
      : 0
    if (this.state.propertyInfo.images) {
      const getItemWithAndAfterCurrentIndex = this.state.propertyInfo.images.slice(
        currentIndex
      )
      const getPreviousItemsBeforeCurrentIndex = this.state.propertyInfo.images.slice(
        0,
        currentIndex
      )

      sortedImageList = [
        ...getItemWithAndAfterCurrentIndex,
        ...getPreviousItemsBeforeCurrentIndex,
      ]
    }

    return (
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        {this._viewHeader()}
        {this._handleAppStateChange()}
        <View
          style={[
            ExtrainfoStyle.root,
            {
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {this.state.focusedScreen &&
          sortedImageList &&
          sortedImageList.length > 0 ? (
            <LightBox imageData={sortedImageList} />
          ) : (
            <View />
          )}
        </View>
      </View>
    )
  }
}

function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ImageView))
