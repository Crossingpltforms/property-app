import { Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF'
    // paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  tenantTitle: {
    fontSize: 28,
    color: "#000000",
    fontWeight: "bold",
    paddingTop: height * 0.03,
    alignSelf: 'flex-start'
  },
  tenantHelpScrollView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width * 0.9,
    alignSelf: 'center'
  },
  tenantHelpContent: {
    width: "100%",
    marginTop: 50
  },
  tenantText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.015
  },
  customImageSize: (w, h) => ({
    width: w,
    height: h,
  }),
  customSize: (width, height) => ({
    width,
    height
  }),
  tenantContentWithHeader_1: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold'
  },
  tenantContentWithHeader_2: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'normal',
    flexWrap: 'wrap',
    marginTop: 2,

    textAlign: 'center'
  },
  bottomText: {
    fontSize: 15,
    marginTop: height * 0.05,
    color: 'black',
    fontWeight: 'normal',
    alignSelf: "flex-start"
  },
  imageContainer: {
    width: 40,
    height: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 1
  },
  contentWithHeader_1: {
    fontSize: 21,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 10,
  },
  contentWithHeader_2: {
    fontSize: 16,
    color: "#606060",
    fontWeight: "normal",
    flexWrap: "wrap",
    marginTop: 5
  },
  extraText: {
    fontSize: 15,
    color: "black",
    fontWeight: "normal",
    flexWrap: "wrap",
    marginTop: 5
  }
})