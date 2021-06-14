import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  listViewOne: {
    width: width * 0.9,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  listContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02
  },
  textOne: {
    fontSize: 15,
    fontFamily: "OpenSans-Light",
    color: "black"
  },
  textAbout: {
    fontSize: 13,
    fontFamily: "OpenSans-Bold",
    color: "grey"
  },
  listStyle: {
    flexDirection: "row",
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 15,
    textAlign: "left",
    fontFamily: "OpenSans-SemiBold",
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
  },
  container: {
    width: width * 0.9,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
};
