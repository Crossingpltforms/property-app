import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  BackHandler
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import Header from '../common/Header'
import NetcoreSDK from 'smartech-react-native'
// import Icon from "react-native-vector-icons/FontAwesome";
import { Icon } from 'react-native-elements'
import Icon4 from '../../../Images/Icon4.png'
import Icon5 from '../../../Images/Icon5.png'
import Icon6 from '../../../Images/Icon6.png'
import Icon7 from '../../../Images/Icon7.png'
import Icon8 from '../../../Images/Icon8.png'
import styles from './styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import { withNavigationFocus } from 'react-navigation'
import { Matrics } from '../../common/styles'
import HeaderStyle from '../../styles/Header.style'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob'
import { trackerEventSubmit } from '../../util/trackEventNames'
import { logEvent, events } from '../../util/fbAnalytics'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MultiImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-action-sheet'
// import firebase from 'react-native-firebase'
import analytics from '@react-native-firebase/analytics'
import ErrorDialog from '../../components/ErrorDialog'
import { No_IMAGE_LINK, NETCORE_TRACK_EVENT } from '../../common/constants'

var BUTTONSiOS = ['Take a photo', 'Gallery', 'Cancel']

var BUTTONSandroid = ['Take a photo', 'Gallery']

var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 2

class UploadPhoto extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      coverPhotoId: 0,
      avatarSource: [],
      need_a_photo_grapher: true,
      loading_photo: false,
      uploading_photo: false,
      uploaded_photo_count: 0,
      posting_property: false,
      propertyID: null,
      alertMessage: '',
      selectedPhoto: null,
      bodyData: this.props.navigation.state.params.bodyData,
      setInitialStateCP: this.props.navigation.state.params.setInitialStateCP,
      photoStyle: styles.photoSelectedBorder,
      photoStyleArray: [],
      propertyAccessibility: ''
    }

    this.state = {
      showErrorDialog: false,
      ...this.initialState
    }
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this._handleBackButtonClick
    )
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButtonClick
    )
  }

  _handleBackButtonClick = () => {
    this.props.navigation.goBack()
    return true
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params
    if (id) {
      this.setState({ ...this.state, propertyID: id })
    }
    AsyncStorage.getItem('avatarSource').then((as) => {
      if (as) {
        this.setState({
          ...this.state,
          avatarSource: JSON.parse(as).avatarSource
        })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // this._navigateMyListing();
    }
  }

  _updateNeedPhotoGrapher = (val) => () =>
    this.setState({ ...this.state, need_a_photo_grapher: val })

  _navigateMyListing = () => {
    if (!global.networkConnection) return
    this.setState({
      ...this.state,
      posting_property: true
    })

    if (this.state.avatarSource.length >= 4) {
      if (this.props.isUserLogin == false) {
        let user_credentials = this.props.userLoginData
        this.setState({
          ...this.state,
          posting_property: false
        })
        this.props.navigation.navigate('Number', {
          screenName: 'UploadPhoto'
        })
        return
      } else {
        if (this.state.propertyID) {
          this.setState({
            posting_property: false,
            uploading_photo: true
          })
          this._UploadPhotoApi(this.state.propertyID, 0)
        } else {
          this.getUserInfo()
        }
      }
    } else {
      this.setState({
        ...this.state,
        posting_property: false,
        alertMessage: 'Please select atleast four photos.'
      })
      this._hideAlertView()
    }
  }

  getUserInfo() {
    if (!global.networkConnection) return
    if (this.props.isUserLogin == true) {
      let user_credentials = this.props.userLoginData
      APICaller(
        `${Http.profileDetails(user_credentials.userId)}`,
        'GET',
        user_credentials.token,
        ''
      ).then((response) => {
        this.setState({
          posting_property: false
        })
        if (response.status === 200) {
          if (response.data.locked === false) {
            this._createPropertyApi()
          } else {
            this.setState({
              ...this.state,
              posting_property: false,
              alertMessage:
                'Your account is restricted, please contact hello@speedhome.com'
            })
            this._hideAlertView()
          }
        } else {
          this.displayError()
        }
      })
    }
  }

  _createPropertyApi() {
    const bodyData = this.props.navigation.getParam('bodyData')
    if (!global.networkConnection) return
    try {
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.createProperty}`,
          'POST',
          user_information.token,
          JSON.stringify(bodyData)
        ).then((json) => {
          if (!json) {
            this.setState({
              ...this.state,
              posting_property: false
            })
            return
          }
          if (json.status === 200) {
            analytics().logEvent(
              trackerEventSubmit.postProperty.action
                .createListingClickPhotoContinue
            )
            logEvent(
              trackerEventSubmit.postProperty.action
                .createListingClickPhotoContinue
            )
            const NetCorePayload = {
              Name: bodyData.name,
              Phone_number: user_information.phone,
              Email_address: this.props.userLoginProfileData
                ? this.props.userLoginProfileData.email
                : '',
              Property_value: bodyData.price,
              Area_of_property: bodyData.address
            }
            NetcoreSDK.track(NETCORE_TRACK_EVENT.POST_PROPERTY, NetCorePayload)

            const bData = this.state.bodyData
            bData['latitude'] = json.data.latitude
            bData['longitude'] = json.data.longitude
            bData['description'] = json.data.description
            const locationLat = json.data.latitude
            const locationLang = json.data.longitude
            const obj = { locationLat, locationLang }
            AsyncStorage.setItem('locationLatLang', JSON.stringify(obj))
            this.setState({ propertyID: json.data.id, bodyData: bData })
            this.addEventTracking(json.data.id)
            this.setState({
              posting_property: false,
              uploading_photo: true
            })
            this._UploadPhotoApi(json.data.id, 0)
          } else {
            this.setState({
              ...this.state,
              posting_property: false
            })
            this._hideAlertView()
            this.displayError()
          }
        })
      }
    } catch (err) {
      alert(err)
      this.setState({
        posting_property: false
      })
      return
    }
  }

  displayError() {
    this.setState({ showErrorDialog: true })
  }

  addEventTracking = (propertyId) => {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const body = {
        attr: 'CreateListing',
        id: propertyId
      }
      APICaller(
        Http.eventTrackig,
        'POST',
        user_information.token,
        JSON.stringify(body)
      ).then((json) => {
        if (json.status !== 200) {
          // TODO crashlytics
        }
      })
    }
  }

  _UploadPhotoApi(propertyId, index) {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      if (this.state.avatarSource[index].data) {
        const res = this.state.avatarSource[index].data
        const uploaded = this.state.avatarSource[index].uploaded
        if (uploaded === true) {
          if (index === this.state.avatarSource.length - 1) {
            this.setState({
              ...this.state,
              uploading_photo: false,
              uploaded_photo_count: 0
            })
            analytics().logEvent(
              trackerEventSubmit.postProperty.action.uploadPhotos
            )
            logEvent(trackerEventSubmit.postProperty.action.uploadPhotos)
            this.state.setInitialStateCP()
            this.props.navigation.navigate('Extrainfo', {
              bodyData: this.state.bodyData,
              id: propertyId
            })
          } else {
            this.setState({
              uploaded_photo_count: index + 1
            })
            this._UploadPhotoApi(propertyId, index + 1)
          }
        } else {
          let rotationAngle = 0

          if (
            this.state.photoStyleArray[index].transform[0].rotate === '0deg'
          ) {
            rotationAngle = 0
          } else if (
            this.state.photoStyleArray[index].transform[0].rotate === '90deg'
          ) {
            rotationAngle = 90
          } else if (
            this.state.photoStyleArray[index].transform[0].rotate === '180deg'
          ) {
            rotationAngle = 180
          } else if (
            this.state.photoStyleArray[index].transform[0].rotate === '270deg'
          ) {
            rotationAngle = 270
          } else if (
            this.state.photoStyleArray[index].transform[0].rotate === '360deg'
          ) {
            rotationAngle = 360
          }

          Image.getSize(res.uri, (width, height) => {
            ImageResizer.createResizedImage(
              res.uri,
              width,
              height,
              'JPEG',
              80,
              rotationAngle
            ).then((rotationImage) => {
              RNFetchBlob.fs
                .readFile(rotationImage.path, 'base64')
                .then((data) => {
                  let body = {
                    image: data,
                    coverPhoto: index === this.state.coverPhotoId ? true : false
                  }
                  try {
                    APICaller(
                      `${Http.createProperty}/${propertyId}/images`,
                      'POST',
                      user_information.token,
                      JSON.stringify(body)
                    ).then((json) => {
                      if (!json) return
                      if (json.status === 1000) {
                        if (!this.state.avatarSource[index].uploaded) {
                          this._UploadPhotoApi(propertyId, index)
                        }
                      } else if (json.status === 200) {
                        this.state.avatarSource[index].uploaded = true
                        if (index === this.state.avatarSource.length - 1) {
                          this.setState({
                            ...this.state,
                            uploading_photo: false,
                            uploaded_photo_count: 0
                          })
                          analytics().logEvent(
                            trackerEventSubmit.postProperty.action.uploadPhotos
                          )
                          logEvent(
                            trackerEventSubmit.postProperty.action.uploadPhotos
                          )
                          this.state.setInitialStateCP()
                          this.props.navigation.navigate('Extrainfo', {
                            bodyData: this.state.bodyData,
                            id: propertyId
                          })
                        } else {
                          this.setState({
                            uploaded_photo_count: index + 1
                          })
                          this._UploadPhotoApi(propertyId, index + 1)
                        }
                      } else {
                        this.setState({
                          ...this.state,
                          uploading_photo: false
                        })
                        this.displayError()
                      }
                    })
                  } catch (err) {
                    this.setState({
                      ...this.state,
                      uploading_photo: false
                    })
                    alert(err)
                  }
                })
            })
          })
        }
      } else {
        this.setState({
          ...this.state,
          uploading_photo: false
        })
        alert('Error in uploading.')
      }
    }
  }

  _imagePicker() {
    this.setState({ ...this.state, loading_photo: true })

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        (status) => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ).then((storagePermission) => {
              if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                // this._imagePickerLogin();
                ActionSheet.showActionSheetWithOptions(
                  {
                    options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    tintColor: 'blue'
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      this._cameraPicker()
                    } else if (buttonIndex === 1) {
                      this._imagePickerLogin()
                    } else {
                      this.setState({ ...this.state, loading_photo: false })
                    }
                  }
                )
              } else {
                alert('Storage permission not given')
              }
            })
          } else {
            alert('Permission not granted')
          }
        }
      )
    } else {
      // this._imagePickerLogin();
      ActionSheet.showActionSheetWithOptions(
        {
          options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: 'blue'
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            this._cameraPicker()
          } else if (buttonIndex === 1) {
            this._imagePickerLogin()
          } else {
            this.setState({ ...this.state, loading_photo: false })
          }
        }
      )
    }
  }

  _cameraPicker() {
    MultiImagePicker.openCamera({
      waitAnimationEnd: false,
      includeExif: true
      // forceJpg: true,
    })
      .then((image) => {
        let totalImages = image.length + this.state.avatarSource.length

        if (totalImages > 12) {
          alert('You can select Max 12 Photos')

          this.setState({ ...this.state, loading_photo: false })
        } else {
          ImageResizer.createResizedImage(
            image.path,
            image.width,
            image.height,
            'JPEG',
            80
          )
            .then((res) => {
              RNFetchBlob.fs
                .readFile(res.path, 'base64')
                .then((data) => {
                  //------- Use compressed image
                  const source = {
                    uri: res.uri ? res.uri : No_IMAGE_LINK,
                    base64: data
                  }
                  var isPhotoAvailable = false
                  this.state.avatarSource.map((res) => {
                    if (source.base64 === res.data.base64) {
                      alert(
                        'You are trying to upload same file! Please upload a different and unique file.'
                      )
                      isPhotoAvailable = true
                      return
                    }
                  })
                  if (!isPhotoAvailable) {
                    if (this.state.selectedPhoto != null) {
                      let avatarSource = [...this.state.avatarSource]
                      avatarSource[this.state.selectedPhoto].data = source

                      this.setState({
                        avatarSource
                      })

                      // this.setState({
                      //   ...this.state,
                      //   photoStyleArray: (this.state.photoStyleArray[
                      //     this.state.selectedPhoto
                      //   ] = this.state.photoStyle)
                      // });

                      AsyncStorage.setItem(
                        'avatarSource',
                        JSON.stringify({
                          avatarSource: {
                            data: this.state.avatarSource,
                            uploaded: false
                          }
                        })
                      )

                      this.setState({ ...this.state, loading_photo: false })
                    } else {
                      this.setState({
                        ...this.state,
                        avatarSource: [
                          ...this.state.avatarSource,
                          { data: source, uploaded: false }
                        ]
                      })

                      this.setState({
                        ...this.state,
                        photoStyleArray: [
                          ...this.state.photoStyleArray,
                          this.state.photoStyle
                        ]
                      })

                      AsyncStorage.setItem(
                        'avatarSource',
                        JSON.stringify({
                          avatarSource: [
                            ...this.state.avatarSource,
                            { data: source, uploaded: false }
                          ]
                        })
                      )

                      this.setState({ ...this.state, loading_photo: false })
                    }
                  }
                })
                .catch(() => {
                  this.setState({ ...this.state, loading_photo: false })
                })
            })
            .catch(() => {
              this.setState({ ...this.state, loading_photo: false })
            })
        }
      })
      .catch(() => {
        this.setState({ ...this.state, loading_photo: false })
      })
  }

  _imagePickerLogin() {
    MultiImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      // forceJpg: true,
      maxFiles: 12,
      mediaType: 'photo'
    })
      .then((images) => {
        let totalImages = images.length + this.state.avatarSource.length

        if (totalImages > 12) {
          alert('You can select Max 12 Photos')
          this.setState({ ...this.state, loading_photo: false })
        } else {
          images.map((i) => {
            ImageResizer.createResizedImage(
              i.path,
              i.width,
              i.height,
              'JPEG',
              80
            )
              .then((res) => {
                RNFetchBlob.fs
                  .readFile(res.path, 'base64')
                  .then((data) => {
                    //------- Use compressed image
                    const source = {
                      uri: res.uri ? res.uri : No_IMAGE_LINK,
                      base64: data
                    }
                    var isPhotoAvailable = false
                    this.state.avatarSource.map((res) => {
                      if (source.base64 === res.data.base64) {
                        alert(
                          'You are trying to upload same file! Please upload a different and unique file.'
                        )
                        isPhotoAvailable = true
                        return
                      }
                    })
                    if (!isPhotoAvailable) {
                      if (this.state.selectedPhoto != null) {
                        let avatarSource = [...this.state.avatarSource]
                        avatarSource[this.state.selectedPhoto].data = source

                        this.setState({
                          avatarSource
                        })

                        AsyncStorage.setItem(
                          'avatarSource',
                          JSON.stringify({
                            avatarSource: {
                              data: this.state.avatarSource,
                              uploaded: false
                            }
                          })
                        )
                      } else {
                        this.setState({
                          ...this.state,
                          avatarSource: [
                            ...this.state.avatarSource,
                            { data: source, uploaded: false }
                          ]
                        })

                        this.setState({
                          ...this.state,
                          photoStyleArray: [
                            ...this.state.photoStyleArray,
                            this.state.photoStyle
                          ]
                        })

                        AsyncStorage.setItem(
                          'avatarSource',
                          JSON.stringify({
                            avatarSource: [
                              ...this.state.avatarSource,
                              { data: source, uploaded: false }
                            ]
                          })
                        )
                      }
                    }
                    this.setState({ ...this.state, loading_photo: false })
                  })
                  .catch(() => {
                    this.setState({ ...this.state, loading_photo: false })
                  })
              })
              .catch(() => {
                this.setState({ ...this.state, loading_photo: false })
              })
          })
        }
      })
      .catch(() => {
        this.setState({ ...this.state, loading_photo: false })
      })
  }

  AlertView = (message) => (
    <View
      style={{
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: '#FF0054',
        width: '90%',
        height: 80,
        bottom: '20%',
        zIndex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: 'white'
        }}
      >
        {message === '' ? 'Error in server' : message.replace('null', 'empty')}
      </Text>
    </View>
  )

  _hideAlertView() {
    setTimeout(() => this.setState({ ...this.state, alertMessage: '' }), 2000)
  }

  _setCoverPhoto(i) {
    this.setState({ coverPhotoId: i })
  }

  viewHeader() {
    return (
      <View style={HeaderStyle.header}>
        <Text style={HeaderStyle.headerTitle}>Upload Photo</Text>
      </View>
    )
  }
  postPropertyLoader() {
    return (
      <View style={styles.uplaodPhotoLoaderContainer}>
        <View style={styles.uplaodPhotoLoaderWrapper}>
          <ActivityIndicator
            size='large'
            color='black'
            style={{ marginBottom: 5 }}
          />
          <Text style={styles.uplaodPhotoLoaderText}>posting property...</Text>
        </View>
      </View>
    )
  }
  uploadPhotoLoader() {
    return (
      <View style={styles.uplaodPhotoLoaderContainer}>
        <View style={styles.uplaodPhotoLoaderWrapper}>
          <ActivityIndicator
            size='large'
            color='black'
            style={{ marginBottom: 5 }}
          />
          <Text style={styles.uplaodPhotoLoaderText}>Wait a moment..</Text>
          <Text style={styles.uplaodPhotoLoaderText}>
            uploading photos {this.state.uploaded_photo_count}/
            {this.state.avatarSource.length}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* <Header headerTitle="Upload Photo" navigation={this.props.navigation} /> */}
        {this.viewHeader()}

        <View style={styles.progressRoot}>
          <View style={styles.progressDiv('60%', 30, '#FDE63E')} />
          <View style={styles.progressDiv('30%', 30, '#F7F7F7')} />
          <View style={styles.progressTextView}>
            <Text style={styles.progressText(14, 'black', 'normal')}>
              Step 2 of 3:{' '}
            </Text>
            <Text style={styles.progressText(14, 'black', 'bold')}>
              Upload Photo
            </Text>
          </View>
        </View>

        {this.state.loading_photo && (
          <View
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1
            }}
          >
            <ActivityIndicator size='large' />
          </View>
        )}

        {this.state.posting_property && this.postPropertyLoader()}
        {this.state.uploading_photo && this.uploadPhotoLoader()}

        {/* // ) : ( */}
        <ScrollView contentContainerStyle={styles.root}>
          {this.state.alertMessage !== '' &&
            this.AlertView(this.state.alertMessage)}
          <View style={styles.view1}>
            <Text style={styles.text1}>Photo Guideline</Text>
            <View style={styles.view2}>
              <View style={styles.view3}>
                <Image testID='icon6' source={Icon6} style={styles.icons} />
                <Text style={styles.text3}>At least</Text>
                <Text style={styles.text3}>4 non-watermarked</Text>
              </View>
              <View style={styles.view3}>
                <Image testID='icon7' source={Icon7} style={styles.icons} />
                <Text style={styles.text3}>High</Text>
                <Text style={styles.text3}>quality photo</Text>
              </View>
              <View style={styles.view3}>
                <Image testID='icon8' source={Icon8} style={styles.icons} />
                <Text style={styles.text3}>Bright and</Text>
                <Text style={styles.text3}>natural lighting</Text>
              </View>
            </View>
          </View>
          <View style={styles.photoGallery}>
            {this.state.avatarSource.length > 0 &&
              this.state.avatarSource.map((v, i) => (
                <View key={i} style={styles.photosWrapper}>
                  <View style={styles.rotateView}>
                    <TouchableOpacity
                      style={styles.rotateIconView}
                      onPress={() => {
                        if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '0deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '270deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '90deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '0deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '180deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,

                            transform: [{ rotate: '90deg' }]
                          }
                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '270deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,

                            transform: [{ rotate: '180deg' }]
                          }
                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '360deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '270deg' }]
                          }
                          this.setState({
                            photoStyleArray: photoArray
                          })
                        }
                      }}
                      accessible={true}
                      accessibilityLabel='uploadPhotoScreenRotateLeftBtn'
                    >
                      <FontAwesome name='rotate-left' color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rotateIconView}
                      onPress={() => {
                        if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '0deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '90deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '90deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '180deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '180deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '270deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '270deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '360deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '360deg'
                        ) {
                          let photoArray = this.state.photoStyleArray
                          photoArray[i] = {
                            ...this.state.photoStyle,
                            transform: [{ rotate: '0deg' }]
                          }

                          this.setState({
                            photoStyleArray: photoArray
                          })
                        }
                      }}
                      accessible={true}
                      accessibilityLabel='uploadPhotoScreenRotateRightBtn'
                    >
                      <FontAwesome name='rotate-right' color='white' />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.photoSelectedBorder, { flex: 1 }]}
                    onPress={() => {
                      this.setState({ selectedPhoto: i })
                      setTimeout(() => this._imagePicker(), 100)
                    }}
                    accessible={true}
                    accessibilityLabel={`uploadPhotoScreenPhotoStyle-${i}`}
                  >
                    <Image
                      testID={`photoStyle-${i}`}
                      key={v.data.uri}
                      source={v.data}
                      style={this.state.photoStyleArray[i]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      i === this.state.coverPhotoId
                        ? styles.coverSelectedTextWrapper
                        : styles.coverNormalTextWrapper
                    }
                    onPress={() => {
                      this._setCoverPhoto(i)
                    }}
                    accessible={true}
                    accessibilityLabel='uploadPhotoScreenCoverPhotoBtn'
                  >
                    <Text
                      style={
                        i === this.state.coverPhotoId
                          ? styles.coverSelectedTextStyle
                          : styles.coverNormalTextStyle
                      }
                    >
                      Cover photo
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

            {/* {this.state.avatarSource.length === 0 && (
              <View style={styles.photoBorder}>
                <View style={styles.iconView}>
                  <Image source={Icon4} />
                </View>
              </View>
            )} */}
            {this.state.avatarSource.length < 12 && (
              <View style={styles.photosWrapper}>
                <TouchableOpacity
                  style={styles.photoBorder}
                  onPress={() => {
                    this.setState({ selectedPhoto: null })
                    setTimeout(() => this._imagePicker(), 100)
                  }}
                  accessible={true}
                  accessibilityLabel='uploadPhotoScreenSelectedPhotoBtn'
                >
                  <View style={styles.view4}>
                    <View style={styles.iconView}>
                      <Image testID='icon5' source={Icon5} />
                    </View>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black'
                      }}
                    >
                      {this.state.avatarSource.length === 0
                        ? `Add photo`
                        : `Add more photos`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={{
              margin: 50
            }}
          />
          <TouchableOpacity
            onPress={this._navigateMyListing}
            style={styles.button2}
            accessible={true}
            accessibilityLabel='uploadPhotoScreenNextBtn'
          >
            <Text style={styles.text1}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* )} */}

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={(value) => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}
function mapStateToProps({ loginData }) {
  const { isUserLogin, userLoginData, userLoginProfileData } = loginData
  return { isUserLogin, userLoginData, userLoginProfileData }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(UploadPhoto))
