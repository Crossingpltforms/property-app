import { Dimensions } from "react-native";
import { Matrics } from "../../../common/styles";

const { width } = Dimensions.get("window");

export default {
  mainContainer: {
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    width: width,
    // height: height,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    backgroundColor: "white",
    marginHorizontal: Matrics.ScaleValue(20),
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
    height: "100%"
  },
  closeHeader: {
    height: Matrics.ScaleValue(50),
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20
  },
  headerText: {
    width: "90%",
    alignContent: "center",
    color: "black",
    fontFamily: "OpenSans-SemiBold",
    fontSize: Matrics.ScaleValue(17),
    marginHorizontal: Matrics.ScaleValue(25),
    textAlign: "center"
  },
  modalImageView: {
    width: Matrics.ScaleValue(160),
    height: Matrics.ScaleValue(160)
  },
  selectDateTextStyle: {
    fontFamily: "OpenSans-Light",
    fontSize: Matrics.ScaleValue(12)
  },
  selectedTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(16),
    color: "black",
    marginLeft: Matrics.ScaleValue(16),
    alignSelf: "flex-start"
  },
  selectedButtonStyle: {
    height: Matrics.ScaleValue(40),
    backgroundColor: "#FFE100",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Matrics.ScaleValue(15)
  },
  selectedButtonTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(15),
    color: "black",
    fontWeight: "500"
  },
  unSelectedTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: Matrics.ScaleValue(15),
    color: "gray",
    paddingLeft: Matrics.ScaleValue(10),
    flex: 1
  },
  dropDownContainerStyle: {
    flexDirection: "row",
    //margin: Matrics.ScaleValue(10),
    alignItems: "center",
    justifyContent: "center"
  },
  dropDownViewStyle: {
    flexDirection: "row",
    height: Matrics.ScaleValue(40),
    width: "73%",
    marginLeft: Matrics.ScaleValue(15),
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
    paddingHorizontal: Matrics.ScaleValue(10)
  },
  dummy: {
    flexDirection: "row",
    height: Matrics.ScaleValue(40),
    width: "73%",
    marginLeft: Matrics.ScaleValue(15),
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: Matrics.ScaleValue(10)
  },
  dropDownTextStyle: {
    flex: 1
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
    borderRadius: Matrics.ScaleValue(10)
  },
  LoaderText: {
    color: "black",
    textAlign: "center"
  },
  timeSelectionView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  timeSelectionViewSelected: {},
  timeBorderStyle: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(35),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "grey",
    margin: Matrics.ScaleValue(8)
  },
  timeBorderStyleSelected: {
    width: Matrics.ScaleValue(80),
    height: Matrics.ScaleValue(35),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFE100",
    margin: Matrics.ScaleValue(8)
  },
  timeText: {
    color: "grey",
    textAlign: "center"
  },
  timeTextSelected: {
    color: "#FFE100",
    textAlign: "center"
  },
  flatListStyle: {
    // width: "80%",
    alignSelf: "center"
  }
};
