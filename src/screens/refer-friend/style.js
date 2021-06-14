import { Dimensions, StyleSheet } from 'react-native'
import Matrics from '../../common/styles/matrics'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  primaryBox: {
    flex: 1,
    marginHorizontal: Matrics.ScaleValue(0),
    marginVertical: Matrics.ScaleValue(15),
    backgroundColor: 'white',
    borderRadius: Matrics.ScaleValue(4),
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: Matrics.ScaleValue(4),
    shadowOffset: { width: 0, height: 2 },
    width: Matrics.screenWidth - Matrics.ScaleValue(20)
  },
  userBox: {
    flexDirection: 'row',
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFE100',
    paddingHorizontal: Matrics.ScaleValue(20),
    paddingBottom: Matrics.ScaleValue(10)
  },
  username: {
    fontWeight: '800',
    fontSize: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    color: 'black'
  },
  profileImg: {
    marginTop: (height * 2) / 100,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#cccccc'
  },
  introduceBox: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  descriptionScrollView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF'
  },
  secondaryBox: {
    paddingHorizontal: Matrics.ScaleValue(20)
  },
  descriptionTitle: {
    paddingTop: Matrics.ScaleValue(20),
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold'
  },
  pointBox: {
    // paddingTop: Matrics.ScaleValue(5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Matrics.ScaleValue(5)
  },
  pointText: {
    flex: 1,
    lineHeight: 25,
    fontSize: 16,
    color: 'black',
    fontWeight: 'normal'
  },
  point: {
    color: '#ffe100',
    fontSize: 36,
    marginRight: Matrics.ScaleValue(10)
  },
  imagePoint: {
    width: 30,
    height: 30,
    marginRight: Matrics.ScaleValue(10)
  },
  copyBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 10
  },
  descriptionContentWithHeader_1: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    paddingTop: height * 0.02
  },
  descriptionContentWithHeader_2: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'normal',
    flexWrap: 'wrap'
  },
  achievementsView: {
    paddingTop: height * 0.02,
    width: 240,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    alignSelf: 'center'
  },
  achievementsViewTab: {
    width: '100%',
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.01,
    paddingLeft: 35,
    backgroundColor: '#CCCCCC'
  },
  achievementsViewText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'normal',
    paddingLeft: 10
  },
  featuredView: {
    width: width * 0.9,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: height * 0.02
  },
  featuredViewOne: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageMain: {
    width: width - Matrics.ScaleValue(20),
    height: 200
  },
  imageOther: {
    width: 130,
    height: 130,
    marginTop: 20
  },
  bytapText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    color: 'blue'
  },
  customSize: (width, height) => ({
    width,
    height
  }),
  customImageSize: (w, h) => ({
    width: w,
    height: h
  }),
  toastViewStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    bottom: Matrics.ScaleValue(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Matrics.ScaleValue(5),
    width: Matrics.ScaleValue(100),
    alignSelf: 'center',
    borderRadius: Matrics.ScaleValue(4),
    position: 'absolute'
  },
  toastTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(10),
    color: 'white',
    fontWeight: '400'
  },
  myRefreesButtonContainer: {
    width: Matrics.ScaleValue(100),
    height: Matrics.ScaleValue(35),
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  myRefreeButtonTextStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: Matrics.ScaleValue(12)
  },
  myReferOutterViewContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center'
  },
  myReferInnerViewContainer: {
    alignItems: 'flex-start',
    top: 8,
    marginHorizontal: 20
  }
})
