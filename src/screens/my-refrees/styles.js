import { Dimensions, StyleSheet } from 'react-native'
import { Matrics, Color } from '../../common/styles'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  descriptionScrollView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF'
  },

  descriptionTitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    paddingTop: height * 0.03,
    paddingHorizontal: Matrics.ScaleValue(30)
  },
  descriptionContent: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'normal',
    paddingTop: height * 0.02,
    flexWrap: 'wrap'
  },
  descriptionContentWithHeader_1: {
    fontSize: Matrics.ScaleValue(15),
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
    width: width,
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
  mediumTextStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: Matrics.ScaleValue(14),
    color: 'black'
  },
  innerMainViewContainer: { flexGrow: 1, marginTop: Matrics.ScaleValue(20) },
  myRefereeInfoViewContainer: {
    flex: 1,
    height: Matrics.ScaleValue(200),
    borderRadius: Matrics.ScaleValue(10),
    borderWidth: 0.5,
    borderColor: Color.lightGray,
    marginHorizontal: Matrics.ScaleValue(20),
    marginBottom: Matrics.ScaleValue(15),
    marginTop: Matrics.ScaleValue(40),
    alignItems: 'center',
    paddingHorizontal: Matrics.ScaleValue(20)
  },
  myRefereerInnerViewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  myRefereerInfoChildContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  wantToMoreViewContainer: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(80),
    borderRadius: Matrics.ScaleValue(80) / 2,
    backgroundColor: Color.bubbleLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute'
  },
  wantToMoreChildContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: width
  }
})
