import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  descriptionScrollView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: width * 0.9,
    alignSelf: "center"
  },

  descriptionTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    paddingTop: height * 0.03
  },
  descriptionContent: {
    fontSize: 15,
    color: "black",
    fontWeight: "normal",
    paddingTop: height * 0.02,
    flexWrap: "wrap"
  },
  descriptionContentWithHeader_1: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    paddingTop: height * 0.02
  },
  descriptionContentWithHeader_2: {
    fontSize: 15,
    color: "black",
    fontWeight: "normal",
    flexWrap: "wrap"
  },
  achievementsView: {
    paddingTop: height * 0.02,
    width: 240,
    flexDirection: "column",
    justifyContent: "flex-start",

    alignSelf: "center"
  },
  achievementsViewTab: {
    width: "100%",
    height: 40,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: height * 0.01,
    paddingLeft: 35,
    backgroundColor: "#CCCCCC"
  },
  achievementsViewText: {
    fontSize: 15,
    color: "black",
    fontWeight: "normal",
    paddingLeft: 10
  },
  featuredView: {
    width: width * 0.9,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: height * 0.02
  },
  featuredViewOne: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  customSize: (width, height) => ({
    width,
    height
  }),
  customImageSize: (w, h) => ({
    width: w,
    height: h
  })
});
