import { Dimensions } from "react-native";
import { Matrics, Fonts, Color } from "../../common/styles";

const { width, height } = Dimensions.get("window");

export default {
  mainContainer: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: Matrics.ScaleValue(20),
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
  },
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  text1: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    color: Color.black
  },
  text2: {
    fontSize: Matrics.ScaleValue(9),
    fontFamily: Fonts.type.OpenSans,
    color: Color.black,
  },
  button2: {
    width: 132,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  button3: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "flex-end",
    borderColor: "black",
    borderWidth: 0,
  },
  formInputRoot: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: Matrics.screenWidth - 30,
    marginTop: height * 0.02
  },
  formInput: {
    width: Matrics.screenWidth - 30,
    height: Matrics.ScaleValue(40),
    borderColor: "#3F3F3F",
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(6),
    paddingLeft: Matrics.ScaleValue(20),
    marginTop: height * 0.015,
    fontSize: Matrics.ScaleValue(12)
  },
  formInputRoot2: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: (Matrics.screenWidth / 2) - 25,
    marginTop: height * 0.02
  },
  formInput2: {
    width: (Matrics.screenWidth / 2) - 25,
    height: Matrics.ScaleValue(40),
    borderColor: "#3F3F3F",
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(6),
    paddingLeft: Matrics.ScaleValue(20),
    marginTop: height * 0.015,
    fontSize: Matrics.ScaleValue(12)
  },
  formInputText: {
    fontSize: Matrics.ScaleValue(12),
    fontWeight: "normal",
    color: Color.black
  },
  LoaderContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1
  },
  LoaderWrapper: {
    width: "25%",
    height: "18%",
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10
  },
  LoaderText: {
    color: "black",
    textAlign: "center"
  },
};
