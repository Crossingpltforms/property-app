import { Dimensions } from "react-native";
import { Matrics, Fonts, Color } from "../../common/styles";

const { width, height } = Dimensions.get("window");

export default {
  root: {    
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",    
  },

  labelTop: {
    width: Matrics.screenWidth - 30,
    height: Matrics.ScaleValue(44),
    // backgroundColor: "#E4E4E4",
    marginTop: (height * 2) / 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Matrics.ScaleValue(7)
  },

  labTopText: {
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSans,
    // color: "#090909"
    color: "red"
  },
  furnishingLabel: {
    marginLeft: Matrics.ScaleValue(15),
    color: Color.black,
    marginTop: height * 0.025,
    alignSelf: "flex-start",
    fontFamily: Fonts.type.OpenSansBold,
    fontSize: Matrics.ScaleValue(20)
  },

  furnishingView: {
    width: Matrics.screenWidth - 30,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: (height * 1.5) / 100
  },
  furnishingViewList: {
    width: Matrics.screenWidth - 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: (height * 1.2) / 100,
    marginLeft: Matrics.ScaleValue(-10)
  },
  furnishingViewTab: {
    width: (Matrics.screenWidth - Matrics.ScaleValue(80)) / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  furnishingBumiLotTab: {
    width: (Matrics.screenWidth - Matrics.ScaleValue(80)),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  furnishingViewTabLabel: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.black,
    fontFamily: Fonts.type.OpenSans
  },

  descriptInput: {
    width: Matrics.screenWidth - 30,
    height: 187,
    borderColor: "#B1B1B1",
    borderWidth: 1,
    borderRadius: 2,
    marginTop: (height * 1.8) / 100,
    textAlignVertical: "top",
    padding: 5
  },
  extraField: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: (height * 1.8) / 100,
    height: Matrics.ScaleValue(50),    
  },
  form: {
    width: Matrics.screenWidth - 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: (height * 1.8) / 100
  },
  formLabel: {
    color: "black",
    fontWeight: "bold"
  },
  formInput: {
    width: Matrics.ScaleValue(122),
    height: Matrics.ScaleValue(25),
    borderRadius: Matrics.ScaleValue(6),
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  formBack: {
    height: Matrics.ScaleValue(38),
    borderColor: "black",
    borderRadius: Matrics.ScaleValue(7),
    borderWidth: 1,
    width: Matrics.ScaleValue(56),
    justifyContent: "center",
    alignItems: "center"
  },
  nextButton: {
    height: Matrics.ScaleValue(40),
    borderColor: "#FFDF00",
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: "#FFDF00",
    alignItems: "center",
    width: width * 0.65,
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 }
  },
  nextButtonText: {
    fontSize: Matrics.ScaleValue(15),
    textAlign: "center",
    color: Color.black,
    fontFamily: Fonts.type.OpenSansBold
  },
  checkboxSelected: {
    borderRadius: Matrics.ScaleValue(50),
    backgroundColor: "#00D598",
    borderColor: "#00D598"
  },
  checkboxUnSelected: {
    borderRadius: Matrics.ScaleValue(50),
    backgroundColor: "#E4E4E4",
    borderColor: "#E4E4E4"
  },
  customText: (fontSize, color, fontWeight) => ({
    fontSize,
    color,
    fontWeight
  }),
  progressRoot: {
    width: "90%",
    height: 30,
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDE63E"
  },
  progressView1: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
};
