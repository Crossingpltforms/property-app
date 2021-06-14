import { Matrics, Fonts, Color } from '../../common/styles'
import { Platform, Dimensions } from 'react-native'
const { height } = Dimensions.get('window')

export default styles = {
  mainContainerStyle: {
    flex: 1,
    marginHorizontal: Matrics.ScaleValue(20),
    marginVertical: Matrics.ScaleValue(15),
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
  }
}
module.exports = styles
