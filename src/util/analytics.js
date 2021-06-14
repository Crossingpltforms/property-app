import { SearchBar } from 'react-native-elements'
import {
  GoogleAnalyticsSettings,
  GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge'

const GA_TRACKER_INTERVAL = 30
const GA_TRACKER_ID = 'UA-63552543-2'

//GoogleAnalyticsSettings.setDryRun(true);
GoogleAnalyticsSettings.setDispatchInterval(GA_TRACKER_INTERVAL)

export const tracker = new GoogleAnalyticsTracker(GA_TRACKER_ID)

// export const trackerEventConfig = {
//   chatWithOwner: {
//     category: 'Chat with Owner',
//     action: {
//       createChatRequest: 'Create Chat Request',
//       submitChatRequest: 'Submit Chat Request',
//       chatRequestBtnClick: 'ChatRequestBtnClick',
//       chatRequestSubmit1: 'ChatRequestSubmit1',
//       chatRequestSubmit2: 'ChatRequestSubmit2',
//       chatRequestSubmit3: 'ChatRequestSubmit3'
//     }
//   },
//   postProperty: {
//     category: 'Post Property',
//     action: {
//       fillPropertyDetails: 'Filled Property Details',
//       uploadPhotos: 'Uploaded Photos',
//       fillExtraInfo: 'Filled Extra Information',
//       postComplete: 'Posted Property',
//       postListingClick: 'PostListingClick',
//       postListingRent: 'PostListingRent',
//       postListingSale: 'PostListingSale',
//       createListing1: 'CreateListing1',
//       createListing2: 'CreateListing2',
//       createListing3: 'CreateListing3',
//       createListingGPS: 'CreateListingGPS',
//       createListingKeyCollection: 'CreateListingKeyCollection',
//       createListingShare: 'CreateListingShare',
//       createListingShareSkip: 'CreateListingShareSkip',
//       createListingThankYou: 'createListingThankYou'
//     }
//   },
//   login: {
//     category: 'Login',
//     action: {
//       enterNumber: 'Entered Number',
//       enterOTP: 'Submitted OTP',
//       submitUserDetails: 'Submitted User Details'
//     }
//   }
// }

// export const trackerEventSubmit = {
//   chatWithOwner: {
//     category: 'Chat with Owner',
//     action: {
//       createChatRequest: 'createChatRequest',
//       submitChatRequest: 'submitChatRequest',
//       submitChatRequestNoDeposit: 'submitChatRequestNoDeposit',
//       chatRequestBtnClick: 'ChatRequestBtnClick',
//       chatRequestSubmit1: 'ChatRequestSubmit1',
//       chatRequestSubmit2: 'ChatRequestSubmit2',
//       chatRequestSubmit3: 'ChatRequestSubmit3',
//       landedOrHighRisePropertyChatRequest:
//         'Landed_Or_Highrise_Property_Chat_Request',
//       addToCart: 'Add_to_Cart',
//       completeRegistration: "Complete_Registration"
//     }
//   },
//   postProperty: {
//     category: 'Property',
//     action: {
//       fillPropertyDetails: 'FillPropertyDetails',
//       uploadPhotos: 'UploadPhotos',
//       fillExtraInfo: 'FillExtraInfo',
//       postComplete: 'postComplete',
//       postListingClick: 'postListingClick',
//       postListingRent: 'postListingRent',
//       postListingSale: 'postListingSale',
//       createListing: 'createListing',
//       createListing1: 'createListing1',
//       createListing2: 'createListing2',
//       createListing3: 'createListing3',
//       createListingGPS: 'createListingGPS',
//       clickCreateListingSubmitGPS: 'clickCreateListingSubmitGPS',
//       createListingKeyCollection: 'createListingKeyCollection',
//       createListingShare: 'createListingShare',
//       clickCreateListingSkipShare: 'clickCreateListingSkipShare',
//       createListingThankYou: 'createListingThankYou',
//       search: 'search',
//       clickPropertyForRent: 'clickPropertyForRent',
//       clickPropertyForSell: 'clickPropertyForSell',
//       clickCreateListingSubmitHomeRunner: 'clickCreateListingSubmitHomeRunner'
//     }
//   },
//   login: {
//     category: 'Login',
//     action: {
//       enterNumber: 'EnterNumber',
//       enterOTP: 'EnterOTP',
//       userLogin: 'User_Login',
//       userRegistered: 'User_Registered'
//     }
//   },
//   user: {
//     category: 'Profile',
//     action: {
//       updateProfile: 'User_Profile_Update'
//     }
//   }
// }
