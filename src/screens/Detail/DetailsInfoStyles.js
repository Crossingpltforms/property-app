import { Dimensions, StyleSheet } from 'react-native'
import { Matrics, Color } from '../../common/styles'

const { width, height } = Dimensions.get('window')

const DetailsInfoStyles = StyleSheet.create({
  detailsInfoRootContainer: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10,
    padding: 10,
    width: width - 30
  },
  photoOrVideo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  photoOrVideoBtn: {
    backgroundColor: '#fff',
    borderWidth: Matrics.ScaleValue(1),
    borderColor: Color.iconBlue,
    borderRadius: Matrics.ScaleValue(10),
    paddingVertical: Matrics.ScaleValue(4),
    paddingHorizontal: Matrics.ScaleValue(8),
    flexDirection: 'row',
    alignItems: 'center'
    // shadowColor: '#000',
    // shadowOpacity: 0.3,
    // elevation: 6,
    // shadowOffset: { width: 0, height: 2 }
  },
  photoOrVideoBtnActive: {
    backgroundColor: Color.iconBlue
  },
  photoOrVideoBtnRight: {
    marginRight: Matrics.ScaleValue(10)
  },
  photoOrVideoImg: {
    marginRight: 5
  },
  photoOrVideoImgActive: {
    color: '#fff'
  },
  photoOrVideoImgInActive: {
    color: Color.iconBlue
  },
  btnText: {
    color: '#000',
    fontFamily: 'OpenSans-SemiBold'
  },
  photoOrVideoTextActive: {
    color: '#fff'
  },
  photoOrVideoTextInActive: {
    color: Color.iconBlue
  },
  textBold: {
    fontFamily: 'OpenSans-SemiBold'
  },
  textLight: {
    fontFamily: 'OpenSans-Light'
  },
  nameStyle: {
    fontSize: Matrics.ScaleValue(15),
    textAlign: 'left',
    fontWeight: '600',
    color: '#000'
  },
  addressStyle: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'left',
    color: Color.iconBlue,
    marginTop: Matrics.ScaleValue(2)
  },
  newListingContainer: {
    width: Matrics.ScaleValue(90),
    alignItems: 'center',
    paddingHorizontal: Matrics.ScaleValue(8),
    paddingVertical: Matrics.ScaleValue(5),
    backgroundColor: Color.primary,
    borderRadius: Matrics.ScaleValue(5)
  },
  newListingText: {
    fontSize: Matrics.ScaleValue(10),
    fontFamily: 'OpenSans-SemiBold'
  },
  propertyType: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: 'left',
    fontFamily: 'OpenSans-Light'
  },
  roomType: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000'
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: Matrics.ScaleValue(5)
  },
  priceTextStyle: {
    fontSize: Matrics.ScaleValue(17),
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold'
  },
  salePriceTextStyle: {
    fontSize: Matrics.ScaleValue(17),
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold'
  },
  tagViewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  tagImageVideoViewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  tagImageStyle: {
    height: Matrics.ScaleValue(60),
    width: Matrics.ScaleValue(60)
  },
  propertyTypeViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Matrics.ScaleValue(4)
  },
  iconWithDetailMainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: Matrics.ScaleValue(5)
  },
  iconWithDetailSubContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  iconWithDetailViewContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: Matrics.ScaleValue(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWithDetailTextStyle: {
    fontSize: Matrics.ScaleValue(11),
    fontFamily: 'OpenSans-Regular',
    color: '#000'
  },
  iconWithDetailImageStyle: {
    height: Matrics.ScaleValue(18),
    width: Matrics.ScaleValue(18)
  }
})

export default DetailsInfoStyles
