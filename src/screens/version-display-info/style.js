import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default {
  container: {
    width: width,
    flex: 1,
  },
  TextStyleHeaderTag: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    marginTop: 5,
    marginBottom: 20,
    color: "#000"
  },
  mainStyle: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  PropertyInfoViewTabLabel: {
    fontSize: 15,
    fontFamily: "OpenSans-Light",
    color: "black",
    marginLeft: 10
  }
};
