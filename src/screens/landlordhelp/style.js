import { Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF'
    // paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  landlordScrollView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,

    alignSelf: 'center',
    backgroundColor: '#FFFFFF'
  },

  landlordTitle: {
    fontSize: 28,
    color: '#000000',
    fontWeight: 'bold',
    paddingTop: height * 0.03
  },
  landlordContentView: {
    width: '100%',
    marginTop: 50
  },
  customImageSize: (w, h) => ({
    width: w,
    height: h
  }),
  imageContainer: {
    width: 40,
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 1
  },
  contentWithHeader_1: {
    fontSize: 21,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 10
  },
  contentWithHeader_2: {
    fontSize: 16,
    color: '#606060',
    fontWeight: 'normal',
    flexWrap: 'wrap',
    marginTop: 5
  },
  extraText: {
    fontSize: 14,
    color: '#606060',
    fontWeight: 'normal',
    flexWrap: 'wrap',
    marginTop: 5,
    fontFamily: 'Arial-BoldMT'
  },
  landlordContentText: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: width * 0.75
  },
  bottomText: {
    fontSize: 15,
    width: width * 0.8,
    marginTop: height * 0.05,
    color: 'black',
    fontWeight: 'normal',
    marginBottom: height * 0.14
  }
})
