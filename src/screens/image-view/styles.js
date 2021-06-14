import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// const IS_IPHONE_X = height === 812 || height === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? (IS_IPHONE_X ? 44 : 20) : 0;
// const HEADER_HEIGHT = Platform.OS === "ios" ? (IS_IPHONE_X ? 88 : 64) : 64;
// const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000",
    height: height,
    width: width
  },
  imgStyle: {
    marginTop: 10,
    height: 400,
    width: width
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: 350,
    resizeMode: "cover"
  }
};
