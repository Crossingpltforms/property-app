import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  PermissionsAndroid,
  Platform
} from 'react-native'
import Header from '../common/Header'
import styles from './style'
import Color from '../../common/styles/color'
import * as _ from 'lodash'
import { assets } from '../../../Images/index'
import RoundedInputText from '../../common/components/roundedInputText'
import { BusinessOwners, Students, WorkingIndividuals } from './textData'
import { useSelector } from 'react-redux'
import APICaller from '../../util/apiCaller'
import Http from '../../api/http'
import ImagePicker from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'
import ActionSheet from 'react-native-action-sheet'
import { nrciNumberFormat } from '../../common/helper/common'
import { MALAYSIAN_COUNTRY_CODE, No_IMAGE_LINK } from '../../common/constants'
import AlertView from '../../common/components/alertView'
import RNFS from 'react-native-fs'
import validateInput from '../../common/helper/validate'
import { ActivityIndicatorModal } from '../../common/components/activityIndicatorModal'

// Constants for the page
const LOCAL = 'local'
const FOREIGNER = 'foreigner'
const WORKING = 'Working Individuals'
const STUDENT = 'Student'
const BUSINESS = 'Business Owners'
const ALLOWED_DOCS = ['xls', 'xlsx', 'doc', 'docx', 'pdf']

const ZeroDepositEligibility = (props) => {
  const [selectedCitizen, setCitizen] = useState('')
  const [nricName, setNricName] = useState('')
  const [nricNumber, setNricNumber] = useState('')
  const [nricEmail, setNricEmail] = useState('')
  const [mobNumber, setMobNumber] = useState('')
  const [agreeNricTerms, setAgreeNricTerms] = useState(false)
  const [showLoading, toggleLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [profession, setProfession] = useState(WORKING)

  const [frontImage, setFrontImage] = useState({})
  const [backImage, setBackImage] = useState({})
  const [userDocObj, setUserDocObj] = useState({})
  const [professionDocs, setProfessionDocs] = useState([])
  const [professionImages, setProfessionImages] = useState([])
  const [alertMsg, setShowAlertMsg] = useState('')

  const _backPress = () => {
    // handle navigate back and steps to render
    if (step > 1) {
      if (step === 2) {
        setCitizen('')
      }
      setStep(step - 1)
    } else if (selectedCitizen === LOCAL && step === 1) {
      setCitizen('')
    } else {
      props.navigation.goBack()
    }
  }

  const loginData = useSelector((data) => data.loginData)
  const { userLoginData } = loginData
  const BUTTONSiOS = ['Take a photo', 'Gallery', 'Cancel']

  const buttonsAndroid = ['Take a photo', 'Gallery']

  const DESTRUCTIVE_INDEX = 3
  const CANCEL_INDEX = 2

  const setAlertMsg = (msg) => {
    setShowAlertMsg(msg)
    setTimeout(() => setShowAlertMsg(''), 2000)
  }

  const _imagePicker = (imageName = '') => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        (status) => {
          if (status === PermissionsAndroid.RESULTS.GRANTED) {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ).then((storagePermission) => {
              if (storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                ActionSheet.showActionSheetWithOptions(
                  {
                    options: Platform.OS == 'ios' ? BUTTONSiOS : buttonsAndroid,
                    cancelButtonIndex: CANCEL_INDEX,
                    destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    tintColor: 'blue'
                  },
                  (buttonIndex) => {
                    _imagePickerType(buttonIndex, imageName)
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
          options: Platform.OS == 'ios' ? BUTTONSiOS : buttonsAndroid,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          tintColor: 'blue'
        },
        (buttonIndex) => {
          _imagePickerType(buttonIndex, imageName)
        }
      )
    }
  }

  const _imagePickerType = (buttonIndex, imageName) => {
    if (buttonIndex === 0) {
      ImagePicker.openCamera({
        width: 500,
        height: 700,
        cropping: false,
        includeBase64: true
      }).then((response) => {
        pickerResponse(response, imageName)
      })
    } else if (buttonIndex === 1) {
      ImagePicker.openPicker({
        width: 500,
        height: 700,
        cropping: false,
        includeBase64: true
      }).then((response) => {
        pickerResponse(response, imageName)
      })
    }
  }

  const pickerResponse = (response, imageName) => {
    if (!response.didCancel && !response.error && !response.customButton) {
      const parts = response.path.split('.')
      const imageType = parts.pop()

      if (imageType !== 'gif') {
        const source = {
          uri: response.path ? response.path : No_IMAGE_LINK,
          base64: response.data
        }

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        if (imageName === 'front') {
          setFrontImage(source)
        } else if (imageName === 'back') {
          setBackImage(source)
        } else {
          const imageNameArr = response.path.split('/')
          const filename = imageNameArr.pop()
          const profSource = {
            doc: response.data,
            filename: filename,
            type: 'ENTRY'
          }
          setProfessionImages([...professionImages, profSource])
        }
      } else {
        setAlertMsg('Animated image not allow')
      }
    }
  }

  const submitRamsiData = () => {
    try {
      toggleLoading(true)
      const userData = {
        email: nricEmail,
        force: true,
        name: nricName,
        nric: nricNumber,
        phone: `${MALAYSIAN_COUNTRY_CODE}${mobNumber}` // number with default country code
      }
      APICaller(
        Http.ramciSubmit(),
        'POST',
        userLoginData.token,
        JSON.stringify(userData)
      ).then((response) => {
        if (response.status === 200) {
          const imagesBody = {
            icBack: `data:image/jpeg;base64,${frontImage.base64}`,
            icFront: `data:image/jpeg;base64,${backImage.base64}`,
            nric: nricNumber
          }
          APICaller(
            Http.ramciConsent(),
            'POST',
            userLoginData.token,
            JSON.stringify(imagesBody)
          ).then((response) => {
            if (response.status === 200) {
              toggleLoading(false)
              setStep(2)
            } else {
              toggleLoading(false)
              setAlertMsg('Something went wrong while uploading Images!')
            }
          })
        } else {
          toggleLoading(false)
          setAlertMsg(_.get(response, 'data.message', 'Something went wrong!'))
        }
      })
    } catch (error) {
      toggleLoading(false)
    }
  }

  const selectProfessionDocs = async () => {
    try {
      toggleLoading(true)
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      })
      for (const res of results) {
        const parts = res.uri.split('.')
        const docType = parts.pop()
        if (ALLOWED_DOCS.includes(docType.toLowerCase())) {
          RNFS.readFile(res.uri, 'base64').then((data) => {
            // handle the data ..
            //------- Use compressed image
            const source = {
              doc: data,
              filename: res.name,
              type: 'ENTRY'
            }
            setProfessionDocs([...professionDocs, source])
          })
        } else {
          setAlertMsg('Please upload pdf, excel or word file only')
        }
      }
      toggleLoading(false)
    } catch (err) {
      toggleLoading(false)
    }
  }

  const submitProfessionDocs = async () => {
    // will be called in loop due to multiple usage upload
    toggleLoading(true)
    const allDocs = [...professionImages, ...professionDocs]
    let uploadCount = 0
    if (allDocs.length !== 0) {
      const professionImagesPromises = allDocs.map((item) => {
        const imagesBody = {
          doc: item.doc,
          filename: item.filename,
          type: 'ENTRY'
        }
        APICaller(
          Http.uploadUserDocuments(userDocObj.id),
          'POST',
          userLoginData.token,
          JSON.stringify(imagesBody)
        ).then((response) => {
          if (response.status === 200) {
            uploadCount = uploadCount + 1
            if (uploadCount === allDocs.length) {
              toggleLoading(false)
              props.navigation.state.params.calBackMethod() // called this method to update previous screen status
              setStep(4)
            }
            return true
          } else {
            toggleLoading(false)
            return false
          }
        })
      })

      await Promise.all(professionImagesPromises)
      // .then((response) => console.log('promise res', response)) // ["Completed in 1000", "Rejected in 2000", "Completed in 3000"]
      // .catch((error) => console.log(`Error in executing ${error}`));
    } else {
      toggleLoading(false)
      setAlertMsg('Please upload at least one document!')
    }
  }

  const removeProfessionImage = (index) => {
    const newProfessionImages = professionImages.filter(
      (item, itemIndex) => itemIndex !== index
    )
    setProfessionImages(newProfessionImages)
  }
  const removeProfessionDoc = (index) => {
    const newProfessionDocs = professionDocs.filter(
      (item, itemIndex) => itemIndex !== index
    )
    setProfessionDocs(newProfessionDocs)
  }

  useEffect(() => {
    APICaller(
      Http.getUserDocuments(userLoginData.userId),
      'GET',
      userLoginData.token,
      ''
    ).then((response) => {
      setUserDocObj(response.data)
    })
  }, [])

  const submitRamsiDataValidate = () => {
    let errorMsg = validateInput(nricName, 'name')
    if (_.isEmpty(errorMsg)) {
      errorMsg = validateInput(nricNumber, 'nric')
    }
    if (_.isEmpty(errorMsg)) {
      errorMsg = validateInput(nricEmail, 'email')
    }
    if (_.isEmpty(errorMsg)) {
      errorMsg = validateInput(mobNumber, 'mobile')
    }
    if (
      _.isEmpty(errorMsg) &&
      (_.isEmpty(frontImage.base64) || _.isEmpty(backImage.base64))
    ) {
      errorMsg = 'Both IC pictures are required'
    }
    if (_.isEmpty(errorMsg) && !agreeNricTerms) {
      errorMsg = 'Pleas tick acknowledge checkbox'
    }
    if (_.isEmpty(errorMsg)) {
      submitRamsiData()
    } else {
      setAlertMsg(errorMsg)
    }
  }

  const step2 = () => {
    return (
      <View style={[styles.mainContainer, { flex: 1 }]}>
        <View style={styles.step2BodyContainer}>
          <Text style={styles.contentTitle}>Get Verified!</Text>
          <Image
            source={assets.green_check_big}
            style={styles.greenTickBigIcon}
          />

          <Text style={styles.stepsTitleText}>
            Few steps to check your eligibility
          </Text>
          <View style={styles.optionRow}>
            <View style={styles.optionRowIconView}>
              <Image source={assets.doneGreen} />
            </View>
            <Text style={styles.pointsText}>Credit Check</Text>
          </View>
          <View style={styles.optionRow}>
            <View style={styles.optionRowIconView} />
            <Text style={styles.pointsText}>Upload Document</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={() => setStep(3)}>
          <Text style={styles.submitBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const step3 = () => {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.contentTitle}>Select Your Profession</Text>

        <View style={styles.professionRow}>
          <TouchableOpacity
            style={styles.professionIconBtn}
            onPress={() => setProfession(WORKING)}
          >
            <View
              style={[
                styles.professionIconContainer,
                {
                  backgroundColor:
                    profession === WORKING
                      ? Color.darkBtnBlack
                      : Color.btnLightGreyBg
                }
              ]}
            >
              <Image
                source={
                  profession === WORKING ? assets.work_white : assets.work
                }
              />
            </View>
            <Text style={styles.professionText}>{WORKING}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.professionIconBtn}
            onPress={() => setProfession(STUDENT)}
          >
            <View
              style={[
                styles.professionIconContainer,
                {
                  backgroundColor:
                    profession === STUDENT
                      ? Color.darkBtnBlack
                      : Color.btnLightGreyBg
                }
              ]}
            >
              <Image
                source={
                  profession === STUDENT ? assets.student_white : assets.student
                }
              />
            </View>
            <Text style={styles.professionText}>{STUDENT}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.professionIconBtn}
            onPress={() => setProfession(BUSINESS)}
          >
            <View
              style={[
                styles.professionIconContainer,
                {
                  backgroundColor:
                    profession === BUSINESS
                      ? Color.darkBtnBlack
                      : Color.btnLightGreyBg
                }
              ]}
            >
              <Image
                source={
                  profession === BUSINESS
                    ? assets.business_white
                    : assets.business
                }
              />
            </View>
            <Text style={styles.professionText}>{BUSINESS}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reqDocContainer}>
          <Text style={styles.srTitle}>Required Documents</Text>
          {profession === WORKING ? (
            <WorkingIndividuals />
          ) : profession === STUDENT ? (
            <Students />
          ) : (
            <BusinessOwners />
          )}
        </View>
        <View style={styles.uploadFilesContainer}>
          <Text style={styles.uploadTitle}>Upload Files</Text>
          <Text style={styles.uploadSubTitle}>
            Please upload pdf, jpg/png, excel or word file only
          </Text>
          <View style={styles.uploadProfessionRow}>
            <TouchableOpacity
              style={styles.professionBtn}
              onPress={() => _imagePicker()}
            >
              <Image source={assets.upload_add} style={styles.upload_more} />
              <Text style={styles.uploadMoreText}>Images</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.professionBtn}
              onPress={() => selectProfessionDocs()}
            >
              <Image source={assets.upload_add} style={styles.upload_more} />
              <Text style={styles.uploadMoreText}>Docs</Text>
            </TouchableOpacity>
          </View>
          {professionImages.length > 0 &&
            professionImages.map((item, index) => {
              return (
                <View style={styles.imagePrevRow} key={`image${index}`}>
                  <Image
                    source={assets.successful_tick_green}
                    style={styles.uploadGreenTick}
                  />
                  <Text
                    style={styles.uploadImageName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {item.filename}
                  </Text>
                  <Image
                    source={{ uri: `data:image/gif;base64,${item.doc}` }}
                    style={styles.uploadedImgStyle}
                  />
                  <TouchableOpacity
                    style={styles.uploadDeleteIcon}
                    onPress={() => removeProfessionImage(index)}
                  >
                    <Image source={assets.delete} />
                  </TouchableOpacity>
                </View>
              )
            })}
          {professionDocs.length > 0 &&
            professionDocs.map((item, index) => {
              return (
                <View style={styles.imagePrevRow} key={`doc${index}`}>
                  <Image
                    source={assets.successful_tick_green}
                    style={styles.uploadGreenTick}
                  />
                  <Text
                    style={styles.uploadImageName}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {item.filename}
                  </Text>
                  <TouchableOpacity
                    style={styles.uploadDeleteIcon}
                    onPress={() => removeProfessionDoc(index)}
                  >
                    <Image source={assets.delete} />
                  </TouchableOpacity>
                </View>
              )
            })}
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => submitProfessionDocs()}
        >
          <Text style={styles.submitBtnText}>Submit to SPEEDHOME</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const step4 = () => {
    return (
      <View style={[styles.mainContainer, { flex: 1 }]}>
        <View style={styles.step2BodyContainer}>
          <Text style={styles.contentTitle}>Completed!</Text>
          <Image
            source={assets.green_check_big}
            style={styles.greenTickBigIcon}
          />

          <Text style={styles.stepsTitleText}>
            Thank you for completing Zero Deposit Eligibility check. Alicia will
            reach out to you with your result.
          </Text>
          <View style={styles.optionRow}>
            <View style={styles.optionRowIconView}>
              <Image source={assets.doneGreen} />
            </View>
            <Text style={styles.pointsText}>Credit Check</Text>
          </View>
          <View style={styles.optionRow}>
            <View style={styles.optionRowIconView}>
              <Image source={assets.doneGreen} />
            </View>
            <Text style={styles.pointsText}>Upload Document</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.submitBtnText}>Okay</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const localUserData = () => {
    return (
      <View style={[styles.mainContainer, { alignItems: 'center' }]}>
        <Text style={styles.contentTitle}>Upload NRIC</Text>
        <View style={styles.nricImageContainer}>
          <View style={styles.nricUploadBtnContainer}>
            <TouchableOpacity
              style={styles.nricUploadBtn}
              onPress={() => _imagePicker('front')}
            >
              {frontImage && frontImage.uri ? (
                <Image
                  source={{ uri: frontImage.uri }}
                  style={styles.nricUploadBtn}
                />
              ) : (
                <Image source={assets.upload_add} />
              )}
            </TouchableOpacity>
            <Text style={styles.uploadImageLabel}>Front</Text>
          </View>
          <View style={styles.nricUploadBtnContainer}>
            <TouchableOpacity
              style={styles.nricUploadBtn}
              onPress={() => _imagePicker('back')}
            >
              {backImage && backImage.uri ? (
                <Image
                  source={{ uri: backImage.uri }}
                  style={styles.nricUploadBtn}
                />
              ) : (
                <Image source={assets.upload_add} />
              )}
            </TouchableOpacity>
            <Text style={styles.uploadImageLabel}>Back</Text>
          </View>
        </View>
        <RoundedInputText
          title='Name'
          placeholder='Name as Per NRIC'
          onChangeText={(text) => setNricName(text)}
          value={nricName}
          accessibilityLabel='zeroDepNricName'
        />
        <RoundedInputText
          title='NRCI Number'
          placeholder='Enter your NRCI Number'
          onChangeText={(text) => setNricNumber(nrciNumberFormat(text))}
          value={nricNumber}
          accessibilityLabel='zeroDepNricNumber'
          maxLength={14}
        />
        <RoundedInputText
          title='Email Address'
          placeholder='Enter Email Address'
          onChangeText={(text) => setNricEmail(text)}
          value={nricEmail}
          accessibilityLabel='zeroDepNricNumber'
          keyboardType='email-address'
        />
        <RoundedInputText
          title='Mobile Number'
          placeholder='Phone Number'
          onChangeText={(text) => setMobNumber(text)}
          value={mobNumber}
          accessibilityLabel='zeroDepNricNumber'
          keyboardType='phone-pad'
          maxLength={12}
        />

        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAgreeNricTerms(!agreeNricTerms)}>
            <Image
              source={
                agreeNricTerms
                  ? assets.check_box
                  : assets.check_box_outline_blank
              }
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I acknowledge this will allow SPEEDHOME to collect my credit
            information for home rental process.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => submitRamsiDataValidate()}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const initialView = () => {
    return (
      <View style={[styles.mainContainer, { alignItems: 'center' }]}>
        <Text style={styles.contentTitle}>Credit Check</Text>
        <TouchableOpacity
          style={[styles.citizenBtn, { backgroundColor: Color.darkBtnBlack }]}
          onPress={() => setCitizen(LOCAL)}
        >
          <Text style={[styles.stylesCitizenBtnText, { color: Color.white }]}>
            I am a Malaysian Citizen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.citizenBtn, { backgroundColor: Color.btnLightGreyBg }]}
          onPress={() => {
            setCitizen(FOREIGNER)
            setStep(2)
          }}
        >
          <Text style={styles.stylesCitizenBtnText}>I am a Foreigner</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Header
        headerTitle='Zero Deposit Eligibility'
        onBackPress={() => _backPress()}
      />
      {!_.isEmpty(alertMsg) && AlertView(alertMsg)}
      {showLoading && <ActivityIndicatorModal />}
      <KeyboardAvoidingView
        // onStartShouldSetResponderCapture={() => {
        //   setState({ enableScrollViewScroll: true })
        // }}
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 30}
      >
        <ScrollView contentContainerStyle={styles.root}>
          {_.isEmpty(selectedCitizen) && step === 1 && initialView()}
          {!_.isEmpty(selectedCitizen) &&
            selectedCitizen === LOCAL &&
            step === 1 &&
            localUserData()}

          {step === 2 && step2()}
          {step === 3 && step3()}
          {step === 4 && step4()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ZeroDepositEligibility
