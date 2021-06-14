import { connect } from 'react-redux'
import component from './component'
import { bindActionCreators } from 'redux'
import {
  getProfileDetails,
  updateInputFields,
  updateErrorAlert,
  updateUserType,
  updateProfileDetailsAction
} from '../../store/actions'

function mapStateToProps ({ editPersonInfo }) {
  const {
    name,
    email,
    phone_number,
    whatsappNumber,
    country,
    occupation,
    profile_image,
    gender,
    error_alert,
    on_loading,
    type,
    numberOfProperties,
    experience,
    companyName,
    contractType,
    monthlyIncome,
    paxNumber,
    reasonForMove,
    cityOfLiving,
    dob
  } = editPersonInfo
  return {
    name,
    email,
    phone_number,
    whatsappNumber,
    country,
    occupation,
    profile_image,
    gender,
    error_alert,
    on_loading,
    type,
    numberOfProperties,
    experience,
    companyName,
    contractType,
    monthlyIncome,
    paxNumber,
    reasonForMove,
    cityOfLiving,
    dob
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getProfileDetails,
      updateInputFields,
      updateErrorAlert,
      updateUserType,
      updateProfileDetailsAction
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(component)
