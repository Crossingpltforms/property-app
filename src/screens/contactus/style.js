import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  contactScrollView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: width * 0.9,
    alignSelf: "center"
  },

  contactTitle: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    paddingTop: height * 0.03
  },
  contactDetailsWithHeader_1: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    paddingTop: height * 0.02
  },
  contactDetailsWithHeader_2: {
    fontSize: 15,
    color: "#4885ED",
    fontWeight: "normal",
    flexWrap: "wrap"
  },
  customSize: (width, height) => ({
    width,
    height
  }),
  coverImage: {
    width: 174,
    height: 150,
    alignSelf: "center"
  }
});
