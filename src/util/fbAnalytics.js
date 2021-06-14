import { AppEventsLogger } from 'react-native-fbsdk'
import { Platform } from 'react-native'

// export const events = {
//   pageLoad: "Page_Load",
//   createChatRequest: "Create_Chat_Request",
//   submitChatRequest: "Submit_Chat_Request",
//   fillPropertyDetails: "Post_Property_Filled_Property_Details",
//   uploadPhotos: "Post_Property_Uploaded_Photos",
//   postProperty: "Post_Property",
//   fillExtraInfo: "Post_Property_Filled_Extra_Information",
//   postComplete: "Posted_Property",
//   enterNumber: "Entered_Number",
//   enterOTP: "Submitted_OTP",
//   submitUserDetails: "Submitted_User_Details",
//   chatRequestBtnClick: "ChatRequestBtnClick",
//   chatRequestSubmit1: "ChatRequestSubmit1",
//   chatRequestSubmit2: "ChatRequestSubmit2",
//   chatRequestSubmit3: "ChatRequestSubmit3",
//   postListingClick: "PostListingClick",
//   postListingRent: "PostListingRent",
//   postListingSale: "PostListingSale",
//   createListing1: "CreateListing1",
//   createListing2: "CreateListing2",
//   createListing3: "CreateListing3",
//   createListingGPS: "CreateListingGPS",
//   createListingKeyCollection: "CreateListingKeyCollection",
//   createListingShare: "CreateListingShare",
//   createListingShareSkip: "CreateListingShareSkip",
//   createListingThankYou: "createListingThankYou",
//   addToCart: 'Add_to_Cart',
//   completeRegistration: "Complete_Registration",
//   landedOrHighRisePropertyChatRequest:
//     'Landed_Or_Highrise_Property_Chat_Request',
// }

export const logEvent = (eventName, params = null) => {
  if (Platform.OS === 'android') {
    if (params) {
      AppEventsLogger.logEvent(eventName, params)
    } else {
      AppEventsLogger.logEvent(eventName)
    }
  } else {
    if (params) {
      AppEventsLogger.logEvent(eventName, params)
    } else {
      AppEventsLogger.logEvent(eventName)
    }
  }
}

export const logAddToCart = contentType => {
  if (Platform.OS === 'android') {
    const params = {
      fb_content_type: contentType
    }
    AppEventsLogger.logEvent('fb_mobile_add_to_cart', params)
  } else {
    const params = {
      fb_content_type: contentType
    }
    AppEventsLogger.logEvent('fb_mobile_add_to_cart', params)
  }
}

export const fbLogAddToCart = (totalPrice, contentType, content, currency) => {

  const params = {
    'fb_content_type': contentType,
    'fb_content': content,
    'fb_currency': currency
  }
  AppEventsLogger.logEvent('fb_mobile_add_to_cart', totalPrice, params)
}
export const fbLogCompleteRegistration = (totalPrice, contentType, content, currency) => {

  const params = {
    'fb_content_type': contentType,
    'fb_content': content,
    'fb_currency': currency
  }
  AppEventsLogger.logEvent('fb_mobile_complete_registration', totalPrice, params)
}

export const logAddToWishlist = contentType => {
  if (Platform.OS === 'android') {
    const params = {
      fb_content_type: contentType
    }
    AppEventsLogger.logEvent('fb_mobile_add_to_wishlist', params)
  } else {
    const params = {
      fb_content_type: contentType
    }
    AppEventsLogger.logEvent('fb_mobile_add_to_wishlist', params)
  }
}

export const logUnlockAchievement = description => {
  if (Platform.OS === 'android') {
    const params = {
      fb_description: description
    }
    AppEventsLogger.logEvent('fb_mobile_achievement_unlocked', params)
  } else {
    const params = {
      fb_description: description
    }
    AppEventsLogger.logEvent('fb_mobile_achievement_unlocked', params)
  }
}
