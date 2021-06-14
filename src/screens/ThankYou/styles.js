import { StyleSheet, Dimensions } from "react-native"
import { Matrics, Fonts, Color } from "../../common/styles"
const { width } = Dimensions.get('window')

const layout1 = {
  justifyContent: "center",
  alignItems: "center"
}

const buttonStyle1 = bgcolor => ({
  height: 40,
  borderRadius: 6,
  backgroundColor: bgcolor,
  ...layout1
})

export const styles = StyleSheet.create({
  TextStyleHeaderTag: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    marginTop: 5,
    paddingLeft: 10,
    color: "black"
  },
  TextStyleBodyTag: {
    fontSize: 18,
    fontFamily: "OpenSans-Light",
    marginTop: 5,
    paddingLeft: 10,
    color: "#2f2f2f",
    textAlign: "center"
  },
  postButton: buttonStyle1("#FFE100"),
  text1: {
    color: Color.white,
    fontSize: Matrics.ScaleValue(15),
    fontFamily: Fonts.type.OpenSansBold
  },
  webViewStyle: {
    height: 200,
    width: width - 30,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 40
  },
  secondViewWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  ratingMainView: {
    width: "84%",
    height: 60,
    marginTop: 20
  },
  ratingTextView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  poorText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#4485ED"
  },
  excellentText: {
    fontSize: 12,
    color: "#4485ED"
  },
  ratingNumView: {
    flexDirection: "row",
    marginTop: 8
  },
  skipStyle: {
    height: 48,
    borderRadius: 5,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    color: "#606060"
  },
  submitButtonStyle: {
    height: 48,
    borderRadius: 5,
    borderColor: "#d3d3d3",
    width: 120,
    borderWidth: 1,
    backgroundColor: "#2C76EC",
    alignItems: "center",
    justifyContent: "center"
  },
  submitTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500"
  }
})
