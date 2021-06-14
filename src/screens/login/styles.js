import { Color, Matrics } from "../../common/styles";
export default (styles = {
  header: {
    flex: 1,
    backgroundColor: Color.primary
  },
  headerview: {
    flexDirection: "row",
    justifyContent: "center"
  },
  imageBgView: { justifyContent: "center" },
  bgImageStyle: {
    justifyContent: "center",
  },
  titleMainView: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: Matrics.ScaleValue(25)
  },
  welcomeText: {
    fontSize: Matrics.ScaleValue(22),
    color: "#000",
    fontFamily: "OpenSans-SemiBold"
  },
  viewLoginOptions: {
    justifyContent: "center",
    paddingTop: 30,
    alignItems: "center"
  },
  viewBytap: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
    width: Matrics.screenWidth - Matrics.ScaleValue(50),
    alignSelf: "center"
  },
  bytapText: {
    fontSize: Matrics.ScaleValue(11),
    textAlign: "center",
    fontFamily: "OpenSans-Regular",
    color: "#000"
  },
  safeView: {
    flex: 1
  },
  btn2Styles: {
    backgroundColor: Color.primary,
    height: Matrics.ScaleValue(45),
    borderWidth: 1,
    borderRadius: Matrics.ScaleValue(5),
    marginTop: Matrics.ScaleValue(10)
  },
});
module.exports = styles;
