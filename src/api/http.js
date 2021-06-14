import { Platform } from 'react-native'

const PRODUCTION = false

// const pathDev = 'http://domain.com' // Alpha
const pathDev = 'https://domain.com' // Beta
const path = 'https://domain.com' // Live

// const chatDev = 'http://domain.com'     // Alpha
const chatDev = 'https://domain.com' // Beta
const chat = 'https://domain.com' // Live

// const moreDev = 'http://domain/more/' // Alpha
const moreDev = 'http://domain/more/' // Beta
const more = 'https://domain/more/' // Live

const CHATURL = PRODUCTION ? chat : chatDev
const MOREURL = PRODUCTION ? more : moreDev
const APIURL = PRODUCTION ? `${path}/v2` : `${pathDev}/v2`

const areaList = 'recommended/popular/areas'
const pinRequest = 'pin/request'
const pinVerify = 'pin/verify'
const propertySearch = 'properties/search'
const propertyOurPicks = 'recommended/popular/properties'
const relatedPropertiesEndPoint = 'properties/similar'
const autoCompleteEndPoint = 'properties/search/name/autocomplete'
const registerEmailEndpoint = 'registerEmail'
const registerNumberEndpoint = '/pin/request'
const chatRequestEndpoint = 'chat/request'
const instantViewRequestEndPoint = 'homerunner/instantview'
const tenantSearchListEndPoint = 'chat/tenant-search/list'
const tenantSearchChatRequestEndPoint = 'chat/tenant-search/submit'
const updateInstallSource = (user_id) => `users/${user_id}/install-source`
const profileDetails = (customer_id) => `users/${customer_id}`
const profileDetailsGet = (customer_id) => `users/${customer_id}/profile`
const createProperty = 'properties'
const updateProperty = (id) => `properties/${id}`
const updateProfileDetails = (customer_id) => `users/${customer_id}/profile`
const favProperty = (customer_id) => `users/${customer_id}/favourite-properties`
const userProperties = (user_id, pageNumber, pageSize, sort) =>
  `users/${user_id}/properties?&pageNumber=${pageNumber}&pageSize=${pageSize}&sort=${sort}`
const deleteListing = (property_id) => `properties/${property_id}/archive`
const activateProperty = (property_id) => `properties/${property_id}/activate`
const deletePhotos = (id) => `properties/images/${id}`
const removeFavProperty = (customer_id) =>
  `users/favourite-properties/${customer_id}`
const getPropertyById = (id) => `properties/${id}`
const deletePhoto = (id) => `properties/images/${id}`
const myFavourites = (userId) => `users/${userId}/favourite-properties`
const setCoverImage = (property_id, imageId) =>
  `properties/${property_id}/images/${imageId}`
const updateImageProperty = (property_id, imageId) =>
  `properties/${property_id}/images/${imageId}`
const saveToken = 'device-clouds'
const getRentalInfo = 'rental/getInfo'
const getPayUrl = (id) => `rental/order/pay/${id}`
const reportProperty = (id) => `properties/${id}/reports`
const homeRunnerEndPoint = 'homerunner/key'
const getAppLatestVersion = (id) => `app/requirement?osVersion=${id}`
const getAppointment = (id) => `appointments/properties/${id}`
const postAppointment = 'appointments/submit'
const propertyAlert = 'properties/alerts'
const getPropertyInfo = (id) => `chat-conversations/${id}`
const homeRunnerReturnEndPoint = 'homerunner/key/return'
const eventTrackig = 'users/track'
const getAppointmentByUserId = (userId) => `appointments/users/${userId}`
const getAppointmentsByChatConversationId = (backendChatConversationId) =>
  `appointments/chats/${backendChatConversationId}`
const getBannerTextByChatConversationId = (backendChatConversationId) =>
  `chat-conversations/${backendChatConversationId}/banner`
const getTotalUnreadChatNumber = () => `chat-conversations/unread/count`
const myRefereerList = (user_id) => `referral/${user_id}/referees/list`
const callUrgentAPI = (conversationID) =>
  `chat-conversations/${conversationID}/urgent`
const reportUserAPI = (chat_id) => `chat-conversations/${chat_id}/report`
const ramciStatus = () => `ramci/status`
const ramciSubmit = () => `ramci/submit`
const ramciConsent = () => `ramci/update-consent`
const getUserDocuments = (user_id) => `documents/users/${user_id}`
const uploadUserDocuments = (userDocId) => `documents/${userDocId}/upload`
const preCheck = `pin/pre-check`
const facebookVerify = `pin/facebookconnect/verify`
const facebookConnect = `pin/facebookconnect`
const getSpecialOffers = `partnerships/campaigns/on-going`
const loginWithPassword = `login`
const resetPassword = (customer_id) => `users/${customer_id}/reset-password`
const submitFeedback = () => 'api/users/feedbacks'

module.exports = {
  PRODUCTION,
  APIURL,
  CHATURL,
  MOREURL,
  areaList,
  pinRequest,
  pinVerify,
  propertySearch,
  propertyOurPicks,
  chatRequestEndpoint,
  instantViewRequestEndPoint,
  tenantSearchListEndPoint,
  tenantSearchChatRequestEndPoint,
  registerEmailEndpoint,
  relatedPropertiesEndPoint,
  registerNumberEndpoint,
  profileDetails,
  profileDetailsGet,
  updateProfileDetails,
  createProperty,
  updateProperty,
  autoCompleteEndPoint,
  homeRunnerReturnEndPoint,
  favProperty,
  eventTrackig,
  removeFavProperty,
  userProperties,
  deleteListing,
  activateProperty,
  deletePhotos,
  getPropertyById,
  deletePhoto,
  myFavourites,
  setCoverImage,
  saveToken,
  updateInstallSource,
  updateImageProperty,
  getRentalInfo,
  getPayUrl,
  reportProperty,
  homeRunnerEndPoint,
  getAppLatestVersion,
  getAppointment,
  postAppointment,
  propertyAlert,
  getPropertyInfo,
  getAppointmentByUserId,
  getAppointmentsByChatConversationId,
  getBannerTextByChatConversationId,
  getTotalUnreadChatNumber,
  myRefereerList,
  callUrgentAPI,
  reportUserAPI,
  ramciStatus,
  ramciSubmit,
  ramciConsent,
  getUserDocuments,
  uploadUserDocuments,
  getSpecialOffers,
  submitFeedback,
  facebookVerify,
  facebookConnect,
  preCheck,
  loginWithPassword,
  resetPassword
}
