import { Matrics, Fonts, Color } from '../../common/styles'
import { Platform, Dimensions } from 'react-native'
const { height } = Dimensions.get('window')

export default styles = {
  main: {
    marginHorizontal: Matrics.ScaleValue(20),
    marginVertical: Matrics.ScaleValue(15)
  },
  chatAndCRViewContainer: {
    height: Matrics.ScaleValue(35),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatAndCRInnerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  threeDotImageViewStyle: {
    flex: 1,
    paddingRight: Matrics.ScaleValue(15),
    alignItems: 'center',
    justifyContent: 'center'
  },
  threeDotImageStyle: {
    height: Matrics.ScaleValue(15),
    width: Matrics.ScaleValue(15),
    transform: [{ rotate: '90deg' }]
  },
  mainContainerStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: Matrics.ScaleValue(4),
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: Matrics.ScaleValue(4),
    shadowOffset: { width: 0, height: 2 }
  },
  touchableMainContainer: {
    flex: 1,
    borderRadius: Matrics.ScaleValue(4)
  },
  imageMainViewContainer: {
    height: Matrics.ScaleValue(150),
    borderTopLeftRadius: Matrics.ScaleValue(4),
    borderTopRightRadius: Matrics.ScaleValue(4),
    overflow: 'hidden'
  },
  imageStyle: {
    flex: 1
  },
  detailTextMainViewContainer: {
    flex: 1,
    paddingHorizontal: Matrics.ScaleValue(15),
    paddingVertical: Matrics.ScaleValue(10)
  },
  priceViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceTextStyle: {
    fontSize: Matrics.ScaleValue(17),
    textAlign: 'left',
    fontWeight: 'bold'
  },
  newListingViewStyle: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Matrics.ScaleValue(8),
    paddingVertical: Matrics.ScaleValue(5),
    backgroundColor: Color.primary,
    borderRadius: Matrics.ScaleValue(5)
  },
  newListingTextStyle: {
    fontSize: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-SemiBold'
  },
  nameContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    marginTop: Matrics.ScaleValue(10)
  },
  typeTextStyle: {
    fontSize: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-SemiBold'
  },
  nameTextStyle: {
    fontSize: Matrics.ScaleValue(14),
    fontWeight: 'bold',
    paddingVertical: Matrics.ScaleValue(3)
  },
  otherInfoContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Matrics.ScaleValue(10)
  },
  otherInfoViewStyle: { flexDirection: 'column', flex: 1 },
  infoViewStyle: {
    flexDirection: 'row',
    marginVertical: Matrics.ScaleValue(2)
  },
  iconStyle: {
    height: Matrics.ScaleValue(15),
    width: Matrics.ScaleValue(15)
  },
  detailTextStyle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: Matrics.ScaleValue(12),
    marginLeft: Matrics.ScaleValue(8)
  },
  tagContainerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: Matrics.ScaleValue(5),
    marginTop: Matrics.ScaleValue(5)
  },
  tagImageStyle: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50)
  },
  mapButtonContainer: {
    height: Matrics.ScaleValue(30),
    width: Matrics.ScaleValue(80),
    paddingHorizontal: Matrics.ScaleValue(10),
    borderRadius: Matrics.ScaleValue(20),
    marginTop: Matrics.ScaleValue(10),
    marginLeft: Matrics.ScaleValue(-10),
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: Matrics.ScaleValue(4),
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    position: 'absolute',
    backgroundColor: Color.white
  },
  sliderImageStyle: {
    flex: 1,
    backgroundColor: '#cccccc'
  },
  sliderScrollStyle: {
    height: '100%',
    width: Matrics.screenWidth - Matrics.ScaleValue(38)
  },
  buttonStyle: {
    flex: 1,
    height: Matrics.ScaleValue(35),
    marginHorizontal: Matrics.ScaleValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Matrics.ScaleValue(5),
    borderRadius: Matrics.ScaleValue(5),
    borderWidth: 1,
    borderColor: Color.iconBlue
  },
  buttonTextStyle: {
    fontSize: Matrics.ScaleValue(11),
    fontFamily: 'OpenSans-Regular',
    fontWeight: '800'
  },
  blueButton: {
    backgroundColor: Color.iconBlue
  },
  blueButtonText: {
    color: 'white'
  },
  simpleButton: {
    backgroundColor: Color.white
  },
  simpleButtonText: {
    color: Color.iconBlue
  },
  typeDropDownRoot: {
    width: Matrics.ScaleValue(120),
    height: Matrics.ScaleValue(80),
    backgroundColor: 'white',
    position: 'absolute',
    top: Matrics.ScaleValue(-10),
    zIndex: 5,
    right: Matrics.ScaleValue(10),
    borderColor: 'grey',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeDropDownViews: {
    width: '100%',
    height: Matrics.ScaleValue(39.5),
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Matrics.ScaleValue(5)
  },
  resubmitBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Matrics.ScaleValue(10),
    marginBottom: Matrics.ScaleValue(10)
  },
  resubmitBtnInnerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resubmitBtnText: { fontSize: 14, fontFamily: 'OpenSans-Bold' },
  deleteReasonText: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: 'gery',
    paddingLeft: 5
  },
  inActiveSectionButtonContainer: {
    marginTop: Matrics.ScaleValue(10),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
}
module.exports = styles
