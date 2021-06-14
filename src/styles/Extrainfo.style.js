import { Dimensions } from "react-native"
import { Matrics, Fonts, Color } from "../common/styles"
import fonts from "../../assets/fonts"

const { width, height } = Dimensions.get("window")

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },

  labelTop: {
    width: Matrics.screenWidth - 30,
    height: 44,
    backgroundColor: "#E4E4E4",
    marginTop: (height * 2) / 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7
  },

  labTopText: {
    fontSize: 15,
    fontWeight: "200",

    color: "#090909"
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
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: (height * 1.2) / 100,
    // marginLeft: Matrics.ScaleValue(-10)
  },
  furnishingViewTab: {
    width: (Matrics.screenWidth - Matrics.ScaleValue(80)) / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  furnishingViewTabLabel: {
    fontSize: Matrics.ScaleValue(15),
    color: Color.black,
    fontFamily: fonts.type.OpenSans,
    flex: 3,
  },

  descriptInput: {
    width: Matrics.screenWidth - 30,
    height: 187,
    borderColor: "#B1B1B1",
    borderWidth: 1,
    borderRadius: 2,
    marginTop: (height * 1.8) / 100
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
    width: 122,
    height: 25.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  formBack: {
    height: 38,
    borderColor: "black",
    borderRadius: 7,
    borderWidth: 1,
    width: 56.81,
    justifyContent: "center",
    alignItems: "center"
  },
  nextButton: {
    height: 38.16,
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
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    color: "#000"
  },
  checkboxSelected: {
    borderRadius: 50,
    backgroundColor: "#fff",
    borderColor: "#00D598",
  },
  checkboxUnSelected: {
    borderRadius: 50,
    backgroundColor: "#fff",
    borderColor: "#E4E4E4",
  }
}
