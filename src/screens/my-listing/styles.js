import { Dimensions } from 'react-native'
import { Matrics, Fonts, Color } from '../../common/styles'

const { height, width } = Dimensions.get('window')

const layout1 = {
  justifyContent: 'center',
  alignItems: 'center'
}

const buttonStyle1 = bgcolor => ({
  width: 132,
  height: 40,
  borderRadius: 6,
  backgroundColor: bgcolor,
  ...layout1
})

export default {
  root: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  view1: {
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 6,
    borderStyle: 'dashed',
    height: 182,
    width: Matrics.screenWidth - 30,
    marginTop: height * 0.04,
    ...layout1
  },

  button1: {
    width: Matrics.screenWidth / 2.2,
    height: Matrics.ScaleValue(40),
    ...layout1,
    borderRadius: 6,
    backgroundColor: '#FFE100'
  },

  text1: {
    color: Color.black,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold
  },

  listMainView: {
    marginBottom: 30
  },

  buttonGroup1: {
    width: Matrics.screenWidth - 55,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 7
  },

  button2: buttonStyle1('#FFE100'),

  button3: {
    ...buttonStyle1('#FFFFFF'),
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6
  },
  styleItem: {
    marginTop: 20,

    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    position: 'relative'
  },

  txtKmStyle: {
    textAlign: 'center',
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    color: '#000',
    width: 80,
    backgroundColor: '#FFE100',
    fontFamily: 'OpenSans-Bold'
  },
  styleInfo: {
    flexDirection: 'column',
    borderRadius: 5,
    borderColor: 'black',
    height: height * 0.15,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  txtStyle: {
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    color: '#FFF',
    fontFamily: 'OpenSans-Bold'
  },
  LoaderContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1
  },
  LoaderWrapper: {
    width: '25%',
    height: '18%',
    backgroundColor: '#FFE100',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 10
  },
  LoaderText: {
    color: 'black',
    textAlign: 'center'
  },
  iconStyle: {
    width: 15,
    height: 18,
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#000'
  },
  category_Text: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'OpenSans-SemiBold',
    color: '#000',
    padding: 10
  },
  category_View: {
    paddingVertical: 5,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000',
    padding: 10
  },
  dividerStyle: {
    backgroundColor: '#CBCBCB',
    width: '100%',
    height: 1
  },
  textStyleHousingType: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey'
  },
  HeaderStyle: {
    flex: 1,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },

  listContainer: {
    flex: 1,
    padding: 25
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666'
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  listIcon: {
    fontSize: 26,
    color: '#666',
    width: 60
  },
  listLabel: {
    fontSize: 16,
    marginLeft: 15
  },
  typeDropDownRoot: {
    width: Matrics.ScaleValue(120),
    height: Matrics.ScaleValue(80),
    backgroundColor: 'white',
    position: 'absolute',
    top: Matrics.ScaleValue(20),
    zIndex: 5,
    right: Matrics.ScaleValue(20),
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
  bottomButton: {
    marginTop: 70,
    marginRight: Matrics.ScaleValue(20),
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  styleViewShadow: {
    justifyContent: 'center',
    backgroundColor: '#EBEEF5',
    height: Matrics.ScaleValue(35),
    width: '30%',
    borderRadius: 5
  },
  itemSeperator: { height: 0.5, width: '100%', backgroundColor: '#ffffff' },
  itemsWrapper: {
    alignItems: 'center',
    width: '100%',
    marginHorizontal: 10
  },
  itemCard: {
    height: 295,
    width: '100%',
    backgroundColor: '#cccccc',
    borderRadius: 5,
    // marginHorizontal: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 }
  },
  itemImgBackground: {
    height: 295,
    width: '100%',
    backgroundColor: '#cccccc',
    borderRadius: 5,
    // marginHorizontal: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 }
  },
  itemInfoContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    position: 'absolute'
  },
  itemInfoLogoContainer: { flexDirection: 'row', alignItems: 'center' },
  imgContactLess: { height: 50, width: 50, marginRight: 10 },
  imgNoDepoSit: { height: 60, width: 60, marginLeft: 10 },
  itemNameContainer: {
    width: '100%',
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  resubmitBtnContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    height: '100%'
  },
  resubmitBtnInnerWrapper: { flexDirection: 'row', flex: 2 },
  resubmitBtnText: { fontSize: 14, fontFamily: 'OpenSans-Bold' },
  deleteReasonText: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'OpenSans-Regular',
    color: 'gery',
    paddingLeft: 5,
    marginRight: 23
  },
  itemElementTypeText: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000'
  },
  itemBedRoomType: {
    fontSize: 14,
    textAlign: 'left',
    color: '#000'
  },
  itemCarParkPadding: {
    paddingLeft: 10
  },
  itemImgHeight: { height: 15, width: 15, marginLeft: 5 },
  itemPriceText: {
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 10,
    fontWeight: '500',
    color: '#90278E'
  },
  postPropertyBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  postPropertyBtn: {
    borderRadius: 5,
    marginHorizontal: 20,
    shadowColor: 'grey',
    shadowOpacity: 10,
    backgroundColor: '#FFF',
    elevation: 10,
    marginTop: 20,
    width: '60%'
  },
  postPropertyBtnInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  postPropertyBtnText: {
    fontSize: 15,
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: 10
  },
  addMorePropertyBtn: {
    borderRadius: 5,
    marginHorizontal: 20,
    shadowColor: 'grey',
    shadowOpacity: 10,
    backgroundColor: '#FFF',
    elevation: 10,
    marginVertical: Matrics.ScaleValue(15)
  },
  accordionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  accordionInnerContainer: {
    height: 10,
    width: 10,
    borderRadius: 5
  },
  accordionActive: {
    backgroundColor: 'green'
  },
  accordionInActive: {
    backgroundColor: 'grey'
  },
  accordionRejected: {
    backgroundColor: 'red'
  },
  accordionUpcoming: {
    backgroundColor: '#90278E'
  },
  accordionText: {
    fontSize: 17,
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: 10
  },
  rejectedModalInnerWrapper: {
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    height: height,
    width: width + 20,
    marginLeft: -30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabContainer: {
    height: height * 0.06,
    width,
    backgroundColor: '#FFE100',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5
  },
  tabActive: {
    width: (width * 1) / 2,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabInActive: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (width * 1) / 2,
    height: height * 0.05
  },
  tabText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 17,
    color: '#000'
  }
}
