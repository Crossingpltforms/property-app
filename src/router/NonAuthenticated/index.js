import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Login from '../../screens/login'
import LoginOptions from '../../screens/loginOptions'
import Number from '../../screens/Number'
import Email from '../../screens/Email'
import Otp from '../../screens/otp'
import PreCheck from '../../screens/pre-check'
import Confirm from '../../screens/Confirm'
import Terms from '../../screens/terms'
import Policy from '../../screens/policy'
import EmailConfirm from '../../screens/EmailConfirm'
import Home from '../../screens/Home'
import Extrainfo from '../../screens/extra-info'
import CreateListing from '../../screens/create-listing'
import UploadPhoto from '../../screens/upload-photo'
import ChatRequest from '../../screens/chat/ChatRequest'
import Nationality from '../../screens/chat/Nationality'
import MyListing from '../../screens/my-listing'
import Editlisting from '../../screens/edit-listing'
import Editlistupload from '../../screens/edit-list-photoupload'
import EditExtrainfo from '../../screens/Edit-extra-info'
import EditConfirmGPS from '../../screens/edit-confirm-gps'
import EditPersonInfo from '../../screens/edit-person-info'
import ListingPageDetail from '../../screens/Detail'
import MoveIndate from '../../screens/chat/MoveInDate'
import ConfirmGPS from '../../screens/confirm-gps'
import AppDetail from '../../screens/version-display-info'
import MyFavourites from '../../screens/my-favourites'
import ShareList from '../../screens/share-list'
import ThankYou from '../../screens/ThankYou'
import HomeRunner from '../../screens/HomeRunner'
import RentalCollection from '../../screens/rentalCollection'
import RentalCollectionDetail from '../../screens/rentalCollectionDetail'
import TenantSearch from '../../screens/TenantSearch'
import CreateListingSell from '../../screens/createpropertysell'
import UploadPhotoSell from '../../screens/upload-photo-sell'
import ExtraInfoSell from '../../screens/extra-info-sell'
import ChatRequestSell from '../../screens/chatrequestsell'
import ImageView from '../../screens/image-view'
import AboutUs from '../../screens/aboutus'
import ContactUs from '../../screens/contactus'
import LandlordHelp from '../../screens/landlordhelp'
import TenantHelp from '../../screens/tenanthelp'
import HomeRunnerCollectKey from '../../screens/home-runner-collect-key'
import HomeRunnerReturnKey from '../../screens/home-runner-return-key'
import ChatInfo from '../../screens/chat-info'
import SystemChatInfo from '../../screens/system-chat-info'
import MultipleCRDetail from '../../screens/CR-Detail-screen'
import MultipleCRListing from '../../screens/multiple-chat-request'
import Refer from '../../screens/refer-friend'
import FAQ from '../../screens/faq'
import ReferTermsCondition from '../../screens/refer-terms'
import AdditionalInfo from '../../screens/chat/additionalInfoModal'
import instantViewRequestModal from '../../screens/chat/InstantViewRequestModal'
import ChatMessages from '../../screens/chatTab/ChatMessages.js/index'
import KeywordSearchList from '../../screens/keywordSearchList'
import UserProfile from '../../screens/user-profile'
import Tabbar from '../Authenticated/Tabbar'
import GroupAppointmentView from '../../screens/chat/GroupAppointmentModal/GroupAppointmentView'
import MyReferees from '../../screens/my-refrees'
import BlockedUser from '../../screens/blockeduser'

export const AppContainer = () => {
  const app = createStackNavigator(
    {
      Login,
      Tab: {
        screen: Tabbar,
        navigationOptions: {
          gestureEnabled: false
        }
      },
      initialRouteName: Home,
      Confirm,
      ConfirmGPS,
      ShareList,
      ThankYou: {
        screen: ThankYou,
        navigationOptions: {
          gestureEnabled: false
        }
      },
      Otp,
      PreCheck,
      BlockedUser,
      Terms,
      ReferTermsCondition,
      Refer,
      Policy,
      FAQ,
      LoginOptions,
      Email,
      ChatRequest,
      ChatInfo,
      SystemChatInfo,
      EmailConfirm,
      Number,
      Extrainfo,
      ListingPageDetail,
      UploadPhoto,
      HomeRunner,
      Nationality,
      MultipleCRDetail,
      MultipleCRListing,
      instantViewRequestModal,
      MyListing: {
        screen: MyListing,
        navigationOptions: {
          gestureEnabled: false
        }
      },
      TenantSearch,
      Editlisting,
      Editlistupload: {
        screen: Editlistupload,
        navigationOptions: {
          gestureEnabled: false
        }
      },
      EditPersonInfo,
      EditConfirmGPS,
      MyFavourites,
      HomeRunnerCollectKey,
      HomeRunnerReturnKey,
      AdditionalInfo,
      MoveIndate,
      EditExtrainfo: {
        screen: EditExtrainfo,
        navigationOptions: {
          gestureEnabled: false
        }
      },
      KeywordSearchList,
      UserProfile,
      AppDetail,
      RentalCollection,
      RentalCollectionDetail,
      CreateListing,
      CreateListingSell,
      UploadPhotoSell,
      ExtraInfoSell,
      ChatRequestSell,
      ImageView,
      AboutUs,
      ContactUs,
      LandlordHelp,
      TenantHelp,
      ChatMessages: ChatMessages,
      GroupAppointmentView,
      MyReferees
    },
    {
      headerMode: 'none'
    }
  )
  const container = createAppContainer(app)
  return container
}
