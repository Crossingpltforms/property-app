import { Dimensions } from "react-native";
import { Matrics } from "../../common/styles";

const { width, height } = Dimensions.get("window");

const flexForm1 = {
  justifyContent: "center",
  alignItems: "center"
};

export default {
  root: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  view1: {
    marginTop: height * 0.02,
    width: width * 85,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  view2: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: height * 0.02
  },
  view3: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  view4: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  text1: {
    fontSize: 15,
    fontWeight: "600",
    color: "black"
  },
  text2: {
    fontSize: 15,
    fontWeight: "400",
    color: "#3F3F3F",
    marginTop: height * 0.02
  },
  text3: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#727272"
  },
  icons: {
    marginBottom: 2
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.02
  },
  button1: {
    backgroundColor: "#FFE100",
    width: 78,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 50
  },
  photoGallery: {
    width: width * 0.92,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: height * 0.02,
    marginLeft: width * 0.02
  },
  photoBorder: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 5,
    borderColor: "#7D7D7D",
    borderWidth: 2,
    borderStyle: "dotted",
    ...flexForm1,
    marginTop: height * 0.01,
    marginRight: height * 0.01
  },
  photoSelectedBorder: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 5,
    borderColor: "#7D7D7D",
    borderWidth: 2,
    ...flexForm1,
    // marginTop: height * 0.01,
    marginRight: height * 0.01,
    transform: [{ rotate: "0deg" }]
  },
  iconView: {
    height: 48,
    width: 48,
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50
  },
  button2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE100",
    height: 42,
    width: "85%",
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.12,
    elevation: 6,
    shadowOffset: { width: 5, height: 5 },
    marginTop: height * 0.02,
    marginBottom: height * 0.03
  },
  coverSelectedTextWrapper: {
    width: (width - Matrics.ScaleValue(20)) / 3.35,
    height: Matrics.ScaleValue(25),
    backgroundColor: "#4885ED",
    borderRadius: 3,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#4885ED",
    justifyContent: "center"
  },
  coverNormalTextWrapper: {
    width: (width - Matrics.ScaleValue(20)) / 3.35,
    height: Matrics.ScaleValue(25),
    backgroundColor: "#efefef",
    borderRadius: 3,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#efefef",
    justifyContent: "center"
  },
  coverSelectedTextWrapper: { // TODO which to use?
    width: (width - Matrics.ScaleValue(20)) / 3.35,
    height: Matrics.ScaleValue(25),
    backgroundColor: "#4885ED",
    borderRadius: 3,
    borderWidth: 1,
    marginTop: 5,
    borderColor: "#4885ED",
    justifyContent: "center"
  },
  coverNormalTextStyle: {
    color: "black",
    textAlign: "center"
  },
  coverSelectedTextStyle: {
    color: "white",
    textAlign: "center"
  },
  uplaodPhotoLoaderContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1
  },
  uplaodPhotoLoaderWrapper: {
    width: "40%",
    height: "15%",
    backgroundColor: "#FFE100",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10
  },
  uplaodPhotoLoaderText: {
    color: "black",
    textAlign: "center"
  },
  rotateView: {
    width: (width - Matrics.ScaleValue(20)) / 3.35,
    height: Matrics.ScaleValue(35),
    backgroundColor: "#008BE6",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    flexDirection: "row",
    marginTop: height * 0.01,
    marginBottom: -6
  },
  rotateIconView: {
    width: (width - Matrics.ScaleValue(20)) / 3.4 / 2,
    height: Matrics.ScaleValue(35),
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10
  },
  progressRoot: {
    width: "90%",
    height: 30,
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  progressDiv: (width, height, backgroundColor) => ({
    width,
    height,
    backgroundColor
  }),
  progressTextView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  progressText: (fontSize, color, fontWeight) => ({
    fontSize,
    color,
    fontWeight
  }),
};
