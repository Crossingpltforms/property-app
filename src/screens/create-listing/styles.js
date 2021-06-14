import { Dimensions } from "react-native";
import { Matrics, Fonts, Color } from "../../common/styles";

const { width, height } = Dimensions.get("window");

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  viewOne: {
    marginTop: height * 0.02,
    width: Matrics.screenWidth - 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  text1: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold,
    color: Color.black
  },
  text2: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    color: Color.black,
    marginTop: height * 0.02
  },
  text3: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    color: Color.black,
    width: width * 0.4
  },
  viewTwo: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02
  },
  button1: {
    backgroundColor: "#FFE100",
    width: Matrics.ScaleValue(65),
    height: Matrics.ScaleValue(30),
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: Matrics.ScaleValue(50)
  },
  button2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE100",
    height: Matrics.ScaleValue(42),
    width: width * 0.9,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    marginTop: height * 0.02,
    marginBottom: height * 0.03
  },
  iconContainer: {
    flexDirection: "column",
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  iconView: {
    height: Matrics.ScaleValue(50),
    width: Matrics.ScaleValue(50),
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Matrics.ScaleValue(50)
  },
  homeIcon: {
    width: Matrics.ScaleValue(35),
    height: Matrics.ScaleValue(35)
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
  formTextError: {
    fontSize: Matrics.ScaleValue(10),
    color: "#FF0000",
    fontWeight: "normal",
    marginTop: 1
  },
  formInputGroupRoot: {
    width: Matrics.screenWidth - 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.012
  },
  picker: {
    borderColor: "#3F3F3F",
    borderWidth: 0.8,
    borderRadius: 5,
    width: width * 0.4,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.015,
    paddingLeft: 5,
    paddingRight: 5
  },
  queryView: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  style2: {
    width: "100%",
    height: 30,
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  style3: {
    width: "30%",
    height: 30,
    backgroundColor: "#FDE63E"
  },
  style4: {
    width: "60%",
    height: 30,
    backgroundColor: "#F7F7F7"
  },
  style5: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  textCustom1: (fontSize, color, fontWeight) => ({
    fontSize,
    color,
    fontWeight
  })
};
