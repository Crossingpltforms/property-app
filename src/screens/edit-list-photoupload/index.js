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
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage'
import { Matrics } from '../../common/styles'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ErrorDialog from '../../components/ErrorDialog'

import Icon4 from '../../../Images/Icon4.png'
// import Icon5 from "../../../Images/Icon5.png";

import Icon6 from '../../../Images/Icon6.png'
import Icon7 from '../../../Images/Icon7.png'
import Icon8 from '../../../Images/Icon8.png'

import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import styles from './styles'

import MultiImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-action-sheet'
import { No_IMAGE_LINK } from '../../common/constants'

var BUTTONSiOS = ['Take a photo', 'Gallery', 'Cancel']

var BUTTONSandroid = ['Take a photo', 'Gallery']

var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 2

class Editlistupload extends Component {
  constructor (props) {
    super(props)

    let propertyType = (this.props.navigation.state.params.details
      ? this.props.navigation.state.params.details.type
      : ''
    ).split('_')
    let isSale = false

    if (propertyType.length > 1 && propertyType[1] === 'SALE') {
      isSale = true
    }

    const { width, height } = Dimensions.get('window')

    this.state = {
      showErrorDialog: false,
      coverPhotoId: 0,
      avatarSource: [],
      propertyId: null,
      need_a_photo_grapher: true,
      loading_photo: false,
      property_id: 0,
      alertMessage: '',
      listIemDetails: '',
      photoStyle: isSale
        ? {
            ...styles.photoSelectedBorder,

            width: width * 0.2,
            height: width * 0.2
          }
        : styles.photoSelectedBorder,
      photoStyleArray: [],
      isSale,
      screenWidth: width,
      screenHeight: height
    }
  }

  componentDidMount () {
    const listDetails = this.props.navigation.state.params.details
    const details = this.props.navigation.state.params.item
    this.setState({
      listIemDetails: listDetails
    })
    const property_id = this.props.navigation.state.params.property_id
    let tempImages = []
    for (let item of details) {
      tempImages.push({
        uri: item.url ? item.url : No_IMAGE_LINK,
        id: item.id,
        update: false
      })
    }
    this.setState(
      {
        avatarSource: tempImages,
        property_id: property_id,
        propertyId: property_id,
        photoStyleArray: Array.from(Array(tempImages.length).keys()).map(
          () => this.state.photoStyle
        )
      },
      () => {}
    )
  }

  AlertView = message => (
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
        {message.replace('null', 'empty')}
      </Text>
    </View>
  )

  _hideAlertView () {
    setTimeout(() => this.setState({ ...this.state, alertMessage: '' }), 2000)
  }

  _updateNeedPhotoGrapher = val => () =>
    this.setState({ ...this.state, need_a_photo_grapher: val })

  _imagePikcer = () => {
    this.setState({ ...this.state, loading_photo: true })
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        status => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ).then(storagePermission => {
              if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                ActionSheet.showActionSheetWithOptions(
                  {
                    options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    tintColor: 'blue'
                  },
                  buttonIndex => {
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
      ActionSheet.showActionSheetWithOptions(
        {
          options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: 'blue'
        },
        buttonIndex => {
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

  _imagePickerLogin () {
    MultiImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      // forceJpg: true,
      maxFiles: 12,
      mediaType: 'photo'
    })
      .then(images => {
        let totalImages = images.length + this.state.avatarSource.length

        if (totalImages > 12) {
          alert('You can select Max 12 Photos')
          this.setState({ ...this.state, loading_photo: false })
        } else {
          images.map(i => {
            ImageResizer.createResizedImage(
              i.path,
              i.width,
              i.height,
              'JPEG',
              80
            )
              .then(res => {
                RNFetchBlob.fs.readFile(res.path, 'base64').then(data => {
                  const source = {
                    uri: res.uri ? res.uri : No_IMAGE_LINK,
                    base64: data
                  }
                  var isPhotoAvailable = false
                  this.state.avatarSource.map(res => {
                    if (source.base64 === res.base64) {
                      alert(
                        'You are trying to upload same file! Please upload a different and unique file.'
                      )
                      isPhotoAvailable = true
                      return
                    }
                  })
                  if (!isPhotoAvailable) {
                    this.setState({
                      ...this.state,
                      avatarSource: [...this.state.avatarSource, source]
                    })
                  }
                  this.setState({
                    ...this.state,
                    photoStyleArray: [
                      ...this.state.photoStyleArray,
                      this.state.photoStyle
                    ]
                  })
                })
                this.setState({ ...this.state, loading_photo: false })
              })
              .catch(err => {
                this.setState({ ...this.state, loading_photo: false })
              })
          })
        }
      })
      .catch(err => {
        this.setState({ ...this.state, loading_photo: false })
      })
  }

  _cameraPicker () {
    MultiImagePicker.openCamera({
      waitAnimationEnd: false,
      includeExif: true
      // forceJpg: true,
    })
      .then(image => {
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
            .then(res => {
              RNFetchBlob.fs.readFile(res.path, 'base64').then(data => {
                const source = {
                  uri: res.uri ? res.uri : No_IMAGE_LINK,
                  base64: data
                }
                var isPhotoAvailable = false
                this.state.avatarSource.map(res => {
                  if (source.base64 === res.base64) {
                    alert(
                      'You are trying to upload same file! Please upload a different and unique file.'
                    )
                    isPhotoAvailable = true
                    return
                  }
                })
                if (!isPhotoAvailable) {
                  this.setState({
                    ...this.state,
                    avatarSource: [...this.state.avatarSource, source]
                  })
                }
                this.setState({
                  ...this.state,
                  photoStyleArray: [
                    ...this.state.photoStyleArray,
                    this.state.photoStyle
                  ]
                })
              })

              this.setState({ ...this.state, loading_photo: false })
            })
            .catch(err => {
              this.setState({ ...this.state, loading_photo: false })
            })
        }
      })
      .catch(e => {
        this.setState({ ...this.state, loading_photo: false })
      })
  }

  _navigationBack = () => this.props.navigation.goBack()

  _viewHeader () {
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
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row' }}>
            {/* <TouchableOpacity onPress={() => this._navigationBack()}>
              <Icon name="arrow-back" size={30} />
            </TouchableOpacity> */}
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                fontSize: 17,
                color: '#000',
                paddingLeft: 10
              }}
            >
              Upload Photo
            </Text>
          </View>
        </View>
      </View>
    )
  }

  deletePhotos (data, index) {
    if (data.id !== undefined) {
      if (!global.networkConnection) return
      this.showLoader()
      if (this.props.isUserLogin == true) {
        let user_information = this.props.userLoginData
        APICaller(
          `${Http.deletePhoto(data.id)}`,
          'DELETE',
          user_information.token,
          ''
        ).then(response => {
          if (response.status === 200) {
            this.state.avatarSource.splice(index, 1)
            this.state.photoStyleArray.splice(index, 1)
            this.setState(
              {
                avatarSource: this.state.avatarSource,
                photoStyleArray: this.state.photoStyleArray
              },
              () => {}
            )
          } else {
            this.displayError()
          }
        })
      }
      this.hideLoader()
    } else {
      this.state.avatarSource.splice(index, 1)
      this.state.photoStyleArray.splice(index, 1)
      this.setState(
        {
          avatarSource: this.state.avatarSource,
          photoStyleArray: this.state.photoStyleArray
        },
        () => {}
      )
    }
  }

  showLoader = () => {
    this.setState({ isLoading: true })
  }

  hideLoader = () => {
    this.setState({ isLoading: false })
  }

  _setCoverPhoto (imgData, i) {
    this.setState({ coverPhotoId: i })
    if (this.props.isUserLogin == true) {
      let data = this.props.userLoginData
      const body = {
        coverPhoto: true
      }
      APICaller(
        Http.setCoverImage(this.state.propertyId, imgData.id),
        'PUT',
        data.token,
        JSON.stringify(body)
      ).then(json => {
        if (!json) {
          return
        }
        // this.props.navigation.navigate("Otp");
        if (json.status === 200) {
          this.props.navigation.state.params.property_id
        } else {
          this.displayError()
        }
      })
    }
  }

  _navigateMyListing = () => {
    if (!global.networkConnection) return
    this.setState({
      ...this.state,
      uploading_photo: true
    })
    if (this.state.avatarSource.length >= 4) {
      if (this.props.isUserLogin == true) {
        this._checkEditPhotos()
      } else {
        this.setState({
          uploading_photo: false
        })
      }
    } else {
      this.setState({
        ...this.state,
        uploading_photo: false,
        alertMessage: 'Please select atleast four photos.'
      })
      this._hideAlertView()
    }
  }

  _checkEditPhotos () {
    var e_index = 0
    this.updateImage(e_index)
  }

  _createPropertyApi () {
    var anyChanges = 0
    for (let i = 0; i < this.state.avatarSource.length; i++) {
      if (this.state.avatarSource[i].id === undefined) {
        anyChanges += 1
        this._UploadPhotoApi(this.state.propertyId, i)
        break
      }
    }
    if (anyChanges == 0) {
      this.setState({
        uploading_photo: false
      })
      this.props.navigation.navigate('EditExtrainfo', {
        screenName: 'UploadPhoto',
        details: this.state.listIemDetails
      })
    }
  }

  _UploadPhotoApi (propertyId, index) {
    if (this.props.isUserLogin == true) {
      let user_information = this.props.userLoginData
      const res = this.state.avatarSource[index]

      let rotationAngle = 0
      if (this.state.photoStyleArray[index].transform[0].rotate === '0deg') {
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
          100,
          rotationAngle
        ).then(rotationImage => {
          RNFetchBlob.fs.readFile(rotationImage.path, 'base64').then(data => {
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
              ).then(json => {
                if (!json) return
                if (json.status === 200) {
                  this.state.avatarSource[index].id = json.data.id // TODO setstate
                  this.setState(
                    {
                      avatarSource: this.state.avatarSource
                    },
                    () => {}
                  )

                  if (index === this.state.avatarSource.length - 1) {
                    this.setState({
                      ...this.state,
                      uploading_photo: false
                    })
                    this.props.navigation.navigate('EditExtrainfo', {
                      id: propertyId,
                      details: this.state.listIemDetails
                    })
                  } else {
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
  }

  updateImage (index) {
    if (index < this.state.avatarSource.length) {
      if (this.state.avatarSource[index].update === true) {
        const image = this.state.avatarSource[index]
        let rotationAngle = 0
        if (this.state.photoStyleArray[index].transform[0].rotate === '0deg') {
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
        if (this.props.isUserLogin == true) {
          let accountinfo = this.props.userLoginData
          APICaller(
            `${Http.deletePhoto(image.id)}`,
            'DELETE',
            accountinfo.token,
            ''
          ).then(deleteResponse => {
            if (deleteResponse.status === 200) {
              Image.getSize(
                image.uri,
                (width, height) => {
                  RNFetchBlob.config({
                    fileCache: true
                  })
                    .fetch('GET', image.uri)
                    .then(resp => {
                      const imagePath = resp.path()
                      ImageResizer.createResizedImage(
                        imagePath,
                        width * 2.3,
                        height * 2.3,
                        'JPEG',
                        100,
                        rotationAngle
                      ).then(
                        rotationImage => {
                          RNFetchBlob.fs
                            .readFile(rotationImage.path, 'base64')
                            .then(data => {
                              let body = {
                                image: data,
                                coverPhoto:
                                  index === this.state.coverPhotoId
                                    ? true
                                    : false
                              }
                              try {
                                APICaller(
                                  `${Http.createProperty}/${this.state.propertyId}/images`,
                                  'POST',
                                  accountinfo.token,
                                  JSON.stringify(body)
                                ).then(json => {
                                  if (!json) return
                                  if (json.status === 200) {
                                    if (
                                      index ===
                                      this.state.avatarSource.length - 1
                                    ) {
                                      this.setState({
                                        ...this.state,
                                        uploading_photo: false
                                      })
                                      this.props.navigation.navigate(
                                        'EditExtrainfo',
                                        {
                                          id: this.state.propertyId,
                                          details: this.state.listIemDetails
                                        }
                                      )
                                    } else {
                                      if (
                                        this.state.avatarSource[index + 1]
                                          .id === undefined
                                      ) {
                                        this._createPropertyApi()
                                      } else {
                                        this.updateImage(index + 1)
                                      }
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
                        },
                        error => {
                          // TODO crashlytics
                        }
                      )
                      return resp.readFile('base64')
                    })
                },
                error => {
                  // TODO crashlytics
                }
              )
            }
          })
        }
      } else {
        if (this.state.avatarSource[index].id === undefined) {
          this._createPropertyApi()
        } else {
          if (index === this.state.avatarSource.length - 1) {
            this.setState({
              ...this.state,
              uploading_photo: false
            })
            this.props.navigation.navigate('EditExtrainfo', {
              id: this.state.propertyId,
              details: this.state.listIemDetails
            })
          } else {
            this.updateImage(index + 1)
          }
        }
      }
    } else {
      this.setState({
        ...this.state,
        uploading_photo: false
      })
      this.props.navigation.navigate('EditExtrainfo', {
        id: this.state.propertyId,
        details: this.state.listIemDetails
      })
    }
  }

  uploadPhotoLoader () {
    return (
      <View style={styles.uplaodPhotoLoaderContainer}>
        <View style={styles.uplaodPhotoLoaderWrapper}>
          <ActivityIndicator
            size='large'
            color='black'
            style={{ marginBottom: 5 }}
          />
          <Text style={styles.uplaodPhotoLoaderText}>Wait a moment..</Text>
          <Text style={styles.uplaodPhotoLoaderText}>updating photos...</Text>
        </View>
      </View>
    )
  }

  transformPhoto (degree, i) {
    let photoArray = this.state.photoStyleArray
    photoArray[i] = {
      ...this.state.photoStyle,
      transform: [{ rotate: degree }]
    }
    this.setState({
      photoStyleArray: photoArray
    })
    var arr = this.state.avatarSource
    if (this.state.avatarSource[i].id !== undefined) {
      arr[i] = {
        uri: this.state.avatarSource[i].uri
          ? this.state.avatarSource[i].uri
          : No_IMAGE_LINK,
        id: this.state.avatarSource[i].id,
        update: true
      }
      this.setState({ avatarSource: arr })
    }
  }

  displayError () {
    this.setState({ showErrorDialog: true })
  }

  render () {
    return (
      <Container style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {this._viewHeader()}

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
                <View key={'mainKey' + i}>
                  <View
                    style={
                      this.state.isSale
                        ? {
                            ...styles.rotateView,
                            width: this.state.screenWidth * 0.2,
                            marginBottom: -15
                          }
                        : styles.rotateView
                    }
                  >
                    <TouchableOpacity
                      style={
                        this.state.isSale
                          ? {
                              ...styles.rotateIconView,
                              width: (this.state.screenWidth * 0.2) / 2
                            }
                          : styles.rotateIconView
                      }
                      onPress={() => {
                        if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '0deg'
                        ) {
                          this.transformPhoto('270deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '90deg'
                        ) {
                          this.transformPhoto('0deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '180deg'
                        ) {
                          this.transformPhoto('90deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '270deg'
                        ) {
                          this.transformPhoto('180deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '360deg'
                        ) {
                          this.transformPhoto('270deg', i)
                        }
                      }}
                      accessible={true}
                      accessibilityLabel='photoUpRotateLeftBtn'
                    >
                      <FontAwesome name='rotate-left' color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        this.state.isSale
                          ? {
                              ...styles.rotateIconView,
                              width: (this.state.screenWidth * 0.2) / 2
                            }
                          : styles.rotateIconView
                      }
                      onPress={() => {
                        if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '0deg'
                        ) {
                          this.transformPhoto('90deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '90deg'
                        ) {
                          this.transformPhoto('180deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '180deg'
                        ) {
                          this.transformPhoto('270deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '270deg'
                        ) {
                          this.transformPhoto('360deg', i)
                        } else if (
                          this.state.photoStyleArray[i].transform[0].rotate ===
                          '360deg'
                        ) {
                          this.transformPhoto('0deg', i)
                        }
                      }}
                      accessible={true}
                      accessibilityLabel='photoUploadRotateRightBtn'
                    >
                      <FontAwesome name='rotate-right' color='white' />
                    </TouchableOpacity>
                  </View>
                  <Image
                    testID={`photoStyle-${i}`}
                    key={i}
                    source={v}
                    style={this.state.photoStyleArray[i]}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: Matrics.ScaleValue(35) + 8
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.deletePhotos(v, i)}
                      accessible={true}
                      accessibilityLabel='photoUploadMultiplyBtn'
                    >
                      <Image
                        testID='multiply'
                        style={{ height: 15, width: 15, tintColor: '#000' }}
                        source={require('../../../Images/multiply.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={
                      i === this.state.coverPhotoId
                        ? this.state.isSale
                          ? {
                              ...styles.coverSelectedTextWrapper,
                              width: this.state.screenWidth * 0.2,
                              marginTop: -15
                            }
                          : styles.coverSelectedTextWrapper
                        : this.state.isSale
                        ? {
                            ...styles.coverNormalTextWrapper,
                            width: this.state.screenWidth * 0.2,
                            marginTop: -15
                          }
                        : styles.coverNormalTextWrapper
                    }
                    onPress={() => {
                      if (v.id !== undefined && v.id !== '') {
                        this._setCoverPhoto(v, i)
                      } else {
                        this.setState({ coverPhotoId: i })
                      }
                    }}
                    accessible={true}
                    accessibilityLabel='photoUploadCoverBtn'
                  >
                    <Text
                      style={
                        i === this.state.coverPhotoId
                          ? this.state.isSale
                            ? { ...styles.coverSelectedTextStyle, fontSize: 10 }
                            : styles.coverSelectedTextStyle
                          : this.state.isSale
                          ? { ...styles.coverNormalTextStyle, fontSize: 10 }
                          : styles.coverNormalTextStyle
                      }
                    >
                      Cover photo
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

            {this.state.avatarSource.length < 12 && (
              <TouchableOpacity
                style={
                  this.state.isSale
                    ? {
                        ...styles.photoBorder,
                        width: this.state.screenWidth * 0.2,
                        height: this.state.screenWidth * 0.2
                      }
                    : styles.photoBorder
                }
                onPress={this._imagePikcer}
                accessible={true}
                accessibilityLabel='photoUploadMoreBtn'
              >
                <View style={styles.view4}>
                  <View style={styles.iconView}>
                    <Image testID='icon4' source={Icon4} />
                  </View>
                  {!this.state.isSale && (
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'black'
                      }}
                    >
                      Add more photos
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
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
            accessibilityLabel='photoUploadNextBtn'
          >
            <Text style={styles.text1}>Next</Text>
          </TouchableOpacity>
        </ScrollView>

        <ErrorDialog
          modalVisible={this.state.showErrorDialog}
          headerText='Oops!'
          bodyText={`Something went wrong. Please contact hello@speedrent.com for assistance.`}
          toggleModal={value => {
            this.setState({ showErrorDialog: false })
          }}
        />
      </Container>
    )
  }
}
function mapStateToProps ({ loginData }) {
  const { isUserLogin, userLoginData } = loginData
  return {
    isUserLogin,
    userLoginData
  }
}
function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editlistupload)
