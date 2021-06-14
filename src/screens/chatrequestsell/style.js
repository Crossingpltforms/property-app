import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default {
  header: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  bottomButton: {
    flex: 1,
    width: width,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 25,
    marginTop: 15,
    position: "absolute",
    bottom: 0
  },
  styleViewShadow: {
    justifyContent: "center",
    backgroundColor: "#FFE100",
    height: 42,
    width: "90%",
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  bottomButtonText: {
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    color: "#000"
  },
  textViewMiddle: {
    width: width * 0.9,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  middleText: {
    fontSize: 18,
    color: "black"
  },
  middleTextPara: {
    fontSize: 14,
    color: "black"
  },
  middleBottomText: {
    fontSize: 21,
    color: "#4485ED",
    marginTop: height * 0.03
  },
  horizontalLine: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "black",
    marginTop: height * 0.03
  },
  mobileTextFileLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: height * 0.03,
    color: "black"
  },
  textInput: {
    width: 165,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#888888",
    fontSize: 14,
    color: "#888888",
    marginTop: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  }
};
