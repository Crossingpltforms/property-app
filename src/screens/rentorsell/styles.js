import { Dimensions } from "react-native";
import { Matrics } from "../../common/styles";

const { width, height } = Dimensions.get("window");

export default {
  title: {
    height: 40,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonView: {
    width: "74%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonViewSelected: {
    width: "74%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    height: "10%",
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
    bottom: 0,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowColor: "#c5c5c5",
    elevation: 30,
    shadowOpacity: 1,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  nextButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE100",
    height: Matrics.ScaleValue(42),
    width: width * 0.8,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    marginTop: height * 0.03,
    marginBottom: height * 0.03
  },
  textStyleHousingType: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 14,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4885ED'
  },
};
