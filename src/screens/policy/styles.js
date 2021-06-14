import { Matrics, Fonts, Color } from "../../common/styles";
import { Platform } from "react-native";

export default (styles = {
  header: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerview: {
    flexDirection: "row",
    paddingTop: 20,
    paddingLeft: 20
  },
  bottomButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20
  },
  bytapText: {
    fontSize: 15,
    textAlign: 'left',
    fontFamily: 'OpenSans-Light',
    color: '#000'
  },
  backTouch: {
    padding: Matrics.ScaleValue(10)
  },
  headerView: {
    justifyContent: "flex-start",
    padding: Matrics.ScaleValue(10),
    height: Matrics.ScaleValue(70),
    marginTop: Platform.OS === "android" ? Matrics.ScaleValue(20) : 0
  },
  textLeft: { textAlign: "left" },
  titleText: {
    fontSize: Matrics.ScaleValue(25),
    paddingLeft: Matrics.ScaleValue(25),
    fontFamily: Fonts.type.OpenSansBold,
    color: Color.black
  },
  viewTerms: {
    justifyContent: "center",
    paddingTop: Matrics.ScaleValue(25),
    paddingHorizontal: Matrics.ScaleValue(25)
  },
  textTerms: { fontSize: Matrics.ScaleValue(15), color: Color.black },
  customStyles1: {
    justifyContent: "center",
    height: Matrics.ScaleValue(45),
    width: Matrics.screenWidth - Matrics.ScaleValue(45),
    borderRadius: Matrics.ScaleValue(5),
    shadowColor: Color.black,
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  customStyles2: {
    borderWidth: 1
  }
});
module.exports = styles;
