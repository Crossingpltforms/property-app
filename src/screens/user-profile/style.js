import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  container: {
    width: width * 0.9,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 20
  },
  listStyle: {
    flexDirection: "row",
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 13,
    textAlign: "left",
    fontFamily: "OpenSans-Light",
    color: "#000"
  },
  profileImg: {
    marginTop: (height * 2) / 100,
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#cccccc"
  },
  TextStyleHeaderTag: {
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
    marginTop: 15,
    color: "#000"
  }
};
