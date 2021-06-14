import { Platform } from "react-native";
import { Matrics, Fonts, Color } from "../../common/styles";

export default (styles = {
  header: {
    flex: 1,
    backgroundColor: "#FFE100"
  },
  textLeft: { textAlign: "left" },
  backTouch: {
    padding: Matrics.ScaleValue(10)
  },
  headerView: {
    justifyContent: "flex-start",
    padding: Matrics.ScaleValue(10),
    height: Matrics.ScaleValue(70),
    marginTop: Platform.OS === "android" ? Matrics.ScaleValue(20) : 0
  },
  loginText: {
    fontSize: Matrics.ScaleValue(25),
    fontFamily: Fonts.type.OpenSansBold,
    paddingLeft: Matrics.ScaleValue(25),
    color: Color.black
  },
  descText: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    paddingLeft: Matrics.ScaleValue(25),
    color: Color.black,
    marginTop: Matrics.ScaleValue(15)
  },
  btn1Styles: {
    height: Matrics.ScaleValue(45),
    width: Matrics.screenWidth / 2.4,
    backgroundColor: "transparent",
    alignSelf: "center"
  },
  btn2Styles: {
    height: Matrics.ScaleValue(45),
    width: Matrics.screenWidth / 2.4,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(5),
    alignSelf: "center"
  },
  btnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 150,
    width: Matrics.screenWidth - Matrics.ScaleValue(50),
    alignSelf: "center"
  },
  resendOtpView: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 30
  }
});
module.exports = styles;
