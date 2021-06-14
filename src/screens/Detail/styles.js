import { Dimensions } from 'react-native'
import { Matrics, Color } from '../../common/styles'

const { width, height } = Dimensions.get('window')

export default {
  root: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  imgStyle: {
    marginTop: 10,
    height: 200,
    width: width
  },
  navBarContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center'
  },
  navBarBackIconView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: Matrics.ScaleValue(15)
  },
  navBarIconViewContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: Matrics.ScaleValue(10)
  },
  navBarFavIconStyle: { marginLeft: 5, paddingHorizontal: 5 },
  navBarShreIconStyle: { marginLeft: 5, paddingHorizontal: 5 },
  noCommisionWrapperStyle: {
    marginTop: 20,
    width: width - 50,
    height: 100,
    backgroundColor: '#d4e3fc',
    borderWidth: 3,
    borderColor: '#006ce8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noCommisionBoldTextStyle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '900',
    color: '#006ce8'
  },
  noCommisionNormalTextStyle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    fontWeight: '600',
    color: '#006ce8'
  },

  imgBannerStyle: {
    marginTop: 20,
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 30,
    paddingLeft: width / 2 - 150,
    height: 200
  },

  imgTextHead: {
    color: 'black',
    fontSize: 10,
    fontWeight: '600'
  },
  imgTextBody: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600'
  },

  imgTextTiny: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'normal'
  },
  labelTop: {
    width: width * 0.9,
    height: 44,
    backgroundColor: '#E4E4E4',
    marginTop: (height * 2) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },

  labTopText: {
    fontSize: 15,
    fontWeight: '200',

    color: '#090909'
  },
  furnishingLabel: {
    marginLeft: width * 0.075,
    color: 'black',
    marginTop: height * 0.025,
    alignSelf: 'flex-start',
    fontWeight: 'bold'
  },

  furnishingView: {
    width: width * 0.9,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: (height * 1.5) / 100
  },
  furnishingViewList: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: (height * 1.2) / 100
  },
  PropertyInfoViewTab: {
    width: width * 0.85,
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  furnishingViewTab: {
    width: (width * 36) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  furnishingViewTabLabel: {
    fontSize: 15,
    color: 'black'
  },
  PropertyInfoViewTabLabel: {
    fontSize: Matrics.ScaleValue(11),
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: Matrics.ScaleValue(5),
    color: 'black'
  },
  descriptInput: {
    width: width * 0.9,
    height: 187,
    borderColor: '#B1B1B1',
    borderWidth: 1,
    borderRadius: 2,
    marginTop: (height * 1.8) / 100
  },
  form: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: (height * 1.8) / 100
  },
  formLabel: {
    color: 'black',
    fontWeight: 'bold'
  },
  formInput: {
    width: 122,
    height: 25.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formBack: {
    height: 38,
    borderColor: 'black',
    borderRadius: 7,
    borderWidth: 1,
    width: 56.81,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButton: {
    height: 38.16,
    borderColor: '#FFDF00',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: '#FFDF00',
    alignItems: 'center',
    width: width * 0.65,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  nextButtonText: {
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
    color: '#000'
  },
  checkboxSelected: {
    borderRadius: 50,
    backgroundColor: '#00D598',
    borderColor: '#00D598'
  },
  checkboxUnSelected: {
    borderRadius: 50,
    backgroundColor: '#E4E4E4',
    borderColor: '#E4E4E4'
  },
  bottomButton: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
    // position: 'absolute',
    bottom: 10
  },
  styleViewShadow: {
    justifyContent: 'center',
    backgroundColor: Color.iconBlue,
    height: 42,
    width: '88%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  styleReportView: {
    justifyContent: 'center',
    height: 42,
    width: '80%'
  },
  styleTextFound: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  styleItem: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  txtKmStyle: {
    textAlign: 'center',
    fontSize: 14,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3, // TODO which padding?
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
    height: height * 0.13,
    width: '100%',
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 0
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  container: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1
  },
  styleReport: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: '#FFE100',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    width: null,
    height: 350,
    resizeMode: 'cover'
  },
  reportInputText: {
    width: '90%',
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  viewModal2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 10
  },
  viewModal1: {
    borderRadius: 6,
    width: '100%',
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20
  },
  buttonSubmit: {
    justifyContent: 'center',
    backgroundColor: '#FFE100',
    height: 42,
    alignItems: 'center',
    width: '30%',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  LoaderContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(#fff, #fff, #fff, 0.2)'
  },
  LoaderWrapper: {
    width: '25%',
    height: '18%',
    backgroundColor: '#FFE100',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: Matrics.ScaleValue(10)
  },
  LoaderText: {
    color: 'black',
    textAlign: 'center'
  },
  renderImgOrVideoContainer: {
    height: '100%',
    backgroundColor: '#000',
    position: 'relative'
  },
  imgCounterContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 30,
    width: 50,
    borderRadius: 15,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    position: 'absolute',
    bottom: 20,
    left: 10,
    zIndex: 1
  },
  imgCounterText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'OpenSans-SemiBold'
  }
}
