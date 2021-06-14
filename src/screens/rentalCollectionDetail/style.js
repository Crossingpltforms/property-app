import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default {
  container: {
    width: width * 0.9,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 20
  },
  listStyle: {
    flexDirection: "column",
  },
  textStyle: {
    fontSize: 13,
    textAlign: "left",
    fontFamily: "OpenSans-Light",
    color: "#000"
  },
  TextStyleHeaderTag: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    marginTop: 15,
    color: "#000"
  },
  dividerStyle: {
    backgroundColor: "#CBCBCB",
    width: "100%",
    height: 2,
    marginTop: 20,
    marginBottom: 10
  }
};
